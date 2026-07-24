'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import { Download, FileJson, FileSpreadsheet, ImagePlus, Plus, Printer, Trash2, Upload } from 'lucide-react';
import { Button, Input, Label, Select } from 'adysre';
import type { InvoiceDocument, LineItem, Party } from '@/lib/tools/invoice/types';
import { SAMPLE_DOCUMENT } from '@/lib/tools/invoice/sample';
import { CURRENCIES } from '@/lib/tools/invoice/format';
import { DOC_TYPES, DOC_TYPES_BY_ID } from '@/lib/tools/invoice/registry';
import { TEMPLATES } from '@/lib/tools/invoice/templates';
import { toItemsCsv, toJson, parseItemsCsv } from '@/lib/tools/invoice/exchange';
import { InvoicePreview } from './invoice-preview';

/**
 * Invoice / document generator - a live editor beside a print-ready preview.
 *
 * All state is the one `InvoiceDocument`; the totals, the preview and every
 * export read from it, so nothing can drift. "Print / PDF" uses the browser's
 * own print-to-PDF (a print stylesheet isolates the paper and sets the page
 * size) — no library, no server, works offline. JSON/CSV export and CSV import
 * are local file operations.
 */

let itemCounter = 0;
const newItemId = () => `item-${(itemCounter += 1)}`;

