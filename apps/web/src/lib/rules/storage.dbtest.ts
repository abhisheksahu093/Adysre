import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { after, before, describe, it, type TestContext } from 'node:test';

import { conformanceReport, runStorageConformance } from '@adysre/rules-storage';
import { PrismaClient } from '@adysre/database';

import { createPrismaRulesStorage } from './storage';

/**
 * The Prisma adapter, held to the same contract as every other one.
 *
 * This is what the conformance suite was written for. An adapter backed by a
 * database translates the querying into SQL rather than calling the shared
 * helpers, so it is the one place the semantics can genuinely diverge - and a
 * screen that lists rules correctly against the in-memory store and wrongly
 * against Postgres is a bug nobody finds until production, because both
 * type-check.
 *
 * It needs a real database. Skipped rather than failed when there is none: a
 * contributor without Postgres running should get a green suite and a note,
 * not a failure they cannot act on. CI and anyone with the stack up runs it for
 * real.
 *
 * Named `.dbtest.ts` rather than `.test.ts` so it runs under its own command.
 * It needs `--conditions=react-server` to make `server-only` a no-op, and that
 * same condition resolves `react` to its server build - which has no
 * `useEffect`, so every next-intl test in this app fails under it. The two
 * cannot share a runner.
 *
 * The skip is decided INSIDE each test rather than through the `skip` option,
 * which `node:test` evaluates when `it()` is declared - before `before` has had
 * a chance to connect. Written that way, every test here skipped unconditionally
 * and the suite reported green without touching a database, which is the exact
 * failure this file exists to prevent somewhere else.
 */

const FIXED = Date.parse('2026-01-01T00:00:00.000Z');

let prisma: PrismaClient | null = null;
let tenantId: string | null = null;
let reachable = false;
/**
 * Why it was skipped, when it was.
 *
 * A suite that skips silently is a suite that passes for the wrong reason. The
 * cause travels into the skip message so a green run says "no database" and not
 * merely "ok".
 */
let unreachable = 'DATABASE_URL is not set';

/**
 * The repo's `.env`, when the variable is not already in the environment.
 *
 * Next loads it for the app and the CLI loads it for Prisma, but a bare test
 * process gets neither - and `node --env-file` does not reach the child
 * processes the test runner spawns. Without this the suite skips on a machine
 * where the database is running, which is the one machine it most needs to run
 * on. An environment that already sets the variable wins, so CI is unaffected.
 */
