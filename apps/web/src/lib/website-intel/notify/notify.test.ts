import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ScanResult } from '../types';
import type { ScanRecord } from '../history/types';
import type { NotificationChannel, NotifyEvent } from './types';
import { eventFromScan } from './event';
import { discordPayload, emailPayload, slackPayload, summaryLine, webhookPayload } from './format';
import { HttpNotifier } from './notifier';
import { dispatchNotifications } from './dispatch';
import { MemoryChannelStore } from './memory-store';
import { parseChannelInput } from './validate';
import { MemoryScheduleStore } from '../schedule/memory-store';
import { runDueSchedules } from '../schedule/runner';

/**
 * Notification tests. The HTTP notifier takes an injected fetch, so sends are
 * asserted with a stub and never hit the network. Formatters, the event builder
 * and dispatch are pure. Email is expected to report "not configured" rather
 * than send.
 */

const EVENT: NotifyEvent = {
  kind: 'scan.completed',
  url: 'https://a.com/',
  scanId: 's1',
  overallScore: 84,
  overallDelta: -3,
  findings: 5,
  critical: 1,
  serious: 2,
  at: '2026-07-24T00:00:00.000Z',
};

const T1 = 'tenant-1';
const T2 = 'tenant-2';

function channel(over: Partial<NotificationChannel>): NotificationChannel {
  return { id: 'c1', tenantId: T1, type: 'webhook', target: 'https://hooks.example.com/x', active: true, createdAt: '', ...over };
}

/** A fetch stub that records calls and returns a chosen status. */
function stubFetch(status = 200) {
  const calls: Array<{ url: string; body: unknown }> = [];
  const fn = (async (url: string | URL, init?: RequestInit) => {
    calls.push({ url: String(url), body: init?.body ? JSON.parse(String(init.body)) : undefined });
    return { ok: status >= 200 && status < 300, status } as Response;
  }) as unknown as typeof fetch;
  return { fn, calls };
}

describe('format', () => {
  it('builds a summary with the score delta', () => {
    assert.match(summaryLine(EVENT), /a\.com\/ scored 84\/100 \(-3\)/);
    assert.match(summaryLine(EVENT), /1 critical, 2 serious, 5 findings/);
  });
  it('shapes each channel payload', () => {
    assert.equal(slackPayload(EVENT).text, summaryLine(EVENT));
    assert.equal(discordPayload(EVENT).content, summaryLine(EVENT));
    assert.equal(webhookPayload(EVENT).scanId, 's1');
    assert.match(emailPayload(EVENT).subject, /scored 84\/100/);
  });
});

describe('eventFromScan', () => {
  it('counts critical/serious and reads the delta', () => {
    const result = {
      finalUrl: 'https://a.com/',
      overallScore: 70,
      findings: [
        { ruleId: 'x', category: 'security', severity: 'critical', description: '', fix: '', impact: '' },
        { ruleId: 'y', category: 'seo', severity: 'serious', description: '', fix: '', impact: '' },
        { ruleId: 'z', category: 'seo', severity: 'minor', description: '', fix: '', impact: '' },
      ],
    } as unknown as ScanResult;
    const event = eventFromScan(result, 'sid', { overallDelta: 12 } as never, new Date('2026-07-24T00:00:00Z'));
    assert.equal(event.critical, 1);
    assert.equal(event.serious, 1);
    assert.equal(event.findings, 3);
    assert.equal(event.overallDelta, 12);
    assert.equal(event.scanId, 'sid');
  });
});

describe('HttpNotifier', () => {
  it('posts the slack payload and reports ok on 2xx', async () => {
    const { fn, calls } = stubFetch(200);
    const result = await new HttpNotifier(fn).send(channel({ type: 'slack' }), EVENT);
    assert.equal(result.ok, true);
    assert.equal(result.status, 200);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0]?.body, { text: summaryLine(EVENT) });
  });

  it('reports not-ok on a non-2xx', async () => {
    const { fn } = stubFetch(500);
    assert.equal((await new HttpNotifier(fn).send(channel({}), EVENT)).ok, false);
  });

  it('never sends email, reporting not-configured', async () => {
    const { fn, calls } = stubFetch(200);
    const result = await new HttpNotifier(fn).send(channel({ type: 'email', target: 'a@b.com' }), EVENT);
    assert.equal(result.ok, false);
    assert.equal(result.error, 'email_not_configured');
    assert.equal(calls.length, 0);
  });

  it('refuses a blocked target host', async () => {
    const { fn, calls } = stubFetch(200);
    const result = await new HttpNotifier(fn).send(channel({ target: 'http://127.0.0.1/hook' }), EVENT);
    assert.equal(result.ok, false);
    assert.equal(result.error, 'blocked_target');
    assert.equal(calls.length, 0);
  });
});

