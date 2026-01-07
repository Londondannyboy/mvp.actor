'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Hls from 'hls.js'

interface CompanyInfo {
  name: string
  description?: string
  culture?: string
  achievements?: string[]
  logo?: string
  careers_url?: string
}

interface CompanyShowcaseCardProps {
  company: CompanyInfo
  index: number
  jobCount?: number
}

// Mux video IDs for company backgrounds
const MUX_IDS = [
  "A6OZmZy02Y00K4ZPyHuyfTVXoauVjLhiHlbR2bLqtBywY",
  "QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI",
  "XlLTzFXbHCKseOjTNG7fHlpOrXOKUD9d5p36lX1I00G4",
  "Bg101Cs02gDzFyCjjz01ILN3lkmZqRtkKQBHpVcfOCb5uU",
]

// Premium gradient colors for company logos
const COMPANY_GRADIENTS: Record<string, string> = {
  "riot games": "from-red-600 via-red-500 to-orange-500",
  "team liquid": "from-blue-600 via-blue-500 to-cyan-400",
  "fnatic": "from-orange-500 via-orange-400 to-yellow-400",
  "cloud9": "from-cyan-500 via-blue-500 to-blue-600",
  "g2 esports": "from-red-600 via-black to-red-600",
  "100 thieves": "from-red-600 via-red-500 to-black",
  "faze clan": "from-red-600 via-red-500 to-pink-500",
  "tsm": "from-gray-800 via-gray-700 to-black",
  "evil geniuses": "from-blue-700 via-blue-600 to-cyan-500",
  "sentinels": "from-red-600 via-red-500 to-pink-600",
  "nrg": "from-orange-500 via-red-500 to-pink-500",
}

// Get gradient or default purple/cyan
function getCompanyGradient(companyName: string): string {
  const key = companyName.toLowerCase()
  return COMPANY_GRADIENTS[key] || "from-purple-600 via-purple-500 to-cyan-500"
}

// Get initials for logo
function getInitials(name: string): string {
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

/**
 * Company Showcase Card - Premium company presentation
 * - HLS video background
 * - Animated glowing logo
 * - "Why work here" culture snippet
 * - Achievement badges
 */
export function CompanyShowcaseCard({ company, index, jobCount }: CompanyShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const muxId = MUX_IDS[index % MUX_IDS.length]
  const hlsUrl = `https://stream.mux.com/${muxId}.m3u8`
  const thumbnailUrl = `https://image.mux.com/${muxId}/thumbnail.webp?time=${(index % 5) + 1}&width=600`
  const gradient = getCompanyGradient(company.name)
  const initials = getInitials(company.name)

  // Initialize HLS video
  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl
      video.addEventListener('loadeddata', () => setVideoReady(true))
      video.play().catch(() => {})
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false })
      hlsRef.current = hls
      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setVideoReady(true)
        video.play().catch(() => {})
      })
    }

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [hlsUrl])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl group"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <img
          src={thumbnailUrl}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      </div>

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: isHovered
            ? '0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 30px rgba(34, 211, 238, 0.2)'
            : '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 0px rgba(34, 211, 238, 0)'
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Border */}
      <div className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-300 ${
        isHovered ? 'border-purple-500' : 'border-purple-500/30'
      }`} />

      {/* Content */}
      <div className="relative z-10 p-6 min-h-[220px] flex flex-col">
        {/* Company badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-purple-500/30 border border-purple-500/50 rounded text-[10px] font-semibold text-purple-300 uppercase tracking-wider">
          Featured Company
        </div>

        {/* Logo + Name */}
        <div className="flex items-center gap-4 mb-4">
          {/* Animated gradient logo with glow effect */}
          <motion.div
            className="relative"
            animate={{
              filter: isHovered
                ? 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 50px rgba(34, 211, 238, 0.5))'
                : 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.5))'
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl border-2 border-white/20`}
              animate={{
                scale: isHovered ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
            >
              {initials}
            </motion.div>
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-white/40"
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? [0.5, 0, 0.5] : 0,
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-white">{company.name}</h2>
            {jobCount && (
              <p className="text-cyan-400 text-sm font-medium">{jobCount} open position{jobCount !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>

        {/* Why work here */}
        {(company.culture || company.description) && (
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {company.culture || company.description}
          </p>
        )}

        {/* Achievements */}
        {company.achievements && company.achievements.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {company.achievements.slice(0, 2).map((achievement, i) => (
              <span
                key={i}
                className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1"
              >
                <span>🏆</span>
                {achievement}
              </span>
            ))}
          </div>
        )}

        {/* View jobs link */}
        {company.careers_url && (
          <motion.a
            href={company.careers_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            className="absolute bottom-4 right-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-purple-500/30 transition-colors"
          >
            View Careers →
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}
