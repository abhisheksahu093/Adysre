import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { gzipSync } from 'node:zlib';
import { after, before, describe, it } from 'node:test';

import type { ExecutionRequest } from '@/modules/api-studio/types';
import { rateLimit, resetRateLimits } from '@/lib/api/rate-limit';
import { checkAddress, checkUrl, policyFromEnv, type HostPolicy } from './host-policy';
import { execute, parseSetCookies } from './execute';

/**
 * Runner tests.
 *
 * The runner is driven against a REAL http server on loopback rather than a
 * mocked socket, because the things worth testing here are the things a mock
 * would paper over: that a redirect chain is really followed and recorded, that
 * a slow server really trips the timeout, that a large body is really cut off
 * at the cap instead of being read to the end, and that cancelling really tears
 * the socket down.
 *
 * The host policy is opened to loopback for these tests. That is exactly the
 * configuration a developer's machine runs, and the policy's own tests below
 * cover what the default refuses.
 */

const OPEN: HostPolicy = { allowLoopback: true, allowPrivate: true, allowLinkLocal: false };
const CLOSED: HostPolicy = { allowLoopback: false, allowPrivate: false, allowLinkLocal: false };

let server: Server;
let origin: string;

before(async () => {
  server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');

    switch (url.pathname) {
      case '/json':
        response.writeHead(200, { 'Content-Type': 'application/json', 'X-Custom': 'yes' });
        response.end(JSON.stringify({ ok: true, method: request.method }));
        return;

      case '/echo': {
        const chunks: Buffer[] = [];
        request.on('data', (chunk: Buffer) => chunks.push(chunk));
        request.on('end', () => {
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              method: request.method,
              headers: request.headers,
              body: Buffer.concat(chunks).toString('utf8'),
            }),
          );
        });
        return;
      }

      case '/gzip': {
        const payload = gzipSync(Buffer.from(JSON.stringify({ compressed: true })));
        response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' });
        response.end(payload);
        return;
      }

      case '/binary':
        response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        response.end(Buffer.from([0xff, 0xfe, 0x00, 0x01]));
        return;

      case '/large':
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('x'.repeat(200_000));
        return;

      case '/slow':
        setTimeout(() => {
          response.writeHead(200);
          response.end('late');
        }, 3_000);
        return;

      case '/cookies':
        response.writeHead(200, {
          'Set-Cookie': ['a=1; Path=/; HttpOnly', 'b=2; Domain=example.com; Secure; SameSite=None'],
        });
        response.end('ok');
        return;

      case '/redirect':
        response.writeHead(302, { Location: '/json' });
        response.end();
        return;

      case '/redirect-post':
        response.writeHead(303, { Location: '/echo' });
        response.end();
        return;

      case '/loop':
        response.writeHead(302, { Location: '/loop' });
        response.end();
        return;

      case '/status':
        response.writeHead(Number(url.searchParams.get('code') ?? '500'));
        response.end('failed');
        return;

      default:
        response.writeHead(404);
        response.end('not found');
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  origin = typeof address === 'object' && address ? `http://127.0.0.1:${address.port}` : '';
});

after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

type RequestPatch = Partial<Omit<ExecutionRequest, 'settings'>> & {
  settings?: Partial<ExecutionRequest['settings']>;
};

function request(path: string, patch: RequestPatch = {}): ExecutionRequest {
  return {
    id: '018f3a2b-4c5d-7e8f-9a0b-1c2d3e4f5061',
    workspaceId: '018f3a2b-4c5d-7e8f-9a0b-1c2d3e4f5062',
    requestNodeId: null,
    agent: 'server',
    method: 'GET',
    url: `${origin}${path}`,
    headers: [],
    body: { encoding: 'none' },
    ...patch,
    settings: {
      timeoutMs: 2_000,
      followRedirects: true,
      maxRedirects: 5,
      verifyTls: true,
      decompress: true,
      sendCookies: true,
      storeCookies: true,
      maxResponseBytes: 100_000,
      ...patch.settings,
    },
  };
}

