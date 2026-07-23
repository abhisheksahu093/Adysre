'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-icon-help`. Mirrors the `typescript` variant. The
 * "?" button has an aria-label because a bare glyph is not a name. Keep in step
 * with `src/data/components/tooltips.ts`.
 */
interface HelpTooltipProps {
  hint: string;
  srLabel?: string;
  children?: ReactNode;
}

export function HelpTooltip({ hint, srLabel = 'More information', children }: HelpTooltipProps) {
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
    <span className="inline-flex items-center gap-1.5">
      {children ? (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</span>
      ) : null}
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
          aria-label={srLabel}
          aria-describedby={id}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-[0.7rem] font-bold leading-none text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:text-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          ?
        </button>
        <span
          id={id}
          role="tooltip"
          className={
            'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
            (open ? 'visible opacity-100' : 'invisible opacity-0')
          }
        >
          {hint}
        </span>
      </span>
    </span>
  );
}

export default function TooltipIconHelpPreview() {
  return (
    <div className="flex w-full items-center justify-center px-4 pb-4 pt-24">
      <HelpTooltip hint="Found under Settings → Developer. Treat it like a password.">API key</HelpTooltip>
    </div>
  );
}
