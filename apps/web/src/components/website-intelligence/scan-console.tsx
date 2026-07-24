'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Clock, Download, Loader2, Radar, Search, ShieldAlert } from 'lucide-react';
import { cn } from 'adysre';
import type { ScanResult, Severity, WebVitals } from '@/lib/website-intel/types';
import type { ScanComparison, ScanRecord, ScanSummary } from '@/lib/website-intel/history/types';

/**
 * The working scan console.
 *
 * A real client of the scan API: it posts a URL, renders the overall score, the
 * per-category scores, the detected technologies and the ranked recommendations,
 * and now the history the platform keeps - a comparison against the site's
 * previous scan and a list of recent scans you can reopen.
 *
 * This is the browserless slice (SEO, security, HTML, assets, best practices),
 * so the note under the score stays honest about what is not yet measured. All
 * copy is keys under `websiteIntel.console.*`; server error codes are mapped to
 * localized messages here rather than shown raw.
 */

const SEVERITY_BADGE: Record<Severity, string> = {
  critical: 'border-destructive/30 bg-destructive/10 text-destructive',
  serious: 'border-destructive/30 bg-destructive/10 text-destructive',
  moderate: 'border-warning/30 bg-warning/10 text-warning',
  minor: 'border-border bg-muted text-muted-foreground',
  info: 'border-border bg-muted text-muted-foreground',
};

function scoreTone(score: number): { text: string; bar: string } {
  if (score >= 90) return { text: 'text-success', bar: 'bg-success' };
  if (score >= 70) return { text: 'text-warning', bar: 'bg-warning' };
  return { text: 'text-destructive', bar: 'bg-destructive' };
}

type ScanResponse =
  | { success: true; data: ScanResult; comparison: ScanComparison | null; record: { id: string } | null }
  | { success: false; code: string; message: string };

const EXPORT_FORMATS = [
  { format: 'json', label: 'JSON' },
  { format: 'csv', label: 'CSV' },
  { format: 'markdown', label: 'Markdown' },
] as const;

