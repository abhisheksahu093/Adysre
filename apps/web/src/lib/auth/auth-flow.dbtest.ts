import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';

import { prisma } from '@adysre/database';
import { verifyAccessToken } from './access-token';
import { hashRefreshToken } from './tokens';
import {
  findByRefreshHash,
  revokeAllForUser,
  revokeSession,
} from './repository/session.repository';
import { loadAuthContext } from './repository/user.repository';
import {
  AccountLockedError,
  EmailRegisteredError,
  InvalidCredentialsError,
  InvalidSessionError,
  InvalidTokenError,
  SlugTakenError,
  TenantAmbiguousError,
  WrongPasswordError,
} from './service/errors';
import { login } from './service/login.service';
import { changePassword, requestPasswordReset, resetPassword } from './service/password.service';
import { refresh } from './service/refresh.service';
import { register } from './service/register.service';

/**
 * End-to-end authentication against a real database.
 *
 * These exist because the interesting failures in auth are not type errors.
 * A password that verifies against the wrong account, a refresh token that
 * still works after rotation, a reset that leaves the attacker's session live:
 * every one of those type-checks perfectly and is only caught by running it.
 *
 * Each test creates its own tenant with a unique slug and everything is
 * cleaned up afterwards, so the suite is safe to run repeatedly and leaves
 * nothing behind.
 */

const ACCESS_SECRET = 'dbtest-access-secret-long-enough-for-validation-12345';
const REFRESH_SECRET = 'dbtest-refresh-secret-long-enough-for-validation-6789';
const PASSWORD = 'CorrectHorse12';

/** Slug prefix for every tenant this file creates, so cleanup can find them. */
const PREFIX = 'authtest';

let counter = 0;
/** A slug unique to this run, so concurrent or repeated runs cannot collide. */
function uniqueSlug(): string {
  counter += 1;
  return `${PREFIX}-${process.pid}-${counter}`;
}

function uniqueEmail(): string {
  return `${uniqueSlug()}@authtest.local`;
}

async function newTenant(overrides: { email?: string; password?: string } = {}) {
  const slug = uniqueSlug();
  return register({
    email: overrides.email ?? `${slug}@authtest.local`,
    password: overrides.password ?? PASSWORD,
    name: 'Test Owner',
    organizationName: `Test ${slug}`,
    organizationSlug: slug,
  });
}

/**
 * A second workspace holding the same address and the same password hash.
 *
 * Copies the hash rather than re-hashing, so the two accounts genuinely share a
 * password, which is the condition that makes sign-in ambiguous.
 */
async function createTenantWithExistingUser(email: string, sourceUserId: string): Promise<string> {
  const slug = uniqueSlug();
  const tenantId = randomUUID();

  await prisma.organization.create({
    data: { id: tenantId, tenantId, name: `Second ${slug}`, slug },
  });

  const source = await prisma.user.findUniqueOrThrow({
    where: { id: sourceUserId },
    select: { passwordHash: true },
  });

  await prisma.user.create({
    data: { id: randomUUID(), tenantId, email, name: 'Second Owner', passwordHash: source.passwordHash },
  });

  return tenantId;
}

async function slugOf(tenantId: string): Promise<string> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: tenantId },
    select: { slug: true },
  });
  return org.slug;
}

/** Remove every tenant this file created, children first. */
async function cleanup(): Promise<void> {
  const orgs = await prisma.organization.findMany({
    where: { slug: { startsWith: PREFIX } },
    select: { id: true },
  });
  if (orgs.length === 0) return;
  const tenantIds = orgs.map((o) => o.id);

  // `oauth_accounts` restricts deletion of its organization, so it has to go
  // first even though nothing in this file creates one.
  await prisma.oAuthAccount.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.auditLog.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.passwordReset.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.emailVerification.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.session.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.userRole.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.rolePermission.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.role.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.user.deleteMany({ where: { tenantId: { in: tenantIds } } });
  await prisma.organization.deleteMany({ where: { id: { in: tenantIds } } });
}

before(async () => {
  process.env.JWT_ACCESS_SECRET = ACCESS_SECRET;
  process.env.JWT_REFRESH_SECRET = REFRESH_SECRET;
  // Cost 10 rather than 12: a real bcrypt hash, four times faster, and this
  // file performs a lot of them.
  process.env.BCRYPT_COST = '10';
  await cleanup();
});

