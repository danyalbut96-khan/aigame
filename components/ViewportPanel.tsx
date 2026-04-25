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
      <div className="relative flex-1 rounded-xl border border-cyan-500/30 overflow-hidden viewport-glow">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="hex-spinner" />
            <p className="mt-4 font-orbitron text-sm text-cyan-400 tracking-widest animate-pulse">
              BUILDING WORLD...
            </p>
            <p className="mt-1 text-xs font-mono text-cyan-600">Querying Claude AI</p>
          </div>
        )}

        {/* Empty state */}
        {!scene && !isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-cyan-500/20 font-orbitron text-lg tracking-widest animate-pulse">
              AWAITING SCENE DATA...
            </div>
            <p className="mt-2 text-xs font-mono text-cyan-700">
              Describe a scene and click Generate
            </p>
          </div>
        )}

        {/* Three.js Renderer */}
        <div className={`w-full h-full transition-opacity duration-700 ${scene ? 'opacity-100' : 'opacity-40'}`} style={{ minHeight: '450px' }}>
          <SceneRenderer scene={scene} onReady={handleRendererReady} />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-cyan-400/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cyan-400/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-400/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-400/60 pointer-events-none" />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs font-mono text-cyan-700 px-1">
        <div className="flex items-center gap-3">
          {objectCount > 0 && (
            <span className="text-cyan-500/70">
              Objects in scene: <span className="text-cyan-400">{objectCount}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-cyan-800">
          <span>🖱 Drag: rotate</span>
          <span>🔍 Scroll: zoom</span>
          <span>⇧ Right-click: pan</span>
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
