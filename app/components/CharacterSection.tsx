'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { CharacterName, AnimationType } from '@/lib/character-config';

// Lazy load the 3D character model
const CharacterModel = dynamic(
  () => import('./CharacterModel').then(mod => mod.CharacterModel),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading character...</div>
      </div>
    ),
  }
);

interface CharacterSectionProps {
  name: CharacterName;
  title: string;
  subtitle: string;
  icon: string;
  animation: AnimationType;
  color: string;
  gradient: string;
  isComplete: boolean;
  completionPercent: number;
  children: ReactNode; // Profile data content
}

export function CharacterSection({
  name,
  title,
  subtitle,
  icon,
  animation,
  color,
  gradient,
  isComplete,
  completionPercent,
  children,
}: CharacterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Determine visual state based on completion
  const getOpacityClass = () => {
    if (isComplete) return 'opacity-100';
    if (completionPercent > 0) return 'opacity-90';
    return 'opacity-70';
  };

  const getStatusLabel = () => {
    if (isComplete) return 'COMPLETE';
    if (completionPercent > 0) return 'IN PROGRESS';
    return 'NOT STARTED';
  };

  const getStatusColor = () => {
    if (isComplete) return 'text-green-400';
    if (completionPercent > 0) return 'text-yellow-400';
    return 'text-gray-500';
  };

  return (
    <section
      ref={sectionRef}
      className={`
        relative min-h-[500px] py-16 px-4 md:px-8
        bg-gradient-to-br ${gradient}
        border-t border-gray-800/50
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        ${getOpacityClass()}
      `}
    >
      {/* Character name badge */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${color}20`, borderColor: `${color}50`, borderWidth: 1 }}
        >
          {icon}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500">{name}</div>
          <div className="text-lg font-bold text-white">{title}</div>
        </div>
      </div>

      {/* Status badge */}
      <div className="absolute top-6 right-6">
        <div className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusLabel()}
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 3D Character */}
          <div className="relative h-[350px] md:h-[400px]">
            <CharacterModel
              animation={animation}
              color={color}
              isComplete={isComplete}
              completionPercent={completionPercent}
            />
          </div>

          {/* Profile Data */}
          <div className="space-y-6">
            {/* Subtitle */}
            <div className="text-xl text-gray-400 italic">&ldquo;{subtitle}&rdquo;</div>

            {/* Profile content (passed as children) */}
            <div className="space-y-4">
              {children}
            </div>

            {/* Progress bar */}
            <div className="pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Completion</span>
                <span style={{ color }}>{completionPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${completionPercent}%`,
                    backgroundColor: color,
                    boxShadow: isComplete ? `0 0 10px ${color}` : 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion celebration overlay */}
      {isComplete && isVisible && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 30% 50%, ${color}40 0%, transparent 50%)`,
            }}
          />
        </div>
      )}
    </section>
  );
}

// Profile data item component for consistent styling
interface ProfileItemProps {
  label: string;
  value: string | string[] | null | undefined;
  color: string;
  isComplete?: boolean;
}

export function ProfileItem({ label, value, color, isComplete }: ProfileItemProps) {
  const hasValue = value && (Array.isArray(value) ? value.length > 0 : true);

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-2 h-2 rounded-full mt-2 ${hasValue ? '' : 'opacity-30'}`}
        style={{ backgroundColor: hasValue ? color : '#6b7280' }}
      />
      <div className="flex-1">
        <div className="text-sm text-gray-500">{label}</div>
        {hasValue ? (
          Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {value.map((v, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm rounded-full border"
                  style={{
                    backgroundColor: `${color}20`,
                    borderColor: `${color}50`,
                    color: color,
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-white font-medium flex items-center gap-2">
              {value}
              {isComplete && <span className="text-green-400">✓</span>}
            </div>
          )
        ) : (
          <div className="text-gray-600 italic">Not set</div>
        )}
      </div>
    </div>
  );
}

// Skills display component
interface SkillsDisplayProps {
  skills: Array<{ value: string; metadata?: Record<string, unknown> }>;
  color: string;
  minRequired: number;
}

export function SkillsDisplay({ skills, color, minRequired }: SkillsDisplayProps) {
  const hasEnough = skills.length >= minRequired;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">Skills</span>
        <span className={`text-xs ${hasEnough ? 'text-green-400' : 'text-yellow-400'}`}>
          {skills.length}/{minRequired} required
        </span>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm rounded-full border"
              style={{
                backgroundColor: `${color}20`,
                borderColor: `${color}50`,
                color: color,
              }}
            >
              {skill.value}
              {skill.metadata?.proficiency && (
                <span className="ml-1 opacity-60">
                  ({String(skill.metadata.proficiency)})
                </span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-gray-600 italic">No skills added yet</div>
      )}
    </div>
  );
}