describe('host policy', () => {
  it('refuses loopback, private and link-local by default', () => {
    for (const address of ['127.0.0.1', '10.0.0.5', '192.168.1.9', '172.16.4.4', '169.254.1.1']) {
      assert.equal(checkAddress(address, CLOSED).allowed, false, address);
    }
    assert.equal(checkAddress('93.184.216.34', CLOSED).allowed, true);
  });

  it('refuses the cloud metadata address under every configuration', () => {
    assert.equal(checkAddress('169.254.169.254', OPEN).allowed, false);
    assert.equal(
      checkAddress('169.254.169.254', { ...OPEN, allowLinkLocal: true }).allowed,
      false,
    );
  });

  it('cannot be bypassed with an IPv4-mapped IPv6 address', () => {
    assert.equal(checkAddress('::ffff:127.0.0.1', CLOSED).allowed, false);
    assert.equal(checkAddress('::ffff:169.254.169.254', OPEN).allowed, false);
    assert.equal(checkAddress('::1', CLOSED).allowed, false);
    assert.equal(checkAddress('fd00::1', CLOSED).allowed, false);
    assert.equal(checkAddress('fe80::1', OPEN).allowed, false);
  });

  it('opens loopback and private ranges when a deployment says so', () => {
    assert.equal(checkAddress('127.0.0.1', OPEN).allowed, true);
    assert.equal(checkAddress('10.1.2.3', OPEN).allowed, true);
  });

  it('defaults closed in production and open in development', () => {
    assert.equal(policyFromEnv({ NODE_ENV: 'production' }).allowPrivate, false);
    assert.equal(policyFromEnv({ NODE_ENV: 'development' }).allowPrivate, true);
    assert.equal(
      policyFromEnv({ NODE_ENV: 'production', API_STUDIO_ALLOW_PRIVATE_HOSTS: 'true' }).allowPrivate,
      true,
    );
    assert.equal(policyFromEnv({ NODE_ENV: 'development' }).allowLinkLocal, false);
  });

  it('rejects urls that are not plain http(s) or that hide a host', () => {
    assert.equal(checkUrl('file:///etc/passwd').ok, false);
    assert.equal(checkUrl('ftp://a.com').ok, false);
    assert.equal(checkUrl('/relative').ok, false);
    assert.equal(checkUrl('https://real.com@evil.com').ok, false);
    assert.equal(checkUrl('https://a.com/x').ok, true);
  });
});

