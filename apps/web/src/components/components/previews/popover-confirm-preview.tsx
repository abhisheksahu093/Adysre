'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-confirm`.
 *
 * Mirrors the `typescript` code variant verbatim. It is a `role="alertdialog"`,
 * not a plain dialog: it interrupts to ask about a consequence, so it is
 * labelled by its title and described by its message, and focus lands on the
 * SAFE choice (Cancel) on open - a destructive default one keystroke away is a
 * trap. Escape cancels; Enter never fires the destructive path by accident.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface PopoverConfirmProps {
  label: string;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  defaultOpen?: boolean;
}

function PopoverConfirm({
  label,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  defaultOpen = false,
}: PopoverConfirmProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => cancelRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="alertdialog"
          aria-labelledby={titleId}
          aria-describedby={messageId}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p id={messageId} className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {message}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              ref={cancelRef}
              type="button"
              onClick={close}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm?.();
                close();
              }}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverConfirmPreview() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-56 pt-4">
      <PopoverConfirm
        label="Delete file"
        title="Delete this file?"
        message="This permanently removes report.pdf. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => setCount((value) => value + 1)}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Confirmed <span className="font-medium tabular-nums">{count}</span> times
      </p>
    </div>
  );
}
