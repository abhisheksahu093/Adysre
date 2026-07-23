'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `menu-filter-checkbox-menu`.
 *
 * Mirrors the `typescript` code variant verbatim. Each option is a
 * `role="menuitemcheckbox"` with a real `aria-checked` - the one legal way to
 * put a toggle inside a menu - and, unlike a command menu, activating one does
 * NOT close the menu, because filtering is a multi-select act. Arrow keys rove,
 * Escape closes. Keep this in step with `src/data/components/menus.ts`.
 */
interface FilterOption {
  id: string;
  label: string;
}

interface MenuFilterProps {
  label: string;
  options: readonly FilterOption[];
  defaultSelected?: readonly string[];
  onChange?: (selected: readonly string[]) => void;
  defaultOpen?: boolean;
}

const OPTIONS: readonly FilterOption[] = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'in-review', label: 'In review' },
  { id: 'done', label: 'Done' },
];

export function MenuFilter({ label, options, defaultSelected = [], onChange, defaultOpen = false }: MenuFilterProps) {
  const [selected, setSelected] = useState<readonly string[]>(defaultSelected);
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

  function commit(next: readonly string[]): void {
    setSelected(next);
    onChange?.(next);
  }

  function toggle(id: string): void {
    commit(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
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

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
        {selected.length > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white dark:bg-blue-500">
            {selected.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {options.map((option, index) => {
            const checked = selected.includes(option.id);
            return (
              <button
                key={option.id}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitemcheckbox"
                aria-checked={checked}
                onClick={() => toggle(option.id)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
              >
                <span
                  className={`flex h-4 w-4 flex-none items-center justify-center rounded border ${
                    checked
                      ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-hidden="true"
                >
                  {checked ? (
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  ) : null}
                </span>
                {option.label}
              </button>
            );
          })}

          <button
            ref={(node) => {
              itemsRef.current[options.length] = node;
            }}
            type="button"
            role="menuitem"
            onClick={() => commit([])}
            className="mt-1 flex w-full items-center rounded-md border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:bg-gray-100 focus-visible:outline-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:bg-gray-800"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}

export const minHeight = 300;

export default function MenuFilterCheckboxMenuPreview() {
  const [count, setCount] = useState(2);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <MenuFilter
        label="Status"
        options={OPTIONS}
        defaultSelected={['in-progress', 'in-review']}
        onChange={(next) => setCount(next.length)}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Active filters: <span className="font-medium">{count}</span>
      </p>
    </div>
  );
}
