'use client'

// This file contains ONLY Three.js code - loaded separately from VideoHero
// This enables true lazy loading of the heavy 3D libraries

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Float } from '@react-three/drei'
import * as THREE from 'three'

// Soldier model with animation blending (Draco compressed: 2.1MB → 775KB)
function Soldier({ speed = 0 }: { speed: number }) {
  const group = useRef<THREE.Group>(null)
  // Second param enables Draco decoder from Google CDN
  const { scene, animations } = useGLTF('/models/Soldier.glb', true)
  const { actions } = useAnimations(animations, group)
  const [currentAction, setCurrentAction] = useState<string>('Idle')

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    let targetAction = 'Idle'
    if (speed > 0.5) targetAction = 'Run'
    else if (speed > 0.1) targetAction = 'Walk'

    if (targetAction !== currentAction && actions[targetAction]) {
      const current = actions[currentAction]
      const next = actions[targetAction]
      if (current) current.fadeOut(0.3)
      if (next) next.reset().fadeIn(0.3).play()
      setCurrentAction(targetAction)
    }
  }, [speed, currentAction, actions])

  useEffect(() => {
    if (actions['Idle']) actions['Idle'].play()
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
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 3 + Math.sin(i) * 0.5
        return (
          <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[Math.cos(angle) * radius, Math.sin(i * 0.5) * 0.5, Math.sin(angle) * radius]}>
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
      <meshStandardMaterial color="#0a0a0f" wireframe emissive="#22d3ee" emissiveIntensity={0.1} />
    </mesh>
  )
}

// Particle system
function Particles({ count = 50 }) {
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
        if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a855f7" transparent opacity={0.6} sizeAttenuation />
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

// Scene content - NO Environment preset (saves 1.7 MB)
function Scene({ animationSpeed }: { animationSpeed: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 2, -3]} color="#22d3ee" intensity={3} />
      <pointLight position={[3, 2, 3]} color="#a855f7" intensity={3} />
      <pointLight position={[0, 3, 0]} color="#ffffff" intensity={0.5} />
      <Soldier speed={animationSpeed} />
      <FloatingElements />
      <NeonGrid />
      <Particles count={50} />
      <CameraRig />
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

// Exported Three.js Canvas component
interface ThreeSceneProps {
  animationSpeed: number
  prefersReducedMotion: boolean
}

export function ThreeScene({ animationSpeed, prefersReducedMotion }: ThreeSceneProps) {
  return (
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
  )
}
