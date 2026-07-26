import { NextResponse } from 'next/server';
import { getChannelStore } from '@/lib/website-intel/notify/store';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * DELETE /api/website-intelligence/notifications/channels/[id]
 *
 * Remove a notification channel. 404s (standard envelope) on an unknown id.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize('write');
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const removed = await getChannelStore().remove(auth.session.tenantId, id);

  if (!removed) {
    return NextResponse.json(
      { success: false, code: 'not_found', message: 'That channel was not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: { id } });
}
