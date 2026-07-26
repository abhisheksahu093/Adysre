import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { NOT_FOUND, ok, reportRouteError } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { duplicateNode } from '@/lib/api-studio/repositories/nodes';
import { nodeDuplicateSchema } from '@/modules/api-studio/schemas/api';

/**
 * Duplicate a node and its subtree.
 *
 * `POST /api/api-studio/nodes/{id}/duplicate  { name? }`
 *
 * Server-side because a subtree copy is one transaction, not a round trip per
 * node: duplicating a folder of 200 requests from the client would be 200
 * creates that could half-fail. The name for the copy comes from the client, so
 * the label stays translated rather than the server inventing English.
 */
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestCreate);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, nodeDuplicateSchema);
  if (!body.ok) return body.response;

  const { id } = await params;
  const name = body.data.name;

  try {
    const node = await duplicateNode(
      auth.session.tenantId,
      auth.session.userId,
      id,
      name ? () => name : undefined,
    );
    return node ? ok(node, 'Duplicated.') : NOT_FOUND('Not found.');
  } catch (error) {
    return reportRouteError('api-studio.nodes.id.duplicate', error);
  }
}
