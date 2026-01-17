import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "game designer jobs", "game design jobs", "video game designer jobs"
export const metadata: Metadata = {
  title: "Game Designer Jobs | Game Design Careers",
  description: "Find game designer jobs at top gaming studios. Browse game design positions including level design, systems design, narrative design, and more.",
  keywords: "game designer jobs, game design jobs, video game designer jobs, level designer jobs, systems designer jobs",
  openGraph: {
    title: "Game Designer Jobs | Game Design Careers",
    description: "Find game designer jobs and game design positions at top studios.",
    type: "website",
    url: "https://mvp.actor/game-designer-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Designer Jobs | Game Design Careers",
    description: "Find game designer jobs at top gaming studios.",
  },
  alternates: {
    canonical: "https://mvp.actor/game-designer-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/game-designer-jobs",
  "url": "https://mvp.actor/game-designer-jobs",
  "name": "Game Designer Jobs | Game Design Careers",
  "description": "Find game designer jobs including level design, systems design, and narrative design roles.",
};

const designRoles = [
  {
    title: "Game Designer",
    icon: "🎮",
    description: "Define core gameplay mechanics, rules, and player experiences. Create documentation and prototypes.",
    skills: ["Game mechanics", "Documentation", "Prototyping", "Player psychology"],
    avgSalary: "$60K-$120K",
  },
  {
    title: "Level Designer",
    icon: "🗺️",
    description: "Design and build game levels, environments, and player progression paths.",
    skills: ["Level editors", "3D spatial awareness", "Pacing", "Environmental storytelling"],
    avgSalary: "$55K-$100K",
  },
  {
    title: "Systems Designer",
    icon: "⚙️",
    description: "Design game systems including economy, progression, combat, and AI behavior.",
    skills: ["System thinking", "Data analysis", "Balance", "Math"],
    avgSalary: "$70K-$130K",
  },
  {
    title: "Narrative Designer",
    icon: "📖",
    description: "Craft stories, dialogue, and narrative structures that integrate with gameplay.",
    skills: ["Writing", "Storytelling", "Dialog systems", "World building"],
    avgSalary: "$55K-$95K",
  },
  {
    title: "Combat Designer",
    icon: "⚔️",
    description: "Design combat systems, weapons, abilities, and enemy encounters.",
    skills: ["Action games", "Animation timing", "Balance", "Feel"],
    avgSalary: "$65K-$110K",
  },
  {
    title: "UX Designer",
    icon: "📱",
    description: "Design user interfaces, menus, HUD elements, and player onboarding.",
    skills: ["UI/UX principles", "Wireframing", "User research", "Accessibility"],
    avgSalary: "$65K-$115K",
  },
];

const requiredSkills = [
  { skill: "Game Design Documentation", level: 95 },
  { skill: "Prototyping & Iteration", level: 90 },
  { skill: "Player Psychology", level: 85 },
  { skill: "Balance & Tuning", level: 85 },
  { skill: "Communication", level: 90 },
  { skill: "Problem Solving", level: 88 },
];

const tools = [
  { name: "Unity", description: "Game engine for prototyping" },
  { name: "Unreal Engine", description: "AAA game development" },
  { name: "Miro/Figma", description: "Documentation and wireframes" },
  { name: "Excel/Sheets", description: "Balance and data modeling" },
  { name: "Notion/Confluence", description: "Design documentation" },
  { name: "Machinations", description: "Systems modeling" },
];

export default function GameDesignerJobs() {
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
              <span className="text-purple-400">Game Designer</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                  Game Designer Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Create the Experiences Players Love</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Shape how games play, feel, and engage players. Find game design positions at studios
                creating the next generation of interactive experiences.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse Designer Jobs
                </Link>
                <Link
                  href="/how-to-get-into-esports"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-purple-500 transition-all"
                >
                  Career Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Design Roles */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Game Design Specializations</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Game design encompasses many disciplines. Find the specialization that matches your interests.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designRoles.map((role) => (
                <div
                  key={role.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{role.icon}</span>
                      <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    </div>
                    <span className="text-purple-400 text-sm font-medium">{role.avgSalary}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded"
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

        {/* Skills Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Essential Skills</h2>
                <p className="text-slate-400 mb-8">
                  Successful game designers combine creative vision with analytical thinking and strong communication.
                </p>
                <div className="space-y-4">
                  {requiredSkills.map((item) => (
                    <div key={item.skill}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white text-sm">{item.skill}</span>
                        <span className="text-purple-400 text-sm">{item.level}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Tools & Software</h2>
                <p className="text-slate-400 mb-8">
                  Game designers use a variety of tools for prototyping, documentation, and collaboration.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {tools.map((tool) => (
                    <div key={tool.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-bold text-white mb-1">{tool.name}</h3>
                      <p className="text-slate-400 text-xs">{tool.description}</p>
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
              <h2 className="text-3xl font-bold text-white mb-2">Game Designer Job Board</h2>
              <p className="text-slate-400">Search and filter design opportunities</p>
            </div>

            <FilteredJobsBoard
              filterType="designer"
              filteredSectionTitle="Game Design Jobs"
              allJobsSectionTitle="All Gaming Jobs"
              accentColor="purple"
              searchPlaceholder="Search game designer jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* Career Path */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Game Designer Career Path</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">Entry</span>
                <h3 className="font-bold text-white mt-2 mb-2">Junior Designer</h3>
                <p className="text-slate-400 text-sm">0-2 years experience. Learning fundamentals, supporting senior designers.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-violet-500 text-white text-xs px-2 py-1 rounded">Mid</span>
                <h3 className="font-bold text-white mt-2 mb-2">Game Designer</h3>
                <p className="text-slate-400 text-sm">3-5 years. Own features, collaborate with teams, create documentation.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs px-2 py-1 rounded">Senior</span>
                <h3 className="font-bold text-white mt-2 mb-2">Senior Designer</h3>
                <p className="text-slate-400 text-sm">5-8 years. Lead features, mentor juniors, influence game direction.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-fuchsia-500 text-white text-xs px-2 py-1 rounded">Lead</span>
                <h3 className="font-bold text-white mt-2 mb-2">Lead/Director</h3>
                <p className="text-slate-400 text-sm">8+ years. Define vision, manage design team, shape game identity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600/20 via-slate-900 to-violet-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Design Games?
            </h2>
            <p className="text-slate-300 mb-8">
              Find game design roles at studios creating the experiences players will remember.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse All Jobs
              </Link>
              <Link
                href="/entry-level-gaming-jobs"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-purple-500 transition-all"
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
              <Link href="/game-developer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Developer Jobs</h3>
                <p className="text-slate-400 text-sm">Programming positions.</p>
              </Link>
              <Link href="/game-artist-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Artist Jobs</h3>
                <p className="text-slate-400 text-sm">Art & animation roles.</p>
              </Link>
              <Link href="/game-producer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Producer Jobs</h3>
                <p className="text-slate-400 text-sm">Production & management.</p>
              </Link>
              <Link href="/video-game-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
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
