'use client';

/**
 * Live preview for `sidebar-mini-expandable`.
 *
 * Mirrors the `typescript` code variant. Click the toggle to expand the rail.
 * Keep in step with `src/data/components/sidebars.ts`.
 */
import { useState, type ReactNode } from 'react';

interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarMiniExpandableProps {
  items: SidebarItem[];
  pathname: string;
  defaultExpanded?: boolean;
  className?: string;
}

function SidebarMiniExpandable({
  items,
  pathname,
  defaultExpanded = false,
  className = '',
}: SidebarMiniExpandableProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <aside
      data-expanded={expanded}
      style={{ width: expanded ? '16rem' : '4rem' }}
      className={`group flex flex-col gap-2 overflow-hidden border-r border-gray-200 bg-white p-2 transition-[width] duration-200 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="mini-nav"
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <nav id="mini-nav" aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md p-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">{item.icon}</span>
                <span className="whitespace-nowrap transition-opacity duration-200 group-data-[expanded=false]:invisible group-data-[expanded=false]:opacity-0 motion-reduce:transition-none">{item.label}</span>
              </a>
            </li>
          ))}
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
  { href: '/team', label: 'Team', icon: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export const minHeight = 260;

export default function SidebarMiniExpandablePreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarMiniExpandable items={ITEMS} pathname="/dashboard" />
    </div>
  );
}
