'use client';

/**
 * Live preview for `alert-progress-timed`.
 *
 * Mirrors the `typescript` code variant. The bar shrinks over `duration` via a
 * width transition (no keyframes, so motion-reduce drops it cleanly) and the
 * timer unmounts the alert when it empties. The Reset control restarts it - it
 * is preview scaffolding, not part of the component.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface AlertProgressTimedProps {
  children: ReactNode;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

export function AlertProgressTimed({ children, duration = 5000, onDismiss, className = '' }: AlertProgressTimedProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const [elapsed, setElapsed] = useState<boolean>(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setElapsed(true)));
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={`relative overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
        </svg>
        <p className="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">{children}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-100 dark:bg-gray-800 motion-reduce:hidden" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full bg-green-600 ease-linear dark:bg-green-400 motion-safe:transition-[width]"
          style={{ width: elapsed ? '0%' : '100%', transitionDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}

export default function AlertProgressTimedPreview() {
  const [instance, setInstance] = useState<number>(0);

  return (
    <div className="w-full max-w-md">
      <div className="min-h-[4rem]">
        <AlertProgressTimed key={instance} duration={5000}>
          Changes saved. This notice will clear itself shortly.
        </AlertProgressTimed>
      </div>

      <button
        type="button"
        onClick={() => setInstance((n) => n + 1)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}

export const minHeight = 200;
