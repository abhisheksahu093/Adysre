# SEO and page weight

How this app describes itself to crawlers, and where the home page's bytes go.

Implementation lives in `apps/web/src/lib/seo/`, `apps/web/src/app/robots.ts`,
`apps/web/src/app/sitemap.ts` and `apps/web/src/i18n/client-messages.tsx`.

---

## 1. The one variable everything depends on

`NEXT_PUBLIC_APP_URL` is the origin every canonical, hreflang, Open Graph URL
and sitemap entry is built from. **It must be the hostname visitors actually
land on, `www` included.**

A canonical pointing at a URL that redirects tells Google the page it just
crawled is not the real one, which is worse than declaring no canonical at all.
`https://adysre.com` and `https://www.adysre.com` are different origins to a
crawler; pick the one the site serves and set it exactly.

Next inlines `NEXT_PUBLIC_*` at **build** time. A missing value does not throw:
it falls back to `http://localhost:3000` and bakes that into every tag in the
static HTML. The build is green and the pages render, so nothing surfaces it.
See the comment on `globalEnv` in `turbo.json`.

---

## 2. Canonical URLs

Declared in two places, on purpose.

**The `<link rel="canonical">` tag** comes from `pageMetadata()` in
`lib/seo/metadata.ts`, called from a page's `generateMetadata`. This is the form
crawlers and auditors look for. It requires the page to know its own path, which
in the App Router means each page declaring it.

**The `Link: <url>; rel="canonical"` header** is added by `proxy.ts` for every
page request, from `lib/seo/canonical-header.ts`. Google treats it as equally
authoritative. It exists because the proxy is the only place that knows a
request's path without forcing the page behind it to render dynamically:
reading the path in a layout means calling `headers()`, and that opts *every*
page out of static rendering.

So a route has a correct canonical from the day it ships, whether or not anyone
has written its metadata yet, and a page that does declare the tag simply agrees
with the header.

The two must agree byte for byte. That is why `localeUrl()` emits the home page
as `https://host` with no trailing slash: Next's metadata renderer normalises
the slash away, so anything else would produce two spellings of one URL.

Adding a page's own tags is one call:

```ts
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return pageMetadata({
    locale, path: '/pricing',
    title: t('metaTitle'), description: t('metaDescription'),
  });
}
```

**A locale is an alternate, not a duplicate.** The canonical for `/ja/pricing` is
`/ja/pricing`, never `/pricing`. Pointing one locale at another drops it from
the index entirely.

---

## 3. hreflang

`languageAlternates()` builds the full map from `routing.locales`, so adding a
language cannot leave the alternates behind. `x-default` points at the default
locale; without it Google picks one itself, and it does not always pick English.

Emitted three times, all from the same function: the `<link rel="alternate">`
tags, next-intl's own `Link` response header, and the `<xhtml:link>` elements in
the sitemap.

---

## 4. Open Graph, Twitter and the social card

Defaults live in the root layout (`og:type`, `og:site_name`, `twitter:card`).
Per-page `og:title`, `og:description` and `og:url` come from `pageMetadata()`.

The image is `apps/web/src/app/[locale]/opengraph-image.tsx`, rasterised by
`next/og` from the design tokens and the same catalogue the hero renders from,
so the card cannot drift from the page it advertises. Next content-hashes it and
emits both `og:image` and `twitter:image` from it.

Two things about that route are load-bearing:

- It exports `generateStaticParams`, so a card is prerendered per locale. Without
  it every scrape rasterises a PNG on a cold function, which is the request that
  times out and leaves the card blank.
- `proxy.ts` excludes `.*/opengraph-image` from locale routing. Next builds the
  URL with the locale in it (`/en/opengraph-image`), and `localePrefix:
  'as-needed'` would answer that with a redirect on every scrape.

The card's copy is English in every locale, deliberately: `next/og` ships one
Latin face, and Japanese, Chinese or Hindi would rasterise as empty boxes.

---

## 5. Structured data

`lib/seo/structured-data.ts` builds one `@graph` (Organization, WebSite,
SoftwareApplication, FAQPage) rendered by `<JsonLd>`.

**The rule: structured data must describe what the page actually shows.** Google
treats a mismatch as spam and can demote the domain for it. So prices come from
`PRICING_PLANS`, the FAQ entries are the strings `<Faq>` renders, and the locale
list comes from `routing`. Nothing is restated by hand. If you add a node, source
it from the data the page already renders from.

---

## 6. robots.txt and sitemap.xml

Both sit at the app root, outside `[locale]`: they are per-origin, and a crawler
fetches exactly one of each.

The sitemap lists every route once at its default-locale URL with the others as
`xhtml:link` alternates, and derives its routes from `LANDING_LINKS`, the
component registry and the template registry — never a hand-written list. A page
that stops existing leaves the sitemap on its own.

It carries no `lastModified`. We have no real per-page modification date, and
stamping build time on every URL tells Google the whole site changed at once on
every deploy, which teaches a crawler to ignore the field.

