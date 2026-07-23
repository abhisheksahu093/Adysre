'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-follow-cursor`. Mirrors the `typescript` variant.
 * Move the mouse across the trigger and the tip tracks it; Tab to it instead and
 * it anchors above (no pointer to follow). Keep in step with
 * `src/data/components/tooltips.ts`.
 */
interface Point {
  x: number;
  y: number;
}

interface CursorTooltipProps {
  label: string;
  children: ReactNode;
}

export function CursorTooltip({ label, children }: CursorTooltipProps) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Point | null>(null);
  const id = useId();

  function onMove(e: MouseEvent<HTMLSpanElement>): void {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setOpen(false);
        setCoords(null);
      }}
      onFocus={() => {
        setOpen(true);
        setCoords(null);
      }}
      onBlur={() => setOpen(false)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        style={coords ? { left: coords.x, top: coords.y } : undefined}
        className={
          'pointer-events-none absolute z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm dark:bg-gray-100 dark:text-gray-900 ' +
          (coords
            ? '-translate-x-1/2 -translate-y-[calc(100%+0.75rem)] '
            : 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 transition motion-reduce:transition-none ') +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}

export default function TooltipFollowCursorPreview() {
  return (
    <div className="flex w-full items-center justify-center px-4 pb-4 pt-24">
      <CursorTooltip label="Drag me anywhere">
        <button
          type="button"
          className="cursor-default rounded-md border border-dashed border-gray-400 bg-white px-6 py-4 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Hover across me
        </button>
      </CursorTooltip>
    </div>
  );
}

export const minHeight = 240;
