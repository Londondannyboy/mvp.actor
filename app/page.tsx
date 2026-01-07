"use client";
import { useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCoAgent, useRenderToolCall } from "@copilotkit/react-core";
import { UserButton, SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import { authClient } from "@/app/lib/auth/client";
import Link from "next/link";

// Job Card Component for Generative UI
function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 hover:border-cyan-500 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          {job.company.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{job.title}</h3>
          <p className="text-cyan-400 text-sm">{job.company}</p>
          <p className="text-gray-400 text-xs mt-1">{job.location}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">{job.type}</span>
            <span className="text-xs text-gray-500">{job.salary}</span>
          </div>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-cyan-400 hover:text-cyan-300"
            >
              View Job →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Job Cards Grid for tool results
function JobCardsGrid({ jobs, query }: { jobs: Job[]; query?: string }) {
  return (
    <div className="space-y-3">
      {query && (
        <p className="text-cyan-400 text-sm font-medium">
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} {query ? `for "${query}"` : ''}
        </p>
      )}
      <div className="grid gap-3">
        {jobs.map((job, i) => (
          <JobCard key={job.id || i} job={job} />
        ))}
      </div>
    </div>
  );
}

// Loading state for tool calls
function ToolLoading() {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <span>Searching...</span>
    </div>
  );
}

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

  // Render job cards when search_esports_jobs tool returns results
  useRenderToolCall({
    name: "search_esports_jobs",
    render: ({ result, status }) => {
      if (status !== "complete" || !result) {
        return <ToolLoading />;
      }
      const jobs = result.jobs || [];
      if (jobs.length === 0) {
        return <p className="text-gray-400 text-sm">No jobs found matching your criteria.</p>;
      }
      return <JobCardsGrid jobs={jobs} query={result.search_query} />;
    },
  });

  return (
    <CopilotSidebar
      defaultOpen={true}
      instructions={`You are an enthusiastic AI assistant for EsportsJobs.quest. Help users find esports careers.

Your tools:
- search_esports_jobs: Find jobs by query, category, country
- lookup_esports_company: Get company info (Team Liquid, Riot Games, Fnatic, etc.)
- get_categories: List job categories
- get_countries: List countries with jobs

Always use your tools to provide real data! Be enthusiastic about esports! 🎮`}
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
