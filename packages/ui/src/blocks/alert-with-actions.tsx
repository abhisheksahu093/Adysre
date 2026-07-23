'use client';

/**
 * Live preview for `alert-with-actions`.
 *
 * Mirrors the `typescript` code variant. The secondary "View usage" button is
 * rendered here because two actions is what this pattern actually looks like in
 * the wild, even though the exported component takes a single CTA prop - the
 * snippet keeps its API narrow and expects composition for the second one.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useId } from 'react';

export function AlertWithActions() {
  const id = useId();
  const titleId = `${id}-title`;
  const bodyId = `${id}-body`;

  return (
    <div
      role="status"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className="flex w-full max-w-md items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      {/* amber-800 on amber-50 is 6.84:1; amber-200 on amber-950 is 12.03:1.
          The triangle carries the warning for anyone the colour doesn't reach. */}
      <svg className="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p id={titleId} className="text-sm font-semibold">
          You&rsquo;re near your API limit
        </p>
        <p id={bodyId} className="mt-1 text-sm leading-normal">
          You&rsquo;ve used 94% of this month&rsquo;s 50,000 requests. Further calls will be rejected
          once you hit the cap.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {/* The solid button inverts: an amber-50 tint is far too light to
              carry a filled control. White on amber-800 is 6.84:1. */}
          <button
            type="button"
            className="rounded-md bg-amber-800 px-3 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 motion-reduce:transition-none dark:bg-amber-300 dark:text-amber-950 dark:hover:bg-amber-200 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            Upgrade plan
          </button>
          <button
            type="button"
            className="rounded-md border border-amber-300 px-3 py-1.5 text-[0.8125rem] font-semibold transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 motion-reduce:transition-none dark:border-amber-800 dark:hover:bg-amber-900 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            View usage
          </button>
        </div>
      </div>
    </div>
  );
}


export default AlertWithActions;
