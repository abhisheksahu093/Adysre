import type { NextResponse } from 'next/server';
import type { z } from 'zod';
import { BAD_REQUEST } from './response';

/**
 * Parse and validate a JSON request body.
 *
 * Every route starts the same way, so the "is this JSON, does it match the
 * contract" dance is written once. A validation failure answers 400 with the
 * first field-level message, which is enough for a developer to fix the call
 * without the response becoming a map of the schema.
 */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, response: BAD_REQUEST('Body must be JSON.') };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path.join('.') ?? '';
    return {
      ok: false,
      response: BAD_REQUEST(path ? `${path}: ${issue?.message}` : (issue?.message ?? 'Invalid body.')),
    };
  }

  return { ok: true, data: parsed.data };
}

/** Read a required id-ish query parameter. */
export function requiredParam(
  request: Request,
  name: string,
): { ok: true; value: string } | { ok: false; response: NextResponse } {
  const value = new URL(request.url).searchParams.get(name);
  if (!value) return { ok: false, response: BAD_REQUEST(`${name} is required.`) };
  return { ok: true, value };
}
