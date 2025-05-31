import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
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
          <h1 className="page-title">Money Modes</h1>
          <p className="page-description">Explore our financial publications and insights.</p>
        </div>
      </main>
    </div>
  )
} 