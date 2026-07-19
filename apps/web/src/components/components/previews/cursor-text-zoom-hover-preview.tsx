'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-text-zoom-hover`.
 *
 * Mirrors the `typescript` code variant verbatim. A transition on the transform
 * smooths the zoom and tilt; reduced motion leaves the word flat. Keep this in
 * step with `src/data/components/cursors.ts`.
 */
interface CursorTextZoomHoverProps {
  text?: string;
  scale?: number;
  className?: string;
}

function CursorTextZoomHover({
  text = 'Zoom',
  scale = 1.35,
  className = '',
}: CursorTextZoomHoverProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const el = textRef.current;
    if (!stage || !el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); el.style.transform = 'scale(' + scale + ')'; };
    const onLeave = (): void => { el.style.transform = 'scale(1)'; };
    const onMove = (e: PointerEvent): void => {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = 'scale(' + scale + ') rotateX(' + (-py * 18) + 'deg) rotateY(' + (px * 18) + 'deg)';
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      el.style.transform = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, [scale]);

  return (
    <div
      ref={stageRef}
      className={`relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 [perspective:600px] dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <span
        ref={textRef}
        className="text-5xl font-bold tracking-tight text-gray-900 will-change-transform transition-transform duration-200 ease-out motion-reduce:transform-none dark:text-gray-100"
      >
        {text}
      </span>
    </div>
  );
}

export const minHeight = 300;

export default function CursorTextZoomHoverPreview() {
  return <CursorTextZoomHover />;
}
