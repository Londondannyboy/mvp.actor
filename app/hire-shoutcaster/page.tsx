import Link from "next/link";
import { Metadata } from "next";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { esportsJobs } from "../../lib/jobs-data";

export const metadata: Metadata = {
  title: "Hire a Shoutcaster | Esports Broadcast Talent Recruitment",
  description: "Looking to hire a shoutcaster or esports commentator? Our esports recruitment agency connects you with professional casters, analysts, and broadcast talent for tournaments and events.",
  keywords: "hire a shoutcaster, esports commentator, broadcast talent, esports caster, tournament commentator, esports recruitment agency",
  openGraph: {
    title: "Hire a Shoutcaster | Esports Broadcast Talent Recruitment",
    description: "Connect with professional esports casters and broadcast talent through our specialist recruitment agency.",
    type: "website",
    url: "https://mvp.actor/hire-shoutcaster",
  },
  alternates: {
    canonical: "https://mvp.actor/hire-shoutcaster",
  },
};

const shoutcasterRoles = [
  {
    title: "Play-by-Play Caster",
    description: "The voice of the action. Play-by-play casters deliver rapid-fire commentary during gameplay, keeping viewers engaged with every kill, objective, and team fight.",
    skills: ["Quick thinking", "Game knowledge", "Voice projection", "Stamina for long broadcasts"],
    salary: "£25,000 - £80,000+",
  },
  {
    title: "Colour Commentator / Analyst",
    description: "The strategic mind. Colour casters provide in-depth analysis, explaining team strategies, player decisions, and meta developments during downtime.",
    skills: ["Deep game knowledge", "Analytical thinking", "Chemistry with co-caster", "Statistical awareness"],
    salary: "£30,000 - £100,000+",
  },
  {
    title: "Desk Host",
    description: "The anchor of the broadcast. Desk hosts guide pre-game and post-game analysis, interview players, and keep the show running smoothly.",
    skills: ["Interviewing", "Time management", "Industry knowledge", "Camera presence"],
    salary: "£35,000 - £90,000+",
  },
  {
    title: "Observer / In-Game Director",
    description: "The unseen storyteller. Observers control what viewers see during matches, capturing the best angles and crucial moments.",
    skills: ["Game sense", "Anticipation", "Technical skills", "Real-time decision making"],
    salary: "£25,000 - £60,000+",
  },
];

const topCasters = [
  { name: "Quickshot (Trevor Henry)", game: "League of Legends", org: "Riot Games", achievement: "LEC Lead Caster" },
  { name: "Machine (Alex Richardson)", game: "CS:GO/Valorant", org: "Freelance", achievement: "Major Finals Host" },
  { name: "Goldenboy", game: "Multiple", org: "Freelance", achievement: "Overwatch League Host" },
  { name: "Frankie Ward", game: "CS:GO/Dota 2", org: "Freelance", achievement: "TI/Major Host" },
];

// Filter broadcast-related jobs
const broadcastJobs = esportsJobs.filter(
  (job) =>
    job.category === "production" ||
    job.title.toLowerCase().includes("broadcast") ||
    job.title.toLowerCase().includes("caster") ||
    job.title.toLowerCase().includes("host") ||
    job.skills.some((s) => s.toLowerCase().includes("broadcast"))
);

