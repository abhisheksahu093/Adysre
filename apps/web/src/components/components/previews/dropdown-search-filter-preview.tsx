'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-search-filter`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. A search
 * field narrows the menu as you type; ArrowDown drops focus from the field onto
 * the first match, the item ring wraps, and ArrowUp off the top row returns to
 * the field. The field owns `aria-controls`/`aria-expanded`, the list stays a
 * `role="menu"` of actions.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
const ITEMS: readonly string[] = [
  'Assign to me',
  'Add label',
  'Move to project',
  'Set due date',
  'Convert to task',
  'Archive',
  'Delete',
];

interface DropdownSearchFilterProps {
  label: string;
  items: readonly string[];
  searchPlaceholder?: string;
  onSelect?: (item: string) => void;
  defaultOpen?: boolean;
}

function DropdownSearchFilter({
  label,
  items,
  searchPlaceholder = 'Search…',
  onSelect,
  defaultOpen = false,
}: DropdownSearchFilterProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  const filtered = useMemo(
    () => items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query],
  );

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = filtered.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
    }
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(0);
    }
  }

  function onItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusItem(filtered.length - 1);
      return;
    }
    if (event.key === 'ArrowUp' && index === 0) {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
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
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => inputRef.current?.focus());
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
        <div className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="p-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              aria-controls={menuId}
              className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <ul id={menuId} role="menu" aria-label={label} className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400" role="none">
                No matches
              </li>
            ) : (
              filtered.map((item, index) => (
                <li role="none" key={item}>
                  <button
                    ref={(node) => {
                      itemsRef.current[index] = node;
                    }}
                    type="button"
                    role="menuitem"
                    onKeyDown={(event) => onItemKeyDown(event, index)}
                    onClick={() => {
                      onSelect?.(item);
                      close();
                    }}
                    className="block w-full truncate rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
                  >
                    {item}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownSearchFilterPreview() {
  const [lastChoice, setLastChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-72 pt-4">
      <DropdownSearchFilter label="Actions" items={ITEMS} onSelect={setLastChoice} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{lastChoice}</span>
      </p>
    </div>
  );
}
