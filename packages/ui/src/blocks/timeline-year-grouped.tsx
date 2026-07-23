/**
 * Live preview for `timeline-year-grouped`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface YearItem {
  date: string;
  title: ReactNode;
  description?: ReactNode;
}

interface YearGroup {
  year: string;
  items: YearItem[];
}

interface TimelineYearGroupedProps {
  groups: YearGroup[];
  className?: string;
}

export function TimelineYearGrouped({ groups, className = '' }: TimelineYearGroupedProps) {
  return (
    <div className={`mx-auto w-full max-w-2xl ${className}`}>
      {groups.map((group, gi) => (
        <section key={gi} className={gi === 0 ? '' : 'mt-8'}>
          <h2 className="sticky top-0 z-10 mb-4 bg-white/80 py-1 text-lg font-bold text-gray-900 backdrop-blur dark:bg-gray-950/80 dark:text-gray-100">
            {group.year}
          </h2>
          <ol className="relative border-s border-gray-200 dark:border-gray-800">
            {group.items.map((item, i) => (
              <li key={i} className="ms-6 pb-6 last:pb-0">
                <span
                  className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
                  aria-hidden="true"
                />
                <time className="block text-xs font-medium text-gray-500 dark:text-gray-400">{item.date}</time>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

export default function TimelineYearGroupedPreview() {
  return (
    <TimelineYearGrouped
      groups={[
        {
          year: '2026',
          items: [
            { date: 'March', title: 'Opened the Berlin office', description: 'Twelve desks and one very good espresso machine.' },
            { date: 'June', title: 'Passed SOC 2', description: 'A long audit with a short, happy ending.' },
          ],
        },
        {
          year: '2025',
          items: [{ date: 'November', title: 'Hit $1M ARR', description: 'Small number, big party.' }],
        },
      ]}
    />
  );
}

export const minHeight = 420;
