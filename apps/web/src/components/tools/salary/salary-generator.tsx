'use client';

import { useState, type ChangeEvent } from 'react';
import { FileJson, ImagePlus, Plus, Printer, Trash2 } from 'lucide-react';
import { Button, Input, Label, Select } from 'adysre';
import type { Employee, SalaryLine, SalarySlip } from '@/lib/tools/salary/types';
import { SAMPLE_SALARY } from '@/lib/tools/salary/sample';
import { computeSalary } from '@/lib/tools/salary/totals';
import { SALARY_DESIGNS } from '@/lib/tools/salary/designs';
import { CURRENCIES } from '@/lib/tools/invoice/format';
import { SalaryPreview } from './salary-preview';

/**
 * Salary slip generator. Its own fields and layout: employee details plus two
 * ledgers, earnings and deductions, with the payroll summary computed live. A
 * logo can sit with the company name, and the design picks one of several slip
 * layouts. Prints to PDF; exports JSON.
 */

let lineCounter = 0;
const newLineId = () => `sl-${(lineCounter += 1)}`;

function download(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function SalaryGenerator() {
  const [slip, setSlip] = useState<SalarySlip>(SAMPLE_SALARY);
  const totals = computeSalary(slip);

  const update = (patch: Partial<SalarySlip>) => setSlip((s) => ({ ...s, ...patch }));
  const setEmployee = (patch: Partial<Employee>) => setSlip((s) => ({ ...s, employee: { ...s.employee, ...patch } }));

  const setLine = (key: 'earnings' | 'deductions', id: string, patch: Partial<SalaryLine>) =>
    setSlip((s) => ({ ...s, [key]: s[key].map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  const addLine = (key: 'earnings' | 'deductions') =>
    setSlip((s) => ({ ...s, [key]: [...s[key], { id: newLineId(), head: '', amount: 0 }] }));
  const removeLine = (key: 'earnings' | 'deductions', id: string) =>
    setSlip((s) => ({ ...s, [key]: s[key].filter((l) => l.id !== id) }));

  function onLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ logo: typeof reader.result === 'string' ? reader.result : null });
    reader.readAsDataURL(file);
  }

  const slug = `payslip-${slip.employee.name || 'employee'}-${slip.period}`.replace(/[^\w-]+/g, '-');
  const pageCss = `@page { size: ${slip.pageSize} ${slip.orientation}; margin: 12mm; }
@media print {
  body * { visibility: hidden !important; }
  #salary-print, #salary-print * { visibility: visible !important; }
  #salary-print { position: absolute; left: 0; top: 0; width: 100%; }
}`;

  return (
    <div className="flex flex-col gap-8 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[24rem_1fr] lg:gap-8">
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      {/* Editor: internal scroll on desktop so the page never grows. `relative`
          contains the sr-only file inputs (absolute) so they don't escape the
          overflow and stretch the document. */}
      <div className="relative space-y-6 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        <Panel title="Payslip">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company" value={slip.company} onChange={(v) => update({ company: v })} className="col-span-2" />
            <Field label="Company address" value={slip.companyAddress} onChange={(v) => update({ companyAddress: v })} className="col-span-2" />
            <FieldSelect label="Design" value={slip.designId} onChange={(v) => update({ designId: v })}>
              {SALARY_DESIGNS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </FieldSelect>
            <FieldSelect label="Currency" value={slip.currency} onChange={(v) => update({ currency: v })}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FieldSelect>
            <Field label="Slip number" value={slip.slipNumber} onChange={(v) => update({ slipNumber: v })} />
            <Field label="Pay period" type="month" value={slip.period} onChange={(v) => update({ period: v })} />
            <Field label="Pay date" type="date" value={slip.payDate} onChange={(v) => update({ payDate: v })} />
            <Field label="Days in month" type="number" value={String(slip.daysInMonth)} onChange={(v) => update({ daysInMonth: Number(v) })} />
            <Field label="Paid days" type="number" value={String(slip.paidDays)} onChange={(v) => update({ paidDays: Number(v) })} />
            <Field label="Reimbursement" type="number" value={String(slip.reimbursement)} onChange={(v) => update({ reimbursement: Number(v) })} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ImagePlus className="h-4 w-4" aria-hidden />
              {slip.logo ? 'Replace logo' : 'Upload logo'}
              <input type="file" accept="image/*" className="sr-only" onChange={onLogo} />
            </label>
            {slip.logo && (
              <Button type="button" variant="outline" size="sm" onClick={() => update({ logo: null })}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Remove logo
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">The logo sits with the company name. Keep either or both.</p>
        </Panel>

        <Panel title="Employee">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={slip.employee.name} onChange={(v) => setEmployee({ name: v })} className="col-span-2" />
            <Field label="Designation" value={slip.employee.designation} onChange={(v) => setEmployee({ designation: v })} />
            <Field label="Employee ID" value={slip.employee.employeeId} onChange={(v) => setEmployee({ employeeId: v })} />
            <Field label="Department" value={slip.employee.department} onChange={(v) => setEmployee({ department: v })} />
            <Field label="Location" value={slip.employee.location} onChange={(v) => setEmployee({ location: v })} />
            <Field label="Bank name" value={slip.employee.bankName} onChange={(v) => setEmployee({ bankName: v })} />
            <Field label="Bank account" value={slip.employee.bankAccount} onChange={(v) => setEmployee({ bankAccount: v })} />
            <Field label="Join date" type="date" value={slip.employee.joinDate} onChange={(v) => setEmployee({ joinDate: v })} className="col-span-2" />
          </div>
        </Panel>

        <LedgerEditor title="Earnings" lines={slip.earnings} total={totals.gross} onAdd={() => addLine('earnings')} onChange={(id, patch) => setLine('earnings', id, patch)} onRemove={(id) => removeLine('earnings', id)} />
        <LedgerEditor title="Deductions" lines={slip.deductions} total={totals.totalDeductions} onAdd={() => addLine('deductions')} onChange={(id, patch) => setLine('deductions', id, patch)} onRemove={(id) => removeLine('deductions', id)} />

        <Panel title="Layout & notes">
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect label="Page size" value={slip.pageSize} onChange={(v) => update({ pageSize: v as SalarySlip['pageSize'] })}>
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </FieldSelect>
            <FieldSelect label="Orientation" value={slip.orientation} onChange={(v) => update({ orientation: v as SalarySlip['orientation'] })}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </FieldSelect>
          </div>
          <div className="mt-3 space-y-1.5">
            <Label>Note</Label>
            <textarea
              value={slip.notes}
              rows={2}
              onChange={(e) => update({ notes: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </Panel>
      </div>

      {/* Preview + actions */}
      <div className="relative space-y-4 lg:min-h-0 lg:overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Print / PDF
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => download(`${slug}.json`, JSON.stringify({ slip, totals }, null, 2), 'application/json')}>
            <FileJson className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            JSON
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            Net {new Intl.NumberFormat('en-US', { style: 'currency', currency: slip.currency }).format(totals.net)}
          </span>
        </div>

        <div id="salary-print" className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <SalaryPreview slip={slip} />
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className ? `${className} space-y-1.5` : 'space-y-1.5'}>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </Select>
    </div>
  );
}

function LedgerEditor({
  title,
  lines,
  total,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  lines: SalaryLine[];
  total: number;
  onAdd: () => void;
  onChange: (id: string, patch: Partial<SalaryLine>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Panel title={`${title} (${total.toLocaleString()})`}>
      <div className="space-y-2">
        {lines.map((line) => (
          <div key={line.id} className="flex items-center gap-2">
            <Input aria-label="Head" placeholder="Salary head" value={line.head} onChange={(e) => onChange(line.id, { head: e.target.value })} className="flex-1" />
            <Input aria-label="Amount" type="number" value={String(line.amount)} onChange={(e) => onChange(line.id, { amount: Number(e.target.value) })} className="w-28" />
            <Button type="button" variant="outline" size="sm" aria-label="Remove" onClick={() => onRemove(line.id)}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onAdd}>
        <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
        Add row
      </Button>
    </Panel>
  );
}