describe('dispatchNotifications', () => {
  it('sends only to active channels', async () => {
    const { fn, calls } = stubFetch(200);
    const results = await dispatchNotifications(
      [channel({ id: 'a' }), channel({ id: 'b', active: false }), channel({ id: 'c', type: 'discord' })],
      new HttpNotifier(fn),
      EVENT,
    );
    assert.equal(results.length, 2);
    assert.equal(calls.length, 2);
  });
});

describe('parseChannelInput', () => {
  it('accepts a webhook url (SSRF-checked) and an email', () => {
    assert.deepEqual(parseChannelInput({ type: 'webhook', target: 'hooks.example.com/x' }), {
      type: 'webhook',
      target: 'https://hooks.example.com/x',
    });
    assert.deepEqual(parseChannelInput({ type: 'email', target: 'me@site.com' }), { type: 'email', target: 'me@site.com' });
  });
  it('rejects bad type, blocked url and bad email', () => {
    assert.throws(() => parseChannelInput({ type: 'sms', target: 'x' }));
    assert.throws(() => parseChannelInput({ type: 'webhook', target: 'http://127.0.0.1/x' }));
    assert.throws(() => parseChannelInput({ type: 'email', target: 'not-an-email' }));
  });
});

describe('MemoryChannelStore', () => {
  it('creates active channels and supports CRUD', async () => {
    let n = 0;
    const store = new MemoryChannelStore(() => `ch-${(n += 1)}`);
    const created = await store.create(T1, { type: 'slack', target: 'https://hooks.slack.com/x' });
    assert.equal(created.id, 'ch-1');
    assert.equal(created.tenantId, T1);
    assert.equal(created.active, true);
    assert.equal((await store.list(T1)).length, 1);
    assert.equal(await store.remove(T1, 'ch-1'), true);
    assert.equal((await store.list(T1)).length, 0);
  });

  it('isolates channels by tenant', async () => {
    let n = 0;
    const store = new MemoryChannelStore(() => `ch-${(n += 1)}`);
    const mine = await store.create(T1, { type: 'slack', target: 'https://hooks.slack.com/x' });
    await store.create(T2, { type: 'slack', target: 'https://hooks.slack.com/y' });

    assert.deepEqual((await store.list(T1)).map((c) => c.id), [mine.id]);
    assert.equal(await store.get(T2, mine.id), null);
    assert.equal(await store.remove(T2, mine.id), false);
    assert.equal((await store.get(T1, mine.id))?.id, mine.id);
  });
});

describe('runner notify hook', () => {
  it('fires the notify event, carrying the schedule tenant, when a due schedule runs', async () => {
    const schedules = new MemoryScheduleStore(() => 'sch-1');
    await schedules.create(T1, { url: 'https://a.com/', cadence: 'hourly' }, new Date('2026-07-24T10:00:00Z'));

    const events: Array<{ tenantId: string; event: NotifyEvent }> = [];
    await runDueSchedules({
      schedules,
      scanStore: { async save() { throw new Error('x'); }, async get() { return null; }, async list() { return []; } },
      runScan: async () =>
        ({ finalUrl: 'https://a.com/', overallScore: 88, findings: [] } as unknown as ScanResult),
      recordScan: async () => ({ record: { id: 'scan-1' } as ScanRecord, comparison: null }),
      notify: async (tenantId, event) => {
        events.push({ tenantId, event });
      },
      now: new Date('2026-07-24T12:00:00Z'),
    });

    assert.equal(events.length, 1);
    assert.equal(events[0]?.tenantId, T1);
    assert.equal(events[0]?.event.url, 'https://a.com/');
    assert.equal(events[0]?.event.scanId, 'scan-1');
    assert.equal(events[0]?.event.overallScore, 88);
  });
});
