"use client";
import { useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCoAgent, useRenderToolCall } from "@copilotkit/react-core";
import { UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import { authClient } from "@/app/lib/auth/client";
import Link from "next/link";
import { AnimatedJobCardsGrid, JobCardsLoading } from "./components/AnimatedJobCard";

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

        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center pt-16">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              EsportsJobs.quest
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find your career in competitive gaming
            </p>
            <p className="text-gray-400">
              Chat with our AI assistant →
            </p>
            {state?.jobs && state.jobs.length > 0 && (
              <div className="mt-8 p-4 bg-black/30 rounded-lg max-w-md mx-auto">
                <p className="text-cyan-400 text-sm mb-2">
                  Found {state.jobs.length} jobs for "{state.search_query}"
                </p>
                {state.jobs.slice(0, 3).map((job, i) => (
                  <div key={i} className="text-left text-sm text-gray-300 py-2 border-t border-gray-700">
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-gray-400">{job.company} • {job.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </CopilotSidebar>
  );
}
