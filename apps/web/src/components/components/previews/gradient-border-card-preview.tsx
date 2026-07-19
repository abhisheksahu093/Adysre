'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `gradient-border-card`.
 *
 * Mirrors the `typescript` code variant verbatim. The "border" is the 1px of
 * gradient the p-px padding leaves exposed around an opaque inner card. Keep
 * this in step with `src/data/components/gradients.ts`.
 */
interface GradientBorderCardProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function GradientBorderCard({
  title,
  copy,
  ctaLabel = 'Upgrade',
  ctaHref = '#',
  className = '',
}: GradientBorderCardProps) {
  return (
    <div
      className={`w-full max-w-sm rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 p-px ${className}`}
    >
      {/* CSS borders cannot take a gradient and keep their radius, so the
          "border" is the 1px of gradient the p-px padding leaves exposed. The
          inner surface must be fully opaque - any alpha and the gradient shows
          through the card, not just around it - and the inner radius is the
          outer radius minus the ring width, or the corners pinch. */}
      <div className="rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}

export const minHeight = 220;

export default function GradientBorderCardPreview() {
  return (
    <GradientBorderCard
      title="Pro plan"
      copy="Everything in Free, plus unlimited projects and priority support."
      ctaLabel="Upgrade"
    />
  );
}
