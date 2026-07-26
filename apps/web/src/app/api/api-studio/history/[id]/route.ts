import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { NOT_FOUND, UNAVAILABLE, ok } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { setHistoryFavorite } from '@/lib/api-studio/repositories/history';
import { historyUpdateSchema } from '@/modules/api-studio/schemas/api';

/**
 * One history row.
 *
 * `PATCH /api/api-studio/history/{id}  { favorite }`
 *
 * Starring is the only edit a history row allows: everything else about it is a
 * record of something that happened, and a log you can rewrite is not a log.
 * Starring matters because it also exempts the row from eviction.
 */
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.historyRead);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, historyUpdateSchema);
  if (!body.ok) return body.response;

  const { id } = await params;
  try {
    const entry = await setHistoryFavorite(auth.session.tenantId, id, body.data.favorite);
    return entry ? ok(entry) : NOT_FOUND('Not found.');
  } catch {
    return UNAVAILABLE();
  }
}
