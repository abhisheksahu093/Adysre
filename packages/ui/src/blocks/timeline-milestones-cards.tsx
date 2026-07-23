/**
 * Live preview for `timeline-milestones-cards`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface MilestoneItem {
  title: ReactNode;
  date?: string;
  description?: ReactNode;
  icon?: ReactNode;
}

interface TimelineMilestonesCardsProps {
  items: MilestoneItem[];
  className?: string;
}

const CheckIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export function TimelineMilestonesCards({ items, className = '' }: TimelineMilestonesCardsProps) {
  return (
    <ol className={`relative mx-auto w-full max-w-2xl ${className}`}>
      <span className="absolute bottom-4 left-5 top-4 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
      {items.map((item, i) => (
        <li key={i} className="relative flex gap-5 pb-6 last:pb-0">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-blue-400">
            {item.icon ?? <CheckIcon />}
          </span>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              {item.date ? <time className="text-xs text-gray-500 dark:text-gray-400">{item.date}</time> : null}
            </div>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function TimelineMilestonesCardsPreview() {
  return (
    <TimelineMilestonesCards
      items={[
        { title: 'Incorporated', date: 'Jan 2019', description: 'Signed the papers and named the company.' },
        { title: 'First hire', date: 'Aug 2020', description: 'Employee number three still runs the support desk.' },
        { title: 'Profitable', date: '2024', description: 'Five years in, the books finally turned black.' },
      ]}
    />
  );
}

export const minHeight = 380;
