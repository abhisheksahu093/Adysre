import type { ReactElement } from 'react';
import { cn } from 'adysre';
import type { InvoiceDocument } from '@/lib/tools/invoice/types';
import { computeTotals, lineAmount, type Totals } from '@/lib/tools/invoice/totals';
import { formatDate, formatMoney } from '@/lib/tools/invoice/format';
import { DOC_TYPES_BY_ID } from '@/lib/tools/invoice/registry';
import { TEMPLATES_BY_ID, type Template } from '@/lib/tools/invoice/templates';

/**
 * The rendered document, the paper artifact. Colors come from the template
 * config (applied inline, like the QR designer, because a printed page keeps its
 * own look regardless of the app theme). The template's `layout` picks a
 * genuinely different structure, so an invoice, a corporate ledger and an
 * elegant statement read as different documents, not the same one recolored.
 * `id="invoice-paper"` is the print isolation target.
 */

interface Ctx {
  doc: InvoiceDocument;
  t: Template;
  totals: Totals;
  money: (n: number) => string;
}

export function InvoicePreview({ doc }: { doc: InvoiceDocument }) {
  const t = TEMPLATES_BY_ID[doc.templateId] ?? TEMPLATES_BY_ID.minimal!;
  const totals = computeTotals(doc);
  const ctx: Ctx = { doc, t, totals, money: (n) => formatMoney(n, doc.currency) };

  const byLayout: Record<string, () => ReactElement> = {
    classic: () => <ClassicLayout {...ctx} />,
    sidebar: () => <SidebarLayout {...ctx} />,
    banner: () => <BannerLayout {...ctx} />,
    corporate: () => <CorporateLayout {...ctx} />,
    ribbon: () => <RibbonLayout {...ctx} />,
    wave: () => <WaveLayout {...ctx} />,
    artistic: () => <ArtisticLayout {...ctx} />,
    curve: () => <CurveLayout {...ctx} />,
    standard: () => <StandardLayout {...ctx} />,
  };
  const body = (byLayout[t.layout] ?? byLayout.standard!)();

  return (
    <div id="invoice-paper" className={cn('mx-auto w-full text-sm', t.fontClass)} style={{ background: t.surface, color: t.text }}>
      {body}
    </div>
  );
}

// ── Layout: standard (header row, accent table, totals right) ────────────────

function StandardLayout({ doc, t, totals, money }: Ctx) {
  return (
    <>
      {t.header === 'band' && <div className="h-2 w-full" style={{ background: t.accent }} />}
      <div className="space-y-8 p-8 sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <Seller doc={doc} t={t} />
          <DocMeta doc={doc} t={t} align="right" />
        </header>
        <BillTo doc={doc} t={t} />
        <ItemsTable doc={doc} t={t} money={money} variant="accent" />
        <TotalsBlock doc={doc} t={t} totals={totals} money={money} align="end" />
        <Footer doc={doc} t={t} />
      </div>
    </>
  );
}

// ── Layout: classic (boxed, fully bordered ledger) ───────────────────────────

function ClassicLayout({ doc, t, totals, money }: Ctx) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  return (
    <div className="space-y-5 p-6 sm:p-8">
      <div className="text-center" style={{ border: `2px solid ${t.border}` }}>
        <p className="border-b py-2 text-lg font-bold uppercase tracking-wide" style={{ borderColor: t.border, color: t.text }}>
          {doc.from.name || 'Your Company'}
        </p>
        <p className="py-1.5 text-sm font-semibold uppercase tracking-widest" style={{ color: t.accent }}>
          {docType?.label ?? 'Document'} · {doc.number}
        </p>
      </div>

      <div className="grid grid-cols-2 text-xs" style={{ border: `1px solid ${t.border}` }}>
        <div className="space-y-1 p-3" style={{ borderRight: `1px solid ${t.border}` }}>
          <p className="font-semibold uppercase tracking-widest" style={{ color: t.muted }}>Billed to</p>
          <PartyLines doc={doc} which="to" muted={t.muted} />
        </div>
        <div className="space-y-1 p-3">
          <Line label="Issued" value={formatDate(doc.issueDate)} muted={t.muted} />
          {docType?.showDueDate && doc.dueDate && <Line label="Due" value={formatDate(doc.dueDate)} muted={t.muted} />}
          {doc.from.taxId && <Line label="Tax ID" value={doc.from.taxId} muted={t.muted} />}
        </div>
      </div>

      <ItemsTable doc={doc} t={t} money={money} variant="bordered" />
      <TotalsBlock doc={doc} t={t} totals={totals} money={money} align="end" boxed />
      <Footer doc={doc} t={t} />
    </div>
  );
}

