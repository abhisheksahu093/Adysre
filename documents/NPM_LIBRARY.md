# NPM Library — `adysre`

How the ADYSRE catalogue is published to npm, how to work on it day to day, and
how to add new asset families (fonts, shadows, animations) later.

> Read this before touching `packages/ui`. It is the contract between the
> product (`apps/web`, which sells the catalogue) and the package (which gives
> part of it away).

---

## 1. What ships

One package, `adysre`, with a subpath per asset family. Subpaths are not
cosmetic: they are the only thing stopping `import { Button }` from dragging 780
components into a consumer's module graph.

| Import | Contents |
|---|---|
| `adysre` | `cn` + the 9 styling primitives |
| `adysre/icons` | 448 icon components, `<Icon>`, the catalogue, SVG builders |
| `adysre/gradients` | 78 gradients, `<GradientSurface>`, CSS builders |
| `adysre/patterns` | 50 patterns, `<PatternSurface>`, CSS builders |
| `adysre/textures` | 28 textures, `<TextureSurface>`, CSS builders |
| `adysre/palettes` | 102 palettes + the colour maths |
| `adysre/blocks` | 780 section/page blocks |
| `adysre/blocks/<slug>` | one block, deep-imported |
| `adysre/styles.css` | Tailwind v4 entry (tokens + `@source`) |
| `adysre/dist.css` | pre-compiled CSS for non-Tailwind consumers |

### What does NOT ship

- Anything the catalogue flags `premium: true`. The set is empty today; flag an
  entry in `apps/web/src/data/components/*.ts` and the next `gen:blocks` run
  drops it from the barrel with no other edit. **This is the paywall's only
  mechanical guarantee — do not route around it.**
- The site itself: search, i18n, checkout, the design playground, templates,
  prompts. Those are the product.

---

## 2. The rule that keeps this honest

**The package is the source of truth. `apps/web` imports from it.**

Not the other way round, and never both. Before this existed, a component had
two implementations (a `code` string in the catalogue and a preview component)
and they were already documented as prone to drift. A third copy inside a package
would have been unmaintainable at 780 entries.

So the real modules physically live in `packages/ui/src`, and the paths
`apps/web` used to own are now thin re-export shims:

| App path (shim) | Real home |
|---|---|
| `@/lib/palettes/color` | `packages/ui/src/lib/color.ts` |
| `@/data/icons`, `@/lib/icons/svg` | `packages/ui/src/icons/` |
| `@/data/gradients`, `@/lib/gradients/css` | `packages/ui/src/gradients/` |
| `@/data/patterns`, `@/lib/patterns/css` | `packages/ui/src/patterns/` |
| `@/data/textures`, `@/lib/textures/css` | `packages/ui/src/textures/` |
| `@/data/palettes` | `packages/ui/src/palettes/` |
| `previews/<slug>-preview.tsx` | `packages/ui/src/blocks/<slug>.tsx` |

The shims exist so ~60 existing import sites did not have to change. **New code
in `apps/web` should import from `adysre/*` directly.** The shims are a
migration aid, not an architecture.

---

## 3. Working on it day to day

`pnpm dev` needs no build step. `apps/web` consumes the package's TypeScript
source directly, so editing a block or an icon hot-reloads exactly like it did
when the files lived in the app.

That is why relative imports inside `packages/ui` carry their **real source
extension**:

```ts
import { getIcon } from './catalog.ts';
import { Button }  from './primitives/button.tsx';
```

This looks unusual and is deliberate. Turbopack resolves an explicit extension
instantly, but does **not** resolve the `./foo.js`-pointing-at-`foo.ts`
convention that spec-compliant ESM output requires. TypeScript's
`rewriteRelativeImportExtensions` (`tsconfig.build.json`) rewrites them to `.js`
on emit, so the published package is still correct ESM. You get instant dev and
a correct tarball; the cost is one unfamiliar-looking import style.

If you write `./foo.js`, dev breaks. If you write `./foo` with no extension, the
published package breaks in Node. Use `.ts` / `.tsx`.

### Commands

```bash
pnpm --filter adysre typecheck      # tsc --noEmit
pnpm --filter adysre gen:icons      # data.ts -> 448 icon components
pnpm --filter adysre gen:blocks     # rebuild the blocks barrel from disk
pnpm --filter adysre build          # gen:icons + tsc + CSS artefacts
pnpm --filter adysre migrate:blocks # promote new previews into blocks
```

---

## 4. Adding things

### A block

Write `packages/ui/src/blocks/<slug>.tsx`. Two exports, both required:

```tsx
'use client';                       // only if it uses state, effects or handlers

interface MyBlockProps { title?: string; items: Item[]; className?: string }

/** The library API. Prop-driven, no hardcoded copy. */
export function MyBlock({ title, items, className = '' }: MyBlockProps) { … }

/** The demo the site renders. Sample data lives here, not in the component. */
const SAMPLE: Item[] = [ … ];
export default function MyBlockDemo() { return <MyBlock items={SAMPLE} />; }
```

Then `pnpm --filter adysre gen:blocks` and add the slug to the site's
`registry.ts`. Keep the catalogue entry in `apps/web/src/data/components/` in
step — that is what the site's search, filters and code tab read.

**Props, not hardcoded values.** A block with baked-in copy is a screenshot. Every
string, number, colour and count a consumer might change is a prop.

### An icon

Add it to `packages/ui/src/icons/data.ts` (name, category, tags, 24×24 body),
then `pnpm --filter adysre gen:icons`. Never hand-edit
`src/icons/generated/` — it is wiped on every run.

