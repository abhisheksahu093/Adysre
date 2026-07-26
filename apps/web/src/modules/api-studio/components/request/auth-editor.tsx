'use client';

import { useTranslations } from 'next-intl';
import { Input, Select, Textarea } from 'adysre';
import type { AuthConfig, AuthType, OAuth2Config } from '../../types';
import {
  AUTH_TYPES,
  DIGEST_ALGORITHMS,
  JWT_ALGORITHMS,
  OAUTH2_GRANT_TYPES,
} from '../../types';

/**
 * The auth pane.
 *
 * Fields are plain text inputs, including the password ones, because they hold
 * `{{variables}}` far more often than literals and masking a template helps
 * nobody. The credential itself lives in an environment variable marked secret,
 * which is where the masking, the encryption and the audit trail actually are.
 *
 * Four strategies are applied by the RUNNER rather than the browser (digest
 * needs the server's challenge, OAuth 2 a token exchange, AWS a signature over
 * the final bytes, JWT a key that must never reach a browser). They are
 * configured here exactly like the rest; the note explains where they happen.
 */

/** Strategies whose credentials never leave the server. */
const RUNNER_APPLIED: readonly AuthType[] = ['digest', 'jwt', 'oauth2', 'awsSignature'];

/** The one grant that needs a browser redirect, which this build cannot do. */
const BROWSER_GRANTS = new Set(['authorization_code', 'authorization_code_pkce', 'implicit', 'device_code']);

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
      case 'digest':
        onChange({
          type,
          username: '',
          password: '',
          realm: '',
          algorithm: 'MD5',
          qop: 'auth',
          opaque: '',
        });
        return;
      case 'jwt':
        onChange({
          type,
          algorithm: 'HS256',
          secret: '',
          secretBase64Encoded: false,
          payload: '{\n  "sub": ""\n}',
          headerPrefix: 'Bearer',
          addTo: 'header',
          paramName: 'token',
        });
        return;
      case 'oauth2':
        onChange({ type, config: emptyOAuth2() });
        return;
      case 'awsSignature':
        onChange({
          type,
          accessKeyId: '',
          secretAccessKey: '',
          sessionToken: '',
          region: 'us-east-1',
          service: '',
        });
        return;
      default:
        onChange({ type: 'none' });
    }
  }

  return (
    <div className="max-w-2xl space-y-3">
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

      {auth.type === 'none' && <p className="text-xs text-muted-foreground">{t('auth.noneHint')}</p>}

      {RUNNER_APPLIED.includes(auth.type) && (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {t('auth.runnerApplied')}
        </p>
      )}

      {auth.type === 'basic' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t('auth.username')} value={auth.username} onChange={(username) => onChange({ ...auth, username })} />
          <Field label={t('auth.password')} value={auth.password} onChange={(password) => onChange({ ...auth, password })} />
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
          <Field label={t('auth.prefix')} value={auth.prefix} onChange={(prefix) => onChange({ ...auth, prefix })} />
        </div>
      )}

      {auth.type === 'apiKey' && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label={t('auth.key')} value={auth.key} onChange={(key) => onChange({ ...auth, key })} />
          <Field label={t('auth.value')} value={auth.value} onChange={(value) => onChange({ ...auth, value })} />
          <Choice
            label={t('auth.addTo')}
            value={auth.addTo}
            options={[
              { value: 'header', label: t('auth.header') },
              { value: 'query', label: t('auth.query') },
            ]}
            onChange={(addTo) => onChange({ ...auth, addTo: addTo === 'query' ? 'query' : 'header' })}
          />
        </div>
      )}

      {(auth.type === 'customHeader' || auth.type === 'customQuery') && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t('auth.name')} value={auth.name} onChange={(name) => onChange({ ...auth, name })} />
          <Field label={t('auth.value')} value={auth.value} onChange={(value) => onChange({ ...auth, value })} />
        </div>
      )}

      {auth.type === 'digest' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t('auth.username')} value={auth.username} onChange={(username) => onChange({ ...auth, username })} />
          <Field label={t('auth.password')} value={auth.password} onChange={(password) => onChange({ ...auth, password })} />
          <Choice
            label={t('auth.algorithm')}
            value={auth.algorithm}
            options={DIGEST_ALGORITHMS.map((value) => ({ value, label: value }))}
            onChange={(algorithm) =>
              onChange({ ...auth, algorithm: algorithm as typeof auth.algorithm })
            }
          />
          <Choice
            label={t('auth.qop')}
            value={auth.qop}
            options={[
              { value: 'auth', label: 'auth' },
              { value: 'auth-int', label: 'auth-int' },
              { value: '', label: t('auth.qopNone') },
            ]}
            onChange={(qop) => onChange({ ...auth, qop })}
          />
        </div>
      )}

      {auth.type === 'jwt' && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Choice
              label={t('auth.algorithm')}
              value={auth.algorithm}
              options={JWT_ALGORITHMS.map((value) => ({ value, label: value }))}
              onChange={(algorithm) =>
                onChange({ ...auth, algorithm: algorithm as typeof auth.algorithm })
              }
            />
            <Field label={t('auth.prefix')} value={auth.headerPrefix} onChange={(headerPrefix) => onChange({ ...auth, headerPrefix })} />
            <Choice
              label={t('auth.addTo')}
              value={auth.addTo}
              options={[
                { value: 'header', label: t('auth.header') },
                { value: 'query', label: t('auth.query') },
              ]}
              onChange={(addTo) => onChange({ ...auth, addTo: addTo === 'query' ? 'query' : 'header' })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="jwt-secret">
              {auth.algorithm.startsWith('HS') ? t('auth.secret') : t('auth.privateKey')}
            </label>
            <Textarea
              id="jwt-secret"
              value={auth.secret}
              onChange={(event) => onChange({ ...auth, secret: event.target.value })}
              spellCheck={false}
              className="min-h-20 font-mono text-xs"
            />
            {auth.algorithm.startsWith('HS') && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={auth.secretBase64Encoded}
                  onChange={(event) => onChange({ ...auth, secretBase64Encoded: event.target.checked })}
                  className="h-3.5 w-3.5 rounded border-input accent-primary"
                />
                {t('auth.base64Secret')}
              </label>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="jwt-payload">
              {t('auth.payload')}
            </label>
            <Textarea
              id="jwt-payload"
              value={auth.payload}
              onChange={(event) => onChange({ ...auth, payload: event.target.value })}
              spellCheck={false}
              className="min-h-24 font-mono text-xs"
            />
          </div>
        </div>
      )}

      {auth.type === 'oauth2' && (
        <OAuth2Fields config={auth.config} onChange={(config) => onChange({ ...auth, config })} />
      )}

      {auth.type === 'awsSignature' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t('auth.accessKeyId')} value={auth.accessKeyId} onChange={(accessKeyId) => onChange({ ...auth, accessKeyId })} />
          <Field label={t('auth.secretAccessKey')} value={auth.secretAccessKey} onChange={(secretAccessKey) => onChange({ ...auth, secretAccessKey })} />
          <Field label={t('auth.region')} value={auth.region} onChange={(region) => onChange({ ...auth, region })} placeholder="us-east-1" />
          <Field label={t('auth.service')} value={auth.service} onChange={(service) => onChange({ ...auth, service })} placeholder="s3" />
          <Field
            label={t('auth.sessionToken')}
            value={auth.sessionToken}
            onChange={(sessionToken) => onChange({ ...auth, sessionToken })}
          />
        </div>
      )}
    </div>
  );
}

