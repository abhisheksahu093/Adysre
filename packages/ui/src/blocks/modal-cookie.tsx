'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-cookie`.
 *
 * Mirrors the `typescript` code variant with the overlay scoped to this stage.
 * A consent dialog with three real choices - Accept all, Reject non-essential,
 * and Manage - rather than a single "OK" that consents by exhaustion. Focus
 * opens on Reject, the least committal option. Escape resolves to onDismiss (a
 * reject), never to a silent accept.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalCookieProps {
  open: boolean;
  title: string;
  message: string;
  onAccept: () => void;
  onReject: () => void;
  onManage: () => void;
  onDismiss: () => void;
}

export function ModalCookie({
  open,
  title,
  message,
  onAccept,
  onReject,
  onManage,
  onDismiss,
}: ModalCookieProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const rejectRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    rejectRef.current?.focus();
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
    <div
      className="absolute inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onAccept}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Accept all
          </button>
          <button
            ref={rejectRef}
            type="button"
            onClick={onReject}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Reject non-essential
          </button>
        </div>
        <button
          type="button"
          onClick={onManage}
          className="mt-3 inline-flex min-h-[40px] items-center text-sm font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400"
        >
          Manage preferences
        </button>
      </div>
    </div>
  );
}

export const minHeight = 400;

export default function ModalCookiePreview() {
  const [open, setOpen] = useState(true);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Show cookie notice
      </button>

      <ModalCookie
        open={open}
        title="We value your privacy"
        message="We use cookies to keep you signed in and to understand how the product is used. You can accept all, reject the non-essential ones, or choose which to allow."
        onAccept={handleClose}
        onReject={handleClose}
        onManage={handleClose}
        onDismiss={handleClose}
      />
    </div>
  );
}
