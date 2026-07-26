import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSlug } from './slug';
import { captureScan } from './scan-capture';
import { analyzeScans } from './analytics';
import { MemoryQrStore } from '../store/memory-store';
import { DEFAULT_DESIGN } from '../designer';
import type { QrScanRecord } from '../store/types';

/**
 * Dynamic-QR tests: slug shape, the offline scan parser, the analytics buckets,
 * and tenant isolation of the store - the parts a scanner and a second org
 * exercise, all deterministic (injected id/slug factories, an injected clock).
 */

describe('slug', () => {
  it('accepts valid slugs and rejects junk', () => {
    assert.equal(isSlug('Ab3Xy9Qp'), true);
    assert.equal(isSlug('bad slug'), false);
    assert.equal(isSlug('has/slash'), false);
    assert.equal(isSlug('0OIl'), false); // ambiguous chars are excluded
  });
});

describe('captureScan', () => {
  const headers = (h: Record<string, string>) => new Headers(h);
  const url = new URL('https://app.test/q/abc?utm_source=poster&utm_medium=print');

  it('parses an iPhone Safari scan with UTM and language region', () => {
    const ctx = captureScan(
      url,
      headers({
        'user-agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'accept-language': 'en-GB,en;q=0.9',
        referer: 'https://l.instagram.com/path',
      }),
    );
    assert.equal(ctx.device, 'mobile');
    assert.equal(ctx.os, 'iOS');
    assert.equal(ctx.browser, 'Safari');
    assert.equal(ctx.country, 'GB');
    assert.equal(ctx.referrer, 'l.instagram.com');
    assert.deepEqual(ctx.utm, { source: 'poster', medium: 'print' });
  });

  it('classifies Android tablet Chrome and a missing UA', () => {
    const tablet = captureScan(
      url,
      headers({ 'user-agent': 'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 Chrome/120 Safari/537.36' }),
    );
    assert.equal(tablet.device, 'tablet');
    assert.equal(tablet.os, 'Android');
    assert.equal(tablet.browser, 'Chrome');

    const empty = captureScan(url, headers({}));
    assert.equal(empty.device, null);
    assert.equal(empty.browser, null);
  });
});

describe('analyzeScans', () => {
  const now = new Date('2026-07-24T12:00:00.000Z');
  const scan = (over: Partial<QrScanRecord>): QrScanRecord => ({
    id: 'x',
    tenantId: 't',
    qrCodeId: 'c',
    device: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    referrer: null,
    country: 'US',
    city: null,
    utm: null,
    scannedAt: now.toISOString(),
    ...over,
  });

  it('buckets by time window and tallies dimensions', () => {
    const scans = [
      scan({}),
      scan({ scannedAt: '2026-07-24T01:00:00.000Z', browser: 'Chrome' }), // today
      scan({ scannedAt: '2026-07-20T10:00:00.000Z', device: 'desktop' }), // this week
      scan({ scannedAt: '2026-07-01T10:00:00.000Z' }), // this month, not week
      scan({ scannedAt: '2026-05-01T10:00:00.000Z' }), // older
    ];
    const a = analyzeScans(scans, now);
    assert.equal(a.total, 5);
    assert.equal(a.today, 2);
    assert.equal(a.week, 3);
    assert.equal(a.month, 4);
    assert.equal(a.byBrowser.find((b) => b.label === 'Safari')?.count, 4);
    assert.equal(a.byDevice.find((d) => d.label === 'desktop')?.count, 1);
    assert.equal(a.timeline.length, 14);
    assert.equal(a.timeline.at(-1)?.count, 2); // today's bucket
  });
});

describe('MemoryQrStore', () => {
  const design = DEFAULT_DESIGN;
  const input = (over = {}) => ({
    type: 'url',
    name: 'Site',
    payload: { url: 'https://a.com' },
    design,
    targetUrl: 'https://a.com',
    ...over,
  });

  function store() {
    let n = 0;
    let s = 0;
    return new MemoryQrStore(
      () => `id-${(n += 1)}`,
      () => `slug-${(s += 1)}`,
    );
  }

  it('creates with a unique slug and isolates by tenant', async () => {
    const db = store();
    const a = await db.create('tenant-a', input());
    await db.create('tenant-b', input());
    assert.equal(a.slug, 'slug-1');
    assert.equal((await db.list('tenant-a')).length, 1);
    assert.equal((await db.list('tenant-b')).length, 1);
    // Tenant B cannot read, update, or delete A's code by id.
    assert.equal(await db.get('tenant-b', a.id), null);
    assert.equal(await db.update('tenant-b', a.id, { favorite: true }), null);
    assert.equal(await db.remove('tenant-b', a.id), false);
    assert.equal((await db.get('tenant-a', a.id))?.favorite, false);
  });

  it('resolves a slug cross-tenant (public redirect) and records scans', async () => {
    const db = store();
    const a = await db.create('tenant-a', input());
    const found = await db.findBySlug(a.slug);
    assert.equal(found?.id, a.id);

    await db.recordScan(a.id, 'tenant-a', {
      device: 'mobile',
      browser: 'Safari',
      os: 'iOS',
      referrer: null,
      country: 'US',
      city: null,
      utm: null,
    });
    assert.equal((await db.listScans('tenant-a', a.id)).length, 1);
    // Deleting the code cascades its scans.
    await db.remove('tenant-a', a.id);
    assert.equal((await db.listScans('tenant-a', a.id)).length, 0);
  });
});
