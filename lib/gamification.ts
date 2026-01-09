// Gamification system for the profile experience
// XP, Levels, Achievements, and Character Dialogue

import { ProfileItems, getAllCharacterCompletions, getOverallCompletion, CharacterName } from './character-config';

// ============================================
// XP & LEVEL SYSTEM
// ============================================

export interface XPBreakdown {
  total: number;
  breakdown: {
    category: string;
    xp: number;
    description: string;
  }[];
}

export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Newcomer', minXP: 0, maxXP: 99, color: '#6b7280', icon: '🌱' },
  { level: 2, title: 'Explorer', minXP: 100, maxXP: 249, color: '#22c55e', icon: '🔍' },
  { level: 3, title: 'Contender', minXP: 250, maxXP: 449, color: '#3b82f6', icon: '⚔️' },
  { level: 4, title: 'Challenger', minXP: 450, maxXP: 699, color: '#8b5cf6', icon: '🏆' },
  { level: 5, title: 'Pro Player', minXP: 700, maxXP: 999, color: '#f59e0b', icon: '⭐' },
  { level: 6, title: 'Elite', minXP: 1000, maxXP: 1349, color: '#ef4444', icon: '💎' },
  { level: 7, title: 'Legend', minXP: 1350, maxXP: 1749, color: '#ec4899', icon: '👑' },
  { level: 8, title: 'MVP', minXP: 1750, maxXP: Infinity, color: '#ffd700', icon: '🌟' },
];

export function calculateXP(
  items: ProfileItems,
  savedJobsCount: number = 0,
  assessmentsCount: number = 0
): XPBreakdown {
  const breakdown: XPBreakdown['breakdown'] = [];
  let total = 0;

  // Base XP for having a profile
  breakdown.push({ category: 'Account Created', xp: 50, description: 'Welcome bonus' });
  total += 50;

  // Location (50 XP)
  if (items.location && items.location.length > 0) {
    breakdown.push({ category: 'Location Set', xp: 50, description: 'Foundation established' });
    total += 50;
  }

  // Role (75 XP)
  if (items.role && items.role.length > 0) {
    breakdown.push({ category: 'Target Role', xp: 75, description: 'Direction defined' });
    total += 75;
  }

  // Skills (50 XP each, max 250)
  const skillCount = items.skill?.length || 0;
  if (skillCount > 0) {
    const skillXP = Math.min(skillCount * 50, 250);
    breakdown.push({
      category: 'Skills',
      xp: skillXP,
      description: `${skillCount} skill${skillCount > 1 ? 's' : ''} added`
    });
    total += skillXP;
  }

  // Career Goal (100 XP)
  if (items.career_goal && items.career_goal.length > 0) {
    breakdown.push({ category: 'Career Goal', xp: 100, description: 'Vision articulated' });
    total += 100;
  }

  // Experience Years (75 XP)
  if (items.experience_years && items.experience_years.length > 0) {
    breakdown.push({ category: 'Experience', xp: 75, description: 'Journey tracked' });
    total += 75;
  }

  // Career History (25 XP each, max 100)
  const historyCount = items.career_history?.length || 0;
  if (historyCount > 0) {
    const historyXP = Math.min(historyCount * 25, 100);
    breakdown.push({
      category: 'Career History',
      xp: historyXP,
      description: `${historyCount} milestone${historyCount > 1 ? 's' : ''} recorded`
    });
    total += historyXP;
  }

  // Saved Jobs (20 XP each, max 200)
  if (savedJobsCount > 0) {
    const savedXP = Math.min(savedJobsCount * 20, 200);
    breakdown.push({
      category: 'Saved Jobs',
      xp: savedXP,
      description: `${savedJobsCount} job${savedJobsCount > 1 ? 's' : ''} saved`
    });
    total += savedXP;
  }

  // Assessments (50 XP each, max 250)
  if (assessmentsCount > 0) {
    const assessXP = Math.min(assessmentsCount * 50, 250);
    breakdown.push({
      category: 'Job Assessments',
      xp: assessXP,
      description: `${assessmentsCount} job${assessmentsCount > 1 ? 's' : ''} assessed`
    });
    total += assessXP;
  }

  // Character Completion Bonuses
  const completions = getAllCharacterCompletions(items);
  for (const comp of completions) {
    if (comp.isComplete && comp.name !== 'Reach') { // Reach is always complete
      breakdown.push({
        category: `${comp.name} Complete`,
        xp: 100,
        description: `Character unlocked!`
      });
      total += 100;
    }
  }

  // Full Profile Bonus
  const overall = getOverallCompletion(items);
  if (overall === 100) {
    breakdown.push({ category: 'Full Profile', xp: 200, description: 'All characters unlocked!' });
    total += 200;
  }

  return { total, breakdown };
}

