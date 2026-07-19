'use client';

/**
 * Live preview for `alert-expandable-details`.
 *
 * Mirrors the `typescript` code variant. The trigger is a button carrying
 * aria-expanded/aria-controls, and the revealed detail is a <pre> that scrolls
 * on its own so a long unbreakable log line never widens the stage at 320px.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useId, useState, type ReactNode } from 'react';

type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

interface AlertExpandableDetailsProps {
  title: string;
  summary: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

const PANEL_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const RING_STYLES: Record<AlertSeverity, string> = {
  info: 'focus-visible:ring-blue-700 dark:focus-visible:ring-blue-300',
  success: 'focus-visible:ring-green-700 dark:focus-visible:ring-green-300',
  warning: 'focus-visible:ring-amber-700 dark:focus-visible:ring-amber-300',
  error: 'focus-visible:ring-red-700 dark:focus-visible:ring-red-300',
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

function AlertExpandableDetails({
  title,
  summary,
  children,
  severity = 'error',
  className = '',
}: AlertExpandableDetailsProps) {
  const [open, setOpen] = useState<boolean>(false);
  const panelId: string = useId();
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div role={role} className={`rounded-lg border ${PANEL_STYLES[severity]} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full items-start gap-2.5 rounded-lg px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 ${RING_STYLES[severity]}`}
      >
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="mt-0.5 block text-sm leading-normal">{summary}</span>
        </span>
        <svg
          className={`mt-0.5 h-4 w-4 flex-none transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
      {open ? (
        <div id={panelId} className="border-t border-black/10 px-4 py-3 dark:border-white/10">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default function AlertExpandableDetailsPreview() {
  return (
    <div className="w-full max-w-md">
      <AlertExpandableDetails
        title="Deploy failed"
        summary="The build step exited with code 1. Show details for the log."
        severity="error"
      >
        <pre className="overflow-x-auto rounded bg-red-100/60 p-3 text-xs leading-relaxed dark:bg-red-900/40">
          <code>{'ERR! build exited with code 1\nERR! at Object.compile (/app/src/pipeline.ts:88:14)'}</code>
        </pre>
      </AlertExpandableDetails>
    </div>
  );
}

export const minHeight = 260;
