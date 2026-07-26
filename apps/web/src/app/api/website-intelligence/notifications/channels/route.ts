import { NextResponse } from 'next/server';
import { getChannelStore } from '@/lib/website-intel/notify/store';
import { parseChannelInput } from '@/lib/website-intel/notify/validate';
import { ScanValidationError } from '@/lib/website-intel/validate';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * /api/website-intelligence/notifications/channels
 *
 * GET  - list every channel.
 * POST - create a channel ({ type, target }); URL targets are SSRF-validated the
 *        same way scan URLs are.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await authorize('read');
  if (!auth.ok) return auth.response;

  const data = await getChannelStore().list(auth.session.tenantId);
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const auth = await authorize('write');
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, code: 'bad_json', message: 'The request body must be JSON.' }, { status: 400 });
  }

  let input;
  try {
    input = parseChannelInput(body);
  } catch (error) {
    if (error instanceof ScanValidationError) {
      return NextResponse.json({ success: false, code: error.code, message: error.message }, { status: 400 });
    }
    throw error;
  }

  const record = await getChannelStore().create(auth.session.tenantId, input);
  return NextResponse.json({ success: true, data: record }, { status: 201 });
}
