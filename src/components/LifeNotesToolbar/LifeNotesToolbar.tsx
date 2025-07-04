import { useState, useMemo } from 'react'
import './LifeNotesToolbar.css'

interface Note {
  id: string
  day: string
  content: string
}

interface LifeNotesToolbarProps {
  notes: Note[]
  selectedDay: string
  selectedMonth: number
  selectedYear: number
  onDayClick: (day: string) => void
  onMonthChange: (month: number) => void
  showInput: boolean
  newNote: string
  onNewNoteChange: (note: string) => void
  onAddNote: (e: React.FormEvent) => void
  onDone: () => void
  isToolbarMinimized: boolean
  onToolbarMinimize: () => void
  textRotationDirection: number
  onTextRotationToggle: () => void
  isTextPaused: boolean
  onTextPauseToggle: () => void
}

export function LifeNotesToolbar({
  notes,
  selectedDay,
  selectedMonth,
  selectedYear,
  onDayClick,
  onMonthChange,
  showInput,
  newNote,
  onNewNoteChange,
  onAddNote,
  onDone,
  isToolbarMinimized,
  onToolbarMinimize,
  textRotationDirection,
  onTextRotationToggle,
  isTextPaused,
  onTextPauseToggle
}: LifeNotesToolbarProps) {
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

  return (
    <>
      {/* Control buttons for planet rotation - Floating outside toolbar */}
      <div className={`bottom-controls${isToolbarMinimized ? ' floating' : ''}`}>
        <div className="controls-buttons">
          <button 
            onClick={onTextRotationToggle}
            className="rotation-toggle-btn"
          >
            {textRotationDirection === 1 ? '>>>' : '<<<'}
          </button>

          <button 
            onClick={onTextPauseToggle}
            className="rotation-stop-btn"
          >
            {isTextPaused ? 'go' : 'stop'}
          </button>

          <button
            className="toolbar-minimize-btn"
            onClick={onToolbarMinimize}
            aria-label={isToolbarMinimized ? "Expand Toolbars" : "Minimize Toolbars"}
          >
            {isToolbarMinimized ? 'open' : 'close'}
          </button>
        </div>
      </div>

            {/* Toolbar Container */}
      <div className={`toolbar-container${isToolbarMinimized ? ' minimized' : ''}`}>
        <div className="toolbar-content-wrapper">
          {/* Add Info Section - Only show when a day is clicked */}
          {showInput && (
            <div className="add-info-section">
              <div className="add-info-header">
                <h3 className="add-info-title">NOTE</h3>
              </div>
              <form onSubmit={onAddNote} className="add-info-form">
                <div className="input-container">
                  <div className="day-select-container">
                    <select
                      value={selectedDay}
                      onChange={(e) => onDayClick(e.target.value)}
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
                  
                  <textarea
                    value={newNote}
                    onChange={(e) => onNewNoteChange(e.target.value)}
                    placeholder="Enter information"
                    className="note-input"
                    autoFocus
                    rows={3}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #87CEEB',
                      color: '#87CEEB',
                      fontFamily: 'Courier New, Courier, monospace',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      height: '145px',
                      resize: 'vertical',
                    }}  
                  />
                  
                  <div className="button-group">
                    <button type="submit" className="save-btn">
                      Add Note
                    </button>
                    
                    <button type="button" onClick={onDone} className="done-btn">
                      Done
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Toolbar for days and month navigation */}
          <div className="notes-toolbar">
        <div className="toolbar-header">
          <span className="toolbar-month-label">{monthNames[selectedMonth]} {selectedYear}</span>
          <div className="toolbar-buttons">
            <button
              className="toolbar-month-btn"
              onClick={() => onMonthChange(selectedMonth === 0 ? 11 : selectedMonth - 1)}
              aria-label="Previous Month"
            >
              &lt;
            </button>
            <button
              className="toolbar-month-btn"
              onClick={() => onMonthChange(selectedMonth === 11 ? 0 : selectedMonth + 1)}
              aria-label="Next Month"
            >
              &gt;
            </button>
          </div>
        </div>
        
        {(
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
                
                return daysArray.map((dateObj, index) => {
                  const dayString = `${dateObj.day} ${dateObj.dow.toUpperCase()}`
                  const hasNotes = notes.some(note => note.day === dayString)
                  
                  return (
                    <div key={index} className={`toolbar-day-cell${dateObj.isEmpty ? ' empty' : ''}`}>
                      {!dateObj.isEmpty && (
                        <button
                          className={`toolbar-day-btn${selectedDay === dayString ? ' selected' : ''}${hasNotes ? ' has-notes' : ''}`}
                          onClick={() => onDayClick(dayString)}
                        >
                          {dateObj.day}
                        </button>
                      )}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}
      </div>
        </div>
      </div>
    </>
  )
} 