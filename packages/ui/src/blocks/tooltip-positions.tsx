'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-positions`. Mirrors the `typescript` variant.
 * Four triggers, one per side, so every placement is visible from a single Tab
 * sweep. Keep in step with `src/data/components/tooltips.ts`.
 */
type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

const POSITIONS: Record<TooltipSide, string> = {
  top: 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
  right: 'left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2',
  bottom: 'top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
  left: 'right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2',
};

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: TooltipSide;
}

export function Tooltip({ label, children, side = 'top' }: TooltipProps) {
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
          'pointer-events-none absolute z-30 w-max max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          POSITIONS[side] +
          ' ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}

const TRIGGER =
  'cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';

export default function TooltipPositionsPreview() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-8 px-4 py-12">
      <Tooltip label="Above" side="top">
        <button type="button" className={TRIGGER}>
          Top
        </button>
      </Tooltip>
      <Tooltip label="Beside" side="right">
        <button type="button" className={TRIGGER}>
          Right
        </button>
      </Tooltip>
      <Tooltip label="Below" side="bottom">
        <button type="button" className={TRIGGER}>
          Bottom
        </button>
      </Tooltip>
      <Tooltip label="Beside" side="left">
        <button type="button" className={TRIGGER}>
          Left
        </button>
      </Tooltip>
    </div>
  );
}

export const minHeight = 240;
