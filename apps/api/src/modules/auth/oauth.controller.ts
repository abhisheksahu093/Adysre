import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { AuthService } from './auth.service.js';
import { OAuthService } from './oauth.service.js';
import { setAuthCookies } from './auth-cookies.js';
import {
  appUrl,
  configuredProviders,
  getProviderConfig,
  isOAuthProvider,
} from './oauth.config.js';
import { Public } from '../../common/decorators/index.js';

/** Short-lived cookie holding the CSRF nonce echoed back as `state`. */
const STATE_COOKIE = 'oauth_state';
const STATE_TTL_MS = 10 * 60 * 1000;

/**
 * OAuth entry and callback for Google, Microsoft and GitHub.
 *
 * Both routes are browser redirects, not JSON, so they take the raw `Response`
 * and never return an envelope. The flow is standard Authorization Code with a
 * one-time `state` nonce double-submitted through an HTTP-only cookie to defeat
 * CSRF. On success the account is found-or-created and the session cookies are
 * set; every failure funnels back to the web login page with an `?error=` code
 * the UI can explain, never a raw stack trace.
 */
@ApiTags('auth')
@Controller('auth/oauth')
export class OAuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly oauth: OAuthService,
  ) {}

  /** Which providers are configured - lets the UI disable dead buttons. */
  @Public()
  @Get('providers')
  providers() {
    return { data: { providers: configuredProviders() } };
  }

  /** Step 1: send the browser to the provider's consent screen. */
  @Public()
  @Get(':provider')
  authorize(@Param('provider') provider: string, @Res() res: Response) {
    if (!isOAuthProvider(provider)) return this.fail(res, 'oauth_invalid');
    const config = getProviderConfig(provider);
    if (!config) return this.fail(res, 'oauth_not_configured', provider);

    const state = randomBytes(32).toString('base64url');
    res.cookie(STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: STATE_TTL_MS,
    });
    return res.redirect(this.oauth.buildAuthorizationUrl(config, state));
  }

  /** Step 2: the provider redirects back here with a code. */
  @Public()
  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') providerError: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Always burn the state cookie, whatever happens next.
    const cookieState = req.cookies?.[STATE_COOKIE] as string | undefined;
    res.clearCookie(STATE_COOKIE, { path: '/' });

    if (!isOAuthProvider(provider)) return this.fail(res, 'oauth_invalid');
    // The user declined, or the provider reported a problem.
    if (providerError) return this.fail(res, 'oauth', provider);
    if (!code || !state || !cookieState || !safeEqual(state, cookieState)) {
      return this.fail(res, 'oauth_state', provider);
    }

    const config = getProviderConfig(provider);
    if (!config) return this.fail(res, 'oauth_not_configured', provider);

    try {
      const token = await this.oauth.exchangeCode(config, code);
      const profile = await this.oauth.fetchProfile(config, token);
      if (!profile.email) return this.fail(res, 'oauth_no_email', provider);

      const result = await this.auth.loginOrCreateWithOAuth(profile);
      setAuthCookies(res, result);
      return res.redirect(`${appUrl()}/dashboard`);
    } catch {
      // Never surface a provider or database error to the browser verbatim.
      return this.fail(res, 'oauth', provider);
    }
  }

  /** Redirect back to the web login with a machine-readable error code. */
  private fail(res: Response, code: string, provider?: string) {
    const params = new URLSearchParams({ error: code });
    if (provider) params.set('provider', provider);
    return res.redirect(`${appUrl()}/login?${params.toString()}`);
  }
}

/** Constant-time compare of two base64url strings. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
