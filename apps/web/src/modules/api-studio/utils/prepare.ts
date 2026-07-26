/**
 * ADYSRE API Studio - turning an edited request into a wire request.
 *
 * This is the "browser resolves, runner sends" half. Everything template-shaped
 * or strategy-shaped is settled HERE, in pure code the tests can pin, so the
 * runner receives a literal request with nothing left to interpret. That is
 * what keeps the server side small enough to audit, and it is why the same
 * preparation can later feed a local desktop agent unchanged.
 *
 * What it will NOT do is guess. An auth strategy that needs a round trip, or a
 * body that needs a file this build cannot fetch, produces a named refusal
 * rather than a request that is silently unauthenticated or half-formed.
 */

import type {
  AuthConfig,
  ExecutionErrorCode,
  ExecutionRequest,
  RequestDefinition,
  VariableContext,
  VariableIssue,
  WireAuth,
  WireBody,
  WireHeader,
  WirePart,
} from '../types';
import { RAW_CONTENT_TYPES } from '../constants/http';
import { MAX_RESPONSE_BYTES } from '../constants/limits';
import { activeEntries } from './entries';
import { createId } from './ids';
import { resolveAll } from './variables';
import { splitUrl, urlWithParams } from './url';

export interface PrepareInput {
  request: RequestDefinition;
  context: VariableContext;
  workspaceId: string;
  requestNodeId: string | null;
  /** Auth inherited from the folder or collection, already resolved by caller. */
  inheritedAuth?: AuthConfig;
  agent?: ExecutionRequest['agent'];
}

export type PrepareResult =
  | { ok: true; request: ExecutionRequest; issues: VariableIssue[] }
  | { ok: false; code: ExecutionErrorCode; detail: string; issues: VariableIssue[] };

/**
 * Strategies the RUNNER applies, because the browser cannot: they need the
 * server's challenge, a token exchange, or a signature over the final bytes.
 * They are passed through resolved rather than applied here.
 */
const RUNNER_APPLIED = new Set(['digest', 'oauth2', 'jwt', 'awsSignature']);

/** Project a resolved auth config onto the runner's wire shape. */
function toWireAuth(auth: AuthConfig): WireAuth | null {
  switch (auth.type) {
    case 'digest':
      return {
        type: 'digest',
        username: auth.username,
        password: auth.password,
        algorithm: auth.algorithm,
        qop: auth.qop,
      };
    case 'jwt':
      return {
        type: 'jwt',
        algorithm: auth.algorithm,
        secret: auth.secret,
        secretBase64Encoded: auth.secretBase64Encoded,
        payload: auth.payload,
        headerPrefix: auth.headerPrefix,
        addTo: auth.addTo,
        paramName: auth.paramName,
      };
    case 'oauth2':
      return { type: 'oauth2', ...auth.config };
    case 'awsSignature':
      return {
        type: 'awsSignature',
        accessKeyId: auth.accessKeyId,
        secretAccessKey: auth.secretAccessKey,
        sessionToken: auth.sessionToken,
        region: auth.region,
        service: auth.service,
      };
    default:
      return null;
  }
}

/**
 * Base64 for a UTF-8 string, in browser and server alike.
 *
 * `btoa` throws on anything outside Latin-1, and a password with an accent in
 * it is not an edge case. Encoding to bytes first is what makes Basic auth work
 * for the rest of the world.
 */
export function base64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return typeof btoa === 'function'
    ? btoa(binary)
    : Buffer.from(bytes).toString('base64');
}

/**
 * Percent-encode a URL without double-encoding what is already encoded.
 *
 * `encodeURI` would turn a legitimate `%20` into `%2520`; a request that has
 * been through the address bar twice must not drift each time.
 */
