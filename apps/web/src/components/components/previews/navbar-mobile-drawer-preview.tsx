'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live preview for `navbar-mobile-drawer`.
 *
 * Mirrors the `typescript` code variant verbatim: the bar is a real full-width
 * header and the drawer is `fixed` to the viewport, so this renders identically
 * whether it sits in the library card (its own iframe document), on an
 * assembled playground page, or in a downloaded project.
 *
 * Tab is trapped inside the panel, Escape closes it and returns focus to the
 * hamburger, and the body scroll lock is live.
 * Keep this in step with `src/data/components/navbar.ts`.
 */
interface NavLink {
  href: string;
  label: string;
  current?: boolean;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export default function NavbarMobileDrawerPreview() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function focusables(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
    }

    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <header className="w-full">
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <a
          href="#"
          className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="navdrawer-panel"
          aria-label="Open main menu"
          onClick={() => setOpen(true)}
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
      </div>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="navdrawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(18rem,85vw)] flex-col gap-4 border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close main menu"
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

            <nav aria-label="Main">
              <ul className="flex flex-col gap-1">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href="#"
                      aria-current={link.current ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href="#"
              className="mt-auto rounded-lg bg-blue-600 px-3.5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get started
            </a>
          </div>
        </>
      ) : null}
    </header>
  );
}
