'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-custom-svg`.
 *
 * Mirrors the `typescript` code variant verbatim. An inline SVG replaces the
 * cursor and tilts toward travel direction; reduced motion keeps it upright.
 * Keep this in step with `src/data/components/cursors.ts`.
 */
interface CursorCustomSvgProps {
  hint?: string;
  className?: string;
}

export function CursorCustomSvg({
  hint = 'A custom SVG pointer that leans into your motion',
  className = '',
}: CursorCustomSvgProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const cur = curRef.current;
    if (!stage || !cur) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rect = stage.getBoundingClientRect();
    let lx = 0, ly = 0, angle = 0;
    const onEnter = (e: PointerEvent): void => {
      rect = stage.getBoundingClientRect();
      lx = e.clientX - rect.left; ly = e.clientY - rect.top; cur.style.opacity = '1';
    };
    const onLeave = (): void => { cur.style.opacity = '0'; };
    const onMove = (e: PointerEvent): void => {
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (!reduce) {
        const dx = x - lx, dy = y - ly;
        if (dx * dx + dy * dy > 4) angle = Math.atan2(dy, dx) * 180 / Math.PI - 45;
      }
      cur.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + angle + 'deg)';
      lx = x; ly = y;
    };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={curRef} className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow">
          <path d="M4 2 L20 12 L12 13 L9 21 Z" fill="#2563eb" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function CursorCustomSvgPreview() {
  return <CursorCustomSvg />;
}
