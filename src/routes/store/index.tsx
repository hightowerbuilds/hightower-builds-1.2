import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { useState } from 'react'
import './store.css'

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'


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
       
       <div className='image-container-heading'>
       <img className="brontosaurus-page-title" src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/bronto-header.png" alt="brontosaurus logo" />
       <img className="city-image" src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/cityBronto.jpg" alt="" />
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
         ) : <p className='page-nav-item'> {'<---'}</p>
       }
    
      </div>


       <div style={{display: zineDisplay}}  className='brontosaurus-store-section'>
         
         <div style={{display: 'inline-flex', justifyContent: 'space-between'}}>
             <p>
                 people and thoughts and ya know the city and stuff
             </p>
             <img className='zine-image' src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/BrontoZineOneCover.jpg" alt="" />
         </div>
       
       <div style={{display: 'inline-flex', justifyContent: 'space-between'}}>
         <p>
           more special stuff that went down back then. 
         </p>
         <img className='zine-image' src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/ZineTwoCover.jpg" alt="" />
       </div>
     
       </div>

       <div style={{display:gameDisplay}} className='brontosaurus-game-section'>
         game section
         <a href="https://orca-invasion-2025-ccku.vercel.app/">  <img className='game-image' src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/orca-invasion.png" alt="" /></a>
       
       </div>

       <div style={{display: shopDisplay}} className='brontosaurus-shop-section'>
         shop section
       </div>

     

       
     </main>
    </div>
  )
} 