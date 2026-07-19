/**
 * Live preview for `dock-labeled-icons`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport -
 * the stage sizes its iframe from `document.body.scrollHeight`, to which a
 * fixed element contributes nothing. The shipped component uses
 * `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * No 'use client': the reveal is pure CSS (group-hover / group-focus-visible),
 * so there is no state here either. Tab through the icons - the label appears
 * on keyboard focus exactly as it does on hover. Keep this in step with
 * `src/data/components/docks.ts`.
 */
interface LabeledDockItem {
  id: string;
  label: string;
  path: string;
  current?: boolean;
}

const ITEMS: readonly LabeledDockItem[] = [
  {
    id: 'home',
    label: 'Home',
    current: true,
    path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5',
  },
  { id: 'library', label: 'Library', path: 'M5 4h4v16H5zM11 4h3v16h-3zM16.5 4.5l3.5 15' },
  { id: 'search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'saved', label: 'Saved', path: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z' },
];

export default function DockLabeledIconsPreview() {
  return (
    <div className="relative flex min-h-56 w-full items-start justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-100 to-teal-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-teal-950">
      <p className="max-w-sm text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        Hover an icon - or Tab to it. The label is a permanent element that is only faded, so it
        stays the link&apos;s accessible name either way.
      </p>

      <nav
        aria-label="Dock"
        className="absolute bottom-4 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 px-2 pb-6 pt-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
      >
        <ul className="flex gap-1">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                aria-current={item.current ? 'page' : undefined}
                className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
              >
                <svg
                  className="h-6 w-6"
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
                {/* Always in the DOM - this is the accessible name, merely faded. */}
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
