'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-date-mini`.
 *
 * Mirrors the `typescript` code variant verbatim. A compact month grid inside a
 * `role="dialog"`: leading blanks pad the first weekday, the selected day is a
 * real pressed button (`aria-pressed`), and picking one closes and restores
 * focus to the trigger. Escape closes without choosing.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
const WEEKDAYS: readonly string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface PopoverDateMiniProps {
  label: string;
  year: number;
  month: number;
  selected?: number;
  onSelect?: (day: number) => void;
  defaultOpen?: boolean;
}

function PopoverDateMini({
  label,
  year,
  month,
  selected,
  onSelect,
  defaultOpen = false,
}: PopoverDateMiniProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [chosen, setChosen] = useState<number | undefined>(selected);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const cells = useMemo<Array<number | null>>(() => {
    const leading = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const blanks: Array<number | null> = Array.from({ length: leading }, () => null);
    const numbered: Array<number | null> = Array.from({ length: days }, (_, index) => index + 1);
    return [...blanks, ...numbered];
  }, [year, month]);

  const heading = useMemo(
    () => new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [year, month],
  );

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {chosen ? `${label}: ${heading.split(' ')[0]} ${chosen}` : label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={heading}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <p className="px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</p>
          <div className="mt-2 grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((weekday) => (
              <span
                key={weekday}
                aria-hidden="true"
                className="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500"
              >
                {weekday}
              </span>
            ))}
            {cells.map((day, index) => {
              if (day === null) return <span key={`blank-${index}`} />;
              const isActive = day === chosen;
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setChosen(day);
                    onSelect?.(day);
                    close();
                  }}
                  className={`flex h-8 items-center justify-center rounded-md text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-600 font-semibold text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverDateMiniPreview() {
  const [day, setDay] = useState<number | undefined>(14);

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-72 pt-4">
      <PopoverDateMini label="Due date" year={2026} month={6} selected={14} onSelect={setDay} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Day: <span className="font-medium tabular-nums">{day ?? 'none'}</span>
      </p>
    </div>
  );
}
