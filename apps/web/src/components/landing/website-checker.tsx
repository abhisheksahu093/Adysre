'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Loader2, Radar, Search, ShieldAlert } from 'lucide-react';
import { cn } from 'adysre';
import type { ScanResult, Severity } from '@/lib/website-intel/types';
import { Link } from '@/i18n/navigation';
import { INTEL_ROUTE } from '@/data/website-intelligence';

/**
 * The landing-page website checker - a real, working scan on the public page.
 *
 * Posts to the anonymous {@link /api/website-intelligence/public-scan} endpoint
 * (rate-limited, no history) and renders a compact result inline: the overall
 * score, the per-category bars and the top findings. It is the honest demo of
 * the engine; the full dashboard, history and exports live behind sign-in at
 * {@link INTEL_ROUTE}, which the "see the full report" link points to.
 *
 * Deliberately lighter than the in-app `ScanConsole`: no persistence, no export
 * bar, a capped findings list. All copy is keys under `websiteIntel.*`.
 */

const SEVERITY_BADGE: Record<Severity, string> = {
  critical: 'border-destructive/30 bg-destructive/10 text-destructive',
  serious: 'border-destructive/30 bg-destructive/10 text-destructive',
  moderate: 'border-warning/30 bg-warning/10 text-warning',
  minor: 'border-border bg-muted text-muted-foreground',
  info: 'border-border bg-muted text-muted-foreground',
};

/** How many findings to show inline before pointing at the full report. */
const MAX_FINDINGS = 5;

function scoreTone(score: number): { text: string; bar: string } {
  if (score >= 90) return { text: 'text-success', bar: 'bg-success' };
  if (score >= 70) return { text: 'text-warning', bar: 'bg-warning' };
  return { text: 'text-destructive', bar: 'bg-destructive' };
}

type ScanResponse =
  | { success: true; data: ScanResult }
  | { success: false; code: string; message: string };

export function WebsiteChecker() {
  const t = useTranslations('websiteIntel');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!url.trim() || status === 'loading') return;

    setStatus('loading');
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/website-intelligence/public-scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = (await response.json()) as ScanResponse;

      if (!response.ok || !json.success) {
        const code = 'code' in json ? json.code : 'generic';
        setError(t.has(`console.errors.${code}`) ? t(`console.errors.${code}`) : t('console.errors.generic'));
        setStatus('error');
        return;
      }

      setResult(json.data);
      setStatus('done');
    } catch {
      setError(t('console.errors.generic'));
      setStatus('error');
    }
  }

  const overall = result ? scoreTone(result.overallScore) : null;
  const hiddenFindings = result ? Math.max(0, result.findings.length - MAX_FINDINGS) : 0;

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <label htmlFor="landing-scan-url" className="sr-only">
            {t('console.label')}
          </label>
          <input
            id="landing-scan-url"
            type="text"
            inputMode="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={t('scan.placeholder')}
            className="min-w-0 flex-1 bg-transparent py-3 font-mono text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || url.trim() === ''}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground',
            'transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Radar className="h-4 w-4" aria-hidden />
          )}
          {status === 'loading' ? t('console.scanning') : t('scan.button')}
        </button>
      </form>

      {status === 'error' && error && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {status === 'done' && result && overall && (
        <div className="mt-6 space-y-6 text-left" aria-live="polite">
          <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-border text-2xl font-bold tabular-nums',
                  overall.text,
                )}
              >
                {result.overallScore}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t('console.overall')}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">{result.finalUrl}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('console.scannedIn', { ms: result.timingMs })}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {result.categories.map((category) => {
                const tone = scoreTone(category.score);
                return (
                  <div key={category.category}>
                    <div className="flex items-baseline justify-between gap-2">
                      <dt className="text-xs text-muted-foreground">
                        {t(`console.categories.${category.category}`)}
                      </dt>
                      <dd className={cn('text-sm font-semibold tabular-nums', tone.text)}>
                        {category.score}
                      </dd>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full rounded-full', tone.bar)} style={{ width: `${category.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              {t('console.findingsTitle')}
              <span className="ml-2 font-normal text-muted-foreground">({result.findings.length})</span>
            </h3>

            {result.findings.length === 0 ? (
              <p className="mt-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                {t('console.noFindings')}
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {result.findings.slice(0, MAX_FINDINGS).map((finding) => (
                  <li key={finding.ruleId} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
                          SEVERITY_BADGE[finding.severity],
                        )}
                      >
                        {t(`console.severity.${finding.severity}`)}
                      </span>
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t(`console.categories.${finding.category}`)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{finding.description}</p>
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                      {finding.fix}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{t('console.browserNote')}</p>

          {/* Funnel: the compact demo hands off to the full app experience. */}
          <Link
            href={INTEL_ROUTE}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            {hiddenFindings > 0
              ? t('home.moreFindings', { count: hiddenFindings })
              : t('home.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
