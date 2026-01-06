"use client";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  url: string;
}

interface AgentState {
  jobs: Job[];
  search_query: string;
}

export default function Home() {
  const { state } = useCoAgent<AgentState>({
    name: "esports_agent",
    initialState: {
      jobs: [],
      search_query: "",
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
        initial: "🎮 Ready to find your dream job in esports? Ask me anything!",
      }}
    >
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-black/30 backdrop-blur-sm">
          <h2 className="text-white font-bold text-lg">🎮 EsportsJobs.quest</h2>
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
