/**
 * Live preview for `timeline-roadmap`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

type RoadmapStatus = 'shipped' | 'active' | 'planned';

interface RoadmapItem {
  title: ReactNode;
  description?: ReactNode;
  period?: string;
  status: RoadmapStatus;
}

interface TimelineRoadmapProps {
  items: RoadmapItem[];
  labels?: Record<RoadmapStatus, string>;
  className?: string;
}

const ROADMAP_STATUS: Record<RoadmapStatus, { dot: string; badge: string }> = {
  shipped: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  active: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  },
  planned: {
    dot: 'bg-gray-300 dark:bg-gray-600',
    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
};

const DEFAULT_LABELS: Record<RoadmapStatus, string> = {
  shipped: 'Shipped',
  active: 'In progress',
  planned: 'Planned',
};

function TimelineRoadmap({ items, labels = DEFAULT_LABELS, className = '' }: TimelineRoadmapProps) {
  return (
    <ol className={`mx-auto w-full max-w-xl ${className}`}>
      {items.map((item, i) => {
        const style = ROADMAP_STATUS[item.status];
        const isLast = i === items.length - 1;
        return (
          <li key={i} className={`relative flex gap-4 ${isLast ? '' : 'pb-8'}`}>
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-white dark:ring-gray-950 ${style.dot}`}
                aria-hidden="true"
              />
              {!isLast ? (
                <span className="mt-1 w-px grow bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
              ) : null}
            </div>
            <div className="-mt-0.5 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                  {labels[item.status]}
                </span>
              </div>
              {item.period ? (
                <time className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{item.period}</time>
              ) : null}
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TimelineRoadmapPreview() {
  return (
    <TimelineRoadmap
      items={[
        { title: 'Public API', status: 'shipped', period: 'Q1 2026', description: 'REST and webhooks, versioned and documented.' },
        { title: 'Mobile app', status: 'active', period: 'Q3 2026', description: 'iOS first, Android close behind.' },
        { title: 'Offline mode', status: 'planned', period: 'Q4 2026', description: 'Local-first sync for flaky connections.' },
      ]}
    />
  );
}

export const minHeight = 360;
