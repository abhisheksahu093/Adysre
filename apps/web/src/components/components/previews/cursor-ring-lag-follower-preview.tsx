'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-ring-lag-follower`.
 *
 * Mirrors the `typescript` code variant verbatim. The ring eases in behind the
 * pointer via a per-frame lerp; reduced motion drops it to a 1:1 track. Keep
 * this in step with `src/data/components/cursors.ts`.
 */
interface CursorRingLagFollowerProps {
  hint?: string;
  ringClassName?: string;
  ease?: number;
  className?: string;
}

function CursorRingLagFollower({
  hint = 'The ring eases in behind your pointer',
  ringClassName = 'h-8 w-8 border-2 border-blue-500 dark:border-blue-400',
  ease = 0.15,
  className = '',
}: CursorRingLagFollowerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const factor = reduce ? 1 : ease;

    let rect = stage.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, active = false;
    const loop = (): void => {
      cx += (tx - cx) * factor; cy += (ty - cy) * factor;
      ring.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    const onEnter = (e: PointerEvent): void => {
      rect = stage.getBoundingClientRect();
      tx = cx = e.clientX - rect.left; ty = cy = e.clientY - rect.top;
      if (!active) { active = true; ring.style.opacity = '1'; raf = requestAnimationFrame(loop); }
    };
    const onLeave = (): void => { active = false; ring.style.opacity = '0'; cancelAnimationFrame(raf); };
    const onMove = (e: PointerEvent): void => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, [ease]);

  return (
    <div
      ref={stageRef}
      className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none"
        aria-hidden="true"
      >
        <span className={`block -translate-x-1/2 -translate-y-1/2 rounded-full ${ringClassName}`} />
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function CursorRingLagFollowerPreview() {
  return <CursorRingLagFollower />;
}
