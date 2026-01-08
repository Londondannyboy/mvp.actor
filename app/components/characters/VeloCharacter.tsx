'use client';

import { CharacterSection, ProfileItem } from '../CharacterSection';
import { CHARACTERS, getCharacterCompletion, type ProfileItems } from '@/lib/character-config';

interface VeloCharacterProps {
  profileItems: ProfileItems;
}

const VELO_CONFIG = CHARACTERS.find(c => c.name === 'Velo')!;

export function VeloCharacter({ profileItems }: VeloCharacterProps) {
  const completion = getCharacterCompletion(VELO_CONFIG, profileItems);

  const experienceYears = profileItems.experience_years?.[0];
  const careerHistory = profileItems.career_history || [];

  return (
    <CharacterSection
      name="Velo"
      title={VELO_CONFIG.title}
      subtitle={VELO_CONFIG.subtitle}
      icon={VELO_CONFIG.icon}
      animation={VELO_CONFIG.animation}
      color={VELO_CONFIG.color}
      gradient={VELO_CONFIG.gradient}
      isComplete={completion.isComplete}
      completionPercent={completion.percent}
    >
      <ProfileItem
        label="Years of Experience"
        value={experienceYears?.value ? `${experienceYears.value} years` : undefined}
        color={VELO_CONFIG.color}
        isComplete={!!experienceYears}
      />

      {careerHistory.length > 0 ? (
        <div>
          <div className="text-sm text-gray-500 mb-2">Career Path</div>
          <div className="flex items-center gap-2 flex-wrap">
            {careerHistory.map((item, i) => (
              <div key={i} className="flex items-center">
                <span
                  className="px-3 py-1 text-sm rounded-full border"
                  style={{
                    backgroundColor: `${VELO_CONFIG.color}20`,
                    borderColor: `${VELO_CONFIG.color}50`,
                    color: VELO_CONFIG.color,
                  }}
                >
                  {item.value}
                </span>
                {i < careerHistory.length - 1 && (
                  <span className="mx-2 text-gray-600">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ProfileItem
          label="Career Path"
          value={undefined}
          color={VELO_CONFIG.color}
        />
      )}

      {!completion.isComplete && completion.missing.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="text-sm text-gray-400">
            <span className="text-yellow-400">To complete Velo:</span>{' '}
            Add your {completion.missing.join(' and ')}
          </div>
        </div>
      )}

      {completion.isComplete && (
        <div className="mt-4 p-3 rounded-lg bg-pink-500/10 border border-pink-500/30">
          <div className="text-sm text-pink-400">
            Velo activated - your momentum is clear!
          </div>
        </div>
      )}
    </CharacterSection>
  );
}
