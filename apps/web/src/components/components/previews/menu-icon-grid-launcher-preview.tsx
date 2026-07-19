'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `menu-icon-grid-launcher`.
 *
 * Mirrors the `typescript` code variant verbatim. An app-launcher grid: the
 * popover is a `role="menu"` and each tile a `role="menuitem"`, but because the
 * items are laid out in a grid the arrow keys move in two dimensions -
 * Left/Right by one, Up/Down by a full row. Escape closes and returns focus to
 * the trigger. Keep this in step with `src/data/components/menus.ts`.
 */
interface LaunchTile {
  id: string;
  label: string;
  gradient: string;
}

interface MenuIconGridProps {
  label: string;
  tiles: readonly LaunchTile[];
  columns?: number;
  onLaunch?: (id: string) => void;
  defaultOpen?: boolean;
}

const TILES: readonly LaunchTile[] = [
  { id: 'mail', label: 'Mail', gradient: 'from-sky-500 to-blue-600' },
  { id: 'calendar', label: 'Calendar', gradient: 'from-rose-500 to-red-600' },
  { id: 'drive', label: 'Drive', gradient: 'from-amber-400 to-orange-500' },
  { id: 'docs', label: 'Docs', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'sheets', label: 'Sheets', gradient: 'from-emerald-500 to-green-600' },
  { id: 'meet', label: 'Meet', gradient: 'from-teal-500 to-cyan-600' },
];

function MenuIconGrid({ label, tiles, columns = 3, onLaunch, defaultOpen = false }: MenuIconGridProps) {
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

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
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
    let next = idx;
    if (event.key === 'ArrowRight') next = idx + 1;
    else if (event.key === 'ArrowLeft') next = idx - 1;
    else if (event.key === 'ArrowDown') next = idx + columns;
    else if (event.key === 'ArrowUp') next = idx - columns;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = nodes.length - 1;
    else return;
    event.preventDefault();
    const n = nodes.length;
    nodes[((next % n) + n) % n]?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="5" cy="5" r="2" />
          <circle cx="12" cy="5" r="2" />
          <circle cx="19" cy="5" r="2" />
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="12" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 grid w-64 gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900"
        >
          {tiles.map((tile, index) => (
            <button
              key={tile.id}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onLaunch?.(tile.id);
                close();
              }}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tile.gradient} text-sm font-bold text-white`}
                aria-hidden="true"
              >
                {tile.label.charAt(0)}
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{tile.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const minHeight = 320;

export default function MenuIconGridLauncherPreview() {
  const [last, setLast] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-end gap-2">
      <MenuIconGrid label="Apps" tiles={TILES} onLaunch={setLast} defaultOpen />
      <p className="w-full text-center text-xs text-gray-600 dark:text-gray-400">
        Last launched: <span className="font-medium">{last}</span>
      </p>
    </div>
  );
}
