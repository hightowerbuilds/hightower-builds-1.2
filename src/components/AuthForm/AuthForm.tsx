import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../lib/useAuth'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box } from '@react-three/drei'
import * as THREE from 'three'
import './AuthForm.css'

interface AuthFormProps {
  // Props are no longer needed since we use the auth context
}

// 3D Input Component
function Input3D({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  position, 
  isActive, 
  onFocus, 
  onBlur 
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'password'
  placeholder: string
  position: [number, number, number]
  isActive: boolean
  onFocus: () => void
  onBlur: () => void
}) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClick = () => {
    setIsFocused(true)
    onFocus()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur()
  }

  return (
    <group position={position}>
      {/* Label */}
      <Text
        position={[-1.5, 0.3, 0.1]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        font="/fonts/Courier.ttf"
      >
        {label}
      </Text>
      
      {/* Input Box */}
      <Box 
        args={[3, 0.4, 0.05]} 
        position={[0, 0, 0.1]}
        onClick={handleClick}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer'
          e.object.scale.setScalar(1.02)
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default'
          e.object.scale.setScalar(1)
        }}
      >
        <meshStandardMaterial 
          color={isActive || isFocused ? "#00f3ff" : "#ffffff"} 
          opacity={isActive || isFocused ? 0.3 : 0.1} 
          transparent 
        />
      </Box>
      
      {/* Input Text */}
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Courier.ttf"
        maxWidth={2.8}
      >
        {type === 'password' && value ? '•'.repeat(value.length) : (value || placeholder)}
      </Text>
    </group>
  )
}

