import type { ComponentEntry } from './types';

/**
 * Footer category.
 *
 * Different jobs, not different widths: a one-row footer, sitemaps at two
 * scales, an email capture, a social row, a legal line, a CTA banner, store
 * badges, contact details, locale switchers, a stat strip, a self-painted
 * gradient, a phone accordion and a floating card. Two details recur across
 * all of them. First, a footer's links are a second navigation landmark on the
 * page - `<nav aria-label="Footer">` is what stops a screen reader announcing
 * "navigation, navigation" and leaving the user to guess which is which.
 * Second, no column count survives 320px: every multi-column layout here
 * stacks, wraps or collapses to an accordion before it squeezes.
 */
export const footerComponents: ComponentEntry[] = [
  {
    slug: 'footer-simple',
    category: 'footer',
    tags: ['footer', 'simple', 'links', 'copyright', 'minimal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-03',
    updatedAt: '2026-06-14',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2760, copies: 749, downloads: 186 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  <footer> is a landmark on its own, but the links inside it are navigation and
  need their own <nav aria-label="Footer"> - a page with a main nav and a
  footer nav otherwise announces "navigation, navigation" and the user has to
  enter each one to find out which is which.

  The year is inside <time>, so it is machine-readable rather than a bare
  number that happens to look like a date.
-->
<footer class="footer">
  <div class="footer__inner">
    <a class="footer__brand" href="/">Adysre</a>

    <nav class="footer__nav" aria-label="Footer">
      <ul class="footer__links">
        <li><a class="footer__link" href="/about">About</a></li>
        <li><a class="footer__link" href="/blog">Blog</a></li>
        <li><a class="footer__link" href="/careers">Careers</a></li>
        <li><a class="footer__link" href="/contact">Contact</a></li>
      </ul>
    </nav>

    <p class="footer__copy">© <time datetime="2026">2026</time> Adysre Inc. All rights reserved.</p>
  </div>
</footer>`,
      css: `.footer {
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

.footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.footer__brand {
  font-weight: 700;
  color: #111827;
  text-decoration: none;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer__link {
  color: #374151;
  font-size: 0.875rem;
  text-decoration: none;
}

.footer__link:hover {
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}

.footer__copy {
  margin: 0;
  /* Small print is where contrast quietly fails. #6b7280 on #fff is 4.8:1 -
     over the 4.5:1 line rather than the #9ca3af that usually ends up here. */
  color: #6b7280;
  font-size: 0.8125rem;
}

.footer__brand:focus-visible,
.footer__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Side by side once there is room; stacked and centred below that. */
@media (min-width: 48rem) {
  .footer__inner {
    flex-direction: row;
    justify-content: space-between;
  }
}

/*
 * Everything here is text on the footer's own surface, so all four colours
 * flip. #9ca3af on #111827 is 7.0:1 - the small print stays legible.
 */
@media (prefers-color-scheme: dark) {
  .footer {
    border-top-color: #1f2937;
    background-color: #111827;
  }

  .footer__brand {
    color: #f9fafb;
  }

  .footer__link {
    color: #d1d5db;
  }

  .footer__link:hover {
    color: #f9fafb;
  }

  .footer__copy {
    color: #9ca3af;
  }

  .footer__brand:focus-visible,
  .footer__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
    <a href="/" class="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Adysre
    </a>

    <nav aria-label="Footer">
      <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">About</a></li>
        <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Blog</a></li>
        <li><a href="/careers" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Careers</a></li>
        <li><a href="/contact" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Contact</a></li>
      </ul>
    </nav>

    <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc. All rights reserved.
    </p>
  </div>
</footer>`,
      react: `const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export function FooterSimple() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <a href="/" className="font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      nextjs: `// No 'use client' - a footer is static markup. \`new Date()\` runs on the
// server at render time, which is exactly where you want the year computed.
const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export function FooterSimple() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <a
          href="/"
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
          © <time dateTime={String(year)}>{year}</time> Adysre Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}`,
      typescript: `export interface FooterSimpleProps {
  className?: string;
}

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

export function FooterSimple({ className = '' }: FooterSimpleProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <a
          href="/"
          className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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
          © <time dateTime={String(year)}>{year}</time> Adysre Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}`,
    },
  },
  {
    slug: 'footer-multi-column',
    category: 'footer',
    tags: ['footer', 'columns', 'sitemap', 'grid', 'links'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-27',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 3410, copies: 972, downloads: 264 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Four columns of links plus a brand blurb. Each column is a real <h2> over a
  <ul>, not a styled <div> over a stack of <a>s - the headings are how a screen
  reader user skims a sitemap instead of hearing thirty links in a row with no
  idea where one group ends.

  The whole grid lives in one <nav aria-label="Footer">: it is one navigation
  region with four groups, not four separate navigations.
-->
<footer class="footcols">
  <div class="footcols__inner">
    <div class="footcols__brand-block">
      <a class="footcols__brand" href="/">Adysre</a>
      <p class="footcols__blurb">The operating system for modern teams. Plan, build and ship without the busywork.</p>
    </div>

    <nav class="footcols__nav" aria-label="Footer">
      <div class="footcols__grid">
        <div class="footcols__col">
          <h2 class="footcols__heading">Product</h2>
          <ul class="footcols__list">
            <li><a class="footcols__link" href="/features">Features</a></li>
            <li><a class="footcols__link" href="/integrations">Integrations</a></li>
            <li><a class="footcols__link" href="/pricing">Pricing</a></li>
            <li><a class="footcols__link" href="/changelog">Changelog</a></li>
          </ul>
        </div>

        <div class="footcols__col">
          <h2 class="footcols__heading">Company</h2>
          <ul class="footcols__list">
            <li><a class="footcols__link" href="/about">About</a></li>
            <li><a class="footcols__link" href="/careers">Careers</a></li>
            <li><a class="footcols__link" href="/blog">Blog</a></li>
            <li><a class="footcols__link" href="/press">Press</a></li>
          </ul>
        </div>

        <div class="footcols__col">
          <h2 class="footcols__heading">Resources</h2>
          <ul class="footcols__list">
            <li><a class="footcols__link" href="/docs">Docs</a></li>
            <li><a class="footcols__link" href="/guides">Guides</a></li>
            <li><a class="footcols__link" href="/support">Support</a></li>
            <li><a class="footcols__link" href="/status">Status</a></li>
          </ul>
        </div>

        <div class="footcols__col">
          <h2 class="footcols__heading">Legal</h2>
          <ul class="footcols__list">
            <li><a class="footcols__link" href="/privacy">Privacy</a></li>
            <li><a class="footcols__link" href="/terms">Terms</a></li>
            <li><a class="footcols__link" href="/security">Security</a></li>
            <li><a class="footcols__link" href="/cookies">Cookies</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="footcols__bar">
    <p class="footcols__copy">© <time datetime="2026">2026</time> Adysre Inc.</p>
  </div>
</footer>`,
      css: `.footcols {
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

.footcols__inner {
  display: grid;
  gap: 2rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem 2rem;
}

.footcols__brand {
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
  text-decoration: none;
}

.footcols__blurb {
  max-width: 22rem;
  margin: 0.5rem 0 0;
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.6;
}

/*
 * Two columns on a phone, four once there is room. auto-fit + minmax would
 * collapse the four groups to unpredictable counts mid-range; a sitemap reads
 * better with a deliberate 2 -> 4 step.
 */
.footcols__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 1.5rem;
}

.footcols__heading {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7280;
}

.footcols__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footcols__link {
  color: #374151;
  font-size: 0.875rem;
  text-decoration: none;
}

.footcols__link:hover {
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}

.footcols__bar {
  border-top: 1px solid #e5e7eb;
}

.footcols__copy {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.8125rem;
}

.footcols__brand:focus-visible,
.footcols__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (min-width: 48rem) {
  .footcols__inner {
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
  }

  .footcols__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (prefers-color-scheme: dark) {
  .footcols {
    border-top-color: #1f2937;
    background-color: #111827;
  }

  .footcols__brand {
    color: #f9fafb;
  }

  .footcols__blurb {
    color: #9ca3af;
  }

  .footcols__heading {
    color: #9ca3af;
  }

  .footcols__link {
    color: #d1d5db;
  }

  .footcols__link:hover {
    color: #f9fafb;
  }

  .footcols__bar {
    border-top-color: #1f2937;
  }

  .footcols__copy {
    color: #9ca3af;
  }

  .footcols__brand:focus-visible,
  .footcols__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-12 md:grid-cols-[1fr_2fr] md:gap-12">
    <div>
      <a href="/" class="text-lg font-bold text-gray-900 dark:text-gray-50">Adysre</a>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        The operating system for modern teams. Plan, build and ship without the busywork.
      </p>
    </div>

    <nav aria-label="Footer">
      <div class="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Product</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/features" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Features</a></li>
            <li><a href="/integrations" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Integrations</a></li>
            <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
            <li><a href="/changelog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Company</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">About</a></li>
            <li><a href="/careers" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Careers</a></li>
            <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Blog</a></li>
            <li><a href="/press" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Press</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Resources</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/docs" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Docs</a></li>
            <li><a href="/guides" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Guides</a></li>
            <li><a href="/support" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Support</a></li>
            <li><a href="/status" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Status</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Legal</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
            <li><a href="/terms" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Terms</a></li>
            <li><a href="/security" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Security</a></li>
            <li><a href="/cookies" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Cookies</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="border-t border-gray-200 dark:border-gray-800">
    <p class="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const COLUMNS = [
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
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
      { href: '/press', label: 'Press' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/docs', label: 'Docs' },
      { href: '/guides', label: 'Guides' },
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
      { href: '/cookies', label: 'Cookies' },
    ],
  },
];

export function FooterMultiColumn({ copy }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-12 md:grid-cols-[1fr_2fr] md:gap-12">
        <div>
          <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-50">Adysre</a>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy ?? 'The operating system for modern teams. Plan, build and ship without the busywork.'}
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
                        href={link.href}
                        className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      nextjs: `// No 'use client' - nothing here is interactive.
interface FooterMultiColumnProps {
  copy?: string;
}

const COLUMNS = [
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
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
      { href: '/press', label: 'Press' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/docs', label: 'Docs' },
      { href: '/guides', label: 'Guides' },
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
      { href: '/cookies', label: 'Cookies' },
    ],
  },
];

export function FooterMultiColumn({ copy }: FooterMultiColumnProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-12 md:grid-cols-[1fr_2fr] md:gap-12">
        <div>
          <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-50">
            Adysre
          </a>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy ?? 'The operating system for modern teams. Plan, build and ship without the busywork.'}
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
                        href={link.href}
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
}`,
      typescript: `export interface FooterMultiColumnProps {
  /** Brand blurb under the logo. Falls back to the sample copy. */
  copy?: string;
  className?: string;
}

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
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
      { href: '/press', label: 'Press' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/docs', label: 'Docs' },
      { href: '/guides', label: 'Guides' },
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
      { href: '/cookies', label: 'Cookies' },
    ],
  },
];

const DEFAULT_COPY =
  'The operating system for modern teams. Plan, build and ship without the busywork.';

export function FooterMultiColumn({
  copy = DEFAULT_COPY,
  className = '',
}: FooterMultiColumnProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-12 md:grid-cols-[1fr_2fr] md:gap-12">
        <div>
          <a
            href="/"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
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
                        href={link.href}
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
}`,
    },
  },
  {
    slug: 'footer-newsletter',
    category: 'footer',
    tags: ['footer', 'newsletter', 'email', 'form', 'subscribe'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-14',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.1.1',
    stats: { views: 1980, copies: 487, downloads: 121 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Subscribe'", descriptionKey: 'ctaLabel' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  An email capture is a form, and the parts people skip are the ones that make
  it usable:

  - A real <label>. "Email address" as placeholder text vanishes the moment you
    type, so the field loses its name exactly when you need to check it. The
    label is visually hidden here, not absent.
  - type="email" + autocomplete="email" - the phone keyboard and the browser's
    autofill both hang off these.
  - The result goes in an aria-live region. Turning the button green tells a
    sighted user it worked and tells everyone else nothing.
-->
<footer class="footnews">
  <div class="footnews__inner">
    <div class="footnews__pitch">
      <h2 class="footnews__title">Ship better, weekly</h2>
      <p class="footnews__blurb">Product news and engineering notes. One email a week, no filler.</p>

      <form class="footnews__form" novalidate>
        <label class="footnews__label" for="footnews-email">Email address</label>
        <div class="footnews__row">
          <input
            class="footnews__input"
            id="footnews-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="you@company.com"
            required
          />
          <button class="footnews__submit" type="submit">Subscribe</button>
        </div>
        <p class="footnews__status" role="status" aria-live="polite"></p>
      </form>
    </div>

    <nav class="footnews__nav" aria-label="Footer">
      <div class="footnews__cols">
        <div>
          <h2 class="footnews__heading">Product</h2>
          <ul class="footnews__list">
            <li><a class="footnews__link" href="/features">Features</a></li>
            <li><a class="footnews__link" href="/pricing">Pricing</a></li>
            <li><a class="footnews__link" href="/changelog">Changelog</a></li>
          </ul>
        </div>
        <div>
          <h2 class="footnews__heading">Company</h2>
          <ul class="footnews__list">
            <li><a class="footnews__link" href="/about">About</a></li>
            <li><a class="footnews__link" href="/blog">Blog</a></li>
            <li><a class="footnews__link" href="/careers">Careers</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="footnews__bar">
    <p class="footnews__copy">© <time datetime="2026">2026</time> Adysre Inc.</p>
  </div>
</footer>

<script>
  document.querySelectorAll('.footnews__form').forEach(function (form) {
    var input = form.querySelector('.footnews__input');
    var status = form.querySelector('.footnews__status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // novalidate turns off the browser bubble so the message lands in the
      // live region instead - one channel, announced, styled like the page.
      if (!input.checkValidity()) {
        status.textContent = 'Enter a valid email address.';
        status.dataset.state = 'error';
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      status.textContent = 'Thanks - check your inbox to confirm.';
      status.dataset.state = 'ok';
      form.reset();
    });
  });
</script>`,
      css: `.footnews {
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

.footnews__inner {
  display: grid;
  gap: 2.5rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem 2rem;
}

.footnews__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.footnews__blurb {
  margin: 0.375rem 0 1rem;
  max-width: 26rem;
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.6;
}

/*
 * Visually hidden, not display:none - the label still has to reach a screen
 * reader. clip-path over the old clip: rect() hack.
 */
.footnews__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.footnews__row {
  /* Stacked below 40rem - an email input squeezed beside its button on a
     320px phone is not a form. The button drops under the field instead. */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 26rem;
}

@media (min-width: 40rem) {
  .footnews__row {
    flex-direction: row;
  }
}

.footnews__input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  font-family: inherit;
}

.footnews__input::placeholder {
  /* Placeholders drop below AA constantly. #6b7280 is 4.8:1 on white. */
  color: #6b7280;
}

.footnews__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.footnews__input[aria-invalid='true'] {
  border-color: #dc2626;
}

.footnews__submit {
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
}

.footnews__submit:hover {
  background-color: #1d4ed8;
}

.footnews__status {
  min-height: 1.25rem;
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
}

.footnews__status[data-state='error'] {
  color: #b91c1c;
}

.footnews__status[data-state='ok'] {
  color: #15803d;
}

.footnews__cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.footnews__heading {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7280;
}

.footnews__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footnews__link {
  color: #374151;
  font-size: 0.875rem;
  text-decoration: none;
}

.footnews__link:hover {
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}

.footnews__bar {
  border-top: 1px solid #e5e7eb;
}

.footnews__copy {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.8125rem;
}

.footnews__link:focus-visible,
.footnews__submit:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (min-width: 48rem) {
  .footnews__inner {
    grid-template-columns: 3fr 2fr;
  }
}

/*
 * The status colours are the fiddly part: #dc2626 and #16a34a are fine on
 * white but drop under 4.5:1 on #111827, so dark mode lifts both to the 400
 * shades rather than reusing them.
 */
@media (prefers-color-scheme: dark) {
  .footnews {
    border-top-color: #1f2937;
    background-color: #111827;
  }

  .footnews__title {
    color: #f9fafb;
  }

  .footnews__blurb {
    color: #9ca3af;
  }

  .footnews__input {
    border-color: #374151;
    background-color: #1f2937;
    color: #f9fafb;
  }

  .footnews__input::placeholder {
    color: #9ca3af;
  }

  .footnews__status[data-state='error'] {
    color: #f87171;
  }

  .footnews__status[data-state='ok'] {
    color: #4ade80;
  }

  .footnews__heading {
    color: #9ca3af;
  }

  .footnews__link {
    color: #d1d5db;
  }

  .footnews__link:hover {
    color: #f9fafb;
  }

  .footnews__bar {
    border-top-color: #1f2937;
  }

  .footnews__copy {
    color: #9ca3af;
  }

  .footnews__link:focus-visible,
  .footnews__submit:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-[3fr_2fr]">
    <div>
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-50">Ship better, weekly</h2>
      <p class="mb-4 mt-1.5 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Product news and engineering notes. One email a week, no filler.
      </p>

      <form novalidate>
        <label for="footnews-email" class="sr-only">Email address</label>
        <div class="flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            id="footnews-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="you@company.com"
            required
            class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
          />
          <button type="submit" class="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            Subscribe
          </button>
        </div>
        <p role="status" aria-live="polite" class="mt-2 min-h-5 text-[0.8125rem] text-gray-600 dark:text-gray-400"></p>
      </form>
    </div>

    <nav aria-label="Footer">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Product</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/features" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Features</a></li>
            <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
            <li><a href="/changelog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Changelog</a></li>
          </ul>
        </div>
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Company</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">About</a></li>
            <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Blog</a></li>
            <li><a href="/careers" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Careers</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="border-t border-gray-200 dark:border-gray-800">
    <p class="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `import { useRef, useState } from 'react';

const COLUMNS = [
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
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
    ],
  },
];