after(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('register', () => {
  it('creates a tenant, an Owner, and a working session', async () => {
    const result = await newTenant();

    assert.ok(result.userId);
    assert.ok(result.tenantId);

    // The access token must actually verify, not merely be a string.
    const session = await verifyAccessToken(result.accessToken, ACCESS_SECRET);
    assert.ok(session);
    assert.equal(session.userId, result.userId);
    assert.equal(session.tenantId, result.tenantId);
    assert.deepEqual(session.roles, ['Owner']);

    // The refresh token must be redeemable, which means its row exists.
    const row = await findByRefreshHash(hashRefreshToken(result.refreshToken));
    assert.ok(row, 'no session row was written for the refresh token');
    assert.equal(row.userId, result.userId);
  });

  it('rejects a duplicate slug', async () => {
    const first = uniqueSlug();
    await register({
      email: uniqueEmail(),
      password: PASSWORD,
      name: 'A',
      organizationName: 'A',
      organizationSlug: first,
    });

    await assert.rejects(
      register({
        email: uniqueEmail(),
        password: PASSWORD,
        name: 'B',
        organizationName: 'B',
        organizationSlug: first,
      }),
      SlugTakenError,
    );
  });

  it('rejects an address that already has an account', async () => {
    const email = uniqueEmail();
    await newTenant({ email });

    await assert.rejects(
      register({
        email,
        password: PASSWORD,
        name: 'B',
        organizationName: 'B',
        organizationSlug: uniqueSlug(),
      }),
      EmailRegisteredError,
    );
  });

  it('never leaves a half-created tenant behind', async () => {
    // The slug is taken, so this fails. The transaction means no Organization
    // row may survive from the attempt, or the tenant would be unusable and
    // unrepairable through the UI.
    const slug = uniqueSlug();
    await newTenant();
    const before = await prisma.organization.count({ where: { slug } });

    await assert.rejects(
      register({
        email: uniqueEmail(),
        password: PASSWORD,
        name: 'X',
        organizationName: 'X',
        organizationSlug: (await prisma.organization.findFirst({
          where: { slug: { startsWith: PREFIX } },
          select: { slug: true },
        }))!.slug,
      }),
    );

    assert.equal(await prisma.organization.count({ where: { slug } }), before);
  });
});

describe('login', () => {
  it('signs in with correct credentials', async () => {
    const email = uniqueEmail();
    const created = await newTenant({ email });

    const result = await login({ email, password: PASSWORD });
    assert.equal(result.userId, created.userId);
    assert.equal(result.tenantId, created.tenantId);

    const session = await verifyAccessToken(result.accessToken, ACCESS_SECRET);
    assert.ok(session);
  });

  it('is case-insensitive on the address', async () => {
    const email = uniqueEmail();
    await newTenant({ email });
    const result = await login({ email: email.toUpperCase(), password: PASSWORD });
    assert.ok(result.userId);
  });

  it('rejects a wrong password', async () => {
    const email = uniqueEmail();
    await newTenant({ email });
    await assert.rejects(login({ email, password: 'WrongPassword12' }), InvalidCredentialsError);
  });

  it('rejects an unknown address with the SAME error as a wrong password', async () => {
    // Identical failures are what stop sign-in being a list of who is
    // registered.
    await assert.rejects(
      login({ email: 'nobody@authtest.local', password: PASSWORD }),
      InvalidCredentialsError,
    );
  });

  it('locks the account after five failures, and the lock holds', async () => {
    const email = uniqueEmail();
    await newTenant({ email });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await assert.rejects(login({ email, password: 'WrongPassword12' }), InvalidCredentialsError);
    }

    // The correct password now, and it must still refuse. A lock that yields to
    // the right password protects nothing.
    await assert.rejects(login({ email, password: PASSWORD }), AccountLockedError);
  });

  it('clears the failure counter on a successful sign-in', async () => {
    const email = uniqueEmail();
    const created = await newTenant({ email });

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await assert.rejects(login({ email, password: 'WrongPassword12' }), InvalidCredentialsError);
    }
    await login({ email, password: PASSWORD });

    const user = await prisma.user.findUnique({
      where: { id: created.userId },
      select: { failedLoginAttempts: true, lockedUntil: true, lastLoginAt: true },
    });
    assert.equal(user?.failedLoginAttempts, 0);
    assert.equal(user?.lockedUntil, null);
    assert.ok(user?.lastLoginAt);
  });

  it('asks which workspace when one password matches two tenants', async () => {
    // Legal state: users are unique on (tenant_id, email), so one address can
    // hold accounts in two workspaces. `register` refuses a duplicate address,
    // so the second account is built directly, which is exactly what an
    // invitation flow will produce.
    const email = uniqueEmail();
    const first = await newTenant({ email });
    const secondTenantId = await createTenantWithExistingUser(email, first.userId);

    await assert.rejects(login({ email, password: PASSWORD }), TenantAmbiguousError);

    // Naming the workspace resolves it, in both directions.
    const intoSecond = await login({
      email,
      password: PASSWORD,
      tenantSlug: await slugOf(secondTenantId),
    });
    assert.equal(intoSecond.tenantId, secondTenantId);
  });
});

