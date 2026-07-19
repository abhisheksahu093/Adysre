/**
 * Live preview for `dock-icon-tooltips`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * No 'use client': the tooltip is a pure-CSS reveal on group-hover /
 * group-focus-visible. It is `aria-hidden` decoration - the icon's real name
 * lives in `aria-label`, so a screen reader is never left with an unnamed
 * button. Keep this in step with `src/data/components/docks.ts`.
 */
interface TooltipDockItem {
  id: string;
  label: string;
  path: string;
  current?: boolean;
}

const ITEMS: readonly TooltipDockItem[] = [
  { id: 'files', label: 'Files', current: true, path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'notes', label: 'Notes', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'music', label: 'Music', path: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z' },
  { id: 'settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export default function DockIconTooltipsPreview() {
  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-amber-100 to-orange-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-orange-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Hover or Tab an icon for its tooltip.</p>

      <nav
        aria-label="Dock"
        className="absolute bottom-4 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
      >
        <ul className="flex items-center gap-1">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-label={item.label}
                aria-current={item.current ? 'page' : undefined}
                className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={item.path} />
                </svg>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900"
                >
                  {item.label}
                  <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900 dark:bg-gray-100" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
