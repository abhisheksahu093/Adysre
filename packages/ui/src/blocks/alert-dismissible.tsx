'use client';

/**
 * Live preview for `alert-dismissible`.
 *
 * Mirrors the `typescript` code variant, including the focus handling that is
 * the actual subject of the entry: the anchor div outlives the alert, so focus
 * has somewhere to go before the close button stops existing. Tab to the close
 * button and press it - focus lands on the anchor, not back at the top of the
 * document.
 *
 * The Reset control below is preview scaffolding, not part of the component.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useRef, useState, type ReactNode } from 'react';

interface AlertDismissibleProps {
  title?: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

export function AlertDismissible({
  title,
  children,
  dismissLabel = 'Dismiss',
  onDismiss,
  className = '',
}: AlertDismissibleProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleDismiss = (): void => {
    // Focus the anchor BEFORE unmounting. Unmount first and the browser drops
    // focus to <body>, sending keyboard users back to the top of the page.
    anchorRef.current?.focus();
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div ref={anchorRef} tabIndex={-1} className="outline-none">
      {visible ? (
        <div
          role="status"
          className={`flex items-start gap-2.5 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3.5 py-3 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200 ${className}`}
        >
          {/* blue-800 on blue-50 is 8.01:1; blue-200 on blue-950 is 10.34:1. */}
          <svg
            className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
          </svg>

          <div className="min-w-0 flex-1">
            {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
            <p className={`text-sm leading-normal ${title !== undefined ? 'mt-0.5' : ''}`}>
              {children}
            </p>
          </div>

          {/* The name says what it closes - a dozen buttons called "Dismiss"
              are indistinguishable in a screen reader's element list. */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={title !== undefined ? `${dismissLabel}: ${title}` : dismissLabel}
            className="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function AlertDismissiblePreview() {
  // Remounting on a new key restores the alert for the next visitor - the
  // component itself is unchanged.
  const [instance, setInstance] = useState<number>(0);

  return (
    <div className="w-full max-w-md">
      {/* min-h reserves the row so dismissing doesn't collapse the stage and
          bounce the iframe's measured height. */}
      <div className="min-h-[4.5rem]">
        <AlertDismissible key={instance} title="Scheduled maintenance">
          We&rsquo;ll be read-only on Sunday 03:00&ndash;04:00 UTC.
        </AlertDismissible>
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
