import { NextResponse } from 'next/server';
import { runScan } from '@/lib/website-intel/scan';
import { parseScanInput, ScanValidationError } from '@/lib/website-intel/validate';
import { ScanFetchError } from '@/lib/website-intel/collect';
import { getScanStore } from '@/lib/website-intel/history/store';
import { recordScan } from '@/lib/website-intel/history/service';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * POST /api/website-intelligence/scan
 *
 * The scan endpoint. Thin by design (Controller → Service pattern): it validates
 * the body, delegates every decision to `runScan`, and maps the two typed error
 * families to HTTP. No analysis logic lives here.
 *
 * Runs on the Node runtime because the collector streams a response body and
 * follows redirects by hand - neither is available on the edge. Responses use
 * the repo's envelope: `{ success, data }` or `{ success: false, code, message }`.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Best-effort, per-instance rate limit. A shared Redis limiter is a later phase. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anonymous';
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, code, message }, { status });
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return fail(429, 'rate_limited', 'Too many scans. Try again in a minute.');
  }

  const auth = await authorize('write');
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'bad_json', 'The request body must be JSON.');
  }

  let input;
  try {
    ({ input } = parseScanInput(body));
  } catch (error) {
    if (error instanceof ScanValidationError) return fail(400, error.code, error.message);
    throw error;
  }

  try {
    const data = await runScan(input);
    // Persist the scan and diff it against this host's previous one. A storage
    // failure must not fail the scan the caller already paid for, so history is
    // best-effort here.
    let record = null;
    let comparison = null;
    try {
      ({ record, comparison } = await recordScan(getScanStore(), auth.session.tenantId, data));
    } catch {
      /* history is best-effort; the scan result still returns. */
    }
    return NextResponse.json({
      success: true,
      data,
      record: record ? { id: record.id, createdAt: record.createdAt } : null,
      comparison,
    });
  } catch (error) {
    if (error instanceof ScanValidationError) return fail(400, error.code, error.message);
    if (error instanceof ScanFetchError) {
      const status = error.code === 'timeout' ? 504 : 502;
      return fail(status, error.code, error.message);
    }
    // Never leak an unexpected error's internals to the caller.
    return fail(500, 'server_error', 'The scan failed unexpectedly.');
  }
}
