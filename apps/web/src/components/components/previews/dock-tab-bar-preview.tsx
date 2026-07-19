'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-tab-bar`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the bar
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * 'use client': a sliding underline tracks the active tab by index. The tabs
 * are real links marked with `aria-current`; the underline is `aria-hidden`
 * decoration positioned with a transform, and that transform is dropped under
 * reduced motion. Keep this in step with `src/data/components/docks.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  path: string;
}

const TABS: readonly TabItem[] = [
  { id: 'home', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'trends', label: 'Trends', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'saved', label: 'Saved', path: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z' },
];

export default function DockTabBarPreview() {
  const [active, setActive] = useState(0);
  const width = 100 / TABS.length;

  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-blue-100 to-indigo-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-indigo-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Sliding tab indicator.</p>

      <nav
        aria-label="Sections"
        className="absolute bottom-4 left-1/2 w-72 max-w-[calc(100%-1rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
      >
        <div className="relative flex">
          <span
            aria-hidden="true"
            className="absolute bottom-0 top-0 rounded-xl bg-blue-600/10 transition-transform duration-200 ease-out motion-reduce:transition-none dark:bg-blue-400/15"
            style={{ width: width + '%', transform: 'translateX(' + active * 100 + '%)' }}
          />
          {TABS.map((tab, index) => (
            <a
              key={tab.id}
              href="#"
              aria-current={index === active ? 'page' : undefined}
              onClick={() => setActive(index)}
              className="relative z-10 flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={tab.path} />
              </svg>
              <span className="text-[0.6875rem] font-medium leading-none">{tab.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
