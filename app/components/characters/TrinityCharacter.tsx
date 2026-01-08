'use client';

import dynamic from 'next/dynamic';
import { CharacterSection, SkillsDisplay, ProfileItem } from '../CharacterSection';
import { CHARACTERS, getCharacterCompletion, type ProfileItems } from '@/lib/character-config';

const TrinitySkillsGraph = dynamic(
  () => import('../graphs').then(mod => mod.TrinitySkillsGraph),
  { ssr: false }
);

interface TrinityCharacterProps {
  profileItems: ProfileItems;
}

const TRINITY_CONFIG = CHARACTERS.find(c => c.name === 'Trinity')!;

export function TrinityCharacter({ profileItems }: TrinityCharacterProps) {
  const completion = getCharacterCompletion(TRINITY_CONFIG, profileItems);

  const skills = profileItems.skill || [];
  const careerGoal = profileItems.career_goal?.[0];

  return (
    <CharacterSection
      name="Trinity"
      title={TRINITY_CONFIG.title}
      subtitle={TRINITY_CONFIG.subtitle}
      icon={TRINITY_CONFIG.icon}
      animation={TRINITY_CONFIG.animation}
      color={TRINITY_CONFIG.color}
      gradient={TRINITY_CONFIG.gradient}
      isComplete={completion.isComplete}
      completionPercent={completion.percent}
    >
      {/* Skills Constellation Graph */}
      {skills.length > 0 && (
        <TrinitySkillsGraph
          skills={skills}
          careerGoal={careerGoal?.value}
          className="mb-6"
        />
      )}

      <SkillsDisplay
        skills={skills}
        color={TRINITY_CONFIG.color}
        minRequired={TRINITY_CONFIG.minItems || 2}
      />

      <ProfileItem
        label="Career Goal"
        value={careerGoal?.value}
        color={TRINITY_CONFIG.color}
        isComplete={!!careerGoal}
      />

      {!completion.isComplete && completion.missing.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="text-sm text-gray-400">
            <span className="text-yellow-400">To complete Trinity:</span>{' '}
            {completion.missing.map((m, i) => (
              <span key={i}>
                {i > 0 && ', '}
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {completion.isComplete && (
        <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <div className="text-sm text-purple-400">
            Trinity unlocked - I know your strengths!
          </div>
        </div>
      )}
    </CharacterSection>
  );
}
