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

/** The body was not JSON, or failed validation. */
export const BAD_REQUEST = (message: string) => fail('VALIDATION_ERROR', message, 400);

/** No session, or one that could not be verified. */
export const UNAUTHENTICATED = (message = 'Sign in to continue.') =>
  fail('UNAUTHENTICATED', message, 401);

/** A verified session that lacks the permission this route requires. */
export const FORBIDDEN = (message = 'Your role cannot perform this action.') =>
  fail('FORBIDDEN', message, 403);

/**
 * The row does not exist, or belongs to another tenant.
 *
 * Deliberately the same answer for both: telling a caller "this exists but is
 * not yours" is a probe that maps another tenant's ids.
 */
export const NOT_FOUND = (message = 'Not found.') => fail('NOT_FOUND', message, 404);

export const CONFLICT = (code: string, message: string) => fail(code, message, 409);

/** Persistence is configured but unreachable, or the tenant is not seeded. */
export const UNAVAILABLE = (
  message = 'Storage is not available. Check DATABASE_URL and run the migrations.',
) => fail('PERSISTENCE_UNAVAILABLE', message, 503);
