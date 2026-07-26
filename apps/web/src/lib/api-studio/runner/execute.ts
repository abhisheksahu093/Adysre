import { lookup as dnsLookup } from 'node:dns/promises';
import { request as httpRequest, type IncomingMessage } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { Readable } from 'node:stream';
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib';
import type {
  CookieRecord,
  ExecutionError,
  ExecutionErrorCode,
  ExecutionRequest,
  ExecutionResult,
  ExecutionTimings,
  RedirectHop,
  WireHeader,
} from '@/modules/api-studio/types';
import { RUNNER_MANAGED_HEADERS, STATUS_TEXT } from '@/modules/api-studio/constants/http';
import { checkAddress, checkUrl, type HostPolicy } from './host-policy';

/**
 * The request runner.
 *
 * Built on `node:http`/`node:https` rather than `fetch`, for three things fetch
 * cannot give an API client:
 *
 * 1. REAL TIMINGS. DNS, TCP and TLS are socket events; fetch hides them, and a
 *    response viewer that invented those numbers would be lying.
 * 2. ADDRESS PINNING. The host policy is decided on a resolved IP and the
 *    connection is then made to THAT IP, so a name cannot resolve to something
 *    allowed for the check and something private for the connection.
 * 3. PER-REQUEST TLS. "Ignore certificate errors" is a real developer need on a
 *    staging box with a self-signed cert, and must be per request rather than
 *    a process-wide flag that would silently weaken every other call.
 *
 * Redirects are followed manually so every hop is re-checked against the
 * policy, recorded for the user, and stripped of credentials when the host
 * changes.
 *
 * Server-side by construction rather than by the `server-only` marker: it
 * imports `node:http`, which no client bundle can resolve. The marker is left
 * off so the runner can be driven by tests against a real local server, which
 * is the only way to know it actually does any of the above (the collector in
 * Website Intelligence is arranged the same way, for the same reason).
 */

export interface RunnerOptions {
  policy: HostPolicy;
  signal?: AbortSignal;
}

interface HopResult {
  status: number;
  statusText: string;
  httpVersion: string;
  headers: WireHeader[];
  rawBytes: number;
  headerBytes: number;
  body: Buffer;
  truncated: boolean;
  timings: ExecutionTimings;
}

/** Headers a client may not dictate, plus the ones we compute per hop. */
const STRIPPED = new Set([...RUNNER_MANAGED_HEADERS, 'host']);

function fail(id: string, code: ExecutionErrorCode, message: string, cause: string | null = null): ExecutionResult {
  return { id, ok: false, error: { code, message, cause } satisfies ExecutionError };
}

/** Map a Node socket/TLS error onto a stable, actionable code. */
function classifyError(error: unknown): { code: ExecutionErrorCode; cause: string | null } {
  const cause = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : null;

  switch (cause) {
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return { code: 'dns_failure', cause };
    case 'ECONNREFUSED':
      return { code: 'connection_refused', cause };
    case 'ECONNRESET':
    case 'EPIPE':
      return { code: 'connection_reset', cause };
    case 'ETIMEDOUT':
    case 'ESOCKETTIMEDOUT':
      return { code: 'timeout', cause };
    case 'DEPTH_ZERO_SELF_SIGNED_CERT':
    case 'SELF_SIGNED_CERT_IN_CHAIN':
    case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
    case 'CERT_HAS_EXPIRED':
    case 'ERR_TLS_CERT_ALTNAME_INVALID':
    case 'EPROTO':
      return { code: 'tls_error', cause };
    default:
      return { code: 'network', cause };
  }
}

/** Resolve a hostname and return the first address the policy permits. */
async function resolveAllowed(
  hostname: string,
  policy: HostPolicy,
): Promise<{ ok: true; address: string; family: 4 | 6; ms: number } | { ok: false; code: ExecutionErrorCode; reason: string }> {
  const started = performance.now();

  // A literal IP needs no lookup, but still needs the policy check.
  let addresses: { address: string; family: number }[];
  try {
    addresses = await dnsLookup(hostname, { all: true, verbatim: true });
  } catch (error) {
    const { code } = classifyError(error);
    return { ok: false, code: code === 'network' ? 'dns_failure' : code, reason: 'Could not resolve the host.' };
  }

  const ms = performance.now() - started;

  for (const candidate of addresses) {
    const verdict = checkAddress(candidate.address, policy);
    if (verdict.allowed) {
      return { ok: true, address: candidate.address, family: candidate.family === 6 ? 6 : 4, ms };
    }
  }

  // Every address was refused. Naming the reason is safe (it is a property of
  // the address the caller supplied) and saves a long debugging session.
  const first = addresses[0];
  const verdict = first ? checkAddress(first.address, policy) : { allowed: false as const, reason: 'reserved' as const };
  return {
    ok: false,
    code: 'blocked_host',
    reason: verdict.allowed ? 'blocked' : verdict.reason,
  };
}

