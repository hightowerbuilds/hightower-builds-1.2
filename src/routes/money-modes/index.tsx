import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { BankStatements } from '../../components/BankStatements/BankStatements'
import './money-modes.css'

export const Route = createFileRoute('/money-modes/')({
  component: MoneyModesPage,
})

function MoneyModesPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="money-modes-content">
          <header>
            <h1 className="page-title">Money Modes</h1>
            <p className="page-description">Track and analyze your financial transactions</p>
          </header>

          <div className="money-modes-actions">
            <Link 
              to="/pdf-extractor" 
              className="extract-statement-btn"
            >
              <span className="icon">📄</span>
              Process New Statement
              <span className="description">Upload and analyze your bank statement</span>
            </Link>
          </div>

          <div className="money-modes-grid">
            <section className="statements-section">
              <h2>Your Statements</h2>
              <BankStatements />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
} 