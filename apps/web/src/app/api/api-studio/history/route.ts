import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { ok, reportRouteError } from '@/lib/api/response';
import { parseBody, requiredParam } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { recordAudit } from '@/lib/api-studio/audit';
import { clearHistory, listHistory, recordHistory } from '@/lib/api-studio/repositories/history';
import { historyClearSchema, historyCreateSchema } from '@/modules/api-studio/schemas/api';
import { HTTP_METHODS, type HttpMethod } from '@/modules/api-studio/types';

/**
 * Request history.
 *
 * `GET    /api/api-studio/history?workspaceId=…&page=&pageSize=&method=&outcome=&q=&favorites=`
 * `POST   /api/api-studio/history`   record a send
 * `DELETE /api/api-studio/history`   clear (favourites survive by default)
 *
 * Paged, unlike the node tree: history grows without bound and is read a screen
 * at a time. Stored requests are redacted by the repository, so the log can
 * replay a call without becoming a place credentials pile up.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.historyRead);
  if (!auth.ok) return auth.response;

  const workspaceId = requiredParam(request, 'workspaceId');
  if (!workspaceId.ok) return workspaceId.response;

  const params = new URL(request.url).searchParams;
  const method = params.get('method');
  const outcome = params.get('outcome');

  try {
    const result = await listHistory(auth.session.tenantId, {
      workspaceId: workspaceId.value,
      query: params.get('q') ?? undefined,
      method: isMethod(method) ? method : undefined,
      outcome: outcome === 'success' || outcome === 'error' ? outcome : undefined,
      favoritesOnly: params.get('favorites') === '1',
      page: Number(params.get('page') ?? '1'),
      pageSize: Number(params.get('pageSize') ?? '50'),
    });

    return ok(result.entries, 'OK', {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    });
  } catch (error) {
    return reportRouteError('api-studio.history', error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  // Recording is part of sending, so it rides on the execute permission rather
  // than a write permission of its own.
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestExecute);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, historyCreateSchema);
  if (!body.ok) return body.response;

  try {
    return ok(await recordHistory(auth.session.tenantId, auth.session.userId, body.data));
  } catch (error) {
    return reportRouteError('api-studio.history', error);
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.historyDelete);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, historyClearSchema);
  if (!body.ok) return body.response;

  try {
    const removed = await clearHistory(
      auth.session.tenantId,
      body.data.workspaceId,
      body.data.includeFavorites,
    );
    await recordAudit(auth.session, 'history.clear', 'api-studio.history', body.data.workspaceId, {
      removed,
      includeFavorites: body.data.includeFavorites,
    });
    return ok({ removed }, 'History cleared.');
  } catch (error) {
    return reportRouteError('api-studio.history', error);
  }
}

function isMethod(value: string | null): value is HttpMethod {
  return value !== null && (HTTP_METHODS as readonly string[]).includes(value);
}
