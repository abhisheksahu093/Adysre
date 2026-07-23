# Design Playground — PRD

A browser-based visual design editor (Figma / Framer / Canva class) for building
websites, dashboards, mobile apps, social graphics and UI components by direct
manipulation. It is a **first-class ADYSRE module**, not a standalone app: it
obeys the [Constitution](../CLAUDE.md), the
[coding standards](./CODING_STANDARDS.md), the
[API standards](./API_STANDARDS.md), the
[RBAC model](./AUTHENTICATION_RBAC.md) and the
[design system](./UI_DESIGN_SYSTEM.md).

> **Status:** Phase 1 complete except server persistence, and parts of Phases
> 2–3 have landed early.
>
> Shipped: the editor shell; the document model with a command/undo stack
> (`lib/design-playground/`); the Konva canvas with pan, zoom and zoom-to-fit;
> frames, rectangles, ellipses, text and images; selection, marquee select,
> transform and grouping; all seven left-rail panels (pages, layers, sections,
> components, assets, images, AI); a selection-bound inspector; delete via
> context menu, inspector actions and keyboard; export to PNG, JPEG, SVG, HTML
> and `.adysre` JSON, plus project import; keyboard shortcuts; and autosave to
> local storage.
>
> **Server persistence** is built: a `DesignProject` model (JSONB document,
> tenant-scoped, soft-deleted), a repository, and Next.js route handlers under
> `/api/design-playground/projects`. `localStorage` is demoted from system of
> record to an offline buffer — the editor keeps working when storage is
> unreachable and syncs when it returns. It needs a live database to exercise:
> set `DATABASE_URL` in `packages/database/.env`, then `pnpm db:migrate` and
> `pnpm db:seed`.
>
> Still open: tenancy is resolved from the seeded demo org because the web app
> has no session yet (`lib/design-playground/tenant-server.ts` documents the
> swap), the NestJS `design` module and `design:project:*` permission checks,
> per-project management UI (the editor opens the most recent project), image
> assets still living in the document rather than object storage, snapping and
> alignment guides, auto-layout, component variants, real gradient fills, and
> everything from Phase 4.

---

## 1. Goal

Let a user design a product surface without writing code, then leave with either
the design or production-ready code.

A user can: create a project → add pages → place frames → drag in sections and
components → edit visually → apply styles and variables → export as code, image
or `.adysre` file → save it as a template → share it.

## 2. Non-goals

- It is **not** a drawing/illustration app. Freehand art, brush engines and
  raster painting are out of scope; vector shapes exist to support UI, not art.
- It is **not** a CMS. Content modelling stays with the owning module.
- It does **not** replace the component library at `/components`. The library is
  the source of truth for sections; the playground *consumes* it.

## 3. Principles

Everything placed on the canvas is editable, draggable, resizable, rotatable,
responsive, reusable and exportable. Anything that cannot be exported does not
belong on the canvas.

---

## 4. Architecture

### 4.1 Feature modules

The editor is split into independent modules with explicit interfaces, so a new
tool, asset provider, export target or plugin lands without touching the core.

| Module | Owns |
| --- | --- |
| `canvas` | Scene graph, viewport, hit-testing, selection, transform, snapping |
| `document` | Project/page/frame/layer model, mutations, undo stack, persistence |
| `assets` | Icons, images, illustrations, patterns, gradients, uploads |
| `layers` | Tree view, ordering, grouping, lock/hide, search |
| `properties` | Inspector panels bound to the selection |
| `library` | Sections and components sourced from `@/data/components` |
| `variables` | Design tokens, themes, breakpoints |
| `export` | Code generation (AST → target), image/PDF serialisation |
| `ai` | Generation and prompt-driven editing |
| `collaboration` | Presence, live cursors, comments, version history |
| `plugins` | Third-party surface and sandbox |

**Dependency rule:** `canvas` and `document` know nothing about `library`, `ai`,
`export` or `collaboration`. The dependency arrow always points inward, toward
`document`. Modules communicate through typed commands, never by reaching into
each other's stores.

### 4.2 Command model

Every mutation is a **command** — a serialisable object with `apply` and
`invert`. This single decision buys undo/redo, version history, CRDT sync and an
AI edit surface from one code path. No module mutates the document directly.

```ts
interface Command<T = unknown> {
  type: string;          // 'layer.move', 'style.set', …
  payload: T;
  apply(doc: Document): Document;
  invert(doc: Document): Command;
}
```

### 4.3 Rendering

Konva on `<canvas>` for the scene, React for all chrome (toolbars, panels,
dialogs). React never re-renders per frame: the canvas subscribes to the
document store directly and repaints imperatively.

### 4.4 Placement in the monorepo

```
apps/web/src/
  app/[locale]/(editor)/design-playground/   route (own full-screen shell)
  components/design-playground/              editor UI, one folder per module
  config/design-playground.ts                tools, panels, frame presets
  stores/design-playground-store.ts          editor state (Zustand)
  lib/design-playground/                     document model, commands, export
apps/api/src/modules/design/                 projects, pages, assets, sharing
packages/database/                           Prisma models
```

