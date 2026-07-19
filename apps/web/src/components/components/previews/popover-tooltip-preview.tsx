'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `popover-tooltip`.
 *
 * `Tooltip` mirrors the `typescript` code variant verbatim. Test it BOTH ways -
 * that is the whole component. Hover the trigger, then Tab to it with the
 * keyboard: the same bubble must appear, because a tooltip bound to hover alone
 * does not exist for anyone navigating by keyboard and cannot be produced by a
 * touch screen at all. Escape dismisses it without moving the pointer.
 *
 * The bubble sits above its trigger and is absolutely positioned - out of flow,
 * so it adds nothing to `document.body.scrollHeight`, which is what
 * preview-stage.tsx measures. Hence the `pt-` on the wrapper.
 *
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface TooltipProps {
  text: string;
  children: ReactNode;
  delay?: number;
}

function Tooltip({ text, children, delay = 150 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show(): void {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide(): void {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
    if (event.key === 'Escape') hide();
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      <span aria-describedby={tooltipId}>{children}</span>
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-64 -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs leading-snug text-gray-50 transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
        }`}
      >
        {text}
      </span>
    </span>
  );
}

export default function PopoverTooltipPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pb-4 pt-24">
      <Tooltip text="Deleted items are recoverable for 30 days.">
        <button
          type="button"
          className="cursor-help rounded-md border border-dashed border-gray-400 px-2.5 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:text-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Retention
        </button>
      </Tooltip>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Hover it - then Tab to it. Both must work.
      </p>
    </div>
  );
}
