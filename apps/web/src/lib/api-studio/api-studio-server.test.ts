import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import type { PlatformSession } from '@/lib/auth/access-token';
import { EMPTY_REQUEST } from '@/modules/api-studio/constants/defaults';
import { createEntry } from '@/modules/api-studio/utils/entries';
import { defined } from '@/lib/api/patch';
import { slugify } from '@/modules/api-studio/schemas/api';
import { can, effectivePermissions, ownsTenant } from './auth-policy';
import {
  KEY_ENV,
  PREVIOUS_KEYS_ENV,
  SecretStorageError,
  decryptSecret,
  encryptSecret,
  isSecretStorageConfigured,
} from './crypto';
import { redactSecrets } from '@/modules/api-studio/utils/redact';

/**
 * Server-layer tests: everything that can be asserted without a database.
 *
 * The three things here are the three that would be expensive to get wrong.
 * Authorization, where a mistake silently widens access. Secret encryption,
 * where a mistake silently stores a credential in the clear or makes a rotation
 * unreadable. And redaction, where a mistake turns the history log into the
 * credential store it exists not to be.
 */

const KEY_A = Buffer.alloc(32, 1).toString('base64');
const KEY_B = Buffer.alloc(32, 2).toString('base64');

function session(patch: Partial<PlatformSession> = {}): PlatformSession {
  return {
    userId: '018f0000-0000-7000-8000-000000000000',
    tenantId: '018f0000-0000-7000-8000-000000000001',
    roles: [],
    permissions: [],
    ...patch,
  };
}

