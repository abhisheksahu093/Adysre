/**
 * Live preview for `dock-command-strip`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the strip
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * No 'use client': these are plain command buttons. Each shows a visible label
 * (its accessible name) plus a `<kbd>` shortcut hint mirrored into
 * `aria-keyshortcuts` so the shortcut is announced too. The row scrolls
 * (`overflow-x-auto`) rather than overflowing the page at 320px. Keep this in
 * step with `src/data/components/docks.ts`.
 */
interface Command {
  id: string;
  label: string;
  keys: string;
  path: string;
}

const COMMANDS: readonly Command[] = [
  { id: 'search', label: 'Search', keys: 'Ctrl+K', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'new', label: 'New', keys: 'Ctrl+N', path: 'M12 5v14M5 12h14' },
  { id: 'comment', label: 'Comment', keys: 'C', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'share', label: 'Share', keys: 'Ctrl+S', path: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13' },
];

export function DockCommandStrip() {
  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-teal-100 to-cyan-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-cyan-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Command strip with shortcuts.</p>

      <div className="absolute bottom-4 left-1/2 w-full max-w-[calc(100%-1rem)] -translate-x-1/2">
        <div
          role="toolbar"
          aria-label="Commands"
          className="mx-auto flex w-max max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
        >
          {COMMANDS.map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              aria-keyshortcuts={cmd.keys}
              className="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={cmd.path} />
              </svg>
              {cmd.label}
              <kbd aria-hidden="true" className="hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[0.625rem] font-semibold text-gray-500 sm:inline dark:border-white/10 dark:bg-white/10 dark:text-gray-400">
                {cmd.keys}
              </kbd>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


export default DockCommandStrip;
