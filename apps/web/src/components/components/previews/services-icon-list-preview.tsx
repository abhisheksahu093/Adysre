'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `services-icon-list`.
 *
 * Mirrors the `typescript` code variant verbatim, with three capabilities so
 * the dividers between rows are visible on the stage. Single-column at every
 * width by design, so it needs nothing special to survive a 390px stage.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface ServiceListItem {
  id: string;
  title: string;
  copy: string;
  icon: ReactNode;
}

interface ServicesIconListProps {
  kicker?: string;
  title: string;
  services: ServiceListItem[];
  className?: string;
}

function ServicesIconList({ kicker, title, services, className = '' }: ServicesIconListProps) {
  return (
    <section
      aria-labelledby="svc-list-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-list-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-8">
        {services.map((service: ServiceListItem) => (
          <li
            key={service.id}
            className="flex gap-4 border-t border-gray-200 py-6 first:border-t-0 first:pt-0 dark:border-gray-800"
          >
            <span
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const ICON_CLASS = 'h-5 w-5';

const SAMPLE_SERVICES: ServiceListItem[] = [
  {
    id: 'design-systems',
    title: 'Design systems',
    copy: 'A token layer and a component library your engineers reach for by default.',
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </svg>
    ),
  },
  {
    id: 'platform',
    title: 'Platform engineering',
    copy: 'CI, environments and observability that stop being a project and start being plumbing.',
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
        <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7" />
        <path d="M2 13h20l-2 7H4l-2-7Z" />
      </svg>
    ),
  },
  {
    id: 'performance',
    title: 'Performance',
    copy: 'Budgets, traces and the unglamorous work of making the numbers stay down.',
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function ServicesIconListPreview() {
  return <ServicesIconList kicker="Capabilities" title="Everything under one retainer" services={SAMPLE_SERVICES} />;
}
