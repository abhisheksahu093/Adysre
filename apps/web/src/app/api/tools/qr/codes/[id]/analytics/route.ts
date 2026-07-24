import { NextResponse } from 'next/server';
import { getSession } from '@/lib/website-intel/auth/session';
import { getQrStore } from '@/lib/tools/qr/store/store';
import { analyzeScans } from '@/lib/tools/qr/dynamic/analytics';

/**
 * GET /api/tools/qr/codes/[id]/analytics
 *
 * Aggregated scan analytics for one code (tenant-scoped). Confirms the code
 * belongs to the caller before reading its scans, then hands the raw events to
 * the pure `analyzeScans`.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, code: 'unauthenticated', message: 'Sign in first.' }, { status: 401 });
  }
  const { id } = await params;
  const store = getQrStore();
  const code = await store.get(session.tenantId, id);
  if (!code) {
    return NextResponse.json({ success: false, code: 'not_found', message: 'That QR code was not found.' }, { status: 404 });
  }
  const scans = await store.listScans(session.tenantId, id);
  return NextResponse.json({ success: true, data: analyzeScans(scans, new Date()) });
}
