/**
 * The published package, as the landing page needs to describe it.
 *
 * ─── Nothing here is typed twice ────────────────────────────────────────────
 * The package NAME and VERSION are read from `adysre/package.json`, so a
 * rename or a release shows up on the marketing page with no edit. The entry
 * point COUNTS come from `@/data/library-stats`, which derives them from the
 * real catalogues. Add a gradient and the landing page says 79 (Rule 6, and the
 * same rule the stats band already follows).
 *
 * Structure only: every visible string is a translation key under
 * `landing.install.*`.
 *
 * Server-only, because `library-stats` pulls in the full catalogues. Import it
 * from a Server Component and pass the result down.
 */

import 'server-only';

import pkg from 'adysre/package.json';
import {
  COMPONENT_COUNT,
  GRADIENT_COUNT,
  ICON_COUNT,
  PALETTE_COUNT,
  PATTERN_COUNT,
  TEXTURE_COUNT,
} from '@/data/library-stats';

/** The npm package this page is selling people on. */
export const PACKAGE_NAME = pkg.name;
export const PACKAGE_VERSION = pkg.version;
export const PACKAGE_LICENSE = pkg.license;
export const PACKAGE_URL = `https://www.npmjs.com/package/${PACKAGE_NAME}`;

export interface PackageManager {
  /** Stable id; also the tab label, which is a proper noun and never translated. */
  id: 'npm' | 'pnpm' | 'yarn' | 'bun';
  /** The full command, ready to paste. */
  command: string;
}

/**
 * Install commands, in the order the tabs appear. npm leads because it is the
 * default a visitor assumes; the repo itself runs pnpm.
 */
export const PACKAGE_MANAGERS: PackageManager[] = [
  { id: 'npm', command: `npm install ${PACKAGE_NAME}` },
  { id: 'pnpm', command: `pnpm add ${PACKAGE_NAME}` },
  { id: 'yarn', command: `yarn add ${PACKAGE_NAME}` },
  { id: 'bun', command: `bun add ${PACKAGE_NAME}` },
];

export interface EntryPoint {
  /** Stable id; also the key under `landing.install.entries.<id>`. */
  id: string;
  /** The subpath as written in an import statement. */
  specifier: string;
  /** How many things live behind it. */
  count: number;
  /** In-app page that browses this catalogue. */
  href: string;
}

/**
 * What each subpath gives you. Subpaths exist so importing a button never drags
 * the whole catalogue into a consumer's bundle - worth showing, because it is
 * the difference between this and a monolithic UI kit.
 */
export const ENTRY_POINTS: EntryPoint[] = [
  { id: 'blocks', specifier: `${PACKAGE_NAME}/blocks`, count: COMPONENT_COUNT, href: '/components' },
  { id: 'icons', specifier: `${PACKAGE_NAME}/icons`, count: ICON_COUNT, href: '/icons' },
  { id: 'palettes', specifier: `${PACKAGE_NAME}/palettes`, count: PALETTE_COUNT, href: '/palettes' },
  { id: 'gradients', specifier: `${PACKAGE_NAME}/gradients`, count: GRADIENT_COUNT, href: '/gradients' },
  { id: 'patterns', specifier: `${PACKAGE_NAME}/patterns`, count: PATTERN_COUNT, href: '/patterns' },
  { id: 'textures', specifier: `${PACKAGE_NAME}/textures`, count: TEXTURE_COUNT, href: '/textures' },
];

/**
 * The two snippets under the install command: wire the styles up once, then use
 * anything. Kept here rather than inline in JSX so the highlighter and the copy
 * button read the identical string.
 */
export const SETUP_SNIPPET = `@import "tailwindcss";
@import "${PACKAGE_NAME}/styles.css";`;

/**
 * Per-module usage, for the "use this from npm" panel on each catalogue page.
 *
 * Keyed by the page's own id so a page asks for exactly what it shows. Each
 * snippet is the shortest thing that actually runs — an import, a render, and
 * the one escape hatch (raw CSS, a lookup, a dynamic name) a reader will want
 * next. Language is `tsx` for everything so the highlighter needs no per-entry
 * configuration.
 */
export interface ModuleUsage {
  /** The subpath to import from. */
  specifier: string;
  /** Runnable example, highlighted on the server. */
  snippet: string;
}