export default function HireShoutcasterPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <UnifiedHeader
        activeSite="jobs"
        siteNavItems={JOBS_SITE_NAV_ITEMS}
        ctaLabel="Post a Job"
        ctaHref="/contact"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0d0d15] to-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10">
            <span className="text-purple-400 font-medium">🎙️ Broadcast Talent Recruitment</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-purple-400">Hire a Shoutcaster</span> for Your Esports Event
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Looking to hire professional esports commentators and broadcast talent? Our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> connects tournament organisers with world-class shoutcasters, analysts, desk hosts, and production talent.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-lg transition-all"
            >
              Hire Broadcast Talent
            </Link>
            <Link
              href="/esports-broadcaster-careers"
              className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 font-bold py-4 px-8 rounded-lg transition-all"
            >
              Become a Caster
            </Link>
          </div>
        </div>
      </section>

      {/* Why Hire Professional Casters */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Hire Professional <span className="text-purple-400">Shoutcasters</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-bold text-white mb-2">Increase Viewer Engagement</h3>
              <p className="text-gray-400">Professional casters keep audiences hooked. Great commentary can increase watch time by 40% and boost social media engagement significantly.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-white mb-2">Elevate Production Quality</h3>
              <p className="text-gray-400">A skilled broadcast team transforms amateur streams into professional productions that sponsors and viewers expect from esports events.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">Attract Sponsorships</h3>
              <p className="text-gray-400">High-quality broadcasts with professional talent attract better sponsorship deals and higher advertising rates for your events.</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Trusted by leading tournament organisers. Our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> has placed talent at ESL, BLAST, WePlay, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Broadcast Roles */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Types of <span className="text-purple-400">Broadcast Talent</span> We Recruit
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            From play-by-play casters to desk analysts, our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> can help you find the right talent for your event.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {shoutcasterRoles.map((role, index) => (
              <div key={index} className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-purple-500/50 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{role.title}</h3>
                <p className="text-gray-400 mb-4">{role.description}</p>
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Key Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {role.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-green-400">💰 Typical Salary:</span> {role.salary}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notable Casters */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Industry-Leading <span className="text-cyan-400">Esports Casters</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {topCasters.map((caster, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 text-center">
                <h3 className="font-bold text-white mb-1">{caster.name}</h3>
                <p className="text-purple-400 text-sm">{caster.game}</p>
                <p className="text-gray-500 text-xs mt-1">{caster.achievement}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm">
            Learn more about esports broadcast careers at{" "}
            <a href="https://britishesports.org/the-hub/careers/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">
              British Esports Career Hub
            </a>
            {" "}and{" "}
            <a href="https://www.linkedin.com/pulse/how-become-esports-caster-comprehensive-guide/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">
              LinkedIn Caster Guide
            </a>
          </p>
        </div>
      </section>

      {/* Related Jobs */}
      {broadcastJobs.length > 0 && (
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Current <span className="text-cyan-400">Broadcast Jobs</span>
            </h2>

            <div className="grid gap-4">
              {broadcastJobs.slice(0, 5).map((job) => (
                <Link
                  key={job.id}
                  href={`/job/${job.id}`}
                  className="block p-5 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mt-1">
                        <span className="text-cyan-400 font-medium">{job.company}</span>
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                      </div>
                    </div>
                    <span className="bg-cyan-500 group-hover:bg-cyan-400 text-black font-bold py-2 px-5 rounded transition-all whitespace-nowrap">
                      View Job →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/esports-jobs?category=production"
                className="inline-flex items-center gap-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold py-3 px-8 rounded-lg transition-all"
              >
                View All Production Jobs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need to Hire Esports Broadcast Talent?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you need a single caster or a full broadcast team, our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> can help you find the perfect talent for your event.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-10 rounded-lg transition-all"
          >
            Contact Our Recruitment Team →
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Related Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all group">
              <h3 className="font-bold text-white mb-2 group-hover:text-cyan-400">Esports Recruitment Agency</h3>
              <p className="text-gray-400 text-sm">Full-service esports talent acquisition and recruitment.</p>
            </Link>
            <Link href="/esports-broadcaster-careers" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-purple-500/50 transition-all group">
              <h3 className="font-bold text-white mb-2 group-hover:text-purple-400">Broadcaster Careers</h3>
              <p className="text-gray-400 text-sm">Guide to becoming an esports caster or commentator.</p>
            </Link>
            <Link href="/esports-jobs" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-green-500/50 transition-all group">
              <h3 className="font-bold text-white mb-2 group-hover:text-green-400">All Esports Jobs</h3>
              <p className="text-gray-400 text-sm">Browse all open positions in esports and gaming.</p>
            </Link>
          </div>
        </div>
      </section>

      <UnifiedFooter activeSite="jobs" />
    </main>
  );
}