Shared primitives (buttons, dialogs, inputs) come from `adysre`. Colours come
from `@adysre/theme` tokens — **no hex, no inline styles** in chrome. Canvas
*content* is user data and carries its own literal colours; that is the one
allowed exception, and it lives in the document model, never in a component.

---

## 5. Layout

```
┌───────────────────────────────────────────────────────────────┐
│ Top toolbar   file · tools · zoom · breakpoint · share/export │
├──────────┬────────────────────────────────────────┬───────────┤
│ Left     │                                        │ Right     │
│ rail     │            Infinite canvas             │ inspector │
│          │                                        │           │
│ assets   │                                        │ transform │
│ layers   │                                        │ layout    │
│ pages    │                                        │ style     │
│ sections │                                        │ effects   │
│ compon.  │                                        │ text      │
│ icons    │                                        │ export    │
│ images   │                                        │           │
│ ai       │                                        │           │
├──────────┴────────────────────────────────────────┴───────────┤
│ Status bar    zoom · grid · coordinates · autosave            │
└───────────────────────────────────────────────────────────────┘
```

Both side panels are collapsible and resizable. Below `lg` the rails become
sheets; the canvas always keeps the viewport.

---

## 6. Data model

```
Project ─┬─ Pages ─┬─ Frames ─┬─ Layers (tree) ─ Nodes
         │         │
         ├─ Components (reusable, with variants/props/slots)
         ├─ Variables (colour, type, spacing, radius, shadow)
         ├─ Assets (uploads, references)
         └─ Metadata (name, thumbnail, breakpoints, theme)
```

A **Node** is the single canvas primitive:

```ts
interface Node {
  id: string;               // UUIDv7
  type: NodeType;           // frame | text | shape | image | icon | instance | group
  name: string;
  parentId: string | null;
  children: string[];       // flat map + id list; never nested objects
  transform: { x: number; y: number; width: number; height: number; rotation: number };
  layout: LayoutSpec;       // none | flex | grid, plus constraints
  style: StyleSpec;         // fill, stroke, radius, shadow, effects, opacity, blend
  overrides?: Record<string, unknown>;  // component instances only
  responsive?: Partial<Record<BreakpointId, Partial<Node>>>;
  locked: boolean;
  hidden: boolean;
}
```

The document is a **flat map** (`Record<string, Node>`) plus a root id. Nested
objects are forbidden: flat storage keeps command application O(1), diffs small
and CRDT merges tractable.

### 6.1 Persistence

- Postgres via Prisma; every table carries the base columns and `tenant_id`
  ([database rules](./DATABASE_ARCHITECTURE.md)).
- The document is stored as JSONB with a `schemaVersion`; migrations upgrade on
  read and are pure functions.
- Assets go to object storage; rows keep the key and metadata only.
- Autosave every 30s and on blur, debounced, last-write-wins per command batch
  until Phase 4 introduces CRDT merge.

### 6.2 File format — `.adysre`

A zip: `document.json` (project + pages + nodes), `assets/`, `thumbnail.png`,
`meta.json` (schemaVersion, app version, created/updated). Import validates
against the Zod schema and refuses unknown major schema versions.

---

## 7. Feature specification

### 7.1 Canvas
Infinite pan and zoom (wheel, pinch, space-drag), minimap, rulers, snap to grid
and to geometry, smart alignment guides, distance measurements on `alt`, marquee
select, multi-select transform, nudge, duplicate-drag.

### 7.2 Frames
Presets: desktop, laptop, tablet, mobile, Instagram, Facebook, Twitter, YouTube
thumbnail, presentation, A4, custom. Each frame owns width, height, background,
padding, border, radius, shadow, auto-layout and grid. Presets live in
`config/design-playground.ts` — never inline in a component.

### 7.3 Sections and components
Sections come from the existing library (`@/data/components`) so the two stay in
lockstep: header, hero, about, features, pricing, FAQ, testimonials, gallery,
blog, CTA, footer, contact, auth, 404, dashboard, admin, commerce. Inserted
sections are fully editable nodes, not black boxes. UI components (button, input,
select, table, tabs, modal, chart, calendar, …) insert the same way.

### 7.4 Shapes, text, images, icons
Rectangle, ellipse, polygon, star, arrow, line, bezier, SVG. Text is Lexical-backed
rich text with the full typographic set, gradient fill, stroke and shadow. Images
support upload plus stock providers behind one `AssetProvider` interface, with
crop, mask, filters and compression. Icons come from the sets already shipped in
the app, searchable, recolourable, stroke-editable.

### 7.5 Layout system
Auto-layout (flex), grid, absolute and constraint-based positioning, gap,
padding, alignment and distribution — with a direct mapping to CSS so export is
lossless.

### 7.6 Component system
Create a component from any selection. Instances support variants, states, slots,
props and per-instance overrides. Editing the main component updates every
instance; overridden fields survive.

