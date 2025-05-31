import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'white'
    }}>
      <h1 style={{ 
        fontFamily: 'Courier New, Consolas, Monaco, monospace',
        color: 'black',
        fontSize: '2rem',
        margin: 0
      }}>
        Welcome to Hightower Builds
      </h1>
    </div>
  )
}
