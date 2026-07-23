'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-spotlight-reveal`.
 *
 * Mirrors the `typescript` code variant verbatim. Only two CSS variables change
 * per move; off hover the hole parks off-panel so the surface reads dark. Keep
 * this in step with `src/data/components/cursors.ts`.
 */
interface CursorSpotlightRevealProps {
  heading?: string;
  copy?: string;
  radius?: number;
  className?: string;
}

export function CursorSpotlightReveal({
  heading = 'Hidden in plain sight',
  copy = 'The panel stays dark until your pointer lights a path across it.',
  radius = 120,
  className = '',
}: CursorSpotlightRevealProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const spot = spotRef.current;
    if (!stage || !spot) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const set = (e: PointerEvent): void => {
      spot.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      spot.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    };
    const onEnter = (e: PointerEvent): void => { rect = stage.getBoundingClientRect(); set(e); };
    const onLeave = (): void => {
      spot.style.setProperty('--x', '-1000px');
      spot.style.setProperty('--y', '-1000px');
    };
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', set);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', set);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 ${className}`}
    >
      <div className="flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
        <h3 className="text-lg font-semibold text-white">{heading}</h3>
        <p className="max-w-xs text-sm text-gray-300">{copy}</p>
      </div>
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 transition-[background] duration-150 motion-reduce:transition-none"
        style={{
          background: `radial-gradient(${radius}px circle at var(--x, -1000px) var(--y, -1000px), transparent 0%, transparent 45%, rgba(2,6,23,0.94) 78%)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}

export const minHeight = 300;

export default function CursorSpotlightRevealPreview() {
  return <CursorSpotlightReveal />;
}
