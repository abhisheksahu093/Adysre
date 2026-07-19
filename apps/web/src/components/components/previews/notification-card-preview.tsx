'use client';

/**
 * Live preview for `notification-card`.
 *
 * Mirrors the `typescript` code variant verbatim - the only card in the set
 * that holds state, which is why its Next.js variant carries 'use client' too.
 * Dismiss really dismisses; the wrapper below restores the card so the preview
 * cannot be emptied permanently.
 * Keep this in step with `src/data/components/cards.ts`.
 */
import { useState } from 'react';

type Severity = 'info' | 'success' | 'warning';

interface NotificationCardProps {
  title: string;
  message: string;
  timestamp: string;
  severity?: Severity;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

const SEVERITY_PATHS: Record<Severity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
};

function NotificationCard({
  title,
  message,
  timestamp,
  severity = 'info',
  dismissLabel = 'Dismiss notification',
  onDismiss,
  className = '',
}: NotificationCardProps) {
  const [visible, setVisible] = useState<boolean>(true);

  if (!visible) return null;

  const handleDismiss = (): void => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <article
      role="status"
      className={`flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <span
        className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${SEVERITY_STYLES[severity]}`}
        aria-hidden="true"
      >
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </article>
  );
}

export default function NotificationCardPreview() {
  // Remounting on a new key is how the dismissed card comes back for the
  // next visitor to the stage - the component itself is unchanged.
  const [instance, setInstance] = useState<number>(0);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <NotificationCard
        key={instance}
        title="Backup completed"
        message="All 1,284 records were exported to your S3 bucket."
        timestamp="2 minutes ago"
        severity="success"
      />
      <button
        type="button"
        onClick={() => setInstance((n) => n + 1)}
        className="rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}
