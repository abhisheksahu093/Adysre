'use client';

/**
 * Live preview for `notification-permission-prompt`.
 *
 * Mirrors the `typescript` code variant. Both choices are real buttons; the
 * preview records the choice and Reset restores the prompt. Keep this in step
 * with `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

interface NotificationPermissionPromptProps {
  title?: string;
  description?: string;
  allowLabel?: string;
  dismissLabel?: string;
  onAllow?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function NotificationPermissionPrompt({
  title = 'Turn on notifications?',
  description,
  allowLabel = 'Allow',
  dismissLabel = 'Not now',
  onAllow,
  onDismiss,
  className = '',
}: NotificationPermissionPromptProps) {
  return (
    <section
      aria-labelledby="preview-perm-title"
      className={`w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="preview-perm-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {description !== undefined ? (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {dismissLabel}
        </button>
        <button
          type="button"
          onClick={onAllow}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {allowLabel}
        </button>
      </div>
    </section>
  );
}

type Choice = 'idle' | 'allowed' | 'dismissed';

export default function NotificationPermissionPromptPreview() {
  const [choice, setChoice] = useState<Choice>('idle');

  return (
    <div className="w-full max-w-sm">
      {choice === 'idle' ? (
        <NotificationPermissionPrompt
          description="Get notified about mentions and replies, even when this tab is closed."
          onAllow={() => setChoice('allowed')}
          onDismiss={() => setChoice('dismissed')}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {choice === 'allowed' ? 'Notifications enabled.' : 'Maybe later.'}
          <button
            type="button"
            onClick={() => setChoice('idle')}
            className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            Reset preview
          </button>
        </div>
      )}
    </div>
  );
}

export const minHeight = 240;
