'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-trail-particles`.
 *
 * Mirrors the `typescript` code variant verbatim. A fixed particle pool avoids
 * per-move allocation; one rAF loop decays each dot, and reduced motion opts
 * out. Keep this in step with `src/data/components/cursors.ts`.
 */
interface CursorTrailParticlesProps {
  hint?: string;
  color?: string;
  count?: number;
  className?: string;
}

function CursorTrailParticles({
  hint = 'Drag your pointer across for a comet trail',
  color = 'rgb(59 130 246)',
  count = 16,
  className = '',
}: CursorTrailParticlesProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    const dots: HTMLSpanElement[] = [];
    const xs: number[] = [], ys: number[] = [], lives: number[] = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('span');
      d.style.cssText = 'position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:9999px;opacity:0;background:' + color;
      layer.appendChild(d); dots.push(d); xs.push(0); ys.push(0); lives.push(0);
    }
    let head = 0, raf = 0;
    const loop = (): void => {
      let alive = false;
      for (let i = 0; i < count; i++) {
        const life = lives[i];
        const dot = dots[i];
        if (life === undefined || dot === undefined || life <= 0) continue;
        const next = Math.max(0, life - 0.045);
        lives[i] = next;
        dot.style.opacity = String(next);
        dot.style.transform = 'translate3d(' + xs[i] + 'px,' + ys[i] + 'px,0) scale(' + next + ')';
        alive = true;
      }
      raf = alive ? requestAnimationFrame(loop) : 0;
    };
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      xs[head] = e.clientX - rect.left; ys[head] = e.clientY - rect.top; lives[head] = 1;
      head = (head + 1) % count;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      dots.forEach((d) => d.remove());
    };
  }, [color, count]);

  return (
    <div
      ref={stageRef}
      className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={layerRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}

export const minHeight = 300;

export default function CursorTrailParticlesPreview() {
  return <CursorTrailParticles />;
}
