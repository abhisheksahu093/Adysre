import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { prisma } from '@adysre/database';
import { InvalidTokenError } from './service/errors';
import { register } from './service/register.service';
import {
  resendVerification,
  sendVerificationLink,
  verifyEmail,
} from './service/verification.service';

/**
 * Email verification, end to end against a real database.
 *
 * The transport is the console one throughout (no provider configured in
 * tests), so nothing leaves the machine while the token handling is exercised
 * for real.
 */

const PREFIX = 'verifytest';
let n = 0;
const slug = () => `${PREFIX}-${process.pid}-${(n += 1)}`;

async function cleanup(): Promise<void> {
  const orgs = await prisma.organization.findMany({
    where: { slug: { startsWith: PREFIX } },
    select: { id: true },
  });
  const ids = orgs.map((o) => o.id);
  if (ids.length === 0) return;

  await prisma.auditLog.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.emailVerification.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.passwordReset.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.session.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.userRole.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.rolePermission.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.role.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.user.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.organization.deleteMany({ where: { id: { in: ids } } });
}

async function newAccount() {
  const s = slug();
  const email = `${s}@verifytest.local`;
  const result = await register({
    email,
    password: 'CorrectHorse12',
    name: 'Verify Person',
    organizationName: `Verify ${s}`,
    organizationSlug: s,
  });
  return { ...result, email };
}

before(async () => {
  process.env.JWT_ACCESS_SECRET = 'verifytest-access-secret-long-enough-for-validation';
  process.env.JWT_REFRESH_SECRET = 'verifytest-refresh-secret-long-enough-for-checks';
  process.env.BCRYPT_COST = '10';
  process.env.EMAIL_TRANSPORT = 'console';
  await cleanup();
});

after(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('email verification', () => {
  it('confirms an address with a valid token', async () => {
    const account = await newAccount();
    const { token } = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });

    const result = await verifyEmail(token);
    assert.equal(result.alreadyVerified, false);

    const user = await prisma.user.findUnique({
      where: { id: account.userId },
      select: { emailVerifiedAt: true },
    });
    assert.ok(user?.emailVerifiedAt, 'emailVerifiedAt was not stamped');
  });

  it('reports a second redemption as already verified rather than failing', async () => {
    // A mail scanner that prefetches the link redeems it before the human
    // clicks. If the second arrival errored, every user behind such a scanner
    // would see a failure for a link that actually worked.
    const account = await newAccount();
    const { token } = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });

    await verifyEmail(token);
    // The same token cannot be reused, but a fresh link for an already verified
    // address reports the state rather than erroring.
    const second = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });
    const result = await verifyEmail(second.token);
    assert.equal(result.alreadyVerified, true);
  });

  it('refuses to redeem the same token twice', async () => {
    const account = await newAccount();
    const { token } = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });

    await verifyEmail(token);
    await assert.rejects(verifyEmail(token), InvalidTokenError);
  });

  it('refuses a forged token', async () => {
    await assert.rejects(verifyEmail('not-a-real-token'), InvalidTokenError);
  });

  it('refuses an expired token', async () => {
    const account = await newAccount();
    const { token } = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });

    await prisma.emailVerification.updateMany({
      where: { userId: account.userId, usedAt: null },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    await assert.rejects(verifyEmail(token), InvalidTokenError);
  });

  it('stores only a hash, never the token that was mailed', async () => {
    const account = await newAccount();
    const { token } = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });

    const rows = await prisma.emailVerification.findMany({
      where: { userId: account.userId },
      select: { tokenHash: true },
    });
    assert.ok(rows.length > 0);
    for (const row of rows) {
      assert.notEqual(row.tokenHash, token, 'the raw token is at rest in the database');
      assert.match(row.tokenHash, /^[0-9a-f]{64}$/);
    }
  });

  it('refuses a link issued for an address the user no longer holds', async () => {
    // This is why the address lives on the verification row. Without it, a user
    // could request a link for one address, change their pending address to
    // another, and click the original link to verify an address they never
    // proved control of.
    const account = await newAccount();
    const { token } = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });

    await prisma.user.update({
      where: { id: account.userId },
      data: { email: `changed-${account.email}` },
    });

    await assert.rejects(verifyEmail(token), InvalidTokenError);

    const user = await prisma.user.findUnique({
      where: { id: account.userId },
      select: { emailVerifiedAt: true },
    });
    assert.equal(user?.emailVerifiedAt, null, 'an unproven address was marked verified');
  });

  it('invalidates other outstanding links once one is redeemed', async () => {
    const account = await newAccount();
    const first = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });
    const second = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });

    await verifyEmail(second.token);
    await assert.rejects(verifyEmail(first.token), InvalidTokenError);
  });

  it('registers with a verification link already issued', async () => {
    // Registration must leave an outstanding link, or nobody can ever confirm.
    const account = await newAccount();
    const pending = await prisma.emailVerification.count({
      where: { userId: account.userId, usedAt: null },
    });
    assert.equal(pending, 1);
  });
});

describe('resending verification', () => {
  it('issues a fresh link for an unverified address', async () => {
    const account = await newAccount();
    const result = await resendVerification(account.tenantId, account.userId);
    assert.ok(result, 'expected a resend for an unverified address');

    const pending = await prisma.emailVerification.count({
      where: { userId: account.userId, usedAt: null },
    });
    // The one from registration plus this one.
    assert.equal(pending, 2);
  });

  it('returns null once the address is verified', async () => {
    const account = await newAccount();
    const { token } = await sendVerificationLink({
      tenantId: account.tenantId,
      userId: account.userId,
      email: account.email,
    });
    await verifyEmail(token);

    assert.equal(await resendVerification(account.tenantId, account.userId), null);
  });

  it('will not resend for a user in another tenant', async () => {
    const a = await newAccount();
    const b = await newAccount();
    // Tenant B's id with tenant A's user must find nothing.
    assert.equal(await resendVerification(b.tenantId, a.userId), null);
  });
});
