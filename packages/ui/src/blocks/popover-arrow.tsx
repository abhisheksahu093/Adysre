'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `popover-arrow`.
 *
 * Mirrors the `typescript` code variant verbatim. Flip the stage between light
 * and dark and watch the tail: it is recoloured WITH the panel, which is the
 * thing people get wrong - an arrow left on `bg-white` stays a bright chip stuck
 * to a near-black card. It is a rotated square with only two bordered faces, so
 * it continues the panel's outline rather than drawing a diamond across it.
 *
 * Seeded open, with `pb-` reserving the panel's room: it is absolutely
 * positioned and therefore out of flow, adding nothing to
 * `document.body.scrollHeight` - what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface PopoverArrowProps {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function PopoverArrow({ label, children, defaultOpen = false }: PopoverArrowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-1/2 top-[calc(100%+0.625rem)] z-20 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <span
            aria-hidden="true"
            className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
          />
          <div className="relative text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverArrowPreview() {
  return (
    <div className="flex w-full justify-center pb-44 pt-4">
      <PopoverArrow label="Sync status" defaultOpen>
        Last synced 4 minutes ago. Changes upload automatically when you are back online.
      </PopoverArrow>
    </div>
  );
}
