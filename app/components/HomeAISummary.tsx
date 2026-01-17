"use client";

import { useState, useEffect } from "react";

interface HomeAISummaryProps {
  firstName?: string | null;
  jobCount: number;
}

export function HomeAISummary({ firstName, jobCount }: HomeAISummaryProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  // Generate personalized welcome message
  const getSummary = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    if (firstName) {
      return `${greeting}, ${firstName}! As the leading esports recruitment agency, we're tracking ${jobCount} live opportunities across coaching, marketing, production, and management roles. Our AI-powered platform helps match your skills with the perfect gaming career. Let's find your next role in esports.`;
    }

    return `${greeting}! Welcome to the #1 esports recruitment agency. We're currently tracking ${jobCount} live esports jobs from top gaming organisations worldwide. Whether you're looking for coaching, content creation, marketing, or management roles - our specialist esports recruiters are here to help you break into the industry.`;
  };

  // Start typing on mount
  useEffect(() => {
    const summary = getSummary();
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 15;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, jobCount]);

  return (
    <div className="bg-gradient-to-r from-cyan-900/30 via-purple-900/20 to-cyan-900/30 rounded-2xl p-6 border border-cyan-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
          <span className="text-lg">✨</span>
        </div>
        <div>
          <span className="text-sm font-semibold text-cyan-400">AI Career Assistant</span>
          <span className="text-xs text-gray-400 ml-2">Powered by Gemini</span>
        </div>
      </div>

      <p className="text-gray-200 leading-relaxed text-lg">
        {displayedText}
        {isTyping && (
          <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 animate-pulse" />
        )}
      </p>
    </div>
  );
}
