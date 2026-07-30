import { ok } from '@/lib/api/response';
import { configuredProviders } from '@/lib/auth/oauth/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/oauth/providers
 *
 * Which providers actually have credentials, so the sign-in page can disable
 * the buttons it cannot honour instead of offering a redirect that comes
 * straight back with an error.
 *
 * Public and deliberately uninformative: it lists provider ids and nothing
 * else. Whether a deployment has Google configured is not a secret, and the
 * client ids and secrets that answer the question never leave the server.
 *
 * This sits at a static segment alongside the `[provider]` route. Next resolves
 * static before dynamic, so `/providers` reaches this and never the start leg.
 */
export async function GET() {
  return ok({ providers: configuredProviders() });
}
