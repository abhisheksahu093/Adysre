import type { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { CONFLICT, ok, reportRouteError } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { authorize } from '@/lib/api-studio/guard';
import { recordAudit } from '@/lib/api-studio/audit';
import { createWorkspace, listWorkspaces } from '@/lib/api-studio/repositories/workspaces';
import { slugify, workspaceCreateSchema } from '@/modules/api-studio/schemas/api';

/**
 * API Studio workspaces.
 *
 * `GET  /api/api-studio/workspaces`  the tenant's workspaces
 * `POST /api/api-studio/workspaces`  create one
 *
 * The tenant is never a parameter: it comes from the verified session, so there
 * is no request shape that reads or writes another tenant's rows.
 */
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.workspaceRead);
  if (!auth.ok) return auth.response;

  try {
    return ok(await listWorkspaces(auth.session.tenantId));
  } catch (error) {
    return reportRouteError('api-studio.workspaces', error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.workspaceManage);
  if (!auth.ok) return auth.response;

  const body = await parseBody(request, workspaceCreateSchema);
  if (!body.ok) return body.response;

  try {
    const workspace = await createWorkspace(auth.session.tenantId, auth.session.userId, {
      name: body.data.name,
      slug: body.data.slug ?? slugify(body.data.name),
      description: body.data.description,
    });
    await recordAudit(auth.session, 'workspace.create', 'api-studio.workspace', workspace.id, {
      name: workspace.name,
    });
    return ok(workspace, 'Workspace created.');
  } catch (error) {
    // The slug is unique per tenant; a collision is the caller's to resolve,
    // not a server fault, so it answers 409 rather than 503.
    if (isUniqueViolation(error)) {
      return CONFLICT('SLUG_TAKEN', 'A workspace with that slug already exists.');
    }
    return reportRouteError('api-studio.workspaces', error);
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}
