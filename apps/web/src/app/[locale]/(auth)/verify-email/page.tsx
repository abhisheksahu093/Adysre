import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'adysre';
import { Link } from '@/i18n/navigation';
import { InvalidTokenError } from '@/lib/auth/service/errors';
import { verifyEmail } from '@/lib/auth/service/verification.service';
import { APP_HOME } from '@/config/navigation';

/**
 * Where a confirmation link lands.
 *
 * A Server Component that redeems the token during the render, rather than a
 * client form that posts on mount. Two reasons. The user arrives having already
 * expressed intent by clicking the link, so asking them to press a second
 * button is pure friction. And it works with JavaScript disabled and in the
 * in-app browsers some mail clients use, which is exactly the population that
 * reaches this page.
 *
 * The trade is that a link prefetched by a mail scanner redeems the token
 * before the human clicks. That is why `redeemVerification` reports
 * `alreadyVerified` as a success rather than an error: the second arrival, the
 * real person, still sees a confirmation instead of a failure.
 */

export const dynamic = 'force-dynamic';

type Outcome = 'confirmed' | 'already' | 'invalid' | 'missing';

async function redeem(token: string | undefined): Promise<Outcome> {
  if (!token) return 'missing';
  try {
    const { alreadyVerified } = await verifyEmail(token);
    return alreadyVerified ? 'already' : 'confirmed';
  } catch (error) {
    if (error instanceof InvalidTokenError) return 'invalid';
    // A database failure is not a bad token, and must not be reported as one:
    // telling someone their valid link is invalid sends them to request another
    // that will fail the same way.
    console.error(
      `[verify-email] ${error instanceof Error ? error.message : String(error)}`,
    );
    return 'invalid';
  }
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const outcome = await redeem(token);
  const t = await getTranslations('auth.verifyEmail');
  const tc = await getTranslations('common');

  const succeeded = outcome === 'confirmed' || outcome === 'already';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{succeeded ? t('successTitle') : t('failureTitle')}</CardTitle>
        <CardDescription>{t(`${outcome}Description`)}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Somewhere useful either way: a confirmed user continues into the
            app, and a failed one is most likely already signed in and can
            request another link from their profile. Rendered as a styled link
            rather than a Button, matching the other auth pages. */}
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={succeeded ? APP_HOME : '/login'}
            className="text-primary hover:underline"
          >
            {succeeded ? t('continue') : tc('backToSignIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
