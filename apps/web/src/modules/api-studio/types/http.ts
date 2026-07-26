/**
 * ADYSRE API Studio - HTTP request model.
 *
 * Two shape decisions carry the whole module:
 *
 * 1. Headers, query params and form fields are ORDERED ARRAYS of
 *    {@link KeyValueEntry}, never `Record<string, string>`. HTTP allows repeated
 *    keys (`Set-Cookie`, `?tag=a&tag=b`), order is observable, and a disabled
 *    row has to survive a save so the user can toggle it back on. A map would
 *    quietly destroy all three.
 * 2. Body and auth are DISCRIMINATED UNIONS on `type`. Every variant carries
 *    exactly the fields it needs, so there is no "which of these 30 nullable
 *    columns apply right now" guesswork in the builder, the runner or the
 *    code generator.
 *
 * Every string field may contain `{{variable}}` templates; nothing here is
 * resolved. Resolution happens once, at send time, against the variable stack.
 */

import type { ApiVariable } from './environment';
import type { Protocol } from './protocol';

export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD',
  'TRACE',
  'CONNECT',
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

/** One row of a headers / params / url-encoded table. */
export interface KeyValueEntry {
  id: string;
  key: string;
  value: string;
  /** Unchecked rows are kept and persisted, but not sent. */
  enabled: boolean;
  description: string;
}

interface FormEntryBase {
  id: string;
  key: string;
  enabled: boolean;
  description: string;
  /** Per-part Content-Type override, e.g. `application/json` for a JSON part. */
  contentType: string | null;
}

/**
 * A multipart part. Files are referenced by id rather than embedded: the binary
 * lives in the module's file store, so a collection stays a small JSON document
 * that can be exported, diffed and synced.
 */
export type FormDataEntry =
  | (FormEntryBase & { kind: 'text'; value: string })
  | (FormEntryBase & { kind: 'file'; fileIds: string[] });

/**
 * Raw-body languages. These drive the editor mode and the default Content-Type;
 * they are not different body types, which is why "JSON", "XML", "HTML", "Text"
 * and "JavaScript" all collapse to one variant here.
 */
export const RAW_LANGUAGES = ['text', 'json', 'xml', 'html', 'javascript'] as const;
export type RawLanguage = (typeof RAW_LANGUAGES)[number];

export const BODY_TYPES = [
  'none',
  'raw',
  'graphql',
  'multipart',
  'urlencoded',
  'binary',
] as const;
export type BodyType = (typeof BODY_TYPES)[number];

/**
 * Request body.
 *
 * File, image, video, PDF and ZIP uploads are not separate types: a single file
 * is `binary` and a file alongside fields is `multipart`. What kind of media it
 * is, is the file's MIME type, not a schema variant.
 */
export type RequestBody =
  | { type: 'none' }
  | { type: 'raw'; language: RawLanguage; content: string }
  | { type: 'graphql'; query: string; variables: string; operationName: string | null }
  | { type: 'multipart'; entries: FormDataEntry[] }
  | { type: 'urlencoded'; entries: KeyValueEntry[] }
  | { type: 'binary'; fileId: string | null; fileName: string | null; contentType: string | null };

export const AUTH_TYPES = [
  'inherit',
  'none',
  'basic',
  'bearer',
  'apiKey',
  'digest',
  'jwt',
  'oauth2',
  'awsSignature',
  'customHeader',
  'customQuery',
] as const;
export type AuthType = (typeof AUTH_TYPES)[number];

/** Where a credential is attached to the outgoing request. */
export type AuthTarget = 'header' | 'query';

export const DIGEST_ALGORITHMS = ['MD5', 'MD5-sess', 'SHA-256', 'SHA-256-sess'] as const;
export type DigestAlgorithm = (typeof DIGEST_ALGORITHMS)[number];

export const JWT_ALGORITHMS = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'PS256',
] as const;
export type JwtAlgorithm = (typeof JWT_ALGORITHMS)[number];

