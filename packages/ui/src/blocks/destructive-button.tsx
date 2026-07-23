'use client';

import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `destructive-button`.
 *
 * Mirrors the `typescript` code variant verbatim. The confirm step only reads
 * as a safeguard if you can feel the two clicks, so the harness counts
 * confirmations rather than faking the arm on a timer - and the counter proves
 * the first click does nothing.
 * Keep this in step with `src/data/components/buttons.ts`.
 */
interface DestructiveButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode;
  onConfirm?: () => void;
}

export function DestructiveButton({ children, onConfirm, ...props }: DestructiveButtonProps) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function disarm(): void {
    setArmed(false);
    window.clearTimeout(timerRef.current);
  }

  function onClick(): void {
    if (!armed) {
      setArmed(true);
      timerRef.current = window.setTimeout(() => setArmed(false), 4000);
      return;
    }
    disarm();
    onConfirm?.();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onBlur={disarm}
      data-armed={armed || undefined}
      className="inline-flex min-w-[9.5rem] items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[armed=true]:bg-red-800 motion-reduce:transition-none dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <span aria-live="polite">{armed ? 'Are you sure?' : children}</span>
    </button>
  );
}

export default function DestructiveButtonPreview() {
  const [deletes, setDeletes] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <DestructiveButton onConfirm={() => setDeletes((count) => count + 1)}>
        Delete project
      </DestructiveButton>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Click once to arm, again to confirm - confirmed {deletes}{' '}
        {deletes === 1 ? 'time' : 'times'}
      </p>
    </div>
  );
}
