import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, NOT_FOUND, UNAVAILABLE, ok } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { can } from '@/lib/api-studio/auth-policy';
import { recordAudit } from '@/lib/api-studio/audit';
import { SecretStorageError } from '@/lib/api-studio/crypto';
import {
  getCollection,
  softDeleteCollection,
  updateCollection,
} from '@/lib/api-studio/repositories/collections';
import { collectionUpdateSchema } from '@/modules/api-studio/schemas/api';

/**
 * One collection.
 *
 * `GET | PATCH | DELETE /api/api-studio/collections/{id}`
 *
 * Deleting soft-deletes the collection and everything under it, so a tree never
 * outlives its root.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.collectionRead);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const wantsReveal = new URL(request.url).searchParams.get('reveal') === '1';
  const reveal = wantsReveal && can(auth.session, API_STUDIO_PERMISSIONS.secretRead);

  try {
    if (reveal) {
      await recordAudit(auth.session, 'secret.reveal', 'api-studio.collection', id);
    }
    const collection = await getCollection(auth.session.tenantId, id, reveal);
    return collection ? ok(collection) : NOT_FOUND('Collection not found.');
  } catch {
    return UNAVAILABLE();
  }
}

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.collectionUpdate);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, collectionUpdateSchema);
  if (!body.ok) return body.response;

  const { id } = await params;
  try {
    const collection = await updateCollection(
      auth.session.tenantId,
      auth.session.userId,
      id,
      body.data,
    );
    return collection ? ok(collection, 'Collection updated.') : NOT_FOUND('Collection not found.');
  } catch (error) {
    if (error instanceof SecretStorageError) return BAD_REQUEST(error.message);
    return UNAVAILABLE();
  }
}

export async function DELETE(_request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.collectionDelete);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await softDeleteCollection(auth.session.tenantId, auth.session.userId, id);
    if (!deleted) return NOT_FOUND('Collection not found.');
    await recordAudit(auth.session, 'collection.delete', 'api-studio.collection', id);
    return ok({ id }, 'Collection deleted.');
  } catch {
    return UNAVAILABLE();
  }
}
