'use client';

import { useState, useCallback } from 'react';
import ObjectList from './ObjectList';
import type { GeneratedScene } from '@/lib/types';

const PRESETS = [
  {
    id: 'desert',
    label: '🏜️ Desert',
    prompt:
      'A desert level with a stone castle in the center, enemy soldiers scattered around, sand dunes, rocks, and a blazing orange sky with heat fog.',
  },
  {
    id: 'forest',
    label: '🌲 Forest',
    prompt:
      'A mystical forest temple level with ancient stone ruins, tall trees, a player hero at the entrance, and glowing green enemies hiding among the trees.',
  },
  {
    id: 'space',
    label: '🚀 Space',
    prompt:
      'A sci-fi space station level with metallic platforms, a player in a spacesuit, robotic enemy drones floating around, and a dark starry void background.',
  },
  {
    id: 'dungeon',
    label: '⚔️ Dungeon',
    prompt:
      'A dark dungeon level with stone walls, torches (glowing cylinders), a player character, skeleton enemies, treasure chests, and eerie fog.',
  },
];

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  scene: GeneratedScene | null;
  error: string | null;
}

export default function PromptPanel({ onGenerate, isLoading, scene, error }: PromptPanelProps) {
  const [prompt, setPrompt] = useState('');
  const MAX_CHARS = 500;

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  }, [prompt, isLoading, onGenerate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate();
    },
    [handleGenerate]
  );

  const handlePreset = useCallback((p: string) => {
    setPrompt(p);
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Section title */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold tracking-wide text-[var(--text-main)]">
          Prompt
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Generate a single horse asset, or a complete dungeon scene..."
          disabled={isLoading}
          rows={6}
          className="w-full bg-[var(--bg-color)] border border-[var(--panel-border)] rounded-md px-4 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50 scrollbar-thin shadow-inner"
        />
        <div
          className={`absolute bottom-3 right-3 text-xs font-mono ${
            prompt.length > MAX_CHARS * 0.9 ? 'text-orange-400' : 'text-cyan-700'
          }`}
        >
          {prompt.length}/{MAX_CHARS}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isLoading}
        className="generate-btn w-full py-2.5 font-bold tracking-wide text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
      >
        {isLoading ? (
          <>
            <span className="hex-loader" />
            <span className="typing-dots">Generating</span>
          </>
        ) : (
          <span>Generate</span>
        )}
      </button>

      <p className="text-xs text-[var(--text-muted)] text-center mt-1">Ctrl+Enter to execute</p>

      {/* Error */}
      {error && (
        <div className="border border-orange-500/40 bg-orange-500/10 rounded-lg px-3 py-2 text-xs font-mono text-orange-400">
          ⚠️ {error}
        </div>
      )}

      {/* Quick Presets */}
      <div className="space-y-2">
        <span className="text-xs font-mono tracking-widest text-cyan-500/50 uppercase">
          Quick Presets
        </span>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePreset(p.prompt)}
              disabled={isLoading}
              className="preset-btn text-xs py-2 px-3 text-left truncate disabled:opacity-40"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Object List */}
      {scene?.scene?.objects && <ObjectList objects={scene.scene.objects} />}
    </div>
  );
}
