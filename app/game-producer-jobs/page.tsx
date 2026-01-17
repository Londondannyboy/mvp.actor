import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "game producer jobs", "video game producer jobs", "game production jobs"
export const metadata: Metadata = {
  title: "Game Producer Jobs | Production Careers in Gaming",
  description: "Find game producer jobs at top gaming studios. Browse positions for producers, project managers, associate producers, and production coordinators.",
  keywords: "game producer jobs, video game producer jobs, game production jobs, gaming project manager, associate producer gaming",
  openGraph: {
    title: "Game Producer Jobs | Production Careers in Gaming",
    description: "Find game producer and production management jobs at top studios.",
    type: "website",
    url: "https://mvp.actor/game-producer-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Producer Jobs | Production Careers",
    description: "Find game producer jobs at top gaming studios.",
  },
  alternates: {
    canonical: "https://mvp.actor/game-producer-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/game-producer-jobs",
  "url": "https://mvp.actor/game-producer-jobs",
  "name": "Game Producer Jobs | Production Careers",
  "description": "Find game producer jobs including project management and production coordination roles.",
};

const producerRoles = [
  {
    title: "Associate Producer",
    icon: "📋",
    description: "Support senior producers with scheduling, tracking, and coordination tasks.",
    skills: ["Organization", "Communication", "Jira/Asana", "Documentation"],
    avgSalary: "$50K-$80K",
  },
  {
    title: "Producer",
    icon: "🎬",
    description: "Own game features or teams, manage schedules, and drive delivery.",
    skills: ["Project management", "Leadership", "Risk assessment", "Stakeholder management"],
    avgSalary: "$70K-$120K",
  },
  {
    title: "Senior Producer",
    icon: "⭐",
    description: "Lead major game initiatives, manage producer teams, and own project success.",
    skills: ["Strategic planning", "Team leadership", "Budget management", "Cross-functional coordination"],
    avgSalary: "$90K-$150K",
  },
  {
    title: "Executive Producer",
    icon: "👔",
    description: "Oversee entire games or portfolios, drive studio strategy and vision.",
    skills: ["Studio leadership", "Business development", "Stakeholder relations", "Vision setting"],
    avgSalary: "$130K-$250K+",
  },
  {
    title: "Development Director",
    icon: "🎯",
    description: "Focus on development process, team efficiency, and delivery methodology.",
    skills: ["Process design", "Team optimization", "Agile/Scrum", "Resource planning"],
    avgSalary: "$100K-$170K",
  },
  {
    title: "Live Operations Producer",
    icon: "🔄",
    description: "Manage live service games, updates, events, and player engagement.",
    skills: ["Live service", "Content planning", "Analytics", "Community awareness"],
    avgSalary: "$75K-$130K",
  },
];

const methodologies = [
  { name: "Agile/Scrum", description: "Iterative development with sprints" },
  { name: "Kanban", description: "Visual workflow management" },
  { name: "Waterfall", description: "Sequential milestone-based" },
  { name: "Hybrid", description: "Combining methodologies as needed" },
];

const tools = [
  { name: "Jira", usage: "Issue tracking and sprint management" },
  { name: "Confluence", usage: "Documentation and wikis" },
  { name: "Shotgrid", usage: "Asset tracking for VFX/animation" },
  { name: "Perforce/Git", usage: "Version control understanding" },
  { name: "Excel/Sheets", usage: "Scheduling and budgeting" },
  { name: "Miro", usage: "Visual collaboration" },
];

const responsibilities = [
  "Define project scope, timeline, and milestones",
  "Coordinate between teams (art, design, engineering, QA)",
  "Manage risks and remove blockers for the team",
  "Communicate with stakeholders and leadership",
  "Track progress and adjust plans as needed",
  "Ensure quality and on-time delivery",
  "Manage budgets and resource allocation",
  "Foster team health and morale",
];

export default function GameProducerJobs() {
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
              <Link href="/games-jobs" className="hover:text-white transition-colors">Games Jobs</Link>
              <span className="mx-2">/</span>
              <span className="text-emerald-400">Game Producer</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Game Producer Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Lead Teams to Ship Great Games</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Drive game development from concept to launch. Find production roles at studios
                where you can lead teams and deliver memorable player experiences.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse Producer Jobs
                </Link>
                <Link
                  href="/how-to-get-into-esports"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-emerald-500 transition-all"
                >
                  Career Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Producer Roles */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Production Roles</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Game production offers career paths from coordinator to executive leadership.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {producerRoles.map((role) => (
                <div
                  key={role.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{role.icon}</span>
                      <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">{role.avgSalary}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-emerald-600/20 text-emerald-400 text-xs rounded"
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

        {/* Responsibilities & Tools */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Key Responsibilities</h2>
                <p className="text-slate-400 mb-8">
                  Game producers wear many hats to keep development on track.
                </p>
                <ul className="space-y-3">
                  {responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Tools & Methodologies</h2>
                <p className="text-slate-400 mb-6">
                  Essential tools for game production management.
                </p>
                <div className="space-y-4 mb-8">
                  {tools.map((tool) => (
                    <div key={tool.name} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <div className="flex justify-between">
                        <span className="font-semibold text-white">{tool.name}</span>
                        <span className="text-slate-400 text-sm">{tool.usage}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-white mb-4">Development Methodologies</h3>
                <div className="grid grid-cols-2 gap-3">
                  {methodologies.map((method) => (
                    <div key={method.name} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <h4 className="font-semibold text-white text-sm">{method.name}</h4>
                      <p className="text-slate-400 text-xs">{method.description}</p>
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
              <h2 className="text-3xl font-bold text-white mb-2">Game Producer Job Board</h2>
              <p className="text-slate-400">Search and filter production opportunities</p>
            </div>

            <FilteredJobsBoard
              filterType="producer"
              filteredSectionTitle="Production & Management Jobs"
              allJobsSectionTitle="All Gaming Jobs"
              accentColor="emerald"
              searchPlaceholder="Search game producer jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* Career Path */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Game Producer Career Path</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded">Entry</span>
                <h3 className="font-bold text-white mt-2 mb-2">Coordinator/Associate</h3>
                <p className="text-slate-400 text-sm">0-2 years. Learning production, supporting team operations.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-teal-500 text-white text-xs px-2 py-1 rounded">Mid</span>
                <h3 className="font-bold text-white mt-2 mb-2">Producer</h3>
                <p className="text-slate-400 text-sm">3-5 years. Own features or teams, drive delivery.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-cyan-500 text-white text-xs px-2 py-1 rounded">Senior</span>
                <h3 className="font-bold text-white mt-2 mb-2">Senior Producer</h3>
                <p className="text-slate-400 text-sm">5-8 years. Lead major initiatives, mentor producers.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative">
                <span className="absolute -top-3 left-4 bg-sky-500 text-white text-xs px-2 py-1 rounded">Executive</span>
                <h3 className="font-bold text-white mt-2 mb-2">Executive Producer</h3>
                <p className="text-slate-400 text-sm">8+ years. Studio strategy, game portfolio ownership.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600/20 via-slate-900 to-teal-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Produce Games?
            </h2>
            <p className="text-slate-300 mb-8">
              Find production roles at studios shipping amazing games.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse All Jobs
              </Link>
              <Link
                href="/entry-level-gaming-jobs"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-emerald-500 transition-all"
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
              <Link href="/game-designer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Designer Jobs</h3>
                <p className="text-slate-400 text-sm">Design roles.</p>
              </Link>
              <Link href="/game-developer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Developer Jobs</h3>
                <p className="text-slate-400 text-sm">Programming positions.</p>
              </Link>
              <Link href="/game-artist-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Artist Jobs</h3>
                <p className="text-slate-400 text-sm">Art & animation.</p>
              </Link>
              <Link href="/video-game-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-all">
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
