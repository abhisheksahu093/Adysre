'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `menu-kebab-row-actions`.
 *
 * Mirrors the `typescript` code variant verbatim. One row owns one kebab and one
 * menu; the menu is anchored to the row's right edge and rendered in-flow via an
 * absolutely positioned layer so it never widens the row. Arrow keys rove,
 * Escape returns focus to the trigger. Keep this in step with
 * `src/data/components/menus.ts`.
 */
interface RowAction {
  id: string;
  label: string;
  danger?: boolean;
}

interface MenuKebabRowProps {
  title: string;
  subtitle?: string;
  actions: readonly RowAction[];
  onAction?: (id: string) => void;
  defaultOpen?: boolean;
}

const ACTIONS: readonly RowAction[] = [
  { id: 'rename', label: 'Rename' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete', danger: true },
];

export function MenuKebabRow({ title, subtitle, actions, onAction, defaultOpen = false }: MenuKebabRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const nodes = itemsRef.current.filter((n): n is HTMLButtonElement => n !== null);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const dir = event.key === 'ArrowDown' ? 1 : -1;
      nodes[(((idx + dir) % nodes.length) + nodes.length) % nodes.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      nodes[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      nodes[nodes.length - 1]?.focus();
    }
  }

  return (
    <div
      ref={rootRef}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
        {subtitle ? (
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        ) : null}
      </div>

      <div className="relative flex-none">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Actions for ${title}`}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </button>

        {open ? (
          <div
            role="menu"
            aria-label={`Actions for ${title}`}
            onKeyDown={onMenuKey}
            className="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {actions.map((action, index) => (
              <button
                key={action.id}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onAction?.(action.id);
                  close();
                }}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none ${
                  action.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const minHeight = 280;

export default function MenuKebabRowActionsPreview() {
  const [last, setLast] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col gap-2">
      <MenuKebabRow
        title="Q3 revenue model"
        subtitle="Edited 2 hours ago"
        actions={ACTIONS}
        onAction={setLast}
        defaultOpen
      />
      <MenuKebabRow title="Design tokens" subtitle="Edited yesterday" actions={ACTIONS} onAction={setLast} />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last action: <span className="font-medium">{last}</span>
      </p>
    </div>
  );
}
