/**
 * Live preview for `sidebar-gradient-brand`.
 *
 * Mirrors the `typescript` code variant. White text over a fixed gradient
 * header. Keep in step with `src/data/components/sidebars.ts`.
 */
import type { ReactNode } from 'react';

interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarGradientBrandProps {
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
}: SidebarGradientBrandProps) {
  return (
    <aside className={`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white pb-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
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
}

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);

const ITEMS: SidebarItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>) },
  { href: '/projects', label: 'Projects', icon: svg(<path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />) },
  { href: '/team', label: 'Team', icon: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5" /><path d="M18 20a6 6 0 0 0-2-4.5" /></>) },
];

export const minHeight = 320;

export default function SidebarGradientBrandPreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarGradientBrand items={ITEMS} pathname="/dashboard" />
    </div>
  );
}
