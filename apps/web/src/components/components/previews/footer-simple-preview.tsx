'use client';

/**
 * Live preview for `footer-simple`.
 *
 * Mirrors the `typescript` code variant. Stateless in the wild - this preview
 * is a client component only because every preview in this gallery is. Keep it
 * in step with `src/data/components/footer.ts`.
 */
interface FooterLink {
  href: string;
  label: string;
}

const LINKS: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

function FooterSimple() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <a
          href="#"
          className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Adysre
        </a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
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
        </nav>

        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function FooterSimplePreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterSimple />
    </div>
  );
}
