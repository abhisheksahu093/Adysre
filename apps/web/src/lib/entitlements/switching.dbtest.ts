import assert from 'node:assert/strict';
import { afterEach, after, before, describe, it } from 'node:test';

import { prisma } from '@adysre/database';
import { canSwitchPlan, directGrantEnabled } from './switching';

/**
 * Who may change a plan without paying.
 *
 * This replaces a browser cookie anyone could set, so the cases that matter are
 * the refusals. Every one of them is a way the old switcher could be abused and
 * this one cannot.
 */

const PREFIX = 'switchtest';
let n = 0;

const saved: Record<string, string | undefined> = {};
const KEYS = ['NODE_ENV', 'BILLING_ALLOW_DIRECT_GRANT', 'BILLING_TEST_ACCOUNTS'];

/**
 * Set an environment variable, including NODE_ENV.
 *
 * A direct `process.env.NODE_ENV = ...` is a compile error under the types
 * Next uses for its production build, where that property is readonly. A
 * computed key is not, and this says why the indirection exists rather than
 * reaching for a cast.
 */
function setEnv(key: string, value: string | undefined): void {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

async function newUser(email: string): Promise<string> {
  const slug = `${PREFIX}-${process.pid}-${(n += 1)}`;
  const org = await prisma.organization.create({
    data: { name: slug, slug, tenantId: '00000000-0000-0000-0000-000000000000' },
    select: { id: true },
  });
  await prisma.organization.update({ where: { id: org.id }, data: { tenantId: org.id } });
  const user = await prisma.user.create({
    data: { tenantId: org.id, email, name: 'Switch Test' },
    select: { id: true },
  });
  return user.id;
}

before(async () => {
  for (const key of KEYS) saved[key] = process.env[key];
});

afterEach(() => {
  for (const key of KEYS) setEnv(key, saved[key]);
});

after(async () => {
  const orgs = await prisma.organization.findMany({
    where: { slug: { startsWith: PREFIX } },
    select: { id: true },
  });
  const ids = orgs.map((o) => o.id);
  if (ids.length > 0) {
    await prisma.user.deleteMany({ where: { tenantId: { in: ids } } });
    await prisma.organization.deleteMany({ where: { id: { in: ids } } });
  }
  await prisma.$disconnect();
});

describe('plan switching eligibility', () => {
  it('is refused in production, whatever else is configured', async () => {
    // Hard-coded rather than configurable. No environment variable may hand out
    // Premium where real money is involved.
    const userId = await newUser(`prod-${(n += 1)}@switchtest.local`);
    setEnv('NODE_ENV', 'production');
    setEnv('BILLING_ALLOW_DIRECT_GRANT', 'true');
    setEnv('BILLING_TEST_ACCOUNTS', '');

    const result = await canSwitchPlan(userId);
    assert.equal(result.allowed, false);
    assert.match(result.reason ?? '', /production/);
    assert.equal(directGrantEnabled(), false);
  });

  it('is refused when the flag is not explicitly true', async () => {
    // Off by default, so cloning the repo does not come with a free upgrade
    // button nobody meant to enable.
    const userId = await newUser(`off-${(n += 1)}@switchtest.local`);
    setEnv('NODE_ENV', 'development');
    setEnv('BILLING_ALLOW_DIRECT_GRANT', undefined);

    assert.equal((await canSwitchPlan(userId)).allowed, false);

    // And not by a value that merely looks enabled.
    setEnv('BILLING_ALLOW_DIRECT_GRANT', '1');
    assert.equal((await canSwitchPlan(userId)).allowed, false);
    setEnv('BILLING_ALLOW_DIRECT_GRANT', 'yes');
    assert.equal((await canSwitchPlan(userId)).allowed, false);
  });

  it('allows any user when no allowlist is configured', async () => {
    const userId = await newUser(`any-${(n += 1)}@switchtest.local`);
    setEnv('NODE_ENV', 'development');
    setEnv('BILLING_ALLOW_DIRECT_GRANT', 'true');
    setEnv('BILLING_TEST_ACCOUNTS', undefined);

    assert.equal((await canSwitchPlan(userId)).allowed, true);
  });

  it('allows only the listed accounts when one is configured', async () => {
    const mine = `owner-${(n += 1)}@switchtest.local`;
    const other = `someone-${(n += 1)}@switchtest.local`;
    const mineId = await newUser(mine);
    const otherId = await newUser(other);

    setEnv('NODE_ENV', 'development');
    setEnv('BILLING_ALLOW_DIRECT_GRANT', 'true');
    setEnv('BILLING_TEST_ACCOUNTS', mine);

    assert.equal((await canSwitchPlan(mineId)).allowed, true);

    // The point of the allowlist: a shared preview must not let everyone with
    // an account rewrite its billing state.
    const refused = await canSwitchPlan(otherId);
    assert.equal(refused.allowed, false);
    assert.match(refused.reason ?? '', /BILLING_TEST_ACCOUNTS/);
  });

  it('matches an allowlisted address case-insensitively and ignores spacing', async () => {
    // Emails are case-insensitive in practice, and a list typed by hand will
    // have spaces after the commas.
    const email = `mixedcase-${(n += 1)}@switchtest.local`;
    const userId = await newUser(email);

    setEnv('NODE_ENV', 'development');
    setEnv('BILLING_ALLOW_DIRECT_GRANT', 'true');
    setEnv('BILLING_TEST_ACCOUNTS', ` OTHER@x.test ,  ${email.toUpperCase()} `);

    assert.equal((await canSwitchPlan(userId)).allowed, true);
  });

  it('refuses a user that does not exist', async () => {
    // Fails closed: an id with no row must not inherit the unrestricted case.
    setEnv('NODE_ENV', 'development');
    setEnv('BILLING_ALLOW_DIRECT_GRANT', 'true');
    setEnv('BILLING_TEST_ACCOUNTS', 'someone@x.test');

    const result = await canSwitchPlan('3f2504e0-4f89-41d3-9a0c-0305e82c3301');
    assert.equal(result.allowed, false);
  });

  it('treats a blank allowlist as no allowlist, not as an empty one', async () => {
    // An empty string must not lock everybody out; that would read as the
    // feature being broken rather than restricted.
    const userId = await newUser(`blank-${(n += 1)}@switchtest.local`);
    setEnv('NODE_ENV', 'development');
    setEnv('BILLING_ALLOW_DIRECT_GRANT', 'true');
    setEnv('BILLING_TEST_ACCOUNTS', '   ');

    assert.equal((await canSwitchPlan(userId)).allowed, true);
  });
});