export const MODULE_USAGE: Record<string, ModuleUsage> = {
  components: {
    specifier: `${PACKAGE_NAME}/blocks`,
    snippet: `import { AboutStats } from '${PACKAGE_NAME}/blocks';
// Or import just the one, and skip the barrel entirely:
// import { AboutStats } from '${PACKAGE_NAME}/blocks/about-stats';

export function Section() {
  return (
    <AboutStats
      kicker="By the numbers"
      title="Where we are after six years"
      stats={[
        { label: 'People', value: '12' },
        { label: 'Projects shipped', value: '148' },
        { label: 'Client retention', value: '94%' },
      ]}
    />
  );
}`,
  },

  icons: {
    specifier: `${PACKAGE_NAME}/icons`,
    snippet: `import { ArrowUpRight, Search } from '${PACKAGE_NAME}/icons';

export function Toolbar() {
  return (
    <>
      {/* 24px and currentColor by default — colour comes from CSS. */}
      <Search />
      <ArrowUpRight size={32} strokeWidth={2} className="text-blue-600" />

      {/* Icons are aria-hidden unless you name them. */}
      <ArrowUpRight aria-label="Open in a new tab" />
    </>
  );
}

// When the name is data rather than something you can write down:
import { Icon } from '${PACKAGE_NAME}/icons';
<Icon name={page.iconName} size={20} />;`,
  },

  gradients: {
    specifier: `${PACKAGE_NAME}/gradients`,
    snippet: `import { GradientSurface } from '${PACKAGE_NAME}/gradients';

export function Hero() {
  return <GradientSurface gradient="warm-flame" className="h-64 rounded-2xl" />;
}

// Need the raw CSS instead of an element?
import { getGradient, gradientToCss } from '${PACKAGE_NAME}/gradients';

gradientToCss(getGradient('warm-flame')!);
// 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)'`,
  },

  patterns: {
    specifier: `${PACKAGE_NAME}/patterns`,
    snippet: `import { PatternSurface } from '${PACKAGE_NAME}/patterns';

export function Section() {
  // Built from CSS gradients — no image files to host.
  return <PatternSurface pattern="blueprint-grid" as="section" className="py-24" />;
}

// Or apply it to something you already render:
import { getPattern, patternToStyle } from '${PACKAGE_NAME}/patterns';

<div style={patternToStyle(getPattern('graph-paper')!)} />;`,
  },

  textures: {
    specifier: `${PACKAGE_NAME}/textures`,
    snippet: `import { TextureSurface } from '${PACKAGE_NAME}/textures';

export function Backdrop() {
  // Noise and grain are an inline SVG filter — a data URI, not a request.
  return <TextureSurface texture="ink-noise" className="absolute inset-0 -z-10" />;
}

import { getTexture, textureToStyle } from '${PACKAGE_NAME}/textures';

<div style={textureToStyle(getTexture('fine-grain')!)} />;`,
  },

  palettes: {
    specifier: `${PACKAGE_NAME}/palettes`,
    snippet: `import { getPalette, PALETTES } from '${PACKAGE_NAME}/palettes';

const palette = getPalette('nordic-calm');
palette?.colors; // ['#2e3440', '#3b4252', …]

// The same colour maths the ADYSRE palette editor runs on:
import { contrastRatio, readableText, harmony } from '${PACKAGE_NAME}/palettes';

readableText('#2563eb');              // '#ffffff'
contrastRatio('#111827', '#f9fafb');  // 16.4
harmony('#2563eb', 'triadic', 5);`,
  },
};

/**
 * What a consumer needs before any of the above works, keyed for translation
 * under `npm.requirements.<id>`. Ordered by how likely they are to trip you.
 */
export const REQUIREMENT_IDS = ['react', 'styles', 'esm'] as const;

export const USAGE_SNIPPET = `import { Button } from '${PACKAGE_NAME}';
import { ArrowUpRight } from '${PACKAGE_NAME}/icons';
import { GradientSurface } from '${PACKAGE_NAME}/gradients';
import { AboutStats } from '${PACKAGE_NAME}/blocks';

export default function Page() {
  return (
    <GradientSurface gradient="warm-flame" className="rounded-2xl p-10">
      <AboutStats
        title="Where we are after six years"
        stats={[
          { label: 'People', value: '12' },
          { label: 'Projects shipped', value: '148' },
        ]}
      />
      <Button>
        Read the docs <ArrowUpRight size={16} />
      </Button>
    </GradientSurface>
  );
}`;
