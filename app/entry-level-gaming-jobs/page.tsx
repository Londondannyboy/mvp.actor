import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "entry level gaming jobs", "gaming jobs no experience", "junior gaming jobs"
export const metadata: Metadata = {
  title: "Entry Level Gaming Jobs | Start Your Career in Games",
  description: "Find entry level gaming jobs and kickstart your career. Browse junior positions, internships, and no experience required roles at gaming studios worldwide.",
  keywords: "entry level gaming jobs, gaming jobs no experience, junior gaming jobs, entry level game jobs, gaming internships",
  openGraph: {
    title: "Entry Level Gaming Jobs | Start Your Career in Games",
    description: "Find entry level gaming jobs and internships at top studios.",
    type: "website",
    url: "https://mvp.actor/entry-level-gaming-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Entry Level Gaming Jobs | Start Your Career in Games",
    description: "Find entry level gaming jobs and kickstart your career.",
  },
  alternates: {
    canonical: "https://mvp.actor/entry-level-gaming-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/entry-level-gaming-jobs",
  "url": "https://mvp.actor/entry-level-gaming-jobs",
  "name": "Entry Level Gaming Jobs | Start Your Gaming Career",
  "description": "Find entry level gaming jobs, internships, and junior positions in the gaming industry.",
};

const entryLevelPaths = [
  {
    title: "QA Tester",
    icon: "🔍",
    description: "Test games for bugs and issues. One of the most common entry points into gaming.",
    skills: ["Attention to detail", "Bug reporting", "Communication", "Gaming knowledge"],
    avgSalary: "$35K-$50K",
  },
  {
    title: "Community Manager",
    icon: "💬",
    description: "Engage with gaming communities, manage social media, and support players.",
    skills: ["Social media", "Communication", "Gaming passion", "Customer service"],
    avgSalary: "$40K-$55K",
  },
  {
    title: "Junior Artist",
    icon: "🎨",
    description: "Create 2D/3D assets under supervision. Strong portfolio required.",
    skills: ["Art software", "Basic 3D modeling", "Drawing", "Portfolio"],
    avgSalary: "$45K-$60K",
  },
  {
    title: "Junior Programmer",
    icon: "💻",
    description: "Write code for games under guidance from senior developers.",
    skills: ["C++/C#/Python", "Game engines", "Problem solving", "Math"],
    avgSalary: "$55K-$75K",
  },
  {
    title: "Game Support",
    icon: "🎮",
    description: "Help players with issues and provide customer support for games.",
    skills: ["Communication", "Problem solving", "Gaming knowledge", "Patience"],
    avgSalary: "$30K-$45K",
  },
  {
    title: "Content Creator",
    icon: "📹",
    description: "Create content for gaming companies - videos, streams, social posts.",
    skills: ["Video editing", "Social media", "Creativity", "Gaming culture"],
    avgSalary: "$35K-$50K",
  },
];

const tips = [
  {
    title: "Build Your Portfolio",
    description: "Create game mods, participate in game jams, or develop small personal projects to showcase your skills.",
    icon: "📁",
  },
  {
    title: "Network in Gaming",
    description: "Attend gaming events, join Discord communities, and connect with industry professionals on LinkedIn.",
    icon: "🤝",
  },
  {
    title: "Start with QA",
    description: "QA testing is a proven entry point. Many industry leaders started in QA before moving to other roles.",
    icon: "🎯",
  },
  {
    title: "Learn Industry Tools",
    description: "Familiarize yourself with Unity, Unreal Engine, or other tools relevant to your desired role.",
    icon: "🛠️",
  },
  {
    title: "Get Certified",
    description: "Consider certifications in game development, project management, or your specialty area.",
    icon: "📜",
  },
  {
    title: "Volunteer & Intern",
    description: "Internships and volunteer work at studios or esports events build experience and connections.",
    icon: "🌱",
  },
];

export default function EntryLevelGamingJobs() {
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
              <span className="text-amber-400">Entry Level</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Entry Level Gaming Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Start Your Gaming Career Today</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                No experience? No problem. Discover entry level positions, internships, and junior roles
                that can launch your career in the gaming industry.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse All Jobs
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

        {/* Entry Level Career Paths */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Entry Level Career Paths</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              These roles are commonly accessible to newcomers in the gaming industry.
              Many successful industry professionals started in one of these positions.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entryLevelPaths.map((path) => (
                <div
                  key={path.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{path.icon}</span>
                      <h3 className="text-xl font-bold text-white">{path.title}</h3>
                    </div>
                    <span className="text-amber-400 text-sm font-medium">{path.avgSalary}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{path.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill) => (
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

        {/* Tips Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">How to Land Your First Gaming Job</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Breaking into gaming can be competitive. Here are proven strategies to help you stand out.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip) => (
                <div
                  key={tip.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                >
                  <span className="text-3xl mb-4 block">{tip.icon}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                  <p className="text-slate-400 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Board with Search & Filter */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Entry Level Job Board</h2>
              <p className="text-slate-400">Junior roles, internships, and entry-level positions</p>
            </div>

            <FilteredJobsBoard
              filterType="entry-level"
              filteredSectionTitle="Entry Level & Junior Positions"
              allJobsSectionTitle="All Gaming Jobs"
              accentColor="amber"
              searchPlaceholder="Search entry level jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">Can I get a gaming job with no experience?</h3>
                <p className="text-slate-400">
                  Yes! Many gaming companies hire for entry-level positions like QA testing, community management,
                  and customer support. These roles often require passion for gaming rather than formal experience.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">What's the best entry point into game development?</h3>
                <p className="text-slate-400">
                  QA testing is one of the most common entry points. It teaches you how games are made, exposes you
                  to development pipelines, and provides opportunities to transition to other roles like design or production.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">Do I need a degree to work in gaming?</h3>
                <p className="text-slate-400">
                  While some technical roles may prefer degrees, many gaming positions value skills, portfolio, and
                  passion over formal education. Building projects and demonstrating ability can be equally valuable.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">How do I stand out as a gaming job applicant?</h3>
                <p className="text-slate-400">
                  Build a portfolio showcasing relevant work, participate in game jams, contribute to modding communities,
                  and demonstrate genuine passion for the specific games or genres of companies you're applying to.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600/20 via-slate-900 to-orange-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Gaming Career?
            </h2>
            <p className="text-slate-300 mb-8">
              Everyone starts somewhere. Browse our job listings and take the first step today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse All Jobs
              </Link>
              <Link
                href="/game-tester-jobs"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-amber-500 transition-all"
              >
                QA Tester Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Explore More</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Link href="/game-tester-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Game Tester Jobs</h3>
                <p className="text-slate-400 text-sm">Common entry point.</p>
              </Link>
              <Link href="/video-game-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Video Game Jobs</h3>
                <p className="text-slate-400 text-sm">All gaming careers.</p>
              </Link>
              <Link href="/how-to-get-into-esports" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Career Guide</h3>
                <p className="text-slate-400 text-sm">Step-by-step advice.</p>
              </Link>
              <Link href="/gaming-recruitment-agency" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Recruiters</h3>
                <p className="text-slate-400 text-sm">Get connected.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
