'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl">
      <div className="text-cyan-400">Loading 3D Graph...</div>
    </div>
  ),
});

interface GraphNode {
  id: string;
  name: string;
  type: 'user' | 'skill' | 'role' | 'location';
  color: string;
  metadata?: Record<string, unknown>;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface ProfileCompletenessData {
  complete: boolean;
  percent: number;
  skills_count?: number;
  has_location?: boolean;
  has_role?: boolean;
  has_experience?: boolean;
  missing?: string[];
}

interface UserProfileGraphProps {
  graphData?: GraphData;
  completeness?: ProfileCompletenessData;
  onNodeClick?: (node: GraphNode) => void;
  className?: string;
}

// Color mapping for node types
const NODE_COLORS: Record<string, string> = {
  user: '#FFD700',      // Gold for user
  skill: '#A855F7',     // Purple for skills
  role: '#3B82F6',      // Blue for role
  location: '#22C55E',  // Green for location
};

export function UserProfileGraph({
  graphData,
  completeness,
  onNodeClick,
  className = '',
}: UserProfileGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle node hover
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    if (node) {
      setHighlightNodes(new Set([node.id, 'user']));
      setHighlightLinks(new Set([`user-${node.id}`]));
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
    }
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  // Empty state
  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className={`bg-gray-900/80 rounded-xl p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-bold text-white mb-2">Build Your Profile</h3>
        <p className="text-gray-400 mb-4">
          Start by telling the AI about your skills, target role, and preferred location.
        </p>
        <div className="text-sm text-gray-500">
          Try saying: &ldquo;I know Python and JavaScript&rdquo; or &ldquo;I&apos;m looking for marketing roles&rdquo;
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Completeness Badge */}
      {completeness && (
        <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${(completeness.percent / 100) * 125.6} 125.6`}
                  className="text-cyan-400"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {completeness.percent}%
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Profile</div>
              <div className="text-xs text-gray-400">
                {completeness.complete ? 'Complete!' : `Missing: ${completeness.missing?.join(', ')}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-purple-500/30">
        <div className="text-xs font-medium text-gray-400 mb-2">Legend</div>
        <div className="flex flex-col gap-1">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-300 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Force Graph */}
      <div
        ref={containerRef}
        className="w-full h-[500px] bg-gray-900/50 rounded-xl overflow-hidden"
      >
        <ForceGraph3D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel={(node: object) => {
            const n = node as GraphNode;
            return `${n.name} (${n.type})`;
          }}
          nodeColor={(node: object) => {
            const n = node as GraphNode;
            return NODE_COLORS[n.type] || '#888';
          }}
          nodeRelSize={6}
          nodeVal={(node: object) => {
            const n = node as GraphNode;
            return n.type === 'user' ? 2 : 1;
          }}
          linkColor={() => 'rgba(34, 211, 238, 0.3)'}
          linkWidth={2}
          backgroundColor="rgba(0, 0, 0, 0)"
          onNodeClick={(node: object) => handleNodeClick(node as GraphNode)}
          onNodeHover={(node: object | null) => handleNodeHover(node as GraphNode | null)}
          nodeOpacity={0.9}
          linkOpacity={0.5}
          enableNodeDrag={true}
          enableNavigationControls={true}
          showNavInfo={false}
        />
      </div>

      {/* Node Stats */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 z-10">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 flex gap-6">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {graphData.nodes.filter(n => n.type === 'skill').length}
            </div>
            <div className="text-xs text-gray-400">Skills</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {graphData.nodes.filter(n => n.type === 'role').length > 0 ? '1' : '0'}
            </div>
            <div className="text-xs text-gray-400">Role</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {graphData.nodes.filter(n => n.type === 'location').length > 0 ? '1' : '0'}
            </div>
            <div className="text-xs text-gray-400">Location</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// List view alternative for simpler display
export function ProfileItemsList({
  graphData,
  completeness,
  onDeleteItem,
}: {
  graphData?: GraphData;
  completeness?: ProfileCompletenessData;
  onDeleteItem?: (type: string, value: string) => void;
}) {
  if (!graphData || graphData.nodes.length <= 1) {
    return (
      <div className="bg-gray-900/80 rounded-xl p-6 text-center">
        <p className="text-gray-400">No profile data yet. Start by telling the AI about yourself!</p>
      </div>
    );
  }

  const skills = graphData.nodes.filter(n => n.type === 'skill');
  const roles = graphData.nodes.filter(n => n.type === 'role');
  const locations = graphData.nodes.filter(n => n.type === 'location');

  return (
    <div className="bg-gray-900/80 rounded-xl p-6 space-y-6">
      {/* Progress Bar */}
      {completeness && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Profile Completeness</span>
            <span className="text-cyan-400 font-medium">{completeness.percent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style={{ width: `${completeness.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Skills */}
      <div>
        <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          Skills ({skills.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <div
              key={skill.id}
              className="group flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1"
            >
              <span className="text-sm text-white">{skill.name}</span>
              {skill.metadata?.proficiency && (
                <span className="text-xs text-purple-300">
                  ({skill.metadata.proficiency as string})
                </span>
              )}
              {onDeleteItem && (
                <button
                  onClick={() => onDeleteItem('skill', skill.name)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {skills.length === 0 && (
            <span className="text-sm text-gray-500 italic">No skills added yet</span>
          )}
        </div>
      </div>

      {/* Target Role */}
      <div>
        <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          Target Role
        </h4>
        {roles.length > 0 ? (
          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2 inline-block">
            <span className="text-white">{roles[0].name}</span>
            {onDeleteItem && (
              <button
                onClick={() => onDeleteItem('role', roles[0].name)}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 italic">No target role set</span>
        )}
      </div>

      {/* Location */}
      <div>
        <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Preferred Location
        </h4>
        {locations.length > 0 ? (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 inline-block">
            <span className="text-white">{locations[0].name}</span>
            {locations[0].metadata?.remote_ok && (
              <span className="text-xs text-green-300">(Remote OK)</span>
            )}
            {onDeleteItem && (
              <button
                onClick={() => onDeleteItem('location', locations[0].name)}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 italic">No location preference set</span>
        )}
      </div>
    </div>
  );
}
