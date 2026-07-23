'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';

/**
 * Live preview for `menu-context-right-click`.
 *
 * Mirrors the `typescript` code variant verbatim. The one non-obvious rule: the
 * component calls `preventDefault` on `contextmenu` ONLY inside its own area, so
 * the native browser menu keeps working everywhere else on the page. The menu is
 * positioned relative to the area (not the viewport), so it can never escape the
 * demo stage. Escape or any outside press closes it.
 *
 * Seeded open at a fixed point so the stage shows the menu; in real use it opens
 * where the pointer was. Keep this in step with `src/data/components/menus.ts`.
 */
interface ContextItem {
  id: string;
  label: string;
  danger?: boolean;
}

interface MenuContextProps {
  items: readonly ContextItem[];
  hint?: string;
  onSelect?: (id: string) => void;
  defaultOpenAt?: { x: number; y: number } | null;
}

const ITEMS: readonly ContextItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete', danger: true },
];

export function MenuContext({
  items,
  hint = 'Right-click inside this area',
  onSelect,
  defaultOpenAt = null,
}: MenuContextProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(defaultOpenAt);
  const areaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!pos) return undefined;
    function onDown(event: MouseEvent): void {
      if (!menuRef.current?.contains(event.target as Node)) setPos(null);
    }
    function onKey(event: globalThis.KeyboardEvent): void {
      if (event.key === 'Escape') setPos(null);
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [pos]);

  useEffect(() => {
    if (pos) itemsRef.current[0]?.focus();
  }, [pos]);

  function openAt(event: ReactMouseEvent<HTMLDivElement>): void {
    // Scope: preventDefault only inside this element - the native menu still
    // works on the rest of the page.
    event.preventDefault();
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>): void {
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

  return (
    <div
      ref={areaRef}
      onContextMenu={openAt}
      className="relative flex min-h-44 w-full select-none items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
    >
      {hint}

      {pos ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Actions"
          onKeyDown={onMenuKey}
          style={{ left: pos.x, top: pos.y }}
          className="absolute z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
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
                setPos(null);
              }}
              className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none ${
                item.danger
                  ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                  : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const minHeight = 240;

export default function MenuContextRightClickPreview() {
  const [last, setLast] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <MenuContext items={ITEMS} onSelect={setLast} defaultOpenAt={{ x: 24, y: 24 }} />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last action: <span className="font-medium">{last}</span>
      </p>
    </div>
  );
}
