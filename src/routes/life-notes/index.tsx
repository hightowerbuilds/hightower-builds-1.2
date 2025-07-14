import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { LifeNotesToolbar } from '../../components/LifeNotesToolbar/LifeNotesToolbar'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text } from '@react-three/drei'
import { useRef, useState, useMemo, useEffect } from 'react'
import { Mesh, ShaderMaterial } from 'three'
import { useAuth } from '../../lib/useAuth'
import { db, type LifeNote } from '../../lib/db'
import './life-notes.css'

export const Route = createFileRoute('/life-notes/')({
  component: LifeNotesPage,
})

interface Note {
  id: string
  day: string
  content: string
}

// Convert LifeNote from database to local Note format
const convertLifeNoteToNote = (lifeNote: LifeNote): Note => ({
  id: lifeNote.id,
  day: lifeNote.day_string,
  content: lifeNote.content
})

// Month color mapping - each month has its own gradient colors
const monthColors = [
  // January - Deep Purple to Light Purple
  { light: [0.8, 0.4, 0.8], dark: [0.4, 0.0, 0.4] },
  // February - Pink to Deep Pink
  { light: [1.0, 0.6, 0.8], dark: [0.6, 0.2, 0.4] },
  // March - Green to Dark Green
  { light: [0.4, 0.8, 0.4], dark: [0.0, 0.4, 0.0] },
  // April - Light Blue to Blue
  { light: [0.6, 0.8, 1.0], dark: [0.2, 0.4, 0.8] },
  // May - Yellow to Orange
  { light: [1.0, 0.8, 0.4], dark: [0.8, 0.4, 0.0] },
  // June - Orange to Red
  { light: [1.0, 0.6, 0.2], dark: [0.8, 0.2, 0.0] },
  // July - Red to Dark Red
  { light: [1.0, 0.4, 0.4], dark: [0.6, 0.0, 0.0] },
  // August - Orange to Brown
  { light: [1.0, 0.5, 0.2], dark: [0.6, 0.3, 0.0] },
  // September - Gold to Brown
  { light: [1.0, 0.8, 0.2], dark: [0.6, 0.4, 0.0] },
  // October - Orange to Dark Orange
  { light: [1.0, 0.6, 0.0], dark: [0.8, 0.3, 0.0] },
  // November - Brown to Dark Brown
  { light: [0.8, 0.6, 0.4], dark: [0.4, 0.2, 0.0] },
  // December - Blue to Dark Blue
  { light: [0.4, 0.6, 1.0], dark: [0.0, 0.2, 0.6] }
]

function DayText({ day, position, notes, onDayClick, selectedDay }: { 
  day: string; 
  position: [number, number, number]; 
  notes: Note[];
  onDayClick: (day: string) => void;
  selectedDay: string;
}) {
  const textRef = useRef<Mesh>(null)
  const notesRefs = useRef<(Mesh | null)[]>([])
  const noteHeights = useRef<number[]>([])
  const { camera } = useThree()
  const dayNotes = notes.filter(note => note.day === day)
  const isSelected = day === selectedDay

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
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Courier.ttf"
        onClick={() => onDayClick(day)}
      >
        {day}
      </Text>
      
      {/* Display notes for this day */}
      {dayNotes.map((note, index) => {
        // Calculate position based on previous note heights
        let yPosition = -0.4
        for (let i = 0; i < index; i++) {
          yPosition -= (noteHeights.current[i] || 0.4) + 0.1 // Add spacing between notes
        }
        
        return (
          <group key={note.id} position={[0, yPosition, 0]}>
            <Text
              ref={(el: any) => notesRefs.current[index] = el}
              position={[0, 0.05, 0]}
              fontSize={0.05}
              color="#87CEEB"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
              font="/fonts/Courier.ttf"
              onSync={(text) => {
                // Calculate text height for positioning
                if (text && isSelected) {
                  const textHeight = text.geometry.boundingBox?.max.y - text.geometry.boundingBox?.min.y || 0.4
                  noteHeights.current[index] = textHeight
                }
              }}
            >
              {index + 1}. {note.content}
            </Text>
            

          </group>
        )
      })}
    </group>
  )
}

