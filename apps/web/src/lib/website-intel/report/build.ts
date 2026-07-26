import type { ScanRecord } from '../history/types';
import { isReportFormat, type ReportFile, type ReportFormat } from './types';
import { toCsvReport } from './csv';
import { toMarkdownReport } from './markdown';

/**
 * Build a downloadable report from a stored scan.
 *
 * The one place formats are dispatched; `buildReport` returns the bytes plus the
 * `content-type` and a filename the endpoint turns into a `Content-Disposition`.
 * Adding PDF later is another `case` here and nothing else.
 */

/** Safe, informative filename stem: host + scan date. */
function stem(record: ScanRecord): string {
  const host = record.host.replace(/[^a-z0-9.-]/gi, '_') || 'scan';
  const date = record.createdAt.slice(0, 10);
  return `website-intel-${host}-${date}`;
}

export function buildReport(record: ScanRecord, format: ReportFormat): ReportFile {
  switch (format) {
    case 'csv':
      return { filename: `${stem(record)}.csv`, contentType: 'text/csv; charset=utf-8', body: toCsvReport(record.result) };
    case 'markdown':
      return { filename: `${stem(record)}.md`, contentType: 'text/markdown; charset=utf-8', body: toMarkdownReport(record) };
    case 'json':
    default:
      return {
        filename: `${stem(record)}.json`,
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(record, null, 2),
      };
  }
}

export { isReportFormat };
export type { ReportFormat, ReportFile };
