'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-success`.
 *
 * Mirrors the `typescript` code variant, with the overlay scoped to this stage
 * (`absolute inset-0` in a `relative` box) so only the preview dims. Production
 * code is `fixed` and locks body scroll. The check mark scales in once and the
 * motion is dropped under `motion-reduce`.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalSuccessProps {
  open: boolean;
  title: string;
  message: string;
  ctaLabel?: string;
  onDismiss: () => void;
}

function ModalSuccess({ open, title, message, ctaLabel = 'Done', onDismiss }: ModalSuccessProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    doneRef.current?.focus();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          className="inline-flex h-12 w-12 origin-center animate-[modal-success-pop_240ms_ease-out] items-center justify-center rounded-full bg-emerald-100 text-emerald-700 motion-reduce:animate-none dark:bg-emerald-900/40 dark:text-emerald-300"
          aria-hidden="true"
        >
          <style>{'@keyframes modal-success-pop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}'}</style>
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="M20 6 9 17l-5-5" />
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
            ref={doneRef}
            type="button"
            onClick={onDismiss}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export const minHeight = 380;

export default function ModalSuccessPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Complete payment
      </button>

      <ModalSuccess
        open={open}
        title="Payment successful"
        message="We have emailed your receipt. Your plan is active and ready to use right away."
        ctaLabel="Done"
        onDismiss={handleDismiss}
      />
    </div>
  );
}
