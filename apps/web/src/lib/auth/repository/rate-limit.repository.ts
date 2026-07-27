import 'server-only';
import { prisma } from '@adysre/database';

/**
 * Rate limit counters, in Postgres so every instance shares them.
 *
 * The whole operation is ONE statement, and it has to be. A read followed by a
 * write lets two concurrent requests both observe count 4, both write 5, and
 * both pass a limit of 5 - which is exactly the concurrency an attacker
 * produces and a normal user does not. `INSERT ... ON CONFLICT DO UPDATE`
 * makes the increment atomic under the row lock the upsert already takes, so
 * the count is correct no matter how many instances are running.
 */

export interface WindowState {
  count: number;
  resetAt: Date;
}

/**
 * Count one request against `key`, returning the resulting window.
 *
 * The window rolls over inside the same statement: when `reset_at` has passed,
 * the row is reset to 1 rather than incremented. Doing that in application code
 * would reintroduce the read-then-write race the upsert exists to avoid.
 *
 * @param windowSec - length of a fresh window, in seconds
 */
export async function countRequest(key: string, windowSec: number): Promise<WindowState> {
  const rows = await prisma.$queryRaw<{ count: number; reset_at: Date }[]>`
    INSERT INTO rate_limits (key, count, reset_at)
    VALUES (${key}, 1, now() + make_interval(secs => ${windowSec}::double precision))
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limits.reset_at <= now() THEN 1
        ELSE rate_limits.count + 1
      END,
      reset_at = CASE
        WHEN rate_limits.reset_at <= now()
        THEN now() + make_interval(secs => ${windowSec}::double precision)
        ELSE rate_limits.reset_at
      END
    RETURNING count, reset_at
  `;

  const row = rows[0];
  // The statement always returns a row; this satisfies the type checker without
  // inventing a permissive default that would silently disable the limit.
  if (!row) throw new Error('rate limit upsert returned no row');

  return { count: row.count, resetAt: row.reset_at };
}

/**
 * Delete windows that have already expired.
 *
 * Not run on a timer inside the app: a `setInterval` keeps a serverless
 * instance alive and can be billed for it. Called by the cleanup job instead.
 */
export async function sweepExpired(): Promise<number> {
  const { count } = await prisma.rateLimit.deleteMany({
    where: { resetAt: { lt: new Date() } },
  });
  return count;
}

/** Remove a single key. Used by tests, and to lift a limit by hand. */
export async function clearKey(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}
