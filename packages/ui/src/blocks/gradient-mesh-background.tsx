'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `gradient-mesh-background`.
 *
 * Mirrors the `typescript` code variant verbatim. The pools hang off all four
 * edges and `overflow-hidden` clips them, so the stage never scrolls
 * horizontally even at 320px. Keep this in step with
 * `src/data/components/gradients.ts`.
 */
interface GradientMeshBackgroundProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

export function GradientMeshBackground({
  title,
  kicker,
  copy,
  className = '',
}: GradientMeshBackgroundProps) {
  return (
    <section
      className={`relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950 ${className}`}
    >
      {/* Low-opacity pools over an opaque base: the base surface, not the
          mesh, is what guarantees AA for the text. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
        <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3),transparent_70%)] blur-2xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
      </div>

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export const minHeight = 340;

export default function GradientMeshBackgroundPreview() {
  return (
    <GradientMeshBackground
      title="One surface for every team"
      kicker="Platform"
      copy="Plan, build and measure on a single canvas - the mesh stays in the background, where it belongs."
    />
  );
}
