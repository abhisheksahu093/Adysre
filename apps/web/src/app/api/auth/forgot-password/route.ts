import { forgotPasswordSchema } from '@adysre/validators';
import { RATE_LIMITED, ok } from '@/lib/api/response';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { invalid, readJson, verifyOrigin } from '@/lib/auth/http';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { requestPasswordReset } from '@/lib/auth/service/password.service';
import { passwordResetEmail } from '@/lib/email/templates';
import { sendEmail } from '@/lib/email/transport';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The single response this endpoint gives, whatever happens.
 *
 * Identical for a registered address, an unknown one, an OAuth-only account,
 * and an internal failure. Anything else makes this a lookup service for which
 * addresses have accounts, and it is unauthenticated.
 */
const ALWAYS = 'If that address has an account, a reset link is on its way.';

/**
 * POST /api/auth/forgot-password
 *
 * Issues a reset token per matching account. Email delivery is Phase 6; until
 * then the link is logged server-side in development so the flow is testable.
 */
export async function POST(request: Request) {
  const forbidden = verifyOrigin(request);
  if (forbidden) return forbidden;

  const parsed = forgotPasswordSchema.safeParse(await readJson(request));
  // A malformed body is still a 400: that reveals nothing about any account.
  if (!parsed.success) return invalid(parsed.error);

  const email = parsed.data.email.toLowerCase();
  const ip = clientIp(request);

  // Keyed by email rather than IP, because the abuse this prevents is mailbox
  // flooding of one person, which a distributed attacker could do from many
  // addresses. Rate limiting still answers with the SAME message, so a limited
  // caller learns nothing either.
  const limit = await rateLimit(`forgot:${email}`, { max: 3, windowSec: 3600 });
  if (!limit.ok) return RATE_LIMITED(limit.retryAfter);

  const context = requestContext(request);

  try {
    const issued = await requestPasswordReset(email, ip);

    for (const reset of issued) {
      await recordAuthEvent(
        { tenantId: reset.tenantId, actorId: reset.userId, ...context },
        'auth.password.reset.requested',
      );

      // Never throws, and a failure is logged rather than surfaced: the
      // response must stay byte-identical whatever happens, or the difference
      // itself reveals whether the address exists.
      await sendEmail(passwordResetEmail(email, reset.token, reset.name));
    }
  } catch (error) {
    // Deliberately swallowed. A 503 here would distinguish "we tried and the
    // database failed" from "there is no such account", which is exactly the
    // distinction this endpoint exists to hide. The operator gets the cause.
    console.error(
      `[auth.forgot-password] ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return ok({ requested: true }, ALWAYS);
}
