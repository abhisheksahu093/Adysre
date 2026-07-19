'use client';

/**
 * Live preview for `alert-success-solid`.
 *
 * Mirrors the `typescript` code variant. The solid fill is the AA subject: white
 * on the -700/-800 shades clears 4.9-6.8:1, where the -500/-600 everyone reaches
 * for first would fail. The Reset control is preview scaffolding.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useState, type ReactNode } from 'react';

type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

interface AlertSuccessSolidProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

const SOLID_STYLES: Record<AlertSeverity, string> = {
  info: 'bg-blue-700',
  success: 'bg-green-700',
  warning: 'bg-amber-800',
  error: 'bg-red-700',
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

function AlertSuccessSolid({
  title,
  children,
  severity = 'success',
  dismissLabel = 'Dismiss',
  onDismiss,
  className = '',
}: AlertSuccessSolidProps) {
  const [visible, setVisible] = useState<boolean>(true);
  if (!visible) return null;

  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`flex items-start gap-3 rounded-xl px-4 py-3.5 text-white ${SOLID_STYLES[severity]} ${className}`}
    >
      <svg className="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d={SEVERITY_PATHS[severity]} />
      </svg>

      <div className="min-w-0 flex-1">
        {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={`text-sm leading-normal text-white/90 ${title !== undefined ? 'mt-0.5' : ''}`}>
          {children}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setVisible(false);
          onDismiss?.();
        }}
        aria-label={title !== undefined ? `${dismissLabel}: ${title}` : dismissLabel}
        className="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}

export default function AlertSuccessSolidPreview() {
  const [instance, setInstance] = useState<number>(0);

  return (
    <div className="w-full max-w-md">
      <div className="min-h-[4.5rem]">
        <AlertSuccessSolid key={instance} title="Payment received" severity="success">
          Your invoice is settled &ndash; a receipt is on its way to your inbox.
        </AlertSuccessSolid>
      </div>

      <button
        type="button"
        onClick={() => setInstance((n) => n + 1)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}
