import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { esportsJobs } from "../../lib/jobs-data";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "games jobs", "game jobs", "gaming jobs"
export const metadata: Metadata = {
  title: "Games Jobs | Find Your Career in Gaming",
  description: "Search games jobs across development, design, art, production, esports and more. Browse opportunities at top gaming studios and publishers worldwide.",
  keywords: "games jobs, game jobs, gaming jobs, games industry jobs, video game careers",
  openGraph: {
    title: "Games Jobs | Find Your Career in Gaming",
    description: "Search games jobs at top gaming studios and publishers worldwide.",
    type: "website",
    url: "https://mvp.actor/games-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Games Jobs | Find Your Career in Gaming",
    description: "Search games jobs at top gaming studios worldwide.",
  },
  alternates: {
    canonical: "https://mvp.actor/games-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/games-jobs",
  "url": "https://mvp.actor/games-jobs",
  "name": "Games Jobs | Gaming Industry Careers",
  "description": "Search games jobs across development, design, art, production and esports.",
};

const jobTypes = [
  {
    title: "Development",
    description: "Programming, engineering, and technical roles",
    link: "/game-developer-jobs",
    icon: "💻"
  },
  {
    title: "Design",
    description: "Game design, level design, systems design",
    link: "/game-designer-jobs",
    icon: "🎮"
  },
  {
    title: "Art",
    description: "2D/3D art, animation, concept art, VFX",
    link: "/game-artist-jobs",
    icon: "🎨"
  },
  {
    title: "Production",
    description: "Producers, project managers, operations",
    link: "/game-producer-jobs",
    icon: "📋"
  },
  {
    title: "QA Testing",
    description: "Quality assurance and testing roles",
    link: "/game-tester-jobs",
    icon: "🔍"
  },
  {
    title: "Esports",
    description: "Esports industry specific positions",
    link: "/esports-jobs",
    icon: "🏆"
  },
];

export default function GamesJobs() {
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
              poster={getMuxThumbnailUrl(MUX_VIDEOS.ESPORTS_1, 2)}
              className="w-full h-full object-cover"
            >
              <source src={getMuxStreamUrl(MUX_VIDEOS.ESPORTS_1)} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <nav className="text-sm mb-8 text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-green-400">Games Jobs</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Games Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Find Your Career in Gaming</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Your central hub for games industry careers. Browse jobs across game development,
                design, art, production, esports, and more at top studios worldwide.
              </p>

              <div className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-8">
                {esportsJobs.length} games jobs currently listed
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse All Jobs
                </Link>
                <Link
                  href="/entry-level-gaming-jobs"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-green-500 transition-all"
                >
                  Entry Level
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Job Types Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Browse Games Jobs by Type</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobTypes.map((type) => (
                <Link
                  key={type.title}
                  href={type.link}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-green-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{type.icon}</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                      {type.title}
                    </h3>
                  </div>
                  <p className="text-slate-400">{type.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Board with Search & Filter */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Games Job Board</h2>
              <p className="text-slate-400">Search and filter gaming opportunities</p>
            </div>

            <FilteredJobsBoard
              accentColor="green"
              searchPlaceholder="Search games jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* Why Choose Gaming */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Why Work in Games?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-4">🎮</div>
                <h3 className="text-lg font-bold text-white mb-2">Creative Industry</h3>
                <p className="text-slate-400 text-sm">Work on products you're passionate about alongside creative minds.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="text-lg font-bold text-white mb-2">Growing Sector</h3>
                <p className="text-slate-400 text-sm">Gaming is a $200B+ industry with consistent year-on-year growth.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-4">🌍</div>
                <h3 className="text-lg font-bold text-white mb-2">Global Opportunities</h3>
                <p className="text-slate-400 text-sm">Work remotely or at studios worldwide. Gaming is truly global.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="text-lg font-bold text-white mb-2">Competitive Salaries</h3>
                <p className="text-slate-400 text-sm">Tech-competitive compensation with unique industry perks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600/20 via-slate-900 to-emerald-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Games Career?
            </h2>
            <p className="text-slate-300 mb-8">
              Browse games jobs from leading studios and publishers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse All Jobs
              </Link>
              <Link
                href="/gaming-recruitment-agency"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-green-500 transition-all"
              >
                Find Recruiters
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Explore More</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Link href="/video-game-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Video Game Jobs</h3>
                <p className="text-slate-400 text-sm">Game development careers.</p>
              </Link>
              <Link href="/esports-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Esports Jobs</h3>
                <p className="text-slate-400 text-sm">Competitive gaming careers.</p>
              </Link>
              <Link href="/igaming-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">iGaming Jobs</h3>
                <p className="text-slate-400 text-sm">Online gaming & betting.</p>
              </Link>
              <Link href="/how-to-get-into-esports" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Career Guide</h3>
                <p className="text-slate-400 text-sm">How to break into gaming.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
