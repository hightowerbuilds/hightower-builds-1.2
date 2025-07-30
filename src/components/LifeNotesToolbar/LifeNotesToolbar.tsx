import { useState } from 'react'
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
  isFullscreen: boolean
  onFullscreenToggle: () => void
  onEditNote: (id: string, content: string) => void
  onDeleteNote: (id: string) => void
  areDatesVisible: boolean
  onToggleDatesVisibility: () => void
  areNotesVisible: boolean
  onToggleNotesVisibility: () => void
  areRingsVisible: boolean
  onToggleRingsVisibility: () => void
  isPlanetVisible: boolean
  onTogglePlanetVisibility: () => void
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
  onTextPauseToggle,
  isFullscreen,
  onFullscreenToggle,
  onEditNote,
  onDeleteNote,
  areDatesVisible,
  onToggleDatesVisibility,
  areNotesVisible,
  onToggleNotesVisibility,
  areRingsVisible,
  onToggleRingsVisibility,
  isPlanetVisible,
  onTogglePlanetVisibility
  }: LifeNotesToolbarProps) {
  // Edit state management
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]



  // Get the day of week for each day
  const getDayOfWeek = (year: number, month: number, day: number) => {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
      new Date(year, month, day).getDay()
    ]
  }



  // Edit/Delete helper functions
  const handleEditStart = (note: Note) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const handleEditSave = (noteId: string) => {
    if (editContent.trim()) {
      onEditNote(noteId, editContent.trim())
    }
    setEditingNoteId(null)
    setEditContent('')
  }

  const handleEditCancel = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  const handleDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(noteId)
    }
  }

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
      <div className={`toolbar-container${isToolbarMinimized ? ' minimized' : ''}${isFullscreen ? ' fullscreen' : ''}`}>
        <div className="toolbar-content-wrapper">
          {/* Add Info Section - Only show when a day is clicked */}
          {showInput && (
            <div className="add-info-section">
              <div className="add-info-header">
                <h3 className="add-info-title">NOTE</h3>
                <button
                  type="button"
                  onClick={onFullscreenToggle}
                  className="fullscreen-btn"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? "dashboard" : "full-screen"}
                </button>
              </div>
              <form onSubmit={onAddNote} className="add-info-form">
                <div className="input-container">
                  <div className="day-display-container">
                    <div className="day-display">
                      {selectedDay}
                    </div>
                  </div>
                  
                  {/* Show existing notes for this day */}
                  <div className="existing-notes">
                    <h4>Existing notes for {selectedDay}:</h4>
                    {notes.filter(note => note.day === selectedDay).length > 0 ? (
                      <div className="notes-content">
                        {notes.filter(note => note.day === selectedDay).map((note) => (
                          <div key={note.id} className="note-item-container">
                            {editingNoteId === note.id ? (
                              // Edit mode
                              <div className="note-edit-container">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="note-edit-textarea"
                                  autoFocus
                                />
                                <div className="note-edit-buttons">
                                  <button
                                    onClick={() => handleEditSave(note.id)}
                                    className="note-save-btn"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={handleEditCancel}
                                    className="note-cancel-btn"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Display mode
                              <div className="note-display-container">
                                <p className="note-paragraph">
                                  {note.content}
                                </p>
                                <div className="note-actions">
                                  <span
                                    onClick={() => handleEditStart(note)}
                                    className="note-edit-text"
                                    title="Edit note"
                                  >
                                    edit
                                  </span>
                                  <span
                                    onClick={() => handleDelete(note.id)}
                                    className="note-delete-text"
                                    title="Delete note"
                                  >
                                    delete
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
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
                    
                    {!isFullscreen && (
                      <button type="button" onClick={onDone} className="done-btn">
                        Done
                      </button>
                    )}
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

      {/* New Box Under Calendar */}
      <div className="new-box-section">
        <div className="new-box-header">
          <h3 className="new-box-title">TOGGLE</h3>
        </div>
        <div className="new-box-content">
          <div className="planet-controls-grid">
            <button
              onClick={onToggleDatesVisibility}
              className={`planet-control-btn${!areDatesVisible ? ' hide-state' : ''}`}
            >
              {areDatesVisible ? 'Hide Dates' : 'View Dates'}
            </button>
            
            <button
              onClick={onToggleNotesVisibility}
              className={`planet-control-btn${!areNotesVisible ? ' hide-state' : ''}`}
            >
              {areNotesVisible ? 'Hide Notes' : 'View Notes'}
            </button>
            
            <button
              onClick={onToggleRingsVisibility}
              className={`planet-control-btn${!areRingsVisible ? ' hide-state' : ''}`}
            >
              {areRingsVisible ? 'Hide Rings' : 'View Rings'}
            </button>
            
            <button
              onClick={onTogglePlanetVisibility}
              className={`planet-control-btn${!isPlanetVisible ? ' hide-state' : ''}`}
            >
              {isPlanetVisible ? 'Hide Planet' : 'View Planet'}
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    </>
  )
} 