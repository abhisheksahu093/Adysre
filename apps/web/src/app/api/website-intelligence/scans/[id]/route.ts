import { NextResponse } from 'next/server';
import { getScanStore } from '@/lib/website-intel/history/store';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * GET /api/website-intelligence/scans/[id]
 *
 * The full stored record for one scan, so a past result can be reopened without
 * re-running it. 404s (with the standard error envelope) when the id is unknown.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize('read');
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const record = await getScanStore().get(auth.session.tenantId, id);

  if (!record) {
    return NextResponse.json(
      { success: false, code: 'not_found', message: 'That scan was not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: record });
}
