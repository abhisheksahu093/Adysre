import { NextResponse } from 'next/server';
import { getScheduleStore } from '@/lib/website-intel/schedule/store';
import { parseScheduleInput } from '@/lib/website-intel/schedule/validate';
import { ScanValidationError } from '@/lib/website-intel/validate';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * /api/website-intelligence/schedules
 *
 * GET  - list every schedule, newest first.
 * POST - create a schedule ({ url, cadence }); the store computes its first
 *        nextRunAt. The URL is validated with the same SSRF-safe check scans use.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await authorize('read');
  if (!auth.ok) return auth.response;

  const data = await getScheduleStore().list(auth.session.tenantId);
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
    input = parseScheduleInput(body);
  } catch (error) {
    if (error instanceof ScanValidationError) {
      return NextResponse.json({ success: false, code: error.code, message: error.message }, { status: 400 });
    }
    throw error;
  }

  const record = await getScheduleStore().create(auth.session.tenantId, input);
  return NextResponse.json({ success: true, data: record }, { status: 201 });
}
