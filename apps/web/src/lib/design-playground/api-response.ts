import { NextResponse } from 'next/server';

/**
 * The response envelope from `documents/API_STANDARDS.md`.
 *
 * Route handlers in this module all answer in the same shape as the NestJS API
 * will, so moving an endpoint behind `/api/v1` later is a change of host, not a
 * change of contract for the client.
 */

export function ok<T>(data: T, message = 'OK'): NextResponse {
  return NextResponse.json({ success: true, message, data });
}

export function fail(code: string, message: string, status: number): NextResponse {
  return NextResponse.json({ success: false, code, message }, { status });
}

/** Persistence is configured but unreachable, or the tenant is not seeded. */
export const UNAVAILABLE = () =>
  fail(
    'PERSISTENCE_UNAVAILABLE',
    'Project storage is not available. Check DATABASE_URL and run the migrations.',
    503,
  );
