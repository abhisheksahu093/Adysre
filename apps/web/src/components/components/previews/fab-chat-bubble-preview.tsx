'use client';

import { useState } from 'react';

/**
 * Live preview for `fab-chat-bubble`.
 *
 * Two preview-only changes from the `typescript` code variant: the root is
 * `absolute` inside this bounded card rather than `fixed`, and the focus ring
 * offset matches this card (`ring-offset-gray-50`). The unread count is folded
 * into the button's aria-label; the badge is decorative and aria-hidden.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
const UNREAD = 3;

export const minHeight = 320;

export default function FabChatBubblePreview() {
  const [open, setOpen] = useState(false);
  const label = open ? 'Close chat' : UNREAD > 0 ? 'Open chat, ' + UNREAD + ' unread' : 'Open chat';

  return (
    <div className="relative min-h-80 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Open the launcher - the badge count is announced in the accessible name.
      </p>

      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
        {open ? (
          <div
            role="dialog"
            aria-label="Support chat"
            id="fab-chat-bubble-preview-panel"
            className="w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Support</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Hi there - how can we help you today?
            </p>
          </div>
        ) : null}

        <button
          type="button"
          aria-expanded={open}
          aria-controls="fab-chat-bubble-preview-panel"
          aria-label={label}
          onClick={() => setOpen((value) => !value)}
          className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
          </svg>
          {!open && UNREAD > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-gray-50 bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950"
            >
              {UNREAD > 9 ? '9+' : UNREAD}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
