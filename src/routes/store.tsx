import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'

export const Route = createFileRoute('/store')({
  component: StorePage,
})

function StorePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-4">
        <h1 className="text-4xl font-bold mb-4">Clothing & Photography Store</h1>
        <p className="text-lg">Browse our collection of clothing and photography products.</p>
      </main>
    </div>
  )
} 