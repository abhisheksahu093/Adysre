import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getScanStore } from '@/lib/website-intel/history/store';
import { PrintButton } from '@/components/website-intelligence/print-button';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/website-intel/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * The printable scan report - the PDF export.
 *
 * Sits OUTSIDE the `(app)` group (like the template preview) so it carries no
 * sidebar or topbar: a report should print as a clean document. There is no PDF
 * library; the print stylesheet below plus the browser's "Save as PDF" is the
 * export, which is dependency-free and works offline.
 *
 * Server Component. It reads the record straight from the store by id and 404s
 * when it is unknown.
 */
export default async function WebsiteIntelligenceReportPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  // A report renders full scan results, so it is authenticated-read like the
  // API. Redirect (not 404) an unauthenticated visitor, so a real report link
  // still resolves once they sign in.
  const session = await getSession();
  if (!session) {
    redirect({ href: '/login', locale });
    return null;
  }

  // Scoped to the viewer's org: a report id belonging to another tenant reads as
  // not-found, so a guessed link cannot expose another org's scan.
  const record = await getScanStore().get(session.tenantId, id);
  if (!record) notFound();

  const t = await getTranslations({ locale, namespace: 'websiteIntel.report' });
  const c = await getTranslations({ locale, namespace: 'websiteIntel.console' });
  const { result } = record;
  const vitals = result.metrics.webVitals;
  const vitalRows: Array<[string, number | undefined, string]> = [
    ['LCP', vitals?.lcp, ' ms'],
    ['INP', vitals?.inp, ' ms'],
    ['CLS', vitals?.cls, ''],
    ['FCP', vitals?.fcp, ' ms'],
    ['TBT', vitals?.tbt, ' ms'],
    ['TTFB', vitals?.ttfb, ' ms'],
  ].filter((row): row is [string, number, string] => row[1] != null);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-foreground">
      <style>{`
        @media print {
          [data-print-hide] { display: none !important; }
          @page { margin: 16mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <header className="flex items-start justify-between gap-4 border-b border-border pb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-1 truncate font-mono text-sm text-muted-foreground">{result.finalUrl}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('scanned', { date: new Date(record.createdAt).toLocaleString(locale) })}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="text-right">
            <div className="text-4xl font-bold tabular-nums">{result.overallScore}</div>
            <div className="text-xs text-muted-foreground">{c('overall')}</div>
          </div>
          <PrintButton label={t('print')} />
        </div>
      </header>

      {/* Scores */}
      <section className="mt-8">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {result.categories.map((category) => (
              <tr key={category.category} className="border-b border-border">
                <td className="py-2">{c(`categories.${category.category}`)}</td>
                <td className="py-2 text-right font-semibold tabular-nums">{category.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Web Vitals */}
      {vitalRows.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {c('webVitalsTitle')}
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {vitalRows.map(([label, value, unit]) => (
              <div key={label} className="rounded-lg border border-border p-3 text-center">
                <div className="text-lg font-bold tabular-nums">
                  {value}
                  <span className="text-xs font-normal text-muted-foreground">{unit}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technologies */}
      {result.technologies.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {c('technologiesTitle')}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{result.technologies.join(' · ')}</p>
        </section>
      )}

      {/* Findings */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {c('findingsTitle')} ({result.findings.length})
        </h2>
        {result.findings.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{c('noFindings')}</p>
        ) : (
          <ol className="mt-4 space-y-4">
            {result.findings.map((finding) => (
              <li key={finding.ruleId} className="break-inside-avoid border-b border-border pb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded border border-border px-1.5 py-0.5 font-medium uppercase tracking-wide">
                    {c(`severity.${finding.severity}`)}
                  </span>
                  <span className="text-muted-foreground">{c(`categories.${finding.category}`)}</span>
                  {finding.estimatedSavings && (
                    <span className="font-mono text-muted-foreground">{finding.estimatedSavings}</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-medium">{finding.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">{finding.fix}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{finding.impact}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <footer className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground">
        {t('generatedBy')}
      </footer>
    </div>
  );
}
