'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/app/lib/auth/client';
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from '@/app/components/UnifiedHeader';
import { UnifiedFooter } from '@/app/components/UnifiedFooter';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  type ProfileItems,
  getOverallCompletion,
  getAllCharacterCompletions,
  getNextIncompleteCharacter,
  getAllCompleteMessage,
} from '@/lib/character-config';

// Dynamic imports for heavy components
const UserProfileGraph = dynamic(
  () => import('../components/UserProfileGraph').then(mod => mod.UserProfileGraph),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-900/50 rounded-xl flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading Profile Graph...</div>
      </div>
    )
  }
);

// Dynamic imports for character components
const RepoCharacter = dynamic(
  () => import('../components/characters').then(mod => mod.RepoCharacter),
  { ssr: false }
);
const TrinityCharacter = dynamic(
  () => import('../components/characters').then(mod => mod.TrinityCharacter),
  { ssr: false }
);
const VeloCharacter = dynamic(
  () => import('../components/characters').then(mod => mod.VeloCharacter),
  { ssr: false }
);
const ReachCharacter = dynamic(
  () => import('../components/characters').then(mod => mod.ReachCharacter),
  { ssr: false }
);

interface ProfileItem {
  value: string;
  metadata: Record<string, unknown>;
  confirmed: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0];

  const [profileItems, setProfileItems] = useState<ProfileItems>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from API
  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user-profile?userId=${user.id}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Group items by type for character config compatibility
        const items: ProfileItems = {};
        for (const item of data.items || []) {
          const type = item.item_type as keyof ProfileItems;
          if (!items[type]) items[type] = [];
          (items[type] as ProfileItem[]).push({
            value: item.value,
            metadata: item.metadata || {},
            confirmed: item.confirmed,
            created_at: item.created_at,
          });
        }

        setProfileItems(items);
      } catch (e) {
        setError('Failed to load profile');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (!isPending) {
      fetchProfile();
    }
  }, [user?.id, isPending]);

  // Calculate overall completion and character statuses
  const overallPercent = getOverallCompletion(profileItems);
  const characterCompletions = getAllCharacterCompletions(profileItems);
  const nextIncomplete = getNextIncompleteCharacter(profileItems);
  const allComplete = characterCompletions.every(c => c.isComplete);

  // Convert profile data to graph format for ZEP visualization
  const graphData = {
    nodes: [
      { id: 'user', name: firstName || 'You', type: 'user' as const, color: '#FFD700' },
      ...(profileItems.skill || []).map((s, i) => ({
        id: `skill_${i}`,
        name: s.value,
        type: 'skill' as const,
        color: '#A855F7',
        metadata: s.metadata
      })),
      ...(profileItems.role || []).map((r, i) => ({
        id: `role_${i}`,
        name: r.value,
        type: 'role' as const,
        color: '#3B82F6'
      })),
      ...(profileItems.location || []).map((l, i) => ({
        id: `location_${i}`,
        name: l.value,
        type: 'location' as const,
        color: '#22C55E',
        metadata: l.metadata
      })),
    ],
    links: [
      ...(profileItems.skill || []).map((_, i) => ({ source: 'user', target: `skill_${i}` })),
      ...(profileItems.role || []).map((_, i) => ({ source: 'user', target: `role_${i}` })),
      ...(profileItems.location || []).map((_, i) => ({ source: 'user', target: `location_${i}` })),
    ]
  };

  // Loading state
  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white">
        <UnifiedHeader activeSite="jobs" siteNavItems={JOBS_SITE_NAV_ITEMS} />
        <div className="pt-24 px-4 max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20" />
            <div className="h-8 bg-gray-800 rounded w-48 mx-auto mb-4" />
            <div className="h-4 bg-gray-800 rounded w-64 mx-auto" />
          </div>
        </div>
      </main>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white">
        <UnifiedHeader activeSite="jobs" siteNavItems={JOBS_SITE_NAV_ITEMS} />
        <div className="pt-24 px-4 max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold mb-4">Sign In to View Your Profile</h1>
          <p className="text-gray-400 mb-8">
            Build your career profile with 4 unique characters and get personalized job recommendations.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg transition-all"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <UnifiedHeader activeSite="jobs" siteNavItems={JOBS_SITE_NAV_ITEMS} />

      {/* Hero Section - ZEP Graph */}
      <section className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {firstName ? `${firstName}'s` : 'Your'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                Career Quest
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              {allComplete
                ? getAllCompleteMessage()
                : nextIncomplete
                  ? `Next: Complete ${nextIncomplete.name} - ${nextIncomplete.subtitle}`
                  : 'Build your profile to unlock all characters'}
            </p>
          </div>

          {/* ZEP Graph */}
          <div className="relative">
            <UserProfileGraph
              graphData={graphData.nodes.length > 1 ? graphData : undefined}
              className="min-h-[400px]"
            />

            {/* Empty state overlay */}
            {graphData.nodes.length <= 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎮</div>
                  <h3 className="text-xl font-bold mb-2">Start Your Quest</h3>
                  <p className="text-gray-400 mb-4">
                    Chat with our AI to build your profile
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Open AI Chat
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Overall Progress */}
          <div className="mt-8 p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Progress Circle */}
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="url(#overallGradient)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${(overallPercent / 100) * 201} 201`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ff00aa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {overallPercent}%
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Overall Progress</h2>
                  <p className="text-sm text-gray-400">
                    {characterCompletions.filter(c => c.isComplete).length}/4 characters complete
                  </p>
                </div>
              </div>

              {/* Character Status Pills */}
              <div className="flex gap-2 flex-wrap justify-center">
                {characterCompletions.map((char) => (
                  <div
                    key={char.name}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      char.isComplete
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : char.percent > 0
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                          : 'bg-gray-800 border-gray-700 text-gray-500'
                    }`}
                  >
                    {char.name} {char.isComplete ? '✓' : `${char.percent}%`}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="text-center mt-8 text-gray-500 animate-bounce">
            <div className="text-sm mb-2">Scroll to explore your characters</div>
            <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Character Sections - Scroll Experience */}
      <RepoCharacter profileItems={profileItems} />
      <TrinityCharacter profileItems={profileItems} />
      <VeloCharacter profileItems={profileItems} />
      <ReachCharacter profileItems={profileItems} />

      {/* All Complete Celebration */}
      {allComplete && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                All Characters Unlocked!
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Your profile is complete. Now let&apos;s find your perfect role!
            </p>
            <Link
              href="/esports-jobs"
              className="inline-block bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-lg text-lg hover:opacity-90 transition-opacity"
            >
              Browse Jobs & Assess Your Fit
            </Link>
          </div>
        </section>
      )}

      {/* CTA to continue building */}
      {!allComplete && (
        <section className="py-16 px-4 bg-gray-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Continue Your Quest</h2>
            <p className="text-gray-400 mb-6">
              Chat with our AI to complete your profile and unlock all characters.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Open AI Chat
            </Link>
          </div>
        </section>
      )}

      <UnifiedFooter activeSite="jobs" />
    </main>
  );
}
