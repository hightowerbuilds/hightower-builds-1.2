import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
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
        font="/fonts/Courier.ttf"
        onClick={() => onDayClick(day)}
      >
        {day}
      </Text>
      
      {/* Display notes for this day */}
      {dayNotes.map((note, index) => (
        <Text
          key={note.id}
          ref={(el: any) => notesRefs.current[index] = el}
          position={[0, -0.4 - (index * 0.35), 0]}
          fontSize={0.08}
          color="#87CEEB"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          font="/fonts/Courier.ttf"
        >
          {index + 1}. {note.content}
        </Text>
      ))}
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

  // Calculate target rotation based on selected day
  const getTargetRotation = () => {
    const dayNumber = parseInt(selectedDay.split(' ')[0])
    if (isNaN(dayNumber)) return 0
    
    // Find the index of the selected day in the calendar
    const dayIndex = calendar.findIndex(dateObj => dateObj.day === dayNumber.toString())
    if (dayIndex === -1) return 0
    
    // Calculate the angle for the selected day
    // We want the selected day to appear at the front (z = 4.5, x = 0)
    // Use positive rotation to go in the correct sequential direction
    const totalDays = calendar.length
    const targetAngle = (dayIndex / totalDays) * Math.PI * 2 - Math.PI / 2 // Positive rotation with offset
    
    return targetAngle
  }

  const targetRotation = getTargetRotation()

  useFrame((_state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.02
    }
    if (textRef.current) {
      if (!isTextPaused) {
        // Continuous rotation when not paused - much slower
        textRef.current.rotation.y += delta * 0.05 * textRotationDirection
      } else {
        // Smoothly rotate to target position when paused
        const currentRotation = textRef.current.rotation.y
        const rotationDiff = targetRotation - currentRotation
        
        // Normalize the difference to take the shortest path
        let normalizedDiff = rotationDiff
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2
        
        // Smooth interpolation - slower movement to target
        const rotationSpeed = 0.5 // Slowed from 2.0 to 0.5
        textRef.current.rotation.y += normalizedDiff * delta * rotationSpeed
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03
    }
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
        <sphereGeometry args={[2.5, 32, 32]} />
        <primitive object={gradientMaterial} attach="material" />
      </mesh>
      
      {/* Days of the month - Rotating around planet */}
      <group ref={textRef} position={[0, 0, 0]}>
        {calendar.map((dateObj, index) => {
          const angle = (index / calendar.length) * Math.PI * 2
          const x = Math.cos(angle) * 4.5
          const z = Math.sin(angle) * 4.5
          
          return (
            <DayText
              key={dateObj.day}
              day={`${dateObj.day} ${dateObj.dow.toUpperCase()}`}
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
  const [textRotationDirection, setTextRotationDirection] = useState(1)
  const [isTextPaused, setIsTextPaused] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [selectedDay, setSelectedDay] = useState('1 SUN')
  const [showInput, setShowInput] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(5) // 0-indexed: 5 = June
  const [isCalendarMinimized, setIsCalendarMinimized] = useState(true)
  const selectedYear = 2025 // Fixed year, no setter needed

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

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
    
    // Small delay to let the planet start rotating to the date first
    setTimeout(() => {
      setShowInput(true)
      console.log('Modal should now be visible and planet should rotate to date')
    }, 300) // 300ms delay for dramatic effect
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
      setNewNote('') // Clear the input but keep form open
      // Don't close the form - allow multiple entries
    }
  }

  const handleDone = () => {
    setShowInput(false)
    setNewNote('')
  }

  const handleCancel = () => {
    setShowInput(false)
    setNewNote('')
  }

  const toggleCalendarMinimize = () => {
    setIsCalendarMinimized(prev => !prev)
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
          <h1 className="date-title-3d">{monthNames[selectedMonth].toUpperCase()} {selectedYear}</h1>

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
                      {calendar.map(dateObj => (
                        <option key={dateObj.day} value={`${dateObj.day} ${dateObj.dow.toUpperCase()}`}>{`${dateObj.day} ${dateObj.dow.toUpperCase()}`}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Show existing notes for this day */}
                  <div className="existing-notes">
                    <h4>Existing notes for {selectedDay}:</h4>
                    {notes.filter(note => note.day === selectedDay).length > 0 ? (
                      <ul className="notes-list">
                        {notes.filter(note => note.day === selectedDay).map((note, index) => (
                          <li key={note.id} className="note-item">
                            {index + 1}. {note.content}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-notes">No notes yet for this day</p>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter information"
                    className="note-input"
                    autoFocus
                  />
                  
                  <div className="button-group">
                    <button type="submit" className="save-btn">
                      Add Note
                    </button>
                    
                    <button type="button" onClick={handleDone} className="done-btn">
                      Done
                    </button>
                    
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
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
                selectedDay={selectedDay}
                calendar={calendar}
                selectedMonth={selectedMonth}
              />
            </Canvas>
          </div>

          {/* Control buttons on the far left bottom */}
          <div className="bottom-controls">
            <div className="controls-header">Planet</div>
            <div className="controls-buttons">
              <button 
                onClick={toggleTextRotation}
                className="rotation-toggle-btn"
              >
                {textRotationDirection === 1 ? '>' : '<'}
              </button>

              <button 
                onClick={toggleTextPause}
                className="rotation-stop-btn"
              >
                {isTextPaused ? 'go' : 'stop'}
              </button>
            </div>
          </div>

          {/* Toolbar for days and month navigation - moved to bottom */}
          <div className={`notes-toolbar${isCalendarMinimized ? ' minimized' : ''}`}>
            <div className="toolbar-header">
              <span className="toolbar-month-label">{monthNames[selectedMonth]} {selectedYear}</span>
              <div className="toolbar-buttons">
                <button
                  className="toolbar-month-btn"
                  onClick={() => setSelectedMonth(m => (m === 0 ? 11 : m - 1))}
                  aria-label="Previous Month"
                >
                  &#8592;
                </button>
                <button
                  className="toolbar-month-btn"
                  onClick={() => setSelectedMonth(m => (m === 11 ? 0 : m + 1))}
                  aria-label="Next Month"
                >
                  &#8594;
                </button>
                <button
                  className="toolbar-minimize-btn"
                  onClick={toggleCalendarMinimize}
                  aria-label={isCalendarMinimized ? "Expand Calendar" : "Minimize Calendar"}
                >
                  {isCalendarMinimized ? 'open' : 'close'}
                </button>
              </div>
            </div>
            
            {!isCalendarMinimized && (
              <div className="toolbar-calendar">
                <div className="toolbar-weekdays">
                  <span className="weekday-header">SUN</span>
                  <span className="weekday-header">MON</span>
                  <span className="weekday-header">TUE</span>
                  <span className="weekday-header">WED</span>
                  <span className="weekday-header">THU</span>
                  <span className="weekday-header">FRI</span>
                  <span className="weekday-header">SAT</span>
                </div>
                
                <div className="toolbar-days-grid">
                  {(() => {
                    // Get the first day of the month to determine padding
                    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay()
                    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
                    
                    // Create array with empty slots for padding
                    const daysArray = []
                    
                    // Add empty slots for days before the first day of the month
                    for (let i = 0; i < firstDayOfMonth; i++) {
                      daysArray.push({ day: '', dow: '', isEmpty: true })
                    }
                    
                    // Add all days of the month
                    for (let i = 1; i <= daysInMonth; i++) {
                      const dow = getDayOfWeek(selectedYear, selectedMonth, i)
                      daysArray.push({ day: i.toString(), dow, isEmpty: false })
                    }
                    
                    return daysArray.map((dateObj, index) => (
                      <div key={index} className={`toolbar-day-cell${dateObj.isEmpty ? ' empty' : ''}`}>
                        {!dateObj.isEmpty && (
                          <button
                            className={`toolbar-day-btn${selectedDay.startsWith(dateObj.day) ? ' selected' : ''}`}
                            onClick={() => handleDayClick(`${dateObj.day} ${dateObj.dow.toUpperCase()}`)}
                          >
                            {dateObj.day}
                          </button>
                        )}
                      </div>
                    ))
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 