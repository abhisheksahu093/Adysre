import { randomUUID } from 'node:crypto';
import type { ScanContext } from '../dynamic/scan-capture';
import { generateSlug } from '../dynamic/slug';
import type {
  CreateQrInput,
  ListQrQuery,
  QrRecord,
  QrScanRecord,
  QrStore,
  UpdateQrPatch,
} from './types';

/**
 * In-memory dynamic-QR store - the default. Process-local, cleared on restart;
 * the file store persists and a future Prisma store is the production backend.
 * `idFactory`/`slugFactory` are injectable so tests are deterministic.
 */
export class MemoryQrStore implements QrStore {
  private readonly codes: QrRecord[] = [];
  private readonly scans: QrScanRecord[] = [];

  constructor(
    private readonly idFactory: () => string = randomUUID,
    private readonly slugFactory: () => string = generateSlug,
  ) {}

  private uniqueSlug(): string {
    let slug = this.slugFactory();
    while (this.codes.some((c) => c.slug === slug)) slug = this.slugFactory();
    return slug;
  }

  async create(tenantId: string, input: CreateQrInput): Promise<QrRecord> {
    const now = new Date().toISOString();
    const record: QrRecord = {
      id: this.idFactory(),
      tenantId,
      slug: this.uniqueSlug(),
      type: input.type,
      name: input.name,
      payload: input.payload,
      design: input.design,
      targetUrl: input.targetUrl,
      favorite: false,
      tags: input.tags ?? [],
      folderId: input.folderId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.codes.unshift(record);
    return record;
  }

  async list(tenantId: string, query: ListQrQuery = {}): Promise<QrRecord[]> {
    return this.codes.filter(
      (c) =>
        c.tenantId === tenantId &&
        (query.favorite === undefined || c.favorite === query.favorite) &&
        (query.folderId === undefined || c.folderId === query.folderId),
    );
  }

  async get(tenantId: string, id: string): Promise<QrRecord | null> {
    const record = this.codes.find((c) => c.id === id);
    return record && record.tenantId === tenantId ? record : null;
  }

  async update(tenantId: string, id: string, patch: UpdateQrPatch): Promise<QrRecord | null> {
    const record = this.codes.find((c) => c.id === id && c.tenantId === tenantId);
    if (!record) return null;
    Object.assign(record, patch, { updatedAt: new Date().toISOString() });
    return record;
  }

  async remove(tenantId: string, id: string): Promise<boolean> {
    const index = this.codes.findIndex((c) => c.id === id && c.tenantId === tenantId);
    if (index === -1) return false;
    this.codes.splice(index, 1);
    // Cascade the code's scans so analytics never reference a deleted code.
    for (let i = this.scans.length - 1; i >= 0; i -= 1) {
      if (this.scans[i]!.qrCodeId === id) this.scans.splice(i, 1);
    }
    return true;
  }

  async findBySlug(slug: string): Promise<QrRecord | null> {
    return this.codes.find((c) => c.slug === slug) ?? null;
  }

  async recordScan(
    qrCodeId: string,
    tenantId: string,
    context: ScanContext,
    now: Date = new Date(),
  ): Promise<QrScanRecord> {
    const record: QrScanRecord = {
      id: this.idFactory(),
      tenantId,
      qrCodeId,
      scannedAt: now.toISOString(),
      ...context,
    };
    this.scans.unshift(record);
    return record;
  }

  async listScans(tenantId: string, qrCodeId: string): Promise<QrScanRecord[]> {
    return this.scans.filter((s) => s.tenantId === tenantId && s.qrCodeId === qrCodeId);
  }
}
