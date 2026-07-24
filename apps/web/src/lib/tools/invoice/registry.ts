import type { TaxMode } from './types';

/**
 * Document-type registry - the catalogue of documents the generator produces.
 *
 * Each entry sets the label, the number prefix, whether a due date and tax are
 * relevant, and the default tax treatment. The product spec lists 60+ document
 * types (invoices, quotations, receipts, orders, vouchers, …); they are all this
 * same shape with different defaults, so extending the catalogue is appending
 * entries here - the editor, preview and PDF are generic over `DocType`. The set
 * below is a representative slice across the main groups.
 */

export type DocCategory = 'invoices' | 'quotations' | 'receipts' | 'orders';

export interface DocType {
  id: string;
  category: DocCategory;
  label: string;
  numberPrefix: string;
  showDueDate: boolean;
  defaultTaxMode: TaxMode;
  defaultTaxLabel: string;
}

export const DOC_TYPES: readonly DocType[] = [
  { id: 'invoice', category: 'invoices', label: 'Invoice', numberPrefix: 'INV', showDueDate: true, defaultTaxMode: 'exclusive', defaultTaxLabel: 'Tax' },
  { id: 'gst-invoice', category: 'invoices', label: 'GST Invoice', numberPrefix: 'GST', showDueDate: true, defaultTaxMode: 'exclusive', defaultTaxLabel: 'GST' },
  { id: 'vat-invoice', category: 'invoices', label: 'VAT Invoice', numberPrefix: 'VAT', showDueDate: true, defaultTaxMode: 'exclusive', defaultTaxLabel: 'VAT' },
  { id: 'proforma', category: 'invoices', label: 'Proforma Invoice', numberPrefix: 'PRO', showDueDate: true, defaultTaxMode: 'exclusive', defaultTaxLabel: 'Tax' },
  { id: 'commercial', category: 'invoices', label: 'Commercial Invoice', numberPrefix: 'CI', showDueDate: false, defaultTaxMode: 'none', defaultTaxLabel: 'Tax' },
  { id: 'quotation', category: 'quotations', label: 'Quotation', numberPrefix: 'QUO', showDueDate: false, defaultTaxMode: 'exclusive', defaultTaxLabel: 'Tax' },
  { id: 'estimate', category: 'quotations', label: 'Estimate', numberPrefix: 'EST', showDueDate: false, defaultTaxMode: 'exclusive', defaultTaxLabel: 'Tax' },
  { id: 'receipt', category: 'receipts', label: 'Payment Receipt', numberPrefix: 'RCP', showDueDate: false, defaultTaxMode: 'none', defaultTaxLabel: 'Tax' },
  { id: 'cash-receipt', category: 'receipts', label: 'Cash Receipt', numberPrefix: 'CR', showDueDate: false, defaultTaxMode: 'none', defaultTaxLabel: 'Tax' },
  { id: 'purchase-order', category: 'orders', label: 'Purchase Order', numberPrefix: 'PO', showDueDate: true, defaultTaxMode: 'exclusive', defaultTaxLabel: 'Tax' },
  { id: 'sales-order', category: 'orders', label: 'Sales Order', numberPrefix: 'SO', showDueDate: true, defaultTaxMode: 'exclusive', defaultTaxLabel: 'Tax' },
  { id: 'delivery-note', category: 'orders', label: 'Delivery Note', numberPrefix: 'DN', showDueDate: false, defaultTaxMode: 'none', defaultTaxLabel: 'Tax' },
];

export const DOC_TYPES_BY_ID: Record<string, DocType> = Object.fromEntries(
  DOC_TYPES.map((d) => [d.id, d]),
);

export const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  invoices: 'Invoices',
  quotations: 'Quotes & Estimates',
  receipts: 'Receipts',
  orders: 'Orders & Delivery',
};
