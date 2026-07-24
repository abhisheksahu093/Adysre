import 'server-only';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ScanResult } from '../types';
import type { ScanListQuery, ScanRecord, ScanStore } from './types';
import { scanHost } from './keys';

/**
 * File-backed scan store - one JSON array on disk, newest first.
 *
 * The single-box persistence option: history survives a restart with no
 * database. Reads and writes go through the file each call, which is fine at
 * this scale but is NOT concurrency-safe across processes (last write wins); the
 * Prisma store is the answer when more than one instance writes. Records are
 * capped so the file cannot grow without bound.
 */
export class FileScanStore implements ScanStore {
  constructor(
    private readonly path: string,
    private readonly cap: number = 500,
    private readonly idFactory: () => string = randomUUID,
  ) {}

  private async readAll(): Promise<ScanRecord[]> {
    try {
      const raw = await readFile(this.path, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as ScanRecord[]) : [];
    } catch {
      // A missing or unreadable file is an empty history, not an error.
      return [];
    }
  }

  private async writeAll(records: ScanRecord[]): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(records.slice(0, this.cap)), 'utf8');
  }

  async save(tenantId: string, result: ScanResult, now: Date = new Date()): Promise<ScanRecord> {
    const record: ScanRecord = {
      id: this.idFactory(),
      tenantId,
      createdAt: now.toISOString(),
      host: scanHost(result.finalUrl),
      result,
    };
    const records = await this.readAll();
    records.unshift(record);
    await this.writeAll(records);
    return record;
  }

  async get(tenantId: string, id: string): Promise<ScanRecord | null> {
    const record = (await this.readAll()).find((record) => record.id === id);
    // A record owned by another tenant is invisible - the same as not existing.
    return record && record.tenantId === tenantId ? record : null;
  }

  async list(tenantId: string, query: ScanListQuery = {}): Promise<ScanRecord[]> {
    const filtered = (await this.readAll()).filter(
      (record) => record.tenantId === tenantId && (!query.host || record.host === query.host),
    );
    return query.limit != null ? filtered.slice(0, query.limit) : filtered;
  }
}
