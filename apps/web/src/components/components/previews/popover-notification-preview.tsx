'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-notification`.
 *
 * Mirrors the `typescript` code variant verbatim. A bell trigger whose unread
 * count is announced (not just painted) via an `aria-label`, opening a
 * `role="dialog"` list. The panel anchors to the trigger's right edge so it does
 * not run off-screen under a top-right bell, and stays inside the viewport with
 * `max-w-[calc(100vw-2rem)]`. Escape closes with focus restored.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface Note {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

const NOTES: readonly Note[] = [
  { id: '1', title: 'Mara approved your pull request', time: '2m ago', unread: true },
  { id: '2', title: 'Build #4821 finished in 3m 12s', time: '18m ago', unread: true },
  { id: '3', title: 'Weekly digest is ready', time: '1h ago', unread: false },
];

interface PopoverNotificationProps {
  label: string;
  notes: readonly Note[];
  onMarkAllRead?: () => void;
  defaultOpen?: boolean;
}

function PopoverNotification({
  label,
  notes,
  onMarkAllRead,
  defaultOpen = false,
}: PopoverNotificationProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [items, setItems] = useState<readonly Note[]>(notes);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  const unreadCount = items.filter((item) => item.unread).length;

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

  function markAllRead(): void {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    onMarkAllRead?.();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label}, ${unreadCount} unread`}
        onClick={() => setOpen((state) => !state)}
        className="relative rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[0.6rem] font-semibold text-white"
          >
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between px-2 py-1">
            <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {label}
            </h3>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="rounded text-xs font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:text-gray-400 disabled:no-underline dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:disabled:text-gray-600"
            >
              Mark all read
            </button>
          </div>
          <ul className="mt-1 flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.unread ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}`}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-800 dark:text-gray-200">{item.title}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverNotificationPreview() {
  return (
    <div className="flex w-full justify-center pb-64 pt-4">
      <PopoverNotification label="Notifications" notes={NOTES} defaultOpen />
    </div>
  );
}