/** Parse `Set-Cookie` values into the jar's shape. */
export function parseSetCookies(values: readonly string[], defaultDomain: string): CookieRecord[] {
  return values.map((raw) => {
    const [pair, ...attributes] = raw.split(';');
    const eq = pair?.indexOf('=') ?? -1;
    const cookie: CookieRecord = {
      name: eq === -1 ? (pair?.trim() ?? '') : (pair?.slice(0, eq).trim() ?? ''),
      value: eq === -1 ? '' : (pair?.slice(eq + 1).trim() ?? ''),
      domain: defaultDomain,
      path: '/',
      expires: null,
      secure: false,
      httpOnly: false,
      sameSite: null,
    };

    for (const attribute of attributes) {
      const [rawKey, ...rest] = attribute.split('=');
      const key = rawKey?.trim().toLowerCase() ?? '';
      const value = rest.join('=').trim();

      if (key === 'domain' && value) cookie.domain = value.replace(/^\./, '');
      else if (key === 'path' && value) cookie.path = value;
      else if (key === 'secure') cookie.secure = true;
      else if (key === 'httponly') cookie.httpOnly = true;
      else if (key === 'samesite') {
        const mode = value.toLowerCase();
        cookie.sameSite = mode === 'strict' || mode === 'lax' || mode === 'none' ? mode : null;
      } else if (key === 'expires' && value) {
        const parsed = Date.parse(value);
        if (!Number.isNaN(parsed)) cookie.expires = parsed;
      } else if (key === 'max-age' && value) {
        const seconds = Number(value);
        if (!Number.isNaN(seconds)) cookie.expires = Date.now() + seconds * 1_000;
      }
    }

    return cookie;
  });
}

/** Flatten Node's header bag into the ordered wire shape. */
function toWireHeaders(message: IncomingMessage): WireHeader[] {
  const headers: WireHeader[] = [];
  const raw = message.rawHeaders;
  for (let i = 0; i < raw.length; i += 2) {
    headers.push({ name: raw[i] ?? '', value: raw[i + 1] ?? '' });
  }
  return headers;
}

/** Decode the body when the server compressed it. */
function decompressStream(message: IncomingMessage, decompress: boolean): Readable {
  if (!decompress) return message;
  const encoding = (message.headers['content-encoding'] ?? '').toLowerCase();

  if (encoding === 'gzip' || encoding === 'x-gzip') return message.pipe(createGunzip());
  if (encoding === 'deflate') return message.pipe(createInflate());
  if (encoding === 'br') return message.pipe(createBrotliDecompress());
  return message;
}