// ── Layout: sidebar (accent rail on the left) ────────────────────────────────

function SidebarLayout({ doc, t, totals, money }: Ctx) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr]">
      <aside className="space-y-6 p-6" style={{ background: t.accent, color: t.accentText }}>
        <div>
          {doc.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={doc.logo} alt="" className="mb-3 h-10 w-10 rounded object-contain" />
          )}
          <p className="text-lg font-bold leading-tight">{doc.from.name || 'Your Company'}</p>
        </div>
        <div className="space-y-0.5 text-xs opacity-90">
          <p className="text-sm font-semibold uppercase tracking-widest">{docType?.label ?? 'Document'}</p>
          <p className="font-mono">{doc.number}</p>
          <p className="pt-2">Issued {formatDate(doc.issueDate)}</p>
          {docType?.showDueDate && doc.dueDate && <p>Due {formatDate(doc.dueDate)}</p>}
        </div>
        {doc.from.address && <p className="whitespace-pre-line text-[11px] opacity-90">{doc.from.address}</p>}
      </aside>

      <div className="space-y-7 p-8">
        <BillTo doc={doc} t={t} />
        <ItemsTable doc={doc} t={t} money={money} variant="lines" />
        <TotalsBlock doc={doc} t={t} totals={totals} money={money} align="end" />
        <Footer doc={doc} t={t} />
      </div>
    </div>
  );
}

// ── Layout: banner (big accent header, striped numbered rows, THANK YOU) ─────

