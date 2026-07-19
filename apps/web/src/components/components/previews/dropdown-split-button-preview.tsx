'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-split-button`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. The
 * primary half runs the default action on click; only the narrow chevron half
 * owns the menu, so it - not the whole control - carries `aria-haspopup`,
 * `aria-expanded` and its own `aria-label` ("More actions"). The secondary list
 * is an ordinary `role="menu"` with the standard arrow-key ring.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface SplitItem {
  id: string;
  label: string;
}

const ITEMS: readonly SplitItem[] = [
  { id: 'draft', label: 'Save as draft' },
  { id: 'schedule', label: 'Schedule…' },
  { id: 'template', label: 'Save as template' },
  { id: 'discard', label: 'Discard changes' },
];

interface DropdownSplitButtonProps {
  label: string;
  items: readonly SplitItem[];
  onPrimary?: () => void;
  onSelect?: (id: string) => void;
  defaultOpen?: boolean;
}

function DropdownSplitButton({
  label,
  items,
  onPrimary,
  onSelect,
  defaultOpen = false,
}: DropdownSplitButtonProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = items.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    toggleRef.current?.focus();
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
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <div className="inline-flex divide-x divide-blue-500 overflow-hidden rounded-lg shadow-sm">
        <button
          type="button"
          onClick={onPrimary}
          className="bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {label}
        </button>
        <button
          ref={toggleRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="More actions"
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next) window.requestAnimationFrame(() => focusItem(0));
          }}
          className="flex items-center bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500"
        >
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
      </div>

      {open ? (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item.id);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function DropdownSplitButtonPreview() {
  const [note, setNote] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-56 pt-4">
      <DropdownSplitButton
        label="Publish"
        items={ITEMS}
        onPrimary={() => setNote('Publish')}
        onSelect={setNote}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last action: <span className="font-medium">{note}</span>
      </p>
    </div>
  );
}
