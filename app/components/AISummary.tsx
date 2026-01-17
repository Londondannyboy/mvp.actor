"use client";

import { useState, useEffect, useCallback } from "react";

interface AISummaryProps {
  jobTitle: string;
  company: string;
  location: string;
  category: string;
  skills: string[];
  description: string;
  type: string;
  salary?: string;
}

export function AISummary({
  jobTitle,
  company,
  location,
  category,
  skills,
  description,
  type,
  salary,
}: AISummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch summary from API
  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          company,
          location,
          category,
          skills,
          description,
          type,
          salary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setIsLoading(false);
      setIsTyping(true);
    } catch (err) {
      console.error("AI Summary error:", err);
      setError("Could not generate summary");
      setIsLoading(false);
    }
  }, [jobTitle, company, location, category, skills, description, type, salary]);

  // Fetch on mount
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || !summary) return;

    let currentIndex = 0;
    const typingSpeed = 20; // ms per character

    const typeInterval = setInterval(() => {
      if (currentIndex < summary.length) {
        setDisplayedText(summary.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [isTyping, summary]);

  if (error) {
    return null; // Silently fail - don't show error to user
  }

  return (
    <div className="bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-cyan-900/20 rounded-xl p-5 border border-cyan-500/30 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">✨</span>
        <span className="text-sm font-semibold text-cyan-400">AI Career Insight</span>
        {isLoading && (
          <span className="ml-auto flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Analyzing...
          </span>
        )}
      </div>

      <div className="min-h-[60px]">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full" />
          </div>
        ) : (
          <p className="text-gray-200 leading-relaxed">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 animate-pulse" />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
