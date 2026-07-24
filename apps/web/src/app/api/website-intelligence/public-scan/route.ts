import { NextResponse } from 'next/server';
import { runScan } from '@/lib/website-intel/scan';
import { parseScanInput, ScanValidationError } from '@/lib/website-intel/validate';
import { ScanFetchError } from '@/lib/website-intel/collect';

/**
 * POST /api/website-intelligence/public-scan
 *
 * The public "try it" scan behind the landing-page checker. It runs the same
 * engine as the gated `/scan` endpoint but is deliberately anonymous, ephemeral
 * and cheaper on trust:
 *
 *   - No auth. The landing page is public, so this must be too - the gated
 *     `/scan` is for signed-in orgs and it alone writes history.
 *   - No persistence. Nothing is saved to any tenant's history, so an
 *     unauthenticated caller can never write into org-scoped data. It returns
 *     the result and forgets it.
 *   - Rate limited per IP, tighter than the app endpoint, because it is exposed.
 *
 * URL validation (including the SSRF host checks) is shared with `/scan` via
 * `parseScanInput`, so a public caller cannot point the scanner at internal
 * addresses. Responses use the repo envelope.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Per-instance IP rate limit. Tighter than the signed-in endpoint (15/min). */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
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
    // No recordScan here: the public demo never touches tenant-scoped history.
    const data = await runScan(input);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof ScanValidationError) return fail(400, error.code, error.message);
    if (error instanceof ScanFetchError) {
      const status = error.code === 'timeout' ? 504 : 502;
      return fail(status, error.code, error.message);
    }
    return fail(500, 'server_error', 'The scan failed unexpectedly.');
  }
}
