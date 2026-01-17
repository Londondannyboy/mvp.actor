import Link from "next/link";
import { Metadata } from "next";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { esportsJobs } from "../../lib/jobs-data";

export const metadata: Metadata = {
  title: "Professional Gaming Teams Recruiting | Esports Team Recruitment",
  description: "Connect with professional gaming teams recruiting new talent. Our esports recruitment agency helps teams find players, coaches, analysts, and staff. Join top esports organisations.",
  keywords: "professional gaming teams recruiting, esports teams recruiting, esports team recruitment, join esports team, gaming team jobs, esports player recruitment",
  openGraph: {
    title: "Professional Gaming Teams Recruiting | Esports Team Recruitment",
    description: "Find opportunities with professional gaming teams. Players, coaches, analysts, and staff positions available.",
    type: "website",
    url: "https://mvp.actor/professional-gaming-teams-recruiting",
  },
  alternates: {
    canonical: "https://mvp.actor/professional-gaming-teams-recruiting",
  },
};

const teamRoles = [
  { icon: "🎮", title: "Pro Players", description: "Compete at the highest level as a signed professional player. Teams recruit across all major titles including League of Legends, Valorant, CS2, Fortnite, and more.", salary: "£20,000 - £500,000+" },
  { icon: "🎯", title: "Head Coach", description: "Lead the competitive strategy and player development. Head coaches are responsible for team performance, practice schedules, and in-game decision making.", salary: "£40,000 - £150,000+" },
  { icon: "📊", title: "Performance Analyst", description: "Provide data-driven insights on team performance, opponent strategies, and meta developments. Analysts are crucial to competitive success.", salary: "£25,000 - £80,000" },
  { icon: "🧠", title: "Sports Psychologist", description: "Support player mental health and competitive mindset. Increasingly important as esports becomes more professional.", salary: "£35,000 - £90,000" },
  { icon: "👔", title: "Team Manager", description: "Handle day-to-day operations, logistics, player contracts, and team coordination. The backbone of any professional organisation.", salary: "£30,000 - £100,000" },
  { icon: "📱", title: "Content Creator", description: "Create engaging content around the team and players. Build the brand through social media, YouTube, and streaming.", salary: "£25,000 - £70,000" },
];

const topTeams = [
  { name: "Team Liquid", region: "NA/EU", games: "LoL, Valorant, CS2, Dota 2", link: "/team-liquid-careers" },
  { name: "Fnatic", region: "EU", games: "LoL, Valorant, CS2", link: "/fnatic-careers" },
  { name: "Cloud9", region: "NA", games: "LoL, Valorant, CS2", link: "/cloud9-careers" },
  { name: "G2 Esports", region: "EU", games: "LoL, Valorant, CS2", link: "/g2-esports-careers" },
  { name: "T1", region: "KR", games: "LoL, Valorant", link: "/esports-jobs" },
  { name: "100 Thieves", region: "NA", games: "LoL, Valorant", link: "/esports-jobs" },
];

const recruitmentProcess = [
  { step: "01", title: "Scout & Discover", description: "Teams use ranked ladders, amateur leagues, and tryouts to identify talent. Performance in Challenger, Radiant, or FPL matters." },
  { step: "02", title: "Trial Period", description: "Promising players undergo trial periods with the team, practicing and scrimming to assess fit, communication, and skill." },
  { step: "03", title: "Contract Negotiation", description: "Successful trials lead to contract offers covering salary, benefits, buyout clauses, and competitive terms." },
  { step: "04", title: "Onboarding", description: "New team members are integrated into the organisation, including team house, practice schedule, and media training." },
];

// Filter team/player related jobs
const teamJobs = esportsJobs.filter(
  (job) =>
    job.category === "coaching" ||
    job.title.toLowerCase().includes("coach") ||
    job.title.toLowerCase().includes("analyst") ||
    job.title.toLowerCase().includes("manager") ||
    job.title.toLowerCase().includes("player")
);

export default function ProfessionalGamingTeamsRecruitingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <UnifiedHeader activeSite="jobs" siteNavItems={JOBS_SITE_NAV_ITEMS} ctaLabel="Post a Job" ctaHref="/contact" />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0d0d15] to-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-green-500/50 bg-green-500/10">
            <span className="text-green-400 font-medium">🏆 Join the Pros</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-green-400">Professional Gaming Teams</span><br />
            <span className="text-white">Recruiting Now</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Looking to join a <strong className="text-white">professional gaming team</strong>? Or recruiting talent for your esports organisation? Our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> connects players, coaches, and staff with top teams worldwide.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link href="/esports-jobs?category=coaching" className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-lg transition-all">Find Team Jobs</Link>
            <Link href="/contact" className="border-2 border-green-500 text-green-400 hover:bg-green-500/20 font-bold py-4 px-8 rounded-lg transition-all">Recruit for Your Team</Link>
          </div>

          <p className="text-gray-400 text-sm">Trusted by leading esports organisations. Part of the <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">MVP esports recruitment agency</Link>.</p>
        </div>
      </section>

      {/* Team Roles */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Roles in <span className="text-green-400">Professional Gaming Teams</span></h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Professional esports organisations recruit for many positions beyond players. Our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> places talent across all roles.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamRoles.map((role, index) => (
              <div key={index} className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-green-500/50 transition-all">
                <div className="text-3xl mb-3">{role.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{role.description}</p>
                <div className="text-sm"><span className="text-green-400">💰</span> <span className="text-gray-300">{role.salary}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Teams */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Top <span className="text-cyan-400">Esports Teams Recruiting</span></h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {topTeams.map((team, index) => (
              <Link key={index} href={team.link} className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all group">
                <h3 className="font-bold text-white mb-1 group-hover:text-cyan-400">{team.name}</h3>
                <p className="text-gray-400 text-sm">{team.region} • {team.games}</p>
              </Link>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm">Track team news and roster moves at <a href="https://www.esportsinsider.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Esports Insider</a> and <a href="https://www.dexerto.com/esports/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Dexerto</a></p>
        </div>
      </section>

      {/* Recruitment Process */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">How <span className="text-purple-400">Esports Team Recruitment</span> Works</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recruitmentProcess.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-black text-purple-500/20 absolute -top-2 -left-1">{step.step}</div>
                <div className="relative bg-gray-900/50 border border-gray-700 rounded-xl p-6 pt-10">
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Jobs */}
      {teamJobs.length > 0 && (
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Current <span className="text-green-400">Team Positions</span></h2>

            <div className="grid gap-4 mb-8">
              {teamJobs.slice(0, 6).map((job) => (
                <Link key={job.id} href={"/job/" + job.id} className="block p-5 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-green-500/50 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mt-1">
                        <span className="text-cyan-400 font-medium">{job.company}</span>
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                      </div>
                    </div>
                    <span className="bg-green-600 group-hover:bg-green-500 text-white font-bold py-2 px-5 rounded transition-all whitespace-nowrap">View Job →</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/esports-jobs" className="inline-flex items-center gap-2 border-2 border-green-500 text-green-400 hover:bg-green-500/20 font-bold py-3 px-8 rounded-lg transition-all">View All Esports Jobs →</Link>
            </div>
          </div>
        </section>
      )}

      {/* Resources */}
      <section className="py-16 bg-[#0d0d15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Esports Team Resources</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="https://liquipedia.net" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">Liquipedia</h3><p className="text-gray-400 text-xs">Esports wiki & team info</p></a>
            <a href="https://www.esportsearnings.com" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">Esports Earnings</h3><p className="text-gray-400 text-xs">Prize pool & player earnings</p></a>
            <a href="https://www.thespike.gg" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">The Spike</h3><p className="text-gray-400 text-xs">Valorant esports news</p></a>
            <a href="https://www.hltv.org" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all text-center"><h3 className="font-bold text-white mb-1">HLTV</h3><p className="text-gray-400 text-xs">CS2 news & rankings</p></a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join a Pro Team?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Whether you are a player looking for your big break or a team recruiting talent, our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> can help you succeed.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/esports-jobs" className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-lg transition-all">Browse Team Jobs</Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-lg transition-all">Contact Recruiters</Link>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Related Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all group"><h3 className="font-bold text-white mb-2 group-hover:text-cyan-400">Esports Recruitment Agency</h3><p className="text-gray-400 text-sm">Full-service esports talent acquisition.</p></Link>
            <Link href="/esports-coach-careers" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-purple-500/50 transition-all group"><h3 className="font-bold text-white mb-2 group-hover:text-purple-400">Esports Coach Careers</h3><p className="text-gray-400 text-sm">Guide to becoming a pro esports coach.</p></Link>
            <Link href="/gaming-recruitment-agency" className="p-6 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-green-500/50 transition-all group"><h3 className="font-bold text-white mb-2 group-hover:text-green-400">Gaming Recruitment Agency</h3><p className="text-gray-400 text-sm">Broader gaming industry recruitment.</p></Link>
          </div>
        </div>
      </section>

      <UnifiedFooter activeSite="jobs" />
    </main>
  );
}
