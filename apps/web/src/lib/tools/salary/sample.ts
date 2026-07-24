import type { SalarySlip } from './types';

/** Starting payslip, mirroring the classic Indian salary-slip example. */
export const SAMPLE_SALARY: SalarySlip = {
  company: 'Acme Studio Pvt. Ltd.',
  companyAddress: 'Madhurawada, Visakhapatnam, Andhra Pradesh 530045',
  logo: null,
  designId: 'modern',
  slipNumber: 'PS-2026-0142',
  period: '2026-01',
  payDate: '2026-02-01',
  currency: 'INR',
  employee: {
    name: 'Ravi Sharma',
    designation: 'Senior Engineer',
    employeeId: 'EMP-0142',
    department: 'Engineering',
    location: 'Bengaluru',
    bankName: 'HDFC Bank',
    bankAccount: 'XXXX XXXX 4821',
    joinDate: '2023-04-01',
  },
  earnings: [
    { id: 'e1', head: 'Basic', amount: 40000 },
    { id: 'e2', head: 'Dearness Allowance', amount: 4000 },
    { id: 'e3', head: 'House Rent Allowance', amount: 20000 },
    { id: 'e4', head: 'Conveyance Allowance', amount: 1600 },
    { id: 'e5', head: 'Medical Allowance', amount: 4500 },
    { id: 'e6', head: 'Special Allowance', amount: 28000 },
  ],
  deductions: [
    { id: 'd1', head: 'Professional Tax', amount: 200 },
    { id: 'd2', head: 'Tax Deducted at Source', amount: 10000 },
    { id: 'd3', head: 'Employee Provident Fund', amount: 4800 },
  ],
  reimbursement: 0,
  daysInMonth: 31,
  paidDays: 31,
  notes: 'This is a computer-generated payslip and does not require a signature.',
  pageSize: 'A4',
  orientation: 'portrait',
};
