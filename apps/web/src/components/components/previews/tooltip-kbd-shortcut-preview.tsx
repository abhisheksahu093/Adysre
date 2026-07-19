'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-kbd-shortcut`. Mirrors the `typescript` variant. The
 * hotkey is rendered in real <kbd> elements. Keep in step with
 * `src/data/components/tooltips.ts`.
 */
interface ShortcutTooltipProps {
  label: string;
  keys: string[];
  children: ReactNode;
}

function ShortcutTooltip({ label, keys, children }: ShortcutTooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 flex w-max -translate-x-1/2 items-center gap-1.5 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[0.65rem] dark:border-black/20 dark:bg-black/10"
          >
            {k}
          </kbd>
        ))}
      </span>
    </span>
  );
}

export default function TooltipKbdShortcutPreview() {
  return (
    <div className="flex w-full items-center justify-center px-4 pb-4 pt-24">
      <ShortcutTooltip label="Save" keys={['Ctrl', 'S']}>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M4 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Zm2 3h8v2H6V6Zm0 4h5v2H6v-2Z" />
          </svg>
          <span className="sr-only">Save</span>
        </button>
      </ShortcutTooltip>
    </div>
  );
}
