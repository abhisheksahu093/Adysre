import type { ReactNode } from 'react';

/**
 * Live preview for `list-expandable-rows`.
 *
 * Mirrors the `typescript` code variant verbatim. One row opens by default so
 * the panel and rotated chevron both show. Keep this in step with
 * `src/data/components/lists.ts`.
 */
interface ExpandableItem {
  id: string;
  title: string;
  content: ReactNode;
  meta?: string;
  defaultOpen?: boolean;
}

interface ListExpandableRowsProps {
  items: ExpandableItem[];
  ariaLabel?: string;
}

function ListExpandableRows({ items, ariaLabel = 'Expandable list' }: ListExpandableRowsProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id}>
          <details className="group" open={item.defaultOpen}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.title}
              </span>
              {item.meta ? (
                <span className="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">
                  {item.meta}
                </span>
              ) : null}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400">{item.content}</div>
          </details>
        </li>
      ))}
    </ul>
  );
}

const ROWS: ExpandableItem[] = [
  {
    id: '1',
    title: 'Deploy pipeline failed',
    meta: '2 min ago',
    defaultOpen: true,
    content: 'Step 4 of 7 timed out after 600s while waiting for the health check to pass.',
  },
  {
    id: '2',
    title: 'Nightly backup completed',
    meta: '3 h ago',
    content: 'Snapshot db-prod-0714 written to cold storage; 2.4 GB, verified.',
  },
  {
    id: '3',
    title: 'New device signed in',
    meta: 'Yesterday',
    content: 'A MacBook in Lisbon signed in with your account. If this was not you, revoke the session.',
  },
];

export const minHeight = 240;

export default function ListExpandableRowsPreview() {
  return (
    <div className="w-full max-w-sm">
      <ListExpandableRows items={ROWS} ariaLabel="Activity" />
    </div>
  );
}
