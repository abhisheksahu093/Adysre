import type { ComponentEntry } from './types';

/**
 * Menus category.
 *
 * Ten menus that differ in SURFACE - a right-click layer, a kebab, a menubar, a
 * bottom sheet, an app-launcher grid - but share one contract: `role="menu"` is
 * a promise about the keyboard. The moment the role is on the element a screen
 * reader tells its user that arrows move, Escape leaves, and typing jumps; ship
 * the role without the behaviour and the markup is lying. So every entry here
 * wires the pattern the role implies, and what varies is what the menu is FOR.
 *
 * The recurring judgement call is menu vs listbox. A `menuitem` is a command: it
 * acts and the menu closes. The filter and pinnable entries stretch that with
 * `menuitemcheckbox`, which is legal ARIA for a toggle that lives in a menu and
 * must NOT close on activation. A control whose only job is picking values would
 * be a listbox instead; these stay menus because pinning and filtering are
 * actions with side effects, not a value selection.
 *
 * The dropdowns category covers the plain menu-button; nothing here duplicates
 * it - every slug is `menu-` prefixed and every one is a shape a product grows
 * into after that first dropdown.
 */
export const menusComponents: ComponentEntry[] = [
  {
    slug: 'menu-context-right-click',
    category: 'menus',
    tags: ['menu', 'context-menu', 'right-click', 'contextual', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'ContextItem[]', required: true, descriptionKey: 'items' },
      { name: 'hint', type: 'string', default: "'Right-click inside this area'", descriptionKey: 'hint' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  Right-click context menu. The wrapper calls preventDefault on 'contextmenu'
  only INSIDE itself, so the native browser menu keeps working everywhere else.
  The menu is positioned relative to the area (left/top from the pointer), never
  fixed to the viewport, so it cannot escape its container. Shown open below.
-->
<div class="relative flex min-h-44 w-full select-none items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
  Right-click inside this area

  <div role="menu" aria-label="Actions" class="absolute left-6 top-6 z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Cut</button>
    <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Copy</button>
    <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Paste</button>
    <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40">Delete</button>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function MenuContext({ items, hint = 'Right-click inside this area', onSelect }) {
  const [pos, setPos] = useState(null);
  const areaRef = useRef(null);
  const menuRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!pos) return undefined;
    function onDown(event) {
      if (!menuRef.current?.contains(event.target)) setPos(null);
    }
    function onKey(event) {
      if (event.key === 'Escape') setPos(null);
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [pos]);

  useEffect(() => {
    if (pos) itemsRef.current[0]?.focus();
  }, [pos]);

  function openAt(event) {
    // Scope: preventDefault only here - the native menu still works elsewhere.
    event.preventDefault();
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  function onMenuKey(event) {
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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
      ref={areaRef}
      onContextMenu={openAt}
      className="relative flex min-h-44 w-full select-none items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
    >
      {hint}
      {pos ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Actions"
          onKeyDown={onMenuKey}
          style={{ left: pos.x, top: pos.y }}
          className="absolute z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect?.(item.id);
                setPos(null);
              }}
              className={\`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none \${
                item.danger
                  ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                  : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
              }\`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';

export interface ContextItem {
  id: string;
  label: string;
  danger?: boolean;
}

export interface MenuContextProps {
  items: readonly ContextItem[];
  hint?: string;
  onSelect?: (id: string) => void;
}

export function MenuContext({
  items,
  hint = 'Right-click inside this area',
  onSelect,
}: MenuContextProps): JSX.Element {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!pos) return undefined;
    function onDown(event: MouseEvent): void {
      if (!menuRef.current?.contains(event.target as Node)) setPos(null);
    }
    function onKey(event: globalThis.KeyboardEvent): void {
      if (event.key === 'Escape') setPos(null);
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [pos]);

  useEffect(() => {
    if (pos) itemsRef.current[0]?.focus();
  }, [pos]);

  function openAt(event: ReactMouseEvent<HTMLDivElement>): void {
    // Scope: preventDefault only here - the native menu still works elsewhere.
    event.preventDefault();
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>): void {
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
      ref={areaRef}
      onContextMenu={openAt}
      className="relative flex min-h-44 w-full select-none items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
    >
      {hint}
      {pos ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Actions"
          onKeyDown={onMenuKey}
          style={{ left: pos.x, top: pos.y }}
          className="absolute z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect?.(item.id);
                setPos(null);
              }}
              className={\`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none \${
                item.danger
                  ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                  : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
              }\`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'menu-kebab-row-actions',
    category: 'menus',
    tags: ['menu', 'kebab', 'actions', 'overflow', 'row'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'actions', type: 'RowAction[]', required: true, descriptionKey: 'actions' },
      { name: 'onAction', type: '(id: string) => void', descriptionKey: 'onAction' },
    ],
    code: {
      tailwind: `<!-- A list row with an overflow "kebab" that opens an actions menu. Shown open. -->
<div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
  <div class="min-w-0 flex-1">
    <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Q3 revenue model</p>
    <p class="truncate text-xs text-gray-500 dark:text-gray-400">Edited 2 hours ago</p>
  </div>
  <div class="relative flex-none">
    <button type="button" aria-haspopup="menu" aria-expanded="true" aria-label="Actions for Q3 revenue model" class="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>
    </button>
    <div role="menu" aria-label="Actions for Q3 revenue model" class="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Rename</button>
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Duplicate</button>
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40">Delete</button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function MenuKebabRow({ title, subtitle, actions, onAction }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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
    <div ref={rootRef} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
        {subtitle ? <p className="truncate text-xs text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
      </div>
      <div className="relative flex-none">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={\`Actions for \${title}\`}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
          </svg>
        </button>
        {open ? (
          <div role="menu" aria-label={\`Actions for \${title}\`} onKeyDown={onMenuKey} className="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
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
                className={\`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none \${
                  action.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }\`}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface RowAction {
  id: string;
  label: string;
  danger?: boolean;
}

export interface MenuKebabRowProps {
  title: string;
  subtitle?: string;
  actions: readonly RowAction[];
  onAction?: (id: string) => void;
}

export function MenuKebabRow({ title, subtitle, actions, onAction }: MenuKebabRowProps): JSX.Element {
  const [open, setOpen] = useState(false);
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
    <div ref={rootRef} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
        {subtitle ? <p className="truncate text-xs text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
      </div>
      <div className="relative flex-none">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={\`Actions for \${title}\`}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
          </svg>
        </button>
        {open ? (
          <div role="menu" aria-label={\`Actions for \${title}\`} onKeyDown={onMenuKey} className="absolute right-0 top-[calc(100%+0.375rem)] z-20 min-w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
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
                className={\`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none \${
                  action.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }\`}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'menu-nested-submenu',
    category: 'menus',
    tags: ['menu', 'submenu', 'nested', 'flyout', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'NestedItem[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  Menu with a nested flyout. ArrowRight opens a submenu, ArrowLeft/Escape steps
  back one level. Shown with the "Send to" submenu open.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Share</button>
  <ul role="menu" aria-label="Share" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <li role="none"><button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Copy link</button></li>
    <li role="none" class="relative">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="true" class="flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Send to <span aria-hidden="true">›</span></button>
      <ul role="menu" aria-label="Send to" class="absolute -top-1 left-[calc(100%-0.25rem)] z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <li role="none"><button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Email</button></li>
        <li role="none"><button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Slack</button></li>
      </ul>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

const ITEM_CLASS =
  'flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

export function MenuNested({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const topRef = useRef([]);
  const subRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setOpenSub(null);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
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

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
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
        <ul role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item, index) => (
            <li role="none" key={item.id} className={item.items ? 'relative' : undefined}>
              <button
                ref={(node) => {
                  topRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                {...(item.items ? { 'aria-haspopup': 'menu', 'aria-expanded': openSub === index } : {})}
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
                {item.items ? (
                  <svg className="h-3.5 w-3.5 flex-none text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                ) : null}
              </button>
              {item.items && openSub === index ? (
                <ul role="menu" aria-label={item.label} onKeyDown={(event) => onSubKeyDown(event, index, item.items?.length ?? 0)} className="absolute -top-1 left-[calc(100%-0.25rem)] z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
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
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SubItem {
  id: string;
  label: string;
}

export interface NestedItem {
  id: string;
  label: string;
  items?: readonly SubItem[];
}

export interface MenuNestedProps {
  label: string;
  items: readonly NestedItem[];
  onSelect?: (id: string) => void;
}

const ITEM_CLASS =
  'flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800';

export function MenuNested({ label, items, onSelect }: MenuNestedProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<Array<HTMLButtonElement | null>>([]);
  const subRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setOpenSub(null);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
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

  function onSubKeyDown(event: KeyboardEvent<HTMLUListElement>, parentIndex: number, subCount: number): void {
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
        <ul role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item, index) => (
            <li role="none" key={item.id} className={item.items ? 'relative' : undefined}>
              <button
                ref={(node) => {
                  topRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                {...(item.items ? { 'aria-haspopup': 'menu' as const, 'aria-expanded': openSub === index } : {})}
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
                {item.items ? (
                  <svg className="h-3.5 w-3.5 flex-none text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                ) : null}
              </button>
              {item.items && openSub === index ? (
                <ul role="menu" aria-label={item.label} onKeyDown={(event) => onSubKeyDown(event, index, item.items?.length ?? 0)} className="absolute -top-1 left-[calc(100%-0.25rem)] z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
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
    slug: 'menu-menubar-desktop',
    category: 'menus',
    tags: ['menu', 'menubar', 'desktop', 'application', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'sections', type: 'MenubarSection[]', required: true, descriptionKey: 'sections' },
      { name: 'onCommand', type: '(id: string) => void', descriptionKey: 'onCommand' },
    ],
    code: {
      tailwind: `<!--
  A desktop application menu bar. role="menubar" is horizontal: Left/Right move
  between File/Edit/View, ArrowDown opens the focused one, and Left/Right walk
  between menus while one is open. Shown with File open.
-->
<div role="menubar" aria-label="Application" aria-orientation="horizontal" class="flex w-full flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
  <div class="relative">
    <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="true" class="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">File</button>
    <div role="menu" aria-label="File" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">New file</button>
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Open…</button>
    </div>
  </div>
  <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Edit</button>
  <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">View</button>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function MenuMenubar({ sections, onCommand }) {
  const [openIndex, setOpenIndex] = useState(null);
  const rootRef = useRef(null);
  const triggersRef = useRef([]);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (openIndex === null) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpenIndex(null);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openIndex]);

  function openAndFocus(index) {
    setOpenIndex(index);
    window.requestAnimationFrame(() => itemsRef.current[0]?.focus());
  }

  function onTriggerKey(event, index) {
    const count = sections.length;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      const next = (((index + dir) % count) + count) % count;
      if (openIndex !== null) openAndFocus(next);
      else triggersRef.current[next]?.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAndFocus(index);
    } else if (event.key === 'Escape') {
      setOpenIndex(null);
    }
  }

  function onMenuKey(event, index) {
    const count = sections.length;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpenIndex(null);
      triggersRef.current[index]?.focus();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      openAndFocus((((index + dir) % count) + count) % count);
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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
    <div ref={rootRef} role="menubar" aria-label="Application" aria-orientation="horizontal" className="flex w-full flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
      {sections.map((section, index) => (
        <div key={section.id} className="relative">
          <button
            ref={(node) => {
              triggersRef.current[index] = node;
            }}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openIndex === index}
            onClick={() => (openIndex === index ? setOpenIndex(null) : openAndFocus(index))}
            onKeyDown={(event) => onTriggerKey(event, index)}
            className={\`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
              openIndex === index
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }\`}
          >
            {section.label}
          </button>
          {openIndex === index ? (
            <div role="menu" aria-label={section.label} onKeyDown={(event) => onMenuKey(event, index)} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {section.items.map((item, itemIndex) => (
                <button
                  key={item.id}
                  ref={(node) => {
                    itemsRef.current[itemIndex] = node;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onCommand?.(item.id);
                    setOpenIndex(null);
                    triggersRef.current[index]?.focus();
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface MenuCommand {
  id: string;
  label: string;
}

export interface MenubarSection {
  id: string;
  label: string;
  items: readonly MenuCommand[];
}

export interface MenuMenubarProps {
  sections: readonly MenubarSection[];
  onCommand?: (id: string) => void;
}

export function MenuMenubar({ sections, onCommand }: MenuMenubarProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (openIndex === null) return undefined;
    function onDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpenIndex(null);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openIndex]);

  function openAndFocus(index: number): void {
    setOpenIndex(index);
    window.requestAnimationFrame(() => itemsRef.current[0]?.focus());
  }

  function onTriggerKey(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const count = sections.length;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      const next = (((index + dir) % count) + count) % count;
      if (openIndex !== null) openAndFocus(next);
      else triggersRef.current[next]?.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAndFocus(index);
    } else if (event.key === 'Escape') {
      setOpenIndex(null);
    }
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>, index: number): void {
    const count = sections.length;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpenIndex(null);
      triggersRef.current[index]?.focus();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      openAndFocus((((index + dir) % count) + count) % count);
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
    <div ref={rootRef} role="menubar" aria-label="Application" aria-orientation="horizontal" className="flex w-full flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
      {sections.map((section, index) => (
        <div key={section.id} className="relative">
          <button
            ref={(node) => {
              triggersRef.current[index] = node;
            }}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openIndex === index}
            onClick={() => (openIndex === index ? setOpenIndex(null) : openAndFocus(index))}
            onKeyDown={(event) => onTriggerKey(event, index)}
            className={\`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
              openIndex === index
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }\`}
          >
            {section.label}
          </button>
          {openIndex === index ? (
            <div role="menu" aria-label={section.label} onKeyDown={(event) => onMenuKey(event, index)} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {section.items.map((item, itemIndex) => (
                <button
                  key={item.id}
                  ref={(node) => {
                    itemsRef.current[itemIndex] = node;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onCommand?.(item.id);
                    setOpenIndex(null);
                    triggersRef.current[index]?.focus();
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'menu-mobile-bottom-sheet',
    category: 'menus',
    tags: ['menu', 'bottom-sheet', 'mobile', 'action-sheet', 'modal'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'trigger', type: 'string', required: true, descriptionKey: 'trigger' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'actions', type: 'SheetAction[]', required: true, descriptionKey: 'actions' },
      { name: 'onAction', type: '(id: string) => void', descriptionKey: 'onAction' },
    ],
    code: {
      tailwind: `<!--
  A mobile action sheet. The scrim and sheet here are positioned within the
  component's own bounded panel; in a real full-screen app, render the scrim and
  sheet at the document root with 'fixed inset-0' / 'fixed inset-x-0 bottom-0'.
  Shown open. Tap targets are >= 44px.
-->
<div class="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <div class="flex min-h-64 items-center justify-center p-4">
    <button type="button" aria-haspopup="menu" aria-expanded="true" class="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Open actions</button>
  </div>
  <button type="button" aria-label="Close menu" class="absolute inset-0 z-10 cursor-default bg-black/40"></button>
  <div role="menu" aria-label="Post options" class="absolute inset-x-0 bottom-0 z-20 rounded-t-2xl border-t border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
    <div class="mx-auto mb-2 mt-1 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true"></div>
    <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Post options</p>
    <button type="button" role="menuitem" class="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Share</button>
    <button type="button" role="menuitem" class="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Copy link</button>
    <button type="button" role="menuitem" class="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40">Remove</button>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function MenuBottomSheet({ trigger, title, actions, onAction }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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
          <button type="button" aria-label="Close menu" onClick={close} className="absolute inset-0 z-10 cursor-default bg-black/40" />
          <div role="menu" aria-label={title} onKeyDown={onMenuKey} className="absolute inset-x-0 bottom-0 z-20 rounded-t-2xl border-t border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-2 mt-1 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
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
                className={\`flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm focus-visible:outline-none \${
                  action.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }\`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SheetAction {
  id: string;
  label: string;
  danger?: boolean;
}

export interface MenuBottomSheetProps {
  trigger: string;
  title: string;
  actions: readonly SheetAction[];
  onAction?: (id: string) => void;
}

export function MenuBottomSheet({ trigger, title, actions, onAction }: MenuBottomSheetProps): JSX.Element {
  const [open, setOpen] = useState(false);
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
          <button type="button" aria-label="Close menu" onClick={close} className="absolute inset-0 z-10 cursor-default bg-black/40" />
          <div role="menu" aria-label={title} onKeyDown={onMenuKey} className="absolute inset-x-0 bottom-0 z-20 rounded-t-2xl border-t border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-2 mt-1 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
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
                className={\`flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm focus-visible:outline-none \${
                  action.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }\`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'menu-icon-grid-launcher',
    category: 'menus',
    tags: ['menu', 'launcher', 'grid', 'apps', 'keyboard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'tiles', type: 'LaunchTile[]', required: true, descriptionKey: 'tiles' },
      { name: 'columns', type: 'number', default: '3', descriptionKey: 'columns' },
      { name: 'onLaunch', type: '(id: string) => void', descriptionKey: 'onLaunch' },
    ],
    code: {
      tailwind: `<!--
  An app-launcher grid menu. role="menu" with role="menuitem" tiles; because the
  layout is a grid, Left/Right move by one and Up/Down move by a full row. Shown
  open with a 3-column grid.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-label="Apps" class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>
  </button>
  <div role="menu" aria-label="Apps" class="absolute right-0 top-[calc(100%+0.5rem)] z-20 grid w-64 grid-cols-3 gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
    <button type="button" role="menuitem" class="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white" aria-hidden="true">M</span>
      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Mail</span>
    </button>
    <button type="button" role="menuitem" class="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-sm font-bold text-white" aria-hidden="true">C</span>
      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Calendar</span>
    </button>
    <button type="button" role="menuitem" class="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white" aria-hidden="true">D</span>
      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Drive</span>
    </button>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function MenuIconGrid({ label, tiles, columns = 3, onLaunch }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
    let next = idx;
    if (event.key === 'ArrowRight') next = idx + 1;
    else if (event.key === 'ArrowLeft') next = idx - 1;
    else if (event.key === 'ArrowDown') next = idx + columns;
    else if (event.key === 'ArrowUp') next = idx - columns;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = nodes.length - 1;
    else return;
    event.preventDefault();
    const n = nodes.length;
    nodes[((next % n) + n) % n]?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="5" cy="5" r="2" /><circle cx="12" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
          <circle cx="5" cy="19" r="2" /><circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          style={{ gridTemplateColumns: \`repeat(\${columns}, minmax(0, 1fr))\` }}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 grid w-64 gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900"
        >
          {tiles.map((tile, index) => (
            <button
              key={tile.id}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onLaunch?.(tile.id);
                close();
              }}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
            >
              <span className={\`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br \${tile.gradient} text-sm font-bold text-white\`} aria-hidden="true">
                {tile.label.charAt(0)}
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{tile.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface LaunchTile {
  id: string;
  label: string;
  /** Tailwind gradient stops, e.g. 'from-sky-500 to-blue-600'. */
  gradient: string;
}

export interface MenuIconGridProps {
  label: string;
  tiles: readonly LaunchTile[];
  columns?: number;
  onLaunch?: (id: string) => void;
}

export function MenuIconGrid({ label, tiles, columns = 3, onLaunch }: MenuIconGridProps): JSX.Element {
  const [open, setOpen] = useState(false);
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
    let next = idx;
    if (event.key === 'ArrowRight') next = idx + 1;
    else if (event.key === 'ArrowLeft') next = idx - 1;
    else if (event.key === 'ArrowDown') next = idx + columns;
    else if (event.key === 'ArrowUp') next = idx - columns;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = nodes.length - 1;
    else return;
    event.preventDefault();
    const n = nodes.length;
    nodes[((next % n) + n) % n]?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="5" cy="5" r="2" /><circle cx="12" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
          <circle cx="5" cy="19" r="2" /><circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          style={{ gridTemplateColumns: \`repeat(\${columns}, minmax(0, 1fr))\` }}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 grid w-64 gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900"
        >
          {tiles.map((tile, index) => (
            <button
              key={tile.id}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                onLaunch?.(tile.id);
                close();
              }}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
            >
              <span className={\`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br \${tile.gradient} text-sm font-bold text-white\`} aria-hidden="true">
                {tile.label.charAt(0)}
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{tile.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'menu-account-menu',
    category: 'menus',
    tags: ['menu', 'account', 'user', 'avatar', 'profile'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'email', type: 'string', required: true, descriptionKey: 'email' },
      { name: 'items', type: 'AccountItem[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  An account menu. The identity header is presentational (not a menuitem), so
  arrow keys skip it and land on the first command. Shown open.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-label="Account: Ada Lovelace" class="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">AL</span>
    <span class="hidden sm:inline">Ada Lovelace</span>
  </button>
  <div role="menu" aria-label="Account" class="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
      <p class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Ada Lovelace</p>
      <p class="truncate text-xs text-gray-500 dark:text-gray-400">ada@analytical.dev</p>
    </div>
    <div class="pt-1">
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Your profile</button>
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Settings</button>
      <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40">Sign out</button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function MenuAccount({ name, email, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={\`Account: \${name}\`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
          {initialsOf(name)}
        </span>
        <span className="hidden sm:inline">{name}</span>
      </button>
      {open ? (
        <div role="menu" aria-label="Account" onKeyDown={onMenuKey} className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
          <div className="pt-1">
            {items.map((item, index) => (
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
                className={\`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none \${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }\`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface AccountItem {
  id: string;
  label: string;
  danger?: boolean;
}

export interface MenuAccountProps {
  name: string;
  email: string;
  items: readonly AccountItem[];
  onSelect?: (id: string) => void;
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function MenuAccount({ name, email, items, onSelect }: MenuAccountProps): JSX.Element {
  const [open, setOpen] = useState(false);
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
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={\`Account: \${name}\`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
          {initialsOf(name)}
        </span>
        <span className="hidden sm:inline">{name}</span>
      </button>
      {open ? (
        <div role="menu" aria-label="Account" onKeyDown={onMenuKey} className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
          <div className="pt-1">
            {items.map((item, index) => (
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
                className={\`flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none \${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:bg-red-950/40'
                    : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                }\`}
              >
                {item.label}
              </button>
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
    slug: 'menu-filter-checkbox-menu',
    category: 'menus',
    tags: ['menu', 'filter', 'checkbox', 'multi-select', 'menuitemcheckbox'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'options', type: 'FilterOption[]', required: true, descriptionKey: 'options' },
      { name: 'defaultSelected', type: 'string[]', default: '[]', descriptionKey: 'defaultSelected' },
      { name: 'onChange', type: '(selected: string[]) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  A filter menu of checkboxes. Each option is role="menuitemcheckbox" with a real
  aria-checked, and activating one does NOT close the menu - filtering is
  multi-select. Shown open with two options checked.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Status
    <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white dark:bg-blue-500">2</span>
  </button>
  <div role="menu" aria-label="Status" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <button type="button" role="menuitemcheckbox" aria-checked="true" class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span class="flex h-4 w-4 flex-none items-center justify-center rounded border border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500" aria-hidden="true"><svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>
      In progress
    </button>
    <button type="button" role="menuitemcheckbox" aria-checked="false" class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span class="flex h-4 w-4 flex-none items-center justify-center rounded border border-gray-300 dark:border-gray-600" aria-hidden="true"></span>
      Done
    </button>
    <button type="button" role="menuitem" class="mt-1 flex w-full items-center rounded-md border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:bg-gray-100 focus-visible:outline-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:bg-gray-800">Clear all</button>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function MenuFilter({ label, options, defaultSelected = [], onChange }) {
  const [selected, setSelected] = useState(defaultSelected);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  function commit(next) {
    setSelected(next);
    onChange?.(next);
  }

  function toggle(id) {
    commit(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  }

  function onMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
        {selected.length > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white dark:bg-blue-500">
            {selected.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div role="menu" aria-label={label} onKeyDown={onMenuKey} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map((option, index) => {
            const checked = selected.includes(option.id);
            return (
              <button
                key={option.id}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitemcheckbox"
                aria-checked={checked}
                onClick={() => toggle(option.id)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
              >
                <span className={\`flex h-4 w-4 flex-none items-center justify-center rounded border \${checked ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500' : 'border-gray-300 dark:border-gray-600'}\`} aria-hidden="true">
                  {checked ? (
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  ) : null}
                </span>
                {option.label}
              </button>
            );
          })}
          <button
            ref={(node) => {
              itemsRef.current[options.length] = node;
            }}
            type="button"
            role="menuitem"
            onClick={() => commit([])}
            className="mt-1 flex w-full items-center rounded-md border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:bg-gray-100 focus-visible:outline-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:bg-gray-800"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface FilterOption {
  id: string;
  label: string;
}

export interface MenuFilterProps {
  label: string;
  options: readonly FilterOption[];
  defaultSelected?: readonly string[];
  onChange?: (selected: readonly string[]) => void;
}

export function MenuFilter({ label, options, defaultSelected = [], onChange }: MenuFilterProps): JSX.Element {
  const [selected, setSelected] = useState<readonly string[]>(defaultSelected);
  const [open, setOpen] = useState(false);
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

  function commit(next: readonly string[]): void {
    setSelected(next);
    onChange?.(next);
  }

  function toggle(id: string): void {
    commit(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
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
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
        {selected.length > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white dark:bg-blue-500">
            {selected.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div role="menu" aria-label={label} onKeyDown={onMenuKey} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map((option, index) => {
            const checked = selected.includes(option.id);
            return (
              <button
                key={option.id}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitemcheckbox"
                aria-checked={checked}
                onClick={() => toggle(option.id)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
              >
                <span className={\`flex h-4 w-4 flex-none items-center justify-center rounded border \${checked ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500' : 'border-gray-300 dark:border-gray-600'}\`} aria-hidden="true">
                  {checked ? (
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  ) : null}
                </span>
                {option.label}
              </button>
            );
          })}
          <button
            ref={(node) => {
              itemsRef.current[options.length] = node;
            }}
            type="button"
            role="menuitem"
            onClick={() => commit([])}
            className="mt-1 flex w-full items-center rounded-md border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:bg-gray-100 focus-visible:outline-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:bg-gray-800"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'menu-pinnable-favorites',
    category: 'menus',
    tags: ['menu', 'pin', 'favorites', 'grouped', 'menuitemcheckbox'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'FavItem[]', required: true, descriptionKey: 'items' },
      { name: 'defaultPinned', type: 'string[]', default: '[]', descriptionKey: 'defaultPinned' },
      { name: 'onChange', type: '(pinned: string[]) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  A menu whose items can be pinned. Each row is role="menuitemcheckbox"; checked
  means pinned, and toggling moves the row between the Pinned and All groups
  without closing the menu. Group headings are role="presentation". Shown open.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Folders</button>
  <div role="menu" aria-label="Folders" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <p role="presentation" class="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Pinned</p>
    <button type="button" role="menuitemcheckbox" aria-checked="true" class="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span class="truncate">Inbox</span>
      <svg class="h-4 w-4 flex-none text-amber-500" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5 15 8.6l6.7 1-4.85 4.7 1.15 6.7L12 17.9 5.99 21l1.16-6.7L2.3 9.6l6.7-1z"/></svg>
    </button>
    <p role="presentation" class="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">All</p>
    <button type="button" role="menuitemcheckbox" aria-checked="false" class="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
      <span class="truncate">Drafts</span>
      <svg class="h-4 w-4 flex-none text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5 15 8.6l6.7 1-4.85 4.7 1.15 6.7L12 17.9 5.99 21l1.16-6.7L2.3 9.6l6.7-1z"/></svg>
    </button>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

function StarIcon({ filled }) {
  return (
    <svg
      className={\`h-4 w-4 flex-none \${filled ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}\`}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.5 15 8.6l6.7 1-4.85 4.7 1.15 6.7L12 17.9 5.99 21l1.16-6.7L2.3 9.6l6.7-1z" />
    </svg>
  );
}

export function MenuPinnable({ label, items, defaultPinned = [], onChange }) {
  const [pinned, setPinned] = useState(defaultPinned);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  function togglePin(id) {
    const next = pinned.includes(id) ? pinned.filter((value) => value !== id) : [...pinned, id];
    setPinned(next);
    onChange?.(next);
  }

  function onMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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

  const pinnedItems = items.filter((item) => pinned.includes(item.id));
  const otherItems = items.filter((item) => !pinned.includes(item.id));

  const renderRow = (item, flatIndex, isPinned) => (
    <button
      key={item.id}
      ref={(node) => {
        itemsRef.current[flatIndex] = node;
      }}
      type="button"
      role="menuitemcheckbox"
      aria-checked={isPinned}
      onClick={() => togglePin(item.id)}
      className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
    >
      <span className="truncate">{item.label}</span>
      <StarIcon filled={isPinned} />
    </button>
  );

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>
      {open ? (
        <div role="menu" aria-label={label} onKeyDown={onMenuKey} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {pinnedItems.length > 0 ? (
            <>
              <p role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Pinned</p>
              {pinnedItems.map((item, index) => renderRow(item, index, true))}
            </>
          ) : null}
          <p role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">All</p>
          {otherItems.map((item, index) => renderRow(item, pinnedItems.length + index, false))}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface FavItem {
  id: string;
  label: string;
}

export interface MenuPinnableProps {
  label: string;
  items: readonly FavItem[];
  defaultPinned?: readonly string[];
  onChange?: (pinned: readonly string[]) => void;
}

function StarIcon({ filled }: { filled: boolean }): JSX.Element {
  return (
    <svg
      className={\`h-4 w-4 flex-none \${filled ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}\`}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.5 15 8.6l6.7 1-4.85 4.7 1.15 6.7L12 17.9 5.99 21l1.16-6.7L2.3 9.6l6.7-1z" />
    </svg>
  );
}

export function MenuPinnable({ label, items, defaultPinned = [], onChange }: MenuPinnableProps): JSX.Element {
  const [pinned, setPinned] = useState<readonly string[]>(defaultPinned);
  const [open, setOpen] = useState(false);
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

  function togglePin(id: string): void {
    const next = pinned.includes(id) ? pinned.filter((value) => value !== id) : [...pinned, id];
    setPinned(next);
    onChange?.(next);
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
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

  const pinnedItems = items.filter((item) => pinned.includes(item.id));
  const otherItems = items.filter((item) => !pinned.includes(item.id));

  const renderRow = (item: FavItem, flatIndex: number, isPinned: boolean): JSX.Element => (
    <button
      key={item.id}
      ref={(node) => {
        itemsRef.current[flatIndex] = node;
      }}
      type="button"
      role="menuitemcheckbox"
      aria-checked={isPinned}
      onClick={() => togglePin(item.id)}
      className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
    >
      <span className="truncate">{item.label}</span>
      <StarIcon filled={isPinned} />
    </button>
  );

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>
      {open ? (
        <div role="menu" aria-label={label} onKeyDown={onMenuKey} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {pinnedItems.length > 0 ? (
            <>
              <p role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Pinned</p>
              {pinnedItems.map((item, index) => renderRow(item, index, true))}
            </>
          ) : null}
          <p role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">All</p>
          {otherItems.map((item, index) => renderRow(item, pinnedItems.length + index, false))}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'menu-keyboard-full',
    category: 'menus',
    tags: ['menu', 'keyboard', 'typeahead', 'accessible', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'KeyItem[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  The reference keyboard menu. Arrows wrap, Home/End jump the ends, Enter/Space
  activate, Escape closes, and typing a letter jumps to the first matching item
  (typeahead). The typeahead needs JS; the markup and roles are below, shown open.
-->
<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Country</button>
  <div role="menu" aria-label="Country" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Australia</button>
    <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Brazil</button>
    <button type="button" role="menuitem" class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">Canada</button>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function MenuKeyboard({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const typeahead = useRef('');
  const timer = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) itemsRef.current[0]?.focus();
  }, [open]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function jumpTypeahead(char) {
    typeahead.current += char.toLowerCase();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      typeahead.current = '';
    }, 500);
    const match = items.findIndex((item) => item.label.toLowerCase().startsWith(typeahead.current));
    if (match >= 0) itemsRef.current[match]?.focus();
  }

  function onMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const nodes = itemsRef.current.filter(Boolean);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement);
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
    } else if (event.key.length === 1 && /\\S/.test(event.key)) {
      event.preventDefault();
      jumpTypeahead(event.key);
    }
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>
      {open ? (
        <div role="menu" aria-label={label} onKeyDown={onMenuKey} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item, index) => (
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
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface KeyItem {
  id: string;
  label: string;
}

export interface MenuKeyboardProps {
  label: string;
  items: readonly KeyItem[];
  onSelect?: (id: string) => void;
}

export function MenuKeyboard({ label, items, onSelect }: MenuKeyboardProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const typeahead = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function jumpTypeahead(char: string): void {
    typeahead.current += char.toLowerCase();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      typeahead.current = '';
    }, 500);
    const match = items.findIndex((item) => item.label.toLowerCase().startsWith(typeahead.current));
    if (match >= 0) itemsRef.current[match]?.focus();
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
    } else if (event.key.length === 1 && /\\S/.test(event.key)) {
      // Typeahead: a single printable key jumps to the next matching label.
      event.preventDefault();
      jumpTypeahead(event.key);
    }
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>
      {open ? (
        <div role="menu" aria-label={label} onKeyDown={onMenuKey} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item, index) => (
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
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
];
