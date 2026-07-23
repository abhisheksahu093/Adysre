'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live preview for `fab-bottom-sheet-trigger`.
 *
 * Preview-only changes from the `typescript` code variant: the trigger and the
 * overlay are `absolute` inside this bounded card rather than `fixed` to the
 * viewport, and the trigger's focus ring offset matches this card
 * (`ring-offset-gray-50`). The behaviour is the shipped one: the sheet is a
 * modal dialog, Escape closes it, focus moves to the first action on open and
 * returns to the trigger on close.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
interface SheetItem {
  id: string;
  label: string;
}

const ITEMS: readonly SheetItem[] = [
  { id: 'doc', label: 'Document' },
  { id: 'sheet', label: 'Spreadsheet' },
  { id: 'folder', label: 'Folder' },
];

export const minHeight = 320;

export function FabBottomSheetTrigger() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    sheetRef.current?.querySelector('button')?.focus();
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <div className="relative min-h-80 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Open the sheet - Escape closes it and returns focus to the trigger.
      </p>

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="fab-bottom-sheet-trigger-preview-sheet"
        aria-label="Create new"
        onClick={() => setOpen(true)}
        className="absolute bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {open ? (
        <div id="fab-bottom-sheet-trigger-preview-sheet" className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/40 motion-safe:animate-in motion-safe:fade-in" onClick={close} />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Create new"
            className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-gray-200 bg-white p-5 shadow-[0_-20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:slide-in-from-bottom dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">Create new</h2>
            <div className="mt-4 grid gap-2">
              {ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={close}
                  className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


export default FabBottomSheetTrigger;
