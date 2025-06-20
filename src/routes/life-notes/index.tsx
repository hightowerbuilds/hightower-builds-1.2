import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import './life-notes.css'

export const Route = createFileRoute('/life-notes/')({
  component: LifeNotesPage,
})

function LifeNotesPage() {
  return (
    <div className="page-container">
      <Navbar />
      <Canvas style={{position: 'fixed', zIndex:0, top: 0, left: 0, width: '100%', height: '100vh'}}>
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
      </Canvas>
      <main className="main-content">
        <div className="life-notes-content">
          <header>
            <h1 className="page-title">Life Notes</h1>
            <p className="page-description">
              A collection of publications, articles, and learning materials.
            </p>
          </header>

          <div className="notes-grid">
          

            <Link to="/roofing-magazine" className="note-card">
              <h2 className="note-title">Roofing Magazine</h2>
              <p className="note-description">
                Your source for roofing industry news, trends, and insights.
              </p>
            </Link>

            <Link to="/class-notes" className="note-card">
              <h2 className="note-title">Class Notes</h2>
              <p className="note-description">
                A collection of notes and resources from various classes and learning materials.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 