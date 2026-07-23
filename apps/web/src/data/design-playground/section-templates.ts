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

  /* ------------------------------------------------------------ navigation */

  {
    id: 'section-navbar-centered',
    category: 'Navigation',
    name: 'Navbar (centered)',
    width: W,
    height: 88,
    spec: surface('Section / Navbar centered', box(W, 88), { fill: SURFACE }, [
      label('Navbar / Product', at(GUTTER, centerY(88, 15), 90, 22), 'Product', {
        size: 15,
        color: MUTED,
      }),
      label('Navbar / Pricing', at(GUTTER + 110, centerY(88, 15), 90, 22), 'Pricing', {
        size: 15,
        color: MUTED,
      }),
      // Centred by arithmetic, not by a layout engine: the renderer positions
      // absolutely, so the wordmark's own width has to come out of the span.
      label('Navbar / Wordmark', at((W - 200) / 2, centerY(88, 20), 200, 28), 'Adysre', {
        size: 20,
        weight: 600,
        align: 'center',
      }),
      label('Navbar / Docs', at(W - GUTTER - 320, centerY(88, 15), 90, 22), 'Docs', {
        size: 15,
        color: MUTED,
      }),
      {
        ...button('Navbar / CTA', 'Start free', 150, 44, { fill: BRAND, text: ON_BRAND }),
        transform: at(W - GUTTER - 150, 22, 150, 44),
      },
      block('Navbar / Rule', at(0, 87, W, 1), BORDER),
    ]),
  },

  {
    id: 'section-navbar-dark',
    category: 'Navigation',
    name: 'Navbar (dark)',
    width: W,
    height: 88,
    spec: surface('Section / Navbar dark', box(W, 88), { fill: DARK }, [
      label('Navbar / Wordmark', at(GUTTER, centerY(88, 20), 200, 28), 'Adysre', {
        size: 20,
        weight: 600,
        color: SURFACE,
      }),
      ...['Product', 'Solutions', 'Pricing', 'Docs'].map((item, index) =>
        label(`Navbar / ${item}`, at(GUTTER + 240 + index * 115, centerY(88, 15), 105, 22), item, {
          size: 15,
          color: ON_DARK,
        }),
      ),
      {
        ...button('Navbar / Sign in', 'Sign in', 110, 44, { fill: null, text: SURFACE }),
        transform: at(W - GUTTER - 280, 22, 110, 44),
      },
      {
        ...button('Navbar / CTA', 'Start free', 150, 44, { fill: BRAND, text: ON_BRAND }),
        transform: at(W - GUTTER - 150, 22, 150, 44),
      },
    ]),
  },

  {
    id: 'section-announcement',
    category: 'Navigation',
    name: 'Announcement bar',
    width: W,
    height: 48,
    spec: surface('Section / Announcement', box(W, 48), { fill: BRAND }, [
      label(
        'Announcement / Message',
        at(GUTTER, centerY(48, 14), COL, 20),
        'Introducing AI workflows - now in open beta. Read the announcement →',
        { size: 14, weight: 500, color: ON_BRAND, align: 'center' },
      ),
    ]),
  },

  /* --------------------------------------------------------------- heroes */

  {
    id: 'section-hero-centered',
    category: 'Marketing',
    name: 'Hero (centered)',
    width: W,
    height: 560,
    spec: surface('Section / Hero centered', box(W, 560), { fill: SURFACE }, [
      surface(
        'Hero / Eyebrow',
        at((W - 210) / 2, 88, 210, 30),
        { fill: BRAND_SOFT, radius: 15 },
        [
          label('Hero / Eyebrow label', at(0, centerY(30, 12), 210, 18), 'TRUSTED BY 12,000 TEAMS', {
            size: 12,
            weight: 600,
            color: BRAND,
            align: 'center',
          }),
        ],
      ),
      label(
        'Hero / Title',
        at(GUTTER + 60, 152, COL - 120, 140),
        'Everything your business runs on, in one place',
        { size: 60, weight: 600, align: 'center', lineHeight: 1.12 },
      ),
      label(
        'Hero / Body',
        at(GUTTER + 260, 312, COL - 520, 60),
        'CRM, operations and reporting on one data model - with AI built into every step.',
        { size: 18, color: MUTED, align: 'center', lineHeight: 1.6 },
      ),
      {
        ...button('Hero / Primary CTA', 'Start free trial', 190, 52, {
          fill: BRAND,
          text: ON_BRAND,
        }),
        transform: at((W - 380) / 2, 404, 190, 52),
      },
      {
        ...button('Hero / Secondary CTA', 'Book a demo', 170, 52, {
          fill: SURFACE,
          stroke: BORDER,
          text: INK,
        }),
        transform: at((W - 380) / 2 + 210, 404, 170, 52),
      },
    ]),
  },

  {
    id: 'section-hero-dark',
    category: 'Marketing',
    name: 'Hero (dark)',
    width: W,
    height: 560,
    spec: surface('Section / Hero dark', box(W, 560), { fill: DARK }, [
      label(
        'Hero / Title',
        at(GUTTER, 140, 700, 150),
        'Built for the teams who run the whole business',
        { size: 56, weight: 600, color: SURFACE, lineHeight: 1.15 },
      ),
      label(
        'Hero / Body',
        at(GUTTER, 320, 560, 84),
        'One platform, one data model, one bill. Deploy in a day and keep every workflow you already have.',
        { size: 18, color: ON_DARK, lineHeight: 1.6 },
      ),
      {
        ...button('Hero / Primary CTA', 'Start free trial', 190, 52, {
          fill: BRAND,
          text: ON_BRAND,
        }),
        transform: at(GUTTER, 436, 190, 52),
      },
      card('Hero / Panel', { x: 800, y: 96, width: 520, height: 368 }, [
        block('Panel / Bar', at(1, 1, 518, 44), SUBTLE, 15),
        block('Panel / Chart', at(32, 88, 456, 160), BRAND_SOFT, 12),
        block('Panel / Row 1', at(32, 272, 456, 14), BORDER, 7),
        block('Panel / Row 2', at(32, 302, 300, 14), BORDER, 7),
      ]),
    ]),
  },

  /* -------------------------------------------------------- main sections */

  {
    id: 'section-steps',
    category: 'Marketing',
    name: 'How it works (3 steps)',
    width: W,
    height: 460,
    spec: surface('Section / Steps', box(W, 460), { fill: SURFACE }, [
      ...heading('Steps', 80, 'Live in three steps', 'No migration project and no professional services engagement.'),
      ...[
        { n: '1', title: 'Connect your data', body: 'Point us at the systems you already run. Sync takes minutes.' },
        { n: '2', title: 'Pick your modules', body: 'Turn on CRM, operations or reporting - or all three.' },
        { n: '3', title: 'Invite the team', body: 'Roles and permissions come preset. Change what you need.' },
      ].map((step, index) =>
        stack(`Steps / ${step.n}`, at(GUTTER + index * (COL / 3), 244, COL / 3 - 40, 160), [
          surface(`Steps / ${step.n} badge`, at(0, 0, 44, 44), { fill: BRAND_SOFT, radius: 22 }, [
            label(`Steps / ${step.n} number`, at(0, centerY(44, 18), 44, 26), step.n, {
              size: 18,
              weight: 600,
              color: BRAND,
              align: 'center',
            }),
          ]),
          label(`Steps / ${step.n} title`, at(0, 64, COL / 3 - 40, 26), step.title, {
            size: 19,
            weight: 600,
          }),
          label(`Steps / ${step.n} body`, at(0, 98, COL / 3 - 60, 52), step.body, {
            size: 15,
            color: MUTED,
            lineHeight: 1.6,
          }),
        ]),
      ),
    ]),
  },

  {
    id: 'section-team',
    category: 'Marketing',
    name: 'Team grid (4 up)',
    width: W,
    height: 520,
    spec: surface('Section / Team', box(W, 520), { fill: SUBTLE }, [
      ...heading('Team', 80, 'The people behind it', 'A small team with a long history of shipping operations software.'),
      ...[
        { name: 'Priya Raman', role: 'Chief Executive' },
        { name: 'Daniel Okafor', role: 'Engineering' },
        { name: 'Mei Tanaka', role: 'Design' },
        { name: 'Luis Ferreira', role: 'Customer' },
      ].map((person, index) =>
        card(
          `Team / ${person.name}`,
          { x: GUTTER + index * (COL / 4), y: 244, width: COL / 4 - 24, height: 220 },
          [
            block('Avatar', at(24, 24, 72, 72), BRAND_SOFT, 36),
            label('Name', at(24, 116, COL / 4 - 72, 24), person.name, { size: 17, weight: 600 }),
            label('Role', at(24, 146, COL / 4 - 72, 22), person.role, { size: 14, color: MUTED }),
          ],
        ),
      ),
    ]),
  },

  {
    id: 'section-metrics-dark',
    category: 'Marketing',
    name: 'Metrics band (dark)',
    width: W,
    height: 260,
    spec: surface('Section / Metrics', box(W, 260), { fill: DARK }, [
      ...[
        { value: '99.99%', label: 'Uptime, measured' },
        { value: '12k+', label: 'Teams running on it' },
        { value: '840M', label: 'Records synced daily' },
        { value: '< 40ms', label: 'Median query time' },
      ].map((metric, index) =>
        stack(`Metrics / ${metric.value}`, at(GUTTER + index * (COL / 4), 88, COL / 4 - 24, 90), [
          label('Value', at(0, 0, COL / 4 - 24, 52), metric.value, {
            size: 40,
            weight: 600,
            color: SURFACE,
          }),
          label('Label', at(0, 58, COL / 4 - 24, 22), metric.label, { size: 15, color: ON_DARK }),
        ]),
      ),
    ]),
  },

  {
    id: 'section-blog',
    category: 'Content',
    name: 'Blog cards (3 up)',
    width: W,
    height: 540,
    spec: surface('Section / Blog', box(W, 540), { fill: SURFACE }, [
      ...heading('Blog', 80, 'From the team', 'Notes on building, shipping and running the platform.'),
      ...[0, 1, 2].map((index) =>
        card(
          `Blog / Post ${index + 1}`,
          { x: GUTTER + index * (COL / 3), y: 244, width: COL / 3 - 28, height: 240 },
          [
            block('Cover', at(1, 1, COL / 3 - 30, 110), BRAND_SOFT, 15),
            label('Category', at(24, 130, 120, 18), 'ENGINEERING', {
              size: 11,
              weight: 600,
              color: BRAND,
            }),
            label('Title', at(24, 154, COL / 3 - 76, 48), 'Designing a token-first color system', {
              size: 17,
              weight: 600,
              lineHeight: 1.3,
            }),
            label('Meta', at(24, 208, COL / 3 - 76, 20), '12 Jul 2026 · 8 min read', {
              size: 13,
              color: MUTED,
            }),
          ],
        ),
      ),
    ]),
  },

  {
    id: 'section-newsletter',
    category: 'Content',
    name: 'Newsletter band',
    width: W,
    height: 280,
    spec: surface('Section / Newsletter', box(W, 280), { fill: SUBTLE }, [
      label('Newsletter / Title', at(GUTTER, 96, 620, 44), 'Get the monthly changelog', {
        size: 34,
        weight: 600,
      }),
      label(
        'Newsletter / Body',
        at(GUTTER, 150, 560, 46),
        'What shipped, what broke and what we learned. One email a month, no marketing.',
        { size: 16, color: MUTED, lineHeight: 1.6 },
      ),
      surface(
        'Newsletter / Field',
        at(W - GUTTER - 460, 112, 300, 52),
        { fill: SURFACE, stroke: BORDER, strokeWidth: 1, radius: 12 },
        [
          label('Field / Placeholder', at(18, centerY(52, 15), 260, 22), 'you@company.com', {
            size: 15,
            color: MUTED,
          }),
        ],
      ),
      {
        ...button('Newsletter / Submit', 'Subscribe', 150, 52, { fill: BRAND, text: ON_BRAND }),
        transform: at(W - GUTTER - 150, 112, 150, 52),
      },
    ]),
  },

  /* -------------------------------------------------------------- footers */

  {
    id: 'section-footer-simple',
    category: 'Content',
    name: 'Footer (simple)',
    width: W,
    height: 140,
    spec: surface('Section / Footer simple', box(W, 140), { fill: SURFACE }, [
      block('Footer / Rule', at(0, 0, W, 1), BORDER),
      label('Footer / Wordmark', at(GUTTER, centerY(140, 18), 180, 26), 'Adysre', {
        size: 18,
        weight: 600,
      }),
      ...['Privacy', 'Terms', 'Status', 'Contact'].map((link, index) =>
        label(`Footer / ${link}`, at(GUTTER + 340 + index * 120, centerY(140, 14), 110, 20), link, {
          size: 14,
          color: MUTED,
        }),
      ),
      label(
        'Footer / Legal',
        at(W - GUTTER - 320, centerY(140, 13), 320, 20),
        '© 2026 Adysre. All rights reserved.',
        { size: 13, color: MUTED, align: 'right' },
      ),
    ]),
  },

  {
    id: 'section-footer-newsletter',
    category: 'Content',
    name: 'Footer (with newsletter)',
    width: W,
    height: 420,
    spec: surface('Section / Footer newsletter', box(W, 420), { fill: DARK }, [
      label('Footer / Wordmark', at(GUTTER, 64, 220, 30), 'Adysre', {
        size: 20,
        weight: 600,
        color: SURFACE,
      }),
      label(
        'Footer / Tagline',
        at(GUTTER, 104, 300, 60),
        'The AI-first business operating system.',
        { size: 14, color: MUTED, lineHeight: 1.6 },
      ),
      label('Footer / Signup title', at(GUTTER, 196, 320, 24), 'Monthly changelog', {
        size: 15,
        weight: 600,
        color: SURFACE,
      }),
      surface(
        'Footer / Field',
        at(GUTTER, 230, 260, 48),
        { fill: 'transparent', stroke: '#334155', strokeWidth: 1, radius: 10 },
        [
          label('Field / Placeholder', at(16, centerY(48, 14), 220, 20), 'you@company.com', {
            size: 14,
            color: MUTED,
          }),
        ],
      ),
      {
        ...button('Footer / Submit', 'Subscribe', 130, 48, { fill: BRAND, text: ON_BRAND }),
        transform: at(GUTTER + 272, 230, 130, 48),
      },
      ...[
        { title: 'Product', links: ['Overview', 'Modules', 'Pricing'] },
        { title: 'Company', links: ['About', 'Careers', 'Contact'] },
        { title: 'Resources', links: ['Docs', 'Changelog', 'Status'] },
      ].map((column, index) =>
        stack(`Footer / ${column.title}`, at(GUTTER + 560 + index * 240, 64, 200, 160), [
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
      block('Footer / Rule', at(GUTTER, 332, COL, 1), '#1e293b'),
      label('Footer / Legal', at(GUTTER, 360, 400, 20), '© 2026 Adysre. All rights reserved.', {
        size: 13,
        color: MUTED,
      }),
    ]),
  },

  /* -------------------------------------------------------------- pricing */

  {
    id: 'section-pricing-two',
    category: 'Marketing',
    name: 'Pricing (2 tiers)',
    width: W,
    height: 580,
    spec: surface('Section / Pricing two', box(W, 580), { fill: SURFACE }, [
      ...heading('Pricing', 72, 'Two ways to buy', 'Start on the team plan and move up when procurement asks you to.'),
      ...[
        { name: 'Team', price: '$49', note: 'Per seat, billed monthly', featured: false },
        { name: 'Enterprise', price: 'Custom', note: 'Annual, with an SLA', featured: true },
      ].map((tier, index) =>
        card(
          `Pricing / ${tier.name}`,
          { x: GUTTER + 100 + index * 520, y: 224, width: 480, height: 300 },
          [
            label(`${tier.name} / Name`, at(36, 32, 400, 24), tier.name, {
              size: 16,
              weight: 600,
              color: tier.featured ? BRAND : INK,
            }),
            label(
              `${tier.name} / Price`,
              at(36, 66, 400, 56),
              tier.price === 'Custom' ? tier.price : `${tier.price}/mo`,
              { size: 42, weight: 600 },
            ),
            label(`${tier.name} / Note`, at(36, 132, 400, 20), tier.note, {
              size: 14,
              color: MUTED,
            }),
            block(`${tier.name} / Rule`, at(36, 172, 408, 1), BORDER),
            ...[0, 1].map((row) =>
              label(
                `${tier.name} / Feature ${row + 1}`,
                at(36, 196 + row * 26, 400, 20),
                ['Everything in the core platform', 'SSO, audit log and data residency'][row] ?? '',
                { size: 14, color: MUTED },
              ),
            ),
            {
              ...button(
                `${tier.name} / CTA`,
                tier.featured ? 'Talk to sales' : 'Start free trial',
                408,
                48,
                tier.featured
                  ? { fill: BRAND, text: ON_BRAND }
                  : { fill: SURFACE, stroke: BORDER, text: INK },
              ),
              transform: at(36, 244, 408, 48),
            },
          ],
          tier.featured ? SUBTLE : SURFACE,
        ),
      ),
    ]),
  },

  {
    id: 'section-pricing-single',
    category: 'Marketing',
    name: 'Pricing (single plan)',
    width: W,
    height: 480,
    spec: surface('Section / Pricing single', box(W, 480), { fill: SUBTLE }, [
      ...heading('Pricing', 64, 'One plan, everything included', 'No feature gates and no per-module pricing.'),
      card('Pricing / Plan', { x: (W - 720) / 2, y: 216, width: 720, height: 200 }, [
        label('Plan / Name', at(40, 36, 320, 24), 'Complete', { size: 16, weight: 600, color: BRAND }),
        label('Plan / Price', at(40, 68, 360, 60), '$79/mo', { size: 46, weight: 600 }),
        label('Plan / Note', at(40, 136, 360, 22), 'Per seat · billed annually', {
          size: 14,
          color: MUTED,
        }),
        block('Plan / Divider', at(400, 36, 1, 128), BORDER),
        ...[0, 1, 2, 3].map((row) =>
          label(
            `Plan / Feature ${row + 1}`,
            at(440, 40 + row * 30, 240, 20),
            ['Unlimited records', 'Every module', 'SSO and audit log', 'Priority support'][row] ?? '',
            { size: 14, color: MUTED },
          ),
        ),
      ]),
    ]),
  },

  {
    id: 'section-pricing-compare',
    category: 'Marketing',
    name: 'Pricing (comparison table)',
    width: W,
    height: 560,
    spec: surface('Section / Pricing compare', box(W, 560), { fill: SURFACE }, [
      ...heading('Compare', 64, 'Compare the plans', 'The differences that actually change how you work.'),
      // Header row: the first column names the feature, the rest are plans.
      ...['Feature', 'Starter', 'Growth', 'Scale'].map((title, column) =>
        label(
          `Compare / Head ${title}`,
          at(GUTTER + (column === 0 ? 0 : 480 + (column - 1) * 240), 232, column === 0 ? 460 : 220, 22),
          title,
          { size: 13, weight: 600, color: column === 0 ? MUTED : INK },
        ),
      ),
      block('Compare / Head rule', at(GUTTER, 264, COL, 1), BORDER),
      ...[
        { feature: 'Records', values: ['10k', 'Unlimited', 'Unlimited'] },
        { feature: 'Roles and permissions', values: ['Basic', 'Custom', 'Custom'] },
        { feature: 'Audit log retention', values: ['30 days', '1 year', '7 years'] },
        { feature: 'Data residency', values: ['—', '—', 'Included'] },
        { feature: 'Support', values: ['Email', 'Priority', 'Named engineer'] },
      ].map((row, index) =>
        stack(`Compare / Row ${index + 1}`, at(GUTTER, 284 + index * 52, COL, 52), [
          label(`Row ${index + 1} / Feature`, at(0, 14, 460, 22), row.feature, {
            size: 14,
            weight: 500,
          }),
          ...row.values.map((value, column) =>
            label(`Row ${index + 1} / ${column}`, at(480 + column * 240, 14, 220, 22), value, {
              size: 14,
              color: MUTED,
            }),
          ),
          block(`Row ${index + 1} / Rule`, at(0, 51, COL, 1), BORDER),
        ]),
      ),
    ]),
  },

  /* --------------------------------------------------------- testimonials */

  {
    id: 'section-testimonials-grid',
    category: 'Marketing',
    name: 'Testimonials (3 up)',
    width: W,
    height: 480,
    spec: surface('Section / Testimonials grid', box(W, 480), { fill: SURFACE }, [
      ...heading('Testimonials', 72, 'What teams say after a quarter', 'Not launch-week quotes - reviews from people a full quarter in.'),
      ...[
        {
          quote: 'We replaced four tools with one. Onboarding a new region used to take a quarter.',
          name: 'Rita Mensah',
          role: 'COO, Northwind',
        },
        {
          quote: 'The audit log alone got us through SOC 2 without hiring a consultant.',
          name: 'Tom Alvarez',
          role: 'Head of Ops, Kessel',
        },
        {
          quote: 'Reporting that used to be a Friday job now runs itself before I am in.',
          name: 'Ada Silva',
          role: 'Finance Lead, Vero',
        },
      ].map((item, index) =>
        card(
          `Testimonials / ${item.name}`,
          { x: GUTTER + index * (COL / 3), y: 232, width: COL / 3 - 28, height: 208 },
          [
            label(`${item.name} / Stars`, at(28, 26, 120, 20), '★★★★★', {
              size: 14,
              color: BRAND,
            }),
            label(`${item.name} / Quote`, at(28, 56, COL / 3 - 84, 76), item.quote, {
              size: 15,
              color: MUTED,
              lineHeight: 1.6,
            }),
            block(`${item.name} / Avatar`, at(28, 148, 36, 36), BRAND_SOFT, 18),
            label(`${item.name} / Name`, at(76, 150, 200, 20), item.name, {
              size: 14,
              weight: 600,
            }),
            label(`${item.name} / Role`, at(76, 170, 200, 18), item.role, {
              size: 13,
              color: MUTED,
            }),
          ],
        ),
      ),
    ]),
  },

  {
    id: 'section-testimonial-dark',
    category: 'Marketing',
    name: 'Testimonial (dark quote)',
    width: W,
    height: 400,
    spec: surface('Section / Testimonial dark', box(W, 400), { fill: DARK }, [
      label('Testimonial / Mark', at(GUTTER + 160, 72, 60, 60), '“', {
        size: 72,
        weight: 600,
        color: BRAND,
      }),
      label(
        'Testimonial / Quote',
        at(GUTTER + 160, 132, COL - 320, 100),
        'One data model meant the finance team and the ops team stopped arguing about whose number was right.',
        { size: 30, weight: 600, color: SURFACE, lineHeight: 1.5 },
      ),
      block('Testimonial / Avatar', at(GUTTER + 160, 268, 44, 44), BRAND_SOFT, 22),
      label('Testimonial / Name', at(GUTTER + 220, 272, 300, 20), 'Marcus Lindqvist', {
        size: 15,
        weight: 600,
        color: SURFACE,
      }),
      label('Testimonial / Role', at(GUTTER + 220, 294, 300, 20), 'CFO, Halden Group', {
        size: 13,
        color: ON_DARK,
      }),
    ]),
  },

  {
    id: 'section-testimonial-split',
    category: 'Marketing',
    name: 'Testimonial (with logo)',
    width: W,
    height: 360,
    spec: surface('Section / Testimonial split', box(W, 360), { fill: SUBTLE }, [
      card('Testimonial / Logo panel', { x: GUTTER, y: 72, width: 360, height: 216 }, [
        block('Logo / Mark', at(140, 72, 80, 32), BORDER, 6),
        label('Logo / Metric', at(24, 128, 312, 30), '38% less manual work', {
          size: 18,
          weight: 600,
          align: 'center',
        }),
      ]),
      label(
        'Testimonial / Quote',
        at(GUTTER + 420, 88, COL - 420, 120),
        'We stopped reconciling spreadsheets in month two. The reporting module paid for the whole contract by the end of the quarter.',
        { size: 24, weight: 600, lineHeight: 1.55 },
      ),
      block('Testimonial / Avatar', at(GUTTER + 420, 228, 44, 44), BRAND_SOFT, 22),
      label('Testimonial / Name', at(GUTTER + 480, 232, 320, 20), 'Chidi Balogun', {
        size: 15,
        weight: 600,
      }),
      label('Testimonial / Role', at(GUTTER + 480, 254, 320, 20), 'Operations Director, Meridian', {
        size: 13,
        color: MUTED,
      }),
    ]),
  },

  /* ------------------------------------------------------------------ faq */

  {
    id: 'section-faq-two-column',
    category: 'Content',
    name: 'FAQ (two column)',
    width: W,
    height: 520,
    spec: surface('Section / FAQ two column', box(W, 520), { fill: SURFACE }, [
      ...heading('FAQ', 64, 'Questions, answered', 'The four things every team asks before they move over.'),
      ...[
        {
          q: 'Can we migrate from our current CRM?',
          a: 'Yes. Importers cover the common systems, and anything else lands through the API.',
        },
        {
          q: 'How does role-based access work?',
          a: 'Roles carry permissions in `module:resource:action` form. Deny by default.',
        },
        {
          q: 'Where is our data stored?',
          a: 'In the region you pick at signup. Enterprise plans can pin residency per entity.',
        },
        {
          q: 'Do you offer a self-hosted option?',
          a: 'Yes, on annual contracts, with the same release train as the hosted product.',
        },
      ].map((item, index) =>
        stack(
          `FAQ / Item ${index + 1}`,
          at(GUTTER + (index % 2) * (COL / 2), 228 + Math.floor(index / 2) * 140, COL / 2 - 40, 130),
          [
            label(`Item ${index + 1} / Question`, at(0, 0, COL / 2 - 60, 26), item.q, {
              size: 17,
              weight: 600,
            }),
            label(`Item ${index + 1} / Answer`, at(0, 34, COL / 2 - 80, 72), item.a, {
              size: 15,
              color: MUTED,
              lineHeight: 1.65,
            }),
          ],
        ),
      ),
    ]),
  },

  {
    id: 'section-faq-open',
    category: 'Content',
    name: 'FAQ (first open)',
    width: W,
    height: 560,
    spec: surface('Section / FAQ open', box(W, 560), { fill: SUBTLE }, [
      ...heading('FAQ', 64, 'Frequently asked questions', 'Everything teams ask before they move over.'),
      // The first row is expanded, which is what tells a visitor the rest open
      // too - a wall of closed rows reads as a list, not a control.
      card('FAQ / Open item', { x: GUTTER + 200, y: 224, width: COL - 400, height: 150 }, [
        label('Open / Question', at(28, 26, COL - 480, 26), 'Can we migrate from our current CRM?', {
          size: 17,
          weight: 600,
        }),
        label('Open / Toggle', at(COL - 464, 24, 24, 26), '–', {
          size: 20,
          color: BRAND,
          align: 'center',
        }),
        label(
          'Open / Answer',
          at(28, 62, COL - 500, 70),
          'Yes. Importers cover Salesforce, HubSpot and Pipedrive, and anything else lands through the API. Most teams are moved inside a week.',
          { size: 15, color: MUTED, lineHeight: 1.65 },
        ),
      ]),
      ...[
        'How does role-based access work?',
        'Where is our data stored?',
        'Do you offer a self-hosted option?',
      ].map((question, index) =>
        stack(`FAQ / Closed ${index + 1}`, at(GUTTER + 200, 394 + index * 56, COL - 400, 56), [
          label(`Closed ${index + 1} / Question`, at(28, 16, COL - 480, 24), question, {
            size: 16,
            weight: 500,
          }),
          label(`Closed ${index + 1} / Toggle`, at(COL - 464, 14, 24, 24), '+', {
            size: 18,
            color: MUTED,
            align: 'center',
          }),
          block(`Closed ${index + 1} / Rule`, at(28, 55, COL - 456, 1), BORDER),
        ]),
      ),
    ]),
  },

  {
    id: 'section-faq-contact',
    category: 'Content',
    name: 'FAQ (with contact aside)',
    width: W,
    height: 500,
    spec: surface('Section / FAQ contact', box(W, 500), { fill: SURFACE }, [
      label('FAQ / Title', at(GUTTER, 80, 380, 48), 'Still deciding?', { size: 38, weight: 600 }),
      label(
        'FAQ / Body',
        at(GUTTER, 144, 340, 80),
        'The answers most teams need are here. If yours is not, an engineer will answer it directly.',
        { size: 16, color: MUTED, lineHeight: 1.65 },
      ),
      {
        ...button('FAQ / CTA', 'Talk to an engineer', 220, 50, { fill: BRAND, text: ON_BRAND }),
        transform: at(GUTTER, 244, 220, 50),
      },
      ...[
        'Can we migrate from our current CRM?',
        'How does role-based access work?',
        'Where is our data stored?',
        'Do you offer a self-hosted option?',
        'What happens to our data if we leave?',
      ].map((question, index) =>
        stack(`FAQ / Item ${index + 1}`, at(GUTTER + 520, 80 + index * 68, COL - 520, 68), [
          label(`Item ${index + 1} / Question`, at(0, 20, COL - 600, 24), question, {
            size: 16,
            weight: 500,
          }),
          label(`Item ${index + 1} / Toggle`, at(COL - 584, 18, 24, 24), '+', {
            size: 18,
            color: MUTED,
            align: 'center',
          }),
          block(`Item ${index + 1} / Rule`, at(0, 67, COL - 520, 1), BORDER),
        ]),
      ),
    ]),
  },
];
