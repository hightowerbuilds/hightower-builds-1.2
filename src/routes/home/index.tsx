import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar/Navbar'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import './home.css'

export const Route = createFileRoute('/home/')({
  component: Home,
})

// Custom shader material for frosting effect
const FrostingMaterial = shaderMaterial(
  {
    time: 0,
    baseColor: new THREE.Color('#D2B48C'),
    frostingColor: new THREE.Color('#3E2723'),
    sprinkleColor1: new THREE.Color('#4169E1'), // Blue
    sprinkleColor2: new THREE.Color('#FF0000'), // Red
    sprinkleColor3: new THREE.Color('#00FF00'), // Green
    sprinkleColor4: new THREE.Color('#FFFF00'), // Yellow
    sprinkleColor5: new THREE.Color('#800080'), // Purple
  },
  // Vertex shader
  `
    varying vec3 vPosition;
    varying float vFrosting;
    
    void main() {
      vPosition = position;
      
      // Calculate frosting based on local Z position (front of donut)
      // Use local coordinates to keep frosting fixed relative to donut
      float frostingMask = smoothstep(-0.8, 0.2, position.z);
      vFrosting = frostingMask;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 baseColor;
    uniform vec3 frostingColor;
    uniform vec3 sprinkleColor1;
    uniform vec3 sprinkleColor2;
    uniform vec3 sprinkleColor3;
    uniform vec3 sprinkleColor4;
    uniform vec3 sprinkleColor5;
    uniform float time;
    
    varying vec3 vPosition;
    varying float vFrosting;
    
    // Function to create sprinkle pattern
    float sprinkle(vec2 uv, float scale, float offset) {
      vec2 id = floor(uv * scale + offset);
      vec2 gv = fract(uv * scale + offset) - 0.5;
      
      float n = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
      
      if (n < 0.08) {
        float d = length(gv);
        return smoothstep(0.15, 0.0, d);
      }
      return 0.0;
    }
    
    void main() {
      // Mix base color and frosting color based on position
      vec3 finalColor = mix(baseColor, frostingColor, vFrosting);
      
      // Add some variation to the frosting
      float noise = sin(vPosition.x * 10.0 + time) * sin(vPosition.z * 10.0 + time) * 0.1;
      finalColor += noise * vFrosting;
      
      // Add multi-colored sprinkles on top of frosting
      if (vFrosting > 0.5) {
        vec2 sprinkleUV = vPosition.xy * 2.0;
        
        // Different colored sprinkles with different patterns
        float sprinkle1 = sprinkle(sprinkleUV + time * 0.1, 8.0, 0.0);
        float sprinkle2 = sprinkle(sprinkleUV + time * 0.15, 12.0, 100.0);
        float sprinkle3 = sprinkle(sprinkleUV + time * 0.2, 10.0, 200.0);
        float sprinkle4 = sprinkle(sprinkleUV + time * 0.12, 9.0, 300.0);
        float sprinkle5 = sprinkle(sprinkleUV + time * 0.18, 11.0, 400.0);
        
        // Mix all sprinkle colors
        finalColor = mix(finalColor, sprinkleColor1, sprinkle1 * 0.8);
        finalColor = mix(finalColor, sprinkleColor2, sprinkle2 * 0.8);
        finalColor = mix(finalColor, sprinkleColor3, sprinkle3 * 0.8);
        finalColor = mix(finalColor, sprinkleColor4, sprinkle4 * 0.8);
        finalColor = mix(finalColor, sprinkleColor5, sprinkle5 * 0.8);
      }
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

function Donut() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[1, 0.5, 16, 100]} />
      <primitive object={new FrostingMaterial()} ref={materialRef} />
    </mesh>
  )
}

function Home() {
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
        <div className="home-content">
          <h1 className="welcome-title-3d">Welcome to hightowerbuilds</h1>
          <p className="quote-text-3d">the project is of wide berth and sprawling as such. inspiration goes deep and outward equally free in the potential to roam. please look around and interact.</p>
        </div>
      </main>
    </div>
  )
} 