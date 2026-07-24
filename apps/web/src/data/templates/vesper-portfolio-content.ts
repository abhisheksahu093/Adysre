import {
  Boxes,
  Cpu,
  Gauge,
  GitBranch,
  Layers,
  MousePointer2,
  Orbit,
  Rocket,
  Sparkles,
  Workflow,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * VESPER - content for the developer / creative-technologist portfolio.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * VESPER is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the project list, the grouped tech stack, the
 * service ladder and the per-page mastheads.
 *
 * Projects, clients and figures are ILLUSTRATIVE and authored. A template ships
 * no case-study CMS, and an implied real client would be a different problem.
 */

export const VESPER_PAGES = ['home', 'work', 'about', 'stack', 'contact'] as const;
export type VesperPageId = (typeof VESPER_PAGES)[number];

export const VESPER_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Book a call',
  available: 'Available for Q4 2026',
} as const;

export const VESPER_NAV: { id: VesperPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
];

export interface VesperMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const VESPER_MASTHEADS: Record<Exclude<VesperPageId, 'home'>, VesperMasthead> = {
  work: {
    eyebrow: 'Selected work',
    title: 'Things I shipped',
    subtitle:
      'Six projects where the interface was the product. Each one lists the role, the stack and the number that actually moved.',
  },
  about: {
    eyebrow: 'About',
    title: 'Engineer who designs',
    subtitle:
      'A front-end engineer and creative technologist who treats the browser as a canvas. Ten years turning motion and interaction into things people ship.',
  },
  stack: {
    eyebrow: 'Stack',
    title: 'What I reach for',
    subtitle:
      'The tools I know well enough to know their limits. Opinionated, but not religious. The right tool is the one the team can maintain after I leave.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s build it',
    subtitle:
      'Contract and fractional-lead work, mostly interaction-heavy front-ends. Tell me the problem and the deadline; I’ll tell you if I’m the right person for it.',
  },
};

/** One project. */
export interface VesperProject {
  name: string;
  role: string;
  year: string;
  metric: string;
  metricLabel: string;
  stack: string[];
  body: string;
  accent: 'a' | 'b' | 'c';
}

export const VESPER_PROJECTS: VesperProject[] = [
  { name: 'Halo Editor', role: 'Lead front-end', year: '2026', metric: '60fps', metricLabel: 'on a 5-year-old laptop', stack: ['React', 'WebGL', 'Rust/WASM'], body: 'A node-based shader editor that runs the graph on the GPU. The hard part was keeping the canvas at 60fps while React owned the panels around it.', accent: 'a' },
  { name: 'Cadence', role: 'Creative technologist', year: '2025', metric: '+38%', metricLabel: 'trial-to-paid', stack: ['Next.js', 'Framer Motion', 'GSAP'], body: 'An onboarding flow rebuilt as one continuous scroll scene. Interaction did the explaining that three tooltips used to fail at.', accent: 'b' },
  { name: 'Meridian Globe', role: 'Front-end', year: '2025', metric: '1.2M', metricLabel: 'points, no jank', stack: ['Three.js', 'TypeScript', 'GLSL'], body: 'A real-time data globe rendering a million-plus points. Instanced geometry and a custom frustum cull kept it interactive on a phone.', accent: 'c' },
  { name: 'Ostara OS', role: 'Design engineer', year: '2024', metric: '11 apps', metricLabel: 'one design system', stack: ['React', 'Radix', 'Tokens'], body: 'A component system shared across eleven internal tools, built so a product manager could ship a page without a designer in the room.', accent: 'a' },
  { name: 'Slow Radio', role: 'Interaction lead', year: '2024', metric: '4.7★', metricLabel: 'App Store', stack: ['Svelte', 'Web Audio', 'Canvas'], body: 'A generative visualiser that reacts to whatever is playing, drawn on a canvas synced to the Web Audio analyser at frame rate.', accent: 'b' },
  { name: 'Third Signal', role: 'Prototyper', year: '2023', metric: '9 days', metricLabel: 'concept to demo', stack: ['React', 'R3F', 'Zustand'], body: 'A pitch prototype that had to feel real in under two weeks. It landed the round, then became the actual product.', accent: 'c' },
];

/** One group of the tech stack. */
export interface VesperStackGroup {
  title: string;
  note: string;
  items: string[];
}

