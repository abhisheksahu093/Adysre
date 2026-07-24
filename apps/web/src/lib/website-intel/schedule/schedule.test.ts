import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ScanRecord, ScanStore } from '../history/types';
import type { ScanResult } from '../types';
import { isCadence } from './types';
import { isDue, nextRun } from './cadence';
import { MemoryScheduleStore } from './memory-store';
import { runDueSchedules } from './runner';
import { parseScheduleInput } from './validate';

/**
 * Schedule tests. Deterministic: the store takes an injected id factory, and
 * every function that needs "now" takes it as an argument, so nothing depends on
 * the wall clock or the network. The runner is driven with fake scan/record
 * functions, so the full sweep is exercised in-process.
 */

function counter(): () => string {
  let n = 0;
  return () => `sch-${(n += 1)}`;
}

const AT = (iso: string) => new Date(iso);

/** Tenants used throughout; every store call is scoped to one of these. */
const T1 = 'tenant-1';
const T2 = 'tenant-2';

describe('cadence', () => {
  it('computes the next run per cadence', () => {
    const from = AT('2026-07-24T00:00:00.000Z');
    assert.equal(nextRun('hourly', from), '2026-07-24T01:00:00.000Z');
    assert.equal(nextRun('daily', from), '2026-07-25T00:00:00.000Z');
    assert.equal(nextRun('weekly', from), '2026-07-31T00:00:00.000Z');
  });

  it('is due only when active and past nextRunAt', () => {
    const base = { id: 'x', tenantId: T1, url: 'https://a.com/', cadence: 'daily' as const, createdAt: '', lastRunAt: null, lastScanId: null };
    const now = AT('2026-07-24T12:00:00.000Z');
    assert.equal(isDue({ ...base, active: true, nextRunAt: '2026-07-24T11:00:00.000Z' }, now), true);
    assert.equal(isDue({ ...base, active: true, nextRunAt: '2026-07-24T13:00:00.000Z' }, now), false);
    assert.equal(isDue({ ...base, active: false, nextRunAt: '2026-07-24T11:00:00.000Z' }, now), false);
  });

  it('validates cadence values', () => {
    assert.ok(isCadence('hourly') && isCadence('daily') && isCadence('weekly'));
    assert.equal(isCadence('monthly'), false);
  });
});

describe('parseScheduleInput', () => {
  it('normalises the url and requires a valid cadence', () => {
    const input = parseScheduleInput({ url: 'example.com', cadence: 'daily' });
    assert.equal(input.url, 'https://example.com/');
    assert.equal(input.cadence, 'daily');
  });
  it('rejects a bad cadence and a blocked url', () => {
    assert.throws(() => parseScheduleInput({ url: 'example.com', cadence: 'monthly' }));
    assert.throws(() => parseScheduleInput({ url: 'http://127.0.0.1/', cadence: 'daily' }));
  });
});

describe('MemoryScheduleStore', () => {
  it('creates with a computed nextRunAt and supports CRUD', async () => {
    const store = new MemoryScheduleStore(counter());
    const created = await store.create(T1, { url: 'https://a.com/', cadence: 'hourly' }, AT('2026-07-24T00:00:00.000Z'));
    assert.equal(created.id, 'sch-1');
    assert.equal(created.tenantId, T1);
    assert.equal(created.active, true);
    assert.equal(created.nextRunAt, '2026-07-24T01:00:00.000Z');

    assert.equal((await store.get(T1, 'sch-1'))?.url, 'https://a.com/');
    await store.update(T1, 'sch-1', { active: false });
    assert.equal((await store.get(T1, 'sch-1'))?.active, false);
    assert.equal((await store.list(T1)).length, 1);
    assert.equal(await store.remove(T1, 'sch-1'), true);
    assert.equal(await store.remove(T1, 'sch-1'), false);
    assert.equal((await store.list(T1)).length, 0);
  });

  it('isolates schedules by tenant; listAll spans them', async () => {
    const store = new MemoryScheduleStore(counter());
    const mine = await store.create(T1, { url: 'https://a.com/', cadence: 'daily' });
    await store.create(T2, { url: 'https://b.com/', cadence: 'daily' });

    assert.deepEqual((await store.list(T1)).map((s) => s.id), [mine.id]);
    // Another tenant can neither read, update, nor remove it by id.
    assert.equal(await store.get(T2, mine.id), null);
    assert.equal(await store.update(T2, mine.id, { active: false }), null);
    assert.equal(await store.remove(T2, mine.id), false);
    assert.equal((await store.get(T1, mine.id))?.active, true);
    // The cron sweep sees every tenant's schedules.
    assert.equal((await store.listAll()).length, 2);
  });
});

