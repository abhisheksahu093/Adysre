import type { Cadence, ScheduleRecord } from './types';

/**
 * Cadence arithmetic. Pure and clock-injected, so due-calculation is fully
 * testable: given a schedule and a "now", is it due, and when does it run next.
 */

const CADENCE_MS: Record<Cadence, number> = {
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

/** The next run time for a cadence, measured from `from`. */
export function nextRun(cadence: Cadence, from: Date): string {
  return new Date(from.getTime() + CADENCE_MS[cadence]).toISOString();
}

/** True when an active schedule's next run is at or before now. */
export function isDue(schedule: ScheduleRecord, now: Date): boolean {
  return schedule.active && new Date(schedule.nextRunAt).getTime() <= now.getTime();
}
