'use client'

import { useState, useRef, useEffect } from 'react'
import Hls from 'hls.js'

interface LazyMuxVideoProps {
  playbackId: string
  className?: string
  thumbnailTime?: number
  overlay?: React.ReactNode
}

/**
 * Lazy-loading Mux video background that only loads the HLS stream
 * when the component is scrolled into view.
 *
 * 1. Shows Mux thumbnail initially (fast, just an image)
 * 2. When scrolled into viewport, initializes HLS stream
 * 3. Autoplays muted (for background video use)
 */
export function LazyMuxVideo({
  playbackId,
  className = '',
  thumbnailTime = 2,
  overlay
}: LazyMuxVideoProps) {
  const [isInView, setIsInView] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.webp?time=${thumbnailTime}`
  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`

  // Detect when component enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Initialize HLS when in view
  useEffect(() => {
    if (!isInView || !videoRef.current) return

    const video = videoRef.current

    // Native HLS support (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl
      video.addEventListener('loadeddata', () => setIsVideoReady(true))
      video.play().catch(() => {})
    }
    // Use hls.js for other browsers
    else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      })
      hlsRef.current = hls

      hls.loadSource(streamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsVideoReady(true)
        video.play().catch(() => {})
      })
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [isInView, streamUrl])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Thumbnail (always shown as base layer) */}
      <img
        src={thumbnailUrl}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoReady ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
        decoding="async"
      />

      {/* Video (loaded when in view) */}
      {isInView && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Optional overlay (gradients, content, etc.) */}
      {overlay}
    </div>
  )
}
