/**
 * Report export - shared types.
 *
 * The platform advertises four export formats; three are pure text serializers
 * (JSON, CSV, Markdown) and ship here. PDF needs a rendering library and is the
 * remaining format - it will be a print-optimised report view or a server-side
 * renderer, and it plugs into `buildReport` the same way these do.
 */
export const REPORT_FORMATS = ['json', 'csv', 'markdown'] as const;
export type ReportFormat = (typeof REPORT_FORMATS)[number];

/** Narrow an arbitrary string to a supported export format. */
export function isReportFormat(value: string): value is ReportFormat {
  return (REPORT_FORMATS as readonly string[]).includes(value);
}

/** A built report: what the download endpoint streams back. */
export interface ReportFile {
  filename: string;
  contentType: string;
  body: string;
}
