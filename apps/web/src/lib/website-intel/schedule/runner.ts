import type { ScanInput, ScanResult } from '../types';
import type { ScanComparison, ScanRecord, ScanStore } from '../history/types';
import type { NotifyEvent } from '../notify/types';
import { eventFromScan } from '../notify/event';
import type { ScheduleStore } from './types';
import { isDue, nextRun } from './cadence';

/**
 * Run every schedule that is due.
 *
 * This is the body a cron tick or a BullMQ repeatable calls; it is NOT a timer
 * itself. Kept dependency-injected - the scan runner, the history recorder and
 * the clock all come in as arguments - so the whole thing tests with fakes and
 * no network: assert that due schedules run, others are skipped, and each ran
 * schedule advances to its next slot.
 *
 * A scan that throws does not abort the sweep or lose the schedule; the schedule
 * is still advanced so one flaky run cannot wedge it forever.
 */
export interface RunDueDeps {
  schedules: ScheduleStore;
  scanStore: ScanStore;
  runScan: (input: ScanInput) => Promise<ScanResult>;
  recordScan: (
    store: ScanStore,
    tenantId: string,
    result: ScanResult,
    now?: Date,
  ) => Promise<{ record: ScanRecord; comparison: ScanComparison | null }>;
  /** Optional: fired once per successful run with the owning tenant and event. */
  notify?: (tenantId: string, event: NotifyEvent) => Promise<void>;
  now?: Date;
}

export interface RunDueSummary {
  /** Schedule ids that ran this sweep. */
  ran: string[];
  /** Schedule ids whose scan failed but were still advanced. */
  failed: string[];
  /** How many schedules were not due (or paused). */
  skipped: number;
}

export async function runDueSchedules(deps: RunDueDeps): Promise<RunDueSummary> {
  const now = deps.now ?? new Date();
  // The sweep is cross-tenant: it runs due schedules for every org. Each scan is
  // recorded and each notification dispatched under that schedule's own tenant,
  // so results never leak from one org's schedule into another's.
  const all = await deps.schedules.listAll();

  const ran: string[] = [];
  const failed: string[] = [];

  for (const schedule of all) {
    if (!isDue(schedule, now)) continue;

    let lastScanId = schedule.lastScanId;
    try {
      const result = await deps.runScan({ url: schedule.url });
      const { record, comparison } = await deps.recordScan(
        deps.scanStore,
        schedule.tenantId,
        result,
        now,
      );
      lastScanId = record.id;
      ran.push(schedule.id);
      if (deps.notify) {
        // Notification failures never fail the run.
        try {
          await deps.notify(schedule.tenantId, eventFromScan(result, record.id, comparison, now));
        } catch {
          /* best-effort. */
        }
      }
    } catch {
      failed.push(schedule.id);
    }

    // Advance regardless of success, so a broken target cannot jam the queue.
    await deps.schedules.update(schedule.tenantId, schedule.id, {
      lastRunAt: now.toISOString(),
      nextRunAt: nextRun(schedule.cadence, now),
      lastScanId,
    });
  }

  return { ran, failed, skipped: all.length - ran.length - failed.length };
}
