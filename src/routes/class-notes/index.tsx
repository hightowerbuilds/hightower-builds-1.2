import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import './class-notes.css'

export const Route = createFileRoute('/class-notes/')({
  component: ClassNotes,
})

function ClassNotes() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="class-notes-content">
          <header>
            <h1 className="page-title">Class Notes</h1>
            <p className="page-description">
              A collection of notes and resources from various classes and learning materials.
            </p>
          </header>

          <div className="notes-grid">
            <div className="note-card">
              <h2 className="note-title">Web Development Fundamentals</h2>
              <div className="note-date">March 15, 2024</div>
              <div className="note-content">
                <p>Key concepts covered in today's session:</p>
                <ul>
                  <li>React component lifecycle</li>
                  <li>State management with hooks</li>
                  <li>Routing with TanStack Router</li>
                </ul>
              </div>
            </div>

            <div className="note-card">
              <h2 className="note-title">TypeScript Best Practices</h2>
              <div className="note-date">March 14, 2024</div>
              <div className="note-content">
                <p>Important TypeScript patterns and practices:</p>
                <ul>
                  <li>Type inference and explicit typing</li>
                  <li>Interface vs Type aliases</li>
                  <li>Generic types and constraints</li>
                </ul>
              </div>
            </div>

            <div className="note-card">
              <h2 className="note-title">CSS Architecture</h2>
              <div className="note-date">March 13, 2024</div>
              <div className="note-content">
                <p>Modern CSS approaches and methodologies:</p>
                <ul>
                  <li>CSS Variables and custom properties</li>
                  <li>CSS Grid and Flexbox layouts</li>
                  <li>Responsive design patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 