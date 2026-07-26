import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, ok, reportRouteError } from '@/lib/api/response';
import { parseBody, requiredParam } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { SecretStorageError } from '@/lib/api-studio/crypto';
import { createNode, listNodes } from '@/lib/api-studio/repositories/nodes';
import { nodeCreateSchema } from '@/modules/api-studio/schemas/api';

/**
 * The request tree.
 *
 * `GET  /api/api-studio/nodes?collectionId=…`  every live node, flat
 * `POST /api/api-studio/nodes`                 create a folder or a request
 *
 * The list is deliberately FLAT and unpaged: the client builds the tree from it
 * (that is the point of storing it flat), and a paged tree would have to be
 * reassembled across requests before it could be drawn at all. Variables for
 * every folder come back in the same round trip, batched into one query.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestRead);
  if (!auth.ok) return auth.response;

  const collectionId = requiredParam(request, 'collectionId');
  if (!collectionId.ok) return collectionId.response;

  try {
    const nodes = await listNodes(auth.session.tenantId, collectionId.value);
    return ok(nodes, 'OK', { total: nodes.length });
  } catch (error) {
    return reportRouteError('api-studio.nodes', error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestCreate);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, nodeCreateSchema);
  if (!body.ok) return body.response;

  try {
    return ok(
      await createNode(auth.session.tenantId, auth.session.userId, body.data),
      'Created.',
    );
  } catch (error) {
    if (error instanceof SecretStorageError) return BAD_REQUEST(error.message);
    return reportRouteError('api-studio.nodes', error);
  }
}
