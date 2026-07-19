import type { ReactNode } from 'react';

/**
 * Live preview for `sidebar-basic`.
 *
 * Stateless, so no 'use client' - it matches the `nextjs` code variant, which
 * is a Server Component for the same reason.
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

export default function SidebarBasicPreview() {
  return (
    <div className="relative flex min-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <aside className="flex w-60 shrink-0 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <a
          href="#"
          className="rounded px-3 text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <nav aria-label="Sidebar">
          <ul className="flex flex-col gap-0.5">
            {ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href="#"
                  aria-current={item.current ? 'page' : undefined}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                >
                  <svg
                    className="h-[1.125rem] w-[1.125rem] shrink-0"
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
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Scaffolding, hidden below sm: beside the 15rem sidebar a 320px stage
          leaves this paragraph no readable width. */}
      <p className="hidden min-w-0 flex-1 p-4 text-sm text-gray-600 dark:text-gray-400 sm:block">
        Dashboard is the current page - try a screen reader, not just your eyes.
      </p>
    </div>
  );
}
