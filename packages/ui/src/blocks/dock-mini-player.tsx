'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-mini-player`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * 'use client': play/pause is state and the button swaps both its icon and its
 * `aria-label` so the control never lies about what it does. The track text
 * uses `min-w-0` + `truncate` so a long title cannot push the strip past the
 * viewport at 320px. Keep this in step with `src/data/components/docks.ts`.
 */
export function DockMiniPlayer() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-slate-100 to-zinc-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-zinc-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Now playing.</p>

      <div className="absolute bottom-4 left-1/2 w-72 max-w-[calc(100%-1rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Midnight Signals</p>
            <p className="truncate text-xs text-gray-600 dark:text-gray-400">The Wavelengths</p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button type="button" aria-label="Previous track" className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M7 6a1 1 0 0 1 2 0v5l8-5.2A1 1 0 0 1 18.5 6.6v10.8a1 1 0 0 1-1.5.8L9 13v5a1 1 0 0 1-2 0Z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
              aria-pressed={playing}
              onClick={() => setPlaying((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:focus-visible:ring-blue-200"
            >
              {playing ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M8 5.2A1 1 0 0 1 9.5 4.3l9 6.8a1 1 0 0 1 0 1.8l-9 6.8A1 1 0 0 1 8 18.8Z" />
                </svg>
              )}
            </button>
            <button type="button" aria-label="Next track" className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M17 6a1 1 0 0 0-2 0v5L7 5.8A1 1 0 0 0 5.5 6.6v10.8a1 1 0 0 0 1.5.8L15 13v5a1 1 0 0 0 2 0Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10" role="progressbar" aria-label="Playback progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={42}>
          <div className="h-full w-[42%] rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}


export default DockMiniPlayer;
