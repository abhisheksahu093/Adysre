'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-color-swatches`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. Picking a
 * colour is choosing a VALUE, so this is a `role="listbox"` of `role="option"`,
 * not a menu - `aria-selected` marks the current one and Enter/Space commit it.
 * Arrows move in two dimensions across the grid (Left/Right by one, Up/Down by a
 * row). The swatch background is the only place a raw colour value is allowed:
 * here the colour IS the data.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface Swatch {
  name: string;
  value: string;
}

const COLORS: readonly Swatch[] = [
  { name: 'Slate', value: '#64748b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];

const COLUMNS = 5;

interface DropdownColorSwatchesProps {
  label: string;
  colors: readonly Swatch[];
  value: string;
  onChange?: (value: string) => void;
  defaultOpen?: boolean;
}

function DropdownColorSwatches({
  label,
  colors,
  value,
  onChange,
  defaultOpen = false,
}: DropdownColorSwatchesProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    colors.findIndex((color) => color.value === value),
  );
  const current = colors[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = colors.length;
    if (count === 0) return;
    itemsRef.current[Math.min(Math.max(index, 0), count - 1)]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
    }
  }

  function onOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const count = colors.length;
    if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusItem(count - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusItem(Math.min(index + 1, count - 1));
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusItem(Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(index + COLUMNS < count ? index + COLUMNS : index);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(index - COLUMNS >= 0 ? index - COLUMNS : index);
    }
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(selectedIndex));
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 flex-none rounded-full ring-1 ring-inset ring-black/10"
          style={{ backgroundColor: current?.value ?? 'transparent' }}
        />
        {current?.name ?? label}
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
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 grid max-w-[calc(100vw-2rem)] grid-cols-5 gap-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {colors.map((color, index) => {
            const selected = index === selectedIndex;
            return (
              <button
                key={color.value}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={color.name}
                tabIndex={selected ? 0 : -1}
                onKeyDown={(event) => onOptionKeyDown(event, index)}
                onClick={() => {
                  onChange?.(color.value);
                  close();
                }}
                className={
                  selected
                    ? 'flex h-9 w-9 items-center justify-center rounded-lg ring-2 ring-blue-600 ring-offset-2 ring-offset-white focus-visible:outline-none dark:ring-blue-400 dark:ring-offset-gray-900'
                    : 'flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-white/10 dark:focus-visible:ring-blue-400'
                }
                style={{ backgroundColor: color.value }}
              >
                {selected ? (
                  <svg
                    className="h-4 w-4 text-white drop-shadow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownColorSwatchesPreview() {
  const [value, setValue] = useState('#3b82f6');
  const name = COLORS.find((color) => color.value === value)?.name ?? value;

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-40 pt-4">
      <DropdownColorSwatches label="Colour" colors={COLORS} value={value} onChange={setValue} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Value: <span className="font-medium">{name}</span>
      </p>
    </div>
  );
}
