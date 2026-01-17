import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { esportsJobs } from "../../lib/jobs-data";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "gaming recruitment agency", "gaming recruitment agencies", "games recruitment agencies"
export const metadata: Metadata = {
  title: "Gaming Recruitment Agency | Expert Gaming Industry Recruiters",
  description: "Find gaming recruitment agencies worldwide. Compare specialist games industry recruiters, plus search gaming jobs. Free job search platform for the gaming industry.",
  keywords: "gaming recruitment agency, gaming recruitment agencies, games recruitment agencies, video game recruiters, gaming industry jobs",
  openGraph: {
    title: "Gaming Recruitment Agency | Expert Gaming Industry Recruiters",
    description: "Find gaming recruitment agencies worldwide. Compare specialist games industry recruiters.",
    type: "website",
    url: "https://mvp.actor/gaming-recruitment-agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaming Recruitment Agency | Expert Gaming Industry Recruiters",
    description: "Find gaming recruitment agencies worldwide. Compare specialist games recruiters.",
  },
  alternates: {
    canonical: "https://mvp.actor/gaming-recruitment-agency",
  },
};

// Real UK gaming recruitment agencies
const agencies = [
  {
    name: "Aardvark Swift",
    website: "https://www.aswift.com",
    description: "One of the longest-established games recruitment agencies in the UK, founded in 1989. Specialists in game development roles from indie to AAA.",
    specialisms: ["Game Development", "Art & Animation", "Programming", "Production", "QA"],
    founded: "1989",
  },
  {
    name: "Amiqus",
    website: "https://www.amiqus.com",
    description: "Games industry recruitment specialists connecting talent with studios across the UK and Europe. Known for senior and leadership placements.",
    specialisms: ["Executive Search", "Studio Leadership", "Production", "Development"],
    founded: "2006",
  },
  {
    name: "InGame Recruitment",
    website: "https://www.ingamerecruitment.com",
    description: "Specialist games recruitment agency and consultancy working with indie start-ups to major publishers.",
    specialisms: ["Game Development", "Publishing", "QA", "Production"],
    founded: "2015",
  },
  {
    name: "Haptic Recruit",
    website: "https://www.wearehaptic.com",
    description: "Gaming recruitment agency connecting talent with opportunities across the UK and European games industry.",
    specialisms: ["Game Development", "Publishing", "Marketing", "Operations"],
    founded: "2018",
  },
  {
    name: "8Bit Recruitment",
    website: "https://8bitplay.com",
    description: "International gamedev recruitment partner linking studios to exceptional talent across all game development sectors.",
    specialisms: ["Game Development", "Art", "Programming", "Game Design"],
    founded: "2016",
  },
  {
    name: "Datascope Recruitment",
    website: "https://datascope.co.uk",
    description: "UK's leading boutique recruitment consultancy for game jobs, online and mobile technology sectors.",
    specialisms: ["Mobile Games", "Online Games", "Tech", "Product"],
    founded: "2001",
  },
];

// UK gaming hubs
const ukGamingHubs = [
  { city: "London", companies: "Riot Games UK, SEGA Europe, Ubisoft", focus: "Publishing, esports" },
  { city: "Guildford", companies: "EA UK, Hello Games, Supermassive", focus: "AAA development" },
  { city: "Leamington Spa", companies: "Playground Games, Codemasters", focus: "Racing games" },
  { city: "Edinburgh", companies: "Rockstar North, 4J Studios", focus: "AAA development" },
  { city: "Brighton", companies: "SEGA Hardlight, indies", focus: "Mobile, indie" },
  { city: "Manchester", companies: "N3RDWARE, growing scene", focus: "Emerging hub" },
];

const faqs = [
  {
    question: "What does a gaming recruitment agency do?",
    answer: "A gaming recruitment agency connects video game companies with qualified candidates. They handle sourcing, screening, and shortlisting talent for roles at game studios, publishers, and gaming companies. Agencies charge employers a fee (typically 15-25% of first-year salary) upon successful placement. For candidates, using an agency is free.",
  },
  {
    question: "What's the difference between a gaming recruiter and a general recruiter?",
    answer: "Specialist gaming recruiters understand the industry—they know what makes a good game designer, why crunch matters, and can assess genuine passion vs keyword stuffing. They have established networks within gaming and access candidates who aren't on general job boards. General recruiters may lack this industry knowledge and network depth.",
  },
  {
    question: "Should I use a recruitment agency or a job board?",
    answer: "Both have value. Agencies can access unadvertised roles, advocate for you, and help with senior positions. Job boards like ours show you all available roles and let you apply directly. For entry-level roles, job boards are often more effective. For senior/specialist positions, agencies may have exclusive mandates. Many people use both.",
  },
  {
    question: "What is MVP?",
    answer: "We're a job search platform, not a recruitment agency. We aggregate gaming and esports job listings from company career pages, LinkedIn, and other sources into one searchable database. It's completely free for job seekers. We don't charge fees, make placements, or take commissions—we simply help you find and apply to jobs directly.",
  },
  {
    question: "How much do gaming recruiters charge?",
    answer: "Gaming recruitment agencies typically charge employers 15-25% of the candidate's first-year salary for permanent placements. Senior/executive roles may command 25-30% for retained searches. Contract placements usually involve a daily margin. Candidates never pay—all fees are covered by employers. Agencies are motivated to get you the best salary since their fee is percentage-based.",
  },
  {
    question: "What gaming roles can recruiters help with?",
    answer: "Gaming recruiters cover roles including: game designers, programmers, artists/animators, producers, QA testers, community managers, marketing specialists, live ops, product managers, studio leadership, and more. Some specialise in development roles while others focus on publishing, esports, or business functions.",
  },
];

