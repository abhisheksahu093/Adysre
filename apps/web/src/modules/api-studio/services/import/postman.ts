/**
 * ADYSRE API Studio - importing a Postman collection (v2.0 and v2.1).
 *
 * The single most valuable import, because it is what people already have. The
 * two schema versions differ in small ways (v2.1 splits `auth` differently and
 * prefers an object `url`), so both are handled by reading what is present
 * rather than by branching on the version string, which collections in the wild
 * are not reliable about.
 *
 * Pure: it returns a tree of nodes and the environments it found, and never
 * touches a store or the network. Anything it cannot represent is reported as a
 * warning rather than dropped in silence - an import that quietly loses a
 * pre-request script is worse than one that says it did.
 */

import type {
  ApiVariable,
  AuthConfig,
  KeyValueEntry,
  RequestBody,
  RequestDefinition,
} from '../../types';
import { HTTP_METHODS } from '../../types';
import { EMPTY_REQUEST } from '../../constants/defaults';
import { createEntry } from '../../utils/entries';
import { createId } from '../../utils/ids';
import { paramsFromUrl, pathVariablesFromUrl } from '../../utils/url';

/** A node in the imported tree, before it is given database identity. */
export interface ImportedNode {
  id: string;
  parentId: string | null;
  kind: 'folder' | 'request';
  name: string;
  description: string;
  request?: RequestDefinition;
  auth?: AuthConfig;
  variables?: ApiVariable[];
}

export interface ImportedCollection {
  name: string;
  description: string;
  auth: AuthConfig;
  variables: ApiVariable[];
  nodes: ImportedNode[];
}

export type PostmanImport =
  | { ok: true; collection: ImportedCollection; warnings: string[] }
  | { ok: false; reason: string };

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export function importPostman(source: string): PostmanImport {
  let document: unknown;
  try {
    document = JSON.parse(source);
  } catch {
    return { ok: false, reason: 'That file is not valid JSON.' };
  }

  if (!isObject(document)) return { ok: false, reason: 'That file is not a Postman collection.' };

  const info = isObject(document.info) ? document.info : null;
  if (!info || !Array.isArray(document.item)) {
    return { ok: false, reason: 'That file is not a Postman collection.' };
  }

  const warnings: string[] = [];
  const nodes: ImportedNode[] = [];

  walk(asArray(document.item), null, nodes, warnings);

  return {
    ok: true,
    warnings,
    collection: {
      name: asString(info.name, 'Imported collection'),
      description: readDescription(info.description),
      auth: readAuth(document.auth, warnings),
      variables: readVariables(document.variable),
      nodes,
    },
  };
}

/** Postman nests folders as items that themselves have an `item` array. */
function walk(items: unknown[], parentId: string | null, out: ImportedNode[], warnings: string[]): void {
  for (const entry of items) {
    if (!isObject(entry)) continue;
    const name = asString(entry.name, 'Untitled');

    if (Array.isArray(entry.item)) {
      const id = createId();
      out.push({
        id,
        parentId,
        kind: 'folder',
        name,
        description: readDescription(entry.description),
        auth: readAuth(entry.auth, warnings),
        variables: readVariables(entry.variable),
      });
      walk(entry.item, id, out, warnings);
      continue;
    }

    if (!isObject(entry.request)) {
      warnings.push(`Skipped "${name}": it is neither a folder nor a request.`);
      continue;
    }

    noteScripts(entry, name, warnings);

    out.push({
      id: createId(),
      parentId,
      kind: 'request',
      name,
      description: readDescription(entry.request.description),
      request: readRequest(entry.request, name, warnings),
    });
  }
}

/**
 * Postman scripts are written against its own sandbox API. Most `pm.*` code
 * runs here unchanged, but saying so is the caller's job; what this does is
 * make sure a collection that HAS scripts does not import silently as if it
 * did not.
 */
function noteScripts(entry: Json, name: string, warnings: string[]): void {
  const events = asArray(entry.event);
  for (const event of events) {
    if (!isObject(event)) continue;
    const listen = asString(event.listen);
    if (listen === 'test' || listen === 'prerequest') {
      warnings.push(`"${name}" has a ${listen} script; check it against the sandbox API.`);
    }
  }
}

function readDescription(value: unknown): string {
  if (typeof value === 'string') return value;
  if (isObject(value)) return asString(value.content);
  return '';
}

function readVariables(value: unknown): ApiVariable[] {
  return asArray(value)
    .filter(isObject)
    .map((variable) => ({
      id: createId(),
      key: asString(variable.key),
      value: asString(variable.value),
      initialValue: asString(variable.value),
      // Postman marks secrets with `type: "secret"`; anything else is plain.
      secret: asString(variable.type) === 'secret',
      enabled: variable.disabled !== true,
      description: readDescription(variable.description),
    }))
    .filter((variable) => variable.key !== '');
}

function readEntries(value: unknown): KeyValueEntry[] {
  return asArray(value)
    .filter(isObject)
    .map((entry) =>
      createEntry({
        key: asString(entry.key),
        value: asString(entry.value),
        enabled: entry.disabled !== true,
        description: readDescription(entry.description),
      }),
    );
}

