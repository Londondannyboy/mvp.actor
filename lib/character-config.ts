// Character configuration for the 4-character profile experience
// Repo, Trinity, Velo, Reach

export type CharacterName = 'Repo' | 'Trinity' | 'Velo' | 'Reach';
export type AnimationType = 'Idle' | 'Walk' | 'Run';

export interface CharacterConfig {
  name: CharacterName;
  title: string;
  subtitle: string;
  icon: string;
  animation: AnimationType;
  color: string;
  colorRGB: string; // For Three.js
  gradient: string; // CSS gradient
  profileFields: string[];
  requiredFields: string[];
  minItems?: number; // For arrays like skills
  weight: number; // Contribution to overall completion
}

export const CHARACTERS: CharacterConfig[] = [
  {
    name: 'Repo',
    title: 'Your Foundation',
    subtitle: 'Where are you?',
    icon: '🏛️',
    animation: 'Idle',
    color: '#22d3ee',
    colorRGB: 'rgb(34, 211, 238)',
    gradient: 'from-cyan-500/20 to-cyan-900/20',
    profileFields: ['location', 'role'],
    requiredFields: ['location', 'role'],
    weight: 25,
  },
  {
    name: 'Trinity',
    title: 'Your Identity',
    subtitle: 'Who are you?',
    icon: '🔮',
    animation: 'Walk',
    color: '#a855f7',
    colorRGB: 'rgb(168, 85, 247)',
    gradient: 'from-purple-500/20 to-purple-900/20',
    profileFields: ['skill', 'career_goal'],
    requiredFields: ['skill'],
    minItems: 2, // Need at least 2 skills
    weight: 35,
  },
  {
    name: 'Velo',
    title: 'Your Velocity',
    subtitle: 'How fast are you moving?',
    icon: '🚀',
    animation: 'Run',
    color: '#ff00aa',
    colorRGB: 'rgb(255, 0, 170)',
    gradient: 'from-pink-500/20 to-pink-900/20',
    profileFields: ['experience_years', 'career_history'],
    requiredFields: ['experience_years'],
    weight: 20,
  },
  {
    name: 'Reach',
    title: 'Your Network',
    subtitle: 'How far can you go?',
    icon: '🌐',
    animation: 'Walk',
    color: '#ffd700',
    colorRGB: 'rgb(255, 215, 0)',
    gradient: 'from-yellow-500/20 to-yellow-900/20',
    profileFields: ['saved_jobs', 'network_visibility'],
    requiredFields: [], // Optional - always "complete"
    weight: 20,
  },
];

export interface ProfileItems {
  skill?: Array<{ value: string; metadata?: Record<string, unknown> }>;
  role?: Array<{ value: string }>;
  location?: Array<{ value: string; metadata?: Record<string, unknown> }>;
  experience_years?: Array<{ value: string }>;
  career_goal?: Array<{ value: string }>;
  career_history?: Array<{ value: string }>;
  saved_jobs?: Array<{ value: string }>;
  network_visibility?: Array<{ value: string }>;
}

export interface CharacterCompletion {
  name: CharacterName;
  isComplete: boolean;
  percent: number;
  data: Record<string, unknown>;
  missing: string[];
}

/**
 * Calculate completion status for a specific character
 */
export function getCharacterCompletion(
  character: CharacterConfig,
  items: ProfileItems
): CharacterCompletion {
  const data: Record<string, unknown> = {};
  const missing: string[] = [];
  let completedRequirements = 0;
  let totalRequirements = character.requiredFields.length;

  // Handle optional characters (like Reach)
  if (totalRequirements === 0) {
    // Collect any data that exists for this character
    for (const field of character.profileFields) {
      const fieldData = items[field as keyof ProfileItems];
      if (fieldData && fieldData.length > 0) {
        data[field] = fieldData;
      }
    }
    return {
      name: character.name,
      isComplete: true,
      percent: 100,
      data,
      missing: [],
    };
  }

  // Check each required field
  for (const field of character.requiredFields) {
    const fieldData = items[field as keyof ProfileItems];

    if (field === 'skill' && character.minItems) {
      // Special handling for skills that need minimum count
      const skillCount = fieldData?.length || 0;
      data.skills = fieldData || [];
      data.skillCount = skillCount;

      if (skillCount >= character.minItems) {
        completedRequirements++;
      } else {
        missing.push(`${character.minItems - skillCount} more skill${character.minItems - skillCount > 1 ? 's' : ''}`);
      }
    } else if (fieldData && fieldData.length > 0) {
      data[field] = fieldData[0]?.value;
      completedRequirements++;
    } else {
      missing.push(field);
    }
  }

  // Also collect non-required field data
  for (const field of character.profileFields) {
    if (!character.requiredFields.includes(field)) {
      const fieldData = items[field as keyof ProfileItems];
      if (fieldData && fieldData.length > 0) {
        data[field] = fieldData;
      }
    }
  }

  const percent = Math.round((completedRequirements / totalRequirements) * 100);

  return {
    name: character.name,
    isComplete: percent === 100,
    percent,
    data,
    missing,
  };
}

/**
 * Calculate completion for all characters
 */
export function getAllCharacterCompletions(items: ProfileItems): CharacterCompletion[] {
  return CHARACTERS.map(char => getCharacterCompletion(char, items));
}

/**
 * Calculate overall profile completion percentage
 */
export function getOverallCompletion(items: ProfileItems): number {
  const completions = getAllCharacterCompletions(items);

  let totalWeight = 0;
  let weightedSum = 0;

  for (let i = 0; i < CHARACTERS.length; i++) {
    const weight = CHARACTERS[i].weight;
    totalWeight += weight;
    weightedSum += (completions[i].percent / 100) * weight;
  }

  return Math.round((weightedSum / totalWeight) * 100);
}

/**
 * Get the next incomplete character for onboarding guidance
 */
export function getNextIncompleteCharacter(items: ProfileItems): CharacterConfig | null {
  const completions = getAllCharacterCompletions(items);

  for (let i = 0; i < completions.length; i++) {
    if (!completions[i].isComplete) {
      return CHARACTERS[i];
    }
  }

  return null; // All complete
}

/**
 * Get celebration message when a character is completed
 */
export function getCompletionMessage(character: CharacterName): string {
  const messages: Record<CharacterName, string> = {
    Repo: "Repo is set - your foundation is solid!",
    Trinity: "Trinity unlocked - I know your strengths!",
    Velo: "Velo activated - your momentum is clear!",
    Reach: "Reach expanded - you're connected!",
  };
  return messages[character];
}

/**
 * Get all characters complete celebration message
 */
export function getAllCompleteMessage(): string {
  return "All characters unlocked! You're ready to find your perfect role!";
}
