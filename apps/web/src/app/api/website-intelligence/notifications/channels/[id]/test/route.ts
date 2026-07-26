import { NextResponse } from 'next/server';
import { getChannelStore } from '@/lib/website-intel/notify/store';
import { HttpNotifier } from '@/lib/website-intel/notify/notifier';
import type { NotifyEvent } from '@/lib/website-intel/notify/types';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * POST /api/website-intelligence/notifications/channels/[id]/test
 *
 * Send a sample event to one channel so a user can confirm it is wired up. The
 * result (ok/status/error) is returned rather than swallowed, so the UI can show
 * whether the webhook actually accepted it.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SAMPLE: NotifyEvent = {
  kind: 'scan.completed',
  url: 'https://example.com/',
  scanId: null,
  overallScore: 84,
  overallDelta: null,
  findings: 11,
  critical: 0,
  serious: 3,
  at: new Date(0).toISOString(),
};

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize('write');
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const channel = await getChannelStore().get(auth.session.tenantId, id);
  if (!channel) {
    return NextResponse.json({ success: false, code: 'not_found', message: 'That channel was not found.' }, { status: 404 });
  }

  const result = await new HttpNotifier().send(channel, { ...SAMPLE, at: new Date().toISOString() });
  return NextResponse.json({ success: true, data: result });
}
