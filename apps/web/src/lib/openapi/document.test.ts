import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import { buildOpenApiDocument } from './document';

/**
 * The API description.
 *
 * The point of generating from Zod is that the spec cannot drift from the
 * validation. These tests protect the parts that generation does NOT guarantee:
 * that every shipped endpoint is actually described, that the committed
 * `docs/openapi.json` matches what the code produces, and that the two rules
 * JSON Schema cannot express are stated in prose instead of quietly lost.
 */

const here = dirname(fileURLToPath(import.meta.url));
const committed = resolve(here, '../../../../../docs/openapi.json');

const document = buildOpenApiDocument();

/** Every auth route handler on disk, as an OpenAPI path. */
const EXPECTED_PATHS = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/me',
  '/api/auth/profile',
  '/api/auth/change-password',
  '/api/auth/csrf',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/auth/cleanup',
];

describe('openapi document', () => {
  it('is a valid 3.1 document with a title and a server', () => {
    assert.equal(document.openapi, '3.1.0');
    assert.ok(document.info.title);
    assert.ok(document.info.version);
    assert.ok((document.servers ?? []).length > 0);
  });

  it('describes every auth endpoint', () => {
    const described = Object.keys(document.paths ?? {});
    const missing = EXPECTED_PATHS.filter((path) => !described.includes(path));
    assert.deepEqual(missing, [], `undocumented endpoints: ${missing.join(', ')}`);
  });

  it('describes nothing that does not exist', () => {
    // The opposite failure, and the one that makes a spec actively misleading:
    // a path left behind after an endpoint was removed.
    const described = Object.keys(document.paths ?? {});
    const extra = described.filter((path) => !EXPECTED_PATHS.includes(path));
    assert.deepEqual(extra, [], `documented but not shipped: ${extra.join(', ')}`);
  });

  it('derives request constraints from the real schemas', () => {
    // Proves the document is generated rather than transcribed: these numbers
    // come from `passwordSchema` in @adysre/validators.
    const schema = requestSchema('/api/auth/register', 'post');
    const password = schema.properties.password as Record<string, unknown>;
    assert.equal(password.minLength, 12);
    assert.equal(password.maxLength, 128);
    assert.deepEqual(schema.required, [
      'email',
      'password',
      'name',
      'organizationName',
      'organizationSlug',
    ]);
  });

  it('states the password rules that JSON Schema cannot carry', () => {
    // A single `pattern` per field means two of the three character rules are
    // dropped. Left alone, the spec advertises `pattern: "[a-z]"` and a client
    // built from it accepts passwords this API rejects.
    const password = requestSchema('/api/auth/register', 'post').properties.password as {
      description?: string;
    };
    assert.ok(password.description, 'the password field carries no description');
    assert.match(password.description, /uppercase/i);
    assert.match(password.description, /digit/i);

    // The refined schemas cannot be extended the same way, so their endpoint
    // descriptions carry the rules instead.
    for (const [path, method] of [
      ['/api/auth/reset-password', 'post'],
      ['/api/auth/change-password', 'patch'],
    ] as const) {
      const description = operation(path, method).description ?? '';
      assert.match(description, /uppercase/i, `${path} omits the password policy`);
      assert.match(description, /not expressible in JSON Schema/i, `${path} omits the confirm rule`);
    }
  });

  it('documents cookie authentication, since there is no bearer token', () => {
    const schemes = document.components?.securitySchemes ?? {};
    assert.ok(schemes.sessionCookie, 'no session cookie scheme');

    // Endpoints that need a session must say so, or a reader concludes they are
    // public and cannot work out why they get 401.
    for (const [path, method] of [
      ['/api/auth/me', 'get'],
      ['/api/auth/profile', 'patch'],
      ['/api/auth/change-password', 'patch'],
      ['/api/auth/resend-verification', 'post'],
    ] as const) {
      assert.ok((operation(path, method).security ?? []).length > 0, `${path} declares no security`);
    }
  });

  it('documents the 401 on every authenticated endpoint', () => {
    for (const [path, method] of [
      ['/api/auth/me', 'get'],
      ['/api/auth/profile', 'patch'],
      ['/api/auth/change-password', 'patch'],
      ['/api/auth/resend-verification', 'post'],
    ] as const) {
      assert.ok(operation(path, method).responses['401'], `${path} does not document a 401`);
    }
  });

  it('matches the committed docs/openapi.json', () => {
    // A generated file that is not regenerated is worse than no file: it looks
    // authoritative while describing a previous release. Run
    // `pnpm --filter @adysre/web gen:openapi` when this fails.
    let onDisk: string;
    try {
      onDisk = readFileSync(committed, 'utf8');
    } catch {
      assert.fail(`${committed} is missing. Run: pnpm --filter @adysre/web gen:openapi`);
    }

    assert.deepEqual(
      JSON.parse(onDisk),
      JSON.parse(JSON.stringify(document)),
      'docs/openapi.json is stale. Run: pnpm --filter @adysre/web gen:openapi',
    );
  });
});

type Operation = {
  description?: string;
  security?: unknown[];
  responses: Record<string, unknown>;
  requestBody?: {
    content: Record<string, { schema: { properties: Record<string, unknown>; required?: string[] } }>;
  };
};

function operation(path: string, method: string): Operation {
  const item = (document.paths as Record<string, Record<string, Operation>>)[path];
  assert.ok(item, `no path ${path}`);
  const op = item[method];
  assert.ok(op, `no ${method} on ${path}`);
  return op;
}

function requestSchema(path: string, method: string) {
  const requestBody = operation(path, method).requestBody;
  assert.ok(requestBody, `${path} has no request body`);
  const schema = requestBody.content['application/json']?.schema;
  assert.ok(schema, `${path} has no JSON request schema`);
  return schema;
}
