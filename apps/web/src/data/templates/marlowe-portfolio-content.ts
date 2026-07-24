import {
  Braces,
  Compass,
  Figma,
  Gauge,
  LineChart,
  MonitorSmartphone,
  PenTool,
  Rocket,
  Sparkles,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * MARLOWE - content for the single-page freelancer portfolio.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * This is a SINGLE-PAGE template in the shape of a classic personal-brand
 * freelancer site: an animated hero with headline stats, an about, a résumé
 * timeline, three services with project counts, animated skill bars, a
 * filterable portfolio grid, testimonials and a two-tier pricing table. It
 * carries more than the shared `TemplateContent` shape to cover those.
 *
 * The persona, projects, figures and testimonials are ILLUSTRATIVE and authored
 * - a template ships no CMS, and an implied real client would be a different
 * problem entirely.
 */

export const MARLOWE_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Hire me',
  available: 'Available for new work',
  allFilter: 'All',
} as const;

/** In-page anchors. A single-page site navigates by hash, not by route. */
export const MARLOWE_NAV: { id: string; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Résumé' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
];

/** Headline figures. Illustrative. */
export const MARLOWE_STATS = [
  { value: 11, suffix: '+', label: 'Years freelance' },
  { value: 194, suffix: '+', label: 'Projects shipped' },
  { value: 68, suffix: '', label: 'Happy clients' },
  { value: 9, suffix: '', label: 'Awards' },
];

/** One résumé entry, education or experience. */
export interface MarloweResumeItem {
  period: string;
  role: string;
  org: string;
  body: string;
}

export interface MarloweResumeColumn {
  title: string;
  items: MarloweResumeItem[];
}

export const MARLOWE_RESUME: MarloweResumeColumn[] = [
  {
    title: 'Experience',
    items: [
      { period: '2021 to Now', role: 'Independent designer & developer', org: 'Self-employed', body: 'Product design and front-end for startups and studios who need one person to take an idea from Figma to production.' },
      { period: '2018 to 2021', role: 'Senior product designer', org: 'Northwind', body: 'Owned the design system and the checkout redesign that lifted conversion by a third across three markets.' },
      { period: '2015 to 2018', role: 'Designer', org: 'Fieldhouse Studio', body: 'Brand and web for culture and hospitality clients, where I learned that the print discipline makes the screen better.' },
    ],
  },
  {
    title: 'Education',
    items: [
      { period: '2013 to 2015', role: 'MA, Interaction Design', org: 'Royal College', body: 'A thesis on motion as a way of explaining, which is still most of what I believe about interfaces.' },
      { period: '2010 to 2013', role: 'BA, Graphic Design', org: 'Central Saint Martins', body: 'Typography, grids and the unglamorous craft that everything else sits on top of.' },
      { period: 'Ongoing', role: 'Perpetual student', org: 'The internet', body: 'A new tool every quarter, most of them abandoned by the next, a few of them keepers.' },
    ],
  },
];

/** One service, with a project count. */
export interface MarloweService {
  icon: typeof PenTool;
  title: string;
  count: string;
  body: string;
  deliverables: string[];
}

export const MARLOWE_SERVICES: MarloweService[] = [
  {
    icon: PenTool,
    title: 'Product & web design',
    count: '90+ projects',
    body: 'Interfaces designed to be built, end to end, from the messy first sketch to a system a team can actually ship against.',
    deliverables: ['UX & flows', 'UI design', 'Design systems', 'Prototypes'],
  },
  {
    icon: Braces,
    title: 'Front-end development',
    count: '70+ projects',
    body: 'The design, made real. Accessible, fast, responsive front-ends in React and the modern web stack. No throwing it over a wall.',
    deliverables: ['React / Next.js', 'Tailwind', 'Motion', 'CMS wiring'],
  },
  {
    icon: LineChart,
    title: 'SEO & strategy',
    count: '40+ projects',
    body: 'The part that makes the work pay off: performance, structured content and the measurement to prove it moved a number.',
    deliverables: ['Technical SEO', 'Core Web Vitals', 'Analytics', 'Content strategy'],
  },
];

/** One skill, with a self-assessed proficiency. Illustrative. */
export interface MarloweSkill {
  name: string;
  level: number;
}

export const MARLOWE_SKILLS: MarloweSkill[] = [
  { name: 'Product design', level: 96 },
  { name: 'React & front-end', level: 92 },
  { name: 'Design systems', level: 90 },
  { name: 'Brand & identity', level: 84 },
  { name: 'Motion & interaction', level: 88 },
  { name: 'SEO & performance', level: 80 },
];

/** One portfolio project. `category` drives the tag filter. */
export interface MarloweProject {
  name: string;
  category: 'Design' | 'Development' | 'Branding';
  client: string;
  year: string;
  body: string;
  plate: 'mlw-plate-a' | 'mlw-plate-b' | 'mlw-plate-c';
}