function PlanetScene({ textRotationDirection, notes, onDayClick, isTextPaused, selectedDay, calendar, selectedMonth }: { 
  textRotationDirection: number; 
  notes: Note[];
  onDayClick: (day: string) => void;
  isTextPaused: boolean;
  selectedDay: string;
  calendar: { day: string; dow: string }[];
  selectedMonth: number;
}) {
  const planetRef = useRef<Mesh>(null)
  const textRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)

  useFrame((_state, delta) => {
    if (!isTextPaused) {
      // Only move when not paused
      if (planetRef.current) {
        planetRef.current.rotation.y += delta * 0.02
      }
      if (textRef.current) {
        // Continuous rotation when not paused - much slower
        textRef.current.rotation.y += delta * 0.05 * textRotationDirection
      }
      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 0.03
      }
    }
    // When paused, do nothing - everything stays exactly where it is
  })

  // Gradient shader material with dynamic month colors
  const gradientMaterial = new ShaderMaterial({
    uniforms: {
      lightColor: { value: monthColors[selectedMonth].light },
      darkColor: { value: monthColors[selectedMonth].dark }
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
      uniform vec3 lightColor;
      uniform vec3 darkColor;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Create gradient based on Y position (top to bottom)
        float t = (vPosition.y + 1.0) * 0.5; // Normalize to 0-1
        vec3 color = mix(darkColor, lightColor, t);
        
        // Add some variation based on normal for more realistic look
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        color = mix(color, lightColor, fresnel * 0.2); // Reduced fresnel intensity
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  })

  // Convert RGB array to hex color for torus rings
  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const monthColorHex = rgbToHex(
    monthColors[selectedMonth].light[0],
    monthColors[selectedMonth].light[1], 
    monthColors[selectedMonth].light[2]
  )

  return (
    <>
      {/* Blue Planet with Gradient */}
      <mesh ref={planetRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <primitive object={gradientMaterial} attach="material" />
      </mesh>
      
      {/* Days of the month - Rotating around planet */}
      <group ref={textRef} position={[0, 0, 0]}>
        {calendar.map((dateObj, index) => {
          const angle = (index / calendar.length) * Math.PI * 2
          const x = Math.cos(angle) * 5
          const z = Math.sin(angle) * 5
          
          return (
            <DayText
              key={dateObj.day}
              day={`${dateObj.day} ${dateObj.dow.toUpperCase()}`}
              position={[x, 0, z]}
              notes={notes}
              onDayClick={onDayClick}
              selectedDay={selectedDay}
            />
          )
        })}
      </group>
      
      {/* Very Thin Neon Blue Torus - Further out than text */}
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.01, 16, 32]} />
        <meshStandardMaterial color={monthColorHex} side={2} transparent opacity={0.3} />
      </mesh>
      
      {/* Inner Thin Light Blue Torus */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5.8, 0.01, 16, 32]} />
        <meshStandardMaterial color={monthColorHex} side={2} transparent opacity={0.3} />
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

