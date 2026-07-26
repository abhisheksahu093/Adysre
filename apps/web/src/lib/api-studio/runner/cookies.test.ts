import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CookieRecord } from '@/modules/api-studio/types';
import {
  canStore,
  cookieHeader,
  domainMatches,
  memoryJar,
  mergeCookies,
  pathMatches,
  selectCookies,
} from './cookies';

/**
 * Cookie jar tests.
 *
 * The permissive direction is the dangerous one here: every case below that
 * asserts a cookie is NOT sent or NOT stored is guarding against handing a
 * session cookie to a host that never set it.
 */

function cookie(patch: Partial<CookieRecord> = {}): CookieRecord {
  return {
    name: 'sid',
    value: 'abc',
    domain: 'example.com',
    path: '/',
    expires: null,
    secure: false,
    httpOnly: false,
    sameSite: null,
    ...patch,
  };
}

describe('domain matching', () => {
  it('matches exactly and on a dot boundary', () => {
    assert.equal(domainMatches('example.com', 'example.com'), true);
    assert.equal(domainMatches('api.example.com', 'example.com'), true);
    assert.equal(domainMatches('example.com', '.example.com'), true);
  });

  it('does not match a lookalike host', () => {
    assert.equal(domainMatches('notexample.com', 'example.com'), false);
    assert.equal(domainMatches('example.com.evil.com', 'example.com'), false);
    assert.equal(domainMatches('example.com', 'api.example.com'), false);
  });
});

describe('path matching', () => {
  it('matches a prefix only at a segment boundary', () => {
    assert.equal(pathMatches('/app', '/app'), true);
    assert.equal(pathMatches('/app/page', '/app'), true);
    assert.equal(pathMatches('/app/page', '/app/'), true);
    assert.equal(pathMatches('/application', '/app'), false);
    assert.equal(pathMatches('/', '/app'), false);
  });
});

describe('selecting cookies to send', () => {
  it('withholds a secure cookie from plain http', () => {
    const jar = [cookie({ secure: true })];
    assert.equal(selectCookies(jar, new URL('http://example.com/')).length, 0);
    assert.equal(selectCookies(jar, new URL('https://example.com/')).length, 1);
  });

  it('withholds an expired cookie', () => {
    const jar = [cookie({ expires: 1_000 })];
    assert.equal(selectCookies(jar, new URL('https://example.com/'), 2_000).length, 0);
    assert.equal(selectCookies(jar, new URL('https://example.com/'), 500).length, 1);
  });

  it('sends the most specific path first', () => {
    const jar = [cookie({ name: 'a', path: '/' }), cookie({ name: 'b', path: '/app/deep' })];
    const selected = selectCookies(jar, new URL('https://example.com/app/deep/page'));
    assert.deepEqual(selected.map((entry) => entry.name), ['b', 'a']);
    assert.equal(cookieHeader(selected), 'b=abc; a=abc');
  });

  it('sends nothing to a host that did not set them', () => {
    const jar = [cookie()];
    assert.equal(selectCookies(jar, new URL('https://other.com/')).length, 0);
    assert.equal(cookieHeader([]), null);
  });
});

describe('storing cookies', () => {
  it('refuses a cookie for an unrelated domain', () => {
    assert.equal(canStore(cookie({ domain: 'evil.com' }), new URL('https://example.com/')), false);
    assert.equal(canStore(cookie(), new URL('https://api.example.com/')), true);
  });

  it('refuses a cookie for a bare TLD', () => {
    assert.equal(canStore(cookie({ domain: 'com' }), new URL('https://example.com/')), false);
  });

  it('refuses SameSite=None without Secure, as a browser would', () => {
    assert.equal(
      canStore(cookie({ sameSite: 'none', secure: false }), new URL('https://example.com/')),
      false,
    );
    assert.equal(
      canStore(cookie({ sameSite: 'none', secure: true }), new URL('https://example.com/')),
      true,
    );
  });
});

describe('merging', () => {
  it('treats name, domain and path as the identity', () => {
    const merged = mergeCookies(
      [cookie({ name: 'sid', path: '/' })],
      [cookie({ name: 'sid', path: '/app', value: 'two' })],
    );
    assert.equal(merged.length, 2, 'the same name on another path is another cookie');

    const replaced = mergeCookies([cookie({ value: 'one' })], [cookie({ value: 'two' })]);
    assert.equal(replaced.length, 1);
    assert.equal(replaced[0]?.value, 'two');
  });

  it('deletes on an expired cookie, which is how a logout works', () => {
    const merged = mergeCookies([cookie()], [cookie({ expires: 1_000 })], 2_000);
    assert.equal(merged.length, 0);
  });
});

describe('memory jar', () => {
  it('stores what it may and returns what matches', () => {
    const jar = memoryJar();
    jar.write(new URL('https://example.com/app'), [
      cookie({ name: 'ok' }),
      cookie({ name: 'nope', domain: 'evil.com' }),
    ]);

    assert.deepEqual(jar.all().map((entry) => entry.name), ['ok']);
    assert.deepEqual(
      (jar.read(new URL('https://example.com/app')) as CookieRecord[]).map((entry) => entry.name),
      ['ok'],
    );
    assert.equal((jar.read(new URL('https://other.com/')) as CookieRecord[]).length, 0);
  });
});