export const MARLOWE_PROJECTS: MarloweProject[] = [
  { name: 'Aurora patient portal', category: 'Design', client: 'Aurora Health', year: '2026', body: 'A patient portal redesigned around one question: what does the person actually need to see first?', plate: 'mlw-plate-a' },
  { name: 'Meridian dashboard', category: 'Development', client: 'Meridian', year: '2025', body: 'A real-time analytics front-end in React that stays smooth at a million rows.', plate: 'mlw-plate-b' },
  { name: 'Kelp identity', category: 'Branding', client: 'Kelp Bio', year: '2025', body: 'A marine-biotech identity that looks like a laboratory, not a wellness brand.', plate: 'mlw-plate-c' },
  { name: 'Cadence onboarding', category: 'Design', client: 'Cadence', year: '2024', body: 'An onboarding flow rebuilt as one scroll scene: interaction doing the explaining.', plate: 'mlw-plate-b' },
  { name: 'Verso storefront', category: 'Development', client: 'Verso', year: '2024', body: 'A headless commerce build where the checkout is three fields and nothing else.', plate: 'mlw-plate-a' },
  { name: 'Field & Fable', category: 'Branding', client: 'Field & Fable', year: '2023', body: 'A publisher’s identity system flexible across nine imprints and impossible to make ugly.', plate: 'mlw-plate-c' },
];

/** One testimonial. Illustrative. */
export interface MarloweTestimonial {
  quote: string;
  name: string;
  title: string;
  initials: string;
}

export const MARLOWE_TESTIMONIALS: MarloweTestimonial[] = [
  { quote: 'Marlowe is the rare designer who can also ship the thing. We got a finished, fast, beautiful product from one person, on time.', name: 'Priya Anand', title: 'Founder, Meridian', initials: 'PA' },
  { quote: 'The redesign paid for itself in a quarter. Every decision had a reason, and the reason was usually right.', name: 'Tomás Neto', title: 'Head of Product, Aurora', initials: 'TN' },
  { quote: 'Calm, direct, no drama, no missed deadlines. I have hired a lot of freelancers; this is what the good ones feel like.', name: 'Ingrid Halvorsen', title: 'CEO, Kelp Bio', initials: 'IH' },
];

