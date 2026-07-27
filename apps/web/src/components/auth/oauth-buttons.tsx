'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { OAUTH_PROVIDERS, type OAuthProvider } from '@adysre/validators';
import { Button } from 'adysre';
import { platformApi } from '@/lib/api-client';
import { oauthUrl } from '@/lib/auth';
import { PROVIDER_ICONS } from './provider-icons';

/** Provider names are brands - never translated. */
const LABELS: Record<OAuthProvider, string> = {
  google: 'Google',
  microsoft: 'Microsoft',
  github: 'GitHub',
};

/**
 * OAuth sign-in options (AUTHENTICATION_RBAC.md).
 *
 * OAuth is the one part of authentication still served by the NestJS app, since
 * the provider callbacks are registered against its URL. So it works only where
 * `NEXT_PUBLIC_API_URL` names a reachable deployment, and every button is
 * disabled where it does not.
 *
 * That check is deliberately pessimistic, unlike the provider probe below. The
 * old behaviour stayed optimistic when the API was unreachable and left the
 * buttons live, which sent people into a dead-end redirect to
 * `http://localhost:4000` - a URL that in production resolves to the user's own
 * machine. A disabled button explains itself; a redirect into nothing does not.
 */
export function OAuthButtons() {
  const t = useTranslations('auth.oauth');
  // `undefined` means "not yet known" - treat all providers as enabled until
  // the API tells us otherwise.
  const [configured, setConfigured] = useState<OAuthProvider[] | undefined>(undefined);

  // No API deployment means no OAuth at all, whatever the probe would say.
  const oauthAvailable = Boolean(process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    if (!oauthAvailable) return;
    let active = true;
    platformApi
      .get<{ providers: OAuthProvider[] }>('/auth/oauth/providers')
      .then((data) => {
        if (active) setConfigured(data.providers);
      })
      .catch(() => {
        // Reachable-but-erroring API: stay optimistic and leave the buttons
        // live, so a slow or flaky probe never blocks the happy path.
      });
    return () => {
      active = false;
    };
  }, [oauthAvailable]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {OAUTH_PROVIDERS.map((provider) => {
        const Icon = PROVIDER_ICONS[provider];
        const enabled =
          oauthAvailable && (configured === undefined || configured.includes(provider));
        const label = t('continueWith', { provider: LABELS[provider] });
        const title = enabled ? label : t('notConfigured', { provider: LABELS[provider] });
        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            // Icon-only, so the accessible name comes from aria-label; title
            // gives sighted users the same hint on hover.
            aria-label={title}
            title={title}
            disabled={!enabled}
            className="w-full"
            onClick={() => {
              // Full-page navigation, not fetch: the provider consent screen is
              // a browser redirect the API kicks off, not an API response.
              const url = oauthUrl(provider);
              // Null when no API deployment is configured. The button is already
              // disabled in that case; this is the guard that makes it
              // impossible rather than merely unlikely.
              if (url) window.location.href = url;
            }}
          >
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
    </div>
  );
}

/** Visual "or" separator between OAuth and email/password. */
export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
