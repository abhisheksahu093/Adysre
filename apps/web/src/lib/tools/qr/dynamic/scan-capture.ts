/**
 * Turn an incoming scan request into a stored scan event - entirely offline.
 *
 * There is no paid geo-IP or device API here: everything is derived from
 * headers the browser already sends. Device/browser/OS come from a small
 * User-Agent heuristic (good enough for the mobile/tablet/desktop and
 * major-engine breakdown an analytics view shows), region is the best guess
 * from Accept-Language, and UTM comes straight off the scan URL. Real geo-IP is
 * a later, still-offline upgrade (a bundled IP-to-country table).
 */

export interface ScanContext {
  device: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  utm: Record<string, string> | null;
}

function detectDevice(ua: string): string {
  if (/\b(ipad|tablet|playbook|silk)\b/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
    return 'tablet';
  }
  if (/\b(mobile|iphone|ipod|android.*mobile|windows phone)\b/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser(ua: string): string {
  // Order matters: Edge/Opera masquerade as Chrome, Chrome as Safari.
  if (/edg(e|a|ios)?\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/samsungbrowser/i.test(ua)) return 'Samsung Internet';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua)) return 'Safari';
  return 'Other';
}

function detectOs(ua: string): string {
  if (/windows nt/i.test(ua)) return 'Windows';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/mac os x/i.test(ua)) return 'macOS';
  if (/android/i.test(ua)) return 'Android';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Other';
}

/** Region subtag from Accept-Language, e.g. `en-US,en;q=0.9` → `US`. */
function regionFromLanguage(header: string | null): string | null {
  if (!header) return null;
  const first = header.split(',')[0]?.trim() ?? '';
  const region = first.split('-')[1];
  return region ? region.toUpperCase().slice(0, 2) : null;
}

/** Referrer host only (drop path/query - it is enough for the breakdown). */
function referrerHost(header: string | null): string | null {
  if (!header) return null;
  try {
    return new URL(header).host || null;
  } catch {
    return null;
  }
}

function utmFrom(url: URL): Record<string, string> | null {
  const utm: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const value = url.searchParams.get(key);
    if (value) utm[key.replace('utm_', '')] = value;
  }
  return Object.keys(utm).length > 0 ? utm : null;
}

/**
 * Build a scan context from a request. Split from the route handler so it is a
 * pure function of (url, headers) and unit-testable without a server.
 */
export function captureScan(url: URL, headers: Headers): ScanContext {
  const ua = headers.get('user-agent') ?? '';
  return {
    device: ua ? detectDevice(ua) : null,
    browser: ua ? detectBrowser(ua) : null,
    os: ua ? detectOs(ua) : null,
    referrer: referrerHost(headers.get('referer')),
    country: regionFromLanguage(headers.get('accept-language')),
    city: null,
    utm: utmFrom(url),
  };
}
