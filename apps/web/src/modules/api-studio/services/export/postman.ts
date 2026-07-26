/**
 * ADYSRE API Studio - exporting a Postman collection (v2.1).
 *
 * The counterpart to the importer, and the reason both exist: a collection that
 * can only be brought in is a lock-in, and the module's whole premise is that
 * there is none. What goes out is what came in, in the format everything else
 * reads.
 *
 * Secrets never leave. A variable marked secret is exported with an empty
 * value, and auth credentials that resolve from one are exported as the
 * template rather than the value, so a shared file carries the SHAPE of the
 * collection and none of the keys.
 */

import type {
  ApiCollection,
  ApiNode,
  ApiVariable,
  AuthConfig,
  KeyValueEntry,
  RequestDefinition,
} from '../../types';
import { buildTree } from '../../utils/tree';
import type { ApiTreeNode } from '../../types';

interface PostmanItem {
  name: string;
  description?: string;
  item?: PostmanItem[];
  request?: unknown;
  auth?: unknown;
}

function entries(list: readonly KeyValueEntry[]): unknown[] {
  return list.map((entry) => ({
    key: entry.key,
    value: entry.value,
    ...(entry.enabled ? {} : { disabled: true }),
    ...(entry.description ? { description: entry.description } : {}),
  }));
}

/** Variables, with every secret emptied. */
function variables(list: readonly ApiVariable[]): unknown[] {
  return list.map((variable) => ({
    key: variable.key,
    value: variable.secret ? '' : variable.value,
    ...(variable.secret ? { type: 'secret' } : {}),
    ...(variable.enabled ? {} : { disabled: true }),
  }));
}

function auth(config: AuthConfig): unknown {
  const pair = (key: string, value: string) => ({ key, value, type: 'string' });

  switch (config.type) {
    case 'none':
    case 'inherit':
      return { type: 'noauth' };
    case 'basic':
      return { type: 'basic', basic: [pair('username', config.username), pair('password', config.password)] };
    case 'bearer':
      return { type: 'bearer', bearer: [pair('token', config.token)] };
    case 'apiKey':
      return {
        type: 'apikey',
        apikey: [pair('key', config.key), pair('value', config.value), pair('in', config.addTo)],
      };
    case 'digest':
      return {
        type: 'digest',
        digest: [
          pair('username', config.username),
          pair('password', config.password),
          pair('algorithm', config.algorithm),
        ],
      };
    case 'awsSignature':
      return {
        type: 'awsv4',
        awsv4: [
          pair('accessKey', config.accessKeyId),
          pair('secretKey', config.secretAccessKey),
          pair('region', config.region),
          pair('service', config.service),
        ],
      };
    default:
      // JWT, OAuth 2 and the custom strategies have no faithful v2.1
      // equivalent. Exporting them as "no auth" is honest; exporting them as
      // something they are not would produce a collection that fails elsewhere.
      return { type: 'noauth' };
  }
}

function body(request: RequestDefinition): unknown {
  switch (request.body.type) {
    case 'none':
      return undefined;
    case 'raw':
      return {
        mode: 'raw',
        raw: request.body.content,
        options: { raw: { language: request.body.language } },
      };
    case 'urlencoded':
      return { mode: 'urlencoded', urlencoded: entries(request.body.entries) };
    case 'graphql':
      return {
        mode: 'graphql',
        graphql: { query: request.body.query, variables: request.body.variables },
      };
    case 'multipart':
      return {
        mode: 'formdata',
        formdata: request.body.entries.map((entry) =>
          entry.kind === 'text'
            ? { key: entry.key, value: entry.value, type: 'text', ...(entry.enabled ? {} : { disabled: true }) }
            : { key: entry.key, type: 'file', src: [] },
        ),
      };
    case 'binary':
      return { mode: 'file', file: {} };
    default:
      return undefined;
  }
}

/** v2.1 keeps both the raw url and its parts; readers use whichever they know. */
function url(request: RequestDefinition): unknown {
  const [base, query] = request.url.split('?');
  return {
    raw: request.url,
    ...(query ? { query: entries(request.params) } : {}),
    // The parts are a convenience for readers, and a template makes them
    // meaningless, so they are only emitted for a literal URL.
    ...(base && !base.includes('{{') ? parts(base) : {}),
  };
}

function parts(base: string): Record<string, unknown> {
  try {
    const parsed = new URL(base);
    return {
      protocol: parsed.protocol.replace(':', ''),
      host: parsed.hostname.split('.'),
      ...(parsed.port ? { port: parsed.port } : {}),
      path: parsed.pathname.split('/').filter(Boolean),
    };
  } catch {
    return {};
  }
}

function item(node: ApiTreeNode): PostmanItem {
  if (node.node.kind === 'folder') {
    return {
      name: node.node.name,
      ...(node.node.description ? { description: node.node.description } : {}),
      auth: auth(node.node.auth),
      item: node.children.map(item),
    };
  }

  const request = node.node.request;
  return {
    name: node.node.name,
    request: {
      method: request.method,
      header: entries(request.headers),
      url: url(request),
      ...(body(request) ? { body: body(request) } : {}),
      auth: auth(request.auth),
      ...(request.description ? { description: request.description } : {}),
    },
  };
}

/**
 * Build a Postman v2.1 document for one collection.
 *
 * @param nodes - every node of the collection, flat. The tree is derived here.
 */
export function exportPostman(collection: ApiCollection, nodes: readonly ApiNode[]): string {
  const map = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const tree = buildTree(map, collection.id);

  return JSON.stringify(
    {
      info: {
        name: collection.name,
        description: collection.description,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        _exporter_id: 'adysre-api-studio',
      },
      auth: auth(collection.auth),
      variable: variables(collection.variables),
      item: tree.map(item),
    },
    null,
    2,
  );
}
