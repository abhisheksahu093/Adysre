import { z } from 'zod';
import { BAD_REQUEST, RATE_LIMITED, ok, reportRouteError } from '@/lib/api/response';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { InvalidTokenError } from '@/lib/auth/service/errors';
import { verifyEmail } from '@/lib/auth/service/verification.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({ token: z.string().min(1, 'A verification token is required') });

/**
 * POST /api/auth/verify-email
 *
 * Redeems a verification token. Public, because the whole point is that someone
 * can confirm an address from a link in their mail client without first being
 * signed in on that device.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  // Rate limited because the token is the only credential here, so this is the
  // one endpoint where guessing has a direct payoff.
  const limit = await rateLimit(`verify-email:${clientIp(request)}`, { max: 20, windowSec: 3600 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return invalid(parsed.error);

  try {
    const { alreadyVerified } = await verifyEmail(parsed.data.token);
    return ok(
      { verified: true, alreadyVerified },
      alreadyVerified ? 'This address was already confirmed.' : 'Email confirmed.',
    );
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      // Missing, expired, already used and forged are one answer. Telling them
      // apart confirms which guesses were once real tokens.
      return BAD_REQUEST(error.message);
    }
    return reportRouteError('auth.verify-email', error, 'Could not confirm your email.');
  }
}
