/**
 * Design Playground - the component catalogue.
 *
 * Every UI primitive the components panel can stamp onto the canvas, as DATA.
 * An entry is a plain object holding a `TemplateSpec` tree, so adding a
 * component is an entry here and never a change to the panel - the panel only
 * knows how to search, group and insert (PRD §7.3).
 *
 * What lands on the canvas is real, editable nodes: a button is a rounded frame
 * with a text child, not a black box. Every node carries a meaningful `name`
 * because those names become layer names - "Button / Label" reads, "Rectangle"
 * does not.
 *
 * Colours here are LITERAL HEX on purpose. They are the user's artwork, not
 * application chrome, so they must not follow the interface theme (PRD §4.4).
 * The panel that renders this catalogue uses tokens only.
 *
 * Entry `name` and `category` stay untranslated English, like layer and page
 * names: they are content the user can rename after insertion, and a placed
 * layer must not rename itself when the interface language changes.
 */

import { box, type TemplateSpec } from '@/lib/design-playground/templates';
import type { TextSpec, Transform } from '@/lib/design-playground/types';

/** One catalogue row, shared by the components and sections panels. */
export interface CatalogueEntry {
  /** Stable, unique within its catalogue; used as a React key. */
  id: string;
  /** Heading this entry is grouped under, and part of the search haystack. */
  category: string;
  name: string;
  /** Root size, shown in the panel preview so the user knows what they get. */
  width: number;
  height: number;
  spec: TemplateSpec;
}

/* ------------------------------------------------------------------ palette */

/**
 * A small neutral/indigo palette shared by every template, so a page built from
 * these pieces looks like one design rather than a pile of samples.
 */
export const INK = '#0f172a';
export const MUTED = '#64748b';
export const BORDER = '#e2e8f0';
export const SURFACE = '#ffffff';
export const SUBTLE = '#f8fafc';
export const BRAND = '#4f46e5';
export const BRAND_SOFT = '#eef2ff';
export const ON_BRAND = '#ffffff';
export const DARK = '#0b1120';
export const ON_DARK = '#e2e8f0';

/* ------------------------------------------------------------------ helpers */

/** A positioned box. Child coordinates are relative to their parent node. */
export function at(x: number, y: number, width: number, height: number): Transform {
  return { x, y, width, height, rotation: 0 };
}

/**
 * A painted container. `frame` rather than `group` because only frames paint a
 * background and clip their content - a group is invisible by itself.
 */
export function surface(
  name: string,
  transform: Transform,
  style: {
    fill?: string | null;
    stroke?: string | null;
    strokeWidth?: number;
    radius?: number;
    opacity?: number;
  },
  children: TemplateSpec[] = [],
): TemplateSpec {
  return { type: 'frame', name, transform, style, children };
}

/** A transparent container: layout scaffolding with nothing of its own to paint. */
export function stack(name: string, transform: Transform, children: TemplateSpec[]): TemplateSpec {
  return { type: 'frame', name, transform, style: { fill: null }, children };
}

/** A solid block - the rounded rectangle that stands in for a swatch or bar. */
export function block(
  name: string,
  transform: Transform,
  fill: string,
  radius = 0,
): TemplateSpec {
  return { type: 'rectangle', name, transform, style: { fill, radius } };
}

interface LabelOptions {
  size?: number;
  weight?: number;
  color?: string;
  align?: TextSpec['align'];
  lineHeight?: number;
}

/**
 * A text run. Options are defaulted rather than spread, because the repo builds
 * with `exactOptionalPropertyTypes` - an explicit `undefined` would not compile.
 */
export function label(
  name: string,
  transform: Transform,
  text: string,
  options: LabelOptions = {},
): TemplateSpec {
  const {
    size = 14,
    weight = 400,
    color = INK,
    align = 'left',
    lineHeight = 1.4,
  } = options;

  return {
    type: 'text',
    name,
    transform,
    style: { fill: color },
    text: { text, fontSize: size, fontWeight: weight, align, lineHeight },
  };
}

