import type { ComponentEntry } from './types';

/**
 * Sidebars category.
 *
 * Five structurally different navigation shells, not five colourways: a static
 * list, a width-animating collapse, an icon-only rail, a nested disclosure tree
 * and an off-canvas drawer.
 *
 * Two conventions run through all of them and are worth stating once:
 *
 *  - The active item carries `aria-current="page"` and the highlight is styled
 *    off that attribute, never a parallel `.is-active` class. One source of
 *    truth means the highlight cannot drift from what a screen reader says.
 *  - Every icon-only control has an `aria-label`. A tooltip is a hover
 *    affordance, not an accessible name - it does not exist for a screen
 *    reader, and on a touch device it does not exist at all.
 */
export const sidebarsComponents: ComponentEntry[] = [
  {
    slug: 'sidebar-basic',
    category: 'sidebars',
    tags: ['sidebar', 'navigation', 'static', 'dashboard', 'layout'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-12',
    updatedAt: '2026-06-30',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1420, copies: 386, downloads: 112 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'title', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'ariaLabel', type: 'string', default: "'Sidebar'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<aside class="sidebar">
  <a class="sidebar__brand" href="/">Adysre</a>

  <nav class="sidebar__nav" aria-label="Sidebar">
    <ul class="sidebar__list">
      <li>
        <a class="sidebar__link" href="/dashboard" aria-current="page">
          <svg class="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </a>
      </li>
      <li>
        <a class="sidebar__link" href="/projects">
          <svg class="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          </svg>
          Projects
        </a>
      </li>
      <li>
        <a class="sidebar__link" href="/team">
          <svg class="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <circle cx="9" cy="8" r="3" />
            <path d="M3 20a6 6 0 0 1 12 0" />
            <path d="M16 5.5a3 3 0 0 1 0 5" />
            <path d="M18 20a6 6 0 0 0-2-4.5" />
          </svg>
          Team
        </a>
      </li>
      <li>
        <a class="sidebar__link" href="/settings">
          <svg class="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
          Settings
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      css: `.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 15rem;
  padding: 1rem;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
}

.sidebar__brand {
  font-size: 1rem;
  font-weight: 700;
  /* #111827 on #fff is 16.1:1. */
  color: #111827;
  text-decoration: none;
  padding: 0 0.75rem;
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  /* #374151 on #fff is 10.3:1 - well past the 4.5:1 floor. */
  color: #374151;
  text-decoration: none;
}

.sidebar__icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.sidebar__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.sidebar__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * The active item is marked with aria-current in the markup and the highlight
 * hangs off that same attribute rather than a separate .is-active class. One
 * source of truth: the highlight cannot drift out of step with what a screen
 * reader announces.
 */
.sidebar__link[aria-current='page'] {
  background-color: #eff6ff;
  /* #1d4ed8 on #eff6ff is 7.4:1. */
  color: #1d4ed8;
}

/*
 * Dark mode via prefers-color-scheme - the same signal Tailwind's dark:
 * variant defaults to, so the snippet drops into any project.
 */
@media (prefers-color-scheme: dark) {
  .sidebar {
    background-color: #111827;
    border-right-color: #1f2937;
  }

  .sidebar__brand {
    color: #f9fafb;
  }

  .sidebar__link {
    /* #d1d5db on #111827 is 11.4:1. */
    color: #d1d5db;
  }

  .sidebar__link:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .sidebar__link:focus-visible {
    outline-color: #60a5fa;
  }

  .sidebar__link[aria-current='page'] {
    background-color: #1e3a8a;
    /* #bfdbfe on #1e3a8a is 7.1:1. */
    color: #bfdbfe;
  }
}`,
      tailwind: `<aside class="flex w-60 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <a
    href="/"
    class="px-3 text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
  >
    Adysre
  </a>

  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a
          href="/dashboard"
          aria-current="page"
          class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
        >
          <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </a>
      </li>
      <li>
        <a
          href="/projects"
          class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          </svg>
          Projects
        </a>
      </li>
      <li>
        <a
          href="/team"
          class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <circle cx="9" cy="8" r="3" />
            <path d="M3 20a6 6 0 0 1 12 0" />
            <path d="M16 5.5a3 3 0 0 1 0 5" />
            <path d="M18 20a6 6 0 0 0-2-4.5" />
          </svg>
          Team
        </a>
      </li>
      <li>
        <a
          href="/settings"
          class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
          </svg>
          Settings
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'grid', current: true },
  { href: '/projects', label: 'Projects', icon: 'folder' },
  { href: '/team', label: 'Team', icon: 'users' },
  { href: '/settings', label: 'Settings', icon: 'cog' },
];

const PATHS = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>,
  cog: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>,
};

export function SidebarBasic({ items = ITEMS, title = 'Adysre', ariaLabel = 'Sidebar' }) {
  return (
    <aside className="flex w-60 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <a
        href="/"
        className="px-3 text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
      >
        {title}
      </a>

      <nav aria-label={ariaLabel}>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
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
                  {PATHS[item.icon]}
                </svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';
import Link from 'next/link';

/*
 * No 'use client': this sidebar holds no state, so it renders as a Server
 * Component. The active item comes from the pathname the page already knows -
 * pass it in rather than reading it in the browser.
 */
interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarBasicProps {
  items: SidebarItem[];
  pathname: string;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export function SidebarBasic({
  items,
  pathname,
  title = 'Adysre',
  ariaLabel = 'Sidebar',
  className = '',
}: SidebarBasicProps) {
  return (
    <aside
      className={\`flex w-60 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <Link
        href="/"
        className="px-3 text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
      >
        {title}
      </Link>

      <nav aria-label={ariaLabel}>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-[1.125rem] [&>svg]:w-[1.125rem] [&>svg]:shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarBasicProps {
  items: SidebarItem[];
  /** Current route. Compared against item.href to mark aria-current. */
  pathname: string;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export function SidebarBasic({
  items,
  pathname,
  title = 'Adysre',
  ariaLabel = 'Sidebar',
  className = '',
}: SidebarBasicProps): JSX.Element {
  return (
    <aside
      className={\`flex w-60 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <a
        href="/"
        className="px-3 text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
      >
        {title}
      </a>

      <nav aria-label={ariaLabel}>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-[1.125rem] [&>svg]:w-[1.125rem] [&>svg]:shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-collapsible',
    category: 'sidebars',
    tags: ['sidebar', 'collapsible', 'animated', 'navigation', 'toggle'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-08',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 2180, copies: 604, downloads: 197 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'title', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'duration', type: 'number', default: '200', descriptionKey: 'duration' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<aside class="csidebar" data-collapsed="false">
  <div class="csidebar__head">
    <span class="csidebar__brand">Adysre</span>
    <button
      class="csidebar__toggle"
      type="button"
      aria-expanded="true"
      aria-controls="csidebar-nav"
      aria-label="Collapse sidebar"
    >
      <svg class="csidebar__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  </div>

  <nav class="csidebar__nav" id="csidebar-nav" aria-label="Sidebar">
    <ul class="csidebar__list">
      <li>
        <a class="csidebar__link" href="/dashboard" aria-current="page">
          <svg class="csidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          <span class="csidebar__label">Dashboard</span>
        </a>
      </li>
      <li>
        <a class="csidebar__link" href="/projects">
          <svg class="csidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          </svg>
          <span class="csidebar__label">Projects</span>
        </a>
      </li>
      <li>
        <a class="csidebar__link" href="/team">
          <svg class="csidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <circle cx="9" cy="8" r="3" />
            <path d="M3 20a6 6 0 0 1 12 0" />
            <path d="M16 5.5a3 3 0 0 1 0 5" />
            <path d="M18 20a6 6 0 0 0-2-4.5" />
          </svg>
          <span class="csidebar__label">Team</span>
        </a>
      </li>
    </ul>
  </nav>
</aside>

<script>
  document.querySelectorAll('.csidebar').forEach(function (root) {
    var toggle = root.querySelector('.csidebar__toggle');

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Expand sidebar' : 'Collapse sidebar');
      root.dataset.collapsed = String(expanded);
    });
  });
</script>`,
      css: `.csidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 15rem;
  padding: 0.75rem;
  overflow: hidden;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
  transition: width 200ms ease;
}

.csidebar[data-collapsed='true'] {
  width: 4rem;
}

.csidebar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-left: 0.5rem;
}

.csidebar__brand {
  font-size: 1rem;
  font-weight: 700;
  /* #111827 on #fff is 16.1:1. */
  color: #111827;
  white-space: nowrap;
  transition: opacity 200ms ease;
}

.csidebar[data-collapsed='true'] .csidebar__brand {
  opacity: 0;
  /*
   * visibility, not display: none. It rides the same transition, and it takes
   * the hidden wordmark out of the accessibility tree rather than leaving a
   * label a screen reader still reads while the eye sees nothing.
   */
  visibility: hidden;
}

.csidebar__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: #374151;
  cursor: pointer;
}

.csidebar__toggle:hover {
  background-color: #f3f4f6;
}

.csidebar__toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.csidebar__chevron {
  width: 1.125rem;
  height: 1.125rem;
  transition: transform 200ms ease;
}

/*
 * The chevron rotation hangs off aria-expanded, so the arrow physically cannot
 * point the wrong way - there is no second flag to forget to update.
 */
.csidebar__toggle[aria-expanded='false'] .csidebar__chevron {
  transform: rotate(180deg);
}

.csidebar__list {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.csidebar__link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  /* #374151 on #fff is 10.3:1. */
  color: #374151;
  text-decoration: none;
  white-space: nowrap;
}

.csidebar__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.csidebar__label {
  transition: opacity 200ms ease;
}

.csidebar[data-collapsed='true'] .csidebar__label {
  opacity: 0;
  visibility: hidden;
}

.csidebar__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.csidebar__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.csidebar__link[aria-current='page'] {
  background-color: #eff6ff;
  /* #1d4ed8 on #eff6ff is 7.4:1. */
  color: #1d4ed8;
}

/*
 * Reduced motion: the width and opacity changes are decoration, the collapse
 * itself is the feature. Dropping the transitions lands on the same END state
 * instantly rather than disabling the control.
 */
@media (prefers-reduced-motion: reduce) {
  .csidebar,
  .csidebar__brand,
  .csidebar__label,
  .csidebar__chevron {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .csidebar {
    background-color: #111827;
    border-right-color: #1f2937;
  }

  .csidebar__brand {
    color: #f9fafb;
  }

  .csidebar__toggle {
    color: #d1d5db;
  }

  .csidebar__toggle:hover {
    background-color: #1f2937;
  }

  .csidebar__toggle:focus-visible,
  .csidebar__link:focus-visible {
    outline-color: #60a5fa;
  }

  .csidebar__link {
    /* #d1d5db on #111827 is 11.4:1. */
    color: #d1d5db;
  }

  .csidebar__link:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .csidebar__link[aria-current='page'] {
    background-color: #1e3a8a;
    /* #bfdbfe on #1e3a8a is 7.1:1. */
    color: #bfdbfe;
  }
}`,
      tailwind: `<!-- Toggle data-collapsed on the aside and aria-expanded on the button together. -->
<aside
  data-collapsed="false"
  class="flex w-60 flex-col gap-4 overflow-hidden border-r border-gray-200 bg-white p-3 transition-[width] duration-200 data-[collapsed=true]:w-16 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900"
>
  <div class="flex items-center justify-between gap-2 pl-2">
    <span class="whitespace-nowrap text-base font-bold text-gray-900 transition-opacity duration-200 motion-reduce:transition-none dark:text-gray-50">
      Adysre
    </span>
    <button
      type="button"
      aria-expanded="true"
      aria-controls="csidebar-nav"
      aria-label="Collapse sidebar"
      class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[expanded=false]:[&>svg]:rotate-180 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-[1.125rem] w-[1.125rem] transition-transform duration-200 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  </div>

  <nav id="csidebar-nav" aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a
          href="/dashboard"
          aria-current="page"
          class="flex items-center gap-2.5 whitespace-nowrap rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
        >
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          <!-- invisible + opacity so the label leaves the a11y tree with the pixels. -->
          <span class="transition-opacity duration-200 motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0">
            Dashboard
          </span>
        </a>
      </li>
      <li>
        <a
          href="/projects"
          class="flex items-center gap-2.5 whitespace-nowrap rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          </svg>
          <span class="transition-opacity duration-200 motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0">
            Projects
          </span>
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `import { useState } from 'react';

export function SidebarCollapsible({ items, title = 'Adysre' }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      data-collapsed={!expanded}
      className="group flex flex-col gap-4 overflow-hidden border-r border-gray-200 bg-white p-3 transition-[width] duration-200 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900"
      style={{ width: expanded ? '15rem' : '4rem' }}
    >
      <div className="flex items-center justify-between gap-2 pl-2">
        <span
          className="whitespace-nowrap text-base font-bold text-gray-900 transition-opacity duration-200 motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0 dark:text-gray-50"
        >
          {title}
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="csidebar-nav"
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

      <nav id="csidebar-nav" aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="transition-opacity duration-200 motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      nextjs: `'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarCollapsibleProps {
  items: SidebarItem[];
  title?: string;
  /** Transition length in ms. Ignored under prefers-reduced-motion. */
  duration?: number;
  className?: string;
}

export function SidebarCollapsible({
  items,
  title = 'Adysre',
  duration = 200,
  className = '',
}: SidebarCollapsibleProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      data-collapsed={!expanded}
      style={{ width: expanded ? '15rem' : '4rem', transitionDuration: \`\${duration}ms\` }}
      className={\`group flex flex-col gap-4 overflow-hidden border-r border-gray-200 bg-white p-3 transition-[width] motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-center justify-between gap-2 pl-2">
        <span className="whitespace-nowrap text-base font-bold text-gray-900 transition-opacity motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0 dark:text-gray-50">
          {title}
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="csidebar-nav"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[expanded=false]:[&>svg]:rotate-180 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-[1.125rem] w-[1.125rem] transition-transform motion-reduce:transition-none"
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

      <nav id="csidebar-nav" aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="transition-opacity motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `import { useState, type ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarCollapsibleProps {
  items: SidebarItem[];
  pathname: string;
  title?: string;
  duration?: number;
  className?: string;
}

export function SidebarCollapsible({
  items,
  pathname,
  title = 'Adysre',
  duration = 200,
  className = '',
}: SidebarCollapsibleProps): JSX.Element {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <aside
      data-collapsed={!expanded}
      style={{ width: expanded ? '15rem' : '4rem', transitionDuration: \`\${duration}ms\` }}
      className={\`group flex flex-col gap-4 overflow-hidden border-r border-gray-200 bg-white p-3 transition-[width] motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-center justify-between gap-2 pl-2">
        <span className="whitespace-nowrap text-base font-bold text-gray-900 transition-opacity motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0 dark:text-gray-50">
          {title}
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="csidebar-nav"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[expanded=false]:[&>svg]:rotate-180 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-[1.125rem] w-[1.125rem] transition-transform motion-reduce:transition-none"
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

      <nav id="csidebar-nav" aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="transition-opacity motion-reduce:transition-none group-data-[collapsed=true]:invisible group-data-[collapsed=true]:opacity-0">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-icon-rail',
    category: 'sidebars',
    tags: ['sidebar', 'rail', 'icons', 'tooltip', 'compact'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-02',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1660, copies: 452, downloads: 134 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'items', type: 'RailItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'ariaLabel', type: 'string', default: "'Sidebar'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Each link carries an aria-label. The tooltip is a hover affordance for sighted
  mouse users and nothing more - it is not the accessible name, and on a touch
  device it never appears at all.
-->
<nav class="rail" aria-label="Sidebar">
  <ul class="rail__list">
    <li class="rail__item">
      <a class="rail__link" href="/dashboard" aria-label="Dashboard" aria-current="page">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      </a>
      <span class="rail__tip" aria-hidden="true">Dashboard</span>
    </li>
    <li class="rail__item">
      <a class="rail__link" href="/projects" aria-label="Projects">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        </svg>
      </a>
      <span class="rail__tip" aria-hidden="true">Projects</span>
    </li>
    <li class="rail__item">
      <a class="rail__link" href="/team" aria-label="Team">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M16 5.5a3 3 0 0 1 0 5" />
          <path d="M18 20a6 6 0 0 0-2-4.5" />
        </svg>
      </a>
      <span class="rail__tip" aria-hidden="true">Team</span>
    </li>
    <li class="rail__item">
      <a class="rail__link" href="/settings" aria-label="Settings">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        </svg>
      </a>
      <span class="rail__tip" aria-hidden="true">Settings</span>
    </li>
  </ul>
</nav>`,
      css: `.rail {
  width: 4rem;
  padding: 0.75rem 0;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
}

.rail__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rail__item {
  position: relative;
}

.rail__link {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 2.5rem square: comfortably over the 24px AAA target-size floor. */
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  /* #374151 on #fff is 10.3:1. */
  color: #374151;
}

.rail__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.rail__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.rail__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.rail__link[aria-current='page'] {
  background-color: #eff6ff;
  /* #1d4ed8 on #eff6ff is 7.4:1. */
  color: #1d4ed8;
}

.rail__tip {
  position: absolute;
  top: 50%;
  left: calc(100% + 0.5rem);
  transform: translateY(-50%);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #111827;
  color: #f9fafb;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
  z-index: 10;
}

/*
 * :focus-within, not just :hover - the tooltip must also appear when the link
 * is reached by keyboard, or the rail is a mouse-only control.
 */
.rail__item:hover .rail__tip,
.rail__item:focus-within .rail__tip {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .rail__tip {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .rail {
    background-color: #111827;
    border-right-color: #1f2937;
  }

  .rail__link {
    /* #d1d5db on #111827 is 11.4:1. */
    color: #d1d5db;
  }

  .rail__link:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .rail__link:focus-visible {
    outline-color: #60a5fa;
  }

  .rail__link[aria-current='page'] {
    background-color: #1e3a8a;
    /* #bfdbfe on #1e3a8a is 7.1:1. */
    color: #bfdbfe;
  }

  .rail__tip {
    background-color: #f9fafb;
    /* #111827 on #f9fafb is 15.6:1 - the tooltip inverts with the theme. */
    color: #111827;
  }
}`,
      tailwind: `<nav aria-label="Sidebar" class="w-16 border-r border-gray-200 bg-white py-3 dark:border-gray-800 dark:bg-gray-900">
  <ul class="flex flex-col items-center gap-1.5">
    <li class="group relative">
      <!-- aria-label is the accessible name. The tooltip below is decoration. -->
      <a
        href="/dashboard"
        aria-label="Dashboard"
        aria-current="page"
        class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      </a>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-gray-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
      >
        Dashboard
      </span>
    </li>
    <li class="group relative">
      <a
        href="/projects"
        aria-label="Projects"
        class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        </svg>
      </a>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-gray-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
      >
        Projects
      </span>
    </li>
  </ul>
</nav>`,
      react: `export function SidebarIconRail({ items, ariaLabel = 'Sidebar' }) {
  return (
    <nav
      aria-label={ariaLabel}
      className="w-16 border-r border-gray-200 bg-white py-3 dark:border-gray-800 dark:bg-gray-900"
    >
      <ul className="flex flex-col items-center gap-1.5">
        {items.map((item) => (
          <li key={item.href} className="group relative">
            <a
              href={item.href}
              aria-label={item.label}
              aria-current={item.current ? 'page' : undefined}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
                {item.icon}
              </span>
            </a>
            {/* Decoration only - aria-label above is what gets announced. */}
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
  );
}`,
      nextjs: `import type { ReactNode } from 'react';
import Link from 'next/link';

interface RailItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarIconRailProps {
  items: RailItem[];
  pathname: string;
  ariaLabel?: string;
  className?: string;
}

/*
 * Stateless - the tooltip is pure CSS (group-hover / group-focus-within), so
 * this renders as a Server Component with no 'use client'.
 */
export function SidebarIconRail({
  items,
  pathname,
  ariaLabel = 'Sidebar',
  className = '',
}: SidebarIconRailProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={\`w-16 border-r border-gray-200 bg-white py-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <ul className="flex flex-col items-center gap-1.5">
        {items.map((item) => (
          <li key={item.href} className="group relative">
            <Link
              href={item.href}
              aria-label={item.label}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
                {item.icon}
              </span>
            </Link>
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
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface RailItem {
  href: string;
  /** Doubles as the link's aria-label and the tooltip text. */
  label: string;
  icon: ReactNode;
}

export interface SidebarIconRailProps {
  items: RailItem[];
  pathname: string;
  ariaLabel?: string;
  className?: string;
}

export function SidebarIconRail({
  items,
  pathname,
  ariaLabel = 'Sidebar',
  className = '',
}: SidebarIconRailProps): JSX.Element {
  return (
    <nav
      aria-label={ariaLabel}
      className={\`w-16 border-r border-gray-200 bg-white py-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <ul className="flex flex-col items-center gap-1.5">
        {items.map((item) => (
          <li key={item.href} className="group relative">
            <a
              href={item.href}
              aria-label={item.label}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
                {item.icon}
              </span>
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
  );
}`,
    },
  },
  {
    slug: 'sidebar-nested-groups',
    category: 'sidebars',
    tags: ['sidebar', 'nested', 'disclosure', 'navigation', 'tree'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-21',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1310, copies: 341, downloads: 88 },
    variants: [
      { id: 'single', labelKey: 'single' },
      { id: 'multiple', labelKey: 'multiple' },
    ],
    props: [
      { name: 'items', type: 'SidebarGroup[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'defaultOpenIds', type: 'string[]', default: '[]', descriptionKey: 'defaultOpenIds' },
      { name: 'allowMultiple', type: 'boolean', default: 'true', descriptionKey: 'allowMultiple' },
      { name: 'ariaLabel', type: 'string', default: "'Sidebar'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      html: `<nav class="nsidebar" aria-label="Sidebar">
  <ul class="nsidebar__list">
    <li>
      <a class="nsidebar__link" href="/dashboard" aria-current="page">Dashboard</a>
    </li>

    <li class="nsidebar__group">
      <!--
        The disclosure pattern: aria-expanded on the trigger, aria-controls
        pointing at the panel it owns. The chevron is decoration; those two
        attributes are what communicate state.
      -->
      <button
        class="nsidebar__trigger"
        type="button"
        aria-expanded="true"
        aria-controls="nsidebar-panel-projects"
      >
        <span>Projects</span>
        <svg class="nsidebar__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <ul class="nsidebar__sub" id="nsidebar-panel-projects">
        <li><a class="nsidebar__sublink" href="/projects/active">Active</a></li>
        <li><a class="nsidebar__sublink" href="/projects/archived">Archived</a></li>
        <li><a class="nsidebar__sublink" href="/projects/templates">Templates</a></li>
      </ul>
    </li>

    <li class="nsidebar__group">
      <button
        class="nsidebar__trigger"
        type="button"
        aria-expanded="false"
        aria-controls="nsidebar-panel-settings"
      >
        <span>Settings</span>
        <svg class="nsidebar__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <ul class="nsidebar__sub" id="nsidebar-panel-settings" hidden>
        <li><a class="nsidebar__sublink" href="/settings/general">General</a></li>
        <li><a class="nsidebar__sublink" href="/settings/billing">Billing</a></li>
      </ul>
    </li>
  </ul>
</nav>

<script>
  document.querySelectorAll('.nsidebar__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      /*
       * hidden, not just height:0. A collapsed panel that is merely invisible
       * still hands its links to Tab and to a screen reader - the classic
       * half-built disclosure.
       */
      panel.hidden = expanded;
    });
  });
</script>`,
      css: `.nsidebar {
  width: 15rem;
  padding: 0.75rem;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
}

.nsidebar__list,
.nsidebar__sub {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nsidebar__sub {
  /* The rail doubles as the indent guide - one border, no spacer divs. */
  margin: 0.125rem 0 0.25rem 0.75rem;
  padding-left: 0.625rem;
  border-left: 1px solid #e5e7eb;
}

.nsidebar__link,
.nsidebar__trigger,
.nsidebar__sublink {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  /* #374151 on #fff is 10.3:1. */
  color: #374151;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
}

.nsidebar__trigger {
  justify-content: space-between;
  gap: 0.5rem;
}

.nsidebar__sublink {
  font-weight: 400;
  /* #4b5563 on #fff is 7.6:1 - a step down in weight, still over 4.5:1. */
  color: #4b5563;
}

.nsidebar__link:hover,
.nsidebar__trigger:hover,
.nsidebar__sublink:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.nsidebar__link:focus-visible,
.nsidebar__trigger:focus-visible,
.nsidebar__sublink:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nsidebar__link[aria-current='page'],
.nsidebar__sublink[aria-current='page'] {
  background-color: #eff6ff;
  /* #1d4ed8 on #eff6ff is 7.4:1. */
  color: #1d4ed8;
}

.nsidebar__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  transition: transform 150ms ease;
}

/* Rotation keyed to aria-expanded - the arrow cannot point the wrong way. */
.nsidebar__trigger[aria-expanded='true'] .nsidebar__chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .nsidebar__chevron {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .nsidebar {
    background-color: #111827;
    border-right-color: #1f2937;
  }

  .nsidebar__sub {
    border-left-color: #1f2937;
  }

  .nsidebar__link,
  .nsidebar__trigger {
    /* #d1d5db on #111827 is 11.4:1. */
    color: #d1d5db;
  }

  .nsidebar__sublink {
    /* #9ca3af on #111827 is 6.4:1. */
    color: #9ca3af;
  }

  .nsidebar__link:hover,
  .nsidebar__trigger:hover,
  .nsidebar__sublink:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .nsidebar__link:focus-visible,
  .nsidebar__trigger:focus-visible,
  .nsidebar__sublink:focus-visible {
    outline-color: #60a5fa;
  }

  .nsidebar__link[aria-current='page'],
  .nsidebar__sublink[aria-current='page'] {
    background-color: #1e3a8a;
    /* #bfdbfe on #1e3a8a is 7.1:1. */
    color: #bfdbfe;
  }
}`,
      tailwind: `<nav aria-label="Sidebar" class="w-60 border-r border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
  <ul class="flex flex-col gap-0.5">
    <li>
      <a
        href="/dashboard"
        aria-current="page"
        class="flex w-full items-center rounded-md px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
      >
        Dashboard
      </a>
    </li>

    <li>
      <button
        type="button"
        aria-expanded="true"
        aria-controls="nsidebar-panel-projects"
        class="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[expanded=true]:[&>svg]:rotate-180 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
      >
        <span>Projects</span>
        <svg class="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <!-- hidden when collapsed: an invisible panel must not keep taking Tab. -->
      <ul id="nsidebar-panel-projects" class="ml-3 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-gray-200 pl-2.5 dark:border-gray-800">
        <li>
          <a
            href="/projects/active"
            class="flex w-full items-center rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="/projects/archived"
            class="flex w-full items-center rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Archived
          </a>
        </li>
      </ul>
    </li>

    <li>
      <button
        type="button"
        aria-expanded="false"
        aria-controls="nsidebar-panel-settings"
        class="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[expanded=true]:[&>svg]:rotate-180 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
      >
        <span>Settings</span>
        <svg class="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <ul id="nsidebar-panel-settings" hidden class="ml-3 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-gray-200 pl-2.5 dark:border-gray-800">
        <li>
          <a
            href="/settings/general"
            class="flex w-full items-center rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            General
          </a>
        </li>
      </ul>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

export function SidebarNestedGroups({ items, defaultOpenIds = [], ariaLabel = 'Sidebar' }) {
  const [open, setOpen] = useState(defaultOpenIds);

  const toggle = (id) =>
    setOpen((ids) => (ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id]));

  return (
    <nav
      aria-label={ariaLabel}
      className="w-60 border-r border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
    >
      <ul className="flex flex-col gap-0.5">
        {items.map((item) =>
          item.children ? (
            <li key={item.id}>
              <button
                type="button"
                aria-expanded={open.includes(item.id)}
                aria-controls={\`panel-\${item.id}\`}
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
                id={\`panel-\${item.id}\`}
                hidden={!open.includes(item.id)}
                className="mb-1 ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-2.5 dark:border-gray-800"
              >
                {item.children.map((child) => (
                  <li key={child.href}>
                    <a
                      href={child.href}
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
                href={item.href}
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
  );
}`,
      nextjs: `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarChild {
  href: string;
  label: string;
}

interface SidebarGroup {
  id: string;
  label: string;
  href?: string;
  children?: SidebarChild[];
}

interface SidebarNestedGroupsProps {
  items: SidebarGroup[];
  defaultOpenIds?: string[];
  /** false closes the other groups when one opens (accordion behaviour). */
  allowMultiple?: boolean;
  ariaLabel?: string;
}

export function SidebarNestedGroups({
  items,
  defaultOpenIds = [],
  allowMultiple = true,
  ariaLabel = 'Sidebar',
}: SidebarNestedGroupsProps) {
  const [open, setOpen] = useState<string[]>(defaultOpenIds);
  const pathname = usePathname();

  function toggle(id: string): void {
    setOpen((ids) => {
      if (ids.includes(id)) return ids.filter((v) => v !== id);
      return allowMultiple ? [...ids, id] : [id];
    });
  }

  return (
    <nav
      aria-label={ariaLabel}
      className="w-60 border-r border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
    >
      <ul className="flex flex-col gap-0.5">
        {items.map((item) =>
          item.children ? (
            <li key={item.id}>
              <button
                type="button"
                aria-expanded={open.includes(item.id)}
                aria-controls={\`panel-\${item.id}\`}
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
                id={\`panel-\${item.id}\`}
                hidden={!open.includes(item.id)}
                className="mb-1 ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-2.5 dark:border-gray-800"
              >
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      aria-current={pathname === child.href ? 'page' : undefined}
                      className="flex w-full items-center rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={item.id}>
              <Link
                href={item.href ?? '#'}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex w-full items-center rounded-md px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface SidebarChild {
  href: string;
  label: string;
}

export interface SidebarGroup {
  id: string;
  label: string;
  href?: string;
  children?: SidebarChild[];
}

export interface SidebarNestedGroupsProps {
  items: SidebarGroup[];
  pathname: string;
  defaultOpenIds?: string[];
  allowMultiple?: boolean;
  ariaLabel?: string;
}

export function SidebarNestedGroups({
  items,
  pathname,
  defaultOpenIds = [],
  allowMultiple = true,
  ariaLabel = 'Sidebar',
}: SidebarNestedGroupsProps): JSX.Element {
  const [open, setOpen] = useState<string[]>(defaultOpenIds);

  function toggle(id: string): void {
    setOpen((ids) => {
      if (ids.includes(id)) return ids.filter((v) => v !== id);
      return allowMultiple ? [...ids, id] : [id];
    });
  }

  return (
    <nav
      aria-label={ariaLabel}
      className="w-60 border-r border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
    >
      <ul className="flex flex-col gap-0.5">
        {items.map((item) =>
          item.children ? (
            <li key={item.id}>
              <button
                type="button"
                aria-expanded={open.includes(item.id)}
                aria-controls={\`panel-\${item.id}\`}
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
                id={\`panel-\${item.id}\`}
                hidden={!open.includes(item.id)}
                className="mb-1 ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-2.5 dark:border-gray-800"
              >
                {item.children.map((child) => (
                  <li key={child.href}>
                    <a
                      href={child.href}
                      aria-current={pathname === child.href ? 'page' : undefined}
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
                href={item.href ?? '#'}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex w-full items-center rounded-md px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                {item.label}
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'sidebar-mobile-drawer',
    category: 'sidebars',
    tags: ['sidebar', 'drawer', 'mobile', 'offcanvas', 'modal'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-02',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 980, copies: 267, downloads: 74 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'title', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'ariaLabel', type: 'string', default: "'Open sidebar'", descriptionKey: 'ariaLabel' },
      { name: 'direction', type: "'left' | 'right'", default: "'left'", descriptionKey: 'direction' },
    ],
    code: {
      html: `<button
  class="dsidebar__open"
  type="button"
  aria-expanded="false"
  aria-controls="dsidebar-panel"
  aria-label="Open sidebar"
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

<div class="dsidebar__backdrop" hidden></div>

<div
  class="dsidebar__panel"
  id="dsidebar-panel"
  role="dialog"
  aria-modal="true"
  aria-label="Sidebar"
  hidden
>
  <div class="dsidebar__head">
    <span class="dsidebar__brand">Adysre</span>
    <button class="dsidebar__close" type="button" aria-label="Close sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  </div>

  <nav aria-label="Sidebar">
    <ul class="dsidebar__list">
      <li><a class="dsidebar__link" href="/dashboard" aria-current="page">Dashboard</a></li>
      <li><a class="dsidebar__link" href="/projects">Projects</a></li>
      <li><a class="dsidebar__link" href="/team">Team</a></li>
      <li><a class="dsidebar__link" href="/settings">Settings</a></li>
    </ul>
  </nav>
</div>

<script>
  (function () {
    var openBtn = document.querySelector('.dsidebar__open');
    var closeBtn = document.querySelector('.dsidebar__close');
    var backdrop = document.querySelector('.dsidebar__backdrop');
    var panel = document.getElementById('dsidebar-panel');

    function focusables() {
      return Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function open() {
      panel.hidden = false;
      backdrop.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      /* Stops the page scrolling under a finger while the drawer sits still. */
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        panel.dataset.open = 'true';
        var first = focusables()[0];
        if (first) first.focus();
      });
      document.addEventListener('keydown', onKeyDown);
    }

    function close() {
      panel.hidden = true;
      backdrop.hidden = true;
      delete panel.dataset.open;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      /* Focus goes back to the trigger, not to the top of the document. */
      openBtn.focus();
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      /*
       * The focus trap. Without it the page behind still takes Tab and a
       * keyboard user walks straight out of the open drawer into links they
       * cannot see - the classic half-built modal.
       */
      var items = focusables();
      if (items.length === 0) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
  })();
</script>`,
      css: `.dsidebar__open,
.dsidebar__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  /* #374151 on #fff is 10.3:1. */
  color: #374151;
  cursor: pointer;
}

.dsidebar__open svg,
.dsidebar__close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.dsidebar__open:hover,
.dsidebar__close:hover {
  background-color: #f3f4f6;
}

.dsidebar__open:focus-visible,
.dsidebar__close:focus-visible,
.dsidebar__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.dsidebar__backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgba(17, 24, 39, 0.5);
}

.dsidebar__panel {
  position: fixed;
  inset-block: 0;
  left: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(16rem, 80%);
  padding: 1rem;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
  transform: translateX(-100%);
  transition: transform 200ms ease;
}

.dsidebar__panel[data-open='true'] {
  transform: translateX(0);
}

.dsidebar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dsidebar__brand {
  font-size: 1rem;
  font-weight: 700;
  /* #111827 on #fff is 16.1:1. */
  color: #111827;
}

.dsidebar__list {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dsidebar__link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
}

.dsidebar__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.dsidebar__link[aria-current='page'] {
  background-color: #eff6ff;
  /* #1d4ed8 on #eff6ff is 7.4:1. */
  color: #1d4ed8;
}

/*
 * The slide is decoration; the drawer is the feature. Someone who asked for
 * less motion still gets the drawer, it simply arrives at the end state.
 */
@media (prefers-reduced-motion: reduce) {
  .dsidebar__panel {
    transition: none;
    transform: translateX(0);
  }
}

@media (prefers-color-scheme: dark) {
  .dsidebar__open,
  .dsidebar__close {
    color: #d1d5db;
  }

  .dsidebar__open:hover,
  .dsidebar__close:hover {
    background-color: #1f2937;
  }

  .dsidebar__open:focus-visible,
  .dsidebar__close:focus-visible,
  .dsidebar__link:focus-visible {
    outline-color: #60a5fa;
  }

  .dsidebar__backdrop {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .dsidebar__panel {
    background-color: #111827;
    border-right-color: #1f2937;
  }

  .dsidebar__brand {
    color: #f9fafb;
  }

  .dsidebar__link {
    /* #d1d5db on #111827 is 11.4:1. */
    color: #d1d5db;
  }

  .dsidebar__link:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .dsidebar__link[aria-current='page'] {
    background-color: #1e3a8a;
    /* #bfdbfe on #1e3a8a is 7.1:1. */
    color: #bfdbfe;
  }
}`,
      tailwind: `<button
  type="button"
  aria-expanded="false"
  aria-controls="dsidebar-panel"
  aria-label="Open sidebar"
  class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
>
  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

<div hidden class="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70"></div>

<div
  id="dsidebar-panel"
  role="dialog"
  aria-modal="true"
  aria-label="Sidebar"
  hidden
  data-open="false"
  class="fixed inset-y-0 left-0 z-50 flex w-[min(16rem,80%)] -translate-x-full flex-col gap-4 border-r border-gray-200 bg-white p-4 transition-transform duration-200 data-[open=true]:translate-x-0 motion-reduce:translate-x-0 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900"
>
  <div class="flex items-center justify-between">
    <span class="text-base font-bold text-gray-900 dark:text-gray-50">Adysre</span>
    <button
      type="button"
      aria-label="Close sidebar"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  </div>

  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a
          href="/dashboard"
          aria-current="page"
          class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
        >
          Dashboard
        </a>
      </li>
      <li>
        <a
          href="/projects"
          class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Projects
        </a>
      </li>
    </ul>
  </nav>
</div>`,
      react: `import { useCallback, useEffect, useRef, useState } from 'react';

export function SidebarMobileDrawer({ items, title = 'Adysre' }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const openRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    openRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () =>
      panelRef.current
        ? Array.from(panelRef.current.querySelectorAll('a[href], button:not([disabled])'))
        : [];

    focusables()[0]?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={openRef}
        type="button"
        aria-expanded={open}
        aria-controls="dsidebar-panel"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="dsidebar-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            className="fixed inset-y-0 left-0 z-50 flex w-[min(16rem,80%)] flex-col gap-4 border-r border-gray-200 bg-white p-4 motion-safe:animate-[slide-in_200ms_ease] dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Sidebar">
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}`,
      nextjs: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  href: string;
  label: string;
}

interface SidebarMobileDrawerProps {
  items: SidebarItem[];
  title?: string;
  ariaLabel?: string;
  direction?: 'left' | 'right';
}

export function SidebarMobileDrawer({
  items,
  title = 'Adysre',
  ariaLabel = 'Open sidebar',
  direction = 'left',
}: SidebarMobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
    openRef.current?.focus();
  }, []);

  /* Route changes should close the drawer - otherwise it hangs over the new page. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function focusables(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
    }

    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  const side = direction === 'left' ? 'left-0 border-r' : 'right-0 border-l';

  return (
    <>
      <button
        ref={openRef}
        type="button"
        aria-expanded={open}
        aria-controls="dsidebar-panel"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="dsidebar-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            className={\`fixed inset-y-0 \${side} z-50 flex w-[min(16rem,80%)] flex-col gap-4 border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900\`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Sidebar">
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}`,
      typescript: `import { useCallback, useEffect, useRef, useState } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  current?: boolean;
}

export interface SidebarMobileDrawerProps {
  items: SidebarItem[];
  title?: string;
  ariaLabel?: string;
  direction?: 'left' | 'right';
}

export function SidebarMobileDrawer({
  items,
  title = 'Adysre',
  ariaLabel = 'Open sidebar',
  direction = 'left',
}: SidebarMobileDrawerProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    openRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function focusables(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
    }

    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  const side = direction === 'left' ? 'left-0 border-r' : 'right-0 border-l';

  return (
    <>
      <button
        ref={openRef}
        type="button"
        aria-expanded={open}
        aria-controls="dsidebar-panel"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="dsidebar-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
            className={\`fixed inset-y-0 \${side} z-50 flex w-[min(16rem,80%)] flex-col gap-4 border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900\`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Sidebar">
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}`,
    },
  },
  {
    slug: 'sidebar-dark-theme',
    category: 'sidebars',
    tags: ['sidebar', 'dark', 'navigation', 'theme', 'dashboard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'title', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'ariaLabel', type: 'string', default: "'Sidebar'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- A committed-dark shell: no light styles, so it does not depend on a dark: toggle. -->
<aside class="flex w-64 flex-col gap-4 bg-gray-950 p-4">
  <a href="/" class="flex items-center gap-2 px-2 text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
    <span class="grid h-7 w-7 place-items-center rounded-md bg-indigo-500 text-sm text-white" aria-hidden="true">A</span>
    Adysre
  </a>
  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a href="/dashboard" aria-current="page" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 aria-[current=page]:bg-gray-800 aria-[current=page]:text-white">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href="/projects" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
          Projects
        </a>
      </li>
      <li>
        <a href="/team" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5"/><path d="M18 20a6 6 0 0 0-2-4.5"/></svg>
          Team
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>), current: true },
  { href: '/projects', label: 'Projects', icon: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /> },
  { href: '/team', label: 'Team', icon: (<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export function SidebarDarkTheme({ items = ITEMS, title = 'Adysre', ariaLabel = 'Sidebar' }) {
  return (
    <aside className="flex w-64 flex-col gap-4 bg-gray-950 p-4">
      <a href="/" className="flex items-center gap-2 px-2 text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-indigo-500 text-sm text-white" aria-hidden="true">A</span>
        {title}
      </a>
      <nav aria-label={ariaLabel}>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 aria-[current=page]:bg-gray-800 aria-[current=page]:text-white"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  {item.icon}
                </svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarDarkThemeProps {
  items: SidebarItem[];
  /** Current route. Compared against item.href to mark aria-current. */
  pathname: string;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export function SidebarDarkTheme({
  items,
  pathname,
  title = 'Adysre',
  ariaLabel = 'Sidebar',
  className = '',
}: SidebarDarkThemeProps): JSX.Element {
  return (
    <aside className={\`flex w-64 flex-col gap-4 bg-gray-950 p-4 \${className}\`}>
      <a href="/" className="flex items-center gap-2 px-2 text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-indigo-500 text-sm text-white" aria-hidden="true">A</span>
        {title}
      </a>
      <nav aria-label={ariaLabel}>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 aria-[current=page]:bg-gray-800 aria-[current=page]:text-white"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-search-nav',
    category: 'sidebars',
    tags: ['sidebar', 'search', 'filter', 'navigation', 'client'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'searchLabel', type: 'string', default: "'Filter navigation'", descriptionKey: 'searchLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<aside class="flex w-64 flex-col gap-3 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="relative">
    <svg class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    <!-- No visible label, so the field carries its own aria-label. -->
    <input type="search" aria-label="Filter navigation" placeholder="Search..." class="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>
  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a href="/dashboard" aria-current="page" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </a>
      </li>
      <!-- Filter these client-side by label; render "No matches" when empty. -->
    </ul>
  </nav>
</aside>`,
      react: `import { useState } from 'react';

const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>), current: true },
  { href: '/projects', label: 'Projects', icon: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /> },
  { href: '/reports', label: 'Reports', icon: (<><path d="M3 3v18h18" /><path d="M7 15l3-4 3 2 4-6" /></>) },
  { href: '/team', label: 'Team', icon: (<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export function SidebarSearchNav({ items = ITEMS, searchLabel = 'Filter navigation' }) {
  const [query, setQuery] = useState('');
  const shown = items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <aside className="flex w-64 flex-col gap-3 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
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
                aria-current={item.current ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{item.icon}</svg>
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
}`,
      typescript: `'use client';

import { useState, type ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarSearchNavProps {
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
}: SidebarSearchNavProps): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const shown = items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <aside className={\`flex w-64 flex-col gap-3 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
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
}`,
    },
  },
  {
    slug: 'sidebar-with-footer-user',
    category: 'sidebars',
    tags: ['sidebar', 'footer', 'user', 'profile', 'account'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'user', type: 'SidebarUser', required: true, descriptionKey: 'user' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<aside class="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav aria-label="Sidebar" class="flex-1 overflow-y-auto p-4">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a href="/dashboard" aria-current="page" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </a>
      </li>
    </ul>
  </nav>
  <!-- Footer pinned by flex, not absolute, so it never overlaps the last nav item. -->
  <div class="border-t border-gray-200 p-3 dark:border-gray-800">
    <a href="/account" class="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800">
      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white" aria-hidden="true">AK</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Ada Kesh</span>
        <span class="block truncate text-xs text-gray-500 dark:text-gray-400">ada@adysre.com</span>
      </span>
    </a>
  </div>
</aside>`,
      react: `const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>), current: true },
  { href: '/projects', label: 'Projects', icon: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /> },
];

const USER = { name: 'Ada Kesh', email: 'ada@adysre.com', initials: 'AK', href: '/account' };

export function SidebarWithFooterUser({ items = ITEMS, user = USER }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav aria-label="Sidebar" className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{item.icon}</svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <a href={user.href} className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white" aria-hidden="true">{user.initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
          </span>
        </a>
      </div>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarUser {
  name: string;
  email: string;
  initials: string;
  href: string;
}

export interface SidebarWithFooterUserProps {
  items: SidebarItem[];
  pathname: string;
  user: SidebarUser;
  className?: string;
}

export function SidebarWithFooterUser({
  items,
  pathname,
  user,
  className = '',
}: SidebarWithFooterUserProps): JSX.Element {
  return (
    <aside className={\`flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <nav aria-label="Sidebar" className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
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
        </ul>
      </nav>
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <a href={user.href} className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white" aria-hidden="true">{user.initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
          </span>
        </a>
      </div>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-badges-counts',
    category: 'sidebars',
    tags: ['sidebar', 'badges', 'counts', 'notifications', 'navigation'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'BadgeItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/inbox'" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<aside class="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a href="/inbox" aria-current="page" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 12h5l2 3h4l2-3h5"/><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>
          <span class="flex-1">Inbox</span>
          <!-- The count pairs a number with a screen-reader context word, so it is not meaning-by-colour. -->
          <span class="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white">12<span class="sr-only"> unread</span></span>
        </a>
      </li>
      <li>
        <a href="/tasks" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>
          <span class="flex-1">Tasks</span>
          <span class="rounded-full border border-gray-300 px-1.5 py-0.5 text-xs font-semibold text-gray-600 dark:border-gray-600 dark:text-gray-300">3<span class="sr-only"> due</span></span>
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `const ITEMS = [
  { href: '/inbox', label: 'Inbox', icon: (<><path d="M3 12h5l2 3h4l2-3h5" /><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /></>), count: 12, countLabel: 'unread', current: true },
  { href: '/tasks', label: 'Tasks', icon: <path d="M20 6 9 17l-5-5" />, count: 3, countLabel: 'due' },
  { href: '/team', label: 'Team', icon: (<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export function SidebarBadgesCounts({ items = ITEMS }) {
  return (
    <aside className="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{item.icon}</svg>
                <span className="flex-1">{item.label}</span>
                {item.count ? (
                  <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {item.count}
                    <span className="sr-only"> {item.countLabel}</span>
                  </span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface BadgeItem {
  href: string;
  label: string;
  icon: ReactNode;
  /** Numeric badge value. Omit for no badge. */
  count?: number;
  /** Screen-reader word pairing the count with meaning, e.g. 'unread'. */
  countLabel?: string;
  current?: boolean;
}

export interface SidebarBadgesCountsProps {
  items: BadgeItem[];
  pathname: string;
  className?: string;
}

export function SidebarBadgesCounts({
  items,
  pathname,
  className = '',
}: SidebarBadgesCountsProps): JSX.Element {
  return (
    <aside className={\`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined ? (
                  <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {item.count}
                    {item.countLabel ? <span className="sr-only"> {item.countLabel}</span> : null}
                  </span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-workspace-switcher',
    category: 'sidebars',
    tags: ['sidebar', 'workspace', 'switcher', 'dropdown', 'menu'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'workspaces', type: 'Workspace[]', required: true, descriptionKey: 'workspaces' },
      { name: 'currentId', type: 'string', required: true, descriptionKey: 'currentId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Toggle open state on the button (aria-expanded) and show/hide the menu it controls. -->
<aside class="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="relative">
    <button type="button" aria-expanded="false" aria-controls="ws-menu" aria-haspopup="menu" class="flex w-full items-center gap-2.5 rounded-md border border-gray-200 p-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:hover:bg-gray-800">
      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-indigo-500 text-sm font-semibold text-white" aria-hidden="true">A</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Acme Inc</span>
        <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Free plan</span>
      </span>
      <svg class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>
    </button>
    <ul id="ws-menu" role="menu" hidden class="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <li role="none"><button role="menuitemradio" aria-checked="true" type="button" class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700">Acme Inc</button></li>
      <li role="none"><button role="menuitemradio" aria-checked="false" type="button" class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700">Globex</button></li>
    </ul>
  </div>
  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li><a href="/dashboard" aria-current="page" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">Dashboard</a></li>
    </ul>
  </nav>
</aside>`,
      react: `import { useState } from 'react';

const WORKSPACES = [
  { id: 'acme', name: 'Acme Inc', plan: 'Free plan', initial: 'A' },
  { id: 'globex', name: 'Globex', plan: 'Pro plan', initial: 'G' },
];
const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', current: true },
  { href: '/projects', label: 'Projects' },
];

export function SidebarWorkspaceSwitcher({ items = ITEMS, workspaces = WORKSPACES }) {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(workspaces[0].id);
  const current = workspaces.find((w) => w.id === currentId) ?? workspaces[0];

  return (
    <aside className="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="ws-menu"
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-md border border-gray-200 p-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-indigo-500 text-sm font-semibold text-white" aria-hidden="true">{current.initial}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{current.name}</span>
            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{current.plan}</span>
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
                  aria-checked={w.id === currentId}
                  onClick={() => { setCurrentId(w.id); setOpen(false); }}
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
              <a href={item.href} aria-current={item.current ? 'page' : undefined} className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  initial: string;
}

export interface SidebarWorkspaceSwitcherProps {
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
}: SidebarWorkspaceSwitcherProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(currentId);
  const current = workspaces.find((w) => w.id === selected) ?? workspaces[0];

  return (
    <aside className={\`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
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
}`,
    },
  },
  {
    slug: 'sidebar-two-level',
    category: 'sidebars',
    tags: ['sidebar', 'two-level', 'nested', 'navigation', 'hierarchy'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'sections', type: 'NavSection[]', required: true, descriptionKey: 'sections' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/settings/team'" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Two visible levels: a parent link, then its children always shown and indented by a border guide. -->
<aside class="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-3">
      <li>
        <a href="/settings" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>
          Settings
        </a>
        <ul class="mt-1 ml-5 flex flex-col gap-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
          <li><a href="/settings/general" class="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:font-medium aria-[current=page]:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:aria-[current=page]:text-blue-300">General</a></li>
          <li><a href="/settings/team" aria-current="page" class="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:font-medium aria-[current=page]:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:aria-[current=page]:text-blue-300">Team</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `const SECTIONS = [
  {
    href: '/settings', label: 'Settings',
    icon: (<><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></>),
    children: [
      { href: '/settings/general', label: 'General' },
      { href: '/settings/team', label: 'Team', current: true },
      { href: '/settings/billing', label: 'Billing' },
    ],
  },
];

export function SidebarTwoLevel({ sections = SECTIONS }) {
  return (
    <aside className="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-3">
          {sections.map((section) => (
            <li key={section.href}>
              <a href={section.href} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800">
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{section.icon}</svg>
                {section.label}
              </a>
              <ul className="mt-1 ml-5 flex flex-col gap-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
                {section.children.map((child) => (
                  <li key={child.href}>
                    <a href={child.href} aria-current={child.current ? 'page' : undefined} className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:font-medium aria-[current=page]:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:aria-[current=page]:text-blue-300">
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface NavChild {
  href: string;
  label: string;
  current?: boolean;
}

export interface NavSection {
  href: string;
  label: string;
  icon: ReactNode;
  children: NavChild[];
}

export interface SidebarTwoLevelProps {
  sections: NavSection[];
  pathname: string;
  className?: string;
}

export function SidebarTwoLevel({
  sections,
  pathname,
  className = '',
}: SidebarTwoLevelProps): JSX.Element {
  return (
    <aside className={\`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-3">
          {sections.map((section) => (
            <li key={section.href}>
              <a href={section.href} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800">
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">{section.icon}</span>
                {section.label}
              </a>
              <ul className="mt-1 ml-5 flex flex-col gap-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
                {section.children.map((child) => (
                  <li key={child.href}>
                    <a href={child.href} aria-current={pathname === child.href ? 'page' : undefined} className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:font-medium aria-[current=page]:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:aria-[current=page]:text-blue-300">
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-floating-card',
    category: 'sidebars',
    tags: ['sidebar', 'floating', 'card', 'rounded', 'elevated'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'title', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- A detached card floating in a padded gutter rather than a full-height flush column. -->
<aside class="m-4 flex w-60 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20">
  <span class="px-2 text-base font-bold text-gray-900 dark:text-gray-50">Adysre</span>
  <nav aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a href="/dashboard" aria-current="page" class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href="/projects" class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
          Projects
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>), current: true },
  { href: '/projects', label: 'Projects', icon: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /> },
];

export function SidebarFloatingCard({ items = ITEMS, title = 'Adysre' }) {
  return (
    <aside className="m-4 flex w-60 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20">
      <span className="px-2 text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{item.icon}</svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarFloatingCardProps {
  items: SidebarItem[];
  pathname: string;
  title?: string;
  className?: string;
}

export function SidebarFloatingCard({
  items,
  pathname,
  title = 'Adysre',
  className = '',
}: SidebarFloatingCardProps): JSX.Element {
  return (
    <aside className={\`m-4 flex w-60 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 \${className}\`}>
      <span className="px-2 text-base font-bold text-gray-900 dark:text-gray-50">{title}</span>
      <nav aria-label="Sidebar">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-gradient-brand',
    category: 'sidebars',
    tags: ['sidebar', 'gradient', 'brand', 'header', 'navigation'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'title', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', default: "'Workspace'", descriptionKey: 'subtitle' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<aside class="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white pb-4 dark:border-gray-800 dark:bg-gray-900">
  <!-- White text sits on a fixed dark gradient, so contrast holds regardless of theme. -->
  <div class="bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-4 text-white">
    <span class="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-lg font-bold" aria-hidden="true">A</span>
    <p class="mt-3 text-base font-bold">Adysre</p>
    <p class="text-sm text-white/80">Workspace</p>
  </div>
  <nav aria-label="Sidebar" class="px-4">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a href="/dashboard" aria-current="page" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-indigo-950 dark:aria-[current=page]:text-indigo-200">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>), current: true },
  { href: '/projects', label: 'Projects', icon: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /> },
];

export function SidebarGradientBrand({ items = ITEMS, title = 'Adysre', subtitle = 'Workspace' }) {
  return (
    <aside className="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white pb-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-4 text-white">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-lg font-bold" aria-hidden="true">{title.charAt(0)}</span>
        <p className="mt-3 text-base font-bold">{title}</p>
        <p className="text-sm text-white/80">{subtitle}</p>
      </div>
      <nav aria-label="Sidebar" className="px-4">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-indigo-950 dark:aria-[current=page]:text-indigo-200"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{item.icon}</svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarGradientBrandProps {
  items: SidebarItem[];
  pathname: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function SidebarGradientBrand({
  items,
  pathname,
  title = 'Adysre',
  subtitle = 'Workspace',
  className = '',
}: SidebarGradientBrandProps): JSX.Element {
  return (
    <aside className={\`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white pb-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-4 text-white">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-lg font-bold" aria-hidden="true">{title.charAt(0)}</span>
        <p className="mt-3 text-base font-bold">{title}</p>
        <p className="text-sm text-white/80">{subtitle}</p>
      </div>
      <nav aria-label="Sidebar" className="px-4">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-indigo-950 dark:aria-[current=page]:text-indigo-200"
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0" aria-hidden="true">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'sidebar-mini-expandable',
    category: 'sidebars',
    tags: ['sidebar', 'mini', 'expandable', 'rail', 'toggle'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'items', type: 'SidebarItem[]', required: true, descriptionKey: 'items' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'defaultExpanded', type: 'boolean', default: 'false', descriptionKey: 'defaultExpanded' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Starts as a mini rail; the toggle expands it. Labels hide with invisible+opacity so they leave the a11y tree too. -->
<aside data-expanded="false" class="group flex w-16 flex-col gap-2 overflow-hidden border-r border-gray-200 bg-white p-2 transition-[width] duration-200 data-[expanded=true]:w-64 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900">
  <button type="button" aria-expanded="false" aria-controls="mini-nav" aria-label="Expand sidebar" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
  </button>
  <nav id="mini-nav" aria-label="Sidebar">
    <ul class="flex flex-col gap-0.5">
      <li>
        <a href="/dashboard" aria-current="page" class="flex items-center gap-2.5 rounded-md p-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          <span class="whitespace-nowrap transition-opacity duration-200 group-data-[expanded=false]:invisible group-data-[expanded=false]:opacity-0 motion-reduce:transition-none">Dashboard</span>
        </a>
      </li>
    </ul>
  </nav>
</aside>`,
      react: `import { useState } from 'react';

const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>), current: true },
  { href: '/projects', label: 'Projects', icon: <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /> },
  { href: '/team', label: 'Team', icon: (<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export function SidebarMiniExpandable({ items = ITEMS, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <aside
      data-expanded={expanded}
      className="group flex flex-col gap-2 overflow-hidden border-r border-gray-200 bg-white p-2 transition-[width] duration-200 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900"
      style={{ width: expanded ? '16rem' : '4rem' }}
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
                aria-current={item.current ? 'page' : undefined}
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
}`,
      typescript: `'use client';

import { useState, type ReactNode } from 'react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarMiniExpandableProps {
  items: SidebarItem[];
  pathname: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function SidebarMiniExpandable({
  items,
  pathname,
  defaultExpanded = false,
  className = '',
}: SidebarMiniExpandableProps): JSX.Element {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <aside
      data-expanded={expanded}
      style={{ width: expanded ? '16rem' : '4rem' }}
      className={\`group flex flex-col gap-2 overflow-hidden border-r border-gray-200 bg-white p-2 transition-[width] duration-200 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 \${className}\`}
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
}`,
    },
  },
  {
    slug: 'sidebar-sections-labeled',
    category: 'sidebars',
    tags: ['sidebar', 'sections', 'groups', 'labels', 'navigation'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'sections', type: 'LabeledSection[]', required: true, descriptionKey: 'sections' },
      { name: 'pathname', type: 'string', required: true, descriptionKey: 'pathname', example: "'/dashboard'" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<aside class="flex w-64 flex-col gap-5 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <!-- Each group's <ul> is tied to its heading via aria-labelledby, so the label is a real group name, not just styled text. -->
  <nav aria-label="Sidebar">
    <p id="grp-main" class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Main</p>
    <ul aria-labelledby="grp-main" class="flex flex-col gap-0.5">
      <li><a href="/dashboard" aria-current="page" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200">Dashboard</a></li>
      <li><a href="/projects" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800">Projects</a></li>
    </ul>
  </nav>
  <nav aria-label="Account">
    <p id="grp-account" class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Account</p>
    <ul aria-labelledby="grp-account" class="flex flex-col gap-0.5">
      <li><a href="/billing" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800">Billing</a></li>
    </ul>
  </nav>
</aside>`,
      react: `const SECTIONS = [
  { id: 'main', label: 'Main', items: [
    { href: '/dashboard', label: 'Dashboard', current: true },
    { href: '/projects', label: 'Projects' },
  ] },
  { id: 'account', label: 'Account', items: [
    { href: '/billing', label: 'Billing' },
    { href: '/settings', label: 'Settings' },
  ] },
];

export function SidebarSectionsLabeled({ sections = SECTIONS }) {
  return (
    <aside className="flex w-64 flex-col gap-5 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      {sections.map((section) => (
        <nav key={section.id} aria-label={section.label}>
          <p id={\`grp-\${section.id}\`} className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {section.label}
          </p>
          <ul aria-labelledby={\`grp-\${section.id}\`} className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </aside>
  );
}`,
      typescript: `export interface LabeledItem {
  href: string;
  label: string;
  current?: boolean;
}

export interface LabeledSection {
  id: string;
  label: string;
  items: LabeledItem[];
}

export interface SidebarSectionsLabeledProps {
  sections: LabeledSection[];
  pathname: string;
  className?: string;
}

export function SidebarSectionsLabeled({
  sections,
  pathname,
  className = '',
}: SidebarSectionsLabeledProps): JSX.Element {
  return (
    <aside className={\`flex w-64 flex-col gap-5 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      {sections.map((section) => (
        <nav key={section.id} aria-label={section.label}>
          <p id={\`grp-\${section.id}\`} className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {section.label}
          </p>
          <ul aria-labelledby={\`grp-\${section.id}\`} className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </aside>
  );
}`,
    },
  },
];
