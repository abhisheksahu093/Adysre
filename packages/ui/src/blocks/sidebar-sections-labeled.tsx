/**
 * Live preview for `sidebar-sections-labeled`.
 *
 * Mirrors the `typescript` code variant. Each group's list is tied to its
 * heading via aria-labelledby. Keep in step with `src/data/components/sidebars.ts`.
 */
interface LabeledItem {
  href: string;
  label: string;
}

interface LabeledSection {
  id: string;
  label: string;
  items: LabeledItem[];
}

interface SidebarSectionsLabeledProps {
  sections: LabeledSection[];
  pathname: string;
  className?: string;
}

export function SidebarSectionsLabeled({
  sections,
  pathname,
  className = '',
}: SidebarSectionsLabeledProps) {
  return (
    <aside className={`flex w-64 flex-col gap-5 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {sections.map((section) => (
        <nav key={section.id} aria-label={section.label}>
          <p id={`grp-${section.id}`} className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {section.label}
          </p>
          <ul aria-labelledby={`grp-${section.id}`} className="flex flex-col gap-0.5">
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
}

const SECTIONS: LabeledSection[] = [
  { id: 'main', label: 'Main', items: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/reports', label: 'Reports' },
  ] },
  { id: 'account', label: 'Account', items: [
    { href: '/billing', label: 'Billing' },
    { href: '/settings', label: 'Settings' },
  ] },
];

export const minHeight = 340;

export default function SidebarSectionsLabeledPreview() {
  return (
    <div className="flex justify-center p-4">
      <SidebarSectionsLabeled sections={SECTIONS} pathname="/dashboard" />
    </div>
  );
}
