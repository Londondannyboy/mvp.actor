import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "igaming jobs", "online gaming jobs", "casino gaming jobs", "betting jobs"
export const metadata: Metadata = {
  title: "iGaming Jobs | Online Gaming & Betting Careers",
  description: "Find iGaming jobs in online casinos, sports betting, and gaming platforms. Browse positions in development, marketing, compliance, and operations.",
  keywords: "igaming jobs, online gaming jobs, casino gaming jobs, betting jobs, gambling industry jobs",
  openGraph: {
    title: "iGaming Jobs | Online Gaming & Betting Careers",
    description: "Find iGaming jobs in online casinos, betting, and gaming platforms.",
    type: "website",
    url: "https://mvp.actor/igaming-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "iGaming Jobs | Online Gaming & Betting Careers",
    description: "Find iGaming jobs in online gaming and betting.",
  },
  alternates: {
    canonical: "https://mvp.actor/igaming-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/igaming-jobs",
  "url": "https://mvp.actor/igaming-jobs",
  "name": "iGaming Jobs | Online Gaming & Betting Careers",
  "description": "Find iGaming jobs in online casinos, sports betting, and gaming platforms.",
};

const igamingRoles = [
  {
    title: "Game Developer",
    icon: "💻",
    description: "Build casino games, slots, and betting platforms using web technologies.",
    skills: ["JavaScript/TypeScript", "WebGL", "Game math", "RNG systems"],
    avgSalary: "$65K-$130K",
  },
  {
    title: "Odds Compiler",
    icon: "📊",
    description: "Create and adjust betting odds using statistical analysis and market data.",
    skills: ["Statistics", "Sports knowledge", "Risk management", "Data analysis"],
    avgSalary: "$50K-$100K",
  },
  {
    title: "Compliance Manager",
    icon: "⚖️",
    description: "Ensure regulatory compliance across multiple jurisdictions.",
    skills: ["Gaming law", "Regulatory frameworks", "Risk assessment", "Documentation"],
    avgSalary: "$70K-$120K",
  },
  {
    title: "Affiliate Manager",
    icon: "🤝",
    description: "Manage affiliate partnerships and player acquisition channels.",
    skills: ["Partnership management", "Negotiation", "Analytics", "Marketing"],
    avgSalary: "$55K-$100K",
  },
  {
    title: "VIP Manager",
    icon: "👑",
    description: "Manage high-value player relationships and retention programs.",
    skills: ["Relationship building", "Retention", "CRM", "Customer service"],
    avgSalary: "$50K-$90K",
  },
  {
    title: "CRM Manager",
    icon: "📱",
    description: "Design and execute player engagement and retention campaigns.",
    skills: ["CRM platforms", "Segmentation", "Campaign management", "Analytics"],
    avgSalary: "$55K-$95K",
  },
];

const sectors = [
  { name: "Online Casinos", description: "Slots, table games, live dealer" },
  { name: "Sports Betting", description: "Pre-match and in-play betting" },
  { name: "Poker", description: "Online poker platforms" },
  { name: "Fantasy Sports", description: "Daily and season-long fantasy" },
  { name: "Game Studios", description: "Casino game development" },
  { name: "Platform Providers", description: "B2B gaming solutions" },
];

const benefits = [
  {
    title: "High Growth Industry",
    description: "iGaming is one of the fastest-growing sectors in online entertainment.",
    icon: "📈",
  },
  {
    title: "Competitive Salaries",
    description: "Strong compensation packages with performance bonuses.",
    icon: "💰",
  },
  {
    title: "Global Opportunities",
    description: "Work remotely or relocate to gaming hubs like Malta, Gibraltar, or Isle of Man.",
    icon: "🌍",
  },
  {
    title: "Cutting-Edge Tech",
    description: "Work with modern technologies, blockchain, and AI.",
    icon: "🚀",
  },
];

const hubs = [
  { location: "Malta", description: "Europe's iGaming capital" },
  { location: "Gibraltar", description: "UK-focused operators" },
  { location: "Isle of Man", description: "Established gaming hub" },
  { location: "London", description: "Sports betting headquarters" },
  { location: "Dublin", description: "Growing tech & gaming hub" },
  { location: "Remote", description: "Many remote-first companies" },
];

export default function IGamingJobs() {
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
              <span className="text-amber-400">iGaming</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  iGaming Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Online Gaming & Betting Careers</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Join the booming online gaming industry. Find roles in online casinos, sports betting,
                game development, and platform technology.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse iGaming Jobs
                </Link>
                <Link
                  href="/how-to-get-into-esports"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-amber-500 transition-all"
                >
                  Career Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* iGaming Roles */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">iGaming Career Paths</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              The iGaming industry offers diverse roles across technology, marketing, operations, and compliance.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {igamingRoles.map((role) => (
                <div
                  key={role.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{role.icon}</span>
                      <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    </div>
                    <span className="text-amber-400 text-sm font-medium">{role.avgSalary}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-amber-600/20 text-amber-400 text-xs rounded"
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

        {/* Sectors & Hubs */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">iGaming Sectors</h2>
                <p className="text-slate-400 mb-8">
                  The industry spans multiple verticals, each with unique opportunities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {sectors.map((sector) => (
                    <div key={sector.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-bold text-white mb-1">{sector.name}</h3>
                      <p className="text-slate-400 text-xs">{sector.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">iGaming Hubs</h2>
                <p className="text-slate-400 mb-8">
                  Key locations for iGaming careers worldwide.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {hubs.map((hub) => (
                    <div key={hub.location} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-bold text-white mb-1">{hub.location}</h3>
                      <p className="text-slate-400 text-xs">{hub.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Why Work in iGaming?</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              The iGaming industry offers compelling career benefits.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                >
                  <span className="text-3xl mb-4 block">{benefit.icon}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Board */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">iGaming Job Board</h2>
              <p className="text-slate-400">Search and filter online gaming opportunities</p>
            </div>

            <FilteredJobsBoard
              accentColor="amber"
              searchPlaceholder="Search iGaming jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600/20 via-slate-900 to-yellow-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Join iGaming?
            </h2>
            <p className="text-slate-300 mb-8">
              Find your next role in the exciting world of online gaming and betting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse All Jobs
              </Link>
              <Link
                href="/games-recruitment-agency"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-amber-500 transition-all"
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
              <Link href="/games-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Games Jobs</h3>
                <p className="text-slate-400 text-sm">All gaming careers.</p>
              </Link>
              <Link href="/game-developer-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Developer Jobs</h3>
                <p className="text-slate-400 text-sm">Programming positions.</p>
              </Link>
              <Link href="/esports-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Esports Jobs</h3>
                <p className="text-slate-400 text-sm">Competitive gaming.</p>
              </Link>
              <Link href="/entry-level-gaming-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Entry Level</h3>
                <p className="text-slate-400 text-sm">Start your career.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
