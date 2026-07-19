'use client';

/**
 * Live preview for `footer-social`.
 *
 * Mirrors the `typescript` code variant with the same three sample marks. Tab
 * through the icon row - each link announces its own name from the visually
 * hidden span, not "link". Keep this in step with
 * `src/data/components/footer.ts`.
 */
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
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
];

function FooterSocial() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8">
        <a
          href="#"
          className="text-lg font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
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

        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}

export default function FooterSocialPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterSocial />
    </div>
  );
}
