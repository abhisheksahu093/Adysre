'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live preview for `fab-multi-action-list`.
 *
 * Two preview-only changes from the `typescript` code variant: the root is
 * `absolute` inside this bounded card rather than `fixed`, and it is seeded OPEN
 * so the labelled list is on screen. Focus rings use `ring-offset-gray-50` to
 * match this card. The real behaviour is unchanged: Escape closes the list and
 * returns focus to the trigger, and each row names itself with visible text.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
interface ActionItem {
  id: string;
  label: string;
  path: string;
}

const ACTIONS: readonly ActionItem[] = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7' },
  {
    id: 'invite',
    label: 'Invite teammate',
    path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  },
];

export const minHeight = 288;

export default function FabMultiActionListPreview() {
  const [open, setOpen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <div className="relative min-h-72 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Each row names itself - press Escape to collapse and return focus.
      </p>

      <div ref={rootRef} className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
        {open ? (
          <ul id="fab-multi-action-list-preview-actions" className="flex flex-col items-end gap-2">
            {ACTIONS.map((action) => (
              <li key={action.id}>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white pl-3 pr-4 text-sm font-medium text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
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
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="fab-multi-action-list-preview-actions"
          aria-label={open ? 'Close quick actions' : 'Open quick actions'}
          onClick={() => (open ? close() : setOpen(true))}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg
            className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (open ? 'rotate-45' : '')}
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
