import assert from 'node:assert/strict';
import { createHmac, generateKeyPairSync } from 'node:crypto';
import { describe, it } from 'node:test';

import type { WireHeader } from '@/modules/api-studio/types';
import { signRequest } from './aws-sigv4';
import { buildAuthorization, parseChallenge } from './digest';
import { JwtSigningError, signJwt } from './jwt';
import { canFetchToken, fetchToken, type OAuth2Config } from './oauth2';

/**
 * Auth strategy tests.
 *
 * Each of these produces a credential that a server either accepts or refuses
 * with a bare 401 or 403, so "it looked right" is worth nothing: the digest and
 * SigV4 cases are checked against values computed independently from the specs'
 * own worked examples, and the JWT case is verified by recomputing the
 * signature rather than by eyeballing the string.
 */

describe('digest', () => {
  it('parses a challenge, quoted commas included', () => {
    const challenge = parseChallenge(
      'Digest realm="test, realm", qop="auth,auth-int", nonce="abc123", opaque="xyz", algorithm=MD5, stale=TRUE',
    );

    assert.ok(challenge);
    assert.equal(challenge.realm, 'test, realm');
    assert.equal(challenge.nonce, 'abc123');
    assert.equal(challenge.qop, 'auth');
    assert.equal(challenge.opaque, 'xyz');
    assert.equal(challenge.stale, true);
  });

  it('refuses a challenge that is not Digest', () => {
    assert.equal(parseChallenge('Basic realm="test"'), null);
    assert.equal(parseChallenge('Digest realm="no nonce"'), null);
  });

  it('computes the RFC 7616 worked example', () => {
    // RFC 7616 section 3.9.1: Circle Of Life, MD5.
    const header = buildAuthorization({
      challenge: {
        realm: 'http-auth@example.org',
        nonce: '7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v',
        qop: 'auth',
        opaque: 'FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS',
        algorithm: 'MD5',
        stale: false,
      },
      credentials: { username: 'Mufasa', password: 'Circle of Life' },
      method: 'GET',
      uri: '/dir/index.html',
      cnonce: 'f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ',
      nonceCount: 1,
    });

    assert.match(header, /^Digest /);
    assert.ok(header.includes('response="8ca523f5e9506fed4657c9700eebdbec"'), header);
    assert.ok(header.includes('qop=auth'));
    assert.ok(header.includes('nc=00000001'));
  });

  it('escapes a quote in a username instead of breaking the header', () => {
    const header = buildAuthorization({
      challenge: { realm: 'r', nonce: 'n', qop: '', opaque: '', algorithm: 'MD5', stale: false },
      credentials: { username: 'a"b', password: 'p' },
      method: 'GET',
      uri: '/',
    });
    assert.ok(header.includes('username="a\\"b"'));
  });

  it('answers without qop when the server offers none', () => {
    const header = buildAuthorization({
      challenge: { realm: 'r', nonce: 'n', qop: '', opaque: '', algorithm: 'MD5', stale: false },
      credentials: { username: 'u', password: 'p' },
      method: 'GET',
      uri: '/x',
    });
    assert.ok(!header.includes('qop='));
    assert.ok(!header.includes('nc='));
  });
});

