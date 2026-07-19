import type { Metadata } from 'next';
import { Code2, Link2, KeyRound, Braces, SlidersHorizontal } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.apiReference' });
  return { title: t('title'), description: t('description') };
}

const BASE_URL = '/api/v1';

const SUCCESS_EXAMPLE = `{
  "success": true,
  "message": "OK",
  "data": { },
  "meta": { "page": 1, "pageSize": 20, "total": 42 }
}`;

const ERROR_EXAMPLE = `{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "The request could not be processed."
}`;

/** Method + path are code, not prose; the human description is translated. */
const ENDPOINTS = [
  { method: 'POST', path: '/auth/login', key: 'login' },
  { method: 'GET', path: '/me', key: 'me' },
  { method: 'GET', path: '/components', key: 'components' },
  { method: 'GET', path: '/components/:slug', key: 'component' },
  { method: 'GET', path: '/icons', key: 'icons' },
  { method: 'GET', path: '/palettes', key: 'palettes' },
] as const;

const METHOD_TONE: Record<string, string> = {
  GET: 'bg-primary/10 text-primary',
  POST: 'bg-success/10 text-success',
  PUT: 'bg-warning/10 text-warning',
  DELETE: 'bg-danger/10 text-danger',
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Code2;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ApiDocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.apiReference' });

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            aria-hidden
          >
            <Code2 className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{t('description')}</p>
      </header>

      <Section icon={Link2} title={t('baseUrlTitle')}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t('baseUrlNote')}</p>
        <CodeBlock>{BASE_URL}</CodeBlock>
      </Section>

      <Section icon={KeyRound} title={t('authTitle')}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t('authNote')}</p>
      </Section>

      <Section icon={Braces} title={t('responseTitle')}>
        <p className="text-sm leading-relaxed text-muted-foreground">{t('responseNote')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('successLabel')}
            </p>
            <CodeBlock>{SUCCESS_EXAMPLE}</CodeBlock>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('errorLabel')}
            </p>
            <CodeBlock>{ERROR_EXAMPLE}</CodeBlock>
          </div>
        </div>
      </Section>

      <Section icon={SlidersHorizontal} title={t('conventionsTitle')}>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{t('pagination')}</span>
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
              ?page=1&amp;pageSize=20
            </code>
          </li>
          <li className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{t('filtering')}</span>
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
              ?filter[status]=active
            </code>
          </li>
          <li className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{t('sorting')}</span>
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
              ?sort=createdAt:desc
            </code>
          </li>
        </ul>
      </Section>

      <Section icon={Code2} title={t('endpointsTitle')}>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {ENDPOINTS.map((e) => (
            <div key={`${e.method} ${e.path}`} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`w-14 shrink-0 rounded px-1.5 py-0.5 text-center text-[11px] font-semibold ${METHOD_TONE[e.method] ?? 'bg-muted text-muted-foreground'}`}
              >
                {e.method}
              </span>
              <code className="shrink-0 font-mono text-xs text-foreground">{e.path}</code>
              <span className="ml-auto hidden truncate text-xs text-muted-foreground sm:block">
                {t(`endpoints.${e.key}`)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t('endpointsNote')}</p>
      </Section>
    </div>
  );
}
