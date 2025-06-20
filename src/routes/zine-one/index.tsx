import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import './zine-one.css'

export const Route = createFileRoute('/zine-one/')({
  component: ZineOnePage,
})

function ZineOnePage() {
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
        <div className="zine-one-content">
          <h1 className="page-title">Bronto Zine One</h1>
          <div className="zine-cover">
            <img 
              src="https://gbnizxzurmbzeelacztr.supabase.co/storage/v1/object/public/images/brontosaurus-publications/BrontoZineOneCover.jpg" 
              alt="Bronto Zine One Cover" 
            />
          </div>
          <div className="zine-description">
            <p>Welcome to Bronto Zine One - the first publication from Brontosaurus Publications.</p>
            <p>This zine explores themes of creativity, community, and the intersection of art and technology.</p>
          </div>
        </div>
      </main>
    </div>
  )
} 