export function getLevel(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevel(xp);
  const nextLevel = LEVELS.find(l => l.level === level.level + 1);

  if (!nextLevel) {
    return { current: xp - level.minXP, needed: 0, percent: 100 };
  }

  const current = xp - level.minXP;
  const needed = nextLevel.minXP - level.minXP;
  const percent = Math.round((current / needed) * 100);

  return { current, needed, percent };
}

// ============================================
// ACHIEVEMENTS SYSTEM
// ============================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  color: string;
  check: (items: ProfileItems, savedJobsCount: number, assessmentsCount: number) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Profile Achievements
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Set your location',
    icon: '👣',
    rarity: 'common',
    color: '#6b7280',
    check: (items) => (items.location?.length || 0) > 0,
  },
  {
    id: 'goal_setter',
    name: 'Goal Setter',
    description: 'Define your target role',
    icon: '🎯',
    rarity: 'common',
    color: '#6b7280',
    check: (items) => (items.role?.length || 0) > 0,
  },
  {
    id: 'skill_collector',
    name: 'Skill Collector',
    description: 'Add 3 skills to your profile',
    icon: '🧩',
    rarity: 'uncommon',
    color: '#22c55e',
    check: (items) => (items.skill?.length || 0) >= 3,
  },
  {
    id: 'skill_master',
    name: 'Skill Master',
    description: 'Add 5 skills to your profile',
    icon: '🎭',
    rarity: 'rare',
    color: '#3b82f6',
    check: (items) => (items.skill?.length || 0) >= 5,
  },
  {
    id: 'visionary',
    name: 'Visionary',
    description: 'Set a career goal',
    icon: '🔮',
    rarity: 'uncommon',
    color: '#22c55e',
    check: (items) => (items.career_goal?.length || 0) > 0,
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Have 5+ years experience',
    icon: '🎖️',
    rarity: 'rare',
    color: '#3b82f6',
    check: (items) => parseInt(items.experience_years?.[0]?.value || '0') >= 5,
  },

  // Character Achievements
  {
    id: 'repo_unlocked',
    name: 'Foundation Solid',
    description: 'Complete the Repo character',
    icon: '🏛️',
    rarity: 'uncommon',
    color: '#22d3ee',
    check: (items) => {
      const completions = getAllCharacterCompletions(items);
      return completions.find(c => c.name === 'Repo')?.isComplete || false;
    },
  },
  {
    id: 'trinity_unlocked',
    name: 'Identity Revealed',
    description: 'Complete the Trinity character',
    icon: '🔮',
    rarity: 'rare',
    color: '#a855f7',
    check: (items) => {
      const completions = getAllCharacterCompletions(items);
      return completions.find(c => c.name === 'Trinity')?.isComplete || false;
    },
  },
  {
    id: 'velo_unlocked',
    name: 'Momentum Building',
    description: 'Complete the Velo character',
    icon: '🚀',
    rarity: 'rare',
    color: '#ff00aa',
    check: (items) => {
      const completions = getAllCharacterCompletions(items);
      return completions.find(c => c.name === 'Velo')?.isComplete || false;
    },
  },
  {
    id: 'all_characters',
    name: 'Full Squad',
    description: 'Unlock all 4 characters',
    icon: '👑',
    rarity: 'epic',
    color: '#f59e0b',
    check: (items) => getOverallCompletion(items) === 100,
  },

  // Activity Achievements
  {
    id: 'job_hunter',
    name: 'Job Hunter',
    description: 'Save your first job',
    icon: '📌',
    rarity: 'common',
    color: '#6b7280',
    check: (_, savedJobsCount) => savedJobsCount >= 1,
  },
  {
    id: 'opportunity_seeker',
    name: 'Opportunity Seeker',
    description: 'Save 5 jobs',
    icon: '🔍',
    rarity: 'uncommon',
    color: '#22c55e',
    check: (_, savedJobsCount) => savedJobsCount >= 5,
  },
  {
    id: 'strategic_player',
    name: 'Strategic Player',
    description: 'Complete 3 job assessments',
    icon: '📊',
    rarity: 'rare',
    color: '#3b82f6',
    check: (_, __, assessmentsCount) => assessmentsCount >= 3,
  },
  {
    id: 'market_analyst',
    name: 'Market Analyst',
    description: 'Complete 10 job assessments',
    icon: '📈',
    rarity: 'epic',
    color: '#f59e0b',
    check: (_, __, assessmentsCount) => assessmentsCount >= 10,
  },

  // Legendary
  {
    id: 'mvp',
    name: 'MVP',
    description: 'Reach Level 8',
    icon: '🌟',
    rarity: 'legendary',
    color: '#ffd700',
    check: (items, savedJobsCount, assessmentsCount) => {
      const xp = calculateXP(items, savedJobsCount, assessmentsCount).total;
      return getLevel(xp).level >= 8;
    },
  },
];

