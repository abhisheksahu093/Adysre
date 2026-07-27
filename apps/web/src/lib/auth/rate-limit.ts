import 'server-only';
import { countRequest } from './repository/rate-limit.repository';

/**
 * Fixed-window rate limiting, backed by shared storage.
 *
 * Counters live in Postgres rather than process memory. The earlier in-memory
 * version was per-instance, so on a platform that scales to many instances the
 * effective limit was the stated number multiplied by however many were warm:
 * a limit nobody could reason about, which loosened silently as traffic grew.
 * One round trip per limited request buys a number that means what it says.
 *
 * Fixed window rather than sliding: a sliding window needs per-request
 * timestamps, which is a lot of storage for a control whose job is to blunt
 * automation rather than to meter precisely. The known weakness is that a
 * caller can spend a full window at the end of one and again at the start of
 * the next, briefly doubling the rate. Account lockout, which is per-account
 * and not per-window, is what actually stops password guessing.
 */

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may retry. Zero when `ok`. */
  retryAfter: number;
  remaining: number;
}

export interface RateLimitOptions {
  /** Requests allowed per window. */
  max: number;
  /** Window length in seconds. */
  windowSec: number;
}

/**
 * Count one request against a key.
 *
 * @param key - what is being limited, e.g. `login:ip:1.2.3.4`. Callers build
 * this so one endpoint can limit on several dimensions at once: per-IP alone
 * misses a slow distributed attack on a single account, and per-email alone
 * lets one address spray many accounts.
 *
 * **Fails open**, and that is a deliberate trade. If the database is
 * unreachable this returns `ok`, because the request behind it is about to fail
 * with a 503 anyway: the endpoints this guards all need the database to do
 * anything at all. Failing closed here would convert a database blip into a
 * blanket denial and, worse, would make the limiter itself a way to take the
 * platform down. The account lockout that actually stops guessing is database
 * backed, so it cannot be bypassed by whatever made this call fail.
 */
export async function rateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  let state: { count: number; resetAt: Date };
  try {
    state = await countRequest(key, options.windowSec);
  } catch (error) {
    console.error(
      `[auth.rate-limit] counter unavailable for ${key}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return { ok: true, retryAfter: 0, remaining: options.max };
  }

  if (state.count > options.max) {
    const retryAfter = Math.max(
      1,
      Math.ceil((state.resetAt.getTime() - Date.now()) / 1000),
    );
    return { ok: false, retryAfter, remaining: 0 };
  }

  return { ok: true, retryAfter: 0, remaining: options.max - state.count };
}

/**
 * The caller's IP address.
 *
 * `x-forwarded-for` is a list appended to by each proxy, so the FIRST entry is
 * the original client. A client can forge the header, but Vercel overwrites it
 * at the edge, so it is trustworthy on this deployment. Behind a proxy that
 * does not, it is not, which is another reason the lockout rather than this is
 * the control that has to hold.
 *
 * Falls back to a constant rather than to "no limit": unknown callers should
 * share one bucket, not escape the limiter entirely.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