export const VESPER_STACK: VesperStackGroup[] = [
  { title: 'Languages', note: 'What I write daily', items: ['TypeScript', 'Rust', 'GLSL', 'Python'] },
  { title: 'Frameworks', note: 'For the app around the canvas', items: ['React', 'Next.js', 'Svelte', 'Astro'] },
  { title: 'Graphics & motion', note: 'The reason you hire me', items: ['Three.js', 'React Three Fiber', 'GSAP', 'WebGL', 'Framer Motion'] },
  { title: 'Platform', note: 'To ship it and keep it up', items: ['Vercel', 'Cloudflare', 'Postgres', 'Playwright'] },
];

/** One capability. */
export interface VesperService {
  icon: typeof Cpu;
  title: string;
  body: string;
  deliverables: string[];
}

export const VESPER_SERVICES: VesperService[] = [
  {
    icon: Orbit,
    title: 'Interactive front-ends',
    body: 'The interface-as-product build: motion, 3D and interaction that make a product feel considered rather than assembled.',
    deliverables: ['Architecture', 'Interaction design', 'Implementation', 'Performance budget'],
  },
  {
    icon: Sparkles,
    title: 'Creative technology',
    body: 'WebGL, generative and real-time work. The things a normal front-end team looks at and says “we can’t do that here”.',
    deliverables: ['Shaders', 'Real-time data', 'Generative systems', 'R&D'],
  },
  {
    icon: Boxes,
    title: 'Design systems',
    body: 'The version of the brand that lives in code, built so the people using it cannot easily make it ugly.',
    deliverables: ['Tokens', 'Component library', 'Docs', 'Adoption'],
  },
  {
    icon: Rocket,
    title: 'Prototyping',
    body: 'Fast, convincing prototypes for pitches and product bets, the ones that have to feel real before anyone commits budget.',
    deliverables: ['Concept', 'Working demo', 'Handover', 'Next steps'],
  },
];

/** Figures. Illustrative. */
export const VESPER_FACTS = [
  { value: 10, suffix: 'yr', label: 'Shipping to production' },
  { value: 42, suffix: '', label: 'Projects' },
  { value: 3, suffix: '', label: 'Conference talks' },
  { value: 60, suffix: 'fps', label: 'Non-negotiable' },
];

