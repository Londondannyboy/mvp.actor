'use client';

/**
 * Trinity Skills Graph - 3D constellation of user's skills
 * Shows skills as nodes connected by category/relationship
 */

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-purple-900/20 rounded-xl">
      <div className="text-purple-400 animate-pulse">Loading Skills Graph...</div>
    </div>
  ),
});

interface Skill {
  value: string;
  metadata?: {
    proficiency?: string;
    category?: string;
  };
}

interface TrinitySkillsGraphProps {
  skills: Skill[];
  careerGoal?: string;
  className?: string;
}

// Skill category mappings for creating connections
const SKILL_CATEGORIES: Record<string, string[]> = {
  programming: ['python', 'javascript', 'typescript', 'java', 'c++', 'rust', 'go', 'react', 'node', 'sql'],
  marketing: ['marketing', 'social media', 'content', 'brand', 'seo', 'analytics', 'campaign'],
  design: ['design', 'ui', 'ux', 'photoshop', 'figma', 'illustrator', 'creative'],
  production: ['video', 'editing', 'premiere', 'streaming', 'obs', 'broadcast', 'production'],
  management: ['management', 'leadership', 'project', 'team', 'strategy', 'operations'],
  gaming: ['esports', 'gaming', 'coaching', 'analysis', 'tournament', 'league'],
  communication: ['communication', 'writing', 'presentation', 'public speaking'],
};

function getSkillCategory(skill: string): string {
  const lower = skill.toLowerCase();
  for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category;
    }
  }
  return 'general';
}

const CATEGORY_COLORS: Record<string, string> = {
  programming: '#22d3ee', // cyan
  marketing: '#a855f7',   // purple
  design: '#f472b6',      // pink
  production: '#fb923c',  // orange
  management: '#3b82f6',  // blue
  gaming: '#22c55e',      // green
  communication: '#eab308', // yellow
  general: '#94a3b8',     // gray
};

export function TrinitySkillsGraph({ skills, careerGoal, className = '' }: TrinitySkillsGraphProps) {
  const graphData = useMemo(() => {
    if (!skills || skills.length === 0) {
      return { nodes: [], links: [] };
    }

    const nodes: Array<{
      id: string;
      name: string;
      type: string;
      color: string;
      val: number;
    }> = [];

    const links: Array<{ source: string; target: string }> = [];

    // Add center "Trinity" node
    nodes.push({
      id: 'trinity',
      name: 'Trinity',
      type: 'center',
      color: '#a855f7',
      val: 3,
    });

    // Add career goal if present
    if (careerGoal) {
      nodes.push({
        id: 'goal',
        name: careerGoal,
        type: 'goal',
        color: '#ffd700',
        val: 2,
      });
      links.push({ source: 'trinity', target: 'goal' });
    }

    // Add skill nodes
    skills.forEach((skill, i) => {
      const category = getSkillCategory(skill.value);
      const color = CATEGORY_COLORS[category];

      nodes.push({
        id: `skill_${i}`,
        name: skill.value,
        type: 'skill',
        color,
        val: skill.metadata?.proficiency === 'expert' ? 2 : 1.5,
      });

      // Connect to center
      links.push({ source: 'trinity', target: `skill_${i}` });
    });

    // Connect skills in same category
    for (let i = 0; i < skills.length; i++) {
      const cat1 = getSkillCategory(skills[i].value);
      for (let j = i + 1; j < skills.length; j++) {
        const cat2 = getSkillCategory(skills[j].value);
        if (cat1 === cat2 && cat1 !== 'general') {
          links.push({ source: `skill_${i}`, target: `skill_${j}` });
        }
      }
    }

    return { nodes, links };
  }, [skills, careerGoal]);

  if (!skills || skills.length === 0) {
    return (
      <div className={`bg-purple-900/20 rounded-xl p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">🔮</div>
        <p className="text-purple-300">Add skills to see your Trinity constellation</p>
      </div>
    );
  }

  return (
    <div className={`bg-purple-900/20 rounded-xl overflow-hidden ${className}`}>
      <div className="h-[300px]">
        <ForceGraph3D
          graphData={graphData}
          nodeLabel={(node: object) => {
            const n = node as { name: string; type: string };
            return n.type === 'center' ? 'Your Identity' : n.name;
          }}
          nodeColor={(node: object) => (node as { color: string }).color}
          nodeRelSize={6}
          nodeVal={(node: object) => (node as { val: number }).val}
          linkColor={() => 'rgba(168, 85, 247, 0.3)'}
          linkWidth={1.5}
          backgroundColor="rgba(0, 0, 0, 0)"
          enableNodeDrag={true}
          enableNavigationControls={true}
          showNavInfo={false}
        />
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-purple-500/20">
        <div className="flex flex-wrap gap-3 justify-center text-xs">
          {Object.entries(CATEGORY_COLORS).slice(0, 6).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-400 capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
