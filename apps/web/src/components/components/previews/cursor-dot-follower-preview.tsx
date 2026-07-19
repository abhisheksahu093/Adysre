'use client';

import { useEffect, useRef } from 'react';

/**
 * Live preview for `cursor-dot-follower`.
 *
 * Mirrors the `typescript` code variant verbatim. The effect is scoped to this
 * stage and gates on `(pointer: fine)`, so touch previews stay a plain card.
 * Keep this in step with `src/data/components/cursors.ts`.
 */
interface CursorDotFollowerProps {
  hint?: string;
  dotClassName?: string;
  className?: string;
}

function CursorDotFollower({
  hint = 'Move your pointer around this panel',
  dotClassName = 'h-3 w-3 bg-blue-600 dark:bg-blue-400',
  className = '',
}: CursorDotFollowerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const dot = dotRef.current;
    if (!stage || !dot) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); dot.style.opacity = '1'; };
    const onLeave = (): void => { dot.style.opacity = '0'; };
    const onMove = (e: PointerEvent): void => {
      dot.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
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
      <div
        ref={dotRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none"
        aria-hidden="true"
      >
        <span className={`block -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClassName}`} />
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function CursorDotFollowerPreview() {
  return <CursorDotFollower />;
}
