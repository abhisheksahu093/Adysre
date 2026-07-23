'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `services-cards-hover`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the <a> for next/link). Hover a card to see it lift and
 * reveal its CTA - or Tab to it, which does exactly the same thing, and is the
 * whole point of the entry.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface HoverService {
  id: string;
  title: string;
  copy: string;
  href: string;
  icon: ReactNode;
}

interface ServicesCardsHoverProps {
  kicker?: string;
  title: string;
  services: HoverService[];
  ctaLabel?: string;
  className?: string;
}

function ArrowIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ServicesCardsHover({
  kicker,
  title,
  services,
  ctaLabel = 'Learn more',
  className = '',
}: ServicesCardsHoverProps) {
  return (
    <section
      aria-labelledby="svc-hover-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-hover-title"
        className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: HoverService) => (
          <li key={service.id}>
            <a
              href={service.href}
              className="group block h-full rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:-translate-y-1 focus-visible:border-blue-200 focus-visible:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transform-none motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800 dark:focus-visible:border-blue-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                aria-hidden="true"
              >
                {service.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
              <span
                className="mt-4 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-blue-700 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-blue-400"
                aria-hidden="true"
              >
                {ctaLabel}
                <ArrowIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

const ICON_CLASS = 'h-5 w-5';

const SAMPLE_SERVICES: HoverService[] = [
  {
    id: 'discovery',
    title: 'Discovery sprint',
    copy: 'Two weeks to turn a wish list into a scoped, costed plan.',
    href: '#',
    icon: (
      <svg
        className={ICON_CLASS}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    id: 'build',
    title: 'Build squad',
    copy: 'A cross-functional team embedded with yours until it ships.',
    href: '#',
    icon: (
      <svg
        className={ICON_CLASS}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
  {
    id: 'audit',
    title: 'Architecture audit',
    copy: 'A second opinion on the system you are about to bet the quarter on.',
    href: '#',
    icon: (
      <svg
        className={ICON_CLASS}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
  },
];

export default function ServicesCardsHoverPreview() {
  return <ServicesCardsHover title="Pick a starting point" services={SAMPLE_SERVICES} ctaLabel="Learn more" />;
}
