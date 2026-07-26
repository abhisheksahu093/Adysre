/**
 * ADYSRE API Studio - the execution contract.
 *
 * This is the wire format between the builder and the runner, and it is the one
 * boundary in the module that untrusted input crosses, so it is deliberately
 * narrow and fully resolved: no `{{variables}}`, no inheritance, no auth
 * strategy to interpret. The builder does all of that in the browser and hands
 * the runner a literal request. That keeps the runner small enough to audit,
 * and it is what lets a future desktop agent implement the same contract and
 * reach `localhost` without the frontend changing at all.
 *
 * Bodies cross as text or base64 rather than as a stream because the request is
 * JSON. Large uploads reference `fileIds` in the module file store instead, so
 * the JSON stays small no matter how big the upload is.
 */

import type { ExecutionAgent } from './protocol';
import type { HttpMethod } from './http';

/** A header exactly as it goes on the wire: ordered, repeatable, resolved. */
export interface WireHeader {
  name: string;
  value: string;
}

export type WireBodyEncoding = 'none' | 'text' | 'base64' | 'multipart';

/** A multipart part on the wire. Files stay by reference. */
export type WirePart =
  | { kind: 'text'; name: string; value: string; contentType: string | null }
  | { kind: 'file'; name: string; fileId: string; contentType: string | null };

export type WireBody =
  | { encoding: 'none' }
  | { encoding: 'text'; content: string }
  | { encoding: 'base64'; content: string; fileName: string | null }
  | { encoding: 'multipart'; parts: WirePart[] };

/** Transport knobs the runner honours. Mirrors `RequestSettings`, resolved. */
export interface WireSettings {
  timeoutMs: number;
  followRedirects: boolean;
  maxRedirects: number;
  verifyTls: boolean;
  decompress: boolean;
  sendCookies: boolean;
  storeCookies: boolean;
  maxResponseBytes: number;
}

/** The runner's input. Everything here is literal and ready to send. */
export interface ExecutionRequest {
  /** Client-generated id, echoed back so a response can find its tab. */
  id: string;
  workspaceId: string;
  /** Set when the send came from a saved request; absent for a scratch tab. */
  requestNodeId: string | null;
  agent: ExecutionAgent;
  method: HttpMethod;
  /** Absolute, already-encoded URL. */
  url: string;
  headers: WireHeader[];
  body: WireBody;
  settings: WireSettings;
}

/** A cookie as stored by the jar and shown in the cookie editor. */
export interface CookieRecord {
  name: string;
  value: string;
  domain: string;
  path: string;
  /** Epoch milliseconds; `null` for a session cookie. */
  expires: number | null;
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none' | null;
}

/**
 * Per-phase timings in milliseconds. Any phase the runtime cannot measure is
 * `null` rather than `0`, so the waterfall never invents precision it lacks.
 */
export interface ExecutionTimings {
  dns: number | null;
  tcp: number | null;
  tls: number | null;
  /** Time to first byte, measured from the end of the request write. */
  firstByte: number | null;
  download: number | null;
  total: number;
}

export interface TransferSize {
  headers: number;
  body: number;
  total: number;
}

/** One hop of a redirect chain, kept so the user can see where they were sent. */
export interface RedirectHop {
  status: number;
  from: string;
  to: string;
}

export interface ExecutionResponse {
  status: number;
  statusText: string;
  /** e.g. `HTTP/1.1`, `HTTP/2`. `null` when the runtime does not expose it. */
  httpVersion: string | null;
  headers: WireHeader[];
  cookies: CookieRecord[];
  /** `base64` whenever the body is not valid UTF-8 (images, PDFs, archives). */
  bodyEncoding: 'utf8' | 'base64';
  body: string;
  /** True when the body was cut off at `maxResponseBytes`. */
  truncated: boolean;
  size: TransferSize;
  requestSize: TransferSize;
  timings: ExecutionTimings;
  redirects: RedirectHop[];
  /** Set when the request completed over TLS with verification disabled. */
  insecure: boolean;
}

/**
 * Stable, machine-readable failure codes. The UI maps each to actionable copy
 * (translation keys under `apiStudio.errors`), so no English text is invented
 * at the failure site.
 */
export const EXECUTION_ERROR_CODES = [
  'invalid_url',
  'blocked_host',
  'unsupported_protocol',
  'dns_failure',
  'connection_refused',
  'connection_reset',
  'tls_error',
  'timeout',
  'too_many_redirects',
  'response_too_large',
  'request_too_large',
  'cancelled',
  'rate_limited',
  'agent_unavailable',
  'network',
] as const;
export type ExecutionErrorCode = (typeof EXECUTION_ERROR_CODES)[number];

export interface ExecutionError {
  code: ExecutionErrorCode;
  /** Diagnostic detail for the console. Never the only thing shown to a user. */
  message: string;
  /** Underlying runtime code, e.g. `ECONNREFUSED`, when there is one. */
  cause: string | null;
}

/**
 * Result envelope. A failed HTTP call is not an error: a 500 response is
 * `ok: true` with `status: 500`. `ok: false` means the exchange never happened.
 */
export type ExecutionResult =
  | { id: string; ok: true; response: ExecutionResponse }
  | { id: string; ok: false; error: ExecutionError };
