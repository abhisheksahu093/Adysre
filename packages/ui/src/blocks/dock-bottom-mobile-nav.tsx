'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-bottom-mobile-nav`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the bar
 * is `absolute` at the bottom of this bounded phone frame rather than `fixed`
 * to the viewport. The stage measures `document.body.scrollHeight` and a fixed
 * element contributes nothing to it. The shipped component uses
 * `fixed inset-x-0 bottom-0` plus `env(safe-area-inset-bottom)`.
 *
 * Tabs are clickable here so the active state and the aria-current it is
 * styled from can be tried; in the real component the router drives it. Keep
 * this in step with `src/data/components/docks.ts`.
 */
interface Tab {
  id: string;
  label: string;
  path: string;
  count?: number;
}

const TABS: readonly Tab[] = [
  { id: 'home', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  {
    id: 'create',
    label: 'Create',
    path: 'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4ZM12 9v6M9 12h6',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    count: 3,
    path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z',
  },
  { id: 'profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockBottomMobileNav() {
  const [current, setCurrent] = useState('home');

  return (
    <div className="relative min-h-56 w-full max-w-xs overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Tap a tab - the highlight and the announced state come from the same attribute.
      </p>

      <nav
        aria-label="Primary"
        className="absolute inset-x-0 bottom-0 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className="flex">
          {TABS.map((tab) => (
            <li key={tab.id} className="flex-1">
              <a
                href="#"
                aria-current={tab.id === current ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setCurrent(tab.id);
                }}
                className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 aria-[current=page]:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:aria-[current=page]:text-blue-300 dark:focus-visible:ring-blue-400"
              >
                <span className="relative inline-flex">
                  <svg
                    className="h-[1.375rem] w-[1.375rem]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={tab.path} />
                  </svg>
                  {tab.count ? (
                    <span
                      aria-hidden="true"
                      className="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white"
                    >
                      {tab.count > 99 ? '99+' : tab.count}
                    </span>
                  ) : null}
                </span>
                <span className="text-[0.6875rem] font-medium leading-none">{tab.label}</span>
                {/* The badge is aria-hidden, so the count is announced here instead. */}
                {tab.count ? <span className="sr-only">{tab.count} unread</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}


export default DockBottomMobileNav;
