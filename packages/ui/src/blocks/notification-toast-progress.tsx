'use client';

/**
 * Live preview for `notification-toast-progress`.
 *
 * Mirrors the `typescript` code variant. The countdown bar is one width
 * transition, so motion-reduce switches only the animation off. Here the toast
 * dismisses on the timer; Reset remounts it (via a changing key) to restart the
 * countdown. Keep this in step with `src/data/components/notifications.ts`.
 */
import { useEffect, useState } from 'react';

interface NotificationToastProgressProps {
  title: string;
  message?: string;
  duration?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function NotificationToastProgress({
  title,
  message,
  duration = 6,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationToastProgressProps) {
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRunning(true));
    const timer = onDismiss ? setTimeout(onDismiss, duration * 1000) : undefined;
    return () => {
      cancelAnimationFrame(frame);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <svg
          className="mt-0.5 h-5 w-5 flex-none text-blue-700 dark:text-blue-300"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0v-4Z" />
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
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
        <div
          className="h-full bg-blue-600 transition-[width] ease-linear motion-reduce:transition-none dark:bg-blue-400"
          style={{ width: running ? '0%' : '100%', transitionDuration: `${duration}s` }}
        />
      </div>
    </div>
  );
}

export default function NotificationToastProgressPreview() {
  const [runId, setRunId] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div className="w-full max-w-md">
      {visible ? (
        <NotificationToastProgress
          key={runId}
          title="Export started"
          message="We'll email you when the file is ready."
          duration={8}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">Toast dismissed.</p>
      )}

      <button
        type="button"
        onClick={() => {
          setRunId((n) => n + 1);
          setVisible(true);
        }}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Restart preview
      </button>
    </div>
  );
}