function BannerLayout({ doc, t, totals, money }: Ctx) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  const soft = `${t.accent}1a`;
  const cols = 'grid grid-cols-[2.5rem_1fr_3rem_5rem_5rem] items-center';
  return (
    <div className="pb-10">
      <div className="relative mb-6 min-h-[10rem]">
        <div className="absolute left-0 top-0 h-36 w-3/5 rounded-br-[3.5rem]" style={{ background: t.accent }} />
        <div className="relative flex items-start justify-between p-8">
          <div style={{ color: t.accentText }}>
            <p className="text-4xl font-extrabold uppercase tracking-tight">{docType?.label ?? 'Invoice'}</p>
            <p className="mt-3 text-xs">No. {doc.number}</p>
            <p className="text-xs">Date. {formatDate(doc.issueDate)}</p>
            <div className="mt-2 h-0.5 w-10" style={{ background: t.accentText }} />
          </div>
          <div className="text-right">
            {doc.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.logo} alt="" className="ml-auto h-10 object-contain" />
            ) : (
              <p className="text-lg font-bold" style={{ color: t.accent }}>{doc.from.name || 'Your Company'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-6 px-8">
        <div className="text-xs">
          <p className="mb-1 font-bold" style={{ color: t.accent }}>Bill to.</p>
          <PartyLines doc={doc} which="to" muted={t.muted} />
        </div>
        <div className="text-right text-xs">
          <p className="mb-1 font-bold" style={{ color: t.accent }}>From.</p>
          <p className="font-medium">{doc.from.name}</p>
          <p style={{ color: t.muted }}>{doc.from.email}</p>
          <p style={{ color: t.muted }}>{doc.from.phone}</p>
        </div>
      </div>

      <div className="mt-8 px-8">
        <div className={cn(cols, 'rounded-full px-5 py-2.5 text-xs font-semibold')} style={{ background: t.accent, color: t.accentText }}>
          <span>No</span><span>Item Description</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Total</span>
        </div>
        {doc.items.map((item, i) => (
          <div key={item.id} className={cn(cols, 'px-5 py-3 text-sm')} style={i % 2 === 1 ? { background: soft, borderRadius: '9999px' } : undefined}>
            <span style={{ color: t.muted }}>{i + 1}</span>
            <span className="font-semibold">{item.description || ' '}</span>
            <span className="text-right tabular-nums">{item.quantity}</span>
            <span className="text-right tabular-nums">{money(item.unitPrice)}</span>
            <span className="text-right tabular-nums">{money(lineAmount(item))}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-end">
          <div className="flex w-60 items-center justify-between border-t pt-2 text-sm font-bold" style={{ borderColor: t.accent, color: t.accent }}>
            <span>Grand Total</span><span className="tabular-nums">{money(totals.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 px-8 sm:grid-cols-2">
        <div className="text-xs">
          <p style={{ color: t.muted }}>Best Regards,</p>
          <p className="mb-4 border-b pb-4 font-medium" style={{ borderColor: t.border }}>{doc.from.name}</p>
          <p className="font-bold" style={{ color: t.accent }}>Contact.</p>
          <p style={{ color: t.muted }}>{doc.from.phone}</p>
          <p style={{ color: t.muted }}>{doc.from.email}</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold">THANK YOU</p>
          {doc.terms && (
            <>
              <p className="mt-2 text-sm font-bold" style={{ color: t.accent }}>Terms and Condition.</p>
              <p className="mt-1 text-xs" style={{ color: t.muted }}>{doc.terms}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Layout: corporate (logo lockup, dark table, stacked totals, signature) ───

function CorporateLayout({ doc, t, totals, money }: Ctx) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  const soft = `${t.accent}14`;
  const cols = 'grid grid-cols-[3rem_1fr_5rem_4rem_5rem]';
  return (
    <div className="pb-0">
      <div className="flex items-start justify-between p-8">
        <div className="flex min-w-[6rem] flex-col items-center gap-1 rounded p-3 text-center" style={{ background: t.accent, color: t.accentText }}>
          {doc.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={doc.logo} alt="" className="h-8 object-contain" />
          ) : (
            <span className="text-lg font-bold">{initials(doc.from.name)}</span>
          )}
          <span className="text-[10px] leading-tight">{doc.from.name}</span>
        </div>
        <p className="text-3xl font-extrabold uppercase tracking-[0.15em]">{docType?.label ?? 'Invoice'}</p>
      </div>

      <div className="flex flex-wrap justify-between gap-6 px-8">
        <div className="text-xs">
          <p className="font-bold" style={{ color: t.muted }}>INVOICE TO</p>
          <p className="text-lg font-bold">{doc.to.name || 'Customer'}</p>
          {doc.to.address && <p className="whitespace-pre-line" style={{ color: t.muted }}>{doc.to.address}</p>}
          <p className="mt-2 font-semibold">Contact Person</p>
          <p style={{ color: t.muted }}>{[doc.to.phone, doc.to.email].filter(Boolean).join(' · ')}</p>
        </div>
        <div className="text-xs" style={{ color: t.muted }}>
          <Meta label="Invoice No" value={doc.number} t={t} />
          <Meta label="Invoice Date" value={formatDate(doc.issueDate)} t={t} />
          {docType?.showDueDate && doc.dueDate && <Meta label="Due Date" value={formatDate(doc.dueDate)} t={t} />}
          <p className="mt-2 font-semibold" style={{ color: t.text }}>Payment Method</p>
          <p>{doc.from.email || ' '}</p>
        </div>
      </div>

      <div className="mt-8 px-8">
        <div className={cn(cols, 'px-4 py-2.5 text-xs font-semibold')} style={{ background: t.accent, color: t.accentText }}>
          <span>#</span><span>Description</span><span className="text-right">Price</span><span className="text-right">Qty</span><span className="text-right">Amount</span>
        </div>
        {doc.items.map((item, i) => (
          <div key={item.id} className={cn(cols, 'px-4 py-2.5 text-sm')} style={i % 2 === 0 ? { background: soft } : undefined}>
            <span style={{ color: t.muted }}>{String(i + 1).padStart(2, '0')}</span>
            <span>{item.description || ' '}</span>
            <span className="text-right tabular-nums">{money(item.unitPrice)}</span>
            <span className="text-right tabular-nums">{item.quantity}</span>
            <span className="text-right tabular-nums">{money(lineAmount(item))}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 items-end gap-6 px-8 sm:grid-cols-2">
        <div>
          <p className="text-xs" style={{ color: t.muted }}>Total Due</p>
          <p className="text-2xl font-extrabold">{money(totals.total)}</p>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
            <dt style={{ color: t.muted }}>Sub Total</dt><dd className="tabular-nums">{money(totals.subtotal)}</dd>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
              <dt style={{ color: t.muted }}>Discount</dt><dd className="tabular-nums">- {money(totals.discountAmount)}</dd>
            </div>
          )}
          {doc.tax.mode !== 'none' && totals.taxAmount > 0 && (
            <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
              <dt style={{ color: t.muted }}>{doc.tax.label} ({doc.tax.rate}%)</dt><dd className="tabular-nums">{money(totals.taxAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between px-3 py-2 text-base font-bold" style={{ background: t.accent, color: t.accentText }}>
            <dt>TOTAL</dt><dd className="tabular-nums">{money(totals.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 px-8 pb-6 sm:grid-cols-2">
        <div>
          {doc.terms && (
            <>
              <p className="text-sm font-bold">Terms &amp; Conditions</p>
              <p className="mt-1 text-xs" style={{ color: t.muted }}>{doc.terms}</p>
            </>
          )}
        </div>
        <div className="text-center">
          <p className="border-t pt-2 text-xs font-semibold" style={{ borderColor: t.border }}>{doc.from.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-4 text-xs" style={{ background: t.accent, color: t.accentText }}>
        <span>{doc.from.phone || ' '}</span>
        <span>{doc.from.address ? doc.from.address.replace(/\n/g, ', ') : ' '}</span>
        <span>{doc.from.email || ' '}</span>
      </div>
    </div>
  );
}

function Meta({ label, value, t }: { label: string; value: string; t: Template }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24">{label}</dt>
      <dd style={{ color: t.text }}>: {value}</dd>
    </div>
  );
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'CO';
}

// ── Layout: ribbon (accent bars flanking INVOICE, dark table, sign-off) ──────

function RibbonLayout({ doc, t, totals, money }: Ctx) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  const cols = 'grid grid-cols-[2.5rem_1fr_5rem_3rem_5rem]';
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        {doc.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={doc.logo} alt="" className="h-9 object-contain" />
        ) : (
          <p className="text-base font-bold">{doc.from.name || 'Your Company'}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="h-7 w-16 rounded-sm" style={{ background: t.accent }} />
          <span className="text-3xl font-extrabold uppercase tracking-tight">{docType?.label ?? 'Invoice'}</span>
          <span className="h-7 w-6 rounded-sm" style={{ background: t.accent }} />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-6">
        <div className="text-xs">
          <p className="font-bold">Invoice to:</p>
          <p className="mt-1 text-sm font-bold">{doc.to.name || 'Customer'}</p>
          {doc.to.address && <p className="whitespace-pre-line" style={{ color: t.muted }}>{doc.to.address}</p>}
        </div>
        <div className="space-y-0.5 text-xs">
          <div className="flex justify-end gap-6"><span className="font-bold">Invoice#</span><span style={{ color: t.muted }}>{doc.number}</span></div>
          <div className="flex justify-end gap-6"><span className="font-bold">Date</span><span style={{ color: t.muted }}>{formatDate(doc.issueDate)}</span></div>
        </div>
      </div>

      <div>
        <div className={cn(cols, 'px-3 py-2 text-xs font-semibold')} style={{ background: t.text, color: t.surface }}>
          <span>SL.</span><span>Item Description</span><span className="text-right">Price</span><span className="text-right">Qty.</span><span className="text-right">Total</span>
        </div>
        {doc.items.map((item, i) => (
          <div key={item.id} className={cn(cols, 'px-3 py-2.5 text-sm')} style={i % 2 === 1 ? { background: `${t.muted}1a` } : undefined}>
            <span style={{ color: t.muted }}>{i + 1}</span>
            <span className="font-semibold">{item.description || ' '}</span>
            <span className="text-right tabular-nums">{money(item.unitPrice)}</span>
            <span className="text-right tabular-nums">{item.quantity}</span>
            <span className="text-right tabular-nums">{money(lineAmount(item))}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="text-xs">
          <p className="mb-2">Thank you for your business</p>
          {doc.terms && (<><p className="font-bold">Terms &amp; Conditions</p><p style={{ color: t.muted }}>{doc.terms}</p></>)}
          <p className="mt-3 font-bold">Payment Info:</p>
          <p style={{ color: t.muted }}>{doc.from.email}</p>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span style={{ color: t.muted }}>Sub Total:</span><span className="tabular-nums">{money(totals.subtotal)}</span></div>
          {doc.tax.mode !== 'none' && <div className="flex justify-between"><span style={{ color: t.muted }}>Tax:</span><span className="tabular-nums">{doc.tax.rate}%</span></div>}
          <div className="flex justify-between rounded px-3 py-2 font-bold" style={{ background: t.accent, color: t.accentText }}><span>Total:</span><span className="tabular-nums">{money(totals.total)}</span></div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-3 text-xs" style={{ borderColor: t.accent, color: t.muted }}>
        <span>{[doc.from.phone, doc.from.address?.split('\n')[0], doc.from.email].filter(Boolean).join('  |  ')}</span>
        <span className="border-t pt-1 font-medium" style={{ borderColor: t.text, color: t.text }}>Authorised Sign</span>
      </div>
    </div>
  );
}

// ── Layout: wave (corner accents, ledger with sub-lines, GRAND TOTAL bar) ─────

function WaveLayout({ doc, t, totals, money }: Ctx) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  const cols = 'grid grid-cols-[3rem_1fr_6rem_6rem]';
  return (
    <div className="relative space-y-6 p-8">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5" style={{ background: t.text }} aria-hidden />
      <div className="pointer-events-none absolute -right-10 top-8 h-24 w-24 rotate-45" style={{ background: t.accent }} aria-hidden />
      <div className="pointer-events-none absolute -left-10 bottom-28 h-20 w-20 rotate-45" style={{ background: t.accent }} aria-hidden />

      <div className="relative flex items-start justify-between">
        {doc.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={doc.logo} alt="" className="h-10 object-contain" />
        ) : (
          <p className="text-2xl font-black italic" style={{ color: t.accent }}>{doc.from.name || 'Your Company'}</p>
        )}
        <div className="text-right">
          <p className="text-4xl font-black uppercase tracking-tight" style={{ color: t.accent }}>{docType?.label ?? 'Invoice'}</p>
          <p className="font-bold">{formatDate(doc.issueDate)}</p>
        </div>
      </div>

      <div className="relative flex items-end justify-between">
        <p className="text-xs font-bold">NO/ISN {formatDate(doc.issueDate)}</p>
        <div className="text-right text-xs">
          <p style={{ color: t.muted }}>TO.</p>
          <p className="text-lg font-bold">{doc.to.name || 'Customer'}</p>
          {doc.to.address && <p className="whitespace-pre-line" style={{ color: t.muted }}>{doc.to.address}</p>}
        </div>
      </div>

      <div className="relative border-y py-2" style={{ borderColor: t.text }}>
        <div className={cn(cols, 'text-sm font-bold')}>
          <span>QTY</span><span>DESCRIPTION</span><span className="text-right">PRICE</span><span className="text-right">TOTAL</span>
        </div>
      </div>
      <div className="relative space-y-3">
        {doc.items.map((item) => (
          <div key={item.id} className={cn(cols, 'items-start text-sm')}>
            <span className="font-bold">{item.quantity}</span>
            <span className="font-bold">{item.description || ' '}</span>
            <span className="text-right font-semibold tabular-nums">{money(item.unitPrice)}</span>
            <span className="text-right font-semibold tabular-nums">{money(lineAmount(item))}</span>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-1 gap-8 border-t pt-6 sm:grid-cols-2" style={{ borderColor: t.text }}>
        <div className="text-xs">
          <p className="font-bold">Payment Method</p>
          <p style={{ color: t.muted }}>{doc.from.email}</p>
          {doc.terms && (<><p className="mt-4 font-bold">Terms &amp; Condition</p><p style={{ color: t.muted }}>{doc.terms}</p></>)}
        </div>
        <div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span style={{ color: t.muted }}>Sub Total</span><span className="tabular-nums">{money(totals.subtotal)}</span></div>
            {doc.tax.mode !== 'none' && totals.taxAmount > 0 && <div className="flex justify-between"><span style={{ color: t.muted }}>Tax {doc.tax.rate}%</span><span className="tabular-nums">{money(totals.taxAmount)}</span></div>}
          </div>
          <div className="mt-6 flex items-center justify-between px-4 py-2.5 text-sm font-bold" style={{ background: t.accent, color: t.accentText }}>
            <span>GRAND TOTAL</span><span className="tabular-nums">{money(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Layout: artistic (decorative shapes, big studio name, minimal table) ─────

function ArtisticLayout({ doc, t, totals, money }: Ctx) {
  const cols = 'grid grid-cols-[1fr_3rem_5rem_5rem]';
  return (
    <div className="relative space-y-8 p-10" style={{ minHeight: '30rem' }}>
      <div className="pointer-events-none absolute -left-6 -top-6 h-36 w-52 rounded-[45%] opacity-70" style={{ background: '#8ea3b0' }} aria-hidden />
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rounded-[45%] opacity-80" style={{ background: t.accent }} aria-hidden />
      <div className="pointer-events-none absolute right-10 top-6 h-16 w-16 rotate-12 rounded-[40%]" style={{ background: `${t.text}22` }} aria-hidden />

      <p className="relative text-4xl font-bold">{doc.from.name || 'Company'}</p>

      <div className="relative ml-auto max-w-xs space-y-1 text-sm">
        <p className="font-bold">INVOICE #{doc.number}</p>
        <p>Invoice Date : {formatDate(doc.issueDate)}</p>
        {doc.from.taxId && <p>Account No : {doc.from.taxId}</p>}
      </div>

      <div className="relative">
        <div className={cn(cols, 'text-sm font-semibold')}>
          <span>DESCRIPTION</span><span className="text-right">QTY</span><span className="text-right">PRICE</span><span className="text-right">TOTAL</span>
        </div>
        <div className="mt-4 space-y-3">
          {doc.items.map((item) => (
            <div key={item.id} className={cn(cols, 'items-center text-sm')}>
              <span>{item.description || ' '}</span>
              <span className="text-right tabular-nums">{String(item.quantity).padStart(2, '0')}</span>
              <span className="text-right tabular-nums">{money(item.unitPrice)}</span>
              <span className="text-right tabular-nums">{money(lineAmount(item))}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-end gap-10 text-2xl font-bold">
          <span>TOTAL</span><span className="tabular-nums">{money(totals.total)}</span>
        </div>
      </div>

      <div className="relative space-y-1 text-sm">
        <p>Email: {doc.from.email}</p>
        {doc.from.taxId && <p>Account No : {doc.from.taxId}</p>}
        <p>Name : {doc.from.name}</p>
      </div>
    </div>
  );
}

// ── Layout: curve (gradient curved header/footer, info boxes, pill table) ────

function CurveLayout({ doc, t, totals, money }: Ctx) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  const grad = `linear-gradient(135deg, ${t.accent}, ${t.accent2 ?? t.accent})`;
  const cols = 'grid grid-cols-[1fr_5rem_3rem_5rem]';
  const boxes: Array<[string, string]> = [
    ['Date', formatDate(doc.issueDate)],
    ['Number', doc.number],
    ['Due', formatDate(doc.dueDate)],
    ['Total', money(totals.total)],
  ];
  return (
    <div className="relative pb-0">
      <div className="relative overflow-hidden px-8 pb-16 pt-8">
        <div className="absolute left-0 top-0 h-44 w-full" style={{ background: grad, borderBottomRightRadius: '55% 90%' }} aria-hidden />
        <div className="relative flex items-start justify-between" style={{ color: t.accentText }}>
          <div>
            <p className="text-4xl font-black uppercase tracking-tight">{docType?.label ?? 'Invoice'}</p>
            <p className="mt-2 text-sm">Invoice to : <b>{doc.to.name || 'Customer'}</b></p>
          </div>
          <div className="text-right">
            {doc.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.logo} alt="" className="ml-auto h-10 object-contain" />
            ) : (
              <p className="text-lg font-bold">{doc.from.name || 'Your Company'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="-mt-6 px-8 text-right text-xs" style={{ color: t.muted }}>
        {doc.from.address && <p className="whitespace-pre-line">{doc.from.address}</p>}
        <p>{[doc.from.phone, doc.from.email].filter(Boolean).join(' · ')}</p>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3 px-8">
        {boxes.map(([label, value]) => (
          <div key={label} className="rounded p-3 text-center" style={{ background: `${t.muted}1a` }}>
            <p className="text-xs font-bold">{label}</p>
            <p className="mt-1 text-xs" style={{ color: t.muted }}>{value || ' '}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 px-8">
        <div className={cn(cols, 'rounded-full px-5 py-2.5 text-xs font-bold')} style={{ background: grad, color: t.accentText }}>
          <span>ITEM DESCRIPTION</span><span className="text-right">PRICE</span><span className="text-right">QTY</span><span className="text-right">TOTAL</span>
        </div>
        {doc.items.map((item) => (
          <div key={item.id} className={cn(cols, 'items-center px-5 py-3 text-sm')} style={{ borderBottom: `1px solid ${t.border}` }}>
            <span className="font-bold">{item.description || ' '}</span>
            <span className="text-right tabular-nums">{money(item.unitPrice)}</span>
            <span className="text-right tabular-nums">{item.quantity}</span>
            <span className="text-right tabular-nums">{money(lineAmount(item))}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 px-8 sm:grid-cols-2">
        <div className="text-xs">
          <p className="text-sm font-bold uppercase">Payment Terms</p>
          {doc.terms && <p style={{ color: t.muted }}>{doc.terms}</p>}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="font-bold">Subtotal</span><span className="font-bold tabular-nums">{money(totals.subtotal)}</span></div>
          {doc.tax.mode !== 'none' && totals.taxAmount > 0 && <div className="flex justify-between"><span className="font-bold">{doc.tax.label} {doc.tax.rate}%</span><span className="font-bold tabular-nums">{money(totals.taxAmount)}</span></div>}
          <div className="flex items-center justify-between"><span className="font-bold">Total Due</span><span className="rounded px-3 py-1.5 font-bold" style={{ background: grad, color: t.accentText }}>{money(totals.total)}</span></div>
        </div>
      </div>

      <div className="mt-10 flex items-end justify-between px-8">
        <p className="border-t pt-1 text-xs font-bold" style={{ borderColor: t.text }}>{doc.from.name}</p>
        <p className="text-2xl font-black" style={{ color: t.accent }}>THANK YOU</p>
      </div>

      <div className="mt-6 h-8 w-full" style={{ background: grad, borderTopLeftRadius: '55% 90%' }} aria-hidden />
    </div>
  );
}

// ── Shared pieces ────────────────────────────────────────────────────────────

function Seller({ doc, t }: { doc: InvoiceDocument; t: Template }) {
  return (
    <div className="flex items-start gap-3">
      {doc.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={doc.logo} alt="" className="h-12 w-12 rounded object-contain" />
      )}
      <div>
        <p className="text-lg font-bold" style={{ color: t.text }}>{doc.from.name || 'Your Company'}</p>
        {doc.from.address && <p className="mt-1 whitespace-pre-line text-xs" style={{ color: t.muted }}>{doc.from.address}</p>}
        <p className="mt-1 text-xs" style={{ color: t.muted }}>{[doc.from.email, doc.from.phone].filter(Boolean).join(' · ')}</p>
        {doc.from.taxId && <p className="text-xs" style={{ color: t.muted }}>Tax ID: {doc.from.taxId}</p>}
      </div>
    </div>
  );
}

function DocMeta({ doc, t, align }: { doc: InvoiceDocument; t: Template; align: 'right' | 'left' }) {
  const docType = DOC_TYPES_BY_ID[doc.docType];
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <p className="text-2xl font-bold uppercase tracking-tight" style={{ color: t.accent }}>{docType?.label ?? 'Document'}</p>
      <p className="mt-1 font-mono text-sm">{doc.number}</p>
      <dl className="mt-3 space-y-0.5 text-xs" style={{ color: t.muted }}>
        <div className={cn('flex gap-2', align === 'right' && 'justify-end')}>
          <dt>Issued</dt>
          <dd style={{ color: t.text }}>{formatDate(doc.issueDate)}</dd>
        </div>
        {docType?.showDueDate && doc.dueDate && (
          <div className={cn('flex gap-2', align === 'right' && 'justify-end')}>
            <dt>Due</dt>
            <dd style={{ color: t.text }}>{formatDate(doc.dueDate)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function BillTo({ doc, t }: { doc: InvoiceDocument; t: Template }) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: t.muted }}>Bill to</p>
      <PartyLines doc={doc} which="to" muted={t.muted} boldName />
    </section>
  );
}

function PartyLines({ doc, which, muted, boldName }: { doc: InvoiceDocument; which: 'to' | 'from'; muted: string; boldName?: boolean }) {
  const p = doc[which];
  return (
    <>
      <p className={boldName ? 'mt-1 font-medium' : 'font-medium'}>{p.name || 'Customer'}</p>
      {p.address && <p className="whitespace-pre-line text-xs" style={{ color: muted }}>{p.address}</p>}
      <p className="text-xs" style={{ color: muted }}>{[p.email, p.phone].filter(Boolean).join(' · ')}</p>
      {p.taxId && <p className="text-xs" style={{ color: muted }}>Tax ID: {p.taxId}</p>}
    </>
  );
}

function ItemsTable({
  doc,
  t,
  money,
  variant,
}: {
  doc: InvoiceDocument;
  t: Template;
  money: (n: number) => string;
  variant: 'accent' | 'bordered' | 'lines';
}) {
  const bordered = variant === 'bordered';
  const headStyle =
    variant === 'accent' || bordered ? { background: t.accent, color: t.accentText } : { color: t.muted, borderBottom: `2px solid ${t.accent}` };
  return (
    <table className="w-full border-collapse text-sm" style={bordered ? { border: `1px solid ${t.border}` } : undefined}>
      <thead>
        <tr style={headStyle}>
          <th className={cn('px-3 py-2 text-left font-semibold', variant === 'accent' && 'rounded-l-md')}>Description</th>
          <th className="px-3 py-2 text-right font-semibold">Qty</th>
          <th className="px-3 py-2 text-right font-semibold">Unit price</th>
          <th className={cn('px-3 py-2 text-right font-semibold', variant === 'accent' && 'rounded-r-md')}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {doc.items.map((item) => (
          <tr key={item.id} style={{ borderBottom: `1px solid ${t.border}` }}>
            <td className="px-3 py-2 align-top" style={bordered ? { borderRight: `1px solid ${t.border}` } : undefined}>{item.description || ' '}</td>
            <td className="px-3 py-2 text-right align-top tabular-nums" style={bordered ? { borderRight: `1px solid ${t.border}` } : undefined}>{item.quantity}</td>
            <td className="px-3 py-2 text-right align-top tabular-nums" style={bordered ? { borderRight: `1px solid ${t.border}` } : undefined}>{money(item.unitPrice)}</td>
            <td className="px-3 py-2 text-right align-top font-medium tabular-nums">{money(lineAmount(item))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TotalsBlock({ doc, t, totals, money, align, boxed }: Ctx & { align: 'end'; boxed?: boolean }) {
  return (
    <div className={cn('flex', align === 'end' && 'justify-end')}>
      <dl className={cn('w-full max-w-xs space-y-1.5 text-sm', boxed && 'p-3')} style={boxed ? { border: `1px solid ${t.border}` } : undefined}>
        <Line label="Subtotal" value={money(totals.subtotal)} muted={t.muted} />
        {totals.discountAmount > 0 && <Line label="Discount" value={`- ${money(totals.discountAmount)}`} muted={t.muted} />}
        {doc.tax.mode !== 'none' && totals.taxAmount > 0 && (
          <Line label={`${doc.tax.label} (${doc.tax.rate}%${doc.tax.mode === 'inclusive' ? ' incl.' : ''})`} value={money(totals.taxAmount)} muted={t.muted} />
        )}
        {totals.shipping > 0 && <Line label="Shipping" value={money(totals.shipping)} muted={t.muted} />}
        <div className="mt-2 flex items-center justify-between rounded-md px-3 py-2 text-base font-bold" style={{ background: t.accent, color: t.accentText }}>
          <dt>Total</dt>
          <dd className="tabular-nums">{money(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function Footer({ doc, t }: { doc: InvoiceDocument; t: Template }) {
  if (!doc.notes && !doc.terms) return null;
  return (
    <footer className="space-y-3 border-t pt-6 text-xs" style={{ borderColor: t.border, color: t.muted }}>
      {doc.notes && (
        <div>
          <p className="font-semibold" style={{ color: t.text }}>Notes</p>
          <p className="mt-0.5 whitespace-pre-line">{doc.notes}</p>
        </div>
      )}
      {doc.terms && (
        <div>
          <p className="font-semibold" style={{ color: t.text }}>Terms</p>
          <p className="mt-0.5 whitespace-pre-line">{doc.terms}</p>
        </div>
      )}
    </footer>
  );
}

function Line({ label, value, muted }: { label: string; value: string; muted: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt style={{ color: muted }}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
