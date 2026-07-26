import { cn } from 'adysre';
import type { SalaryLine, SalarySlip } from '@/lib/tools/salary/types';
import { computeSalary, type SalaryTotals } from '@/lib/tools/salary/totals';
import { SALARY_DESIGNS_BY_ID, type SalaryDesign } from '@/lib/tools/salary/designs';
import { amountInWords, CURRENCY_WORDS } from '@/lib/tools/salary/words';
import { formatMoney, formatDate } from '@/lib/tools/invoice/format';

/**
 * The rendered salary slip. `slip.designId` picks one of three genuinely
 * different documents (classic bordered, modern statement, corporate green),
 * each rendering the same data. A logo, when uploaded, sits with the company
 * name (either or both). Colors come from the design config (inline, a paper
 * artifact). `id="salary-paper"` is the print isolation target.
 */

interface Ctx {
  slip: SalarySlip;
  d: SalaryDesign;
  totals: SalaryTotals;
  money: (n: number) => string;
  period: string;
  words: string;
}

export function SalaryPreview({ slip }: { slip: SalarySlip }) {
  const d = SALARY_DESIGNS_BY_ID[slip.designId] ?? SALARY_DESIGNS_BY_ID.modern!;
  const totals = computeSalary(slip);
  const ctx: Ctx = {
    slip,
    d,
    totals,
    money: (n) => formatMoney(n, slip.currency),
    period: monthLabel(slip.period),
    words: amountInWords(totals.net, CURRENCY_WORDS[slip.currency]),
  };

  const body =
    d.layout === 'classic' ? <ClassicSlip {...ctx} /> : d.layout === 'corporate' ? <CorporateSlip {...ctx} /> : <ModernSlip {...ctx} />;

  return (
    <div id="salary-paper" className="relative mx-auto w-full overflow-hidden text-sm" style={{ background: d.surface, color: d.text }}>
      {body}
    </div>
  );
}

/** Logo + company name lockup. Placement varies; either/both render. */
function CompanyMark({ slip, align = 'left', big }: { slip: SalarySlip; align?: 'left' | 'center'; big?: boolean }) {
  return (
    <div className={cn(align === 'center' && 'text-center')}>
      {slip.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slip.logo} alt="" className={cn('object-contain', big ? 'h-14' : 'h-10', align === 'center' && 'mx-auto', slip.company && 'mb-1')} />
      )}
      {slip.company && <p className={cn('font-bold leading-tight', big ? 'text-xl' : 'text-base')}>{slip.company}</p>}
    </div>
  );
}

// ── Design: classic bordered (reference 8) ───────────────────────────────────

function ClassicSlip({ slip, d, totals, money, period, words }: Ctx) {
  const box = { border: `1px solid ${d.border}` };
  return (
    <div className="space-y-3 p-6">
      {/* Header: logo box + company */}
      <div className="grid grid-cols-2" style={box}>
        <div className="flex items-center justify-center p-3" style={{ borderRight: `1px solid ${d.border}` }}>
          <CompanyMark slip={{ ...slip, company: slip.logo ? '' : slip.company }} align="center" big />
        </div>
        <div className="flex flex-col items-center justify-center p-3 text-center">
          {slip.logo && slip.company && <p className="text-lg font-bold">{slip.company}</p>}
          {!slip.logo && !slip.company && <p className="text-lg font-bold">Company Name</p>}
          {slip.companyAddress && <p className="mt-1 text-xs" style={{ color: d.muted }}>{slip.companyAddress}</p>}
        </div>
      </div>

      <p className="py-1 text-center font-bold" style={box}>
        Pay Slip for the Month of {period}
      </p>

      {/* Employee grid */}
      <div className="grid grid-cols-4 text-xs" style={box}>
        <Cell d={d} label>Name</Cell><Cell d={d}>{slip.employee.name}</Cell><Cell d={d} label>Department</Cell><Cell d={d} last>{slip.employee.department}</Cell>
        <Cell d={d} label>Emp. No</Cell><Cell d={d}>{slip.employee.employeeId}</Cell><Cell d={d} label>Bank Name</Cell><Cell d={d} last>{slip.employee.bankName}</Cell>
        <Cell d={d} label bottom>Designation</Cell><Cell d={d} bottom>{slip.employee.designation}</Cell><Cell d={d} label bottom>A/c No.</Cell><Cell d={d} last bottom>{slip.employee.bankAccount}</Cell>
      </div>

      {/* Earnings + deductions */}
      <div className="grid grid-cols-2" style={box}>
        <div style={{ borderRight: `1px solid ${d.border}` }}>
          <p className="border-b py-1.5 text-center font-bold" style={{ borderColor: d.border }}>Earnings</p>
          <LedgerRows lines={slip.earnings} money={money} d={d} totalLabel="Gross Salary" total={totals.gross} />
        </div>
        <div>
          <p className="border-b py-1.5 text-center font-bold" style={{ borderColor: d.border }}>Deductions</p>
          <LedgerRows lines={slip.deductions} money={money} d={d} totalLabel="Total Deductions" total={totals.totalDeductions} />
        </div>
      </div>

      {/* Net pay */}
      <div className="grid grid-cols-2 items-center" style={box}>
        <p className="py-1.5 text-center font-bold" style={{ borderRight: `1px solid ${d.border}` }}>Net Pay</p>
        <p className="py-1.5 text-center font-bold tabular-nums">{money(totals.net)}</p>
      </div>
      <p className="text-right text-xs"><span style={{ color: d.muted }}>Amount in Words: </span>{words}</p>
    </div>
  );
}

