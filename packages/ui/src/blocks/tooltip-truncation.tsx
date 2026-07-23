'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `tooltip-truncation`. Mirrors the `typescript` variant. The
 * clipped text is the trigger, so it takes focus and a tap. Keep in step with
 * `src/data/components/tooltips.ts`.
 */
interface TruncatedTooltipProps {
  text: string;
  className?: string;
}

export function TruncatedTooltip({ text, className = '' }: TruncatedTooltipProps) {
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
      className={'relative inline-flex max-w-full ' + className}
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <button
        type="button"
        aria-describedby={id}
        className="block max-w-full truncate rounded text-left text-sm text-gray-800 underline decoration-dotted decoration-gray-400 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-200 dark:decoration-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {text}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max max-w-[calc(100vw-2rem)] rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {text}
      </span>
    </span>
  );
}

export default function TooltipTruncationPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-3 px-4 pb-4 pt-24">
      <TruncatedTooltip text="/var/log/app/2026-07-17/request-9f2c1a-timeout.log" className="max-w-[12rem]" />
      <p className="text-xs text-gray-600 dark:text-gray-400">Hover or focus the clipped path.</p>
    </div>
  );
}

export const minHeight = 200;
