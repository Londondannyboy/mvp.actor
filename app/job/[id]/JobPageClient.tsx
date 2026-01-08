'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';

// Lazy load CopilotSidebar
const CopilotSidebar = dynamic(
  () => import('@copilotkit/react-ui').then(mod => mod.CopilotSidebar),
  { ssr: false }
);

interface JobPageClientProps {
  jobId: string;
  jobTitle: string;
  jobCompany: string;
  children: React.ReactNode;
}

export function JobPageClient({ jobId, jobTitle, jobCompany, children }: JobPageClientProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const { appendMessage } = useCopilotChat();

  const handleAssess = async () => {
    setIsAssessing(true);
    // Open chat first
    setChatOpen(true);

    // Wait a moment for sidebar to mount, then send message
    setTimeout(async () => {
      try {
        const message = new TextMessage({
          content: `Assess my fit for the ${jobTitle} job at ${jobCompany} (job ID: ${jobId})`,
          role: Role.User,
        });
        await appendMessage(message);
      } catch (error) {
        console.error('Error triggering assessment:', error);
      }
      setIsAssessing(false);
    }, 500);
  };

  const pageContent = (
    <>
      {children}

      {/* Floating Assess Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={handleAssess}
          disabled={isAssessing}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold py-3 px-5 rounded-full shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
          title="Assess how well your skills match this job"
        >
          {isAssessing ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Assessing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Assess My Fit
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open AI chat assistant"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </>
  );

  if (chatOpen) {
    return (
      <CopilotSidebar
        defaultOpen={true}
        onSetOpen={(open) => setChatOpen(open)}
        labels={{
          title: "Esports Jobs AI",
          initial: `I can help you learn more about this ${jobTitle} role at ${jobCompany}, or assess how well your skills match!`,
        }}
      >
        {pageContent}
      </CopilotSidebar>
    );
  }

  return pageContent;
}
