/**
 * Live preview for `notification-empty-state`.
 *
 * Mirrors the `typescript` code variant. Inline SVG illustration (no network
 * image), aria-hidden because the heading says everything. Keep this in step
 * with `src/data/components/notifications.ts`.
 */
interface NotificationEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function NotificationEmptyState({
  title = "You're all caught up",
  description = 'New notifications will show up here.',
  actionLabel,
  onAction,
  className = '',
}: NotificationEmptyStateProps) {
  return (
    <div
      className={`flex w-full max-w-sm flex-col items-center justify-center gap-3 px-6 py-10 text-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
      >
        <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      {actionLabel !== undefined ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default function NotificationEmptyStatePreview() {
  return (
    <div className="flex w-full justify-center">
      <NotificationEmptyState actionLabel="Notification settings" />
    </div>
  );
}

export const minHeight = 260;