/** One pricing tier. */
export interface MarlowePlan {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export const MARLOWE_PRICING: MarlowePlan[] = [
  {
    name: 'Project',
    price: 'From €6k',
    cadence: 'fixed scope',
    summary: 'A defined piece of work with a clear start and end: a site, a redesign, a feature.',
    features: ['One project, scoped up front', 'Design and build', 'Two revision rounds', '30 days of support', 'Async, weekly check-ins'],
    cta: 'Start a project',
    featured: false,
  },
  {
    name: 'Retainer',
    price: '€4.5k',
    cadence: 'per month',
    summary: 'A standing slice of my week for teams that need a designer-developer on tap.',
    features: ['~1 week per month', 'Design and front-end', 'Priority turnaround', 'Rolling backlog', 'A monthly call, cancel anytime'],
    cta: 'Enquire about a retainer',
    featured: true,
  },
];

export const MARLOWE_CONTENT: TemplateContent = {
  brand: 'Marlowe',

  nav: MARLOWE_NAV.map((item) => ({ href: `#${item.id}`, label: item.label })),

  hero: {
    badge: 'Marlowe Reid, designer & developer',
    title: 'I design and build',
    titleAccent: 'the whole thing',
    subtitle:
      'A one-person studio doing product design and front-end development, from the first Figma frame to a fast, accessible site in production.',
    ctaPrimary: 'Hire me',
    ctaSecondary: 'See the work',
    stats: [
      { value: 11, suffix: '+', label: 'Years freelance' },
      { value: 194, suffix: '+', label: 'Projects' },
      { value: 68, suffix: '', label: 'Clients' },
    ],
  },

  marquee: ['Product design', 'React', 'Design systems', 'Branding', 'Motion', 'SEO', 'Webflow', 'Front-end'],

  about: {
    eyebrow: 'About',
    title: 'Designer who ships, developer who cares how it looks',
    body: [
      'I have spent eleven years in the overlap between design and engineering, arguing that the handoff between them should not exist. When one person owns the whole thing, the seams disappear, and the seams are where projects usually fail.',
      'That means I sweat the kerning and the bundle size in the same afternoon. I will not ship something that stutters on a mid-range phone, and I will not build something ugly just because it passes the tests. Both matter, so I do both.',
    ],
    points: [
      'Design and build, no handoff in between',
      'Accessible and fast, on real hardware',
      'Systems, so the next feature is cheaper',
      'Clear, weekly, no-surprises communication',
    ],
  },

  services: {
    eyebrow: 'Services',
    title: 'What I can do for you',
    subtitle: 'Three things, done properly. Most projects use two of them; a few use all three.',
    items: MARLOWE_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'How I work',
    title: 'A simple way of working',
    subtitle: 'No account managers, no mystery. You talk to the person doing the work, every week.',
    items: [
      { icon: Compass, title: 'Understand', body: 'A short, sharp discovery to agree what success looks like before anyone opens a design tool.' },
      { icon: Figma, title: 'Design', body: 'Directions shown in context, revised quickly, decided together, not presented as a fait accompli.' },
      { icon: MonitorSmartphone, title: 'Build', body: 'The design, made real in code, reviewed in the browser on real devices as it goes.' },
      { icon: Gauge, title: 'Optimise', body: 'Performance, accessibility and SEO tuned until the numbers are good, not just the screenshots.' },
      { icon: Rocket, title: 'Launch', body: 'A calm release, behind flags where it helps, with me on hand for the first busy day.' },
      { icon: Sparkles, title: 'Support', body: '30 days of questions answered as standard, and a retainer if you want me to stick around.' },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Before you get in touch',
    items: [
      {
        question: 'Do you design and develop, or just one?',
        answer:
          'Both, which is the point. You can hire me for design only or build only, but the value is in getting one person who does the whole thing: the design is made by someone who has to build it, and the build is done by someone who designed it.',
      },
      {
        question: 'How much does a project cost?',
        answer:
          'Fixed-scope projects generally start around €6,000 and most land between there and €25,000, depending on extent. Retainers are €4,500 a month for roughly a week of my time. Tell me the budget and I will tell you honestly what fits inside it rather than pad the scope to reach it.',
      },
      {
        question: 'How soon can you start?',
        answer:
          'I take a couple of projects at a time and I am honest about the queue. Reach out with rough timing and I will tell you the real next opening, not the date you want to hear.',
      },
      {
        question: 'Do you work with existing teams?',
        answer:
          'Often. I slot in as the designer-developer a small team cannot justify hiring full-time, and I leave things documented so the team can carry on without me. No black boxes.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Let’s make something',
    subtitle:
      'Tell me what you are building, when it needs to exist, and roughly what you can spend. All three, ideally. The third saves us both a week.',
    fields: { name: 'Your name', email: 'Email', message: 'What are you building?' },
    submit: 'Send it',
    details: [
      { label: 'Email', value: 'hello@marlowe.studio' },
      { label: 'Based', value: 'Lisbon · remote worldwide' },
      { label: 'Response', value: 'Usually within a day' },
      { label: 'Elsewhere', value: 'Dribbble · GitHub · LinkedIn' },
    ],
  },

  footer: {
    tagline: 'One person, designing and building the whole thing.',
    columns: [
      { title: 'Site', links: ['About', 'Résumé', 'Services', 'Work', 'Contact'] },
      { title: 'Services', links: ['Product design', 'Front-end', 'Design systems', 'Branding', 'SEO'] },
      { title: 'Elsewhere', links: ['Dribbble', 'GitHub', 'LinkedIn', 'Read.cv', 'Résumé (PDF)'] },
    ],
    legal: '© 2026 Marlowe Reid. Projects and testimonials shown are illustrative.',
  },
};

export const MARLOWE_PROMPT = `Design a single-page personal portfolio website for a freelance product designer and developer, in the style of a modern "personal brand" freelancer theme.

Visual direction: dark and confident. A near-black ground (#0e0e11), off-white type, and one warm coral accent (#ff6a3d) used for highlights, the "Hire me" button and skill fills. A large sans-serif display face for the name and section headings, a mono for labels and stats. It should feel like a hireable individual, not an agency: personal, direct, credential-forward.

Motion: anime.js v4. An animated HERO BACKGROUND of slow-drifting coral/indigo gradient orbs behind the name. Big count-up STATS ("11+ years", "194+ projects"). SKILL BARS that fill from zero to their percentage as they scroll into view. An interactive PORTFOLIO GRID with tag filtering (All / Design / Development / Branding). Reveal-on-scroll and stagger throughout.

Critical: everything degrades under prefers-reduced-motion. Orbs stop drifting, counters and skill bars render at their final value, reveals resolve visible. The tag filter is real interactivity and works regardless.

Sections, top to bottom (single page, hash navigation): sticky header with a "Hire me" CTA; hero with name, role, headline and stats; a skills/services marquee; about with a profile plate; a two-column résumé timeline (experience + education); three services each with a project count; animated skill bars; a filterable work grid; testimonials; a two-tier pricing table (project vs retainer); a short FAQ; a contact form; footer.

Tone: a freelancer who does the whole thing: capable, calm, honest about time and cost. Photography is stood in for by duotone plates.`;
