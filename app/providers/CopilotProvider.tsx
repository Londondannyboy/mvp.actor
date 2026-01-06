"use client";
import { CopilotKit } from "@copilotkit/react-core";
import { ReactNode } from "react";

// Neon Auth is optional - only enable when NEON_AUTH_BASE_URL is set
const NEON_AUTH_ENABLED = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_NEON_AUTH_ENABLED === 'true';

export function CopilotProvider({ children }: { children: ReactNode }) {
  // For now, just use CopilotKit without auth wrapper
  // Auth can be added later by setting NEON_AUTH_BASE_URL
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="esports_agent">
      {children}
    </CopilotKit>
  );
}
