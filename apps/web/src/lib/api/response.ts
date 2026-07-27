import { NextResponse } from 'next/server';

/**
 * The response envelope from `documents/API_STANDARDS.md`, shared by every
 * route handler in the web app.
 *
 * Handlers answer in the same shape the NestJS API will, so moving an endpoint
 * behind `/api/v1` later is a change of host, not a change of contract for the
 * client. Errors carry a stable machine-readable `code`; the `message` is for a
 * developer reading a log, never the only thing a user is shown.
 */

export interface Meta {
  page?: number;
  pageSize?: number;
  total?: number;
}

export function ok<T>(data: T, message = 'OK', meta?: Meta): NextResponse {
  return NextResponse.json(meta ? { success: true, message, data, meta } : { success: true, message, data });
}

export function fail(code: string, message: string, status: number): NextResponse {
  return NextResponse.json({ success: false, code, message }, { status });
}

/** A resource was created. Same envelope, 201. */
export function created<T>(data: T, message = 'Created'): NextResponse {
  return NextResponse.json({ success: true, message, data }, { status: 201 });
}

/** The body was not JSON, or failed validation. */
export const BAD_REQUEST = (message: string) => fail('VALIDATION_ERROR', message, 400);

/** No session, or one that could not be verified. */
export const UNAUTHENTICATED = (message = 'Sign in to continue.') =>
  fail('UNAUTHENTICATED', message, 401);

/** A verified session that lacks the permission this route requires. */
export const FORBIDDEN = (message = 'Your role cannot perform this action.') =>
  fail('FORBIDDEN', message, 403);

/**
 * A quota is spent, or the feature is not on this tier.
 *
 * **402, not 403.** The caller is authenticated and permitted; they have simply
 * run out. Distinguishing the two lets a client show an upgrade prompt for one
 * and an access error for the other without parsing prose, and stops a spent
 * quota looking like a permissions bug in the logs.
 *
 * `data` carries everything the upgrade modal renders, so the client never
 * keeps its own copy of the limits.
 */
export const QUOTA_EXCEEDED = (denial: unknown, message: string) =>
  NextResponse.json(
    { success: false, code: 'QUOTA_EXCEEDED', message, data: denial },
    { status: 402 },
  );

/**
 * The row does not exist, or belongs to another tenant.
 *
 * Deliberately the same answer for both: telling a caller "this exists but is
 * not yours" is a probe that maps another tenant's ids.
 */
export const NOT_FOUND = (message = 'Not found.') => fail('NOT_FOUND', message, 404);

export const CONFLICT = (code: string, message: string) => fail(code, message, 409);

/**
 * Wrong email or wrong password, deliberately indistinguishable.
 *
 * One code and one message for both, because answering "no such account"
 * separately turns sign-in into a directory of who is registered. The timing
 * has to match too, which is `verifyOrBurn`'s job (see lib/auth/password.ts).
 */
export const INVALID_CREDENTIALS = () =>
  fail('INVALID_CREDENTIALS', 'Email or password is incorrect.', 401);

/**
 * Too many failed attempts. 423 rather than 401, because 401 invites the client
 * to prompt and retry, and every retry extends the lock.
 */
export const ACCOUNT_LOCKED = (until: Date) => {
  const seconds = Math.max(1, Math.ceil((until.getTime() - Date.now()) / 1000));
  const response = fail(
    'ACCOUNT_LOCKED',
    `Too many failed attempts. Try again in ${Math.ceil(seconds / 60)} minute(s).`,
    423,
  );
  response.headers.set('Retry-After', String(seconds));
  return response;
};

/**
 * Rate limited.
 *
 * `Retry-After` is not optional. Without it a client has to guess, and a
 * guessing client hammers the endpoint it was just told to back off from.
 */
export const RATE_LIMITED = (retryAfterSeconds: number) => {
  const response = fail(
    'RATE_LIMITED',
    `Too many requests. Try again in ${retryAfterSeconds} second(s).`,
    429,
  );
  response.headers.set('Retry-After', String(retryAfterSeconds));
  return response;
};

/**
 * The credentials match accounts in more than one workspace.
 *
 * Users are unique on `(tenantId, email)`, so this is a legitimate state rather
 * than an error: the client re-posts with `tenantSlug`. Only workspaces whose
 * password actually verified are listed, so this never reveals where an address
 * exists to someone who does not hold the password.
 */
export const TENANT_AMBIGUOUS = (workspaces: { slug: string; name: string }[]) =>
  NextResponse.json(
    {
      success: false,
      code: 'TENANT_AMBIGUOUS',
      message: 'This email belongs to several workspaces. Choose one and sign in again.',
      data: { workspaces },
    },
    { status: 409 },
  );

/** Persistence is configured but unreachable, or the tenant is not seeded. */
export const UNAVAILABLE = (
  message = 'Storage is not available. Check DATABASE_URL and run the migrations.',
) => fail('PERSISTENCE_UNAVAILABLE', message, 503);

/**
 * Answer 503, and say on the server WHY.
 *
 * A route that catches everything and returns a generic "storage unavailable"
 * tells the client the right thing and the operator nothing: the actual cause
 * (a constraint, a column type, a closed connection) is discarded at exactly
 * the moment it is needed. The response stays deliberately vague - a database
 * error must never be echoed to a caller - while the cause goes to the server
 * log, where the person who can fix it is looking.
 *
 * @param scope - what was being attempted, e.g. `api-studio.workspaces.create`.
 */
export function reportRouteError(scope: string, error: unknown, message?: string): NextResponse {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  // The server log is the destination: this is where an operator looks.
  console.error(`[${scope}] ${detail}`);
  return message ? UNAVAILABLE(message) : UNAVAILABLE();
}
