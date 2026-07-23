/**
 * Live preview for `sidebar-badges-counts`.
 *
 * Mirrors the `typescript` code variant. Each badge pairs its number with an
 * sr-only context word. Keep in step with `src/data/components/sidebars.ts`.
 */
import type { ReactNode } from 'react';

interface BadgeItem {
  href: string;
  label: string;
  icon: ReactNode;
  count?: number;
  countLabel?: string;
}

interface SidebarBadgesCountsProps {
  items: BadgeItem[];
  pathname: string;
  className?: string;
}

export function SidebarBadgesCounts({
  items,
  pathname,
  className = '',
}: SidebarBadgesCountsProps) {
  return (
    <aside className={`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
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
}

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);

const ITEMS: BadgeItem[] = [
  { href: '/inbox', label: 'Inbox', icon: svg(<><path d="M3 12h5l2 3h4l2-3h5" /><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /></>), count: 12, countLabel: 'unread' },
  { href: '/tasks', label: 'Tasks', icon: svg(<path d="M20 6 9 17l-5-5" />), count: 3, countLabel: 'due' },
  { href: '/team', label: 'Team', icon: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export const minHeight = 240;

export default function SidebarBadgesCountsPreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarBadgesCounts items={ITEMS} pathname="/inbox" />
    </div>
  );
}