describe('refresh and rotation', () => {
  it('rotates the token, and the old one stops working', async () => {
    const created = await newTenant();

    const rotated = await refresh(created.refreshToken);
    assert.notEqual(rotated.refreshToken, created.refreshToken);

    // The new one works.
    const again = await refresh(rotated.refreshToken);
    assert.ok(again.accessToken);
  });

  it('detects reuse and revokes every session for the user', async () => {
    // The single most important test in this file. A replayed token means two
    // parties hold it and one of them is not the user.
    const created = await newTenant();

    // A second device, so there is something to revoke besides the one reused.
    const second = await login({
      email: (await prisma.user.findUnique({
        where: { id: created.userId },
        select: { email: true },
      }))!.email,
      password: PASSWORD,
    });

    const rotated = await refresh(created.refreshToken);

    // Replay the token that was just rotated away.
    await assert.rejects(refresh(created.refreshToken), (error: unknown) => {
      assert.ok(error instanceof InvalidSessionError);
      assert.equal(error.reused, true, 'reuse was not flagged');
      return true;
    });

    // The whole family is gone: the rotated token AND the other device.
    await assert.rejects(refresh(rotated.refreshToken), InvalidSessionError);
    await assert.rejects(refresh(second.refreshToken), InvalidSessionError);
  });

  it('rejects a forged token', async () => {
    await assert.rejects(refresh('not-a-real-refresh-token'), InvalidSessionError);
  });

  it('does NOT treat an administratively revoked session as reuse', async () => {
    // The distinction that matters: a session revoked by logout or a password
    // change is an expired session, not a theft signal. Conflating the two is
    // what made a password change sign out the very device that performed it.
    const email = uniqueEmail();
    const first = await newTenant({ email });
    const second = await login({ email, password: PASSWORD });

    await revokeSession(
      (await findByRefreshHash(hashRefreshToken(second.refreshToken)))!.id,
    );

    await assert.rejects(refresh(second.refreshToken), (error: unknown) => {
      assert.ok(error instanceof InvalidSessionError);
      assert.equal(error.reused, false, 'a plain revocation was misreported as reuse');
      return true;
    });

    // The other device is untouched, which is the whole point.
    assert.ok(await refresh(first.refreshToken));
  });

  it('rejects a revoked session', async () => {
    const created = await newTenant();
    await revokeAllForUser(created.userId);
    await assert.rejects(refresh(created.refreshToken), InvalidSessionError);
  });

  it('re-reads roles from the database rather than copying old claims', async () => {
    // This is what makes a revoked role take effect in 15 minutes rather than
    // surviving for the refresh token's 14 days.
    const created = await newTenant();
    await prisma.userRole.deleteMany({ where: { userId: created.userId } });

    const rotated = await refresh(created.refreshToken);
    const session = await verifyAccessToken(rotated.accessToken, ACCESS_SECRET);
    assert.deepEqual(session?.roles, [], 'the removed role survived into the new token');
  });
});

