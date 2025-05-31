import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import './brontosaurus.css'

export const Route = createFileRoute('/brontosaurus/')({
  component: BrontosaurusPage,
})

function BrontosaurusPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="brontosaurus-content">
          <h1 className="page-title">Brontosaurus Publications</h1>
          <p className="page-description">Discover our collection of publications and literary works.</p>
        </div>
      </main>
    </div>
  )
} 