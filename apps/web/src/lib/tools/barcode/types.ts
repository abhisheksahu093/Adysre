/**
 * Barcode formats the generator supports. `jsFormat` is the string JsBarcode
 * expects; everything else drives the UI and the validator (`validate.ts`).
 * Adding a format JsBarcode already knows (CODE93, codabar, MSI, pharmacode…)
 * is one entry here.
 */

export const BARCODE_FORMATS = ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14'] as const;
export type BarcodeFormat = (typeof BARCODE_FORMATS)[number];

export interface BarcodeFormatMeta {
  id: BarcodeFormat;
  label: string;
  hint: string;
  sample: string;
  jsFormat: string;
}

export const BARCODE_META: Record<BarcodeFormat, BarcodeFormatMeta> = {
  CODE128: {
    id: 'CODE128',
    label: 'Code 128',
    hint: 'Any text or digits. The workhorse for shipping and logistics.',
    sample: 'ADYSRE-2026',
    jsFormat: 'CODE128',
  },
  CODE39: {
    id: 'CODE39',
    label: 'Code 39',
    hint: 'Uppercase letters, digits and - . $ / + %. Common on ID badges.',
    sample: 'ADYSRE 39',
    jsFormat: 'CODE39',
  },
  EAN13: {
    id: 'EAN13',
    label: 'EAN-13',
    hint: '12 digits (the 13th check digit is computed). Retail products.',
    sample: '590123412345',
    jsFormat: 'EAN13',
  },
  EAN8: {
    id: 'EAN8',
    label: 'EAN-8',
    hint: '7 digits (check digit computed). Small retail packaging.',
    sample: '9638507',
    jsFormat: 'EAN8',
  },
  UPC: {
    id: 'UPC',
    label: 'UPC-A',
    hint: '11 digits (check digit computed). North-American retail.',
    sample: '03600029145',
    jsFormat: 'UPC',
  },
  ITF14: {
    id: 'ITF14',
    label: 'ITF-14',
    hint: '13 digits (check digit computed). Shipping cartons (GTIN-14).',
    sample: '1540141453548',
    jsFormat: 'ITF14',
  },
};

export interface BarcodeDesign {
  lineColor: string;
  background: string;
  transparent: boolean;
  width: number;
  height: number;
  margin: number;
  displayValue: boolean;
  fontSize: number;
}

export const DEFAULT_BARCODE_DESIGN: BarcodeDesign = {
  lineColor: '#0a0a0a',
  background: '#ffffff',
  transparent: false,
  width: 2,
  height: 100,
  margin: 10,
  displayValue: true,
  fontSize: 18,
};
