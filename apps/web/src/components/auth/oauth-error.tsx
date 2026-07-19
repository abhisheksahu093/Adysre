'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { OAUTH_PROVIDERS, type OAuthProvider } from '@adysre/validators';
import { FormAlert } from './form-alert';

/** Error codes the OAuth callback can redirect back with (see the API). */
const KNOWN_ERRORS = new Set([
  'oauth',
  'oauth_state',
  'oauth_not_configured',
  'oauth_no_email',
  'oauth_invalid',
]);

const LABELS: Record<OAuthProvider, string> = {
  google: 'Google',
  microsoft: 'Microsoft',
  github: 'GitHub',
};

function isProvider(value: string | null): value is OAuthProvider {
  return value !== null && (OAUTH_PROVIDERS as readonly string[]).includes(value);
}

/**
 * Surfaces an OAuth failure carried back on the URL as `?error=<code>`.
 *
 * The API never returns a raw provider or server message to the browser; it
 * redirects here with a stable code, which this component maps to friendly,
 * translated copy. Renders nothing when there is no known error, so it is safe
 * to drop at the top of any auth page.
 */
export function OAuthError() {
  const params = useSearchParams();
  const t = useTranslations('auth.oauth.errors');

  const code = params.get('error');
  if (!code || !KNOWN_ERRORS.has(code)) return null;

  const providerParam = params.get('provider');
  const provider = isProvider(providerParam) ? LABELS[providerParam] : '';

  return <FormAlert>{t(code, { provider })}</FormAlert>;
}
