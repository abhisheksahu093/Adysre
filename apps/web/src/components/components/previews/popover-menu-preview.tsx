'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-menu`.
 *
 * Mirrors the `typescript` code variant verbatim. The keyboard model is the
 * component, so exercise it: Arrow Down/Up move between items and wrap at both
 * ends, Home and End jump to the extremes, Escape closes and puts focus back on
 * the trigger. The harness echoes the last choice.
 *
 * Seeded open, with `pb-` reserving the menu's room: it is absolutely
 * positioned and therefore out of flow, adding nothing to
 * `document.body.scrollHeight` - what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/popover.ts`.
 */
const MENU_ITEMS: readonly string[] = ['Rename', 'Duplicate', 'Move to…', 'Archive'];

interface PopoverMenuProps {
  label: string;
  items: readonly string[];
  onSelect?: (item: string) => void;
  defaultOpen?: boolean;
}

function PopoverMenu({ label, items, onSelect, defaultOpen = false }: PopoverMenuProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();

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
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
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
        aria-controls={listId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <ul
          id={listId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function PopoverMenuPreview() {
  const [lastChoice, setLastChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-56 pt-4">
      <PopoverMenu label="Actions" items={MENU_ITEMS} onSelect={setLastChoice} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{lastChoice}</span>
      </p>
    </div>
  );
}
