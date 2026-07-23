'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * Live preview for `dock-macos-magnify`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The stage sizes its iframe from `document.body.scrollHeight`, and a fixed
 * element contributes nothing to that - it would float over the whole gallery
 * page and get clipped. The shipped component uses `fixed bottom-6 left-1/2`.
 *
 * The effect itself is real and unchanged: pointer distance drives a linear
 * falloff, so the neighbours of the hovered icon lift less than it does, and
 * reduced motion skips the scaling outright rather than freezing it mid-way.
 * Keep this in step with `src/data/components/docks.ts`.
 */
const RANGE = 110;
const MAX_SCALE = 1.6;

interface DockItem {
  id: string;
  label: string;
  path: string;
  current?: boolean;
}

const ITEMS: readonly DockItem[] = [
  {
    id: 'files',
    label: 'Files',
    current: true,
    path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z',
  },
  {
    id: 'mail',
    label: 'Mail',
    path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4',
  },
  {
    id: 'photos',
    label: 'Photos',
    path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1',
  },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = (): void => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function DockMacosMagnify() {
  const [scales, setScales] = useState<number[]>(() => ITEMS.map(() => 1));
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  function handleMove(event: MouseEvent<HTMLElement>): void {
    // Inline transforms beat any motion-reduce: utility, so the preference has
    // to be honoured here - not styled away afterwards.
    if (reduced || !listRef.current) return;
    const links = Array.from(listRef.current.querySelectorAll('a'));
    const clientX = event.clientX;
    setScales(
      links.map((link) => {
        const rect = link.getBoundingClientRect();
        const distance = Math.abs(clientX - (rect.left + rect.width / 2));
        const falloff = Math.max(0, 1 - distance / RANGE);
        return 1 + (MAX_SCALE - 1) * falloff;
      })
    );
  }

  const reset = (): void => setScales(ITEMS.map(() => 1));

  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-sky-100 to-indigo-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-indigo-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">
        Sweep the pointer across the dock.
      </p>

      <nav
        aria-label="Dock"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="absolute bottom-4 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/75"
      >
        <ul ref={listRef} className="flex items-end gap-1">
          {ITEMS.map((item, index) => (
            <li key={item.id} className="relative flex">
              <a
                href="#"
                aria-current={item.current ? 'page' : undefined}
                style={{ transform: 'scale(' + (scales[index] ?? 1) + ')' }}
                className="flex h-11 w-11 origin-bottom items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300"
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
                {/* The accessible name. Clipped, never [hidden]. */}
                <span className="sr-only">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}


export default DockMacosMagnify;
