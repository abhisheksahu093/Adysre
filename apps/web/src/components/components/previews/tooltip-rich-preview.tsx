'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-rich`. Mirrors the `typescript` variant. The content
 * is read-only - a title over a description line - so it stays a tooltip, not a
 * popover. Keep in step with `src/data/components/tooltips.ts`.
 */
interface RichTooltipProps {
  title: string;
  body: string;
  children: ReactNode;
}

function RichTooltip({ title, body, children }: RichTooltipProps) {
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
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-left shadow-lg transition motion-reduce:transition-none dark:bg-gray-100 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        <span className="block text-xs font-semibold text-gray-50 dark:text-gray-900">{title}</span>
        <span className="mt-1 block text-xs leading-snug text-gray-300 dark:text-gray-600">{body}</span>
      </span>
    </span>
  );
}

export default function TooltipRichPreview() {
  return (
    <div className="flex w-full items-center justify-center px-4 pb-4 pt-28">
      <RichTooltip
        title="99.99% uptime"
        body="Measured monthly, excluding scheduled maintenance windows announced 48h ahead."
      >
        <button
          type="button"
          className="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          SLA
        </button>
      </RichTooltip>
    </div>
  );
}

export const minHeight = 240;
