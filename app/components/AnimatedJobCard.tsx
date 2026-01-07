'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Hls from 'hls.js'
import { getVideoForIndex, getMuxThumbnailUrl } from '@/lib/mux-config'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  url: string
}

interface AnimatedJobCardProps {
  job: Job
  index: number
}

/**
 * HIGH ENERGY animated job card with video background
 * - Mux HLS video plays on hover
 * - Entrance animations with stagger
 * - Neon glow effects
 * - That esports broadcast production vibe
 */
export function AnimatedJobCard({ job, index }: AnimatedJobCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  // Each card gets a different video from the rotation
  const playbackId = getVideoForIndex(index)
  const thumbnailUrl = getMuxThumbnailUrl(playbackId, index % 5 + 1)
  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`

  // Initialize HLS when hovered
  useEffect(() => {
    if (!isHovered || !videoRef.current) return

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
      setIsVideoReady(false)
    }
  }, [isHovered, streamUrl])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-xl group cursor-pointer"
    >
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        {/* Thumbnail base layer */}
        <img
          src={thumbnailUrl}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Video layer (loads on hover) */}
        {isHovered && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-cyan-900/30" />
      </div>

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isHovered
            ? '0 0 30px rgba(34, 211, 238, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.2)'
            : '0 0 0px rgba(34, 211, 238, 0), inset 0 0 0px rgba(168, 85, 247, 0)'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Border */}
      <div className={`absolute inset-0 rounded-xl border-2 transition-colors duration-300 ${
        isHovered ? 'border-cyan-400' : 'border-gray-700/50'
      }`} />

      {/* Content */}
      <div className="relative z-10 p-5 min-h-[180px] flex flex-col">
        {/* Company badge */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            {job.company.charAt(0)}
          </motion.div>
          <div>
            <p className="text-cyan-400 font-semibold text-sm tracking-wide">{job.company}</p>
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {job.location}
            </p>
          </div>
        </div>

        {/* Job title */}
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {job.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <motion.span
            className="text-xs bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full border border-purple-500/50"
            whileHover={{ scale: 1.05 }}
          >
            {job.type}
          </motion.span>
          {job.salary && (
            <span className="text-xs text-gray-400">{job.salary}</span>
          )}
        </div>

        {/* View job button - appears on hover */}
        {job.url && (
          <motion.a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 right-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-lg shadow-lg shadow-cyan-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            Apply Now
          </motion.a>
        )}
      </div>

      {/* Pulse effect on load */}
      <motion.div
        className="absolute inset-0 bg-cyan-400/20 rounded-xl"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      />
    </motion.div>
  )
}

// Job Cards Grid with entrance animation
interface JobCardsGridProps {
  jobs: Job[]
  query?: string
}

export function AnimatedJobCardsGrid({ jobs, query }: JobCardsGridProps) {
  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {query && (
        <motion.div
          className="flex items-center gap-2 text-cyan-400 font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </motion.div>
      )}

      <div className="grid gap-4">
        {jobs.map((job, i) => (
          <AnimatedJobCard key={job.id || i} job={job} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

// Loading skeleton with animation
export function JobCardsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-cyan-400">
        <motion.div
          className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="font-medium">Searching for opportunities...</span>
      </div>

      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/50 p-5 h-[180px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
              <div className="w-16 h-3 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-3/4 h-5 bg-gray-700 rounded animate-pulse mb-2" />
          <div className="w-1/2 h-5 bg-gray-700 rounded animate-pulse" />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      ))}
    </div>
  )
}
