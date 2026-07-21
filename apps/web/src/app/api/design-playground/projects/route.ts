import { NextResponse } from 'next/server';
import { parseDocument } from '@/lib/design-playground/schema';
import {
  createProject,
  latestProject,
  listProjects,
} from '@/lib/design-playground/project-repository';
import { resolveActor } from '@/lib/design-playground/tenant-server';
import { UNAVAILABLE, fail, ok } from '@/lib/design-playground/api-response';

/**
 * Design Playground projects — collection routes.
 *
 * `GET  /api/design-playground/projects`        list the tenant's projects
 * `GET  /api/design-playground/projects?latest` the one to reopen on load
 * `POST /api/design-playground/projects`        create from a document
 *
 * Persistence failures answer 503 rather than 500: the editor keeps working
 * against its local cache, and the status chip can say "offline" honestly
 * instead of pretending a save succeeded.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const actor = await resolveActor();
    if (!actor) return UNAVAILABLE();

    // `?latest=1` is a distinct read, not a filter: it returns one project WITH
    // its document, which the list deliberately omits.
    if (new URL(request.url).searchParams.has('latest')) {
      const project = await latestProject(actor.tenantId);
      return ok(project);
    }

    return ok(await listProjects(actor.tenantId));
  } catch {
    return UNAVAILABLE();
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: { name?: unknown; document?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return fail('VALIDATION_ERROR', 'Body must be JSON.', 400);
  }

  // Validate before touching the database: a document that cannot be parsed
  // must never be stored, or the next reader inherits the problem.
  const document = parseDocument(body.document);
  if (!document) return fail('VALIDATION_ERROR', 'Document is missing or invalid.', 400);

  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : document.name;

  try {
    const actor = await resolveActor();
    if (!actor) return UNAVAILABLE();
    return ok(await createProject(actor.tenantId, actor.userId, name.slice(0, 200), document));
  } catch {
    return UNAVAILABLE();
  }
}
