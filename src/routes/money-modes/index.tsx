import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { BankStatements } from '../../components/BankStatements/BankStatements'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useState } from 'react'
import './money-modes.css'

export const Route = createFileRoute('/money-modes/')({
  component: MoneyModesPage,
})

function MoneyModesPage() {
  const [isModalitiesOpen, setIsModalitiesOpen] = useState(false)

  const toggleModalities = () => {
    setIsModalitiesOpen(!isModalitiesOpen)
  }

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
        <div className="money-modes-content">
          <header>
            <h1 className="page-title">Money Modes</h1>
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
              <BankStatements />
            </section>

            <section className="modalities-section">
              <div className="modalities-header">
                <h2>Modalities</h2>
                <button 
                  onClick={toggleModalities} 
                  className="toggle-button"
                >
                  {isModalitiesOpen ? 'Close' : 'Open'}
                </button>
              </div>
              
              {isModalitiesOpen && (
                <div className="modalities-content">
                  <p>Modalities content will go here...</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
} 