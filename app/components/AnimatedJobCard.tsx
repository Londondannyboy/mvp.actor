'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Hls from 'hls.js'
import { CompanyShowcaseCard } from './CompanyShowcaseCard'

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

// Mux playback IDs for variety
const MUX_IDS = [
  "A6OZmZy02Y00K4ZPyHuyfTVXoauVjLhiHlbR2bLqtBywY",
  "QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI",
  "XlLTzFXbHCKseOjTNG7fHlpOrXOKUD9d5p36lX1I00G4",
  "Bg101Cs02gDzFyCjjz01ILN3lkmZqRtkKQBHpVcfOCb5uU",
]

// Background types for A/B testing
type BgType = 'hls' | 'gif' | 'webp' | 'jpeg'
const BG_TYPES: BgType[] = ['hls', 'gif', 'webp', 'jpeg']

/**
 * HIGH ENERGY animated job card - A/B testing backgrounds
 * - Card 0, 4, 8...  = HLS video (best quality, streams)
 * - Card 1, 5, 9...  = Animated GIF (motion, no JS needed)
 * - Card 2, 6, 10... = WebP image (modern, small)
 * - Card 3, 7, 11... = JPEG image (universal)
 */
export function AnimatedJobCard({ job, index }: AnimatedJobCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const muxId = MUX_IDS[index % MUX_IDS.length]
  const bgType = BG_TYPES[index % 4]

  // Mux URLs
  const hlsUrl = `https://stream.mux.com/${muxId}.m3u8`
  const gifUrl = `https://image.mux.com/${muxId}/animated.gif?start=0&end=4&width=400&fps=15`
  const webpUrl = `https://image.mux.com/${muxId}/thumbnail.webp?time=${(index % 5) + 1}&width=400`
  const jpegUrl = `https://image.mux.com/${muxId}/thumbnail.jpg?time=${(index % 5) + 1}&width=400`

  // Initialize HLS video
  useEffect(() => {
    if (bgType !== 'hls' || !videoRef.current) return

    const video = videoRef.current

    // Safari native HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl
      video.addEventListener('loadeddata', () => setVideoReady(true))
      video.play().catch(() => {})
    }
    // Other browsers via hls.js
    else if (Hls.isSupported()) {
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
  }, [bgType, hlsUrl])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-xl group cursor-pointer"
    >
      {/* A/B Test: Different background types */}
      <div className="absolute inset-0 bg-gray-900">
        {bgType === 'hls' && (
          <>
            {/* Fallback thumbnail while video loads */}
            <img
              src={webpUrl}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
            />
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        )}

        {bgType === 'gif' && (
          <img
            src={gifUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}

        {bgType === 'webp' && (
          <img
            src={webpUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}

        {bgType === 'jpeg' && (
          <img
            src={jpegUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        {/* Type indicator badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-mono text-gray-400 uppercase">
          {bgType}
        </div>
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

// Company data for "why work here" content
const COMPANY_DATA: Record<string, { description: string; culture: string; achievements: string[] }> = {
  "riot games": {
    description: "Developer of League of Legends and Valorant. Operates major global esports leagues.",
    culture: "Player-focused company culture with strong emphasis on competitive integrity and esports production quality.",
    achievements: ["World's largest esports viewership", "Worlds Championship", "VCT Champions"]
  },
  "cloud9": {
    description: "Major North American esports organization competing in League of Legends, Valorant, CS2.",
    culture: "Content-focused organization known for developing talent and strong community engagement.",
    achievements: ["Only NA team to reach Worlds semifinals", "CS Major Champions"]
  },
  "fnatic": {
    description: "Premier esports organization based in London with successful teams across multiple titles.",
    culture: "European esports pioneer with strong brand identity and performance-driven culture.",
    achievements: ["League of Legends World Champions 2011", "Multiple Major wins"]
  },
  "team liquid": {
    description: "One of the world's leading esports organizations with teams across multiple games.",
    culture: "Known for player development and long-term partnerships with top sponsors.",
    achievements: ["Multiple TI wins in Dota 2", "LCS Championships"]
  },
}

function getCompanyData(companyName: string) {
  const key = companyName.toLowerCase()
  return COMPANY_DATA[key] || null
}

// Group jobs by company
function groupJobsByCompany(jobs: Job[]): Map<string, Job[]> {
  const groups = new Map<string, Job[]>()
  for (const job of jobs) {
    const existing = groups.get(job.company) || []
    existing.push(job)
    groups.set(job.company, existing)
  }
  return groups
}

// Job Cards Grid - now with Company Card → Job Card layout
interface JobCardsGridProps {
  jobs: Job[]
  query?: string
}

export function AnimatedJobCardsGrid({ jobs, query }: JobCardsGridProps) {
  const groupedJobs = groupJobsByCompany(jobs)
  let companyIndex = 0

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
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} at {groupedJobs.size} compan{groupedJobs.size !== 1 ? 'ies' : 'y'}
        </motion.div>
      )}

      {/* Render Company Card → Job Cards for each company */}
      <div className="space-y-6">
        {Array.from(groupedJobs.entries()).map(([companyName, companyJobs], groupIdx) => {
          const companyData = getCompanyData(companyName)

          return (
            <div key={companyName} className="space-y-3">
              {/* Company Showcase Card */}
              <CompanyShowcaseCard
                company={{
                  name: companyName,
                  description: companyData?.description,
                  culture: companyData?.culture,
                  achievements: companyData?.achievements,
                }}
                index={groupIdx}
                jobCount={companyJobs.length}
              />

              {/* Job Cards for this company */}
              {companyJobs.map((job, jobIdx) => (
                <AnimatedJobCard
                  key={job.id || `${companyName}-${jobIdx}`}
                  job={job}
                  index={groupIdx * 10 + jobIdx}
                />
              ))}
            </div>
          )
        })}
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
