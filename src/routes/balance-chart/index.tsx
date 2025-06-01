import { createFileRoute, useSearch } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Transaction } from '../../lib/db'
import { db } from '../../lib/db'
import './balance-chart.css'

export const Route = createFileRoute('/balance-chart/')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      statementId: search.statementId as string,
    }
  },
  component: BalanceChartPage,
})

function BalanceChartPage() {
  const { statementId } = useSearch({ from: '/balance-chart/' })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const svgRefs = useRef<(SVGSVGElement | null)[]>([null, null, null])

  useEffect(() => {
    loadTransactions()
  }, [statementId])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading transactions for statement:', statementId)
      const data = await db.getTransactionsByStatementId(statementId)
      console.log('Loaded transactions:', data)
      setTransactions(data)
    } catch (err) {
      console.error('Error loading transactions:', err)
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  // Group transactions by month
  const transactionsByMonth = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.transactionDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(transaction)
    return acc
  }, {} as Record<string, Transaction[]>)

  // Sort months chronologically
  const sortedMonths = Object.keys(transactionsByMonth).sort()

  useEffect(() => {
    if (!transactions.length || !svgRefs.current.some(ref => ref)) {
      console.log('No transactions or SVG refs:', { 
        transactionsLength: transactions.length, 
        hasSvgRefs: svgRefs.current.some(ref => ref) 
      })
      return
    }

    console.log('Creating charts with transactions:', transactions)

    // Clear any existing charts
    svgRefs.current.forEach(ref => {
      if (ref) d3.select(ref).selectAll('*').remove()
    })

    // Set up the chart dimensions
    const margin = { top: 40, right: 30, bottom: 30, left: 60 }
    const width = 800 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    // Create a chart for each month
    sortedMonths.forEach((monthKey, index) => {
      const monthTransactions = transactionsByMonth[monthKey]
      const svgRef = svgRefs.current[index]
      if (!svgRef) return

      // Create the SVG container
      const svg = d3.select(svgRef)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // Sort transactions by date
      const sortedTransactions = [...monthTransactions].sort((a, b) => 
        new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
      )

      // Create scales
      const x = d3.scaleTime()
        .domain([
          new Date(sortedTransactions[0].transactionDate),
          new Date(sortedTransactions[sortedTransactions.length - 1].transactionDate)
        ])
        .range([0, width])

      const y = d3.scaleLinear()
        .domain([
          d3.min(sortedTransactions, d => d.runningBalance || 0) as number,
          d3.max(sortedTransactions, d => d.runningBalance || 0) as number
        ])
        .range([height, 0])
        .nice()

      // Add grid lines
      svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => '')
        )
        .attr('stroke', 'var(--border-color)')
        .attr('stroke-opacity', 0.2)

      // Add X axis with daily ticks
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
          .ticks(d3.timeDay.every(1))
          .tickFormat(d => {
            const date = d as Date
            return date.getDate().toString()
          })
        )
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')

      // Add Y axis with currency formatting
      svg.append('g')
        .call(d3.axisLeft(y)
          .ticks(5)
          .tickFormat(d => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(d as number))
        )

      // Add month label - Fix the month display
      const [year, month] = monthKey.split('-').map(Number)
      const monthDate = new Date(Date.UTC(year, month - 1, 1))
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(monthDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric',
          timeZone: 'UTC'  // Use UTC to avoid timezone issues
        }))

      // Add the line
      const line = d3.line<Transaction>()
        .x(d => x(new Date(d.transactionDate)))
        .y(d => y(d.runningBalance || 0))
        .curve(d3.curveMonotoneX)

      // Add area under the line
      const area = d3.area<Transaction>()
        .x(d => x(new Date(d.transactionDate)))
        .y0(height)
        .y1(d => y(d.runningBalance || 0))
        .curve(d3.curveMonotoneX)

      svg.append('path')
        .datum(sortedTransactions)
        .attr('class', 'area')
        .attr('fill', 'var(--primary-color)')
        .attr('fill-opacity', 0.1)
        .attr('d', area)

      svg.append('path')
        .datum(sortedTransactions)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'var(--primary-color)')
        .attr('stroke-width', 2)
        .attr('d', line)

      // Add dots
      svg.selectAll<SVGCircleElement, Transaction>('circle')
        .data(sortedTransactions)
        .enter()
        .append('circle')
        .attr('cx', d => x(new Date(d.transactionDate)))
        .attr('cy', d => y(d.runningBalance || 0))
        .attr('r', 4)
        .attr('fill', 'var(--primary-color)')
        .attr('stroke', 'var(--background-color)')
        .attr('stroke-width', 2)
        .on('mouseover', function(event: MouseEvent, d) {
          d3.select(this)
            .attr('r', 6)
            .attr('fill', 'var(--primary-color-dark)')

          const tooltip = d3.select('body').append('div')
            .attr('class', 'chart-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background-color', 'var(--background-color)')
            .style('border', '1px solid var(--border-color)')
            .style('border-radius', '4px')
            .style('padding', '8px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('color', 'var(--text-color)')

          tooltip.transition()
            .duration(200)
            .style('opacity', 1)

          tooltip.html(`
            <div>Date: ${new Date(d.transactionDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</div>
            <div>Balance: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(d.runningBalance || 0)}</div>
          `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px')
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('r', 4)
            .attr('fill', 'var(--primary-color)')

          d3.selectAll('.chart-tooltip').remove()
        })
    })

  }, [transactions])

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="main-content">
          <div className="balance-chart-content">
            <div className="loading">Loading chart data...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="main-content">
          <div className="balance-chart-content">
            <div className="error">
              {error}
              <button onClick={loadTransactions} className="btn-retry">
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="balance-chart-content">
          <header>
            <h1 className="page-title">Balance Charts</h1>
            <p className="page-description">Monthly breakdown of your account balance</p>
          </header>

          <div className="charts-container">
            {sortedMonths.map((monthKey, index) => (
              <div key={monthKey} className="chart-wrapper">
                <svg ref={(el: SVGSVGElement | null) => {
                  svgRefs.current[index] = el
                }}></svg>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 