import { randomUUID } from 'node:crypto';
import type { ScheduleInput, SchedulePatch, ScheduleRecord, ScheduleStore } from './types';
import { nextRun } from './cadence';

/**
 * In-memory schedule store - the default. Process-local, not shared across
 * instances, cleared on restart; the file (and future Prisma) store cover the
 * cases where that matters. `idFactory` is injectable for deterministic tests.
 */
export class MemoryScheduleStore implements ScheduleStore {
  private readonly records: ScheduleRecord[] = [];

  constructor(private readonly idFactory: () => string = randomUUID) {}

  async create(
    tenantId: string,
    input: ScheduleInput,
    now: Date = new Date(),
  ): Promise<ScheduleRecord> {
    const record: ScheduleRecord = {
      id: this.idFactory(),
      tenantId,
      url: input.url,
      cadence: input.cadence,
      active: true,
      createdAt: now.toISOString(),
      lastRunAt: null,
      nextRunAt: nextRun(input.cadence, now),
      lastScanId: null,
    };
    this.records.unshift(record);
    return record;
  }

  async get(tenantId: string, id: string): Promise<ScheduleRecord | null> {
    const record = this.records.find((r) => r.id === id);
    return record && record.tenantId === tenantId ? record : null;
  }

  async list(tenantId: string): Promise<ScheduleRecord[]> {
    return this.records.filter((r) => r.tenantId === tenantId);
  }

  async listAll(): Promise<ScheduleRecord[]> {
    return this.records.slice();
  }

  async update(
    tenantId: string,
    id: string,
    patch: SchedulePatch,
  ): Promise<ScheduleRecord | null> {
    const record = this.records.find((r) => r.id === id && r.tenantId === tenantId);
    if (!record) return null;
    Object.assign(record, patch);
    return record;
  }

  async remove(tenantId: string, id: string): Promise<boolean> {
    const index = this.records.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) return false;
    this.records.splice(index, 1);
    return true;
  }
}
