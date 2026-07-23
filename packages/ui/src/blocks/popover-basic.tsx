'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `popover-basic`.
 *
 * `PopoverBasic` mirrors the `typescript` code variant verbatim. It is seeded
 * open because a closed trigger shows nothing interesting, and the wrapper
 * carries `pb-` to reserve the panel's room: the panel is absolutely
 * positioned, so it is out of flow and adds nothing to
 * `document.body.scrollHeight` - which is what preview-stage.tsx measures.
 *
 * Everything is live: click the trigger to toggle, press Escape to close (focus
 * lands back on the button), or click anywhere outside.
 *
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface PopoverBasicProps {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function PopoverBasic({ label, children, defaultOpen = false }: PopoverBasicProps) {
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
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3.5 text-sm leading-relaxed text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverBasicPreview() {
  return (
    <div className="flex w-full justify-center pb-40 pt-4">
      <PopoverBasic label="Storage details" defaultOpen>
        You are using{' '}
        <strong className="font-semibold text-gray-900 dark:text-gray-100">18.2 GB</strong> of
        50 GB. Old versions are pruned after 30 days.
      </PopoverBasic>
    </div>
  );
}
