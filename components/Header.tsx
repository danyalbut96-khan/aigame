'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGlitch(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative z-10 border-b border-cyan-500/20 bg-black/60 backdrop-blur-sm">
      <div className="scanline-overlay absolute inset-0 pointer-events-none" />
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-cyan-400 rotate-45 flex items-center justify-center animate-pulse-slow">
              <div className="w-3 h-3 bg-cyan-400 rotate-45" />
            </div>
          </div>
          <h1
            className={`text-xl font-orbitron font-black tracking-widest text-cyan-400 uppercase select-none ${
              glitch ? 'glitch-text' : 'opacity-0'
            }`}
            data-text="AI GAME SCENE BUILDER"
          >
            AI GAME SCENE BUILDER
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-500/60">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="text-xs font-mono text-cyan-500/40 border border-cyan-500/20 px-2 py-1 rounded">
            v1.0.0
          </div>
        </div>
      </div>
    </header>
  );
}
