import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';

import { prisma } from '@adysre/database';
import type { OAuthProfile } from './oauth/client';
import { findLink, listLinks, unlinkAccount } from './repository/oauth-account.repository';
import { register } from './service/register.service';
import {
  OAuthAccountInactiveError,
  OAuthAmbiguousError,
  OAuthEmailUnverifiedError,
  signInWithOAuth,
} from './service/oauth.service';

/**
 * OAuth account linking against a real database.
 *
 * The behaviour this file exists to pin down cannot be checked any other way:
 * every case below type-checks perfectly and is only distinguishable by what
 * actually lands in `oauth_accounts` and which user comes back out. The one
 * that matters most is "the provider changed the email" - the exact case that
 * silently created a second, empty workspace before this table existed.
 *
 * Each test creates its own tenant with a unique slug and everything is cleaned
 * up afterwards, so the suite is safe to run repeatedly and leaves nothing
 * behind.
 */

const ACCESS_SECRET = 'dbtest-access-secret-long-enough-for-validation-12345';
const REFRESH_SECRET = 'dbtest-refresh-secret-long-enough-for-validation-6789';
const PASSWORD = 'CorrectHorse12';

/** Slug prefix for every tenant this file creates, so cleanup can find them. */
const PREFIX = 'oauthtest';

let counter = 0;
function uniqueSlug(): string {
  counter += 1;
  return `${PREFIX}-${process.pid}-${counter}`;
}

function uniqueEmail(): string {
  return `${uniqueSlug()}@oauthtest.local`;
}

/**
 * A provider account id scoped to this run.
 *
 * `(provider, provider_account_id)` is unique platform-wide, so a literal like
 * `stable-id-1` would make two concurrent runs collide on a constraint that has
 * nothing to do with what is being tested. Same reason the slugs carry the pid.
 */
function providerId(label: string): string {
  return `${PREFIX}-${process.pid}-${label}`;
}

/** A provider profile with everything the happy path needs. */
function profile(overrides: Partial<OAuthProfile> = {}): OAuthProfile {
  return {
    provider: 'google',
    providerAccountId: `sub-${randomUUID()}`,
    email: uniqueEmail(),
    emailVerified: true,
    name: 'Test Person',
    ...overrides,
  };
}

/** Remove every tenant this file created, children first. */
async function cleanup(): Promise<void> {
  const orgs = await prisma.organization.findMany({
    where: { slug: { startsWith: PREFIX } },
    select: { id: true },
  });
  if (orgs.length === 0) return;
  const tenantIds = orgs.map((o) => o.id);

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
  // Cost 10 rather than 12: a real bcrypt hash, four times faster.
  process.env.BCRYPT_COST = '10';
  await cleanup();
});

after(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('first sign-in with an unknown provider account', () => {
  it('creates a workspace, links it, and issues a working session', async () => {
    const result = await signInWithOAuth(profile());

    assert.equal(result.created, true);
    assert.equal(result.linked, true);
    assert.ok(result.accessToken);
    assert.ok(result.sessionId);

    const links = await listLinks(result.tenantId, result.userId);
    assert.deepEqual(
      links.map((l) => l.provider),
      ['google'],
    );
  });

  it('creates the user with no password and the email already verified', async () => {
    const result = await signInWithOAuth(profile());
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: result.userId },
      select: { passwordHash: true, emailVerifiedAt: true },
    });

    // Null, not a random hash: a hash would tell every later check that this
    // account has a password it can be asked for.
    assert.equal(user.passwordHash, null);
    // The provider proved the address, so asking again would be theatre.
    assert.notEqual(user.emailVerifiedAt, null);
  });
});

describe('returning provider account', () => {
  it('is the SAME user even when the provider reports a new email', async () => {
    // The reason this table exists. Before it, matching was by address, so a
    // renamed Google account arrived as a stranger and got a second workspace.
    const first = await signInWithOAuth(profile({ providerAccountId: providerId('stable-id-1') }));

    const second = await signInWithOAuth(
      profile({ providerAccountId: providerId('stable-id-1'), email: uniqueEmail() }),
    );

    assert.equal(second.userId, first.userId);
    assert.equal(second.tenantId, first.tenantId);
    assert.equal(second.created, false);
    assert.equal(second.linked, false);
  });

  it('signs in even when the provider stops vouching for the email', async () => {
    // Verification gates CREATING a link, because the address is the only
    // evidence there. Once the link exists it stands on the provider's own
    // account id, which cannot be spoofed by claiming an address.
    const first = await signInWithOAuth(profile({ providerAccountId: providerId('stable-id-2') }));

    const second = await signInWithOAuth(
      profile({ providerAccountId: providerId('stable-id-2'), emailVerified: false }),
    );

    assert.equal(second.userId, first.userId);
  });

  it('records the sign-in without adding a second row', async () => {
    const first = await signInWithOAuth(profile({ providerAccountId: providerId('stable-id-3') }));
    await signInWithOAuth(profile({ providerAccountId: providerId('stable-id-3') }));

    const links = await listLinks(first.tenantId, first.userId);
    assert.equal(links.length, 1);
    assert.notEqual(links[0]?.lastUsedAt, null);
  });
});

