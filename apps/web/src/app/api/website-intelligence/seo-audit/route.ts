import { NextResponse } from 'next/server';
import { runSeoAudit } from '@/lib/website-intel/seo/run';
import { parseScanInput, ScanValidationError } from '@/lib/website-intel/validate';
import { ScanFetchError } from '@/lib/website-intel/collect';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * POST /api/website-intelligence/seo-audit
 *
 * Runs a full SEO audit for a URL: reuses the scanner's SSRF-safe fetch and
 * fact extractor, then grades the page. Gated and rate-limited exactly like the
 * scan endpoint (writes require a privileged session); the two error families
 * map to HTTP the same way. No external SEO service.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    return fail(429, 'rate_limited', 'Too many audits. Try again in a minute.');
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
    const data = await runSeoAudit(input.url);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof ScanFetchError) {
      const status = error.code === 'timeout' ? 504 : 502;
      return fail(status, error.code, error.message);
    }
    return fail(500, 'server_error', 'The audit failed unexpectedly.');
  }
}
