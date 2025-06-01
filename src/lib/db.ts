import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export interface Transaction {
  id: number
  transaction_date: Date
  amount: number
  description: string
  location: string
  transaction_type: 'expenditure' | 'deposit' | 'uncertain'
  category: string | null
  created_at: Date
}

export interface BankStatement {
  id: number
  date_range: {
    start: Date
    end: Date
  }
  total_expenditures: number
  total_deposits: number
  transaction_count: number
}

// Test the connection
export async function testConnection() {
  try {
    const { data: _data, error } = await supabase.from('financial_transactions').select('count').limit(1)
    if (error) throw error
    console.log('Database connection successful!')
    return true
  } catch (err) {
    console.error('Database connection test failed:', err)
    return false
  }
}

// Run the connection test
testConnection()

export const db = {
  // Get all bank statements (grouped by date ranges)
  async getBankStatements(): Promise<BankStatement[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .order('transaction_date', { ascending: false })

    if (error) throw error

    // Group transactions by month
    const statements = new Map<string, BankStatement>()
    
    data.forEach(transaction => {
      const date = new Date(transaction.transaction_date)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      if (!statements.has(monthKey)) {
        statements.set(monthKey, {
          id: parseInt(monthKey.replace('-', '')),
          date_range: {
            start: new Date(date.getFullYear(), date.getMonth(), 1),
            end: new Date(date.getFullYear(), date.getMonth() + 1, 0)
          },
          total_expenditures: 0,
          total_deposits: 0,
          transaction_count: 0
        })
      }

      const statement = statements.get(monthKey)!
      statement.transaction_count++
      
      if (transaction.transaction_type === 'expenditure') {
        statement.total_expenditures += transaction.amount
      } else if (transaction.transaction_type === 'deposit') {
        statement.total_deposits += transaction.amount
      }
    })

    return Array.from(statements.values())
  },

  // Get transactions for a specific date range
  async getTransactions(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .gte('transaction_date', startDate.toISOString())
      .lte('transaction_date', endDate.toISOString())
      .order('transaction_date', { ascending: false })

    if (error) throw error

    return data.map(transaction => ({
      ...transaction,
      transaction_date: new Date(transaction.transaction_date),
      created_at: new Date(transaction.created_at)
    }))
  }
} 