export function LifeNotesPage() {
  const { user } = useAuth()
  const [textRotationDirection, setTextRotationDirection] = useState(1)
  const [isTextPaused, setIsTextPaused] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [selectedDay, setSelectedDay] = useState('1 SUN')
  const [showInput, setShowInput] = useState(true)
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear] = useState(today.getFullYear());
  const [isToolbarMinimized, setIsToolbarMinimized] = useState(true)
  const [isHeadingHidden, setIsHeadingHidden] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Format today's date for the heading
  const todayHeading = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  // Generate days for the selected month/year
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate()
  }, [selectedMonth, selectedYear])

  // Get the day of week for each day
  const getDayOfWeek = (year: number, month: number, day: number) => {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
      new Date(year, month, day).getDay()
    ]
  }

  const calendar = useMemo(() => (
    Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString()
      const dow = getDayOfWeek(selectedYear, selectedMonth, i + 1)
      return { day, dow }
    })
  ), [daysInMonth, selectedMonth, selectedYear])

  // Load notes when component mounts or month/year changes
  useEffect(() => {
    if (user) {
      loadNotesForMonth()
    }
  }, [user, selectedMonth, selectedYear])

  const loadNotesForMonth = async () => {
    if (!user) return
    
    try {
      setError(null)
      const lifeNotes = await db.getLifeNotesForMonth(selectedMonth, selectedYear, user.id)
      const convertedNotes = lifeNotes.map(convertLifeNoteToNote)
      setNotes(convertedNotes)
    } catch (err) {
      console.error('Error loading notes:', err)
      setError('Failed to load notes')
    }
  }

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
    console.log('Day clicked:', day)
    setSelectedDay(day)
    setIsTextPaused(true) // Automatically pause rotation
    setNewNote('')
    setShowInput(true)
    
    // Open the toolbar if it's minimized
    if (isToolbarMinimized) {
      setIsToolbarMinimized(false)
    }
    
    console.log('Toolbar opened and planet stopped')
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !newNote.trim()) return
    
    try {
      setError(null)
      
      // Parse the selected day to get the day number
      const dayNumber = parseInt(selectedDay.split(' ')[0])
      const noteDate = new Date(selectedYear, selectedMonth, dayNumber)
      
      const noteData = {
        day_string: selectedDay,
        content: newNote.trim(),
        note_date: noteDate.toISOString().split('T')[0], // YYYY-MM-DD format
        month: selectedMonth,
        year: selectedYear,
        user_id: user.id
      }
      
      const savedNote = await db.addLifeNote(noteData)
      const convertedNote = convertLifeNoteToNote(savedNote)
      
      setNotes(prev => [...prev, convertedNote])
      setNewNote('') // Clear the input but keep form open
      // Don't close the form - allow multiple entries
    } catch (err) {
      console.error('Error saving note:', err)
      setError('Failed to save note')
    }
  }

  const handleDone = () => {
    setShowInput(false)
    setNewNote('')
    setIsToolbarMinimized(true)
  }

  const toggleToolbarMinimize = () => {
    setIsToolbarMinimized(prev => {
      const newState = !prev
      if (!newState) {
        // When opening, also show the text input
        setShowInput(true)
      }
      return newState
    })
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
          {!user && (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              color: 'white', 
              textAlign: 'center',
              fontFamily: 'Courier New, monospace'
            }}>
              <h2>Please log in to access Notes that Float</h2>
            </div>
          )}
          
          {user && (
            <>
              <button 
                className={`heading-toggle-btn${isHeadingHidden ? ' hidden-state' : ''}`}
                onClick={() => setIsHeadingHidden(!isHeadingHidden)}
                aria-label={isHeadingHidden ? "Show heading" : "Hide heading"}
              />
              {!isHeadingHidden && (
                <>
                  <h1 className="notes-title-3d">{todayHeading}</h1>
                </>
              )}
              
              {error && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid #ff4444',
                  color: '#ff4444',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9rem',
                  zIndex: 1000
                }}>
                  {error}
                  <button 
                    onClick={() => setError(null)}
                    style={{
                      marginLeft: '1rem',
                      background: 'none',
                      border: 'none',
                      color: '#ff4444',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* LifeNotesToolbar Component */}
              <LifeNotesToolbar
                notes={notes}
                selectedDay={selectedDay}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onDayClick={handleDayClick}
                onMonthChange={setSelectedMonth}
                showInput={showInput}
                newNote={newNote}
                onNewNoteChange={setNewNote}
                onAddNote={handleAddNote}
                onDone={handleDone}
                isToolbarMinimized={isToolbarMinimized}
                onToolbarMinimize={toggleToolbarMinimize}
                textRotationDirection={textRotationDirection}
                onTextRotationToggle={toggleTextRotation}
                isTextPaused={isTextPaused}
                onTextPauseToggle={toggleTextPause}
              />
              
              {/* Planet Scene Canvas */}
              <div className="planet-scene-container">
                <Canvas camera={{ position: [0, 2, 15], fov: 60 }}>
                  <PlanetScene 
                    textRotationDirection={textRotationDirection} 
                    notes={notes} 
                    onDayClick={handleDayClick}
                    isTextPaused={isTextPaused}
                    selectedDay={selectedDay}
                    calendar={calendar}
                    selectedMonth={selectedMonth}
                  />
                </Canvas>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
} 