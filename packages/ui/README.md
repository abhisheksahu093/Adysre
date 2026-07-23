# adysre

React components, icons, gradients, patterns, textures and palettes for Next.js
and React — the library behind [ADYSRE](https://github.com/abhisheksahu093/Adysre).

| | |
|---|---|
| **780** section & page blocks | hero, pricing, navbar, footer, auth, tables, calendars, carousels… |
| **448** icons | original 24×24 line drawings, tree-shakeable, `currentColor` |
| **102** palettes | curated colour sets plus the colour maths behind them |
| **78** gradients | linear, radial, conic — plain data, no images |
| **50** patterns | dots, grids, lines, checkerboard, crosshatch — pure CSS |
| **28** textures | noise, grain, paper, carbon, fabric — inline SVG, no image files |
| **9** primitives | Button, Card, Input, Label, Textarea, Select, Badge, Dialog, Tooltip |

Everything is typed, tree-shakeable ESM. React 18+ is the only required peer.

## Install

```bash
npm i adysre        # pnpm add adysre   ·   yarn add adysre
```

## Styling

Components are styled with Tailwind utility classes. Pick the path that matches
your project — you only need one.

**Using Tailwind v4** (recommended). Add one line to your global stylesheet; it
brings the design tokens and tells Tailwind to scan this package, without which
the utilities baked into our components are never generated:

```css
/* app/globals.css */
@import "tailwindcss";
@import "adysre/styles.css";
```

**Not using Tailwind.** Import the pre-compiled stylesheet once, anywhere:

```tsx
// app/layout.tsx
import 'adysre/dist.css';
```

Dark mode follows a `.dark` class on a parent element — the convention
`next-themes` and most setups already use.

## Use

Each area has its own entry point, so importing a button never drags 780
components into your module graph.

```tsx
import { Button, Card, cn } from 'adysre';
import { ArrowUpRight, Search } from 'adysre/icons';
import { GradientSurface } from 'adysre/gradients';
import { PatternSurface } from 'adysre/patterns';
import { TextureSurface } from 'adysre/textures';
import { getPalette } from 'adysre/palettes';
import { AboutStats, PricingThreeTier } from 'adysre/blocks';
```

### Blocks

Blocks are prop-driven sections. Every one is a plain function component — no
context, no provider, no client runtime unless the block genuinely needs one.

```tsx
import { AboutStats } from 'adysre/blocks';

<AboutStats
  kicker="By the numbers"
  title="Where we are after six years"
  stats={[
    { label: 'People', value: '12' },
    { label: 'Projects shipped', value: '148' },
    { label: 'Client retention', value: '94%' },
  ]}
/>;
```

Deep-import when you only need one — kinder to your dev server:

```tsx
import { AboutStats } from 'adysre/blocks/about-stats';
```

Every block module also default-exports a zero-prop demo with realistic sample
content, which is what the ADYSRE site renders:

```tsx
import AboutStatsDemo from 'adysre/blocks/about-stats';
```

### Icons

```tsx
import { ArrowUpRight } from 'adysre/icons';

<ArrowUpRight />                                  {/* 24px, currentColor */}
<ArrowUpRight size={32} strokeWidth={2} />
<ArrowUpRight className="text-blue-600" aria-label="Open in new tab" />
```

Icons are `aria-hidden` unless you give them an `aria-label` — decorative by
default, which is what an icon beside a label should be.

When the name is data rather than something you can write down, look it up:

```tsx
import { Icon, ICONS, getIcon } from 'adysre/icons';

<Icon name={page.iconName} size={20} />
```

`<Icon>` pulls the whole catalogue into that chunk, so prefer the named import
wherever the name is known at build time.

### Gradients, patterns, textures

Three interchangeable surfaces. Pass a curated id or your own object; anything
else you pass is forwarded to the element.

```tsx
import { GradientSurface } from 'adysre/gradients';
import { PatternSurface } from 'adysre/patterns';
import { TextureSurface } from 'adysre/textures';

<GradientSurface gradient="warm-flame" className="h-64 rounded-xl" />
<PatternSurface  pattern="blueprint-grid" as="section" className="py-24" />
<TextureSurface  texture="ink-noise" className="absolute inset-0 -z-10" />
```

Need the raw CSS instead of an element?

```tsx
import { getGradient, gradientToCss, gradientToStyle } from 'adysre/gradients';

gradientToCss(getGradient('warm-flame')!);
// 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)'

<div style={gradientToStyle(getGradient('warm-flame')!)} />
```

Browse the catalogues to build your own picker: `GRADIENTS`, `PATTERNS`,
`TEXTURES`, `PALETTES`, `ICONS`, each with `similar*()` and tag lists.

### Palettes and colour

```tsx
import { getPalette, contrastRatio, readableText, harmony } from 'adysre/palettes';

readableText('#2563eb');                 // '#ffffff'
contrastRatio('#111827', '#f9fafb');     // 16.4
harmony('#2563eb', 'triadic', 5);        // ['#2563eb', '#eb2563', …]
```

## Optional peers

One block animates with `framer-motion`. It is an optional peer and is left out
of the `blocks` barrel on purpose, so a missing peer can never break everyone
else's import. Install it and import by path:

```bash
npm i framer-motion
```

```tsx
import { FadeInOnScroll } from 'adysre/blocks/fade-in-on-scroll';
```

## Requirements

- React 18 or newer (React 19 recommended)
- ESM. Next.js, Vite, Remix and Astro consume it directly; a CommonJS `require()`
  will not resolve it.
- Node 20+ for anything server-rendering it

## License

MIT © ADYSRE. Icons are original drawings authored for this project; no
third-party icon set is redistributed here.