/** v2.1 stores auth as `{ type, <type>: [{key, value}] }`. */
function readAuth(value: unknown, warnings: string[]): AuthConfig {
  if (!isObject(value)) return { type: 'inherit' };
  const type = asString(value.type);

  const fields = new Map<string, string>();
  for (const entry of asArray(value[type])) {
    if (isObject(entry)) fields.set(asString(entry.key), asString(entry.value));
  }
  const field = (key: string, fallback = ''): string => fields.get(key) ?? fallback;

  switch (type) {
    case 'noauth':
      return { type: 'none' };
    case 'basic':
      return { type: 'basic', username: field('username'), password: field('password') };
    case 'bearer':
      return { type: 'bearer', token: field('token'), prefix: 'Bearer' };
    case 'apikey':
      return {
        type: 'apiKey',
        key: field('key'),
        value: field('value'),
        addTo: field('in') === 'query' ? 'query' : 'header',
      };
    case 'digest':
      return {
        type: 'digest',
        username: field('username'),
        password: field('password'),
        realm: field('realm'),
        algorithm: field('algorithm', 'MD5') === 'SHA-256' ? 'SHA-256' : 'MD5',
        qop: field('qop', 'auth'),
        opaque: field('opaque'),
      };
    case 'awsv4':
      return {
        type: 'awsSignature',
        accessKeyId: field('accessKey'),
        secretAccessKey: field('secretKey'),
        sessionToken: field('sessionToken'),
        region: field('region', 'us-east-1'),
        service: field('service'),
      };
    case '':
      return { type: 'inherit' };
    default:
      // Named, not dropped: an import that quietly turned OAuth into "no auth"
      // would produce requests that fail for a reason nobody can see.
      warnings.push(`\`${type}\` auth was imported as "no auth"; set it up again.`);
      return { type: 'none' };
  }
}

/** The url is a string in v2.0 and usually an object in v2.1. */
function readUrl(value: unknown): string {
  if (typeof value === 'string') return value;
  if (!isObject(value)) return '';
  if (typeof value.raw === 'string') return value.raw;

  const protocol = asString(value.protocol, 'https');
  const host = Array.isArray(value.host) ? value.host.join('.') : asString(value.host);
  const path = Array.isArray(value.path) ? value.path.join('/') : asString(value.path);
  const port = asString(value.port);

  const query = asArray(value.query)
    .filter(isObject)
    .filter((entry) => entry.disabled !== true)
    .map((entry) => `${asString(entry.key)}=${asString(entry.value)}`)
    .join('&');

  const base = `${protocol}://${host}${port ? `:${port}` : ''}${path ? `/${path}` : ''}`;
  return query ? `${base}?${query}` : base;
}

function readBody(value: unknown, warnings: string[], name: string): RequestBody {
  if (!isObject(value)) return { type: 'none' };
  const mode = asString(value.mode);

  switch (mode) {
    case 'raw': {
      const options = isObject(value.options) && isObject(value.options.raw) ? value.options.raw : {};
      const language = asString(options.language, 'text');
      return {
        type: 'raw',
        language:
          language === 'json' || language === 'xml' || language === 'html' || language === 'javascript'
            ? language
            : 'text',
        content: asString(value.raw),
      };
    }

    case 'urlencoded':
      return { type: 'urlencoded', entries: readEntries(value.urlencoded) };

    case 'formdata':
      return {
        type: 'multipart',
        entries: asArray(value.formdata)
          .filter(isObject)
          .map((entry) => {
            const key = asString(entry.key);
            if (asString(entry.type) === 'file') {
              warnings.push(`"${name}" attaches a file to ${key}; upload it again here.`);
              return {
                id: createId(),
                key,
                enabled: entry.disabled !== true,
                description: '',
                contentType: null,
                kind: 'file' as const,
                fileIds: [],
              };
            }
            return {
              id: createId(),
              key,
              enabled: entry.disabled !== true,
              description: '',
              contentType: asString(entry.contentType) || null,
              kind: 'text' as const,
              value: asString(entry.value),
            };
          }),
      };

    case 'graphql':
      return {
        type: 'graphql',
        query: isObject(value.graphql) ? asString(value.graphql.query) : '',
        variables: isObject(value.graphql) ? asString(value.graphql.variables) : '',
        operationName: null,
      };

    case 'file':
      warnings.push(`"${name}" sends a file body; attach it again here.`);
      return { type: 'binary', fileId: null, fileName: null, contentType: null };

    default:
      return { type: 'none' };
  }
}

function readRequest(value: Json, name: string, warnings: string[]): RequestDefinition {
  const url = readUrl(value.url);
  const method = asString(value.method, 'GET').toUpperCase();

  if (!(HTTP_METHODS as readonly string[]).includes(method)) {
    warnings.push(`"${name}" uses ${method}, which is not an HTTP method; imported as GET.`);
  }

  return {
    ...structuredClone(EMPTY_REQUEST),
    method: ((HTTP_METHODS as readonly string[]).includes(method)
      ? method
      : 'GET') as RequestDefinition['method'],
    url,
    headers: readEntries(value.header),
    params: paramsFromUrl(url, []),
    pathVariables: pathVariablesFromUrl(url, []),
    body: readBody(value.body, warnings, name),
    auth: readAuth(value.auth, warnings),
    description: readDescription(value.description),
  };
}
