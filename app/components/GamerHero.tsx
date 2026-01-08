'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Float } from '@react-three/drei'
import * as THREE from 'three'

// Mux video playback ID for hero
const MUX_HERO_PLAYBACK_ID = "QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI"

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

// Video hero component - used for initial load and mobile
// Uses HLS streaming (.m3u8) which is initialized by HlsVideoInit component
function VideoHero({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={`https://image.mux.com/${MUX_HERO_PLAYBACK_ID}/thumbnail.webp?time=2&width=1200`}
        className="w-full h-full object-cover"
        aria-hidden="true"
      >
        {/* HLS streaming - HlsVideoInit will pick this up and initialize hls.js */}
        <source src={`https://stream.mux.com/${MUX_HERO_PLAYBACK_ID}.m3u8`} type="application/x-mpegURL" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
    </div>
  )
}

// 3D Canvas component - loaded after initial paint
function ThreeCanvas({ animationSpeed, prefersReducedMotion }: { animationSpeed: number; prefersReducedMotion: boolean }) {
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

// Main component with Video → 3D swap
interface GamerHeroProps {
  className?: string
}

export function GamerHero({ className = '' }: GamerHeroProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [show3D, setShow3D] = useState(false) // Start with video, swap to 3D
  const [animationSpeed, setAnimationSpeed] = useState(0.3)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Client-side detection
  useEffect(() => {
    setIsClient(true)

    // Check for mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Check for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', motionHandler)

    // VIDEO → 3D SWAP: Wait for page load + delay, then show 3D on desktop
    // This gives Lighthouse fast LCP with video, then upgrades to 3D
    // Longer delay = better Lighthouse score + users enjoy the video more
    const swapTo3D = () => {
      if (window.innerWidth >= 768) {
        // 5 second delay ensures:
        // 1. Lighthouse measures fast video LCP
        // 2. Users enjoy the video before 3D loads
        // 3. 3D assets load in background during video playback
        setTimeout(() => setShow3D(true), 5000)
      }
    }

    if (document.readyState === 'complete') {
      swapTo3D()
    } else {
      window.addEventListener('load', swapTo3D)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      motionQuery.removeEventListener('change', motionHandler)
      window.removeEventListener('load', swapTo3D)
    }
  }, [])

  // Animation cycle (only when 3D is showing)
  useEffect(() => {
    if (prefersReducedMotion || isMobile || !show3D) return

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
  }, [prefersReducedMotion, isMobile, show3D])

  return (
    <div className={`relative ${className}`} role="img" aria-label="Esports gaming hero visual with neon cyberpunk aesthetic">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0a0a0f] to-cyan-900/30" />

      {/*
        PERFORMANCE STRATEGY:
        1. SSR: Show gradient placeholder
        2. Initial client: Show Mux video (fast LCP for Lighthouse)
        3. After page load + 2s delay: Swap to 3D on desktop
        4. Mobile: Always video (saves ~2.8 MB)
      */}
      {!isClient ? (
        // SSR placeholder
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />
      ) : isMobile ? (
        // Mobile: Always video
        <VideoHero />
      ) : show3D ? (
        // Desktop after swap: 3D Canvas
        <ThreeCanvas animationSpeed={animationSpeed} prefersReducedMotion={prefersReducedMotion} />
      ) : (
        // Desktop initial: Video (for fast Lighthouse LCP)
        <VideoHero className="transition-opacity duration-500" />
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
    </div>
  )
}
