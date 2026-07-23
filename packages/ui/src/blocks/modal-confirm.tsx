'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-confirm`.
 *
 * Mirrors the `typescript` code variant verbatim. Try it with the keyboard: the
 * dialog opens with focus on CANCEL, not Delete - press Enter the instant it
 * appears and nothing is destroyed, which is the entire point. Escape resolves
 * to cancel too. The harness echoes the outcome so the two paths are visibly
 * different.
 *
 * The `min-h` wrapper is required: a `position: fixed` overlay adds nothing to
 * `document.body.scrollHeight`, which is what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalConfirmProps {
  open: boolean;
  title: string;
  message: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ModalConfirm({
  open,
  title,
  message,
  ctaLabel = 'Delete',
  dismissLabel = 'Cancel',
  onConfirm,
  onDismiss,
}: ModalConfirmProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    cancelRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
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
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
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
        <div className="mt-6 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onDismiss}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModalConfirmPreview() {
  const [open, setOpen] = useState(true);
  const [outcome, setOutcome] = useState('Nothing yet');

  const handleDismiss = useCallback(() => {
    setOpen(false);
    setOutcome('Cancelled - nothing was deleted');
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    setOutcome('Confirmed - workspace deleted');
  }, []);

  return (
    <div className="flex min-h-96 w-full flex-col items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Delete workspace
      </button>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last outcome: <span className="font-medium">{outcome}</span>
      </p>

      <ModalConfirm
        open={open}
        title="Delete workspace?"
        message="This deletes 428 projects and removes 12 members. It cannot be undone."
        ctaLabel="Delete"
        dismissLabel="Cancel"
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
