import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "video game jobs", "video game careers", "video game industry jobs"
export const metadata: Metadata = {
  title: "Video Game Jobs | Careers in the Gaming Industry",
  description: "Find video game jobs in development, design, art, production, marketing and more. Browse careers at top gaming studios and publishers worldwide.",
  keywords: "video game jobs, video game careers, game industry jobs, gaming careers, game development jobs",
  openGraph: {
    title: "Video Game Jobs | Careers in the Gaming Industry",
    description: "Find video game jobs in development, design, art, production and more.",
    type: "website",
    url: "https://mvp.actor/video-game-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Game Jobs | Careers in the Gaming Industry",
    description: "Find video game jobs at top gaming studios worldwide.",
  },
  alternates: {
    canonical: "https://mvp.actor/video-game-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/video-game-jobs",
  "url": "https://mvp.actor/video-game-jobs",
  "name": "Video Game Jobs | Gaming Industry Careers",
  "description": "Find video game jobs in development, design, art, production and marketing.",
};

const careerPaths = [
  {
    title: "Game Development",
    icon: "💻",
    roles: ["Programmer", "Engine Developer", "Tools Developer", "Technical Director"],
    description: "Build the technical foundations of games, from gameplay mechanics to rendering engines.",
    color: "cyan",
  },
  {
    title: "Game Design",
    icon: "🎮",
    roles: ["Game Designer", "Level Designer", "Systems Designer", "Narrative Designer"],
    description: "Create the rules, mechanics, and experiences that make games engaging.",
    color: "purple",
  },
  {
    title: "Art & Animation",
    icon: "🎨",
    roles: ["Concept Artist", "3D Artist", "Animator", "Technical Artist"],
    description: "Bring games to life with stunning visuals, characters, and animations.",
    color: "pink",
  },
  {
    title: "Audio",
    icon: "🎵",
    roles: ["Sound Designer", "Composer", "Audio Programmer", "Voice Director"],
    description: "Create immersive soundscapes, music, and audio experiences.",
    color: "amber",
  },
  {
    title: "Production",
    icon: "📋",
    roles: ["Producer", "Project Manager", "Scrum Master", "Studio Manager"],
    description: "Keep projects on track, manage teams, and deliver games on time.",
    color: "green",
  },
  {
    title: "QA & Testing",
    icon: "🔍",
    roles: ["QA Tester", "QA Lead", "Automation QA", "Compliance Tester"],
    description: "Ensure games are polished, bug-free, and ready for players.",
    color: "orange",
  },
];

const topStudios = [
  { name: "Rockstar Games", known: "GTA, Red Dead Redemption" },
  { name: "Naughty Dog", known: "The Last of Us, Uncharted" },
  { name: "CD Projekt Red", known: "The Witcher, Cyberpunk 2077" },
  { name: "Riot Games", known: "League of Legends, Valorant" },
  { name: "Santa Monica Studio", known: "God of War" },
  { name: "FromSoftware", known: "Elden Ring, Dark Souls" },
  { name: "Insomniac Games", known: "Spider-Man, Ratchet & Clank" },
  { name: "Respawn Entertainment", known: "Apex Legends, Star Wars Jedi" },
];

export default function VideoGameJobs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UnifiedHeader activeSite="jobs" siteNavItems={JOBS_SITE_NAV_ITEMS} ctaLabel="Post a Job" ctaHref="/contact" />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={getMuxThumbnailUrl(MUX_VIDEOS.GAMING, 2)}
              className="w-full h-full object-cover"
            >
              <source src={getMuxStreamUrl(MUX_VIDEOS.GAMING)} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <nav className="text-sm mb-8 text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-cyan-400">Video Game Jobs</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Video Game Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Turn Your Passion Into a Career</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Explore careers in the video game industry. From game development and design to art,
                audio, and production - find your perfect role in gaming.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse All Jobs
                </Link>
                <Link
                  href="/how-to-get-into-esports"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-cyan-500 transition-all"
                >
                  Career Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Career Paths */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Video Game Career Paths</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              The video game industry offers diverse career opportunities across creative, technical,
              and business disciplines. Explore the main career paths below.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerPaths.map((path) => (
                <div
                  key={path.title}
                  className={`bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-${path.color}-500/50 transition-all`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{path.icon}</span>
                    <h3 className="text-xl font-bold text-white">{path.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{path.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {path.roles.map((role) => (
                      <span
                        key={role}
                        className={`px-2 py-1 bg-${path.color}-600/20 text-${path.color}-400 text-xs rounded`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Board with Search & Filter */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Video Game Job Board</h2>
              <p className="text-slate-400">Search and filter gaming opportunities</p>
            </div>

            <FilteredJobsBoard
              accentColor="cyan"
              searchPlaceholder="Search video game jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* Top Studios */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Top Video Game Studios</h2>
            <p className="text-slate-400 mb-8 max-w-3xl">
              These are some of the most sought-after game studios to work for:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topStudios.map((studio) => (
                <div key={studio.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-bold text-white mb-1">{studio.name}</h3>
                  <p className="text-slate-400 text-xs">{studio.known}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-cyan-600/20 via-slate-900 to-purple-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your Video Game Career
            </h2>
            <p className="text-slate-300 mb-8">
              Browse open positions at top gaming studios and publishers worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse All Jobs
              </Link>
              <Link
                href="/entry-level-gaming-jobs"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-cyan-500 transition-all"
              >
                Entry Level Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Explore More</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Link href="/game-tester-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Tester Jobs</h3>
                <p className="text-slate-400 text-sm">QA testing opportunities.</p>
              </Link>
              <Link href="/game-designer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Designer Jobs</h3>
                <p className="text-slate-400 text-sm">Design roles in gaming.</p>
              </Link>
              <Link href="/game-developer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Developer Jobs</h3>
                <p className="text-slate-400 text-sm">Programming positions.</p>
              </Link>
              <Link href="/game-artist-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Artist Jobs</h3>
                <p className="text-slate-400 text-sm">Art & animation roles.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
