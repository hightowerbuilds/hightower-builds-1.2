import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import './roofing-magazine.css'

export const Route = createFileRoute('/roofing-magazine/')({
  component: RoofingMagazinePage,
})

function RoofingMagazinePage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="roofing-content">
          <h1 className="page-title">Roofing Magazine</h1>
          <p className="page-description">Your source for roofing industry news, trends, and insights.</p>
        </div>
      </main>
    </div>
  )
} 