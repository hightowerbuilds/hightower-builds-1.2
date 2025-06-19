import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { useState } from 'react'
import './store.css'



export const Route = createFileRoute('/store/')({
  component: StorePage,
})

function StorePage() {
 
  const [zineDisplay, setZineDisplay] = useState('none')
  const [gameDisplay, setGameDisplay] = useState('none')
  const [shopDisplay, setShopDisplay] = useState('none')

  const handleZineButton = () => {
    setZineDisplay('block')
    setGameDisplay('none')
    setShopDisplay('none')
  }

  const handleGameButton = () => {
    setGameDisplay('block')
    setZineDisplay('none')
    setShopDisplay('none')
  }

  const handleShopButton = () => {
    setShopDisplay('block')
    setZineDisplay('none')
    setGameDisplay('none')
  }

  const handleCloseButton = () => {
    setZineDisplay('none')
    setGameDisplay('none')
    setShopDisplay('none')
  }

  return (
    <div className="brontosaurus-page-container">
      <Navbar />
      <main className="main-content">
        <div className="store-header">
          <img className="brontosaurus-page-title" src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/bronto-header.jpg" alt="brontosaurus logo" />
          <img src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/cityBronto.jpg" alt="" />
        </div>
        
       <div className="brontosaurus-page-nav">
        <p  onClick={handleZineButton} className='page-nav-item'>
          zines
        </p>

        <p onClick={handleGameButton} className='page-nav-item'>
          games
        </p>

        <p onClick={handleShopButton} className='page-nav-item'>
          shop
        </p>
        {
          zineDisplay === 'block' || gameDisplay === 'block' || shopDisplay === 'block' ? (
            <p onClick={handleCloseButton} className='page-nav-item'>
              X
            </p>
          ) : <p className='page-nav-item'> {'<'}</p>
        }
     
       </div>


        <div style={{display: zineDisplay}}  className='brontosaurus-store-section'>
          zine section

          <img src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/BrontoZineOneCover.jpg" alt="" />

          <img src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/ZineTwoCover.jpg" alt="" />
        </div>

        <div style={{display:gameDisplay}} className='brontosaurus-game-section'>
          game section
        </div>

        <div style={{display: shopDisplay}} className='brontosaurus-shop-section'>
          shop section
        </div>

      

        
      </main>
    </div>
  )
} 