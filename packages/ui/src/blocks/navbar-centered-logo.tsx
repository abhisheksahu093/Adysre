'use client';

/**
 * Live preview for `navbar-centered-logo`.
 *
 * Mirrors the `typescript` code variant. The component itself is stateless -
 * the preview is a client component only because every preview in this gallery
 * is. Keep this in step with `src/data/components/navbar.ts`.
 */
export function NavbarCenteredLogo() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav
        className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4"
        aria-label="Main"
      >
        <ul className="hidden items-center gap-2 sm:flex">
          <li>
            <a
              href="#"
              aria-current="page"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-900 underline underline-offset-[0.35rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Product
            </a>
          </li>
          <li>
            <a
              href="#"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
            >
              Pricing
            </a>
          </li>
        </ul>

        <a
          href="#"
          className="whitespace-nowrap text-lg font-bold tracking-[0.08em] text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          ADYSRE
        </a>

        <div className="flex items-center justify-end gap-2">
          <a
            href="#"
            className="hidden rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 sm:block dark:text-gray-300 dark:hover:text-gray-50"
          >
            Support
          </a>
          <a
            href="#"
            className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            Sign in
          </a>
        </div>
      </nav>
    </header>
  );
}

export default function NavbarCenteredLogoPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <NavbarCenteredLogo />
    </div>
  );
}
