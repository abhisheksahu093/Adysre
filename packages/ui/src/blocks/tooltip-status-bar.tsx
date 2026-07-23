'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `tooltip-status-bar`. Mirrors the `typescript` variant. The
 * bar sits at the bottom; each item reveals a tooltip above on hover/focus. Keep
 * in step with `src/data/components/tooltips.ts`.
 */
interface StatusItem {
  id: string;
  label: string;
  hint: string;
}

function StatusBarItem({ label, hint }: Omit<StatusItem, 'id'>) {
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
      <button
        type="button"
        aria-describedby={id}
        className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        {label}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {hint}
      </span>
    </span>
  );
}

interface StatusBarProps {
  items: StatusItem[];
}

export function StatusBar({ items }: StatusBarProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-1 border-t border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-800 dark:bg-gray-900">
      {items.map((item) => (
        <StatusBarItem key={item.id} label={item.label} hint={item.hint} />
      ))}
    </div>
  );
}

const ITEMS: StatusItem[] = [
  { id: 'branch', label: 'main', hint: 'Current branch - click to switch' },
  { id: 'errors', label: '0 errors', hint: 'No problems detected' },
  { id: 'enc', label: 'UTF-8', hint: 'File encoding' },
  { id: 'ln', label: 'Ln 42, Col 7', hint: 'Cursor position' },
];

export default function TooltipStatusBarPreview() {
  return (
    <div className="flex min-h-[190px] w-full flex-col justify-end">
      <StatusBar items={ITEMS} />
    </div>
  );
}

export const minHeight = 220;
