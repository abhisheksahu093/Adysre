/**
 * Live preview for `sidebar-with-footer-user`.
 *
 * Mirrors the `typescript` code variant. Footer is pinned by flex, not
 * absolute. Keep in step with `src/data/components/sidebars.ts`.
 */
import type { ReactNode } from 'react';

interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarUser {
  name: string;
  email: string;
  initials: string;
  href: string;
}

interface SidebarWithFooterUserProps {
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
}: SidebarWithFooterUserProps) {
  return (
    <aside className={`flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
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
}

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);

const ITEMS: SidebarItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>) },
  { href: '/projects', label: 'Projects', icon: svg(<path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />) },
  { href: '/team', label: 'Team', icon: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

const USER: SidebarUser = { name: 'Ada Kesh', email: 'ada@adysre.com', initials: 'AK', href: '/account' };

export const minHeight = 320;

export default function SidebarWithFooterUserPreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarWithFooterUser items={ITEMS} pathname="/dashboard" user={USER} />
    </div>
  );
}
