'use client';

import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `pill-button`.
 *
 * Mirrors the `typescript` code variant verbatim. The count ticks on a timer so
 * the badge is visibly live and the "99+" collapse is demonstrated rather than
 * described - and so the `tabular-nums` width lock is observable as digits
 * change. Keep this in step with `src/data/components/buttons.ts`.
 */
interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  count: number;
  children: ReactNode;
}

export function PillButton({ count, children, ...props }: PillButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-gray-900 py-2 pl-2 pr-4 font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold tabular-nums dark:bg-gray-900/10">
        {count > 99 ? '99+' : count}
      </span>
      {children}
    </button>
  );
}

const COUNTS = [3, 12, 128];

export default function PillButtonPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % COUNTS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  return <PillButton count={COUNTS[index] ?? 0}>Notifications</PillButton>;
}
