'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-notification`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. A bell
 * trigger carries an unread count in its `aria-label` (a red dot alone says
 * nothing to a screen reader). The panel is a `role="menu"`: "Mark all read",
 * every notification row, and "View all" share one arrow-key ring in reading
 * order, so the divider never traps focus.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface Notification {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

const ITEMS: readonly Notification[] = [
  { id: 'n1', title: 'Priya commented on “Q3 roadmap”', time: '2m ago', unread: true },
  { id: 'n2', title: 'Deploy to production succeeded', time: '18m ago', unread: true },
  { id: 'n3', title: 'New sign-up: acme.com', time: '1h ago', unread: false },
  { id: 'n4', title: 'Weekly report is ready', time: 'Yesterday', unread: false },
];

interface DropdownNotificationProps {
  items: readonly Notification[];
  onOpen?: (id: string) => void;
  onMarkAll?: () => void;
  onViewAll?: () => void;
  defaultOpen?: boolean;
}

function DropdownNotification({
  items,
  onOpen,
  onMarkAll,
  onViewAll,
  defaultOpen = false,
}: DropdownNotificationProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  const unread = items.filter((item) => item.unread).length;
  const ringLength = items.length + 2;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    if (ringLength === 0) return;
    itemsRef.current[((index % ringLength) + ringLength) % ringLength]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusItem(ringLength - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : ringLength - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread > 0 ? (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"
          />
        ) : null}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
            <button
              ref={(node) => {
                itemsRef.current[0] = node;
              }}
              type="button"
              role="menuitem"
              onClick={onMarkAll}
              className="rounded px-1.5 py-1 text-xs font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
            >
              Mark all read
            </button>
          </div>

          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          <ul className="max-h-64 overflow-y-auto" role="none">
            {items.map((item, index) => (
              <li role="none" key={item.id}>
                <button
                  ref={(node) => {
                    itemsRef.current[index + 1] = node;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onOpen?.(item.id);
                    close();
                  }}
                  className="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                >
                  <span
                    aria-hidden="true"
                    className={
                      item.unread
                        ? 'mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-500'
                        : 'mt-1.5 h-2 w-2 flex-none rounded-full bg-transparent'
                    }
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-gray-800 dark:text-gray-200">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          <button
            ref={(node) => {
              itemsRef.current[items.length + 1] = node;
            }}
            type="button"
            role="menuitem"
            onClick={() => {
              onViewAll?.();
              close();
            }}
            className="block w-full rounded-md px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
          >
            View all
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownNotificationPreview() {
  const [note, setNote] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-80 pt-4">
      <DropdownNotification
        items={ITEMS}
        onOpen={(id) => setNote(`Opened ${id}`)}
        onMarkAll={() => setNote('Marked all read')}
        onViewAll={() => setNote('View all')}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last action: <span className="font-medium">{note}</span>
      </p>
    </div>
  );
}
