'use client';

/**
 * Live preview for `notification-snackbar-action`.
 *
 * Mirrors the `typescript` code variant. The action and dismiss are separate
 * real buttons, not a bar-wide target. Undo and Dismiss both resolve the
 * snackbar; Reset restores it. Keep this in step with
 * `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

interface NotificationSnackbarActionProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

function NotificationSnackbarAction({
  message,
  actionLabel,
  onAction,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationSnackbarActionProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex w-full max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] dark:bg-gray-100 ${className}`}
    >
      <p className="min-w-0 flex-1 text-sm text-gray-100 dark:text-gray-900">{message}</p>
      {actionLabel !== undefined ? (
        <button
          type="button"
          onClick={onAction}
          className="flex-none rounded text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-blue-700 dark:hover:text-blue-600 dark:focus-visible:ring-blue-600"
        >
          {actionLabel}
        </button>
      ) : null}
      {onDismiss !== undefined ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-400 transition hover:bg-white/10 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-gray-500 dark:hover:bg-black/10 dark:hover:text-gray-900 dark:focus-visible:ring-blue-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export default function NotificationSnackbarActionPreview() {
  const [state, setState] = useState<'open' | 'undone' | 'dismissed'>('open');

  return (
    <div className="w-full max-w-md">
      {state === 'open' ? (
        <NotificationSnackbarAction
          message="Message moved to Archive"
          actionLabel="Undo"
          onAction={() => setState('undone')}
          onDismiss={() => setState('dismissed')}
        />
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {state === 'undone' ? 'Move undone.' : 'Snackbar dismissed.'}
        </p>
      )}

      <button
        type="button"
        onClick={() => setState('open')}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}
