import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, NOT_FOUND, ok, reportRouteError } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { moveNode } from '@/lib/api-studio/repositories/nodes';
import { nodeMoveSchema } from '@/modules/api-studio/schemas/api';

/**
 * Move a node.
 *
 * `POST /api/api-studio/nodes/{id}/move  { parentId, index }`
 *
 * A move is its own endpoint rather than a PATCH field because it is its own
 * operation: it validates against the tree's shape, may renumber a whole
 * sibling list, and has a failure mode ("that would make a cycle") that a
 * general update does not. The server applies the same rules as the client,
 * from the same code, so a drop the UI allowed cannot be rejected here for a
 * different reason - or worse, accepted when the UI would not have.
 */
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestUpdate);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, nodeMoveSchema);
  if (!body.ok) return body.response;

  const { id } = await params;
  try {
    const result = await moveNode(
      auth.session.tenantId,
      auth.session.userId,
      id,
      body.data.parentId,
      body.data.index,
    );

    if (result.ok) return ok(result.node, 'Moved.');
    return result.reason === 'not_found'
      ? NOT_FOUND('Not found.')
      : BAD_REQUEST('That destination would break the tree.');
  } catch (error) {
    return reportRouteError('api-studio.nodes.id.move', error);
  }
}
