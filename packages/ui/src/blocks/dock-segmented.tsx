'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-segmented`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * 'use client': the selection is real state. The strip is a `radiogroup` of
 * `radio` buttons, so exactly one is `aria-checked` and arrow-key semantics
 * come from the role - the tinted pill and the checked state are the same
 * fact. Keep this in step with `src/data/components/docks.ts`.
 */
interface Segment {
  id: string;
  label: string;
  path: string;
}

const SEGMENTS: readonly Segment[] = [
  { id: 'list', label: 'List', path: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01' },
  { id: 'board', label: 'Board', path: 'M4 5h5v14H4zM10 5h5v9h-5zM16 5h4v6h-4z' },
  { id: 'calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
];

export function DockSegmented() {
  const [selected, setSelected] = useState('board');

  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-slate-100 to-slate-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-slate-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Pick a view.</p>

      <div
        role="radiogroup"
        aria-label="View"
        className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 gap-1 rounded-2xl border border-black/10 bg-white/85 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
      >
        {SEGMENTS.map((seg) => {
          const active = seg.id === selected;
          return (
            <button
              key={seg.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(seg.id)}
              className={
                'inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ' +
                (active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10')
              }
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={seg.path} />
              </svg>
              {seg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}


export default DockSegmented;
