/**
 * ADYSRE API Studio - HTTP lookup tables.
 *
 * Reference data only: the vocabulary the builder autocompletes against and the
 * facts the runner needs about the protocol. Value unions that define the
 * domain (methods, body types, auth types) live with the types they belong to;
 * what lives here is everything that is a lookup rather than a shape.
 */

import type { HttpMethod, RawLanguage } from '../types/http';

/**
 * Methods that carry no request body. TRACE is forbidden a body by RFC 9110;
 * GET, HEAD, DELETE and OPTIONS may technically have one but almost no server
 * reads it, so the builder hides the body tab and the runner drops it.
 */
export const METHODS_WITHOUT_BODY: readonly HttpMethod[] = [
  'GET',
  'HEAD',
  'OPTIONS',
  'TRACE',
  'CONNECT',
];

/** Methods safe to retry automatically: no side effects, or idempotent ones. */
export const IDEMPOTENT_METHODS: readonly HttpMethod[] = [
  'GET',
  'HEAD',
  'OPTIONS',
  'TRACE',
  'PUT',
  'DELETE',
];

/** Default Content-Type per raw language, applied unless the user sets one. */
export const RAW_CONTENT_TYPES: Record<RawLanguage, string> = {
  text: 'text/plain',
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  javascript: 'application/javascript',
};

/** Content types offered in the body-type picker's override list. */
export const COMMON_CONTENT_TYPES: readonly string[] = [
  'application/json',
  'application/xml',
  'application/x-www-form-urlencoded',
  'application/octet-stream',
  'application/pdf',
  'application/zip',
  'application/graphql',
  'multipart/form-data',
  'text/plain',
  'text/html',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'video/mp4',
  'audio/mpeg',
];

/** Header names the request-header table autocompletes. */
export const COMMON_REQUEST_HEADERS: readonly string[] = [
  'Accept',
  'Accept-Encoding',
  'Accept-Language',
  'Authorization',
  'Cache-Control',
  'Content-Type',
  'Cookie',
  'Idempotency-Key',
  'If-Match',
  'If-None-Match',
  'If-Modified-Since',
  'Origin',
  'Prefer',
  'Range',
  'Referer',
  'User-Agent',
  'X-Api-Key',
  'X-Correlation-Id',
  'X-Csrf-Token',
  'X-Forwarded-For',
  'X-Request-Id',
  'X-Requested-With',
];

/**
 * Headers the runner computes and the client may not dictate.
 *
 * Two reasons, both load-bearing: a client-supplied `Content-Length` or
 * `Transfer-Encoding` that disagrees with the actual body is the request
 * smuggling primitive, and connection-level headers belong to the runtime's
 * socket, not to the user's request.
 */
export const RUNNER_MANAGED_HEADERS: readonly string[] = [
  'content-length',
  'transfer-encoding',
  'connection',
  'keep-alive',
  'upgrade',
  'proxy-connection',
  'proxy-authorization',
  'te',
  'trailer',
  'expect',
];

/** Response headers the viewer highlights because they change how to read it. */
export const NOTABLE_RESPONSE_HEADERS: readonly string[] = [
  'content-type',
  'content-length',
  'content-encoding',
  'cache-control',
  'etag',
  'location',
  'retry-after',
  'set-cookie',
  'www-authenticate',
];

/**
 * Status reason phrases. The runtime supplies one for real responses; this map
 * covers the cases where it does not (HTTP/2 drops the reason phrase entirely)
 * and gives the status assertion something to compare against.
 */
export const STATUS_TEXT: Readonly<Record<number, string>> = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Content Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Content',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  511: 'Network Authentication Required',
};

/** Status classes, used for the response badge's semantic token. */
export const STATUS_CLASSES = ['info', 'success', 'redirect', 'client', 'server'] as const;
export type StatusClass = (typeof STATUS_CLASSES)[number];

/** The status class a code falls into. */
export function statusClass(status: number): StatusClass {
  if (status >= 500) return 'server';
  if (status >= 400) return 'client';
  if (status >= 300) return 'redirect';
  if (status >= 200) return 'success';
  return 'info';
}

/**
 * Semantic TOKEN NAMES per method and status class, never colour literals. The
 * component turns a tone into a Tailwind class built from theme tokens, so both
 * themes stay legible and a palette change reaches this with everything else
 * (UI_DESIGN_SYSTEM.md).
 */
export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'muted';

export const METHOD_TONES: Record<HttpMethod, Tone> = {
  GET: 'primary',
  POST: 'success',
  PUT: 'warning',
  PATCH: 'warning',
  DELETE: 'danger',
  OPTIONS: 'muted',
  HEAD: 'muted',
  TRACE: 'muted',
  CONNECT: 'muted',
};

export const STATUS_TONES: Record<StatusClass, Tone> = {
  info: 'muted',
  success: 'success',
  redirect: 'warning',
  client: 'danger',
  server: 'danger',
};
