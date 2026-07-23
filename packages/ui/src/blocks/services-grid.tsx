'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `services-grid`.
 *
 * Mirrors the `typescript` code variant verbatim. Three services rather than
 * six, so the stage shows a full row without scrolling; the grid collapses to
 * one column below `sm`, which is the layout worth seeing on a narrow stage.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface ServiceItem {
  id: string;
  title: string;
  copy: string;
  icon: ReactNode;
}

interface ServicesGridProps {
  kicker?: string;
  title: string;
  copy?: string;
  services: ServiceItem[];
  className?: string;
}

export function ServicesGrid({ kicker, title, copy, services, className = '' }: ServicesGridProps) {
  const titleId = 'svc-grid-title';

  return (
    <section
      aria-labelledby={titleId}
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-xl">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id={titleId} className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: ServiceItem) => (
          <li
            key={service.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const ICON_CLASS = 'h-5 w-5';

const SAMPLE_SERVICES: ServiceItem[] = [
  {
    id: 'strategy',
    title: 'Product strategy',
    copy: 'Positioning, scope and a roadmap you can actually staff.',
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
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'engineering',
    title: 'Engineering',
    copy: 'Typed, tested delivery on a stack your team can own after we leave.',
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
    id: 'analytics',
    title: 'Analytics',
    copy: 'Instrumentation that answers the question you actually asked.',
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
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

export default function ServicesGridPreview() {
  return (
    <ServicesGrid
      kicker="What we do"
      title="Services built around your roadmap"
      copy="Four practices, one team, and a single point of contact from kickoff to handover."
      services={SAMPLE_SERVICES}
    />
  );
}
