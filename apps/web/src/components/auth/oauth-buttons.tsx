'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { OAUTH_PROVIDERS, type OAuthProvider } from '@adysre/validators';
import { Button } from 'adysre';
import { authApi } from '@/lib/api-client';
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
 * Same-origin: the whole flow lives in this app's own route handlers, so there
 * is no second deployment to be reachable and no cross-site cookie to weaken.
 * A button is live only when the server reports credentials for that provider,
 * because a provider without them can do nothing but bounce the user back with
 * an error.
 *
 * The probe starts pessimistic. Until the answer arrives every button is
 * disabled, so a slow response can never let someone click into a redirect that
 * is going to fail. Being briefly un-clickable is a smaller cost than a
 * dead-end trip to a consent screen.
 */
export function OAuthButtons() {
  const t = useTranslations('auth.oauth');
  // `undefined` means "not yet known"; `[]` means "asked, none configured".
  const [configured, setConfigured] = useState<OAuthProvider[] | undefined>(undefined);

  useEffect(() => {
    let active = true;
    authApi
      .get<{ providers: OAuthProvider[] }>('/api/auth/oauth/providers')
      .then((data) => {
        if (active) setConfigured(data.providers);
      })
      .catch(() => {
        // Same-origin, so a failure here means this app is broken rather than a
        // separate service being down. Leave the buttons disabled: nothing they
        // could do would work either.
        if (active) setConfigured([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {OAUTH_PROVIDERS.map((provider) => {
        const Icon = PROVIDER_ICONS[provider];
        const enabled = configured?.includes(provider) ?? false;
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
              // Full-page navigation, not fetch: the consent screen is a browser
              // redirect, and the callback needs to arrive as a top-level
              // navigation for the session cookie to be set on the way back.
              //
              // `next` carries whatever brought the user to sign-in, so someone
              // bounced off a deep link returns to it rather than to the app
              // home. Read from the URL here rather than through
              // `useSearchParams`, which would drag a Suspense boundary into
              // both auth pages to answer a question only this click asks. The
              // server re-validates it either way.
              const next = new URLSearchParams(window.location.search).get('next');
              window.location.href = oauthUrl(provider, next);
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
