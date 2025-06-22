import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { Canvas, useThree } from '@react-three/fiber'
import { Stars, OrbitControls, Text } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'
import './life-notes.css'

export const Route = createFileRoute('/life-notes/')({
  component: LifeNotesPage,
})

interface Note {
  id: string
  day: string
  content: string
}

function DayText({ day, position, notes, onDayClick }: { 
  day: string; 
  position: [number, number, number]; 
  notes: Note[];
  onDayClick: (day: string) => void;
}) {
  const textRef = useRef<Mesh>(null)
  const notesRefs = useRef<(Mesh | null)[]>([])
  const { camera } = useThree()
  const dayNotes = notes.filter(note => note.day === day)

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
    // Make all notes text face the camera
    notesRefs.current.forEach(ref => {
      if (ref) {
        ref.lookAt(camera.position)
      }
    })
  })

  return (
    <group position={position}>
      <Text
        ref={textRef}
        position={[0, 0, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onClick={() => onDayClick(day)}
      >
        {day}
      </Text>
      
      {/* Display notes for this day */}
      {dayNotes.map((note, index) => (
        <Text
          key={note.id}
          ref={(el: any) => notesRefs.current[index] = el}
          position={[0, -0.4 - (index * 0.15), 0]}
          fontSize={0.08}
          color="#87CEEB"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {note.content}
        </Text>
      ))}
    </group>
  )
}

function PlanetScene({ textRotationDirection, notes, onDayClick, isTextPaused }: { 
  textRotationDirection: number; 
  notes: Note[];
  onDayClick: (day: string) => void;
  isTextPaused: boolean;
}) {
  const planetRef = useRef<Mesh>(null)
  const textRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)

  // June 2025 Calendar - Sunday = 0, Monday = 1, etc.
  // June 1, 2025 is a Sunday
  const june2025Calendar = [
    { day: '1', dow: 'sun' }, { day: '2', dow: 'mon' }, { day: '3', dow: 'tue' },
    { day: '4', dow: 'wed' }, { day: '5', dow: 'thu' }, { day: '6', dow: 'fri' },
    { day: '7', dow: 'sat' }, { day: '8', dow: 'sun' }, { day: '9', dow: 'mon' },
    { day: '10', dow: 'tue' }, { day: '11', dow: 'wed' }, { day: '12', dow: 'thu' },
    { day: '13', dow: 'fri' }, { day: '14', dow: 'sat' }, { day: '15', dow: 'sun' },
    { day: '16', dow: 'mon' }, { day: '17', dow: 'tue' }, { day: '18', dow: 'wed' },
    { day: '19', dow: 'thu' }, { day: '20', dow: 'fri' }, { day: '21', dow: 'sat' },
    { day: '22', dow: 'sun' }, { day: '23', dow: 'mon' }, { day: '24', dow: 'tue' },
    { day: '25', dow: 'wed' }, { day: '26', dow: 'thu' }, { day: '27', dow: 'fri' },
    { day: '28', dow: 'sat' }, { day: '29', dow: 'sun' }, { day: '30', dow: 'mon' }
  ]

  // Gradient shader material
  const gradientMaterial = new ShaderMaterial({
    uniforms: {
      lightBlue: { value: [0.3, 0.5, 0.8] }, // Darker light blue
      darkBlue: { value: [0.0, 0.0, 0.5] }   // Dark blue
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 lightBlue;
      uniform vec3 darkBlue;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Create gradient based on Y position (top to bottom)
        float t = (vPosition.y + 1.0) * 0.5; // Normalize to 0-1
        vec3 color = mix(darkBlue, lightBlue, t);
        
        // Add some variation based on normal for more realistic look
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        color = mix(color, lightBlue, fresnel * 0.2); // Reduced fresnel intensity
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  })

  useFrame((_state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.3
    }
    if (textRef.current && !isTextPaused) {
      textRef.current.rotation.y += delta * 0.2 * textRotationDirection
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15
    }
  })

  return (
    <>
      {/* Blue Planet with Gradient */}
      <mesh ref={planetRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <primitive object={gradientMaterial} attach="material" />
      </mesh>
      
      {/* Days of June 2025 - Rotating around planet */}
      <group ref={textRef} position={[0, 0, 0]}>
        {june2025Calendar.map((dateObj, index) => {
          const angle = (index / june2025Calendar.length) * Math.PI * 2
          const x = Math.cos(angle) * 4.5
          const z = Math.sin(angle) * 4.5
          
          return (
            <DayText
              key={dateObj.day}
              day={`${dateObj.day} ${dateObj.dow}`}
              position={[x, 0, z]}
              notes={notes}
              onDayClick={onDayClick}
            />
          )
        })}
      </group>
      
      {/* Very Thin Neon Blue Torus - Further out than text */}
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.01, 16, 32]} />
        <meshStandardMaterial color="#00ffff" side={2} transparent opacity={0.3} />
      </mesh>
      
      {/* Inner Thin Light Blue Torus */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5.8, 0.01, 16, 32]} />
        <meshStandardMaterial color="#87CEEB" side={2} transparent opacity={0.3} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} />
      
      {/* Orbit Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={15}
        autoRotate={false}
      />
    </>
  )
}

function LifeNotesPage() {
  const [textRotationDirection, setTextRotationDirection] = useState(1)
  const [isTextPaused, setIsTextPaused] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [selectedDay, setSelectedDay] = useState('1 SUN')
  const [showInput, setShowInput] = useState(false)

  // June 2025 Calendar - Sunday = 0, Monday = 1, etc.
  // June 1, 2025 is a Sunday
  const june2025Calendar = [
    { day: '1', dow: 'sun' }, { day: '2', dow: 'mon' }, { day: '3', dow: 'tue' },
    { day: '4', dow: 'wed' }, { day: '5', dow: 'thu' }, { day: '6', dow: 'fri' },
    { day: '7', dow: 'sat' }, { day: '8', dow: 'sun' }, { day: '9', dow: 'mon' },
    { day: '10', dow: 'tue' }, { day: '11', dow: 'wed' }, { day: '12', dow: 'thu' },
    { day: '13', dow: 'fri' }, { day: '14', dow: 'sat' }, { day: '15', dow: 'sun' },
    { day: '16', dow: 'mon' }, { day: '17', dow: 'tue' }, { day: '18', dow: 'wed' },
    { day: '19', dow: 'thu' }, { day: '20', dow: 'fri' }, { day: '21', dow: 'sat' },
    { day: '22', dow: 'sun' }, { day: '23', dow: 'mon' }, { day: '24', dow: 'tue' },
    { day: '25', dow: 'wed' }, { day: '26', dow: 'thu' }, { day: '27', dow: 'fri' },
    { day: '28', dow: 'sat' }, { day: '29', dow: 'sun' }, { day: '30', dow: 'mon' }
  ]

  const toggleTextRotation = () => {
    console.log('Button clicked! Current text direction:', textRotationDirection)
    setTextRotationDirection(prev => {
      const newDirection = prev === 1 ? -1 : 1
      console.log('New text direction:', newDirection)
      return newDirection
    })
  }

  const toggleTextPause = () => {
    console.log('Pause button clicked! Current pause state:', isTextPaused)
    setIsTextPaused(prev => !prev)
  }

  const handleDayClick = (day: string) => {
    setSelectedDay(day)
    setShowInput(true)
    setNewNote('')
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (newNote.trim()) {
      const newNoteObj: Note = {
        id: Date.now().toString(),
        day: selectedDay,
        content: newNote.trim()
      }
      setNotes(prev => [...prev, newNoteObj])
      setNewNote('')
      setShowInput(false)
    }
  }

  const handleCancel = () => {
    setShowInput(false)
    setNewNote('')
  }

  console.log('Current text rotation direction:', textRotationDirection)

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
          <h1 className="notes-title-3d">NOTES THAT FLOAT</h1>
          <h1 className="date-title-3d">JUNE 2025</h1>
          
          {/* Text Rotation Toggle Button */}
          <button 
            onClick={toggleTextRotation}
            className="rotation-toggle-btn"
          >
            {textRotationDirection === 1 ? '>' : '<'}
          </button>

          {/* Text Stop Button */}
          <button 
            onClick={toggleTextPause}
            className="rotation-stop-btn"
          >
            {isTextPaused ? 'go' : 'stop'}
          </button>

          {/* Add Info Section - Only show when a day is clicked */}
          {showInput && (
            <div className="add-info-section">
              <form onSubmit={handleAddNote} className="add-info-form">
                <div className="input-container">
                  <div className="day-select-container">
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="day-select"
                    >
                      {june2025Calendar.map(dateObj => (
                        <option key={dateObj.day} value={`${dateObj.day} ${dateObj.dow}`}>{`${dateObj.day} ${dateObj.dow}`}</option>
                      ))}
                    </select>
                  </div>
                  
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter information"
                    className="note-input"
                    autoFocus
                  />
                  
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                  
                  <button type="button" onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Planet Scene Canvas */}
          <div className="planet-scene-container">
            <Canvas camera={{ position: [0, 2, 15], fov: 60 }}>
              <PlanetScene 
                textRotationDirection={textRotationDirection} 
                notes={notes} 
                onDayClick={handleDayClick}
                isTextPaused={isTextPaused}
              />
            </Canvas>
          </div>
        </div>
      </main>
    </div>
  )
} 