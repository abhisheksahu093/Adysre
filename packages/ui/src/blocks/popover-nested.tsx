'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-nested`.
 *
 * Mirrors the `typescript` code variant verbatim. A `role="menu"` whose last
 * item opens a nested `role="menu"`: `aria-haspopup="menu"` and `aria-expanded`
 * describe the branch, ArrowRight/Enter open it, ArrowLeft/Escape step back. The
 * submenu flies out to the right on `sm+` but stacks inline at 320px, so it
 * never escapes a narrow viewport. Leaf clicks close the whole tree.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
const ITEMS: readonly string[] = ['Rename', 'Duplicate'];
const MOVE_ITEMS: readonly string[] = ['Inbox', 'Projects', 'Archive'];

interface PopoverNestedProps {
  label: string;
  items: readonly string[];
  moreLabel: string;
  moreItems: readonly string[];
  onSelect?: (item: string) => void;
  defaultOpen?: boolean;
  defaultSubOpen?: boolean;
}

export function PopoverNested({
  label,
  items,
  moreLabel,
  moreItems,
  onSelect,
  defaultOpen = false,
  defaultSubOpen = false,
}: PopoverNestedProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [subOpen, setSubOpen] = useState(defaultSubOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const subTriggerRef = useRef<HTMLButtonElement>(null);
  const firstSubRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const subId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSubOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function closeAll(): void {
    setOpen(false);
    setSubOpen(false);
    triggerRef.current?.focus();
  }

  function openSub(): void {
    setSubOpen(true);
    window.requestAnimationFrame(() => firstSubRef.current?.focus());
  }

  function closeSub(): void {
    setSubOpen(false);
    subTriggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      if (subOpen) closeSub();
      else closeAll();
    }
  }

  function choose(item: string): void {
    onSelect?.(item);
    closeAll();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((state) => !state)}
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
          {items.map((item) => (
            <li role="none" key={item}>
              <button
                type="button"
                role="menuitem"
                onClick={() => choose(item)}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
              >
                {item}
              </button>
            </li>
          ))}

          <li role="none" className="relative">
            <button
              ref={subTriggerRef}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={subOpen}
              aria-controls={subId}
              onClick={() => (subOpen ? closeSub() : openSub())}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openSub();
                }
              }}
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
            >
              {moreLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
              </svg>
            </button>

            {subOpen ? (
              <ul
                id={subId}
                role="menu"
                aria-label={moreLabel}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    closeSub();
                  }
                }}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-1 shadow-lg sm:absolute sm:left-full sm:top-0 sm:mt-0 sm:ml-1 sm:w-44 dark:border-gray-700 dark:bg-gray-900"
              >
                {moreItems.map((item, index) => (
                  <li role="none" key={item}>
                    <button
                      ref={index === 0 ? firstSubRef : undefined}
                      type="button"
                      role="menuitem"
                      onClick={() => choose(item)}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export default function PopoverNestedPreview() {
  const [choice, setChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-64 pt-4">
      <PopoverNested
        label="Actions"
        items={ITEMS}
        moreLabel="Move to…"
        moreItems={MOVE_ITEMS}
        onSelect={setChoice}
        defaultOpen
        defaultSubOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{choice}</span>
      </p>
    </div>
  );
}