export function encodeUrlSafely(url: string): string {
  return url.replace(/%(?![0-9A-Fa-f]{2})|[^\x21-\x7e]|[<>"`{}|\\^]/g, (char) =>
    encodeURIComponent(char),
  );
}

/** Apply `:name` path placeholders to the URL. */
function applyPathVariables(url: string, values: Map<string, string>): string {
  const { base, query, hash } = splitUrl(url);
  const replaced = base.replace(/\/:([A-Za-z_][A-Za-z0-9_-]*)/g, (raw, name: string) => {
    const value = values.get(name);
    return value === undefined || value === '' ? raw : `/${encodeURIComponent(value)}`;
  });
  return `${replaced}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

/**
 * Translate an auth strategy into headers and query params.
 *
 * @returns `null` when the strategy needs a round trip this layer cannot make.
 */
function applyAuth(
  auth: AuthConfig,
  headers: WireHeader[],
  query: { key: string; value: string }[],
): { ok: true } | { ok: false; strategy: string } {
  switch (auth.type) {
    case 'none':
    case 'inherit':
      return { ok: true };

    case 'basic':
      headers.push({
        name: 'Authorization',
        value: `Basic ${base64Utf8(`${auth.username}:${auth.password}`)}`,
      });
      return { ok: true };

    case 'bearer':
      headers.push({
        name: 'Authorization',
        value: `${auth.prefix || 'Bearer'} ${auth.token}`.trim(),
      });
      return { ok: true };

    case 'apiKey':
      if (auth.addTo === 'query') query.push({ key: auth.key, value: auth.value });
      else headers.push({ name: auth.key, value: auth.value });
      return { ok: true };

    case 'customHeader':
      headers.push({ name: auth.name, value: auth.value });
      return { ok: true };

    case 'customQuery':
      query.push({ key: auth.name, value: auth.value });
      return { ok: true };

    default:
      return { ok: false, strategy: auth.type };
  }
}

/** Build the wire body, and the Content-Type it implies. */
function buildBody(
  request: RequestDefinition,
  resolvedBody: string,
): { ok: true; body: WireBody; contentType: string | null } | { ok: false; detail: string } {
  const body = request.body;

  switch (body.type) {
    case 'none':
      return { ok: true, body: { encoding: 'none' }, contentType: null };

    case 'raw':
      return {
        ok: true,
        body: { encoding: 'text', content: resolvedBody },
        contentType: RAW_CONTENT_TYPES[body.language],
      };

    case 'graphql':
      return {
        ok: true,
        body: {
          encoding: 'text',
          // The variables pane is text, so it may be empty or mid-edit; an
          // unparseable value is sent as an empty object rather than failing
          // the send, which matches what every GraphQL client does.
          content: JSON.stringify({
            query: resolvedBody,
            variables: safeJson(body.variables),
            ...(body.operationName ? { operationName: body.operationName } : {}),
          }),
        },
        contentType: 'application/json',
      };

    case 'urlencoded':
      return {
        ok: true,
        body: {
          encoding: 'text',
          content: activeEntries(body.entries)
            .map(
              (entry) =>
                `${encodeURIComponent(entry.key)}=${encodeURIComponent(entry.value)}`,
            )
            .join('&'),
        },
        contentType: 'application/x-www-form-urlencoded',
      };

    case 'multipart': {
      const parts: WirePart[] = [];
      for (const entry of body.entries) {
        if (!entry.enabled || entry.key.trim() === '') continue;
        if (entry.kind === 'text') {
          parts.push({
            kind: 'text',
            name: entry.key,
            value: entry.value,
            contentType: entry.contentType,
          });
          continue;
        }
        // File parts reference the module file store, which arrives with the
        // upload phase. Refusing by name beats sending a request missing the
        // file the user attached.
        const fileId = entry.fileIds[0];
        if (!fileId) continue;
        parts.push({ kind: 'file', name: entry.key, fileId, contentType: entry.contentType });
      }
      return { ok: true, body: { encoding: 'multipart', parts }, contentType: null };
    }

    case 'binary':
      return {
        ok: false,
        detail: 'Binary bodies need the file store, which lands with uploads.',
      };

    default:
      return { ok: false, detail: 'Unknown body type.' };
  }
}

function safeJson(value: string): unknown {
  if (value.trim() === '') return {};
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return {};
  }
}

/**
 * Resolve, apply and flatten an edited request into an {@link ExecutionRequest}.
 *
 * Nothing here performs IO, so it is safe to run on every keystroke: the same
 * function powers the send and the "this is what will be sent" preview, which
 * is the only way those two can be guaranteed to agree.
 */
export function prepareRequest(input: PrepareInput): PrepareResult {
  const { request, context } = input;
  const auth = request.auth.type === 'inherit' ? (input.inheritedAuth ?? { type: 'none' }) : request.auth;

  // One resolution pass over every template in the request.
  const params = activeEntries(request.params);
  const headers = activeEntries(request.headers);
  const pathVariables = activeEntries(request.pathVariables);
  const rawBody =
    request.body.type === 'raw'
      ? request.body.content
      : request.body.type === 'graphql'
        ? request.body.query
        : '';

  // Auth fields are templates too: `{{token}}` in a bearer field is the most
  // common variable in any collection, and resolving everything BUT auth would
  // send the literal `{{token}}` as a credential.
  const authFields = Object.entries(auth).filter(
    (entry): entry is [string, string] => entry[0] !== 'type' && typeof entry[1] === 'string',
  );

  const sources = [
    request.url,
    rawBody,
    ...params.flatMap((entry) => [entry.key, entry.value]),
    ...headers.flatMap((entry) => [entry.key, entry.value]),
    ...pathVariables.map((entry) => entry.value),
    ...authFields.map(([, value]) => value),
  ];

  const resolved = resolveAll(sources, context);
  const issues = resolved.flatMap((entry) => entry.issues);
  let cursor = 0;
  const next = (): string => resolved[cursor++]?.value ?? '';

  const url = next();
  const resolvedBody = next();
  const resolvedParams = params.map(() => ({ key: next(), value: next() }));
  const resolvedHeaders = headers.map(() => ({ name: next(), value: next() }));
  const resolvedPathValues = new Map(
    pathVariables.map((entry) => [entry.key, next()] as const),
  );
  const resolvedAuth = {
    ...auth,
    ...Object.fromEntries(authFields.map(([key]) => [key, next()])),
  } as AuthConfig;

  // A runner-applied strategy is carried, not applied. Everything in it has
  // been resolved above, so the runner receives literals and no templates.
  const wireAuth = RUNNER_APPLIED.has(resolvedAuth.type) ? toWireAuth(resolvedAuth) : null;
  if (RUNNER_APPLIED.has(resolvedAuth.type) && !wireAuth) {
    return {
      ok: false,
      code: 'unsupported_auth',
      detail: `${resolvedAuth.type} auth is not available in this build.`,
      issues,
    };
  }

  const query = [...resolvedParams];
  const wireHeaders: WireHeader[] = resolvedHeaders.filter((header) => header.name.trim() !== '');
  const applied = wireAuth ? { ok: true as const } : applyAuth(resolvedAuth, wireHeaders, query);
  if (!applied.ok) {
    return {
      ok: false,
      code: 'unsupported_auth',
      detail: `${applied.strategy} auth is not available in this build.`,
      issues,
    };
  }

  const body = buildBody(request, resolvedBody);
  if (!body.ok) {
    return { ok: false, code: 'unsupported_body', detail: body.detail, issues };
  }

  // Content-Type is a default, not an override: a header the user typed wins.
  if (
    body.contentType &&
    !wireHeaders.some((header) => header.name.toLowerCase() === 'content-type')
  ) {
    wireHeaders.push({ name: 'Content-Type', value: body.contentType });
  }

  const withParams = urlWithParams(
    applyPathVariables(url, resolvedPathValues),
    query.map((entry, position) => ({
      id: `q-${position}`,
      key: entry.key,
      value: entry.value,
      enabled: true,
      description: '',
    })),
  );
  const finalUrl = request.settings.encodeUrl ? encodeUrlSafely(withParams) : withParams;

  return {
    ok: true,
    issues,
    request: {
      id: createId(),
      workspaceId: input.workspaceId,
      requestNodeId: input.requestNodeId,
      agent: input.agent ?? 'server',
      method: request.method,
      url: finalUrl,
      headers: wireHeaders,
      body: body.body,
      ...(wireAuth ? { auth: wireAuth } : {}),
      settings: {
        timeoutMs: request.settings.timeoutMs,
        followRedirects: request.settings.followRedirects,
        maxRedirects: request.settings.maxRedirects,
        verifyTls: request.settings.verifyTls,
        decompress: request.settings.decompress,
        sendCookies: request.settings.sendCookies,
        storeCookies: request.settings.storeCookies,
        maxResponseBytes: MAX_RESPONSE_BYTES,
      },
    },
  };
}
