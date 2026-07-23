'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-basic`.
 *
 * Mirrors the `typescript` code variant verbatim. Test it BOTH ways: hover the
 * button, then Tab to it - the same bubble must appear, because a hint bound to
 * hover alone cannot be produced by a keyboard or a touch screen. Escape
 * dismisses it. The bubble is absolutely positioned (out of flow), so the `pt-`
 * on the wrapper is what reserves room for it above the trigger.
 *
 * Keep this in step with `src/data/components/tooltips.ts`.
 */
interface TooltipProps {
  label: string;
  children: ReactNode;
  delay?: number;
}

export function Tooltip({ label, children, delay = 150 }: TooltipProps) {
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
    timer.current = window.setTimeout(() => setOpen(true), delay);
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
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900 dark:bg-gray-100"
        />
      </span>
    </span>
  );
}

export default function TooltipBasicPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pb-4 pt-24">
      <Tooltip label="Changes are saved automatically.">
        <button
          type="button"
          className="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Hover or focus me
        </button>
      </Tooltip>
      <p className="text-xs text-gray-600 dark:text-gray-400">Hover it - then Tab to it. Both must work.</p>
    </div>
  );
}
