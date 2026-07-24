'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download } from 'lucide-react';
import type { ScanSummary } from '@/lib/website-intel/history/types';

/**
 * The "Export any report" bar — working format buttons for the latest scan.
 *
 * There is nothing to export until a scan exists, so this reads the most recent
 * scan from history and turns each format into a real download: CSV/JSON/
 * Markdown hit the report endpoint, PDF opens the printable report page (the
 * same wiring the scan result uses up top). With no scan yet the buttons are
 * disabled and the section explains why. Re-checks on window focus so a scan
 * run elsewhere on the page lights the buttons up without a reload.
 */

/** format label → how it exports. `page` opens the printable report; the rest download. */
const FORMATS = [
  { label: 'PDF', kind: 'page' },
  { label: 'CSV', kind: 'csv' },
  { label: 'JSON', kind: 'json' },
  { label: 'Markdown', kind: 'markdown' },
] as const;

const CHIP =
  'inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 font-mono text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function ReportExport() {
  const t = useTranslations('websiteIntel');
  const [latestId, setLatestId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/website-intelligence/scans?limit=1');
      const json = (await response.json()) as { success: boolean; data?: ScanSummary[] };
      setLatestId(json.success && json.data?.[0] ? json.data[0].id : null);
    } catch {
      /* leave the buttons as they are; a failed poll is not an error to show. */
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  function hrefFor(kind: (typeof FORMATS)[number]['kind']): string {
    return kind === 'page'
      ? `/website-intelligence-report/${latestId}`
      : `/api/website-intelligence/scans/${latestId}/report?format=${kind}`;
  }

  return (
    <div className="mt-6 space-y-3">
      <ul className="flex flex-wrap gap-2">
        {FORMATS.map(({ label, kind }) =>
          latestId ? (
            <li key={label}>
              <a
                href={hrefFor(kind)}
                {...(kind === 'page'
                  ? { target: '_blank', rel: 'noreferrer' }
                  : { download: true })}
                className={CHIP}
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                {label}
              </a>
            </li>
          ) : (
            <li key={label}>
              <span className={`${CHIP} cursor-not-allowed opacity-50`} aria-disabled>
                <Download className="h-3.5 w-3.5" aria-hidden />
                {label}
              </span>
            </li>
          ),
        )}
      </ul>
      {!latestId && <p className="text-xs text-muted-foreground">{t('reportsEmpty')}</p>}
    </div>
  );
}
