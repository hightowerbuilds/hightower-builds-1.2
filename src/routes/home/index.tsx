import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import './home.css'

export const Route = createFileRoute('/home/')({
  component: Home,
})

function Home() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="home-content">
          <h1 className="page-title">Welcome to Hightower Builds</h1>
          <p className="page-description">Your one-stop destination for various publications and services.</p>
        </div>
      </main>
    </div>
  )
} 