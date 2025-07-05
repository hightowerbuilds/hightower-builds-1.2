import { useState, useEffect } from 'react'
import './MoneyModesHeading.css'

// Letter definitions - each letter is made up of squares
const LETTERS = {
  'M': [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
  ],
  'O': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  'N': [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1]
  ],
  'E': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  'Y': [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0]
  ],
  ' ': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  'D': [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0]
  ],
  'S': [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0]
  ]
}

// Color palette - smooth transition from green to red
const COLORS = [
  '#00ff00', // Bright Green
  '#40ff00', // Green-Yellow
  '#80ff00', // Lime Green
  '#bfff00', // Yellow-Green
  '#ffff00', // Yellow
  '#ffbf00', // Orange-Yellow
  '#ff8000', // Orange
  '#ff4000', // Red-Orange
  '#ff0000', // Bright Red
]

interface SquareProps {
  isActive: boolean
  color: string
  delay: number
  letterIndex: number
  columnIndex: number
  isColumnHovered: boolean
  onColumnHover: (letterIndex: number, columnIndex: number | null) => void
}

function Square({ isActive, color, delay, letterIndex, columnIndex, isColumnHovered, onColumnHover }: SquareProps) {
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev)
    }, 500 + delay * 50) // Different timing for each square

    return () => clearInterval(interval)
  }, [delay])

  const handleMouseEnter = () => {
    onColumnHover(letterIndex, columnIndex)
  }

  const handleMouseLeave = () => {
    onColumnHover(letterIndex, null)
  }

  return (
    <div 
      className={`square ${isActive ? 'active' : ''} ${isBlinking ? 'blinking' : ''} ${isColumnHovered ? 'column-hovered' : ''}`}
      style={{
        backgroundColor: isColumnHovered ? '#1e90ff' : (isActive ? color : 'transparent'),
        borderColor: isColumnHovered ? '#1e90ff' : color,
        animationDelay: `${delay * 0.1}s`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}

export function MoneyModesHeading() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const [isForward, setIsForward] = useState(true)
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  // Change colors every 0.25 seconds with back-and-forth motion
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(prev => {
        if (isForward) {
          if (prev === COLORS.length - 1) {
            setIsForward(false)
            return prev - 1
          }
          return prev + 1
        } else {
          if (prev === 0) {
            setIsForward(true)
            return prev + 1
          }
          return prev - 1
        }
      })
    }, 250)

    return () => clearInterval(interval)
  }, [isForward])

  const text = 'MONEY MODES'
  const currentColor = COLORS[currentColorIndex]

  return (
    <div className="money-modes-heading">
      <div className="heading-container">
        {text.split('').map((letter, letterIndex) => (
          <div key={letterIndex} className="letter-container">
            {LETTERS[letter as keyof typeof LETTERS]?.map((row, rowIndex) => (
              <div key={rowIndex} className="letter-row">
                {row.map((square, squareIndex) => (
                  <Square
                    key={squareIndex}
                    isActive={square === 1}
                    color={currentColor}
                    delay={letterIndex * 5 + rowIndex * 5 + squareIndex}
                    letterIndex={letterIndex}
                    columnIndex={squareIndex}
                    isColumnHovered={hoveredColumn === `${letterIndex}-${squareIndex}`}
                    onColumnHover={(letterIdx, colIdx) => setHoveredColumn(colIdx !== null ? `${letterIdx}-${colIdx}` : null)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
} 