describe('jwt', () => {
  it('signs HS256 with a signature that verifies independently', () => {
    const token = signJwt({
      algorithm: 'HS256',
      secret: 'shhh',
      secretBase64Encoded: false,
      payload: '{"sub":"ada"}',
      now: 1_700_000_000_000,
    });

    const [header, body, signature] = token.split('.');
    assert.ok(header && body && signature);

    const expected = createHmac('sha256', 'shhh')
      .update(`${header}.${body}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    assert.equal(signature, expected);

    const claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      sub: string;
      iat: number;
    };
    assert.equal(claims.sub, 'ada');
    assert.equal(claims.iat, 1_700_000_000);
  });

  it('keeps an iat the user set rather than overwriting it', () => {
    const token = signJwt({
      algorithm: 'HS256',
      secret: 's',
      secretBase64Encoded: false,
      payload: '{"iat":1}',
    });
    const claims = JSON.parse(Buffer.from(token.split('.')[1]!, 'base64url').toString('utf8')) as {
      iat: number;
    };
    assert.equal(claims.iat, 1);
  });

  it('signs RS256 with a real key pair', () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2_048 });
    const token = signJwt({
      algorithm: 'RS256',
      secret: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
      secretBase64Encoded: false,
      payload: '{"sub":"ada"}',
    });
    assert.equal(token.split('.').length, 3);
  });

  it('names the problem instead of leaking OpenSSL', () => {
    assert.throws(
      () => signJwt({ algorithm: 'HS256', secret: 's', secretBase64Encoded: false, payload: 'not json' }),
      JwtSigningError,
    );
    assert.throws(
      () => signJwt({ algorithm: 'RS256', secret: 'not a pem', secretBase64Encoded: false, payload: '{}' }),
      /PEM private key/,
    );
  });
});

describe('aws signature v4', () => {
  /** The `GET vanilla` case from the AWS SigV4 test suite. */
  it('matches the published test vector', () => {
    const headers = signRequest({
      credentials: {
        accessKeyId: 'AKIDEXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
        sessionToken: '',
        region: 'us-east-1',
        service: 'service',
      },
      method: 'GET',
      url: new URL('https://example.amazonaws.com/'),
      headers: [],
      body: null,
      now: new Date('2015-08-30T12:36:00Z'),
    });

    const authorization = headers.find((header) => header.name === 'Authorization')?.value ?? '';
    assert.ok(
      authorization.startsWith(
        'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request',
      ),
      authorization,
    );
    assert.ok(authorization.includes('SignedHeaders=host;x-amz-content-sha256;x-amz-date'));
    assert.match(authorization, /Signature=[0-9a-f]{64}$/);
  });

  it('signs the headers the caller set, and the query, deterministically', () => {
    const base = {
      credentials: {
        accessKeyId: 'AKIDEXAMPLE',
        secretAccessKey: 'secret',
        sessionToken: '',
        region: 'eu-west-1',
        service: 's3',
      },
      method: 'PUT',
      url: new URL('https://bucket.s3.amazonaws.com/key?b=2&a=1'),
      body: Buffer.from('payload'),
      now: new Date('2026-07-26T09:00:00Z'),
    };

    const first = signRequest({ ...base, headers: [{ name: 'X-Custom', value: 'v' }] });
    const second = signRequest({ ...base, headers: [{ name: 'X-Custom', value: 'v' }] });
    assert.deepEqual(first, second);

    const withoutCustom = signRequest({ ...base, headers: [] as WireHeader[] });
    assert.notEqual(
      first.find((h) => h.name === 'Authorization')?.value,
      withoutCustom.find((h) => h.name === 'Authorization')?.value,
    );
    assert.ok(first.find((h) => h.name === 'Authorization')?.value.includes('x-custom'));
  });

  it('adds the session token header only for temporary credentials', () => {
    const temporary = signRequest({
      credentials: {
        accessKeyId: 'A',
        secretAccessKey: 's',
        sessionToken: 'token',
        region: 'us-east-1',
        service: 'sts',
      },
      method: 'GET',
      url: new URL('https://sts.amazonaws.com/'),
      headers: [],
      body: null,
      now: new Date('2026-07-26T09:00:00Z'),
    });
    assert.ok(temporary.some((header) => header.name === 'X-Amz-Security-Token'));
  });
});

describe('oauth 2', () => {
  const config: OAuth2Config = {
    type: 'oauth2',
    grantType: 'client_credentials',
    accessTokenUrl: 'https://auth.example.com/token',
    clientId: 'id',
    clientSecret: 'secret',
    scope: 'read',
    audience: '',
    username: '',
    password: '',
    refreshToken: '',
    accessToken: '',
    clientAuthentication: 'body',
    addTo: 'header',
    headerPrefix: '',
  };

  const settings = {
    timeoutMs: 5_000,
    followRedirects: true,
    maxRedirects: 5,
    verifyTls: true,
    decompress: true,
    sendCookies: false,
    storeCookies: false,
    maxResponseBytes: 10_000,
  };

  it('refuses a grant that needs a browser', () => {
    assert.equal(canFetchToken({ ...config, grantType: 'authorization_code' }), false);
    assert.equal(canFetchToken(config), true);
    // An access token already in hand needs no grant at all.
    assert.equal(canFetchToken({ ...config, grantType: 'authorization_code', accessToken: 't' }), true);
  });

  it('posts a form to the token endpoint and reads the token back', async () => {
    // Typed up front: TypeScript narrows a `let` assigned only inside a
    // callback to `never` at the assertions below.
    const sent: { url: string; body: string; headers: string[] } = {
      url: '',
      body: '',
      headers: [],
    };

    const result = await fetchToken(
      config,
      async (request) => {
        sent.url = request.url;
        sent.body = request.body.encoding === 'text' ? request.body.content : '';
        sent.headers = request.headers.map((header) => header.name);
        return {
          id: request.id,
          ok: true,
          response: {
            status: 200,
            statusText: 'OK',
            httpVersion: 'HTTP/1.1',
            headers: [],
            cookies: [],
            bodyEncoding: 'utf8',
            body: JSON.stringify({ access_token: 'tok', token_type: 'Bearer' }),
            truncated: false,
            size: { headers: 0, body: 0, total: 0 },
            requestSize: { headers: 0, body: 0, total: 0 },
            timings: { dns: null, tcp: null, tls: null, firstByte: null, download: null, total: 1 },
            redirects: [],
            insecure: false,
          },
        };
      },
      { workspaceId: '018f0000-0000-7000-8000-000000000001', settings },
    );

    assert.equal(result.ok, true);
    assert.equal(result.ok && result.accessToken, 'tok');
    assert.equal(sent.url, 'https://auth.example.com/token');
    assert.ok(sent.body.includes('grant_type=client_credentials'));
    assert.ok(sent.body.includes('client_secret=secret'));
  });

  it('sends the client secret in a header when asked, and never in the body', async () => {
    let body = '';
    let authorization = '';

    await fetchToken(
      { ...config, clientAuthentication: 'basic' },
      async (request) => {
        body = request.body.encoding === 'text' ? request.body.content : '';
        authorization = request.headers.find((h) => h.name === 'Authorization')?.value ?? '';
        return { id: request.id, ok: false, error: { code: 'network', message: 'stop', cause: null } };
      },
      { workspaceId: '018f0000-0000-7000-8000-000000000001', settings },
    );

    assert.ok(!body.includes('client_secret'));
    assert.equal(authorization, `Basic ${Buffer.from('id:secret').toString('base64')}`);
  });

  it('never follows a redirect from the token endpoint', async () => {
    let followed = true;
    await fetchToken(
      config,
      async (request) => {
        followed = request.settings.followRedirects;
        return { id: request.id, ok: false, error: { code: 'network', message: 'stop', cause: null } };
      },
      { workspaceId: '018f0000-0000-7000-8000-000000000001', settings },
    );
    assert.equal(followed, false, 'a redirect would hand the client secret to another host');
  });

  it('reports a token endpoint that answers badly', async () => {
    const result = await fetchToken(
      config,
      async (request) => ({
        id: request.id,
        ok: true,
        response: {
          status: 401,
          statusText: 'Unauthorized',
          httpVersion: 'HTTP/1.1',
          headers: [],
          cookies: [],
          bodyEncoding: 'utf8',
          body: '{}',
          truncated: false,
          size: { headers: 0, body: 0, total: 0 },
          requestSize: { headers: 0, body: 0, total: 0 },
          timings: { dns: null, tcp: null, tls: null, firstByte: null, download: null, total: 1 },
          redirects: [],
          insecure: false,
        },
      }),
      { workspaceId: '018f0000-0000-7000-8000-000000000001', settings },
    );

    assert.equal(result.ok, false);
    assert.ok(result.ok === false && result.reason.includes('401'));
  });
});
