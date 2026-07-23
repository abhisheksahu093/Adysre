'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `modal-stacked`.
 *
 * Mirrors the `typescript` code variant with the overlays scoped to this stage.
 * A base dialog can raise a second dialog on top of it. Two rules keep a stack
 * honest: the second overlay sits at a higher z-index with its own backdrop, and
 * Escape only ever closes the topmost layer - so a user peels the stack one at a
 * time instead of being dumped straight back to the page. Closing the top layer
 * returns focus to the control that opened it, not to the base's first field.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trap(panel: HTMLElement | null, event: KeyboardEvent<HTMLDivElement>): void {
  if (event.key !== 'Tab') return;
  const items = Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
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

interface ModalStackedProps {
  open: boolean;
  onDismiss: () => void;
}

export function ModalStacked({ open, onDismiss }: ModalStackedProps) {
  const basePanelRef = useRef<HTMLDivElement>(null);
  const confirmPanelRef = useRef<HTMLDivElement>(null);
  const reopenRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const baseTitleId = useId();
  const confirmTitleId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmOpen(false);
      return;
    }
    basePanelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [open]);

  useEffect(() => {
    if (confirmOpen) cancelRef.current?.focus();
  }, [confirmOpen]);

  const openConfirm = useCallback(() => {
    reopenRef.current = document.activeElement as HTMLElement | null;
    setConfirmOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    reopenRef.current?.focus();
  }, []);

  if (!open) return null;

  return (
    <>
      <div
        className="absolute inset-0 z-40 flex items-center justify-center p-4"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onDismiss();
            return;
          }
          if (!confirmOpen) trap(basePanelRef.current, e);
        }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
        <div
          ref={basePanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={baseTitleId}
          className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 id={baseTitleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Account settings
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Manage your account. Some actions here are permanent and will ask you to confirm before
            they run.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={openConfirm}
              className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:border-red-900 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950 dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
            >
              Delete account
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {confirmOpen ? (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              closeConfirm();
              return;
            }
            trap(confirmPanelRef.current, e);
          }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={closeConfirm} />
          <div
            ref={confirmPanelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={confirmTitleId}
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <h2
              id={confirmTitleId}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Delete account?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              This removes everything tied to your account and cannot be undone.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                ref={cancelRef}
                type="button"
                onClick={closeConfirm}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeConfirm}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export const minHeight = 420;

export default function ModalStackedPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Open settings
      </button>

      <ModalStacked open={open} onDismiss={handleDismiss} />
    </div>
  );
}
