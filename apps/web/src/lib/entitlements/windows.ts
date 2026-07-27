import type { UsageWindow } from './types';

/**
 * Window arithmetic: where a counting period starts, and when it resets.
 *
 * Pure, with the clock passed in, which is what makes every boundary case
 * testable. A month boundary, a leap day and a rolling week are all one-line
 * assertions here and would otherwise be untestable without waiting.
 *
 * Calendar windows are evaluated in **UTC**. A tenant-local day would need a
 * timezone per workspace and would make "resets at" ambiguous twice a year
 * during DST. Revisit when a tenant asks; not before.
 */

const SECOND = 1000;

/**
 * The instant a window began. Events at or after this count.
 *
 * `null` means "count everything": lifetime totals, and stock ceilings, which
 * have no time component at all.
 */
export function windowStart(
  kind: UsageWindow,
  windowSeconds: number | null,
  now: Date,
): Date | null {
  switch (kind) {
    case 'none':
    case 'lifetime':
      return null;

    case 'rolling': {
      // A rolling window with no length would silently count over all time and
      // never deny anything, which looks exactly like a working limit. The
      // database refuses such a row; this refuses it again in case one is
      // constructed in code.
      if (!windowSeconds || windowSeconds <= 0) {
        throw new Error('A rolling window requires a positive windowSeconds.');
      }
      return new Date(now.getTime() - windowSeconds * SECOND);
    }

    case 'day':
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    case 'week': {
      // ISO weeks start on Monday. getUTCDay() is 0 for Sunday, so Sunday is
      // six days into its week rather than the start of the next one.
      const daysSinceMonday = (now.getUTCDay() + 6) % 7;
      const monday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMonday),
      );
      return monday;
    }

    case 'month':
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }
}

/**
 * When the window next frees capacity.
 *
 * For calendar windows this is the period boundary. For a rolling window it is
 * when the OLDEST counted event falls out, which is the moment one unit comes
 * back rather than the moment the whole quota resets. That is the honest thing
 * to show: telling someone to wait a full week when a slot frees in an hour
 * loses a user for no reason.
 *
 * @param oldestInWindow - the earliest event still counted, for rolling windows
 */
export function windowResetsAt(
  kind: UsageWindow,
  windowSeconds: number | null,
  now: Date,
  oldestInWindow?: Date | null,
): Date | null {
  switch (kind) {
    case 'none':
    case 'lifetime':
      // Nothing ever comes back. The only way forward is an upgrade, and the UI
      // should say so rather than imply waiting will help.
      return null;

    case 'rolling': {
      if (!windowSeconds || windowSeconds <= 0) return null;
      if (!oldestInWindow) return null;
      return new Date(oldestInWindow.getTime() + windowSeconds * SECOND);
    }

    case 'day':
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

    case 'week': {
      const daysSinceMonday = (now.getUTCDay() + 6) % 7;
      return new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - daysSinceMonday + 7,
        ),
      );
    }

    case 'month':
      // Day 1 of the next month. Date.UTC normalises month 12 to January, so
      // December needs no special case.
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  }
}

/**
 * Of several limits, the one a user should be told about.
 *
 * A feature can carry more than one (3 per day AND 5 per week). When several
 * deny, the one that frees SOONEST is the useful answer: it is the shortest
 * wait, and reporting the weekly cap when the daily one clears in an hour is
 * true but useless.
 *
 * A limit that never resets sorts last, because "upgrade" is a worse answer to
 * lead with than "wait an hour" whenever both are available.
 */
export function soonestReset<T extends { resetsAt: Date | null }>(limits: T[]): T | null {
  if (limits.length === 0) return null;

  const resetting = limits.filter((limit) => limit.resetsAt !== null);
  if (resetting.length === 0) return limits[0] ?? null;

  return resetting.reduce((soonest, limit) =>
    limit.resetsAt!.getTime() < soonest.resetsAt!.getTime() ? limit : soonest,
  );
}
