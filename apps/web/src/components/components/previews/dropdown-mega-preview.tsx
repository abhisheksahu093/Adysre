'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-mega`.
 *
 * Mirrors the `typescript` code variant verbatim, plus a `defaultOpen` so the
 * panel is visible on the stage. A mega menu is still a menu: every link is a
 * `menuitem` and the arrow-key ring is the columns flattened in reading order,
 * so Down walks column one top-to-bottom then jumps to the top of column two.
 * Columns are for the eye; they never partition the keyboard.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface MegaItem {
  id: string;
  label: string;
  description: string;
}

interface MegaColumn {
  heading: string;
  items: readonly MegaItem[];
}

const COLUMNS: readonly MegaColumn[] = [
  {
    heading: 'Platform',
    items: [
      { id: 'automation', label: 'Automation', description: 'Rules and triggers' },
      { id: 'analytics', label: 'Analytics', description: 'Dashboards and reports' },
      { id: 'workflows', label: 'Workflows', description: 'Multi-step pipelines' },
    ],
  },
  {
    heading: 'Solutions',
    items: [
      { id: 'sales', label: 'Sales', description: 'Pipeline and deals' },
      { id: 'support', label: 'Support', description: 'Tickets and inbox' },
      { id: 'marketing', label: 'Marketing', description: 'Campaigns and email' },
    ],
  },
  {
    heading: 'Developers',
    items: [
      { id: 'api', label: 'API', description: 'REST and webhooks' },
      { id: 'sdks', label: 'SDKs', description: 'Typed clients' },
      { id: 'status', label: 'Status', description: 'Uptime and incidents' },
    ],
  },
];

interface DropdownMegaProps {
  label: string;
  columns: readonly MegaColumn[];
  onSelect?: (id: string) => void;
  defaultOpen?: boolean;
}

function DropdownMega({ label, columns, onSelect, defaultOpen = false }: DropdownMegaProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  // Flatten once: the ring is the source of truth for the keyboard, never the DOM.
  const flat = useMemo(() => columns.flatMap((column) => column.items), [columns]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = flat.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
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
      focusItem(flat.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : flat.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let flatIndex = -1;

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[min(44rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading} role="group" aria-label={column.heading} className="min-w-0">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {column.heading}
                </p>
                {column.items.map((item) => {
                  flatIndex += 1;
                  const at = flatIndex;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        itemsRef.current[at] = node;
                      }}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelect?.(item.id);
                        close();
                      }}
                      className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                    >
                      <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownMegaPreview() {
  const [lastChoice, setLastChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-72 pt-4">
      <DropdownMega label="Products" columns={COLUMNS} onSelect={setLastChoice} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{lastChoice}</span>
      </p>
    </div>
  );
}
