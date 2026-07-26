/**
 * Salary slip (payslip) model. A different document from an invoice: two ledgers
 * (earnings and deductions) rather than priced line items, plus employee and
 * pay-period fields. It gets its own layout in `salary-preview` accordingly.
 */

export interface SalaryLine {
  id: string;
  head: string;
  amount: number;
}

export interface Employee {
  name: string;
  designation: string;
  employeeId: string;
  department: string;
  location: string;
  bankName: string;
  bankAccount: string;
  joinDate: string;
}

export interface SalarySlip {
  company: string;
  companyAddress: string;
  /** Data-URL logo, or null. Shown above the company name; either or both. */
  logo: string | null;
  /** Salary-slip design id (see `designs.ts`) - picks the layout + palette. */
  designId: string;
  slipNumber: string;
  /** Pay period as a month value ("2026-01") from <input type="month">. */
  period: string;
  /** Pay date (ISO), shown by some designs. */
  payDate: string;
  currency: string;
  employee: Employee;
  earnings: SalaryLine[];
  deductions: SalaryLine[];
  reimbursement: number;
  daysInMonth: number;
  paidDays: number;
  notes: string;
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
}
