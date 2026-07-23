'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `modal-fullscreen`.
 *
 * Mirrors the `typescript` code variant verbatim. Narrow the stage and the
 * panel takes the whole frame with no radius or border; from `sm:` up it
 * collapses back to a centred card. The body carries enough copy to scroll,
 * which is the point of the sticky header and footer - the way out never leaves
 * the screen.
 *
 * The `min-h` wrapper is required: a `position: fixed` overlay adds nothing to
 * `document.body.scrollHeight`, which is what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalFullscreenProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
}

export function ModalFullscreen({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
}: ModalFullscreenProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
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
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-4"
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[100dvh] w-full flex-col bg-white sm:h-auto sm:max-h-[min(85dvh,44rem)] sm:max-w-xl sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl dark:bg-gray-900 dark:sm:border-gray-800"
      >
        <header className="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <footer className="flex flex-none justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function ModalFullscreenPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="flex min-h-[32rem] w-full items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Open settings
      </button>

      <ModalFullscreen
        open={open}
        title="Workspace settings"
        dismissLabel="Close"
        onDismiss={handleDismiss}
      >
        <div className="grid gap-3">
          <p>
            This region is what scrolls. The header and footer are pinned, so the title and both
            actions stay reachable however far down you get.
          </p>
          <p>
            On a phone the panel takes the whole viewport - a centred card with sixteen pixels of
            dimmed backdrop around it wastes the only screen there is.
          </p>
          <p>
            From the small breakpoint up it collapses back into an ordinary dialog, capped at
            85dvh so it never outgrows the window.
          </p>
          <p>
            Height is measured in dvh rather than vh: on mobile Safari, vh includes the collapsing
            URL bar, which would push this footer underneath the browser chrome.
          </p>
          <p>
            The scroll region is a flex child with min-height zero - without that it refuses to
            shrink and shoves the footer off the bottom of the panel instead of scrolling.
          </p>
        </div>
      </ModalFullscreen>
    </div>
  );
}