function download(filename: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function InvoiceGenerator() {
  const [doc, setDoc] = useState<InvoiceDocument>(SAMPLE_DOCUMENT);

  const update = useCallback((patch: Partial<InvoiceDocument>) => setDoc((d) => ({ ...d, ...patch })), []);
  const setParty = (key: 'from' | 'to', patch: Partial<Party>) =>
    setDoc((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
  const setItem = (id: string, patch: Partial<LineItem>) =>
    setDoc((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  const addItem = () =>
    setDoc((d) => ({ ...d, items: [...d.items, { id: newItemId(), description: '', quantity: 1, unitPrice: 0 }] }));
  const removeItem = (id: string) => setDoc((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));

  function changeDocType(id: string) {
    const type = DOC_TYPES_BY_ID[id];
    if (!type) return;
    setDoc((d) => ({
      ...d,
      docType: id,
      tax: { ...d.tax, mode: type.defaultTaxMode, label: type.defaultTaxLabel },
    }));
  }

  function onLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ logo: typeof reader.result === 'string' ? reader.result : null });
    reader.readAsDataURL(file);
  }

  function onImportCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const items = parseItemsCsv(String(reader.result ?? ''), newItemId).filter((i) => i.description);
      if (items.length) update({ items });
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  const slug = (doc.number || 'document').replace(/[^\w-]+/g, '-');
  const pageCss = `@page { size: ${doc.pageSize} ${doc.orientation}; margin: 12mm; }
@media print {
  body * { visibility: hidden !important; }
  #invoice-print, #invoice-print * { visibility: visible !important; }
  #invoice-print { position: absolute; left: 0; top: 0; width: 100%; }
}`;

  return (
    <div className="flex flex-col gap-8 lg:min-h-0 lg:flex-1 lg:flex-row">
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      {/* Editor: fixed-width column that scrolls internally on desktop, so a long
          form never grows the page and leaves dead space beside the preview. */}
      <div className="space-y-6 lg:w-[24rem] lg:shrink-0 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        {/* Document setup */}
        <Panel title="Document">
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect label="Type" value={doc.docType} onChange={changeDocType}>
              {DOC_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </FieldSelect>
            <FieldSelect label="Design" value={doc.templateId} onChange={(v) => update({ templateId: v })}>
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </FieldSelect>
            <Field label="Number" value={doc.number} onChange={(v) => update({ number: v })} />
            <FieldSelect label="Currency" value={doc.currency} onChange={(v) => update({ currency: v })}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FieldSelect>
            <Field label="Issue date" type="date" value={doc.issueDate} onChange={(v) => update({ issueDate: v })} />
            <Field label="Due date" type="date" value={doc.dueDate} onChange={(v) => update({ dueDate: v })} />
            <FieldSelect label="Page size" value={doc.pageSize} onChange={(v) => update({ pageSize: v as InvoiceDocument['pageSize'] })}>
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </FieldSelect>
            <FieldSelect label="Orientation" value={doc.orientation} onChange={(v) => update({ orientation: v as InvoiceDocument['orientation'] })}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </FieldSelect>
          </div>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ImagePlus className="h-4 w-4" aria-hidden />
            {doc.logo ? 'Replace logo' : 'Upload logo'}
            <input type="file" accept="image/*" className="sr-only" onChange={onLogo} />
          </label>
        </Panel>

        <Panel title="From (your company)">
          <PartyForm party={doc.from} onChange={(p) => setParty('from', p)} />
        </Panel>
        <Panel title="Bill to (customer)">
          <PartyForm party={doc.to} onChange={(p) => setParty('to', p)} />
        </Panel>

        {/* Line items */}
        <Panel title="Items">
          <div className="space-y-2">
            {doc.items.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <Input
                  aria-label="Description"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => setItem(item.id, { description: e.target.value })}
                  className="flex-1"
                />
                <Input
                  aria-label="Quantity"
                  type="number"
                  value={String(item.quantity)}
                  onChange={(e) => setItem(item.id, { quantity: Number(e.target.value) })}
                  className="w-16"
                />
                <Input
                  aria-label="Unit price"
                  type="number"
                  value={String(item.unitPrice)}
                  onChange={(e) => setItem(item.id, { unitPrice: Number(e.target.value) })}
                  className="w-24"
                />
                <Button type="button" variant="outline" size="sm" aria-label="Remove item" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Add item
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Upload className="h-3.5 w-3.5" aria-hidden />
              Import CSV
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={onImportCsv} />
            </label>
          </div>
        </Panel>

        {/* Charges */}
        <Panel title="Discount, tax & shipping">
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect
              label="Discount"
              value={doc.discount.mode}
              onChange={(v) => update({ discount: { ...doc.discount, mode: v as InvoiceDocument['discount']['mode'] } })}
            >
              <option value="none">None</option>
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </FieldSelect>
            <Field
              label={doc.discount.mode === 'percent' ? 'Discount %' : 'Discount amount'}
              type="number"
              value={String(doc.discount.value)}
              onChange={(v) => update({ discount: { ...doc.discount, value: Number(v) } })}
            />
            <FieldSelect
              label="Tax mode"
              value={doc.tax.mode}
              onChange={(v) => update({ tax: { ...doc.tax, mode: v as InvoiceDocument['tax']['mode'] } })}
            >
              <option value="none">No tax</option>
              <option value="exclusive">Exclusive</option>
              <option value="inclusive">Inclusive</option>
            </FieldSelect>
            <Field
              label={`${doc.tax.label} rate %`}
              type="number"
              value={String(doc.tax.rate)}
              onChange={(v) => update({ tax: { ...doc.tax, rate: Number(v) } })}
            />
            <Field label="Tax label" value={doc.tax.label} onChange={(v) => update({ tax: { ...doc.tax, label: v } })} />
            <Field label="Shipping" type="number" value={String(doc.shipping)} onChange={(v) => update({ shipping: Number(v) })} />
          </div>
        </Panel>

        <Panel title="Notes & terms">
          <FieldArea label="Notes" value={doc.notes} onChange={(v) => update({ notes: v })} />
          <FieldArea label="Terms" value={doc.terms} onChange={(v) => update({ terms: v })} />
        </Panel>
      </div>

      {/* Preview: fills the rest and scrolls the paper independently. */}
      <div className="space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Print / PDF
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => download(`${slug}.json`, toJson(doc), 'application/json')}>
            <FileJson className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            JSON
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => download(`${slug}-items.csv`, toItemsCsv(doc), 'text/csv')}>
            <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            CSV
          </Button>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="h-3.5 w-3.5" aria-hidden />
            {doc.pageSize} · {doc.orientation}
          </span>
        </div>

        {/* The paper. Wrapper is the print isolation target. */}
        <div id="invoice-print" className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <InvoicePreview doc={doc} />
        </div>
      </div>
    </div>
  );
}

// ── Small form primitives (token-styled, matching the app) ───────────────────

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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
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

function FieldArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <textarea
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function PartyForm({ party, onChange }: { party: Party; onChange: (p: Partial<Party>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <Field label="Name" value={party.name} onChange={(v) => onChange({ name: v })} />
      </div>
      <Field label="Email" value={party.email ?? ''} onChange={(v) => onChange({ email: v })} />
      <Field label="Phone" value={party.phone ?? ''} onChange={(v) => onChange({ phone: v })} />
      <div className="col-span-2">
        <FieldArea label="Address" value={party.address ?? ''} onChange={(v) => onChange({ address: v })} />
      </div>
      <div className="col-span-2">
        <Field label="Tax ID" value={party.taxId ?? ''} onChange={(v) => onChange({ taxId: v })} />
      </div>
    </div>
  );
}
