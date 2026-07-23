'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-grouped`.
 *
 * Mirrors the `typescript` code variant verbatim. Hold Arrow Down and watch
 * focus cross the group boundaries without pausing: groups organise the eye,
 * they do not partition the keyboard. The ring is flattened from the DATA, not
 * queried from the DOM - a query would sweep up the section labels and the
 * separators as focus stops.
 *
 * Seeded open, with `pb-` reserving the menu's room: it is absolutely
 * positioned and therefore out of flow, adding nothing to
 * `document.body.scrollHeight` - which is what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface GroupedItem {
  id: string;
  label: string;
  danger?: boolean;
}

interface MenuGroup {
  name: string;
  items: readonly GroupedItem[];
}

const GROUPS: readonly MenuGroup[] = [
  {
    name: 'Editing',
    items: [
      { id: 'rename', label: 'Rename' },
      { id: 'duplicate', label: 'Duplicate' },
    ],
  },
  {
    name: 'Sharing',
    items: [
      { id: 'invite', label: 'Invite people' },
      { id: 'copy-link', label: 'Copy link' },
    ],
  },
  {
    name: 'Danger zone',
    items: [{ id: 'delete', label: 'Delete', danger: true }],
  },
];

interface DropdownGroupedProps {
  label: string;
  items: readonly MenuGroup[];
  onSelect?: (id: string) => void;
  defaultOpen?: boolean;
}

export function DropdownGrouped({ label, items, onSelect, defaultOpen = false }: DropdownGroupedProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const groupIdBase = useId();

  const flat = useMemo(() => items.flatMap((group) => group.items), [items]);

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
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let cursor = -1;

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
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group, groupIndex) => (
            <div key={group.name}>
              {groupIndex > 0 ? (
                <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              ) : null}
              <div role="group" aria-labelledby={`${groupIdBase}-${groupIndex}`}>
                <p
                  id={`${groupIdBase}-${groupIndex}`}
                  aria-hidden="true"
                  className="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {group.name}
                </p>
                {group.items.map((item) => {
                  cursor += 1;
                  const index = cursor;
                  return (
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
                      className={
                        item.danger
                          ? 'block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40'
                          : 'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800'
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownGroupedPreview() {
  const [lastChoice, setLastChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-[22rem] pt-4">
      <DropdownGrouped label="Document" items={GROUPS} onSelect={setLastChoice} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{lastChoice}</span>
      </p>
    </div>
  );
}
