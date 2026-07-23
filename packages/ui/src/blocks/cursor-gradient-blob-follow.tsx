'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-gradient-blob-follow`.
 *
 * Mirrors the `typescript` code variant verbatim. The blurred blob eases after
 * the pointer on the compositor; reduced motion parks it centred. Keep this in
 * step with `src/data/components/cursors.ts`.
 */
interface CursorGradientBlobFollowProps {
  heading?: string;
  copy?: string;
  ease?: number;
  className?: string;
}

export function CursorGradientBlobFollow({
  heading = 'Follow the light',
  copy = 'A soft gradient blob eases after your pointer.',
  ease = 0.12,
  className = '',
}: CursorGradientBlobFollowProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const blob = blobRef.current;
    if (!stage || !blob) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    let tx = rect.width / 2, ty = rect.height / 2, cx = tx, cy = ty, raf = 0;
    blob.style.left = '0'; blob.style.top = '0';
    const loop = (): void => {
      cx += (tx - cx) * ease; cy += (ty - cy) * ease;
      blob.style.transform = 'translate3d(' + (cx - 64) + 'px,' + (cy - 64) + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; };
    const onLeave = (): void => { tx = rect.width / 2; ty = rect.height / 2; };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [ease]);

  return (
    <div
      ref={stageRef}
      className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 ${className}`}
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.7),transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{heading}</h3>
        <p className="max-w-xs text-sm text-gray-600 dark:text-gray-400">{copy}</p>
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function CursorGradientBlobFollowPreview() {
  return <CursorGradientBlobFollow />;
}
