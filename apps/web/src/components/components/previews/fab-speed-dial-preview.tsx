'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live preview for `fab-speed-dial`.
 *
 * Two preview-only changes from the `typescript` code variant:
 *  - the dial is `absolute` inside this bounded card rather than `fixed` to the
 *    viewport, so it does not float over the gallery page (the stage sizes its
 *    iframe from `document.body.scrollHeight`, which a fixed element does not
 *    contribute to);
 *  - it is seeded OPEN, so the thing the component is about is on screen
 *    without the reader having to find the trigger first.
 *
 * Everything worth trying is real and unchanged: Escape collapses the stack and
 * returns focus to the trigger, opening moves focus to the first action, each
 * action carries its own aria-label, and the plus rotates off `aria-expanded`.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
interface SpeedDialAction {
  id: string;
  label: string;
  path: string;
}

const ACTIONS: readonly SpeedDialAction[] = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7' },
  {
    id: 'invite',
    label: 'Invite teammate',
    path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  },
];

export default function FabSpeedDialPreview() {
  // Seeded open: the expanded stack is the component.
  const [open, setOpen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  // Skips the "move focus into the panel" effect on the seeded first render -
  // a preview that steals focus on load would scroll the gallery page to it.
  const seeded = useRef(true);

  const close = useCallback((): void => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    if (seeded.current) {
      seeded.current = false;
    } else {
      panelRef.current?.querySelector('button')?.focus();
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') close();
    }

    function onPointerDown(event: PointerEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div className="relative min-h-72 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Tab through the actions, then press Escape - focus returns to the trigger.
      </p>

      <div ref={rootRef} className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
        {open ? (
          <ul ref={panelRef} id="fab-speed-dial-preview-actions" className="flex flex-col items-end gap-3">
            {ACTIONS.map((action) => (
              <li key={action.id}>
                <button
                  type="button"
                  aria-label={action.label}
                  onClick={close}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={action.path} />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="fab-speed-dial-preview-actions"
          aria-label={open ? 'Close quick actions' : 'Open quick actions'}
          onClick={() => (open ? close() : setOpen(true))}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg
            className={`h-6 w-6 transition-transform motion-reduce:transition-none ${open ? 'rotate-45' : ''}`}
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
      </div>
    </div>
  );
}
