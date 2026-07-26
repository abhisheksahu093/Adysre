# Tools module

A suite of local, open-source generators inside ADYSRE. No paid APIs — every
tool runs in the browser (or, later, against our own Postgres). Reached from the
**Tools** section of the sidebar.

## Status

| Phase | Scope | State |
| --- | --- | --- |
| 1 — Architecture | Module layout, sidebar entry, i18n | ✅ done |
| 3 — QR Generator | Typed payloads across 6 categories, live preview | ✅ done |
| 4 — QR Designer | Colors, gradient, dot/eye styles, logo, size, ECL | ✅ done |
| — Downloads | PNG · SVG · JPG | ✅ done |
| 2 — Database | Prisma `qr_folders`/`qr_codes`/`qr_scans` (validated) | ✅ done |
| — Dynamic QR | UUID/slug/folder/tags/favorite, `/q/<slug>` redirect + scan capture | ✅ done |
| 8/9 — Analytics | Totals, 14-day timeline, device/browser/country/referrer | ✅ done |
| 5/6 — Documents + PDF | Invoice generator, templates, print-ready PDF, export/import | ✅ done |
| 7 — Barcode | EAN/UPC/Code128/Code39/ITF-14 via JsBarcode, + QR hybrid | ✅ done |

### Barcode generator (`lib/tools/barcode`, Phase 7)

- **`validate.ts`** — the engine: the GS1 mod-10 check digit (`gs1CheckDigit`)
  and per-format validation/normalisation. EAN-13/8, UPC-A and ITF-14 compute
  the check digit from the body and verify it on a full paste; CODE39/CODE128
  validate by character set. Pure, unit-tested against the canonical GS1
  examples — so the preview only ever renders a scannable symbol.
- **`types.ts`** — the format registry (labels/hints/samples/`jsFormat`), the
  extension point for any format JsBarcode knows.
- **UI** (`components/tools/barcode/barcode-generator.tsx`) — live JsBarcode
  render into an `<svg>`, a designer (bar/background color, transparent, bar
  width, height, quiet zone, show-value), PNG (offscreen canvas) + SVG download,
  and **QR Hybrid** — a QR of the same value beside the barcode, reusing
  qr-code-styling. Both libraries dynamically imported (client-only).

### Invoice generator (`lib/tools/invoice`, Phase 5/6)

- **`totals.ts`** — the money engine: subtotal, percent/fixed discount (clamped),
  exclusive/inclusive tax, shipping, 2-decimal rounding. Pure, unit-tested — the
  preview, the CSV and the JSON all read from it, so numbers can't drift.
- **`registry.ts`** — document types (invoice/GST/VAT/proforma, quotation,
  receipt, PO/SO/delivery…); the extension point for the spec's 60+ types.
- **`templates.ts`** — the look, as config (palette + header treatment), applied
  as inline styles because the document is a paper artifact (like QR colors),
  not app chrome. Six templates; adding more is one entry.
- **`exchange.ts`** — JSON (loss-less) + line-item CSV export, and a correct
  quoted-CSV import parser. Tested round-trip.
- **PDF** — `window.print()` with a print stylesheet that isolates the paper
  (`#invoice-print`) and sets `@page` size/orientation (A4/Letter/Legal,
  portrait/landscape). Dependency-free, offline, vector-quality via the
  browser's own PDF engine.

**Templates & layouts** — a template is a palette plus a `layout`
(`standard` / `classic` / `sidebar`). The layout picks a genuinely different
structure in `invoice-preview` (accent header row, boxed fully-bordered ledger,
or an accent side rail), so different templates read as different documents, not
one recolored. Ten templates ship; adding more is one entry in `templates.ts`.

Not yet: Prisma persistence (models `documents`/`document_items`/`companies`/
`customers`/`products`), the drag-and-drop section builder, the full 30+
templates and 60+ doc types, and PNG/JPG/Excel/XML export.

### Salary slip generator (`lib/tools/salary`)

A separate document with its own model and layout: two ledgers (earnings and
deductions) plus employee and pay-period fields, not priced line items.
`totals.ts` computes gross, total deductions and net pay (pure, unit-tested).
`salary-preview.tsx` renders the classic bordered payslip; the generator adds a
live editor and print-to-PDF. Reuses the invoice templates for palette.

