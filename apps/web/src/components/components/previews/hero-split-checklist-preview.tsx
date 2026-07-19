/**
 * Live preview for `hero-split-checklist`.
 *
 * Mirrors the `typescript` code variant verbatim. On the narrow stage the two
 * columns stack, so `minHeight` gives the list room. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

interface HeroSplitChecklistProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  items?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_ITEMS = [
  'No-downtime data import',
  'SSO and SCIM on every plan',
  'Usage-based pricing, no seats',
  '24/7 human support',
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HeroSplitChecklist({
  title,
  kicker,
  copy,
  items = DEFAULT_ITEMS,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: HeroSplitChecklistProps) {
  return (
    <section className={`mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16 ${className}`}>
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h1>
        {copy ? (
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HeroSplitChecklistPreview() {
  return (
    <HeroSplitChecklist
      title="Everything you need, nothing you don't"
      kicker="Migrate in a day"
      copy="Move your stack over without the month-long project and the change freeze."
      ctaLabel="Get started"
      ctaHref="#"
    />
  );
}

export const minHeight = 420;
