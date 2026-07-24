import type { ScanRecord, ScanSummary } from './types';

/** Lower-cased host of a URL, or '' if it will not parse. The history key. */
export function scanHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

/** Reduce a full record to the projection a list endpoint returns. */
export function toSummary(record: ScanRecord): ScanSummary {
  return {
    id: record.id,
    createdAt: record.createdAt,
    host: record.host,
    url: record.result.url,
    finalUrl: record.result.finalUrl,
    overallScore: record.result.overallScore,
    findings: record.result.findings.length,
  };
}
