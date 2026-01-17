import { NextRequest, NextResponse } from "next/server";

// Use the same Google API key as the backend agent
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

interface SummaryRequest {
  jobTitle: string;
  company: string;
  location: string;
  category: string;
  skills: string[];
  description: string;
  type: string;
  salary?: string;
}

// Simple in-memory cache for summaries (persists for server lifetime)
const summaryCache = new Map<string, { summary: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: NextRequest) {
  try {
    const body: SummaryRequest = await req.json();
    const { jobTitle, company, location, category, skills, description, type, salary } = body;

    // Create cache key from job details
    const cacheKey = `${jobTitle}-${company}-${location}`.toLowerCase().replace(/\s+/g, "-");

    // Check cache first
    const cached = summaryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ summary: cached.summary, cached: true });
    }

    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google API key not configured" },
        { status: 500 }
      );
    }

    // Build prompt for Gemini Flash
    const prompt = `You are an expert esports career advisor. Write a brief, engaging 2-3 sentence summary for someone considering this job opportunity. Be specific about what makes this role exciting and who it's perfect for.

Job Details:
- Title: ${jobTitle}
- Company: ${company}
- Location: ${location}
- Type: ${type}
- Category: ${category}
- Salary: ${salary || "Competitive"}
- Key Skills: ${skills.join(", ")}
- Description: ${description.slice(0, 500)}

Write a compelling summary that:
1. Highlights the most exciting aspect of this role
2. Mentions the key skills needed
3. Suggests what kind of candidate would thrive here

Keep it under 60 words. Be enthusiastic but professional. Do not use bullet points.`;

    // Call Gemini Flash API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
            topP: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[AI Summary] Gemini API error:", error);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "This exciting esports role offers a great opportunity to grow your career in the gaming industry.";

    // Cache the result
    summaryCache.set(cacheKey, { summary: summary.trim(), timestamp: Date.now() });

    return NextResponse.json({ summary: summary.trim(), cached: false });
  } catch (error) {
    console.error("[AI Summary] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
