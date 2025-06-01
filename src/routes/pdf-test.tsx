import { createFileRoute } from '@tanstack/react-router'
import { PDFViewer } from '../components/PDFViewer/PDFViewer'

function PDFTestPage() {
  // Using a sample PDF URL for testing
  const samplePDFUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';

  return (
    <div className="page-container">
      <h1>PDF Viewer Test</h1>
      <PDFViewer url={samplePDFUrl} />
    </div>
  );
}

export const Route = createFileRoute('/pdf-test')({
  component: PDFTestPage,
}) 