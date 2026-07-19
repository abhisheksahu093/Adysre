'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `modal-scrollable-terms`.
 *
 * Mirrors the `typescript` code variant with the overlay scoped to this stage.
 * The panel is a flex column: a `flex-none` header and footer bracket a
 * `flex-1 min-h-0 overflow-y-auto` body, so the Accept/Decline buttons stay
 * reachable however far you scroll into the terms. `min-h-0` is what lets the
 * body shrink and scroll instead of shoving the footer off the panel.
 *
 * Keep this in step with `src/data/components/modals.ts`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalScrollableTermsProps {
  open: boolean;
  title: string;
  children: ReactNode;
  acceptLabel?: string;
  declineLabel?: string;
  onAccept: () => void;
  onDismiss: () => void;
}

function ModalScrollableTerms({
  open,
  title,
  children,
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
  onAccept,
  onDismiss,
}: ModalScrollableTermsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const declineRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    declineRef.current?.focus();
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
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex-none border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="flex-none border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              ref={declineRef}
              type="button"
              onClick={onDismiss}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {declineLabel}
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {acceptLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const minHeight = 460;

export default function ModalScrollableTermsPreview() {
  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => setOpen(false), []);

  return (
    <div className="relative flex min-h-[460px] w-full items-center justify-center overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Review terms
      </button>

      <ModalScrollableTerms
        open={open}
        title="Terms of Service"
        acceptLabel="Accept"
        declineLabel="Decline"
        onAccept={handleDismiss}
        onDismiss={handleDismiss}
      >
        <p>
          By using this service you agree to the terms below. Please read them in full before
          continuing.
        </p>
        <p>
          1. Accounts. You are responsible for keeping your credentials secure and for all activity
          that happens under your account.
        </p>
        <p>
          2. Acceptable use. You agree not to misuse the service, interfere with its operation, or
          attempt to access it using a method other than the interface we provide.
        </p>
        <p>
          3. Content. You retain ownership of the content you submit. You grant us a limited license
          to store and display it solely to operate the service.
        </p>
        <p>
          4. Privacy. We process personal data as described in our Privacy Policy, which forms part
          of these terms.
        </p>
        <p>
          5. Termination. You may stop using the service at any time. We may suspend access if these
          terms are violated.
        </p>
        <p>
          6. Changes. We may update these terms; continued use after a change means you accept the
          revised version.
        </p>
      </ModalScrollableTerms>
    </div>
  );
}
