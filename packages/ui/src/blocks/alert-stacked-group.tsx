/**
 * Live preview for `alert-stacked-group`.
 *
 * Mirrors the `typescript` code variant verbatim. One aria-labelledby'd region
 * names the whole stack, so a screen reader hears the group once and steps
 * through the members; each severity still reads from its colour+icon pair.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useId } from 'react';

type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

interface AlertItem {
  id: string;
  severity: AlertSeverity;
  message: string;
}

interface AlertStackedGroupProps {
  items: AlertItem[];
  label?: string;
  className?: string;
}

const ITEM_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertStackedGroup({ items, label = 'Alerts', className = '' }: AlertStackedGroupProps) {
  const headingId: string = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <h2 id={headingId} className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {items.length} {label}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${ITEM_STYLES[item.severity]}`}
          >
            <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d={SEVERITY_PATHS[item.severity]} />
            </svg>
            <span className="min-w-0 flex-1 text-sm leading-normal">{item.message}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AlertStackedGroupPreview() {
  return (
    <div className="w-full max-w-md">
      <AlertStackedGroup
        label="notices"
        items={[
          { id: 'ssl', severity: 'warning', message: 'Your SSL certificate renews in 6 days.' },
          { id: 'role', severity: 'info', message: 'A new team member is waiting for a role assignment.' },
          { id: 'backup', severity: 'success', message: 'Last night’s backup completed successfully.' },
        ]}
      />
    </div>
  );
}

export const minHeight = 260;
