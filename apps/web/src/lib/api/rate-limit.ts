/**
 * A sliding-window rate limiter, in process memory.
 *
 * Honest about what it is: this bounds ONE instance. A deployment running
 * several web containers gets the limit multiplied by the container count,
 * which is a weaker guarantee than it looks. The stack already carries Redis
 * (docker-compose, BullMQ), so a shared counter belongs there when the module
 * runs multi-instance; the interface below is deliberately the shape a Redis
 * implementation can take over without touching a caller.
 *
 * It exists anyway because the alternative is nothing: an unlimited request
 * runner is an open proxy that any authenticated account can point at anything
 * as fast as it can loop.
 */

interface Window {
  /** Timestamps of the hits still inside the window, oldest first. */
  hits: number[];
}

const windows = new Map<string, Window>();

/** Drop windows nobody has touched, so a long-lived process does not grow. */
function prune(now: number, windowMs: number): void {
  for (const [key, window] of windows) {
    if (window.hits.length === 0 || now - (window.hits[window.hits.length - 1] ?? 0) > windowMs * 2) {
      windows.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Hits left in the current window. */
  remaining: number;
  /** Milliseconds until the window frees a slot. `0` when allowed. */
  retryAfterMs: number;
}

/**
 * Record a hit and decide whether it is allowed.
 *
 * @param key - what is being limited. Use the tenant, never the IP: a whole
 * office behind one address is one IP and many legitimate users.
 */
export function rateLimit(
  key: string,
  options: { windowMs: number; max: number },
  now = Date.now(),
): RateLimitResult {
  const cutoff = now - options.windowMs;
  const window = windows.get(key) ?? { hits: [] };

  // Drop hits that have aged out of the window.
  const hits = window.hits.filter((hit) => hit > cutoff);

  if (hits.length >= options.max) {
    windows.set(key, { hits });
    const oldest = hits[0] ?? now;
    return { allowed: false, remaining: 0, retryAfterMs: Math.max(1, oldest + options.windowMs - now) };
  }

  hits.push(now);
  windows.set(key, { hits });
  if (windows.size > 1_000) prune(now, options.windowMs);

  return { allowed: true, remaining: options.max - hits.length, retryAfterMs: 0 };
}

/** Forget every window. Tests only. */
export function resetRateLimits(): void {
  windows.clear();
}
