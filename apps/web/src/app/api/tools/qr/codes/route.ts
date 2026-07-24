import { NextResponse } from 'next/server';
import { getSession } from '@/lib/website-intel/auth/session';
import { getQrStore } from '@/lib/tools/qr/store/store';
import { QR_TYPES_BY_ID } from '@/lib/tools/qr/registry';
import type { CreateQrInput } from '@/lib/tools/qr/store/types';

/**
 * /api/tools/qr/codes
 *
 * GET  - the caller's saved QR codes (tenant-scoped).
 * POST - save a QR code. A trackable type (one whose payload is an http URL)
 *        gets a dynamic short link; content-only types (wifi/vcard/text) are
 *        stored as-is with no redirect. `getSession` provides the tenant - the
 *        same app session used across the dashboard.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, code, message }, { status });
}

export async function GET() {
  const session = await getSession();
  if (!session) return fail(401, 'unauthenticated', 'Sign in to manage saved QR codes.');
  const data = await getQrStore().list(session.tenantId);
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return fail(401, 'unauthenticated', 'Sign in to save QR codes.');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'bad_json', 'The request body must be JSON.');
  }

  const input = body as Partial<CreateQrInput>;
  const type = input.type ? QR_TYPES_BY_ID[input.type] : undefined;
  if (!type) return fail(400, 'bad_type', 'Unknown QR type.');
  if (!input.payload || !input.design) return fail(400, 'missing_fields', 'payload and design are required.');
  if (!type.fields.every((f) => !f.required || (input.payload?.[f.name] ?? '').trim() !== '')) {
    return fail(400, 'incomplete', 'Some required fields are empty.');
  }

  // The server is authoritative about the payload string and whether it is a
  // trackable URL - never trust a client-sent targetUrl.
  const content = type.build(input.payload);
  const targetUrl = /^https?:\/\//i.test(content) ? content : null;

  const record = await getQrStore().create(session.tenantId, {
    type: type.id,
    name: (input.name ?? '').trim() || type.label,
    payload: input.payload,
    design: input.design,
    targetUrl,
  });

  const origin = new URL(request.url).origin;
  return NextResponse.json(
    { success: true, data: { ...record, shortUrl: targetUrl ? `${origin}/q/${record.slug}` : null } },
    { status: 201 },
  );
}