`src/icons/generated/` and `src/blocks/index.ts` **are committed**, unlike
`dist/`. They are generated, so that looks wrong — the reason is that a fresh
clone must `typecheck` and `dev` without first running a generator, and CI should
not need a build step to lint. The cost is 448 files moving in the diff whenever
the icon set changes; review those by reading `data.ts`, not the output.

### A gradient / pattern / texture / palette

One entry in the matching `data.ts`. Every count, filter and "similar" list
derives from the array, so nothing else needs touching.

### A whole new family — e.g. fonts

The four existing families share one shape. Copy it rather than inventing a new
one:

```
src/fonts/
  data.ts     the catalogue: id, name, tags, + whatever the family needs
  css.ts      pure builders — data -> CSSProperties, data -> copyable snippet
  index.ts    public entry: re-exports, a getX(id) lookup, and the React surface
```

Then:

1. Add `"./fonts": "./src/fonts/index.ts"` to `exports` **and** the matching
   `dist` entry to `publishConfig.exports` in `package.json`. Both, or dev and
   published resolve differently.
2. If it renders as a background/decoration, build the component on
   `src/lib/surface.ts` (`indexById` + `resolveById` + `renderSurface`) so it
   behaves like the other three: accepts an id or a record, takes `as`, merges
   `style`, degrades to an empty element on an unknown id.
3. Fonts specifically need one decision the others did not: **files**. Data-only
   families ship as code. A font family means either (a) declaring the family and
   letting the consumer supply the files via `next/font`, or (b) shipping `woff2`
   in the tarball, which needs `files` in `package.json` and a licence audit per
   face. Prefer (a) — it keeps the package free of binaries and redistribution
   questions.
4. Document it in the README table and in section 1 above.
5. Add the count to `apps/web/src/data/library-stats.ts` so the landing page
   picks it up. Counts derive from the data — never type a number.

---

## 5. Where the package is advertised

Three surfaces, all driven from `apps/web/src/data/install.ts`. That module reads
the package NAME and VERSION from `adysre/package.json` and the counts from
`@/data/library-stats`, so a release or a new gradient updates every surface with
no edit.

| Surface | Component | Notes |
|---|---|---|
| Landing, 3rd section | `landing/install-section.tsx` | Install line, two setup steps, entry-point grid |
| Each catalogue page | `npm/npm-usage.tsx` | Same install line + a snippet for *that* module |
| Package README | `packages/ui/README.md` | The npm listing itself |

`NpmUsage` takes a `module` key that matches `MODULE_USAGE` in `install.ts`.
**Adding a new asset family means adding one entry there and one
`<NpmUsage module="…" />` to its page** — plus the `npm.modules.<id>` strings in
all four message catalogues. Miss the strings and next-intl throws at render, so
the omission cannot ship silently.

---

## 6. Styling contract

Blocks are styled with Tailwind utility classes, which means the consumer's
build must generate those classes. Two supported paths, both tested:

- **Tailwind v4**: `@import "adysre/styles.css"` — brings the tokens and
  `@source`s the package so its utilities are generated.
- **No Tailwind**: `import 'adysre/dist.css'` — pre-compiled, ~250 KB, every
  utility the package uses.

`scripts/build-assets.mjs` produces both from the same emitted `dist`, so they
cannot disagree about which utilities exist. Tokens are **copied** from
`@adysre/theme` at build time rather than duplicated in source, so
`packages/theme` stays the only place a colour is defined.

---

## 7. Publishing

```bash
pnpm --filter adysre build
pnpm --filter adysre pack          # inspect the tarball first
npm publish --access public            # from packages/ui
```

`prepack` runs the build, so a publish can never ship a stale `dist`.

### How the source/dist swap works

`exports` points at `src` for the workspace; `publishConfig.exports` points at
`dist`. pnpm substitutes `publishConfig` fields into the published
`package.json` at pack time. Verify after any change to either:

```bash
pnpm --filter adysre pack --pack-destination /tmp
tar -xzf /tmp/adysre-ui-*.tgz -C /tmp && node -e \
  'console.log(require("/tmp/package/package.json").exports)'
```

It must print `dist` paths. If it prints `src`, the tarball is broken and every
consumer install fails.

### Before every publish

1. `pnpm --filter adysre typecheck`
2. `pnpm --filter @adysre/web typecheck` — the shims must still resolve
3. `pnpm --filter adysre build` — `verifyEsm()` fails the build if any
   emitted file still imports a TypeScript extension
4. Install the tarball in a scratch project and render something. A packaging bug
   is invisible to every check above; this is the one that catches it.

### Versioning

Semver against the **public API** — the subpath exports, block props, icon names.
Renaming a block export or changing a prop is a major. Adding blocks, icons or
gradients is a minor. Bump `packages/ui/package.json` by hand for now; adopt
Changesets when more than one package is published.

---

## 8. Known limits

- **ESM only.** No CommonJS build. Next.js, Vite, Remix and Astro are fine;
  `require('adysre')` is not. Adding CJS means a second emit and dual-package
  hazard — do it only if a real consumer asks.
- **The blocks barrel is big.** 779 re-exports. Bundlers tree-shake it, but deep
  imports are meaningfully faster in dev. The README says so; keep saying so.
- **Sample data ships.** Each block module carries its demo and sample copy.
  That is what makes the site and the package one implementation instead of two;
  it is tree-shaken out when unused.
- **One optional peer.** `fade-in-on-scroll` needs `framer-motion` and is
  therefore excluded from the barrel. `gen:blocks` detects this automatically for
  any future block — if you add one with a non-React dependency it will be gated
  the same way, with no action from you.
