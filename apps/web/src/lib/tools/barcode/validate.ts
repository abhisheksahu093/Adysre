import type { BarcodeFormat } from './types';

/**
 * Barcode validation + normalisation - pure and unit-tested.
 *
 * The retail formats (EAN/UPC/ITF) carry a GS1 mod-10 check digit; the validator
 * computes it when the user types the body and verifies it when they paste a
 * full code, so the preview always renders a scannable symbol. CODE39/CODE128
 * are validated by their character sets. JsBarcode renders; this decides whether
 * the input is worth rendering and what the final value should be.
 */

export interface ValidationResult {
  valid: boolean;
  /** The value to hand JsBarcode (check digit appended for GS1 formats). */
  value: string;
  message?: string;
}

/** GS1 mod-10 check digit for a body of digits (the code without its check digit). */
export function gs1CheckDigit(body: string): number {
  let sum = 0;
  for (let i = 0; i < body.length; i += 1) {
    const digit = Number(body[body.length - 1 - i]);
    // Rightmost body digit is weighted 3, then alternating 1/3.
    sum += digit * (i % 2 === 0 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10;
}

const CODE39_CHARS = /^[0-9A-Z\-.$/+% ]*$/;

/** Body length (without check digit) required by each GS1 format. */
const GS1_BODY: Partial<Record<BarcodeFormat, number>> = {
  EAN13: 12,
  EAN8: 7,
  UPC: 11,
  ITF14: 13,
};

function validateGs1(digits: string, bodyLen: number): ValidationResult {
  if (!/^\d+$/.test(digits)) return { valid: false, value: digits, message: 'Digits only.' };
  const full = bodyLen + 1;

  if (digits.length === bodyLen) {
    return { valid: true, value: digits + gs1CheckDigit(digits) };
  }
  if (digits.length === full) {
    const body = digits.slice(0, bodyLen);
    const ok = Number(digits[bodyLen]) === gs1CheckDigit(body);
    return ok
      ? { valid: true, value: digits }
      : { valid: false, value: digits, message: 'Check digit does not match.' };
  }
  return {
    valid: false,
    value: digits,
    message: `Enter ${bodyLen} digits (or ${full} with the check digit).`,
  };
}

export function validateBarcode(format: BarcodeFormat, raw: string): ValidationResult {
  const value = raw.trim();
  if (!value) return { valid: false, value: '', message: 'Enter a value.' };

  const bodyLen = GS1_BODY[format];
  if (bodyLen !== undefined) return validateGs1(value, bodyLen);

  if (format === 'CODE39') {
    const upper = value.toUpperCase();
    return CODE39_CHARS.test(upper)
      ? { valid: true, value: upper }
      : { valid: false, value: upper, message: 'Allowed: A–Z, 0–9 and - . $ / + % space.' };
  }

  // CODE128: any ASCII.
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]+$/.test(value)
    ? { valid: true, value }
    : { valid: false, value, message: 'ASCII characters only.' };
}
