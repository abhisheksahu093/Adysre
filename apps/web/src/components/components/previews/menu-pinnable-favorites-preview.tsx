'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `menu-pinnable-favorites`.
 *
 * Mirrors the `typescript` code variant verbatim. Each row is a
 * `role="menuitemcheckbox"` whose checked state means "pinned"; toggling it
 * moves the row between the Pinned and All groups without closing the menu. The
 * group headings are `role="presentation"` labels, so arrow-key roving flows
 * across every item regardless of which group it sits in. Keep this in step with
 * `src/data/components/menus.ts`.
 */
interface FavItem {
  id: string;
  label: string;
}

interface MenuPinnableProps {
  label: string;
  items: readonly FavItem[];
  defaultPinned?: readonly string[];
  onChange?: (pinned: readonly string[]) => void;
  defaultOpen?: boolean;
}

const ITEMS: readonly FavItem[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'starred', label: 'Starred' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'sent', label: 'Sent' },
  { id: 'archive', label: 'Archive' },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 flex-none ${filled ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.5 15 8.6l6.7 1-4.85 4.7 1.15 6.7L12 17.9 5.99 21l1.16-6.7L2.3 9.6l6.7-1z" />
    </svg>
  );
}

function MenuPinnable({ label, items, defaultPinned = [], onChange, defaultOpen = false }: MenuPinnableProps) {
  const [pinned, setPinned] = useState<readonly string[]>(defaultPinned);
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

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

  function togglePin(id: string): void {
    const next = pinned.includes(id) ? pinned.filter((value) => value !== id) : [...pinned, id];
    setPinned(next);
    onChange?.(next);
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
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
    }
  }

  const pinnedItems = items.filter((item) => pinned.includes(item.id));
  const otherItems = items.filter((item) => !pinned.includes(item.id));

  const renderRow = (item: FavItem, flatIndex: number, isPinned: boolean) => (
    <button
      key={item.id}
      ref={(node) => {
        itemsRef.current[flatIndex] = node;
      }}
      type="button"
      role="menuitemcheckbox"
      aria-checked={isPinned}
      onClick={() => togglePin(item.id)}
      className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
    >
      <span className="truncate">{item.label}</span>
      <StarIcon filled={isPinned} />
    </button>
  );

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
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {pinnedItems.length > 0 ? (
            <>
              <p role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Pinned
              </p>
              {pinnedItems.map((item, index) => renderRow(item, index, true))}
            </>
          ) : null}

          <p role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            All
          </p>
          {otherItems.map((item, index) => renderRow(item, pinnedItems.length + index, false))}
        </div>
      ) : null}
    </div>
  );
}

export const minHeight = 360;

export default function MenuPinnableFavoritesPreview() {
  const [count, setCount] = useState(2);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <MenuPinnable
        label="Folders"
        items={ITEMS}
        defaultPinned={['inbox', 'starred']}
        onChange={(next) => setCount(next.length)}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Pinned: <span className="font-medium">{count}</span>
      </p>
    </div>
  );
}
