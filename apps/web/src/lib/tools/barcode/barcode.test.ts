import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { gs1CheckDigit, validateBarcode } from './validate';

/**
 * Barcode engine tests. The check digit is the part a scanner is unforgiving
 * about, so it is asserted against the canonical GS1 examples, and each format's
 * accept/reject rules are pinned.
 */

describe('gs1CheckDigit', () => {
  it('matches the canonical EAN-13 and UPC-A examples', () => {
    assert.equal(gs1CheckDigit('590123412345'), 7); // 5901234123457
    assert.equal(gs1CheckDigit('03600029145'), 2); //  036000291452
    assert.equal(gs1CheckDigit('9638507'), 4); //     96385074 (EAN-8)
  });
});

describe('validateBarcode — GS1 formats', () => {
  it('appends the check digit to a body', () => {
    assert.deepEqual(validateBarcode('EAN13', '590123412345'), { valid: true, value: '5901234123457' });
    assert.deepEqual(validateBarcode('UPC', '03600029145'), { valid: true, value: '036000291452' });
  });
  it('verifies a full code and rejects a bad check digit', () => {
    assert.equal(validateBarcode('EAN13', '5901234123457').valid, true);
    assert.equal(validateBarcode('EAN13', '5901234123450').valid, false);
  });
  it('rejects wrong length and non-digits', () => {
    assert.equal(validateBarcode('EAN13', '123').valid, false);
    assert.equal(validateBarcode('UPC', '03600029145X').valid, false);
  });
});

describe('validateBarcode — CODE39 / CODE128', () => {
  it('uppercases and accepts a valid Code 39 value', () => {
    assert.deepEqual(validateBarcode('CODE39', 'adysre-39'), { valid: true, value: 'ADYSRE-39' });
  });
  it('rejects a Code 39 value with unsupported characters', () => {
    assert.equal(validateBarcode('CODE39', 'lower@case').valid, false);
  });
  it('accepts arbitrary ASCII for Code 128, rejects empty', () => {
    assert.equal(validateBarcode('CODE128', 'ADYSRE-2026!').valid, true);
    assert.equal(validateBarcode('CODE128', '   ').valid, false);
  });
});
