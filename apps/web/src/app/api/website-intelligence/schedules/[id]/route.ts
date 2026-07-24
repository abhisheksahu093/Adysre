import { NextResponse } from 'next/server';
import { getScheduleStore } from '@/lib/website-intel/schedule/store';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * DELETE /api/website-intelligence/schedules/[id]
 *
 * Remove a schedule. 404s (standard envelope) when the id is unknown.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize('write');
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const removed = await getScheduleStore().remove(auth.session.tenantId, id);

  if (!removed) {
    return NextResponse.json(
      { success: false, code: 'not_found', message: 'That schedule was not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: { id } });
}
