import Link from "next/link";
import { Metadata } from "next";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { esportsJobs } from "../../lib/jobs-data";

export const metadata: Metadata = {
  title: "Gaming Recruitment Agency | Game Industry Recruiters | MVP",
  description: "Specialist gaming recruitment agency connecting talent with video game companies, esports organisations, and game publishers. Expert game industry recruiters for development, marketing, and esports roles.",
  keywords: "gaming recruitment agency, game industry recruiters, gaming recruitment agencies, video game recruiters, games recruitment agencies, gaming recruitment companies",
  openGraph: {
    title: "Gaming Recruitment Agency | Game Industry Recruiters",
    description: "Specialist gaming recruitment connecting talent with video game companies and esports organisations.",
    type: "website",
    url: "https://mvp.actor/gaming-recruitment-agency",
  },
  alternates: {
    canonical: "https://mvp.actor/gaming-recruitment-agency",
  },
};

const recruitmentServices = [
  {
    icon: "🎮",
    title: "Esports Recruitment",
    description: "From pro players to team managers, we recruit across the competitive gaming ecosystem. Our esports recruitment agency specialises in tournament organisers, broadcast talent, and esports marketing roles.",
    roles: ["Pro Players", "Coaches", "Analysts", "Team Managers", "Casters"],
  },
  {
    icon: "💻",
    title: "Game Development",
    description: "Connect with talented game developers, designers, artists, and engineers. We work with indie studios and AAA publishers to fill technical and creative positions.",
    roles: ["Game Designers", "Programmers", "Artists", "QA Testers", "Producers"],
  },
  {
    icon: "📱",
    title: "Mobile Gaming",
    description: "The mobile gaming market is booming. We help studios find product managers, monetisation experts, UA specialists, and live ops professionals.",
    roles: ["Product Managers", "UA Managers", "Live Ops", "Game Economy Designers"],
  },
  {
    icon: "📊",
    title: "Gaming Marketing",
    description: "Marketing in gaming requires industry knowledge. We recruit community managers, social media specialists, influencer managers, and brand marketers.",
    roles: ["Community Managers", "Social Media", "Influencer Marketing", "PR"],
  },
];

const whyChooseUs = [
  { stat: "20+", label: "Years Gaming Industry Experience", description: "Our recruiters have worked in gaming and esports for over two decades." },
  { stat: "500+", label: "Placements Made", description: "We've successfully placed hundreds of candidates in gaming roles." },
  { stat: "100+", label: "Partner Companies", description: "From indie studios to major publishers, we work with the best." },
  { stat: "24h", label: "Average Response Time", description: "We move fast because the gaming industry moves fast." },
];

const partnerTypes = [
  { name: "AAA Publishers", examples: "Riot Games, EA, Ubisoft, Activision Blizzard" },
  { name: "Esports Organisations", examples: "Fnatic, G2, Cloud9, Team Liquid, Excel" },
  { name: "Game Studios", examples: "Indie studios to mid-size developers" },
  { name: "Tech Companies", examples: "Streaming platforms, hardware manufacturers" },
];

export default function GamingRecruitmentAgencyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <UnifiedHeader activeSite="jobs" siteNavItems={JOBS_SITE_NAV_ITEMS} ctaLabel="Post a Job" ctaHref="/contact" />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0d0d15] to-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10">
            <span className="text-cyan-400 font-medium">🎯 Specialist Gaming Recruiters</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-cyan-400">Gaming Recruitment Agency</span><br />
            <span className="text-gray-300">Game Industry Recruiters</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Looking for a specialist <strong className="text-white">gaming recruitment agency</strong>? Our expert <strong className="text-white">game industry recruiters</strong> connect talented professionals with video game companies, esports organisations, and gaming startups worldwide.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link href="/contact" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-8 rounded-lg transition-all">Hire Gaming Talent</Link>
            <Link href="/esports-jobs" className="border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold py-4 px-8 rounded-lg transition-all">Find Gaming Jobs</Link>
          </div>

          <p className="text-gray-400 text-sm">Part of the <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">MVP esports recruitment agency</Link> network</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-cyan-900/20 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-black text-cyan-400 mb-2">{item.stat}</div>
                <div className="text-white font-medium mb-1">{item.label}</div>
                <div className="text-gray-400 text-sm">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Services */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Our <span className="text-cyan-400">Gaming Recruitment</span> Services</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">As a specialist <strong className="text-white">gaming recruitment agency</strong>, we cover every sector of the video game and esports industry.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {recruitmentServices.map((service, index) => (
              <div key={index} className="p-8 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.roles.map((role, i) => (
                    <span key={i} className="px-3 py-1 text-sm rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">{role}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Specialist Recruiters */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Specialist <span className="text-purple-400">Game Industry Recruiters</span>?</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">Industry Expertise</h3>
              <p className="text-gray-400">General recruiters don&apos;t understand the difference between a game designer and a level designer. Our <strong>gaming recruitment agencies</strong> do.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-lg font-bold text-white mb-2">Global Network</h3>
              <p className="text-gray-400">Access candidates and companies across gaming hubs worldwide, from LA and London to Tokyo and Stockholm.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Speed to Hire</h3>
              <p className="text-gray-400">Gaming moves fast. Our <strong>game industry recruiters</strong> understand urgency and can fill roles quickly without sacrificing quality.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-xl p-6 border border-gray-700">
            <h3 className="font-bold text-white mb-4">Our Clients Include:</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {partnerTypes.map((type, index) => (
                <div key={index}><div className="text-cyan-400 font-medium mb-1">{type.name}</div><div className="text-gray-400 text-sm">{type.examples}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Jobs */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Current <span className="text-cyan-400">Gaming Jobs</span></h2>
          <div className="grid gap-4 mb-8">
            {esportsJobs.slice(0, 6).map((job) => (
              <Link key={job.id} href={"/job/" + job.id} className="block p-5 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mt-1">
                      <span className="text-cyan-400 font-medium">{job.company}</span>
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary}</span>
                    </div>
                  </div>
                  <span className="bg-cyan-500 group-hover:bg-cyan-400 text-black font-bold py-2 px-5 rounded transition-all whitespace-nowrap">View Job →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/esports-jobs" className="inline-flex items-center gap-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold py-3 px-8 rounded-lg transition-all">View All Gaming Jobs →</Link>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Gaming Industry Resources</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="https://ukie.org.uk" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">UKIE</h3><p className="text-gray-400 text-xs">UK games industry trade body</p></a>
            <a href="https://www.gamesindustry.biz" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">GamesIndustry.biz</h3><p className="text-gray-400 text-xs">Gaming business news</p></a>
            <a href="https://www.gamedeveloper.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">Game Developer</h3><p className="text-gray-400 text-xs">Development resources</p></a>
            <a href="https://igda.org" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">IGDA</h3><p className="text-gray-400 text-xs">Game Developers Association</p></a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Work With Our Gaming Recruitment Agency</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Whether you&apos;re hiring or job hunting, our specialist <strong>game industry recruiters</strong> are here to help. Contact our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-10 rounded-lg transition-all">Contact Our Team</Link>
            <Link href="/" className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-lg transition-all">Learn About MVP</Link>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Related Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all group"><h3 className="font-bold text-white mb-2 group-hover:text-cyan-400">Esports Recruitment Agency</h3><p className="text-gray-400 text-sm">Specialist esports talent acquisition and recruitment.</p></Link>
            <Link href="/esports-recruitment" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-purple-500/50 transition-all group"><h3 className="font-bold text-white mb-2 group-hover:text-purple-400">Esports Recruitment Services</h3><p className="text-gray-400 text-sm">Full recruitment services for esports organisations.</p></Link>
            <Link href="/professional-gaming-teams-recruiting" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-green-500/50 transition-all group"><h3 className="font-bold text-white mb-2 group-hover:text-green-400">Team Recruitment</h3><p className="text-gray-400 text-sm">Help professional gaming teams find talent.</p></Link>
          </div>
        </div>
      </section>

      <UnifiedFooter activeSite="jobs" />
    </main>
  );
}