export const OAUTH2_GRANT_TYPES = [
  'authorization_code',
  'authorization_code_pkce',
  'client_credentials',
  'password',
  'implicit',
  'device_code',
  'refresh_token',
] as const;
export type OAuth2GrantType = (typeof OAUTH2_GRANT_TYPES)[number];

export interface OAuth2Config {
  grantType: OAuth2GrantType;
  authUrl: string;
  accessTokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  state: string;
  audience: string;
  resource: string;
  /** Resource-owner password grant only. */
  username: string;
  password: string;
  /** Whether client credentials go in the body or an Authorization header. */
  clientAuthentication: 'body' | 'basic';
  /** Tokens obtained by the flow. Held as variables so they can be secrets. */
  accessToken: string;
  refreshToken: string;
  /** Epoch milliseconds; `null` when the token has no stated expiry. */
  expiresAt: number | null;
  addTo: AuthTarget;
  headerPrefix: string;
}

/**
 * Auth configuration.
 *
 * `inherit` is the default for a request: it takes whatever its folder or
 * collection defines, which is what makes a 200-request collection changeable
 * from one place.
 */
export type AuthConfig =
  | { type: 'inherit' }
  | { type: 'none' }
  | { type: 'basic'; username: string; password: string }
  | { type: 'bearer'; token: string; prefix: string }
  | { type: 'apiKey'; key: string; value: string; addTo: AuthTarget }
  | {
      type: 'digest';
      username: string;
      password: string;
      realm: string;
      algorithm: DigestAlgorithm;
      qop: string;
      opaque: string;
    }
  | {
      type: 'jwt';
      algorithm: JwtAlgorithm;
      secret: string;
      secretBase64Encoded: boolean;
      payload: string;
      headerPrefix: string;
      addTo: AuthTarget;
      paramName: string;
    }
  | { type: 'oauth2'; config: OAuth2Config }
  | {
      type: 'awsSignature';
      accessKeyId: string;
      secretAccessKey: string;
      sessionToken: string;
      region: string;
      service: string;
    }
  | { type: 'customHeader'; name: string; value: string }
  | { type: 'customQuery'; name: string; value: string };

/** Retry policy. Retries are opt-in: a non-idempotent POST must not repeat. */
export interface RetryPolicy {
  /** Extra attempts after the first. `0` disables retrying. */
  attempts: number;
  backoffMs: number;
  /** Response statuses that trigger a retry, e.g. `[429, 502, 503]`. */
  retryOnStatus: number[];
  retryOnNetworkError: boolean;
}

/** Per-request transport settings, overriding the workspace defaults. */
export interface RequestSettings {
  timeoutMs: number;
  followRedirects: boolean;
  maxRedirects: number;
  /**
   * TLS certificate verification. Off is a legitimate developer need (self
   * signed certs on a staging box) and a real risk, so it is per request,
   * explicit, and surfaced on the response.
   */
  verifyTls: boolean;
  /** Percent-encode the URL before sending. Off preserves hand-written escapes. */
  encodeUrl: boolean;
  sendCookies: boolean;
  storeCookies: boolean;
  /** Ask for and transparently decode gzip / brotli / deflate. */
  decompress: boolean;
  retry: RetryPolicy;
}

/** Sandboxed user scripts. Sources are stored; execution is a later phase. */
export interface RequestScripts {
  preRequest: string;
  test: string;
}

/** Everything needed to build and send one request, before variable resolution. */
export interface RequestDefinition {
  protocol: Protocol;
  method: HttpMethod;
  /**
   * Full URL, templates included, e.g. `{{base_url}}/users/:id?page=1`. The
   * query string and {@link RequestDefinition.params} are two views of the same
   * data and are merged on edit, so neither can silently drift.
   */
  url: string;
  params: KeyValueEntry[];
  /** `:id` style placeholders parsed out of the path. */
  pathVariables: KeyValueEntry[];
  headers: KeyValueEntry[];
  body: RequestBody;
  auth: AuthConfig;
  scripts: RequestScripts;
  settings: RequestSettings;
  /** Request-scope variables: the most specific layer of the stack. */
  variables: ApiVariable[];
  description: string;
  tags: string[];
}
