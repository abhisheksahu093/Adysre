import type { ScanResult } from '../types';
import type { ScanComparison, ScanRecord, ScanStore } from './types';
import { scanHost } from './keys';
import { compareScans } from './compare';

/**
 * Record a scan and diff it against the site's previous scan.
 *
 * Store-agnostic: it takes any `ScanStore`, so the same logic serves the
 * in-memory, file and future Prisma backends. The previous scan is read BEFORE
 * saving the new one, so the comparison is against genuine history rather than
 * the record we are about to write.
 */
export async function recordScan(
  store: ScanStore,
  tenantId: string,
  result: ScanResult,
  now: Date = new Date(),
): Promise<{ record: ScanRecord; comparison: ScanComparison | null }> {
  const host = scanHost(result.finalUrl);
  const [previous] = await store.list(tenantId, { host, limit: 1 });
  const record = await store.save(tenantId, result, now);
  const comparison = previous
    ? compareScans(previous.result, result, previous.id, previous.createdAt)
    : null;
  return { record, comparison };
}
