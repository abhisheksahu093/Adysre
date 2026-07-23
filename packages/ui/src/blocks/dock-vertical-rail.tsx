'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-vertical-rail`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the rail
 * is `absolute` inside this bounded card rather than `fixed` to the viewport -
 * the stage sizes its iframe from `document.body.scrollHeight`, to which a
 * fixed element contributes nothing. The shipped component uses
 * `fixed left-4 top-1/2 -translate-y-1/2`.
 *
 * Clicking an item moves the active state so you can watch the indicator and
 * the tint follow `aria-current`; the real component takes it from the router.
 * Keep this in step with `src/data/components/docks.ts`.
 */
interface RailItem {
  id: string;
  label: string;
  path: string;
}

const ITEMS: readonly RailItem[] = [
  { id: 'inbox', label: 'Inbox', path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'projects', label: 'Projects', path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'insights', label: 'Insights', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  {
    id: 'team',
    label: 'Team',
    path: 'M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 19a6 6 0 0 0-1.5-4',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1',
  },
];

export function DockVerticalRail() {
  const [current, setCurrent] = useState('inbox');

  return (
    <div className="relative min-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:border-gray-800 dark:from-slate-900 dark:to-slate-950">
      <p className="p-4 pl-24 text-sm text-gray-600 dark:text-gray-400">
        Every icon is a link with a screen-reader-only name - the rail is not a row of anonymous
        buttons.
      </p>

      <nav
        aria-label="Workspace"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
      >
        <ul className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const isCurrent = item.id === current;
            return (
              <li key={item.id} className="relative flex">
                {/* Decoration. aria-current below is what is announced. */}
                {isCurrent ? (
                  <span
                    aria-hidden="true"
                    className="absolute -left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-700 dark:bg-blue-300"
                  />
                ) : null}
                <a
                  href="#"
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrent(item.id);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={item.path} />
                  </svg>
                  <span className="sr-only">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}


export default DockVerticalRail;
