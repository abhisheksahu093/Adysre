import type { ComponentContentMap } from '../types';

/** English prose for the error-pages category. Keys are component slugs. */
export const errorPagesContent: ComponentContentMap = {
  'error-404-centered': {
    title: 'Centered 404 Page',
    description:
      'A centred 404 with a big gradient code, a heading, sub-copy and a pair of recovery actions.',
    customization:
      'Drive the big number with `code` and the copy with `title`/`message`. The two actions go full width and stack below `sm` so a phone shows one solid tap target instead of two cramped ones.',
    seoTitle: 'Centered 404 Not Found Page - Free Tailwind CSS Component',
    seoDescription:
      'A responsive, accessible 404 error page with a gradient code, headline and recovery actions, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['404 page', 'not found page', 'error page', 'tailwind 404'],
  },
  'error-404-illustration': {
    title: '404 With Illustration',
    description:
      'A 404 built around an inline single-colour SVG of a disconnected cable, with a return-home action.',
    customization:
      'The illustration is one continuous `currentColor` stroke, so a single `dark:` text class flips the whole drawing - nothing to keep in sync per shape. It is `aria-hidden` because it decorates the message rather than carrying it.',
    seoTitle: '404 Page With SVG Illustration - Free Tailwind CSS Component',
    seoDescription:
      'A 404 error page with an inline SVG illustration and a return-home action, in Tailwind, React and TypeScript. No external images, WCAG AA, MIT licensed.',
    keywords: ['404 illustration', 'svg error page', 'not found illustration', 'error graphic'],
  },
  'error-500-server': {
    title: '500 Server Error Page',
    description:
      'A 500 crash screen with a warning icon, an apology and both a Retry action and a way home.',
    customization:
      'Retry is a real `<button>` wired to `onRetry` so it can re-run the failed request without a full navigation; the home link is the fallback. Swap `code`/`title`/`message` for other 5xx statuses.',
    seoTitle: '500 Internal Server Error Page - Free React Component',
    seoDescription:
      'A responsive 500 server error page with a warning icon and retry action, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['500 page', 'server error page', 'internal server error', 'retry error page'],
  },
  'error-403-forbidden': {
    title: '403 Forbidden Page',
    description:
      'An access-denied screen with a lock icon, a clear explanation and a request-access action.',
    customization:
      'The lock icon reads as a permissions barrier at a glance; pair the primary home link with a `Request access` action pointed at your support or admin flow. All labels and hrefs are props.',
    seoTitle: '403 Forbidden Access Denied Page - Free Tailwind CSS Component',
    seoDescription:
      'A responsive 403 forbidden error page with a lock icon and request-access action, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['403 page', 'forbidden page', 'access denied', 'permission error'],
  },
  'error-maintenance': {
    title: 'Maintenance Page',
    description:
      "A friendly down-for-maintenance screen with a clock icon, an ETA pill and a status-page link.",
    customization:
      'The `eta` sits in its own pill with a softly pulsing dot so it reads as a live detail, not part of the message; the pulse respects `motion-safe`. Point `statusHref` at your real status page.',
    seoTitle: 'Down For Maintenance Page - Free Tailwind CSS Component',
    seoDescription:
      'A responsive maintenance / downtime page with an ETA and status link, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['maintenance page', 'downtime page', 'be right back', 'scheduled maintenance'],
  },
  'error-offline': {
    title: 'Offline Page',
    description:
      "An offline screen with a struck-through wifi icon and a single Retry action to reconnect.",
    customization:
      'The icon is a hand-drawn wifi-slash in one `currentColor` stroke so it inverts cleanly in dark mode. Retry is a `<button>` on `onRetry` - wire it to re-fetch or reload once the connection is back.',
    seoTitle: 'Offline / No Connection Page - Free React Component',
    seoDescription:
      'A responsive offline error page with a wifi-slash icon and retry action, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['offline page', 'no connection', 'network error', 'retry connection'],
  },
  'error-search-no-results': {
    title: 'No Search Results',
    description:
      'An empty search-results state that echoes the query and offers Clear search and Browse all.',
    customization:
      'Pass the `query` and it is echoed in the message inside a `break-words` block so a long term can never push past the viewport. `onClear` resets the search; `browseHref` is the catch-all fallback.',
    seoTitle: 'No Search Results Empty State - Free React Component',
    seoDescription:
      'A responsive no-results state that echoes the query, with clear and browse actions, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['no results', 'empty search', 'search empty state', 'no matches'],
  },
  'error-empty-state': {
    title: 'Empty State',
    description:
      'A first-run empty state with a dashed placeholder tile and a primary Create action.',
    customization:
      'The container is a dashed tile, not a hard icon, so it reads as a slot waiting to be filled. The primary action carries a plus glyph; add an optional secondary `learnLabel` link for docs or a tour.',
    seoTitle: 'Empty State With Call To Action - Free Tailwind CSS Component',
    seoDescription:
      'A responsive empty-state / zero-data screen with a create action, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['empty state', 'zero data', 'no items', 'onboarding empty state'],
  },
  'error-rate-limited': {
    title: 'Rate Limited (429) Page',
    description:
      'A 429 throttle screen with a stopwatch icon, a retry-after hint and a Try again action.',
    customization:
      'Feed `retryAfter` and it is woven into the default message; the whole line can be overridden with `message`. Retry is a `<button>` on `onRetry` - gate it behind your own countdown if you want.',
    seoTitle: '429 Too Many Requests Rate Limit Page - Free React Component',
    seoDescription:
      'A responsive 429 rate-limited error page with a retry-after hint and retry action, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['429 page', 'rate limit page', 'too many requests', 'throttled error'],
  },
  'error-with-search-box': {
    title: '404 With Search Box',
    description:
      'A 404 that offers a real native search form plus a fallback link back home.',
    customization:
      'A native GET `<form>` - no JS needed. The label is `sr-only` (a placeholder is not an accessible name), the leading magnifier is decorative, and the field and button stack below `sm` so the input never collapses to an unusable width.',
    seoTitle: '404 Page With Search Box - Free Tailwind CSS Component',
    seoDescription:
      'A responsive 404 error page with an accessible search form and a home link, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['404 search', 'not found search', 'error page search', 'search 404'],
  },
};
