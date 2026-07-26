'use client';

import { useTranslations } from 'next-intl';
import { Input, Select } from 'adysre';
import type { AuthConfig, AuthType } from '../../types';
import { AUTH_TYPES } from '../../types';

/**
 * The auth pane.
 *
 * Fields are plain text inputs, including the password ones, because they hold
 * `{{variables}}` far more often than literals and masking a template helps
 * nobody. The credential itself lives in an environment variable marked secret,
 * which is where the masking, the encryption and the audit trail actually are.
 *
 * Strategies that need a round trip are listed but say so rather than
 * pretending: a form that collects an OAuth2 client secret and then silently
 * sends nothing is worse than a sentence explaining what is missing.
 */
export function AuthEditor({
  auth,
  onChange,
  inheritedLabel,
}: {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
  /** What `inherit` resolves to, when the caller knows. */
  inheritedLabel?: string;
}) {
  const t = useTranslations('apiStudio');

  function switchType(type: AuthType): void {
    switch (type) {
      case 'basic':
        onChange({ type, username: '', password: '' });
        return;
      case 'bearer':
        onChange({ type, token: '', prefix: 'Bearer' });
        return;
      case 'apiKey':
        onChange({ type, key: '', value: '', addTo: 'header' });
        return;
      case 'customHeader':
      case 'customQuery':
        onChange({ type, name: '', value: '' });
        return;
      case 'none':
      case 'inherit':
        onChange({ type });
        return;
      default:
        // Round-trip strategies are selectable so the choice is visible, but
        // they carry no form until the phase that can perform them.
        onChange({ type: 'none' });
    }
  }

  const unsupported = ['digest', 'jwt', 'oauth2', 'awsSignature'] as const;
  const isUnsupported = (unsupported as readonly string[]).includes(auth.type);

  return (
    <div className="max-w-xl space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted-foreground" htmlFor="auth-type">
          {t('auth.type')}
        </label>
        <Select
          id="auth-type"
          value={auth.type}
          onChange={(event) => switchType(event.target.value as AuthType)}
          className="h-8 w-auto min-w-40 text-xs"
        >
          {AUTH_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`auth.types.${type}`)}
            </option>
          ))}
        </Select>
      </div>

      {auth.type === 'inherit' && (
        <p className="text-xs text-muted-foreground">
          {inheritedLabel
            ? t('auth.inheritsFrom', { source: inheritedLabel })
            : t('auth.inheritsNothing')}
        </p>
      )}

      {auth.type === 'none' && (
        <p className="text-xs text-muted-foreground">{t('auth.noneHint')}</p>
      )}

      {isUnsupported && (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
          {t('auth.pending', { type: t(`auth.types.${auth.type}`) })}
        </p>
      )}

      {auth.type === 'basic' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label={t('auth.username')}
            value={auth.username}
            onChange={(username) => onChange({ ...auth, username })}
          />
          <Field
            label={t('auth.password')}
            value={auth.password}
            onChange={(password) => onChange({ ...auth, password })}
          />
        </div>
      )}

      {auth.type === 'bearer' && (
        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <Field
            label={t('auth.token')}
            value={auth.token}
            placeholder="{{access_token}}"
            onChange={(token) => onChange({ ...auth, token })}
          />
          <Field
            label={t('auth.prefix')}
            value={auth.prefix}
            onChange={(prefix) => onChange({ ...auth, prefix })}
          />
        </div>
      )}

      {auth.type === 'apiKey' && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label={t('auth.key')}
            value={auth.key}
            onChange={(key) => onChange({ ...auth, key })}
          />
          <Field
            label={t('auth.value')}
            value={auth.value}
            onChange={(value) => onChange({ ...auth, value })}
          />
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="auth-add-to">
              {t('auth.addTo')}
            </label>
            <Select
              id="auth-add-to"
              value={auth.addTo}
              onChange={(event) =>
                onChange({ ...auth, addTo: event.target.value === 'query' ? 'query' : 'header' })
              }
              className="h-8 text-xs"
            >
              <option value="header">{t('auth.header')}</option>
              <option value="query">{t('auth.query')}</option>
            </Select>
          </div>
        </div>
      )}

      {(auth.type === 'customHeader' || auth.type === 'customQuery') && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label={t('auth.name')}
            value={auth.name}
            onChange={(name) => onChange({ ...auth, name })}
          />
          <Field
            label={t('auth.value')}
            value={auth.value}
            onChange={(value) => onChange({ ...auth, value })}
          />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = `auth-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 font-mono text-xs"
      />
    </div>
  );
}
