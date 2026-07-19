import type { ReactNode } from 'react';

/**
 * Live preview for `sidebar-icon-rail`.
 *
 * Every link carries an `aria-label` - that, not the tooltip, is the accessible
 * name. The tooltip is `aria-hidden` decoration and appears on hover *and* on
 * keyboard focus (`group-focus-within`); without the second, the rail would be
 * a mouse-only control.
 *
 * Stateless - the tooltip is pure CSS, so no 'use client'.
 *
 * Keep this in step with `src/data/components/sidebars.ts`.
 */
interface Item {
  href: string;
  label: string;
  icon: ReactNode;
  current?: boolean;
}

const ITEMS: readonly Item[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    current: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  },
  {
    href: '/team',
    label: 'Team',
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <path d="M16 5.5a3 3 0 0 1 0 5" />
        <path d="M18 20a6 6 0 0 0-2-4.5" />
      </>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </>
    ),
  },
];

export default function SidebarIconRailPreview() {
  return (
    <div className="relative flex min-h-64 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <nav
        aria-label="Sidebar"
        className="w-16 shrink-0 rounded-l-lg border-r border-gray-200 bg-white py-3 dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className="flex flex-col items-center gap-1.5">
          {ITEMS.map((item) => (
            <li key={item.href} className="group relative">
              <a
                href="#"
                aria-label={item.label}
                aria-current={item.current ? 'page' : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  {item.icon}
                </svg>
              </a>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-gray-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Hover an icon - then Tab to it. The tooltip shows for both.
      </p>
    </div>
  );
}
