'use client';

import { useState } from 'react';
import { Achievement } from '@/lib/gamification';

interface AchievementBadgesProps {
  unlocked: Achievement[];
  locked: Achievement[];
  className?: string;
}

const RARITY_COLORS = {
  common: { bg: '#6b7280', border: '#9ca3af', glow: 'none' },
  uncommon: { bg: '#22c55e', border: '#4ade80', glow: '0 0 15px #22c55e50' },
  rare: { bg: '#3b82f6', border: '#60a5fa', glow: '0 0 20px #3b82f650' },
  epic: { bg: '#f59e0b', border: '#fbbf24', glow: '0 0 25px #f59e0b60' },
  legendary: { bg: '#ffd700', border: '#ffed4a', glow: '0 0 30px #ffd70080' },
};

export function AchievementBadges({ unlocked, locked, className = '' }: AchievementBadgesProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedLocked = showAll ? locked : locked.slice(0, 4);

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Achievements
          <span className="text-sm font-normal text-gray-400">
            ({unlocked.length}/{unlocked.length + locked.length})
          </span>
        </h3>
      </div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Unlocked</div>
          <div className="flex flex-wrap gap-3">
            {unlocked.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={true}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {locked.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Locked</div>
          <div className="flex flex-wrap gap-3">
            {displayedLocked.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={false}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
            {!showAll && locked.length > 4 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 text-gray-500 text-sm hover:bg-gray-700 transition-colors"
              >
                +{locked.length - 4}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border animate-scaleIn"
            style={{
              borderColor: RARITY_COLORS[selectedAchievement.rarity].border,
              boxShadow: RARITY_COLORS[selectedAchievement.rarity].glow,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div
                className="text-6xl mb-4"
                style={{
                  filter: unlocked.includes(selectedAchievement) ? 'none' : 'grayscale(100%)',
                }}
              >
                {selectedAchievement.icon}
              </div>
              <div
                className="text-xl font-bold mb-1"
                style={{ color: selectedAchievement.color }}
              >
                {selectedAchievement.name}
              </div>
              <div className="text-gray-400 mb-3">{selectedAchievement.description}</div>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase"
                style={{
                  backgroundColor: `${RARITY_COLORS[selectedAchievement.rarity].bg}30`,
                  color: RARITY_COLORS[selectedAchievement.rarity].border,
                }}
              >
                {selectedAchievement.rarity}
              </div>
            </div>
            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full mt-6 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AchievementBadge({
  achievement,
  unlocked,
  onClick,
}: {
  achievement: Achievement;
  unlocked: boolean;
  onClick: () => void;
}) {
  const rarity = RARITY_COLORS[achievement.rarity];

  return (
    <button
      onClick={onClick}
      className={`
        relative w-12 h-12 rounded-full flex items-center justify-center text-2xl
        transition-all duration-300 hover:scale-110
        ${unlocked ? 'animate-bounce-slow' : 'grayscale opacity-40'}
      `}
      style={{
        backgroundColor: unlocked ? `${rarity.bg}30` : '#1f2937',
        border: `2px solid ${unlocked ? rarity.border : '#374151'}`,
        boxShadow: unlocked ? rarity.glow : 'none',
      }}
      title={achievement.name}
    >
      {achievement.icon}
      {unlocked && achievement.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: rarity.bg }}
        />
      )}
    </button>
  );
}
