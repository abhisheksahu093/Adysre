'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dock-floating-toolbar`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the
 * toolbar is `absolute` inside this bounded card rather than `fixed` to the
 * viewport - the stage sizes its iframe from `document.body.scrollHeight`, to
 * which a fixed element contributes nothing. The shipped component uses
 * `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * Everything worth trying is real: the strip is a single Tab stop, Arrow
 * Left/Right walk and wrap between the buttons, Home and End jump to the ends,
 * and the toggles flip aria-pressed. Keep this in step with
 * `src/data/components/docks.ts`.
 */
interface ToolbarAction {
  id: string;
  label?: string;
  path?: string;
  toggle?: boolean;
  danger?: boolean;
  separator?: boolean;
}

const ACTIONS: readonly ToolbarAction[] = [
  { id: 'bold', label: 'Bold', toggle: true, path: 'M7 5h6a3.5 3.5 0 0 1 0 7H7Zm0 7h7a3.5 3.5 0 0 1 0 7H7Z' },
  { id: 'italic', label: 'Italic', toggle: true, path: 'M15 5h-5M14 19H9M14 5l-4 14' },
  { id: 'underline', label: 'Underline', toggle: true, path: 'M7 4v7a5 5 0 0 0 10 0V4M5 20h14' },
  { id: 'sep-1', separator: true },
  {
    id: 'link',
    label: 'Add link',
    path: 'M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1',
  },
  { id: 'comment', label: 'Add comment', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'sep-2', separator: true },
  {
    id: 'delete',
    label: 'Delete',
    danger: true,
    path: 'M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
  },
];

const BUTTONS = ACTIONS.filter((action) => !action.separator);

export function DockFloatingToolbar() {
  const [pressed, setPressed] = useState<Record<string, boolean>>({ bold: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Roving tabindex: one Tab stop for the whole strip, arrows move inside it.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = (activeIndex + 1) % BUTTONS.length;
    else if (event.key === 'ArrowLeft') next = (activeIndex - 1 + BUTTONS.length) % BUTTONS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = BUTTONS.length - 1;
    if (next === null) return;

    event.preventDefault();
    setActiveIndex(next);
    rootRef.current?.querySelectorAll('button')[next]?.focus();
  }

  return (
    <div className="relative flex min-h-56 w-full items-start justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <p className="max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Tab into the toolbar once, then use the arrow keys - the whole strip is a single Tab stop.
        Home and End jump to the ends.
      </p>

      <div
        ref={rootRef}
        role="toolbar"
        aria-label="Formatting"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-[0.875rem] border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
      >
        {ACTIONS.map((action) => {
          if (action.separator) {
            return (
              <div
                key={action.id}
                role="separator"
                aria-orientation="vertical"
                className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700"
              />
            );
          }

          const index = BUTTONS.indexOf(action);
          return (
            <button
              key={action.id}
              type="button"
              aria-label={action.label}
              aria-pressed={action.toggle ? Boolean(pressed[action.id]) : undefined}
              tabIndex={index === activeIndex ? 0 : -1}
              onFocus={() => setActiveIndex(index)}
              onClick={() => {
                if (action.toggle) {
                  setPressed((state) => ({ ...state, [action.id]: !state[action.id] }));
                }
              }}
              className={
                action.danger
                  ? 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-red-300 dark:hover:bg-red-900/40 dark:focus-visible:ring-blue-400'
                  : 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-pressed:bg-blue-900 dark:aria-pressed:text-blue-200'
              }
            >
              <svg
                className="h-[1.125rem] w-[1.125rem]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={action.toggle ? 2 : 1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d={action.path} />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}


export default DockFloatingToolbar;
