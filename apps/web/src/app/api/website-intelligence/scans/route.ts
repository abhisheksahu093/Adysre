import { NextResponse } from 'next/server';
import { getScanStore } from '@/lib/website-intel/history/store';
import { toSummary } from '@/lib/website-intel/history/keys';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * GET /api/website-intelligence/scans
 *
 * Recent scan history, newest first, as lightweight summaries (never the full
 * result - that is what `/scans/[id]` is for). Optional `?host=` narrows to one
 * site's history; `?limit=` caps the count.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const auth = await authorize('read');
  if (!auth.ok) return auth.response;

  const params = new URL(request.url).searchParams;
  const host = params.get('host')?.toLowerCase() || undefined;

  const rawLimit = Number(params.get('limit'));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;

  const records = await getScanStore().list(auth.session.tenantId, host ? { host, limit } : { limit });
  return NextResponse.json({ success: true, data: records.map(toSummary) });
}