describe('an existing account with the same address', () => {
  it('adopts the provider rather than creating a second workspace', async () => {
    const slug = uniqueSlug();
    const email = `${slug}@oauthtest.local`;
    const account = await register({
      email,
      password: PASSWORD,
      name: 'Password Owner',
      organizationName: `Test ${slug}`,
      organizationSlug: slug,
    });

    const result = await signInWithOAuth(profile({ email }));

    assert.equal(result.userId, account.userId);
    assert.equal(result.tenantId, account.tenantId);
    assert.equal(result.created, false);
    // The link is new, which is what "adopted" means.
    assert.equal(result.linked, true);
  });

  it('refuses an address the provider has not verified', async () => {
    const slug = uniqueSlug();
    const email = `${slug}@oauthtest.local`;
    await register({
      email,
      password: PASSWORD,
      name: 'Password Owner',
      organizationName: `Test ${slug}`,
      organizationSlug: slug,
    });

    // Without this, anyone able to put a victim's address on a throwaway
    // provider account would inherit that victim's workspace.
    await assert.rejects(
      () => signInWithOAuth(profile({ email, emailVerified: false })),
      OAuthEmailUnverifiedError,
    );

    const user = await prisma.user.findFirstOrThrow({ where: { email } });
    assert.equal((await listLinks(user.tenantId, user.id)).length, 0);
  });

  it('refuses a disabled account', async () => {
    const slug = uniqueSlug();
    const email = `${slug}@oauthtest.local`;
    const account = await register({
      email,
      password: PASSWORD,
      name: 'Password Owner',
      organizationName: `Test ${slug}`,
      organizationSlug: slug,
    });
    await prisma.user.update({ where: { id: account.userId }, data: { isActive: false } });

    await assert.rejects(() => signInWithOAuth(profile({ email })), OAuthAccountInactiveError);
  });
});

describe('an address in more than one workspace', () => {
  it('refuses, because a redirect has nowhere to ask which', async () => {
    const email = uniqueEmail();

    for (const _ of [0, 1]) {
      const slug = uniqueSlug();
      await register({
        email,
        password: PASSWORD,
        name: 'Owner',
        organizationName: `Test ${slug}`,
        organizationSlug: slug,
      });
    }

    await assert.rejects(() => signInWithOAuth(profile({ email })), OAuthAmbiguousError);
  });
});

describe('re-linking', () => {
  it('repoints an existing link instead of failing on the unique pair', async () => {
    // Someone deletes their Google account and makes a new one with the same
    // address. A plain insert would hit `(user_id, provider)` and strand them.
    const first = await signInWithOAuth(profile({ providerAccountId: providerId('old-sub') }));
    const email = (
      await prisma.user.findUniqueOrThrow({
        where: { id: first.userId },
        select: { email: true },
      })
    ).email;

    const again = await signInWithOAuth(profile({ providerAccountId: providerId('new-sub'), email }));

    assert.equal(again.userId, first.userId);
    assert.equal((await listLinks(first.tenantId, first.userId)).length, 1);
    // The old id no longer resolves; the new one does.
    assert.equal(await findLink('google', providerId('old-sub')), null);
    assert.equal((await findLink('google', providerId('new-sub')))?.userId, first.userId);
  });

  it('frees the pair on unlink, so the SAME provider account can link again', async () => {
    const sub = providerId('unlink-sub');
    const result = await signInWithOAuth(profile({ providerAccountId: sub }));
    const { email } = await prisma.user.findUniqueOrThrow({
      where: { id: result.userId },
      select: { email: true },
    });

    await unlinkAccount(result.tenantId, result.userId, 'google');
    assert.equal(await findLink('google', sub), null);
    assert.equal((await listLinks(result.tenantId, result.userId)).length, 0);

    // Re-linking the SAME provider account to the SAME user is the case that
    // matters: a soft delete would leave the old row occupying both unique
    // pairs, and this would fail on a constraint the user could do nothing
    // about. It must also land back on the original workspace, not a new one.
    const relinked = await signInWithOAuth(profile({ providerAccountId: sub, email }));

    assert.equal(relinked.userId, result.userId);
    assert.equal(relinked.tenantId, result.tenantId);
    assert.equal(relinked.created, false);
    assert.equal(relinked.linked, true);
  });
});
