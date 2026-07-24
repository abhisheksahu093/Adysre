import type { ScanInput } from './types';

/**
 * Input validation and SSRF guarding for the scanner.
 *
 * A scanner fetches a URL a stranger supplies, which is the textbook Server-Side
 * Request Forgery setup: without guards, `POST /scan { url: "http://169.254.169.254/…" }`
 * turns our server into the attacker's HTTP client against our own network and
 * cloud metadata endpoint. So every URL is checked here before a request is
 * made, and again on each redirect hop in `collect.ts`.
 *
 * Hostname-based blocking is the first line and the one that runs with no
 * network. It is NOT sufficient on its own - a hostname can resolve to a
 * private IP (DNS rebinding) - so production must also resolve the host and
 * re-check the resolved address. That belongs in the collector's fetch layer;
 * this module documents the requirement and covers the literal cases.
 */

export class ScanValidationError extends Error {
  constructor(
    message: string,
    /** Stable, machine-readable code for the API error envelope. */
    readonly code: string,
  ) {
    super(message);
    this.name = 'ScanValidationError';
  }
}

const MAX_URL_LENGTH = 2048;

/** Hostnames we never fetch: loopback, link-local and cloud metadata. */
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'ip6-localhost',
  'ip6-loopback',
  'metadata.google.internal',
]);

/** Private / reserved IPv4 ranges, as anchored patterns on the hostname. */
const PRIVATE_IPV4 = [
  /^127\./,
  /^10\./,
  /^0\./,
  /^169\.254\./, // link-local, includes 169.254.169.254 metadata
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
];

/** True when a hostname is one we must refuse to fetch. */
export function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (BLOCKED_HOSTNAMES.has(host)) return true;
  // `.local` mDNS and bare hostnames with no dot are intranet, not the web.
  if (host.endsWith('.local')) return true;
  if (PRIVATE_IPV4.some((re) => re.test(host))) return true;
  // IPv6 loopback and unique-local / link-local prefixes.
  if (host === '::1' || host === '::') return true;
  if (/^(fc|fd|fe80)/i.test(host) && host.includes(':')) return true;

  return false;
}

/**
 * Validate and normalise a raw URL string into a safe, absolute http(s) URL.
 * Throws {@link ScanValidationError} with a stable code on any rejection.
 */
export function validateScanUrl(raw: unknown): URL {
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw new ScanValidationError('A url is required.', 'url_required');
  }

  const trimmed = raw.trim();
  if (trimmed.length > MAX_URL_LENGTH) {
    throw new ScanValidationError('The url is too long.', 'url_too_long');
  }

  // A scheme-less input like "example.com" is a common, friendly case: default
  // it to https rather than rejecting it.
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new ScanValidationError('That is not a valid url.', 'url_invalid');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new ScanValidationError('Only http and https urls can be scanned.', 'url_scheme');
  }
  if (!url.hostname || !url.hostname.includes('.')) {
    // No dot ⇒ not a public domain (and not an IP). Reject bare hostnames.
    if (!/^\d/.test(url.hostname)) {
      throw new ScanValidationError('Enter a full domain, e.g. example.com.', 'url_hostname');
    }
  }
  if (isBlockedHost(url.hostname)) {
    throw new ScanValidationError('That address is not allowed.', 'url_blocked');
  }

  return url;
}

/** Parse and validate a request body into a {@link ScanInput}. */
export function parseScanInput(body: unknown): { input: ScanInput; url: URL } {
  const url = validateScanUrl(
    body && typeof body === 'object' ? (body as Record<string, unknown>).url : undefined,
  );
  return { input: { url: url.toString() }, url };
}
