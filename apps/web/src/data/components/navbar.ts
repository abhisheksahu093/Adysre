import type { ComponentEntry } from './types';

/**
 * Navbar category.
 *
 * Structurally different bars, not recolours of one: plain responsive headers,
 * real submenus and a mega panel, centred-logo and split-action layouts, sticky
 * and transparent-overlay bars, utility strips, search and commerce variants,
 * and a drawer with a focus trap. The accessibility surface is the interesting
 * part - a navbar is the one component on a page that every keyboard user hits
 * first, so `aria-expanded`/`aria-controls` on every toggle and
 * `aria-current="page"` on the active link are load-bearing, not decoration.
 *
 * The second shared constraint is width: every bar here must survive 320px.
 * Each one commits to a named mobile strategy - collapse to a hamburger,
 * wrap the row, or scroll the link strip - because a navbar that only works
 * above 768px is a broken navbar with good screenshots.
 */
export const navbarComponents: ComponentEntry[] = [
  {
    slug: 'navbar-simple',
    category: 'navbar',
    tags: ['navbar', 'header', 'responsive', 'hamburger', 'cta'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-06-20',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 3120, copies: 884, downloads: 231 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/signup'", descriptionKey: 'ctaHref' },
      { name: 'ariaLabel', type: 'string', default: "'Open main menu'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The links live in a <ul> inside a <nav aria-label="Main"> because a screen
  reader user navigating by landmark needs to know which nav this is - a page
  with a main nav and a footer nav has two, and "navigation, navigation" is
  useless. aria-current="page" marks the active link: without it the highlight
  is a colour a screen reader cannot see.

  The hamburger is a real <button> with aria-expanded and aria-controls, so its
  state is announced rather than implied by an icon rotating.
-->
<header class="navbar">
  <nav class="navbar__inner" aria-label="Main">
    <a class="navbar__brand" href="/">Adysre</a>

    <ul class="navbar__links">
      <li><a class="navbar__link" href="/product" aria-current="page">Product</a></li>
      <li><a class="navbar__link" href="/pricing">Pricing</a></li>
      <li><a class="navbar__link" href="/docs">Docs</a></li>
    </ul>

    <a class="navbar__cta" href="/signup">Get started</a>

    <button
      class="navbar__toggle"
      type="button"
      aria-expanded="false"
      aria-controls="navbar-menu"
      aria-label="Open main menu"
    >
      <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>

  <ul class="navbar__menu" id="navbar-menu" hidden>
    <li><a class="navbar__link" href="/product" aria-current="page">Product</a></li>
    <li><a class="navbar__link" href="/pricing">Pricing</a></li>
    <li><a class="navbar__link" href="/docs">Docs</a></li>
    <li><a class="navbar__cta navbar__cta--block" href="/signup">Get started</a></li>
  </ul>
</header>

<script>
  document.querySelectorAll('.navbar').forEach(function (root) {
    var toggle = root.querySelector('.navbar__toggle');
    var menu = root.querySelector('.navbar__menu');

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open main menu' : 'Close main menu');
      menu.hidden = open;
    });
  });
</script>`,
      css: `.navbar {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.navbar__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1rem;
  height: 3.5rem;
}

.navbar__brand {
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
  text-decoration: none;
  /* Pushes everything after it to the right without a spacer element. */
  margin-right: auto;
}

.navbar__links {
  display: none;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navbar__link {
  display: block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  /* #374151 on #fff is 10.3:1 - well past the 4.5:1 floor. */
  color: #374151;
  text-decoration: none;
}

.navbar__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/*
 * The active link is marked with aria-current in the markup, and the styling
 * hangs off that same attribute rather than a separate .is-active class - one
 * source of truth, so the highlight cannot drift out of step with what a
 * screen reader announces.
 */
.navbar__link[aria-current='page'] {
  background-color: #f3f4f6;
  color: #111827;
}

.navbar__cta {
  display: none;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.navbar__cta:hover {
  background-color: #1d4ed8;
}

.navbar__cta--block {
  display: block;
  text-align: center;
}

.navbar__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  cursor: pointer;
}

.navbar__toggle:hover {
  background-color: #f3f4f6;
}

.navbar__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.navbar__menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0.5rem 1rem 1rem;
  list-style: none;
  border-top: 1px solid #e5e7eb;
}

.navbar__brand:focus-visible,
.navbar__link:focus-visible,
.navbar__cta:focus-visible,
.navbar__toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Above 48rem the inline list replaces the hamburger entirely. */
@media (min-width: 48rem) {
  .navbar__links,
  .navbar__cta {
    display: flex;
  }

  .navbar__toggle,
  .navbar__menu {
    display: none;
  }
}

/*
 * The bar paints its own surface and every label sits on it, so dark mode has
 * to re-tune the surface, the border and all three text colours. The CTA is
 * the exception - it carries its own blue fill on either theme.
 */
@media (prefers-color-scheme: dark) {
  .navbar {
    background-color: #111827;
    border-bottom-color: #1f2937;
  }

  .navbar__brand {
    color: #f9fafb;
  }

  .navbar__link {
    color: #d1d5db;
  }

  .navbar__link:hover,
  .navbar__link[aria-current='page'] {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .navbar__toggle {
    color: #d1d5db;
  }

  .navbar__toggle:hover {
    background-color: #1f2937;
  }

  .navbar__menu {
    border-top-color: #1f2937;
  }

  .navbar__brand:focus-visible,
  .navbar__link:focus-visible,
  .navbar__cta:focus-visible,
  .navbar__toggle:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
    <a
      href="/"
      class="mr-auto text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Adysre
    </a>

    <ul class="hidden items-center gap-1 md:flex">
      <li>
        <a href="/product" aria-current="page" class="block rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-800 dark:text-gray-50 dark:focus-visible:ring-blue-400">
          Product
        </a>
      </li>
      <li>
        <a href="/pricing" class="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          Pricing
        </a>
      </li>
      <li>
        <a href="/docs" class="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          Docs
        </a>
      </li>
    </ul>

    <a
      href="/signup"
      class="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Get started
    </a>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="navbar-menu"
      aria-label="Open main menu"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>

  <ul id="navbar-menu" hidden class="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
    <li><a href="/product" aria-current="page" class="block rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50">Product</a></li>
    <li><a href="/pricing" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
    <li><a href="/docs" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a></li>
    <li><a href="/signup" class="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</a></li>
  </ul>
</header>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing', current: false },
  { href: '/docs', label: 'Docs', current: false },
];

const linkClass =
  'block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400';
const currentClass =
  'block rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-800 dark:text-gray-50 dark:focus-visible:ring-blue-400';

export function NavbarSimple({ ctaLabel = 'Get started', ctaHref = '/signup' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="/" className="mr-auto text-base font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={link.current ? currentClass : linkClass}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block"
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="navbar-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open && (
        <ul id="navbar-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={ctaHref} className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              {ctaLabel}
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}`,
      nextjs: `'use client';

// 'use client' is required: the hamburger holds open/closed state. The bar
// itself is otherwise static - if you drop the mobile menu, this renders fine
// as a Server Component.
import { useState } from 'react';

interface NavbarSimpleProps {
  ctaLabel?: string;
  ctaHref?: string;
}

const LINKS = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing', current: false },
  { href: '/docs', label: 'Docs', current: false },
];

export function NavbarSimple({ ctaLabel = 'Get started', ctaHref = '/signup' }: NavbarSimpleProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="/" className="mr-auto text-base font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block"
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="navbar-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open ? (
        <ul id="navbar-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={ctaHref} className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              {ctaLabel}
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarSimpleProps {
  /** Text of the trailing call-to-action. */
  ctaLabel?: string;
  /** Destination of the trailing call-to-action. */
  ctaHref?: string;
  /** Accessible name for the hamburger, in its closed state. */
  ariaLabel?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
  current?: boolean;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarSimple({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
  ariaLabel = 'Open main menu',
  className = '',
}: NavbarSimpleProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="/" className="mr-auto text-base font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="navbar-menu"
          aria-label={open ? 'Close main menu' : ariaLabel}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open ? (
        <ul
          id="navbar-menu"
          className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={ctaHref}
              className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {ctaLabel}
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-with-dropdown',
    category: 'navbar',
    tags: ['navbar', 'dropdown', 'submenu', 'keyboard', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-02',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.1.0',
    featured: true,
    stats: { views: 2480, copies: 611, downloads: 178 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
      { name: 'ctaLabel', type: 'string', default: "'Sign in'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/login'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A dropdown that opens on hover only is a mouse-only control. This one is a
  <button aria-haspopup="true" aria-expanded> that opens on click and on Enter,
  moves through items with the arrow keys, and closes on Escape returning focus
  to the trigger - the behaviour a native menu has on every platform.

  The submenu is a <ul> of plain links, not role="menu": these navigate
  somewhere, they are not commands, and role="menu" would make a screen reader
  announce them as application menu items and swallow the arrow keys.
-->
<header class="navdrop">
  <nav class="navdrop__inner" aria-label="Main">
    <a class="navdrop__brand" href="/">Adysre</a>

    <ul class="navdrop__links">
      <li class="navdrop__item">
        <button
          class="navdrop__trigger"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="navdrop-products"
        >
          Products
          <svg class="navdrop__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <ul class="navdrop__panel" id="navdrop-products" hidden>
          <li><a class="navdrop__option" href="/analytics">Analytics</a></li>
          <li><a class="navdrop__option" href="/automation">Automation</a></li>
          <li><a class="navdrop__option" href="/integrations">Integrations</a></li>
        </ul>
      </li>
      <li><a class="navdrop__link" href="/pricing">Pricing</a></li>
      <li><a class="navdrop__link" href="/docs">Docs</a></li>
    </ul>

    <a class="navdrop__cta" href="/login">Sign in</a>
  </nav>
</header>

<script>
  document.querySelectorAll('.navdrop__item').forEach(function (item) {
    var trigger = item.querySelector('.navdrop__trigger');
    var panel = item.querySelector('.navdrop__panel');
    var options = Array.prototype.slice.call(item.querySelectorAll('.navdrop__option'));

    function setOpen(open) {
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    trigger.addEventListener('click', function () {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
      if (!open && options[0]) options[0].focus();
    });

    item.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      if (document.activeElement === trigger && event.key === 'ArrowDown') {
        setOpen(true);
        if (options[0]) options[0].focus();
        return;
      }
      var index = options.indexOf(document.activeElement);
      if (index === -1) return;
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      options[(next + options.length) % options.length].focus();
    });

    document.addEventListener('click', function (event) {
      if (!item.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.navdrop {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.navdrop__inner {
  display: flex;
  /* Wrap, don't overflow: at 320px the link row drops below the brand rather
     than pushing the page sideways - min-height keeps the one-row look on
     wider screens. */
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 1rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  min-height: 3.5rem;
}

.navdrop__brand {
  margin-right: auto;
  font-weight: 700;
  color: #111827;
  text-decoration: none;
}

.navdrop__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The positioning context for the panel - without it the panel anchors to the
   page and drifts on scroll. */
.navdrop__item {
  position: relative;
}

.navdrop__link,
.navdrop__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
}

.navdrop__link:hover,
.navdrop__trigger:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.navdrop__chevron {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform 150ms;
}

/* The rotation hangs off aria-expanded, so the arrow cannot point the wrong way
   while a screen reader is told the opposite. */
.navdrop__trigger[aria-expanded='true'] .navdrop__chevron {
  transform: rotate(180deg);
}

.navdrop__panel {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  z-index: 20;
  min-width: 11rem;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.navdrop__option {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  text-decoration: none;
}

.navdrop__option:hover,
.navdrop__option:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

.navdrop__cta {
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.navdrop__brand:focus-visible,
.navdrop__link:focus-visible,
.navdrop__trigger:focus-visible,
.navdrop__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * The panel is a floating surface of its own - it needs a full dark treatment
 * or it stays a white card hanging off a dark bar.
 */
@media (prefers-color-scheme: dark) {
  .navdrop {
    background-color: #111827;
    border-bottom-color: #1f2937;
  }

  .navdrop__brand {
    color: #f9fafb;
  }

  .navdrop__link,
  .navdrop__trigger {
    color: #d1d5db;
  }

  .navdrop__link:hover,
  .navdrop__trigger:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .navdrop__panel {
    border-color: #374151;
    background-color: #1f2937;
  }

  .navdrop__option {
    color: #d1d5db;
  }

  .navdrop__option:hover,
  .navdrop__option:focus-visible {
    background-color: #374151;
    color: #f9fafb;
  }

  .navdrop__brand:focus-visible,
  .navdrop__link:focus-visible,
  .navdrop__trigger:focus-visible,
  .navdrop__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navdrop__chevron {
    transition: none;
  }
}`,
      tailwind: `<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <!-- min-h + flex-wrap, not a fixed h-14: at 320px the link row wraps under
       the brand instead of pushing the page sideways. -->
  <nav class="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
    <a href="/" class="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

    <ul class="flex flex-wrap items-center gap-1">
      <li class="relative">
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="navdrop-products"
          class="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Products
          <svg class="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <ul id="navdrop-products" hidden class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <li><a href="/analytics" class="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:bg-gray-700">Analytics</a></li>
          <li><a href="/automation" class="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:bg-gray-700">Automation</a></li>
          <li><a href="/integrations" class="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:bg-gray-700">Integrations</a></li>
        </ul>
      </li>
      <li><a href="/pricing" class="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Pricing</a></li>
      <li><a href="/docs" class="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a></li>
    </ul>

    <a href="/login" class="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Sign in
    </a>
  </nav>
</header>`,
      react: `import { useEffect, useRef, useState } from 'react';

const OPTIONS = ['Analytics', 'Automation', 'Integrations'];

export function NavbarWithDropdown({ onSelect, ctaLabel = 'Sign in', ctaHref = '/login' }) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef(null);
  const triggerRef = useRef(null);
  const optionsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!itemRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusOption(index) {
    const count = OPTIONS.length;
    optionsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (document.activeElement === triggerRef.current) {
      setOpen(true);
      window.requestAnimationFrame(() => focusOption(0));
      return;
    }
    const index = optionsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    focusOption(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <ul className="flex flex-wrap items-center gap-1">
          <li className="relative" ref={itemRef} onKeyDown={onKeyDown}>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="true"
              aria-expanded={open}
              aria-controls="navdrop-products"
              onClick={() => {
                const next = !open;
                setOpen(next);
                if (next) window.requestAnimationFrame(() => focusOption(0));
              }}
              className="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Products
              <svg
                className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
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
            </button>

            {open && (
              <ul
                id="navdrop-products"
                className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {OPTIONS.map((option, index) => (
                  <li key={option}>
                    <a
                      ref={(node) => {
                        optionsRef.current[index] = node;
                      }}
                      href={\`/\${option.toLowerCase()}\`}
                      onClick={() => {
                        onSelect?.(option);
                        setOpen(false);
                      }}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:bg-gray-700"
                    >
                      {option}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><a href="/pricing" className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Pricing</a></li>
          <li><a href="/docs" className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a></li>
        </ul>

        <a href={ctaHref} className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}`,
      nextjs: `'use client';

// 'use client' - the submenu is open/closed state plus keyboard handling.
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface NavbarWithDropdownProps {
  onSelect?: (item: string) => void;
  ctaLabel?: string;
  ctaHref?: string;
}

const OPTIONS = ['Analytics', 'Automation', 'Integrations'];

export function NavbarWithDropdown({
  onSelect,
  ctaLabel = 'Sign in',
  ctaHref = '/login',
}: NavbarWithDropdownProps) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!itemRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusOption(index: number): void {
    const count = OPTIONS.length;
    optionsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>): void {
    if (event.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (document.activeElement === triggerRef.current) {
      setOpen(true);
      window.requestAnimationFrame(() => focusOption(0));
      return;
    }
    const index = optionsRef.current.indexOf(document.activeElement as HTMLAnchorElement);
    if (index === -1) return;
    focusOption(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <ul className="flex flex-wrap items-center gap-1">
          <li className="relative" ref={itemRef} onKeyDown={onKeyDown}>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="true"
              aria-expanded={open}
              aria-controls="navdrop-products"
              onClick={() => {
                const next = !open;
                setOpen(next);
                if (next) window.requestAnimationFrame(() => focusOption(0));
              }}
              className="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Products
              <svg
                className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
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
            </button>

            {open ? (
              <ul
                id="navdrop-products"
                className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {OPTIONS.map((option, index) => (
                  <li key={option}>
                    <a
                      ref={(node) => {
                        optionsRef.current[index] = node;
                      }}
                      href={\`/\${option.toLowerCase()}\`}
                      onClick={() => {
                        onSelect?.(option);
                        setOpen(false);
                      }}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:bg-gray-700"
                    >
                      {option}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
          <li><a href="/pricing" className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Pricing</a></li>
          <li><a href="/docs" className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a></li>
        </ul>

        <a href={ctaHref} className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface NavbarWithDropdownProps {
  /** Fired with the submenu entry the user chose. */
  onSelect?: (item: string) => void;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const OPTIONS: readonly string[] = ['Analytics', 'Automation', 'Integrations'];

export function NavbarWithDropdown({
  onSelect,
  ctaLabel = 'Sign in',
  ctaHref = '/login',
  className = '',
}: NavbarWithDropdownProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!itemRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusOption(index: number): void {
    const count = OPTIONS.length;
    optionsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>): void {
    if (event.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (document.activeElement === triggerRef.current) {
      setOpen(true);
      window.requestAnimationFrame(() => focusOption(0));
      return;
    }
    const index = optionsRef.current.indexOf(document.activeElement as HTMLAnchorElement);
    if (index === -1) return;
    focusOption(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <header
      className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <nav className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="flex flex-wrap items-center gap-1">
          <li className="relative" ref={itemRef} onKeyDown={onKeyDown}>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="true"
              aria-expanded={open}
              aria-controls="navdrop-products"
              onClick={() => {
                const next = !open;
                setOpen(next);
                if (next) window.requestAnimationFrame(() => focusOption(0));
              }}
              className="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Products
              <svg
                className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
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
            </button>

            {open ? (
              <ul
                id="navdrop-products"
                className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {OPTIONS.map((option, index) => (
                  <li key={option}>
                    <a
                      ref={(node) => {
                        optionsRef.current[index] = node;
                      }}
                      href={\`/\${option.toLowerCase()}\`}
                      onClick={() => {
                        onSelect?.(option);
                        setOpen(false);
                      }}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:bg-gray-700"
                    >
                      {option}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
          <li>
            <a
              href="/pricing"
              className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="/docs"
              className="block rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              Docs
            </a>
          </li>
        </ul>

        <a
          href={ctaHref}
          className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-centered-logo',
    category: 'navbar',
    tags: ['navbar', 'centered', 'logo', 'grid', 'symmetric'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-21',
    updatedAt: '2026-06-29',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1560, copies: 402, downloads: 97 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Sign in'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/login'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Three columns, not a flex row with auto margins. The logo is centred against
  the *page*, not against whatever space the two link groups happen to leave -
  a 1fr/auto/1fr grid is the only layout that keeps it centred when "Sign in"
  becomes "Create free account" and the right column grows.

  The logo is inside the nav but is not a nav link; it goes home, so it sits
  outside the <ul>.
-->
<header class="navcentre">
  <nav class="navcentre__inner" aria-label="Main">
    <ul class="navcentre__group navcentre__group--start">
      <li><a class="navcentre__link" href="/product" aria-current="page">Product</a></li>
      <li><a class="navcentre__link" href="/pricing">Pricing</a></li>
    </ul>

    <a class="navcentre__brand" href="/">ADYSRE</a>

    <div class="navcentre__group navcentre__group--end">
      <a class="navcentre__link" href="/support">Support</a>
      <a class="navcentre__cta" href="/login">Sign in</a>
    </div>
  </nav>
</header>`,
      css: `.navcentre {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}

/*
 * 1fr auto 1fr is what centres the brand. With flex + justify-content:
 * space-between the logo drifts the moment the two side groups differ in
 * width - which they always do.
 */
.navcentre__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1rem;
  height: 3.5rem;
}

.navcentre__group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navcentre__group--end {
  justify-content: flex-end;
}

.navcentre__brand {
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: 0.08em;
  color: #111827;
  text-decoration: none;
  white-space: nowrap;
}

.navcentre__link {
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.navcentre__link:hover {
  color: #111827;
}

.navcentre__link[aria-current='page'] {
  color: #111827;
  text-decoration: underline;
  text-underline-offset: 0.35rem;
}

.navcentre__cta {
  padding: 0.375rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.navcentre__cta:hover {
  background-color: #f3f4f6;
}

.navcentre__brand:focus-visible,
.navcentre__link:focus-visible,
.navcentre__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Below 40rem there is no room for three columns - the side groups collapse
   and the brand stays centred on its own. */
@media (max-width: 40rem) {
  .navcentre__group--start {
    display: none;
  }

  .navcentre__inner {
    grid-template-columns: 1fr auto 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .navcentre {
    background-color: #111827;
    border-bottom-color: #1f2937;
  }

  .navcentre__brand {
    color: #f9fafb;
  }

  .navcentre__link {
    color: #d1d5db;
  }

  .navcentre__link:hover,
  .navcentre__link[aria-current='page'] {
    color: #f9fafb;
  }

  .navcentre__cta {
    border-color: #374151;
    color: #f9fafb;
  }

  .navcentre__cta:hover {
    background-color: #1f2937;
  }

  .navcentre__brand:focus-visible,
  .navcentre__link:focus-visible,
  .navcentre__cta:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav class="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4" aria-label="Main">
    <ul class="hidden items-center gap-2 sm:flex">
      <li>
        <a href="/product" aria-current="page" class="rounded-md px-2 py-1.5 text-sm font-medium text-gray-900 underline underline-offset-[0.35rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">
          Product
        </a>
      </li>
      <li>
        <a href="/pricing" class="rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
          Pricing
        </a>
      </li>
    </ul>

    <a href="/" class="whitespace-nowrap text-lg font-bold tracking-[0.08em] text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      ADYSRE
    </a>

    <div class="flex items-center justify-end gap-2">
      <a href="/support" class="hidden rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 sm:block dark:text-gray-300 dark:hover:text-gray-50">
        Support
      </a>
      <a href="/login" class="rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        Sign in
      </a>
    </div>
  </nav>
</header>`,
      react: `export function NavbarCenteredLogo({ ctaLabel = 'Sign in', ctaHref = '/login' }) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav
        className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4"
        aria-label="Main"
      >
        <ul className="hidden items-center gap-2 sm:flex">
          <li>
            <a
              href="/product"
              aria-current="page"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-900 underline underline-offset-[0.35rem] dark:text-gray-50"
            >
              Product
            </a>
          </li>
          <li>
            <a
              href="/pricing"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            >
              Pricing
            </a>
          </li>
        </ul>

        <a href="/" className="whitespace-nowrap text-lg font-bold tracking-[0.08em] text-gray-900 dark:text-gray-50">
          ADYSRE
        </a>

        <div className="flex items-center justify-end gap-2">
          <a
            href="/support"
            className="hidden rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 sm:block dark:text-gray-300 dark:hover:text-gray-50"
          >
            Support
          </a>
          <a
            href={ctaHref}
            className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800"
          >
            {ctaLabel}
          </a>
        </div>
      </nav>
    </header>
  );
}`,
      nextjs: `interface NavbarCenteredLogoProps {
  ctaLabel?: string;
  ctaHref?: string;
}

// No 'use client' - this bar holds no state. The layout is a CSS grid and the
// hover states are pure CSS, so it renders as a Server Component.
export function NavbarCenteredLogo({
  ctaLabel = 'Sign in',
  ctaHref = '/login',
}: NavbarCenteredLogoProps) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav
        className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4"
        aria-label="Main"
      >
        <ul className="hidden items-center gap-2 sm:flex">
          <li>
            <a
              href="/product"
              aria-current="page"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-900 underline underline-offset-[0.35rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Product
            </a>
          </li>
          <li>
            <a
              href="/pricing"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Pricing
            </a>
          </li>
        </ul>

        <a
          href="/"
          className="whitespace-nowrap text-lg font-bold tracking-[0.08em] text-gray-900 dark:text-gray-50"
        >
          ADYSRE
        </a>

        <div className="flex items-center justify-end gap-2">
          <a
            href="/support"
            className="hidden rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 sm:block dark:text-gray-300 dark:hover:text-gray-50"
          >
            Support
          </a>
          <a
            href={ctaHref}
            className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800"
          >
            {ctaLabel}
          </a>
        </div>
      </nav>
    </header>
  );
}`,
      typescript: `export interface NavbarCenteredLogoProps {
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function NavbarCenteredLogo({
  ctaLabel = 'Sign in',
  ctaHref = '/login',
  className = '',
}: NavbarCenteredLogoProps): JSX.Element {
  return (
    <header
      className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <nav
        className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4"
        aria-label="Main"
      >
        <ul className="hidden items-center gap-2 sm:flex">
          <li>
            <a
              href="/product"
              aria-current="page"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-900 underline underline-offset-[0.35rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Product
            </a>
          </li>
          <li>
            <a
              href="/pricing"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Pricing
            </a>
          </li>
        </ul>

        <a
          href="/"
          className="whitespace-nowrap text-lg font-bold tracking-[0.08em] text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          ADYSRE
        </a>

        <div className="flex items-center justify-end gap-2">
          <a
            href="/support"
            className="hidden rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 sm:block dark:text-gray-300 dark:hover:text-gray-50"
          >
            Support
          </a>
          <a
            href={ctaHref}
            className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            {ctaLabel}
          </a>
        </div>
      </nav>
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-sticky-blur',
    category: 'navbar',
    tags: ['navbar', 'sticky', 'blur', 'scroll', 'glassmorphism'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2050, copies: 528, downloads: 143 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/signup'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Sticky + translucent, and the border only appears once the page has moved.
  At the top of a page the bar and the hero are one surface, so a hairline
  there is a seam with nothing on either side of it; the moment content slides
  underneath, that same hairline is what stops the bar dissolving into it.

  The blur is a progressive enhancement - the background colour is opaque
  enough on its own that a browser without backdrop-filter still renders a
  legible bar rather than text over content.
-->
<header class="navsticky" data-scrolled="false">
  <nav class="navsticky__inner" aria-label="Main">
    <a class="navsticky__brand" href="/">Adysre</a>

    <ul class="navsticky__links">
      <li><a class="navsticky__link" href="/features">Features</a></li>
      <li><a class="navsticky__link" href="/pricing">Pricing</a></li>
      <li><a class="navsticky__link" href="/blog">Blog</a></li>
    </ul>

    <a class="navsticky__cta" href="/signup">Get started</a>
  </nav>
</header>

<script>
  document.querySelectorAll('.navsticky').forEach(function (bar) {
    function update() {
      bar.dataset.scrolled = String(window.scrollY > 8);
    }
    update();
    // passive: this listener never calls preventDefault, and saying so keeps it
    // off the scrolling critical path.
    window.addEventListener('scroll', update, { passive: true });
  });
</script>`,
      css: `.navsticky {
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: rgba(255, 255, 255, 0.75);
  /* -webkit- first for Safari, which shipped it years before the unprefixed
     property. */
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 200ms, background-color 200ms;
}

/* The state is a data attribute, not a class, so the JS sets one value rather
   than juggling add/remove. */
.navsticky[data-scrolled='true'] {
  border-bottom-color: #e5e7eb;
  background-color: rgba(255, 255, 255, 0.85);
}

.navsticky__inner {
  display: flex;
  /* Wrap, don't overflow: the links stay visible at every width, so at 320px
     they wrap under the brand instead of forcing a horizontal scrollbar. */
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 1rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  min-height: 3.5rem;
}

.navsticky__brand {
  margin-right: auto;
  font-weight: 700;
  color: #111827;
  text-decoration: none;
}

.navsticky__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navsticky__link {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.navsticky__link:hover {
  background-color: rgba(17, 24, 39, 0.06);
  color: #111827;
}

.navsticky__cta {
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  background-color: #111827;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.navsticky__brand:focus-visible,
.navsticky__link:focus-visible,
.navsticky__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * Both the tint and the labels sit over whatever is scrolling past, so both
 * have to flip. The alpha stays high enough that text over a busy hero still
 * clears 4.5:1 - a prettier, more transparent bar is an unreadable one.
 */
@media (prefers-color-scheme: dark) {
  .navsticky {
    background-color: rgba(17, 24, 39, 0.75);
  }

  .navsticky[data-scrolled='true'] {
    border-bottom-color: #1f2937;
    background-color: rgba(17, 24, 39, 0.85);
  }

  .navsticky__brand {
    color: #f9fafb;
  }

  .navsticky__link {
    color: #d1d5db;
  }

  .navsticky__link:hover {
    background-color: rgba(249, 250, 251, 0.08);
    color: #f9fafb;
  }

  .navsticky__cta {
    background-color: #f9fafb;
    color: #111827;
  }

  .navsticky__brand:focus-visible,
  .navsticky__link:focus-visible,
  .navsticky__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navsticky {
    transition: none;
  }
}`,
      tailwind: `<!-- data-scrolled is toggled by the script; the border is driven off it. -->
<header
  data-scrolled="false"
  class="sticky top-0 z-30 border-b border-transparent bg-white/75 backdrop-blur-md transition-colors data-[scrolled=true]:border-gray-200 data-[scrolled=true]:bg-white/85 motion-reduce:transition-none dark:bg-gray-900/75 dark:data-[scrolled=true]:border-gray-800 dark:data-[scrolled=true]:bg-gray-900/85"
>
  <!-- min-h + flex-wrap so the always-visible link row wraps at 320px instead
       of overflowing the viewport. -->
  <nav class="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
    <a href="/" class="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">
      Adysre
    </a>

    <ul class="flex flex-wrap items-center gap-1">
      <li><a href="/features" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-50/10 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Features</a></li>
      <li><a href="/pricing" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-50/10 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Pricing</a></li>
      <li><a href="/blog" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-50/10 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Blog</a></li>
    </ul>

    <a href="/signup" class="rounded-lg bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Get started
    </a>
  </nav>
</header>`,
      react: `import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

export function NavbarStickyBlur({ ctaLabel = 'Get started', ctaHref = '/signup' }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-30 border-b border-transparent bg-white/75 backdrop-blur-md transition-colors data-[scrolled=true]:border-gray-200 data-[scrolled=true]:bg-white/85 motion-reduce:transition-none dark:bg-gray-900/75 dark:data-[scrolled=true]:border-gray-800 dark:data-[scrolled=true]:bg-gray-900/85"
    >
      <nav className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <ul className="flex flex-wrap items-center gap-1">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-50/10 dark:hover:text-gray-50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="rounded-lg bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}`,
      nextjs: `'use client';

// 'use client' - the bar reads window.scrollY, which does not exist on the
// server. Everything above the scroll listener is static markup.
import { useEffect, useState } from 'react';

interface NavbarStickyBlurProps {
  ctaLabel?: string;
  ctaHref?: string;
}

const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

export function NavbarStickyBlur({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
}: NavbarStickyBlurProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-30 border-b border-transparent bg-white/75 backdrop-blur-md transition-colors data-[scrolled=true]:border-gray-200 data-[scrolled=true]:bg-white/85 motion-reduce:transition-none dark:bg-gray-900/75 dark:data-[scrolled=true]:border-gray-800 dark:data-[scrolled=true]:bg-gray-900/85"
    >
      <nav className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="flex flex-wrap items-center gap-1">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-50/10 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="rounded-lg bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}`,
      typescript: `import { useEffect, useState } from 'react';

export interface NavbarStickyBlurProps {
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

/** Pixels of scroll before the bar earns its border. */
const SCROLL_THRESHOLD = 8;

export function NavbarStickyBlur({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
  className = '',
}: NavbarStickyBlurProps): JSX.Element {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll(): void {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={\`sticky top-0 z-30 border-b border-transparent bg-white/75 backdrop-blur-md transition-colors data-[scrolled=true]:border-gray-200 data-[scrolled=true]:bg-white/85 motion-reduce:transition-none dark:bg-gray-900/75 dark:data-[scrolled=true]:border-gray-800 dark:data-[scrolled=true]:bg-gray-900/85 \${className}\`}
    >
      <nav className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2" aria-label="Main">
        <a
          href="/"
          className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <ul className="flex flex-wrap items-center gap-1">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-50/10 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="rounded-lg bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-mobile-drawer',
    category: 'navbar',
    tags: ['navbar', 'drawer', 'mobile', 'focus-trap', 'dialog'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-25',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1390, copies: 344, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'ariaLabel', type: 'string', default: "'Open main menu'", descriptionKey: 'ariaLabel' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/signup'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A drawer is a modal, and a modal that only *looks* modal is the classic
  half-built one: the page behind it still takes Tab, so a keyboard user walks
  straight out of the open drawer into links they cannot see. Three things fix
  that, and all three are required -

  1. role="dialog" aria-modal="true", so it is announced as a dialog.
  2. A focus trap: Tab off the last item wraps to the first, Shift+Tab off the
     first wraps to the last.
  3. Escape closes it and focus returns to the button that opened it, so the
     user is put back where they were rather than at the top of the document.

  Scroll lock is the fourth: without overflow:hidden on <body> the page behind
  scrolls under your finger while the drawer sits still.
-->
<header class="navdrawer">
  <div class="navdrawer__bar">
    <a class="navdrawer__brand" href="/">Adysre</a>
    <button
      class="navdrawer__toggle"
      type="button"
      aria-expanded="false"
      aria-controls="navdrawer-panel"
      aria-label="Open main menu"
    >
      <svg class="navdrawer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <div class="navdrawer__overlay" hidden></div>

  <div class="navdrawer__panel" id="navdrawer-panel" role="dialog" aria-modal="true" aria-label="Main menu" hidden>
    <div class="navdrawer__panel-head">
      <span class="navdrawer__panel-title">Menu</span>
      <button class="navdrawer__close" type="button" aria-label="Close main menu">
        <svg class="navdrawer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <nav aria-label="Main">
      <ul class="navdrawer__links">
        <li><a class="navdrawer__link" href="/product" aria-current="page">Product</a></li>
        <li><a class="navdrawer__link" href="/pricing">Pricing</a></li>
        <li><a class="navdrawer__link" href="/docs">Docs</a></li>
      </ul>
    </nav>

    <a class="navdrawer__cta" href="/signup">Get started</a>
  </div>
</header>

<script>
  document.querySelectorAll('.navdrawer').forEach(function (root) {
    var toggle = root.querySelector('.navdrawer__toggle');
    var close = root.querySelector('.navdrawer__close');
    var overlay = root.querySelector('.navdrawer__overlay');
    var panel = root.querySelector('.navdrawer__panel');

    function focusables() {
      return Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function setOpen(open) {
      panel.hidden = !open;
      overlay.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      // Scroll lock: without this the page scrolls behind the open drawer.
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = focusables()[0];
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(true);
    });
    close.addEventListener('click', function () {
      setOpen(false);
    });
    overlay.addEventListener('click', function () {
      setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (panel.hidden) return;

      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      // The trap. Tab past the last item wraps to the first; Shift+Tab before
      // the first wraps to the last.
      var items = focusables();
      if (items.length === 0) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });
</script>`,
      css: `.navdrawer__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  padding: 0 1rem;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.navdrawer__brand {
  font-weight: 700;
  color: #111827;
  text-decoration: none;
}

.navdrawer__toggle,
.navdrawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  cursor: pointer;
}

.navdrawer__toggle:hover,
.navdrawer__close:hover {
  background-color: #f3f4f6;
}

.navdrawer__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.navdrawer__overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgba(17, 24, 39, 0.5);
}

.navdrawer__panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(18rem, 85vw);
  padding: 1rem;
  background-color: #fff;
  border-left: 1px solid #e5e7eb;
  animation: navdrawer-in 200ms ease-out;
}

@keyframes navdrawer-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.navdrawer__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navdrawer__panel-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  /* #6b7280 on #fff is 4.8:1 - over the line even at this size. */
  color: #6b7280;
}

.navdrawer__links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navdrawer__link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.navdrawer__link:hover,
.navdrawer__link[aria-current='page'] {
  background-color: #f3f4f6;
  color: #111827;
}

.navdrawer__cta {
  margin-top: auto;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.navdrawer__brand:focus-visible,
.navdrawer__link:focus-visible,
.navdrawer__cta:focus-visible,
.navdrawer__toggle:focus-visible,
.navdrawer__close:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .navdrawer__bar {
    background-color: #111827;
    border-bottom-color: #1f2937;
  }

  .navdrawer__brand {
    color: #f9fafb;
  }

  .navdrawer__toggle,
  .navdrawer__close {
    color: #d1d5db;
  }

  .navdrawer__toggle:hover,
  .navdrawer__close:hover {
    background-color: #1f2937;
  }

  .navdrawer__overlay {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .navdrawer__panel {
    background-color: #111827;
    border-left-color: #1f2937;
  }

  .navdrawer__panel-title {
    color: #9ca3af;
  }

  .navdrawer__link {
    color: #d1d5db;
  }

  .navdrawer__link:hover,
  .navdrawer__link[aria-current='page'] {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .navdrawer__brand:focus-visible,
  .navdrawer__link:focus-visible,
  .navdrawer__cta:focus-visible,
  .navdrawer__toggle:focus-visible,
  .navdrawer__close:focus-visible {
    outline-color: #60a5fa;
  }
}

/* The slide is decoration. Someone who asked for less motion still gets the
   drawer - it simply arrives. */
@media (prefers-reduced-motion: reduce) {
  .navdrawer__panel {
    animation: none;
  }
}`,
      tailwind: `<header>
  <div class="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
    <a href="/" class="font-bold text-gray-900 dark:text-gray-50">Adysre</a>
    <button
      type="button"
      aria-expanded="false"
      aria-controls="navdrawer-panel"
      aria-label="Open main menu"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <div hidden class="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70"></div>

  <div
    id="navdrawer-panel"
    role="dialog"
    aria-modal="true"
    aria-label="Main menu"
    hidden
    class="fixed inset-y-0 right-0 z-50 flex w-[min(18rem,85vw)] flex-col gap-4 border-l border-gray-200 bg-white p-4 motion-safe:animate-[navdrawer-in_200ms_ease-out] dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">Menu</span>
      <button type="button" aria-label="Close main menu" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <nav aria-label="Main">
      <ul class="flex flex-col gap-1">
        <li><a href="/product" aria-current="page" class="block rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50">Product</a></li>
        <li><a href="/pricing" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
        <li><a href="/docs" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a></li>
      </ul>
    </nav>

    <a href="/signup" class="mt-auto rounded-lg bg-blue-600 px-3.5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
      Get started
    </a>
  </div>
</header>`,
      react: `import { useCallback, useEffect, useRef, useState } from 'react';

const LINKS = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing', current: false },
  { href: '/docs', label: 'Docs', current: false },
];

export function NavbarMobileDrawer({ ctaLabel = 'Get started', ctaHref = '/signup' }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    // Scroll lock - the page must not move behind the open drawer.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function focusables() {
      if (!panelRef.current) return [];
      return Array.from(panelRef.current.querySelectorAll('a[href], button:not([disabled])'));
    }

    focusables()[0]?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <header>
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <a href="/" className="font-bold text-gray-900 dark:text-gray-50">Adysre</a>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="navdrawer-panel"
          aria-label="Open main menu"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="navdrawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(18rem,85vw)] flex-col gap-4 border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close main menu"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Main">
              <ul className="flex flex-col gap-1">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={link.current ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={ctaHref}
              className="mt-auto rounded-lg bg-blue-600 px-3.5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {ctaLabel}
            </a>
          </div>
        </>
      )}
    </header>
  );
}`,
      nextjs: `'use client';

// 'use client' - open state, a focus trap and a scroll lock all need the DOM.
import { useCallback, useEffect, useRef, useState } from 'react';

interface NavbarMobileDrawerProps {
  ctaLabel?: string;
  ctaHref?: string;
}

const LINKS = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing', current: false },
  { href: '/docs', label: 'Docs', current: false },
];

export function NavbarMobileDrawer({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
}: NavbarMobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function focusables(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
    }

    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <header>
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <a href="/" className="font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="navdrawer-panel"
          aria-label="Open main menu"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="navdrawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(18rem,85vw)] flex-col gap-4 border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close main menu"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Main">
              <ul className="flex flex-col gap-1">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={link.current ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={ctaHref}
              className="mt-auto rounded-lg bg-blue-600 px-3.5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {ctaLabel}
            </a>
          </div>
        </>
      ) : null}
    </header>
  );
}`,
      typescript: `import { useCallback, useEffect, useRef, useState } from 'react';

export interface NavbarMobileDrawerProps {
  /** Accessible name for the hamburger. */
  ariaLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
  current?: boolean;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarMobileDrawer({
  ariaLabel = 'Open main menu',
  ctaLabel = 'Get started',
  ctaHref = '/signup',
  className = '',
}: NavbarMobileDrawerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Focus goes back to the button that opened the drawer - not to the top of
    // the document, which is where the browser would otherwise dump it.
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function focusables(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
    }

    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <header className={className}>
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <a
          href="/"
          className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="navdrawer-panel"
          aria-label={ariaLabel}
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={close} />
          <div
            ref={panelRef}
            id="navdrawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(18rem,85vw)] flex-col gap-4 border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close main menu"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Main">
              <ul className="flex flex-col gap-1">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={link.current ? 'page' : undefined}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={ctaHref}
              className="mt-auto rounded-lg bg-blue-600 px-3.5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {ctaLabel}
            </a>
          </div>
        </>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-mega-menu',
    category: 'navbar',
    tags: ['navbar', 'mega-menu', 'panel', 'dropdown', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 310, copies: 84, downloads: 22 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/signup'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two panels, two audiences. Above lg the Products button opens a full-bleed
  mega panel whose grid re-caps to the same max-w-6xl as the bar, so the
  columns line up with the nav. Below lg the hamburger opens a flat, headed
  list - the same destinations, no floating surface to mis-tap on a phone.
-->
<header class="relative border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
    <a href="/" class="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <div class="hidden items-center gap-1 lg:flex">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded="false"
        aria-controls="mega-panel"
        class="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
      >
        Products
        <svg class="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <a href="/pricing" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Pricing</a>
      <a href="/docs" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">Docs</a>
    </div>

    <a href="/signup" class="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started</a>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="mega-mobile-menu"
      aria-label="Open main menu"
      class="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </nav>

  <div id="mega-panel" hidden class="absolute inset-x-0 top-full z-30 border-b border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
    <ul class="mx-auto grid max-w-6xl gap-2 px-4 py-6 lg:grid-cols-2">
      <li>
        <a href="/analytics" class="block rounded-lg p-3 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block text-sm font-semibold text-gray-900 dark:text-gray-50">Analytics</span>
          <span class="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">Traffic, funnels and retention in one view.</span>
        </a>
      </li>
      <li>
        <a href="/automation" class="block rounded-lg p-3 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block text-sm font-semibold text-gray-900 dark:text-gray-50">Automation</span>
          <span class="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">Trigger workflows from any event.</span>
        </a>
      </li>
      <li>
        <a href="/payments" class="block rounded-lg p-3 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block text-sm font-semibold text-gray-900 dark:text-gray-50">Payments</span>
          <span class="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">Checkout, invoicing and billing APIs.</span>
        </a>
      </li>
      <li>
        <a href="/security" class="block rounded-lg p-3 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span class="block text-sm font-semibold text-gray-900 dark:text-gray-50">Security</span>
          <span class="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">SSO, audit logs and scoped access.</span>
        </a>
      </li>
    </ul>
  </div>

  <div id="mega-mobile-menu" hidden class="border-t border-gray-200 px-4 pb-4 pt-2 dark:border-gray-800">
    <p class="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Products</p>
    <ul class="flex flex-col gap-1">
      <li><a href="/analytics" class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Analytics</a></li>
      <li><a href="/automation" class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Automation</a></li>
      <li><a href="/payments" class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Payments</a></li>
      <li><a href="/security" class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Security</a></li>
    </ul>
    <ul class="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
      <li><a href="/pricing" class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
      <li><a href="/docs" class="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a></li>
      <li><a href="/signup" class="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</a></li>
    </ul>
  </div>
</header>`,
      react: `import { useEffect, useRef, useState } from 'react';

const MEGA_ITEMS = [
  { href: '/analytics', title: 'Analytics', description: 'Traffic, funnels and retention in one view.' },
  { href: '/automation', title: 'Automation', description: 'Trigger workflows from any event.' },
  { href: '/payments', title: 'Payments', description: 'Checkout, invoicing and billing APIs.' },
  { href: '/security', title: 'Security', description: 'SSO, audit logs and scoped access.' },
];

const LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarMegaMenu({ ctaLabel = 'Get started', ctaHref = '/signup' }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!megaOpen) return undefined;
    function onPointerDown(event) {
      if (!headerRef.current?.contains(event.target)) setMegaOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [megaOpen]);

  return (
    <header
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && megaOpen) {
          setMegaOpen(false);
          triggerRef.current?.focus();
        }
      }}
      className="relative border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="true"
            aria-expanded={megaOpen}
            aria-controls="mega-panel"
            onClick={() => setMegaOpen((value) => !value)}
            className="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Products
            <svg className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400">
              {link.label}
            </a>
          ))}
        </div>

        <a href={ctaHref} className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 lg:block">
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mega-mobile-menu"
          aria-label={mobileOpen ? 'Close main menu' : 'Open main menu'}
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {megaOpen && (
        <div id="mega-panel" className="absolute inset-x-0 top-full z-30 hidden border-b border-gray-200 bg-white shadow-lg lg:block dark:border-gray-800 dark:bg-gray-900">
          <ul className="mx-auto grid max-w-6xl gap-2 px-4 py-6 lg:grid-cols-2">
            {MEGA_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="block rounded-lg p-3 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">{item.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mobileOpen && (
        <div id="mega-mobile-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 lg:hidden dark:border-gray-800">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Products
          </p>
          <ul className="flex flex-col gap-1">
            {MEGA_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={ctaHref} className="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">
                {ctaLabel}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';

export interface NavbarMegaMenuProps {
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface MegaItem {
  href: string;
  title: string;
  description: string;
}

const MEGA_ITEMS: readonly MegaItem[] = [
  { href: '/analytics', title: 'Analytics', description: 'Traffic, funnels and retention in one view.' },
  { href: '/automation', title: 'Automation', description: 'Trigger workflows from any event.' },
  { href: '/payments', title: 'Payments', description: 'Checkout, invoicing and billing APIs.' },
  { href: '/security', title: 'Security', description: 'SSO, audit logs and scoped access.' },
];

const LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
] as const;

export function NavbarMegaMenu({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
  className = '',
}: NavbarMegaMenuProps): JSX.Element {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Outside click closes the mega panel - it is a light dismiss surface, not a
  // modal, so it must never trap focus or block the page.
  useEffect(() => {
    if (!megaOpen) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMegaOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [megaOpen]);

  return (
    <header
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && megaOpen) {
          setMegaOpen(false);
          triggerRef.current?.focus();
        }
      }}
      className={\`relative border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a
          href="/"
          className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="true"
            aria-expanded={megaOpen}
            aria-controls="mega-panel"
            onClick={() => setMegaOpen((value) => !value)}
            className="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Products
            <svg
              className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
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
          </button>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={ctaHref}
          className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mega-mobile-menu"
          aria-label={mobileOpen ? 'Close main menu' : 'Open main menu'}
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {megaOpen ? (
        <div
          id="mega-panel"
          className="absolute inset-x-0 top-full z-30 hidden border-b border-gray-200 bg-white shadow-lg lg:block dark:border-gray-800 dark:bg-gray-900"
        >
          {/* Full-bleed surface, re-capped grid: the panel spans the viewport
              but its columns line up with the nav above. */}
          <ul className="mx-auto grid max-w-6xl gap-2 px-4 py-6 lg:grid-cols-2">
            {MEGA_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-lg p-3 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                >
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">{item.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {mobileOpen ? (
        <div id="mega-mobile-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 lg:hidden dark:border-gray-800">
          {/* On a phone the mega grid flattens to a headed list - same
              destinations, no floating panel to mis-tap. */}
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Products
          </p>
          <ul className="flex flex-col gap-1">
            {MEGA_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={ctaHref}
                className="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                {ctaLabel}
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-with-search',
    category: 'navbar',
    tags: ['navbar', 'search', 'input', 'responsive', 'header'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'onSearch', type: '(query: string) => void', descriptionKey: 'onSearch' },
      { name: 'searchPlaceholder', type: 'string', default: "'Search'", descriptionKey: 'searchPlaceholder' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The search field is a real <form role="search"> with a labelled <input>, not a
  styled div - Enter submits and a screen reader announces the search landmark.
  The field flexes with min-w-0 so it never pushes the row past 320px; the link
  strip collapses into the hamburger panel below md.
-->
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4">
    <a href="/" class="shrink-0 font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <form role="search" class="relative min-w-0 flex-1 sm:max-w-xs" onsubmit="return false">
      <label for="nav-search" class="sr-only">Search</label>
      <svg class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input id="nav-search" type="search" name="q" placeholder="Search" class="h-9 w-full rounded-lg border border-gray-300 bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400" />
    </form>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
      <a href="/pricing" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Pricing</a>
      <a href="/docs" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a>
    </nav>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="nav-search-menu"
      aria-label="Open main menu"
      class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </div>

  <nav id="nav-search-menu" hidden class="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
    <a href="/pricing" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a>
    <a href="/docs" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a>
  </nav>
</header>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarWithSearch({ onSearch, searchPlaceholder = 'Search' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4">
        <a href="/" className="shrink-0 font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <form
          role="search"
          className="relative min-w-0 flex-1 sm:max-w-xs"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch?.(query);
          }}
        >
          <label htmlFor="nav-search" className="sr-only">Search</label>
          <svg className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="nav-search"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-gray-300 bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
          />
        </form>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-search-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open && (
        <nav id="nav-search-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}`,
      typescript: `import { useState } from 'react';
import type { FormEvent } from 'react';

export interface NavbarWithSearchProps {
  /** Fired with the query when the search form is submitted. */
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarWithSearch({
  onSearch,
  searchPlaceholder = 'Search',
  className = '',
}: NavbarWithSearchProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch?.(query);
  }

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4">
        <a
          href="/"
          className="shrink-0 font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        {/* min-w-0 lets the field shrink below its content width so the row
            never overflows at 320px. */}
        <form role="search" className="relative min-w-0 flex-1 sm:max-w-xs" onSubmit={onSubmit}>
          <label htmlFor="nav-search" className="sr-only">
            Search
          </label>
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="nav-search"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-gray-300 bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
          />
        </form>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-search-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="nav-search-menu"
          className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800"
          aria-label="Main"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-ecommerce-icons',
    category: 'navbar',
    tags: ['navbar', 'ecommerce', 'cart', 'icons', 'badge'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'cartCount', type: 'number', default: '0', descriptionKey: 'cartCount' },
      { name: 'onCartClick', type: '() => void', descriptionKey: 'onCartClick' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A commerce header keeps the account and cart icons on the bar at every width -
  losing your cart behind a hamburger costs conversions - and collapses only the
  category links. The cart count is exposed to assistive tech with an aria-label
  on the button, not just the visual badge.
-->
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
    <a href="/" class="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Shoply</a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
      <a href="/new" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">New</a>
      <a href="/women" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Women</a>
      <a href="/men" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Men</a>
    </nav>

    <div class="flex items-center gap-1">
      <a href="/account" aria-label="Account" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
      </a>

      <a href="/cart" aria-label="Cart, 3 items" class="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L22 7H6" /></svg>
        <span aria-hidden="true" class="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[0.625rem] font-semibold text-white">3</span>
      </a>

      <button
        type="button"
        aria-expanded="false"
        aria-controls="nav-shop-menu"
        aria-label="Open main menu"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </div>
  </div>

  <nav id="nav-shop-menu" hidden class="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
    <a href="/new" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">New</a>
    <a href="/women" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Women</a>
    <a href="/men" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Men</a>
  </nav>
</header>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/new', label: 'New' },
  { href: '/women', label: 'Women' },
  { href: '/men', label: 'Men' },
];

export function NavbarEcommerceIcons({ cartCount = 0, onCartClick }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Shoply</a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a href="/account" aria-label="Account" className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </a>

          <button
            type="button"
            onClick={onCartClick}
            aria-label={\`Cart, \${cartCount} \${cartCount === 1 ? 'item' : 'items'}\`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L22 7H6" />
            </svg>
            {cartCount > 0 && (
              <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[0.625rem] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-shop-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="nav-shop-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarEcommerceIconsProps {
  /** Item count shown on the cart badge and announced to assistive tech. */
  cartCount?: number;
  onCartClick?: () => void;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '/new', label: 'New' },
  { href: '/women', label: 'Women' },
  { href: '/men', label: 'Men' },
];

export function NavbarEcommerceIcons({
  cartCount = 0,
  onCartClick,
  className = '',
}: NavbarEcommerceIconsProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a
          href="/"
          className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Shoply
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Account and cart stay on the bar at every width - a cart hidden
            behind a hamburger is a cart nobody finds. */}
        <div className="flex items-center gap-1">
          <a
            href="/account"
            aria-label="Account"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </a>

          <button
            type="button"
            onClick={onCartClick}
            aria-label={\`Cart, \${cartCount} \${cartCount === 1 ? 'item' : 'items'}\`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L22 7H6" />
            </svg>
            {cartCount > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[0.625rem] font-semibold text-white"
              >
                {cartCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-shop-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="nav-shop-menu"
          className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800"
          aria-label="Main"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-double-decker',
    category: 'navbar',
    tags: ['navbar', 'two-row', 'utility', 'topbar', 'responsive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/signup'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A utility strip over the main bar. The thin top row carries low-priority links
  (support, contact) and is hidden below md; on a phone those same links live at
  the foot of the hamburger panel, so nothing is lost, it just relocates.
-->
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="hidden border-b border-gray-200 bg-gray-50 md:block dark:border-gray-800 dark:bg-gray-950">
    <div class="mx-auto flex h-9 max-w-6xl items-center justify-end gap-4 px-4">
      <a href="/support" class="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Support</a>
      <a href="/contact" class="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Contact</a>
      <a href="/login" class="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Sign in</a>
    </div>
  </div>

  <div class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
    <a href="/" class="mr-auto text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
      <a href="/product" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Product</a>
      <a href="/pricing" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Pricing</a>
      <a href="/docs" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a>
    </nav>

    <a href="/signup" class="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">Get started</a>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="nav-dd-menu"
      aria-label="Open main menu"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </div>

  <div id="nav-dd-menu" hidden class="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
    <nav class="flex flex-col gap-1" aria-label="Main">
      <a href="/product" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Product</a>
      <a href="/pricing" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a>
      <a href="/docs" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a>
    </nav>
    <div class="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
      <a href="/support" class="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">Support</a>
      <a href="/contact" class="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">Contact</a>
      <a href="/signup" class="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</a>
    </div>
  </div>
</header>`,
      react: `import { useState } from 'react';

const MAIN_LINKS = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

const UTILITY_LINKS = [
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
  { href: '/login', label: 'Sign in' },
];

export function NavbarDoubleDecker({ ctaLabel = 'Get started', ctaHref = '/signup' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="hidden border-b border-gray-200 bg-gray-50 md:block dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-end gap-4 px-4">
          {UTILITY_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a href="/" className="mr-auto text-base font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
              {link.label}
            </a>
          ))}
        </nav>

        <a href={ctaHref} className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-dd-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open && (
        <div id="nav-dd-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          <nav className="flex flex-col gap-1" aria-label="Main">
            {MAIN_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
            {UTILITY_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                {link.label}
              </a>
            ))}
            <a href={ctaHref} className="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              {ctaLabel}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarDoubleDeckerProps {
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
}

const MAIN_LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

const UTILITY_LINKS: readonly NavLink[] = [
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
  { href: '/login', label: 'Sign in' },
];

export function NavbarDoubleDecker({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
  className = '',
}: NavbarDoubleDeckerProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      {/* Utility strip: desktop only. Its links reappear inside the drawer on
          mobile rather than being dropped. */}
      <div className="hidden border-b border-gray-200 bg-gray-50 md:block dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-end gap-4 px-4">
          {UTILITY_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a
          href="/"
          className="mr-auto text-base font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={ctaHref}
          className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-dd-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open ? (
        <div id="nav-dd-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          <nav className="flex flex-col gap-1" aria-label="Main">
            {MAIN_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
            {UTILITY_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
            <a
              href={ctaHref}
              className="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-transparent-overlay',
    category: 'navbar',
    tags: ['navbar', 'transparent', 'overlay', 'hero', 'absolute'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/signup'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A bar that floats over a hero: absolute, no fill, white text. It only works on
  a dark image, so the labels ship white and the mobile panel is given its own
  solid backdrop-blurred surface - white-on-white links inside an open menu is
  the trap this layout invites. Drop the wrapper's bg for your real hero.
-->
<div class="relative isolate min-h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
  <header class="absolute inset-x-0 top-0 z-20">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
      <a href="/" class="mr-auto font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">Adysre</a>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
        <a href="/product" class="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">Product</a>
        <a href="/pricing" class="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">Pricing</a>
        <a href="/docs" class="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">Docs</a>
      </nav>

      <a href="/signup" class="hidden rounded-lg border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 md:block">Get started</a>

      <button
        type="button"
        aria-expanded="false"
        aria-controls="nav-overlay-menu"
        aria-label="Open main menu"
        class="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:hidden"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </div>

    <nav id="nav-overlay-menu" hidden class="mx-3 mt-1 flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur md:hidden dark:border-gray-800 dark:bg-gray-900/95" aria-label="Main">
      <a href="/product" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Product</a>
      <a href="/pricing" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a>
      <a href="/docs" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a>
      <a href="/signup" class="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</a>
    </nav>
  </header>
</div>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarTransparentOverlay({ ctaLabel = 'Get started', ctaHref = '/signup' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative isolate min-h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <a href="/" className="mr-auto font-bold text-white">Adysre</a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>

          <a href={ctaHref} className="hidden rounded-lg border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 md:block">
            {ctaLabel}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-overlay-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {open && (
          <nav id="nav-overlay-menu" className="mx-3 mt-1 flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur md:hidden dark:border-gray-800 dark:bg-gray-900/95" aria-label="Main">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                {link.label}
              </a>
            ))}
            <a href={ctaHref} className="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              {ctaLabel}
            </a>
          </nav>
        )}
      </header>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarTransparentOverlayProps {
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarTransparentOverlay({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
  className = '',
}: NavbarTransparentOverlayProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    // Replace this gradient wrapper with your real hero; the bar only needs a
    // dark surface beneath its white labels.
    <div className={\`relative isolate min-h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 \${className}\`}>
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <a
            href="/"
            className="mr-auto font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            Adysre
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={ctaHref}
            className="hidden rounded-lg border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:block"
          >
            {ctaLabel}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-overlay-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:hidden"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* The open panel gets its own solid, blurred surface so the links are
            legible off the image behind them. */}
        {open ? (
          <nav
            id="nav-overlay-menu"
            className="mx-3 mt-1 flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur md:hidden dark:border-gray-800 dark:bg-gray-900/95"
            aria-label="Main"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
            <a
              href={ctaHref}
              className="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {ctaLabel}
            </a>
          </nav>
        ) : null}
      </header>
    </div>
  );
}`,
    },
  },
  {
    slug: 'navbar-pill-links',
    category: 'navbar',
    tags: ['navbar', 'pill', 'segmented', 'links', 'rounded'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Sign in'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/login'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The links live inside a rounded pill track; the active one is a filled pill
  marked with aria-current so the highlight and the announced state share one
  source. The track collapses to a stacked hamburger panel below md.
-->
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
    <a href="/" class="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <ul class="hidden items-center gap-1 rounded-full bg-gray-100 p-1 md:flex dark:bg-gray-800">
      <li><a href="/product" aria-current="page" class="block rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50">Product</a></li>
      <li><a href="/pricing" class="block rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Pricing</a></li>
      <li><a href="/docs" class="block rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Docs</a></li>
    </ul>

    <a href="/login" class="hidden rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-700 md:block dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200">Sign in</a>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="nav-pill-menu"
      aria-label="Open main menu"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </nav>

  <ul id="nav-pill-menu" hidden class="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
    <li><a href="/product" aria-current="page" class="block rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50">Product</a></li>
    <li><a href="/pricing" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
    <li><a href="/docs" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a></li>
    <li><a href="/login" class="block rounded-full bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900">Sign in</a></li>
  </ul>
</header>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing', current: false },
  { href: '/docs', label: 'Docs', current: false },
];

export function NavbarPillLinks({ ctaLabel = 'Sign in', ctaHref = '/login' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <ul className="hidden items-center gap-1 rounded-full bg-gray-100 p-1 md:flex dark:bg-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={
                  link.current
                    ? 'block rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50'
                    : 'block rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href={ctaHref} className="hidden rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-700 md:block dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200">
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-pill-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open && (
        <ul id="nav-pill-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={ctaHref} className="block rounded-full bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900">
              {ctaLabel}
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarPillLinksProps {
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
  current?: boolean;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarPillLinks({
  ctaLabel = 'Sign in',
  ctaHref = '/login',
  className = '',
}: NavbarPillLinksProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a
          href="/"
          className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        {/* The pill track is the segmented control; the active link is the
            raised pill, marked with aria-current so the two never disagree. */}
        <ul className="hidden items-center gap-1 rounded-full bg-gray-100 p-1 md:flex dark:bg-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={
                  link.current
                    ? 'block rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-950 dark:text-gray-50'
                    : 'block rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-50'
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="hidden rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:block dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-pill-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open ? (
        <ul id="nav-pill-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={ctaHref}
              className="block rounded-full bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900"
            >
              {ctaLabel}
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-underline-indicator',
    category: 'navbar',
    tags: ['navbar', 'underline', 'indicator', 'animation', 'links'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'/signup'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Each link carries a bottom underline that scales in from the centre on hover
  and stays put on the aria-current link. The scale transition sits behind
  motion-reduce, and the underline is a pseudo-element so it never shifts the
  text. Below md the strip becomes a plain hamburger list.
-->
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
    <a href="/" class="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <ul class="hidden items-center gap-6 md:flex">
      <li><a href="/product" aria-current="page" class="relative py-4 text-sm font-medium text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-100 after:bg-blue-600 dark:text-gray-50 dark:after:bg-blue-400">Product</a></li>
      <li><a href="/pricing" class="relative py-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none dark:text-gray-400 dark:hover:text-gray-50 dark:after:bg-blue-400">Pricing</a></li>
      <li><a href="/docs" class="relative py-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none dark:text-gray-400 dark:hover:text-gray-50 dark:after:bg-blue-400">Docs</a></li>
    </ul>

    <a href="/signup" class="ml-2 hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">Get started</a>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="nav-underline-menu"
      aria-label="Open main menu"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </nav>

  <ul id="nav-underline-menu" hidden class="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
    <li><a href="/product" aria-current="page" class="block rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50">Product</a></li>
    <li><a href="/pricing" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
    <li><a href="/docs" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a></li>
    <li><a href="/signup" class="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</a></li>
  </ul>
</header>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing', current: false },
  { href: '/docs', label: 'Docs', current: false },
];

const activeClass =
  'relative py-4 text-sm font-medium text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-100 after:bg-blue-600 dark:text-gray-50 dark:after:bg-blue-400';
const idleClass =
  'relative py-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none dark:text-gray-400 dark:hover:text-gray-50 dark:after:bg-blue-400';

export function NavbarUnderlineIndicator({ ctaLabel = 'Get started', ctaHref = '/signup' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} aria-current={link.current ? 'page' : undefined} className={link.current ? activeClass : idleClass}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href={ctaHref} className="ml-2 hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-underline-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open && (
        <ul id="nav-underline-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={ctaHref} className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              {ctaLabel}
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarUnderlineIndicatorProps {
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
  current?: boolean;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product', current: true },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

// The underline is an ::after pseudo-element so it never nudges the text; the
// scale-x transition is gated behind motion-reduce.
const activeClass =
  'relative py-4 text-sm font-medium text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-100 after:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:after:bg-blue-400';
const idleClass =
  'relative py-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:after:transition-none dark:text-gray-400 dark:hover:text-gray-50 dark:after:bg-blue-400';

export function NavbarUnderlineIndicator({
  ctaLabel = 'Get started',
  ctaHref = '/signup',
  className = '',
}: NavbarUnderlineIndicatorProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a
          href="/"
          className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={link.current ? activeClass : idleClass}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="ml-2 hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-underline-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open ? (
        <ul id="nav-underline-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={ctaHref}
              className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {ctaLabel}
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-announcement-bar',
    category: 'navbar',
    tags: ['navbar', 'announcement', 'banner', 'dismissible', 'promo'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'announcement', type: 'string', default: "'New: v2 is live'", descriptionKey: 'announcement' },
      { name: 'announcementHref', type: 'string', default: "'/changelog'", descriptionKey: 'announcementHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A promo strip above the bar, dismissible on its own. The close button carries
  an aria-label; once dismissed the strip is removed, not just hidden, so it
  leaves no empty row. The text wraps rather than truncating at 320px, and the
  nav below collapses to a hamburger as usual.
-->
<div>
  <div class="bg-blue-600 text-white">
    <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
      <p class="min-w-0 flex-1 text-center text-sm">
        New: v2 is live.
        <a href="/changelog" class="font-semibold underline underline-offset-2 hover:text-blue-100">Read the changelog</a>
      </p>
      <button type="button" aria-label="Dismiss announcement" class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  </div>

  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <nav class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
      <a href="/" class="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

      <ul class="hidden items-center gap-1 md:flex">
        <li><a href="/product" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Product</a></li>
        <li><a href="/pricing" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Pricing</a></li>
        <li><a href="/docs" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a></li>
      </ul>

      <a href="/signup" class="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">Get started</a>

      <button
        type="button"
        aria-expanded="false"
        aria-controls="nav-announce-menu"
        aria-label="Open main menu"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </nav>

    <ul id="nav-announce-menu" hidden class="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
      <li><a href="/product" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Product</a></li>
      <li><a href="/pricing" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
      <li><a href="/docs" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a></li>
      <li><a href="/signup" class="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">Get started</a></li>
    </ul>
  </header>
</div>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarAnnouncementBar({ announcement = 'New: v2 is live', announcementHref = '/changelog' }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <div>
      {!dismissed && (
        <div className="bg-blue-600 text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
            <p className="min-w-0 flex-1 text-center text-sm">
              {announcement}.{' '}
              <a href={announcementHref} className="font-semibold underline underline-offset-2 hover:text-blue-100">
                Read the changelog
              </a>
            </p>
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={() => setDismissed(true)}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
          <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a href="/signup" className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">
            Get started
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-announce-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </nav>

        {open && (
          <ul id="nav-announce-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/signup" className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
                Get started
              </a>
            </li>
          </ul>
        )}
      </header>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarAnnouncementBarProps {
  /** Promo copy shown in the top strip. */
  announcement?: string;
  announcementHref?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarAnnouncementBar({
  announcement = 'New: v2 is live',
  announcementHref = '/changelog',
  className = '',
}: NavbarAnnouncementBarProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className={className}>
      {/* Dismissed removes the strip rather than hiding it, so it leaves no
          empty row behind. The copy wraps rather than truncating at 320px. */}
      {!dismissed ? (
        <div className="bg-blue-600 text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
            <p className="min-w-0 flex-1 text-center text-sm">
              {announcement}.{' '}
              <a href={announcementHref} className="font-semibold underline underline-offset-2 hover:text-blue-100">
                Read the changelog
              </a>
            </p>
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={() => setDismissed(true)}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
          <a
            href="/"
            className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/signup"
            className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Get started
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-announce-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </nav>

        {open ? (
          <ul id="nav-announce-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/signup"
                className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get started
              </a>
            </li>
          </ul>
        ) : null}
      </header>
    </div>
  );
}`,
    },
  },
  {
    slug: 'navbar-split-actions',
    category: 'navbar',
    tags: ['navbar', 'actions', 'split', 'signup', 'login'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'signInLabel', type: 'string', default: "'Sign in'", descriptionKey: 'signInLabel' },
      { name: 'signUpLabel', type: 'string', default: "'Sign up'", descriptionKey: 'signUpLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A split action cluster on the right: a ghost "Sign in" text link, a divider,
  then a filled "Sign up" button - the two-tier auth pattern. Both actions plus
  the links fold into the hamburger panel below md, so the phone layout keeps
  the same hierarchy: links, then sign in, then the primary button.
-->
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <nav class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
    <a href="/" class="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <ul class="mr-auto hidden items-center gap-1 md:flex">
      <li><a href="/product" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Product</a></li>
      <li><a href="/pricing" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Pricing</a></li>
      <li><a href="/docs" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a></li>
    </ul>

    <div class="hidden items-center gap-3 md:flex">
      <a href="/login" class="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">Sign in</a>
      <span class="h-5 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
      <a href="/signup" class="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">Sign up</a>
    </div>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="nav-split-menu"
      aria-label="Open main menu"
      class="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </nav>

  <div id="nav-split-menu" hidden class="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
    <ul class="flex flex-col gap-1">
      <li><a href="/product" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Product</a></li>
      <li><a href="/pricing" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
      <li><a href="/docs" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a></li>
    </ul>
    <div class="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
      <a href="/login" class="rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800">Sign in</a>
      <a href="/signup" class="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">Sign up</a>
    </div>
  </div>
</header>`,
      react: `import { useState } from 'react';

const LINKS = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarSplitActions({ signInLabel = 'Sign in', signUpLabel = 'Sign up' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="/" className="font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <ul className="mr-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
            {signInLabel}
          </a>
          <span className="h-5 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
          <a href="/signup" className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
            {signUpLabel}
          </a>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-split-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open && (
        <div id="nav-split-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
            <a href="/login" className="rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800">
              {signInLabel}
            </a>
            <a href="/signup" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              {signUpLabel}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarSplitActionsProps {
  signInLabel?: string;
  signUpLabel?: string;
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '/product', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarSplitActions({
  signInLabel = 'Sign in',
  signUpLabel = 'Sign up',
  className = '',
}: NavbarSplitActionsProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a
          href="/"
          className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <ul className="mr-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Ghost link + divider + filled button - the two-tier auth cluster. */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50"
          >
            {signInLabel}
          </a>
          <span className="h-5 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
          <a
            href="/signup"
            className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {signUpLabel}
          </a>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-split-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open ? (
        <div id="nav-split-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
            <a
              href="/login"
              className="rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800"
            >
              {signInLabel}
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              {signUpLabel}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}`,
    },
  },
  {
    slug: 'navbar-tabs-subnav',
    category: 'navbar',
    tags: ['navbar', 'tabs', 'subnav', 'scrollable', 'sections'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'tabs', type: 'string[]', default: "['Overview', 'Activity', 'Settings', 'Billing', 'Members']", descriptionKey: 'tabs' },
      { name: 'activeTab', type: 'string', descriptionKey: 'activeTab' },
      { name: 'onTabChange', type: '(tab: string) => void', descriptionKey: 'onTabChange' },
    ],
    code: {
      tailwind: `<!--
  Two tiers: a product bar over a section subnav. The subnav is a real tablist,
  and it scrolls horizontally (overflow-x-auto) rather than wrapping - the phone
  answer for a row of section tabs that will not fit. The active tab carries a
  bottom border and aria-selected. The bar's own links collapse to a hamburger.
-->
<header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
    <a href="/" class="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400">Adysre</a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
      <a href="/support" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Support</a>
      <a href="/docs" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">Docs</a>
    </nav>

    <a href="/new" class="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">New project</a>

    <button
      type="button"
      aria-expanded="false"
      aria-controls="nav-tabs-menu"
      aria-label="Open main menu"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  </div>

  <nav id="nav-tabs-menu" hidden class="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
    <a href="/support" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Support</a>
    <a href="/docs" class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Docs</a>
    <a href="/new" class="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">New project</a>
  </nav>

  <div class="mx-auto max-w-6xl px-4">
    <div class="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Sections">
      <button type="button" role="tab" aria-selected="true" class="shrink-0 whitespace-nowrap border-b-2 border-blue-600 px-3 py-2.5 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-blue-400 dark:text-gray-50">Overview</button>
      <button type="button" role="tab" aria-selected="false" class="shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-50">Activity</button>
      <button type="button" role="tab" aria-selected="false" class="shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-50">Settings</button>
      <button type="button" role="tab" aria-selected="false" class="shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-50">Billing</button>
      <button type="button" role="tab" aria-selected="false" class="shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-50">Members</button>
    </div>
  </div>
</header>`,
      react: `import { useState } from 'react';

const TABS = ['Overview', 'Activity', 'Settings', 'Billing', 'Members'];
const MAIN_LINKS = [
  { href: '/support', label: 'Support' },
  { href: '/docs', label: 'Docs' },
];

export function NavbarTabsSubnav({ tabs = TABS, activeTab, onTabChange }) {
  const [open, setOpen] = useState(false);
  const [internalTab, setInternalTab] = useState(tabs[0]);
  const current = activeTab ?? internalTab;

  function selectTab(tab) {
    setInternalTab(tab);
    onTabChange?.(tab);
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a href="/" className="mr-auto font-bold text-gray-900 dark:text-gray-50">Adysre</a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="/new" className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">New project</a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-tabs-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open && (
        <nav id="nav-tabs-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              {link.label}
            </a>
          ))}
          <a href="/new" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">New project</a>
        </nav>
      )}

      <div className="mx-auto max-w-6xl px-4">
        <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Sections">
          {tabs.map((tab) => {
            const selected = tab === current;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(tab)}
                className={
                  selected
                    ? 'shrink-0 whitespace-nowrap border-b-2 border-blue-600 px-3 py-2.5 text-sm font-medium text-gray-900 dark:border-blue-400 dark:text-gray-50'
                    : 'shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-50'
                }
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}`,
      typescript: `import { useState } from 'react';

export interface NavbarTabsSubnavProps {
  /** Section labels rendered in the scrollable subnav tablist. */
  tabs?: string[];
  /** Controlled active tab; falls back to internal state when omitted. */
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

const DEFAULT_TABS = ['Overview', 'Activity', 'Settings', 'Billing', 'Members'];
const MAIN_LINKS = [
  { href: '/support', label: 'Support' },
  { href: '/docs', label: 'Docs' },
] as const;

export function NavbarTabsSubnav({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
  className = '',
}: NavbarTabsSubnavProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [internalTab, setInternalTab] = useState(tabs[0]);
  const current = activeTab ?? internalTab;

  function selectTab(tab: string): void {
    setInternalTab(tab);
    onTabChange?.(tab);
  }

  return (
    <header className={\`border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a
          href="/"
          className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/new"
          className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:block dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          New project
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-tabs-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="nav-tabs-menu"
          className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800"
          aria-label="Main"
        >
          {MAIN_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/new"
            className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            New project
          </a>
        </nav>
      ) : null}

      {/* The subnav scrolls sideways instead of wrapping - the phone answer for
          a row of section tabs that will not fit. */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Sections">
          {tabs.map((tab) => {
            const selected = tab === current;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(tab)}
                className={
                  selected
                    ? 'shrink-0 whitespace-nowrap border-b-2 border-blue-600 px-3 py-2.5 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-blue-400 dark:text-gray-50'
                    : 'shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-50'
                }
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}`,
    },
  },
];
