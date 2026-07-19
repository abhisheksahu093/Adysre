'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-checkbox-multi`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. Each row
 * is a `role="menuitemcheckbox"` carrying its own `aria-checked`, and toggling
 * one leaves the menu OPEN - the whole point of multi-select is to tick several
 * without the panel closing under you. The check mark is `aria-hidden`;
 * `aria-checked` is what a screen reader reads.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface Option {
  id: string;
  label: string;
}

const OPTIONS: readonly Option[] = [
  { id: 'design', label: 'Design' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'support', label: 'Support' },
];

interface DropdownCheckboxMultiProps {
  label: string;
  options: readonly Option[];
  value: readonly string[];
  onChange?: (next: string[]) => void;
  defaultOpen?: boolean;
}

function DropdownCheckboxMulti({
  label,
  options,
  value,
  onChange,
  defaultOpen = false,
}: DropdownCheckboxMultiProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    const count = options.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function toggle(id: string): void {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange?.(next);
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
      focusItem(options.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : options.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  const count = value.length;

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
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
        {count > 0 ? (
          <span className="rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white dark:bg-blue-500">
            {count}
          </span>
        ) : null}
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
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {options.map((option, index) => {
            const checked = value.includes(option.id);
            return (
              <li role="none" key={option.id}>
                <button
                  ref={(node) => {
                    itemsRef.current[index] = node;
                  }}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  onClick={() => toggle(option.id)}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
                >
                  <span
                    aria-hidden="true"
                    className={
                      checked
                        ? 'flex h-4 w-4 flex-none items-center justify-center rounded border border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                        : 'flex h-4 w-4 flex-none items-center justify-center rounded border border-gray-300 dark:border-gray-600'
                    }
                  >
                    {checked ? (
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    ) : null}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export default function DropdownCheckboxMultiPreview() {
  const [value, setValue] = useState<string[]>(['engineering']);

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-64 pt-4">
      <DropdownCheckboxMulti label="Teams" options={OPTIONS} value={value} onChange={setValue} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Selected: <span className="font-medium">{value.length > 0 ? value.join(', ') : 'none'}</span>
      </p>
    </div>
  );
}
