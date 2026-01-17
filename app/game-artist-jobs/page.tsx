import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "game artist jobs", "video game artist jobs", "game art jobs"
export const metadata: Metadata = {
  title: "Game Artist Jobs | Art & Animation Careers in Gaming",
  description: "Find game artist jobs at top gaming studios. Browse positions for concept artists, 3D artists, animators, technical artists, and VFX artists.",
  keywords: "game artist jobs, video game artist jobs, game art jobs, 3d artist gaming, game animator jobs",
  openGraph: {
    title: "Game Artist Jobs | Art & Animation Careers in Gaming",
    description: "Find game artist and animator jobs at top studios.",
    type: "website",
    url: "https://mvp.actor/game-artist-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Artist Jobs | Art & Animation Careers",
    description: "Find game artist jobs at top gaming studios.",
  },
  alternates: {
    canonical: "https://mvp.actor/game-artist-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/game-artist-jobs",
  "url": "https://mvp.actor/game-artist-jobs",
  "name": "Game Artist Jobs | Art & Animation Careers",
  "description": "Find game artist jobs including concept art, 3D modeling, animation, and VFX positions.",
};

const artRoles = [
  {
    title: "Concept Artist",
    icon: "🎨",
    description: "Create visual designs for characters, environments, and objects that guide production.",
    skills: ["Digital painting", "Design", "Visual storytelling", "Anatomy"],
    avgSalary: "$55K-$110K",
  },
  {
    title: "3D Character Artist",
    icon: "👤",
    description: "Model, sculpt, and texture characters for games.",
    skills: ["ZBrush", "Maya/3ds Max", "Texturing", "Anatomy"],
    avgSalary: "$60K-$120K",
  },
  {
    title: "3D Environment Artist",
    icon: "🏞️",
    description: "Create 3D environments, props, and world assets.",
    skills: ["World building", "Modular design", "Lighting", "Optimization"],
    avgSalary: "$55K-$115K",
  },
  {
    title: "Animator",
    icon: "🎬",
    description: "Bring characters and objects to life with movement and emotion.",
    skills: ["Animation principles", "Maya/MotionBuilder", "Rigging basics", "Acting"],
    avgSalary: "$60K-$120K",
  },
  {
    title: "Technical Artist",
    icon: "⚙️",
    description: "Bridge art and engineering with tools, shaders, and pipelines.",
    skills: ["Scripting", "Shaders", "Pipeline", "Problem solving"],
    avgSalary: "$70K-$140K",
  },
  {
    title: "VFX Artist",
    icon: "✨",
    description: "Create particle effects, explosions, magic, and environmental effects.",
    skills: ["Particle systems", "Shaders", "Animation", "Timing"],
    avgSalary: "$60K-$120K",
  },
];

const software = [
  { name: "Maya", usage: "Industry standard for 3D and animation" },
  { name: "ZBrush", usage: "High-poly sculpting and detailing" },
  { name: "Substance Painter", usage: "Texturing and materials" },
  { name: "Photoshop", usage: "2D art and texture work" },
  { name: "Blender", usage: "Free 3D suite, gaining popularity" },
  { name: "Houdini", usage: "Procedural and VFX work" },
];

const portfolioTips = [
  {
    title: "Quality Over Quantity",
    description: "Show 5-10 exceptional pieces rather than 50 mediocre ones. Every piece should represent your best work.",
    icon: "⭐",
  },
  {
    title: "Show Your Process",
    description: "Include breakdowns, wireframes, and WIP shots. Studios want to see how you think and work.",
    icon: "📊",
  },
  {
    title: "Match the Studio Style",
    description: "Tailor your portfolio to the studios you're applying to. Stylized studio? Show stylized work.",
    icon: "🎯",
  },
  {
    title: "Keep It Updated",
    description: "Remove old work that no longer represents your skill level. Your portfolio should evolve.",
    icon: "🔄",
  },
];

export default function GameArtistJobs() {
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
              <span className="text-pink-400">Game Artist</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                  Game Artist Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Bring Games to Life Visually</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Create the visuals that define games. Find art and animation positions at studios
                crafting stunning characters, worlds, and effects.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse Artist Jobs
                </Link>
                <Link
                  href="/how-to-get-into-esports"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-pink-500 transition-all"
                >
                  Career Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Art Roles */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Game Art Specializations</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Game art spans many disciplines. Find the specialty that matches your artistic passion.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artRoles.map((role) => (
                <div
                  key={role.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-pink-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{role.icon}</span>
                      <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    </div>
                    <span className="text-pink-400 text-sm font-medium">{role.avgSalary}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-pink-600/20 text-pink-400 text-xs rounded"
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

        {/* Software & Portfolio */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Industry Software</h2>
                <p className="text-slate-400 mb-8">
                  Master these tools to succeed in game art roles.
                </p>
                <div className="space-y-4">
                  {software.map((tool) => (
                    <div key={tool.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-bold text-white mb-1">{tool.name}</h3>
                      <p className="text-slate-400 text-sm">{tool.usage}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Portfolio Tips</h2>
                <p className="text-slate-400 mb-8">
                  Your portfolio is your most important asset. Make it count.
                </p>
                <div className="space-y-4">
                  {portfolioTips.map((tip) => (
                    <div key={tip.title} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{tip.icon}</span>
                        <h3 className="font-bold text-white">{tip.title}</h3>
                      </div>
                      <p className="text-slate-400 text-sm">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Board */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Game Artist Job Board</h2>
              <p className="text-slate-400">Search and filter art & animation opportunities</p>
            </div>

            <FilteredJobsBoard
              filterType="artist"
              filteredSectionTitle="Art & Animation Jobs"
              allJobsSectionTitle="All Gaming Jobs"
              accentColor="pink"
              searchPlaceholder="Search game artist jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* Career Path */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Game Artist Career Path</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-pink-500 text-white text-xs px-2 py-1 rounded">Entry</span>
                <h3 className="font-bold text-white mt-2 mb-2">Junior Artist</h3>
                <p className="text-slate-400 text-sm">0-2 years. Building skills, working on assets under guidance.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-rose-500 text-white text-xs px-2 py-1 rounded">Mid</span>
                <h3 className="font-bold text-white mt-2 mb-2">Artist</h3>
                <p className="text-slate-400 text-sm">3-5 years. Own assets and areas, collaborate with team.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-fuchsia-500 text-white text-xs px-2 py-1 rounded">Senior</span>
                <h3 className="font-bold text-white mt-2 mb-2">Senior Artist</h3>
                <p className="text-slate-400 text-sm">5-8 years. Lead visual direction, mentor juniors.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">Lead</span>
                <h3 className="font-bold text-white mt-2 mb-2">Art Director</h3>
                <p className="text-slate-400 text-sm">8+ years. Define visual style, lead art team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pink-600/20 via-slate-900 to-rose-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create Game Art?
            </h2>
            <p className="text-slate-300 mb-8">
              Find art and animation roles at studios creating visually stunning games.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse All Jobs
              </Link>
              <Link
                href="/entry-level-gaming-jobs"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-pink-500 transition-all"
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
              <Link href="/game-designer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-pink-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Designer Jobs</h3>
                <p className="text-slate-400 text-sm">Design roles.</p>
              </Link>
              <Link href="/game-developer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-pink-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Developer Jobs</h3>
                <p className="text-slate-400 text-sm">Programming positions.</p>
              </Link>
              <Link href="/game-producer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-pink-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Producer Jobs</h3>
                <p className="text-slate-400 text-sm">Production roles.</p>
              </Link>
              <Link href="/video-game-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-pink-500/50 transition-all">
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
