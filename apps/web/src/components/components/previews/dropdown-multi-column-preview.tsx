'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-multi-column`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. The panel
 * lays its items into balanced columns for scanning, but the ring is the columns
 * flattened in order - Down runs the whole thing top to bottom, wrapping. At
 * 320px the columns collapse to one so nothing is ever pushed off-screen.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface ColumnGroup {
  heading: string;
  items: readonly string[];
}

const COLUMNS: readonly ColumnGroup[] = [
  { heading: 'Sort by', items: ['Newest', 'Oldest', 'A to Z', 'Z to A'] },
  { heading: 'Filter', items: ['Active', 'Archived', 'Draft', 'All'] },
];

interface DropdownMultiColumnProps {
  label: string;
  columns: readonly ColumnGroup[];
  onSelect?: (item: string) => void;
  defaultOpen?: boolean;
}

function DropdownMultiColumn({
  label,
  columns,
  onSelect,
  defaultOpen = false,
}: DropdownMultiColumnProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

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
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-[min(28rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="grid grid-cols-1 gap-x-2 sm:grid-cols-2">
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
                      key={item}
                      ref={(node) => {
                        itemsRef.current[at] = node;
                      }}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelect?.(item);
                        close();
                      }}
                      className="block w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
                    >
                      {item}
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

export default function DropdownMultiColumnPreview() {
  const [lastChoice, setLastChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-64 pt-4">
      <DropdownMultiColumn label="View" columns={COLUMNS} onSelect={setLastChoice} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{lastChoice}</span>
      </p>
    </div>
  );
}
