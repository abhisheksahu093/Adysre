'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `dropdown-profile`.
 *
 * Mirrors the `typescript` code variant verbatim. Arrow through it and notice
 * what the ring does NOT include: the name-and-email header. That is
 * information, not a command - putting it on the ring would add a stop that
 * does nothing when you press Enter. End jumps straight to Sign out, which is
 * the last item by construction.
 *
 * Seeded open, with `pb-` reserving the menu's room: it is absolutely
 * positioned and therefore out of flow, adding nothing to
 * `document.body.scrollHeight` - which is what preview-stage.tsx measures.
 *
 * Keep this in step with `src/data/components/dropdowns.ts`.
 */
const ITEMS: readonly string[] = ['Profile', 'Settings', 'Keyboard shortcuts'];

const ITEM_CLASS =
  'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

interface DropdownProfileProps {
  personName: string;
  email: string;
  avatarSrc: string;
  items: readonly string[];
  onSelect?: (item: string) => void;
  onSignOut?: () => void;
  defaultOpen?: boolean;
}

function DropdownProfile({
  personName,
  email,
  avatarSrc,
  items,
  onSelect,
  onSignOut,
  defaultOpen = false,
}: DropdownProfileProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const ringLength = items.length + 1;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
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
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
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
        aria-label={`Account menu for ${personName}`}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <img
          src={avatarSrc}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full bg-gray-200 object-cover dark:bg-gray-700"
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="px-3 pb-2 pt-2.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{personName}</p>
            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>

          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          {items.map((item, index) => (
            <button
              key={item}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect?.(item);
                close();
              }}
              className={ITEM_CLASS}
            >
              {item}
            </button>
          ))}

          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          <button
            ref={(node) => {
              itemsRef.current[items.length] = node;
            }}
            type="button"
            role="menuitem"
            onClick={() => {
              onSignOut?.();
              close();
            }}
            className={ITEM_CLASS}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function DropdownProfilePreview() {
  const [lastChoice, setLastChoice] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-72 pt-4">
      <DropdownProfile
        personName="Avery Chen"
        email="avery@northwind.io"
        avatarSrc="/promo/all-access.svg"
        items={ITEMS}
        onSelect={setLastChoice}
        onSignOut={() => setLastChoice('Sign out')}
        defaultOpen
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last choice: <span className="font-medium">{lastChoice}</span>
      </p>
    </div>
  );
}
