'use client';

/**
 * Live preview for `footer-minimal-floating`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/footer.ts`.
 */
interface FooterLink {
  href: string;
  label: string;
}

const LINKS: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

function FooterMinimalFloating({ brand = 'Adysre', links = LINKS }: { brand?: string; links?: readonly FooterLink[] }) {
  const year = new Date().getFullYear();

  return (
    <div className="px-4 pb-4">
      <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:justify-between dark:border-gray-800 dark:bg-gray-900">
        <a
          href="#"
          className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          {brand}
        </a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> {brand} Inc.
        </p>
      </footer>
    </div>
  );
}

export default function FooterMinimalFloatingPreview() {
  return <FooterMinimalFloating />;
}
