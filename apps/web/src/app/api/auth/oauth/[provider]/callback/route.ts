import { NextResponse } from 'next/server';
import { constantTimeEqual } from '@/lib/auth/access-token';
import { recordAuthEvent, requestContext } from '@/lib/auth/audit';
import { clearOAuthState, readOAuthState, setAuthCookies } from '@/lib/auth/cookies';
import { safeNext } from '@/lib/auth/http';
import { appUrl, getProviderConfig, isOAuthProvider } from '@/lib/auth/oauth/config';
import { exchangeCode, fetchProfile } from '@/lib/auth/oauth/client';
import {
  OAuthAccountInactiveError,
  OAuthAmbiguousError,
  OAuthEmailUnverifiedError,
  signInWithOAuth,
} from '@/lib/auth/service/oauth.service';
import { APP_HOME } from '@/config/navigation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/oauth/:provider/callback
 *
 * The return leg: check the nonce, spend the code, and sign the user in.
 *
 * Like the start leg this answers with redirects, and like the start leg it
 * does NOT run `verifyOrigin`: the provider sends the browser here as a
 * top-level navigation, so the Origin header is either absent or the provider's
 * own. The nonce is what authenticates this request, which is precisely the job
 * `verifyOrigin` does for the JSON endpoints.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const url = new URL(request.url);

  // Read the state, then clear it, before ANY decision. A nonce is single use:
  // leaving it in place on an early return would let a captured callback URL be
  // replayed until the cookie expired.
  const stored = await readOAuthState();
  await clearOAuthState();

  if (!isOAuthProvider(provider)) {
    return failure('oauth_invalid', provider);
  }

  const config = getProviderConfig(provider);
  if (!config) {
    return failure('oauth_not_configured', provider);
  }

  // The user pressed cancel, or the provider refused. Not our error to explain
  // in detail, and its text is attacker-influenced, so it is never echoed.
  if (url.searchParams.get('error')) {
    return failure('oauth', provider);
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state || !stored || !constantTimeEqual(state, stored.state)) {
    return failure('oauth_state', provider);
  }

  const context = requestContext(request);

  try {
    const accessToken = await exchangeCode(config, code);
    const profile = await fetchProfile(config, accessToken);

    if (!profile.email) {
      return failure('oauth_no_email', provider);
    }

    const result = await signInWithOAuth(profile, context);
    await setAuthCookies(result);

    await recordAuthEvent(
      { tenantId: result.tenantId, actorId: result.userId, ...context },
      result.created ? 'auth.oauth.register' : 'auth.oauth.login',
      { provider },
    );

    // `next` was validated by `safeNext` before it went into the cookie;
    // re-validated here because the value has been out of our hands since.
    return NextResponse.redirect(new URL(safeNext(stored.next, APP_HOME), appUrl()));
  } catch (error) {
    if (error instanceof OAuthEmailUnverifiedError) {
      return failure('oauth_unverified', provider);
    }
    if (error instanceof OAuthAmbiguousError) {
      return failure('oauth_ambiguous', provider);
    }
    if (error instanceof OAuthAccountInactiveError) {
      return failure('oauth', provider);
    }

    // Anything else is ours: a provider outage, a bad secret, a database
    // failure. Logged in full, reported to the user as one generic code, since
    // the difference is not something they can act on.
    console.error(
      `[auth.oauth.${provider}] ${error instanceof Error ? error.message : String(error)}`,
    );
    return failure('oauth', provider);
  }
}

/** Back to sign-in with a code `OAuthError` knows how to render. */
function failure(code: string, provider: string): NextResponse {
  const url = new URL('/login', appUrl());
  url.searchParams.set('error', code);
  url.searchParams.set('provider', provider);
  return NextResponse.redirect(url);
}
