'use client';

/**
 * Reach Network Graph - Saved jobs and opportunities network
 * Shows connections between user and saved jobs/assessments
 */

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-yellow-900/20 rounded-xl">
      <div className="text-yellow-400 animate-pulse">Loading Network Graph...</div>
    </div>
  ),
});

interface SavedJob {
  id: string;
  title: string;
  company: string;
  matchScore?: number;
}

interface ReachNetworkGraphProps {
  savedJobs: SavedJob[];
  assessmentsCount?: number;
  className?: string;
}

export function ReachNetworkGraph({
  savedJobs,
  assessmentsCount = 0,
  className = '',
}: ReachNetworkGraphProps) {
  const graphData = useMemo(() => {
    const nodes: Array<{
      id: string;
      name: string;
      type: string;
      color: string;
      val: number;
    }> = [];

    const links: Array<{ source: string; target: string }> = [];

    // Center node - user's reach
    nodes.push({
      id: 'reach',
      name: 'Your Reach',
      type: 'center',
      color: '#ffd700',
      val: 3,
    });

    // Add opportunity categories
    const categories = [
      { id: 'saved', name: `Saved (${savedJobs.length})`, color: '#22c55e' },
      { id: 'assessed', name: `Assessed (${assessmentsCount})`, color: '#3b82f6' },
      { id: 'explore', name: 'Explore', color: '#94a3b8' },
    ];

    categories.forEach((cat) => {
      nodes.push({
        id: cat.id,
        name: cat.name,
        type: 'category',
        color: cat.color,
        val: 2,
      });
      links.push({ source: 'reach', target: cat.id });
    });

    // Add saved jobs as nodes
    savedJobs.forEach((job, i) => {
      const matchColor = job.matchScore
        ? job.matchScore >= 80 ? '#22c55e'
        : job.matchScore >= 50 ? '#eab308'
        : '#ef4444'
        : '#94a3b8';

      nodes.push({
        id: `job_${i}`,
        name: `${job.title}\n${job.company}`,
        type: 'job',
        color: matchColor,
        val: 1.5,
      });
      links.push({ source: 'saved', target: `job_${i}` });
    });

    return { nodes, links };
  }, [savedJobs, assessmentsCount]);

  if (savedJobs.length === 0 && assessmentsCount === 0) {
    return (
      <div className={`bg-yellow-900/20 rounded-xl p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">🌐</div>
        <p className="text-yellow-300">Save jobs to build your opportunity network</p>
        <p className="text-sm text-gray-500 mt-2">
          Browse jobs and click &ldquo;Assess My Fit&rdquo; to expand your reach
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-yellow-900/20 rounded-xl overflow-hidden ${className}`}>
      <div className="h-[300px]">
        <ForceGraph3D
          graphData={graphData}
          nodeLabel={(node: object) => (node as { name: string }).name}
          nodeColor={(node: object) => (node as { color: string }).color}
          nodeRelSize={6}
          nodeVal={(node: object) => (node as { val: number }).val}
          linkColor={() => 'rgba(255, 215, 0, 0.3)'}
          linkWidth={1.5}
          backgroundColor="rgba(0, 0, 0, 0)"
          enableNodeDrag={true}
          enableNavigationControls={true}
          showNavInfo={false}
        />
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-t border-yellow-500/20 flex justify-center gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{savedJobs.length}</div>
          <div className="text-xs text-gray-400">Saved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{assessmentsCount}</div>
          <div className="text-xs text-gray-400">Assessed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {savedJobs.length + assessmentsCount}
          </div>
          <div className="text-xs text-gray-400">Total Reach</div>
        </div>
      </div>
    </div>
  );
}
