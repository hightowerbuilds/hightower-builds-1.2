import { Link } from '@tanstack/react-router'
import './Navbar.css'

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-links">
          <Link
            to="/home"
            className="nav-link"
            activeProps={{ className: 'nav-link active' }}
          >
            Home
          </Link>
          <Link
            to="/money-modes"
            className="nav-link"
            activeProps={{ className: 'nav-link active' }}
          >
            Money Modes
          </Link>
          <Link
            to="/store"
            className="nav-link"
            activeProps={{ className: 'nav-link active' }}
          >
            General Store
          </Link>
          <Link
            to="/life-notes"
            className="nav-link"
            activeProps={{ className: 'nav-link active' }}
          >
            Life Notes
          </Link>
        </div>
      </div>
    </nav>
  )
} 