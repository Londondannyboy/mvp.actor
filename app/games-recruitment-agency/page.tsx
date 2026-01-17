import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { MUX_VIDEOS, getMuxStreamUrl, getMuxThumbnailUrl } from "../../lib/mux-config";

// Target keywords: "games recruitment agency", "gaming recruitment agency", "game industry recruiters"
export const metadata: Metadata = {
  title: "Games Recruitment Agency | Gaming Industry Recruiters",
  description: "Find the best games recruitment agencies and gaming industry recruiters. Connect with specialist recruiters who place talent at top gaming studios worldwide.",
  keywords: "games recruitment agency, gaming recruitment agency, game recruiters, gaming headhunters, video game recruitment",
  openGraph: {
    title: "Games Recruitment Agency | Gaming Industry Recruiters",
    description: "Connect with specialist games recruitment agencies and gaming industry recruiters.",
    type: "website",
    url: "https://mvp.actor/games-recruitment-agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Games Recruitment Agency | Gaming Industry Recruiters",
    description: "Find top games recruitment agencies and gaming recruiters.",
  },
  alternates: {
    canonical: "https://mvp.actor/games-recruitment-agency",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mvp.actor/games-recruitment-agency",
  "url": "https://mvp.actor/games-recruitment-agency",
  "name": "Games Recruitment Agency | Gaming Industry Recruiters",
  "description": "Find specialist games recruitment agencies and gaming industry recruiters worldwide.",
};

const recruitmentServices = [
  {
    title: "Permanent Placement",
    icon: "🎯",
    description: "Full-time roles at gaming studios with comprehensive candidate matching and vetting.",
  },
  {
    title: "Contract Staffing",
    icon: "📋",
    description: "Project-based talent for game development cycles, launches, and seasonal peaks.",
  },
  {
    title: "Executive Search",
    icon: "👔",
    description: "C-suite and senior leadership recruitment for gaming companies.",
  },
  {
    title: "Team Building",
    icon: "👥",
    description: "Assemble entire teams for new studios, projects, or expansion.",
  },
];

const specializations = [
  { name: "Game Development", roles: "Programmers, Engine Developers, Tools Engineers" },
  { name: "Game Design", roles: "Game Designers, Level Designers, Systems Designers" },
  { name: "Art & Animation", roles: "3D Artists, Animators, Concept Artists, VFX" },
  { name: "Production", roles: "Producers, Project Managers, Studio Operations" },
  { name: "QA & Testing", roles: "QA Leads, Test Engineers, Automation QA" },
  { name: "Marketing", roles: "Marketing Directors, Community Managers, PR" },
  { name: "Audio", roles: "Sound Designers, Composers, Audio Engineers" },
  { name: "Esports", roles: "Team Managers, Event Staff, Broadcast Talent" },
];

const benefits = [
  {
    title: "Industry Expertise",
    description: "Specialist recruiters who understand gaming culture, workflows, and technical requirements.",
    icon: "🎮",
  },
  {
    title: "Hidden Opportunities",
    description: "Access exclusive roles not advertised publicly. Many top studios hire through agencies.",
    icon: "🔐",
  },
  {
    title: "Career Guidance",
    description: "Expert advice on portfolio, resume, and interview preparation specific to gaming.",
    icon: "🧭",
  },
  {
    title: "Salary Negotiation",
    description: "Recruiters advocate for competitive compensation and understand market rates.",
    icon: "💰",
  },
  {
    title: "Fast Track Process",
    description: "Skip the application pile. Recruiters can get you directly to hiring managers.",
    icon: "⚡",
  },
  {
    title: "Confidential Search",
    description: "Explore opportunities discreetly while employed at your current role.",
    icon: "🤫",
  },
];

const faqs = [
  {
    question: "How much do games recruitment agencies charge candidates?",
    answer: "Legitimate recruitment agencies never charge candidates. Agencies are paid by the hiring company when they successfully place a candidate. If an agency asks you for money, that's a red flag.",
  },
  {
    question: "What's the difference between in-house recruiters and agencies?",
    answer: "In-house recruiters work exclusively for one company. Agency recruiters work with multiple gaming studios and can present you with opportunities across the industry, giving you more options.",
  },
  {
    question: "How do I get noticed by gaming recruiters?",
    answer: "Keep your LinkedIn updated with gaming-specific keywords, build a strong portfolio, engage with gaming industry content, and apply to jobs through agencies' websites. Many recruiters also attend gaming industry events.",
  },
  {
    question: "Are remote gaming jobs available through recruiters?",
    answer: "Yes, many gaming recruiters now specialize in remote placements. The industry has embraced remote work, and recruiters have access to remote-friendly studios worldwide.",
  },
  {
    question: "What should I expect from a gaming recruiter?",
    answer: "Good recruiters will understand your skills and career goals, provide market insights, prepare you for interviews, give honest feedback, and advocate for your best interests with hiring companies.",
  },
];

export default function GamesRecruitmentAgency() {
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
              <span className="text-purple-400">Recruitment Agency</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Games Recruitment
                </span>
                <br />
                <span className="text-white text-4xl">Connect with Gaming Industry Recruiters</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Work with specialist games recruitment agencies who understand the gaming industry.
                Access exclusive opportunities and get expert career guidance.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Contact Us
                </Link>
                <Link
                  href="/esports-jobs"
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-purple-500 transition-all"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About MVP Actor as Recruiter */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-purple-600/20 via-slate-800/50 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30">
              <div className="max-w-3xl">
                <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">MVP Actor</span>
                <h2 className="text-3xl font-bold text-white mt-2 mb-4">Your Gaming Industry Partner</h2>
                <p className="text-slate-300 mb-6">
                  MVP Actor connects gaming talent with opportunities at leading studios and esports organizations.
                  Whether you're looking for your next role or building your team, we're here to help.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-lg transition-all"
                  >
                    For Job Seekers
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                  >
                    For Employers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Recruitment Services</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Gaming recruitment agencies offer a range of services tailored to the unique needs of the industry.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recruitmentServices.map((service) => (
                <div
                  key={service.title}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all"
                >
                  <span className="text-3xl mb-4 block">{service.icon}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Gaming Recruitment Specializations</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Good gaming recruiters specialize in specific disciplines and understand the nuances of each role.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {specializations.map((spec) => (
                <div
                  key={spec.name}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
                >
                  <h3 className="font-bold text-white mb-2">{spec.name}</h3>
                  <p className="text-slate-400 text-xs">{spec.roles}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Why Use a Games Recruitment Agency?</h2>
            <p className="text-slate-400 mb-10 max-w-3xl">
              Working with specialist gaming recruiters offers advantages you won't find applying directly.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* For Employers */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-pink-400 font-semibold text-sm uppercase tracking-wider">For Employers</span>
                <h2 className="text-3xl font-bold text-white mt-2 mb-4">Hire Gaming Talent</h2>
                <p className="text-slate-300 mb-6">
                  Building a gaming studio or expanding your team? Work with recruiters who have deep networks
                  in the gaming industry and can source talent that fits your culture and technical needs.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="text-pink-400">✓</span>
                    Access pre-vetted gaming professionals
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="text-pink-400">✓</span>
                    Reduce time-to-hire with targeted searches
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="text-pink-400">✓</span>
                    Flexible engagement models
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <span className="text-pink-400">✓</span>
                    Replacement guarantees on placements
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg transition-all inline-block"
                >
                  Post a Job
                </Link>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Roles We Fill</h3>
                <div className="space-y-4">
                  <Link href="/game-developer-jobs" className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all">
                    <span className="text-white">Game Developers</span>
                    <span className="text-slate-400">→</span>
                  </Link>
                  <Link href="/game-designer-jobs" className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all">
                    <span className="text-white">Game Designers</span>
                    <span className="text-slate-400">→</span>
                  </Link>
                  <Link href="/game-artist-jobs" className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all">
                    <span className="text-white">Game Artists</span>
                    <span className="text-slate-400">→</span>
                  </Link>
                  <Link href="/game-producer-jobs" className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all">
                    <span className="text-white">Game Producers</span>
                    <span className="text-slate-400">→</span>
                  </Link>
                  <Link href="/esports-jobs" className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all">
                    <span className="text-white">Esports Professionals</span>
                    <span className="text-slate-400">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600/20 via-slate-900 to-pink-600/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Let's Connect
            </h2>
            <p className="text-slate-300 mb-8">
              Whether you're seeking your next role or hiring gaming talent, we're here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Get in Touch
              </Link>
              <Link
                href="/esports-jobs"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-purple-500 transition-all"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Explore More</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Link href="/games-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Games Jobs</h3>
                <p className="text-slate-400 text-sm">Browse all gaming jobs.</p>
              </Link>
              <Link href="/esports-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Esports Jobs</h3>
                <p className="text-slate-400 text-sm">Competitive gaming careers.</p>
              </Link>
              <Link href="/entry-level-gaming-jobs" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Entry Level</h3>
                <p className="text-slate-400 text-sm">Start your gaming career.</p>
              </Link>
              <Link href="/how-to-get-into-esports" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                <h3 className="font-semibold text-white mb-2">Career Guide</h3>
                <p className="text-slate-400 text-sm">Industry advice.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
