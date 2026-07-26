import { NextResponse } from 'next/server';
import { API_STUDIO_PERMISSIONS } from '@adysre/types';
import { BAD_REQUEST, fail, ok } from '@/lib/api/response';
import { parseBody } from '@/lib/api/parse';
import { rateLimit } from '@/lib/api/rate-limit';
import { authorize } from '@/lib/api-studio/guard';
import { execute } from '@/lib/api-studio/runner/execute';
import { policyFromEnv } from '@/lib/api-studio/runner/host-policy';
import { databaseJar } from '@/lib/api-studio/repositories/cookies';
import { executionRequestSchema } from '@/modules/api-studio/schemas/execution';
import { RUNNER_RATE_LIMIT } from '@/modules/api-studio/constants/limits';

/**
 * The request runner.
 *
 * `POST /api/api-studio/execute`
 *
 * This is the one endpoint that makes an outbound connection on a user's
 * behalf, so it is the one with the most between the caller and the socket:
 *
 * 1. A verified session holding `api-studio:request:execute`. Reading a
 *    collection is not permission to fire it at production.
 * 2. A per-tenant rate limit. An unlimited runner is an open proxy.
 * 3. The strict `executionRequestSchema`: unknown keys rejected, header grammar
 *    enforced, every ceiling re-checked here rather than trusted from a client.
 * 4. The host policy, applied to the RESOLVED ADDRESS of every hop.
 *
 * The response is always 200 with a result envelope, even when the exchange
 * failed: "the server refused the connection" is an answer about the target,
 * not a failure of this endpoint, and the client renders it in the response
 * pane rather than as an error toast. The exceptions are the four failures
 * that are about the CALL to this endpoint (auth, rate limit, validation).
 */
export const dynamic = 'force-dynamic';
/** The runner holds a socket open; Node runtime, never edge. */
export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await authorize(API_STUDIO_PERMISSIONS.requestExecute);
  if (!auth.ok) return auth.response;

  // Keyed by tenant, not by IP: an office behind one address is one IP and
  // many legitimate users.
  const limit = rateLimit(`api-studio:execute:${auth.session.tenantId}`, {
    windowMs: RUNNER_RATE_LIMIT.windowMs,
    max: RUNNER_RATE_LIMIT.maxRequests,
  });
  if (!limit.allowed) {
    const response = fail('RATE_LIMITED', 'Too many requests. Slow down.', 429);
    response.headers.set('Retry-After', String(Math.ceil(limit.retryAfterMs / 1_000)));
    return response;
  }

  const body = await parseBody(request, executionRequestSchema);
  if (!body.ok) return body.response;

  // The workspace on the wire is only a label for history; the tenant that
  // matters comes from the session and is never read from the payload.
  if (body.data.agent !== 'server') {
    return BAD_REQUEST('This endpoint runs server-side requests only.');
  }

  // The jar is per workspace and per tenant, and the workspace id is checked
  // against the session's tenant by every query the repository makes.
  const wantsCookies = body.data.settings.sendCookies || body.data.settings.storeCookies;
  const jar = wantsCookies
    ? databaseJar(auth.session.tenantId, body.data.workspaceId, auth.session.userId)
    : undefined;

  const result = await execute(body.data, {
    policy: policyFromEnv(),
    ...(jar ? { jar } : {}),
    // The client aborts by dropping the connection; Next surfaces that as the
    // request signal, which the runner uses to destroy the socket rather than
    // finish a call nobody is waiting for.
    ...(request.signal ? { signal: request.signal } : {}),
  });

  return ok(result);
}
