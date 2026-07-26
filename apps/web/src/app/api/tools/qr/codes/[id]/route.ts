import { NextResponse } from 'next/server';
import { getSession } from '@/lib/website-intel/auth/session';
import { getQrStore } from '@/lib/tools/qr/store/store';
import type { UpdateQrPatch } from '@/lib/tools/qr/store/types';

/**
 * /api/tools/qr/codes/[id]
 *
 * GET / PATCH / DELETE one saved code. Tenant-scoped: the store returns null for
 * an id owned by another org, so this cannot reach across the boundary.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, code, message }, { status });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return fail(401, 'unauthenticated', 'Sign in first.');
  const record = await getQrStore().get(session.tenantId, (await params).id);
  if (!record) return fail(404, 'not_found', 'That QR code was not found.');
  return NextResponse.json({ success: true, data: record });
}

/** Whitelist the patchable fields - never let a client rewrite id/tenant/slug. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return fail(401, 'unauthenticated', 'Sign in first.');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'bad_json', 'The request body must be JSON.');
  }
  const b = body as Record<string, unknown>;
  const patch: UpdateQrPatch = {};
  if (typeof b.name === 'string') patch.name = b.name;
  if (typeof b.favorite === 'boolean') patch.favorite = b.favorite;
  if (Array.isArray(b.tags)) patch.tags = b.tags.filter((t): t is string => typeof t === 'string');
  if (b.folderId === null || typeof b.folderId === 'string') patch.folderId = b.folderId;

  const record = await getQrStore().update(session.tenantId, (await params).id, patch);
  if (!record) return fail(404, 'not_found', 'That QR code was not found.');
  return NextResponse.json({ success: true, data: record });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return fail(401, 'unauthenticated', 'Sign in first.');
  const removed = await getQrStore().remove(session.tenantId, (await params).id);
  if (!removed) return fail(404, 'not_found', 'That QR code was not found.');
  return NextResponse.json({ success: true, data: { id: (await params).id } });
}
