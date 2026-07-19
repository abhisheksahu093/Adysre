'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `services-tabbed`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive: click a
 * tab, or focus the strip and use Left/Right/Home/End - the roving tabindex
 * means Tab enters the strip once and then moves on to the panel.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface ServiceCategory {
  id: string;
  label: string;
  heading: string;
  copy: string;
}

interface ServicesTabbedProps {
  kicker?: string;
  title: string;
  categories: ServiceCategory[];
  ariaLabel?: string;
  className?: string;
}

function ServicesTabbed({
  kicker,
  title,
  categories,
  ariaLabel = 'Service categories',
  className = '',
}: ServicesTabbedProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(categories[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = categories.findIndex((category: ServiceCategory) => category.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categories.length - 1;
    else return;

    event.preventDefault();
    const category = categories[next];
    if (!category) return;
    setActiveId(category.id);
    tabRefs.current[category.id]?.focus();
  };

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id={`${baseId}-title`}
        className="mb-6 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div
        className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800"
        role="tablist"
        aria-label={ariaLabel}
      >
        {categories.map((category: ServiceCategory) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`${baseId}-${category.id}-tab`}
              aria-controls={`${baseId}-${category.id}-panel`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[category.id] = node;
              }}
              onClick={() => setActiveId(category.id)}
              onKeyDown={onKeyDown}
              className={[
                'flex-none border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                isActive
                  ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
              ].join(' ')}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {categories.map((category: ServiceCategory) => (
        <div
          key={category.id}
          role="tabpanel"
          id={`${baseId}-${category.id}-panel`}
          aria-labelledby={`${baseId}-${category.id}-tab`}
          tabIndex={0}
          hidden={category.id !== activeId}
          className="pt-6 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category.heading}</h3>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{category.copy}</p>
        </div>
      ))}
    </section>
  );
}

const SAMPLE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'build',
    label: 'Build',
    heading: 'Build',
    copy: 'A cross-functional squad that ships your first production release in twelve weeks.',
  },
  {
    id: 'scale',
    label: 'Scale',
    heading: 'Scale',
    copy: 'Platform, performance and on-call practice for the traffic you are about to get.',
  },
  {
    id: 'advise',
    label: 'Advise',
    heading: 'Advise',
    copy: 'Fractional architecture review for teams who need a second opinion, not a supplier.',
  },
];

export default function ServicesTabbedPreview() {
  return (
    <ServicesTabbed
      title="Find the engagement that fits"
      categories={SAMPLE_CATEGORIES}
      ariaLabel="Service categories"
    />
  );
}
