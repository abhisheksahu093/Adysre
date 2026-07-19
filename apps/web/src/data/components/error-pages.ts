import type { ComponentEntry } from './types';

/**
 * Error-pages category.
 *
 * Ten full-section error layouts - 404, 500, 403, maintenance, offline, empty
 * and rate-limited states - not ten recolours of one card. The shared
 * constraint is the recovery path: an error screen exists to get the visitor
 * back to a working page, so every one here leads with a big, scannable
 * code/heading and ends with real actions (Go home / Retry / Contact) that
 * stack below `sm` so a phone never shows two half-width tap targets. No
 * external images: the illustrations are inline single-colour SVG that inverts
 * with the theme via `currentColor`, so there is nothing to preload or let rot.
 */
export const errorPagesComponents: ComponentEntry[] = [
  {
    slug: 'error-404-centered',
    category: 'error-pages',
    tags: ['error', '404', 'not-found', 'centered', 'empty'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'code', type: 'string', default: "'404'", descriptionKey: 'code' },
      { name: 'title', type: 'string', default: "'Page not found'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'homeLabel', type: 'string', default: "'Go home'", descriptionKey: 'homeLabel' },
      { name: 'homeHref', type: 'string', default: "'/'", descriptionKey: 'homeHref' },
      { name: 'contactLabel', type: 'string', default: "'Contact support'", descriptionKey: 'contactLabel' },
      { name: 'contactHref', type: 'string', default: "'/contact'", descriptionKey: 'contactHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <p class="bg-gradient-to-b from-gray-900 to-gray-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl dark:from-white dark:to-gray-600">
    404
  </p>
  <h1 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Page not found
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <a href="/" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Go home
    </a>
    <a href="/contact" class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Contact support
    </a>
  </div>
</section>`,
      react: `export function Error404Centered({
  code = '404',
  title = 'Page not found',
  message = "Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.",
  homeLabel = 'Go home',
  homeHref = '/',
  contactLabel = 'Contact support',
  contactHref = '/contact',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <p className="bg-gradient-to-b from-gray-900 to-gray-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl dark:from-white dark:to-gray-600">
        {code}
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
        <a
          href={contactHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {contactLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface Error404CenteredProps {
  code?: string;
  title?: string;
  message?: string;
  homeLabel?: string;
  homeHref?: string;
  contactLabel?: string;
  contactHref?: string;
  className?: string;
}

export function Error404Centered({
  code = '404',
  title = 'Page not found',
  message = "Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.",
  homeLabel = 'Go home',
  homeHref = '/',
  contactLabel = 'Contact support',
  contactHref = '/contact',
  className = '',
}: Error404CenteredProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <p className="bg-gradient-to-b from-gray-900 to-gray-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl dark:from-white dark:to-gray-600">
        {code}
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
        <a
          href={contactHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {contactLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-404-illustration',
    category: 'error-pages',
    tags: ['error', '404', 'illustration', 'svg', 'not-found'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'muted', labelKey: 'muted' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Lost connection'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'homeLabel', type: 'string', default: "'Back to home'", descriptionKey: 'homeLabel' },
      { name: 'homeHref', type: 'string', default: "'/'", descriptionKey: 'homeHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The illustration is one continuous stroke in currentColor, so a single
  dark: text class flips it for the whole drawing - no per-shape colours to
  keep in sync. It is aria-hidden: it decorates the message, it isn't content.
-->
<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <svg viewBox="0 0 240 120" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" class="h-24 w-auto text-blue-500 sm:h-28 dark:text-blue-400" aria-hidden="true">
    <path d="M18 60h56" />
    <rect x="74" y="42" width="26" height="36" rx="7" />
    <path d="M100 51h14M100 69h14" />
    <path d="M222 60h-56" />
    <rect x="140" y="42" width="26" height="36" rx="7" />
    <path d="M58 30 48 16M182 30l10-14M120 22V6" />
  </svg>
  <p class="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error 404</p>
  <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Lost connection
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    The page you were after has wandered off. Let's get you back to solid ground.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <a href="/" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Back to home
    </a>
  </div>
</section>`,
      react: `export function Error404Illustration({
  title = 'Lost connection',
  message = "The page you were after has wandered off. Let's get you back to solid ground.",
  homeLabel = 'Back to home',
  homeHref = '/',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      {/* One-colour stroke art: currentColor + a dark: text class flips it all. */}
      <svg
        viewBox="0 0 240 120"
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-24 w-auto text-blue-500 sm:h-28 dark:text-blue-400"
        aria-hidden="true"
      >
        <path d="M18 60h56" />
        <rect x="74" y="42" width="26" height="36" rx="7" />
        <path d="M100 51h14M100 69h14" />
        <path d="M222 60h-56" />
        <rect x="140" y="42" width="26" height="36" rx="7" />
        <path d="M58 30 48 16M182 30l10-14M120 22V6" />
      </svg>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error 404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface Error404IllustrationProps {
  title?: string;
  message?: string;
  homeLabel?: string;
  homeHref?: string;
  className?: string;
}

export function Error404Illustration({
  title = 'Lost connection',
  message = "The page you were after has wandered off. Let's get you back to solid ground.",
  homeLabel = 'Back to home',
  homeHref = '/',
  className = '',
}: Error404IllustrationProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <svg
        viewBox="0 0 240 120"
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-24 w-auto text-blue-500 sm:h-28 dark:text-blue-400"
        aria-hidden="true"
      >
        <path d="M18 60h56" />
        <rect x="74" y="42" width="26" height="36" rx="7" />
        <path d="M100 51h14M100 69h14" />
        <path d="M222 60h-56" />
        <rect x="140" y="42" width="26" height="36" rx="7" />
        <path d="M58 30 48 16M182 30l10-14M120 22V6" />
      </svg>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error 404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-500-server',
    category: 'error-pages',
    tags: ['error', '500', 'server', 'retry', 'crash'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'code', type: 'string', default: "'500'", descriptionKey: 'code' },
      { name: 'title', type: 'string', default: "'Something went wrong'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'retryLabel', type: 'string', default: "'Try again'", descriptionKey: 'retryLabel' },
      { name: 'onRetry', type: '() => void', descriptionKey: 'onRetry' },
      { name: 'homeLabel', type: 'string', default: "'Go home'", descriptionKey: 'homeLabel' },
      { name: 'homeHref', type: 'string', default: "'/'", descriptionKey: 'homeHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <span class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" aria-hidden="true">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  </span>
  <p class="mt-6 text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">Error 500</p>
  <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Something went wrong
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    Our server hit an unexpected error. We've been notified - please try again in a moment.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <button type="button" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Try again
    </button>
    <a href="/" class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Go home
    </a>
  </div>
</section>`,
      react: `export function Error500Server({
  code = '500',
  title = 'Something went wrong',
  message = "Our server hit an unexpected error. We've been notified - please try again in a moment.",
  retryLabel = 'Try again',
  onRetry,
  homeLabel = 'Go home',
  homeHref = '/',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {retryLabel}
        </button>
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface Error500ServerProps {
  code?: string;
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  homeLabel?: string;
  homeHref?: string;
  className?: string;
}

export function Error500Server({
  code = '500',
  title = 'Something went wrong',
  message = "Our server hit an unexpected error. We've been notified - please try again in a moment.",
  retryLabel = 'Try again',
  onRetry,
  homeLabel = 'Go home',
  homeHref = '/',
  className = '',
}: Error500ServerProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {retryLabel}
        </button>
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-403-forbidden',
    category: 'error-pages',
    tags: ['error', '403', 'forbidden', 'access', 'lock'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'code', type: 'string', default: "'403'", descriptionKey: 'code' },
      { name: 'title', type: 'string', default: "'Access denied'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'homeLabel', type: 'string', default: "'Go home'", descriptionKey: 'homeLabel' },
      { name: 'homeHref', type: 'string', default: "'/'", descriptionKey: 'homeHref' },
      { name: 'contactLabel', type: 'string', default: "'Request access'", descriptionKey: 'contactLabel' },
      { name: 'contactHref', type: 'string', default: "'/contact'", descriptionKey: 'contactHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <span class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" />
    </svg>
  </span>
  <p class="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error 403</p>
  <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Access denied
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    You don't have permission to view this page. If you think this is a mistake, ask an admin for access.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <a href="/" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Go home
    </a>
    <a href="/contact" class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Request access
    </a>
  </div>
</section>`,
      react: `export function Error403Forbidden({
  code = '403',
  title = 'Access denied',
  message = "You don't have permission to view this page. If you think this is a mistake, ask an admin for access.",
  homeLabel = 'Go home',
  homeHref = '/',
  contactLabel = 'Request access',
  contactHref = '/contact',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
        <a
          href={contactHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {contactLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface Error403ForbiddenProps {
  code?: string;
  title?: string;
  message?: string;
  homeLabel?: string;
  homeHref?: string;
  contactLabel?: string;
  contactHref?: string;
  className?: string;
}

export function Error403Forbidden({
  code = '403',
  title = 'Access denied',
  message = "You don't have permission to view this page. If you think this is a mistake, ask an admin for access.",
  homeLabel = 'Go home',
  homeHref = '/',
  contactLabel = 'Request access',
  contactHref = '/contact',
  className = '',
}: Error403ForbiddenProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={homeHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {homeLabel}
        </a>
        <a
          href={contactHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {contactLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-maintenance',
    category: 'error-pages',
    tags: ['error', 'maintenance', 'downtime', 'status', 'offline'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Down for maintenance'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'eta', type: 'string', descriptionKey: 'eta', example: 'about 30 minutes' },
      { name: 'statusLabel', type: 'string', default: "'View status page'", descriptionKey: 'statusLabel' },
      { name: 'statusHref', type: 'string', default: "'/status'", descriptionKey: 'statusHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <span class="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  </span>
  <h1 class="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Down for maintenance
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    We're making things better behind the scenes and will be back shortly. Thanks for your patience.
  </p>
  <!-- ETA is a distinct, dimmer line so it reads as a live detail, not part of the message. -->
  <p class="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
    <span class="h-2 w-2 rounded-full bg-indigo-500 motion-safe:animate-pulse dark:bg-indigo-400" aria-hidden="true"></span>
    Estimated back in about 30 minutes
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <a href="/status" class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      View status page
    </a>
  </div>
</section>`,
      react: `export function ErrorMaintenance({
  title = 'Down for maintenance',
  message = "We're making things better behind the scenes and will be back shortly. Thanks for your patience.",
  eta = 'about 30 minutes',
  statusLabel = 'View status page',
  statusHref = '/status',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      {eta ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <span className="h-2 w-2 rounded-full bg-indigo-500 motion-safe:animate-pulse dark:bg-indigo-400" aria-hidden="true" />
          Estimated back in {eta}
        </p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={statusHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {statusLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface ErrorMaintenanceProps {
  title?: string;
  message?: string;
  eta?: string;
  statusLabel?: string;
  statusHref?: string;
  className?: string;
}

export function ErrorMaintenance({
  title = 'Down for maintenance',
  message = "We're making things better behind the scenes and will be back shortly. Thanks for your patience.",
  eta = 'about 30 minutes',
  statusLabel = 'View status page',
  statusHref = '/status',
  className = '',
}: ErrorMaintenanceProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      {eta ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <span className="h-2 w-2 rounded-full bg-indigo-500 motion-safe:animate-pulse dark:bg-indigo-400" aria-hidden="true" />
          Estimated back in {eta}
        </p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={statusHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {statusLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-offline',
    category: 'error-pages',
    tags: ['error', 'offline', 'network', 'retry', 'connection'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'You're offline'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'retryLabel', type: 'string', default: "'Retry'", descriptionKey: 'retryLabel' },
      { name: 'onRetry', type: '() => void', descriptionKey: 'onRetry' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <span class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" aria-hidden="true">
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5 12a10 10 0 0 1 14 0" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <path d="M12 19h.01" />
      <path d="M3 3l18 18" />
    </svg>
  </span>
  <h1 class="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    You're offline
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    We can't reach the network right now. Check your connection and try again.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <button type="button" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Retry
    </button>
  </div>
</section>`,
      react: `export function ErrorOffline({
  title = "You're offline",
  message = "We can't reach the network right now. Check your connection and try again.",
  retryLabel = 'Retry',
  onRetry,
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <path d="M2 8.5a15 15 0 0 1 20 0" />
          <path d="M5 12a10 10 0 0 1 14 0" />
          <path d="M8.5 15.5a5 5 0 0 1 7 0" />
          <path d="M12 19h.01" />
          <path d="M3 3l18 18" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {retryLabel}
        </button>
      </div>
    </section>
  );
}`,
      typescript: `export interface ErrorOfflineProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorOffline({
  title = "You're offline",
  message = "We can't reach the network right now. Check your connection and try again.",
  retryLabel = 'Retry',
  onRetry,
  className = '',
}: ErrorOfflineProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <path d="M2 8.5a15 15 0 0 1 20 0" />
          <path d="M5 12a10 10 0 0 1 14 0" />
          <path d="M8.5 15.5a5 5 0 0 1 7 0" />
          <path d="M12 19h.01" />
          <path d="M3 3l18 18" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {retryLabel}
        </button>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-search-no-results',
    category: 'error-pages',
    tags: ['error', 'search', 'no-results', 'empty', 'query'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'query', type: 'string', descriptionKey: 'query', example: 'quantum widgets' },
      { name: 'title', type: 'string', default: "'No results found'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'clearLabel', type: 'string', default: "'Clear search'", descriptionKey: 'clearLabel' },
      { name: 'onClear', type: '() => void', descriptionKey: 'onClear' },
      { name: 'browseLabel', type: 'string', default: "'Browse all'", descriptionKey: 'browseLabel' },
      { name: 'browseHref', type: 'string', default: "'/'", descriptionKey: 'browseHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <span class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  </span>
  <h1 class="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    No results found
  </h1>
  <!-- The query is wrapped in min-w-0 break-words so a long term can't push past the viewport. -->
  <p class="mt-3 max-w-md break-words text-base leading-relaxed text-gray-600 dark:text-gray-400">
    We couldn't find anything for <span class="font-semibold text-gray-900 dark:text-gray-100">"quantum widgets"</span>. Try a different term or check your spelling.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <button type="button" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Clear search
    </button>
    <a href="/" class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Browse all
    </a>
  </div>
</section>`,
      react: `export function ErrorSearchNoResults({
  query,
  title = 'No results found',
  message,
  clearLabel = 'Clear search',
  onClear,
  browseLabel = 'Browse all',
  browseHref = '/',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      <p className="mt-3 max-w-md break-words text-base leading-relaxed text-gray-600 dark:text-gray-400">
        {message ?? (
          <>
            We couldn't find anything
            {query ? (
              <>
                {' for '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">"{query}"</span>
              </>
            ) : null}
            . Try a different term or check your spelling.
          </>
        )}
      </p>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {clearLabel}
        </button>
        <a
          href={browseHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {browseLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface ErrorSearchNoResultsProps {
  query?: string;
  title?: string;
  message?: string;
  clearLabel?: string;
  onClear?: () => void;
  browseLabel?: string;
  browseHref?: string;
  className?: string;
}

export function ErrorSearchNoResults({
  query,
  title = 'No results found',
  message,
  clearLabel = 'Clear search',
  onClear,
  browseLabel = 'Browse all',
  browseHref = '/',
  className = '',
}: ErrorSearchNoResultsProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      <p className="mt-3 max-w-md break-words text-base leading-relaxed text-gray-600 dark:text-gray-400">
        {message ?? (
          <>
            We couldn't find anything
            {query ? (
              <>
                {' for '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">"{query}"</span>
              </>
            ) : null}
            . Try a different term or check your spelling.
          </>
        )}
      </p>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {clearLabel}
        </button>
        <a
          href={browseHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {browseLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-empty-state',
    category: 'error-pages',
    tags: ['error', 'empty', 'empty-state', 'onboarding', 'cta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'No projects yet'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'createLabel', type: 'string', default: "'Create project'", descriptionKey: 'createLabel' },
      { name: 'createHref', type: 'string', default: "'/new'", descriptionKey: 'createHref' },
      { name: 'learnLabel', type: 'string', descriptionKey: 'learnLabel', example: 'Learn more' },
      { name: 'learnHref', type: 'string', default: "'#'", descriptionKey: 'learnHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <!-- Dashed tile, not a hard icon: an empty state is an invitation to add
       something, so the container reads as a placeholder waiting to be filled. -->
  <span class="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" aria-hidden="true">
      <path d="M3 7l2-3h14l2 3M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18" />
      <path d="M9 13h6" />
    </svg>
  </span>
  <h1 class="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    No projects yet
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    Create your first project to get started. It only takes a minute.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <a href="/new" class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-4 w-4" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      Create project
    </a>
  </div>
</section>`,
      react: `export function ErrorEmptyState({
  title = 'No projects yet',
  message = 'Create your first project to get started. It only takes a minute.',
  createLabel = 'Create project',
  createHref = '/new',
  learnLabel,
  learnHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <path d="M3 7l2-3h14l2 3M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18" />
          <path d="M9 13h6" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={createHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {createLabel}
        </a>
        {learnLabel ? (
          <a
            href={learnHref}
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            {learnLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `export interface ErrorEmptyStateProps {
  title?: string;
  message?: string;
  createLabel?: string;
  createHref?: string;
  learnLabel?: string;
  learnHref?: string;
  className?: string;
}

export function ErrorEmptyState({
  title = 'No projects yet',
  message = 'Create your first project to get started. It only takes a minute.',
  createLabel = 'Create project',
  createHref = '/new',
  learnLabel,
  learnHref = '#',
  className = '',
}: ErrorEmptyStateProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <path d="M3 7l2-3h14l2 3M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18" />
          <path d="M9 13h6" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={createHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {createLabel}
        </a>
        {learnLabel ? (
          <a
            href={learnHref}
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            {learnLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-rate-limited',
    category: 'error-pages',
    tags: ['error', '429', 'rate-limit', 'throttle', 'retry'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'code', type: 'string', default: "'429'", descriptionKey: 'code' },
      { name: 'title', type: 'string', default: "'Too many requests'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'retryAfter', type: 'string', descriptionKey: 'retryAfter', example: '60 seconds' },
      { name: 'retryLabel', type: 'string', default: "'Try again'", descriptionKey: 'retryLabel' },
      { name: 'onRetry', type: '() => void', descriptionKey: 'onRetry' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <span class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9 2h6" />
    </svg>
  </span>
  <p class="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error 429</p>
  <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Too many requests
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    You've hit the rate limit. Please wait a moment before trying again - you can retry in about 60 seconds.
  </p>
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
    <button type="button" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Try again
    </button>
  </div>
</section>`,
      react: `export function ErrorRateLimited({
  code = '429',
  title = 'Too many requests',
  message,
  retryAfter = '60 seconds',
  retryLabel = 'Try again',
  onRetry,
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M9 2h6" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
        {message ??
          \`You've hit the rate limit. Please wait a moment before trying again\${
            retryAfter ? \` - you can retry in about \${retryAfter}\` : ''
          }.\`}
      </p>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {retryLabel}
        </button>
      </div>
    </section>
  );
}`,
      typescript: `export interface ErrorRateLimitedProps {
  code?: string;
  title?: string;
  message?: string;
  retryAfter?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorRateLimited({
  code = '429',
  title = 'Too many requests',
  message,
  retryAfter = '60 seconds',
  retryLabel = 'Try again',
  onRetry,
  className = '',
}: ErrorRateLimitedProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M9 2h6" />
        </svg>
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
        {message ??
          \`You've hit the rate limit. Please wait a moment before trying again\${
            retryAfter ? \` - you can retry in about \${retryAfter}\` : ''
          }.\`}
      </p>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {retryLabel}
        </button>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'error-with-search-box',
    category: 'error-pages',
    tags: ['error', '404', 'search', 'not-found', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'code', type: 'string', default: "'404'", descriptionKey: 'code' },
      { name: 'title', type: 'string', default: "'Page not found'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'action', type: 'string', default: "'/search'", descriptionKey: 'action' },
      { name: 'placeholder', type: 'string', default: "'Search the site…'", descriptionKey: 'placeholder' },
      { name: 'buttonLabel', type: 'string', default: "'Search'", descriptionKey: 'buttonLabel' },
      { name: 'homeLabel', type: 'string', default: "'Or go back home'", descriptionKey: 'homeLabel' },
      { name: 'homeHref', type: 'string', default: "'/'", descriptionKey: 'homeHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A native GET form, no JS: the label is sr-only (a placeholder is not a name in
  the a11y tree), the leading magnifier is decorative, and the row stacks below
  sm so the field never collapses to an unusable width on a phone.
-->
<section class="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
  <p class="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error 404</p>
  <h1 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Page not found
  </h1>
  <p class="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    We couldn't find that page. Try searching for what you need.
  </p>
  <form action="/search" method="get" role="search" class="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
    <label for="error-search" class="sr-only">Search the site</label>
    <div class="relative min-w-0 flex-1">
      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      </span>
      <input id="error-search" name="q" type="search" placeholder="Search the site…" class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
    <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Search
    </button>
  </form>
  <a href="/" class="mt-6 text-sm font-medium text-blue-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Or go back home
  </a>
</section>`,
      react: `export function ErrorWithSearchBox({
  code = '404',
  title = 'Page not found',
  message = "We couldn't find that page. Try searching for what you need.",
  action = '/search',
  placeholder = 'Search the site…',
  buttonLabel = 'Search',
  homeLabel = 'Or go back home',
  homeHref = '/',
  className = '',
}) {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <form action={action} method="get" role="search" className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <label htmlFor="error-search" className="sr-only">Search the site</label>
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            id="error-search"
            name="q"
            type="search"
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {buttonLabel}
        </button>
      </form>
      <a
        href={homeHref}
        className="mt-6 text-sm font-medium text-blue-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {homeLabel}
      </a>
    </section>
  );
}`,
      typescript: `export interface ErrorWithSearchBoxProps {
  code?: string;
  title?: string;
  message?: string;
  action?: string;
  placeholder?: string;
  buttonLabel?: string;
  homeLabel?: string;
  homeHref?: string;
  className?: string;
}

export function ErrorWithSearchBox({
  code = '404',
  title = 'Page not found',
  message = "We couldn't find that page. Try searching for what you need.",
  action = '/search',
  placeholder = 'Search the site…',
  buttonLabel = 'Search',
  homeLabel = 'Or go back home',
  homeHref = '/',
  className = '',
}: ErrorWithSearchBoxProps): JSX.Element {
  return (
    <section className={\`mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24 \${className}\`}>
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Error {code}</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h1>
      {message ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
      ) : null}
      <form action={action} method="get" role="search" className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <label htmlFor="error-search" className="sr-only">Search the site</label>
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            id="error-search"
            name="q"
            type="search"
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {buttonLabel}
        </button>
      </form>
      <a
        href={homeHref}
        className="mt-6 text-sm font-medium text-blue-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {homeLabel}
      </a>
    </section>
  );
}`,
    },
  },
];
