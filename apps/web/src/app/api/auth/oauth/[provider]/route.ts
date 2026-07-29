import { NextResponse } from 'next/server';
import { safeNext } from '@/lib/auth/http';
import { rateLimit } from '@/lib/auth/rate-limit';
import { requestContext } from '@/lib/auth/audit';
import { setOAuthState } from '@/lib/auth/cookies';
import { generateLinkToken } from '@/lib/auth/tokens';
import {
  appUrl,
  buildAuthorizationUrl,
  getProviderConfig,
  isOAuthProvider,
} from '@/lib/auth/oauth/config';
import { APP_HOME } from '@/config/navigation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/oauth/:provider
 *
 * The start leg: mint a nonce, remember it in an HTTP-only cookie, and send the
 * browser to the provider.
 *
 * A top-level navigation, not a fetch, so it answers with a redirect and never
 * with the JSON envelope the rest of the API uses. Failures go back to the
 * sign-in page as `?error=`, which `OAuthError` renders, because there is no
 * caller here to read a status code.
 *
 * `verifyOrigin` is deliberately NOT applied. This is a link the user clicks,
 * so the request may legitimately carry no Origin at all.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!isOAuthProvider(provider)) {
    return failure('oauth_invalid', provider);
  }

  const config = getProviderConfig(provider);
  if (!config) {
    return failure('oauth_not_configured', provider);
  }

  // Each start leg writes a session row's worth of nothing, but it does hit the
  // provider and set a cookie. Bounding it stops a loop (or a bored script)
  // from using this as an open redirect generator pointed at Google.
  const { ip } = requestContext(request);
  const limit = await rateLimit(`oauth:start:${ip ?? 'unknown'}`, { max: 20, windowSec: 900 });
  if (!limit.ok) {
    return failure('oauth', provider);
  }

  // Same generator the email verification and password reset links use: 32
  // random bytes, which is far past guessable.
  const { token: state } = generateLinkToken();

  // Validated here rather than on the way back, so a hostile value never even
  // reaches the cookie.
  const requested = new URL(request.url).searchParams.get('next');
  const next = safeNext(requested, APP_HOME);

  await setOAuthState({ state, next });

  return NextResponse.redirect(buildAuthorizationUrl(config, state));
}

/** Back to sign-in with a code `OAuthError` knows how to render. */
function failure(code: string, provider: string): NextResponse {
  const url = new URL('/login', appUrl());
  url.searchParams.set('error', code);
  url.searchParams.set('provider', provider);
  return NextResponse.redirect(url);
}
