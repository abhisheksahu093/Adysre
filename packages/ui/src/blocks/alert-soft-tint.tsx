/**
 * Live preview for `alert-soft-tint`.
 *
 * Mirrors the `typescript` code variant verbatim. The icon rides in a tinted
 * chip so the severity reads as a shape-in-a-swatch, while the body copy uses
 * the neutral gray ramp for calm long-form contrast.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import type { ReactNode } from 'react';

type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

interface AlertSoftTintProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

const TINT_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-100 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/40',
  success: 'border-green-100 bg-green-50/70 dark:border-green-900/60 dark:bg-green-950/40',
  warning: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/40',
  error: 'border-red-100 bg-red-50/70 dark:border-red-900/60 dark:bg-red-950/40',
};

const CHIP_STYLES: Record<AlertSeverity, string> = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
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

export function AlertSoftTint({ title, children, severity = 'info', className = '' }: AlertSoftTintProps) {
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${TINT_STYLES[severity]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${CHIP_STYLES[severity]}`}
      >
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        {title !== undefined ? (
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        ) : null}
        <p className={`text-sm leading-normal text-gray-700 dark:text-gray-300 ${title !== undefined ? 'mt-0.5' : ''}`}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default function AlertSoftTintPreview() {
  return (
    <div className="w-full max-w-md">
      <AlertSoftTint title="Sync in progress" severity="info">
        We&rsquo;re importing your contacts. This usually takes under a minute.
      </AlertSoftTint>
    </div>
  );
}
