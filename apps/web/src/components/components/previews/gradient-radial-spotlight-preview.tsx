'use client';

import type { PointerEvent, ReactNode } from 'react';

/**
 * Live preview for `gradient-radial-spotlight`.
 *
 * Mirrors the `typescript` code variant verbatim. The pointer writes two CSS
 * custom properties and the reveal is a pure opacity fade on hover, so the
 * handler never triggers a React re-render. Keep this in step with
 * `src/data/components/gradients.ts`.
 */
interface GradientRadialSpotlightProps {
  title: ReactNode;
  copy?: string;
  className?: string;
}

function GradientRadialSpotlight({ title, copy, className = '' }: GradientRadialSpotlightProps) {
  // Writing a custom property does not re-render React and does not run
  // layout - the browser repaints one composited layer. That is why the
  // handler can fire on every pointer move without a setState storm.
  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`group relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {/* Revealed by opacity only - hover fades it in, the pointer moves its
          centre. The spotlight never exists for touch and keyboard users, so
          the card must read complete without it. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(59,130,246,0.16),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none dark:bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(96,165,250,0.2),transparent_70%)]"
        aria-hidden="true"
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}
    </div>
  );
}

export default function GradientRadialSpotlightPreview() {
  return (
    <GradientRadialSpotlight
      title="Hover to light it up"
      copy="The gradient's centre rides two CSS custom properties; the pointer just moves them around."
    />
  );
}
