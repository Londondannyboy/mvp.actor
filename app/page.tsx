"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { authClient } from "@/app/lib/auth/client";
import { useCallback, useEffect, Suspense, useState } from "react";
import { esportsJobs } from "../lib/jobs-data";
import { UnifiedHeader } from "./components/UnifiedHeader";
import { UnifiedFooter } from "./components/UnifiedFooter";
import { useCoAgent, useRenderToolCall, useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";

// Deferred CopilotKit UI - only loads when user clicks to chat
const CopilotSidebar = dynamic(
  () => import("@copilotkit/react-ui").then(mod => mod.CopilotSidebar),
  { ssr: false }
);


// UserProfileGraph - lazy loaded for chat visualization
const UserProfileGraph = dynamic(
  () => import("./components/UserProfileGraph").then(mod => mod.UserProfileGraph),
  { ssr: false }
);
const ProfileItemsList = dynamic(
  () => import("./components/UserProfileGraph").then(mod => mod.ProfileItemsList),
  { ssr: false }
);

// Three.js Spotlight Walk - lazy loaded
const ThreeSpotlightWalk = dynamic(
  () => import("./components/ThreeSpotlightWalk").then(mod => mod.ThreeSpotlightWalk),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
);

// Dynamic imports for heavy components
const GamerHero = dynamic(
  () => import("./components/GamerHero").then(mod => mod.GamerHero),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20 animate-pulse" />
    ),
  }
);

const VoiceInput = dynamic(
  () => import("./components/VoiceInput").then((mod) => ({ default: mod.VoiceInput })),
  {
    ssr: false,
    loading: () => (
      <div className="w-16 h-16 rounded-full bg-gray-700/50 animate-pulse" />
    ),
  }
);

const JobSearch = dynamic(
  () => import("./components/JobSearch").then(mod => ({ default: mod.JobSearch })),
  { loading: () => <div className="h-14 bg-gray-800/50 rounded-xl animate-pulse" /> }
);
const PopularSearches = dynamic(
  () => import("./components/JobSearch").then(mod => ({ default: mod.PopularSearches })),
  { loading: () => <div className="h-8" /> }
);
const AnimatedTagline = dynamic(
  () => import("./components/AnimatedTagline").then(mod => ({ default: mod.AnimatedTagline })),
  { loading: () => <div className="mb-8 h-[60px] sm:h-[72px] md:h-[88px] lg:h-[104px]" /> }
);
const AnimatedSectionHeader = dynamic(
  () => import("./components/AnimatedSectionHeader").then(mod => ({ default: mod.AnimatedSectionHeader })),
  { loading: () => <div className="h-24" /> }
);
const NewsSection = dynamic(
  () => import("./components/NewsSection").then(mod => ({ default: mod.NewsSection })),
  { loading: () => <div className="h-96 bg-gray-900/50 rounded-2xl animate-pulse" /> }
);
const HeyCompanies = dynamic(
  () => import("./components/HeyCompanies").then(mod => ({ default: mod.HeyCompanies })),
  { loading: () => <div className="h-96 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 animate-pulse" /> }
);
const HeyCompaniesCompact = dynamic(
  () => import("./components/HeyCompanies").then(mod => ({ default: mod.HeyCompaniesCompact })),
  { loading: () => <div className="h-32 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-xl animate-pulse" /> }
);

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  url: string;
}

interface UserProfile {
  id?: string;
  name?: string;
  firstName?: string;
  email?: string;
}

interface AgentState {
  jobs: Job[];
  search_query: string;
  user?: UserProfile;
}

// Data from v1
const jobCategories = [
  {
    icon: "🎮",
    title: "Pro Players & Athletes",
    description: "Compete professionally in titles like League of Legends, Valorant, CS2, Fortnite, and more. Join top esports organisations as a signed player with salary, benefits, and competition opportunities.",
    features: ["Competitive Salary", "Team House", "Tournament Travel"],
  },
  {
    icon: "🎯",
    title: "Coaches & Analysts",
    description: "Guide professional teams to victory with strategic coaching and data analysis. Review VODs, develop strategies, and help players reach their peak performance in competitive gaming.",
    features: ["Strategic Planning", "Player Development", "Performance Analysis"],
  },
  {
    icon: "📹",
    title: "Content Creators & Streamers",
    description: "Create engaging gaming content for YouTube, TikTok, and Twitch. Work with esports organisations, game publishers, and brands to produce videos, streams, and social media content.",
    features: ["Video Production", "Live Streaming", "Brand Partnerships"],
  },
  {
    icon: "🎙️",
    title: "Casters & Broadcast Talent",
    description: "Bring esports matches to life as a shoutcaster, analyst desk host, or broadcast talent. Commentate on live competitions and engage audiences watching from around the world.",
    features: ["Live Commentary", "Desk Analysis", "Event Hosting"],
  },
  {
    icon: "🏟️",
    title: "Event & Tournament Organisers",
    description: "Plan and execute esports tournaments from local LAN parties to international championships. Manage venues, coordinate teams, and deliver unforgettable competitive experiences.",
    features: ["Event Planning", "Venue Management", "Production Coordination"],
  },
  {
    icon: "📊",
    title: "Marketing & Business",
    description: "Drive growth for esports organisations through marketing, partnerships, and business development. Manage sponsorships, social media, and brand strategies in the gaming industry.",
    features: ["Partnership Sales", "Social Media", "Brand Strategy"],
  },
];