export function getUnlockedAchievements(
  items: ProfileItems,
  savedJobsCount: number = 0,
  assessmentsCount: number = 0
): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.check(items, savedJobsCount, assessmentsCount));
}

export function getLockedAchievements(
  items: ProfileItems,
  savedJobsCount: number = 0,
  assessmentsCount: number = 0
): Achievement[] {
  return ACHIEVEMENTS.filter(a => !a.check(items, savedJobsCount, assessmentsCount));
}

// ============================================
// CHARACTER DIALOGUE SYSTEM
// ============================================

export interface CharacterDialogue {
  character: CharacterName;
  messages: {
    condition: 'empty' | 'partial' | 'complete' | 'default';
    text: string;
  }[];
}

export const CHARACTER_DIALOGUES: CharacterDialogue[] = [
  {
    character: 'Repo',
    messages: [
      { condition: 'empty', text: "Where in the world are you? Let's establish your base of operations!" },
      { condition: 'partial', text: "Good start! Now tell me what role you're targeting..." },
      { condition: 'complete', text: "Your foundation is SOLID. I know exactly where you stand!" },
      { condition: 'default', text: "I am Repo, guardian of your foundation." },
    ],
  },
  {
    character: 'Trinity',
    messages: [
      { condition: 'empty', text: "Show me your skills, warrior! What powers do you possess?" },
      { condition: 'partial', text: "Impressive skills! But what's your ultimate goal?" },
      { condition: 'complete', text: "I see your TRUE identity now. Your skills are legendary!" },
      { condition: 'default', text: "I am Trinity, keeper of your identity." },
    ],
  },
  {
    character: 'Velo',
    messages: [
      { condition: 'empty', text: "How long have you been in the game? Your experience matters!" },
      { condition: 'partial', text: "Good momentum! Track your career milestones to boost velocity!" },
      { condition: 'complete', text: "MAXIMUM VELOCITY! Your career trajectory is UNSTOPPABLE!" },
      { condition: 'default', text: "I am Velo, master of momentum." },
    ],
  },
  {
    character: 'Reach',
    messages: [
      { condition: 'empty', text: "Your network is your net worth! Start saving jobs you're interested in." },
      { condition: 'partial', text: "Nice connections! Keep assessing jobs to expand your reach." },
      { condition: 'complete', text: "Your reach extends FAR and WIDE! Opportunities await!" },
      { condition: 'default', text: "I am Reach, architect of your network." },
    ],
  },
];

export function getCharacterDialogue(
  character: CharacterName,
  completionPercent: number,
  isComplete: boolean
): string {
  const dialogue = CHARACTER_DIALOGUES.find(d => d.character === character);
  if (!dialogue) return '';

  let condition: 'empty' | 'partial' | 'complete' | 'default';
  if (isComplete) {
    condition = 'complete';
  } else if (completionPercent === 0) {
    condition = 'empty';
  } else {
    condition = 'partial';
  }

  const message = dialogue.messages.find(m => m.condition === condition);
  return message?.text || dialogue.messages.find(m => m.condition === 'default')?.text || '';
}
