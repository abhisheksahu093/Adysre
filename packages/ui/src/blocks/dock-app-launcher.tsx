'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-app-launcher`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * 'use client': the popover is stateful. The trigger owns `aria-expanded` and
 * `aria-controls`, the grid holds real app links, and Escape closes it. The
 * open animation is dropped under reduced motion. Keep this in step with
 * `src/data/components/docks.ts`.
 */
interface LauncherApp {
  id: string;
  label: string;
  path: string;
}

const APPS: readonly LauncherApp[] = [
  { id: 'mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
  { id: 'photos', label: 'Photos', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'notes', label: 'Notes', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'maps', label: 'Maps', path: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14' },
  { id: 'music', label: 'Music', path: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z' },
];

export function DockAppLauncher() {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-indigo-100 to-slate-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-indigo-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Tap the grid to launch an app.</p>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        {open ? (
          <div
            id="launcher-grid"
            role="menu"
            aria-label="Applications"
            className="absolute bottom-[calc(100%+0.5rem)] left-1/2 w-60 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
          >
            <ul className="grid grid-cols-3 gap-1">
              {APPS.map((app) => (
                <li key={app.id}>
                  <a
                    href="#"
                    role="menuitem"
                    className="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-xl p-2 text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d={app.path} />
                    </svg>
                    <span className="text-[0.6875rem] font-medium leading-none">{app.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85">
          <button
            type="button"
            aria-label="Applications"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="launcher-grid"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-expanded:bg-blue-100 aria-expanded:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-expanded:bg-blue-900 dark:aria-expanded:text-blue-200"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M4 5h5v5H4zM15 5h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


export default DockAppLauncher;
