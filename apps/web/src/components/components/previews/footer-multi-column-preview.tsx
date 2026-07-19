'use client';

/**
 * Live preview for `footer-multi-column`.
 *
 * Mirrors the `typescript` code variant, trimmed to three links per column so
 * the sitemap fits the preview stage without scrolling - the shipped entry
 * carries four. Keep this in step with `src/data/components/footer.ts`.
 */
interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  heading: string;
  links: readonly FooterLink[];
}

const COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/docs', label: 'Docs' },
      { href: '/support', label: 'Support' },
      { href: '/status', label: 'Status' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/security', label: 'Security' },
    ],
  },
];

const COPY = 'The operating system for modern teams. Plan, build and ship without the busywork.';

function FooterMultiColumn() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-12 md:grid-cols-[1fr_2fr] md:gap-12">
        <div>
          <a
            href="#"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {COPY}
          </p>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href="#"
                        className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>
      </div>
    </footer>
  );
}

export default function FooterMultiColumnPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterMultiColumn />
    </div>
  );
}
