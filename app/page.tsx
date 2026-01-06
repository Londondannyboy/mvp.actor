"use client";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import { useState } from "react";

const BACKEND_URL = "https://esports-v2-agent-production.up.railway.app";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  url: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Register search_jobs action
  useCopilotAction({
    name: "search_jobs",
    description: "Search for esports jobs by query, category, country, or job type",
    parameters: [
      { name: "query", type: "string", description: "Free text search (title, company, skills)" },
      { name: "category", type: "string", description: "Job category: coaching, marketing, production, management, content, operations" },
      { name: "country", type: "string", description: "Country filter" },
      { name: "job_type", type: "string", description: "Job type: Full-time, Part-time, Contract, Intern" },
    ],
    handler: async ({ query, category, country, job_type }) => {
      try {
        const response = await fetch(`${BACKEND_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer esports-clm-secret-2025",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Find ${category || ""} jobs ${query ? `matching "${query}"` : ""} ${country ? `in ${country}` : ""}`.trim() }],
            stream: false,
          }),
        });
        const data = await response.json();
        // Parse the response and extract jobs
        return data.choices?.[0]?.message?.content || "Here are some esports jobs I found!";
      } catch (error) {
        return "Sorry, I couldn't search for jobs at the moment.";
      }
    },
  });

  // Register lookup_company action
  useCopilotAction({
    name: "lookup_company",
    description: "Get detailed information about an esports company",
    parameters: [
      { name: "company_name", type: "string", description: "Company name (e.g., Team Liquid, Riot Games)", required: true },
    ],
    handler: async ({ company_name }) => {
      try {
        const response = await fetch(`${BACKEND_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer esports-clm-secret-2025",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Tell me about ${company_name}` }],
            stream: false,
          }),
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || `Information about ${company_name}`;
      } catch (error) {
        return "Sorry, I couldn't look up company information at the moment.";
      }
    },
  });

  // Register get_job_categories action
  useCopilotAction({
    name: "get_job_categories",
    description: "Get a list of all available job categories in esports",
    parameters: [],
    handler: async () => {
      return "Available job categories: Coaching, Marketing, Production, Management, Content, Operations";
    },
  });

  // Register get_job_countries action
  useCopilotAction({
    name: "get_job_countries",
    description: "Get a list of countries with available esports jobs",
    parameters: [],
    handler: async () => {
      return "Countries with esports jobs: USA, UK, Germany, South Korea, China, Singapore";
    },
  });

  return (
    <CopilotSidebar
      defaultOpen={true}
      instructions={`You are an AI assistant for EsportsJobs.quest. Help users find esports careers.

Available actions:
- search_jobs: Find jobs by query, category (coaching/marketing/production/management/content/operations), country, or type
- lookup_company: Get info about companies like Team Liquid, Riot Games, Fnatic
- get_job_categories: List all job categories
- get_job_countries: List countries with jobs

Always use these actions to provide real data. Be enthusiastic about esports careers!`}
      labels={{
        title: "Esports Jobs AI",
        initial: "Ready to find your dream job in esports? Ask me anything!",
      }}
    >
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <section className="h-screen flex items-center justify-center">
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
          </div>
        </section>
      </main>
    </CopilotSidebar>
  );
}
