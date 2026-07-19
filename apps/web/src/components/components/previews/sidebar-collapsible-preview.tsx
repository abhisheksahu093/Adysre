'use client';

import { useState, type ReactNode } from 'react';

/**
 * Live preview for `sidebar-collapsible`.
 *
 * The collapse is real: the width transitions, the labels leave both the pixels
 * and the accessibility tree (`invisible`, not `opacity-0` alone), the chevron
 * rotation is keyed to `aria-expanded`, and `motion-reduce:` lands on the end
 * state without travelling.
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
];

export default function SidebarCollapsiblePreview() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="relative flex min-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <aside
        data-collapsed={!expanded}
        style={{ width: expanded ? '15rem' : '4rem' }}
        className="group flex shrink-0 flex-col gap-4 overflow-hidden border-r border-gray-200 bg-white p-3 transition-[width] duration-200 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between gap-2 pl-2">
          <span className="whitespace-nowrap text-base font-bold text-gray-900 transition-opacity duration-200 group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0 motion-reduce:transition-none dark:text-gray-50">
            Adysre
          </span>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="preview-csidebar-nav"
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[expanded=false]:[&>svg]:rotate-180 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg
              className="h-[1.125rem] w-[1.125rem] transition-transform duration-200 motion-reduce:transition-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <nav id="preview-csidebar-nav" aria-label="Sidebar">
          <ul className="flex flex-col gap-0.5">
            {ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href="#"
                  aria-current={item.current ? 'page' : undefined}
                  className="flex items-center gap-2.5 whitespace-nowrap rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
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
                  <span className="transition-opacity duration-200 group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0 motion-reduce:transition-none">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Scaffolding, hidden below sm: beside the expanded 15rem sidebar a
          320px stage leaves this paragraph no readable width. */}
      <p className="hidden min-w-0 flex-1 p-4 text-sm text-gray-600 dark:text-gray-400 sm:block">
        Use the chevron to collapse the rail - the labels leave the accessibility tree with the
        pixels.
      </p>
    </div>
  );
}
