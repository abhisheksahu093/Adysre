/**
 * The response envelope, on the Web standard.
 *
 * The shape is ADYSRE's, from `documents/API_STANDARDS.md`: a rules endpoint
 * answering differently from every other endpoint in the platform would make
 * the client that consumes both carry two readers.
 *
 * The TYPE is `Response`, not `NextResponse`. Nothing in this package imports
 * from Next, which is deliberate rather than incidental: a route handler in the
 * App Router may return any `Response`, and staying on the standard means the
 * same handlers run under Hono, Deno, Bun or a Cloudflare Worker. It also means
 * this package cannot be broken by Next changing its own helpers, which it has.
 */

export interface ResponseMeta {
  page?: number;
  pageSize?: number;
  total?: number;
}

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' } as const;

export function ok<T>(data: T, message = 'OK', meta?: ResponseMeta): Response {
  const body =
    meta === undefined ? { success: true, message, data } : { success: true, message, data, meta };
  return new Response(JSON.stringify(body), { status: 200, headers: JSON_HEADERS });
}

export function fail(code: string, message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, code, message }), {
    status,
    headers: JSON_HEADERS,
  });
}

/** The body was not JSON, or was not a rule. */
export const badRequest = (message: string): Response => fail('VALIDATION_ERROR', message, 400);

export const unauthenticated = (message = 'Sign in to continue.'): Response =>
  fail('UNAUTHENTICATED', message, 401);

export const forbidden = (message = 'You cannot perform this action.'): Response =>
  fail('FORBIDDEN', message, 403);

/**
 * Absent, or belonging to somebody else.
 *
 * Deliberately the same answer for both. Telling a caller "this exists but is
 * not yours" is a probe that maps another tenant's ids one request at a time.
 */
export const notFound = (message = 'Not found.'): Response => fail('NOT_FOUND', message, 404);

export const methodNotAllowed = (message = 'That method is not supported here.'): Response =>
  fail('METHOD_NOT_ALLOWED', message, 405);

/**
 * Something broke that the caller cannot fix.
 *
 * The message is deliberately vague and the cause goes to the host's reporter:
 * echoing a storage error to a caller leaks a schema, and swallowing it
 * silently leaves the person who could fix it with nothing.
 */
export const serverError = (message = 'That could not be completed.'): Response =>
  fail('INTERNAL_ERROR', message, 500);
