/**
 * Live preview for `timeline-changelog`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/timeline.ts`.
 */
import type { ReactNode } from 'react';

type ChangeType = 'added' | 'fixed' | 'changed' | 'removed';

interface ChangelogChange {
  type: ChangeType;
  text: ReactNode;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: ChangelogChange[];
}

interface TimelineChangelogProps {
  entries: ChangelogEntry[];
  labels?: Record<ChangeType, string>;
  className?: string;
}

const CHANGE_TYPES: Record<ChangeType, string> = {
  added: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  fixed: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  changed: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  removed: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
};

const CHANGE_LABELS: Record<ChangeType, string> = {
  added: 'Added',
  fixed: 'Fixed',
  changed: 'Changed',
  removed: 'Removed',
};

export function TimelineChangelog({ entries, labels = CHANGE_LABELS, className = '' }: TimelineChangelogProps) {
  return (
    <div className={`mx-auto w-full max-w-2xl divide-y divide-gray-200 dark:divide-gray-800 ${className}`}>
      {entries.map((entry, i) => (
        <article key={i} className="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[8rem_1fr]">
          <header className="md:pt-0.5">
            <span className="inline-flex items-center rounded-md bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
              {entry.version}
            </span>
            <time className="mt-2 block text-xs text-gray-500 dark:text-gray-400">{entry.date}</time>
          </header>
          <ul className="space-y-2">
            {entry.changes.map((change, j) => (
              <li key={j} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span
                  className={`mt-0.5 inline-flex h-5 shrink-0 items-center rounded px-1.5 text-xs font-medium ${CHANGE_TYPES[change.type]}`}
                >
                  {labels[change.type]}
                </span>
                <span>{change.text}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function TimelineChangelogPreview() {
  return (
    <TimelineChangelog
      entries={[
        {
          version: 'v2.4.0',
          date: 'Jul 12, 2026',
          changes: [
            { type: 'added', text: 'Keyboard shortcuts for every toolbar action.' },
            { type: 'fixed', text: 'Drag-and-drop no longer drops items on the wrong row.' },
          ],
        },
        {
          version: 'v2.3.0',
          date: 'Jun 28, 2026',
          changes: [
            { type: 'changed', text: 'Faster initial load on large workspaces.' },
            { type: 'removed', text: 'Retired the legacy v1 export format.' },
          ],
        },
      ]}
    />
  );
}

export const minHeight = 360;