export function FooterNewsletter({ ctaLabel = 'Subscribe', copy }) {
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const inputRef = useRef(null);

  function onSubmit(event) {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    if (!input.checkValidity()) {
      setStatus({ state: 'error', message: 'Enter a valid email address.' });
      input.focus();
      return;
    }

    setStatus({ state: 'ok', message: 'Thanks - check your inbox to confirm.' });
    input.value = '';
  }

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-[3fr_2fr]">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Ship better, weekly</h2>
          <p className="mb-4 mt-1.5 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy ?? 'Product news and engineering notes. One email a week, no filler.'}
          </p>

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="footnews-email" className="sr-only">Email address</label>
            <div className="flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                ref={inputRef}
                id="footnews-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                aria-invalid={status.state === 'error'}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {ctaLabel}
              </button>
            </div>
            <p
              role="status"
              aria-live="polite"
              className={\`mt-2 min-h-5 text-[0.8125rem] \${
                status.state === 'error'
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-green-700 dark:text-green-400'
              }\`}
            >
              {status.message}
            </p>
          </form>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
      nextjs: `'use client';

// 'use client' - the form validates in the browser and writes the result into
// a live region. Swap onSubmit for a Server Action if you would rather post it.
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

interface FooterNewsletterProps {
  ctaLabel?: string;
  copy?: string;
}

type StatusState = 'idle' | 'error' | 'ok';

const COLUMNS = [
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
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
    ],
  },
];