/**
 * The y that vertically centres a single line in a box of `height`.
 *
 * The renderer draws text from the top of its box (Konva has no vertical align
 * here), so centring is arithmetic the template has to do itself.
 */
export function centerY(height: number, size: number, lineHeight = 1.4): number {
  return Math.round((height - size * lineHeight) / 2);
}

/** A one-line label centred in a box of `width` x `height`. */
function centeredLabel(
  name: string,
  width: number,
  height: number,
  text: string,
  options: LabelOptions = {},
): TemplateSpec {
  const size = options.size ?? 14;
  return label(name, at(0, centerY(height, size), width, size * 1.4), text, {
    ...options,
    align: 'center',
  });
}

/** A pill button: filled frame plus a centred label. */
function button(
  name: string,
  text: string,
  width: number,
  height: number,
  paint: { fill: string | null; stroke?: string | null; text: string },
): TemplateSpec {
  return surface(
    name,
    box(width, height),
    {
      fill: paint.fill,
      stroke: paint.stroke ?? null,
      strokeWidth: paint.stroke ? 1 : 0,
      radius: 10,
    },
    [centeredLabel(`${name} / Label`, width, height, text, { size: 14, weight: 600, color: paint.text })],
  );
}

/** A bordered input box with placeholder text inset on the left. */
function field(name: string, width: number, height: number, placeholder: string): TemplateSpec {
  return surface(
    name,
    box(width, height),
    { fill: SURFACE, stroke: BORDER, strokeWidth: 1, radius: 8 },
    [
      label(
        `${name} / Placeholder`,
        at(14, centerY(height, 14), width - 28, 20),
        placeholder,
        { color: MUTED },
      ),
    ],
  );
}

/* -------------------------------------------------------------- the entries */

