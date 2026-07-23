'use client';

/**
 * Live preview for `footer-stats-strip`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/footer.ts`.
 */
interface Stat {
  value: string;
  label: string;
}

interface FooterLink {
  href: string;
  label: string;
}

const STATS: readonly Stat[] = [
  { value: '12,000+', label: 'Teams onboard' },
  { value: '99.99%', label: 'Uptime' },
  { value: '140+', label: 'Countries' },
  { value: '24/7', label: 'Support' },
];

const LINKS: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/customers', label: 'Customers' },
  { href: '/pricing', label: 'Pricing' },
];

export function FooterStatsStrip({ stats = STATS }: { stats?: readonly Stat[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse text-center sm:text-left">
              <dt className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-gray-200 pt-6 md:flex-row md:justify-between dark:border-gray-800">
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
      </div>
    </footer>
  );
}

export const minHeight = 380;

export default function FooterStatsStripPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterStatsStrip />
    </div>
  );
}
