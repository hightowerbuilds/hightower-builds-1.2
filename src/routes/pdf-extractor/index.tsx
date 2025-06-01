import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { useState, useRef, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { parseTransactions, type ParsedDocument } from '../../lib/transaction-parser'
import './pdf-extractor.css'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export const Route = createFileRoute('/pdf-extractor/')({
  component: PDFExtractorPage,
})

interface TextStats {
  words: number
  lines: number
  characters: number
  charactersNoSpaces: number
}

interface DocumentStats extends TextStats {
  totalPages: number
  averageWordsPerPage: number
  averageLinesPerPage: number
  averageParagraphsPerPage: number
}

interface ProcessedContent {
  metadata: {
    filename: string
    stats: DocumentStats
    timestamp: string
    processingInfo: {
      version: string
      format: string
      encoding: string
    }
  }
  content: ParsedDocument
}

// Define our own types for text content items
interface TextContentItem {
  str?: string;
  transform?: number[];
}

function PDFExtractorPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' })
  const [extractedText, setExtractedText] = useState('')
  const [textStats, setTextStats] = useState<TextStats | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [currentFilename, setCurrentFilename] = useState('')
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const calculateTextStats = useCallback((text: string): TextStats => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    const lines = text.split('\n').length
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    
    return {
      words: words.length,
      lines: lines,
      characters: characters,
      charactersNoSpaces: charactersNoSpaces
    }
  }, [])

  const extractTextFromPDF = useCallback(async (arrayBuffer: ArrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
      verbosity: 0
    }).promise
    
    let fullText = ''
    const totalPages = pdf.numPages
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        setUploadStatus({ 
          message: `Processing page ${pageNum} of ${totalPages}...`, 
          type: 'processing' 
        })
        
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        // Group text items by their vertical position to preserve line structure
        const lineGroups = new Map<number, string[]>()
        let lastY: number | null = null
        let currentLine: string[] = []
        let lastX: number | null = null
        
        // Get the average line height from the first few items
        const lineHeights: number[] = []
        let lastItemY: number | null = null
        textContent.items.slice(0, 20).forEach((item: any) => {
          const transform = item.transform
          if (transform) {
            const y = Math.round(transform[5])
            if (lastItemY !== null) {
              const diff = Math.abs(y - lastItemY)
              if (diff > 5) { // Only consider significant vertical differences
                lineHeights.push(diff)
              }
            }
            lastItemY = y
          }
        })
        const avgLineHeight = lineHeights.length > 0 
          ? lineHeights.reduce((a, b) => a + b, 0) / lineHeights.length 
          : 12 // Default to 12 if we can't calculate
        
        // Sort items by their position (top to bottom, left to right)
        const sortedItems = [...textContent.items].sort((a: any, b: any) => {
          const transformA = a.transform
          const transformB = b.transform
          if (!transformA || !transformB) return 0
          const yDiff = Math.abs(transformA[5] - transformB[5])
          if (yDiff > 5) { // Different line
            return transformA[5] - transformB[5]
          }
          // Same line, sort by x position
          return transformA[4] - transformB[4]
        })
        
        // Track the last line's Y position for paragraph detection
        let lastLineY: number | null = null
        let paragraphBreaks: Set<number> = new Set()
        
        // First pass: identify paragraph breaks
        sortedItems.forEach((item: any) => {
          const transform = item.transform
          if (transform) {
            const y = Math.round(transform[5])
            if (lastLineY !== null && Math.abs(y - lastLineY) > avgLineHeight * 1.5) {
              // If the gap is significantly larger than average line height, mark as paragraph break
              paragraphBreaks.add(Math.min(y, lastLineY))
            }
            lastLineY = y
          }
        })
        
        // Second pass: process text items
        sortedItems.forEach((item: any) => {
          const str = item.str
          const transform = item.transform
          if (!str || !transform) return
          
          const y = Math.round(transform[5])
          const x = Math.round(transform[4])
          
          if (lastY === null) {
            lastY = y
            lastX = x
          }
          
          // If Y position changes significantly, start a new line
          if (Math.abs(y - lastY) > 5) {
            if (currentLine.length > 0 && lastY !== null) {
              lineGroups.set(lastY, currentLine)
              currentLine = []
            }
            lastY = y
            lastX = x
          }
          
          // Check if we need to add a space between items
          if (lastX !== null && x - lastX > 5) {
            const lastItem = currentLine[currentLine.length - 1]
            const currentItem = str
            
            const shouldAddSpace = !(
              (lastItem?.endsWith('-') && /^[a-zA-Z]/.test(currentItem)) ||
              (/[a-zA-Z]$/.test(lastItem || '') && currentItem.startsWith('-')) ||
              (lastItem?.endsWith('.') && /^\d/.test(currentItem)) ||
              (/\d$/.test(lastItem || '') && currentItem.startsWith('.'))
            )
            
            if (shouldAddSpace) {
              currentLine.push(' ')
            }
          }
          
          currentLine.push(str)
          lastX = x + (str.length * 6)
        })
        
        // Add the last line
        if (currentLine.length > 0 && lastY !== null) {
          lineGroups.set(lastY, currentLine)
        }
        
        // Join lines with proper line breaks and paragraph breaks
        const pageText = Array.from(lineGroups.entries())
          .sort(([y1], [y2]) => y1 - y2) // Sort by Y position
          .map(([y, line]) => {
            // Join the line items and clean up spaces
            const lineText = line.join('')
              .replace(/\s+/g, ' ')
              .replace(/\s*-\s*/g, '-')
              .replace(/\s*\.\s*/g, '.')
              .trim()
            
            // Add extra newline for paragraph breaks
            return paragraphBreaks.has(y) ? `\n\n${lineText}` : lineText
          })
          .filter(line => line.length > 0)
          .join('\n')
          .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines to max of 2
        
        if (pageText.trim()) {
          fullText += `\n\n--- Page ${pageNum} ---\n\n${pageText}`
        }
        
        // Add small delay to prevent blocking UI
        if (pageNum % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError)
        fullText += `\n\n--- Page ${pageNum} (Error) ---\n\n[Could not extract text from this page]\n\n`
      }
    }
    
    return fullText.trim()
  }, [])

  const processTextToJSON = useCallback((text: string, filename: string, stats: TextStats) => {
    try {
      // Use the transaction parser to process the text
      const parsedDocument = parseTransactions(text)
      
      const documentStats = {
        ...stats,
        totalPages: parsedDocument.pages.length,
        averageWordsPerPage: Math.round(stats.words / parsedDocument.pages.length),
        averageLinesPerPage: Math.round(stats.lines / parsedDocument.pages.length),
        averageParagraphsPerPage: Math.round(
          parsedDocument.pages.reduce((sum, page) => sum + page.paragraphs.length, 0) / parsedDocument.pages.length
        )
      }

      const processed: ProcessedContent = {
        metadata: {
          filename,
          stats: documentStats,
          timestamp: new Date().toISOString(),
          processingInfo: {
            version: '1.0',
            format: 'structured-text',
            encoding: 'UTF-8'
          }
        },
        content: parsedDocument
      }

      setProcessedContent(processed)
      setJsonError(null)
      return processed
    } catch (error) {
      console.error('Error processing text to JSON:', error)
      setJsonError('Error processing text to JSON format')
      return null
    }
  }, [])

  const processFile = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) {
      setUploadStatus({ message: 'Please select a PDF file.', type: 'error' })
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadStatus({ message: 'File size must be less than 10MB.', type: 'error' })
      return
    }

    setCurrentFilename(file.name)
    setUploadStatus({ message: 'Processing PDF...', type: 'processing' })
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const text = await extractTextFromPDF(arrayBuffer)
      
      if (text.trim()) {
        setExtractedText(text)
        const stats = calculateTextStats(text)
        setTextStats(stats)
        setShowResults(true)
        // Process the text to JSON format
        processTextToJSON(text, file.name, stats)
        setUploadStatus({ 
          message: `✅ Successfully extracted text from ${file.name}`, 
          type: 'success' 
        })
      } else {
        setUploadStatus({ 
          message: 'No text found in the PDF. The PDF might contain only images or be password protected.', 
          type: 'error' 
        })
      }
    } catch (error: any) {
      console.error('Error processing PDF:', error)
      setUploadStatus({ 
        message: `❌ Error processing PDF: ${error.message}`, 
        type: 'error' 
      })
    }
  }, [extractTextFromPDF, calculateTextStats, processTextToJSON])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(extractedText)
      setUploadStatus({ message: 'Copied to clipboard!', type: 'success' })
    } catch (error) {
      // Fallback for older browsers
      if (textareaRef.current) {
        textareaRef.current.select()
        document.execCommand('copy')
        setUploadStatus({ message: 'Copied to clipboard!', type: 'success' })
      }
    }
  }, [extractedText])

  const handleDownload = useCallback(() => {
    const blob = new Blob([extractedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    
    a.href = url
    a.download = currentFilename.replace('.pdf', '_extracted.txt')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
    setUploadStatus({ message: 'Downloaded!', type: 'success' })
  }, [extractedText, currentFilename])

  const handleClear = useCallback(() => {
    setShowResults(false)
    setExtractedText('')
    setTextStats(null)
    setCurrentFilename('')
    setUploadStatus({ message: '', type: '' })
    setProcessedContent(null)
    setJsonError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleCopyJSON = useCallback(() => {
    if (processedContent) {
      try {
        navigator.clipboard.writeText(JSON.stringify(processedContent, null, 2))
        setUploadStatus({ message: 'JSON copied to clipboard!', type: 'success' })
      } catch (error) {
        console.error('Error copying JSON:', error)
        setUploadStatus({ message: 'Error copying JSON to clipboard', type: 'error' })
      }
    }
  }, [processedContent])

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="pdf-extractor-content">
          <header>
            <h1 className="page-title">📄 PDF Text Extractor</h1>
            <p className="page-description">Upload a PDF file to extract all text content</p>
          </header>

          <div className="upload-section">
            <div 
              className={`upload-area ${isDragging ? 'dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">📁</div>
              <h3>Drop PDF file here or click to browse</h3>
              <p>Supports PDF files up to 10MB</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf" 
                hidden 
                onChange={handleFileSelect}
              />
            </div>
            
            {uploadStatus.message && (
              <div className={`upload-status ${uploadStatus.type}`}>
                {uploadStatus.type === 'processing' && <span className="loading"></span>}
                {uploadStatus.message}
              </div>
            )}
          </div>

          {showResults && (
            <>
              <div className="results-section fade-in">
                <div className="results-header">
                  <h2>Extracted Text</h2>
                  <div className="results-actions">
                    <button onClick={handleCopyToClipboard} className="btn-secondary">
                      📋 Copy Text
                    </button>
                    <button onClick={handleDownload} className="btn-secondary">
                      💾 Download as TXT
                    </button>
                    <button onClick={handleClear} className="btn-secondary">
                      🗑️ Clear
                    </button>
                  </div>
                </div>
                
                {textStats && (
                  <div className="text-stats">
                    <div className="stat-item">
                      <span>📝</span>
                      <span><strong>{textStats.words.toLocaleString()}</strong> words</span>
                    </div>
                    <div className="stat-item">
                      <span>📄</span>
                      <span><strong>{textStats.lines.toLocaleString()}</strong> lines</span>
                    </div>
                    <div className="stat-item">
                      <span>🔤</span>
                      <span><strong>{textStats.characters.toLocaleString()}</strong> characters</span>
                    </div>
                    <div className="stat-item">
                      <span>📏</span>
                      <span><strong>{textStats.charactersNoSpaces.toLocaleString()}</strong> characters (no spaces)</span>
                    </div>
                  </div>
                )}
                
                <div className="extracted-text">
                  <textarea
                    ref={textareaRef}
                    value={extractedText}
                    readOnly
                    placeholder="Extracted text will appear here..."
                  />
                </div>
              </div>

              <div className="results-section fade-in json-section">
                <div className="results-header">
                  <h2>Structured JSON</h2>
                  <div className="results-actions">
                    <button onClick={handleCopyJSON} className="btn-secondary">
                      📋 Copy JSON
                    </button>
                  </div>
                </div>

                {jsonError ? (
                  <div className="json-error">{jsonError}</div>
                ) : processedContent ? (
                  <div className="json-content">
                    <pre>{JSON.stringify(processedContent, null, 2)}</pre>
                  </div>
                ) : (
                  <div className="json-placeholder">
                    JSON structure will appear here after text extraction
                  </div>
                )}
              </div>
            </>
          )}

          <footer>
            <p>Powered by PDF.js (Character Maps Removed - English Only)</p>
          </footer>
        </div>
      </main>
    </div>
  )
} 