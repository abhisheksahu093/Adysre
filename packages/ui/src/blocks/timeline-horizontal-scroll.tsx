/**
 * Live preview for `timeline-horizontal-scroll`.
 *
 * Mirrors the `typescript` code variant verbatim. The stage is narrower than the
 * card row, so the strip scrolls - which is the behaviour on show. Keep this in
 * step with `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface HScrollItem {
  time: string;
  title: ReactNode;
  description?: ReactNode;
}

interface TimelineHorizontalScrollProps {
  items: HScrollItem[];
  className?: string;
}

export function TimelineHorizontalScroll({ items, className = '' }: TimelineHorizontalScrollProps) {
  return (
    <div className={`w-full overflow-x-auto pb-4 ${className}`}>
      <ol className="relative flex min-w-max snap-x snap-mandatory gap-4 px-1">
        <span
          className="pointer-events-none absolute inset-x-4 top-2 h-px bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
        />
        {items.map((item, i) => (
          <li key={i} className="relative w-60 shrink-0 snap-start pt-6">
            <span
              className="absolute left-4 top-2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
              aria-hidden="true"
            />
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <time className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
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
    </div>
  );
}

export default function TimelineHorizontalScrollPreview() {
  return (
    <TimelineHorizontalScroll
      items={[
        { time: 'Q1', title: 'Discovery', description: 'Interviews, research and a very messy whiteboard.' },
        { time: 'Q2', title: 'Prototype', description: 'The first thing you could actually click.' },
        { time: 'Q3', title: 'Beta', description: 'Fifty teams, endless feedback, zero regrets.' },
        { time: 'Q4', title: 'Launch', description: 'Doors open, coffee cold, dashboards green.' },
      ]}
    />
  );
}

export const minHeight = 220;
