import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div>
          <h1 className="page-title">Welcome to Hightower Builds</h1>
          <p className="page-description">Your one-stop destination for various publications and services.</p>
        </div>
      </main>
    </div>
  )
}
