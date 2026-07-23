'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `menu-keyboard-full`.
 *
 * Mirrors the `typescript` code variant verbatim. This is the reference
 * keyboard-menu: arrows wrap top-to-bottom, Home/End jump the ends, Enter/Space
 * activate, Escape closes and restores focus - and a typeahead buffer jumps to
 * the first item that starts with what you type, clearing itself after a pause.
 * Keep this in step with `src/data/components/menus.ts`.
 */
interface KeyItem {
  id: string;
  label: string;
}

interface MenuKeyboardProps {
  label: string;
  items: readonly KeyItem[];
  onSelect?: (id: string) => void;
  defaultOpen?: boolean;
}

const ITEMS: readonly KeyItem[] = [
  { id: 'australia', label: 'Australia' },
  { id: 'brazil', label: 'Brazil' },
  { id: 'canada', label: 'Canada' },
  { id: 'denmark', label: 'Denmark' },
  { id: 'egypt', label: 'Egypt' },
  { id: 'france', label: 'France' },
];

export function MenuKeyboard({ label, items, onSelect, defaultOpen = false }: MenuKeyboardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const typeahead = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function jumpTypeahead(char: string): void {
    typeahead.current += char.toLowerCase();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      typeahead.current = '';
    }, 500);
    const match = items.findIndex((item) => item.label.toLowerCase().startsWith(typeahead.current));
    if (match >= 0) itemsRef.current[match]?.focus();
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const nodes = itemsRef.current.filter((n): n is HTMLButtonElement => n !== null);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const dir = event.key === 'ArrowDown' ? 1 : -1;
      nodes[(((idx + dir) % nodes.length) + nodes.length) % nodes.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      nodes[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      nodes[nodes.length - 1]?.focus();
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      // Typeahead: a single printable key jumps to the next matching label.
      event.preventDefault();
      jumpTypeahead(event.key);
    }
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect?.(item.id);
                close();
              }}
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const minHeight = 320;

export default function MenuKeyboardFullPreview() {
  const [last, setLast] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <MenuKeyboard label="Country" items={ITEMS} onSelect={setLast} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Selected: <span className="font-medium">{last}</span>
      </p>
    </div>
  );
}
