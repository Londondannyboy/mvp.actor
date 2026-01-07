"use client";

import { usePathname } from "next/navigation";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { authClient } from "@/app/lib/auth/client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo } from "react";

// Dynamic import for Voice (client-side only)
const VoiceInput = dynamic(
  () => import("./VoiceInput").then((mod) => ({ default: mod.VoiceInput })),
  {
    ssr: false,
    loading: () => (
      <div className="w-16 h-16 rounded-full bg-gray-700/50 animate-pulse" />
    ),
  }
);

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

// Derive page context from pathname
function getPageContext(pathname: string) {
  // Clean the pathname
  const path = pathname.replace(/^\/+|\/+$/g, "") || "home";

  // Common page type mappings
  const pageTypes: Record<string, string> = {
    "home": "homepage",
    "esports-jobs": "job-search",
    "esports-careers": "career-guide",
    "contact": "contact",
    "book": "booking",
    "dashboard": "dashboard",
  };

  // Location detection
  const locationMatches = path.match(/esports-jobs-([a-z-]+)/);
  const location = locationMatches ? locationMatches[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : null;

  // Career type detection
  const careerMatches = path.match(/esports-([a-z-]+)-careers/);
  const careerType = careerMatches ? careerMatches[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : null;

  // Company career page detection
  const companyMatches = path.match(/([a-z0-9-]+)-careers$/);
  const company = companyMatches && !careerMatches ? companyMatches[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : null;

  // Generate human-readable title
  let pageTitle = path
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let pageType = pageTypes[path] || "content-page";
  let pageDescription = "";

  if (location) {
    pageType = "location-hub";
    pageTitle = `Esports Jobs ${location}`;
    pageDescription = `Find esports and gaming jobs in ${location}. Browse opportunities from top employers.`;
  } else if (careerType) {
    pageType = "career-guide";
    pageTitle = `Esports ${careerType} Careers`;
    pageDescription = `Explore ${careerType} careers in esports. Salary guides, skills needed, and job opportunities.`;
  } else if (company) {
    pageType = "company-careers";
    pageTitle = `${company} Careers`;
    pageDescription = `Explore career opportunities at ${company}. Find open positions and company culture info.`;
  } else if (path.includes("salary-guide")) {
    pageType = "salary-guide";
    pageDescription = "Comprehensive esports salary information and compensation data.";
  } else if (path.includes("recruitment") || path.includes("recruiting")) {
    pageType = "recruitment";
    pageDescription = "Esports recruitment services and agency information.";
  }

  return {
    pageId: path,
    pageType,
    location,
    title: pageTitle,
    pageH1: pageTitle,
    pageUrl: pathname,
    pageDescription: pageDescription || `${pageTitle} - EsportsJobs.quest`,
  };
}

export function GlobalCopilotUI() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] || null;

  // Get page context based on current URL
  const pageContext = useMemo(() => getPageContext(pathname), [pathname]);

  // CopilotKit agent state
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
    if (user && (!state?.user || state?.user?.id !== user.id)) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Voice to CopilotKit bridge
  const { appendMessage } = useCopilotChat();

  const handleVoiceMessage = useCallback(
    (text: string, role?: "user" | "assistant") => {
      if (role === "user") {
        try {
          const message = new TextMessage({ content: text, role: Role.User });
          appendMessage(message);
        } catch (e) {
          console.error("[Voice] Error appending message:", e);
        }
      }
    },
    [appendMessage]
  );

  // Generate page-aware instructions for CopilotKit
  const agentInstructions = useMemo(() => {
    const userSection = user
      ? `## USER INFO
Name: ${firstName || user.name}
Email: ${user.email}
ID: ${user.id}

Greet them by name and be friendly!`
      : `## GUEST USER
The user is not logged in. Encourage them to sign up for personalized recommendations.`;

    return `## PAGE CONTEXT
Page URL: ${pageContext.pageUrl}
Page Type: ${pageContext.pageType}
Page Title: ${pageContext.title}
${pageContext.location ? `Location Focus: ${pageContext.location}` : ""}
${pageContext.pageDescription ? `Description: ${pageContext.pageDescription}` : ""}

## CRITICAL: Know which page you're on
When asked "what page am I on?" or "where am I?", say: "You're on the ${pageContext.title} page"
${pageContext.location ? `When user asks about jobs, prioritize ${pageContext.location} opportunities.` : ""}

${userSection}

## YOUR ROLE
You are an AI assistant for EsportsJobs.quest helping users find esports jobs.
${pageContext.pageType === "location-hub" ? `On THIS page, you are specifically focused on ${pageContext.location} esports opportunities.` : ""}
${pageContext.pageType === "career-guide" ? `On THIS page, you are helping users understand this esports career path.` : ""}
${pageContext.pageType === "company-careers" ? `On THIS page, you are helping users learn about this company and their opportunities.` : ""}

## YOUR TOOLS
- search_esports_jobs: Find jobs (filter by location, category, company)
- lookup_esports_company: Get info on esports companies
- get_categories: List job categories
- get_countries: List available countries
- get_my_profile: Get current user's profile info

Always use your tools to provide real data! Be enthusiastic about esports careers!`;
  }, [pageContext, user, firstName]);

  // Generate initial message based on page
  const initialMessage = useMemo(() => {
    const greeting = firstName ? `Hey ${firstName}! ` : "";

    if (pageContext.pageType === "location-hub" && pageContext.location) {
      return `${greeting}You're on the ${pageContext.location} esports jobs page. Looking for gaming opportunities in ${pageContext.location}?`;
    }
    if (pageContext.pageType === "career-guide") {
      return `${greeting}You're exploring ${pageContext.title}. Want to know about salaries, skills, or open positions?`;
    }
    if (pageContext.pageType === "company-careers") {
      return `${greeting}You're viewing ${pageContext.title}. Interested in learning about their culture or open roles?`;
    }
    if (pageContext.pageType === "homepage") {
      return `${greeting}Welcome to EsportsJobs.quest! I can help you find esports jobs, explore companies, or learn about gaming careers.`;
    }
    return `${greeting}I'm here to help you find your next esports opportunity. What are you looking for?`;
  }, [pageContext, firstName]);

  // Don't render on homepage (it has its own CopilotSidebar)
  if (pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Floating Voice Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceInput
          onMessage={handleVoiceMessage}
          firstName={firstName}
          userId={user?.id}
          email={user?.email}
          pageContext={pageContext}
        />
      </div>

      {/* CopilotKit Popup - Floating chat widget */}
      <CopilotPopup
        instructions={agentInstructions}
        labels={{
          title: "Esports Jobs AI",
          initial: initialMessage,
        }}
      />
    </>
  );
}
