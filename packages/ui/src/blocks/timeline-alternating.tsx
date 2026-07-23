/**
 * Live preview for `timeline-alternating`.
 *
 * Mirrors the `typescript` code variant verbatim. At the stage's narrowest the
 * alternation collapses to the single-column phone layout it is designed to
 * fall back to. Keep this in step with `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface AlternatingItem {
  time: string;
  title: ReactNode;
  description?: ReactNode;
}

interface TimelineAlternatingProps {
  items: AlternatingItem[];
  className?: string;
}

export function TimelineAlternating({ items, className = '' }: TimelineAlternatingProps) {
  return (
    <ol className={`relative mx-auto w-full max-w-3xl ${className}`}>
      <span
        className="absolute bottom-2 top-2 left-4 w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2 dark:bg-gray-800"
        aria-hidden="true"
      />
      {items.map((item, i) => (
        <li
          key={i}
          className="relative mb-8 ps-12 last:mb-0 md:grid md:grid-cols-2 md:gap-x-10 md:ps-0"
        >
          <span
            className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 md:left-1/2 dark:border-gray-950 dark:bg-blue-500"
            aria-hidden="true"
          />
          <div className={i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}>
            <time className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {item.time}
            </time>
            <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function TimelineAlternatingPreview() {
  return (
    <TimelineAlternating
      items={[
        { time: '2019', title: 'Founded', description: 'Two people, one laptop, a very long to-do list.' },
        { time: '2022', title: 'First 1,000 customers', description: 'Word of mouth did what the ad budget could not.' },
        { time: '2026', title: 'Global launch', description: 'Now serving teams in over sixty countries.' },
      ]}
    />
  );
}

export const minHeight = 400;
