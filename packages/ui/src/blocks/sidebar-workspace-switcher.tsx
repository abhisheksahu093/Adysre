'use client';

/**
 * Live preview for `sidebar-workspace-switcher`.
 *
 * Mirrors the `typescript` code variant. Click the header to open the menu.
 * Keep in step with `src/data/components/sidebars.ts`.
 */
import { useState } from 'react';

interface SidebarItem {
  href: string;
  label: string;
}

interface Workspace {
  id: string;
  name: string;
  plan: string;
  initial: string;
}

interface SidebarWorkspaceSwitcherProps {
  items: SidebarItem[];
  pathname: string;
  workspaces: Workspace[];
  currentId: string;
  className?: string;
}

export function SidebarWorkspaceSwitcher({
  items,
  pathname,
  workspaces,
  currentId,
  className = '',
}: SidebarWorkspaceSwitcherProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(currentId);
  const current = workspaces.find((w) => w.id === selected) ?? workspaces[0];

  return (
    <aside className={`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="ws-menu"
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-md border border-gray-200 p-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-indigo-500 text-sm font-semibold text-white" aria-hidden="true">{current?.initial}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{current?.name}</span>
            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{current?.plan}</span>
          </span>
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M8 9l4-4 4 4M8 15l4 4 4-4" /></svg>
        </button>
        {open ? (
          <ul id="ws-menu" role="menu" className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {workspaces.map((w) => (
              <li key={w.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={w.id === selected}
                  onClick={() => { setSelected(w.id); setOpen(false); }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  {w.name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

const WORKSPACES: Workspace[] = [
  { id: 'acme', name: 'Acme Inc', plan: 'Free plan', initial: 'A' },
  { id: 'globex', name: 'Globex', plan: 'Pro plan', initial: 'G' },
];

const ITEMS: SidebarItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
];

export const minHeight = 300;

export default function SidebarWorkspaceSwitcherPreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarWorkspaceSwitcher items={ITEMS} pathname="/dashboard" workspaces={WORKSPACES} currentId="acme" />
    </div>
  );
}