export default function GamingRecruitmentAgency() {
  // Honest schema - we're a resource/guide, not an agency
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Gaming Recruitment Agencies in the UK: Guide and Directory",
        description: "Directory of specialist gaming recruitment agencies in the UK",
        author: {
          "@type": "Organization",
          name: "MVP",
        },
        publisher: {
          "@type": "Organization",
          name: "MVP",
          url: "https://mvp.actor",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UnifiedHeader activeSite="jobs" siteNavItems={JOBS_SITE_NAV_ITEMS} ctaLabel="Post a Job" ctaHref="/contact" />

      <main>
        {/* Hero Section with Video Background */}
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
              <span className="text-green-400">Gaming Recruitment Agencies</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Gaming Recruitment
                </span>
                <br />
                <span className="text-white">Agencies UK</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Find specialist gaming recruitment agencies in the UK, or search our job board
                for gaming opportunities you can apply to directly.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/gaming-jobs-uk"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Search Gaming Jobs
                </Link>
                <a
                  href="#agencies"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-green-500 transition-all"
                >
                  View Agencies
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-12 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
                <p className="text-slate-300 mb-4">
                  <strong>We&apos;re a job search platform, not a recruitment agency.</strong> Built by
                  people from the gaming industry, we aggregate job listings from across the sector
                  into one searchable place—like Indeed for gaming jobs.
                </p>
                <p className="text-slate-300">
                  If you prefer working with a recruiter who can advocate for you and access
                  unadvertised roles, we&apos;ve listed established UK gaming recruitment agencies below.
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">What We Offer</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">🎮</span>
                    <span>Industry knowledge—we understand gaming roles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">🔍</span>
                    <span>Aggregated jobs from multiple sources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">💸</span>
                    <span>Completely free for job seekers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">🔗</span>
                    <span>Direct applications to employers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Featured Gaming Jobs</h2>
                <p className="text-slate-400">Real opportunities from top employers</p>
              </div>
              <Link
                href="/gaming-jobs-uk"
                className="text-green-400 hover:text-green-300 font-medium hidden md:block"
              >
                View all jobs →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {esportsJobs.slice(0, 6).map((job) => (
                <a
                  key={job.id}
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-green-500/50 transition-all group"
                >
                  <div className="relative h-32">
                    <Image
                      src={job.heroImage}
                      alt={job.heroImageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    <span className="absolute bottom-2 left-3 px-2 py-1 bg-green-600/90 text-white text-xs rounded">
                      {job.type}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">{job.company}</p>
                    <p className="text-slate-500 text-xs">{job.location}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Recruitment Agencies Directory */}
        <section id="agencies" className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">UK Gaming Recruitment Agencies</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              These are established recruitment agencies that specialise in gaming industry roles.
              They work on behalf of employers and charge fees upon successful placement (free for candidates).
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map((agency) => (
                <div key={agency.name} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-green-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{agency.name}</h3>
                    <span className="text-xs text-slate-500">Est. {agency.founded}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{agency.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agency.specialisms.map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <a
                    href={agency.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1"
                  >
                    Visit Website →
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-slate-500 text-sm">
              <p>Know an agency we should add? <Link href="/contact" className="text-green-400 hover:underline">Let us know</Link></p>
            </div>
          </div>
        </section>

        {/* UK Gaming Hubs */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">UK Gaming Industry Hubs</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              The UK games industry is clustered around several major hubs:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ukGamingHubs.map((hub) => (
                <div key={hub.city} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-2">{hub.city}</h3>
                  <p className="text-slate-400 text-sm mb-2">{hub.companies}</p>
                  <p className="text-slate-500 text-xs">Focus: {hub.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency vs Job Board */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Recruitment Agency vs Job Board</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🤝</span> Using a Recruitment Agency
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Access to unadvertised roles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>CV and interview coaching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Salary negotiation support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Best for senior/specialist roles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500 mt-1">−</span>
                    <span className="text-slate-400">Limited to agency&apos;s client companies</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-green-500/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔍</span> Using a Job Board (Like Ours)
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>See all available roles in one place</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Apply directly to employers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>No middleman</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Completely free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500 mt-1">−</span>
                    <span className="text-slate-400">No personalised career advice</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Gaming Recruitment FAQs</h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-slate-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600/20 via-slate-900 to-cyan-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Search Gaming Jobs Now
            </h2>
            <p className="text-slate-300 mb-8">
              Browse gaming and esports jobs from top UK employers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/gaming-jobs-uk"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Browse Gaming Jobs
              </Link>
              <Link
                href="/esports-jobs-uk"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-green-500 transition-all"
              >
                Esports Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Explore More</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Link href="/gaming-jobs-uk" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Gaming Jobs UK</h3>
                <p className="text-slate-400 text-sm">Browse all UK gaming vacancies.</p>
              </Link>
              <Link href="/esports-recruitment-agency" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Esports Recruiters</h3>
                <p className="text-slate-400 text-sm">Esports-focused recruitment agencies.</p>
              </Link>
              <Link href="/esports-careers" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Career Pathways</h3>
                <p className="text-slate-400 text-sm">Explore gaming career options.</p>
              </Link>
              <Link href="/esports-salary-guide-uk" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Salary Guide</h3>
                <p className="text-slate-400 text-sm">UK gaming salary benchmarks.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
