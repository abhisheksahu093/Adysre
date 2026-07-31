import { siteOrigin } from './site';

/**
 * Builds the `Link: <url>; rel="canonical"` header the proxy attaches to every
 * page response.
 *
 * A canonical declared in an HTTP header carries exactly the same weight with
 * Google as the `<link>` tag, and it is the only form available to a proxy: it
 * is the one place in this app that knows a request's path without forcing the
 * page behind it to render dynamically.
 *
 * Kept free of `next/server` imports so it stays unit-testable as a pure
 * string function.
 */

/**
 * Path prefixes that get no canonical at all.
 *
 * These are the same routes `robots.ts` disallows, and for the same reason:
 * chrome-less renders that duplicate the page embedding them, and per-tenant
 * reports that are not ours to publish. Declaring a canonical for a page we are
 * asking crawlers not to index is a contradiction, and contradictory signals
 * are how a site ends up with the wrong URL indexed.
 */
const UNCANONICAL_SEGMENTS = ['preview', 'template-preview', 'website-intelligence-report'];

/**
 * Query parameters that change what the page SHOWS, and therefore belong in the
 * canonical.
 *
 * Everything else is dropped, which is the entire point: `?utm_source=...`,
 * `?ref=...` and a share tracker's leftovers all describe how someone arrived,
 * never what they arrived at, and each one left in would be a separate URL
 * competing with the real page.
 *
 * `page` is here because the showcase sites at `/websites/<slug>` navigate
 * between their own pages with it. Collapsing those onto the slug would tell
 * Google that a template's About and Pricing pages are the same document.
 */
const CONTENT_QUERY_PARAMS = new Set(['page']);

/** Strips a trailing slash, leaving the root as `/`. */
function normalisePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** True when the path is one of the routes that should not declare a canonical. */
function isUncanonical(pathname: string): boolean {
  // Split rather than `startsWith`, so a future `/previews` page is not caught
  // by the `preview` entry.
  const segments = normalisePath(pathname).split('/').filter(Boolean);
  return segments.some((segment) => UNCANONICAL_SEGMENTS.includes(segment));
}

/**
 * The header value for a request, or null when this route should not declare
 * one.
 *
 * `search` is optional and accepts the raw query string (`?page=about` or
 * `page=about`); only the parameters that change the rendered page survive into
 * the result, in a stable order so the same page never emits two spellings of
 * its own canonical.
 */
export function canonicalLinkHeader(pathname: string, search = ''): string | null {
  if (isUncanonical(pathname)) return null;

  const path = normalisePath(pathname);
  const url = new URL(path, `${siteOrigin()}/`);

  const params = new URLSearchParams(search);
  const kept = [...params.entries()]
    .filter(([key]) => CONTENT_QUERY_PARAMS.has(key))
    .sort(([a], [b]) => a.localeCompare(b));
  for (const [key, value] of kept) url.searchParams.append(key, value);

  // `new URL` insists on a path, so the root arrives here as `https://host/`
  // while the `<link>` tag Next renders says `https://host`. Same document,
  // two spellings; this makes them one. See `localeUrl` for the same decision.
  const href = path === '/' && url.search === '' ? siteOrigin() : url.toString();

  return `<${href}>; rel="canonical"`;
}
