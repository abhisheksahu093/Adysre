'use client';

/**
 * Live preview for `footer-app-badges`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/footer.ts`.
 */
interface StoreBadgeProps {
  href: string;
  glyph: string;
  kicker: string;
  store: string;
}

interface FooterLink {
  href: string;
  label: string;
}

const APPLE_PATH =
  'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z';
const PLAY_PATH =
  'M4 2.5v19a.5.5 0 0 0 .76.43l16.02-9.5a.5.5 0 0 0 0-.86L4.76 2.07A.5.5 0 0 0 4 2.5Z';

const LINKS: readonly FooterLink[] = [
  { href: '/support', label: 'Support' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

function StoreBadge({ href, glyph, kicker, store }: StoreBadgeProps) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d={glyph} />
      </svg>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[0.6875rem]">{kicker}</span>
        <span className="text-sm font-semibold">{store}</span>
      </span>
    </a>
  );
}

export function FooterAppBadges({ appStoreHref = '#', playStoreHref = '#' }: { appStoreHref?: string; playStoreHref?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center">
        <div>
          <a
            href="#"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Take your work with you.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <StoreBadge href={appStoreHref} glyph={APPLE_PATH} kicker="Download on the" store="App Store" />
          <StoreBadge href={playStoreHref} glyph={PLAY_PATH} kicker="Get it on" store="Google Play" />
        </div>

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

export const minHeight = 340;

export default function FooterAppBadgesPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterAppBadges />
    </div>
  );
}
