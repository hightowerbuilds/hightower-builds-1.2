import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { useState } from 'react'
import './store.css'

const EAGLE_IMAGES = [
  'distant-eagle.JPG',
  'eagle-closeup-2.JPG',
  'eagle-closeup-3.JPG',
  'eagle-closeup.JPG',
  'eagle.jpg',
  'eagleStalk.jpg',
  'eagle-stick-2.JPG',
  'eagle-stick.jpg'
]

const BASE_URL = 'https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public'

export const Route = createFileRoute('/store/')({
  component: StorePage,
})

function StorePage() {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'shirts', name: 'shirts', image: 'https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/words/shirtsNew.png' },
    { id: 'hoodies', name: 'hoodies', image: 'https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/words/hoodies.png' },
    { id: 'bags', name: 'bags', image: 'https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/words/bagsNew.png' }
  ]

  const thumbnailUrl = `${BASE_URL}/images/eagle-photos/${EAGLE_IMAGES[0]}`

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="store-header">
          <h1 className="page-title">General Store</h1>
        </div>
        
        <div className="store-sections">
          <section className="store-section clothing-section">
            <div className="section-header">
              <div className="header-top">
                <img 
                  src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/words/clothingSketch.png"
                  alt="Clothing Collection"
                  className="section-title-image"
                />
                <div className="cart-menu">
                  <button 
                    className="cart-button"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                  >
                    <span className={isCartOpen ? 'cart-open' : ''}>
                      {isCartOpen ? '\\!/' : '|||'}
                    </span>
                  </button>
                  <div className={`cart-dropdown ${isCartOpen ? 'open' : ''}`}>
                    {/* Placeholder for cart items */}
                  </div>
                </div>
              </div>
              <nav className="category-nav">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.image ? (
                      <img 
                        src={category.image}
                        alt={category.name}
                        className="category-image"
                      />
                    ) : (
                      category.name
                    )}
                  </button>
                ))}
              </nav>
            </div>
            <div className="clothing-grid">
              {/* Placeholder for clothing items */}
              <div className="clothing-item">
                <div className="item-image placeholder">Coming Soon</div>
                <h3 className="item-title">Sample Item</h3>
                <p className="item-price">$XX.XX</p>
              </div>
              {/* Add more items as needed */}
            </div>
          </section>

          <section className="store-section photography-section">
            <h2 className="section-title">Photography Gallery</h2>
            <p className="section-description">View our collection of eagle photography.</p>
            <div className="gallery-preview">
              <div className="preview-grid">
                <div className="preview-item" onClick={() => setIsCarouselOpen(true)}>
                  <img 
                    src={thumbnailUrl}
                    alt="Eagle Photography Preview"
                    className="preview-image"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />
                  {isLoading && <div className="preview-image placeholder">Loading...</div>}
                  <div className="preview-caption">eagle-photos</div>
                </div>
              </div>
              <button 
                className="gallery-button"
                onClick={() => setIsCarouselOpen(true)}
              >
                View Full Gallery
              </button>
            </div>
          </section>
        </div>

        {isCarouselOpen && (
          <div className="carousel-wrapper">
            {/* Placeholder for carousel component */}
          </div>
        )}
      </main>
    </div>
  )
} 