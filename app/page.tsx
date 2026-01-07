"use client";
import { useEffect, useCallback } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCoAgent, useRenderToolCall } from "@copilotkit/react-core";
import { UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import { authClient } from "@/app/lib/auth/client";
import Link from "next/link";
import { AnimatedJobCardsGrid, JobCardsLoading } from "./components/AnimatedJobCard";
import dynamic from "next/dynamic";

// Dynamic import for Three.js (client-side only)
const GamerHero = dynamic(() => import("./components/GamerHero").then(mod => ({ default: mod.GamerHero })), {
  ssr: false,
  loading: () => <div className="h-screen bg-gradient-to-b from-gray-900 to-purple-900" />
});

// Dynamic import for Voice (client-side only)
const VoiceInput = dynamic(() => import("./components/VoiceInput").then(mod => ({ default: mod.VoiceInput })), {
  ssr: false,
  loading: () => <div className="w-20 h-20 rounded-full bg-gray-700 animate-pulse" />
});

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

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0] || null;

  const { state, setState } = useCoAgent<AgentState>({
    name: "esports_agent",
    initialState: {
      jobs: [],
      search_query: "",
      user: undefined,
    },
  });

  // Sync user from auth to agent state
  useEffect(() => {
    if (user && !state?.user?.id) {
      setState((prev) => ({
        jobs: prev?.jobs ?? [],
        search_query: prev?.search_query ?? "",
        user: {
          id: user.id,
          name: user.name || undefined,
          firstName: firstName || undefined,
          email: user.email || undefined,
        },
      }));
    }
  }, [user?.id, state?.user?.id, firstName, setState]);

  // Voice message callback - forwards to CopilotKit
  const handleVoiceMessage = useCallback((text: string, role?: "user" | "assistant") => {
    console.log(`[Voice → CopilotKit] ${role}:`, text.slice(0, 50));
    // Voice messages are handled by Hume's CLM which connects to the same backend
    // This callback can be used to sync state or trigger UI updates if needed
  }, []);

  // Render animated job cards when search_esports_jobs tool returns results
  useRenderToolCall({
    name: "search_esports_jobs",
    render: ({ result, status }) => {
      // Show loading for any non-complete state
      if (status === "executing" || status === "inProgress") {
        return <JobCardsLoading />;
      }

      // Handle complete state
      if (status === "complete" && result) {
        const jobs = result.jobs || [];
        if (jobs.length === 0) {
          return (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-gray-400">No jobs found matching your criteria.</p>
              <p className="text-cyan-400 text-sm mt-2">Try a different search!</p>
            </div>
          );
        }
        return <AnimatedJobCardsGrid jobs={jobs} query={result.search_query} />;
      }

      // Fallback for any other state
      return <JobCardsLoading />;
    },
  });

  // Build instructions with FULL user context - this is sent as system message to agent
  const agentInstructions = user
    ? `CRITICAL USER CONTEXT:
- User Name: ${firstName || user.name}
- User ID: ${user.id}
- User Email: ${user.email}

When the user asks "what is my name" or personal questions, use the above info.
Always greet them as ${firstName || user.name} and be friendly.

You are an enthusiastic AI assistant for EsportsJobs.quest. Help users find esports careers.

Your tools:
- search_esports_jobs: Find jobs by query, category, country
- lookup_esports_company: Get company info (Team Liquid, Riot Games, Fnatic, etc.)
- get_categories: List job categories
- get_countries: List countries with jobs

Always use your tools to provide real data! Be enthusiastic about esports! 🎮`
    : `You are an enthusiastic AI assistant for EsportsJobs.quest. Help users find esports careers.

The user is not logged in yet. Encourage them to sign up for personalized job recommendations!

Your tools:
- search_esports_jobs: Find jobs by query, category, country
- lookup_esports_company: Get company info (Team Liquid, Riot Games, Fnatic, etc.)
- get_categories: List job categories
- get_countries: List countries with jobs

Always use your tools to provide real data! Be enthusiastic about esports! 🎮`;

  return (
    <CopilotSidebar
      defaultOpen={true}
      disableSystemMessage={true}
      instructions={agentInstructions}
      labels={{
        title: "Esports Jobs AI",
        initial: firstName
          ? `🎮 Hey ${firstName}! Ready to level up your esports career?`
          : "🎮 Ready to find your dream job in esports? Ask me anything!",
      }}
    >
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        {/* Header with Auth */}
        <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-black/30 backdrop-blur-sm">
          <h2 className="text-white font-bold text-lg">🎮 EsportsJobs.quest</h2>
          <div>
            {isPending ? (
              <div className="text-gray-400 text-sm">Loading...</div>
            ) : (
              <>
                <SignedIn>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm">Hi, {firstName || user?.email}</span>
                    <UserButton />
                  </div>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/auth/sign-in"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </SignedOut>
              </>
            )}
          </div>
        </header>

        {/* Hero Section with 3D Character */}
        <section className="h-screen relative overflow-hidden">
          {/* 3D Background */}
          <div className="absolute inset-0">
            <GamerHero className="w-full h-full" />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 h-full flex items-center justify-center pt-16">
            <div className="text-center text-white">
              <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                EsportsJobs.quest
              </h1>
              <p className="text-2xl text-gray-200 mb-8 font-light tracking-wide">
                Find your career in competitive gaming
              </p>
              <p className="text-cyan-400 font-medium animate-pulse">
                Chat with our AI assistant →
              </p>
            </div>
          </div>

          {/* Voice Widget + Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-6">
            {/* Voice Input */}
            <VoiceInput
              onMessage={handleVoiceMessage}
              firstName={firstName}
              userId={user?.id}
            />

            {/* Scroll indicator */}
            <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>
        </section>
      </main>
    </CopilotSidebar>
  );
}