/** Perform one hop. Never follows a redirect itself. */
function performHop(
  target: URL,
  address: string,
  method: string,
  headers: WireHeader[],
  body: Buffer | null,
  settings: ExecutionRequest['settings'],
  dnsMs: number,
  signal: AbortSignal | undefined,
): Promise<HopResult> {
  return new Promise<HopResult>((resolve, reject) => {
    const secure = target.protocol === 'https:';
    const send = secure ? httpsRequest : httpRequest;
    const started = performance.now();
    let connectedAt: number | null = null;
    let secureAt: number | null = null;
    let firstByteAt: number | null = null;

    const outgoing: Record<string, string | string[]> = {};
    for (const header of headers) {
      if (STRIPPED.has(header.name.toLowerCase())) continue;
      const existing = outgoing[header.name];
      if (existing === undefined) outgoing[header.name] = header.value;
      else if (Array.isArray(existing)) existing.push(header.value);
      else outgoing[header.name] = [existing, header.value];
    }
    // The connection goes to a pinned address, so the Host header is what tells
    // the server which site is being asked for.
    outgoing.Host = target.host;
    if (!settings.decompress) outgoing['Accept-Encoding'] = 'identity';
    else if (!Object.keys(outgoing).some((name) => name.toLowerCase() === 'accept-encoding')) {
      outgoing['Accept-Encoding'] = 'gzip, deflate, br';
    }

    const request = send({
      host: address,
      port: target.port ? Number(target.port) : secure ? 443 : 80,
      path: `${target.pathname}${target.search}`,
      method,
      headers: outgoing,
      timeout: settings.timeoutMs,
      // TLS is validated against the NAME, while the socket goes to the pinned
      // address: that is what makes rebinding impossible without breaking certs.
      ...(secure ? { servername: target.hostname, rejectUnauthorized: settings.verifyTls } : {}),
    });

    const onAbort = () => request.destroy(Object.assign(new Error('aborted'), { code: 'ABORTED' }));
    signal?.addEventListener('abort', onAbort, { once: true });

    const cleanup = () => signal?.removeEventListener('abort', onAbort);

    request.on('socket', (socket) => {
      socket.on('connect', () => {
        connectedAt = performance.now();
      });
      socket.on('secureConnect', () => {
        secureAt = performance.now();
      });
    });

    request.on('timeout', () => {
      request.destroy(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' }));
    });

    request.on('error', (error) => {
      cleanup();
      reject(error);
    });

    request.on('response', (message) => {
      firstByteAt = performance.now();
      const chunks: Buffer[] = [];
      let decoded = 0;
      let raw = 0;
      let truncated = false;

      message.on('data', (chunk: Buffer) => {
        raw += chunk.length;
      });

      const stream = decompressStream(message, settings.decompress);

      stream.on('data', (chunk: Buffer) => {
        if (truncated) return;
        const remaining = settings.maxResponseBytes - decoded;
        if (chunk.length >= remaining) {
          chunks.push(chunk.subarray(0, Math.max(0, remaining)));
          decoded += Math.max(0, remaining);
          truncated = true;
          // Stop pulling: a 2 GB response must not be read to the end just to
          // discard it.
          message.destroy();
          return;
        }
        chunks.push(chunk);
        decoded += chunk.length;
      });

      const finish = () => {
        cleanup();
        const endedAt = performance.now();
        const headerBytes = message.rawHeaders.reduce((total, part) => total + part.length + 2, 0);

        resolve({
          status: message.statusCode ?? 0,
          statusText: message.statusMessage || STATUS_TEXT[message.statusCode ?? 0] || '',
          httpVersion: `HTTP/${message.httpVersion}`,
          headers: toWireHeaders(message),
          rawBytes: raw,
          headerBytes,
          body: Buffer.concat(chunks),
          truncated,
          timings: {
            dns: dnsMs,
            tcp: connectedAt === null ? null : connectedAt - started,
            tls: secureAt === null || connectedAt === null ? null : secureAt - connectedAt,
            firstByte: firstByteAt === null ? null : firstByteAt - started,
            download: firstByteAt === null ? null : endedAt - firstByteAt,
            total: endedAt - started + dnsMs,
          },
        });
      };

      stream.on('end', finish);
      // `destroy` during a truncation ends the stream with `close`, not `end`.
      stream.on('close', () => {
        if (truncated) finish();
      });
      stream.on('error', (error) => {
        if (truncated) finish();
        else {
          cleanup();
          reject(error);
        }
      });
    });

    if (body && body.length > 0) request.write(body);
    request.end();
  });
}

/** Decode a body as UTF-8 when it really is UTF-8, otherwise as base64. */
function encodeBody(buffer: Buffer): { bodyEncoding: 'utf8' | 'base64'; body: string } {
  try {
    return { bodyEncoding: 'utf8', body: new TextDecoder('utf-8', { fatal: true }).decode(buffer) };
  } catch {
    return { bodyEncoding: 'base64', body: buffer.toString('base64') };
  }
}

/** The body bytes to send, for the encodings the runner can build today. */
function bodyBuffer(request: ExecutionRequest): { ok: true; buffer: Buffer | null } | { ok: false; detail: string } {
  const body = request.body;
  switch (body.encoding) {
    case 'none':
      return { ok: true, buffer: null };
    case 'text':
      return { ok: true, buffer: Buffer.from(body.content, 'utf8') };
    case 'base64':
      return { ok: true, buffer: Buffer.from(body.content, 'base64') };
    case 'multipart':
      // Text parts alone would silently drop the files the user attached, so
      // multipart waits for the file store rather than half-sending.
      return { ok: false, detail: 'Multipart bodies need the file store, which lands with uploads.' };
    default:
      return { ok: false, detail: 'Unsupported body encoding.' };
  }
}

/**
 * Send a prepared request.
 *
 * @param request - fully resolved: no templates, no auth strategies left.
 * @returns a result envelope. A 500 response is `ok: true` with status 500; a
 * result is only `ok: false` when the exchange never happened.
 */
export async function execute(
  request: ExecutionRequest,
  options: RunnerOptions,
): Promise<ExecutionResult> {
  const body = bodyBuffer(request);
  if (!body.ok) return fail(request.id, 'unsupported_body', body.detail);

  const shape = checkUrl(request.url);
  if (!shape.ok) return fail(request.id, 'invalid_url', shape.reason);

  const redirects: RedirectHop[] = [];
  let target = shape.url;
  let method = request.method;
  let headers = request.headers;
  let payload = body.buffer;
  let insecure = !request.settings.verifyTls;

  for (let hop = 0; hop <= request.settings.maxRedirects; hop += 1) {
    if (options.signal?.aborted) return fail(request.id, 'cancelled', 'Cancelled.');

    const resolved = await resolveAllowed(target.hostname, options.policy);
    if (!resolved.ok) {
      return fail(
        request.id,
        resolved.code,
        resolved.code === 'blocked_host'
          ? `That address is not reachable from this deployment (${resolved.reason}).`
          : resolved.reason,
      );
    }

    let result: HopResult;
    try {
      result = await performHop(
        target,
        resolved.address,
        method,
        headers,
        payload,
        request.settings,
        resolved.ms,
        options.signal,
      );
    } catch (error) {
      if (options.signal?.aborted) return fail(request.id, 'cancelled', 'Cancelled.');
      const { code, cause } = classifyError(error);
      return fail(request.id, code, describe(code), cause);
    }

    const location = result.headers.find((header) => header.name.toLowerCase() === 'location');
    const isRedirect = result.status >= 300 && result.status < 400 && location?.value;

    if (!isRedirect || !request.settings.followRedirects) {
      const setCookie = result.headers
        .filter((header) => header.name.toLowerCase() === 'set-cookie')
        .map((header) => header.value);
      const encoded = encodeBody(result.body);

      return {
        id: request.id,
        ok: true,
        response: {
          status: result.status,
          statusText: result.statusText,
          httpVersion: result.httpVersion,
          headers: result.headers,
          cookies: parseSetCookies(setCookie, target.hostname),
          ...encoded,
          truncated: result.truncated,
          size: {
            headers: result.headerBytes,
            body: result.rawBytes,
            total: result.headerBytes + result.rawBytes,
          },
          requestSize: requestSize(headers, payload),
          timings: result.timings,
          redirects,
          insecure,
        },
      };
    }

    let next: URL;
    try {
      next = new URL(location.value, target);
    } catch {
      return fail(request.id, 'invalid_url', 'The server redirected to an invalid URL.');
    }

    const shapeNext = checkUrl(next.toString());
    if (!shapeNext.ok) return fail(request.id, 'invalid_url', shapeNext.reason);

    redirects.push({ status: result.status, from: target.toString(), to: next.toString() });

    // Credentials must not follow a redirect to a different origin: that is how
    // an open redirect turns into a token leak.
    if (next.host !== target.host) {
      headers = headers.filter(
        (header) => !['authorization', 'cookie'].includes(header.name.toLowerCase()),
      );
    }
    // 303 always, and 301/302 by universal convention, turn a POST into a GET.
    if (result.status === 303 || ((result.status === 301 || result.status === 302) && method === 'POST')) {
      method = 'GET';
      payload = null;
      headers = headers.filter(
        (header) => !['content-type', 'content-length'].includes(header.name.toLowerCase()),
      );
    }

    if (next.protocol === 'http:') insecure = insecure || target.protocol === 'https:';
    target = shapeNext.url;
  }

  return fail(request.id, 'too_many_redirects', 'The server redirected too many times.');
}

function requestSize(headers: readonly WireHeader[], payload: Buffer | null) {
  const headerBytes = headers.reduce((total, header) => total + header.name.length + header.value.length + 4, 0);
  const bodyBytes = payload?.length ?? 0;
  return { headers: headerBytes, body: bodyBytes, total: headerBytes + bodyBytes };
}

/** Diagnostic text for the console. The UI shows its own copy, by code. */
function describe(code: ExecutionErrorCode): string {
  switch (code) {
    case 'dns_failure':
      return 'The host could not be resolved.';
    case 'connection_refused':
      return 'The connection was refused.';
    case 'connection_reset':
      return 'The connection was reset.';
    case 'timeout':
      return 'The request timed out.';
    case 'tls_error':
      return 'The TLS handshake or certificate check failed.';
    default:
      return 'The request could not be completed.';
  }
}
