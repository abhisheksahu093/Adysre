'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-crosshair-precision`.
 *
 * Mirrors the `typescript` code variant verbatim. The guides move via transform
 * and a mono chip prints the local coordinates; the motion is 1:1 with the hand.
 * Keep this in step with `src/data/components/cursors.ts`.
 */
interface CursorCrosshairPrecisionProps {
  hint?: string;
  className?: string;
}

function CursorCrosshairPrecision({
  hint = 'Precision crosshair with live coordinates',
  className = '',
}: CursorCrosshairPrecisionProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    const v = vRef.current;
    const h = hRef.current;
    const label = labelRef.current;
    if (!stage || !wrap || !v || !h || !label) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); wrap.style.opacity = '1'; };
    const onLeave = (): void => { wrap.style.opacity = '0'; };
    const onMove = (e: PointerEvent): void => {
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      v.style.transform = 'translateX(' + x + 'px)';
      h.style.transform = 'translateY(' + y + 'px)';
      label.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      label.textContent = x + ', ' + y;
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
      className={`relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={wrapRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
        <div ref={vRef} className="absolute inset-y-0 left-0 w-px bg-blue-500/70 dark:bg-blue-400/70" />
        <div ref={hRef} className="absolute inset-x-0 top-0 h-px bg-blue-500/70 dark:bg-blue-400/70" />
        <div ref={labelRef} className="absolute left-0 top-0 ml-2 mt-2 rounded bg-gray-900 px-1.5 py-0.5 font-mono text-[10px] text-white">0, 0</div>
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function CursorCrosshairPrecisionPreview() {
  return <CursorCrosshairPrecision />;
}
