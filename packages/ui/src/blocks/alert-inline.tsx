'use client';

/**
 * Live preview for `alert-inline`.
 *
 * Mirrors the `typescript` code variant, rendered once per severity - the point
 * of this entry is the four-way map, which one example can't show.
 *
 * Note the roles differ by severity: only `error` gets the assertive
 * `role="alert"`. That's not visible on screen, which is exactly why it's worth
 * saying here.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import type { ReactNode } from 'react';

type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

/**
 * Measured, not guessed. On the -50 tints: blue-800 8.01:1, green-800 6.81:1,
 * amber-800 6.84:1, red-800 7.60:1. On the -950 tints: blue-200 10.34:1,
 * green-200 12.30:1, amber-200 12.03:1, red-200 11.16:1. The -500 shades that
 * suggest themselves first land near 2-3:1 on white and fail AA outright.
 */
const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

/** Four shapes, not four colours of one circle - it has to survive greyscale. */
const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

interface AlertInlineProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

export function AlertInline({ title, children, severity = 'info', className = '' }: AlertInlineProps) {
  // Assertive for errors only. "Domain verified" does not get to interrupt.
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`flex items-start gap-2.5 rounded-[0.625rem] border px-3.5 py-3 ${SEVERITY_STYLES[severity]} ${className}`}
    >
      <svg
        className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={SEVERITY_PATHS[severity]} />
      </svg>

      <div className="min-w-0 flex-1">
        {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={`text-sm leading-normal ${title !== undefined ? 'mt-0.5' : ''}`}>{children}</p>
      </div>
    </div>
  );
}

export default function AlertInlinePreview() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <AlertInline severity="error" title="Payment declined">
        Your card was declined by the issuer. Try another card.
      </AlertInline>

      <AlertInline severity="warning" title="Key expires in 3 days">
        Rotate it before Friday or scheduled jobs will start failing.
      </AlertInline>

      <AlertInline severity="success">Domain verified.</AlertInline>

      <AlertInline severity="info">Exports run nightly at 02:00 UTC.</AlertInline>
    </div>
  );
}