export const VESPER_CONTENT: TemplateContent = {
  brand: 'Vesper',

  nav: VESPER_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Front-end engineer · creative technologist',
    title: 'I build the web that',
    titleAccent: 'reacts back',
    subtitle:
      'A front-end engineer who treats the browser as a canvas: motion, 3D and interaction, shipped to production at sixty frames a second.',
    ctaPrimary: 'See the work',
    ctaSecondary: 'Book a call',
    stats: [
      { value: 10, suffix: 'yr', label: 'In production' },
      { value: 42, suffix: '', label: 'Projects' },
      { value: 60, suffix: 'fps', label: 'Non-negotiable' },
    ],
  },

  marquee: ['React', 'WebGL', 'Three.js', 'Rust/WASM', 'GSAP', 'Shaders', 'TypeScript', 'Motion'],

  about: {
    eyebrow: 'About',
    title: 'Engineer first, but the fun kind',
    body: [
      'I sit in the overlap where design hands off and engineering picks up, and I have spent ten years arguing that the handoff should not exist. The best interfaces are designed in code, by someone who can feel a dropped frame.',
      'That means I write the shaders and the state machine, I care about the bundle size and the easing curve equally, and I will not ship a thing that stutters on a mid-range phone just because it looks great on my laptop.',
    ],
    points: [
      'Design and engineering are one job, done in the browser',
      '60fps on a mid-range phone or it does not ship',
      'Motion that means something, never decoration',
      'Documented and handed over, so it outlives me',
    ],
  },

  services: {
    eyebrow: 'What I do',
    title: 'Four ways to work together',
    subtitle: 'Mostly contract and fractional-lead. I take a handful of projects a year so each one gets the whole of me.',
    items: VESPER_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'How I work',
    title: 'Prototype early, measure always',
    subtitle: 'The order matters. Building the risky part first is how you find out in week one, not week nine.',
    items: [
      { icon: MousePointer2, title: 'Prototype the risk', body: 'The scariest interaction gets built first, rough, so we learn whether it is even possible before the plan depends on it.' },
      { icon: Workflow, title: 'Design in code', body: 'No pixel-perfect mockup of a thing that moves. The design is the running build, reviewed in the browser.' },
      { icon: Gauge, title: 'Budget performance', body: 'A frame budget and a bundle budget from day one, checked on real hardware, not just the machine I built it on.' },
      { icon: Layers, title: 'Systematise', body: 'Once it works, it becomes components and tokens so the next feature is cheaper than this one was.' },
      { icon: GitBranch, title: 'Ship in slices', body: 'Behind flags, in small pieces, so the risky thing reaches real users before it is load-bearing.' },
      { icon: Cpu, title: 'Hand over', body: 'Docs, a walkthrough and a month of questions answered, because a clever build nobody understands is a liability.' },
    ],
  },

  faq: {
    eyebrow: 'Practical',
    title: 'The questions before a contract',
    items: [
      {
        question: 'What do you charge?',
        answer:
          'Day rate for contract work starts around €900, with a lower fractional-lead rate for longer engagements. Fixed-price only for tightly-scoped prototypes, because interactive work discovers its own requirements and an hourly ceiling protects us both. Tell me the budget and I’ll tell you honestly what fits inside it.',
      },
      {
        question: 'Do you work with existing teams?',
        answer:
          'Almost always. I’m usually the person brought in for the hard interactive piece a product team can’t staff for, and the goal is to leave the team able to maintain it. That means pairing, docs and a real handover, not a black box.',
      },
      {
        question: 'Can you really keep 3D at 60fps on a phone?',
        answer:
          'Often, not always, and I’ll tell you which before we start. Frame rate is a design constraint, not an afterthought. Sometimes it means fewer particles, sometimes a cleverer render loop, sometimes talking you out of the effect entirely. Honesty about it up front is part of the job.',
      },
      {
        question: 'Design, engineering, or both?',
        answer:
          'Both, which is the whole point. I can take a rough idea to a shipped, designed, performant interface without a handoff in the middle. If you have a strong design team already, I slot in as the engineer who speaks their language.',
      },
      {
        question: 'How soon can you start?',
        answer:
          'I book a project or two per quarter and I’m honest about the queue. Reach out with rough timing and I’ll tell you the real next opening rather than promise a date I’ll have to walk back.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell me the problem',
    subtitle:
      'What you’re building, when it needs to exist, and roughly the budget. All three, ideally. The third one saves us both a week of dancing around it.',
    fields: { name: 'Your name', email: 'Email', message: 'What are you building?' },
    submit: 'Send it',
    details: [
      { label: 'Work', value: 'hey@vesper.dev' },
      { label: 'Based', value: 'Amsterdam · remote' },
      { label: 'Code', value: 'github.com/vesper' },
      { label: 'Writing', value: 'vesper.dev/journal' },
    ],
  },

  footer: {
    tagline: 'Front-end engineer building the web that reacts back.',
    columns: [
      { title: 'Work', links: ['Projects', 'Stack', 'About', 'Writing', 'Contact'] },
      { title: 'Focus', links: ['WebGL', 'Motion', 'Design systems', 'Prototyping', 'Performance'] },
      { title: 'Elsewhere', links: ['GitHub', 'Read.cv', 'X', 'Newsletter', 'Résumé'] },
    ],
    legal: '© 2026 Vesper. Projects shown are illustrative.',
  },
};

export const VESPER_PROMPT = `Design a five-page portfolio website for a front-end engineer and creative technologist called Vesper.

Visual direction: dark and electric, but engineered rather than gaudy. An ink ground (#0a0a12) with subtle glassmorphism: frosted cards over a faint indigo-to-violet field. One violet→cyan accent gradient used for the mark, key words and interactive glows. A confident grotesque display face, a JetBrains Mono for labels and metrics. Depth from blur and translucency, not drop shadows.

Motion: anime.js v4, plus lightweight pointer handlers. The signatures are POINTER-DRIVEN rather than scroll-driven: a hero SPOTLIGHT, a soft radial glow that follows the cursor by writing CSS custom properties on pointermove; 3D-TILT project cards that rotate toward the pointer and spring back on leave; MAGNETIC buttons that ease toward the cursor within a small radius; and a thin SCROLL-PROGRESS bar pinned to the top. Reveal, stagger and count-up round it out.

Critical: pointer effects must be pure enhancement. The page is fully usable with a keyboard and on touch, and every effect is disabled under prefers-reduced-motion. Nothing pointer-driven may hide content, so all of it is safe to skip.

Pages: home, work, about, stack, contact. Work is six projects, each with role, year, a headline metric and the stack. Stack is grouped tools (languages, frameworks, graphics, platform).

Tone: an engineer who designs: precise, a little opinionated, honest about performance and cost.`;
