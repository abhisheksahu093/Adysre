import type { ZodError } from 'zod';
import { BAD_REQUEST, FORBIDDEN } from '@/lib/api/response';
import type { NextResponse } from 'next/server';

/**
 * Small helpers every auth handler repeats, kept in one place so nine files do
 * not each grow their own slightly different version.
 */

/**
 * Parse a JSON body without letting a malformed one become a 500.
 *
 * `request.json()` throws on invalid JSON, and an unhandled throw in a route
 * handler is a 500 with a stack trace. A body that is not JSON is the caller's
 * mistake, so it must be a 400.
 */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/**
 * Flatten a Zod error into one line.
 *
 * Field names and messages only. The submitted values are deliberately left
 * out: echoing them back would put a password into a log the first time
 * validation failed on a sign-up form.
 */
export function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join('; ');
}

/**
 * Reject a state-changing request whose Origin is not ours.
 *
 * Belt and braces alongside `SameSite=Lax`, which already stops the browser
 * attaching cookies to a cross-site POST. This catches the cases Lax does not,
 * and costs nothing.
 *
 * A missing Origin is allowed: same-origin GET and some non-browser clients
 * omit it entirely, and rejecting those would break curl and every server-side
 * caller for no security gain (a browser always sends it on cross-origin
 * requests, which is the case that matters).
 */
export function verifyOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get('origin');
  if (!origin) return null;

  const allowed = new Set(
    [process.env.NEXT_PUBLIC_APP_URL, ...(process.env.ALLOWED_ORIGINS?.split(',') ?? [])]
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value)),
  );

  // Nothing configured means we cannot judge. Allowing is the pragmatic choice
  // for a local or preview deployment; SameSite=Lax is still doing the real
  // work, and failing closed here would break every dev environment.
  if (allowed.size === 0) return null;

  if (!allowed.has(origin)) {
    return FORBIDDEN('Request origin is not allowed.');
  }
  return null;
}

/** A 400 built from a Zod failure. */
export function invalid(error: ZodError): NextResponse {
  return BAD_REQUEST(formatZodError(error));
}

/**
 * Where to send someone after sign-in.
 *
 * Must be a same-origin relative path. `//evil.com` is protocol-relative and a
 * browser treats it as absolute, so checking only for a leading slash is the
 * bug that makes this an open redirect.
 */
export function safeNext(next: string | null | undefined, fallback: string): string {
  if (!next) return fallback;
  if (!next.startsWith('/')) return fallback;
  if (next.startsWith('//')) return fallback;
  // Backslashes are normalised to forward slashes by some browsers, so `/\evil.com`
  // can escape the origin too.
  if (next.startsWith('/\\')) return fallback;
  return next;
}
