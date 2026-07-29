import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import {
  appUrl,
  configuredProviders,
  getProviderConfig,
  buildAuthorizationUrl,
  isOAuthProvider,
  redirectUri,
} from './config';

/**
 * OAuth request construction.
 *
 * Worth testing because none of it can be checked by clicking: a wrong
 * `redirect_uri` is rejected by the provider with a message that names no
 * field, a missing scope surfaces as an empty profile three calls later, and
 * both look identical to "the credentials are wrong". The values are also the
 * ones that must match a provider console character for character.
 */

const ENV_KEYS = [
  'APP_URL',
  'NEXT_PUBLIC_APP_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'MICROSOFT_CLIENT_ID',
  'MICROSOFT_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
] as const;

const original = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const [key, value] of original) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function setCredentials(prefix: 'GOOGLE' | 'MICROSOFT' | 'GITHUB') {
  process.env[`${prefix}_CLIENT_ID`] = `${prefix.toLowerCase()}-id`;
  process.env[`${prefix}_CLIENT_SECRET`] = `${prefix.toLowerCase()}-secret`;
}

function clearCredentials() {
  for (const prefix of ['GOOGLE', 'MICROSOFT', 'GITHUB']) {
    delete process.env[`${prefix}_CLIENT_ID`];
    delete process.env[`${prefix}_CLIENT_SECRET`];
  }
}

describe('isOAuthProvider', () => {
  it('accepts only the three supported providers', () => {
    assert.equal(isOAuthProvider('google'), true);
    assert.equal(isOAuthProvider('microsoft'), true);
    assert.equal(isOAuthProvider('github'), true);
  });

  it('rejects anything else, including near misses', () => {
    // The start route takes this straight off the URL, so it is the only thing
    // standing between a path segment and a provider lookup.
    assert.equal(isOAuthProvider('facebook'), false);
    assert.equal(isOAuthProvider('Google'), false);
    assert.equal(isOAuthProvider(''), false);
    assert.equal(isOAuthProvider('../google'), false);
  });
});

describe('getProviderConfig', () => {
  it('is null until BOTH credentials are set', () => {
    clearCredentials();
    assert.equal(getProviderConfig('google'), null);

    process.env.GOOGLE_CLIENT_ID = 'only-the-id';
    // A half-configured provider must not be offered: the button would work
    // right up to the token exchange and then fail with the user's consent
    // already granted.
    assert.equal(getProviderConfig('google'), null);
  });

  it('carries the provider endpoints once configured', () => {
    clearCredentials();
    setCredentials('GITHUB');
    const config = getProviderConfig('github');

    assert.equal(config?.clientId, 'github-id');
    assert.equal(config?.clientSecret, 'github-secret');
    // GitHub is the only provider whose emails are a second call.
    assert.equal(config?.emailsUrl, 'https://api.github.com/user/emails');
    assert.ok(config?.scope.includes('user:email'));
  });
});

describe('configuredProviders', () => {
  it('lists only the configured ones, in display order', () => {
    clearCredentials();
    assert.deepEqual(configuredProviders(), []);

    setCredentials('GITHUB');
    setCredentials('GOOGLE');
    // Order follows OAUTH_PROVIDERS, not the order they were configured, so the
    // buttons do not reshuffle between deployments.
    assert.deepEqual(configuredProviders(), ['google', 'github']);
  });
});

describe('redirectUri', () => {
  it('points at this app, not the API', () => {
    process.env.APP_URL = 'https://app.example.com';
    assert.equal(
      redirectUri('google'),
      'https://app.example.com/api/auth/oauth/google/callback',
    );
  });

  it('strips a trailing slash so the URI never doubles up', () => {
    // A registered URI must match character for character, and
    // `https://x.com//api/...` does not match `https://x.com/api/...`.
    process.env.APP_URL = 'https://app.example.com/';
    assert.equal(appUrl(), 'https://app.example.com');
    assert.equal(
      redirectUri('microsoft'),
      'https://app.example.com/api/auth/oauth/microsoft/callback',
    );
  });

  it('falls back to the public app URL, then to localhost', () => {
    delete process.env.APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = 'https://public.example.com';
    assert.equal(appUrl(), 'https://public.example.com');

    delete process.env.NEXT_PUBLIC_APP_URL;
    assert.equal(appUrl(), 'http://localhost:3000');
  });
});

describe('buildAuthorizationUrl', () => {
  const urlFor = (provider: 'google' | 'microsoft' | 'github') => {
    clearCredentials();
    setCredentials(provider.toUpperCase() as 'GOOGLE' | 'MICROSOFT' | 'GITHUB');
    process.env.APP_URL = 'https://app.example.com';
    const config = getProviderConfig(provider);
    assert.ok(config, 'config should be present');
    return buildAuthorizationUrl(config, 'nonce-123');
  };

  const paramsFor = (provider: 'google' | 'microsoft' | 'github') =>
    new URL(urlFor(provider)).searchParams;

  it('sends the parameters every provider requires', () => {
    const params = paramsFor('google');
    assert.equal(params.get('client_id'), 'google-id');
    assert.equal(
      params.get('redirect_uri'),
      'https://app.example.com/api/auth/oauth/google/callback',
    );
    assert.equal(params.get('response_type'), 'code');
    assert.equal(params.get('state'), 'nonce-123');
    assert.ok(params.get('scope')?.includes('email'));
  });

  it('never leaks the client secret into the browser-visible URL', () => {
    // This URL is a top-level navigation the user can read. The secret belongs
    // only in the server-to-server token exchange.
    assert.ok(!urlFor('google').includes('google-secret'));
  });

  it('asks Google for a refresh token and an account chooser', () => {
    const params = paramsFor('google');
    assert.equal(params.get('access_type'), 'offline');
    // Without this Google silently reuses the last account, which makes
    // switching accounts look broken.
    assert.equal(params.get('prompt'), 'select_account');
  });

  it('pins Microsoft to query response mode', () => {
    const params = paramsFor('microsoft');
    assert.equal(params.get('response_mode'), 'query');
  });

  it('sends GitHub neither of the other providers extras', () => {
    const params = paramsFor('github');
    assert.equal(params.get('access_type'), null);
    assert.equal(params.get('response_mode'), null);
  });
});
