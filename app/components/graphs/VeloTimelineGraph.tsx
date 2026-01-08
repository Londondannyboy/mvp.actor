'use client';

/**
 * Velo Timeline Graph - Career progression timeline
 * Shows experience as a horizontal timeline with milestones
 */

import { useMemo } from 'react';

interface CareerItem {
  value: string;
  metadata?: {
    year?: number;
    company?: string;
  };
}

interface VeloTimelineGraphProps {
  experienceYears?: string;
  careerHistory: CareerItem[];
  className?: string;
}

export function VeloTimelineGraph({
  experienceYears,
  careerHistory,
  className = '',
}: VeloTimelineGraphProps) {
  const years = parseInt(experienceYears || '0', 10);

  // Generate timeline points
  const timelinePoints = useMemo(() => {
    if (careerHistory.length > 0) {
      return careerHistory.map((item, i) => ({
        id: i,
        label: item.value,
        year: item.metadata?.year,
        company: item.metadata?.company,
        position: (i / Math.max(careerHistory.length - 1, 1)) * 100,
      }));
    }

    // If no history, create placeholder based on years
    if (years > 0) {
      const points = [];
      const stages = Math.min(years, 4);
      for (let i = 0; i <= stages; i++) {
        points.push({
          id: i,
          label: i === 0 ? 'Started' : i === stages ? 'Now' : `Year ${Math.round((years / stages) * i)}`,
          position: (i / stages) * 100,
        });
      }
      return points;
    }

    return [];
  }, [careerHistory, years]);

  if (!experienceYears && careerHistory.length === 0) {
    return (
      <div className={`bg-pink-900/20 rounded-xl p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">🚀</div>
        <p className="text-pink-300">Add your experience to see your velocity timeline</p>
      </div>
    );
  }

  return (
    <div className={`bg-pink-900/20 rounded-xl p-6 ${className}`}>
      {/* Years badge */}
      {years > 0 && (
        <div className="flex justify-center mb-6">
          <div className="bg-pink-500/20 border border-pink-500/50 rounded-full px-6 py-2">
            <span className="text-3xl font-bold text-pink-400">{years}</span>
            <span className="text-pink-300 ml-2">years in the game</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative py-8">
        {/* Main line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-pink-500/30 via-pink-500 to-pink-500/30 rounded-full transform -translate-y-1/2" />

        {/* Animated glow */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full transform -translate-y-1/2 animate-pulse opacity-50" />

        {/* Points */}
        <div className="relative flex justify-between items-center px-4">
          {timelinePoints.map((point, i) => (
            <div
              key={point.id}
              className="flex flex-col items-center"
              style={{ position: 'absolute', left: `${point.position}%`, transform: 'translateX(-50%)' }}
            >
              {/* Dot */}
              <div
                className={`w-4 h-4 rounded-full border-2 border-pink-400 ${
                  i === timelinePoints.length - 1
                    ? 'bg-pink-500 shadow-lg shadow-pink-500/50'
                    : 'bg-gray-900'
                }`}
              />

              {/* Label */}
              <div className={`mt-3 text-center ${i % 2 === 0 ? '' : 'mt-[-60px] mb-[60px]'}`}>
                <div className="text-sm font-medium text-white whitespace-nowrap">
                  {point.label}
                </div>
                {'company' in point && point.company && (
                  <div className="text-xs text-pink-400">{point.company}</div>
                )}
                {'year' in point && point.year && (
                  <div className="text-xs text-gray-500">{point.year}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Velocity indicator */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>Velocity:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-3 h-6 rounded-sm ${
                  level <= Math.min(Math.ceil(years / 2), 5)
                    ? 'bg-gradient-to-t from-pink-600 to-pink-400'
                    : 'bg-gray-700'
                }`}
                style={{ height: `${12 + level * 4}px` }}
              />
            ))}
          </div>
          <span className="text-pink-400 font-medium">
            {years >= 10 ? 'Veteran' : years >= 5 ? 'Experienced' : years >= 2 ? 'Growing' : 'Starting'}
          </span>
        </div>
      </div>
    </div>
  );
}