/** Run `fn` with the given env, restoring whatever was there afterwards. */
function withEnv<T>(env: Record<string, string | undefined>, fn: () => T): T {
  const previous = new Map(Object.keys(env).map((key) => [key, process.env[key]]));
  try {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    return fn();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

describe('authorization', () => {
  it('denies a session with no roles and no permissions', () => {
    assert.equal(can(session(), API_STUDIO_PERMISSIONS.collectionRead), false);
    assert.deepEqual(effectivePermissions(session()), []);
  });

  it('maps a platform role onto the module role with equivalent reach', () => {
    const owner = session({ roles: ['Owner'] });
    assert.equal(can(owner, API_STUDIO_PERMISSIONS.workspaceManage), true);
    assert.equal(can(owner, API_STUDIO_PERMISSIONS.secretManage), true);

    const member = session({ roles: ['Member'] });
    assert.equal(can(member, API_STUDIO_PERMISSIONS.requestExecute), true);
    assert.equal(can(member, API_STUDIO_PERMISSIONS.workspaceManage), false);

    const custom = session({ roles: ['Custom'] });
    assert.equal(can(custom, API_STUDIO_PERMISSIONS.collectionRead), true);
    assert.equal(can(custom, API_STUDIO_PERMISSIONS.requestExecute), false);
  });

  it('takes the wider of two roles, never the narrower', () => {
    const both = session({ roles: ['Custom', 'Admin'] });
    assert.equal(can(both, API_STUDIO_PERMISSIONS.workspaceManage), true);
  });

  it('lets the token win over the role map, in both directions', () => {
    // Narrower than the role map would give: the token is the authority.
    const narrowed = session({
      roles: ['Owner'],
      permissions: [API_STUDIO_PERMISSIONS.collectionRead],
    });
    assert.equal(can(narrowed, API_STUDIO_PERMISSIONS.collectionRead), true);
    assert.equal(can(narrowed, API_STUDIO_PERMISSIONS.workspaceManage), false);

    // Permissions for other modules do not count as module permissions here.
    const other = session({ roles: [], permissions: ['crm:lead:read'] });
    assert.equal(can(other, API_STUDIO_PERMISSIONS.collectionRead), false);
  });

  it('checks the tenant separately from the permission', () => {
    const caller = session({ roles: ['Owner'] });
    assert.equal(ownsTenant(caller, caller.tenantId), true);
    assert.equal(ownsTenant(caller, 'another-tenant'), false);
  });
});

describe('secret storage', () => {
  it('reports that it is unconfigured rather than storing plaintext', () => {
    withEnv({ [KEY_ENV]: undefined, [PREVIOUS_KEYS_ENV]: undefined }, () => {
      assert.equal(isSecretStorageConfigured(), false);
      assert.throws(() => encryptSecret('token'), SecretStorageError);
    });
  });

  it('refuses a key that is not 32 bytes', () => {
    withEnv({ [KEY_ENV]: Buffer.alloc(16, 1).toString('base64') }, () => {
      assert.equal(isSecretStorageConfigured(), false);
    });
  });

  it('round-trips a secret', () => {
    withEnv({ [KEY_ENV]: KEY_A, [PREVIOUS_KEYS_ENV]: undefined }, () => {
      const stored = encryptSecret('super-secret-token');
      assert.match(stored, /^v1:[0-9a-f]{8}:/);
      assert.ok(!stored.includes('super-secret-token'));
      assert.equal(decryptSecret(stored), 'super-secret-token');
    });
  });

  it('never produces the same ciphertext twice for the same input', () => {
    withEnv({ [KEY_ENV]: KEY_A }, () => {
      assert.notEqual(encryptSecret('same'), encryptSecret('same'));
    });
  });

  it('fails closed on a tampered ciphertext', () => {
    withEnv({ [KEY_ENV]: KEY_A, [PREVIOUS_KEYS_ENV]: undefined }, () => {
      const stored = encryptSecret('token');
      const parts = stored.split(':');
      const flipped = Buffer.from(parts[3]!, 'base64');
      flipped[0] = (flipped[0]! ^ 0xff) & 0xff;
      parts[3] = flipped.toString('base64');
      assert.equal(decryptSecret(parts.join(':')), null);
    });
  });

  it('returns null rather than throwing on garbage', () => {
    withEnv({ [KEY_ENV]: KEY_A }, () => {
      assert.equal(decryptSecret('not-a-ciphertext'), null);
      assert.equal(decryptSecret('v9:abcdefgh:aa:bb:cc'), null);
    });
  });

  it('keeps old values readable through a key rotation', () => {
    const stored = withEnv({ [KEY_ENV]: KEY_A, [PREVIOUS_KEYS_ENV]: undefined }, () =>
      encryptSecret('rotate-me'),
    );

    // New key active, old key retired but retained: the old value still reads.
    withEnv({ [KEY_ENV]: KEY_B, [PREVIOUS_KEYS_ENV]: KEY_A }, () => {
      assert.equal(decryptSecret(stored), 'rotate-me');
      const fresh = encryptSecret('new-value');
      assert.equal(decryptSecret(fresh), 'new-value');
    });

    // Old key dropped entirely: the old value is unreadable, not wrong.
    withEnv({ [KEY_ENV]: KEY_B, [PREVIOUS_KEYS_ENV]: undefined }, () => {
      assert.equal(decryptSecret(stored), null);
    });
  });
});

describe('history redaction', () => {
  it('drops auth entirely rather than masking it', () => {
    const redacted = redactSecrets({
      ...EMPTY_REQUEST,
      auth: { type: 'bearer', token: 'real-token', prefix: 'Bearer' },
    });
    assert.deepEqual(redacted.auth, { type: 'none' });
    assert.ok(!JSON.stringify(redacted).includes('real-token'));
  });

  it('empties credential-bearing headers but keeps the rest', () => {
    const redacted = redactSecrets({
      ...EMPTY_REQUEST,
      headers: [
        createEntry({ key: 'Authorization', value: 'Bearer real-token' }),
        createEntry({ key: 'x-api-key', value: 'k-123' }),
        createEntry({ key: 'Accept', value: 'application/json' }),
      ],
    });

    assert.deepEqual(
      redacted.headers.map((header) => [header.key, header.value]),
      [
        ['Authorization', ''],
        ['x-api-key', ''],
        ['Accept', 'application/json'],
      ],
    );
  });

  it('empties secret variables and leaves plain ones alone', () => {
    const redacted = redactSecrets({
      ...EMPTY_REQUEST,
      variables: [
        { id: 'a', key: 'token', value: 's3cret', initialValue: 's3cret', secret: true, enabled: true, description: '' },
        { id: 'b', key: 'page', value: '2', initialValue: '2', secret: false, enabled: true, description: '' },
      ],
    });

    assert.equal(redacted.variables[0]?.value, '');
    assert.equal(redacted.variables[0]?.initialValue, '');
    assert.equal(redacted.variables[1]?.value, '2');
  });
});

describe('patch helpers', () => {
  it('drops undefined keys so a PATCH only touches what it named', () => {
    assert.deepEqual(defined({ name: 'a', description: undefined, favorite: false }), {
      name: 'a',
      favorite: false,
    });
    assert.deepEqual(Object.keys(defined({ a: undefined })), []);
  });
});

describe('slugify', () => {
  it('produces a slug the schema would accept', () => {
    assert.equal(slugify('Payments API'), 'payments-api');
    assert.equal(slugify('  Внутренний  '), 'workspace');
    assert.equal(slugify('!!!'), 'workspace');
    assert.equal(slugify('a'.repeat(100)).length, 63);
    assert.match(slugify('Café Orders v2'), /^[a-z0-9-]+$/);
  });
});
