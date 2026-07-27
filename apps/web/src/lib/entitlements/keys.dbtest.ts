import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, describe, it } from 'node:test';

import { prisma } from '@adysre/database';

/**
 * Every feature key used in the codebase must exist in the database.
 *
 * A mistyped key fails quietly in the worst way: `checkUsage` returns null, the
 * badge renders nothing, `FeatureGate` shows its fallback, and the feature
 * looks gated while actually being ungated. Nothing throws and no test fails.
 * This reads the source, collects every key, and checks them against the
 * seeded catalogue.
 */

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, '..', '..');

/** Every place a feature key can appear. */
const PATTERNS = [
  /useGatedAction\(\s*'([a-z0-9.-]+)'/g,
  /useEntitlement\(\s*'([a-z0-9.-]+)'/g,
  /feature="([a-z0-9.-]+)"/g,
  /featureKey:\s*'([a-z0-9.-]+)'/g,
];

function walk(dir: string, found: Set<string>): void {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      walk(full, found);
      continue;
    }
    if (!/\.tsx?$/.test(entry)) continue;
    // Test files reference deliberately bogus keys to prove they are rejected.
    if (/\.(test|dbtest)\.tsx?$/.test(entry)) continue;

    const source = readFileSync(full, 'utf8');
    for (const pattern of PATTERNS) {
      for (const match of source.matchAll(pattern)) {
        if (match[1]) found.add(match[1]);
      }
    }
  }
}

after(async () => {
  await prisma.$disconnect();
});

describe('feature keys', () => {
  it('every key used in the source is seeded', async () => {
    const used = new Set<string>();
    walk(srcRoot, used);

    const rows = await prisma.feature.findMany({ select: { key: true } });
    const seeded = new Set(rows.map((row) => row.key));

    const unknown = [...used].filter((key) => !seeded.has(key)).sort();
    assert.deepEqual(
      unknown,
      [],
      `used in code but not in the database: ${unknown.join(', ')}. Run pnpm db:seed.`,
    );

    // Sanity: if the walker found nothing, this test proves nothing and would
    // pass forever while the gates rotted.
    assert.ok(used.size >= 10, `only found ${used.size} feature keys in the source`);
  });

  it('every seeded feature is referenced somewhere', async () => {
    // The other direction. A feature seeded with a limit but wired to nothing
    // is a limit users are told about and never actually meet, which is worse
    // than having no limit: the profile page shows a quota nothing consumes.
    const used = new Set<string>();
    walk(srcRoot, used);

    const rows = await prisma.feature.findMany({ select: { key: true } });
    const unwired = rows.map((row) => row.key).filter((key) => !used.has(key)).sort();

    assert.deepEqual(unwired, [], `seeded but never enforced: ${unwired.join(', ')}`);
  });
});