function OAuth2Fields({
  config,
  onChange,
}: {
  config: OAuth2Config;
  onChange: (config: OAuth2Config) => void;
}) {
  const t = useTranslations('apiStudio');
  const needsBrowser = BROWSER_GRANTS.has(config.grantType);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Choice
          label={t('auth.grantType')}
          value={config.grantType}
          options={OAUTH2_GRANT_TYPES.map((value) => ({ value, label: t(`auth.grants.${value}`) }))}
          onChange={(grantType) => onChange({ ...config, grantType: grantType as typeof config.grantType })}
        />
        <Choice
          label={t('auth.clientAuthentication')}
          value={config.clientAuthentication}
          options={[
            { value: 'body', label: t('auth.inBody') },
            { value: 'basic', label: t('auth.inHeader') },
          ]}
          onChange={(mode) =>
            onChange({ ...config, clientAuthentication: mode === 'basic' ? 'basic' : 'body' })
          }
        />
      </div>

      {needsBrowser && (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {t('auth.grantNeedsBrowser')}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t('auth.tokenUrl')} value={config.accessTokenUrl} onChange={(accessTokenUrl) => onChange({ ...config, accessTokenUrl })} />
        <Field label={t('auth.scope')} value={config.scope} onChange={(scope) => onChange({ ...config, scope })} />
        <Field label={t('auth.clientId')} value={config.clientId} onChange={(clientId) => onChange({ ...config, clientId })} />
        <Field label={t('auth.clientSecret')} value={config.clientSecret} onChange={(clientSecret) => onChange({ ...config, clientSecret })} />

        {config.grantType === 'password' && (
          <>
            <Field label={t('auth.username')} value={config.username} onChange={(username) => onChange({ ...config, username })} />
            <Field label={t('auth.password')} value={config.password} onChange={(password) => onChange({ ...config, password })} />
          </>
        )}

        {config.grantType === 'refresh_token' && (
          <Field label={t('auth.refreshToken')} value={config.refreshToken} onChange={(refreshToken) => onChange({ ...config, refreshToken })} />
        )}

        <Field
          label={t('auth.accessToken')}
          value={config.accessToken}
          placeholder="{{access_token}}"
          onChange={(accessToken) => onChange({ ...config, accessToken })}
        />
      </div>

      <p className="text-xs text-muted-foreground">{t('auth.accessTokenHint')}</p>
    </div>
  );
}

function emptyOAuth2(): OAuth2Config {
  return {
    grantType: 'client_credentials',
    authUrl: '',
    accessTokenUrl: '',
    clientId: '',
    clientSecret: '',
    scope: '',
    state: '',
    audience: '',
    resource: '',
    username: '',
    password: '',
    clientAuthentication: 'body',
    accessToken: '',
    refreshToken: '',
    expiresAt: null,
    addTo: 'header',
    headerPrefix: 'Bearer',
  };
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

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = `auth-choice-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 text-xs"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