export function ScanConsole({ placeholder }: { placeholder: string }) {
  const t = useTranslations('websiteIntel.console');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [comparison, setComparison] = useState<ScanComparison | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanSummary[]>([]);
  const [recordId, setRecordId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/website-intelligence/scans?limit=8');
      const json = (await response.json()) as { success: boolean; data?: ScanSummary[] };
      if (json.success && json.data) setHistory(json.data);
    } catch {
      /* history is a nicety; a failed load just leaves the list as it was. */
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!url.trim() || status === 'loading') return;

    setStatus('loading');
    setError(null);
    setResult(null);
    setComparison(null);
    setRecordId(null);

    try {
      const response = await fetch('/api/website-intelligence/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = (await response.json()) as ScanResponse;

      if (!response.ok || !json.success) {
        const code = 'code' in json ? json.code : 'generic';
        setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : t('errors.generic'));
        setStatus('error');
        return;
      }

      setResult(json.data);
      setComparison(json.comparison);
      setRecordId(json.record?.id ?? null);
      setStatus('done');
      void loadHistory();
    } catch {
      setError(t('errors.generic'));
      setStatus('error');
    }
  }

  async function openRecord(id: string) {
    try {
      const response = await fetch(`/api/website-intelligence/scans/${id}`);
      const json = (await response.json()) as { success: boolean; data?: ScanRecord };
      if (json.success && json.data) {
        setResult(json.data.result);
        setComparison(null);
        setRecordId(id);
        setError(null);
        setStatus('done');
      }
    } catch {
      /* reopening is best-effort. */
    }
  }

  const overall = result ? scoreTone(result.overallScore) : null;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <label htmlFor="wi-scan-url" className="sr-only">
            {t('label')}
          </label>
          <input
            id="wi-scan-url"
            type="text"
            inputMode="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={placeholder}
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
          {status === 'loading' ? t('scanning') : t('label')}
        </button>
      </form>

      {status === 'error' && error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {status === 'done' && result && overall && (
        <div className="space-y-8" aria-live="polite">
          {/* Overall + categories */}
          <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-border text-3xl font-bold tabular-nums',
                  overall.text,
                )}
              >
                {result.overallScore}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t('overall')}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">{result.finalUrl}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t('scannedIn', { ms: result.timingMs })}</p>
                {comparison && <ComparisonChip comparison={comparison} />}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {result.categories.map((category) => {
                const tone = scoreTone(category.score);
                return (
                  <div key={category.category}>
                    {/* Fixed min-height reserves room for a two-line label ("Best
                        practices"), so every bar below sits on the same line and
                        the row stays aligned whether a label wraps or not. */}
                    <div className="flex min-h-[2.25rem] items-start justify-between gap-2">
                      <dt className="text-xs leading-snug text-muted-foreground">
                        {t(`categories.${category.category}`)}
                      </dt>
                      <dd className={cn('text-sm font-semibold tabular-nums', tone.text)}>{category.score}</dd>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full rounded-full', tone.bar)} style={{ width: `${category.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>

          {recordId && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{t('export')}:</span>
              {EXPORT_FORMATS.map(({ format, label }) => (
                <a
                  key={format}
                  href={`/api/website-intelligence/scans/${recordId}/report?format=${format}`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  {label}
                </a>
              ))}
              {/* PDF is produced by the printable report page's "Save as PDF". */}
              <a
                href={`/website-intelligence-report/${recordId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                PDF
              </a>
            </div>
          )}

          {result.metrics.webVitals && (
            <WebVitalsRow vitals={result.metrics.webVitals} title={t('webVitalsTitle')} />
          )}

          <p className="text-xs text-muted-foreground">{t('browserNote')}</p>

          {/* Technologies */}
          {result.technologies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">{t('technologiesTitle')}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-lg border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Findings */}
          <div>
            <h3 className="text-sm font-semibold">
              {t('findingsTitle')}
              <span className="ml-2 font-normal text-muted-foreground">({result.findings.length})</span>
            </h3>

            {result.findings.length === 0 ? (
              <p className="mt-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                {t('noFindings')}
              </p>
            ) : (
              <ul className="mt-3 grid gap-3 lg:grid-cols-2">
                {result.findings.map((finding) => (
                  <li key={finding.ruleId} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
                          SEVERITY_BADGE[finding.severity],
                        )}
                      >
                        {t(`severity.${finding.severity}`)}
                      </span>
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t(`categories.${finding.category}`)}
                      </span>
                      {finding.estimatedSavings && (
                        <span className="font-mono text-[11px] text-primary">{finding.estimatedSavings}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{finding.description}</p>
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                      {finding.fix}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{finding.impact}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Recent scans */}
      <div>
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
          {t('history.title')}
        </h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{t('history.empty')}</p>
        ) : (
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
            {history.map((item) => {
              const tone = scoreTone(item.overallScore);
              return (
                <li key={item.id} className="flex items-center gap-3 bg-card px-4 py-2.5">
                  <span className={cn('w-8 shrink-0 text-sm font-bold tabular-nums', tone.text)}>
                    {item.overallScore}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{item.host}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => void openRecord(item.id)}
                    className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t('history.view')}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Core Web Vitals tiles, shown only when a browser run measured them. */
function WebVitalsRow({ vitals, title }: { vitals: WebVitals; title: string }) {
  const rows: Array<[string, number | undefined, string]> = [
    ['LCP', vitals.lcp, 'ms'],
    ['INP', vitals.inp, 'ms'],
    ['CLS', vitals.cls, ''],
    ['FCP', vitals.fcp, 'ms'],
    ['TBT', vitals.tbt, 'ms'],
    ['TTFB', vitals.ttfb, 'ms'],
  ];
  const present = rows.filter((row): row is [string, number, string] => row[1] != null);
  if (present.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <dl className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {present.map(([label, value, unit]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
            <dd className="text-lg font-bold tabular-nums">
              {value}
              <span className="text-xs font-normal text-muted-foreground">{unit}</span>
            </dd>
            <dt className="mt-0.5 text-[11px] text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The "+6 vs previous scan" chip, coloured by direction. */
function ComparisonChip({ comparison }: { comparison: ScanComparison }) {
  const t = useTranslations('websiteIntel.console');
  const delta = comparison.overallDelta;
  const tone = delta > 0 ? 'text-success' : delta < 0 ? 'text-destructive' : 'text-muted-foreground';

  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className={cn('font-semibold tabular-nums', tone)}>
        {delta > 0 ? '+' : ''}
        {delta}
      </span>
      <span className="text-muted-foreground">{t('history.vsPrevious')}</span>
      {comparison.resolved.length > 0 && (
        <span className="text-success">{t('history.fixed', { count: comparison.resolved.length })}</span>
      )}
      {comparison.introduced.length > 0 && (
        <span className="text-destructive">{t('history.appeared', { count: comparison.introduced.length })}</span>
      )}
    </p>
  );
}
