import type { ComponentEntry } from './types';

/**
 * Dropdowns category.
 *
 * A dropdown is a menu button, and the WAI-ARIA menu button pattern is a
 * bargain: `aria-haspopup="menu"` PROMISES a screen reader user that arrow keys
 * work, and `role="menu"` / `role="menuitem"` repeat the promise on every row.
 * Ship the roles without the key handling and you have told someone to press
 * Down and then done nothing when they did - measurably worse than a plain
 * <button> and a <ul>, which at least announces what it is.
 *
 * So every entry here implements the whole model: Arrow/Home/End with wrap,
 * Escape out with focus back on the trigger, outside-click dismiss. What varies
 * is the CONTENT model - icons, groups, a submenu, a profile header - not the
 * keyboard, which is the same because users only learn it once.
 *
 * These are menus of ACTIONS. For picking a value out of a list you want a
 * listbox (`forms-select`); menuitem and option are not interchangeable.
 */
export const dropdownsComponents: ComponentEntry[] = [
  {
    slug: 'dropdown-basic',
    category: 'dropdowns',
    tags: ['dropdown', 'menu', 'keyboard', 'menuitem', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-28',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 2760, copies: 812, downloads: 208 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'string[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The menu button pattern, minimum viable version.

    aria-haspopup="menu"   the promise
    aria-expanded          the current state, kept in sync on every toggle
    aria-controls          which element the promise refers to
    role="menu"/"menuitem" the structure the promise describes

  aria-expanded is the one people forget to UPDATE. A hardcoded "false" that
  never changes is worse than no attribute at all: it actively tells a screen
  reader the menu is shut while it is open on screen.

  The chevron is aria-hidden - aria-expanded already says which way it points,
  and a glyph announcing "image" adds nothing but noise.
-->
<div class="dd">
  <button
    class="dd__trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="dd-basic-menu"
  >
    Options
    <svg class="dd__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  <ul class="dd__menu" id="dd-basic-menu" role="menu" aria-label="Options" hidden>
    <li role="none"><button class="dd__item" type="button" role="menuitem">Edit</button></li>
    <li role="none"><button class="dd__item" type="button" role="menuitem">Duplicate</button></li>
    <li role="none"><button class="dd__item" type="button" role="menuitem">Share</button></li>
    <li role="none"><button class="dd__item" type="button" role="menuitem">Delete</button></li>
  </ul>
</div>

<script>
  document.querySelectorAll('.dd').forEach(function (root) {
    var trigger = root.querySelector('.dd__trigger');
    var menu = root.querySelector('.dd__menu');
    var items = Array.prototype.slice.call(root.querySelectorAll('.dd__item'));

    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    function close() {
      setOpen(false);
      trigger.focus();
    }

    trigger.addEventListener('click', function () {
      var next = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(next);
      if (next && items[0]) items[0].focus();
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      setOpen(true);
      (event.key === 'ArrowDown' ? items[0] : items[items.length - 1]).focus();
    });

    menu.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        items[0].focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        items[items.length - 1].focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      var index = items.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      items[(next + items.length) % items.length].focus();
    });

    items.forEach(function (item) {
      item.addEventListener('click', close);
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.dd {
  position: relative;
  display: inline-block;
}

.dd__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.dd__trigger:hover {
  background-color: #f9fafb;
}

.dd__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.dd__chevron {
  width: 1rem;
  height: 1rem;
}

.dd__menu[hidden] {
  display: none;
}

.dd__menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  z-index: 20;
  min-width: 12rem;
  max-width: calc(100vw - 2rem);
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.dd__item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
}

/* Hover and focus share one style: arrow keys move real focus, so this
   highlight is the cursor for half the people using it. */
.dd__item:hover,
.dd__item:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

@media (prefers-color-scheme: dark) {
  .dd__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .dd__trigger:hover {
    background-color: #1f2937;
  }

  .dd__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .dd__menu {
    border-color: #374151;
    background-color: #111827;
  }

  .dd__item {
    color: #d1d5db;
  }

  .dd__item:hover,
  .dd__item:focus-visible {
    background-color: #1f2937;
    color: #f3f4f6;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="true"
    aria-controls="dd-basic-menu"
    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Options
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  <ul
    id="dd-basic-menu"
    role="menu"
    aria-label="Options"
    class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Edit
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Duplicate
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Share
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Delete
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function DropdownBasic({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
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
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
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

      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface DropdownBasicProps {
  label: string;
  items: readonly string[];
  onSelect?: (item: string) => void;
  className?: string;
}

export function DropdownBasic({ label, items, onSelect, className = '' }: DropdownBasicProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
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
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className={\`relative inline-block \${className}\`} ref={rootRef} onKeyDown={onKeyDown}>
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
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
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface DropdownBasicProps {
  label: string;
  /** Action labels. These are commands, not values - see the category note. */
  items: readonly string[];
  onSelect?: (item: string) => void;
  className?: string;
}

export function DropdownBasic({
  label,
  items,
  onSelect,
  className = '',
}: DropdownBasicProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
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
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className={\`relative inline-block \${className}\`} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        // Bound to state, never hardcoded: a stale "false" tells a screen
        // reader the menu is shut while it is open on screen.
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
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
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-with-icons',
    category: 'dropdowns',
    tags: ['dropdown', 'menu', 'icons', 'menuitem', 'keyboard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-15',
    updatedAt: '2026-07-10',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2100, copies: 618, downloads: 162 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'MenuItem[]', required: true, descriptionKey: 'items' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'danger', type: 'boolean', default: 'false', descriptionKey: 'danger' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      html: `<!--
  Every icon is aria-hidden and every row still has its text label. An icon
  beside a word is a scanning aid for people who already know the menu; it is
  never the name of the action. Strip the labels and you have a row of glyphs
  that announce as "button, button, button".

  The glyphs are drawn with stroke="currentColor", so they inherit the row's
  colour - including the hover and dark-mode shifts - instead of needing their
  own dark: variants and drifting out of step with the text beside them.
-->
<div class="idd">
  <button
    class="idd__trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="idd-menu"
  >
    Manage
    <svg class="idd__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  <ul class="idd__menu" id="idd-menu" role="menu" aria-label="Manage" hidden>
    <li role="none">
      <button class="idd__item" type="button" role="menuitem">
        <svg class="idd__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        Edit
      </button>
    </li>
    <li role="none">
      <button class="idd__item" type="button" role="menuitem">
        <svg class="idd__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Duplicate
      </button>
    </li>
    <li role="none">
      <button class="idd__item" type="button" role="menuitem">
        <svg class="idd__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
        </svg>
        Export
      </button>
    </li>
    <li role="none">
      <button class="idd__item idd__item--danger" type="button" role="menuitem">
        <svg class="idd__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
        Delete
      </button>
    </li>
  </ul>
</div>

<script>
  document.querySelectorAll('.idd').forEach(function (root) {
    var trigger = root.querySelector('.idd__trigger');
    var menu = root.querySelector('.idd__menu');
    var items = Array.prototype.slice.call(root.querySelectorAll('.idd__item'));

    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    function close() {
      setOpen(false);
      trigger.focus();
    }

    trigger.addEventListener('click', function () {
      var next = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(next);
      if (next && items[0]) items[0].focus();
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        items[0].focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        items[items.length - 1].focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      var index = items.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      items[(next + items.length) % items.length].focus();
    });

    items.forEach(function (item) {
      item.addEventListener('click', close);
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.idd {
  position: relative;
  display: inline-block;
}

.idd__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.idd__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.idd__chevron {
  width: 1rem;
  height: 1rem;
}

.idd__menu[hidden] {
  display: none;
}

.idd__menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  z-index: 20;
  min-width: 13rem;
  max-width: calc(100vw - 2rem);
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.idd__item {
  display: flex;
  align-items: center;
  /* Fixed gap + fixed icon box, so the labels form one column even when a
     glyph is optically narrower than its neighbours. */
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
}

.idd__icon {
  flex: none;
  width: 1rem;
  height: 1rem;
  /* Slightly quieter than the label at rest - the word is the action, the
     glyph is the hint. */
  color: #6b7280;
}

.idd__item:hover,
.idd__item:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

.idd__item:hover .idd__icon,
.idd__item:focus-visible .idd__icon {
  color: inherit;
}

.idd__item--danger {
  color: #b91c1c;
}

.idd__item--danger .idd__icon {
  color: #b91c1c;
}

.idd__item--danger:hover,
.idd__item--danger:focus-visible {
  background-color: #fee2e2;
  color: #991b1b;
}

@media (prefers-color-scheme: dark) {
  .idd__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .idd__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .idd__menu {
    border-color: #374151;
    background-color: #111827;
  }

  .idd__item {
    color: #d1d5db;
  }

  .idd__icon {
    color: #9ca3af;
  }

  .idd__item:hover,
  .idd__item:focus-visible {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .idd__item--danger,
  .idd__item--danger .idd__icon {
    color: #fca5a5;
  }

  .idd__item--danger:hover,
  .idd__item--danger:focus-visible {
    background-color: rgba(127, 29, 29, 0.4);
    color: #fecaca;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="true"
    aria-controls="idd-menu"
    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Manage
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  <ul
    id="idd-menu"
    role="menu"
    aria-label="Manage"
    class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li role="none">
      <button type="button" role="menuitem" class="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <svg class="h-4 w-4 flex-none text-gray-500 group-hover:text-current group-focus-visible:text-current dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        Edit
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <svg class="h-4 w-4 flex-none text-gray-500 group-hover:text-current group-focus-visible:text-current dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Duplicate
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <svg class="h-4 w-4 flex-none text-gray-500 group-hover:text-current group-focus-visible:text-current dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
        </svg>
        Export
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40">
        <svg class="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
        Delete
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

// Each item carries its own glyph. \`danger\` is a flag, not a colour, so the
// component decides how danger looks in one place.
export function DropdownWithIcons({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
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
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement);
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
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
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

      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item.id);
                  close();
                }}
                className={
                  item.danger
                    ? 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40'
                    : 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100'
                }
              >
                {/* aria-hidden, always: the label beside it is the name. */}
                <span className="flex-none" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  danger?: boolean;
}

interface DropdownWithIconsProps {
  label: string;
  items: readonly MenuItem[];
  onSelect?: (id: string) => void;
}

export function DropdownWithIcons({ label, items, onSelect }: DropdownWithIconsProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
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
      focusItem(items.length - 1);
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
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
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
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item.id);
                  close();
                }}
                className={
                  item.danger
                    ? 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40'
                    : 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100'
                }
              >
                <span className="flex-none" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface MenuItem {
  id: string;
  /** Required - the icon is a hint, this is the accessible name. */
  label: string;
  /** Rendered inside an aria-hidden span. Use stroke="currentColor". */
  icon: ReactNode;
  danger?: boolean;
}

export interface DropdownWithIconsProps {
  label: string;
  items: readonly MenuItem[];
  onSelect?: (id: string) => void;
}

export function DropdownWithIcons({
  label,
  items,
  onSelect,
}: DropdownWithIconsProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
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
      focusItem(items.length - 1);
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
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
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
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item.id);
                  close();
                }}
                className={
                  item.danger
                    ? 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40'
                    : 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100'
                }
              >
                <span className="flex-none" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-grouped',
    category: 'dropdowns',
    tags: ['dropdown', 'menu', 'group', 'separator', 'sections'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-08',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1220, copies: 318, downloads: 84 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'MenuGroup[]', required: true, descriptionKey: 'items' },
      { name: 'danger', type: 'boolean', default: 'false', descriptionKey: 'danger' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      html: `<!--
  Groups are semantic, not decorative. Each section is a role="group" with
  aria-labelledby pointing at its own heading, so a screen reader announces
  "Editing, group" before reading its items instead of running twelve unrelated
  commands together in one undifferentiated list.

  Two things people get wrong here:

  1. The heading is aria-hidden="true" AND referenced by aria-labelledby. Not a
     contradiction: aria-labelledby reads the element's text even when it is
     hidden from the tree, so the group gets its name once, as a name, rather
     than twice - once as the group's label and again as a stray text node.
  2. The <hr> is role="separator". Its default role IS separator, but only when
     it is a direct child of the menu; inside a group container browsers vary,
     so it is stated. A separator is never focusable - the arrow-key ring skips
     it, which is why the flat item list below is built from the groups rather
     than from the DOM order.
-->
<div class="gdd">
  <button
    class="gdd__trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="gdd-menu"
  >
    Document
  </button>

  <div class="gdd__menu" id="gdd-menu" role="menu" aria-label="Document" hidden>
    <div role="group" aria-labelledby="gdd-g1">
      <p class="gdd__label" id="gdd-g1" aria-hidden="true">Editing</p>
      <button class="gdd__item" type="button" role="menuitem">Rename</button>
      <button class="gdd__item" type="button" role="menuitem">Duplicate</button>
    </div>

    <hr class="gdd__sep" role="separator" />

    <div role="group" aria-labelledby="gdd-g2">
      <p class="gdd__label" id="gdd-g2" aria-hidden="true">Sharing</p>
      <button class="gdd__item" type="button" role="menuitem">Invite people</button>
      <button class="gdd__item" type="button" role="menuitem">Copy link</button>
    </div>

    <hr class="gdd__sep" role="separator" />

    <div role="group" aria-labelledby="gdd-g3">
      <p class="gdd__label" id="gdd-g3" aria-hidden="true">Danger zone</p>
      <button class="gdd__item gdd__item--danger" type="button" role="menuitem">Delete</button>
    </div>
  </div>
</div>

<script>
  document.querySelectorAll('.gdd').forEach(function (root) {
    var trigger = root.querySelector('.gdd__trigger');
    var menu = root.querySelector('.gdd__menu');
    // Only .gdd__item - the labels and separators are not stops on the ring.
    var items = Array.prototype.slice.call(root.querySelectorAll('.gdd__item'));

    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    function close() {
      setOpen(false);
      trigger.focus();
    }

    trigger.addEventListener('click', function () {
      var next = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(next);
      if (next && items[0]) items[0].focus();
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        items[0].focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        items[items.length - 1].focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      var index = items.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      // Arrow keys cross group boundaries without stopping. Groups organise
      // the eye; they do not partition the keyboard.
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      items[(next + items.length) % items.length].focus();
    });

    items.forEach(function (item) {
      item.addEventListener('click', close);
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.gdd {
  position: relative;
  display: inline-block;
}

.gdd__trigger {
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.gdd__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.gdd__menu[hidden] {
  display: none;
}

.gdd__menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  z-index: 20;
  min-width: 13rem;
  max-width: calc(100vw - 2rem);
  padding: 0.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.gdd__label {
  margin: 0;
  padding: 0.375rem 0.75rem 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  /* #6b7280 is the floor for 4.5:1 on white. Uppercase 11px is already hard
     to read; do not also make it faint. */
  color: #6b7280;
}

.gdd__sep {
  height: 1px;
  margin: 0.25rem 0;
  border: 0;
  background-color: #e5e7eb;
}

.gdd__item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
}

.gdd__item:hover,
.gdd__item:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

.gdd__item--danger {
  color: #b91c1c;
}

.gdd__item--danger:hover,
.gdd__item--danger:focus-visible {
  background-color: #fee2e2;
  color: #991b1b;
}

@media (prefers-color-scheme: dark) {
  .gdd__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .gdd__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .gdd__menu {
    border-color: #374151;
    background-color: #111827;
  }

  .gdd__label {
    color: #9ca3af;
  }

  .gdd__sep {
    background-color: #374151;
  }

  .gdd__item {
    color: #d1d5db;
  }

  .gdd__item:hover,
  .gdd__item:focus-visible {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .gdd__item--danger {
    color: #fca5a5;
  }

  .gdd__item--danger:hover,
  .gdd__item--danger:focus-visible {
    background-color: rgba(127, 29, 29, 0.4);
    color: #fecaca;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="true"
    aria-controls="gdd-menu"
    class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Document
  </button>

  <div
    id="gdd-menu"
    role="menu"
    aria-label="Document"
    class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <div role="group" aria-labelledby="gdd-g1">
      <p id="gdd-g1" aria-hidden="true" class="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Editing
      </p>
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Rename
      </button>
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Duplicate
      </button>
    </div>

    <hr role="separator" class="my-1 border-0 h-px bg-gray-200 dark:bg-gray-700" />

    <div role="group" aria-labelledby="gdd-g2">
      <p id="gdd-g2" aria-hidden="true" class="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Sharing
      </p>
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Invite people
      </button>
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Copy link
      </button>
    </div>

    <hr role="separator" class="my-1 border-0 h-px bg-gray-200 dark:bg-gray-700" />

    <div role="group" aria-labelledby="gdd-g3">
      <p id="gdd-g3" aria-hidden="true" class="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Danger zone
      </p>
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40">
        Delete
      </button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function DropdownGrouped({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();
  const groupIdBase = useId();

  // The ring is built from the DATA, flattened across groups - never from a
  // DOM query, which would sweep up labels and separators as focus stops.
  const flat = useMemo(() => items.flatMap((group) => group.items), [items]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = flat.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
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
      focusItem(flat.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let cursor = -1;

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
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group, groupIndex) => (
            <div key={group.name}>
              {groupIndex > 0 && (
                <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              )}
              <div role="group" aria-labelledby={\`\${groupIdBase}-\${groupIndex}\`}>
                <p
                  id={\`\${groupIdBase}-\${groupIndex}\`}
                  aria-hidden="true"
                  className="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {group.name}
                </p>
                {group.items.map((item) => {
                  cursor += 1;
                  const index = cursor;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        itemsRef.current[index] = node;
                      }}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelect?.(item.id);
                        close();
                      }}
                      className={
                        item.danger
                          ? 'block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40'
                          : 'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800'
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface GroupedItem {
  id: string;
  label: string;
  danger?: boolean;
}

export interface MenuGroup {
  name: string;
  items: readonly GroupedItem[];
}

interface DropdownGroupedProps {
  label: string;
  items: readonly MenuGroup[];
  onSelect?: (id: string) => void;
}

export function DropdownGrouped({ label, items, onSelect }: DropdownGroupedProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const groupIdBase = useId();

  const flat = useMemo(() => items.flatMap((group) => group.items), [items]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = flat.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
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
      focusItem(flat.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let cursor = -1;

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
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group, groupIndex) => (
            <div key={group.name}>
              {groupIndex > 0 ? (
                <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              ) : null}
              <div role="group" aria-labelledby={\`\${groupIdBase}-\${groupIndex}\`}>
                <p
                  id={\`\${groupIdBase}-\${groupIndex}\`}
                  aria-hidden="true"
                  className="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {group.name}
                </p>
                {group.items.map((item) => {
                  cursor += 1;
                  const index = cursor;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        itemsRef.current[index] = node;
                      }}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelect?.(item.id);
                        close();
                      }}
                      className={
                        item.danger
                          ? 'block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40'
                          : 'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800'
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface GroupedItem {
  id: string;
  label: string;
  danger?: boolean;
}

export interface MenuGroup {
  /** The group's heading. Becomes its accessible name via aria-labelledby. */
  name: string;
  items: readonly GroupedItem[];
}

export interface DropdownGroupedProps {
  label: string;
  items: readonly MenuGroup[];
  onSelect?: (id: string) => void;
}

export function DropdownGrouped({
  label,
  items,
  onSelect,
}: DropdownGroupedProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const groupIdBase = useId();

  /**
   * One flat ring across every group. Groups organise the eye; they do not
   * partition the keyboard - Down on the last item of "Editing" lands on the
   * first item of "Sharing", not on a dead end.
   */
  const flat = useMemo(() => items.flatMap((group) => group.items), [items]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = flat.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
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
      focusItem(flat.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  // Walks the render in the same order as \`flat\`, so ref slot N is ring slot N.
  let cursor = -1;

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
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group, groupIndex) => (
            <div key={group.name}>
              {groupIndex > 0 ? (
                <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              ) : null}
              <div role="group" aria-labelledby={\`\${groupIdBase}-\${groupIndex}\`}>
                {/*
                  aria-hidden AND referenced by aria-labelledby. Not a
                  contradiction: labelledby reads a hidden element's text, so
                  the group is NAMED once rather than also announced as a
                  stray text node inside itself.
                */}
                <p
                  id={\`\${groupIdBase}-\${groupIndex}\`}
                  aria-hidden="true"
                  className="px-3 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {group.name}
                </p>
                {group.items.map((item) => {
                  cursor += 1;
                  const index = cursor;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        itemsRef.current[index] = node;
                      }}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelect?.(item.id);
                        close();
                      }}
                      className={
                        item.danger
                          ? 'block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-100 hover:text-red-800 focus-visible:bg-red-100 focus-visible:outline-none dark:text-red-300 dark:hover:bg-red-900/40 dark:hover:text-red-200 dark:focus-visible:bg-red-900/40'
                          : 'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800'
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-nested',
    category: 'dropdowns',
    tags: ['dropdown', 'submenu', 'nested', 'flyout', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-25',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 940, copies: 232, downloads: 58 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'NestedItem[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      html: `<!--
  A submenu opens SIDEWAYS, and that direction is the whole keyboard model:

    ArrowRight   on a parent item   opens the submenu, focus onto its first item
    ArrowLeft    inside a submenu   closes it, focus BACK on the parent item
    ArrowUp/Down inside a submenu   move within it, not the parent
    Escape       inside a submenu   closes just the submenu - one level, not all

  Left/Right map onto the direction the panel physically travels. That is why
  the flyout goes to the side rather than expanding in place: the geometry is
  teaching the shortcut.

  The parent item is itself a menuitem with its own aria-haspopup="menu" and
  aria-expanded - it is both a row in this menu and the trigger for the next.
  Escape closing only ONE level is the detail most implementations miss; a user
  who opened three levels expects to walk back out, not be ejected.
-->
<div class="ndd">
  <button
    class="ndd__trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="ndd-menu"
  >
    Insert
  </button>

  <ul class="ndd__menu" id="ndd-menu" role="menu" aria-label="Insert" hidden>
    <li role="none"><button class="ndd__item" type="button" role="menuitem">Text block</button></li>
    <li role="none"><button class="ndd__item" type="button" role="menuitem">Image</button></li>
    <li class="ndd__sub" role="none">
      <button
        class="ndd__item ndd__item--parent"
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="ndd-submenu"
      >
        Embed
        <svg class="ndd__caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
      <ul class="ndd__submenu" id="ndd-submenu" role="menu" aria-label="Embed" hidden>
        <li role="none"><button class="ndd__item" type="button" role="menuitem">Video</button></li>
        <li role="none"><button class="ndd__item" type="button" role="menuitem">Code sandbox</button></li>
        <li role="none"><button class="ndd__item" type="button" role="menuitem">Figma frame</button></li>
      </ul>
    </li>
    <li role="none"><button class="ndd__item" type="button" role="menuitem">Divider</button></li>
  </ul>
</div>

<script>
  document.querySelectorAll('.ndd').forEach(function (root) {
    var trigger = root.querySelector('.ndd__trigger');
    var menu = root.querySelector('.ndd__menu');
    var parent = root.querySelector('.ndd__item--parent');
    var submenu = root.querySelector('.ndd__submenu');
    // Top-level ring EXCLUDES the submenu's own items.
    var top = Array.prototype.filter.call(root.querySelectorAll('.ndd__item'), function (el) {
      return !submenu.contains(el);
    });
    var subItems = Array.prototype.slice.call(submenu.querySelectorAll('.ndd__item'));

    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (!open) setSubOpen(false);
    }

    function setSubOpen(open) {
      submenu.hidden = !open;
      parent.setAttribute('aria-expanded', String(open));
    }

    function ring(items, from, delta) {
      var next = from + delta;
      items[(next + items.length) % items.length].focus();
    }

    trigger.addEventListener('click', function () {
      var next = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(next);
      if (next) top[0].focus();
    });

    parent.addEventListener('click', function () {
      var next = parent.getAttribute('aria-expanded') !== 'true';
      setSubOpen(next);
      if (next) subItems[0].focus();
    });

    submenu.addEventListener('keydown', function (event) {
      var index = subItems.indexOf(document.activeElement);
      if (index === -1) return;

      // Left and Escape both mean "one level out" - never "close everything".
      if (event.key === 'ArrowLeft' || event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setSubOpen(false);
        parent.focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      event.stopPropagation();
      ring(subItems, index, event.key === 'ArrowDown' ? 1 : -1);
    });

    menu.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.focus();
        return;
      }

      var index = top.indexOf(document.activeElement);
      if (index === -1) return;

      if (event.key === 'ArrowRight' && document.activeElement === parent) {
        event.preventDefault();
        setSubOpen(true);
        subItems[0].focus();
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        top[0].focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        top[top.length - 1].focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      // Moving off the parent row closes its flyout - a submenu hanging beside
      // an unfocused row is a ghost.
      setSubOpen(false);
      ring(top, index, event.key === 'ArrowDown' ? 1 : -1);
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.ndd {
  position: relative;
  display: inline-block;
}

.ndd__trigger {
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.ndd__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.ndd__menu[hidden],
.ndd__submenu[hidden] {
  display: none;
}

.ndd__menu,
.ndd__submenu {
  z-index: 20;
  min-width: 12rem;
  max-width: calc(100vw - 2rem);
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.ndd__menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
}

.ndd__sub {
  position: relative;
}

/*
 * Sideways, and overlapping the parent by 4px. The gap is deliberate: a
 * submenu flush against its parent leaves a diagonal dead zone the pointer
 * falls through on the way to it.
 */
.ndd__submenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
}

@media (min-width: 640px) {
  .ndd__submenu {
    top: -0.25rem;
    left: calc(100% - 0.25rem);
    right: auto;
    margin-top: 0;
  }
}

.ndd__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
}

.ndd__item:hover,
.ndd__item:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

/* The caret points the way ArrowRight goes. */
.ndd__caret {
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .ndd__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .ndd__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .ndd__menu,
  .ndd__submenu {
    border-color: #374151;
    background-color: #111827;
  }

  .ndd__item {
    color: #d1d5db;
  }

  .ndd__item:hover,
  .ndd__item:focus-visible {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .ndd__caret {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="true"
    aria-controls="ndd-menu"
    class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Insert
  </button>

  <ul
    id="ndd-menu"
    role="menu"
    aria-label="Insert"
    class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li role="none">
      <button type="button" role="menuitem" class="flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Text block
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Image
      </button>
    </li>

    <!-- Both a row in this menu AND the trigger for the next one. -->
    <li role="none" class="relative">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded="true"
        aria-controls="ndd-submenu"
        class="flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
      >
        Embed
        <svg class="h-3.5 w-3.5 flex-none text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <!-- left-[calc(100%-0.25rem)]: overlap by 4px so the pointer cannot fall
           through a diagonal gap on the way over. -->
      <ul
        id="ndd-submenu"
        role="menu"
        aria-label="Embed"
        class="absolute left-0 right-0 top-full mt-1 z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg sm:left-[calc(100%-0.25rem)] sm:right-auto sm:-top-1 sm:mt-0 dark:border-gray-700 dark:bg-gray-900"
      >
        <li role="none">
          <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
            Video
          </button>
        </li>
        <li role="none">
          <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
            Code sandbox
          </button>
        </li>
        <li role="none">
          <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
            Figma frame
          </button>
        </li>
      </ul>
    </li>

    <li role="none">
      <button type="button" role="menuitem" class="flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Divider
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function DropdownNested({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const topRef = useRef([]);
  const subRef = useRef([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setOpenSub(null);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusTop(index) {
    const count = items.length;
    topRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    setOpenSub(null);
    triggerRef.current?.focus();
  }

  function onSubKeyDown(event, parentIndex, subCount) {
    const index = subRef.current.indexOf(document.activeElement);
    if (index === -1) return;

    // One level out. Never all the way.
    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpenSub(null);
      topRef.current[parentIndex]?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    event.stopPropagation();
    const next = index + (event.key === 'ArrowDown' ? 1 : -1);
    subRef.current[((next % subCount) + subCount) % subCount]?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      close();
      return;
    }
    const index = topRef.current.indexOf(document.activeElement);
    if (index === -1) return;

    if (event.key === 'ArrowRight' && items[index]?.items) {
      event.preventDefault();
      setOpenSub(index);
      window.requestAnimationFrame(() => subRef.current[0]?.focus());
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusTop(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusTop(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setOpenSub(null);
    focusTop(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  const ITEM_CLASS =
    'flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

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
          if (next) window.requestAnimationFrame(() => focusTop(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id} className={item.items ? 'relative' : undefined}>
              <button
                ref={(node) => {
                  topRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                aria-haspopup={item.items ? 'menu' : undefined}
                aria-expanded={item.items ? openSub === index : undefined}
                onClick={() => {
                  if (item.items) {
                    const next = openSub === index ? null : index;
                    setOpenSub(next);
                    if (next !== null) window.requestAnimationFrame(() => subRef.current[0]?.focus());
                    return;
                  }
                  onSelect?.(item.id);
                  close();
                }}
                className={ITEM_CLASS}
              >
                {item.label}
                {item.items && (
                  <svg
                    className="h-3.5 w-3.5 flex-none text-gray-500 dark:text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </button>

              {item.items && openSub === index && (
                <ul
                  role="menu"
                  aria-label={item.label}
                  onKeyDown={(event) => onSubKeyDown(event, index, item.items.length)}
                  className="absolute left-0 right-0 top-full mt-1 z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg sm:left-[calc(100%-0.25rem)] sm:right-auto sm:-top-1 sm:mt-0 dark:border-gray-700 dark:bg-gray-900"
                >
                  {item.items.map((child, childIndex) => (
                    <li role="none" key={child.id}>
                      <button
                        ref={(node) => {
                          subRef.current[childIndex] = node;
                        }}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSelect?.(child.id);
                          close();
                        }}
                        className={ITEM_CLASS}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface NestedChild {
  id: string;
  label: string;
}

export interface NestedItem {
  id: string;
  label: string;
  /** Presence of this array is what makes the row a submenu parent. */
  items?: readonly NestedChild[];
}

interface DropdownNestedProps {
  label: string;
  items: readonly NestedItem[];
  onSelect?: (id: string) => void;
}

const ITEM_CLASS =
  'flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

export function DropdownNested({ label, items, onSelect }: DropdownNestedProps) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<Array<HTMLButtonElement | null>>([]);
  const subRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setOpenSub(null);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusTop(index: number): void {
    const count = items.length;
    topRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    setOpenSub(null);
    triggerRef.current?.focus();
  }

  function onSubKeyDown(
    event: KeyboardEvent<HTMLUListElement>,
    parentIndex: number,
    subCount: number,
  ): void {
    const index = subRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpenSub(null);
      topRef.current[parentIndex]?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    event.stopPropagation();
    const next = index + (event.key === 'ArrowDown' ? 1 : -1);
    subRef.current[((next % subCount) + subCount) % subCount]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    const index = topRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    if (event.key === 'ArrowRight' && items[index]?.items) {
      event.preventDefault();
      setOpenSub(index);
      window.requestAnimationFrame(() => subRef.current[0]?.focus());
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusTop(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusTop(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setOpenSub(null);
    focusTop(event.key === 'ArrowDown' ? index + 1 : index - 1);
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
          if (next) window.requestAnimationFrame(() => focusTop(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id} className={item.items ? 'relative' : undefined}>
              <button
                ref={(node) => {
                  topRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                {...(item.items
                  ? { 'aria-haspopup': 'menu' as const, 'aria-expanded': openSub === index }
                  : {})}
                onClick={() => {
                  if (item.items) {
                    const next = openSub === index ? null : index;
                    setOpenSub(next);
                    if (next !== null) {
                      window.requestAnimationFrame(() => subRef.current[0]?.focus());
                    }
                    return;
                  }
                  onSelect?.(item.id);
                  close();
                }}
                className={ITEM_CLASS}
              >
                {item.label}
                {item.items ? (
                  <svg
                    className="h-3.5 w-3.5 flex-none text-gray-500 dark:text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                ) : null}
              </button>

              {item.items && openSub === index ? (
                <ul
                  role="menu"
                  aria-label={item.label}
                  onKeyDown={(event) => onSubKeyDown(event, index, item.items?.length ?? 0)}
                  className="absolute left-0 right-0 top-full mt-1 z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg sm:left-[calc(100%-0.25rem)] sm:right-auto sm:-top-1 sm:mt-0 dark:border-gray-700 dark:bg-gray-900"
                >
                  {item.items.map((child, childIndex) => (
                    <li role="none" key={child.id}>
                      <button
                        ref={(node) => {
                          subRef.current[childIndex] = node;
                        }}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSelect?.(child.id);
                          close();
                        }}
                        className={ITEM_CLASS}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface NestedChild {
  id: string;
  label: string;
}

export interface NestedItem {
  id: string;
  label: string;
  /** Presence of this array is what makes the row a submenu parent. */
  items?: readonly NestedChild[];
}

export interface DropdownNestedProps {
  label: string;
  items: readonly NestedItem[];
  onSelect?: (id: string) => void;
}

const ITEM_CLASS =
  'flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

export function DropdownNested({
  label,
  items,
  onSelect,
}: DropdownNestedProps): JSX.Element {
  const [open, setOpen] = useState(false);
  /** Index of the parent whose flyout is open. At most one at a time. */
  const [openSub, setOpenSub] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<Array<HTMLButtonElement | null>>([]);
  const subRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setOpenSub(null);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusTop(index: number): void {
    const count = items.length;
    topRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    setOpenSub(null);
    triggerRef.current?.focus();
  }

  function onSubKeyDown(
    event: KeyboardEvent<HTMLUListElement>,
    parentIndex: number,
    subCount: number,
  ): void {
    const index = subRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;

    /*
     * stopPropagation is the load-bearing call. Without it this Escape also
     * reaches the parent menu's handler and the whole stack collapses - the
     * user asked to step back one level, not to be ejected.
     */
    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpenSub(null);
      topRef.current[parentIndex]?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    event.stopPropagation();
    const next = index + (event.key === 'ArrowDown' ? 1 : -1);
    subRef.current[((next % subCount) + subCount) % subCount]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    const index = topRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;

    // Right opens the flyout - the same direction the panel travels.
    if (event.key === 'ArrowRight' && items[index]?.items) {
      event.preventDefault();
      setOpenSub(index);
      window.requestAnimationFrame(() => subRef.current[0]?.focus());
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusTop(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusTop(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    // Moving off the parent row closes its flyout: a submenu hanging beside an
    // unfocused row is a ghost.
    setOpenSub(null);
    focusTop(event.key === 'ArrowDown' ? index + 1 : index - 1);
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
          if (next) window.requestAnimationFrame(() => focusTop(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item.id} className={item.items ? 'relative' : undefined}>
              <button
                ref={(node) => {
                  topRef.current[index] = node;
                }}
                type="button"
                // A menuitem AND a menu trigger: it owns the next level.
                role="menuitem"
                {...(item.items
                  ? { 'aria-haspopup': 'menu' as const, 'aria-expanded': openSub === index }
                  : {})}
                onClick={() => {
                  if (item.items) {
                    const next = openSub === index ? null : index;
                    setOpenSub(next);
                    if (next !== null) {
                      window.requestAnimationFrame(() => subRef.current[0]?.focus());
                    }
                    return;
                  }
                  onSelect?.(item.id);
                  close();
                }}
                className={ITEM_CLASS}
              >
                {item.label}
                {item.items ? (
                  <svg
                    className="h-3.5 w-3.5 flex-none text-gray-500 dark:text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                ) : null}
              </button>

              {item.items && openSub === index ? (
                <ul
                  role="menu"
                  aria-label={item.label}
                  onKeyDown={(event) => onSubKeyDown(event, index, item.items?.length ?? 0)}
                  className="absolute left-0 right-0 top-full mt-1 z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg sm:left-[calc(100%-0.25rem)] sm:right-auto sm:-top-1 sm:mt-0 dark:border-gray-700 dark:bg-gray-900"
                >
                  {item.items.map((child, childIndex) => (
                    <li role="none" key={child.id}>
                      <button
                        ref={(node) => {
                          subRef.current[childIndex] = node;
                        }}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSelect?.(child.id);
                          close();
                        }}
                        className={ITEM_CLASS}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-profile',
    category: 'dropdowns',
    tags: ['dropdown', 'profile', 'avatar', 'account', 'signout'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-06',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 2340, copies: 690, downloads: 178 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'avatar', labelKey: 'avatar' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'personName', type: 'string', required: true, descriptionKey: 'personName' },
      { name: 'email', type: 'string', required: true, descriptionKey: 'email' },
      { name: 'items', type: 'string[]', required: true, descriptionKey: 'items' },
      { name: 'avatarSrc', type: 'string', descriptionKey: 'avatarSrc' },
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
      { name: 'onSignOut', type: '() => void', descriptionKey: 'onSignOut' },
    ],
    code: {
      html: `<!--
  Two details specific to this shape:

  1. The HEADER is not a menuitem. It is your name and email - information, not
     a command. Making it focusable adds a stop to the arrow-key ring that does
     nothing when you press Enter on it. It sits outside role="menu" entirely,
     which is also why the trigger's aria-label names the person: the popup's
     name is not the button's name.

  2. Sign out is separated but is NOT a destructive action dressed in red. It is
     reversible - you log back in. Red here would spend the alarm you need for
     "delete account", one row below in most real apps.

  The avatar is decorative (alt=""): the name is right beside it in text, and a
  screen reader announcing "Avery Chen, image" then "Avery Chen" is noise.
-->
<div class="pdd">
  <button
    class="pdd__trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="pdd-menu"
    aria-label="Account menu for Avery Chen"
  >
    <img class="pdd__avatar" src="/avatars/avery.jpg" alt="" width="32" height="32" />
  </button>

  <div class="pdd__menu" id="pdd-menu" role="menu" aria-label="Account" hidden>
    <div class="pdd__head">
      <p class="pdd__name">Avery Chen</p>
      <p class="pdd__email">avery@northwind.io</p>
    </div>

    <hr class="pdd__sep" role="separator" />

    <button class="pdd__item" type="button" role="menuitem">Profile</button>
    <button class="pdd__item" type="button" role="menuitem">Settings</button>
    <button class="pdd__item" type="button" role="menuitem">Keyboard shortcuts</button>

    <hr class="pdd__sep" role="separator" />

    <button class="pdd__item" type="button" role="menuitem">Sign out</button>
  </div>
</div>

<script>
  document.querySelectorAll('.pdd').forEach(function (root) {
    var trigger = root.querySelector('.pdd__trigger');
    var menu = root.querySelector('.pdd__menu');
    var items = Array.prototype.slice.call(root.querySelectorAll('.pdd__item'));

    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    function close() {
      setOpen(false);
      trigger.focus();
    }

    trigger.addEventListener('click', function () {
      var next = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(next);
      if (next && items[0]) items[0].focus();
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        items[0].focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        items[items.length - 1].focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      var index = items.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      items[(next + items.length) % items.length].focus();
    });

    items.forEach(function (item) {
      item.addEventListener('click', close);
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.pdd {
  position: relative;
  display: inline-block;
}

.pdd__trigger {
  display: inline-flex;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background: none;
  cursor: pointer;
}

.pdd__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.pdd__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
  background-color: #e5e7eb;
}

.pdd__menu[hidden] {
  display: none;
}

.pdd__menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  /* Anchored right: an avatar lives in the top-right corner, and a menu
     growing rightward from it goes off the page. */
  right: 0;
  z-index: 20;
  min-width: 14rem;
  max-width: calc(100vw - 2rem);
  padding: 0.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.pdd__head {
  padding: 0.625rem 0.75rem 0.5rem;
}

.pdd__name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.pdd__email {
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
  /* Emails are long and this menu is 14rem. Truncate rather than let the box
     grow to fit the longest address any user might have. */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pdd__sep {
  height: 1px;
  margin: 0.25rem 0;
  border: 0;
  background-color: #e5e7eb;
}

.pdd__item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
}

.pdd__item:hover,
.pdd__item:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

@media (prefers-color-scheme: dark) {
  .pdd__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .pdd__avatar {
    background-color: #374151;
  }

  .pdd__menu {
    border-color: #374151;
    background-color: #111827;
  }

  .pdd__name {
    color: #f3f4f6;
  }

  .pdd__email {
    color: #9ca3af;
  }

  .pdd__sep {
    background-color: #374151;
  }

  .pdd__item {
    color: #d1d5db;
  }

  .pdd__item:hover,
  .pdd__item:focus-visible {
    background-color: #1f2937;
    color: #f3f4f6;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="true"
    aria-controls="pdd-menu"
    aria-label="Account menu for Avery Chen"
    class="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <img src="/avatars/avery.jpg" alt="" width="32" height="32" class="h-8 w-8 rounded-full bg-gray-200 object-cover dark:bg-gray-700" />
  </button>

  <div
    id="pdd-menu"
    role="menu"
    aria-label="Account"
    class="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <!-- Information, not a command. Outside the item ring on purpose. -->
    <div class="px-3 pb-2 pt-2.5">
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Avery Chen</p>
      <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">avery@northwind.io</p>
    </div>

    <hr role="separator" class="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

    <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
      Profile
    </button>
    <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
      Settings
    </button>
    <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
      Keyboard shortcuts
    </button>

    <hr role="separator" class="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

    <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
      Sign out
    </button>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const ITEM_CLASS =
  'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

export function DropdownProfile({ personName, email, avatarSrc, items, onSelect, onSignOut }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();

  // Sign out is the last stop on the ring, so End reaches it in one key.
  const ring = [...items, 'Sign out'];

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = ring.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
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
      focusItem(ring.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement);
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
        // The avatar has no text, so the button needs its own name.
        aria-label={\`Account menu for \${personName}\`}
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

      {open && (
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
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface DropdownProfileProps {
  personName: string;
  email: string;
  avatarSrc?: string;
  items: readonly string[];
  onSelect?: (item: string) => void;
  onSignOut?: () => void;
}

const ITEM_CLASS =
  'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

export function DropdownProfile({
  personName,
  email,
  avatarSrc,
  items,
  onSelect,
  onSignOut,
}: DropdownProfileProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const ringLength = items.length + 1;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
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
        aria-label={\`Account menu for \${personName}\`}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- avatars come
            from arbitrary hosts; swap for next/image once yours are known. */}
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
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface DropdownProfileProps {
  personName: string;
  email: string;
  /** Decorative - rendered with alt="". The name is beside it in text. */
  avatarSrc?: string;
  items: readonly string[];
  onSelect?: (item: string) => void;
  /** Separate from onSelect: signing out is not "an item was chosen". */
  onSignOut?: () => void;
}

const ITEM_CLASS =
  'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

export function DropdownProfile({
  personName,
  email,
  avatarSrc,
  items,
  onSelect,
  onSignOut,
}: DropdownProfileProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  /** items + Sign out. The header is NOT on the ring - it is not an action. */
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
        aria-label={\`Account menu for \${personName}\`}
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
          {/* Outside the ring: your name is not a command. */}
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

          {/*
            Separated but not red. Signing out is reversible - you log back in.
            Spend the alarm on "delete account", not on this.
          */}
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
}`,
    },
  },
  {
    slug: 'dropdown-mega',
    category: 'dropdowns',
    tags: ['dropdown', 'mega menu', 'navigation', 'columns', 'menuitem'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 640, copies: 150, downloads: 40 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'columns', type: 'MegaColumn[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  A mega menu is still a menu button: aria-haspopup="menu" and role="menu" hold,
  every link is a menuitem, and the arrow-key ring is the columns flattened in
  reading order. The panel is width-capped at calc(100vw-2rem) and its grid
  collapses to one column below sm, so it can never escape a 320px viewport.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="mega-menu" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Products
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>

  <div id="mega-menu" role="menu" aria-label="Products" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[min(44rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-3">
      <div role="group" aria-label="Platform" class="min-w-0">
        <p class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Platform</p>
        <button type="button" role="menuitem" class="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Automation</span>
          <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Rules and triggers</span>
        </button>
        <button type="button" role="menuitem" class="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Analytics</span>
          <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Dashboards and reports</span>
        </button>
      </div>
      <div role="group" aria-label="Solutions" class="min-w-0">
        <p class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Solutions</p>
        <button type="button" role="menuitem" class="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Sales</span>
          <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Pipeline and deals</span>
        </button>
        <button type="button" role="menuitem" class="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Support</span>
          <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Tickets and inbox</span>
        </button>
      </div>
      <div role="group" aria-label="Developers" class="min-w-0">
        <p class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Developers</p>
        <button type="button" role="menuitem" class="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">API</span>
          <span class="block truncate text-xs text-gray-500 dark:text-gray-400">REST and webhooks</span>
        </button>
        <button type="button" role="menuitem" class="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">SDKs</span>
          <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Typed clients</span>
        </button>
      </div>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

// A mega menu is a menu of navigation actions: the ring is the columns
// flattened, so Down walks column one then jumps to the top of column two.
export function DropdownMega({ label, columns, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();
  const flat = useMemo(() => columns.flatMap((column) => column.items), [columns]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = flat.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(flat.length - 1); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : flat.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let flatIndex = -1;

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[min(44rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading} role="group" aria-label={column.heading} className="min-w-0">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{column.heading}</p>
                {column.items.map((item) => {
                  flatIndex += 1;
                  const at = flatIndex;
                  return (
                    <button key={item.id} ref={(node) => { itemsRef.current[at] = node; }} type="button" role="menuitem" onClick={() => { onSelect?.(item.id); close(); }} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                      <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface MegaItem {
  id: string;
  label: string;
  description: string;
}

export interface MegaColumn {
  heading: string;
  items: readonly MegaItem[];
}

export interface DropdownMegaProps {
  label: string;
  columns: readonly MegaColumn[];
  onSelect?: (id: string) => void;
}

export function DropdownMega({ label, columns, onSelect }: DropdownMegaProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  // Flatten once: the ring is the source of truth for the keyboard, never the DOM.
  const flat = useMemo(() => columns.flatMap((column) => column.items), [columns]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = flat.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(flat.length - 1); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : flat.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let flatIndex = -1;

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open ? (
        <div id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[min(44rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading} role="group" aria-label={column.heading} className="min-w-0">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{column.heading}</p>
                {column.items.map((item) => {
                  flatIndex += 1;
                  const at = flatIndex;
                  return (
                    <button key={item.id} ref={(node) => { itemsRef.current[at] = node; }} type="button" role="menuitem" onClick={() => { onSelect?.(item.id); close(); }} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                      <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-multi-column',
    category: 'dropdowns',
    tags: ['dropdown', 'menu', 'columns', 'grid', 'menuitem'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 480, copies: 118, downloads: 30 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'columns', type: 'ColumnGroup[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  Two columns of plain menuitems. Columns are for the eye; the arrow-key ring is
  still the items flattened in reading order and wrapping. Below sm the grid
  collapses to one column and the panel is capped at calc(100vw-2rem), so it
  never overflows a phone.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="mc-menu" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    View
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>

  <div id="mc-menu" role="menu" aria-label="View" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-[min(28rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="grid grid-cols-1 gap-x-2 sm:grid-cols-2">
      <div role="group" aria-label="Sort by" class="min-w-0">
        <p class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Sort by</p>
        <button type="button" role="menuitem" class="block w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Newest</button>
        <button type="button" role="menuitem" class="block w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Oldest</button>
      </div>
      <div role="group" aria-label="Filter" class="min-w-0">
        <p class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Filter</p>
        <button type="button" role="menuitem" class="block w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Active</button>
        <button type="button" role="menuitem" class="block w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Archived</button>
      </div>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function DropdownMultiColumn({ label, columns, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();
  const flat = useMemo(() => columns.flatMap((column) => column.items), [columns]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = flat.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(flat.length - 1); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : flat.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let flatIndex = -1;

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-[min(28rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-x-2 sm:grid-cols-2">
            {columns.map((column) => (
              <div key={column.heading} role="group" aria-label={column.heading} className="min-w-0">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{column.heading}</p>
                {column.items.map((item) => {
                  flatIndex += 1;
                  const at = flatIndex;
                  return (
                    <button key={item} ref={(node) => { itemsRef.current[at] = node; }} type="button" role="menuitem" onClick={() => { onSelect?.(item); close(); }} className="block w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface ColumnGroup {
  heading: string;
  items: readonly string[];
}

export interface DropdownMultiColumnProps {
  label: string;
  columns: readonly ColumnGroup[];
  onSelect?: (item: string) => void;
}

export function DropdownMultiColumn({ label, columns, onSelect }: DropdownMultiColumnProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const flat = useMemo(() => columns.flatMap((column) => column.items), [columns]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = flat.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(flat.length - 1); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : flat.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  let flatIndex = -1;

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open ? (
        <div id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-[min(28rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-x-2 sm:grid-cols-2">
            {columns.map((column) => (
              <div key={column.heading} role="group" aria-label={column.heading} className="min-w-0">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{column.heading}</p>
                {column.items.map((item) => {
                  flatIndex += 1;
                  const at = flatIndex;
                  return (
                    <button key={item} ref={(node) => { itemsRef.current[at] = node; }} type="button" role="menuitem" onClick={() => { onSelect?.(item); close(); }} className="block w-full truncate rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-search-filter',
    category: 'dropdowns',
    tags: ['dropdown', 'search', 'filter', 'menu', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 720, copies: 190, downloads: 52 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'string[]', required: true, descriptionKey: 'items' },
      { name: 'searchPlaceholder', type: 'string', descriptionKey: 'placeholder' },
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  A search field narrows the menu as you type. ArrowDown drops focus from the
  field onto the first match; the item ring wraps; ArrowUp off the top row goes
  back to the field. The field owns aria-controls/aria-expanded; the list stays a
  role="menu" of actions. Panel capped at calc(100vw-2rem).
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="sf-menu" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Actions
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>

  <div class="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="p-1">
      <input type="text" placeholder="Search…" aria-label="Search…" aria-controls="sf-menu" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
    </div>
    <ul id="sf-menu" role="menu" aria-label="Actions" class="max-h-56 overflow-y-auto">
      <li role="none"><button type="button" role="menuitem" class="block w-full truncate rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Assign to me</button></li>
      <li role="none"><button type="button" role="menuitem" class="block w-full truncate rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Add label</button></li>
      <li role="none"><button type="button" role="menuitem" class="block w-full truncate rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Move to project</button></li>
    </ul>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function DropdownSearchFilter({ label, items, searchPlaceholder = 'Search…', onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();
  const filtered = useMemo(
    () => items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query],
  );

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = filtered.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  }

  function onItemKeyDown(event, index) {
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(filtered.length - 1); }
    if (event.key === 'ArrowUp' && index === 0) { event.preventDefault(); return inputRef.current?.focus(); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => inputRef.current?.focus()); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="p-1">
            <input ref={inputRef} type="text" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); focusItem(0); } }} placeholder={searchPlaceholder} aria-label={searchPlaceholder} aria-controls={menuId} className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
          </div>
          <ul id={menuId} role="menu" aria-label={label} className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400" role="none">No matches</li>
            ) : (
              filtered.map((item, index) => (
                <li role="none" key={item}>
                  <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitem" onKeyDown={(event) => onItemKeyDown(event, index)} onClick={() => { onSelect?.(item); close(); }} className="block w-full truncate rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface DropdownSearchFilterProps {
  label: string;
  items: readonly string[];
  searchPlaceholder?: string;
  onSelect?: (item: string) => void;
}

export function DropdownSearchFilter({
  label,
  items,
  searchPlaceholder = 'Search…',
  onSelect,
}: DropdownSearchFilterProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const filtered = useMemo(
    () => items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query],
  );

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = filtered.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  }

  function onItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(filtered.length - 1); return; }
    if (event.key === 'ArrowUp' && index === 0) { event.preventDefault(); inputRef.current?.focus(); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => inputRef.current?.focus()); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="p-1">
            <input ref={inputRef} type="text" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); focusItem(0); } }} placeholder={searchPlaceholder} aria-label={searchPlaceholder} aria-controls={menuId} className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500" />
          </div>
          <ul id={menuId} role="menu" aria-label={label} className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400" role="none">No matches</li>
            ) : (
              filtered.map((item, index) => (
                <li role="none" key={item}>
                  <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitem" onKeyDown={(event) => onItemKeyDown(event, index)} onClick={() => { onSelect?.(item); close(); }} className="block w-full truncate rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-checkbox-multi',
    category: 'dropdowns',
    tags: ['dropdown', 'checkbox', 'multi-select', 'menuitemcheckbox', 'filter'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 810, copies: 240, downloads: 66 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'options', type: 'Option[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onChange', type: '(next: string[]) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Each row is role="menuitemcheckbox" carrying its own aria-checked, and toggling
  one leaves the menu OPEN - the point of multi-select is to tick several without
  the panel closing under you. The check mark glyph is aria-hidden; aria-checked
  is the state a screen reader reads.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="cb-menu" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Teams
    <span class="rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white dark:bg-blue-500">1</span>
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>

  <ul id="cb-menu" role="menu" aria-label="Teams" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <li role="none">
      <button type="button" role="menuitemcheckbox" aria-checked="false" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <span aria-hidden="true" class="flex h-4 w-4 flex-none items-center justify-center rounded border border-gray-300 dark:border-gray-600"></span>
        Design
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitemcheckbox" aria-checked="true" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <span aria-hidden="true" class="flex h-4 w-4 flex-none items-center justify-center rounded border border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7" /></svg>
        </span>
        Engineering
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitemcheckbox" aria-checked="false" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <span aria-hidden="true" class="flex h-4 w-4 flex-none items-center justify-center rounded border border-gray-300 dark:border-gray-600"></span>
        Marketing
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function DropdownCheckboxMulti({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = options.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function toggle(id) {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange?.(next);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(options.length - 1); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : options.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  const count = value.length;

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        {count > 0 && <span className="rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white dark:bg-blue-500">{count}</span>}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <ul id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map((option, index) => {
            const checked = value.includes(option.id);
            return (
              <li role="none" key={option.id}>
                <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitemcheckbox" aria-checked={checked} onClick={() => toggle(option.id)} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
                  <span aria-hidden="true" className={checked ? 'flex h-4 w-4 flex-none items-center justify-center rounded border border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500' : 'flex h-4 w-4 flex-none items-center justify-center rounded border border-gray-300 dark:border-gray-600'}>
                    {checked && <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Option {
  id: string;
  label: string;
}

export interface DropdownCheckboxMultiProps {
  label: string;
  options: readonly Option[];
  value: readonly string[];
  onChange?: (next: string[]) => void;
}

export function DropdownCheckboxMulti({ label, options, value, onChange }: DropdownCheckboxMultiProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = options.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function toggle(id: string): void {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(options.length - 1); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : options.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  const count = value.length;

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        {count > 0 ? <span className="rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white dark:bg-blue-500">{count}</span> : null}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open ? (
        <ul id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map((option, index) => {
            const checked = value.includes(option.id);
            return (
              <li role="none" key={option.id}>
                <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitemcheckbox" aria-checked={checked} onClick={() => toggle(option.id)} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
                  <span aria-hidden="true" className={checked ? 'flex h-4 w-4 flex-none items-center justify-center rounded border border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500' : 'flex h-4 w-4 flex-none items-center justify-center rounded border border-gray-300 dark:border-gray-600'}>
                    {checked ? <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg> : null}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-radio-single',
    category: 'dropdowns',
    tags: ['dropdown', 'radio', 'single-select', 'menuitemradio', 'menu'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 690, copies: 205, downloads: 58 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'options', type: 'Option[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'onChange', type: '(id: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Exactly one row is aria-checked at a time via role="menuitemradio", and picking
  a new one closes the menu - single-select is a decision, not an accumulation.
  The trigger shows the current value so the answer is visible without opening.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="rd-menu" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <span class="text-gray-500 dark:text-gray-400">Priority:</span>
    Medium
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>

  <ul id="rd-menu" role="menu" aria-label="Priority" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <li role="none">
      <button type="button" role="menuitemradio" aria-checked="false" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <span aria-hidden="true" class="flex h-4 w-4 flex-none items-center justify-center"></span>
        Low
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitemradio" aria-checked="true" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <span aria-hidden="true" class="flex h-4 w-4 flex-none items-center justify-center">
          <svg class="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
        Medium
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitemradio" aria-checked="false" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        <span aria-hidden="true" class="flex h-4 w-4 flex-none items-center justify-center"></span>
        High
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function DropdownRadioSingle({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();
  const current = options.find((option) => option.id === value);
  const currentLabel = current?.label ?? 'Select';

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = options.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(options.length - 1); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : options.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span className="text-gray-500 dark:text-gray-400">{label}:</span>
        {currentLabel}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <ul id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map((option, index) => {
            const checked = option.id === value;
            return (
              <li role="none" key={option.id}>
                <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitemradio" aria-checked={checked} onClick={() => { onChange?.(option.id); close(); }} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
                  <span aria-hidden="true" className="flex h-4 w-4 flex-none items-center justify-center">
                    {checked && <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Option {
  id: string;
  label: string;
}

export interface DropdownRadioSingleProps {
  label: string;
  options: readonly Option[];
  value: string;
  onChange?: (id: string) => void;
}

export function DropdownRadioSingle({ label, options, value, onChange }: DropdownRadioSingleProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const current = options.find((option) => option.id === value);
  const currentLabel = current?.label ?? 'Select';

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = options.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(options.length - 1); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : options.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span className="text-gray-500 dark:text-gray-400">{label}:</span>
        {currentLabel}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open ? (
        <ul id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map((option, index) => {
            const checked = option.id === value;
            return (
              <li role="none" key={option.id}>
                <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitemradio" aria-checked={checked} onClick={() => { onChange?.(option.id); close(); }} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
                  <span aria-hidden="true" className="flex h-4 w-4 flex-none items-center justify-center">
                    {checked ? <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> : null}
                  </span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-account-switch',
    category: 'dropdowns',
    tags: ['dropdown', 'account switcher', 'workspace', 'menuitemradio', 'avatar'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 560, copies: 172, downloads: 44 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'accounts', type: 'Account[]', required: true, descriptionKey: 'items' },
      { name: 'activeId', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'onSwitch', type: '(id: string) => void', descriptionKey: 'onSwitch' },
      { name: 'onAdd', type: '() => void', descriptionKey: 'onAdd' },
    ],
    code: {
      tailwind: `<!--
  Each workspace is role="menuitemradio" because switching PICKS the active one -
  exactly one is aria-checked. "Add workspace" below the divider is a plain
  menuitem: an action, not one of the choices. Both live on one arrow-key ring,
  so it walks straight through the divider. Avatars are gradient initials.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="as-menu" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <span aria-hidden="true" class="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white">NW</span>
    <span class="max-w-[8rem] truncate">Northwind</span>
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>

  <div id="as-menu" role="menu" aria-label="Switch workspace" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <button type="button" role="menuitemradio" aria-checked="true" class="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span aria-hidden="true" class="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">NW</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Northwind</span>
        <span class="block truncate text-xs text-gray-500 dark:text-gray-400">team@northwind.io</span>
      </span>
      <svg class="h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
    </button>
    <button type="button" role="menuitemradio" aria-checked="false" class="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span aria-hidden="true" class="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">AC</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Acme Corp</span>
        <span class="block truncate text-xs text-gray-500 dark:text-gray-400">ops@acme.com</span>
      </span>
    </button>

    <hr role="separator" class="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
      <svg class="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      Add workspace
    </button>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function DropdownAccountSwitch({ accounts, activeId, onSwitch, onAdd }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();
  const active = accounts.find((account) => account.id === activeId);
  const activeName = active?.name ?? 'Select workspace';
  const activeInitials = active?.initials ?? '?';
  const ringLength = accounts.length + 1;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    if (ringLength === 0) return;
    itemsRef.current[((index % ringLength) + ringLength) % ringLength]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(ringLength - 1); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : ringLength - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span aria-hidden="true" className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white">{activeInitials}</span>
        <span className="max-w-[8rem] truncate">{activeName}</span>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div id={menuId} role="menu" aria-label="Switch workspace" className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {accounts.map((account, index) => {
            const checked = account.id === activeId;
            return (
              <button key={account.id} ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitemradio" aria-checked={checked} onClick={() => { onSwitch?.(account.id); close(); }} className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">{account.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">{account.name}</span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{account.email}</span>
                </span>
                {checked && <svg className="h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>}
              </button>
            );
          })}

          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          <button ref={(node) => { itemsRef.current[accounts.length] = node; }} type="button" role="menuitem" onClick={() => { onAdd?.(); close(); }} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
            <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            Add workspace
          </button>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Account {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface DropdownAccountSwitchProps {
  accounts: readonly Account[];
  activeId: string;
  onSwitch?: (id: string) => void;
  onAdd?: () => void;
}

export function DropdownAccountSwitch({ accounts, activeId, onSwitch, onAdd }: DropdownAccountSwitchProps): JSX.Element {
  const [open, setOpen] = useState(false);
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
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(ringLength - 1); return; }
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
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span aria-hidden="true" className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-[10px] font-bold text-white">{activeInitials}</span>
        <span className="max-w-[8rem] truncate">{activeName}</span>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open ? (
        <div id={menuId} role="menu" aria-label="Switch workspace" className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {accounts.map((account, index) => {
            const checked = account.id === activeId;
            return (
              <button key={account.id} ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitemradio" aria-checked={checked} onClick={() => { onSwitch?.(account.id); close(); }} className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">{account.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">{account.name}</span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{account.email}</span>
                </span>
                {checked ? <svg className="h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg> : null}
              </button>
            );
          })}

          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          <button ref={(node) => { itemsRef.current[accounts.length] = node; }} type="button" role="menuitem" onClick={() => { onAdd?.(); close(); }} className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
            <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            Add workspace
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-notification',
    category: 'dropdowns',
    tags: ['dropdown', 'notifications', 'bell', 'menu', 'badge'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 900, copies: 268, downloads: 72 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'Notification[]', required: true, descriptionKey: 'items' },
      { name: 'onOpen', type: '(id: string) => void', descriptionKey: 'onOpen' },
      { name: 'onMarkAll', type: '() => void', descriptionKey: 'onMarkAll' },
      { name: 'onViewAll', type: '() => void', descriptionKey: 'onViewAll' },
    ],
    code: {
      tailwind: `<!--
  The bell trigger carries the unread count in its aria-label - a red dot alone
  says nothing to a screen reader. The panel is a role="menu": "Mark all read",
  every notification row, and "View all" share one arrow-key ring in reading
  order, so the dividers never trap focus. Anchored right-0 and capped so it
  never leaves a 320px viewport.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="nt-menu" aria-label="Notifications, 2 unread" class="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
    <span aria-hidden="true" class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
  </button>

  <div id="nt-menu" role="menu" aria-label="Notifications" class="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="flex items-center justify-between px-2 py-1.5">
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
      <button type="button" role="menuitem" class="rounded px-1.5 py-1 text-xs font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">Mark all read</button>
    </div>
    <hr role="separator" class="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
    <ul class="max-h-64 overflow-y-auto" role="none">
      <li role="none">
        <button type="button" role="menuitem" class="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span aria-hidden="true" class="mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-500"></span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm text-gray-800 dark:text-gray-200">Priya commented on “Q3 roadmap”</span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">2m ago</span>
          </span>
        </button>
      </li>
      <li role="none">
        <button type="button" role="menuitem" class="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span aria-hidden="true" class="mt-1.5 h-2 w-2 flex-none rounded-full bg-transparent"></span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm text-gray-800 dark:text-gray-200">Weekly report is ready</span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Yesterday</span>
          </span>
        </button>
      </li>
    </ul>
    <hr role="separator" class="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
    <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">View all</button>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function DropdownNotification({ items, onOpen, onMarkAll, onViewAll }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();
  const unread = items.filter((item) => item.unread).length;
  const ringLength = items.length + 2;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    if (ringLength === 0) return;
    itemsRef.current[((index % ringLength) + ringLength) % ringLength]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(ringLength - 1); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : ringLength - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label={unread > 0 ? 'Notifications, ' + unread + ' unread' : 'Notifications'} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
        {unread > 0 && <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />}
      </button>

      {open && (
        <div id={menuId} role="menu" aria-label="Notifications" className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
            <button ref={(node) => { itemsRef.current[0] = node; }} type="button" role="menuitem" onClick={onMarkAll} className="rounded px-1.5 py-1 text-xs font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">Mark all read</button>
          </div>
          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
          <ul className="max-h-64 overflow-y-auto" role="none">
            {items.map((item, index) => (
              <li role="none" key={item.id}>
                <button ref={(node) => { itemsRef.current[index + 1] = node; }} type="button" role="menuitem" onClick={() => { onOpen?.(item.id); close(); }} className="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                  <span aria-hidden="true" className={item.unread ? 'mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-500' : 'mt-1.5 h-2 w-2 flex-none rounded-full bg-transparent'} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-gray-800 dark:text-gray-200">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
          <button ref={(node) => { itemsRef.current[items.length + 1] = node; }} type="button" role="menuitem" onClick={() => { onViewAll?.(); close(); }} className="block w-full rounded-md px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">View all</button>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Notification {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

export interface DropdownNotificationProps {
  items: readonly Notification[];
  onOpen?: (id: string) => void;
  onMarkAll?: () => void;
  onViewAll?: () => void;
}

export function DropdownNotification({ items, onOpen, onMarkAll, onViewAll }: DropdownNotificationProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const unread = items.filter((item) => item.unread).length;
  const ringLength = items.length + 2;

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
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(ringLength - 1); return; }
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
      <button ref={triggerRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label={unread > 0 ? 'Notifications, ' + unread + ' unread' : 'Notifications'} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
        {unread > 0 ? <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" /> : null}
      </button>

      {open ? (
        <div id={menuId} role="menu" aria-label="Notifications" className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
            <button ref={(node) => { itemsRef.current[0] = node; }} type="button" role="menuitem" onClick={onMarkAll} className="rounded px-1.5 py-1 text-xs font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">Mark all read</button>
          </div>
          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
          <ul className="max-h-64 overflow-y-auto" role="none">
            {items.map((item, index) => (
              <li role="none" key={item.id}>
                <button ref={(node) => { itemsRef.current[index + 1] = node; }} type="button" role="menuitem" onClick={() => { onOpen?.(item.id); close(); }} className="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                  <span aria-hidden="true" className={item.unread ? 'mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-500' : 'mt-1.5 h-2 w-2 flex-none rounded-full bg-transparent'} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-gray-800 dark:text-gray-200">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <hr role="separator" className="my-1 h-px border-0 bg-gray-200 dark:bg-gray-700" />
          <button ref={(node) => { itemsRef.current[items.length + 1] = node; }} type="button" role="menuitem" onClick={() => { onViewAll?.(); close(); }} className="block w-full rounded-md px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">View all</button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-color-swatches',
    category: 'dropdowns',
    tags: ['dropdown', 'color picker', 'swatches', 'listbox', 'grid'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 620, copies: 184, downloads: 50 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'colors', type: 'Swatch[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'onChange', type: '(value: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Picking a colour is choosing a VALUE, so this is a role="listbox" of
  role="option", not a menu - aria-selected marks the current one and Enter/Space
  commit it. Arrows move in two dimensions across the grid. The swatch background
  is the one place a raw colour value belongs: here the colour IS the data.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="listbox" aria-expanded="true" aria-controls="sw-list" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <span aria-hidden="true" class="h-4 w-4 flex-none rounded-full ring-1 ring-inset ring-black/10" style="background-color:#3b82f6"></span>
    Blue
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>

  <div id="sw-list" role="listbox" aria-label="Colour" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 grid max-w-[calc(100vw-2rem)] grid-cols-5 gap-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <button type="button" role="option" aria-selected="false" aria-label="Red" tabindex="-1" class="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-white/10 dark:focus-visible:ring-blue-400" style="background-color:#ef4444"></button>
    <button type="button" role="option" aria-selected="false" aria-label="Green" tabindex="-1" class="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-white/10 dark:focus-visible:ring-blue-400" style="background-color:#22c55e"></button>
    <button type="button" role="option" aria-selected="true" aria-label="Blue" tabindex="0" class="flex h-9 w-9 items-center justify-center rounded-lg ring-2 ring-blue-600 ring-offset-2 ring-offset-white focus-visible:outline-none dark:ring-blue-400 dark:ring-offset-gray-900" style="background-color:#3b82f6">
      <svg class="h-4 w-4 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
    </button>
    <button type="button" role="option" aria-selected="false" aria-label="Violet" tabindex="-1" class="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-white/10 dark:focus-visible:ring-blue-400" style="background-color:#8b5cf6"></button>
    <button type="button" role="option" aria-selected="false" aria-label="Pink" tabindex="-1" class="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-white/10 dark:focus-visible:ring-blue-400" style="background-color:#ec4899"></button>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const COLUMNS = 5;

export function DropdownColorSwatches({ label, colors, value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const listId = useId();
  const selectedIndex = Math.max(0, colors.findIndex((color) => color.value === value));
  const current = colors[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = colors.length;
    if (count === 0) return;
    itemsRef.current[Math.min(Math.max(index, 0), count - 1)]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onOptionKeyDown(event, index) {
    const count = colors.length;
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(count - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); return focusItem(Math.min(index + 1, count - 1)); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); return focusItem(Math.max(index - 1, 0)); }
    if (event.key === 'ArrowDown') { event.preventDefault(); return focusItem(index + COLUMNS < count ? index + COLUMNS : index); }
    if (event.key === 'ArrowUp') { event.preventDefault(); return focusItem(index - COLUMNS >= 0 ? index - COLUMNS : index); }
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button ref={triggerRef} type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(selectedIndex)); }} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span aria-hidden="true" className="h-4 w-4 flex-none rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: current?.value ?? 'transparent' }} />
        {current?.name ?? label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div id={listId} role="listbox" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 grid max-w-[calc(100vw-2rem)] grid-cols-5 gap-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {colors.map((color, index) => {
            const selected = index === selectedIndex;
            return (
              <button key={color.value} ref={(node) => { itemsRef.current[index] = node; }} type="button" role="option" aria-selected={selected} aria-label={color.name} tabIndex={selected ? 0 : -1} onKeyDown={(event) => onOptionKeyDown(event, index)} onClick={() => { onChange?.(color.value); close(); }} className={selected ? 'flex h-9 w-9 items-center justify-center rounded-lg ring-2 ring-blue-600 ring-offset-2 ring-offset-white focus-visible:outline-none dark:ring-blue-400 dark:ring-offset-gray-900' : 'flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-white/10 dark:focus-visible:ring-blue-400'} style={{ backgroundColor: color.value }}>
                {selected && <svg className="h-4 w-4 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Swatch {
  name: string;
  value: string;
}

export interface DropdownColorSwatchesProps {
  label: string;
  colors: readonly Swatch[];
  value: string;
  onChange?: (value: string) => void;
}

const COLUMNS = 5;

export function DropdownColorSwatches({ label, colors, value, onChange }: DropdownColorSwatchesProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();
  const selectedIndex = Math.max(0, colors.findIndex((color) => color.value === value));
  const current = colors[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = colors.length;
    if (count === 0) return;
    itemsRef.current[Math.min(Math.max(index, 0), count - 1)]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const count = colors.length;
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(count - 1); return; }
    if (event.key === 'ArrowRight') { event.preventDefault(); focusItem(Math.min(index + 1, count - 1)); return; }
    if (event.key === 'ArrowLeft') { event.preventDefault(); focusItem(Math.max(index - 1, 0)); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); focusItem(index + COLUMNS < count ? index + COLUMNS : index); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); focusItem(index - COLUMNS >= 0 ? index - COLUMNS : index); }
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button ref={triggerRef} type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(selectedIndex)); }} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span aria-hidden="true" className="h-4 w-4 flex-none rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: current?.value ?? 'transparent' }} />
        {current?.name ?? label}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open ? (
        <div id={listId} role="listbox" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 grid max-w-[calc(100vw-2rem)] grid-cols-5 gap-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {colors.map((color, index) => {
            const selected = index === selectedIndex;
            return (
              <button key={color.value} ref={(node) => { itemsRef.current[index] = node; }} type="button" role="option" aria-selected={selected} aria-label={color.name} tabIndex={selected ? 0 : -1} onKeyDown={(event) => onOptionKeyDown(event, index)} onClick={() => { onChange?.(color.value); close(); }} className={selected ? 'flex h-9 w-9 items-center justify-center rounded-lg ring-2 ring-blue-600 ring-offset-2 ring-offset-white focus-visible:outline-none dark:ring-blue-400 dark:ring-offset-gray-900' : 'flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-white/10 dark:focus-visible:ring-blue-400'} style={{ backgroundColor: color.value }}>
                {selected ? <svg className="h-4 w-4 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-command',
    category: 'dropdowns',
    tags: ['dropdown', 'command palette', 'combobox', 'search', 'listbox'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1040, copies: 322, downloads: 96 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'commands', type: 'Command[]', required: true, descriptionKey: 'items' },
      { name: 'placeholder', type: 'string', descriptionKey: 'placeholder' },
      { name: 'onRun', type: '(id: string) => void', descriptionKey: 'onRun' },
    ],
    code: {
      tailwind: `<!--
  A command palette keeps focus in the input and moves a virtual highlight through
  the list with aria-activedescendant - the combobox pattern, not roving focus,
  because you must keep typing while you steer. The input is role="combobox"
  pointing at a role="listbox"; Enter runs the highlighted option. Capped at
  calc(100vw-2rem) so it never leaves a phone.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Command
    <kbd class="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">⌘K</kbd>
  </button>

  <div class="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="border-b border-gray-200 p-2 dark:border-gray-700">
      <input type="text" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant="cmd-opt-new-doc" aria-autocomplete="list" placeholder="Type a command…" aria-label="Command" class="w-full rounded-md bg-transparent px-1.5 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
    </div>
    <ul id="cmd-list" role="listbox" aria-label="Command" class="max-h-56 overflow-y-auto p-1">
      <li id="cmd-opt-new-doc" role="option" aria-selected="true" class="flex cursor-pointer items-center justify-between gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <span class="truncate">New document</span>
        <kbd class="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">C</kbd>
      </li>
      <li id="cmd-opt-search" role="option" aria-selected="false" class="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="truncate">Search everything</span>
        <kbd class="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">/</kbd>
      </li>
      <li id="cmd-opt-invite" role="option" aria-selected="false" class="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="truncate">Invite teammate</span>
      </li>
    </ul>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function DropdownCommand({ label, commands, placeholder = 'Type a command…', onRun }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const baseId = useId();
  const listId = baseId + '-list';
  const filtered = useMemo(
    () => commands.filter((command) => command.label.toLowerCase().includes(query.trim().toLowerCase())),
    [commands, query],
  );

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  }

  function run(command) {
    if (!command) return;
    onRun?.(command.id);
    close();
  }

  function onInputKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'ArrowDown') { event.preventDefault(); return setActive((prev) => (filtered.length === 0 ? 0 : (prev + 1) % filtered.length)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); return setActive((prev) => (filtered.length === 0 ? 0 : (prev - 1 + filtered.length) % filtered.length)); }
    if (event.key === 'Enter') { event.preventDefault(); run(filtered[active]); }
  }

  const activeId = filtered[active] ? baseId + '-opt-' + filtered[active].id : undefined;

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => inputRef.current?.focus()); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <kbd className="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">⌘K</kbd>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-2 dark:border-gray-700">
            <input ref={inputRef} type="text" role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId} aria-autocomplete="list" value={query} placeholder={placeholder} aria-label={label} onChange={(event) => setQuery(event.target.value)} onKeyDown={onInputKeyDown} className="w-full rounded-md bg-transparent px-1.5 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li role="none" className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No commands</li>
            ) : (
              filtered.map((command, index) => {
                const isActive = index === active;
                return (
                  <li key={command.id} id={baseId + '-opt-' + command.id} role="option" aria-selected={isActive} onMouseEnter={() => setActive(index)} onMouseDown={(event) => { event.preventDefault(); run(command); }} className={isActive ? 'flex cursor-pointer items-center justify-between gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300'}>
                    <span className="truncate">{command.label}</span>
                    {command.hint && <kbd className="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">{command.hint}</kbd>}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Command {
  id: string;
  label: string;
  hint?: string;
}

export interface DropdownCommandProps {
  label: string;
  commands: readonly Command[];
  placeholder?: string;
  onRun?: (id: string) => void;
}

export function DropdownCommand({ label, commands, placeholder = 'Type a command…', onRun }: DropdownCommandProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listId = baseId + '-list';
  const filtered = useMemo(
    () => commands.filter((command) => command.label.toLowerCase().includes(query.trim().toLowerCase())),
    [commands, query],
  );

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  }

  function run(command: Command | undefined): void {
    if (!command) return;
    onRun?.(command.id);
    close();
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((prev) => (filtered.length === 0 ? 0 : (prev + 1) % filtered.length)); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((prev) => (filtered.length === 0 ? 0 : (prev - 1 + filtered.length) % filtered.length)); return; }
    if (event.key === 'Enter') { event.preventDefault(); run(filtered[active]); }
  }

  const activeId = filtered[active] ? baseId + '-opt-' + filtered[active]?.id : undefined;

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => inputRef.current?.focus()); }} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {label}
        <kbd className="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">⌘K</kbd>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-2 dark:border-gray-700">
            <input ref={inputRef} type="text" role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId} aria-autocomplete="list" value={query} placeholder={placeholder} aria-label={label} onChange={(event) => setQuery(event.target.value)} onKeyDown={onInputKeyDown} className="w-full rounded-md bg-transparent px-1.5 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none dark:text-gray-100 dark:placeholder:text-gray-500" />
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li role="none" className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No commands</li>
            ) : (
              filtered.map((command, index) => {
                const isActive = index === active;
                return (
                  <li key={command.id} id={baseId + '-opt-' + command.id} role="option" aria-selected={isActive} onMouseEnter={() => setActive(index)} onMouseDown={(event) => { event.preventDefault(); run(command); }} className={isActive ? 'flex cursor-pointer items-center justify-between gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100' : 'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300'}>
                    <span className="truncate">{command.label}</span>
                    {command.hint ? <kbd className="rounded border border-gray-300 px-1 text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">{command.hint}</kbd> : null}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dropdown-split-button',
    category: 'dropdowns',
    tags: ['dropdown', 'split button', 'menu', 'actions', 'menuitem'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 780, copies: 236, downloads: 64 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SplitItem[]', required: true, descriptionKey: 'items' },
      { name: 'onPrimary', type: '() => void', descriptionKey: 'onPrimary' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  The primary half runs the default action on click; only the narrow chevron half
  owns the menu, so IT - not the whole control - carries aria-haspopup,
  aria-expanded and its own aria-label ("More actions"). The secondary list is an
  ordinary role="menu" with the standard arrow-key ring, anchored right-0 and
  width-capped so it never escapes a 320px viewport.
-->
<div class="relative inline-block">
  <div class="inline-flex divide-x divide-blue-500 overflow-hidden rounded-lg shadow-sm">
    <button type="button" class="bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500">Publish</button>
    <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="sp-menu" aria-label="More actions" class="flex items-center bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500">
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
    </button>
  </div>

  <ul id="sp-menu" role="menu" aria-label="Publish" class="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <li role="none"><button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Save as draft</button></li>
    <li role="none"><button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Schedule…</button></li>
    <li role="none"><button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Save as template</button></li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function DropdownSplitButton({ label, items, onPrimary, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const itemsRef = useRef([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = items.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') return close();
    if (event.key === 'Home') { event.preventDefault(); return focusItem(0); }
    if (event.key === 'End') { event.preventDefault(); return focusItem(items.length - 1); }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <div className="inline-flex divide-x divide-blue-500 overflow-hidden rounded-lg shadow-sm">
        <button type="button" onClick={onPrimary} className="bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500">{label}</button>
        <button ref={toggleRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label="More actions" onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="flex items-center bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>

      {open && (
        <ul id={menuId} role="menu" aria-label={label} className="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item, index) => (
            <li role="none" key={item.id}>
              <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitem" onClick={() => { onSelect?.(item.id); close(); }} className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SplitItem {
  id: string;
  label: string;
}

export interface DropdownSplitButtonProps {
  label: string;
  items: readonly SplitItem[];
  onPrimary?: () => void;
  onSelect?: (id: string) => void;
}

export function DropdownSplitButton({ label, items, onPrimary, onSelect }: DropdownSplitButtonProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = items.length;
    if (count === 0) return;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    toggleRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Home') { event.preventDefault(); focusItem(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusItem(items.length - 1); return; }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <div className="inline-flex divide-x divide-blue-500 overflow-hidden rounded-lg shadow-sm">
        <button type="button" onClick={onPrimary} className="bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500">{label}</button>
        <button ref={toggleRef} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label="More actions" onClick={() => { const next = !open; setOpen(next); if (next) window.requestAnimationFrame(() => focusItem(0)); }} className="flex items-center bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:bg-blue-600 dark:hover:bg-blue-500">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>

      {open ? (
        <ul id={menuId} role="menu" aria-label={label} className="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item, index) => (
            <li role="none" key={item.id}>
              <button ref={(node) => { itemsRef.current[index] = node; }} type="button" role="menuitem" onClick={() => { onSelect?.(item.id); close(); }} className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item.label}</button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
];
