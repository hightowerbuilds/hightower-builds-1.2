import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
  if (!supabaseKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
  throw new Error(`Missing required Supabase environment variables: ${missingVars.join(', ')}. Please add these to your deployment environment variables.`)
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
  running_balance?: number  // Optional field for balance tracking
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
  starting_balance: number
  ending_balance: number
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
      .order('transaction_date', { ascending: true })  // Get in chronological order for balance calculation

    if (error) throw error

    // Calculate balances
    const startingBalance = 1000 // Initial balance
    let runningBalance = startingBalance

    // Calculate running balance for each transaction
    data.forEach(transaction => {
      if (transaction.transaction_type === 'expenditure') {
        runningBalance -= transaction.amount
      } else if (transaction.transaction_type === 'deposit') {
        runningBalance += transaction.amount
      }
    })

    const endingBalance = runningBalance

    // Create a single statement for all transactions
    const statement: BankStatement = {
      id: 1,
      date_range: {
        start: data.length > 0 
          ? new Date(Math.min(...data.map(t => new Date(t.transaction_date).getTime())))
          : new Date(),
        end: data.length > 0 
          ? new Date(Math.max(...data.map(t => new Date(t.transaction_date).getTime())))
          : new Date()
      },
      total_expenditures: data.filter(t => t.transaction_type === 'expenditure')
        .reduce((sum, t) => sum + t.amount, 0),
      total_deposits: data.filter(t => t.transaction_type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0),
      transaction_count: data.length,
      starting_balance: startingBalance,
      ending_balance: endingBalance
    }

    return [statement]
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
  },

  // Get transactions with running balance for a specific date range
  async getTransactionsWithBalance(startDate: Date, endDate: Date, initialBalance: number = 1000): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .gte('transaction_date', startDate.toISOString())
      .lte('transaction_date', endDate.toISOString())
      .order('transaction_date', { ascending: true })  // Get transactions in chronological order

    if (error) throw error

    let runningBalance = initialBalance
    const transactionsWithBalance = data.map(transaction => {
      // Calculate new balance based on transaction type
      if (transaction.transaction_type === 'expenditure') {
        runningBalance -= transaction.amount
      } else if (transaction.transaction_type === 'deposit') {
        runningBalance += transaction.amount
      }

      return {
        ...transaction,
        transaction_date: new Date(transaction.transaction_date),
        created_at: new Date(transaction.created_at),
        running_balance: runningBalance
      }
    })

    return transactionsWithBalance  // Return in chronological order (earliest first)
  }
} 