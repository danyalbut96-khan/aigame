'use client';

import { useState, useCallback } from 'react';
import type { SceneObject } from '@/lib/types';

interface ObjectListProps {
  objects: SceneObject[];
}

const TYPE_COLORS: Record<string, string> = {
  castle: '#ffd700',
  enemy: '#ff4444',
  player: '#00f5ff',
  tree: '#39ff14',
  rock: '#888888',
  plane: '#888855',
  sphere: '#aa44ff',
  cylinder: '#4488ff',
  cone: '#ff8844',
  box: '#aaaaaa',
};

const TYPE_ICONS: Record<string, string> = {
  castle: '🏰',
  enemy: '👾',
  player: '🧙',
  tree: '🌲',
  rock: '🪨',
  plane: '📐',
  sphere: '⚽',
  cylinder: '🔵',
  cone: '🔺',
  box: '📦',
};

export default function ObjectList({ objects }: ObjectListProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = useCallback(() => setExpanded((e) => !e), []);

  if (!objects.length) return null;

  const grouped = objects.reduce(
    (acc, obj) => {
      acc[obj.type] = (acc[obj.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mt-4 border border-cyan-500/20 rounded-lg overflow-hidden bg-black/40">
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-cyan-400/80 hover:bg-cyan-500/5 transition-colors"
      >
        <span className="tracking-widest uppercase">Scene Objects</span>
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs">
            {objects.length}
          </span>
          <span className="text-cyan-500/40">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="divide-y divide-cyan-500/10 max-h-48 overflow-y-auto scrollbar-thin">
          {/* Summary badges */}
          <div className="px-3 py-2 flex flex-wrap gap-1">
            {Object.entries(grouped).map(([type, count]) => (
              <span
                key={type}
                className="text-xs font-mono px-2 py-0.5 rounded-full border"
                style={{
                  borderColor: TYPE_COLORS[type] + '40',
                  color: TYPE_COLORS[type] || '#aaa',
                  backgroundColor: TYPE_COLORS[type] + '10',
                }}
              >
                {TYPE_ICONS[type] || '●'} {type} ×{count}
              </span>
            ))}
          </div>

          {/* Object list */}
          {objects.map((obj, i) => (
            <div
              key={obj.id}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-cyan-500/5 transition-colors"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 border"
                style={{
                  backgroundColor: obj.color,
                  borderColor: obj.color + '80',
                  boxShadow: `0 0 4px ${obj.color}60`,
                }}
              />
              <span className="text-xs font-mono text-cyan-300/80 flex-1 truncate">
                {obj.label}
              </span>
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{
                  color: TYPE_COLORS[obj.type] || '#aaa',
                  backgroundColor: (TYPE_COLORS[obj.type] || '#aaa') + '15',
                }}
              >
                {obj.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
