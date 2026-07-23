'use client';

import { useState } from 'react';

/**
 * Live preview for `sidebar-nested-groups`.
 *
 * The disclosure pattern, live: `aria-expanded` on the trigger, `aria-controls`
 * pointing at the panel it owns, and `hidden` on the collapsed panel so its
 * links leave the tab order rather than lurking in it invisibly.
 *
 * Keep this in step with `src/data/components/sidebars.ts`.
 */
interface Child {
  href: string;
  label: string;
  current?: boolean;
}

interface Group {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
  children?: readonly Child[];
}

const ITEMS: readonly Group[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  {
    id: 'projects',
    label: 'Projects',
    children: [
      { href: '/projects/active', label: 'Active', current: true },
      { href: '/projects/archived', label: 'Archived' },
      { href: '/projects/templates', label: 'Templates' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    children: [
      { href: '/settings/general', label: 'General' },
      { href: '/settings/billing', label: 'Billing' },
    ],
  },
];

export function SidebarNestedGroups() {
  const [open, setOpen] = useState<string[]>(['projects']);

  function toggle(id: string): void {
    setOpen((ids) => (ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id]));
  }

  return (
    <div className="relative flex min-h-80 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <nav
        aria-label="Sidebar"
        className="w-60 shrink-0 rounded-l-lg border-r border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className="flex flex-col gap-0.5">
          {ITEMS.map((item) =>
            item.children ? (
              <li key={item.id}>
                <button
                  type="button"
                  aria-expanded={open.includes(item.id)}
                  aria-controls={`preview-panel-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[expanded=true]:[&>svg]:rotate-180 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                >
                  <span>{item.label}</span>
                  <svg
                    className="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <ul
                  id={`preview-panel-${item.id}`}
                  hidden={!open.includes(item.id)}
                  className="mb-1 ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-2.5 dark:border-gray-800"
                >
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <a
                        href="#"
                        aria-current={child.current ? 'page' : undefined}
                        className="flex w-full items-center rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id}>
                <a
                  href="#"
                  aria-current={item.current ? 'page' : undefined}
                  className="flex w-full items-center rounded-md px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Scaffolding, hidden below sm: beside the 15rem rail a 320px stage
          leaves this paragraph no readable width. */}
      <p className="hidden min-w-0 flex-1 p-4 text-sm text-gray-600 dark:text-gray-400 sm:block">
        Collapse a group, then Tab through - the hidden sub-links are gone from the tab order, not
        just from view.
      </p>
    </div>
  );
}


export default SidebarNestedGroups;
