import type { LucideIcon } from 'lucide-react';

/**
 * Templates - shared types.
 *
 * A template is a COMPLETE, single-page website that a visitor can preview,
 * prompt-clone or download as a runnable project. It is not a component and not
 * a playground page: its markup is authored, not assembled from the section
 * library, because a template's whole value is that its sections were designed
 * together.
 *
 * Two kinds of string live here, and the difference matters:
 *
 * - The template's OWN content (headlines, service names, FAQ answers) is part
 *   of the artifact. It ships as English inside the template's content module
 *   and is NOT translated - a downloaded template is the visitor's to rewrite.
 * - The app's chrome around it (card labels, dialog actions, section names) is
 *   UI, and is a translation key under the `templates` namespace like every
 *   other module (Rule 6).
 */

/** Access tier. Mirrors `PROMPT_TIERS` so gating stays one concept repo-wide. */
export const TEMPLATE_TIERS = ['free', 'premium'] as const;
export type TemplateTier = (typeof TEMPLATE_TIERS)[number];

/**
 * The sections every template is expected to include, in page order. Labels
 * resolve from `templates.sections.<id>`.
 */
export const TEMPLATE_SECTIONS = [
  'header',
  'hero',
  'about',
  'services',
  'why',
  'faq',
  'contact',
  'footer',
] as const;
export type TemplateSectionId = (typeof TEMPLATE_SECTIONS)[number];

/**
 * Download formats offered in the detail dialog.
 *
 * `project` formats zip a runnable app (package.json, config, install & run).
 * `static` formats zip files you can open straight in a browser. Labels come
 * from `templates.downloads.<id>`.
 */
export const TEMPLATE_DOWNLOADS = [
  { id: 'nextjs', kind: 'project', ext: 'zip' },
  { id: 'react', kind: 'project', ext: 'zip' },
  { id: 'tailwind', kind: 'static', ext: 'zip' },
  { id: 'html', kind: 'static', ext: 'zip' },
] as const satisfies readonly { id: string; kind: 'project' | 'static'; ext: string }[];

export type TemplateDownloadId = (typeof TEMPLATE_DOWNLOADS)[number]['id'];

/** One statistic in a template's content (hero counters, proof strips). */
export interface TemplateStat {
  value: number;
  /** Rendered after the counted value, e.g. `%`, `x`, `M`. */
  suffix: string;
  label: string;
}

export interface TemplateFeature {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface TemplateFaq {
  question: string;
  answer: string;
}

export interface TemplateNavLink {
  href: string;
  label: string;
}

/**
 * A template's authored content. Sections render from this and hold no copy of
 * their own, so rewording a template never touches a component.
 */
export interface TemplateContent {
  brand: string;
  nav: TemplateNavLink[];
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: TemplateStat[];
  };
  marquee: string[];
  about: {
    eyebrow: string;
    title: string;
    body: string[];
    points: string[];
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: TemplateFeature[];
  };
  why: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: TemplateFeature[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: TemplateFaq[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    fields: { name: string; email: string; message: string };
    submit: string;
    details: { label: string; value: string }[];
  };
  footer: {
    tagline: string;
    columns: { title: string; links: string[] }[];
    legal: string;
  };
}

/**
 * One page of a multipage template.
 *
 * `id` is what the renderer switches on and what the preview route puts in
 * `?page=`; `label` is the template's own wording, so it is English and part of
 * the artifact rather than a translation key.
 */
export interface TemplatePage {
  id: string;
  label: string;
}

/**
 * Business vertical, used by the gallery filter. Labels resolve from
 * `templates.themes.<id>`.
 */
export const TEMPLATE_THEMES = [
  'saas',
  'restaurant',
  'fitness',
  'health',
  'architecture',
  'legal',
  'realEstate',
  'ecommerce',
  'finance',
  'agency',
  'beauty',
  'payments',
  'consulting',
  'education',
] as const;
export type TemplateThemeId = (typeof TEMPLATE_THEMES)[number];

/**
 * What the gallery and dialog need, and nothing more.
 *
 * Deliberately free of `content`: that object carries Lucide icon components,
 * which are functions and cannot cross a Server -> Client boundary as props.
 * The page hands summaries to the grid; anything needing the full entry (the
 * download scaffold) looks it up by slug on the client instead.
 */
export interface TemplateSummary {
  slug: string;
  name: string;
  taglineKey: string;
  tier: TemplateTier;
  themeKey: string;
  sections: readonly TemplateSectionId[];
  /** Empty for a multipage template's single-page peers. */
  pages: readonly TemplatePage[];
  /** Formats this template can actually be downloaded as. */
  downloads: readonly TemplateDownloadId[];
  /** Recently added - drives the "New" filter and badge. */
  isNew: boolean;
  /**
   * True when this visitor may not take the code: the prompt is withheld and
   * downloads are empty. Previewing stays open to everyone.
   */
  locked: boolean;
  /**
   * Null when `locked` - the prompt is the product, so it is removed from the
   * payload on the server rather than hidden in the client (see access.ts).
   */
  prompt: string | null;
}

/**
 * How a download finds the template's root component and its stylesheet.
 *
 * The scaffold writes an entry point (`app/page.tsx`, `src/main.tsx`) that has
 * to import a real symbol from a real file, and the README points at the file
 * to re-brand. Both are per-template, so they are declared rather than guessed.
 */
export interface TemplateEntryPoint {
  /** Module basename inside the template folder, e.g. `nova-template`. */
  file: string;
  /** Exported component name, e.g. `NovaTemplate`. */
  symbol: string;
  /** Stylesheet holding the template's tokens, e.g. `nova.css`. */
  stylesheet: string;
  /** Value of the `data-template` attribute the tokens are scoped to. */
  scope: string;
}

/** A template as the gallery, the dialog and the exporter all see it. */
export interface TemplateEntry {
  slug: string;
  /** The template's brand name - an identity, never translated. */
  name: string;
  /** One line describing the business it suits. Translation key. */
  taglineKey: string;
  tier: TemplateTier;
  /** Business vertical, for the card badge. Key under `templates.themes`. */
  themeKey: string;
  sections: readonly TemplateSectionId[];
  /**
   * The prompt a visitor copies to generate something in this spirit. Authored
   * per template: it describes the design, not the code.
   */
  prompt: string;
  entry: TemplateEntryPoint;
  /**
   * Pages, for a multipage template. Omit for a single-page one. The first
   * entry is what the preview shows when no `?page=` is given.
   */
  pages?: readonly TemplatePage[];
  /**
   * The download formats this template ships. Not every template has the two
   * hand-authored static builds, and offering a button that produces an empty
   * zip is worse than not offering it.
   */
  downloads: readonly TemplateDownloadId[];
  /** ISO date the template was added. Drives the "New" filter and badge. */
  addedOn: string;
  content: TemplateContent;
}
