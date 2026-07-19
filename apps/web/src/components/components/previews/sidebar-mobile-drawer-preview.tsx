'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live preview for `sidebar-mobile-drawer`.
 *
 * Three preview-only changes; everything else is the real component:
 *  - the backdrop and panel are `absolute` inside this card rather than `fixed`
 *    to the viewport, so the drawer does not take over the gallery page. The
 *    shipped component uses `fixed inset-y-0 left-0`.
 *  - it starts OPEN, since a closed drawer previews as a lone hamburger. The
 *    initial-mount auto-focus is skipped for that reason - a preview that grabs
 *    focus on page load is a bug, not a demo. Open it yourself and focus does
 *    move to the first link, as shipped.
 *  - no body scroll lock: the drawer is bounded to this card, so there is no
 *    page scrolling under it to lock.
 *
 * The parts worth trying are real: Tab is trapped inside the panel, Escape
 * closes it and returns focus to the hamburger.
 *
 * Keep this in step with `src/data/components/sidebars.ts`.
 */
interface Item {
  href: string;
  label: string;
  current?: boolean;
}

const ITEMS: readonly Item[] = [
  { href: '/dashboard', label: 'Dashboard', current: true },
  { href: '/projects', label: 'Projects' },
  { href: '/team', label: 'Team' },
  { href: '/settings', label: 'Settings' },
];

export default function SidebarMobileDrawerPreview() {
  const [open, setOpen] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  /** False until the user opens it, so the seeded-open state never steals focus. */
  const userOpened = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    openRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function focusables(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
    }

    if (userOpened.current) focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <div className="relative min-h-72 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <button
          ref={openRef}
          type="button"
          aria-expanded={open}
          aria-controls="preview-dsidebar-panel"
          aria-label="Open sidebar"
          onClick={() => {
            userOpened.current = true;
            setOpen(true);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
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
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-gray-900 dark:text-gray-50">Adysre</span>
      </div>

      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        The drawer starts open. Try Tab - it wraps inside the panel - then Escape, which returns
        focus to the hamburger.
      </p>

      {open ? (
        <>
          <div className="absolute inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="preview-dsidebar-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            className="absolute inset-y-0 left-0 z-50 flex w-[min(16rem,80%)] flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900 dark:text-gray-50">Adysre</span>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
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
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Sidebar">
              <ul className="flex flex-col gap-0.5">
                {ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href="#"
                      aria-current={item.current ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}
