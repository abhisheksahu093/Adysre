import type { PageSnapshot } from './types';
import { isBlockedHost, ScanValidationError, validateScanUrl } from './validate';

/**
 * Fetch a page for analysis, safely.
 *
 * Redirects are followed BY HAND rather than by `fetch` for two reasons: the
 * chain has to be recorded for the report, and every hop has to be re-checked
 * against the SSRF guard - a public URL that 302s to `http://169.254.169.254/`
 * is the exact attack the hostname check exists to stop, and `redirect: 'follow'`
 * would sail straight through it.
 *
 * The body is capped so a hostile or accidental multi-gigabyte response cannot
 * exhaust memory, and the whole thing is bounded by a wall-clock timeout.
 */

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 8;
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB of HTML is already an outlier.
const USER_AGENT = 'AdysreWebsiteIntelligence/0.1 (+https://adysre.com)';

export interface CollectOptions {
  timeoutMs?: number;
  /** Injectable for tests; defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

export class ScanFetchError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'ScanFetchError';
  }
}

/** Read a response body up to `MAX_BYTES`, decoding as UTF-8. */
async function readCapped(response: Response): Promise<{ html: string; bytes: number }> {
  const body = response.body;
  if (!body) {
    const text = await response.text();
    return { html: text.slice(0, MAX_BYTES), bytes: Buffer.byteLength(text) };
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      bytes += value.byteLength;
      chunks.push(value);
      if (bytes >= MAX_BYTES) {
        await reader.cancel().catch(() => undefined);
        break;
      }
    }
  }
  const html = new TextDecoder('utf-8').decode(Buffer.concat(chunks));
  return { html, bytes };
}

/**
 * Fetch `startUrl`, following up to {@link MAX_REDIRECTS} redirects, checking
 * each hop against the SSRF guard. Returns the final page as a snapshot.
 */
export async function collectPage(startUrl: string, options: CollectOptions = {}): Promise<PageSnapshot> {
  const doFetch = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // Validate the entry point the same way the API did, so `collectPage` is safe
  // to call on its own.
  let current = validateScanUrl(startUrl);
  const redirects: string[] = [];
  const started = Date.now();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      let response: Response;
      try {
        response = await doFetch(current.toString(), {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' },
        });
      } catch (error) {
        if (controller.signal.aborted) {
          throw new ScanFetchError('The site took too long to respond.', 'timeout');
        }
        throw new ScanFetchError(
          error instanceof Error ? error.message : 'The site could not be reached.',
          'unreachable',
        );
      }

      const status = response.status;
      const location = response.headers.get('location');

      // A redirect: validate the target, record it, and continue.
      if (status >= 300 && status < 400 && location) {
        if (hop === MAX_REDIRECTS) {
          throw new ScanFetchError('The site redirected too many times.', 'too_many_redirects');
        }
        let next: URL;
        try {
          next = new URL(location, current);
        } catch {
          throw new ScanFetchError('The site sent an invalid redirect.', 'bad_redirect');
        }
        if (next.protocol !== 'http:' && next.protocol !== 'https:') {
          throw new ScanFetchError('The site redirected to a non-web address.', 'bad_redirect');
        }
        if (isBlockedHost(next.hostname)) {
          throw new ScanValidationError('The site redirected to a blocked address.', 'url_blocked');
        }
        redirects.push(next.toString());
        current = next;
        continue;
      }

      // A terminal response: read it (capped) and snapshot.
      const { html, bytes } = await readCapped(response);
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });
      const setCookies = readSetCookies(response, headers);

      return {
        requestedUrl: startUrl,
        finalUrl: current.toString(),
        status,
        headers,
        setCookies,
        html,
        htmlBytes: bytes,
        timingMs: Date.now() - started,
        redirects,
      };
    }

    throw new ScanFetchError('The site redirected too many times.', 'too_many_redirects');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Recover individual `set-cookie` values. `Headers.get` folds them into one
 * comma-joined string, which is ambiguous (cookie values contain commas), so
 * prefer `getSetCookie()` where the runtime has it (Node 18.14+ / undici).
 */
function readSetCookies(response: Response, headers: Record<string, string>): string[] {
  const getter = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  if (typeof getter === 'function') {
    const values = getter.call(response.headers);
    if (Array.isArray(values)) return values;
  }
  return headers['set-cookie'] ? [headers['set-cookie']] : [];
}
