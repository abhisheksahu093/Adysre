'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `modal-drawer-bottom`.
 *
 * Mirrors the `typescript` code variant verbatim. Dismiss and reopen from the
 * trigger to watch the slide - the sheet paints at `translate-y-full` and flips
 * on the next frame, which is the only way the browser has something to
 * transition from. It is still a full modal dialog: focus trapped, Escape
 * closes, backdrop dismisses, focus returned to the trigger.
 *
 * The `min-h` wrapper is required: a `position: fixed` overlay adds nothing to
 * `document.body.scrollHeight`, which is what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalDrawerBottomProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
}

function ModalDrawerBottom({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
}: ModalDrawerBottomProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return undefined;
    }
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const raf = window.requestAnimationFrame(() => setEntered(true));
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      window.cancelAnimationFrame(raf);
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
    <div className="fixed inset-0 z-50 flex items-end justify-center" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-3 shadow-[0_-20px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-900 ${
          entered ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div
          className="mx-auto mb-3 h-1 w-9 rounded-full bg-gray-300 dark:bg-gray-600"
          aria-hidden="true"
        />
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModalDrawerBottomPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="flex min-h-96 w-full items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Choose a plan
      </button>

      <ModalDrawerBottom
        open={open}
        title="Choose a plan"
        dismissLabel="Not now"
        onDismiss={handleDismiss}
      >
        Switch at any time. Changes take effect on the next invoice.
      </ModalDrawerBottom>
    </div>
  );
}
