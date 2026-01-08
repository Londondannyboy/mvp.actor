'use client';

import { useState } from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { Role, TextMessage } from '@copilotkit/runtime-client-gql';

interface AssessJobButtonProps {
  jobId: string;
  jobTitle: string;
  className?: string;
}

export function AssessJobButton({ jobId, jobTitle, className = '' }: AssessJobButtonProps) {
  const [isAssessing, setIsAssessing] = useState(false);
  const { appendMessage } = useCopilotChat();

  const handleAssess = async () => {
    setIsAssessing(true);
    try {
      // Send message to the agent to trigger assessment
      const message = new TextMessage({
        content: `Assess my fit for the ${jobTitle} job (ID: ${jobId})`,
        role: Role.User,
      });
      await appendMessage(message);

      // Show feedback that assessment was triggered
      setTimeout(() => setIsAssessing(false), 2000);
    } catch (error) {
      console.error('Error triggering assessment:', error);
      setIsAssessing(false);
    }
  };

  return (
    <button
      onClick={handleAssess}
      disabled={isAssessing}
      className={`inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-wait text-white font-bold py-3 px-6 rounded-lg transition-all ${className}`}
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
  );
}

// Compact version for job cards
export function AssessJobButtonCompact({ jobId, jobTitle }: AssessJobButtonProps) {
  const [isAssessing, setIsAssessing] = useState(false);
  const { appendMessage } = useCopilotChat();

  const handleAssess = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a link
    e.stopPropagation();

    setIsAssessing(true);
    try {
      const message = new TextMessage({
        content: `Assess my fit for the ${jobTitle} job (ID: ${jobId})`,
        role: Role.User,
      });
      await appendMessage(message);
      setTimeout(() => setIsAssessing(false), 2000);
    } catch (error) {
      console.error('Error triggering assessment:', error);
      setIsAssessing(false);
    }
  };

  return (
    <button
      onClick={handleAssess}
      disabled={isAssessing}
      className="px-3 py-1 text-xs font-medium bg-purple-600/80 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-full transition-all flex items-center gap-1"
      title="Assess how well your skills match this job"
    >
      {isAssessing ? (
        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
      )}
      {isAssessing ? 'Checking...' : 'Fit?'}
    </button>
  );
}