### 7.7 Variables and themes
Colour, typography, spacing, radius, shadow and opacity variables, grouped into
themes (light, dark, brand presets, custom). A variable change repaints the
document; export emits them as design tokens / CSS variables.

### 7.8 Responsive
Desktop, laptop, tablet and mobile breakpoints; each node may override transform,
layout and style per breakpoint. Unset values inherit from the next widest.

### 7.9 History
Undo/redo over the command stack, a visual timeline, and named version restore
points.

### 7.10 AI (Phase 3)
A panel that generates whole frames ("a modern fintech landing page, dark
theme") and edits the current selection by prompt ("make this Apple style",
"increase spacing", "replace icons"). AI output is **commands**, so every AI edit
is undoable, auditable and identical to a human edit. Model calls run server-side
through the API; the editor never holds a provider key.

### 7.11 Export
Code: HTML, CSS, Tailwind, React, Next.js, Vue, Nuxt, Svelte, Angular, React
Native; Flutter as layout approximation. Data: JSON, design tokens. Image: SVG,
PNG, JPG, PDF. Code generation is one AST pipeline with pluggable emitters —
adding a target means adding an emitter, nothing else.

### 7.12 Collaboration (Phase 4)
Presence, live cursors, comments anchored to nodes, share links with
permissions, activity feed, real-time co-editing over CRDT.

### 7.13 Plugins (Phase 4)
Sandboxed third-party panels and commands (charts, maps, calendars, Lottie, CMS)
against a stable, versioned plugin API.

---

## 8. Security and access

- Every project is tenant-scoped; a query without `tenant_id` is a bug.
- Permissions follow `module:resource:action`:
  `design:project:{create,read,update,delete}`, `design:template:publish`,
  `design:project:share`.
- Guards run `AuthGuard → TenantGuard → PermissionGuard`; deny by default.
- Share links are capability tokens: scoped, expiring, revocable, and never
  grant write access without an explicit role.
- Uploads are type- and size-checked server-side and served from a origin that
  cannot execute scripts.
- Plugins run sandboxed with no ambient access to session or storage.

## 9. Performance budget

| Metric | Target |
| --- | --- |
| Objects per page | 10,000+ |
| Interaction frame rate | 60 fps (pan, zoom, drag) |
| Time to interactive, 1,000-node document | < 2s |
| Autosave | every 30s, non-blocking |

Techniques: virtualised rendering (draw only the viewport), layer caching,
off-main-thread work in Web Workers (export, image processing, large mutations),
lazy asset loading, and never re-rendering React on canvas interaction.

## 10. Accessibility

Full keyboard operation of chrome (panels, dialogs, menus) and of the canvas
(arrow-key nudge, tab through layers, keyboard transform). ARIA roles on the
layer tree and panels, visible focus, screen-reader announcements for selection
and mutations, high-contrast support, WCAG AA throughout. The canvas exposes an
accessible layer-tree alternative — a `<canvas>` alone is not accessible.

## 11. Keyboard shortcuts

Move `V`, frame `F`, rectangle `R`, ellipse `O`, text `T`, hand `H`, duplicate
`⌘D`, delete `⌫`, undo `⌘Z`, redo `⇧⌘Z`, group `⌘G`, ungroup `⇧⌘G`, lock `⇧⌘L`,
hide `⇧⌘H`, zoom to fit `⇧1`, zoom to selection `⇧2`, 100% `⌘0`, search `⌘K`,
quick insert `⌘/`. Defined once in `config/design-playground.ts`.

## 12. Stack

Next.js App Router · TypeScript strict · Konva (canvas) · Zustand (state) ·
Lexical (rich text) · Tailwind + `adysre` + `@adysre/theme` (chrome) ·
Framer Motion (chrome animation only) · Prisma + PostgreSQL · Yjs (Phase 4
realtime) · object storage for assets · Fuse.js (search) · html-to-image,
custom SVG serialiser, jsPDF (export) · custom AST pipeline (code generation).

## 13. Phases

**Phase 1 — Editor foundation.** Shell, infinite canvas, frames, shapes, text,
layer tree, selection and transform, basic properties, project save/load.

**Phase 2 — Design system.** Section and component libraries, templates, assets,
auto-layout, breakpoints, variables and themes.

**Phase 3 — Intelligence and output.** AI generation and editing, code export,
image/PDF export, reusable components with variants.

**Phase 4 — Collaboration and platform.** Realtime co-editing, comments, version
history, plugins, team workspaces, publishing, public templates.

## 14. Definition of done

Per the Constitution: a change ships when it **builds, is typed, is tested, is
documented, is accessible (WCAG AA), is responsive, and is secure.** For this
module, add: it must not regress the frame-rate budget, and every new mutation
must go through a command (so it is undoable).

## 15. Implementation constraints

Build inside the existing monorepo and reuse its design system, auth, routing,
state and standards. Keep the modules in §4.1 independent behind clean
interfaces. Optimise for extensibility — a new tool, asset provider, export
target or plugin must not require refactoring the core. Modern React patterns,
strict TypeScript, no `any`, accessibility first, and smooth interaction at
scale.