export function FooterNewsletter({ ctaLabel = 'Subscribe', copy }: FooterNewsletterProps) {
  const [state, setState] = useState<StatusState>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    if (!input.checkValidity()) {
      setState('error');
      setMessage('Enter a valid email address.');
      input.focus();
      return;
    }

    setState('ok');
    setMessage('Thanks - check your inbox to confirm.');
    input.value = '';
  }

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-[3fr_2fr]">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Ship better, weekly</h2>
          <p className="mb-4 mt-1.5 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy ?? 'Product news and engineering notes. One email a week, no filler.'}
          </p>

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="footnews-email" className="sr-only">
              Email address
            </label>
            <div className="flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                ref={inputRef}
                id="footnews-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                aria-invalid={state === 'error'}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {ctaLabel}
              </button>
            </div>
            <p
              role="status"
              aria-live="polite"
              className={\`mt-2 min-h-5 text-[0.8125rem] \${
                state === 'error'
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-green-700 dark:text-green-400'
              }\`}
            >
              {message}
            </p>
          </form>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
      typescript: `import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

export interface FooterNewsletterProps {
  /** Text of the submit button. */
  ctaLabel?: string;
  /** Pitch shown under the heading. */
  copy?: string;
  className?: string;
}

type StatusState = 'idle' | 'error' | 'ok';

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
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
    ],
  },
];

const DEFAULT_COPY = 'Product news and engineering notes. One email a week, no filler.';

export function FooterNewsletter({
  ctaLabel = 'Subscribe',
  copy = DEFAULT_COPY,
  className = '',
}: FooterNewsletterProps): JSX.Element {
  const [state, setState] = useState<StatusState>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    // noValidate turns off the browser bubble; checkValidity still gives us
    // type="email" parsing for free, and the message lands in the live region.
    if (!input.checkValidity()) {
      setState('error');
      setMessage('Enter a valid email address.');
      input.focus();
      return;
    }

    setState('ok');
    setMessage('Thanks - check your inbox to confirm.');
    input.value = '';
  }

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-[3fr_2fr]">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Ship better, weekly</h2>
          <p className="mb-4 mt-1.5 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="footnews-email" className="sr-only">
              Email address
            </label>
            <div className="flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                ref={inputRef}
                id="footnews-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                aria-invalid={state === 'error'}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {ctaLabel}
              </button>
            </div>
            <p
              role="status"
              aria-live="polite"
              className={\`mt-2 min-h-5 text-[0.8125rem] \${
                state === 'error'
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-green-700 dark:text-green-400'
              }\`}
            >
              {message}
            </p>
          </form>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
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
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
    },
  },
  {
    slug: 'footer-social',
    category: 'footer',
    tags: ['footer', 'social', 'icons', 'links', 'brand'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 2210, copies: 596, downloads: 149 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'socials', type: 'SocialLink[]', descriptionKey: 'socials' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Every social icon is an icon-only link, so every one needs its own accessible
  name - "GitHub", not "link". The <svg> is aria-hidden and the name comes from
  a visually-hidden span rather than aria-label, because a span survives
  automatic page translation and an aria-label frequently does not.

  rel="noreferrer" alongside target="_blank": noopener is implied by modern
  browsers, but noreferrer is not.
-->
<footer class="footsocial">
  <div class="footsocial__inner">
    <a class="footsocial__brand" href="/">Adysre</a>

    <nav class="footsocial__nav" aria-label="Footer">
      <ul class="footsocial__links">
        <li><a class="footsocial__link" href="/about">About</a></li>
        <li><a class="footsocial__link" href="/blog">Blog</a></li>
        <li><a class="footsocial__link" href="/privacy">Privacy</a></li>
      </ul>
    </nav>

    <ul class="footsocial__icons">
      <li>
        <a class="footsocial__icon" href="https://github.com/adysre" target="_blank" rel="noreferrer">
          <svg class="footsocial__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
          </svg>
          <span class="footsocial__sr">GitHub</span>
        </a>
      </li>
      <li>
        <a class="footsocial__icon" href="https://x.com/adysre" target="_blank" rel="noreferrer">
          <svg class="footsocial__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z" />
          </svg>
          <span class="footsocial__sr">X</span>
        </a>
      </li>
      <li>
        <a class="footsocial__icon" href="https://linkedin.com/company/adysre" target="_blank" rel="noreferrer">
          <svg class="footsocial__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z" />
          </svg>
          <span class="footsocial__sr">LinkedIn</span>
        </a>
      </li>
    </ul>

    <p class="footsocial__copy">© <time datetime="2026">2026</time> Adysre Inc.</p>
  </div>
</footer>`,
      css: `.footsocial {
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

.footsocial__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2.5rem 1rem;
}

.footsocial__brand {
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
  text-decoration: none;
}

.footsocial__links,
.footsocial__icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footsocial__icons {
  gap: 0.5rem;
}

.footsocial__link {
  color: #374151;
  font-size: 0.875rem;
  text-decoration: none;
}

.footsocial__link:hover {
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}

.footsocial__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 2.5rem, not the 1.25rem the glyph occupies - the target has to be
     comfortably tappable even though the icon inside it is small. */
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  color: #4b5563;
}

.footsocial__icon:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.footsocial__glyph {
  width: 1.25rem;
  height: 1.25rem;
}

/* The accessible name for each icon link. Visually hidden, not display:none -
   display:none would take it away from screen readers too. */
.footsocial__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.footsocial__copy {
  margin: 0;
  color: #6b7280;
  font-size: 0.8125rem;
}

.footsocial__brand:focus-visible,
.footsocial__link:focus-visible,
.footsocial__icon:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .footsocial {
    border-top-color: #1f2937;
    background-color: #111827;
  }

  .footsocial__brand {
    color: #f9fafb;
  }

  .footsocial__link {
    color: #d1d5db;
  }

  .footsocial__link:hover {
    color: #f9fafb;
  }

  /* The glyphs are filled with currentColor, so recolouring the link
     recolours the marks with it. */
  .footsocial__icon {
    color: #9ca3af;
  }

  .footsocial__icon:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .footsocial__copy {
    color: #9ca3af;
  }

  .footsocial__brand:focus-visible,
  .footsocial__link:focus-visible,
  .footsocial__icon:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10">
    <a href="/" class="text-lg font-bold text-gray-900 dark:text-gray-50">Adysre</a>

    <nav aria-label="Footer">
      <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">About</a></li>
        <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Blog</a></li>
        <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
      </ul>
    </nav>

    <ul class="flex gap-2">
      <li>
        <a href="https://github.com/adysre" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
          </svg>
          <span class="sr-only">GitHub</span>
        </a>
      </li>
      <li>
        <a href="https://x.com/adysre" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z" />
          </svg>
          <span class="sr-only">X</span>
        </a>
      </li>
      <li>
        <a href="https://linkedin.com/company/adysre" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z" />
          </svg>
          <span class="sr-only">LinkedIn</span>
        </a>
      </li>
    </ul>

    <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const GITHUB_PATH =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z';
const X_PATH =
  'M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z';
const LINKEDIN_PATH =
  'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z';

const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/adysre', path: GITHUB_PATH },
  { name: 'X', href: 'https://x.com/adysre', path: X_PATH },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/adysre', path: LINKEDIN_PATH },
];

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
];

export function FooterSocial({ socials = SOCIALS }) {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10">
        <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-2">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d={social.path} />
                </svg>
                <span className="sr-only">{social.name}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
      nextjs: `// No 'use client' - icons and links only.
interface SocialLink {
  name: string;
  href: string;
  path: string;
}

interface FooterSocialProps {
  socials?: SocialLink[];
}

const GITHUB_PATH =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z';
const X_PATH =
  'M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z';
const LINKEDIN_PATH =
  'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z';

const DEFAULT_SOCIALS: SocialLink[] = [
  { name: 'GitHub', href: 'https://github.com/adysre', path: GITHUB_PATH },
  { name: 'X', href: 'https://x.com/adysre', path: X_PATH },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/adysre', path: LINKEDIN_PATH },
];

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
];

