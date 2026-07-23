'use client';

import { useState } from 'react';

/**
 * Live preview for `list-keyboard-move`.
 *
 * Mirrors the `typescript` code variant verbatim. Move buttons reorder the rows;
 * the end rows disable the button that would do nothing. Keep this in step with
 * `src/data/components/lists.ts`.
 */
interface MovableItem {
  id: string;
  label: string;
}

interface ListKeyboardMoveProps {
  items: MovableItem[];
  ariaLabel?: string;
}

export function ListKeyboardMove({ items, ariaLabel = 'Reorderable list' }: ListKeyboardMoveProps) {
  const [order, setOrder] = useState<MovableItem[]>(items);
  const [status, setStatus] = useState('');

  function move(index: number, delta: number): void {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    const label = order[index]?.label ?? '';
    setOrder((current) => {
      const next = [...current];
      const a = next[index];
      const b = next[target];
      if (a && b) {
        next[index] = b;
        next[target] = a;
      }
      return next;
    });
    setStatus(`${label} moved to position ${target + 1}`);
  }

  return (
    <>
      <ul
        aria-label={ariaLabel}
        className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
      >
        {order.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
              {item.label}
            </span>
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={`Move ${item.label} up`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path fillRule="evenodd" d="M10 5a.75.75 0 0 1 .55.24l4.25 4.5a.75.75 0 1 1-1.1 1.02L10 6.85l-3.7 3.91a.75.75 0 1 1-1.1-1.02l4.25-4.5A.75.75 0 0 1 10 5Z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === order.length - 1}
              aria-label={`Move ${item.label} down`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path fillRule="evenodd" d="M10 15a.75.75 0 0 1-.55-.24l-4.25-4.5a.75.75 0 1 1 1.1-1.02L10 13.15l3.7-3.91a.75.75 0 1 1 1.1 1.02l-4.25 4.5A.75.75 0 0 1 10 15Z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </>
  );
}

const TASKS: MovableItem[] = [
  { id: '1', label: 'First priority task' },
  { id: '2', label: 'Review the design spec' },
  { id: '3', label: 'Ship the release notes' },
  { id: '4', label: 'Schedule the retro' },
];

export const minHeight = 240;

export default function ListKeyboardMovePreview() {
  return (
    <div className="w-full max-w-sm">
      <ListKeyboardMove items={TASKS} ariaLabel="Task priority" />
    </div>
  );
}
