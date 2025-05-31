import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'

export const Route = createFileRoute('/roofing-magazine')({
  component: RoofingMagazinePage,
})

function RoofingMagazinePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-4">
        <h1 className="text-4xl font-bold mb-4">Roofing Magazine</h1>
        <p className="text-lg">Your source for roofing industry news, trends, and insights.</p>
      </main>
    </div>
  )
} 