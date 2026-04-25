'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import ExportBar from './ExportBar';
import type { GeneratedScene } from '@/lib/types';

const SceneRenderer = dynamic(() => import('./SceneRenderer'), { ssr: false });

interface ViewportPanelProps {
  scene: GeneratedScene | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

export default function ViewportPanel({ scene, isLoading, onRegenerate }: ViewportPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleRendererReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };

  const objectCount = scene?.scene?.objects?.length ?? 0;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Viewport container */}
      <div className="relative flex-1 rounded-md border border-[var(--panel-border)] overflow-hidden bg-[var(--bg-color)]">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--bg-color)]/80 backdrop-blur-sm">
            <div className="hex-spinner" />
            <p className="mt-4 font-bold text-sm text-[var(--text-main)] tracking-widest animate-pulse">
              LOADING ASSETS...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!scene && !isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[var(--text-muted)] font-bold text-lg tracking-wide opacity-50">
              NO SCENE DATA
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)] opacity-60">
              Describe an asset or scene to begin
            </p>
          </div>
        )}

        {/* Three.js Renderer */}
        <div className={`w-full h-full transition-opacity duration-700 ${scene ? 'opacity-100' : 'opacity-40'}`} style={{ minHeight: '450px' }}>
          <SceneRenderer scene={scene} onReady={handleRendererReady} />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
        <div className="flex items-center gap-3">
          {objectCount > 0 && (
            <span>
              Objects: <span className="text-[var(--text-main)]">{objectCount}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>🖱 Select/Orbit</span>
          <span>T: Move | R: Rotate | S: Scale</span>
        </div>
      </div>

      {/* Export bar */}
      <ExportBar
        scene={scene}
        canvasRef={canvasRef}
        onRegenerate={onRegenerate}
        isLoading={isLoading}
      />
    </div>
  );
}