// 3D Form Component
function AuthForm3D({ 
  isLogin, 
  username, 
  setUsername, 
  password, 
  setPassword, 
  handleSubmit, 
  loading, 
  successMessage, 
  localError, 
  toggleMode,
  activeInput,
  setActiveInput
}: {
  isLogin: boolean
  username: string
  setUsername: (value: string) => void
  password: string
  setPassword: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  loading: boolean
  successMessage: string
  localError: string
  toggleMode: () => void
  activeInput: 'username' | 'password' | null
  setActiveInput: (input: 'username' | 'password' | null) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  const handleFormSubmit = (e: React.FormEvent | any) => {
    // Only call preventDefault if it's a real DOM event
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    handleSubmit(e)
  }

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Success Message */}
      {successMessage && (
        <Text
          position={[0, 2.2, 0.1]}
          fontSize={0.15}
          color="#86efac"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Courier.ttf"
          maxWidth={3.5}
        >
          {successMessage}
        </Text>
      )}

      {/* Username Input */}
      <Input3D
        label={isLogin ? "USERNAME" : "NEW USERNAME"}
        value={username}
        onChange={setUsername}
        type="text"
        placeholder="Enter your username"
        position={[0, 0.4, 0]}
        isActive={activeInput === 'username'}
        onFocus={() => setActiveInput('username')}
        onBlur={() => setActiveInput(null)}
      />

      {/* Password Input */}
      <Input3D
        label={isLogin ? "PASSWORD" : "NEW PASSWORD"}
        value={password}
        onChange={setPassword}
        type="password"
        placeholder="Enter your password"
        position={[0, -0.2, 0]}
        isActive={activeInput === 'password'}
        onFocus={() => setActiveInput('password')}
        onBlur={() => setActiveInput(null)}
      />

      {/* Error Message */}
      {localError && (
        <Text
          position={[0, -0.8, 0.1]}
          fontSize={0.12}
          color="#fca5a5"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Courier.ttf"
          maxWidth={3.5}
        >
          not a good password
        </Text>
      )}

      {/* CREATE ACCOUNT Button */}
      <Box 
        args={[1.8, 0.6, 0.1]} 
        position={[-0.6, -0.8, 0.1]}
        onClick={(e) => {
          if (!isLogin) {
            console.log('3D Create Account button clicked!')
            e.stopPropagation()
            handleFormSubmit(e as any)
          } else {
            console.log('3D Toggle to Signup clicked!')
            e.stopPropagation()
            toggleMode()
          }
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer'
          e.object.scale.setScalar(1.05)
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default'
          e.object.scale.setScalar(1)
        }}
      >
        <meshStandardMaterial 
          color={loading && !isLogin ? "#666666" : "#00f3ff"} 
          opacity={0.8} 
          transparent 
        />
      </Box>
      
      <Text
        position={[-0.6, -0.8, 0.2]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Courier.ttf"
      >
        {loading && !isLogin ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
      </Text>

      {/* SIGN IN Button */}
      <Box 
        args={[1.0, 0.6, 0.1]} 
        position={[1.0, -0.8, 0.1]}
        onClick={(e) => {
          if (isLogin) {
            console.log('3D Sign In button clicked!')
            e.stopPropagation()
            handleFormSubmit(e as any)
          } else {
            console.log('3D Toggle to Signin clicked!')
            e.stopPropagation()
            toggleMode()
          }
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer'
          e.object.scale.setScalar(1.05)
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default'
          e.object.scale.setScalar(1)
        }}
      >
        <meshStandardMaterial 
          color={loading && isLogin ? "#666666" : "#00ff00"} 
          opacity={0.8} 
          transparent 
        />
      </Box>
      
      <Text
        position={[1.0, -0.8, 0.2]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Courier.ttf"
      >
        {loading && isLogin ? 'SIGNING IN...' : 'OR LOGIN'}
      </Text>
    </group>
  )
}

export function AuthForm({}: AuthFormProps) {
  const { login, signup, error, clearError, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [localError, setLocalError] = useState('')
  const [activeInput, setActiveInput] = useState<'username' | 'password' | null>(null)

  // Clear error when switching modes
  useEffect(() => {
    clearError()
    setSuccessMessage('')
    setLocalError('')
  }, [isLogin, clearError])

  // Debug: Log error changes
  useEffect(() => {
    console.log('AuthForm: Error state changed:', error)
    if (error) {
      console.log('AuthForm: Error displayed:', error)
    }
  }, [error])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeInput) {
        if (e.key === 'Enter') {
          handleSubmit(e as any)
        } else if (e.key === 'Tab') {
          e.preventDefault()
          if (activeInput === 'username') {
            setActiveInput('password')
          } else if (activeInput === 'password') {
            setActiveInput('username')
          }
        } else if (e.key === 'Escape') {
          setActiveInput(null)
        } else if (e.key.length === 1) {
          // Handle character input
          if (activeInput === 'username') {
            setUsername(prev => prev + e.key)
          } else if (activeInput === 'password') {
            setPassword(prev => prev + e.key)
          }
        } else if (e.key === 'Backspace') {
          // Handle backspace
          if (activeInput === 'username') {
            setUsername(prev => prev.slice(0, -1))
          } else if (activeInput === 'password') {
            setPassword(prev => prev.slice(0, -1))
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [activeInput])

  const handleSubmit = async (e: React.FormEvent | any) => {
    // Only call preventDefault if it's a real DOM event
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    console.log('handleSubmit called with:', { isLogin, username, password })
    
    if (!username.trim() || !password.trim()) {
      console.log('Validation failed - empty fields')
      setLocalError('Please enter both username and password')
      return
    }

    setLocalError('') // Clear any previous error
    console.log('Starting auth process...')

    if (isLogin) {
      try {
        console.log('Attempting login...')
        await login(username, password)
        setSuccessMessage('Successfully logged in!')
        // Clear form after successful login
        setTimeout(() => {
          setUsername('')
          setPassword('')
          setSuccessMessage('')
        }, 2000)
      } catch (err) {
        console.error('Login error:', err)
        setLocalError('Password or username not found')
      }
    } else {
      try {
        console.log('Attempting signup...')
        await signup(username, password)
        setSuccessMessage('Account created successfully!')
        // Clear form after successful signup
        setTimeout(() => {
          setUsername('')
          setPassword('')
          setSuccessMessage('')
        }, 2000)
      } catch (err) {
        console.error('Signup error:', err)
        setLocalError('Failed to create account')
      }
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setUsername('')
    setPassword('')
    clearError()
    setSuccessMessage('')
    setLocalError('')
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form-3d-wrapper">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 60 }}
          style={{ 
            width: '100%', 
            height: '100%',
            background: 'transparent'
          }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <AuthForm3D
            isLogin={isLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            loading={loading}
            successMessage={successMessage}
            localError={localError}
            toggleMode={toggleMode}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.5}
            maxDistance={15}
            autoRotate={false}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>
    </div>
  )
} 