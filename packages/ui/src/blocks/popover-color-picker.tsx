'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-color-picker`.
 *
 * Mirrors the `typescript` code variant verbatim. Swatches are `role="radio"`
 * inside a `role="radiogroup"` - a colour choice is a single-select, and that
 * pairing is what makes a screen reader announce "3 of 8, selected". Each swatch
 * carries an `aria-label` because a colour block has no text of its own. Escape
 * closes with focus restored to the trigger.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface Swatch {
  name: string;
  swatch: string;
}

const SWATCHES: readonly Swatch[] = [
  { name: 'Slate', swatch: 'bg-slate-500' },
  { name: 'Red', swatch: 'bg-red-500' },
  { name: 'Amber', swatch: 'bg-amber-500' },
  { name: 'Green', swatch: 'bg-green-500' },
  { name: 'Teal', swatch: 'bg-teal-500' },
  { name: 'Blue', swatch: 'bg-blue-500' },
  { name: 'Violet', swatch: 'bg-violet-500' },
  { name: 'Pink', swatch: 'bg-pink-500' },
];

interface PopoverColorPickerProps {
  label: string;
  colors: readonly Swatch[];
  value?: string;
  onChange?: (name: string) => void;
  defaultOpen?: boolean;
}

export function PopoverColorPicker({
  label,
  colors,
  value,
  onChange,
  defaultOpen = false,
}: PopoverColorPickerProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [selected, setSelected] = useState(value ?? colors[0]?.name ?? '');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  const current = colors.find((color) => color.name === selected) ?? colors[0];

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true" className={`h-3.5 w-3.5 rounded-full ${current?.swatch ?? ''}`} />
        {label}: {current?.name}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-2">
            {colors.map((color) => {
              const isActive = color.name === selected;
              return (
                <button
                  key={color.name}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={color.name}
                  onClick={() => {
                    setSelected(color.name);
                    onChange?.(color.name);
                  }}
                  className={`flex h-9 w-full items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${
                    isActive ? 'ring-2 ring-gray-900 ring-offset-2 ring-offset-white dark:ring-gray-100 dark:ring-offset-gray-900' : ''
                  }`}
                >
                  <span className={`h-6 w-6 rounded-full ${color.swatch}`} />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverColorPickerPreview() {
  const [picked, setPicked] = useState('Blue');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-48 pt-4">
      <PopoverColorPicker
        label="Label"
        colors={SWATCHES}
        value="Blue"
        onChange={setPicked}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Picked: <span className="font-medium">{picked}</span>
      </p>
    </div>
  );
}
