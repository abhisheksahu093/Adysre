'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `gradient-noise-overlay`.
 *
 * Mirrors the `typescript` code variant verbatim. The grain is an inline
 * feTurbulence filter - no PNG, no network request - and the scrim above it
 * guarantees AA for the white text. Keep this in step with
 * `src/data/components/gradients.ts`.
 */
interface GradientNoiseOverlayProps {
  title: ReactNode;
  copy?: string;
  filterId?: string;
  className?: string;
}

export function GradientNoiseOverlay({
  title,
  copy,
  filterId = 'gradient-noise-grain',
  className = '',
}: GradientNoiseOverlayProps) {
  return (
    <section className={`relative isolate w-full overflow-hidden rounded-2xl ${className}`}>
      <div
        className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#1e3a8a,#6d28d9,#be185d)]"
        aria-hidden="true"
      />

      {/* Grain from feTurbulence - no PNG, no network request, crisp at any
          density. Static, so it costs one paint, ever. */}
      <svg
        className="absolute inset-0 -z-20 h-full w-full opacity-25 mix-blend-soft-light"
        aria-hidden="true"
      >
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      {/* Above the grain, below the text: the scrim guarantees AA over both
          the gradient and the noise speckle, whatever opacity the grain runs
          at. */}
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}
      </div>
    </section>
  );
}

export const minHeight = 340;

export default function GradientNoiseOverlayPreview() {
  return (
    <GradientNoiseOverlay
      title="Texture without the texture file"
      copy="Film grain from a four-line SVG filter - the banding a smooth gradient shows on cheap panels disappears under it."
    />
  );
}
