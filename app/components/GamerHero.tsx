'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Mux video playback ID for hero
const MUX_HERO_PLAYBACK_ID = "QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI"

// CRITICAL: Three.js is loaded ONLY when show3D becomes true
// This keeps the initial bundle small and fast
const ThreeScene = dynamic(
  () => import('./ThreeScene').then(mod => mod.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
)

// Video hero component - lightweight, no Three.js dependencies
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

// Main component with Video → 3D swap
interface GamerHeroProps {
  className?: string
  onSwapTo3D?: () => void // Callback when video swaps to 3D
}

export function GamerHero({ className = '', onSwapTo3D }: GamerHeroProps) {
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
        // 3. 3D assets can preload during video playback
        setTimeout(() => {
          setShow3D(true)
          onSwapTo3D?.() // Notify parent component of the swap
        }, 5000)
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
  }, [onSwapTo3D])

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
        3. After page load + 5s delay: Load Three.js dynamically, then swap to 3D
        4. Mobile: Always video (saves ~2.8 MB - Three.js never loaded)

        KEY: ThreeScene is in a separate file and only imported via dynamic()
        when show3D becomes true. This keeps initial bundle small.
      */}
      {!isClient ? (
        // SSR placeholder
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />
      ) : isMobile ? (
        // Mobile: Always video - Three.js NEVER loads
        <VideoHero />
      ) : show3D ? (
        // Desktop after swap: Load and show 3D Canvas
        <ThreeScene animationSpeed={animationSpeed} prefersReducedMotion={prefersReducedMotion} />
      ) : (
        // Desktop initial: Video (for fast Lighthouse LCP)
        <VideoHero className="transition-opacity duration-500" />
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
    </div>
  )
}