### Dynamic QR (Phase 2)

- **Storage**: `lib/tools/qr/store` — a tenant-scoped `QrStore` (memory + file
  now, so it works locally with no DB; Prisma is the production backend). Codes
  and scans are partitioned by `tenantId`; `get`/`update`/`remove` are
  IDOR-guarded; `findBySlug` is the one cross-tenant read (the public redirect).
- **Public redirect**: `app/q/[slug]/route.ts` resolves the slug, records the
  scan (device/OS/browser/referrer/region/UTM — all parsed offline from headers,
  no geo-IP service), and 302s to the target. Excluded from i18n middleware.
- **Management API**: `api/tools/qr/codes` (list/create), `…/[id]`
  (get/patch/delete), `…/[id]/analytics` — all behind the app session.
- **Prisma models** live in `packages/database/prisma/schema.prisma` and pass
  `prisma validate`. The migration needs a running Postgres:
  `pnpm --filter @adysre/database db:migrate` (then swap the store factory to a
  `PrismaQrStore`).

## QR engine (`lib/tools/qr`)

Layered so the payload, the look, and the rendering are independent:

- **`encode.ts`** — pure encoders. Each turns typed input into the exact string
  a scanner expects (`WIFI:…`, vCard 3.0, `tel:`/`mailto:`/`SMSTO:`, `wa.me`,
  `geo:`, iCalendar `VEVENT`, `upi://pay`) with the escaping each grammar needs.
  No DOM, fully unit-tested (`qr.test.ts`).
- **`registry.ts`** — the type catalogue. Each entry is `{ category, label,
  fields, build }`. **This is the extension point:** the product spec's 100+
  types are all either a payload the encoders cover or a URL builder, so adding
  them is appending entries here — the form renderer, live preview and download
  engine are already generic.
- **`designer.ts`** — the visual model (`QrDesign`) and `toStylingOptions`,
  the one place that maps onto `qr-code-styling`.

The UI (`components/tools/qr/qr-generator.tsx`) wires these to inputs and a live
canvas. `qr-code-styling` is dynamically imported so it only loads on this route.

### Adding a QR type

Append to `QR_TYPES` in `registry.ts`:

```ts
{
  id: 'discord',
  category: 'social',
  label: 'Discord',
  hint: 'Open a Discord invite.',
  fields: [{ name: 'invite', label: 'Invite code or URL', type: 'text', required: true }],
  build: (v) => encodeSocial('https://discord.gg/', v.invite ?? ''),
}
```

That's the whole change — no component edits.

## Planned Prisma schema (dynamic QR + analytics)

Dynamic QR needs persistence; these models slot into `packages/database` and
follow the DB constitution (UUIDv7 ids, `tenant_id`, base audit columns, soft
delete). A short-code route (`/q/[slug]`) resolves the target and records a scan.

```prisma
model QrCode {
  id            String    @id @default(uuid()) @db.Uuid
  tenantId      String    @map("tenant_id") @db.Uuid
  slug          String    @unique
  type          String                 // registry id
  payload       Json                   // field values
  design        Json                   // QrDesign
  targetUrl     String?   @map("target_url")
  folderId      String?   @map("folder_id") @db.Uuid
  tags          String[]
  favorite      Boolean   @default(false)
  scans         QrScan[]
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")
  @@index([tenantId, folderId])
  @@map("qr_codes")
}

model QrScan {
  id         String   @id @default(uuid()) @db.Uuid
  qrCodeId   String   @map("qr_code_id") @db.Uuid
  qrCode     QrCode   @relation(fields: [qrCodeId], references: [id])
  country    String?
  city       String?
  device     String?
  browser    String?
  os         String?
  referrer   String?
  utm        Json?
  scannedAt  DateTime @default(now()) @map("scanned_at")
  @@index([qrCodeId, scannedAt])
  @@map("qr_scans")
}
```

Geo/device come from parsing the request (Accept-Language, User-Agent, an
offline IP-to-country table) — no external API.
