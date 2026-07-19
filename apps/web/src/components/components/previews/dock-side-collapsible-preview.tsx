'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-side-collapsible`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the rail
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed left-4 top-1/2 -translate-y-1/2`.
 *
 * 'use client': the expand/collapse is state. The toggle owns `aria-expanded`;
 * when collapsed the labels are `sr-only` so every item keeps its accessible
 * name regardless of width, and the width transition is dropped under reduced
 * motion. Keep this in step with `src/data/components/docks.ts`.
 */
interface SideItem {
  id: string;
  label: string;
  path: string;
  current?: boolean;
}

const ITEMS: readonly SideItem[] = [
  { id: 'inbox', label: 'Inbox', current: true, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'projects', label: 'Projects', path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'insights', label: 'Insights', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export default function DockSideCollapsiblePreview() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="relative min-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-slate-100 to-slate-200 dark:border-gray-800 dark:from-slate-900 dark:to-slate-950">
      <p className="absolute right-4 top-4 text-sm text-gray-700 dark:text-gray-300">Collapsible rail.</p>

      <nav
        aria-label="Workspace"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
      >
        <button
          type="button"
          aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
        >
          <svg className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (expanded ? 'rotate-180' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <ul className="flex flex-col gap-1">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                aria-current={item.current ? 'page' : undefined}
                className="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-[0.625rem] text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300"
              >
                <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={item.path} />
                </svg>
                <span className={expanded ? 'whitespace-nowrap text-sm font-medium' : 'sr-only'}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
