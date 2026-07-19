'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { OAUTH_PROVIDERS, type OAuthProvider } from '@adysre/validators';
import { Button } from '@adysre/ui';
import { api } from '@/lib/api-client';
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
 * The set of usable providers is dynamic: the API reports which ones actually
 * have credentials configured, and any that don't are disabled here rather than
 * sending the user into a dead-end redirect. While that list is loading - or if
 * the API is unreachable - every button stays enabled, so the happy path is
 * never blocked by a slow probe.
 */
export function OAuthButtons() {
  const t = useTranslations('auth.oauth');
  // `undefined` means "not yet known" - treat all providers as enabled until
  // the API tells us otherwise.
  const [configured, setConfigured] = useState<OAuthProvider[] | undefined>(undefined);

  useEffect(() => {
    let active = true;
    api
      .get<{ providers: OAuthProvider[] }>('/auth/oauth/providers')
      .then((data) => {
        if (active) setConfigured(data.providers);
      })
      .catch(() => {
        // API down or unreachable: stay optimistic and leave the buttons live.
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {OAUTH_PROVIDERS.map((provider) => {
        const Icon = PROVIDER_ICONS[provider];
        const enabled = configured === undefined || configured.includes(provider);
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
              window.location.href = oauthUrl(provider);
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
