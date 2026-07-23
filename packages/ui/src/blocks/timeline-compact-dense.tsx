/**
 * Live preview for `timeline-compact-dense`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface CompactItem {
  time: string;
  title: ReactNode;
  meta?: ReactNode;
  accent?: string;
}

interface TimelineCompactDenseProps {
  items: CompactItem[];
  className?: string;
}

export function TimelineCompactDense({ items, className = '' }: TimelineCompactDenseProps) {
  return (
    <ol className={`mx-auto w-full max-w-lg ${className}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="relative flex gap-3">
            <time className="w-16 shrink-0 pt-px text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">
              {item.time}
            </time>
            <div
              className={`relative flex-1 ps-4 ${isLast ? 'border-s border-transparent' : 'border-s border-gray-200 pb-4 dark:border-gray-800'}`}
            >
              <span
                className={`absolute -start-1 top-1 h-2 w-2 rounded-full ${item.accent ?? 'bg-gray-300 dark:bg-gray-600'}`}
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
              {item.meta ? <p className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TimelineCompactDensePreview() {
  return (
    <TimelineCompactDense
      items={[
        { time: '09:24', title: 'Deployment started', meta: 'build #4821 · production' },
        { time: '09:26', title: 'Migrations applied', meta: '3 changes, no downtime' },
        { time: '09:28', title: 'Cache warmed', meta: 'edge nodes primed' },
        { time: '09:31', title: 'Deployment healthy', meta: 'all checks green', accent: 'bg-emerald-500' },
      ]}
    />
  );
}

export const minHeight = 280;
