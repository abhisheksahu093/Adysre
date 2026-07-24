import type { SalaryLine, SalarySlip } from './types';

/**
 * Payslip totals. Pure and unit-tested, like the invoice engine, so the printed
 * slip and any export agree. Net pay is gross earnings, minus deductions, plus
 * any reimbursement (which is not taxed/deducted).
 */

export interface SalaryTotals {
  gross: number;
  totalDeductions: number;
  reimbursement: number;
  net: number;
}

const sum = (lines: SalaryLine[]): number =>
  lines.reduce((total, line) => total + (Number(line.amount) || 0), 0);

export function computeSalary(slip: SalarySlip): SalaryTotals {
  const gross = sum(slip.earnings);
  const totalDeductions = sum(slip.deductions);
  const reimbursement = Math.max(Number(slip.reimbursement) || 0, 0);
  return {
    gross,
    totalDeductions,
    reimbursement,
    net: gross - totalDeductions + reimbursement,
  };
}
