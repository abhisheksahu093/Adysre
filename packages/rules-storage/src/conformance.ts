import { all, condition, field, literal, rule, sequentialIds } from '@adysre/rules-core';
import type { RuleDocument, StoragePlugin } from '@adysre/rules-types';

/**
 * The behaviour every storage adapter has to have.
 *
 * "Storage adapters" is plural, and a plural that only means "several things
 * with the same method names" is worth nothing: a screen that lists rules
 * correctly against the in-memory store and wrongly against the database is a
 * bug nobody finds until production, because both adapters type-check.
 *
 * So the contract is EXECUTABLE. An adapter runs this against itself and finds
 * out, rather than its author reading a document and believing they complied.
 *
 * Framework-free on purpose - no vitest, no node:test - so it can run inside a
 * unit test, inside a deployment's own health check, or against a database in
 * CI. The caller decides what a failure means; this only reports.
 */

export interface ConformanceResult {
  name: string;
  ok: boolean;
  error?: string;
}

/** Builds a fresh, EMPTY store. Called once per check, so nothing leaks between. */
export type StorageFactory = () => StoragePlugin | Promise<StoragePlugin>;

const ids = sequentialIds();
const FIXED = Date.parse('2026-01-01T00:00:00.000Z');

function sampleRule(overrides: Partial<RuleDocument> = {}): RuleDocument {
  const options = { ids, now: () => FIXED };

  return {
    ...rule(
      {
        name: 'Large orders',
        kind: 'validation',
        tags: ['orders'],
        when: all(
          [
            condition(
              { left: field('order.total'), operator: 'greaterThan', args: [literal(1000)] },
              options,
            ),
          ],
          options,
        ),
      },
      options,
    ),
    ...overrides,
  };
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

interface Check {
  name: string;
  run: (storage: StoragePlugin) => Promise<void>;
}

const CHECKS: Check[] = [
  {
    name: 'a first save is version 1, whatever the document claimed',
    run: async (storage) => {
      // An imported document carries whatever version it was written with, and
      // honouring it would start a fresh history at 7.
      const saved = await storage.save(sampleRule({ version: 7 }));
      assert(saved.version === 1, `expected version 1, got ${String(saved.version)}`);
    },
  },
  {
    name: 'get returns what was saved, and null for what was not',
    run: async (storage) => {
      const saved = await storage.save(sampleRule());
      const loaded = await storage.get(saved.id);

      assert(loaded !== null, 'get returned null for a rule that was saved');
      assert(loaded?.name === saved.name, 'get returned a different rule');
      assert((await storage.get('nothing-by-that-id')) === null, 'expected null for an unknown id');
    },
  },
  {
    name: 'saving a change bumps the version',
    run: async (storage) => {
      const first = await storage.save(sampleRule());
      const second = await storage.save({ ...first, name: 'Renamed' });

      assert(second.version === 2, `expected version 2, got ${String(second.version)}`);
      assert(second.name === 'Renamed', 'the change was not stored');
    },
  },
  {
    name: 'saving no change creates no version',
    run: async (storage) => {
      // Autosave, a double-posted form, a retry landing after the first attempt
      // succeeded. A history padded with identical entries is one nobody reads.
      const first = await storage.save(sampleRule());
      const again = await storage.save(first);

      assert(again.version === first.version, `version moved to ${String(again.version)}`);
    },
  },
  {
    name: 'the stored version wins over the version a client sent',
    run: async (storage) => {
      const first = await storage.save(sampleRule());
      await storage.save({ ...first, name: 'Second' });
      // A client editing a stale copy still counts from what is stored.
      const third = await storage.save({ ...first, name: 'Third', version: 1 });

      assert(third.version === 3, `expected version 3, got ${String(third.version)}`);
    },
  },
  {
    name: 'list filters by kind, status, tags and search',
    run: async (storage) => {
      const orders = await storage.save(sampleRule({ name: 'Large orders', tags: ['orders'] }));
      await storage.save(
        sampleRule({
          id: `${orders.id}-b`,
          name: 'Refund limit',
          kind: 'workflow',
          tags: ['refunds'],
        }),
      );

      assert((await storage.list()).length === 2, 'an unfiltered list should return both');
      assert((await storage.list({ kind: 'workflow' })).length === 1, 'kind did not filter');
      assert((await storage.list({ tags: ['orders'] })).length === 1, 'tags did not filter');
      assert(
        (await storage.list({ search: 'refund' })).length === 1,
        'search did not match a name',
      );
      assert((await storage.list({ search: 'REFUND' })).length === 1, 'search should ignore case');
      assert((await storage.list({ status: 'active' })).length === 0, 'status did not filter');
    },
  },
  {
    name: 'a tag filter narrows rather than widens',
    run: async (storage) => {
      const first = await storage.save(sampleRule({ tags: ['orders', 'eu'] }));
      await storage.save(sampleRule({ id: `${first.id}-b`, tags: ['orders'] }));

      // ALL of the tags, not any: a filter people reach for to narrow a list.
      const both = await storage.list({ tags: ['orders', 'eu'] });
      assert(both.length === 1, `expected 1 rule with both tags, got ${String(both.length)}`);
    },
  },
  {
    name: 'list pages without dropping or repeating a rule',
    run: async (storage) => {
      const base = sampleRule();
      for (let index = 0; index < 5; index += 1) {
        await storage.save({
          ...base,
          id: `${base.id}-${String(index)}`,
          name: `Rule ${String(index)}`,
        });
      }

      const first = await storage.list({ limit: 2, offset: 0 });
      const second = await storage.list({ limit: 2, offset: 2 });

      assert(first.length === 2, `expected 2, got ${String(first.length)}`);
      assert(second.length === 2, `expected 2, got ${String(second.length)}`);

      // The ordering has to be stable or an item appears on two pages, or none.
      const seen = new Set([...first, ...second].map((summary) => summary.id));
      assert(seen.size === 4, 'a rule appeared on more than one page');
    },
  },
  {
    name: 'remove hides the rule from get and from list',
    run: async (storage) => {
      const saved = await storage.save(sampleRule());
      await storage.remove(saved.id);

      assert((await storage.get(saved.id)) === null, 'get still returns a removed rule');
      assert((await storage.list()).length === 0, 'list still includes a removed rule');
    },
  },
  {
    name: 'removing something that is not there is not an error',
    run: async (storage) => {
      // Delete is idempotent, so a retry after a lost response is safe.
      await storage.remove('nothing-by-that-id');
    },
  },
  {
    name: 'versions are listed newest first',
    run: async (storage) => {
      if (storage.versions === undefined) return;

      const first = await storage.save(sampleRule());
      await storage.save({ ...first, name: 'Second' });
      await storage.save({ ...first, name: 'Third' });

      const versions = await storage.versions(first.id);
      assert(versions.length === 3, `expected 3 versions, got ${String(versions.length)}`);
      assert(versions[0]?.version === 3, 'the newest version should be first');
      assert(versions[2]?.version === 1, 'the oldest version should be last');
    },
  },
  {
    name: 'restore moves history forward rather than rewinding it',
    run: async (storage) => {
      if (storage.restore === undefined || storage.versions === undefined) return;

      const first = await storage.save(sampleRule({ name: 'Original' }));
      await storage.save({ ...first, name: 'Mistake' });

      const restored = await storage.restore(first.id, 1);

      assert(restored.name === 'Original', 'restore did not bring the old content back');
      // A new version on top, not a rewind: a history that can be rewritten is
      // one nobody can be asked to trust.
      assert(restored.version === 3, `expected version 3, got ${String(restored.version)}`);
      assert((await storage.versions(first.id)).length === 3, 'restore lost a version');
    },
  },
  {
    name: 'restore keeps the current identity',
    run: async (storage) => {
      if (storage.restore === undefined) return;

      const first = await storage.save(sampleRule());
      await storage.save({ ...first, name: 'Second' });
      const restored = await storage.restore(first.id, 1);

      assert(restored.id === first.id, 'restore changed the id');
    },
  },
  {
    name: 'restoring a version that does not exist is refused',
    run: async (storage) => {
      if (storage.restore === undefined) return;

      const saved = await storage.save(sampleRule());
      let refused = false;
      try {
        await storage.restore(saved.id, 99);
      } catch {
        refused = true;
      }
      assert(refused, 'restoring a missing version should reject');
    },
  },
  {
    name: 'an invalid rule is refused rather than stored',
    run: async (storage) => {
      let refused = false;
      try {
        // Two nodes sharing an id: `validateRule` refuses the document, and a
        // store that accepted it would hand back something no trace can explain.
        const broken = sampleRule();
        await storage.save({ ...broken, id: '' });
      } catch {
        refused = true;
      }
      assert(refused, 'an invalid rule should be refused');
    },
  },
];

/**
 * Run every check against a fresh store and report what happened.
 *
 * Never throws. A conformance run that stopped at the first failure would tell
 * an adapter's author about one problem per run, and the useful answer is the
 * whole list.
 */
export async function runStorageConformance(create: StorageFactory): Promise<ConformanceResult[]> {
  const results: ConformanceResult[] = [];

  for (const check of CHECKS) {
    try {
      await check.run(await create());
      results.push({ name: check.name, ok: true });
    } catch (error) {
      results.push({
        name: check.name,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

/** The failures, as one message. Empty when everything passed. */
export function conformanceReport(results: readonly ConformanceResult[]): string {
  return results
    .filter((result) => !result.ok)
    .map((result) => `${result.name}: ${result.error ?? 'failed'}`)
    .join('\n');
}
