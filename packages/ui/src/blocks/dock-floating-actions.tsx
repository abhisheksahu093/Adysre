'use client';

import { useState } from 'react';

/**
 * Live preview for `dock-floating-actions`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the
 * cluster is `absolute` inside this bounded card rather than `fixed` to the
 * viewport. The shipped component uses `fixed bottom-6 right-6`.
 *
 * 'use client': the fan-out is state. The trigger owns `aria-expanded`; the
 * secondary actions are real buttons with `aria-label`s, kept out of the tab
 * order and hidden from AT while collapsed. The transition is dropped under
 * reduced motion. Keep this in step with `src/data/components/docks.ts`.
 */
interface FloatingAction {
  id: string;
  label: string;
  path: string;
}

const ACTIONS: readonly FloatingAction[] = [
  { id: 'note', label: 'New note', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'photo', label: 'Upload photo', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'event', label: 'New event', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
];

export function DockFloatingActions() {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative min-h-56 w-full overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-orange-100 to-rose-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-rose-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Speed-dial actions.</p>

      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3">
        <ul className="flex flex-col items-end gap-2" aria-hidden={!open}>
          {ACTIONS.map((action, index) => (
            <li
              key={action.id}
              className={
                'flex items-center gap-2 transition duration-200 ease-out motion-reduce:transition-none ' +
                (open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0')
              }
              style={{ transitionDelay: open ? index * 40 + 'ms' : '0ms' }}
            >
              <span className="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-gray-100 dark:text-gray-900">{action.label}</span>
              <button
                type="button"
                aria-label={action.label}
                tabIndex={open ? 0 : -1}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={action.path} />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? 'Close actions' : 'Open actions'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg className={'h-6 w-6 transition-transform duration-200 motion-reduce:transition-none ' + (open ? 'rotate-45' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}


export default DockFloatingActions;
