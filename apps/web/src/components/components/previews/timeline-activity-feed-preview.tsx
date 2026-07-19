/**
 * Live preview for `timeline-activity-feed`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

interface ActivityItem {
  actor: string;
  action: ReactNode;
  target?: ReactNode;
  time: string;
  initials?: string;
  gradient?: string;
}

interface TimelineActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

function TimelineActivityFeed({ items, className = '' }: TimelineActivityFeedProps) {
  return (
    <ol className={`mx-auto w-full max-w-xl ${className}`}>
      {items.map((item, i) => {
        const initials = item.initials ?? item.actor.slice(0, 2).toUpperCase();
        const gradient = item.gradient ?? 'from-blue-500 to-indigo-500';
        const isLast = i === items.length - 1;
        return (
          <li key={i} className={`relative flex gap-4 ${isLast ? '' : 'pb-6'}`}>
            {!isLast ? (
              <span
                className="absolute left-[1.125rem] top-9 bottom-0 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-800"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${gradient}`}
              aria-hidden="true"
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{item.actor}</span> {item.action}
                {item.target ? (
                  <>
                    {' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.target}</span>
                  </>
                ) : null}
              </p>
              <time className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">{item.time}</time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TimelineActivityFeedPreview() {
  return (
    <TimelineActivityFeed
      items={[
        { actor: 'Alex Lee', action: 'opened', target: 'Invoice #1024', time: '2 hours ago', gradient: 'from-blue-500 to-indigo-500' },
        { actor: 'Maria Ruiz', action: 'commented on', target: 'Design review', time: '4 hours ago', gradient: 'from-emerald-500 to-teal-500' },
        { actor: 'Jon Kim', action: 'closed', target: 'Sprint 42', time: 'Yesterday', gradient: 'from-fuchsia-500 to-rose-500' },
      ]}
    />
  );
}

export const minHeight = 280;
