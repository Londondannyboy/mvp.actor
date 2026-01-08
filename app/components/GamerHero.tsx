'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment, Float, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

// Soldier model with animation blending (adapted from Three.js examples)
function Soldier({ speed = 0 }: { speed: number }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/Soldier.glb')
  const { actions, mixer } = useAnimations(animations, group)

  // Animation state
  const [currentAction, setCurrentAction] = useState<string>('Idle')

  useEffect(() => {
    // Clone the scene to avoid sharing issues
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    // Determine action based on speed
    let targetAction = 'Idle'
    if (speed > 0.5) targetAction = 'Run'
    else if (speed > 0.1) targetAction = 'Walk'

    if (targetAction !== currentAction && actions[targetAction]) {
      // Crossfade to new animation
      const current = actions[currentAction]
      const next = actions[targetAction]

      if (current) current.fadeOut(0.3)
      if (next) {
        next.reset().fadeIn(0.3).play()
      }

      setCurrentAction(targetAction)
    }
  }, [speed, currentAction, actions])

  // Start with idle animation
  useEffect(() => {
    if (actions['Idle']) {
      actions['Idle'].play()
    }
  }, [actions])

  return (
    <group ref={group} position={[0, -1.5, 0]} scale={1.2}>
      <primitive object={scene} />
    </group>
  )
}

// Floating gaming elements
function FloatingElements() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={ref}>
      {/* Floating cubes representing game elements */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 3 + Math.sin(i) * 0.5
        return (
          <Float
            key={i}
            speed={1 + i * 0.2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.sin(i * 0.5) * 0.5,
                Math.sin(angle) * radius
              ]}
            >
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#22d3ee' : '#a855f7'}
                emissive={i % 2 === 0 ? '#22d3ee' : '#a855f7'}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

// Neon ground grid
function NeonGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshStandardMaterial
        color="#0a0a0f"
        wireframe
        emissive="#22d3ee"
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}

// Particle system
function Particles({ count = 100 }) {
  const ref = useRef<THREE.Points>(null)
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = Math.random() * 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  })

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
      const positions = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.01
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = 0
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Mouse-reactive camera
function CameraRig() {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current.x * 0.5, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1 + mouseRef.current.y * 0.3, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Scene content
function Scene({ animationSpeed }: { animationSpeed: number }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, -3]} color="#22d3ee" intensity={2} />
      <pointLight position={[3, 2, 3]} color="#a855f7" intensity={2} />

      {/* Character */}
      <Soldier speed={animationSpeed} />

      {/* Environment */}
      <FloatingElements />
      <NeonGrid />
      <Particles count={50} />

      {/* Camera movement */}
      <CameraRig />

      {/* Environment map for reflections */}
      <Environment preset="night" />
    </>
  )
}

// Loading fallback
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#22d3ee" wireframe />
    </mesh>
  )
}

// Main component
interface GamerHeroProps {
  className?: string
}

export function GamerHero({ className = '' }: GamerHeroProps) {
  // Auto-animate: cycle between idle, walk, run for constant motion
  const [animationSpeed, setAnimationSpeed] = useState(0.3) // Start walking
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Cycle animation for constant visual interest (skip if reduced motion preferred)
  useEffect(() => {
    if (prefersReducedMotion) return

    let direction = 1
    const interval = setInterval(() => {
      setAnimationSpeed(prev => {
        const next = prev + direction * 0.1
        if (next >= 0.8) direction = -1
        if (next <= 0.2) direction = 1
        return Math.max(0.2, Math.min(0.8, next))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <div className={`relative ${className}`} role="img" aria-label="Animated 3D esports soldier character with floating neon elements representing the gaming industry">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0a0a0f] to-cyan-900/30" />
      <Canvas
        shadows
        camera={{ position: [0, 1, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        aria-hidden="true"
        frameloop={prefersReducedMotion ? 'demand' : 'always'}
      >
        <Suspense fallback={<Loader />}>
          <Scene animationSpeed={prefersReducedMotion ? 0 : animationSpeed} />
        </Suspense>
      </Canvas>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
    </div>
  )
}

// Preload the model
useGLTF.preload('/models/Soldier.glb')
