'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `modal-side-panel`.
 *
 * Mirrors the `typescript` code variant with the overlay scoped to this stage.
 * A right-hand sheet: full-width on a phone, capped at `max-w-md` from there up,
 * so it never exceeds the viewport. The slide is a `translate-x` transform, so
 * it composites cleanly; it needs a paint at `translate-x-full` before the flip,
 * which the entered flag provides. `motion-reduce` drops the travel.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalSidePanelProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
}

function ModalSidePanel({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
}: ModalSidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const raf = window.requestAnimationFrame(() => setEntered(true));
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => window.cancelAnimationFrame(raf);
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
    <div className="absolute inset-0 z-50 flex justify-end" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex h-full w-full max-w-md flex-col overflow-hidden border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 ${
          entered ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="flex-none border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export const minHeight = 440;

export default function ModalSidePanelPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[440px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Edit profile
      </button>

      <ModalSidePanel open={open} title="Edit profile" dismissLabel="Close" onDismiss={handleDismiss}>
        Update your display name, role and notification settings. Changes apply across every
        workspace you belong to as soon as you save.
      </ModalSidePanel>
    </div>
  );
}
