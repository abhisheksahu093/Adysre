import type { InvoiceDocument } from './types';

/**
 * The starting document. Concrete sample data (not empty fields) so the live
 * preview reads as a real invoice the moment the page opens, and so the totals
 * engine has something to compute. `id`s and dates are fixed strings - never
 * `Date.now()`/`Math.random()` at module load - so the module is deterministic.
 */
export const SAMPLE_DOCUMENT: InvoiceDocument = {
  docType: 'invoice',
  templateId: 'modern',
  number: 'INV-1024',
  issueDate: '2026-07-24',
  dueDate: '2026-08-07',
  currency: 'USD',
  from: {
    name: 'Acme Studio',
    email: 'billing@acme.studio',
    phone: '+1 555 010 2040',
    address: '18 Market Street, Suite 400\nSan Francisco, CA 94103',
    taxId: '',
  },
  to: {
    name: 'Northwind Traders',
    email: 'ap@northwind.co',
    phone: '',
    address: '900 Riverside Ave\nPortland, OR 97201',
    taxId: '',
  },
  items: [
    { id: 'i1', description: 'Brand identity system', quantity: 1, unitPrice: 4200 },
    { id: 'i2', description: 'Landing page design & build', quantity: 1, unitPrice: 3800 },
    { id: 'i3', description: 'Design retainer (hours)', quantity: 12, unitPrice: 145 },
  ],
  discount: { mode: 'percent', value: 10 },
  tax: { mode: 'exclusive', rate: 8.5, label: 'Tax' },
  shipping: 0,
  notes: 'Thank you for your business. Payment due within 14 days.',
  terms: 'Late payments accrue 1.5% monthly interest.',
  logo: null,
  pageSize: 'A4',
  orientation: 'portrait',
};
