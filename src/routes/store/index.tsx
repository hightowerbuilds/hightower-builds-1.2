import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { ImageCarousel } from '../../components/ImageCarousel/ImageCarousel'
import './store.css'

export const Route = createFileRoute('/store/')({
  component: StorePage,
})

function StorePage() {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div>
          <h1 className="page-title">Clothing & Photography Store</h1>
          <p className="page-description">Browse our collection of clothing and photography products.</p>
          
          <div className="store-section">
            <h2 className="section-title">Photography Gallery</h2>
            <p className="section-description">View our collection of eagle photography.</p>
            <button 
              className="gallery-button"
              onClick={() => setIsCarouselOpen(true)}
            >
              View Gallery
            </button>
          </div>
        </div>

        {isCarouselOpen && (
          <div className="carousel-wrapper">
            <ImageCarousel 
              isOpen={isCarouselOpen}
              onClose={() => setIsCarouselOpen(false)}
              bucket="images"
              folder="eagle-photos"
            />
          </div>
        )}
      </main>
    </div>
  )
} 