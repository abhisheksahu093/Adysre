/**
 * Design Playground - the section catalogue.
 *
 * Whole page sections - navbar, hero, features, pricing, FAQ, testimonial, CTA,
 * footer - as DATA, built from the same helpers as the component catalogue so a
 * page assembled here looks like one design and every piece stays editable
 * (PRD §7.3). Adding a section is an entry in this array, never a panel change.
 *
 * Sections are 1440 wide: the desktop frame preset, so a section dropped into a
 * desktop artboard spans it exactly. Content sits in a 1200 column inset 120px
 * from each edge, which is the same rhythm across every entry.
 *
 * Colours are literal hex because they are user artwork, not chrome (PRD §4.4),
 * and names stay untranslated English because they become layer names.
 */

import { box, type TemplateSpec } from '@/lib/design-playground/templates';
import {
  BORDER,
  BRAND,
  BRAND_SOFT,
  DARK,
  INK,
  MUTED,
  ON_BRAND,
  ON_DARK,
  SUBTLE,
  SURFACE,
  at,
  block,
  button,
  centerY,
  label,
  stack,
  surface,
  type CatalogueEntry,
} from './component-templates';

/** Section width and the content column inside it. */
const W = 1440;
const GUTTER = 120;
const COL = W - GUTTER * 2;

/** A bordered card used by the feature, pricing and testimonial sections. */
function card(
  name: string,
  transform: { x: number; y: number; width: number; height: number },
  children: TemplateSpec[],
  fill: string = SURFACE,
): TemplateSpec {
  return surface(
    name,
    at(transform.x, transform.y, transform.width, transform.height),
    { fill, stroke: BORDER, strokeWidth: 1, radius: 16 },
    children,
  );
}

/** The eyebrow + heading + subheading trio most sections open with. */
function heading(
  name: string,
  y: number,
  title: string,
  subtitle: string,
  options: { color?: string; muted?: string } = {},
): TemplateSpec[] {
  const color = options.color ?? INK;
  const muted = options.muted ?? MUTED;
  return [
    label(`${name} / Title`, at(GUTTER, y, COL, 52), title, {
      size: 40,
      weight: 600,
      color,
      align: 'center',
    }),
    label(`${name} / Subtitle`, at(GUTTER + 220, y + 64, COL - 440, 48), subtitle, {
      size: 16,
      color: muted,
      align: 'center',
      lineHeight: 1.6,
    }),
  ];
}

