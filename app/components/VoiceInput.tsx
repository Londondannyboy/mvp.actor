"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { VoiceProvider, useVoice } from "@humeai/voice-react";

interface VoiceButtonProps {
  onMessage: (text: string, role?: "user" | "assistant") => void;
  firstName?: string | null;
  userId?: string | null;
}

function VoiceButton({ onMessage, firstName, userId }: VoiceButtonProps) {
  const { connect, disconnect, status, messages, sendUserInput } = useVoice();
  const [isPending, setIsPending] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastSentMsgId = useRef<string | null>(null);
  const greetedThisSession = useRef(false);

  // Track if agent is speaking
  useEffect(() => {
    const playbackMsgs = messages.filter(
      (m: { type: string }) => m.type === "assistant_message" || m.type === "assistant_end"
    );
    const lastPlayback = playbackMsgs[playbackMsgs.length - 1];
    setIsPlaying(lastPlayback?.type === "assistant_message");
  }, [messages]);

  // Forward messages to CopilotKit
  useEffect(() => {
    const conversationMsgs = messages.filter(
      (m: { type: string; message?: { content?: string } }) =>
        (m.type === "user_message" || m.type === "assistant_message") && m.message?.content
    );

    if (conversationMsgs.length > 0) {
      const lastMsg = conversationMsgs[conversationMsgs.length - 1] as {
        id?: string;
        type: string;
        message?: { content?: string };
      };
      const msgId = lastMsg?.id || `${conversationMsgs.length}-${lastMsg?.message?.content?.slice(0, 20)}`;

      if (lastMsg?.message?.content && msgId !== lastSentMsgId.current) {
        const isUser = lastMsg.type === "user_message";
        console.log(`[Voice] ${isUser ? "User" : "AI"}:`, lastMsg.message.content.slice(0, 80));
        lastSentMsgId.current = msgId;
        onMessage(lastMsg.message.content, isUser ? "user" : "assistant");
      }
    }
  }, [messages, onMessage]);

  const handleToggle = useCallback(async () => {
    if (status.value === "connected") {
      disconnect();
    } else {
      setIsPending(true);
      try {
        const res = await fetch("/api/hume-token");
        const { accessToken, error } = await res.json();

        if (error || !accessToken) {
          console.error("[Voice] Token error:", error);
          setIsPending(false);
          return;
        }

        const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || "";

        // Build system prompt for esports recruiter persona
        const systemPrompt = `## YOUR ROLE
You are the voice assistant for EsportsJobs.quest - an AI-powered esports job search platform.

## USER INFO
${firstName ? `Name: ${firstName}` : "Guest user"}
${userId ? `ID: ${userId}` : ""}

## PERSONALITY
- Enthusiastic about esports and gaming careers
- Knowledgeable about the industry (teams, tournaments, roles)
- Helpful but concise (voice responses should be 1-3 sentences)
- Use occasional gaming references and emojis sparingly

## CAPABILITIES
You can help users:
- Search for esports jobs by role, location, or company
- Learn about esports companies (Riot Games, Fnatic, Cloud9, etc.)
- Get career advice for breaking into esports
- Understand different roles (Marketing, Production, Coaching, etc.)

## RULES
1. Keep responses SHORT for voice - users can ask follow-ups
2. If asked to search jobs, confirm what they're looking for
3. Be encouraging about esports career opportunities
4. Never make up specific job listings - say "let me search for that"
`;

        const sessionId = userId
          ? `esports_${userId}`
          : `esports_anon_${Date.now()}`;

        console.log("[Voice] Connecting...", { firstName, configId });

        await connect({
          auth: { type: "accessToken" as const, value: accessToken },
          configId: configId,
          sessionSettings: {
            type: "session_settings" as const,
            systemPrompt,
            customSessionId: sessionId,
          },
        });

        // First-time greeting
        if (!greetedThisSession.current && firstName) {
          setTimeout(() => {
            greetedThisSession.current = true;
            sendUserInput(`Hi, my name is ${firstName}`);
          }, 500);
        }
      } catch (e) {
        console.error("[Voice] Connect error:", e);
      } finally {
        setIsPending(false);
      }
    }
  }, [connect, disconnect, status.value, firstName, userId, sendUserInput]);

  const isConnected = status.value === "connected";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
          isConnected
            ? isPlaying
              ? "bg-purple-500 animate-pulse shadow-purple-500/50"
              : "bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/50"
            : isPending
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-br from-cyan-500 to-purple-600 hover:scale-110 shadow-purple-500/30"
        }`}
        title={isConnected ? (isPlaying ? "AI speaking..." : "Listening...") : "Start voice chat"}
      >
        {isPending ? (
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
        ) : isConnected ? (
          isPlaying ? (
            // Speaking indicator
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-white rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : (
            // Listening indicator
            <div className="w-5 h-5 bg-white rounded-full animate-ping" />
          )
        ) : (
          // Mic icon
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}

        {/* Animated ring when connected */}
        {isConnected && (
          <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
        )}
      </button>

      <span className={`text-sm font-medium ${isConnected ? "text-white" : "text-cyan-400"}`}>
        {isPending
          ? "Connecting..."
          : isConnected
          ? isPlaying
            ? "AI speaking..."
            : "Listening..."
          : "Talk to AI"}
      </span>
    </div>
  );
}

// Stable callbacks to prevent remounting
const handleVoiceError = (err: { message?: string }) => console.error("[Voice] Error:", err?.message || err);
const handleVoiceOpen = () => console.log("[Voice] Connected");
const handleVoiceClose = (e: { code?: number; reason?: string }) =>
  console.log("[Voice] Closed:", e?.code, e?.reason);

export function VoiceInput({
  onMessage,
  firstName,
  userId,
}: {
  onMessage: (text: string, role?: "user" | "assistant") => void;
  firstName?: string | null;
  userId?: string | null;
}) {
  return (
    <VoiceProvider onError={handleVoiceError} onOpen={handleVoiceOpen} onClose={handleVoiceClose}>
      <VoiceButton onMessage={onMessage} firstName={firstName} userId={userId} />
    </VoiceProvider>
  );
}
