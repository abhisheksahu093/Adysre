/**
 * Live preview for `sidebar-dark-theme`.
 *
 * Mirrors the `typescript` code variant. Committed-dark shell, so no `dark:`
 * toggle is needed. Keep in step with `src/data/components/sidebars.ts`.
 */
import type { ReactNode } from 'react';

interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarDarkThemeProps {
  items: SidebarItem[];
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
}: SidebarDarkThemeProps) {
  return (
    <aside className={`flex w-64 flex-col gap-4 bg-gray-950 p-4 ${className}`}>
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
}

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);

const ITEMS: SidebarItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>) },
  { href: '/projects', label: 'Projects', icon: svg(<path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />) },
  { href: '/team', label: 'Team', icon: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export const minHeight = 280;

export default function SidebarDarkThemePreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarDarkTheme items={ITEMS} pathname="/dashboard" />
    </div>
  );
}
