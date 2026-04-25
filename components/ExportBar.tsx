'use client';

import { useCallback } from 'react';
import type { GeneratedScene } from '@/lib/types';

interface ExportBarProps {
  scene: GeneratedScene | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onRegenerate: () => void;
  isLoading: boolean;
}

export default function ExportBar({ scene, canvasRef, onRegenerate, isLoading }: ExportBarProps) {
  const handleExportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene_export.png';
    a.click();
  }, [canvasRef]);

  const handleCopyJSON = useCallback(async () => {
    if (!scene) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(scene, null, 2));
      // Brief visual feedback handled via CSS
    } catch {
      const text = JSON.stringify(scene, null, 2);
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }, [scene]);

  return (
    <div className="flex flex-col gap-2 mt-3">
      {scene?.description && (
        <p className="text-xs font-mono text-cyan-400/60 border border-cyan-500/10 rounded px-3 py-2 bg-black/30 leading-relaxed">
          <span className="text-cyan-500/40 mr-2">AI:</span>
          {scene.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleExportPNG}
          disabled={!scene || isLoading}
          className="btn-cyber text-xs px-3 py-2 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>📸</span>
          <span>Export PNG</span>
        </button>

        <button
          onClick={handleCopyJSON}
          disabled={!scene || isLoading}
          className="btn-cyber-secondary text-xs px-3 py-2 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>📋</span>
          <span>Copy JSON</span>
        </button>

        <button
          onClick={onRegenerate}
          disabled={!scene || isLoading}
          className="btn-cyber-ghost text-xs px-3 py-2 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
          <span>Regenerate</span>
        </button>
      </div>
    </div>
  );
}
