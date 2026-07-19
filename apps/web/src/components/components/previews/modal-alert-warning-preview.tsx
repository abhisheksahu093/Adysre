'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-alert-warning`.
 *
 * Mirrors the `typescript` code variant, with one deliberate change: the overlay
 * is `absolute inset-0` inside a `relative` stage instead of `fixed inset-0`, so
 * the backdrop dims only this preview box, never the whole gallery page. The
 * production code in `modals.ts` is `fixed` and locks body scroll.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalAlertWarningProps {
  open: boolean;
  title: string;
  message: string;
  ctaLabel?: string;
  onDismiss: () => void;
}

function ModalAlertWarning({
  open,
  title,
  message,
  ctaLabel = 'Got it',
  onDismiss,
}: ModalAlertWarningProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const ackRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    // A warning is not destructive, so focus lands on the acknowledge button -
    // the single thing this dialog is asking for.
    ackRef.current?.focus();
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6">
          <button
            ref={ackRef}
            type="button"
            onClick={onDismiss}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export const minHeight = 380;

export default function ModalAlertWarningPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Show warning
      </button>

      <ModalAlertWarning
        open={open}
        title="Your session is about to expire"
        message="You have been inactive for a while. Save your work now to avoid losing unsaved changes."
        ctaLabel="Got it"
        onDismiss={handleDismiss}
      />
    </div>
  );
}
