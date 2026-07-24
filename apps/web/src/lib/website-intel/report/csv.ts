import type { ScanResult } from '../types';

/**
 * CSV export of a scan's findings - one row per recommendation, the shape a
 * spreadsheet or a ticketing import expects. Every field is escaped so a comma,
 * quote or newline in the copy cannot break the columns.
 */

const COLUMNS = ['ruleId', 'category', 'severity', 'description', 'fix', 'impact', 'estimatedSavings'] as const;

/** RFC 4180 escaping: wrap in quotes and double any inner quote when needed. */
function escapeCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsvReport(result: ScanResult): string {
  const header = COLUMNS.join(',');
  const rows = result.findings.map((finding) =>
    COLUMNS.map((column) => escapeCell(finding[column] ?? '')).join(','),
  );
  return [header, ...rows].join('\r\n') + '\r\n';
}
