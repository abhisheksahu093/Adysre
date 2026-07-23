'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-nested`.
 *
 * Mirrors the `typescript` code variant verbatim. The direction IS the model -
 * arrow down to "Embed", press ArrowRight to open the flyout, ArrowLeft to step
 * back out onto the parent. Escape inside the submenu closes one level, not the
 * whole stack; that is the detail most implementations miss.
 *
 * Both menus are seeded open, and the wrapper carries `pb-` to reserve their
 * room: they are absolutely positioned and therefore out of flow, adding
 * nothing to `document.body.scrollHeight` - which is what preview-stage.tsx
 * measures.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface NestedChild {
  id: string;
  label: string;
}

interface NestedItem {
  id: string;
  label: string;
  items?: readonly NestedChild[];
}

const ITEMS: readonly NestedItem[] = [
  { id: 'text', label: 'Text block' },
  { id: 'image', label: 'Image' },
  {
    id: 'embed',
    label: 'Embed',
    items: [
      { id: 'video', label: 'Video' },
      { id: 'sandbox', label: 'Code sandbox' },
      { id: 'figma', label: 'Figma frame' },
    ],
  },
  { id: 'divider', label: 'Divider' },
];

const ITEM_CLASS =
  'flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

interface DropdownNestedProps {
  label: string;
  items: readonly NestedItem[];
  onSelect?: (id: string) => void;
  defaultOpen?: boolean;
  defaultOpenSub?: number | null;
}

export function DropdownNested({
  label,
  items,
  onSelect,
  defaultOpen = false,
  defaultOpenSub = null,
}: DropdownNestedProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [openSub, setOpenSub] = useState<number | null>(defaultOpenSub);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<Array<HTMLButtonElement | null>>([]);
  const subRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setOpenSub(null);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusTop(index: number): void {
    const count = items.length;
    topRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    setOpenSub(null);
    triggerRef.current?.focus();
  }

  function onSubKeyDown(
    event: KeyboardEvent<HTMLUListElement>,
    parentIndex: number,
    subCount: number,
  ): void {
    const index = subRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpenSub(null);
      topRef.current[parentIndex]?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    event.stopPropagation();
    const next = index + (event.key === 'ArrowDown' ? 1 : -1);
    subRef.current[((next % subCount) + subCount) % subCount]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    const index = topRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    if (event.key === 'ArrowRight' && items[index]?.items) {
      event.preventDefault();
      setOpenSub(index);
      window.requestAnimationFrame(() => subRef.current[0]?.focus());
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusTop(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusTop(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setOpenSub(null);
    focusTop(event.key === 'ArrowDown' ? index + 1 : index - 1);
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
          if (next) window.requestAnimationFrame(() => focusTop(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id} className={item.items ? 'relative' : undefined}>
              <button
                ref={(node) => {
                  topRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                {...(item.items
                  ? { 'aria-haspopup': 'menu' as const, 'aria-expanded': openSub === index }
                  : {})}
                onClick={() => {
                  if (item.items) {
                    const next = openSub === index ? null : index;
                    setOpenSub(next);
                    if (next !== null) {
                      window.requestAnimationFrame(() => subRef.current[0]?.focus());
                    }
                    return;
                  }
                  onSelect?.(item.id);
                  close();
                }}
                className={ITEM_CLASS}
              >
                {item.label}
                {item.items ? (
                  <svg
                    className="h-3.5 w-3.5 flex-none text-gray-500 dark:text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                ) : null}
              </button>

              {item.items && openSub === index ? (
                <ul
                  role="menu"
                  aria-label={item.label}
                  onKeyDown={(event) => onSubKeyDown(event, index, item.items?.length ?? 0)}
                  className="absolute left-0 right-0 top-full mt-1 z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg sm:left-[calc(100%-0.25rem)] sm:right-auto sm:-top-1 sm:mt-0 dark:border-gray-700 dark:bg-gray-900"
                >
                  {item.items.map((child, childIndex) => (
                    <li role="none" key={child.id}>
                      <button
                        ref={(node) => {
                          subRef.current[childIndex] = node;
                        }}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSelect?.(child.id);
                          close();
                        }}
                        className={ITEM_CLASS}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function DropdownNestedPreview() {
  const [lastChoice, setLastChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-64 pt-4">
      <DropdownNested
        label="Insert"
        items={ITEMS}
        onSelect={setLastChoice}
        defaultOpen
        defaultOpenSub={2}
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{lastChoice}</span>
      </p>
    </div>
  );
}
