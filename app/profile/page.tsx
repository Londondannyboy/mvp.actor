'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/app/lib/auth/client';
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from '@/app/components/UnifiedHeader';
import { UnifiedFooter } from '@/app/components/UnifiedFooter';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic imports for profile components
const UserProfileGraph = dynamic(
  () => import('../components/UserProfileGraph').then(mod => mod.UserProfileGraph),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-900/50 rounded-xl flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading 3D Graph...</div>
      </div>
    )
  }
);

const ProfileItemsList = dynamic(
  () => import('../components/UserProfileGraph').then(mod => mod.ProfileItemsList),
  { ssr: false }
);

interface ProfileItem {
  value: string;
  metadata: Record<string, unknown>;
  confirmed: boolean;
  created_at: string;
}

interface ProfileData {
  items: Record<string, ProfileItem[]>;
  total: number;
}

interface CompletenessData {
  complete: boolean;
  percent: number;
  skills_count: number;
  has_location: boolean;
  has_role: boolean;
  has_experience: boolean;
  missing: string[];
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0];

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('list');

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

        // Group items by type
        const items: Record<string, ProfileItem[]> = {};
        for (const item of data.items || []) {
          const type = item.item_type;
          if (!items[type]) items[type] = [];
          items[type].push({
            value: item.value,
            metadata: item.metadata || {},
            confirmed: item.confirmed,
            created_at: item.created_at,
          });
        }

        setProfileData({ items, total: data.items?.length || 0 });

        // Calculate completeness
        const skills = items.skill || [];
        const hasLocation = (items.location || []).length > 0;
        const hasRole = (items.role || []).length > 0;
        const hasExperience = (items.experience_years || []).length > 0;

        const missing: string[] = [];
        if (skills.length === 0) missing.push('skills');
        if (!hasLocation) missing.push('location');
        if (!hasRole) missing.push('role');

        // Calculate percent: skills (40%), role (30%), location (30%)
        let percent = 0;
        if (skills.length >= 3) percent += 40;
        else if (skills.length > 0) percent += Math.min(skills.length * 15, 40);
        if (hasRole) percent += 30;
        if (hasLocation) percent += 30;

        setCompleteness({
          complete: percent >= 80,
          percent,
          skills_count: skills.length,
          has_location: hasLocation,
          has_role: hasRole,
          has_experience: hasExperience,
          missing,
        });
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

  // Convert profile data to graph format
  const graphData = profileData ? {
    nodes: [
      { id: 'user', name: firstName || 'You', type: 'user' as const, color: '#FFD700' },
      ...(profileData.items?.skill || []).map((s, i) => ({
        id: `skill_${i}`,
        name: s.value,
        type: 'skill' as const,
        color: '#A855F7',
        metadata: s.metadata
      })),
      ...(profileData.items?.role || []).map((r, i) => ({
        id: `role_${i}`,
        name: r.value,
        type: 'role' as const,
        color: '#3B82F6'
      })),
      ...(profileData.items?.location || []).map((l, i) => ({
        id: `location_${i}`,
        name: l.value,
        type: 'location' as const,
        color: '#22C55E',
        metadata: l.metadata
      })),
    ],
    links: [
      ...(profileData.items?.skill || []).map((_, i) => ({ source: 'user', target: `skill_${i}` })),
      ...(profileData.items?.role || []).map((_, i) => ({ source: 'user', target: `role_${i}` })),
      ...(profileData.items?.location || []).map((_, i) => ({ source: 'user', target: `location_${i}` })),
    ]
  } : undefined;

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
            Build your career profile to get personalized job recommendations and track your progress.
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

      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {firstName ? `${firstName}'s` : 'Your'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Career Profile</span>
          </h1>
          <p className="text-xl text-gray-400">
            Build your profile to get personalized job recommendations
          </p>
        </div>

        {/* Completeness Card */}
        {completeness && (
          <div className="mb-8 p-6 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-2xl border border-cyan-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Circular Progress */}
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(completeness.percent / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                    {completeness.percent}%
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-1">
                    {completeness.complete ? 'Profile Complete!' : 'Keep Building'}
                  </h2>
                  <p className="text-gray-400">
                    {completeness.missing.length > 0
                      ? `Add your ${completeness.missing[0]} to improve matches`
                      : 'Your profile is ready for job matching!'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`px-4 py-2 rounded-lg ${completeness.skills_count > 0 ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-500'}`}>
                  <div className="text-2xl font-bold">{completeness.skills_count}</div>
                  <div className="text-xs">Skills</div>
                </div>
                <div className={`px-4 py-2 rounded-lg ${completeness.has_role ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-500'}`}>
                  <div className="text-2xl font-bold">{completeness.has_role ? '✓' : '–'}</div>
                  <div className="text-xs">Role</div>
                </div>
                <div className={`px-4 py-2 rounded-lg ${completeness.has_location ? 'bg-green-500/20 text-green-300' : 'bg-gray-800 text-gray-500'}`}>
                  <div className="text-2xl font-bold">{completeness.has_location ? '✓' : '–'}</div>
                  <div className="text-xs">Location</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-cyan-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'graph'
                  ? 'bg-cyan-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              3D Graph
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mb-12">
          {viewMode === 'graph' ? (
            <UserProfileGraph
              graphData={graphData}
              completeness={completeness || undefined}
              className="min-h-[500px]"
            />
          ) : (
            <ProfileItemsList
              graphData={graphData}
              completeness={completeness || undefined}
            />
          )}
        </div>

        {/* Job Assessment Feature Card - Show when profile has some data */}
        {profileData && completeness && completeness.skills_count > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-2xl border border-purple-500/30">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Assess Your Job Fit</h3>
                <p className="text-gray-400 mb-3">
                  With {completeness.skills_count} skill{completeness.skills_count !== 1 ? 's' : ''} in your profile, you can now see how well you match job requirements.
                </p>
                <p className="text-sm text-gray-500">
                  Browse jobs and click the purple &ldquo;Assess My Fit&rdquo; button to compare your skills against requirements.
                </p>
              </div>
              <Link
                href="/esports-jobs"
                className="flex-shrink-0 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        )}

        {/* CTA to Build Profile - Empty state */}
        {(!profileData || completeness?.percent === 0) && (
          <div className="text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">Start Building Your Profile</h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Chat with our AI to add your skills, target role, and location preferences.
              The more you share, the better job matches you&apos;ll get!
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Try saying: &ldquo;I know Python and JavaScript&rdquo; or &ldquo;I&apos;m looking for marketing roles in London&rdquo;
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              Open AI Chat
            </Link>
          </div>
        )}

        {/* Partial Profile - Encourage completion */}
        {profileData && completeness && completeness.percent > 0 && completeness.percent < 80 && (
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-4">
              Your profile is {completeness.percent}% complete. Add more {completeness.missing[0]} to improve job matches.
            </p>
            <Link
              href="/"
              className="inline-block text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Continue building with AI Chat →
            </Link>
          </div>
        )}
      </div>

      <UnifiedFooter activeSite="jobs" />
    </main>
  );
}