export const COMPONENT_TEMPLATES: CatalogueEntry[] = [
  {
    id: 'button-primary',
    category: 'Buttons',
    name: 'Primary button',
    width: 140,
    height: 44,
    spec: button('Button / Primary', 'Get started', 140, 44, { fill: BRAND, text: ON_BRAND }),
  },
  {
    id: 'button-secondary',
    category: 'Buttons',
    name: 'Secondary button',
    width: 140,
    height: 44,
    spec: button('Button / Secondary', 'Learn more', 140, 44, {
      fill: SURFACE,
      stroke: BORDER,
      text: INK,
    }),
  },
  {
    id: 'button-ghost',
    category: 'Buttons',
    name: 'Ghost button',
    width: 140,
    height: 44,
    spec: button('Button / Ghost', 'Cancel', 140, 44, { fill: null, text: BRAND }),
  },
  {
    id: 'button-icon',
    category: 'Buttons',
    name: 'Icon button',
    width: 44,
    height: 44,
    // The glyph is a text node so the user can swap it for any character or
    // replace it with an icon node once the icon panel lands.
    spec: button('Button / Icon', '+', 44, 44, { fill: SURFACE, stroke: BORDER, text: INK }),
  },
  {
    id: 'input-text',
    category: 'Inputs',
    name: 'Text field',
    width: 280,
    height: 74,
    spec: stack('Field / Text', box(280, 74), [
      label('Field / Label', at(0, 0, 280, 18), 'Email address', { size: 13, weight: 600 }),
      // `field` builds at the origin; the label above it owns the first 26px.
      { ...field('Field / Input', 280, 44, 'you@company.com'), transform: at(0, 26, 280, 44) },
    ]),
  },
  {
    id: 'input-search',
    category: 'Inputs',
    name: 'Search field',
    width: 280,
    height: 44,
    spec: surface(
      'Field / Search',
      box(280, 44),
      { fill: SUBTLE, stroke: BORDER, strokeWidth: 1, radius: 22 },
      [
        // A ring and a handle: the smallest honest magnifier the shape set can
        // draw, and every part stays individually editable.
        {
          type: 'ellipse',
          name: 'Search / Glass',
          transform: at(14, 15, 12, 12),
          style: { fill: null, stroke: MUTED, strokeWidth: 1.5 },
        },
        block('Search / Handle', { x: 24, y: 25, width: 6, height: 1.5, rotation: 45 }, MUTED, 1),
        label('Search / Placeholder', at(38, centerY(44, 14), 220, 20), 'Search…', {
          color: MUTED,
        }),
      ],
    ),
  },
  {
    id: 'input-textarea',
    category: 'Inputs',
    name: 'Textarea',
    width: 280,
    height: 120,
    spec: surface(
      'Field / Textarea',
      box(280, 120),
      { fill: SURFACE, stroke: BORDER, strokeWidth: 1, radius: 8 },
      [
        label('Textarea / Placeholder', at(14, 14, 252, 80), 'Tell us what you need…', {
          color: MUTED,
        }),
      ],
    ),
  },
  {
    id: 'input-select',
    category: 'Inputs',
    name: 'Select',
    width: 280,
    height: 44,
    spec: surface(
      'Field / Select',
      box(280, 44),
      { fill: SURFACE, stroke: BORDER, strokeWidth: 1, radius: 8 },
      [
        label('Select / Value', at(14, centerY(44, 14), 220, 20), 'Choose a plan'),
        label('Select / Caret', at(248, centerY(44, 12), 18, 18), '▾', {
          size: 12,
          color: MUTED,
          align: 'center',
        }),
      ],
    ),
  },
  {
    id: 'input-checkbox',
    category: 'Inputs',
    name: 'Checkbox row',
    width: 220,
    height: 24,
    spec: stack('Checkbox', box(220, 24), [
      surface('Checkbox / Box', at(0, 2, 20, 20), {
        fill: BRAND,
        radius: 6,
      }),
      label('Checkbox / Tick', at(0, 4, 20, 16), '✓', {
        size: 12,
        weight: 600,
        color: ON_BRAND,
        align: 'center',
      }),
      label('Checkbox / Label', at(30, centerY(24, 14), 190, 20), 'Remember me'),
    ]),
  },
  {
    id: 'display-card',
    category: 'Display',
    name: 'Card',
    width: 320,
    height: 240,
    spec: surface(
      'Card',
      box(320, 240),
      { fill: SURFACE, stroke: BORDER, strokeWidth: 1, radius: 16 },
      [
        block('Card / Media', at(1, 1, 318, 110), BRAND_SOFT, 15),
        label('Card / Title', at(20, 130, 280, 26), 'Card title', { size: 18, weight: 600 }),
        label(
          'Card / Body',
          at(20, 162, 280, 56),
          'A short supporting line that explains what this card is about.',
          { size: 13, color: MUTED, lineHeight: 1.5 },
        ),
      ],
    ),
  },
  {
    id: 'display-badge',
    category: 'Display',
    name: 'Badge',
    width: 88,
    height: 26,
    spec: surface('Badge', box(88, 26), { fill: BRAND_SOFT, radius: 13 }, [
      centeredLabel('Badge / Label', 88, 26, 'New', { size: 12, weight: 600, color: BRAND }),
    ]),
  },
  {
    id: 'display-avatar',
    category: 'Display',
    name: 'Avatar',
    width: 48,
    height: 48,
    spec: stack('Avatar', box(48, 48), [
      {
        type: 'ellipse',
        name: 'Avatar / Shape',
        transform: at(0, 0, 48, 48),
        style: { fill: BRAND_SOFT },
      },
      centeredLabel('Avatar / Initials', 48, 48, 'AS', { size: 16, weight: 600, color: BRAND }),
    ]),
  },
  {
    id: 'display-divider',
    category: 'Display',
    name: 'Divider',
    width: 320,
    height: 1,
    spec: block('Divider', box(320, 1), BORDER),
  },
  {
    id: 'display-stat',
    category: 'Display',
    name: 'Stat tile',
    width: 240,
    height: 124,
    spec: surface(
      'Stat tile',
      box(240, 124),
      { fill: SURFACE, stroke: BORDER, strokeWidth: 1, radius: 14 },
      [
        label('Stat / Label', at(20, 20, 200, 18), 'Monthly revenue', {
          size: 12,
          weight: 600,
          color: MUTED,
        }),
        label('Stat / Value', at(20, 46, 200, 44), '$48,290', { size: 32, weight: 600 }),
        label('Stat / Delta', at(20, 92, 200, 18), '+12.4% vs last month', {
          size: 12,
          color: BRAND,
        }),
      ],
    ),
  },
  {
    id: 'display-alert',
    category: 'Display',
    name: 'Alert',
    width: 360,
    height: 76,
    spec: surface('Alert', box(360, 76), { fill: BRAND_SOFT, radius: 12 }, [
      block('Alert / Accent', at(0, 0, 4, 76), BRAND),
      label('Alert / Title', at(20, 16, 320, 20), 'Heads up', { size: 14, weight: 600 }),
      label('Alert / Body', at(20, 40, 320, 20), 'Your trial ends in three days.', {
        size: 13,
        color: MUTED,
      }),
    ]),
  },
  {
    id: 'display-progress',
    category: 'Display',
    name: 'Progress bar',
    width: 280,
    height: 8,
    spec: surface('Progress', box(280, 8), { fill: BORDER, radius: 4 }, [
      block('Progress / Fill', at(0, 0, 180, 8), BRAND, 4),
    ]),
  },
  {
    id: 'nav-bar',
    category: 'Navigation',
    name: 'Nav bar',
    width: 1200,
    height: 72,
    spec: surface('Nav bar', box(1200, 72), { fill: SURFACE, radius: 0 }, [
      label('Nav / Wordmark', at(0, centerY(72, 18), 160, 26), 'Adysre', {
        size: 18,
        weight: 600,
      }),
      label('Nav / Link 1', at(200, centerY(72, 14), 90, 20), 'Product', { color: MUTED }),
      label('Nav / Link 2', at(300, centerY(72, 14), 90, 20), 'Pricing', { color: MUTED }),
      label('Nav / Link 3', at(400, centerY(72, 14), 90, 20), 'Docs', { color: MUTED }),
      {
        ...button('Nav / CTA', 'Sign in', 120, 40, { fill: BRAND, text: ON_BRAND }),
        transform: at(1080, 16, 120, 40),
      },
      block('Nav / Rule', at(0, 71, 1200, 1), BORDER),
    ]),
  },
  {
    id: 'nav-tabs',
    category: 'Navigation',
    name: 'Tab row',
    width: 360,
    height: 40,
    spec: stack('Tabs', box(360, 40), [
      block('Tabs / Rule', at(0, 39, 360, 1), BORDER),
      label('Tabs / Overview', at(0, centerY(38, 14), 100, 20), 'Overview', {
        weight: 600,
        align: 'center',
      }),
      block('Tabs / Indicator', at(0, 37, 100, 2), BRAND, 1),
      label('Tabs / Activity', at(110, centerY(38, 14), 100, 20), 'Activity', {
        color: MUTED,
        align: 'center',
      }),
      label('Tabs / Settings', at(220, centerY(38, 14), 100, 20), 'Settings', {
        color: MUTED,
        align: 'center',
      }),
    ]),
  },
  {
    id: 'nav-breadcrumb',
    category: 'Navigation',
    name: 'Breadcrumb',
    width: 340,
    height: 20,
    spec: stack('Breadcrumb', box(340, 20), [
      label('Breadcrumb / Root', at(0, 0, 80, 20), 'Workspace', { size: 13, color: MUTED }),
      label('Breadcrumb / Sep 1', at(84, 0, 10, 20), '/', { size: 13, color: MUTED }),
      label('Breadcrumb / Level 2', at(98, 0, 80, 20), 'Projects', { size: 13, color: MUTED }),
      label('Breadcrumb / Sep 2', at(182, 0, 10, 20), '/', { size: 13, color: MUTED }),
      label('Breadcrumb / Current', at(196, 0, 140, 20), 'Design system', {
        size: 13,
        weight: 600,
      }),
    ]),
  },
];

/** Reusable pieces the section catalogue composes with. */
export { button, field, centeredLabel };
