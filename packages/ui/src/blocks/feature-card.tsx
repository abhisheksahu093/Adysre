'use client';

/**
 * Live preview for `feature-card`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the `<a>` for `next/link`). The icon is passed in, as the
 * component intends - no icon library involved.
 * Keep this in step with `src/data/components/cards.ts`.
 */
import type { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  copy: string;
  icon: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function FeatureCard({
  title,
  copy,
  icon,
  ctaLabel = 'Learn more',
  ctaHref,
  className = '',
}: FeatureCardProps) {
  return (
    <article
      className={`flex w-full max-w-xs flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>

      {ctaHref ? (
        <a
          href={ctaHref}
          className="group mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
          <span className="sr-only"> about {title}</span>
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </a>
      ) : null}
    </article>
  );
}

export default function FeatureCardPreview() {
  return (
    <FeatureCard
      title="Instant preview builds"
      copy="Every pull request gets its own URL in under thirty seconds, torn down the moment the branch merges."
      ctaLabel="Learn more"
      ctaHref="#"
      icon={
        <svg className="h-[1.375rem] w-[1.375rem]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2 4.5 13.2a1 1 0 0 0 .8 1.6H10l-1 7.2 8.5-11.2a1 1 0 0 0-.8-1.6H12l1-7.2Z" />
        </svg>
      }
    />
  );
}
