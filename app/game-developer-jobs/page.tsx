import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "game developer jobs", "game programmer jobs", "game development jobs"
export const metadata: Metadata = {
  title: "Game Developer Jobs | Game Programming Careers",
  description: "Find game developer jobs at top gaming studios. Browse programming positions including gameplay, engine, tools, graphics, and backend development.",
  keywords: "game developer jobs, game programmer jobs, game development jobs, unity developer jobs, unreal developer jobs",
  openGraph: {
    title: "Game Developer Jobs | Game Programming Careers",
    description: "Find game developer and programmer jobs at top studios.",
    type: "website",
    url: "https://mvp.actor/game-developer-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Developer Jobs | Game Programming Careers",
    description: "Find game developer jobs at top gaming studios.",
  },
  alternates: {
    canonical: "https://mvp.actor/game-developer-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/game-developer-jobs",
  "url": "https://mvp.actor/game-developer-jobs",
  "name": "Game Developer Jobs | Game Programming Careers",
  "description": "Find game developer jobs including gameplay, engine, and tools programming positions.",
};

const devRoles = [
  {
    title: "Gameplay Programmer",
    icon: "🎮",
    description: "Implement game mechanics, player controls, and interactive systems.",
    skills: ["C++/C#", "Game engines", "Physics", "AI systems"],
    avgSalary: "$70K-$140K",
  },
  {
    title: "Engine Programmer",
    icon: "⚙️",
    description: "Build and optimize game engine systems, rendering pipelines, and core tech.",
    skills: ["C++", "Low-level programming", "Optimization", "Graphics APIs"],
    avgSalary: "$90K-$180K",
  },
  {
    title: "Graphics Programmer",
    icon: "🎨",
    description: "Develop rendering systems, shaders, and visual effects.",
    skills: ["HLSL/GLSL", "Rendering pipelines", "Math", "GPU programming"],
    avgSalary: "$85K-$170K",
  },
  {
    title: "Tools Programmer",
    icon: "🛠️",
    description: "Create tools and pipelines that help other developers work efficiently.",
    skills: ["Python", "C++/C#", "UI development", "Pipeline design"],
    avgSalary: "$75K-$140K",
  },
  {
    title: "Network Programmer",
    icon: "🌐",
    description: "Build multiplayer systems, matchmaking, and server infrastructure.",
    skills: ["Networking protocols", "Distributed systems", "Security", "Backend"],
    avgSalary: "$80K-$160K",
  },
  {
    title: "AI Programmer",
    icon: "🤖",
    description: "Develop NPC behaviors, pathfinding, and decision-making systems.",
    skills: ["AI algorithms", "Machine learning", "Behavior trees", "Navigation"],
    avgSalary: "$80K-$160K",
  },
];

const languages = [
  { name: "C++", usage: "Engine, performance-critical systems", popularity: 95 },
  { name: "C#", usage: "Unity development, tools", popularity: 80 },
  { name: "Python", usage: "Tools, scripting, automation", popularity: 70 },
  { name: "Lua", usage: "Gameplay scripting", popularity: 45 },
  { name: "HLSL/GLSL", usage: "Shaders, graphics", popularity: 50 },
  { name: "Rust", usage: "Emerging for systems", popularity: 25 },
];

const engines = [
  { name: "Unreal Engine", description: "AAA game development, open source" },
  { name: "Unity", description: "Versatile, mobile to console" },
  { name: "Godot", description: "Open source, growing fast" },
  { name: "Custom/Proprietary", description: "Large studios often build their own" },
];

export default function GameDeveloperJobs() {
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
              <Link href="/games-jobs" className="hover:text-white transition-colors">Games Jobs</Link>
              <span className="mx-2">/</span>
              <span className="text-cyan-400">Game Developer</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Game Developer Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Build the Games Players Love</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Write the code that brings games to life. Find programming positions at studios
                building everything from indie hits to AAA blockbusters.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse Developer Jobs
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

        {/* Developer Roles */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Game Programming Specializations</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Game development offers diverse programming disciplines. Find your specialty.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devRoles.map((role) => (
                <div
                  key={role.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{role.icon}</span>
                      <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    </div>
                    <span className="text-cyan-400 text-sm font-medium">{role.avgSalary}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-cyan-600/20 text-cyan-400 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages & Engines */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Programming Languages</h2>
                <p className="text-slate-400 mb-8">
                  Most common languages used in game development.
                </p>
                <div className="space-y-4">
                  {languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-sm">{lang.name}</span>
                        <span className="text-slate-400 text-xs">{lang.usage}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${lang.popularity}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Game Engines</h2>
                <p className="text-slate-400 mb-8">
                  The most commonly used engines in the industry.
                </p>
                <div className="space-y-4">
                  {engines.map((engine) => (
                    <div key={engine.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-bold text-white mb-1">{engine.name}</h3>
                      <p className="text-slate-400 text-sm">{engine.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Board with Search & Filter */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Game Developer Job Board</h2>
              <p className="text-slate-400">Search and filter programming opportunities</p>
            </div>

            <FilteredJobsBoard
              filterType="developer"
              filteredSectionTitle="Developer & Programmer Jobs"
              allJobsSectionTitle="All Gaming Jobs"
              accentColor="cyan"
              searchPlaceholder="Search game developer jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* Career Path */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Game Developer Career Path</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-cyan-500 text-white text-xs px-2 py-1 rounded">Entry</span>
                <h3 className="font-bold text-white mt-2 mb-2">Junior Developer</h3>
                <p className="text-slate-400 text-sm">0-2 years. Learning codebase, fixing bugs, implementing features.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">Mid</span>
                <h3 className="font-bold text-white mt-2 mb-2">Game Developer</h3>
                <p className="text-slate-400 text-sm">3-5 years. Own systems, collaborate across teams, mentor juniors.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs px-2 py-1 rounded">Senior</span>
                <h3 className="font-bold text-white mt-2 mb-2">Senior Developer</h3>
                <p className="text-slate-400 text-sm">5-8 years. Architect systems, lead initiatives, solve hard problems.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-violet-500 text-white text-xs px-2 py-1 rounded">Lead</span>
                <h3 className="font-bold text-white mt-2 mb-2">Lead/Principal</h3>
                <p className="text-slate-400 text-sm">8+ years. Technical vision, team leadership, studio-wide impact.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-cyan-600/20 via-slate-900 to-blue-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Code Games?
            </h2>
            <p className="text-slate-300 mb-8">
              Find programming roles at studios building the next generation of games.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
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
              <Link href="/game-designer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Designer Jobs</h3>
                <p className="text-slate-400 text-sm">Design roles.</p>
              </Link>
              <Link href="/game-artist-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Artist Jobs</h3>
                <p className="text-slate-400 text-sm">Art & animation.</p>
              </Link>
              <Link href="/game-tester-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Tester Jobs</h3>
                <p className="text-slate-400 text-sm">QA positions.</p>
              </Link>
              <Link href="/video-game-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">All Gaming Jobs</h3>
                <p className="text-slate-400 text-sm">Browse all positions.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
