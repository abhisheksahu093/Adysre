import { randomUUID } from 'node:crypto';
import type { ScanResult } from '../types';
import type { ScanListQuery, ScanRecord, ScanStore } from './types';
import { scanHost } from './keys';

/**
 * In-memory scan store - the default.
 *
 * Records live in a process-local array, newest first, so history works out of
 * the box with nothing to provision. It is not shared across instances and does
 * not survive a restart; the file and (future) Prisma stores exist for when
 * that matters. `idFactory` is injectable so tests get deterministic ids.
 */
export class MemoryScanStore implements ScanStore {
  private readonly records: ScanRecord[] = [];

  constructor(private readonly idFactory: () => string = randomUUID) {}

  async save(tenantId: string, result: ScanResult, now: Date = new Date()): Promise<ScanRecord> {
    const record: ScanRecord = {
      id: this.idFactory(),
      tenantId,
      createdAt: now.toISOString(),
      host: scanHost(result.finalUrl),
      result,
    };
    this.records.unshift(record);
    return record;
  }

  async get(tenantId: string, id: string): Promise<ScanRecord | null> {
    const record = this.records.find((record) => record.id === id);
    // A record owned by another tenant is invisible - the same as not existing.
    return record && record.tenantId === tenantId ? record : null;
  }

  async list(tenantId: string, query: ScanListQuery = {}): Promise<ScanRecord[]> {
    const filtered = this.records.filter(
      (record) => record.tenantId === tenantId && (!query.host || record.host === query.host),
    );
    return query.limit != null ? filtered.slice(0, query.limit) : filtered;
  }
}
