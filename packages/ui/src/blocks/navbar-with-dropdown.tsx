'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `navbar-with-dropdown`.
 *
 * Mirrors the `typescript` code variant. The harness echoes the last chosen
 * entry so the keyboard path is visibly doing something: open with Enter,
 * move with the arrows, choose with Enter, Escape to back out. The bar row is
 * `min-h-14` + `flex-wrap` so at 320px the links wrap under the brand instead
 * of overflowing. Keep this in step with `src/data/components/navbar.ts`.
 */
const OPTIONS: readonly string[] = ['Analytics', 'Automation', 'Integrations'];

export function NavbarWithDropdown({ onSelect }: { onSelect?: (item: string) => void }) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!itemRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusOption(index: number): void {
    const count = OPTIONS.length;
    optionsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>): void {
    if (event.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (document.activeElement === triggerRef.current) {
      setOpen(true);
      window.requestAnimationFrame(() => focusOption(0));
      return;
    }
    const index = optionsRef.current.indexOf(document.activeElement as HTMLAnchorElement);
    if (index === -1) return;
    focusOption(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav
        className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2"
        aria-label="Main"
      >
        <a href="#" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="flex flex-wrap items-center gap-1">
          <li className="relative" ref={itemRef} onKeyDown={onKeyDown}>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="true"
              aria-expanded={open}
              aria-controls="navdrop-products"
              onClick={() => {
                const next = !open;
                setOpen(next);
                if (next) window.requestAnimationFrame(() => focusOption(0));
              }}
              className="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Products
              <svg
                className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
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
              <ul
                id="navdrop-products"
                className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {OPTIONS.map((option, index) => (
                  <li key={option}>
                    <a
                      ref={(node) => {
                        optionsRef.current[index] = node;
                      }}
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onSelect?.(option);
                        setOpen(false);
                      }}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:bg-gray-700"
                    >
                      {option}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
          <li>
            <a
              href="#"
              className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              Pricing
            </a>
          </li>
        </ul>

        <a
          href="#"
          className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign in
        </a>
      </nav>
    </header>
  );
}

export default function NavbarWithDropdownPreview() {
  const [chosen, setChosen] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="overflow-visible rounded-lg border border-gray-200 dark:border-gray-800">
        <NavbarWithDropdown onSelect={setChosen} />
      </div>
      <p className="px-1 text-xs text-gray-600 dark:text-gray-400">
        Chosen: <span className="font-medium">{chosen}</span>
      </p>
    </div>
  );
}
