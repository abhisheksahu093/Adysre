import { createHash, createHmac } from 'node:crypto';
import type { WireHeader } from '@/modules/api-studio/types';

/**
 * AWS Signature Version 4.
 *
 * Server-side because the signature covers the FINAL request: method, canonical
 * URI, canonical query, the exact set of signed headers and a hash of the body.
 * Anything added after signing invalidates it, which is why this runs last, in
 * the runner, rather than in the browser where the runner's own headers are not
 * yet known.
 *
 * The algorithm is unforgiving and its failure mode is a bare 403, so each step
 * below names which part of the spec it implements.
 */

const ALGORITHM = 'AWS4-HMAC-SHA256';

export interface SigV4Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  /** Temporary credentials only; sent as `x-amz-security-token`. */
  sessionToken: string;
  region: string;
  service: string;
}

function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function hmac(key: Buffer | string, value: string): Buffer {
  return createHmac('sha256', key).update(value, 'utf8').digest();
}

/** `20260726T093000Z` and `20260726`, the two forms the spec uses. */
function stamps(now: Date): { amzDate: string; dateStamp: string } {
  const amzDate = `${now.toISOString().replace(/[:-]|\.\d{3}/g, '')}`;
  return { amzDate, dateStamp: amzDate.slice(0, 8) };
}

/**
 * Canonical URI: the path, percent-encoded segment by segment, with each
 * segment encoded TWICE for every service except S3. That is not a typo; it is
 * what the spec says, and getting it wrong is a silent 403.
 */
function canonicalUri(pathname: string, service: string): string {
  if (pathname === '') return '/';
  if (service === 's3') return pathname;

  return pathname
    .split('/')
    .map((segment) => encodeRfc3986(encodeRfc3986(segment)))
    .join('/');
}

/** `encodeURIComponent` leaves characters the spec requires to be encoded. */
function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/** Canonical query: parameters sorted by name then value, both encoded. */
function canonicalQuery(search: URLSearchParams): string {
  const pairs: [string, string][] = [];
  search.forEach((value, key) => pairs.push([key, value]));

  return pairs
    .map(([key, value]) => [encodeRfc3986(key), encodeRfc3986(value)] as const)
    .sort((a, b) => (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0])))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

/**
 * Sign a request.
 *
 * @returns the headers to ADD. The caller appends them; nothing is mutated, so
 * the signature cannot be invalidated by this function's own bookkeeping.
 */
export function signRequest(params: {
  credentials: SigV4Credentials;
  method: string;
  url: URL;
  headers: readonly WireHeader[];
  body: Buffer | null;
  /** Injected by tests so a signature is reproducible. */
  now?: Date;
}): WireHeader[] {
  const { credentials, method, url, headers } = params;
  const { amzDate, dateStamp } = stamps(params.now ?? new Date());
  const payloadHash = sha256(params.body ?? Buffer.alloc(0));

  // Host and the date are always signed; the token when present. Everything the
  // caller already set is signed too, so a header they rely on is covered.
  const signed: WireHeader[] = [
    { name: 'host', value: url.host },
    { name: 'x-amz-date', value: amzDate },
    { name: 'x-amz-content-sha256', value: payloadHash },
    ...(credentials.sessionToken
      ? [{ name: 'x-amz-security-token', value: credentials.sessionToken }]
      : []),
    ...headers
      .filter((header) => !header.name.toLowerCase().startsWith('x-amz-'))
      .filter((header) => header.name.toLowerCase() !== 'host')
      .map((header) => ({ name: header.name.toLowerCase(), value: header.value.trim() })),
  ];

  // Duplicate names must be folded, and the list sorted, before hashing.
  const folded = new Map<string, string[]>();
  for (const header of signed) {
    const bucket = folded.get(header.name);
    if (bucket) bucket.push(header.value);
    else folded.set(header.name, [header.value]);
  }

  const names = [...folded.keys()].sort();
  const canonicalHeaders = names.map((name) => `${name}:${folded.get(name)!.join(',')}\n`).join('');
  const signedHeaders = names.join(';');

  const canonicalRequest = [
    method.toUpperCase(),
    canonicalUri(url.pathname, credentials.service),
    canonicalQuery(url.searchParams),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${dateStamp}/${credentials.region}/${credentials.service}/aws4_request`;
  const stringToSign = [ALGORITHM, amzDate, scope, sha256(canonicalRequest)].join('\n');

  // The signing key is derived per day, region and service, so a leaked one is
  // bounded in all three.
  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${credentials.secretAccessKey}`, dateStamp), credentials.region), credentials.service),
    'aws4_request',
  );
  const signature = createHmac('sha256', signingKey).update(stringToSign, 'utf8').digest('hex');

  return [
    { name: 'X-Amz-Date', value: amzDate },
    { name: 'X-Amz-Content-Sha256', value: payloadHash },
    ...(credentials.sessionToken
      ? [{ name: 'X-Amz-Security-Token', value: credentials.sessionToken }]
      : []),
    {
      name: 'Authorization',
      value: `${ALGORITHM} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
  ];
}
