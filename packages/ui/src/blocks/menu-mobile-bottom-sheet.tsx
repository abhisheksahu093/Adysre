'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `menu-mobile-bottom-sheet`.
 *
 * Mirrors the `typescript` code variant verbatim. The sheet and its scrim are
 * positioned within the component's own bounded panel (not `fixed` to the
 * viewport) so the preview stays inside its stage; in a real app you render the
 * same markup at the document root with `fixed`. Escape or a scrim tap closes,
 * arrow keys rove the actions. Keep this in step with
 * `src/data/components/menus.ts`.
 */
interface SheetAction {
  id: string;
  label: string;
  danger?: boolean;
}

interface MenuBottomSheetProps {
  trigger: string;
  title: string;
  actions: readonly SheetAction[];
  onAction?: (id: string) => void;
  defaultOpen?: boolean;
}

const ACTIONS: readonly SheetAction[] = [
  { id: 'share', label: 'Share' },
  { id: 'copy', label: 'Copy link' },
  { id: 'report', label: 'Report' },
  { id: 'remove', label: 'Remove', danger: true },
];

export function MenuBottomSheet({ trigger, title, actions, onAction, defaultOpen = false }: MenuBottomSheetProps) {
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

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
    <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex min-h-64 items-center justify-center p-4">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {trigger}
        </button>
      </div>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="absolute inset-0 z-10 cursor-default bg-black/40"
          />
          <div
            role="menu"
            aria-label={title}
            onKeyDown={onMenuKey}
            className="absolute inset-x-0 bottom-0 z-20 rounded-t-2xl border-t border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mx-auto mb-2 mt-1 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {title}
            </p>
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
                className={`flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm focus-visible:outline-none ${
                  action.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export const minHeight = 300;

export default function MenuMobileBottomSheetPreview() {
  const [last, setLast] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <MenuBottomSheet trigger="Open actions" title="Post options" actions={ACTIONS} onAction={setLast} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last action: <span className="font-medium">{last}</span>
      </p>
    </div>
  );
}
