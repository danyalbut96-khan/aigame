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
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5ff]" />
        <span className="text-sm font-orbitron font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_5px_rgba(0,245,255,0.5)]">
          Describe Your Scene
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="A castle on a hill surrounded by enemy soldiers, with a moat and drawbridge, stormy sky and dramatic lighting..."
          disabled={isLoading}
          rows={6}
          className="w-full bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl px-5 py-4 text-sm font-mono text-cyan-50 placeholder-cyan-800 resize-none focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(0,245,255,0.25)] transition-all duration-300 disabled:opacity-50 scrollbar-thin"
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
        className="generate-btn w-full py-3 font-orbitron font-bold tracking-widest text-sm uppercase relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="hex-loader" />
            <span className="typing-dots">GENERATING</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>✨</span>
            <span>Generate Scene</span>
          </span>
        )}
        <div className="btn-ripple" />
      </button>

      <p className="text-xs font-mono text-cyan-800 text-center">Ctrl+Enter to generate</p>

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
              className="preset-btn text-xs font-mono py-3 px-4 text-left truncate disabled:opacity-40 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,245,255,0.2)] transition-all"
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
