/**
 * The document model for the invoice / business-document generator.
 *
 * One shape covers the whole family (invoice, quotation, receipt, proforma, …);
 * a document's `docType` selects labels and defaults from the registry, and its
 * `templateId` selects the look. Money is stored as plain numbers in the
 * currency's major unit; all arithmetic goes through `totals.ts` so rounding is
 * defined in exactly one place.
 */

export interface Party {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  /** GSTIN / VAT / tax registration number, shown when present. */
  taxId?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type DiscountMode = 'none' | 'percent' | 'fixed';
/** exclusive = tax added on top; inclusive = tax already in the prices. */
export type TaxMode = 'none' | 'exclusive' | 'inclusive';
export type PageSize = 'A4' | 'Letter' | 'Legal';
export type Orientation = 'portrait' | 'landscape';

export interface InvoiceDocument {
  docType: string;
  templateId: string;
  number: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  from: Party;
  to: Party;
  items: LineItem[];
  discount: { mode: DiscountMode; value: number };
  tax: { mode: TaxMode; rate: number; label: string };
  shipping: number;
  notes: string;
  terms: string;
  /** Data-URL logo, or null. */
  logo: string | null;
  pageSize: PageSize;
  orientation: Orientation;
}
