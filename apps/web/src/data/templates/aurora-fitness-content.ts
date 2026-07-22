import { Bike, Dumbbell, Gauge, HeartPulse, ShieldCheck, Timer, Trophy, Users } from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * AURORA - content for the strength studio template.
 *
 * The template's own copy, in English, deliberately untranslated: it is part of
 * the artifact a visitor downloads and rewrites (see `types.ts`). Sections read
 * from here and hold no strings of their own, so the gym's whole story - class
 * names, prices, hours, the head coach - is told in this one file.
 */
export const AURORA_CONTENT: TemplateContent = {
  brand: 'Aurora',

  nav: [
    { href: '#about', label: 'The Floor' },
    { href: '#services', label: 'Classes' },
    { href: '#why', label: 'Why Aurora' },
    { href: '#faq', label: 'FAQ' },
  ],

  hero: {
    badge: 'Intake for the 12-week Barbell Block closes Friday',
    title: 'Train like the',
    titleAccent: 'work is the point',
    subtitle:
      'A 6,400 sq ft strength floor in Leeds with 22 platforms, calibrated plates and coaches who write your programme by name. Doors open 05:30, last class racks at 21:00.',
    ctaPrimary: 'Claim a trial week',
    ctaSecondary: 'See the timetable',
    stats: [
      { value: 22, suffix: '', label: 'Lifting platforms' },
      { value: 61, suffix: '', label: 'Classes each week' },
      { value: 940, suffix: '+', label: 'Members on the floor' },
    ],
  },

  marquee: [
    'Barbell Club',
    'Engine Room',
    'Hyrox Prep',
    'Open Gym',
    'Sled Sundays',
    'Strongman 101',
    'Deload Mobility',
    'Bar Path Clinic',
  ],

  about: {
    eyebrow: 'The floor',
    title: 'A warehouse, twenty-two platforms and no mirrors worth posing in',
    body: [
      'Aurora opened in a disused printworks off Kirkstall Road in 2019 with four racks and one rule: every member gets a written programme with their name at the top. Six years on the racks number twenty-two and the rule has not moved.',
      'Head coach Dara Whitfield spent nine years in British Weightlifting pathway squads before building the Aurora syllabus. She still coaches the 06:00 Barbell Club three mornings a week, because a syllabus nobody tests is just a document.',
    ],
    points: [
      'Calibrated Eleiko plates on every competition platform',
      'Coach-to-lifter ratio capped at one to eight in class',
      'Free movement screen and lift audit before session one',
      'Chalk allowed, judged, and swept up at close',
    ],
  },

  services: {
    eyebrow: 'Classes',
    title: 'Six ways onto the floor',
    subtitle:
      'Every session is programmed in blocks, logged in the app and progressed against your last numbers. Book up to fourteen days ahead.',
    items: [
      {
        icon: Dumbbell,
        title: 'Barbell Club',
        body: 'Squat, press, pull. Twelve-week linear blocks with a tested max at the end. Mon, Wed, Fri at 06:00 and 18:30. Sixty minutes.',
      },
      {
        icon: HeartPulse,
        title: 'Engine Room',
        body: 'Rower, ski erg and assault bike intervals built around your lactate threshold, not a whiteboard guess. Tue and Thu, 45 minutes.',
      },
      {
        icon: Timer,
        title: 'Hyrox Prep',
        body: 'Sled push, burpee broad jump and wall ball under race pacing, run on the full 8-station circuit. Saturdays at 09:00, 90 minutes.',
      },
      {
        icon: Trophy,
        title: 'Strongman 101',
        body: 'Yoke, farmers, atlas stones and a log press taught from the floor up. Capped at eight lifters. Sundays at 11:00.',
      },
      {
        icon: Users,
        title: 'Open Gym',
        body: 'Full floor access from 05:30 to 22:00 with a coach on shift every hour we are open. Bring your own programme or run ours.',
      },
      {
        icon: Bike,
        title: 'Deload Mobility',
        body: 'Hips, thoracic spine and ankles, plus the breathing work that makes a heavy week survivable. Sundays at 17:00, 40 minutes.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Aurora',
    title: 'Four things we refuse to cut',
    subtitle: 'Decisions that cost us money every month and keep the floor worth training on.',
    items: [
      {
        icon: ShieldCheck,
        title: 'Coached, never supervised',
        body: 'Every coach holds a Level 3 strength qualification and re-certifies annually. Nobody counts reps at Aurora, they correct them.',
      },
      {
        icon: Gauge,
        title: 'Capped class sizes',
        body: 'Eight lifters per coach, sixteen per class, no exceptions when a session sells out. We open another slot instead of squeezing the room.',
      },
      {
        icon: Dumbbell,
        title: 'Kit that gets replaced',
        body: 'Bars are knurl-checked monthly and rotated out at eighteen months. Nothing on this floor is waiting for a budget cycle.',
      },
      {
        icon: Trophy,
        title: 'Numbers on the wall',
        body: 'Every tested max goes on the board with the date beside it. Members added 31 kg to their average total in their first year.',
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Before your first session',
    items: [
      {
        question: 'What does membership cost?',
        answer:
          'Full membership is £64 a month with unlimited classes and open gym. Off-peak, before 15:00 on weekdays, is £42. Students and NHS staff pay £48. No joining fee and one month rolling, cancel in the app.',
      },
      {
        question: 'I have never touched a barbell. Is this the wrong gym?',
        answer:
          'It is the right one. Barbell Club runs a separate Foundations lane for your first six weeks, coached from an empty 15 kg bar. About a third of the class is in it at any time.',
      },
      {
        question: 'What happens in the trial week?',
        answer:
          'You get a movement screen with a coach, unlimited classes for seven days and a written plan at the end of it whether or not you join. It costs nothing and there is no card on file.',
      },
      {
        question: 'When is the floor quietest?',
        answer:
          'Between 10:00 and 15:00 on weekdays you will usually have a platform to yourself. The 18:30 slot is the busiest hour of the week, so book that one ahead.',
      },
      {
        question: 'Can I freeze my membership?',
        answer:
          'Yes, up to three months a year at £8 a month, for injury, travel or anything else. Freezing keeps your programme history and your spot in the current block.',
      },
      {
        question: 'Is there parking and somewhere to shower?',
        answer:
          'Forty free spaces behind the building and secure racks for eighteen bikes. Six showers, towels included, and a drying room for anyone who cycled in through a Leeds winter.',
      },
    ],
  },

  contact: {
    eyebrow: 'Get on the floor',
    title: 'Book the trial week',
    subtitle:
      'Tell us what you are training for and we will put you with the coach who fits it. Dara reads every message and replies within a day.',
    fields: { name: 'Your name', email: 'Email address', message: 'What are you training for?' },
    submit: 'Send it',
    details: [
      { label: 'Email', value: 'floor@aurorastrength.example' },
      { label: 'Phone', value: '+44 113 496 0180' },
      { label: 'Address', value: 'Unit 7, The Printworks, Kirkstall Road, Leeds LS3 1LN' },
      { label: 'Hours', value: 'Mon to Fri 05:30-22:00, Sat and Sun 07:00-19:00' },
    ],
  },

  footer: {
    tagline: 'Strength coaching in Leeds since 2019. Twenty-two platforms, one written programme per member.',
    columns: [
      { title: 'Train', links: ['Barbell Club', 'Engine Room', 'Hyrox Prep', 'Open Gym'] },
      { title: 'Studio', links: ['Coaches', 'Timetable', 'Membership', 'Careers'] },
      { title: 'Info', links: ['Trial week', 'House rules', 'Accessibility', 'Contact'] },
    ],
    legal: '© 2026 Aurora Strength Lab Ltd. Company 11840237, registered in England.',
  },
};

/** The prompt a visitor copies to generate a page in this spirit. */
export const AURORA_PROMPT = `Design a single-page website for a strength and conditioning gym called Aurora.

Art direction:
- Near-black background (#0a0a0b) with a single acid-lime accent (#d7ff3e). No third colour, no gradients behind text.
- Heavy condensed uppercase display type for every heading, tracking around -0.02em, headlines running to 8-10rem on desktop. Body copy in a plain grotesque at a comfortable size.
- Hard edges everywhere: zero border radius, 2px solid borders, cards that read as crates rather than glass. Diagonal hatched fills and skewed strips carry the kinetic energy.
- Numbers are the ornament: oversized stat figures, two-digit indices on every card, tested maxima treated as headlines.

Sections in order: sticky header with a boxed wordmark and anchor nav, hero with an eyebrow tag, a two-line condensed headline, subtext, two CTAs and three counting stats, a skewed acid marquee of class names, an about split with a story and a checklist beside a hatched panel, a six-card class grid, a "why us" list with giant indices, an accordion FAQ, a contact form beside studio details, and a footer with an oversized wordmark and three link columns.

Motion: the marquee scrolls continuously, sections fade and rise as they enter view, stat figures count up once, cards scale up slightly and flip to acid on hover, and all of it stands down under prefers-reduced-motion.

Voice: blunt, physical, specific. Real class times, real prices, a named head coach, no exclamation marks.`;
