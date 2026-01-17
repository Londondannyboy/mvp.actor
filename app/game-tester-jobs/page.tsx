import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { FilteredJobsBoard } from "../components/FilteredJobsBoard";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "game tester jobs", "game testing jobs", "qa tester gaming"
export const metadata: Metadata = {
  title: "Game Tester Jobs | QA Testing Careers in Gaming",
  description: "Find game tester jobs worldwide. QA testing is the most accessible entry into the gaming industry. Browse game testing positions, salary guides & career paths.",
  keywords: "game tester jobs, game testing jobs, qa tester gaming, video game qa jobs, game quality assurance",
  openGraph: {
    title: "Game Tester Jobs | QA Testing Careers in Gaming",
    description: "Find game tester jobs worldwide. QA testing careers in the gaming industry.",
    type: "website",
    url: "https://mvp.actor/game-tester-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Tester Jobs | QA Testing Careers in Gaming",
    description: "Find game tester jobs worldwide. QA testing careers in gaming.",
  },
  alternates: {
    canonical: "https://mvp.actor/game-tester-jobs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://mvp.actor/game-tester-jobs",
      "url": "https://mvp.actor/game-tester-jobs",
      "name": "Game Tester Jobs | QA Testing Careers",
      "description": "Find game tester jobs worldwide. QA testing is the most accessible entry into gaming.",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://mvp.actor/#website"
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does a game tester do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Game testers (QA testers) play games systematically to find bugs, glitches, and issues before release. They write detailed bug reports, test new features, verify fixes, and ensure games work across different platforms. The work involves methodical testing rather than casual gaming."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a degree to become a game tester?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No degree is required for entry-level game testing positions. Employers look for attention to detail, strong communication skills, gaming knowledge, and the ability to follow test cases systematically. A degree in game development or CS can help for senior QA and automation roles."
          }
        },
        {
          "@type": "Question",
          "name": "What is the average game tester salary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Entry-level game testers typically earn $35,000-$45,000 USD (or £20,000-£28,000 GBP). Senior QA testers earn $50,000-$70,000, and QA leads/managers can earn $70,000-$100,000+. Automation QA roles command higher salaries due to programming requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Can game testing lead to other careers in gaming?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! QA is an excellent entry point to other gaming roles. Many game designers, producers, and developers started in QA. The role gives you deep understanding of game development, industry connections, and insight into how games are built."
          }
        }
      ]
    }
  ]
};

const qaRoles = [
  { title: "Junior QA Tester", salary: "$35k - $45k", requirements: "Attention to detail, gaming knowledge, basic PC skills" },
  { title: "QA Tester", salary: "$45k - $55k", requirements: "1-2 years experience, bug tracking tools, test case writing" },
  { title: "Senior QA Tester", salary: "$55k - $70k", requirements: "3+ years, mentoring, specialisation (localisation, compliance)" },
  { title: "QA Lead", salary: "$70k - $90k", requirements: "Team management, test planning, stakeholder communication" },
  { title: "QA Manager", salary: "$85k - $120k", requirements: "Department leadership, process development, budgeting" },
  { title: "Automation QA", salary: "$65k - $100k", requirements: "Programming skills, test automation frameworks, CI/CD" },
];

const topCompanies = [
  { name: "Keywords Studios", locations: "Global", focus: "Largest games QA outsourcing company" },
  { name: "Pole To Win", locations: "Global", focus: "QA, localisation, and player support" },
  { name: "EA", locations: "US, UK, Canada", focus: "In-house QA for EA titles" },
  { name: "Rockstar Games", locations: "US, UK", focus: "AAA game development QA" },
  { name: "Ubisoft", locations: "Global", focus: "In-house and QA studios worldwide" },
  { name: "Activision Blizzard", locations: "US, UK, Europe", focus: "Major publisher QA operations" },
];

const skills = [
  "Attention to detail and patience",
  "Clear written communication for bug reports",
  "Gaming knowledge across genres and platforms",
  "Basic understanding of game development",
  "Familiarity with bug tracking tools (Jira, TestRail)",
  "Ability to reproduce issues consistently",
  "Systematic and methodical approach",
  "Platform knowledge (PC, Console, Mobile)",
];

