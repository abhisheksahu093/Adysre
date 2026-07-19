/**
 * Live preview for `alert-outline`.
 *
 * Mirrors the `typescript` code variant verbatim. No fill: the -700/-300 text
 * and per-severity icon shape do the work, so the alert stays legible on the
 * page's own background in both themes.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import type { ReactNode } from 'react';

type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

interface AlertOutlineProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

const OUTLINE_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300',
  success: 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300',
  warning: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  error: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300',
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

function AlertOutline({ title, children, severity = 'info', className = '' }: AlertOutlineProps) {
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`flex items-start gap-2.5 rounded-lg border bg-transparent px-3.5 py-3 ${OUTLINE_STYLES[severity]} ${className}`}
    >
      <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d={SEVERITY_PATHS[severity]} />
      </svg>
      <div className="min-w-0 flex-1">
        {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={`text-sm leading-normal text-gray-600 dark:text-gray-300 ${title !== undefined ? 'mt-0.5' : ''}`}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default function AlertOutlinePreview() {
  return (
    <div className="w-full max-w-md space-y-3">
      <AlertOutline title="Heads up" severity="info">
        This workspace is in read-only mode while the export runs.
      </AlertOutline>
      <AlertOutline title="Verification pending" severity="warning">
        Confirm your email to unlock outbound sending.
      </AlertOutline>
    </div>
  );
}
