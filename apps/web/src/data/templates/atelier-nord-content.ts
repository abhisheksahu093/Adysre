import { Building2, Compass, Frame, Hammer, Landmark, Layers, Mountain, Ruler } from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * ATELIER NORD - content for the architecture studio portfolio.
 *
 * The studio's own words, in English and deliberately untranslated: a template
 * is an artifact the visitor downloads and rewrites (see `types.ts`). Every
 * section reads from this object and holds no copy of its own, so re-branding
 * the template means editing this file and nothing else.
 *
 * The voice is the design: short declarative sentences, real places, real
 * materials, real years. Nothing is superlative and nothing is exclaimed.
 */
export const ATELIER_CONTENT: TemplateContent = {
  brand: 'Atelier Nord',

  nav: [
    { href: '#about', label: 'Studio' },
    { href: '#services', label: 'Practice' },
    { href: '#why', label: 'Work' },
    { href: '#faq', label: 'Questions' },
    { href: '#contact', label: 'Enquiries' },
  ],

  hero: {
    badge: 'Oslo — practising since 2009',
    title: 'An architecture of',
    titleAccent: 'quiet, exact rooms',
    subtitle:
      'Atelier Nord builds in timber, board-formed concrete and daylight. Thirty-four completed buildings across Norway and Denmark, each drawn by the two people who will stand on its site.',
    ctaPrimary: 'Read the index',
    ctaSecondary: 'Write to the studio',
    stats: [
      { value: 34, suffix: '', label: 'Buildings completed' },
      { value: 16, suffix: '', label: 'Years in practice' },
      { value: 9, suffix: '', label: 'Cities built in' },
    ],
  },

  marquee: [
    'Board-formed concrete',
    'Heartwood pine',
    'Oiled oak',
    'Patinated zinc',
    'Larvikite granite',
    'Lime plaster',
    'Blackened steel',
    'Cellulose insulation',
  ],

  about: {
    eyebrow: 'The studio',
    title: 'Ingrid Halvorsen founded the practice in a sail loft on Sjøgata',
    body: [
      'Atelier Nord began in 2009 with a single commission: a 46 square metre boathouse in Vestre Vika that had to survive both the fjord wind and the planning committee. It was built in larch and granite, and it is still standing, unpainted, in its sixteenth winter.',
      'Since then the studio has stayed small on purpose. Ingrid Halvorsen and a team of five work from one room above the harbour, and every drawing that leaves it has been made by someone who has walked the site in more than one season.',
      'We do not keep a house style. We keep a method: measure the ground, find the light, choose four materials, and remove everything that is not carrying weight.',
    ],
    points: [
      'Five architects, one office, no satellite studios',
      'Sites surveyed in at least two seasons before a line is drawn',
      'Timber sourced within 400 kilometres of the build',
      'Every project detailed by the architect who designed it',
    ],
  },

  services: {
    eyebrow: 'Practice',
    title: 'Four kinds of work',
    subtitle:
      'The studio takes eight to ten commissions a year across these four categories, and declines anything it cannot draw in full.',
    items: [
      {
        icon: Compass,
        title: 'Private houses',
        body: 'Single dwellings and cabins from first survey to handover, typically 90 to 240 square metres, built for clients who intend to stay.',
      },
      {
        icon: Landmark,
        title: 'Cultural and civic',
        body: 'Chapels, libraries, viewing rooms and small museums, usually won by open competition and delivered with a public client.',
      },
      {
        icon: Layers,
        title: 'Adaptive reuse',
        body: 'Warehouses, barns and post-war housing blocks brought back into use with their structure kept visible and their history legible.',
      },
      {
        icon: Ruler,
        title: 'Interiors and furniture',
        body: 'Fitted joinery, stairs and single pieces drawn at 1:1 and made by workshops in Hallingdal and Jutland that we have used for a decade.',
      },
    ],
  },

  why: {
    eyebrow: 'Selected work',
    title: 'Four buildings that explain the practice',
    subtitle:
      'Each was drawn for one site and would be wrong on any other. Photography is withheld until a building has been lived in for a full year.',
    items: [
      {
        icon: Mountain,
        title: 'Hallingdal Cabin',
        body: 'Ål, 2021. A 112 square metre cabin in heartwood pine set on nine concrete pads, so the ground beneath it was never levelled.',
      },
      {
        icon: Frame,
        title: 'Vestre Boathouse',
        body: 'Bergen, 2016. Larch and Larvikite granite at the waterline, rebuilt from the footprint of the 1912 boathouse it replaced.',
      },
      {
        icon: Building2,
        title: 'Grünerløkka Infill',
        body: 'Oslo, 2023. Fourteen apartments in a nine metre gap between two brick blocks, in board-formed concrete and patinated zinc.',
      },
      {
        icon: Hammer,
        title: 'Nordnes Chapel',
        body: 'Tromsø, 2024. A 180 seat chapel with one north window, lime-plastered inside and clad in blackened steel against the salt air.',
      },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'What clients ask before the first meeting',
    items: [
      {
        question: 'How are fees structured?',
        answer:
          'A fixed fee for the concept stage, then a percentage of construction cost for the remaining stages, declared in full before you commit to anything. The concept fee is deducted if you continue.',
      },
      {
        question: 'How long does a house take?',
        answer:
          'Fourteen to twenty months from first survey to handover, of which roughly six are drawing and planning. Sites requiring a dispensation from the municipality add three to five months.',
      },
      {
        question: 'Do you work outside Norway?',
        answer:
          'Yes. The studio has completed four projects in Denmark and one in northern Sweden, always with a local engineer and a contractor we have met on site before the tender.',
      },
      {
        question: 'Can you work with a contractor we already have?',
        answer:
          'Usually. We ask to meet them during the concept stage, because a detail drawn for one workshop rarely survives being handed to another without being redrawn.',
      },
      {
        question: 'How do you handle energy performance?',
        answer:
          'Every project is modelled for heat loss before the plan is fixed. The studio builds to passive house airtightness as a matter of course and states the measured result at handover rather than the predicted one.',
      },
    ],
  },

  contact: {
    eyebrow: 'Enquiries',
    title: 'Tell us about the site',
    subtitle:
      'The studio reviews new commissions on the first Monday of each month. A plot number, a rough budget and a photograph taken from the road are enough to start.',
    fields: { name: 'Your name', email: 'Email address', message: 'The site, and what you want to build on it' },
    submit: 'Send enquiry',
    details: [
      { label: 'Studio', value: 'Sjøgata 12, 0150 Oslo' },
      { label: 'Email', value: 'studio@ateliernord.example' },
      { label: 'Telephone', value: '+47 22 55 01 34' },
      { label: 'Reply', value: 'Every enquiry is answered within two working days' },
    ],
  },

  footer: {
    tagline: 'A five-person architecture studio in Oslo, building in timber, concrete and daylight since 2009.',
    columns: [
      { title: 'Practice', links: ['Private houses', 'Cultural and civic', 'Adaptive reuse', 'Interiors'] },
      { title: 'Studio', links: ['Ingrid Halvorsen', 'Method', 'Competitions', 'Positions'] },
      { title: 'Index', links: ['Hallingdal Cabin', 'Vestre Boathouse', 'Grünerløkka Infill', 'Nordnes Chapel'] },
    ],
    legal: '© 2026 Atelier Nord AS. Organisation number 991 204 887.',
  },
};

/** The prompt a visitor copies to generate a page in this spirit. */
export const ATELIER_PROMPT = `Design a single-page portfolio website for a small Norwegian architecture studio called Atelier Nord.

Art direction:
- Stark white page (#ffffff) with near-black text (#0a0a0a). No cards, no shadows, no rounded corners, no colour beyond black at varying opacity. Restraint is the entire design.
- A single hairline grid: four vertical 1px rules at 12% opacity behind the hero, and horizontal hairlines separating every section and every list row.
- Extreme whitespace: 8-10rem of vertical padding per section, headings never wider than 60% of the page.
- Type: a very large, very thin sans heading (weight 200, tracking -0.03em, up to 6rem) set beside a tiny uppercase label at 10px with 0.34em letter-spacing. Asymmetric editorial layout - the label sits in a narrow left column, the heading in a wide right one.
- Work is presented as a numbered index: rows 01-04 with a hairline above each, the number small and grey, the title large, a short caption at the right.

Sections in order: a hairline header with the studio name and anchor nav, a hero with a tiny label, a two-line thin headline, a short paragraph, two underlined text links and three counters, a slow drifting strip of material names, a studio story in an asymmetric two-column layout with a numbered list, a numbered practice index, a selected-work grid of four CSS-composed abstract blocks with captions, a hairline accordion of questions, a contact section with an underline-only form beside a hairline detail table, and a footer with the studio name set very large.

Motion: slow fades of 900ms with a 12px rise, a horizontal hairline that draws itself from zero to full width under each heading, work blocks revealed with a clip-path wipe from the bottom edge, counters that count once, and hover states that shift a row 6px to the right. Everything is static under prefers-reduced-motion.

Voice: precise and unadorned. Real cities, real years, real materials, real square metres. No placeholder copy, no superlatives, no exclamation marks.`;