function Cell({ d, label, last, bottom, children }: { d: SalaryDesign; label?: boolean; last?: boolean; bottom?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn('px-2 py-1.5', label && 'font-medium')}
      style={{ borderRight: last ? undefined : `1px solid ${d.border}`, borderBottom: bottom ? undefined : `1px solid ${d.border}`, color: label ? d.muted : d.text }}
    >
      {children || ' '}
    </div>
  );
}

function LedgerRows({ lines, money, d, totalLabel, total }: { lines: SalaryLine[]; money: (n: number) => string; d: SalaryDesign; totalLabel: string; total: number }) {
  return (
    <table className="w-full text-xs">
      <tbody>
        {lines.map((l) => (
          <tr key={l.id} style={{ borderBottom: `1px dotted ${d.border}` }}>
            <td className="px-2 py-1.5">{l.head || ' '}</td>
            <td className="px-2 py-1.5 text-right tabular-nums">{money(l.amount)}</td>
          </tr>
        ))}
        <tr style={{ borderTop: `1px solid ${d.border}` }}>
          <td className="px-2 py-1.5 font-bold">{totalLabel}</td>
          <td className="px-2 py-1.5 text-right font-bold tabular-nums">{money(total)}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ── Design: modern clean (reference 9) ───────────────────────────────────────

function ModernSlip({ slip, d, totals, money, period, words }: Ctx) {
  const lop = Math.max(slip.daysInMonth - slip.paidDays, 0);
  return (
    <div className="space-y-6 p-8">
      <header className="flex items-start justify-between">
        <CompanyMark slip={slip} big />
        <div className="text-right text-xs" style={{ color: d.muted }}>
          <p>Payslip For the Month</p>
          <p className="text-base font-bold" style={{ color: d.text }}>{period}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: d.muted }}>Employee Summary</p>
          <dl className="space-y-1.5 text-xs">
            <KV label="Employee Name" value={slip.employee.name} d={d} />
            <KV label="Employee ID" value={slip.employee.employeeId} d={d} />
            <KV label="Pay Period" value={period} d={d} />
            <KV label="Pay Date" value={formatDate(slip.payDate)} d={d} />
          </dl>
        </div>
        <div className="rounded-lg p-4" style={{ background: d.accentSoft }}>
          <p className="text-2xl font-bold" style={{ color: d.accent }}>{money(totals.net)}</p>
          <p className="text-xs" style={{ color: d.muted }}>Total Net Pay</p>
          <div className="my-3 border-t border-dashed" style={{ borderColor: d.accent }} />
          <KV label="Paid Days" value={String(slip.paidDays)} d={d} />
          <KV label="LOP Days" value={String(lop)} d={d} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ModernLedger title="Earnings" lines={slip.earnings} money={money} d={d} totalLabel="Gross Earnings" total={totals.gross} />
        <ModernLedger title="Deductions" lines={slip.deductions} money={money} d={d} totalLabel="Total Deductions" total={totals.totalDeductions} />
      </div>

      <div className="flex items-center justify-between rounded-lg p-4" style={{ border: `1px solid ${d.border}` }}>
        <div>
          <p className="text-sm font-bold">TOTAL NET PAYABLE</p>
          <p className="text-xs" style={{ color: d.muted }}>Gross Earnings - Total Deductions</p>
        </div>
        <p className="rounded px-3 py-1.5 text-lg font-bold" style={{ background: d.accentSoft, color: d.accent }}>{money(totals.net)}</p>
      </div>

      <p className="text-right text-xs"><span style={{ color: d.muted }}>Amount In Words: </span><span className="font-medium">{words}</span></p>
      <p className="border-t pt-3 text-center text-[11px]" style={{ borderColor: d.border, color: d.muted }}>This is a system-generated document.</p>
    </div>
  );
}

