import { useState, useEffect } from 'react'
import type { BankStatement, Transaction } from '../../lib/db'
import { db } from '../../lib/db'
import { TransactionModal } from '../TransactionModal/TransactionModal'
import './BankStatements.css'

export function BankStatements() {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatement, setSelectedStatement] = useState<BankStatement | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadStatements()
  }, [])

  const loadStatements = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.getBankStatements()
      setStatements(data)
    } catch (err) {
      setError('Failed to load bank statements')
      console.error('Error loading bank statements:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatementClick = async (statement: BankStatement) => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.getTransactions(statement.date_range.start, statement.date_range.end)
      setTransactions(data)
      setSelectedStatement(statement)
      setIsModalOpen(true)
    } catch (err) {
      setError('Failed to load transactions')
      console.error('Error loading transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => 
    date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })

  const formatAmount = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount)

  if (loading && statements.length === 0) {
    return (
      <div className="bank-statements-loading">
        <span className="loading"></span>
        Loading bank statements...
      </div>
    )
  }

  if (error && statements.length === 0) {
    return (
      <div className="bank-statements-error">
        {error}
        <button onClick={loadStatements} className="btn-retry">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bank-statements">
      <h2>Bank Statements</h2>
      
      <div className="statements-grid">
        {statements.map(statement => (
          <div 
            key={statement.id}
            className="statement-card"
            onClick={() => handleStatementClick(statement)}
          >
            <div className="statement-header">
              <h3>{formatDate(statement.date_range.start)}</h3>
              <span className="transaction-count">
                {statement.transaction_count} transactions
              </span>
            </div>
            
            <div className="statement-summary">
              <div className="summary-item">
                <span>Expenditures</span>
                <span className="expenditure">
                  {formatAmount(statement.total_expenditures)}
                </span>
              </div>
              <div className="summary-item">
                <span>Deposits</span>
                <span className="deposit">
                  {formatAmount(statement.total_deposits)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStatement && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transactions={transactions}
          dateRange={selectedStatement.date_range}
        />
      )}
    </div>
  )
} 