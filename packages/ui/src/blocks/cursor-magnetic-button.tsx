'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-magnetic-button`.
 *
 * Mirrors the `typescript` code variant verbatim. The pull is eased in rAF and
 * skipped entirely under reduced motion; the button stays clickable throughout.
 * Keep this in step with `src/data/components/cursors.ts`.
 */
interface CursorMagneticButtonProps {
  label?: string;
  strength?: number;
  className?: string;
}

export function CursorMagneticButton({
  label = 'Get started',
  strength = 0.4,
  className = '',
}: CursorMagneticButtonProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const btn = btnRef.current;
    if (!stage || !btn) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let b = btn.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = (): void => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      btn.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      if (tx === 0 && ty === 0 && Math.abs(cx) < 0.1 && Math.abs(cy) < 0.1) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
    };
    const onEnter = (): void => { b = btn.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      tx = (e.clientX - (b.left + b.width / 2)) * strength;
      ty = (e.clientY - (b.top + b.height / 2)) * strength;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = (): void => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      btn.style.transform = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <div
      ref={stageRef}
      className={`relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <button
        ref={btnRef}
        type="button"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white will-change-transform transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transform-none dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>
    </div>
  );
}

export const minHeight = 300;

export default function CursorMagneticButtonPreview() {
  return <CursorMagneticButton />;
}
