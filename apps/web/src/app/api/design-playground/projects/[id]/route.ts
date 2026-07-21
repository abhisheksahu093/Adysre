import { NextResponse } from 'next/server';
import { parseDocument } from '@/lib/design-playground/schema';
import {
  deleteProject,
  getProject,
  saveProject,
} from '@/lib/design-playground/project-repository';
import { resolveActor } from '@/lib/design-playground/tenant-server';
import { UNAVAILABLE, fail, ok } from '@/lib/design-playground/api-response';

/**
 * Design Playground projects — single-project routes.
 *
 * `GET`    load a project with its document
 * `PUT`    overwrite the document (autosave)
 * `DELETE` soft-delete it
 *
 * A project belonging to another tenant answers 404, not 403: existence itself
 * is not something one tenant should be able to probe for.
 */
export const dynamic = 'force-dynamic';

const NOT_FOUND = () => fail('NOT_FOUND', 'Project not found.', 404);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const actor = await resolveActor();
    if (!actor) return UNAVAILABLE();

    const project = await getProject(actor.tenantId, id);
    return project ? ok(project) : NOT_FOUND();
  } catch {
    return UNAVAILABLE();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  let body: { name?: unknown; document?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return fail('VALIDATION_ERROR', 'Body must be JSON.', 400);
  }

  const document = parseDocument(body.document);
  if (!document) return fail('VALIDATION_ERROR', 'Document is missing or invalid.', 400);

  try {
    const actor = await resolveActor();
    if (!actor) return UNAVAILABLE();

    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : undefined;
    const saved = await saveProject(actor.tenantId, actor.userId, id, document, name?.slice(0, 200));
    return saved ? ok({ id, savedAt: new Date().toISOString() }) : NOT_FOUND();
  } catch {
    return UNAVAILABLE();
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const actor = await resolveActor();
    if (!actor) return UNAVAILABLE();
    return (await deleteProject(actor.tenantId, actor.userId, id)) ? ok({ id }) : NOT_FOUND();
  } catch {
    return UNAVAILABLE();
  }
}
