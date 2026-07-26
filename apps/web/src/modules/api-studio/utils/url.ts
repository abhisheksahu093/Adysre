/**
 * ADYSRE API Studio - URL and query-string handling.
 *
 * Everything here is STRING work, deliberately: `new URL()` cannot parse
 * `{{base_url}}/users/:id`, and that is the most common thing in the address
 * bar. Templates and `:path` placeholders survive every function below
 * untouched.
 *
 * Nothing here percent-encodes either. Encoding before variables are resolved
 * would turn `{{token}}` into `%7B%7Btoken%7D%7D` and break the resolver; the
 * runner encodes once, at send time, when `settings.encodeUrl` says to.
 */

import type { KeyValueEntry } from '../types';
import { createEntry } from './entries';

export interface UrlParts {
  /** Everything before the `?`. */
  base: string;
  /** Between `?` and `#`, without the `?`. */
  query: string;
  /** After `#`, without the `#`. */
  hash: string;
}

/** Split a URL into base, query and hash without parsing or validating it. */
export function splitUrl(url: string): UrlParts {
  const hashAt = url.indexOf('#');
  const withoutHash = hashAt === -1 ? url : url.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : url.slice(hashAt + 1);

  const queryAt = withoutHash.indexOf('?');
  return queryAt === -1
    ? { base: withoutHash, query: '', hash }
    : { base: withoutHash.slice(0, queryAt), query: withoutHash.slice(queryAt + 1), hash };
}

/** Parse a query string into raw key/value pairs, order and repeats intact. */
export function parseQuery(query: string): { key: string; value: string }[] {
  if (query === '') return [];
  return query.split('&').map((pair) => {
    const eq = pair.indexOf('=');
    return eq === -1
      ? { key: pair, value: '' }
      : { key: pair.slice(0, eq), value: pair.slice(eq + 1) };
  });
}

/**
 * Rebuild the params table from what is in the URL.
 *
 * The two views are kept in step by replacing the ENABLED rows from the URL and
 * keeping the disabled ones, which are not in the URL and would otherwise be
 * destroyed by every keystroke in the address bar. Ids are reused when a key
 * reappears, so a row the user is editing does not lose focus mid-word.
 *
 * @param url - the full URL, templates included.
 * @param previous - the current params table.
 */
export function paramsFromUrl(url: string, previous: readonly KeyValueEntry[]): KeyValueEntry[] {
  const pairs = parseQuery(splitUrl(url).query);
  const reusable = new Map<string, KeyValueEntry[]>();

  for (const entry of previous) {
    if (!entry.enabled) continue;
    const bucket = reusable.get(entry.key);
    if (bucket) bucket.push(entry);
    else reusable.set(entry.key, [entry]);
  }

  const enabled = pairs.map(({ key, value }) => {
    const reused = reusable.get(key)?.shift();
    return reused
      ? { ...reused, value }
      : createEntry({ key, value });
  });

  return [...enabled, ...previous.filter((entry) => !entry.enabled)];
}

/**
 * Write the params table back into the URL, replacing its query string.
 * Disabled rows are omitted, which is what makes the checkbox meaningful.
 */
export function urlWithParams(url: string, params: readonly KeyValueEntry[]): string {
  const { base, hash } = splitUrl(url);
  const query = params
    .filter((entry) => entry.enabled && (entry.key !== '' || entry.value !== ''))
    .map((entry) => (entry.value === '' ? entry.key : `${entry.key}=${entry.value}`))
    .join('&');

  const suffix = hash === '' ? '' : `#${hash}`;
  return query === '' ? `${base}${suffix}` : `${base}?${query}${suffix}`;
}

/** `:name` placeholders in the path. The scheme's `://` is never one. */
export function pathVariableNames(url: string): string[] {
  const { base } = splitUrl(url);
  const names = new Set<string>();
  const pattern = /\/:([A-Za-z_][A-Za-z0-9_-]*)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(base)) !== null) {
    if (match[1]) names.add(match[1]);
  }

  return [...names];
}

/**
 * Keep the path-variable table in step with the URL: a placeholder that is
 * still in the path keeps its value, one that is gone is dropped, a new one
 * arrives empty.
 */
export function pathVariablesFromUrl(
  url: string,
  previous: readonly KeyValueEntry[],
): KeyValueEntry[] {
  const existing = new Map(previous.map((entry) => [entry.key, entry]));
  return pathVariableNames(url).map(
    (name) => existing.get(name) ?? createEntry({ key: name }),
  );
}

/**
 * Whether a URL is complete enough to send: it has a scheme, or a template that
 * will supply one. Used to enable the Send button, not to validate the address
 * (the runner does that, after resolution).
 */
export function looksSendable(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === '') return false;
  if (trimmed.startsWith('{{')) return true;
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed);
}