const stats = [
  { value: "$1.8B", label: "Global Esports Market", suffix: "" },
  { value: "540M", label: "Global Viewers", suffix: "" },
  { value: "22,000+", label: "Pro Players Worldwide", suffix: "" },
  { value: "100%", label: "Free Job Board", suffix: "" },
];

const featuredJobs = esportsJobs;
const MUX_PLAYBACK_ID = "A6OZmZy02Y00K4ZPyHuyfTVXoauVjLhiHlbR2bLqtBywY";
const MUX_HERO_ID = "QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI";

const companies = ["Logitech", "Team Liquid", "Octagon", "Garena", "Grand Canyon University", "Red Bull", "Riot Games", "ESL"];

const careerPaths = [
  { title: "Competition Path", description: "For those who want to compete at the highest level as professional players or support competitive teams.", roles: ["Pro Player", "Team Coach", "Analyst", "Team Manager", "Performance Coach"], icon: "🏆" },
  { title: "Content Path", description: "For creative individuals who want to build audiences and create engaging gaming content.", roles: ["Streamer", "YouTuber", "Podcast Host", "Content Producer", "Video Editor"], icon: "🎬" },
  { title: "Broadcast Path", description: "For those who want to bring esports to life through live production and commentary.", roles: ["Shoutcaster", "Desk Analyst", "Host", "Producer", "Observer"], icon: "📺" },
  { title: "Business Path", description: "For professionals who want to grow esports organisations through business and marketing.", roles: ["Marketing Manager", "Partnership Manager", "General Manager", "HR", "Finance"], icon: "💼" },
];

const industryStats = [
  { stat: "540 million", label: "People watch esports globally, with the audience growing 8% year-over-year. More viewers mean more jobs in the industry." },
  { stat: "£100 million", label: "The UK esports market alone is valued at over £100 million, creating thousands of job opportunities across the country." },
  { stat: "22,000+", label: "Professional esports players compete globally, supported by coaches, analysts, managers, and content teams." },
  { stat: "200%", label: "Growth in esports job postings since 2020, as the industry professionalises and expands into new markets." },
];

const esportsCareerVideos = [
  { id: "5FWIuIBoZBk", title: "Inside the Esports Industry", description: "Discover what it takes to build a career in esports, from team operations to content creation and beyond." },
  { id: "vYrYwYWxAsQ", title: "The World of Professional Gaming", description: "An inside look at the competitive gaming industry and the opportunities it creates for passionate professionals." },
];

// Agent Instructions
const agentInstructions = `## CRITICAL ROLE
You are an expert esports recruitment consultant for EsportsJobs.quest, the #1 esports recruitment agency.

## AVAILABLE TOOLS
- search_esports_jobs: Search jobs by location, category, company, type
- lookup_esports_company: Get company info
- get_categories: List job categories
- get_countries: List countries
- get_my_profile: Get current user's profile

## PERSONA
Be enthusiastic about esports careers. Help users find their dream gaming job.
Always use your tools to provide real job data!`;