/** A ScanStore stub good enough for the runner (only save/record path is used). */
function stubScanStore(): ScanStore {
  return {
    async save() {
      throw new Error('unused');
    },
    async get() {
      return null;
    },
    async list() {
      return [];
    },
  };
}

const fakeResult: ScanResult = {
  url: 'https://a.com/', finalUrl: 'https://a.com/', fetchedAt: '', status: 200, timingMs: 0, redirects: [],
  overallScore: 90, categories: [], findings: [], technologies: [],
  metrics: { htmlBytes: 0, images: 0, scripts: 0, stylesheets: 0, requestsBlockingRender: 0, headings: 0, links: 0, externalLinks: 0, jsonLdBlocks: 0 },
};

describe('runDueSchedules', () => {
  it('runs due schedules, skips others, and advances them', async () => {
    const store = new MemoryScheduleStore(counter());
    const now = AT('2026-07-24T12:00:00.000Z');

    // Due (created an hour ago at hourly cadence ⇒ nextRunAt is now-ish, past).
    const due = await store.create(T1, { url: 'https://due.com/', cadence: 'hourly' }, AT('2026-07-24T10:30:00.000Z'));
    // Not due yet (weekly, just created).
    await store.create(T1, { url: 'https://later.com/', cadence: 'weekly' }, AT('2026-07-24T11:59:00.000Z'));
    // Paused, even though it would be due.
    const paused = await store.create(T1, { url: 'https://paused.com/', cadence: 'hourly' }, AT('2026-07-24T10:00:00.000Z'));
    await store.update(T1, paused.id, { active: false });

    let scanCalls = 0;
    const summary = await runDueSchedules({
      schedules: store,
      scanStore: stubScanStore(),
      runScan: async () => {
        scanCalls += 1;
        return fakeResult;
      },
      recordScan: async () => ({ record: { id: `scan-${scanCalls}` } as ScanRecord, comparison: null }),
      now,
    });

    assert.deepEqual(summary.ran, [due.id]);
    assert.equal(summary.failed.length, 0);
    assert.equal(summary.skipped, 2);
    assert.equal(scanCalls, 1);

    const advanced = await store.get(T1, due.id);
    assert.equal(advanced?.lastRunAt, now.toISOString());
    assert.equal(advanced?.nextRunAt, '2026-07-24T13:00:00.000Z');
    assert.equal(advanced?.lastScanId, 'scan-1');
  });

  it('advances a schedule even when its scan fails', async () => {
    const store = new MemoryScheduleStore(counter());
    const now = AT('2026-07-24T12:00:00.000Z');
    const s = await store.create(T1, { url: 'https://broken.com/', cadence: 'daily' }, AT('2026-07-23T00:00:00.000Z'));

    const summary = await runDueSchedules({
      schedules: store,
      scanStore: stubScanStore(),
      runScan: async () => {
        throw new Error('unreachable');
      },
      recordScan: async () => ({ record: { id: 'x' } as ScanRecord, comparison: null }),
      now,
    });

    assert.deepEqual(summary.failed, [s.id]);
    assert.equal(summary.ran.length, 0);
    const advanced = await store.get(T1, s.id);
    assert.equal(advanced?.nextRunAt, '2026-07-25T12:00:00.000Z'); // advanced despite failure
    assert.equal(advanced?.lastScanId, null); // no scan id recorded
  });
});
