'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `gradient-conic-ring`.
 *
 * Mirrors the `typescript` code variant verbatim. The ring is the 1px of
 * spinning conic gradient the p-px padding leaves exposed; the spin is pure
 * transform, so it costs one paint. Keep this in step with
 * `src/data/components/gradients.ts`.
 */
const SPIN_KEYFRAMES = `
  @keyframes conic-spin {
    to { transform: rotate(1turn); }
  }
`;

interface GradientConicRingProps {
  title: ReactNode;
  copy?: string;
  className?: string;
}

function GradientConicRing({ title, copy, className = '' }: GradientConicRingProps) {
  return (
    <div className={`relative w-full max-w-sm overflow-hidden rounded-2xl p-px ${className}`}>
      <style>{SPIN_KEYFRAMES}</style>

      {/* inset-[-100%] makes the conic layer 3x the card so its corners never
          show while it rotates; the spin is pure transform, so the gradient is
          painted once and rotated by the compositor. Reduced motion leaves a
          static conic arc - the motion is the decoration, the ring is the
          design. */}
      <div
        className="absolute inset-[-100%] animate-[conic-spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_100deg,#a855f7_180deg,#22d3ee_260deg,transparent_360deg)] motion-reduce:animate-none"
        aria-hidden="true"
      />

      {/* Opaque inner surface, or the gradient shows through the card instead
          of just around it. Radius = outer radius minus the 1px ring. */}
      <div className="relative rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function GradientConicRingPreview() {
  return (
    <GradientConicRing
      title="Realtime sync"
      copy="Every change lands on every device before you lift your finger off the key."
    />
  );
}