const PAGE_CONTEXT = {
  pageId: "homepage",
  pageType: "homepage",
  title: "EsportsJobs.quest - Find Your Career in Gaming",
  pageH1: "Esports Recruitment Agency Quest",
  pageUrl: "/",
  pageDescription: "Leading esports recruitment agency connecting gaming talent with top organisations.",
};

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] || null;

  // Deferred loading - only load heavy components when user interacts
  const [chatEnabled, setChatEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false); // Tracks when video swaps to 3D

  const { state, setState } = useCoAgent<AgentState>({
    name: "esports_agent",
    initialState: { jobs: [], search_query: "", user: undefined },
  });

  useEffect(() => {
    if (user && !state?.user?.id) {
      setState((prev) => ({
        jobs: prev?.jobs ?? [],
        search_query: prev?.search_query ?? "",
        user: { id: user.id, name: user.name || undefined, firstName: firstName || undefined, email: user.email || undefined },
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, state?.user?.id, firstName, setState]);

  const { appendMessage } = useCopilotChat();
  const handleVoiceMessage = useCallback(
    (text: string, role?: "user" | "assistant") => {
      if (role === "user") {
        try {
          const message = new TextMessage({ content: text, role: Role.User });
          appendMessage(message);
        } catch (e) {
          console.error("[Voice] Error:", e);
        }
      }
    },
    [appendMessage]
  );

  useRenderToolCall({
    name: "search_esports_jobs",
    render: ({ status }) => {
      if (status === "executing") {
        return <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 animate-pulse"><p className="text-sm text-gray-400">Searching jobs...</p></div>;
      }
      return null;
    },
  });

  // Render profile graph when agent calls show_user_profile_graph
  useRenderToolCall({
    name: "show_user_profile_graph",
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <div className="p-4 rounded-lg bg-gray-800/50 border border-purple-500/30 animate-pulse">
            <p className="text-sm text-purple-400">Loading your profile...</p>
          </div>
        );
      }
      if (status === "complete" && result?.render) {
        return (
          <div className="my-4">
            <ProfileItemsList
              graphData={result.graph}
              completeness={result.completeness}
            />
          </div>
        );
      }
      return null;
    },
  });

  // Render skill save confirmation
  useRenderToolCall({
    name: "save_user_skill",
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 animate-pulse">
            <p className="text-sm text-purple-400">Adding skill to your profile...</p>
          </div>
        );
      }
      if (status === "complete" && result?.success) {
        return (
          <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/50">
            <p className="text-sm text-purple-300">
              ✓ Added <span className="font-medium text-white">{result.skill}</span> ({result.proficiency}) to your profile
            </p>
          </div>
        );
      }
      return null;
    },
  });

  // Render role preference save confirmation
  useRenderToolCall({
    name: "save_role_preference",
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 animate-pulse">
            <p className="text-sm text-blue-400">Setting your target role...</p>
          </div>
        );
      }
      if (status === "complete" && result?.success) {
        return (
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/50">
            <p className="text-sm text-blue-300">
              ✓ Target role set to <span className="font-medium text-white">{result.role}</span>
            </p>
          </div>
        );
      }
      return null;
    },
  });

  // Render location preference save confirmation
  useRenderToolCall({
    name: "save_location_preference",
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 animate-pulse">
            <p className="text-sm text-green-400">Setting your location preference...</p>
          </div>
        );
      }
      if (status === "complete" && result?.success) {
        return (
          <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50">
            <p className="text-sm text-green-300">
              ✓ Location set to <span className="font-medium text-white">{result.location}</span>
              {result.remote_ok && <span className="text-green-400"> (Remote OK)</span>}
            </p>
          </div>
        );
      }
      return null;
    },
  });

  // Main page content - extracted so it can be wrapped conditionally
  const pageContent = (
      <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
        {/* 3D Hero Section - THE CENTERPIECE */}
        <section className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />}>
              <GamerHero className="w-full h-full" onSwapTo3D={() => setIs3DMode(true)} />
            </Suspense>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
          </div>

          <UnifiedHeader
            activeSite="jobs"
            siteNavItems={[
              { label: "Esports Jobs", href: "/esports-jobs" },
              { label: "Career Guides", href: "/esports-careers" },
              { label: "Salary Guide", href: "/esports-salary-guide-uk" },
              { label: "How to Get In", href: "/how-to-get-into-esports" },
            ]}
            ctaLabel="Post a Job"
            ctaHref="/contact"
          />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full border border-cyan-400/60 bg-black/50 backdrop-blur-sm">
              <span className="text-2xl font-black text-cyan-400">#1</span>
              <span className="text-white font-medium">Best Esports Recruitment Agency</span>
            </div>
            <AnimatedTagline is3DMode={is3DMode} firstName={firstName} />
            <h1 className="sr-only">Esports Recruitment Agency Quest</h1>
            <div className="mt-8">
              <JobSearch size="large" className="mb-4" />
              <PopularSearches />
            </div>
            {/* Voice AI button - deferred loading */}
            <div className="mt-8 flex flex-col items-center gap-2">
              {voiceEnabled ? (
                <VoiceInput onMessage={handleVoiceMessage} firstName={firstName} userId={user?.id} email={user?.email} pageContext={PAGE_CONTEXT} />
              ) : (
                <button
                  onClick={() => setVoiceEnabled(true)}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl bg-gradient-to-br from-cyan-500 to-purple-600 hover:scale-110 shadow-purple-500/30"
                  aria-label="Start voice chat with AI"
                >
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}
              <span className="text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Talk to our AI</span>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce" role="presentation" aria-hidden="true">
            <div className="w-6 h-10 rounded-full border-2 border-cyan-500/50 flex items-start justify-center p-2 bg-black/40 backdrop-blur-sm">
              <div className="w-1 h-3 bg-cyan-500 rounded-full animate-pulse" />
            </div>
            <span className="sr-only">Scroll down for more content</span>
          </div>
        </section>

        {/* Description Section with Video Background */}
        <section className="py-12 relative overflow-hidden border-b border-gray-800/50">
          {/* Video background */}
          <div className="absolute inset-0" aria-hidden="true">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="https://image.mux.com/QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI/thumbnail.webp?time=1&width=1200"
              className="w-full h-full object-cover opacity-30"
            >
              <source src="https://stream.mux.com/QeCiSMO9ZeptbSh02kbUCenrNIpwR02X0202Lcxz700HqYvI.m3u8" type="application/x-mpegURL" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/80 to-[#0d0d15]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Leading <strong className="text-cyan-400">esports recruiters</strong> connecting gaming talent with top organisations worldwide.
              Browse <strong className="text-cyan-400">esports jobs</strong> in pro gaming, coaching, content creation, and esports management.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-center">
                Why Choose Our <span className="text-cyan-400">Esports Recruitment Agency</span>?
              </h2>
              <p className="text-lg text-gray-300 mb-8 text-center">
                Specialist <strong>esports recruiters</strong> understand the unique demands of competitive gaming careers. Unlike general recruiters, an experienced <strong>esports recruiter</strong> knows the difference between a coach and an analyst.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold text-white mb-2">Industry Expertise</h3>
                  <p className="text-gray-400 text-sm">Our esports recruiters have deep knowledge of gaming organisations, tournament circuits, and the skills required for every role.</p>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="text-lg font-bold text-white mb-2">Direct Connections</h3>
                  <p className="text-gray-400 text-sm">Access opportunities that aren&apos;t publicly advertised through our network of esports organisations and gaming companies.</p>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-lg font-bold text-white mb-2">Career Guidance</h3>
                  <p className="text-gray-400 text-sm">Get advice from recruiters who understand esports career paths, from entry-level to executive positions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="relative py-12 bg-gradient-to-r from-purple-900/50 via-cyan-900/30 to-purple-900/50 border-y border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-black stat-value mb-2">{stat.value}{stat.suffix}</div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What are Esports Jobs */}
        <section className="py-24 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <AnimatedSectionHeader
                  text="Your Esports Recruitment Agency for Gaming Careers"
                  highlightText="Gaming Careers"
                  firstName={firstName}
                  personalizedText="Your Esports Partner for Gaming Careers, {name}"
                  theme="cyan"
                  showUnderline={false}
                />
              </div>
              <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30">
                <p className="text-sm text-gray-400 text-center mb-3"><strong className="text-cyan-400">Trusted Industry Sources:</strong></p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="https://en.wikipedia.org/wiki/Esports" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Wikipedia: Esports</a>
                  <span className="text-gray-400">•</span>
                  <a href="https://www.bbc.co.uk/news/topics/cnx753jej1xt" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">BBC: Esports News</a>
                  <span className="text-gray-400">•</span>
                  <a href="https://www.britannica.com/sports/esports" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Britannica: Esports</a>
                </div>
              </div>
              <div className="prose prose-lg prose-invert max-w-none space-y-6">
                <p className="text-xl text-gray-300 leading-relaxed">
                  As an <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link>, we aggregate <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports jobs</Link> from across the competitive gaming industry.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  The esports industry has transformed from basement LAN parties into a $1.8 billion global phenomenon. This explosive growth has created thousands of esports jobs that did not exist a decade ago.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three.js Transition - Spotlight Walk */}
        <section className="py-8 bg-gradient-to-b from-[#0a0a0f] via-black to-[#0d0d15] overflow-hidden">
          <ThreeSpotlightWalk />
        </section>

        {/* Featured Jobs */}
        <section id="esports-jobs" className="py-24 bg-[#0d0d15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <AnimatedSectionHeader
                text="Real Esports Jobs from Our Recruitment Agency"
                highlightText="Esports Jobs"
                firstName={firstName}
                personalizedText="Real Esports Jobs for {name}"
                subtitle="Live job listings aggregated from LinkedIn, company career pages, and public job boards. Apply direct to employers."
                personalizedSubtitle="Live listings just for you, {name}. Apply direct to employers."
                theme="cyan"
              />
            </div>

            {/* Featured Video Job */}
            {featuredJobs[0] && (
              <Link href={`/job/${featuredJobs[0].id}`} className="block mb-8 rounded-2xl overflow-hidden border-2 border-cyan-500/50 hover:border-cyan-400 transition-all group relative">
                <div className="relative aspect-[21/9] md:aspect-[3/1]">
                  <img src={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=1&width=600`} alt={featuredJobs[0].heroImageAlt} className="md:hidden w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <video autoPlay muted loop playsInline preload="none" poster={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=1`} className="hidden md:block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" aria-label={`Decorative video background for ${featuredJobs[0].title} job listing`}>
                    <source src={`https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`} type="application/x-mpegURL" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-cyan-500 rounded-full text-sm font-bold text-black animate-pulse">⭐ FEATURED</span>
                    <span className="px-3 py-1.5 bg-purple-500/80 rounded-full text-sm font-bold text-white">▶ VIDEO</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">{featuredJobs[0].title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-gray-300 mb-3">
                          <span className="font-bold text-cyan-400 text-lg">{featuredJobs[0].company}</span>
                          <span>📍 {featuredJobs[0].location}</span>
                          <span>💰 {featuredJobs[0].salary}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {featuredJobs[0].skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-3 py-1 text-sm rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="badge-fulltime px-4 py-2 text-sm rounded-full">{featuredJobs[0].type}</span>
                        <span className="bg-cyan-500 group-hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg text-lg transition-all transform group-hover:scale-105">View Job →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of Jobs - indices 1, 3 get video thumbnails (0, 2, 4 in original array) */}
            <div className="grid gap-4">
              {featuredJobs.slice(1).map((job, idx) => {
                const hasVideo = idx === 1 || idx === 3; // Jobs at original indices 2 and 4
                return (
                <Link key={job.id} href={`/job/${job.id}`} className="job-card bg-gray-900/50 rounded-xl overflow-hidden flex flex-col md:flex-row hover:bg-gray-800/50 transition-colors group">
                  <div className="relative w-full md:w-52 h-36 md:h-auto flex-shrink-0 overflow-hidden">
                    {hasVideo ? (
                      <>
                        <img src={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=${idx + 2}&width=400`} alt={job.heroImageAlt} className="md:hidden w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <video autoPlay muted loop playsInline preload="none" poster={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=${idx + 2}`} className="hidden md:block w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" aria-label={`Decorative video for ${job.title}`}>
                          <source src={`https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`} type="application/x-mpegURL" />
                        </video>
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-purple-500/80 rounded text-xs font-bold text-white" aria-hidden="true">▶</span>
                        </div>
                      </>
                    ) : (
                      <img src={job.heroImage} alt={job.heroImageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/80 md:block hidden" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mb-3">
                        <span className="font-medium text-cyan-400">{job.company}</span>
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs rounded-full ${job.type === "Full-time" ? "badge-fulltime" : job.type === "Contract" ? "badge-contract" : "badge-parttime"}`}>{job.type}</span>
                      <span className="bg-cyan-500 group-hover:bg-cyan-400 text-black font-bold py-2 px-5 rounded transition-all">View →</span>
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>

            <div className="text-center mt-10">
              <Link href="/esports-jobs" className="inline-flex items-center gap-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold py-3 px-8 rounded-lg transition-all">View All Esports Jobs <span>→</span></Link>
            </div>

            <div className="mt-12 max-w-xl mx-auto">
              <HeyCompaniesCompact />
            </div>
          </div>
        </section>

        {/* Hey Companies Banner */}
        <HeyCompanies />

        {/* Job Categories */}
        <section id="categories" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <AnimatedSectionHeader
                text="Gaming Job Categories"
                highlightText="Categories"
                firstName={firstName}
                personalizedText="Explore Job Categories, {name}"
                subtitle="Explore career opportunities across every area of the esports and gaming industry."
                personalizedSubtitle="Find your perfect role across esports and gaming, {name}."
                theme="purple"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobCategories.map((category, index) => (
                <div key={index} className="card-hover bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 group">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{category.title}</h3>
                  <p className="text-gray-400 mb-6">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.features.map((feature, i) => (
                      <span key={i} className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">{feature}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Paths */}
        <section id="careers" className="py-24 animated-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <AnimatedSectionHeader
                text="Gaming Career Paths"
                highlightText="Career Paths"
                firstName={firstName}
                personalizedText="{name}'s Gaming Career Paths"
                subtitle="Whether you want to compete, create, broadcast, or build businesses, there is an esports career for you."
                personalizedSubtitle="Whether you want to compete, create, broadcast, or build businesses, {name} - there's a path for you."
                theme="cyan"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {careerPaths.map((path, index) => (
                <div key={index} className="bg-gray-900/80 border border-gray-700 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{path.icon}</span>
                    <h3 className="text-2xl font-bold text-white">{path.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-6">{path.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {path.roles.map((role, i) => (
                      <span key={i} className="px-3 py-1 text-sm rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">{role}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Statistics */}
        <section className="py-24 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <AnimatedSectionHeader
                text="Industry Growth"
                highlightText="Growth"
                subtitle="The esports job market is expanding rapidly with new opportunities every day."
                theme="purple"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {industryStats.map((item, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-xl p-8">
                  <div className="text-4xl font-black text-cyan-400 mb-4">{item.stat}</div>
                  <p className="text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* YouTube Videos Section */}
        <section className="py-24 bg-[#0d0d15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <AnimatedSectionHeader
                text="Learn About Gaming Careers"
                highlightText="Gaming Careers"
                firstName={firstName}
                personalizedText="Learn About Gaming Careers, {name}"
                subtitle="Watch these videos to learn what it's like to work in esports and how to break into the industry."
                theme="cyan"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {esportsCareerVideos.map((video) => (
                <div key={video.id} className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all group">
                  <div className="aspect-video relative">
                    <iframe src={`https://www.youtube.com/embed/${video.id}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{video.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-gray-400 text-sm">
                Videos sourced from YouTube. For more esports career content, visit{" "}
                <a href="https://britishesports.org/the-hub/careers/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">British Esports Career Hub</a>
              </p>
            </div>
          </div>
        </section>

        {/* Companies */}
        <section className="py-16 bg-[#0d0d15] border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-gray-400 uppercase tracking-wider text-sm">Organisations with current <Link href="/" className="hover:text-cyan-400">esports jobs</Link> (we aggregate public listings)</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {companies.map((company) => (
                <div key={company} className="text-2xl font-bold text-gray-400 hover:text-gray-300 transition-colors">{company}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Resources */}
        <section className="py-16 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-4">Industry Resources</h2>
              <p className="text-gray-400">Trusted organisations supporting the <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports jobs</Link> ecosystem</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <a href="https://britishesports.org" target="_blank" rel="noopener noreferrer" className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all text-center">
                <h3 className="font-bold text-white mb-2">British Esports</h3>
                <p className="text-gray-400 text-sm">The national body for esports in the UK</p>
              </a>
              <a href="https://ukie.org.uk" target="_blank" rel="noopener noreferrer" className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all text-center">
                <h3 className="font-bold text-white mb-2">UKIE</h3>
                <p className="text-gray-400 text-sm">UK games industry trade body</p>
              </a>
              <a href="https://esic.gg" target="_blank" rel="noopener noreferrer" className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all text-center">
                <h3 className="font-bold text-white mb-2">ESIC</h3>
                <p className="text-gray-400 text-sm">Esports Integrity Commission</p>
              </a>
              <a href="https://www.riotgames.com/en/work-with-us" target="_blank" rel="noopener noreferrer" className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all text-center">
                <h3 className="font-bold text-white mb-2">Riot Games Careers</h3>
                <p className="text-gray-400 text-sm">Jobs at League of Legends publisher</p>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-[#0d0d15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <AnimatedSectionHeader
                text="How to Land Your Dream Role"
                highlightText="Dream Role"
                firstName={firstName}
                personalizedText="How to Land Your Dream Role, {name}"
                subtitle="Follow these steps to find and apply for esports jobs that match your skills and passion."
                personalizedSubtitle="Here's your roadmap to landing that dream esports job, {name}."
                theme="cyan"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Browse Jobs", description: "Search through esports job listings we aggregate from LinkedIn, company career pages, and job boards. Filter by role, location, and experience level." },
                { step: "02", title: "Apply Direct", description: "Click through to apply directly on the employer&apos;s website or LinkedIn. We link you straight to the source—no middleman, no signup required." },
                { step: "03", title: "Land Your Role", description: "Use our career guides and resources to prepare for interviews and stand out. We share industry insights to help you succeed." },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-8xl font-black text-cyan-500/10 absolute -top-4 -left-2">{item.step}</div>
                  <div className="relative bg-gray-900/50 border border-gray-700 rounded-2xl p-8 pt-12">
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Video */}
        <section className="py-24 relative">
          <div className="absolute inset-0" aria-hidden="true">
            <img src={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=3&width=600`} alt="" className="md:hidden w-full h-full object-cover opacity-30" loading="lazy" />
            <video autoPlay muted loop playsInline preload="none" poster={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=3`} className="hidden md:block w-full h-full object-cover opacity-30" aria-hidden="true">
              <source src={`https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`} type="application/x-mpegURL" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/90 to-purple-900/90" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Browse Real Jobs via Our E-Sports Recruitment Firm</h2>
            <p className="text-xl text-gray-200 mb-8">We aggregate esports jobs from public sources including LinkedIn, company career pages, and job boards. Browse the latest opportunities and take the first step towards your career in competitive gaming.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#esports-jobs" className="bg-white text-black font-bold py-4 px-10 rounded-lg text-lg hover:bg-gray-100 transition-all transform hover:scale-105 btn-shine inline-flex items-center justify-center">Browse Esports Jobs</a>
              <Link href="/contact" className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-lg text-lg transition-all inline-flex items-center justify-center">Post a Job</Link>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-24 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden neon-border-purple">
                  <img src={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=6&width=600`} alt="Esports recruitment agency promotional video thumbnail" className="md:hidden w-full h-full object-cover" loading="lazy" />
                  <video autoPlay muted loop playsInline preload="none" poster={`https://image.mux.com/${MUX_PLAYBACK_ID}/thumbnail.webp?time=6`} className="hidden md:block w-full h-full object-cover" aria-label="Promotional video showcasing esports recruitment services">
                    <source src={`https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`} type="application/x-mpegURL" />
                  </video>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img src="/esports-recruitment-agency.svg" alt="Esports recruitment agency logo" width="64" height="64" className="w-16 h-16" />
                  <h2 className="text-4xl md:text-5xl font-black">About Our <span className="text-purple-400">E-Sports Recruitment Company</span></h2>
                </div>
                <p className="text-xl text-gray-300 mb-4">We&apos;re an <strong>esports recruitment agency</strong> that connects gaming talent with industry-leading organisations.</p>
                <p className="text-lg text-gray-400 mb-6">We work with award-winning esports production companies and gaming organisations to help them find exceptional talent.</p>
                <ul className="space-y-4 text-gray-400 mb-8">
                  <li className="flex items-start gap-3"><span className="text-cyan-400 mt-1">✓</span><span>Trusted by Emmy & BAFTA-winning production companies</span></li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 mt-1">✓</span><span>Real job listings aggregated from public sources</span></li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 mt-1">✓</span><span>Career guides and resources for gaming professionals</span></li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 mt-1">✓</span><span>100% free to browse—no hidden fees</span></li>
                </ul>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all">Get In Touch <span>→</span></Link>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20 bg-gradient-to-b from-[#0a0a0f] to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Your <span className="text-cyan-400">E-Sports Recruiters</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Our e-sports recruitment firm is led by industry professionals with real experience in gaming and competitive play.</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <img src="/dan-keegan.webp" alt="Dan Keegan - Esports Industry Expert" width="200" height="200" className="w-48 h-48 rounded-xl object-cover border-2 border-cyan-500/50" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Dan Keegan</h3>
                  <p className="text-cyan-400 font-medium mb-4">Founder & Esports Industry Expert</p>
                  <p className="text-gray-300 mb-4">With <strong>over 20 years of experience</strong> in video games and esports, Dan brings deep industry knowledge to help connect talented professionals with the right opportunities.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-600/20 text-cyan-400 text-sm rounded-full">20+ Years Gaming Industry</span>
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">Esports Operations</span>
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full">Talent Acquisition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Esports News */}
        <NewsSection />

        {/* Cross-Site Promotion */}
        <section className="py-16 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-300">Part of the QUEST Network</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 hover:border-cyan-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400">Esports Insurance</h3>
                <p className="text-gray-400 text-sm mb-3">Planning an esports event? Compare <a href="https://esportsevent.quest" className="text-cyan-400 underline hover:text-cyan-300">esports event insurance</a> quotes.</p>
                <a href="https://esportsevent.quest" className="text-cyan-400 text-sm font-medium hover:underline">Get Esports Insurance →</a>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 hover:border-purple-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400">Esports Production</h3>
                <p className="text-gray-400 text-sm mb-3">Need broadcast services? Our <a href="https://esportsproduction.quest" className="text-purple-400 hover:underline">esports production agency</a> delivers world-class services.</p>
                <a href="https://esportsproduction.quest" className="text-purple-400 text-sm font-medium hover:underline">Hire Esports Production →</a>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/20 hover:border-green-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400">Esports News</h3>
                <p className="text-gray-400 text-sm mb-3">Stay informed with the latest <a href="https://esportsnews.quest" className="text-green-400 hover:underline">esports news</a> and career advice.</p>
                <a href="https://esportsnews.quest" className="text-green-400 text-sm font-medium hover:underline">Read Esports News →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Career Guides Section */}
        <section id="guides" className="py-24 bg-gradient-to-b from-[#0a0a12] to-[#0d0d15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Career <span className="text-cyan-400">Guides</span></h2>
              <p className="text-xl text-gray-400">Comprehensive guides to help you break into and advance in the esports industry</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <Link href="/esports-jobs" className="p-6 rounded-xl bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 hover:border-cyan-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400">Esports Jobs</h3>
                <p className="text-gray-400 text-sm">Browse all esports jobs worldwide from top gaming organisations.</p>
              </Link>
              <Link href="/esports-jobs-uk" className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-500/20 hover:border-purple-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400">Esports Jobs UK</h3>
                <p className="text-gray-400 text-sm">Complete guide to finding esports jobs across the UK.</p>
              </Link>
              <Link href="/gaming-jobs-uk" className="p-6 rounded-xl bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/20 hover:border-green-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400">Gaming Jobs UK</h3>
                <p className="text-gray-400 text-sm">All gaming industry jobs from development to esports.</p>
              </Link>
              <Link href="/esports-careers" className="p-6 rounded-xl bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20 hover:border-amber-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400">Esports Careers</h3>
                <p className="text-gray-400 text-sm">All career pathways in professional esports.</p>
              </Link>
              <Link href="/esports-recruitment" className="p-6 rounded-xl bg-gradient-to-br from-pink-900/30 to-blue-900/30 border border-pink-500/20 hover:border-pink-500/50 transition-all group">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400">Recruitment Services</h3>
                <p className="text-gray-400 text-sm">Professional esports recruitment and talent acquisition.</p>
              </Link>
            </div>

            {/* Top Esports Organisations */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Jobs at Top Gaming Organisations</h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Link href="/team-liquid-careers" className="p-4 rounded-lg bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 hover:border-blue-500/50 transition-all text-center group"><span className="text-white font-medium group-hover:text-blue-400">Team Liquid</span></Link>
                <Link href="/g2-esports-careers" className="p-4 rounded-lg bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/20 hover:border-red-500/50 transition-all text-center group"><span className="text-white font-medium group-hover:text-red-400">G2 Esports</span></Link>
                <Link href="/cloud9-careers" className="p-4 rounded-lg bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 hover:border-cyan-500/50 transition-all text-center group"><span className="text-white font-medium group-hover:text-cyan-400">Cloud9</span></Link>
                <Link href="/fnatic-careers" className="p-4 rounded-lg bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border border-orange-500/20 hover:border-orange-500/50 transition-all text-center group"><span className="text-white font-medium group-hover:text-orange-400">Fnatic</span></Link>
                <Link href="/excel-esports-careers" className="p-4 rounded-lg bg-gradient-to-br from-green-900/30 to-teal-900/30 border border-green-500/20 hover:border-green-500/50 transition-all text-center group"><span className="text-white font-medium group-hover:text-green-400">Excel Esports</span></Link>
                <Link href="/guild-esports-careers" className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 hover:border-purple-500/50 transition-all text-center group"><span className="text-white font-medium group-hover:text-purple-400">Guild Esports</span></Link>
              </div>
            </div>

            {/* Jobs by Location */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Gaming Jobs by Location</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-4">🇬🇧 United Kingdom</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/esports-jobs-london" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-all"><span className="text-gray-300 text-sm">London</span></Link>
                    <Link href="/esports-jobs-manchester" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-all"><span className="text-gray-300 text-sm">Manchester</span></Link>
                    <Link href="/esports-jobs-birmingham" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-all"><span className="text-gray-300 text-sm">Birmingham</span></Link>
                    <Link href="/esports-jobs-leeds" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-all"><span className="text-gray-300 text-sm">Leeds</span></Link>
                    <Link href="/esports-jobs-edinburgh" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-all"><span className="text-gray-300 text-sm">Edinburgh</span></Link>
                    <Link href="/esports-jobs-remote" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-all"><span className="text-gray-300 text-sm">Remote UK</span></Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">🌍 Global Esports Hubs</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/esports-jobs-usa" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500/50 transition-all"><span className="text-gray-300 text-sm">🇺🇸 USA</span></Link>
                    <Link href="/esports-jobs-germany" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-yellow-500/50 transition-all"><span className="text-gray-300 text-sm">🇩🇪 Germany</span></Link>
                    <Link href="/esports-jobs-canada" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-red-500/50 transition-all"><span className="text-gray-300 text-sm">🇨🇦 Canada</span></Link>
                    <Link href="/esports-jobs-australia" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-green-500/50 transition-all"><span className="text-gray-300 text-sm">🇦🇺 Australia</span></Link>
                    <Link href="/esports-jobs-los-angeles" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all"><span className="text-gray-300 text-sm">Los Angeles</span></Link>
                    <Link href="/esports-jobs-berlin" className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all"><span className="text-gray-300 text-sm">Berlin</span></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-[#0d0d15]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Gaming Jobs <span className="text-purple-400">FAQ</span></h2>
              <p className="text-xl text-gray-400">Common questions about finding jobs in the esports and gaming industry</p>
            </div>
            <div className="space-y-4">
              {[
                { q: "🎮 What types of esports jobs are available?", a: "The esports industry offers diverse roles including professional players, coaches, analysts, content creators, streamers, shoutcasters, tournament organisers, event managers, marketing specialists, social media managers, broadcast producers, graphic designers, video editors, community managers, and many traditional business roles like HR, finance, and operations." },
                { q: "🚀 How do I get a job in esports with no experience?", a: "Start by building relevant skills through volunteer work, freelance projects, or creating your own content. Join Discord communities, follow esports professionals on social media, and attend industry events to network. Consider internships or entry-level positions." },
                { q: "📋 What qualifications do I need for esports jobs?", a: "Requirements vary by role. Pro players need exceptional gaming skills. Marketing and business roles may require relevant degrees, but practical experience often matters more than formal education in esports." },
                { q: "🌍 Are esports jobs remote or location-based?", a: "Many esports jobs offer remote work, especially content creation, social media management, and some coaching positions. Event management and broadcast production typically require in-person attendance." },
                { q: "💰 What is the average salary for esports jobs?", a: "Salaries vary widely by role and organisation. Entry-level positions may start at £20,000-£30,000, while mid-level roles can earn £35,000-£60,000. Senior positions and executives can earn £100,000 or more. Top pro players earn millions." },
                { q: "🏢 Which companies hire for esports jobs?", a: "Major employers include esports organisations like Fnatic, Team Liquid, Cloud9, G2 Esports. Game publishers like Riot Games, Blizzard. Tournament organisers like ESL and BLAST. Streaming platforms like Twitch, plus hardware companies like Razer and Logitech." },
                { q: "💼 Can I work in esports without being a pro gamer?", a: "Absolutely. The esports industry needs professionals in marketing, business development, event management, broadcast production, journalism, community management, HR, finance, legal, and many other roles." },
                { q: "🏆 How competitive are esports jobs?", a: "Esports jobs are highly competitive due to industry passion. Standing out requires demonstrable skills, a strong portfolio, and networking within the community. Entry-level positions can receive hundreds of applications." },
              ].map((faq, index) => (
                <details key={index} className="group bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <span className="font-bold text-lg text-white pr-4">{faq.q}</span>
                    <span className="text-cyan-400 text-2xl group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-400">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <UnifiedFooter
          activeSite="jobs"
          siteSpecificSections={[
            { title: "Job Guides", links: [
              { label: "All Esports Jobs", href: "/esports-jobs" },
              { label: "Esports Jobs UK", href: "/esports-jobs-uk" },
              { label: "Gaming Jobs UK", href: "/gaming-jobs-uk" },
              { label: "Entry Level Jobs", href: "/entry-level-esports-jobs-uk" },
              { label: "Jobs in London", href: "/esports-jobs-london" },
              { label: "Remote Jobs", href: "/esports-jobs-remote" },
            ]},
            { title: "Career Paths", links: [
              { label: "Esports Careers", href: "/esports-careers" },
              { label: "Coach Careers", href: "/esports-coach-careers" },
              { label: "Analyst Careers", href: "/esports-analyst-careers" },
              { label: "Broadcaster Careers", href: "/esports-broadcaster-careers" },
              { label: "Marketing Careers", href: "/esports-marketing-careers" },
              { label: "How to Get Into Esports", href: "/how-to-get-into-esports" },
            ]},
            { title: "Resources", links: [
              { label: "Salary Guide UK", href: "/esports-salary-guide-uk" },
              { label: "Top Companies UK", href: "/top-esports-companies-uk" },
              { label: "Fnatic Careers", href: "/fnatic-careers" },
              { label: "British Esports Jobs", href: "/british-esports-jobs" },
              { label: "Recruitment Services", href: "/esports-recruitment" },
              { label: "Recruitment Agency", href: "/esports-recruitment-agency" },
            ]},
          ]}
        />
      </main>
    );

  // Render with deferred chat - only load CopilotSidebar when user clicks chat button
  if (chatEnabled) {
    return (
      <CopilotSidebar
        defaultOpen={true}
        instructions={agentInstructions}
        labels={{
          title: "Esports Jobs AI",
          initial: firstName ? `Hey ${firstName}! Ready to find your next esports opportunity?` : "Welcome! I can help you find esports jobs, explore companies, or learn about gaming careers.",
        }}
      >
        {pageContent}
      </CopilotSidebar>
    );
  }

  // Initial render - no CopilotSidebar loaded yet, show chat button
  return (
    <>
      {pageContent}
      {/* Floating chat button - loads CopilotSidebar on click */}
      <button
        onClick={() => setChatEnabled(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open AI chat assistant"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </>
  );
}
