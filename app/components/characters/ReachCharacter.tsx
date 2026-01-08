'use client';

import Link from 'next/link';
import { CharacterSection, ProfileItem } from '../CharacterSection';
import { CHARACTERS, getCharacterCompletion, type ProfileItems } from '@/lib/character-config';

interface ReachCharacterProps {
  profileItems: ProfileItems;
  savedJobsCount?: number;
  assessmentsCount?: number;
}

const REACH_CONFIG = CHARACTERS.find(c => c.name === 'Reach')!;

export function ReachCharacter({
  profileItems,
  savedJobsCount = 0,
  assessmentsCount = 0,
}: ReachCharacterProps) {
  const completion = getCharacterCompletion(REACH_CONFIG, profileItems);

  const visibility = profileItems.network_visibility?.[0];

  return (
    <CharacterSection
      name="Reach"
      title={REACH_CONFIG.title}
      subtitle={REACH_CONFIG.subtitle}
      icon={REACH_CONFIG.icon}
      animation={REACH_CONFIG.animation}
      color={REACH_CONFIG.color}
      gradient={REACH_CONFIG.gradient}
      isComplete={completion.isComplete}
      completionPercent={completion.percent}
    >
      <div className="space-y-4">
        {/* Saved Jobs */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <div>
            <div className="text-sm text-gray-500">Saved Jobs</div>
            <div className="text-2xl font-bold" style={{ color: REACH_CONFIG.color }}>
              {savedJobsCount}
            </div>
          </div>
          <Link
            href="/esports-jobs"
            className="text-sm px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Assessments */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
          <div>
            <div className="text-sm text-gray-500">Job Assessments</div>
            <div className="text-2xl font-bold" style={{ color: REACH_CONFIG.color }}>
              {assessmentsCount}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Use &ldquo;Assess My Fit&rdquo; on job pages
          </div>
        </div>

        {/* Visibility */}
        <ProfileItem
          label="Profile Visibility"
          value={visibility?.value || 'Private'}
          color={REACH_CONFIG.color}
        />
      </div>

      {/* CTA to expand reach */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
        <div className="text-sm text-yellow-400 mb-2">
          Expand your reach
        </div>
        <div className="text-xs text-gray-400">
          Save jobs you&apos;re interested in and assess your fit to build your network of opportunities.
        </div>
      </div>

      {completion.isComplete && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="text-sm text-yellow-400">
            Reach expanded - you&apos;re connected!
          </div>
        </div>
      )}
    </CharacterSection>
  );
}
