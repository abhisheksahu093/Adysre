'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `gradient-aurora`.
 *
 * Mirrors the `typescript` code variant verbatim. The ribbons sweep on a
 * transform-only animation and a flat gray-950/45 scrim guarantees AA at every
 * frame, so the white text stays legible mid-sweep. Keep this in step with
 * `src/data/components/gradients.ts`.
 */
const AURORA_KEYFRAMES = `
  @keyframes aurora-sweep {
    0%, 100% { transform: translateX(-8%) skewX(-12deg); }
    50% { transform: translateX(8%) skewX(-12deg); }
  }
`;

interface GradientAuroraProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

function GradientAurora({ title, kicker, copy, className = '' }: GradientAuroraProps) {
  return (
    <section
      className={`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 ${className}`}
    >
      <style>{AURORA_KEYFRAMES}</style>

      {/* Ribbons drift through bright emerald and cyan, so white text over the
          raw aurora passes contrast on one frame and fails on the next. The
          scrim below is what makes 4.5:1 true at every frame. The sweep
          animates transform only (translate + skew): the blur-3xl ribbons are
          rasterised once and panned by the compositor. No dark: variants - the
          section paints its own night sky, so both themes see the same thing. */}
      <div className="absolute left-[-20%] right-[-20%] top-[-45%] -z-20 h-[120%]" aria-hidden="true">
        <div className="absolute inset-0 animate-[aurora-sweep_18s_ease-in-out_infinite] bg-[linear-gradient(100deg,transparent_10%,rgba(16,185,129,0.45)_35%,rgba(34,211,238,0.35)_50%,rgba(139,92,246,0.4)_65%,transparent_90%)] blur-3xl motion-reduce:animate-none" />
        <div className="absolute inset-0 animate-[aurora-sweep_26s_ease-in-out_-8s_infinite_reverse] bg-[linear-gradient(80deg,transparent_20%,rgba(59,130,246,0.3)_45%,rgba(16,185,129,0.25)_60%,transparent_85%)] blur-3xl motion-reduce:animate-none" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gray-950/45" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}
      </div>
    </section>
  );
}

export const minHeight = 340;

export default function GradientAuroraPreview() {
  return (
    <GradientAurora
      title="Interfaces that glow in the dark"
      kicker="Aurora release"
      copy="A northern-lights sweep on a self-painted night sky - it looks identical on a white page and a black one."
    />
  );
}
