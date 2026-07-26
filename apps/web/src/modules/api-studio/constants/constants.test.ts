import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { HTTP_METHODS, RAW_LANGUAGES } from '../types/http';
import { requestDefinitionSchema } from '../schemas/request';
import {
  DEFAULT_LAYOUT,
  DEFAULT_REQUEST_SETTINGS,
  DEFAULT_SETTINGS,
  DEFAULT_WIRE_SETTINGS,
  EMPTY_REQUEST,
} from './defaults';
import {
  IDEMPOTENT_METHODS,
  METHODS_WITHOUT_BODY,
  RAW_CONTENT_TYPES,
  RUNNER_MANAGED_HEADERS,
  STATUS_TEXT,
} from './http';
import {
  DEFAULT_HISTORY_LIMIT,
  MAX_HISTORY_LIMIT,
  MAX_REDIRECTS_CEILING,
  MAX_RESPONSE_BYTES,
  MAX_TIMEOUT_MS,
  MIN_TIMEOUT_MS,
  STORAGE_KEYS,
} from './limits';
import { SHORTCUTS, SHORTCUT_ACTIONS } from './shortcuts';

/**
 * Constant invariants.
 *
 * Lookup tables rot silently: a language gets added and its content type does
 * not, a default drifts past the limit that is supposed to bound it, two
 * shortcuts end up on the same chord. Each of those is a compile-clean bug, so
 * each is asserted.
 */

describe('http tables', () => {
  it('only name real methods', () => {
    for (const method of [...METHODS_WITHOUT_BODY, ...IDEMPOTENT_METHODS]) {
      assert.ok(HTTP_METHODS.includes(method), method);
    }
  });

  it('give every raw language a content type', () => {
    for (const language of RAW_LANGUAGES) {
      assert.ok(RAW_CONTENT_TYPES[language], language);
    }
    assert.equal(Object.keys(RAW_CONTENT_TYPES).length, RAW_LANGUAGES.length);
  });

  it('keep runner-managed headers lowercase, because lookups are', () => {
    for (const header of RUNNER_MANAGED_HEADERS) {
      assert.equal(header, header.toLowerCase(), header);
    }
  });

  it('block the headers that make request smuggling possible', () => {
    for (const header of ['content-length', 'transfer-encoding', 'connection']) {
      assert.ok(RUNNER_MANAGED_HEADERS.includes(header), header);
    }
  });

  it('map only valid status codes', () => {
    for (const code of Object.keys(STATUS_TEXT).map(Number)) {
      assert.ok(code >= 100 && code <= 599, String(code));
    }
    assert.equal(STATUS_TEXT[200], 'OK');
    assert.equal(STATUS_TEXT[429], 'Too Many Requests');
  });
});

describe('defaults', () => {
  it('sit inside the limits that bound them', () => {
    assert.ok(DEFAULT_REQUEST_SETTINGS.timeoutMs >= MIN_TIMEOUT_MS);
    assert.ok(DEFAULT_REQUEST_SETTINGS.timeoutMs <= MAX_TIMEOUT_MS);
    assert.ok(DEFAULT_REQUEST_SETTINGS.maxRedirects <= MAX_REDIRECTS_CEILING);
    assert.ok(DEFAULT_WIRE_SETTINGS.maxResponseBytes <= MAX_RESPONSE_BYTES);
    assert.ok(DEFAULT_SETTINGS.historyLimit <= MAX_HISTORY_LIMIT);
    assert.equal(DEFAULT_SETTINGS.historyLimit, DEFAULT_HISTORY_LIMIT);
    assert.ok(DEFAULT_LAYOUT.requestPaneRatio > 0.2 && DEFAULT_LAYOUT.requestPaneRatio < 0.8);
  });

  it('ship a blank request that its own schema accepts', () => {
    const result = requestDefinitionSchema.safeParse(EMPTY_REQUEST);
    assert.equal(result.success, true);
  });

  it('are safe to share: mutating one would change every new request', () => {
    assert.ok(Object.isFrozen(EMPTY_REQUEST));
    assert.ok(Object.isFrozen(DEFAULT_REQUEST_SETTINGS));
    assert.ok(Object.isFrozen(DEFAULT_SETTINGS));
  });

  it('default to verifying TLS and following redirects', () => {
    assert.equal(DEFAULT_REQUEST_SETTINGS.verifyTls, true);
    assert.equal(DEFAULT_WIRE_SETTINGS.verifyTls, true);
    assert.equal(DEFAULT_REQUEST_SETTINGS.retry.attempts, 0);
  });
});

describe('shortcuts', () => {
  it('bind every declared action exactly once', () => {
    const bound = SHORTCUTS.map((s) => s.action);
    assert.deepEqual([...bound].sort(), [...SHORTCUT_ACTIONS].sort());
    assert.equal(new Set(bound).size, bound.length);
  });

  it('never put two actions on the same chord', () => {
    const chords = SHORTCUTS.flatMap((s) => (s.altKeys ? [s.keys, s.altKeys] : [s.keys]));
    assert.equal(new Set(chords).size, chords.length);
  });

  it('write chords platform-neutrally and in lower case', () => {
    for (const shortcut of SHORTCUTS) {
      assert.equal(shortcut.keys, shortcut.keys.toLowerCase(), shortcut.action);
      assert.ok(!shortcut.keys.includes('cmd'), shortcut.action);
      assert.ok(!shortcut.keys.includes('meta'), shortcut.action);
    }
  });
});

describe('storage keys', () => {
  it('are unique, namespaced and versioned', () => {
    const keys = Object.values(STORAGE_KEYS);
    assert.equal(new Set(keys).size, keys.length);
    for (const key of keys) {
      assert.ok(key.startsWith('adysre.api-studio.'), key);
      assert.match(key, /\.v\d+$/);
    }
  });
});
