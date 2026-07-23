'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `gradient-animated-blobs`.
 *
 * Mirrors the `typescript` code variant verbatim. The drift is transform-only,
 * so even three blurred blobs cost the stage nothing per frame; reduced motion
 * freezes them in place. Keep this in step with
 * `src/data/components/gradients.ts`.
 */
const DRIFT_KEYFRAMES = `
  @keyframes blob-drift-a {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(2.5rem, -2rem, 0) scale(1.15); }
  }
  @keyframes blob-drift-b {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(-2rem, 2rem, 0) scale(0.9); }
  }
`;

interface GradientAnimatedBlobsProps {
  title: ReactNode;
  copy?: string;
  className?: string;
}

export function GradientAnimatedBlobs({ title, copy, className = '' }: GradientAnimatedBlobsProps) {
  return (
    <section
      className={`relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950 ${className}`}
    >
      {/* Both keyframes animate transform only - translate and scale. The blur
          is the expensive part of a blob; a transform-only animation lets the
          browser rasterise it once and move the bitmap on the compositor.
          Reduced motion freezes the blobs in place and keeps the colour. */}
      <style>{DRIFT_KEYFRAMES}</style>

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl animate-[blob-drift-a_18s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80" />
        <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.3),transparent_70%)] blur-2xl animate-[blob-drift-b_24s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80" />
        <div className="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25),transparent_70%)] blur-2xl animate-[blob-drift-a_28s_ease-in-out_-9s_infinite] motion-reduce:animate-none sm:h-64 sm:w-64" />
      </div>

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
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

export default function GradientAnimatedBlobsPreview() {
  return (
    <GradientAnimatedBlobs
      title="Calm on the surface"
      copy="Three blobs drifting on twenty-second loops - slow enough to feel like weather, not like a screensaver."
    />
  );
}
