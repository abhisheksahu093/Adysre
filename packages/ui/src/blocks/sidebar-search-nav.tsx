'use client';

/**
 * Live preview for `sidebar-search-nav`.
 *
 * Mirrors the `typescript` code variant. The field filters the list live.
 * Keep in step with `src/data/components/sidebars.ts`.
 */
import { useState, type ReactNode } from 'react';

interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarSearchNavProps {
  items: SidebarItem[];
  pathname: string;
  searchLabel?: string;
  className?: string;
}

export function SidebarSearchNav({
  items,
  pathname,
  searchLabel = 'Filter navigation',
  className = '',
}: SidebarSearchNavProps) {
  const [query, setQuery] = useState<string>('');
  const shown = items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <aside className={`flex w-64 flex-col gap-3 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="relative">
        <svg className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          aria-label={searchLabel}
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-blue-400"
        />
      </div>
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {shown.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
          {shown.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No matches</li>
          ) : null}
        </ul>
      </nav>
    </aside>
  );
}

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);

const ITEMS: SidebarItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>) },
  { href: '/projects', label: 'Projects', icon: svg(<path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />) },
  { href: '/reports', label: 'Reports', icon: svg(<><path d="M3 3v18h18" /><path d="M7 15l3-4 3 2 4-6" /></>) },
  { href: '/team', label: 'Team', icon: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export const minHeight = 340;

export default function SidebarSearchNavPreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarSearchNav items={ITEMS} pathname="/dashboard" />
    </div>
  );
}
