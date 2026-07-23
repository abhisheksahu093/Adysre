'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `split-button`.
 *
 * Mirrors the `typescript` code variant verbatim. The harness echoes the last
 * action so the two halves are visibly distinct - clicking "Save" and choosing
 * a menu item fire different handlers, which is the entire reason a split
 * button exists. Keep this in step with `src/data/components/buttons.ts`.
 */
interface SplitButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onSelect?: (item: string) => void;
  disabled?: boolean;
}

const MENU_ITEMS: readonly string[] = ['Save and duplicate', 'Save as template', 'Save and close'];

export function SplitButton({ children, onClick, onSelect, disabled = false }: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = MENU_ITEMS.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-flex" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-l-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {children}
      </button>
      <button
        ref={toggleRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More save options"
        disabled={disabled}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex w-9 items-center justify-center rounded-r-lg border-l border-white/30 bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 top-[calc(100%+0.375rem)] z-10 min-w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {MENU_ITEMS.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
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

export default function SplitButtonPreview() {
  const [lastAction, setLastAction] = useState('Nothing yet');

  return (
    <div className="flex flex-col items-center gap-4">
      <SplitButton onClick={() => setLastAction('Save')} onSelect={setLastAction}>
        Save
      </SplitButton>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last action: <span className="font-medium">{lastAction}</span>
      </p>
    </div>
  );
}
