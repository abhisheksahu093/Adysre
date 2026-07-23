'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-click-pin`. Mirrors the `typescript` variant. Hover
 * or focus previews the tip; click the trigger to pin it open (aria-pressed),
 * Escape unpins. Keep in step with `src/data/components/tooltips.ts`.
 */
interface PinTooltipProps {
  label: string;
  children: ReactNode;
}

export function PinTooltip({ label, children }: PinTooltipProps) {
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();
  const open = hovering || pinned;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setHovering(true);
      return;
    }
    timer.current = window.setTimeout(() => setHovering(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setHovering(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setPinned(false);
          hide();
        }
      }}
    >
      <button
        type="button"
        aria-describedby={id}
        aria-pressed={pinned}
        onClick={() => setPinned((p) => !p)}
        className="cursor-help rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-pressed:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {children}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}

export default function TooltipClickPinPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-3 px-4 pb-4 pt-24">
      <PinTooltip label="Passed in 3m 12s on commit a1b2c3d.">Build #4821</PinTooltip>
      <p className="text-xs text-gray-600 dark:text-gray-400">Click to pin it open.</p>
    </div>
  );
}

export const minHeight = 200;
