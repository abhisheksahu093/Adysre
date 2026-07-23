/**
 * Live preview for `alert-with-icon-list`.
 *
 * Mirrors the `typescript` code variant verbatim. The list is a real <ul>, and
 * each row is items-start with a flex-none marker plus a min-w-0 text cell, so
 * the longest line wraps under itself rather than overflowing at 320px.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

interface AlertWithIconListProps {
  title: string;
  items: string[];
  severity?: AlertSeverity;
  className?: string;
}

const LIST_STYLES: Record<AlertSeverity, string> = {
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

export function AlertWithIconList({ title, items, severity = 'error', className = '' }: AlertWithIconListProps) {
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div role={role} className={`rounded-lg border px-4 py-3.5 ${LIST_STYLES[severity]} ${className}`}>
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
        <p className="min-w-0 flex-1 text-sm font-semibold">{title}</p>
      </div>
      <ul className="mt-2 space-y-1.5 pl-[1.625rem] text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-current" aria-hidden="true" />
            <span className="min-w-0 flex-1 leading-normal">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AlertWithIconListPreview() {
  return (
    <div className="w-full max-w-md">
      <AlertWithIconList
        title="Fix 3 issues before publishing"
        severity="error"
        items={[
          'The billing address is missing a postal code.',
          'Two line items reference a product that was archived.',
          'The purchase-order number is longer than the 20 characters your ERP accepts.',
        ]}
      />
    </div>
  );
}

export const minHeight = 240;
