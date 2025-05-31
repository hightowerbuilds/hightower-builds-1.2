import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'

export const Route = createFileRoute('/brontosaurus')({
  component: BrontosaurusPage,
})

function BrontosaurusPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-4">
        <h1 className="text-4xl font-bold mb-4">Brontosaurus Publications</h1>
        <p className="text-lg">Discover our collection of publications and literary works.</p>
      </main>
    </div>
  )
} 