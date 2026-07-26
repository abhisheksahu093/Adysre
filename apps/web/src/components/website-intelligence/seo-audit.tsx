'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, CheckCircle2, FileJson, FileSpreadsheet, Loader2, Printer, Search, ShieldAlert, XCircle } from 'lucide-react';
import { cn } from 'adysre';
import type { CheckStatus, SeoCategory, SeoCheck, SeoReport } from '@/lib/website-intel/seo/audit';

/**
 * SEO Audit — the second Website Intelligence tab. Posts a URL to the gated
 * `/seo-audit` endpoint (which reuses the scanner's fetch + fact extraction) and
 * renders the graded checklist, page stats and keyword density, with JSON/CSV
 * export and print. Error codes reuse the console's localized messages.
 */

const CATEGORY_LABELS: Record<SeoCategory, string> = {
  meta: 'Meta tags',
  content: 'Content',
  technical: 'Technical',
  social: 'Social',
  links: 'Links',
  security: 'Security',
};
const CATEGORY_ORDER: SeoCategory[] = ['meta', 'content', 'technical', 'social', 'links', 'security'];

const STATUS_STYLE: Record<CheckStatus, { icon: typeof CheckCircle2; tone: string }> = {
  pass: { icon: CheckCircle2, tone: 'text-success' },
  warn: { icon: AlertTriangle, tone: 'text-warning' },
  fail: { icon: XCircle, tone: 'text-destructive' },
};

function gradeTone(grade: string): string {
  if (grade.startsWith('A')) return 'text-success';
  if (grade === 'B' || grade === 'C') return 'text-warning';
  return 'text-destructive';
}

type Resp = { success: true; data: SeoReport } | { success: false; code: string; message: string };

function download(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(report: SeoReport): string {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const rows = [
    ['Category', 'Check', 'Status', 'Value', 'Recommendation'],
    ...report.checks.map((c) => [CATEGORY_LABELS[c.category], c.label, c.status, c.value, c.recommendation ?? '']),
  ];
  return rows.map((r) => r.map((x) => esc(String(x))).join(',')).join('\n');
}

export function SeoAudit({ placeholder }: { placeholder: string }) {
  const t = useTranslations('websiteIntel');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [report, setReport] = useState<SeoReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!url.trim() || status === 'loading') return;
    setStatus('loading');
    setError(null);
    setReport(null);
    try {
      const res = await fetch('/api/website-intelligence/seo-audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = (await res.json()) as Resp;
      if (!res.ok || !json.success) {
        const code = 'code' in json ? json.code : 'generic';
        setError(t.has(`console.errors.${code}`) ? t(`console.errors.${code}`) : t('console.errors.generic'));
        setStatus('error');
        return;
      }
      setReport(json.data);
      setStatus('done');
    } catch {
      setError(t('console.errors.generic'));
      setStatus('error');
    }
  }

  const slug = report ? report.finalUrl.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '-') : 'seo';

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary/50">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <label htmlFor="seo-url" className="sr-only">URL</label>
          <input
            id="seo-url"
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent py-3 font-mono text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || url.trim() === ''}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
          {status === 'loading' ? t('console.scanning') : 'Audit'}
        </button>
      </form>

      {status === 'error' && error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {status === 'done' && report && (
        <div className="space-y-6" aria-live="polite">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Printer className="h-3.5 w-3.5" aria-hidden /> Print / PDF
            </button>
            <button type="button" onClick={() => download(`seo-${slug}.json`, JSON.stringify(report, null, 2), 'application/json')} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <FileJson className="h-3.5 w-3.5" aria-hidden /> JSON
            </button>
            <button type="button" onClick={() => download(`seo-${slug}.csv`, toCsv(report), 'text/csv')} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden /> CSV
            </button>
          </div>

          <div id="seo-report" className="space-y-6">
            {/* Score + grade */}
            <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex items-center gap-5">
                <div className={cn('flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-border', gradeTone(report.grade))}>
                  <span className="text-3xl font-bold leading-none">{report.grade}</span>
                  <span className="mt-1 text-xs text-muted-foreground">{report.score}/100</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">SEO score</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{report.finalUrl}</p>
                  <div className="mt-2 flex gap-3 text-xs">
                    <span className="text-success">{report.summary.pass} passed</span>
                    <span className="text-warning">{report.summary.warn} warnings</span>
                    <span className="text-destructive">{report.summary.fail} failed</span>
                  </div>
                </div>
              </div>
              <dl className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                <Stat label="Words" value={report.stats.wordCount} />
                <Stat label="Images" value={report.stats.images} />
                <Stat label="Missing alt" value={report.stats.missingAlt} />
                <Stat label="Int. links" value={report.stats.internalLinks} />
                <Stat label="Ext. links" value={report.stats.externalLinks} />
                <Stat label="H1" value={report.stats.h1Count} />
                <Stat label="Page KB" value={report.stats.pageSizeKb} />
                <Stat label="JSON-LD" value={report.stats.jsonLdBlocks} />
              </dl>
            </div>

            {/* Checks by category */}
            {CATEGORY_ORDER.filter((cat) => report.checks.some((c) => c.category === cat)).map((cat) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold">{CATEGORY_LABELS[cat]}</h3>
                <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {report.checks.filter((c) => c.category === cat).map((c) => (
                    <CheckRow key={c.id} check={c} />
                  ))}
                </ul>
              </div>
            ))}

            {/* Keywords */}
            {report.keywords.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold">Top keywords</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {report.keywords.map((k) => (
                    <li key={k.word} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
                      <span className="font-medium">{k.word}</span>
                      <span className="ml-1.5 text-muted-foreground">{k.count} · {k.density}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #seo-report, #seo-report * { visibility: visible !important; }
  #seo-report { position: absolute; left: 0; top: 0; width: 100%; }
}`;

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 text-center">
      <dd className="text-lg font-bold tabular-nums">{value}</dd>
      <dt className="mt-0.5 text-[11px] text-muted-foreground">{label}</dt>
    </div>
  );
}

function CheckRow({ check }: { check: SeoCheck }) {
  const { icon: Icon, tone } = STATUS_STYLE[check.status];
  return (
    <li className="flex items-start gap-3 bg-card px-4 py-2.5">
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tone)} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium">{check.label}</span>
          <span className="font-mono text-xs text-muted-foreground">{check.value}</span>
        </div>
        {check.recommendation && <p className="mt-0.5 text-xs text-muted-foreground">{check.recommendation}</p>}
      </div>
    </li>
  );
}