describe('runner', () => {
  it('performs a request and reports status, headers and timings', async () => {
    const result = await execute(request('/json'), { policy: OPEN });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.response.status, 200);
    assert.equal(result.response.statusText, 'OK');
    assert.equal(result.response.bodyEncoding, 'utf8');
    assert.deepEqual(JSON.parse(result.response.body), { ok: true, method: 'GET' });
    assert.equal(
      result.response.headers.find((h) => h.name.toLowerCase() === 'x-custom')?.value,
      'yes',
    );
    assert.ok(result.response.timings.total > 0);
    assert.ok(result.response.timings.firstByte !== null);
    // TLS was never negotiated on a plain http request, so it is null rather
    // than a made-up zero.
    assert.equal(result.response.timings.tls, null);
    assert.equal(result.response.size.total > 0, true);
  });

  it('sends headers and a body, and keeps a 500 as a response', async () => {
    const result = await execute(
      request('/echo', {
        method: 'POST',
        headers: [{ name: 'X-Tag', value: 'a' }, { name: 'Content-Type', value: 'application/json' }],
        body: { encoding: 'text', content: '{"hello":"world"}' },
      }),
      { policy: OPEN },
    );

    assert.equal(result.ok, true);
    if (!result.ok) return;
    const echoed = JSON.parse(result.response.body) as {
      method: string;
      headers: Record<string, string>;
      body: string;
    };
    assert.equal(echoed.method, 'POST');
    assert.equal(echoed.headers['x-tag'], 'a');
    assert.equal(echoed.body, '{"hello":"world"}');
    assert.ok(result.response.requestSize.body > 0);

    const failed = await execute(request('/status?code=500'), { policy: OPEN });
    assert.equal(failed.ok, true, 'a 500 is a response, not an error');
    assert.equal(failed.ok && failed.response.status, 500);
  });

  it('decompresses gzip and base64s a body that is not text', async () => {
    const zipped = await execute(request('/gzip'), { policy: OPEN });
    assert.equal(zipped.ok && JSON.parse(zipped.response.body).compressed, true);

    const binary = await execute(request('/binary'), { policy: OPEN });
    assert.equal(binary.ok && binary.response.bodyEncoding, 'base64');
    assert.deepEqual(
      binary.ok ? [...Buffer.from(binary.response.body, 'base64')] : [],
      [0xff, 0xfe, 0x00, 0x01],
    );
  });

  it('follows a redirect and records the hop', async () => {
    const result = await execute(request('/redirect'), { policy: OPEN });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.response.status, 200);
    assert.equal(result.response.redirects.length, 1);
    assert.equal(result.response.redirects[0]?.status, 302);
    assert.ok(result.response.redirects[0]?.to.endsWith('/json'));
  });

  it('turns a POST into a GET on a 303, dropping the body', async () => {
    const result = await execute(
      request('/redirect-post', {
        method: 'POST',
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        body: { encoding: 'text', content: '{"a":1}' },
      }),
      { policy: OPEN },
    );

    assert.equal(result.ok, true);
    if (!result.ok) return;
    const echoed = JSON.parse(result.response.body) as { method: string; body: string };
    assert.equal(echoed.method, 'GET');
    assert.equal(echoed.body, '');
  });

  it('stops after the redirect limit instead of looping', async () => {
    const result = await execute(request('/loop', { settings: { maxRedirects: 2 } }), {
      policy: OPEN,
    });
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.error.code, 'too_many_redirects');
  });

  it('returns the redirect itself when following is off', async () => {
    const result = await execute(
      request('/redirect', { settings: { followRedirects: false } }),
      { policy: OPEN },
    );
    assert.equal(result.ok && result.response.status, 302);
  });

  it('truncates a body at the cap rather than reading it all', async () => {
    const result = await execute(
      request('/large', { settings: { maxResponseBytes: 1_000 } }),
      { policy: OPEN },
    );

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.response.truncated, true);
    assert.equal(result.response.body.length, 1_000);
  });

  it('times out a slow server', async () => {
    const result = await execute(
      request('/slow', { settings: { timeoutMs: 1_000 } }),
      { policy: OPEN },
    );
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.error.code, 'timeout');
  });

  it('cancels in flight', async () => {
    const controller = new AbortController();
    const pending = execute(request('/slow'), { policy: OPEN, signal: controller.signal });
    setTimeout(() => controller.abort(), 50);

    const result = await pending;
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.error.code, 'cancelled');
  });

  it('refuses a blocked host before connecting', async () => {
    const result = await execute(request('/json'), { policy: CLOSED });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.error.code, 'blocked_host');
    assert.ok(result.error.message.includes('loopback'));
  });

  it('reports a refused connection as such', async () => {
    // Port 1 on loopback: nothing listens there.
    const result = await execute(
      { ...request('/json'), url: 'http://127.0.0.1:1/json' },
      { policy: OPEN },
    );
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.error.code, 'connection_refused');
  });

  it('refuses a url that is not http(s)', async () => {
    const result = await execute({ ...request('/json'), url: 'file:///etc/passwd' }, { policy: OPEN });
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.error.code, 'invalid_url');
  });

  it('parses set-cookie into the jar shape', async () => {
    const result = await execute(request('/cookies'), { policy: OPEN });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    const [first, second] = result.response.cookies;
    assert.equal(first?.name, 'a');
    assert.equal(first?.httpOnly, true);
    assert.equal(second?.domain, 'example.com');
    assert.equal(second?.secure, true);
    assert.equal(second?.sameSite, 'none');
  });

  it('refuses a multipart body rather than dropping the files', async () => {
    const result = await execute(
      request('/echo', {
        method: 'POST',
        body: { encoding: 'multipart', parts: [] },
      }),
      { policy: OPEN },
    );
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.error.code, 'unsupported_body');
  });
});

describe('set-cookie parsing', () => {
  it('reads attributes and defaults the domain to the host asked', () => {
    const [cookie] = parseSetCookies(['sid=abc; Max-Age=60; Path=/app'], 'api.example.com');
    assert.equal(cookie?.name, 'sid');
    assert.equal(cookie?.value, 'abc');
    assert.equal(cookie?.domain, 'api.example.com');
    assert.equal(cookie?.path, '/app');
    assert.ok((cookie?.expires ?? 0) > Date.now());
  });
});

describe('rate limit', () => {
  it('allows up to the ceiling, then refuses with a retry hint', () => {
    resetRateLimits();
    const options = { windowMs: 1_000, max: 3 };

    for (let i = 0; i < 3; i += 1) {
      assert.equal(rateLimit('tenant-a', options, 1_000).allowed, true);
    }

    const blocked = rateLimit('tenant-a', options, 1_000);
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterMs > 0);

    // Another tenant is unaffected, and the window slides.
    assert.equal(rateLimit('tenant-b', options, 1_000).allowed, true);
    assert.equal(rateLimit('tenant-a', options, 2_500).allowed, true);
  });
});
