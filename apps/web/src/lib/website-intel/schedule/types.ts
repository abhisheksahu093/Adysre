/**
 * Scheduled scans - the model and its storage seam.
 *
 * A schedule is a standing instruction: rescan this URL every hour/day/week.
 * Like scan history, it lives behind a store interface so the backend is
 * swappable (memory, file, later Prisma). The recurring TRIGGER is separate: a
 * cron job or a BullMQ repeatable calls the "run due" runner on a tick; this
 * module owns the data and the due arithmetic, not the clock that fires it.
 */

export const CADENCES = ['hourly', 'daily', 'weekly'] as const;
export type Cadence = (typeof CADENCES)[number];

export function isCadence(value: string): value is Cadence {
  return (CADENCES as readonly string[]).includes(value);
}

/** A stored schedule. */
export interface ScheduleRecord {
  id: string;
  /** Owning organization. Every read/write is partitioned by it; the cron
   * sweep is the one cross-tenant reader (see {@link ScheduleStore.listAll}). */
  tenantId: string;
  url: string;
  cadence: Cadence;
  /** Paused schedules are kept but never run. */
  active: boolean;
  createdAt: string;
  /** ISO time the schedule last ran, or null if it never has. */
  lastRunAt: string | null;
  /** ISO time the schedule is next due. */
  nextRunAt: string;
  /** Id of the scan produced by the last run, for a link into history. */
  lastScanId: string | null;
}

/** Validated input to create a schedule. */
export interface ScheduleInput {
  url: string;
  cadence: Cadence;
}

/** Fields a run (or a pause/resume) updates on a schedule. */
export interface SchedulePatch {
  active?: boolean;
  lastRunAt?: string | null;
  nextRunAt?: string;
  lastScanId?: string | null;
}

/**
 * The persistence contract for schedules.
 *
 * All per-user operations are scoped by `tenantId` (resolved from the session):
 * a schedule owned by another org is invisible to `get`/`update`/`remove` and
 * absent from `list`. `listAll` is the deliberate exception - the cron sweep has
 * no user session and must see every tenant's due schedules - so it is never
 * reachable from a request handler, only the runner.
 */
export interface ScheduleStore {
  create(tenantId: string, input: ScheduleInput, now?: Date): Promise<ScheduleRecord>;
  get(tenantId: string, id: string): Promise<ScheduleRecord | null>;
  list(tenantId: string): Promise<ScheduleRecord[]>;
  update(tenantId: string, id: string, patch: SchedulePatch): Promise<ScheduleRecord | null>;
  remove(tenantId: string, id: string): Promise<boolean>;
  /** Every tenant's schedules, for the cross-tenant cron sweep only. */
  listAll(): Promise<ScheduleRecord[]>;
}
