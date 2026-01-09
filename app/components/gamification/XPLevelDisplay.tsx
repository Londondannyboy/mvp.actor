'use client';

import { useState, useEffect } from 'react';
import { Level, XPBreakdown, getXPProgress } from '@/lib/gamification';

interface XPLevelDisplayProps {
  xp: number;
  level: Level;
  breakdown: XPBreakdown['breakdown'];
  className?: string;
}

export function XPLevelDisplay({ xp, level, breakdown, className = '' }: XPLevelDisplayProps) {
  const [displayXP, setDisplayXP] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const progress = getXPProgress(xp);

  // Animate XP counter
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = xp / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), xp);
      setDisplayXP(current);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [xp]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Level Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 border backdrop-blur-sm cursor-pointer transition-all hover:scale-[1.02]"
        style={{
          backgroundColor: `${level.color}15`,
          borderColor: `${level.color}40`,
        }}
        onClick={() => setShowBreakdown(!showBreakdown)}
      >
        {/* Animated background glow */}
        <div
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${level.color}, transparent 70%)`,
          }}
        />

        <div className="relative flex items-center gap-6">
          {/* Level Icon */}
          <div
            className="flex items-center justify-center w-20 h-20 rounded-full text-4xl border-4 shadow-lg animate-bounce-slow"
            style={{
              backgroundColor: `${level.color}30`,
              borderColor: level.color,
              boxShadow: `0 0 30px ${level.color}50`,
            }}
          >
            {level.icon}
          </div>

          {/* Level Info */}
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-white">Level {level.level}</span>
              <span
                className="text-lg font-semibold"
                style={{ color: level.color }}
              >
                {level.title}
              </span>
            </div>

            {/* XP Display */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-white">{displayXP.toLocaleString()}</span>
              <span className="text-gray-400">XP</span>
              {progress.needed > 0 && (
                <span className="text-sm text-gray-500">
                  ({progress.needed - progress.current} to next level)
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {progress.needed > 0 && (
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${progress.percent}%`,
                    background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)`,
                    boxShadow: `0 0 10px ${level.color}`,
                  }}
                />
              </div>
            )}

            {/* Max Level Indicator */}
            {progress.needed === 0 && (
              <div
                className="text-sm font-semibold animate-pulse"
                style={{ color: level.color }}
              >
                MAX LEVEL ACHIEVED!
              </div>
            )}
          </div>

          {/* Expand Arrow */}
          <div className="text-gray-400">
            <svg
              className={`w-6 h-6 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* XP Breakdown Panel */}
      {showBreakdown && (
        <div className="mt-4 p-4 rounded-xl bg-gray-900/80 border border-gray-700 backdrop-blur-sm animate-fadeIn">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">XP Breakdown</h4>
          <div className="grid grid-cols-2 gap-2">
            {breakdown.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50"
              >
                <div>
                  <div className="text-sm text-white">{item.category}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                <div className="text-lg font-bold" style={{ color: level.color }}>
                  +{item.xp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