function ModernLedger({ title, lines, money, d, totalLabel, total }: { title: string; lines: SalaryLine[]; money: (n: number) => string; d: SalaryDesign; totalLabel: string; total: number }) {
  return (
    <div>
      <div className="flex justify-between border-b pb-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: d.border, color: d.muted }}>
        <span>{title}</span><span>Amount</span>
      </div>
      <table className="w-full text-xs">
        <tbody>
          {lines.map((l) => (
            <tr key={l.id}>
              <td className="py-1.5">{l.head || ' '}</td>
              <td className="py-1.5 text-right font-semibold tabular-nums">{money(l.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-1 flex justify-between border-t pt-2 text-sm font-bold" style={{ borderColor: d.border }}>
        <span>{totalLabel}</span><span className="tabular-nums">{money(total)}</span>
      </div>
    </div>
  );
}

function KV({ label, value, d }: { label: string; value: string; d: SalaryDesign }) {
  return (
    <div className="flex justify-between gap-4">
      <dt style={{ color: d.muted }}>{label}</dt>
      <dd className="font-medium">{value || ' '}</dd>
    </div>
  );
}

// ── Design: corporate green (reference 10) ───────────────────────────────────

function CorporateSlip({ slip, d, totals, money, period, words }: Ctx) {
  const box = { border: `1px solid ${d.border}` };
  return (
    <div className="relative space-y-5 p-8">
      {/* Diagonal corner accents */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rotate-45" style={{ background: d.accent }} aria-hidden />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-24 w-24 rotate-45" style={{ background: d.accentSoft }} aria-hidden />

      <header className="relative flex items-start justify-between">
        <CompanyMark slip={slip} big />
        <div className="text-right">
          <p className="text-xl font-extrabold tracking-tight">SALARY SLIP</p>
        </div>
      </header>
      {slip.companyAddress && <p className="text-xs" style={{ color: d.muted }}>{slip.companyAddress}</p>}
      <div className="flex flex-wrap gap-x-8 text-xs" style={{ color: d.muted }}>
        <span>Pay Period: <b style={{ color: d.text }}>{period}</b></span>
        {slip.slipNumber && <span>Slip Number: <b style={{ color: d.text }}>{slip.slipNumber}</b></span>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: d.accent }}>Employee Information</p>
          <table className="w-full text-xs" style={box}>
            <tbody>
              <InfoRow label="Employee Name" value={slip.employee.name} d={d} />
              <InfoRow label="Employee ID" value={slip.employee.employeeId} d={d} />
              <InfoRow label="Department" value={slip.employee.department} d={d} />
              <InfoRow label="Designation" value={slip.employee.designation} d={d} />
              <InfoRow label="Join Date" value={formatDate(slip.employee.joinDate)} d={d} last />
            </tbody>
          </table>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: d.accent }}>Salary Details</p>
          <table className="w-full text-xs" style={box}>
            <tbody>
              {slip.earnings.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i === slip.earnings.length - 1 ? undefined : `1px solid ${d.border}` }}>
                  <td className="px-2 py-1.5" style={{ borderRight: `1px solid ${d.border}`, color: d.muted }}>{l.head || ' '}</td>
                  <td className="px-2 py-1.5 text-right font-medium tabular-nums">{money(l.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: d.accent }}>Salary Summary</p>
          <dl className="space-y-1 text-xs">
            <KV label="Total Revenue" value={money(totals.gross)} d={d} />
            <KV label="Total Deductions" value={money(totals.totalDeductions)} d={d} />
          </dl>
          <div className="mt-2 flex items-center justify-between rounded px-3 py-2 text-sm font-bold" style={{ background: d.accent, color: d.accentText }}>
            <span>Net Salary Received</span><span className="tabular-nums">{money(totals.net)}</span>
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-xs" style={{ color: d.muted }}>Amount in words: <span className="font-medium" style={{ color: d.text }}>{words}</span></p>
          <div className="mt-8 border-t pt-1 text-xs" style={{ borderColor: d.border, color: d.muted }}>HR / Finance Signature</div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, d, last }: { label: string; value: string; d: SalaryDesign; last?: boolean }) {
  return (
    <tr style={{ borderBottom: last ? undefined : `1px solid ${d.border}` }}>
      <td className="px-2 py-1.5" style={{ borderRight: `1px solid ${d.border}`, color: d.muted }}>{label}</td>
      <td className="px-2 py-1.5 font-medium">{value || ' '}</td>
    </tr>
  );
}

/** "2026-01" to "January 2026". Falls back to the raw value. */
function monthLabel(period: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(period);
  if (!match) return period || '';
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return Number.isNaN(date.getTime()) ? period : new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}
