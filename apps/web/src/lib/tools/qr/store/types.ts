import type { QrDesign } from '../designer';
import type { ScanContext } from '../dynamic/scan-capture';

/**
 * Dynamic QR persistence - the storage seam. Mirrors the Prisma `qr_codes` /
 * `qr_scans` models (packages/database) so an in-memory store today and a
 * Postgres store later satisfy the same contract. Every management method is
 * scoped by `tenantId`; `findBySlug` is the one deliberate cross-tenant read,
 * because the public `/q/<slug>` redirect has no session.
 */

export interface QrRecord {
  id: string;
  tenantId: string;
  slug: string;
  type: string;
  name: string;
  payload: Record<string, string>;
  design: QrDesign;
  /** Redirect target for a dynamic QR; null for content-only payloads. */
  targetUrl: string | null;
  favorite: boolean;
  tags: string[];
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QrScanRecord extends ScanContext {
  id: string;
  tenantId: string;
  qrCodeId: string;
  scannedAt: string;
}

export interface CreateQrInput {
  type: string;
  name: string;
  payload: Record<string, string>;
  design: QrDesign;
  targetUrl: string | null;
  tags?: string[];
  folderId?: string | null;
}

export interface UpdateQrPatch {
  name?: string;
  favorite?: boolean;
  tags?: string[];
  folderId?: string | null;
  payload?: Record<string, string>;
  design?: QrDesign;
  targetUrl?: string | null;
}

export interface ListQrQuery {
  favorite?: boolean;
  folderId?: string | null;
}

export interface QrStore {
  create(tenantId: string, input: CreateQrInput): Promise<QrRecord>;
  list(tenantId: string, query?: ListQrQuery): Promise<QrRecord[]>;
  get(tenantId: string, id: string): Promise<QrRecord | null>;
  update(tenantId: string, id: string, patch: UpdateQrPatch): Promise<QrRecord | null>;
  remove(tenantId: string, id: string): Promise<boolean>;
  /** Public slug resolution for the redirect - cross-tenant by design. */
  findBySlug(slug: string): Promise<QrRecord | null>;
  recordScan(qrCodeId: string, tenantId: string, context: ScanContext, now?: Date): Promise<QrScanRecord>;
  listScans(tenantId: string, qrCodeId: string): Promise<QrScanRecord[]>;
}