export function FooterSocial({ socials = DEFAULT_SOCIALS }: FooterSocialProps) {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10">
        <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-50">
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

        <ul className="flex gap-2">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d={social.path} />
                </svg>
                <span className="sr-only">{social.name}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
      typescript: `export interface SocialLink {
  /** The link's accessible name - "GitHub", not "link". */
  name: string;
  href: string;
  /** The \`d\` of a single 24x24 path, filled with currentColor. */
  path: string;
}

export interface FooterSocialProps {
  socials?: SocialLink[];
  className?: string;
}

interface FooterLink {
  href: string;
  label: string;
}

const GITHUB_PATH =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z';
const X_PATH =
  'M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z';
const LINKEDIN_PATH =
  'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z';

const DEFAULT_SOCIALS: readonly SocialLink[] = [
  { name: 'GitHub', href: 'https://github.com/adysre', path: GITHUB_PATH },
  { name: 'X', href: 'https://x.com/adysre', path: X_PATH },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/adysre', path: LINKEDIN_PATH },
];

const LINKS: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
];

export function FooterSocial({
  socials = [...DEFAULT_SOCIALS],
  className = '',
}: FooterSocialProps): JSX.Element {
  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10">
        <a
          href="/"
          className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
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

        <ul className="flex gap-2">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={social.path} />
                </svg>
                {/* The accessible name. A span survives page translation in a
                    way aria-label often does not. */}
                <span className="sr-only">{social.name}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
    },
  },
  {
    slug: 'footer-minimal-legal',
    category: 'footer',
    tags: ['footer', 'legal', 'minimal', 'compact', 'copyright'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-02',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 940, copies: 268, downloads: 63 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'text', labelKey: 'text' },
    ],
    props: [
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  One line. The whole design problem here is the separator: a "·" typed between
  the links is read aloud as "middle dot" by a screen reader, so it is drawn
  with an aria-hidden span rather than punctuation in the link text.

  This is the footer for an app shell or a checkout - somewhere a sitemap would
  be noise but the legal links still have to exist.
-->
<footer class="footlegal">
  <div class="footlegal__inner">
    <p class="footlegal__copy">© <time datetime="2026">2026</time> Adysre Inc.</p>

    <nav aria-label="Legal">
      <ul class="footlegal__links">
        <li><a class="footlegal__link" href="/privacy">Privacy</a></li>
        <li aria-hidden="true" class="footlegal__sep">·</li>
        <li><a class="footlegal__link" href="/terms">Terms</a></li>
        <li aria-hidden="true" class="footlegal__sep">·</li>
        <li><a class="footlegal__link" href="/cookies">Cookies</a></li>
      </ul>
    </nav>
  </div>
</footer>`,
      css: `.footlegal {
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

.footlegal__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 1rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem;
}

.footlegal__copy {
  margin: 0;
  color: #6b7280;
  font-size: 0.8125rem;
}

.footlegal__links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footlegal__link {
  color: #4b5563;
  font-size: 0.8125rem;
  text-decoration: none;
}

.footlegal__link:hover {
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}

/* Decoration, and marked aria-hidden in the markup so it is not announced. */
.footlegal__sep {
  color: #d1d5db;
  font-size: 0.8125rem;
  user-select: none;
}

.footlegal__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (min-width: 40rem) {
  .footlegal__inner {
    justify-content: space-between;
  }
}

/*
 * A single line of small print is the easiest place to fall under AA. #9ca3af
 * on #111827 is 7.0:1 and #d1d5db is 12:1 - both clear it comfortably even at
 * 13px.
 */
@media (prefers-color-scheme: dark) {
  .footlegal {
    border-top-color: #1f2937;
    background-color: #111827;
  }

  .footlegal__copy {
    color: #9ca3af;
  }

  .footlegal__link {
    color: #d1d5db;
  }

  .footlegal__link:hover {
    color: #f9fafb;
  }

  .footlegal__sep {
    color: #4b5563;
  }

  .footlegal__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4 sm:justify-between">
    <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>

    <nav aria-label="Legal">
      <ul class="flex items-center gap-2">
        <li>
          <a href="/privacy" class="text-[0.8125rem] text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
            Privacy
          </a>
        </li>
        <li aria-hidden="true" class="select-none text-[0.8125rem] text-gray-300 dark:text-gray-600">·</li>
        <li>
          <a href="/terms" class="text-[0.8125rem] text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
            Terms
          </a>
        </li>
        <li aria-hidden="true" class="select-none text-[0.8125rem] text-gray-300 dark:text-gray-600">·</li>
        <li>
          <a href="/cookies" class="text-[0.8125rem] text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
            Cookies
          </a>
        </li>
      </ul>
    </nav>
  </div>
</footer>`,
      react: `import { Fragment } from 'react';

const LEGAL = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookies' },
];

export function FooterMinimalLegal() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4 sm:justify-between">
        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>

        <nav aria-label="Legal">
          <ul className="flex items-center gap-2">
            {LEGAL.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 && (
                  <li aria-hidden="true" className="select-none text-[0.8125rem] text-gray-300 dark:text-gray-600">
                    ·
                  </li>
                )}
                <li>
                  <a
                    href={link.href}
                    className="text-[0.8125rem] text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
                  >
                    {link.label}
                  </a>
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}`,
      nextjs: `// No 'use client' - one line of links.
import { Fragment } from 'react';

const LEGAL = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookies' },
];

export function FooterMinimalLegal() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4 sm:justify-between">
        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>

        <nav aria-label="Legal">
          <ul className="flex items-center gap-2">
            {LEGAL.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 ? (
                  <li
                    aria-hidden="true"
                    className="select-none text-[0.8125rem] text-gray-300 dark:text-gray-600"
                  >
                    ·
                  </li>
                ) : null}
                <li>
                  <a
                    href={link.href}
                    className="text-[0.8125rem] text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                  >
                    {link.label}
                  </a>
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}`,
      typescript: `import { Fragment } from 'react';

export interface FooterMinimalLegalProps {
  className?: string;
}

interface LegalLink {
  href: string;
  label: string;
}

const LEGAL: readonly LegalLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookies' },
];

export function FooterMinimalLegal({ className = '' }: FooterMinimalLegalProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4 sm:justify-between">
        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>

        <nav aria-label="Legal">
          <ul className="flex items-center gap-2">
            {LEGAL.map((link, index) => (
              <Fragment key={link.href}>
                {/* The dot is decoration - a screen reader would otherwise
                    announce "middle dot" between every link. */}
                {index > 0 ? (
                  <li
                    aria-hidden="true"
                    className="select-none text-[0.8125rem] text-gray-300 dark:text-gray-600"
                  >
                    ·
                  </li>
                ) : null}
                <li>
                  <a
                    href={link.href}
                    className="text-[0.8125rem] text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                  >
                    {link.label}
                  </a>
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}`,
    },
  },
  {
    slug: 'footer-mega-links',
    category: 'footer',
    tags: ['footer', 'mega', 'sitemap', 'columns', 'links', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 640, copies: 148, downloads: 37 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Five columns of links under a brand row. The grid steps 2 -> 3 -> 5 by
  breakpoint, never five abreast on a phone: at 320px five columns are 50px
  each, which is not a sitemap, it is confetti. The 3-column step at sm leaves
  two groups on a second row - an orphan row reads better than a squeeze.
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto max-w-6xl px-4 pb-8 pt-12">
    <div class="max-w-sm">
      <a href="/" class="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>
      <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        One platform for planning, building and shipping product.
      </p>
    </div>

    <nav aria-label="Footer" class="mt-10">
      <div class="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Product</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/features" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Features</a></li>
            <li><a href="/integrations" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Integrations</a></li>
            <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
            <li><a href="/changelog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Solutions</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/startups" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Startups</a></li>
            <li><a href="/enterprise" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Enterprise</a></li>
            <li><a href="/agencies" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Agencies</a></li>
            <li><a href="/education" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Education</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Resources</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/docs" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Docs</a></li>
            <li><a href="/guides" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Guides</a></li>
            <li><a href="/api" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">API reference</a></li>
            <li><a href="/community" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Community</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Company</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">About</a></li>
            <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Blog</a></li>
            <li><a href="/careers" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Careers</a></li>
            <li><a href="/press" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Press</a></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Legal</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
            <li><a href="/terms" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Terms</a></li>
            <li><a href="/security" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Security</a></li>
            <li><a href="/cookies" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Cookies</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="border-t border-gray-200 dark:border-gray-800">
    <p class="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const COLUMNS = [
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

export function FooterMegaLinks({ copy }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <div className="max-w-sm">
          <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-50">Adysre</a>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy ?? 'One platform for planning, building and shipping product.'}
          </p>
        </div>

        <nav aria-label="Footer" className="mt-10">
          {/* 2 -> 3 -> 5 columns. Never five abreast on a phone. */}
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
                        href={link.href}
                        className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      nextjs: `// No 'use client' - a sitemap is static markup.
interface FooterMegaLinksProps {
  copy?: string;
}

const COLUMNS = [
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

export function FooterMegaLinks({ copy }: FooterMegaLinksProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <div className="max-w-sm">
          <a
            href="/"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {copy ?? 'One platform for planning, building and shipping product.'}
          </p>
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
                        href={link.href}
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
}`,
      typescript: `export interface FooterMegaLinksProps {
  /** Brand blurb under the wordmark. Falls back to the sample copy. */
  copy?: string;
  className?: string;
}

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

const DEFAULT_COPY = 'One platform for planning, building and shipping product.';

export function FooterMegaLinks({
  copy = DEFAULT_COPY,
  className = '',
}: FooterMegaLinksProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <div className="max-w-sm">
          <a
            href="/"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        </div>

        <nav aria-label="Footer" className="mt-10">
          {/* 2 -> 3 -> 5 by breakpoint. Five columns at 320px are 50px each -
              not a sitemap. The orphan row at the sm step is the lesser evil. */}
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
                        href={link.href}
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
}`,
    },
  },
  {
    slug: 'footer-cta-banner',
    category: 'footer',
    tags: ['footer', 'cta', 'banner', 'conversion', 'links'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 520, copies: 131, downloads: 29 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaTitle', type: 'string', default: "'Ready to ship faster?'", descriptionKey: 'title' },
      { name: 'ctaCopy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start free trial'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A last-chance CTA panel above an ordinary link row. The panel's heading is an
  <h2> - a footer never owns the page's <h1>, and promoting this for visual
  weight would be a second h1 to anyone navigating by headings. The panel
  paints its own blue in both themes, so nothing inside it carries a dark:
  class; the buttons stack below sm so neither becomes a sliver tap target.
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto max-w-6xl px-4 pt-10">
    <div class="rounded-2xl bg-blue-600 px-6 py-10 text-center sm:px-10">
      <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready to ship faster?</h2>
      <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-blue-100">
        Start free, invite the team, and see the difference in a week.
      </p>
      <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="#" class="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 sm:w-auto">
          Start free trial
        </a>
        <a href="#" class="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 sm:w-auto">
          Talk to sales
        </a>
      </div>
    </div>
  </div>

  <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
    <a href="/" class="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <nav aria-label="Footer">
      <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">About</a></li>
        <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
        <li><a href="/docs" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Docs</a></li>
        <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
      </ul>
    </nav>

    <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/privacy', label: 'Privacy' },
];

export function FooterCtaBanner({
  ctaTitle = 'Ready to ship faster?',
  ctaCopy = 'Start free, invite the team, and see the difference in a week.',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryLabel = 'Talk to sales',
  secondaryHref = '#',
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 pt-10">
        {/* The panel paints its own blue on both themes - no dark: inside. */}
        <div className="rounded-2xl bg-blue-600 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-blue-100">{ctaCopy}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 sm:w-auto"
            >
              {ctaLabel}
            </a>
            <a
              href={secondaryHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <a href="/" className="font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      nextjs: `// No 'use client' - two links in a coloured box hold no state.
interface FooterCtaBannerProps {
  ctaTitle?: string;
  ctaCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/privacy', label: 'Privacy' },
];

export function FooterCtaBanner({
  ctaTitle = 'Ready to ship faster?',
  ctaCopy = 'Start free, invite the team, and see the difference in a week.',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryLabel = 'Talk to sales',
  secondaryHref = '#',
}: FooterCtaBannerProps) {
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
          href="/"
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
}`,
      typescript: `export interface FooterCtaBannerProps {
  /** Heading inside the CTA panel. An <h2> - a footer never owns the h1. */
  ctaTitle?: string;
  ctaCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

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

export function FooterCtaBanner({
  ctaTitle = 'Ready to ship faster?',
  ctaCopy = 'Start free, invite the team, and see the difference in a week.',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryLabel = 'Talk to sales',
  secondaryHref = '#',
  className = '',
}: FooterCtaBannerProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto max-w-6xl px-4 pt-10">
        {/* The panel brings its own blue, so it looks identical on both themes
            and nothing inside it carries a dark: class. White on blue-600 and
            blue-100 for the sub-copy both clear AA. */}
        <div className="rounded-2xl bg-blue-600 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-blue-100">{ctaCopy}</p>
          {/* Stacked below sm - two buttons sharing 288px are two bad targets. */}
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
          href="/"
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
}`,
    },
  },
  {
    slug: 'footer-app-badges',
    category: 'footer',
    tags: ['footer', 'app', 'badges', 'mobile', 'download', 'svg'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 430, copies: 96, downloads: 24 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'appStoreHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'playStoreHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Store badges drawn in HTML + inline SVG, deliberately generic: the official
  badge artwork is trademarked and ships with its own usage rules, so this is
  a stand-in shape you replace with the real assets for production. Because
  the badge is real text, its accessible name is simply its contents -
  "Download on the App Store" - with no alt text to maintain.

  The two badges wrap rather than shrink: at 320px they stack; a half-width
  store badge is an unreadable one.
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center">
    <div>
      <a href="/" class="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Take your work with you.</p>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <a href="#" class="inline-flex min-h-12 items-center gap-3 rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
        </svg>
        <span class="flex flex-col text-left leading-tight">
          <span class="text-[0.6875rem]">Download on the</span>
          <span class="text-sm font-semibold">App Store</span>
        </span>
      </a>

      <a href="#" class="inline-flex min-h-12 items-center gap-3 rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M4 2.5v19a.5.5 0 0 0 .76.43l16.02-9.5a.5.5 0 0 0 0-.86L4.76 2.07A.5.5 0 0 0 4 2.5Z" />
        </svg>
        <span class="flex flex-col text-left leading-tight">
          <span class="text-[0.6875rem]">Get it on</span>
          <span class="text-sm font-semibold">Google Play</span>
        </span>
      </a>
    </div>

    <nav aria-label="Footer">
      <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <li><a href="/support" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Support</a></li>
        <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
        <li><a href="/terms" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Terms</a></li>
      </ul>
    </nav>

    <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const APPLE_PATH =
  'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z';
const PLAY_PATH =
  'M4 2.5v19a.5.5 0 0 0 .76.43l16.02-9.5a.5.5 0 0 0 0-.86L4.76 2.07A.5.5 0 0 0 4 2.5Z';

const LINKS = [
  { href: '/support', label: 'Support' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

function StoreBadge({ href, glyph, kicker, store }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
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

export function FooterAppBadges({ appStoreHref = '#', playStoreHref = '#' }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center">
        <div>
          <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-50">Adysre</a>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Take your work with you.</p>
        </div>

        {/* Generic hand-drawn badges - swap in the official artwork (and its
            usage rules) for production. flex-wrap: they stack at 320px. */}
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
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      nextjs: `// No 'use client' - badges are links.
interface FooterAppBadgesProps {
  appStoreHref?: string;
  playStoreHref?: string;
}

interface StoreBadgeProps {
  href: string;
  glyph: string;
  kicker: string;
  store: string;
}

const APPLE_PATH =
  'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z';
const PLAY_PATH =
  'M4 2.5v19a.5.5 0 0 0 .76.43l16.02-9.5a.5.5 0 0 0 0-.86L4.76 2.07A.5.5 0 0 0 4 2.5Z';

const LINKS = [
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

export function FooterAppBadges({ appStoreHref = '#', playStoreHref = '#' }: FooterAppBadgesProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center">
        <div>
          <a
            href="/"
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
}`,
      typescript: `export interface FooterAppBadgesProps {
  appStoreHref?: string;
  playStoreHref?: string;
  className?: string;
}

interface StoreBadgeProps {
  href: string;
  /** The d of a single 24x24 path, filled with currentColor. */
  glyph: string;
  kicker: string;
  store: string;
}

interface FooterLink {
  href: string;
  label: string;
}

// Generic, hand-drawn glyphs. The official store badges are trademarked
// artwork with their own usage rules - swap these for the real assets from
// each store's marketing page before shipping.
const APPLE_PATH =
  'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z';
const PLAY_PATH =
  'M4 2.5v19a.5.5 0 0 0 .76.43l16.02-9.5a.5.5 0 0 0 0-.86L4.76 2.07A.5.5 0 0 0 4 2.5Z';

const LINKS: readonly FooterLink[] = [
  { href: '/support', label: 'Support' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

function StoreBadge({ href, glyph, kicker, store }: StoreBadgeProps): JSX.Element {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d={glyph} />
      </svg>
      {/* Real text, so the link names itself - "Download on the App Store". */}
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[0.6875rem]">{kicker}</span>
        <span className="text-sm font-semibold">{store}</span>
      </span>
    </a>
  );
}

export function FooterAppBadges({
  appStoreHref = '#',
  playStoreHref = '#',
  className = '',
}: FooterAppBadgesProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center">
        <div>
          <a
            href="/"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Take your work with you.</p>
        </div>

        {/* flex-wrap, never shrink: at 320px the badges stack - a half-width
            store badge is an unreadable one. */}
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
}`,
    },
  },
  {
    slug: 'footer-centered-logo',
    category: 'footer',
    tags: ['footer', 'centered', 'logo', 'social', 'brand'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 380, copies: 92, downloads: 21 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'brand', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A centred stack: logo mark, nav, then a bottom row with the copyright and
  socials. The logo is an icon-only home link - its letterform is aria-hidden
  and the real name lives in an sr-only span, because "A" is not a name and
  neither is "link".
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-10">
    <a href="/" class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      <span aria-hidden="true">A</span>
      <span class="sr-only">Adysre - home</span>
    </a>

    <nav aria-label="Footer">
      <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <li><a href="/features" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Features</a></li>
        <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
        <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Blog</a></li>
        <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">About</a></li>
        <li><a href="/contact" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Contact</a></li>
      </ul>
    </nav>
  </div>

  <div class="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-3 border-t border-gray-200 px-4 py-5 sm:flex-row sm:justify-between dark:border-gray-800">
    <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>

    <ul class="flex gap-2">
      <li>
        <a href="https://github.com/adysre" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
          </svg>
          <span class="sr-only">GitHub</span>
        </a>
      </li>
      <li>
        <a href="https://x.com/adysre" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z" />
          </svg>
          <span class="sr-only">X</span>
        </a>
      </li>
      <li>
        <a href="https://linkedin.com/company/adysre" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z" />
          </svg>
          <span class="sr-only">LinkedIn</span>
        </a>
      </li>
    </ul>
  </div>
</footer>`,
      react: `const GITHUB_PATH =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z';
const X_PATH =
  'M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z';
const LINKEDIN_PATH =
  'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z';

const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/adysre', path: GITHUB_PATH },
  { name: 'X', href: 'https://x.com/adysre', path: X_PATH },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/adysre', path: LINKEDIN_PATH },
];

const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function FooterCenteredLogo({ brand = 'Adysre' }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-10">
        {/* Icon-only home link: the letterform is decoration, the sr-only span
            is the name. */}
        <a
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white"
        >
          <span aria-hidden="true">{brand.charAt(0)}</span>
          <span className="sr-only">{brand} - home</span>
        </a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-3 border-t border-gray-200 px-4 py-5 sm:flex-row sm:justify-between dark:border-gray-800">
        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> {brand} Inc.
        </p>

        <ul className="flex gap-2">
          {SOCIALS.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d={social.path} />
                </svg>
                <span className="sr-only">{social.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}`,
      nextjs: `// No 'use client' - static links and icons.
interface FooterCenteredLogoProps {
  brand?: string;
}

const GITHUB_PATH =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z';
const X_PATH =
  'M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z';
const LINKEDIN_PATH =
  'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z';

const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/adysre', path: GITHUB_PATH },
  { name: 'X', href: 'https://x.com/adysre', path: X_PATH },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/adysre', path: LINKEDIN_PATH },
];

const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function FooterCenteredLogo({ brand = 'Adysre' }: FooterCenteredLogoProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-10">
        <a
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <span aria-hidden="true">{brand.charAt(0)}</span>
          <span className="sr-only">{brand} - home</span>
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
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-3 border-t border-gray-200 px-4 py-5 sm:flex-row sm:justify-between dark:border-gray-800">
        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> {brand} Inc.
        </p>

        <ul className="flex gap-2">
          {SOCIALS.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d={social.path} />
                </svg>
                <span className="sr-only">{social.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}`,
      typescript: `export interface FooterCenteredLogoProps {
  /** Brand name. Its first letter becomes the logo mark. */
  brand?: string;
  className?: string;
}

interface SocialLink {
  name: string;
  href: string;
  path: string;
}

interface FooterLink {
  href: string;
  label: string;
}

const GITHUB_PATH =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z';
const X_PATH =
  'M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.12L5.6 21H2.63l6.94-7.93L2.36 3h6.12l4.23 5.59L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z';
const LINKEDIN_PATH =
  'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05a4.16 4.16 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.36c0-1.28-.02-2.92-1.78-2.92-1.79 0-2.06 1.39-2.06 2.83V21h-4V9Z';

const SOCIALS: readonly SocialLink[] = [
  { name: 'GitHub', href: 'https://github.com/adysre', path: GITHUB_PATH },
  { name: 'X', href: 'https://x.com/adysre', path: X_PATH },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/adysre', path: LINKEDIN_PATH },
];

const LINKS: readonly FooterLink[] = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function FooterCenteredLogo({
  brand = 'Adysre',
  className = '',
}: FooterCenteredLogoProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-10">
        {/* Icon-only home link. The letterform is aria-hidden decoration; the
            sr-only span is the accessible name - "A" is not a name. */}
        <a
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <span aria-hidden="true">{brand.charAt(0)}</span>
          <span className="sr-only">{brand} - home</span>
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
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-3 border-t border-gray-200 px-4 py-5 sm:flex-row sm:justify-between dark:border-gray-800">
        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> {brand} Inc.
        </p>

        <ul className="flex gap-2">
          {SOCIALS.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={social.path} />
                </svg>
                <span className="sr-only">{social.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}`,
    },
  },
  {
    slug: 'footer-contact-split',
    category: 'footer',
    tags: ['footer', 'contact', 'address', 'phone', 'email', 'links'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 350, copies: 81, downloads: 19 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'street', type: 'string', descriptionKey: 'copy' },
      { name: 'city', type: 'string', descriptionKey: 'copy' },
      { name: 'phone', type: 'string', descriptionKey: 'copy' },
      { name: 'email', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Contact details beside two link columns. The contact block is a real
  <address> (with not-italic, because browsers italicise it by default), the
  phone is a tel: link and the email a mailto: - on a phone these are the two
  most useful taps in the footer, so both get 40px-tall targets. break-all on
  the email keeps a long address wrapping inside 320px instead of pushing the
  page sideways.
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-2">
    <div>
      <a href="/" class="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>
      <address class="mt-4 not-italic">
        <ul class="flex flex-col gap-3">
          <li class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <svg class="mt-0.5 h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>100 Market Street, Suite 300<br />San Francisco, CA 94103</span>
          </li>
          <li>
            <a href="tel:+14155550132" class="inline-flex min-h-10 items-center gap-3 text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
              <svg class="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +1 (415) 555-0132
            </a>
          </li>
          <li>
            <a href="mailto:hello@adysre.com" class="inline-flex min-h-10 items-center gap-3 break-all text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
              <svg class="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              hello@adysre.com
            </a>
          </li>
        </ul>
      </address>
    </div>

    <nav aria-label="Footer">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Company</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">About</a></li>
            <li><a href="/careers" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Careers</a></li>
            <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Blog</a></li>
          </ul>
        </div>
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Support</h2>
          <ul class="flex flex-col gap-2">
            <li><a href="/help" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Help center</a></li>
            <li><a href="/status" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Status</a></li>
            <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="border-t border-gray-200 dark:border-gray-800">
    <p class="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const PIN_PATH = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z';
const PHONE_PATH =
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { href: '/help', label: 'Help center' },
      { href: '/status', label: 'Status' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export function FooterContactSplit({
  street = '100 Market Street, Suite 300',
  city = 'San Francisco, CA 94103',
  phone = '+1 (415) 555-0132',
  email = 'hello@adysre.com',
}) {
  const year = new Date().getFullYear();
  // tel: URIs want digits, not typography.
  const telHref = 'tel:' + phone.replace(/[^+\\d]/g, '');

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-2">
        <div>
          <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-50">Adysre</a>
          {/* A real <address>; not-italic undoes the browser default. */}
          <address className="mt-4 not-italic">
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={PIN_PATH} />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  {street}
                  <br />
                  {city}
                </span>
              </li>
              <li>
                <a
                  href={telHref}
                  className="inline-flex min-h-10 items-center gap-3 text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d={PHONE_PATH} />
                  </svg>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={\`mailto:\${email}\`}
                  className="inline-flex min-h-10 items-center gap-3 break-all text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  {email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      nextjs: `// No 'use client' - contact links are just links.
interface FooterContactSplitProps {
  street?: string;
  city?: string;
  phone?: string;
  email?: string;
}

const PIN_PATH = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z';
const PHONE_PATH =
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { href: '/help', label: 'Help center' },
      { href: '/status', label: 'Status' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export function FooterContactSplit({
  street = '100 Market Street, Suite 300',
  city = 'San Francisco, CA 94103',
  phone = '+1 (415) 555-0132',
  email = 'hello@adysre.com',
}: FooterContactSplitProps) {
  const year = new Date().getFullYear();
  const telHref = 'tel:' + phone.replace(/[^+\\d]/g, '');

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-2">
        <div>
          <a
            href="/"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <address className="mt-4 not-italic">
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={PIN_PATH} />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  {street}
                  <br />
                  {city}
                </span>
              </li>
              <li>
                <a
                  href={telHref}
                  className="inline-flex min-h-10 items-center gap-3 text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d={PHONE_PATH} />
                  </svg>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={\`mailto:\${email}\`}
                  className="inline-flex min-h-10 items-center gap-3 break-all text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  {email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
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
}`,
      typescript: `export interface FooterContactSplitProps {
  street?: string;
  city?: string;
  /** Display form; the tel: href is derived by stripping the typography. */
  phone?: string;
  email?: string;
  className?: string;
}

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  heading: string;
  links: readonly FooterLink[];
}

const PIN_PATH = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z';
const PHONE_PATH =
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';

const COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { href: '/help', label: 'Help center' },
      { href: '/status', label: 'Status' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export function FooterContactSplit({
  street = '100 Market Street, Suite 300',
  city = 'San Francisco, CA 94103',
  phone = '+1 (415) 555-0132',
  email = 'hello@adysre.com',
  className = '',
}: FooterContactSplitProps): JSX.Element {
  const year = new Date().getFullYear();
  // tel: URIs want digits, not typography - "+14155550132", not "(415) 555-".
  const telHref = 'tel:' + phone.replace(/[^+\\d]/g, '');

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-12 md:grid-cols-2">
        <div>
          <a
            href="/"
            className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          {/* <address> is the element built for this; not-italic undoes the
              browser's default italics. The phone and email are the two most
              useful taps in a footer, so both get min-h-10 targets. */}
          <address className="mt-4 not-italic">
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={PIN_PATH} />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  {street}
                  <br />
                  {city}
                </span>
              </li>
              <li>
                <a
                  href={telHref}
                  className="inline-flex min-h-10 items-center gap-3 text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d={PHONE_PATH} />
                  </svg>
                  {phone}
                </a>
              </li>
              <li>
                {/* break-all: a long email must wrap inside 320px, not push
                    the page sideways. */}
                <a
                  href={\`mailto:\${email}\`}
                  className="inline-flex min-h-10 items-center gap-3 break-all text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  {email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
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
}`,
    },
  },
  {
    slug: 'footer-language-currency',
    category: 'footer',
    tags: ['footer', 'language', 'currency', 'i18n', 'select', 'locale'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 300, copies: 70, downloads: 16 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'locale', type: 'string', default: "'en-US'", descriptionKey: 'copy' },
      { name: 'currency', type: 'string', default: "'USD'", descriptionKey: 'copy' },
      { name: 'onLocaleChange', type: '(value: string) => void', descriptionKey: 'copy' },
      { name: 'onCurrencyChange', type: '(value: string) => void', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A market switcher in the footer: a language <select> and a currency <select>
  beside the usual link row. Each select is a real control with its own
  visually hidden <label> - a bare select carries no accessible name, so a
  screen reader announces only "combobox". The block stacks above md so the
  selects never land on top of the links at 320px, and each control is at least
  40px tall to stay a usable tap target.
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
    <div class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <a href="/" class="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>
      <nav aria-label="Footer">
        <ul class="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">About</a></li>
          <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
          <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
        </ul>
      </nav>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
        <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
        </svg>
        <label for="footer-lang" class="sr-only">Language</label>
        <select id="footer-lang" class="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300">
          <option value="en-US">English (US)</option>
          <option value="fr-FR">Français</option>
          <option value="de-DE">Deutsch</option>
          <option value="ja-JP">日本語</option>
        </select>
      </div>

      <div class="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
        <label for="footer-cur" class="sr-only">Currency</label>
        <select id="footer-cur" class="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300">
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="GBP">GBP £</option>
          <option value="JPY">JPY ¥</option>
        </select>
      </div>
    </div>
  </div>

  <div class="border-t border-gray-200 dark:border-gray-800">
    <p class="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/privacy', label: 'Privacy' },
];

const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'ja-JP', label: '日本語' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD $' },
  { value: 'EUR', label: 'EUR €' },
  { value: 'GBP', label: 'GBP £' },
  { value: 'JPY', label: 'JPY ¥' },
];

export function FooterLanguageCurrency({
  locale = 'en-US',
  currency = 'USD',
  onLocaleChange,
  onCurrencyChange,
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <a href="/" className="font-bold text-gray-900 dark:text-gray-50">Adysre</a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
            <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
            </svg>
            <label htmlFor="footer-lang" className="sr-only">Language</label>
            <select
              id="footer-lang"
              defaultValue={locale}
              onChange={(event) => onLocaleChange?.(event.target.value)}
              className="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            >
              {LANGUAGES.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
            <label htmlFor="footer-cur" className="sr-only">Currency</label>
            <select
              id="footer-cur"
              defaultValue={currency}
              onChange={(event) => onCurrencyChange?.(event.target.value)}
              className="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            >
              {CURRENCIES.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
      typescript: `export interface FooterLanguageCurrencyProps {
  /** Selected language tag, e.g. 'en-US'. Uncontrolled default. */
  locale?: string;
  /** Selected ISO 4217 currency, e.g. 'USD'. Uncontrolled default. */
  currency?: string;
  onLocaleChange?: (value: string) => void;
  onCurrencyChange?: (value: string) => void;
  className?: string;
}

interface FooterLink {
  href: string;
  label: string;
}

interface Option {
  value: string;
  label: string;
}

const LINKS: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/privacy', label: 'Privacy' },
];

const LANGUAGES: readonly Option[] = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'ja-JP', label: '日本語' },
];

const CURRENCIES: readonly Option[] = [
  { value: 'USD', label: 'USD $' },
  { value: 'EUR', label: 'EUR €' },
  { value: 'GBP', label: 'GBP £' },
  { value: 'JPY', label: 'JPY ¥' },
];

export function FooterLanguageCurrency({
  locale = 'en-US',
  currency = 'USD',
  onLocaleChange,
  onCurrencyChange,
  className = '',
}: FooterLanguageCurrencyProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <a
            href="/"
            className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
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
        </div>

        {/* The wrapper carries the focus ring via focus-within, so the native
            select keeps its own affordance and the whole control lights up. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
            <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
            </svg>
            <label htmlFor="footer-lang" className="sr-only">Language</label>
            <select
              id="footer-lang"
              defaultValue={locale}
              onChange={(event) => onLocaleChange?.(event.target.value)}
              className="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            >
              {LANGUAGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
            <label htmlFor="footer-cur" className="sr-only">Currency</label>
            <select
              id="footer-cur"
              defaultValue={currency}
              onChange={(event) => onCurrencyChange?.(event.target.value)}
              className="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            >
              {CURRENCIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
    },
  },
  {
    slug: 'footer-stats-strip',
    category: 'footer',
    tags: ['footer', 'stats', 'metrics', 'numbers', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 280, copies: 64, downloads: 15 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'stats', type: 'Stat[]', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A strip of headline numbers above the link row, marked up as a description
  list: each figure is a <dd> value paired with a <dt> label, so a screen reader
  reads "Teams onboard, 12,000+" as one unit rather than two loose scraps. The
  value sits visually above the label via flex-col-reverse while the <dt> stays
  first in source, which is the order the spec wants. The grid steps 1 -> 2 -> 4
  so the numbers never shrink to an unreadable sliver at 320px.
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto max-w-6xl px-4 py-10">
    <dl class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div class="flex flex-col-reverse text-center sm:text-left">
        <dt class="mt-1 text-sm text-gray-600 dark:text-gray-400">Teams onboard</dt>
        <dd class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">12,000+</dd>
      </div>
      <div class="flex flex-col-reverse text-center sm:text-left">
        <dt class="mt-1 text-sm text-gray-600 dark:text-gray-400">Uptime</dt>
        <dd class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">99.99%</dd>
      </div>
      <div class="flex flex-col-reverse text-center sm:text-left">
        <dt class="mt-1 text-sm text-gray-600 dark:text-gray-400">Countries</dt>
        <dd class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">140+</dd>
      </div>
      <div class="flex flex-col-reverse text-center sm:text-left">
        <dt class="mt-1 text-sm text-gray-600 dark:text-gray-400">Support</dt>
        <dd class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">24/7</dd>
      </div>
    </dl>

    <div class="mt-10 flex flex-col items-center gap-4 border-t border-gray-200 pt-6 md:flex-row md:justify-between dark:border-gray-800">
      <a href="/" class="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>
      <nav aria-label="Footer">
        <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">About</a></li>
          <li><a href="/customers" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Customers</a></li>
          <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
        </ul>
      </nav>
      <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
        © <time datetime="2026">2026</time> Adysre Inc.
      </p>
    </div>
  </div>
</footer>`,
      react: `const STATS = [
  { value: '12,000+', label: 'Teams onboard' },
  { value: '99.99%', label: 'Uptime' },
  { value: '140+', label: 'Countries' },
  { value: '24/7', label: 'Support' },
];

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/customers', label: 'Customers' },
  { href: '/pricing', label: 'Pricing' },
];

export function FooterStatsStrip({ stats = STATS }) {
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
          <a href="/" className="font-bold text-gray-900 dark:text-gray-50">Adysre</a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      typescript: `export interface Stat {
  /** The figure, pre-formatted for display, e.g. '99.99%'. */
  value: string;
  label: string;
}

export interface FooterStatsStripProps {
  stats?: readonly Stat[];
  className?: string;
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

export function FooterStatsStrip({
  stats = STATS,
  className = '',
}: FooterStatsStripProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* A <dl>, not a row of <div>s: the value is a <dd>, the label a <dt>.
            flex-col-reverse lifts the number above the label without moving the
            <dt> out of source order. Grid steps 1 -> 2 -> 4. */}
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse text-center sm:text-left">
              <dt className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-gray-200 pt-6 md:flex-row md:justify-between dark:border-gray-800">
          <a
            href="/"
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
}`,
    },
  },
  {
    slug: 'footer-dark-gradient-brand',
    category: 'footer',
    tags: ['footer', 'dark', 'gradient', 'brand', 'wordmark'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 260, copies: 60, downloads: 14 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'brand', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'tagline', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A footer that paints its own dark gradient, so it looks identical in light and
  dark mode and carries no dark: classes at all. Because the surface is fixed,
  the contrast is set against it once: white on the near-black end clears ~17:1,
  the muted gray-400 links ~7:1. The wordmark grows fluidly (text-4xl -> 6xl)
  rather than at a fixed size that would push past 320px, and the columns fall
  from three to two on the narrowest screens.
-->
<footer class="bg-gradient-to-br from-gray-900 to-black text-gray-300">
  <div class="mx-auto max-w-6xl px-4 py-14">
    <div class="grid gap-10 md:grid-cols-[1.5fr_2fr]">
      <div>
        <a href="/" class="text-4xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:text-5xl lg:text-6xl">Adysre</a>
        <p class="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">The operating system for modern teams.</p>
      </div>

      <nav aria-label="Footer">
        <div class="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
          <div>
            <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-400">Product</h2>
            <ul class="flex flex-col gap-2">
              <li><a href="/features" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Features</a></li>
              <li><a href="/pricing" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">Pricing</a></li>
              <li><a href="/changelog" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-400">Company</h2>
            <ul class="flex flex-col gap-2">
              <li><a href="/about" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">About</a></li>
              <li><a href="/careers" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">Careers</a></li>
              <li><a href="/blog" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">Blog</a></li>
            </ul>
          </div>
          <div>
            <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-400">Legal</h2>
            <ul class="flex flex-col gap-2">
              <li><a href="/privacy" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">Privacy</a></li>
              <li><a href="/terms" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">Terms</a></li>
              <li><a href="/security" class="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4">Security</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div class="mt-12 border-t border-white/10 pt-6">
      <p class="text-[0.8125rem] text-gray-400">© <time datetime="2026">2026</time> Adysre Inc.</p>
    </div>
  </div>
</footer>`,
      react: `const COLUMNS = [
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

export function FooterDarkGradientBrand({
  brand = 'Adysre',
  tagline = 'The operating system for modern teams.',
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2fr]">
          <div>
            <a href="/" className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{brand}</a>
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
                          className="text-sm text-gray-300 hover:text-white hover:underline hover:underline-offset-4"
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
}`,
      typescript: `export interface FooterDarkGradientBrandProps {
  brand?: string;
  tagline?: string;
  className?: string;
}

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

export function FooterDarkGradientBrand({
  brand = 'Adysre',
  tagline = 'The operating system for modern teams.',
  className = '',
}: FooterDarkGradientBrandProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className={\`bg-gradient-to-br from-gray-900 to-black text-gray-300 \${className}\`}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2fr]">
          <div>
            {/* Fluid wordmark: text-4xl -> 6xl so it never overflows 320px. The
                surface is self-painted dark, so nothing here carries a dark:. */}
            <a
              href="/"
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
}`,
    },
  },
  {
    slug: 'footer-accordion-mobile',
    category: 'footer',
    tags: ['footer', 'accordion', 'mobile', 'details', 'columns', 'responsive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 410, copies: 108, downloads: 31 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'columns', type: 'FooterColumn[]', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Link columns that are native <details> accordions on a phone and a static grid
  from md up. No JavaScript: the toggle, keyboard handling and aria-expanded are
  the browser's. They ship with the open attribute so the links are always in
  the DOM and indexable; on md the summary is set to pointer-events-none and the
  chevron hidden, which freezes each group open as an ordinary heading. This is
  the one layout where a five-column sitemap on a 320px phone is genuinely fine,
  because only one section is expanded at a time.
-->
<footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav aria-label="Footer" class="mx-auto max-w-6xl px-4 py-4 md:py-12">
    <div class="md:grid md:grid-cols-4 md:gap-8">
      <details open class="group border-b border-gray-200 md:border-b-0 dark:border-gray-800">
        <summary class="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden md:pointer-events-none md:py-0 md:pb-3 dark:text-gray-400 dark:focus-visible:ring-blue-400">
          Product
          <svg class="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul class="flex flex-col gap-2 pb-4 md:pb-0">
          <li><a href="/features" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Features</a></li>
          <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
          <li><a href="/changelog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Changelog</a></li>
        </ul>
      </details>

      <details open class="group border-b border-gray-200 md:border-b-0 dark:border-gray-800">
        <summary class="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden md:pointer-events-none md:py-0 md:pb-3 dark:text-gray-400 dark:focus-visible:ring-blue-400">
          Company
          <svg class="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul class="flex flex-col gap-2 pb-4 md:pb-0">
          <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">About</a></li>
          <li><a href="/careers" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Careers</a></li>
          <li><a href="/blog" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Blog</a></li>
        </ul>
      </details>

      <details open class="group border-b border-gray-200 md:border-b-0 dark:border-gray-800">
        <summary class="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden md:pointer-events-none md:py-0 md:pb-3 dark:text-gray-400 dark:focus-visible:ring-blue-400">
          Resources
          <svg class="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul class="flex flex-col gap-2 pb-4 md:pb-0">
          <li><a href="/docs" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Docs</a></li>
          <li><a href="/guides" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Guides</a></li>
          <li><a href="/support" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Support</a></li>
        </ul>
      </details>

      <details open class="group border-b border-gray-200 md:border-b-0 dark:border-gray-800">
        <summary class="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden md:pointer-events-none md:py-0 md:pb-3 dark:text-gray-400 dark:focus-visible:ring-blue-400">
          Legal
          <svg class="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul class="flex flex-col gap-2 pb-4 md:pb-0">
          <li><a href="/privacy" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Privacy</a></li>
          <li><a href="/terms" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Terms</a></li>
          <li><a href="/security" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Security</a></li>
        </ul>
      </details>
    </div>
  </nav>

  <div class="border-t border-gray-200 dark:border-gray-800">
    <p class="mx-auto max-w-6xl px-4 py-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </div>
</footer>`,
      react: `const COLUMNS = [
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
      { href: '/guides', label: 'Guides' },
      { href: '/support', label: 'Support' },
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

export function FooterAccordionMobile({ columns = COLUMNS }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav aria-label="Footer" className="mx-auto max-w-6xl px-4 py-4 md:py-12">
        <div className="md:grid md:grid-cols-4 md:gap-8">
          {columns.map((column) => (
            <details key={column.heading} open className="group border-b border-gray-200 md:border-b-0 dark:border-gray-800">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden md:pointer-events-none md:py-0 md:pb-3 dark:text-gray-400 dark:focus-visible:ring-blue-400">
                {column.heading}
                <svg className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <ul className="flex flex-col gap-2 pb-4 md:pb-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl px-4 py-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
      typescript: `export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  heading: string;
  links: readonly FooterLink[];
}

export interface FooterAccordionMobileProps {
  columns?: readonly FooterColumn[];
  className?: string;
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
      { href: '/guides', label: 'Guides' },
      { href: '/support', label: 'Support' },
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

export function FooterAccordionMobile({
  columns = COLUMNS,
  className = '',
}: FooterAccordionMobileProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      className={\`border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <nav aria-label="Footer" className="mx-auto max-w-6xl px-4 py-4 md:py-12">
        {/* One column stack of <details> on a phone, a static 4-col grid from md.
            open ships the links in the DOM; md:pointer-events-none + md:hidden on
            the chevron freeze each group open as a plain heading. list-none and
            [&::-webkit-details-marker]:hidden drop the two default disclosure
            triangles. */}
        <div className="md:grid md:grid-cols-4 md:gap-8">
          {columns.map((column) => (
            <details
              key={column.heading}
              open
              className="group border-b border-gray-200 md:border-b-0 dark:border-gray-800"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden md:pointer-events-none md:py-0 md:pb-3 dark:text-gray-400 dark:focus-visible:ring-blue-400">
                {column.heading}
                <svg
                  className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none md:hidden"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <ul className="flex flex-col gap-2 pb-4 md:pb-0">
                {column.links.map((link) => (
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
            </details>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl px-4 py-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>
      </div>
    </footer>
  );
}`,
    },
  },
  {
    slug: 'footer-minimal-floating',
    category: 'footer',
    tags: ['footer', 'minimal', 'floating', 'card', 'compact'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 240, copies: 58, downloads: 13 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'brand', type: 'string', default: "'Adysre'", descriptionKey: 'title' },
      { name: 'links', type: 'FooterLink[]', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A compact footer that floats as an inset card rather than a full-bleed bar:
  the padding around it and the rounded, shadowed surface set it off from the
  page. Everything lives in one flex row that stacks below sm, so the brand,
  links and copyright are never clipped by the card's own padding at 320px. The
  outer padding is the gap to the page edge; the card itself is centred and
  capped at max-w-5xl.
-->
<div class="px-4 pb-4">
  <footer class="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:justify-between dark:border-gray-800 dark:bg-gray-900">
    <a href="/" class="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <nav aria-label="Footer">
      <ul class="flex flex-wrap justify-center gap-x-5 gap-y-2">
        <li><a href="/about" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">About</a></li>
        <li><a href="/pricing" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Pricing</a></li>
        <li><a href="/contact" class="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50">Contact</a></li>
      </ul>
    </nav>

    <p class="text-[0.8125rem] text-gray-500 dark:text-gray-400">
      © <time datetime="2026">2026</time> Adysre Inc.
    </p>
  </footer>
</div>`,
      react: `const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function FooterMinimalFloating({ brand = 'Adysre', links = LINKS }) {
  const year = new Date().getFullYear();

  return (
    <div className="px-4 pb-4">
      <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:justify-between dark:border-gray-800 dark:bg-gray-900">
        <a href="/" className="font-bold text-gray-900 dark:text-gray-50">{brand}</a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-300 dark:hover:text-gray-50"
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
}`,
      typescript: `export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterMinimalFloatingProps {
  brand?: string;
  links?: readonly FooterLink[];
  className?: string;
}

const LINKS: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function FooterMinimalFloating({
  brand = 'Adysre',
  links = LINKS,
  className = '',
}: FooterMinimalFloatingProps): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <div className={\`px-4 pb-4 \${className}\`}>
      {/* The outer padding is the float - it is the gap to the page edge. The
          card stacks below sm so nothing is clipped by its own px-6 at 320px. */}
      <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:justify-between dark:border-gray-800 dark:bg-gray-900">
        <a
          href="/"
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
}`,
    },
  },
];
