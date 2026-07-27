import { RATE_LIMITED, ok, reportRouteError } from '@/lib/api/response';
import { requireAuth } from '@/lib/auth/guard';
import { verifyOrigin } from '@/lib/auth/http';
import { rateLimit } from '@/lib/auth/rate-limit';
import { resendVerification } from '@/lib/auth/service/verification.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/resend-verification
 *
 * Issues a fresh confirmation link for the signed-in user's own address.
 *
 * Authenticated, and it takes no body. The address comes from the session, so
 * this cannot be pointed at somebody else's inbox: an endpoint that accepted an
 * address would be a way to send mail from our domain to anyone.
 *
 * Keyed by user rather than IP, because the abuse it prevents is one person's
 * mailbox being flooded.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const limit = await rateLimit(`resend-verification:${auth.session.userId}`, {
    max: 3,
    windowSec: 3600,
  });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  try {
    const result = await resendVerification(auth.session.tenantId, auth.session.userId);

    // Null means already verified. Answering 200 rather than an error: there is
    // nothing wrong, the user simply does not need what they asked for, and a
    // second confirmation mail would be more confusing than a no-op.
    if (!result) return ok({ sent: false, alreadyVerified: true }, 'Your email is already confirmed.');

    return ok({ sent: true, alreadyVerified: false }, 'Confirmation email sent.');
  } catch (error) {
    return reportRouteError('auth.resend-verification', error, 'Could not send the email.');
  }
}
