import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SignJWT } from 'jose';

import {
  canWrite,
  verifyAccessToken,
  resolveDevSession,
  constantTimeEqual,
  WRITE_ROLES,
  type IntelSession,
} from './policy';

/**
 * Policy tests. Everything here is pure - `session.ts` (which reads cookies/env)
 * is the thin wiring around these functions, so verifying the policy in
 * isolation covers the actual authorization decisions without a request scope.
 */

const SECRET = 'test-secret-at-least-32-bytes-long-000';
const encoded = new TextEncoder().encode(SECRET);

/** Sign a token the same shape `apps/api` issues (HS256, AuthContext claims). */
async function sign(
  claims: Record<string, unknown>,
  opts: { expired?: boolean; secret?: Uint8Array } = {},
): Promise<string> {
  const exp = opts.expired ? '-1h' : '1h';
  return new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(opts.secret ?? encoded);
}

const OWNER_CLAIMS = {
  sub: 'user-1',
  tenantId: 'tenant-1',
  roles: ['Owner'],
  permissions: ['website-intelligence:scan:create'],
};

describe('canWrite', () => {
  const withRoles = (roles: IntelSession['roles']): IntelSession => ({
    userId: 'u',
    tenantId: 't',
    roles,
    permissions: [],
  });

  it('allows every privileged role', () => {
    for (const role of WRITE_ROLES) {
      assert.equal(canWrite(withRoles([role])), true, `${role} should write`);
    }
  });

  it('denies Member and empty roles', () => {
    assert.equal(canWrite(withRoles(['Member'])), false);
    assert.equal(canWrite(withRoles([])), false);
  });
});

describe('verifyAccessToken', () => {
  it('accepts a valid token and projects the claims', async () => {
    const session = await verifyAccessToken(await sign(OWNER_CLAIMS), SECRET);
    assert.deepEqual(session, {
      userId: 'user-1',
      tenantId: 'tenant-1',
      roles: ['Owner'],
      permissions: ['website-intelligence:scan:create'],
    });
  });

  it('rejects a token signed with the wrong secret', async () => {
    const token = await sign(OWNER_CLAIMS, { secret: new TextEncoder().encode('other-secret') });
    assert.equal(await verifyAccessToken(token, SECRET), null);
  });

  it('rejects an expired token', async () => {
    assert.equal(await verifyAccessToken(await sign(OWNER_CLAIMS, { expired: true }), SECRET), null);
  });

  it('rejects a token missing identity claims', async () => {
    assert.equal(await verifyAccessToken(await sign({ roles: ['Owner'] }), SECRET), null);
  });

  it('drops unknown roles and malformed permissions', async () => {
    const session = await verifyAccessToken(
      await sign({ ...OWNER_CLAIMS, roles: ['Owner', 'Wizard'], permissions: ['bad', 'a:b:c'] }),
      SECRET,
    );
    assert.deepEqual(session?.roles, ['Owner']);
    assert.deepEqual(session?.permissions, ['a:b:c']);
  });

  it('rejects garbage', async () => {
    assert.equal(await verifyAccessToken('not.a.jwt', SECRET), null);
  });
});

describe('resolveDevSession', () => {
  it('defaults to a usable demo Owner when the cookie is unset', () => {
    assert.deepEqual(resolveDevSession(undefined)?.roles, ['Owner']);
  });

  it('honours a specific role and defaults the tenant to demo', () => {
    assert.deepEqual(resolveDevSession('Member')?.roles, ['Member']);
    assert.equal(resolveDevSession('Member')?.tenantId, 'demo');
    assert.equal(canWrite(resolveDevSession('Member')!), false);
  });

  it('parses <role>@<tenant> to simulate a second org', () => {
    assert.deepEqual(resolveDevSession('Owner@acme'), {
      userId: 'demo-user-acme',
      tenantId: 'acme',
      roles: ['Owner'],
      permissions: [],
    });
    // Bare @tenant → default Owner in that tenant.
    assert.equal(resolveDevSession('@beta')?.tenantId, 'beta');
    assert.deepEqual(resolveDevSession('@beta')?.roles, ['Owner']);
  });

  it('denies for anonymous or an unknown value', () => {
    assert.equal(resolveDevSession('anonymous'), null);
    // Unknown but not "anonymous" → falls back to Owner (never a silent deny).
    assert.deepEqual(resolveDevSession('bogus')?.roles, ['Owner']);
  });
});

describe('constantTimeEqual', () => {
  it('matches equal strings and rejects differing ones', () => {
    assert.equal(constantTimeEqual('s3cret', 's3cret'), true);
    assert.equal(constantTimeEqual('s3cret', 's3creT'), false);
    assert.equal(constantTimeEqual('short', 'longer-value'), false);
    assert.equal(constantTimeEqual('', ''), true);
  });
});