function databaseUrlFromEnvFile(): string | undefined {
  try {
    const file = readFileSync(resolve(import.meta.dirname, '../../../../../.env'), 'utf8');
    const match = /^DATABASE_URL=(.*)$/m.exec(file);
    return match?.[1]?.trim().replace(/^["']|["']$/g, '');
  } catch {
    return undefined;
  }
}

before(async () => {
  process.env.DATABASE_URL ??= databaseUrlFromEnvFile();
  if (process.env.DATABASE_URL === undefined) return;

  try {
    prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;

    // Every rule row is tenant-scoped by a foreign key, so the suite needs a
    // tenant to hang them from. Its own, created and dropped here, so a run
    // cannot see or disturb anybody else's rules.
    const organization = await prisma.organization.create({
      data: {
        id: crypto.randomUUID(),
        tenantId: crypto.randomUUID(),
        name: 'Conformance',
        slug: `conformance-${crypto.randomUUID()}`,
      },
      select: { id: true },
    });
    await prisma.organization.update({
      where: { id: organization.id },
      data: { tenantId: organization.id },
    });

    tenantId = organization.id;
    reachable = true;
  } catch (error) {
    reachable = false;
    unreachable =
      error instanceof Error
        ? `${error.name}: ${error.message.split('\n')[0] ?? ''}`
        : String(error);
  }
});

after(async () => {
  if (prisma !== null && tenantId !== null) {
    // Hard delete, unlike the adapter's soft delete: this is test residue and
    // not somebody's data.
    await prisma.ruleVersion.deleteMany({ where: { tenantId } });
    await prisma.rule.deleteMany({ where: { tenantId } });
    await prisma.organization.deleteMany({ where: { id: tenantId } });
  }
  await prisma?.$disconnect();
});

describe('the Prisma adapter', () => {
  it('passes the storage conformance suite', async (t: TestContext) => {
    if (!reachable) return t.skip(`no database: ${unreachable}`);

    // Copied into locals so the closures below are narrowed: TypeScript cannot
    // narrow a module-level `let` across a callback boundary.
    const db = prisma;
    const tenant = tenantId;
    assert.ok(db !== null && tenant !== null);

    const results = await runStorageConformance(async () => {
      // A fresh, EMPTY store per check, which for a shared table means clearing
      // the tenant's rows rather than constructing a new object.
      await db.ruleVersion.deleteMany({ where: { tenantId: tenant } });
      await db.rule.deleteMany({ where: { tenantId: tenant } });

      return createPrismaRulesStorage({ prisma: db, tenantId: tenant, now: () => FIXED });
    });

    assert.equal(conformanceReport(results), '', 'conformance failures');
    assert.ok(results.length >= 14, 'the suite should be running every check');
  });

  it('frees a removed rule id, so the same document can be saved again', async (t: TestContext) => {
    if (!reachable) return t.skip(`no database: ${unreachable}`);

    const db = prisma;
    const tenant = tenantId;
    assert.ok(db !== null && tenant !== null);

    await db.ruleVersion.deleteMany({ where: { tenantId: tenant } });
    await db.rule.deleteMany({ where: { tenantId: tenant } });

    const storage = createPrismaRulesStorage({ prisma: db, tenantId: tenant, now: () => FIXED });
    const { rule, all, condition, field, sequentialIds } = await import('@adysre/rules-core');
    const ids = sequentialIds();
    const document = rule(
      {
        name: 'Removable',
        kind: 'validation',
        when: all([condition({ left: field('a'), operator: 'isEmpty', args: [] }, { ids })], {
          ids,
        }),
      },
      { ids, now: () => FIXED },
    );

    await storage.save(document);
    await storage.remove(document.id);

    // Soft delete keeps the row, so a full unique constraint would refuse this
    // and the adapter would diverge from the in-memory one. The partial index
    // is what makes it an ordinary new rule.
    const again = await storage.save(document);

    assert.equal(again.version, 1);
    assert.equal((await storage.get(document.id))?.name, 'Removable');
  });

  it("keeps one tenant out of another tenant's rules", async (t: TestContext) => {
    if (!reachable) return t.skip(`no database: ${unreachable}`);

    const db = prisma;
    const tenant = tenantId;
    assert.ok(db !== null && tenant !== null);

    const other = await db.organization.create({
      data: {
        id: crypto.randomUUID(),
        tenantId: crypto.randomUUID(),
        name: 'Other',
        slug: `other-${crypto.randomUUID()}`,
      },
      select: { id: true },
    });
    await db.organization.update({ where: { id: other.id }, data: { tenantId: other.id } });

    try {
      const mine = createPrismaRulesStorage({ prisma: db, tenantId: tenant, now: () => FIXED });
      const theirs = createPrismaRulesStorage({ prisma: db, tenantId: other.id, now: () => FIXED });

      const { rule } = await import('@adysre/rules-core');
      const document = rule({ name: 'Mine', kind: 'validation' }, { now: () => FIXED });
      await mine.save(document);

      // The tenant is bound at construction, so there is no argument another
      // tenant could pass to reach this row.
      assert.equal(await theirs.get(document.id), null);
      assert.deepEqual(await theirs.list(), []);
      assert.deepEqual(await theirs.versions?.(document.id), []);
    } finally {
      await db.ruleVersion.deleteMany({ where: { tenantId: other.id } });
      await db.rule.deleteMany({ where: { tenantId: other.id } });
      await db.organization.deleteMany({ where: { id: other.id } });
    }
  });
});
