import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { computeSalary } from './totals';
import { numberToWords, amountInWords } from './words';
import { SAMPLE_SALARY } from './sample';

/** Payslip totals, pinned against the sample (matches the classic example). */
describe('computeSalary', () => {
  it('sums earnings and deductions and nets them out', () => {
    const t = computeSalary(SAMPLE_SALARY);
    assert.equal(t.gross, 98100); // 40000+4000+20000+1600+4500+28000
    assert.equal(t.totalDeductions, 15000); // 200+10000+4800
    assert.equal(t.net, 83100); // gross - deductions
  });

  it('adds reimbursement to net without taxing it', () => {
    const t = computeSalary({ ...SAMPLE_SALARY, reimbursement: 2000 });
    assert.equal(t.reimbursement, 2000);
    assert.equal(t.net, 85100);
  });

  it('ignores non-numeric amounts safely', () => {
    const t = computeSalary({
      ...SAMPLE_SALARY,
      earnings: [{ id: 'x', head: 'Basic', amount: Number.NaN }],
      deductions: [],
    });
    assert.equal(t.gross, 0);
    assert.equal(t.net, 0);
  });
});

describe('numberToWords', () => {
  it('matches the reference payslip amounts', () => {
    assert.equal(numberToWords(0), 'Zero');
    assert.equal(numberToWords(30203), 'Thirty Thousand Two Hundred Three');
    assert.equal(numberToWords(51100), 'Fifty-One Thousand One Hundred');
    assert.equal(numberToWords(6000000), 'Six Million');
    assert.equal(numberToWords(83100), 'Eighty-Three Thousand One Hundred');
  });
  it('formats an amount-in-words line with the currency', () => {
    assert.equal(amountInWords(51100, 'Indian Rupee'), 'Indian Rupee Fifty-One Thousand One Hundred Only');
    assert.equal(amountInWords(30203), 'Thirty Thousand Two Hundred Three Only');
  });
});
