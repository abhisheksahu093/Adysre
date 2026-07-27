import { NextResponse } from 'next/server';
import { buildOpenApiDocument } from '@/lib/openapi/document';

export const runtime = 'nodejs';

/**
 * GET /api/docs
 *
 * The OpenAPI document, generated from the Zod schemas the handlers validate
 * with, so it cannot describe an endpoint that no longer behaves that way.
 *
 * Public. It documents shapes and status codes, not data: everything here is
 * already discoverable by anyone allowed to call the API, and a spec kept
 * behind a login is a spec nobody reads. Point any viewer at this URL, or run
 * `pnpm --filter @adysre/web gen:openapi` to write `docs/openapi.json`.
 */
export function GET(): NextResponse {
  return NextResponse.json(buildOpenApiDocument(), {
    headers: {
      // Cheap to regenerate and it must never lag a deployment: a cached spec
      // describing the previous release is worse than no spec, because it looks
      // authoritative.
      'Cache-Control': 'no-store',
    },
  });
}