export default function GameTesterJobs() {
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
              poster={getMuxThumbnailUrl(MUX_VIDEOS.HERO, 2)}
              className="w-full h-full object-cover"
            >
              <source src={getMuxStreamUrl(MUX_VIDEOS.HERO)} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <nav className="text-sm mb-8 text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/esports-jobs" className="hover:text-white transition-colors">Jobs</Link>
              <span className="mx-2">/</span>
              <span className="text-amber-400">Game Tester Jobs</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Game Tester Jobs
                </span>
                <br />
                <span className="text-white text-4xl">Your Gateway to Gaming</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Game QA testing is one of the most accessible entry points into the gaming industry.
                Find game tester jobs worldwide with competitive salaries and clear career progression.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-2xl font-bold text-amber-400">Entry</div>
                  <div className="text-sm text-slate-400">Level Friendly</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-2xl font-bold text-orange-400">$35-70k</div>
                  <div className="text-sm text-slate-400">Salary Range</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-2xl font-bold text-emerald-400">No</div>
                  <div className="text-sm text-slate-400">Degree Required</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-2xl font-bold text-cyan-400">Clear</div>
                  <div className="text-sm text-slate-400">Career Path</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/esports-jobs?q=qa+tester"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Browse QA Jobs
                </Link>
                <Link
                  href="/entry-level-gaming-jobs"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-amber-500 transition-all"
                >
                  Entry Level Jobs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What is Game Testing */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">What Do Game Testers Do?</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    <strong className="text-amber-400">Game testers</strong> (also called QA testers) systematically
                    play games to find bugs, glitches, and issues before public release. Unlike casual gaming,
                    testing involves methodical approaches to break the game.
                  </p>
                  <p>
                    Daily tasks include executing test cases, writing detailed bug reports, verifying fixes,
                    and ensuring games work across different platforms and configurations. You might test
                    the same level hundreds of times looking for edge cases.
                  </p>
                  <p>
                    The role is perfect for those who want to enter gaming without programming skills.
                    Your gaming knowledge and attention to detail are your main qualifications.
                  </p>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Day in the Life</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">09:00</span>
                    <span>Team standup - discuss yesterday's bugs and today's focus areas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">09:30</span>
                    <span>Execute test cases for new build, document any issues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">12:00</span>
                    <span>Lunch break</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">13:00</span>
                    <span>Regression testing - verify fixed bugs are actually resolved</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">15:00</span>
                    <span>Ad-hoc/exploratory testing - try to break the game creatively</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">17:00</span>
                    <span>Write up bug reports, update test documentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Career Progression */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">QA Career Progression</h2>
            <p className="text-slate-400 mb-8 max-w-3xl">
              Game testing offers clear career advancement. Many industry leaders started in QA before
              moving into production, design, or development.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qaRoles.map((role) => (
                <div key={role.title} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white">{role.title}</h3>
                    <span className="text-emerald-400 text-sm font-medium">{role.salary}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{role.requirements}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Required */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Essential Skills for Game Testers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center gap-3">
                  <span className="text-amber-400 text-lg">✓</span>
                  <span className="text-slate-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Companies */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Top Companies Hiring Game Testers</h2>
            <p className="text-slate-400 mb-8 max-w-3xl">
              Both dedicated QA companies and major game studios hire testers. Outsourcing companies
              like Keywords offer great entry points, while in-house studio QA provides deeper game knowledge.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCompanies.map((company) => (
                <div key={company.name} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all">
                  <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
                  <p className="text-amber-400 text-sm mb-2">{company.locations}</p>
                  <p className="text-slate-400 text-sm">{company.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Board with Search & Filter */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Game Tester Job Board</h2>
              <p className="text-slate-400">Search and filter QA testing opportunities</p>
            </div>

            <FilteredJobsBoard
              filterType="qa"
              filteredSectionTitle="QA & Testing Jobs"
              allJobsSectionTitle="All Gaming Jobs"
              accentColor="amber"
              searchPlaceholder="Search QA tester jobs..."
              showCategoryFilters={true}
              baseUrl="/esports-jobs"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600/20 via-slate-900 to-orange-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your Game Testing Career
            </h2>
            <p className="text-slate-300 mb-8">
              Game QA is your gateway to the gaming industry. No degree required, just passion and attention to detail.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/esports-jobs?q=qa+tester"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse QA Jobs
              </Link>
              <Link
                href="/entry-level-gaming-jobs"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-amber-500 transition-all"
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
              <Link href="/entry-level-gaming-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Entry Level Jobs</h3>
                <p className="text-slate-400 text-sm">All entry-level gaming positions.</p>
              </Link>
              <Link href="/video-game-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Video Game Jobs</h3>
                <p className="text-slate-400 text-sm">All video game industry roles.</p>
              </Link>
              <Link href="/how-to-get-into-esports" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Career Guide</h3>
                <p className="text-slate-400 text-sm">How to break into gaming.</p>
              </Link>
              <Link href="/gaming-recruitment-agency" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Recruiters</h3>
                <p className="text-slate-400 text-sm">Gaming recruitment agencies.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
