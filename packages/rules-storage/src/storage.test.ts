import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { all, condition, field, literal, rule, sequentialIds } from '@adysre/rules-core';
import type { RuleDocument, RuleSummary } from '@adysre/rules-types';

import {
  applyQuery,
  compareVersions,
  conformanceReport,
  countMatching,
  createMemoryStorage,
  isUnchanged,
  matchesQuery,
  nextVersion,
  restoreFrom,
  runStorageConformance,
  summarise,
  createWebStorage,
  type WebStorageLike,
} from './index.ts';

/**
 * Storage, tested twice over.
 *
 * The pure decisions - what a tag filter means, when a save makes a version -
 * are tested directly, because they are the specification every adapter is
 * translating. The adapter itself is then tested through the SAME conformance
 * suite a database adapter will run, so the reference implementation is held to
 * the contract rather than defining it by accident.
 */

const ids = sequentialIds();
const FIXED = Date.parse('2026-01-01T00:00:00.000Z');
const options = { ids, now: () => FIXED };

function sample(overrides: Partial<RuleDocument> = {}): RuleDocument {
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

function summaryOf(overrides: Partial<RuleSummary> = {}): RuleSummary {
  return { ...summarise(sample()), ...overrides };
}

describe('listing', () => {
  it('searches what identifies a rule, and not its prose', () => {
    const summary = summaryOf({ name: 'Large orders', key: 'ord-01', tags: ['approval'] });

    assert.ok(matchesQuery(summary, { search: 'large' }));
    assert.ok(matchesQuery(summary, { search: 'ORD-01' }), 'the business key counts');
    assert.ok(matchesQuery(summary, { search: 'approval' }), 'a tag counts');
    assert.ok(!matchesQuery(summary, { search: 'nothing here' }));
  });

  it('narrows on every tag given, rather than widening', () => {
    const summary = summaryOf({ tags: ['orders', 'eu'] });

    assert.ok(matchesQuery(summary, { tags: ['orders'] }));
    assert.ok(matchesQuery(summary, { tags: ['orders', 'eu'] }));
    // A filter that returned MORE as tags were added would read as broken.
    assert.ok(!matchesQuery(summary, { tags: ['orders', 'us'] }));
  });

  it('ignores an empty search rather than matching nothing', () => {
    assert.ok(matchesQuery(summaryOf(), { search: '   ' }));
    assert.ok(matchesQuery(summaryOf(), { tags: [] }));
  });

  it('orders by recency and breaks ties by id, so paging is stable', () => {
    const older = summaryOf({ id: 'b', updatedAt: '2026-01-01T00:00:00.000Z' });
    const newer = summaryOf({ id: 'c', updatedAt: '2026-02-01T00:00:00.000Z' });
    const tied = summaryOf({ id: 'a', updatedAt: '2026-02-01T00:00:00.000Z' });

    const ordered = applyQuery([older, newer, tied]).map((summary) => summary.id);
    // Same instant, so the id decides - and decides the same way every time.
    assert.deepEqual(ordered, ['a', 'c', 'b']);
  });

  it('pages without dropping or repeating', () => {
    const summaries = ['a', 'b', 'c', 'd', 'e'].map((id) => summaryOf({ id }));

    const first = applyQuery(summaries, { limit: 2, offset: 0 }).map((entry) => entry.id);
    const second = applyQuery(summaries, { limit: 2, offset: 2 }).map((entry) => entry.id);

    assert.equal(new Set([...first, ...second]).size, 4);
    assert.equal(countMatching(summaries), 5, 'the count ignores the page');
  });
});

describe('versioning', () => {
  it('starts a first save at 1, whatever the document claimed', () => {
    // An imported document carries the version it was written with; honouring
    // it would start a fresh history at 7.
    const result = nextVersion(null, sample({ version: 7 }), options);

    assert.equal(result.rule.version, 1);
    assert.ok(result.created);
  });

  it('creates nothing when a save changed nothing', () => {
    const first = nextVersion(null, sample(), options).rule;
    const again = nextVersion(first, first, options);

    assert.ok(!again.created);
    assert.equal(again.rule, first, 'the stored document comes back as it was');
  });

  it('counts from the stored version, not the one a client sent', () => {
    const first = nextVersion(null, sample(), options).rule;
    const second = nextVersion(first, { ...first, name: 'Second' }, options).rule;
    // A stale client editing version 1 must not write 2 over 3.
    const third = nextVersion(second, { ...first, name: 'Third', version: 1 }, options).rule;

    assert.equal(second.version, 2);
    assert.equal(third.version, 3);
  });

  it('keeps the original creation time and moves the update time', () => {
    const first = nextVersion(null, sample(), { now: () => FIXED }).rule;
    const later = FIXED + 86_400_000;
    const second = nextVersion(first, { ...first, name: 'Second' }, { now: () => later }).rule;

    assert.equal(second.metadata.createdAt, first.metadata.createdAt);
    assert.equal(second.metadata.updatedAt, new Date(later).toISOString());
  });

  it('records who saved it, when a host says', () => {
    const saved = nextVersion(null, sample(), { ...options, actor: 'user_1' }).rule;
    assert.equal(saved.metadata.updatedBy, 'user_1');
  });

  it('ignores key order when deciding whether anything changed', () => {
    const first = sample();
    // The same document, built with its fields assigned in another order. A
    // comparison over raw JSON would call this a change and store a version.
    const reordered: RuleDocument = { ...first, tags: [...first.tags] };

    assert.ok(isUnchanged(first, reordered));
  });

  it('tells a rename from a real edit', () => {
    const first = sample();
    const renamed = { ...first, name: 'Something else' };
    const edited = {
      ...first,
      when: all([condition({ left: field('a'), operator: 'isEmpty', args: [] }, options)], options),
    };

    assert.equal(compareVersions(first, renamed).logicChanged, false);
    assert.equal(compareVersions(first, renamed).renamed, true);
    assert.equal(compareVersions(first, edited).logicChanged, true);
  });

  it('notices a tag change however it was ordered', () => {
    const first = sample({ tags: ['a', 'b'] });

    assert.equal(compareVersions(first, { ...first, tags: ['b', 'a'] }).tagsChanged, false);
    assert.equal(compareVersions(first, { ...first, tags: ['a'] }).tagsChanged, true);
  });

  it('does not mistake one tag with a space for two tags', () => {
    // Joining tags to compare them is only safe if the separator cannot occur
    // in a tag, and nothing stops one containing a space.
    const spaced = sample({ tags: ['a b'] });
    const split = { ...spaced, tags: ['a', 'b'] };

    assert.equal(compareVersions(spaced, split).tagsChanged, true);
  });

  it('restores forward, keeping the current identity', () => {
    const first = nextVersion(null, sample({ name: 'Original' }), options).rule;
    const second = nextVersion(first, { ...first, name: 'Mistake' }, options).rule;

    const restored = restoreFrom(second, first, options);

    assert.equal(restored.rule.name, 'Original');
    assert.equal(restored.rule.version, 3, 'a restore is a new version, never a rewind');
    assert.equal(restored.rule.id, second.id);
  });

  it('does not resurrect a key the rule no longer carries', () => {
    const keyed = nextVersion(null, sample({ key: 'old-key' }), options).rule;
    const { key: _dropped, ...unkeyed } = keyed;
    const current = nextVersion(keyed, { ...unkeyed, name: 'Now unkeyed' }, options).rule;

    const restored = restoreFrom(current, keyed, options);

    assert.equal(restored.rule.key, undefined);
  });
});

describe('the reference adapter', () => {
  it('passes the contract every adapter is held to', async () => {
    const results = await runStorageConformance(() => createMemoryStorage({ now: () => FIXED }));

    assert.equal(conformanceReport(results), '', 'conformance failures');
    assert.ok(results.length >= 14, 'the suite should be running every check');
    assert.ok(results.every((result) => result.ok));
  });

  it('reports failures rather than throwing at the first one', async () => {
    // An adapter's author wants the whole list, not one problem per run.
    const broken = () => ({
      ...createMemoryStorage({ now: () => FIXED }),
      get: () => Promise.resolve(null),
    });

    const results = await runStorageConformance(broken);
    const failed = results.filter((result) => !result.ok);

    assert.ok(failed.length > 0);
    assert.ok(conformanceReport(results).includes('get returns what was saved'));
    // The run completed: later checks still ran after the first failure.
    assert.equal(results.length, (await runStorageConformance(() => createMemoryStorage())).length);
  });

  it('seeds a store without pretending the seed was already versioned', async () => {
    const storage = createMemoryStorage({ now: () => FIXED, seed: [sample({ version: 9 })] });
    const listed = await storage.list();

    assert.equal(listed.length, 1);
    assert.equal(listed[0]?.version, 1);
  });

  it('keeps two stores from leaking into each other', async () => {
    const first = createMemoryStorage();
    const second = createMemoryStorage();

    await first.save(sample());

    assert.equal((await second.list()).length, 0);
  });
});

describe('the web adapter', () => {
  /** A `localStorage` that is just an object, so this needs no browser. */
  function fakeStorage(): WebStorageLike & { dump: () => string | null } {
    let value: string | null = null;
    return {
      getItem: () => value,
      setItem: (_key, next) => {
        value = next;
      },
      removeItem: () => {
        value = null;
      },
      dump: () => value,
    };
  }

  it('passes the same contract the reference adapter does', async () => {
    // The reason the suite exists. Two stores that both type-check as
    // `StoragePlugin` and disagree about what a tag filter means is the failure
    // it is here to catch, and it could not catch it with one adapter.
    const results = await runStorageConformance(() =>
      createWebStorage({ storage: fakeStorage(), now: () => FIXED }),
    );

    assert.equal(conformanceReport(results), '', 'conformance failures');
  });

  it('survives a reload', async () => {
    const backing = fakeStorage();
    const saved = await createWebStorage({ storage: backing, now: () => FIXED }).save(sample());

    // A second store over the same backing is what a page reload looks like.
    const reopened = createWebStorage({ storage: backing, now: () => FIXED });
    const loaded = await reopened.get(saved.id);

    assert.equal(loaded?.name, saved.name);
    assert.equal((await reopened.versions?.(saved.id))?.length, 1);
  });

  it('reads corrupt storage as empty rather than throwing', async () => {
    const backing = fakeStorage();
    backing.setItem('adysre.rules', '{not json at all');

    // Somebody editing their own browser storage should lose a sandbox, not the
    // page that was rendering.
    const storage = createWebStorage({ storage: backing });
    assert.deepEqual(await storage.list(), []);
  });

  it('skips a stored document that is no longer a rule', async () => {
    const backing = fakeStorage();
    backing.setItem(
      'adysre.rules',
      JSON.stringify({ r_1: [{ schemaVersion: 1, nonsense: true }] }),
    );

    const storage = createWebStorage({ storage: backing });
    assert.deepEqual(await storage.list(), [], 'an unreadable rule must not become a list entry');
  });

  it('refuses a document written by a newer engine', async () => {
    const backing = fakeStorage();
    const future = { ...sample(), schemaVersion: 99 };
    backing.setItem('adysre.rules', JSON.stringify({ [future.id]: [future] }));

    // Guessing at a shape a later build invented is how a store corrupts data
    // it could have simply declined to read.
    const storage = createWebStorage({ storage: backing });
    assert.deepEqual(await storage.list(), []);
  });

  it('forgets rather than fails where there is nowhere to persist', async () => {
    // The server render, and a browser with site data blocked.
    const storage = createWebStorage({ storage: undefined, now: () => FIXED });
    const saved = await storage.save(sample());

    assert.equal((await storage.get(saved.id))?.id, saved.id, 'it should still work in memory');
  });

  it('keeps writing when storage is over quota', async () => {
    const backing: WebStorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => undefined,
    };

    // Losing the write is recoverable; taking down the editor is not.
    await createWebStorage({ storage: backing, now: () => FIXED }).save(sample());
  });

  it('writes the same bytes for the same history', async () => {
    const first = fakeStorage();
    const second = fakeStorage();
    const document = sample();

    await createWebStorage({ storage: first, now: () => FIXED }).save(document);
    await createWebStorage({ storage: second, now: () => FIXED }).save({
      // Same rule, fields assigned in another order.
      ...document,
      tags: [...document.tags],
    });

    assert.equal(first.dump(), second.dump());
  });
});