`robots.ts` disallows only what wastes crawl budget or would rank as a thin
duplicate: `/api/`, the preview routes, per-tenant reports and the QR redirect.
**Disallow is not access control** — anything that must not be read needs the
permission check it already has.

`llms.txt` sits beside them, for the same per-origin reason, and answers the
question robots.txt does not: not "what may you crawl" but "what is this site
and what is each part of it for". The convention (llmstxt.org) is Markdown with
one H1, a blockquote summary and sections of annotated links; a model that runs
no JavaScript and follows no menus still gets an accurate map. Every count and
every path in it is read from the same catalogues and the same `LANDING_LINKS`
the pages render from, so it cannot drift into describing a library that no
longer exists.

---

## 7. Page weight

Measured on the home page, uncompressed HTML:

| | before | after |
|---|---|---|
| HTML document | 506 KB | 432 KB |
| of which: inlined translations | 102 KB | 26 KB |
| over the wire (brotli) | 56 KB | 37 KB |

(Before figures measured against the live `https://www.adysre.com/`; after
figures against the prerendered `.next/server/app/en.html` from this branch.)

**The compressed number is what a visitor waits for**; the uncompressed number
is what the main thread has to parse before anything is interactive, which is
why it is worth cutting even when brotli hides most of it on the wire.

### Where the weight comes from

Roughly 40% of the document is markup and 60% is the RSC flight payload, which
serialises the same tree again as data for hydration. That duplication is
inherent to Server Components; it is not a bug to be fixed, and it means every
element removed from the page is removed twice.

### Scoped client translations

`NextIntlClientProvider` with no `messages` prop serialises the **whole**
catalogue into the payload, because it cannot know which of it the client will
ask for. That was 105 KB on every page.

`i18n/client-messages.tsx` scopes it per route:

- the root layout ships only what its own chrome uses (`toast`);
- `(app)`, `(auth)`, `(editor)` and the standalone route trees wrap themselves in
  `<FullMessages>`, so nothing there changed;
- the landing page declares its eleven namespaces explicitly.

An inner provider **replaces** the inherited messages rather than merging with
them, so a scoped route must name everything its subtree uses.

**Only client components need a namespace listed.** Server Components resolve
their translations during the render and ship the resulting strings.

If a page renders a literal `namespace.key` at a visitor, that is next-intl's
fallback for a message it could not resolve, and on a scoped route it means the
namespace is missing from the list. Add it; do not switch the route to
`<FullMessages>` to make it go away.

### What is left, in order of size

1. **JS**: the biggest cost by far, roughly 250 KB brotli across the home page's
   initial chunks, of which ~60 KB is React itself.
2. **CSS**: one 424 KB Tailwind stylesheet (~41 KB brotli), shared by every route
   and cached after the first visit.
3. **Shiki code blocks**: ~60 KB uncompressed across markup and payload, for five
   decorative previews below the fold. Dual-theme highlighting writes two CSS
   custom properties onto every token span.

None of these were touched. They are the next round, and (1) needs a real
profile rather than a guess.

---

## 8. The render path

**The stylesheet is inlined** (`experimental.inlineCss`). A linked stylesheet is
render-blocking by definition, so the 53 KB chunk cost a whole round trip in
front of first paint: 430 ms of the critical path, and the longest chain on the
page was the document followed by exactly that file. Inlined, the CSS arrives
with the document and the chain is one hop. The trade is that it is no longer
separately cacheable across hard navigations, which is the right way round for
a marketing page whose visitors mostly arrive once. It needs nothing new from
the CSP, which already allows inline styles for next/font's faces.

**Supported browsers are declared** in `apps/web/package.json`:

```
chrome >= 111, edge >= 111, firefox >= 128, safari >= 16.4
```

That is not a preference, it is the floor the app already had. Tailwind v4
requires it, and the page's own CSS uses `@property` and `color-mix()`, so a
browser below this line cannot render the site at all. Declaring it stops the
build transpiling Baseline features for browsers that were never going to work.

It does **not** clear Lighthouse's "Legacy JavaScript" finding. That 13 KB is
Next.js's own `polyfill-module` (`String.prototype.trimStart`, `Object.hasOwn`
and friends), bundled inside the framework chunk and not reachable from
application config. Confirmed by reading the emitted chunk. Do not go looking
for it in our code.

## 9. What the auditors measure, and how to reproduce it

Lighthouse's **simulated** throttling (the CLI default) estimates CPU cost
instead of applying it, which on a fast machine can report a 12 ms total
blocking time for a page that GTmetrix scores at 15,870 ms. When an external
report disagrees with a local one, that is usually why.

To reproduce what the graders see:

```bash
npx lighthouse@12 <url> --only-categories=performance \
  --form-factor=mobile --screenEmulation.mobile \
  --throttling-method=devtools --throttling.cpuSlowdownMultiplier=20
```

That configuration scored this page 0.65 against GTmetrix's 66. Two cautions
learned the hard way: run three times and take the median, because a single run
at 20× swings by a factor of three; and check the machine is idle first, since a
dev server on another port is enough to make every number meaningless.
