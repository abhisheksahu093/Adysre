'use client';

/**
 * Live preview for `toast-basic`.
 *
 * ─── The one deliberate deviation from the snippet ──────────────────────────
 * The shipped code positions the region `fixed` to the viewport, which is right
 * for a real app and wrong here twice over: the stage measures
 * `document.body.scrollHeight` to size its iframe, and a fixed element
 * contributes nothing to that - so the toast would be measured as zero and
 * clipped. It would also escape the stage entirely and pin itself to the corner
 * of the whole page. The region below is `absolute` inside a `relative`,
 * `min-h-40` box that stands in for the viewport.
 *
 * The auto-dismiss timer is also disabled (duration 0): a five-second toast on
 * a documentation page is an empty rectangle to anyone who scrolls down to it.
 * Dismiss still really dismisses, and Reset brings it back.
 *
 * Keep this in step with `src/data/components/notifications.ts`.
 */
import { useEffect, useState } from 'react';

interface ToastProps {
  title: string;
  message?: string;
  duration?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Toast({ title, message, duration = 5, onDismiss, dismissLabel = 'Dismiss' }: ToastProps) {
  useEffect(() => {
    if (duration <= 0 || !onDismiss) return;
    const id = setTimeout(onDismiss, duration * 1000);
    return () => clearTimeout(id);
  }, [duration, onDismiss]);

  return (
    <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900">
      {/* green-700 on white is 5.02:1, green-300 on gray-900 is 12.63:1. The
          check icon repeats the signal so colour is never carrying it alone. */}
      <svg
        className="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {message ? (
          <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastBasicPreview() {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div className="w-full max-w-md">
      {/* Stands in for the viewport. `relative` + `min-h-40` is what reserves
          the space the stage measures - see the note at the top of this file. */}
      <div className="relative min-h-40 overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute bottom-3 right-3 grid gap-2"
        >
          {visible ? (
            <Toast
              title="Changes saved"
              message="Your workspace settings are up to date."
              duration={0}
              onDismiss={() => setVisible(false)}
            />
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setVisible(true)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}