export const SECTION_TEMPLATES: CatalogueEntry[] = [
  {
    id: 'section-navbar',
    category: 'Navigation',
    name: 'Navbar',
    width: W,
    height: 88,
    spec: surface('Section / Navbar', box(W, 88), { fill: SURFACE }, [
      label('Navbar / Wordmark', at(GUTTER, centerY(88, 20), 200, 28), 'Adysre', {
        size: 20,
        weight: 600,
      }),
      label('Navbar / Product', at(GUTTER + 240, centerY(88, 15), 90, 22), 'Product', {
        size: 15,
        color: MUTED,
      }),
      label('Navbar / Solutions', at(GUTTER + 350, centerY(88, 15), 100, 22), 'Solutions', {
        size: 15,
        color: MUTED,
      }),
      label('Navbar / Pricing', at(GUTTER + 470, centerY(88, 15), 90, 22), 'Pricing', {
        size: 15,
        color: MUTED,
      }),
      label('Navbar / Docs', at(GUTTER + 580, centerY(88, 15), 90, 22), 'Docs', {
        size: 15,
        color: MUTED,
      }),
      {
        ...button('Navbar / Sign in', 'Sign in', 110, 44, { fill: null, text: INK }),
        transform: at(W - GUTTER - 280, 22, 110, 44),
      },
      {
        ...button('Navbar / CTA', 'Start free', 150, 44, { fill: BRAND, text: ON_BRAND }),
        transform: at(W - GUTTER - 150, 22, 150, 44),
      },
      block('Navbar / Rule', at(0, 87, W, 1), BORDER),
    ]),
  },

  {
    id: 'section-hero',
    category: 'Marketing',
    name: 'Hero',
    width: W,
    height: 600,
    spec: surface('Section / Hero', box(W, 600), { fill: SUBTLE }, [
      surface('Hero / Eyebrow', at(GUTTER, 96, 190, 30), { fill: BRAND_SOFT, radius: 15 }, [
        label('Hero / Eyebrow label', at(0, centerY(30, 12), 190, 18), 'NEW · AI WORKFLOWS', {
          size: 12,
          weight: 600,
          color: BRAND,
          align: 'center',
        }),
      ]),
      label(
        'Hero / Title',
        at(GUTTER, 152, 620, 160),
        'The operating system for your whole business',
        { size: 56, weight: 600, lineHeight: 1.15 },
      ),
      label(
        'Hero / Body',
        at(GUTTER, 336, 540, 90),
        'One platform for CRM, operations and reporting - with AI built into every step, not bolted on.',
        { size: 18, color: MUTED, lineHeight: 1.6 },
      ),
      {
        ...button('Hero / Primary CTA', 'Start free trial', 190, 52, {
          fill: BRAND,
          text: ON_BRAND,
        }),
        transform: at(GUTTER, 452, 190, 52),
      },
      {
        ...button('Hero / Secondary CTA', 'Book a demo', 170, 52, {
          fill: SURFACE,
          stroke: BORDER,
          text: INK,
        }),
        transform: at(GUTTER + 210, 452, 170, 52),
      },
      card('Hero / Preview', { x: 800, y: 96, width: 520, height: 408 }, [
        block('Preview / Toolbar', at(1, 1, 518, 44), SUBTLE, 15),
        block('Preview / Chart', at(32, 92, 456, 180), BRAND_SOFT, 12),
        block('Preview / Row 1', at(32, 296, 456, 14), BORDER, 7),
        block('Preview / Row 2', at(32, 326, 320, 14), BORDER, 7),
        block('Preview / Row 3', at(32, 356, 400, 14), BORDER, 7),
      ]),
    ]),
  },

  {
    id: 'section-logos',
    category: 'Marketing',
    name: 'Logo strip',
    width: W,
    height: 160,
    spec: surface('Section / Logos', box(W, 160), { fill: SURFACE }, [
      label('Logos / Caption', at(GUTTER, 40, COL, 20), 'Trusted by teams at', {
        size: 13,
        weight: 600,
        color: MUTED,
        align: 'center',
      }),
      // Placeholder bars rather than fake wordmarks: a logo strip is a slot the
      // user fills with their own assets.
      ...[0, 1, 2, 3, 4].map((index) =>
        block(`Logos / Slot ${index + 1}`, at(GUTTER + index * 248, 84, 160, 32), BORDER, 6),
      ),
    ]),
  },

  {
    id: 'section-features',
    category: 'Marketing',
    name: 'Feature grid (3 up)',
    width: W,
    height: 480,
    spec: surface('Section / Features', box(W, 480), { fill: SURFACE }, [
      ...heading('Features', 72, 'Everything your team runs on', 'Modules that share one core: auth, roles, data and AI.'),
      ...[
        { title: 'Unified CRM', body: 'Leads, deals and accounts in one pipeline your whole team can see.' },
        { title: 'Automation', body: 'Rules and background jobs that move work forward without a human.' },
        { title: 'Insight', body: 'Live dashboards over the same data your operations already write.' },
      ].map((feature, index) =>
        card(
          `Features / Card ${index + 1}`,
          { x: GUTTER + index * 416, y: 232, width: 384, height: 192 },
          [
            surface(`Card ${index + 1} / Icon`, at(28, 28, 44, 44), {
              fill: BRAND_SOFT,
              radius: 12,
            }),
            label(`Card ${index + 1} / Title`, at(28, 92, 328, 26), feature.title, {
              size: 18,
              weight: 600,
            }),
            label(`Card ${index + 1} / Body`, at(28, 124, 328, 48), feature.body, {
              size: 14,
              color: MUTED,
              lineHeight: 1.6,
            }),
          ],
        ),
      ),
    ]),
  },

  {
    id: 'section-stats',
    category: 'Marketing',
    name: 'Stats band',
    width: W,
    height: 220,
    spec: surface('Section / Stats', box(W, 220), { fill: SUBTLE }, [
      ...[
        { value: '99.98%', caption: 'Uptime last 12 months' },
        { value: '12k+', caption: 'Teams onboarded' },
        { value: '4.9/5', caption: 'Average review score' },
        { value: '38%', caption: 'Less manual work' },
      ].map((stat, index) =>
        stack(`Stats / Item ${index + 1}`, at(GUTTER + index * 300, 68, 280, 84), [
          label(`Item ${index + 1} / Value`, at(0, 0, 280, 48), stat.value, {
            size: 36,
            weight: 600,
            align: 'center',
          }),
          label(`Item ${index + 1} / Caption`, at(0, 56, 280, 20), stat.caption, {
            size: 14,
            color: MUTED,
            align: 'center',
          }),
        ]),
      ),
    ]),
  },

  {
    id: 'section-pricing',
    category: 'Marketing',
    name: 'Pricing (3 tiers)',
    width: W,
    height: 640,
    spec: surface('Section / Pricing', box(W, 640), { fill: SURFACE }, [
      ...heading('Pricing', 72, 'Simple, predictable pricing', 'Every plan includes the full core: auth, roles, audit and AI credits.'),
      ...[
        { name: 'Starter', price: '$0', note: 'For trying things out', featured: false },
        { name: 'Growth', price: '$49', note: 'For teams shipping weekly', featured: true },
        { name: 'Scale', price: '$149', note: 'For multi-entity operations', featured: false },
      ].map((tier, index) =>
        card(
          `Pricing / ${tier.name}`,
          { x: GUTTER + index * 416, y: 232, width: 384, height: 352 },
          [
            label(`${tier.name} / Name`, at(32, 32, 320, 24), tier.name, {
              size: 16,
              weight: 600,
              color: tier.featured ? BRAND : INK,
            }),
            label(`${tier.name} / Price`, at(32, 66, 320, 56), `${tier.price}/mo`, {
              size: 40,
              weight: 600,
            }),
            label(`${tier.name} / Note`, at(32, 130, 320, 20), tier.note, {
              size: 14,
              color: MUTED,
            }),
            block(`${tier.name} / Rule`, at(32, 170, 320, 1), BORDER),
            ...[0, 1, 2].map((row) =>
              label(
                `${tier.name} / Feature ${row + 1}`,
                at(32, 194 + row * 28, 320, 20),
                ['Unlimited records', 'Role-based access', 'Priority support'][row] ?? '',
                { size: 14, color: MUTED },
              ),
            ),
            {
              ...button(
                `${tier.name} / CTA`,
                'Choose plan',
                320,
                48,
                tier.featured
                  ? { fill: BRAND, text: ON_BRAND }
                  : { fill: SURFACE, stroke: BORDER, text: INK },
              ),
              transform: at(32, 288, 320, 48),
            },
          ],
          tier.featured ? SUBTLE : SURFACE,
        ),
      ),
    ]),
  },

  {
    id: 'section-testimonial',
    category: 'Marketing',
    name: 'Testimonial',
    width: W,
    height: 380,
    spec: surface('Section / Testimonial', box(W, 380), { fill: SUBTLE }, [
      label(
        'Testimonial / Quote',
        at(GUTTER + 120, 96, COL - 240, 120),
        '"We replaced four tools with one. Onboarding a new region used to take a quarter - it now takes a week."',
        { size: 28, weight: 600, align: 'center', lineHeight: 1.5 },
      ),
      {
        type: 'ellipse',
        name: 'Testimonial / Avatar',
        transform: at(W / 2 - 24, 244, 48, 48),
        style: { fill: BRAND_SOFT },
      },
      label('Testimonial / Initials', at(W / 2 - 24, 258, 48, 20), 'RM', {
        size: 16,
        weight: 600,
        color: BRAND,
        align: 'center',
      }),
      label('Testimonial / Name', at(GUTTER, 304, COL, 20), 'Rita Mensah', {
        size: 14,
        weight: 600,
        align: 'center',
      }),
      label('Testimonial / Role', at(GUTTER, 326, COL, 20), 'COO, Northwind Logistics', {
        size: 13,
        color: MUTED,
        align: 'center',
      }),
    ]),
  },

  {
    id: 'section-faq',
    category: 'Content',
    name: 'FAQ list',
    width: W,
    height: 560,
    spec: surface('Section / FAQ', box(W, 560), { fill: SURFACE }, [
      ...heading('FAQ', 64, 'Frequently asked questions', 'Everything teams ask before they move over.'),
      ...[
        'Can we migrate from our current CRM?',
        'How does role-based access work?',
        'Where is our data stored?',
        'Do you offer a self-hosted option?',
      ].map((question, index) =>
        stack(`FAQ / Item ${index + 1}`, at(GUTTER + 200, 224 + index * 76, COL - 400, 76), [
          label(`Item ${index + 1} / Question`, at(0, 18, COL - 440, 24), question, {
            size: 16,
            weight: 600,
          }),
          label(`Item ${index + 1} / Toggle`, at(COL - 424, 16, 24, 24), '+', {
            size: 18,
            color: MUTED,
            align: 'center',
          }),
          block(`Item ${index + 1} / Rule`, at(0, 75, COL - 400, 1), BORDER),
        ]),
      ),
    ]),
  },

  {
    id: 'section-cta',
    category: 'Marketing',
    name: 'CTA band',
    width: W,
    height: 280,
    spec: surface('Section / CTA', box(W, 280), { fill: BRAND }, [
      label('CTA / Title', at(GUTTER, 84, COL, 48), 'Ready to run your business on one system?', {
        size: 36,
        weight: 600,
        color: ON_BRAND,
        align: 'center',
      }),
      label('CTA / Body', at(GUTTER + 300, 142, COL - 600, 24), 'Free for 14 days. No card required.', {
        size: 16,
        color: '#c7d2fe',
        align: 'center',
      }),
      {
        ...button('CTA / Button', 'Start free trial', 200, 52, { fill: SURFACE, text: BRAND }),
        transform: at(W / 2 - 100, 190, 200, 52),
      },
    ]),
  },

  {
    id: 'section-footer',
    category: 'Content',
    name: 'Footer',
    width: W,
    height: 360,
    spec: surface('Section / Footer', box(W, 360), { fill: DARK }, [
      label('Footer / Wordmark', at(GUTTER, 72, 220, 30), 'Adysre', {
        size: 20,
        weight: 600,
        color: SURFACE,
      }),
      label(
        'Footer / Tagline',
        at(GUTTER, 112, 260, 60),
        'The AI-first business operating system.',
        { size: 14, color: MUTED, lineHeight: 1.6 },
      ),
      ...[
        { title: 'Product', links: ['Overview', 'Modules', 'Pricing'] },
        { title: 'Company', links: ['About', 'Careers', 'Contact'] },
        { title: 'Resources', links: ['Docs', 'Changelog', 'Status'] },
      ].map((column, index) =>
        stack(`Footer / ${column.title}`, at(GUTTER + 560 + index * 240, 72, 200, 160), [
          label(`${column.title} / Heading`, at(0, 0, 200, 20), column.title, {
            size: 13,
            weight: 600,
            color: SURFACE,
          }),
          ...column.links.map((link, row) =>
            label(`${column.title} / ${link}`, at(0, 36 + row * 28, 200, 20), link, {
              size: 14,
              color: ON_DARK,
            }),
          ),
        ]),
      ),
      block('Footer / Rule', at(GUTTER, 272, COL, 1), '#1e293b'),
      label('Footer / Legal', at(GUTTER, 300, 400, 20), '© 2026 Adysre. All rights reserved.', {
        size: 13,
        color: MUTED,
      }),
    ]),
  },
];
