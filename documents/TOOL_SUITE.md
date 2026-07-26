# Tool Suite

A set of four self-contained productivity tools. Every tool runs **entirely in
the browser**: no AI, no paid APIs, no OCR services, no server round-trip for the
core computation. Scoring and serialization are pure, unit-tested functions; file
parsing and rendering happen client-side. This keeps user documents private (a
resume never leaves the browser) and the tools free to run.

> Rule 0 still applies: read this before touching anything under
> `apps/web/src/lib/tools`, `apps/web/src/components/tools`, or the SEO audit
> under `apps/web/src/lib/website-intel/seo`.

## Placement

| Tool | Where it lives | Route |
| --- | --- | --- |
| Email Signature Generator | Document Generator, 3rd tab | `/tools/documents` |
| SEO Audit | Website Intelligence, 2nd tab | `/website-intelligence` |
| ATS Resume Scanner | Resume & ATS, tab 1 | `/tools/resume` |
| Resume Builder | Resume & ATS, tab 2 | `/tools/resume` |

Tabs mount only the active tool, so each keeps its own print-isolation target and
there is no cross-talk between print styles.

## Architecture

Each tool separates three concerns:

1. **Pure engine** (`lib/`): deterministic, dependency-light, unit-tested. No DOM,
   no React. This is where scoring, HTML generation and serialization live.
2. **Client I/O** (`lib/.../extract.ts` and component handlers): file reading,
   clipboard, downloads, print. Browser-only, dynamically imported so parsers are
   not in the initial bundle.
3. **UI** (`components/tools/`): editor plus live preview, no business logic.

```
apps/web/src/
  lib/tools/signature/      build.ts (email-safe HTML) · themes.ts · types.ts · sample.ts
  lib/tools/ats/            analyze.ts (scoring) · skills.ts · extract.ts (pdf/docx/txt)
  lib/tools/resume/         types.ts · templates.ts · sample.ts · serialize.ts
  lib/website-intel/seo/    audit.ts (23 checks) · run.ts
  components/tools/signature/  signature-generator.tsx
  components/tools/ats/        ats-scanner.tsx
  components/tools/resume/     resume-builder.tsx · resume-preview.tsx · resume-tools-tabs.tsx
  components/website-intelligence/  seo-audit.tsx · website-intel-tabs.tsx
```

## Tools

### Email Signature Generator

- `buildSignatureHtml(data)` emits **email-safe HTML**: a `<table>` layout with
  inline styles only (no external CSS, no web fonts), so it survives Gmail,
  Outlook and Apple Mail. Social chips are self-contained coloured spans, not
  remote icons.
- `safeUrl` allows `http/https/mailto/tel` and upgrades bare domains; `escapeHtml`
  guards every interpolated value.
- Exports: copy as rich text (`ClipboardItem` with `text/html`), copy raw HTML,
  download `.html`, download PNG (`html-to-image`), print.

### SEO Audit

- Reuses the Website Intelligence page-fact collector (`collectPage` /
  `extractFacts`) rather than fetching the page again.
- `auditSeo(facts, extra)` runs **23 weighted checks** (title, meta description,
  headings, canonical, Open Graph, images alt, links, viewport, structured data,
  word count, keyword density, and more) and returns a weighted 0-100 score mapped
  to an A+..F grade with per-check status and fixes.
- Served by a gated (`authorize('write')`), rate-limited route at
  `/api/website-intelligence/seo-audit`.

### ATS Resume Scanner

- `analyzeResume(resumeText, jobDescription)` scores a resume against a job
  description across keyword match, skills coverage, section completeness and
  formatting/ATS-friendliness, returning an overall 0-100 with a per-dimension
  breakdown, matched/missing terms and suggestions.
- File text is extracted in the browser: PDF via `pdfjs-dist` (worker loaded from
  a bundled URL), DOCX via `mammoth`, TXT via `FileReader`. Users can also paste
  text directly.
- Exports: JSON report, print.

### Resume Builder

- Typed model (`ResumeData`): contact, summary, experience, education, skills,
  projects, certifications, links, plus a `sections` array that controls **order
  and visibility**.
- Sections are reordered by drag and toggled on/off with Framer Motion `Reorder`.
- Five templates across three layouts: **classic** (single column), **modern**
  (accent header band), **sidebar** (accent rail with contact/skills/links).
  Colours are inline on the preview so print keeps them.
- `serialize.ts`: `toJson` is a loss-less round-trip; `fromJson` merges a partial
  or older file onto the sample so imports always yield a complete, renderable
  resume (returns `null` only on invalid JSON).
- Exports: print-to-PDF (`@page` size follows A4/Letter), JSON export, JSON
  import. Autosaves to `localStorage`.

## Print-to-PDF

Tools that produce a printable artifact inject a scoped print stylesheet:

```css
@media print {
  body * { visibility: hidden; }
  #<target>, #<target> * { visibility: visible; }
  #<target> { position: absolute; left: 0; top: 0; }
}
```

Only the active tab is mounted, so exactly one print target exists at a time.

## Persistence (Prisma)

Optional server-side storage. The core tools work without it; these models let a
tenant save results.

- `EmailSignature`, `SignatureTemplate`
- `AtsReport` (score denormalised for list/sort; full report in `report` JSON)
- `Resume` (full `ResumeData` in `data`, `templateId`/`name` denormalised),
  `ResumeVersion` (immutable snapshots)

All follow the DB conventions: UUID default, `tenant_id`, base audit columns, soft
delete, `@@map` to snake_case, composite `tenant_id + lookup` indexes.

## Testing

Pure engines are unit-tested with `node:test` (run with
`corepack pnpm exec tsx --test <file>`):

- `lib/tools/signature/signature.test.ts`
- `lib/website-intel/seo/seo.test.ts`
- `lib/tools/ats/ats.test.ts`
- `lib/tools/resume/resume.test.ts`

## Conventions

- **No AI, no paid APIs.** Everything is rule-based and local.
- **No em-dashes in user-visible content.** Use commas, periods, colons or
  parentheses in i18n strings, labels and sample data.
- Scroll columns that hold `sr-only` file inputs must be `position: relative` so
  the absolutely-positioned input cannot escape and stretch the page.
- i18n across `en`, `hi`, `ja`, `zh`.
