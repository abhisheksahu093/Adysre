'use client';

import { useState } from 'react';

/**
 * Live preview for `fab-menu-radial`.
 *
 * Two preview-only changes from the `typescript` code variant:
 *  - the root is `absolute` inside this bounded card rather than `fixed` to the
 *    viewport, so it does not float over the gallery page;
 *  - it is seeded OPEN so the fanned arc is on screen without the reader having
 *    to find the trigger first.
 *
 * The focus rings use `ring-offset-gray-50` to match this card's surface. The
 * real behaviour is unchanged: collapsed actions toggle `invisible` (leaving the
 * tab order), each action carries its own aria-label, and the plus rotates off
 * `aria-expanded`.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
interface RadialAction {
  id: string;
  label: string;
  path: string;
  pos: string;
}

const ACTIONS: readonly RadialAction[] = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z', pos: '-translate-y-[4.75rem]' },
  {
    id: 'upload',
    label: 'Upload file',
    path: 'M12 19V5M5 12l7-7 7 7',
    pos: '-translate-x-[3.375rem] -translate-y-[3.375rem]',
  },
  {
    id: 'invite',
    label: 'Invite teammate',
    path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
    pos: '-translate-x-[4.75rem]',
  },
];

export const minHeight = 256;

export default function FabMenuRadialPreview() {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative min-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Toggle the trigger - the actions fan out along a quarter arc.
      </p>

      <div className="absolute bottom-6 right-6 h-14 w-14">
        <div id="fab-menu-radial-preview-actions" className="contents">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              aria-label={action.label}
              onClick={() => setOpen(false)}
              className={
                'absolute bottom-1.5 right-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' +
                (open ? 'visible scale-100 opacity-100 ' + action.pos : 'invisible scale-50 opacity-0')
              }
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d={action.path} />
              </svg>
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="fab-menu-radial-preview-actions"
          aria-label={open ? 'Close actions' : 'Open actions'}
          onClick={() => setOpen((value) => !value)}
          className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg
            className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (open ? 'rotate-45' : '')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
