import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CategoryScore, ScanResult } from '../types';
import { MemoryScanStore } from './memory-store';
import { compareScans } from './compare';
import { recordScan } from './service';
import { toSummary } from './keys';

/**
 * History tests. All in-memory and deterministic: the store takes an injected
 * id factory and `save`/`recordScan` take an injected clock, so ids and
 * timestamps are fixed and nothing touches the disk or the network.
 */

/** A minimal but valid ScanResult for a given host and shape. */
function makeResult(
  finalUrl: string,
  overall: number,
  categories: Array<[CategoryScore['category'], number]>,
  findingIds: string[],
): ScanResult {
  return {
    url: finalUrl,
    finalUrl,
    fetchedAt: '2026-07-24T00:00:00.000Z',
    status: 200,
    timingMs: 100,
    redirects: [],
    overallScore: overall,
    categories: categories.map(([category, score]) => ({ category, score, findings: [] })),
    findings: findingIds.map((ruleId) => ({
      ruleId,
      category: 'seo',
      severity: 'minor',
      description: ruleId,
      fix: 'fix',
      impact: 'impact',
    })),
    technologies: [],
    metrics: {
      htmlBytes: 0,
      images: 0,
      scripts: 0,
      stylesheets: 0,
      requestsBlockingRender: 0,
      headings: 0,
      links: 0,
      externalLinks: 0,
      jsonLdBlocks: 0,
    },
  };
}

function counter(): () => string {
  let n = 0;
  return () => `id-${(n += 1)}`;
}

/** Tenants used throughout; every store call is scoped to one of these. */
const T1 = 'tenant-1';
const T2 = 'tenant-2';

describe('MemoryScanStore', () => {
  it('stamps id, tenantId, createdAt and host on save', async () => {
    const store = new MemoryScanStore(counter());
    const record = await store.save(T1, makeResult('https://a.com/', 90, [['seo', 90]], []), new Date('2026-07-24T10:00:00Z'));
    assert.equal(record.id, 'id-1');
    assert.equal(record.tenantId, T1);
    assert.equal(record.createdAt, '2026-07-24T10:00:00.000Z');
    assert.equal(record.host, 'a.com');
  });

  it('lists newest first and fetches by id', async () => {
    const store = new MemoryScanStore(counter());
    await store.save(T1, makeResult('https://a.com/', 80, [], []));
    await store.save(T1, makeResult('https://a.com/', 85, [], []));
    const all = await store.list(T1);
    assert.deepEqual(all.map((r) => r.id), ['id-2', 'id-1']);
    assert.equal((await store.get(T1, 'id-1'))?.id, 'id-1');
    assert.equal(await store.get(T1, 'missing'), null);
  });

  it('filters by host and honours the limit', async () => {
    const store = new MemoryScanStore(counter());
    await store.save(T1, makeResult('https://a.com/', 80, [], []));
    await store.save(T1, makeResult('https://b.com/', 80, [], []));
    await store.save(T1, makeResult('https://a.com/', 80, [], []));
    assert.equal((await store.list(T1, { host: 'a.com' })).length, 2);
    assert.equal((await store.list(T1, { limit: 1 })).length, 1);
  });

  it('isolates records by tenant', async () => {
    const store = new MemoryScanStore(counter());
    const mine = await store.save(T1, makeResult('https://a.com/', 80, [], []));
    await store.save(T2, makeResult('https://a.com/', 80, [], []));

    // Each tenant sees only its own history...
    assert.deepEqual((await store.list(T1)).map((r) => r.id), [mine.id]);
    assert.equal((await store.list(T2)).length, 1);
    // ...and cannot fetch the other's record by id (the IDOR guard).
    assert.equal(await store.get(T2, mine.id), null);
    assert.equal((await store.get(T1, mine.id))?.id, mine.id);
  });
});

describe('toSummary', () => {
  it('projects a record to the light shape', async () => {
    const store = new MemoryScanStore(counter());
    const record = await store.save(T1, makeResult('https://a.com/', 77, [], ['x', 'y']));
    const summary = toSummary(record);
    assert.equal(summary.overallScore, 77);
    assert.equal(summary.findings, 2);
    assert.equal(summary.host, 'a.com');
    assert.equal('result' in summary, false);
  });
});

describe('compareScans', () => {
  it('computes overall/category deltas and finding churn', () => {
    const previous = makeResult('https://a.com/', 70, [['seo', 60], ['security', 80]], ['a', 'b']);
    const current = makeResult('https://a.com/', 82, [['seo', 80], ['security', 80]], ['b', 'c']);
    const cmp = compareScans(previous, current, 'prev-id', '2026-07-24T00:00:00.000Z');
    assert.equal(cmp.overallDelta, 12);
    assert.equal(cmp.categoryDeltas.find((d) => d.category === 'seo')?.delta, 20);
    assert.equal(cmp.categoryDeltas.find((d) => d.category === 'security')?.delta, 0);
    assert.deepEqual(cmp.resolved, ['a']);
    assert.deepEqual(cmp.introduced, ['c']);
    assert.equal(cmp.previousId, 'prev-id');
  });
});

describe('recordScan', () => {
  it('returns no comparison for the first scan of a host, then a diff', async () => {
    const store = new MemoryScanStore(counter());

    const first = await recordScan(store, T1, makeResult('https://a.com/', 70, [['seo', 60]], ['a']));
    assert.equal(first.comparison, null);
    assert.equal(first.record.id, 'id-1');

    const second = await recordScan(store, T1, makeResult('https://a.com/', 90, [['seo', 90]], []));
    assert.equal(second.comparison?.overallDelta, 20);
    assert.deepEqual(second.comparison?.resolved, ['a']);
    assert.equal(second.comparison?.previousId, 'id-1');
  });

  it('does not compare across different hosts', async () => {
    const store = new MemoryScanStore(counter());
    await recordScan(store, T1, makeResult('https://a.com/', 70, [], []));
    const other = await recordScan(store, T1, makeResult('https://b.com/', 90, [], []));
    assert.equal(other.comparison, null);
  });

  it('does not compare across tenants for the same host', async () => {
    const store = new MemoryScanStore(counter());
    await recordScan(store, T1, makeResult('https://a.com/', 70, [], []));
    // Same host, different tenant → treated as that tenant's first scan.
    const other = await recordScan(store, T2, makeResult('https://a.com/', 90, [], []));
    assert.equal(other.comparison, null);
  });
});
