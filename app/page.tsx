'use client';

import { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import PromptPanel from '@/components/PromptPanel';
import ViewportPanel from '@/components/ViewportPanel';
import type { GeneratedScene } from '@/lib/types';

export default function Home() {
  const [scene, setScene] = useState<GeneratedScene | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPromptRef = useRef<string>('');

  const generateScene = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    lastPromptRef.current = prompt;

    try {
      const res = await fetch('/api/generate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate scene');
      }

      setScene(data as GeneratedScene);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error occurred';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (lastPromptRef.current) {
      generateScene(lastPromptRef.current);
    }
  }, [generateScene]);

  return (
    <div className="min-h-screen flex flex-col bg-game-bg cursor-crosshair">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      <Header />

      <main className="flex-1 relative z-10 max-w-screen-2xl mx-auto w-full px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* Left panel */}
        <div className="w-full lg:w-[30%] panel-glass rounded-xl p-4 slide-in-bottom" style={{ animationDelay: '0.1s' }}>
          <PromptPanel
            onGenerate={generateScene}
            isLoading={isLoading}
            scene={scene}
            error={error}
          />
        </div>

        {/* Right panel */}
        <div className="flex-1 panel-glass rounded-xl p-4 slide-in-bottom" style={{ animationDelay: '0.2s' }}>
          <ViewportPanel
            scene={scene}
            isLoading={isLoading}
            onRegenerate={handleRegenerate}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-cyan-500/40 font-mono border-t border-cyan-500/10">
        Made with ❤️ by{' '}
        <a
          href="https://cloudexify.site"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Cloudexify
        </a>
      </footer>
    </div>
  );
}
