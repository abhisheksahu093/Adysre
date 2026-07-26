import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, NOT_FOUND, UNAVAILABLE, ok } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { SecretStorageError } from '@/lib/api-studio/crypto';
import { getNode, softDeleteNode, updateNode } from '@/lib/api-studio/repositories/nodes';
import { nodeUpdateSchema } from '@/modules/api-studio/schemas/api';

/**
 * One node.
 *
 * `GET | PATCH | DELETE /api/api-studio/nodes/{id}`
 *
 * Saving a request snapshots the previous definition and bumps its version, so
 * the change is always reversible. Deleting a folder soft-deletes its subtree.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestRead);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const node = await getNode(auth.session.tenantId, id);
    return node ? ok(node) : NOT_FOUND('Not found.');
  } catch {
    return UNAVAILABLE();
  }
}

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestUpdate);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, nodeUpdateSchema);
  if (!body.ok) return body.response;

  const { id } = await params;
  try {
    const node = await updateNode(auth.session.tenantId, auth.session.userId, id, body.data);
    return node ? ok(node, 'Saved.') : NOT_FOUND('Not found.');
  } catch (error) {
    if (error instanceof SecretStorageError) return BAD_REQUEST(error.message);
    return UNAVAILABLE();
  }
}

export async function DELETE(_request: Request, { params }: Params): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestDelete);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await softDeleteNode(auth.session.tenantId, auth.session.userId, id);
    return deleted ? ok({ id }, 'Deleted.') : NOT_FOUND('Not found.');
  } catch {
    return UNAVAILABLE();
  }
}
