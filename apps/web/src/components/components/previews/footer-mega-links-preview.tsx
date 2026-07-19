'use client';

/**
 * Live preview for `footer-mega-links`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/footer.ts`.
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
      { href: '/integrations', label: 'Integrations' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { href: '/startups', label: 'Startups' },
      { href: '/enterprise', label: 'Enterprise' },
      { href: '/agencies', label: 'Agencies' },
      { href: '/education', label: 'Education' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/docs', label: 'Docs' },
      { href: '/guides', label: 'Guides' },
      { href: '/api', label: 'API reference' },
      { href: '/community', label: 'Community' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
      { href: '/press', label: 'Press' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/security', label: 'Security' },
      { href: '/cookies', label: 'Cookies' },
    ],
  },
];

const COPY = 'One platform for planning, building and shipping product.';

function FooterMegaLinks() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <div className="max-w-sm">
          <a
            href="#"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{COPY}</p>
        </div>

        <nav aria-label="Footer" className="mt-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
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

export const minHeight = 460;

export default function FooterMegaLinksPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterMegaLinks />
    </div>
  );
}
