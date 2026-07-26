import type { QrScanRecord } from '../store/types';

/**
 * Scan analytics - pure aggregation over stored scan events. Takes `now` as an
 * argument (never reads the clock) so the same input always yields the same
 * output and the buckets are testable.
 */

export interface Breakdown {
  label: string;
  count: number;
}

export interface ScanAnalytics {
  total: number;
  today: number;
  week: number;
  month: number;
  byDevice: Breakdown[];
  byBrowser: Breakdown[];
  byOs: Breakdown[];
  byCountry: Breakdown[];
  byReferrer: Breakdown[];
  /** Last 14 days, oldest first, for a sparkline. */
  timeline: Array<{ date: string; count: number }>;
}

function tally(values: Array<string | null>): Breakdown[] {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v ?? 'Unknown';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

const DAY_MS = 86_400_000;

export function analyzeScans(scans: QrScanRecord[], now: Date): ScanAnalytics {
  const nowMs = now.getTime();
  // UTC day boundary: scan timestamps are UTC ISO strings, so bucketing in UTC
  // keeps `today` and the timeline consistent regardless of server timezone.
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();

  let today = 0;
  let week = 0;
  let month = 0;
  const dayBuckets = new Map<string, number>();

  for (const scan of scans) {
    const t = new Date(scan.scannedAt).getTime();
    if (t >= todayMs) today += 1;
    if (nowMs - t < 7 * DAY_MS) week += 1;
    if (nowMs - t < 30 * DAY_MS) month += 1;
    const day = scan.scannedAt.slice(0, 10);
    dayBuckets.set(day, (dayBuckets.get(day) ?? 0) + 1);
  }

  const timeline: Array<{ date: string; count: number }> = [];
  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date(todayMs - i * DAY_MS).toISOString().slice(0, 10);
    timeline.push({ date, count: dayBuckets.get(date) ?? 0 });
  }

  return {
    total: scans.length,
    today,
    week,
    month,
    byDevice: tally(scans.map((s) => s.device)),
    byBrowser: tally(scans.map((s) => s.browser)),
    byOs: tally(scans.map((s) => s.os)),
    byCountry: tally(scans.map((s) => s.country)),
    byReferrer: tally(scans.map((s) => s.referrer)),
    timeline,
  };
}
