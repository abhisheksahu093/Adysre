'use client';

/**
 * Live preview for `notification-toast-success`.
 *
 * Mirrors the `typescript` code variant. The component is a plain card (not
 * fixed to the viewport), so it sits in the stage as-is; Dismiss really removes
 * it and Reset brings it back. Keep this in step with
 * `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

interface NotificationToastSuccessProps {
  title: string;
  message?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function NotificationToastSuccess({
  title,
  message,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationToastSuccessProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex w-96 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-green-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-green-900 dark:bg-gray-900 ${className}`}
    >
      <svg
        className="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {message !== undefined ? (
          <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}

export default function NotificationToastSuccessPreview() {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div className="w-full max-w-md">
      {visible ? (
        <NotificationToastSuccess
          title="Payment received"
          message="Invoice #2043 has been marked as paid."
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">Toast dismissed.</p>
      )}

      <button
        type="button"
        onClick={() => setVisible(true)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}
