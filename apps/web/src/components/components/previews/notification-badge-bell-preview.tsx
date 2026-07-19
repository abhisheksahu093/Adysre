'use client';

/**
 * Live preview for `notification-badge-bell`.
 *
 * Mirrors the `typescript` code variant. The controls below drive the count so
 * the two edge cases the component actually exists to handle are visible: zero
 * renders no badge at all (not an empty one), and anything past 99 collapses to
 * "99+" visually while the accessible name keeps the true number.
 *
 * Keep this in step with `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

interface NotificationBadgeBellProps {
  count?: number;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

function NotificationBadgeBell({
  count = 0,
  ariaLabel,
  onClick,
  className = '',
}: NotificationBadgeBellProps) {
  const label: string = ariaLabel ?? `Notifications, ${count} unread`;
  const display: string = count > 99 ? '99+' : String(count);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${className}`}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>

        {/* Nothing at zero. An empty badge is still a dot that means nothing.
            White on red-600 is 4.83:1 - red-500 would be 3.76:1 and fail AA. */}
        {count > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-900"
          >
            {display}
          </span>
        ) : null}
      </button>

      {/* Separate from the button on purpose: aria-live on the button itself
          makes several screen readers re-read its whole label on every tick. */}
      <span className="sr-only" role="status" aria-live="polite">
        {count > 0 ? `${count} unread notifications` : ''}
      </span>
    </>
  );
}

export default function NotificationBadgeBellPreview() {
  const [count, setCount] = useState<number>(3);

  return (
    <div className="flex flex-col items-center gap-4">
      <NotificationBadgeBell count={count} />

      <div className="flex items-center gap-2">
        {[0, 3, 128].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCount(value)}
            aria-pressed={count === value}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
              count === value
                ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {value === 0 ? 'No badge' : value === 128 ? '99+ overflow' : String(value)}
          </button>
        ))}
      </div>
    </div>
  );
}
