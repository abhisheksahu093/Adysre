import type { ScanResult } from '../types';
import type { ScanComparison } from '../history/types';
import type { NotifyEvent } from './types';

/** Build a notification event from a completed scan. Pure. */
export function eventFromScan(
  result: ScanResult,
  scanId: string | null,
  comparison: ScanComparison | null,
  at: Date,
): NotifyEvent {
  return {
    kind: 'scan.completed',
    url: result.finalUrl,
    scanId,
    overallScore: result.overallScore,
    overallDelta: comparison ? comparison.overallDelta : null,
    findings: result.findings.length,
    critical: result.findings.filter((f) => f.severity === 'critical').length,
    serious: result.findings.filter((f) => f.severity === 'serious').length,
    at: at.toISOString(),
  };
}
