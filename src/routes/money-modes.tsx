import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'

export const Route = createFileRoute('/money-modes')({
  component: MoneyModesPage,
})

function MoneyModesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-4">
        <h1 className="text-4xl font-bold mb-4">Money Modes</h1>
        <p className="text-lg">Explore our financial publications and insights.</p>
      </main>
    </div>
  )
} 