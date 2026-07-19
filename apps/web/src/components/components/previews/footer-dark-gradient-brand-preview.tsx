'use client';

/**
 * Live preview for `footer-dark-gradient-brand`.
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
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/security', label: 'Security' },
    ],
  },
];

function FooterDarkGradientBrand({
  brand = 'Adysre',
  tagline = 'The operating system for modern teams.',
}: {
  brand?: string;
  tagline?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2fr]">
          <div>
            <a
              href="#"
              className="text-4xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:text-5xl lg:text-6xl"
            >
              {brand}
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">{tagline}</p>
          </div>

          <nav aria-label="Footer">
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
              {COLUMNS.map((column) => (
                <div key={column.heading}>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-400">
                    {column.heading}
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-[0.8125rem] text-gray-400">
            © <time dateTime={String(year)}>{year}</time> {brand} Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

export const minHeight = 420;

export default function FooterDarkGradientBrandPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterDarkGradientBrand />
    </div>
  );
}
