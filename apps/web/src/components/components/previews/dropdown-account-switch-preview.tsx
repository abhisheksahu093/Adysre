'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-account-switch`.
 *
 * Mirrors the `typescript` code variant verbatim, plus `defaultOpen`. Each
 * workspace is a `role="menuitemradio"` because switching PICKS the active one -
 * exactly one is `aria-checked`. "Add workspace" below the divider is a plain
 * `menuitem`: it is an action, not one of the choices. Both live on one ring,
 * so arrows walk straight through the divider. Avatars are gradient initials -
 * no images.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
}

const ACCOUNTS: readonly Account[] = [
  { id: 'northwind', name: 'Northwind', email: 'team@northwind.io', initials: 'NW' },
  { id: 'acme', name: 'Acme Corp', email: 'ops@acme.com', initials: 'AC' },
  { id: 'globex', name: 'Globex', email: 'hi@globex.dev', initials: 'GX' },
];

interface DropdownAccountSwitchProps {
  accounts: readonly Account[];
  activeId: string;
  onSwitch?: (id: string) => void;
  onAdd?: () => void;
  defaultOpen?: boolean;
}

function DropdownAccountSwitch({
  accounts,
  activeId,
  onSwitch,
  onAdd,
  defaultOpen = false,
}: DropdownAccountSwitchProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  const active = accounts.find((account) => account.id === activeId);
  const activeName = active?.name ?? 'Select workspace';
  const activeInitials = active?.initials ?? '?';
  const ringLength = accounts.length + 1;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    if (ringLength === 0) return;
    itemsRef.current[((index % ringLength) + ringLength) % ringLength]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusItem(ringLength - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : ringLength - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white"
        >
          {activeInitials}
        </span>
        <span className="max-w-[8rem] truncate">{activeName}</span>
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Switch workspace"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {accounts.map((account, index) => {
            const checked = account.id === activeId;
            return (
              <button
                key={account.id}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={checked}
                onClick={() => {
                  onSwitch?.(account.id);
                  close();
                }}
                className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white"
                >
                  {account.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {account.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                    {account.email}
                  </span>
                </span>
                {checked ? (
                  <svg
                    className="h-4 w-4 flex-none text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : null}
              </button>
            );
          })}

          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          <button
            ref={(node) => {
              itemsRef.current[accounts.length] = node;
            }}
            type="button"
            role="menuitem"
            onClick={() => {
              onAdd?.();
              close();
            }}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
          >
            <svg
              className="h-4 w-4 flex-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add workspace
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownAccountSwitchPreview() {
  const [activeId, setActiveId] = useState('northwind');
  const [note, setNote] = useState('northwind');

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-72 pt-4">
      <DropdownAccountSwitch
        accounts={ACCOUNTS}
        activeId={activeId}
        onSwitch={(id) => {
          setActiveId(id);
          setNote(id);
        }}
        onAdd={() => setNote('add workspace')}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last action: <span className="font-medium">{note}</span>
      </p>
    </div>
  );
}
