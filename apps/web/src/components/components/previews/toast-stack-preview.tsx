'use client';

/**
 * Live preview for `toast-stack`.
 *
 * Bounded like `toast-basic`'s preview and for the same reason: the snippet's
 * `fixed` region contributes nothing to `document.body.scrollHeight`, which is
 * what the stage measures, so it would be clipped to nothing and escape to the
 * corner of the page besides. Here the region is `absolute` inside a `relative`,
 * `min-h-56` stand-in for the viewport.
 *
 * The queue is seeded with three toasts and no timers - a stack that has already
 * expired by the time someone scrolls to it is an empty box. Push adds one,
 * demonstrating the MAX_VISIBLE cap, which is the actual subject of this entry.
 *
 * Keep this in step with `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

const MAX_VISIBLE = 3;

interface ToastItem {
  id: string;
  title: string;
}

const SEED: ToastItem[] = [
  { id: 's3', title: 'Invite sent to dana@adysre.co' },
  { id: 's2', title: 'Deploy #914 finished' },
  { id: 's1', title: 'Backup uploaded' },
];

export default function ToastStackPreview() {
  const [items, setItems] = useState<ToastItem[]>(SEED);
  const [seq, setSeq] = useState<number>(0);

  const dismiss = (id: string): void => {
    setItems((current) => current.filter((t) => t.id !== id));
  };

  const push = (): void => {
    const next = seq + 1;
    setSeq(next);
    setItems((current) => [{ id: `p${next}`, title: `New event #${next}` }, ...current]);
  };

  const hidden = Math.max(0, items.length - MAX_VISIBLE);

  return (
    <div className="w-full max-w-md">
      <div className="relative min-h-56 overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
        {/* flex-col-reverse: newest paints nearest the corner while staying the
            first child, so DOM order still matches queue order. */}
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-col-reverse items-end gap-2"
        >
          {items.slice(0, MAX_VISIBLE).map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto flex w-72 max-w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900"
            >
              <span
                className="h-2 w-2 flex-none rounded-full bg-blue-700 dark:bg-blue-300"
                aria-hidden="true"
              />
              <p className="flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {toast.title}
              </p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label={`Dismiss: ${toast.title}`}
                className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={push}
          className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          Push a toast
        </button>
        <button
          type="button"
          onClick={() => {
            setItems(SEED);
            setSeq(0);
          }}
          className="rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
        >
          Reset preview
        </button>
      </div>

      {/* Not part of the component - it just makes the cap legible on a docs
          page, where you'd otherwise have to count. */}
      <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
        {hidden > 0 ? `${hidden} more queued behind the cap of ${MAX_VISIBLE}` : `Cap: ${MAX_VISIBLE} visible`}
      </p>
    </div>
  );
}