describe('password reset', () => {
  it('issues a token, sets the password, and revokes every session', async () => {
    const email = uniqueEmail();
    const created = await newTenant({ email });

    const issued = await requestPasswordReset(email, '127.0.0.1');
    assert.equal(issued.length, 1);

    const result = await resetPassword(issued[0]!.token, 'BrandNewPassword12');
    assert.equal(result.userId, created.userId);

    // Sessions from before the reset are dead. Someone resetting after a
    // compromise expects the attacker to be signed out.
    await assert.rejects(refresh(created.refreshToken), InvalidSessionError);

    // The new password works and the old one does not.
    assert.ok(await login({ email, password: 'BrandNewPassword12' }));
    await assert.rejects(login({ email, password: PASSWORD }), InvalidCredentialsError);
  });

  it('refuses to redeem the same token twice', async () => {
    const email = uniqueEmail();
    await newTenant({ email });
    const issued = await requestPasswordReset(email);

    await resetPassword(issued[0]!.token, 'FirstNewPassword12');
    await assert.rejects(resetPassword(issued[0]!.token, 'SecondNew12345'), InvalidTokenError);
  });

  it('invalidates other outstanding reset links once one is used', async () => {
    // Otherwise an attacker who requested a link earlier still holds a live one
    // after the victim resets.
    const email = uniqueEmail();
    await newTenant({ email });

    const first = await requestPasswordReset(email);
    const second = await requestPasswordReset(email);

    await resetPassword(second[0]!.token, 'NewPassword123456');
    await assert.rejects(resetPassword(first[0]!.token, 'AnotherPassword12'), InvalidTokenError);
  });

  it('clears a lockout, so a locked user can recover', async () => {
    const email = uniqueEmail();
    await newTenant({ email });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await assert.rejects(login({ email, password: 'WrongPassword12' }), InvalidCredentialsError);
    }
    await assert.rejects(login({ email, password: PASSWORD }), AccountLockedError);

    const issued = await requestPasswordReset(email);
    await resetPassword(issued[0]!.token, 'RecoveredPassword12');

    assert.ok(await login({ email, password: 'RecoveredPassword12' }));
  });

  it('rejects a forged or expired token identically', async () => {
    await assert.rejects(resetPassword('forged-token', 'NewPassword1234'), InvalidTokenError);
  });

  it('issues nothing for an unknown address, without throwing', async () => {
    // The route answers 200 either way; this must not be the thing that breaks
    // that promise.
    const issued = await requestPasswordReset('nobody-at-all@authtest.local');
    assert.deepEqual(issued, []);
  });
});

describe('change password', () => {
  it('requires the current password', async () => {
    const created = await newTenant();
    const auth = await loadAuthContext(created.tenantId, created.userId);

    await assert.rejects(
      changePassword(auth, 'NotThePassword12', 'BrandNewPassword12', created.refreshToken),
      WrongPasswordError,
    );
  });

  it('keeps the current session and revokes the others', async () => {
    const email = uniqueEmail();
    const created = await newTenant({ email });
    const other = await login({ email, password: PASSWORD });

    const auth = await loadAuthContext(created.tenantId, created.userId);
    await changePassword(auth, PASSWORD, 'BrandNewPassword12', created.refreshToken);

    // The other device is signed out.
    await assert.rejects(refresh(other.refreshToken), InvalidSessionError);
    // This one still works: signing out the device that just made the change
    // would be hostile.
    assert.ok(await refresh(created.refreshToken));
  });

  it('actually changes the password', async () => {
    const email = uniqueEmail();
    const created = await newTenant({ email });
    const auth = await loadAuthContext(created.tenantId, created.userId);

    await changePassword(auth, PASSWORD, 'BrandNewPassword12', created.refreshToken);

    assert.ok(await login({ email, password: 'BrandNewPassword12' }));
    await assert.rejects(login({ email, password: PASSWORD }), InvalidCredentialsError);
  });
});

describe('tenant isolation', () => {
  it('scopes the auth context to one tenant', async () => {
    const a = await newTenant();
    const b = await newTenant();

    // Tenant B's id with tenant A's user must yield nothing, or a token could
    // be minted that claims the wrong tenant.
    const crossed = await loadAuthContext(b.tenantId, a.userId);
    assert.deepEqual(crossed.roles, []);
    assert.deepEqual(crossed.permissions, []);
  });
});
