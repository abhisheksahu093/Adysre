'use client';

/**
 * Live preview for `footer-cta-banner`.
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
  { href: '/docs', label: 'Docs' },
  { href: '/privacy', label: 'Privacy' },
];

function FooterCtaBanner({
  ctaTitle = 'Ready to ship faster?',
  ctaCopy = 'Start free, invite the team, and see the difference in a week.',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryLabel = 'Talk to sales',
  secondaryHref = '#',
}: {
  ctaTitle?: string;
  ctaCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <div className="rounded-2xl bg-blue-600 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-blue-100">{ctaCopy}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 sm:w-auto"
            >
              {ctaLabel}
            </a>
            <a
              href={secondaryHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 sm:w-auto"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <a
          href="#"
          className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
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
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>
      </div>
    </footer>
  );
}

export const minHeight = 380;

export default function FooterCtaBannerPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterCtaBanner />
    </div>
  );
}
