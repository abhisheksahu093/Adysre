/**
 * Live preview for `dock-glass-blur`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport,
 * because the stage sizes its iframe from `document.body.scrollHeight` and a
 * fixed element contributes nothing to it. The shipped component uses
 * `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * No 'use client': the lift on hover is pure CSS, gated to `pointer: fine` so a
 * touch device never gets a stuck hover state, and dropped under reduced
 * motion. Keep this in step with `src/data/components/docks.ts`.
 */
interface GlassDockItem {
  id: string;
  label: string;
  path: string;
  current?: boolean;
}

const ITEMS: readonly GlassDockItem[] = [
  { id: 'home', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'explore', label: 'Explore', path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5Z' },
  { id: 'messages', label: 'Messages', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockGlassBlur() {
  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-fuchsia-200 via-sky-200 to-indigo-300 p-4 dark:border-gray-800 dark:from-fuchsia-950 dark:via-slate-900 dark:to-indigo-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-200">Frosted glass dock.</p>

      <nav
        aria-label="Dock"
        className="absolute bottom-4 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-white/40 bg-white/30 p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      >
        <ul className="flex items-center gap-1">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                aria-current={item.current ? 'page' : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 aria-[current=page]:text-blue-700 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={item.path} />
                </svg>
                <span className="sr-only">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}


export default DockGlassBlur;
