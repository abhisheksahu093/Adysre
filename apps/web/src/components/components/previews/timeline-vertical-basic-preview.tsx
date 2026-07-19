/**
 * Live preview for `timeline-vertical-basic`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface TimelineItem {
  time: string;
  title: ReactNode;
  description?: ReactNode;
}

interface TimelineVerticalBasicProps {
  items: TimelineItem[];
  className?: string;
}

function TimelineVerticalBasic({ items, className = '' }: TimelineVerticalBasicProps) {
  return (
    <ol className={`relative mx-auto w-full max-w-2xl border-s border-gray-200 dark:border-gray-800 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="ms-6 pb-8 last:pb-0">
          <span
            className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
            aria-hidden="true"
          />
          <time className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {item.time}
          </time>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
          {item.description ? (
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export default function TimelineVerticalBasicPreview() {
  return (
    <TimelineVerticalBasic
      items={[
        { time: 'March 2026', title: 'Series A closed', description: 'Raised $12M to grow the platform and support teams.' },
        { time: 'May 2026', title: 'Shipped v2', description: 'A full rebuild of the editor and a new sync engine.' },
        { time: 'July 2026', title: '10,000 teams', description: 'Crossed ten thousand active workspaces worldwide.' },
      ]}
    />
  );
}

export const minHeight = 340;
