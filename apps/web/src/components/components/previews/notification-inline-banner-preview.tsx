'use client';

/**
 * Live preview for `notification-inline-banner`.
 *
 * In-flow by design, so unlike the toast previews there's no viewport stand-in
 * to build - the snippet's real layout is already something the stage can
 * measure. The list of "posts" underneath is here to show the point of the
 * component: the reserved `min-h-11` slot means the banner's arrival never
 * shoves that list down under the reader's cursor. Toggle it and watch nothing
 * move.
 *
 * Keep this in step with `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

export default function NotificationInlineBannerPreview() {
  const [shown, setShown] = useState<boolean>(true);

  return (
    <div className="w-full max-w-md">
      {/* The slot is always here; only its contents come and go. */}
      <div className="min-h-11" role="status" aria-live="polite">
        {shown ? (
          <div className="flex items-center gap-3 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3 py-2.5 dark:border-blue-900 dark:bg-blue-950">
            {/* blue-800 on blue-50 is 8.01:1; blue-200 on blue-950 is 10.34:1.
                The bell keeps the meaning for anyone the colour doesn't reach. */}
            <svg
              className="h-[1.125rem] w-[1.125rem] flex-none text-blue-800 dark:text-blue-200"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
            </svg>

            <p className="flex-1 text-sm font-medium text-blue-800 dark:text-blue-200">
              3 new updates
            </p>

            <button
              type="button"
              onClick={() => setShown(false)}
              className="flex-none rounded-md bg-blue-700 px-2.5 py-1 text-[0.8125rem] font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-blue-500 dark:text-gray-950 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-blue-950"
            >
              Show them
            </button>

            <button
              type="button"
              onClick={() => setShown(false)}
              aria-label="Dismiss"
              className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-blue-800 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:text-blue-200 dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {/* Context, not part of the component: this is the content the reserved
          slot protects from being shoved around. */}
      <ul className="mt-3 grid gap-2" aria-label="Recent posts">
        {['Ship the Q3 roadmap', 'Postmortem: eu-west-1', 'Design review notes'].map((post) => (
          <li
            key={post}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300"
          >
            {post}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setShown((value) => !value)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        {shown ? 'Hide the banner' : 'Fire another event'}
      </button>
    </div>
  );
}
