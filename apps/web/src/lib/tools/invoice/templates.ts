/**
 * Document templates - the look of the printed document.
 *
 * A template is a palette + a couple of layout switches, kept as data (like the
 * QR designer's colors) so the preview and PDF render an artifact from config
 * rather than hardcoding a design. Colors are explicit hex because this is the
 * physical document surface, not app chrome — white paper must stay white paper
 * in dark mode and on the page. Adding one of the spec's 30+ templates is one
 * entry here.
 */

export interface Template {
  id: string;
  label: string;
  /** Paper + ink. */
  surface: string;
  text: string;
  muted: string;
  border: string;
  /** Brand accent for headings, the total bar and rules. */
  accent: string;
  accentText: string;
  /** Header treatment: a full accent band, or a light minimal rule. */
  header: 'band' | 'rule' | 'split';
  /**
   * Structural layout the preview renders. Different document impressions, not
   * just recolors: `standard` = header row + accent table; `classic` = boxed,
   * fully bordered ledger; `sidebar` = an accent rail down the left; `banner` =
   * a big accent header block with striped, numbered rows and a THANK YOU;
   * `corporate` = a logo lockup, dark table header and a stacked
   * subtotal/tax/total breakdown with a signature.
   */
  layout:
    | 'standard'
    | 'classic'
    | 'sidebar'
    | 'banner'
    | 'corporate'
    | 'ribbon'
    | 'wave'
    | 'artistic'
    | 'curve';
  /** Second stop for gradient designs (curve). Defaults to `accent`. */
  accent2?: string;
  fontClass: string;
}

export const TEMPLATES: readonly Template[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    surface: '#ffffff',
    text: '#18181b',
    muted: '#71717a',
    border: '#e4e4e7',
    accent: '#18181b',
    accentText: '#ffffff',
    header: 'rule',
    layout: 'standard',
    fontClass: 'font-sans',
  },
  {
    id: 'modern',
    label: 'Modern',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    accent: '#6d28d9',
    accentText: '#ffffff',
    header: 'band',
    layout: 'standard',
    fontClass: 'font-sans',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    surface: '#ffffff',
    text: '#1e293b',
    muted: '#64748b',
    border: '#cbd5e1',
    accent: '#0369a1',
    accentText: '#ffffff',
    header: 'split',
    layout: 'classic',
    fontClass: 'font-sans',
  },
  {
    id: 'elegant',
    label: 'Elegant',
    surface: '#fbfaf7',
    text: '#292524',
    muted: '#78716c',
    border: '#e7e5e4',
    accent: '#9a7b4f',
    accentText: '#ffffff',
    header: 'rule',
    layout: 'sidebar',
    fontClass: 'font-serif',
  },
  {
    id: 'startup',
    label: 'Startup',
    surface: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#059669',
    accentText: '#ffffff',
    header: 'band',
    layout: 'standard',
    fontClass: 'font-sans',
  },
  {
    id: 'dark',
    label: 'Dark',
    surface: '#0b0b0f',
    text: '#f4f4f5',
    muted: '#a1a1aa',
    border: '#27272a',
    accent: '#8b5cf6',
    accentText: '#0b0b0f',
    header: 'band',
    layout: 'sidebar',
    fontClass: 'font-sans',
  },
  {
    id: 'ledger',
    label: 'Ledger',
    surface: '#ffffff',
    text: '#111111',
    muted: '#555555',
    border: '#111111',
    accent: '#111111',
    accentText: '#ffffff',
    header: 'split',
    layout: 'classic',
    fontClass: 'font-sans',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    surface: '#ffffff',
    text: '#0c4a6e',
    muted: '#0e7490',
    border: '#cffafe',
    accent: '#0891b2',
    accentText: '#ffffff',
    header: 'band',
    layout: 'sidebar',
    fontClass: 'font-sans',
  },
  {
    id: 'coral',
    label: 'Coral',
    surface: '#fffdfb',
    text: '#7c2d12',
    muted: '#9a6a4f',
    border: '#fde7d7',
    accent: '#ea580c',
    accentText: '#ffffff',
    header: 'rule',
    layout: 'standard',
    fontClass: 'font-sans',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    surface: '#0f172a',
    text: '#e2e8f0',
    muted: '#94a3b8',
    border: '#1e293b',
    accent: '#38bdf8',
    accentText: '#0f172a',
    header: 'split',
    layout: 'classic',
    fontClass: 'font-sans',
  },
  {
    id: 'aqua',
    label: 'Aqua Banner',
    surface: '#ffffff',
    text: '#134e4a',
    muted: '#5b7c78',
    border: '#d7efeb',
    accent: '#14a098',
    accentText: '#ffffff',
    header: 'band',
    layout: 'banner',
    fontClass: 'font-sans',
  },
  {
    id: 'graphite',
    label: 'Graphite',
    surface: '#ffffff',
    text: '#1f2937',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#374151',
    accentText: '#ffffff',
    header: 'split',
    layout: 'corporate',
    fontClass: 'font-sans',
  },
  {
    id: 'sunbeam',
    label: 'Sunbeam',
    surface: '#ffffff',
    text: '#2b2b38',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#f5b301',
    accentText: '#2b2b38',
    header: 'band',
    layout: 'ribbon',
    fontClass: 'font-sans',
  },
  {
    id: 'terracotta',
    label: 'Terracotta',
    surface: '#f6f6f4',
    text: '#1f2937',
    muted: '#6b7280',
    border: '#d6d3cd',
    accent: '#e2683c',
    accentText: '#ffffff',
    header: 'split',
    layout: 'wave',
    fontClass: 'font-sans',
  },
  {
    id: 'studio',
    label: 'Studio',
    surface: '#dcdcd6',
    text: '#1f2937',
    muted: '#57606a',
    border: '#b9b9b2',
    accent: '#d98032',
    accentText: '#ffffff',
    header: 'rule',
    layout: 'artistic',
    fontClass: 'font-sans',
  },
  {
    id: 'blush',
    label: 'Blush',
    surface: '#ffffff',
    text: '#1f2937',
    muted: '#6b7280',
    border: '#f3d9de',
    accent: '#ec4899',
    accent2: '#fb7185',
    accentText: '#ffffff',
    header: 'band',
    layout: 'curve',
    fontClass: 'font-sans',
  },
];

export const TEMPLATES_BY_ID: Record<string, Template> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t]),
);
