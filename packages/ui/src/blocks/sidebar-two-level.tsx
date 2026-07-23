/**
 * Live preview for `sidebar-two-level`.
 *
 * Mirrors the `typescript` code variant. Both levels always visible.
 * Keep in step with `src/data/components/sidebars.ts`.
 */
import type { ReactNode } from 'react';

interface NavChild {
  href: string;
  label: string;
}

interface NavSection {
  href: string;
  label: string;
  icon: ReactNode;
  children: NavChild[];
}

interface SidebarTwoLevelProps {
  sections: NavSection[];
  pathname: string;
  className?: string;
}

export function SidebarTwoLevel({
  sections,
  pathname,
  className = '',
}: SidebarTwoLevelProps) {
  return (
    <aside className={`flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
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
}

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);

const SECTIONS: NavSection[] = [
  {
    href: '/settings', label: 'Settings',
    icon: svg(<><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></>),
    children: [
      { href: '/settings/general', label: 'General' },
      { href: '/settings/team', label: 'Team' },
      { href: '/settings/billing', label: 'Billing' },
    ],
  },
];

export const minHeight = 260;

export default function SidebarTwoLevelPreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarTwoLevel sections={SECTIONS} pathname="/settings/team" />
    </div>
  );
}
