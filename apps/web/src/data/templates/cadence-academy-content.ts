import {
  Award,
  CalendarClock,
  ClipboardCheck,
  Compass,
  MessagesSquare,
  Repeat,
  Sparkles,
  Users,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * CADENCE - content for the online learning academy template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * CADENCE is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the catalogue, one course's curriculum, and the
 * mentor roster. Those extras are typed locally rather than pushed into
 * `types.ts`, because a course with a track and a cohort date is this
 * template's domain, not every template's.
 */

/** The pages the template can render. `home` is what an unknown id falls back to. */
export const CADENCE_PAGES = ['home', 'courses', 'course', 'mentors', 'contact'] as const;
export type CadencePageId = (typeof CADENCE_PAGES)[number];

/** The four disciplines the academy teaches. Also the catalogue's filter axis. */
export type CadenceTrack = 'Design' | 'Engineering' | 'Data' | 'Product';

/** How much prior work a course assumes. Printed as a chip on every card. */
export type CadenceLevel = 'Foundation' | 'Intermediate' | 'Advanced';

/**
 * Which CSS composition a course card draws in place of a photograph. The
 * template ships no image assets, so each course picks one of four gradient
 * "thumbnails" (see `cadence.css`) and a nine-card grid still reads as varied.
 */
export type CadenceThumb = 'a' | 'b' | 'c' | 'd';

export interface CadenceCourse {
  /** Stable key, also the filter/rendering identity. */
  id: string;
  title: string;
  track: CadenceTrack;
  level: CadenceLevel;
  /** Total taught hours across the cohort, live sessions included. */
  hours: number;
  /** Formatted for display - a template has no locale layer to format through. */
  price: string;
  /** Out of five, one decimal. Rendered with `toFixed(1)` so 5 reads as "5.0". */
  rating: number;
  /** How many people have finished it, for the rating's context. */
  graduates: number;
  /** Start date of the next cohort, written the way the academy writes it. */
  cohort: string;
  /** Share of the last three cohorts that finished. Drives the progress ring. */
  completion: number;
  thumb: CadenceThumb;
  summary: string;
}

/**
 * The catalogue. Nine courses, ordered as the academy lists them: the two it
 * runs most often first, because the home page features the opening three.
 */
export const CADENCE_COURSES: CadenceCourse[] = [
  {
    id: 'motion-for-interfaces',
    title: 'Motion for Interfaces',
    track: 'Design',
    level: 'Intermediate',
    hours: 24,
    price: '$340',
    rating: 4.8,
    graduates: 1240,
    cohort: 'Cohort starts 14 September',
    completion: 91,
    thumb: 'a',
    summary:
      'Six weeks on easing, choreography and restraint. You ship a motion spec for a real product surface and defend every duration in it.',
  },
  {
    id: 'typescript-at-scale',
    title: 'TypeScript at Scale',
    track: 'Engineering',
    level: 'Advanced',
    hours: 32,
    price: '$420',
    rating: 4.9,
    graduates: 980,
    cohort: 'Cohort starts 21 September',
    completion: 88,
    thumb: 'b',
    summary:
      'Generics, variance and the type-level patterns that keep a 400-file codebase honest. Built around refactoring an app that is already too loose.',
  },
  {
    id: 'design-systems-foundations',
    title: 'Design Systems Foundations',
    track: 'Design',
    level: 'Foundation',
    hours: 18,
    price: '$0',
    rating: 4.7,
    graduates: 3610,
    cohort: 'Open enrolment, start any Monday',
    completion: 74,
    thumb: 'c',
    summary:
      'Tokens, naming and the argument for a component before it exists. The free entry course, and the one most people take first.',
  },
  {
    id: 'analytics-without-a-team',
    title: 'Analytics Without a Data Team',
    track: 'Data',
    level: 'Foundation',
    hours: 16,
    price: '$220',
    rating: 4.6,
    graduates: 1470,
    cohort: 'Cohort starts 6 October',
    completion: 82,
    thumb: 'd',
    summary:
      'SQL you can hold in your head, one warehouse, and the four charts that answer most product questions. No dashboards nobody opens.',
  },
  {
    id: 'product-discovery-practice',
    title: 'Product Discovery in Practice',
    track: 'Product',
    level: 'Intermediate',
    hours: 20,
    price: '$300',
    rating: 4.8,
    graduates: 860,
    cohort: 'Cohort starts 28 September',
    completion: 86,
    thumb: 'b',
    summary:
      'Five weeks of running real interviews on a real bet, with a mentor reading your notes. You leave with a decision, not a research deck.',
  },
  {
    id: 'accessible-front-end',
    title: 'The Accessible Front End',
    track: 'Engineering',
    level: 'Intermediate',
    hours: 22,
    price: '$310',
    rating: 4.9,
    graduates: 1120,
    cohort: 'Cohort starts 12 October',
    completion: 93,
    thumb: 'a',
    summary:
      'Keyboard paths, focus order and the ARIA you actually need. Every exercise is audited against WCAG AA by a mentor who does it for a living.',
  },
  {
    id: 'experiment-design',
    title: 'Experiment Design and Read-Out',
    track: 'Data',
    level: 'Advanced',
    hours: 26,
    price: '$380',
    rating: 4.7,
    graduates: 540,
    cohort: 'Cohort starts 19 October',
    completion: 79,
    thumb: 'c',
    summary:
      'Power, guardrails and the discipline of calling a test flat. Taught by two people who have shut down their own favourite feature.',
  },
  {
    id: 'writing-for-products',
    title: 'Writing for Products',
    track: 'Design',
    level: 'Foundation',
    hours: 14,
    price: '$180',
    rating: 4.8,
    graduates: 2050,
    cohort: 'Open enrolment, start any Monday',
    completion: 84,
    thumb: 'd',
    summary:
      'Buttons, empty states and error copy. Short, practical, and marked line by line rather than graded on a rubric.',
  },
  {
    id: 'roadmaps-that-hold',
    title: 'Roadmaps That Hold',
    track: 'Product',
    level: 'Advanced',
    hours: 20,
    price: '$360',
    rating: 4.6,
    graduates: 470,
    cohort: 'Cohort starts 2 November',
    completion: 77,
    thumb: 'b',
    summary:
      'Sequencing, capacity and saying no in writing. You rebuild your own quarter and present it to three mentors who have run one.',
  },
];

/**
 * The course the `course` page renders. Authored rather than derived: the detail
 * page is a designed example, and its curriculum below is written for this one.
 */
export const CADENCE_COURSE_ID = 'motion-for-interfaces';

export interface CadenceModule {
  /** Printed as the accordion's leading numeral, so it is copy, not an index. */
  number: string;
  title: string;
  /** Taught length of the module, as the syllabus states it. */
  duration: string;
  lessons: number;
  body: string;
  /** What the module actually asks you to hand in. */
  outputs: string[];
}

/** The six modules of `motion-for-interfaces`, in teaching order. */
export const CADENCE_CURRICULUM: CadenceModule[] = [
  {
    number: '01',
    title: 'Why motion, and when to leave it out',
    duration: '3 hours',
    lessons: 4,
    body: 'The two jobs animation does in an interface - explaining a change of state and covering a wait - and the long list of jobs it does not do. We take apart three shipped products and mark every transition that earns its place.',
    outputs: ['A teardown of one product you use daily', 'A written rule for when your team animates'],
  },
  {
    number: '02',
    title: 'Easing, duration and the feel of a curve',
    duration: '5 hours',
    lessons: 6,
    body: 'Cubic beziers from the inside: what the four numbers do, why 200ms reads as instant and 600ms reads as slow, and how the same curve changes character at a different distance.',
    outputs: ['A personal easing set with the reasoning for each', 'Timed comparisons across three distances'],
  },
  {
    number: '03',
    title: 'Choreography across a screen',
    duration: '4 hours',
    lessons: 5,
    body: 'Stagger, shared elements and the order things arrive in. Most interfaces animate every element the same way at the same moment, which is why they feel busy rather than fast.',
    outputs: ['A staggered list entrance', 'A shared-element transition between two views'],
  },
  {
    number: '04',
    title: 'Motion that survives reduced motion',
    duration: '3 hours',
    lessons: 4,
    body: 'Building the reduced-motion variant first, so it is a designed state rather than an animation switched off. Vestibular triggers, what to keep, and what a fade should replace.',
    outputs: ['A reduced-motion pass over module three', 'Notes on which transitions carry meaning'],
  },
  {
    number: '05',
    title: 'Performance and the compositor',
    duration: '4 hours',
    lessons: 5,
    body: 'Transform and opacity, layer promotion, and reading a flame chart well enough to find the one animation dropping frames on a four-year-old phone.',
    outputs: ['A profiled before and after', 'A budget your team can hold to'],
  },
  {
    number: '06',
    title: 'The motion spec, and defending it',
    duration: '5 hours',
    lessons: 6,
    body: 'Writing motion down so an engineer can build it without asking: named curves, named durations, and a table of what maps to what. You present yours to two mentors and one other learner.',
    outputs: ['A motion spec for a real surface', 'A recorded fifteen-minute defence'],
  },
];

export interface CadenceMentor {
  name: string;
  /** The day job. Mentoring at Cadence is a second job, and we say so. */
  role: string;
  track: CadenceTrack;
  /** Years doing the work, not years teaching it. */
  years: number;
  bio: string;
}

/** The mentor roster, grouped in the order the tracks are listed. */
export const CADENCE_MENTORS: CadenceMentor[] = [
  {
    name: 'Noor Haddad',
    role: 'Principal designer, Kestrel Health',
    track: 'Design',
    years: 12,
    bio: 'Runs the motion and interaction practice for a clinical product used in 400 hospitals. Wrote the easing set that Motion for Interfaces is built around.',
  },
  {
    name: 'Tobias Lindgren',
    role: 'Staff engineer, Fathom Logistics',
    track: 'Engineering',
    years: 14,
    bio: 'Spent four years moving a 600,000-line JavaScript codebase to strict TypeScript without a rewrite. Teaches the parts that went badly as well as the parts that worked.',
  },
  {
    name: 'Amara Okonjo',
    role: 'Head of analytics, Brightline Retail',
    track: 'Data',
    years: 11,
    bio: 'Built a warehouse for a 90-store chain with a team of two. Reads every experiment write-out her learners submit and marks the ones that overclaim.',
  },
  {
    name: 'Dana Reyes-Whitlock',
    role: 'Group product manager, Orbit Payments',
    track: 'Product',
    years: 13,
    bio: 'Has killed three of her own features after discovery said so. Leads the discovery course and the Friday clinic where learners bring a decision they are stuck on.',
  },
  {
    name: 'Ivan Petrescu',
    role: 'Accessibility lead, Public Digital Service',
    track: 'Engineering',
    years: 9,
    bio: 'Audits government services against WCAG AA for a living. Every exercise in The Accessible Front End is marked with a screen reader, not a linter.',
  },
  {
    name: 'Mei-Lin Foster',
    role: 'Content design director, Halcyon Bank',
    track: 'Design',
    years: 10,
    bio: 'Rewrote a retail bank onboarding flow and cut its abandonment by a third. Marks writing line by line, which is slower and the reason people rate it highest.',
  },
];

/**
 * Filter chips for the catalogue. `all` is authored rather than derived so its
 * label is written copy like every other string the visitor reads.
 */
export const CADENCE_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'Design', label: 'Design' },
  { id: 'Engineering', label: 'Engineering' },
  { id: 'Data', label: 'Data' },
  { id: 'Product', label: 'Product' },
];

/** Labels for the metadata row every course card prints. */
export const CADENCE_METRICS = {
  hours: 'Hours',
  level: 'Level',
  rating: 'Rating',
  price: 'Price',
  graduates: 'graduates',
} as const;

/**
 * The three animated rings. Each is a completion figure the academy publishes,
 * and the ring is the figure drawn rather than a decoration beside it.
 */
export const CADENCE_RINGS: { value: number; label: string; caption: string }[] = [
  {
    value: 87,
    label: 'Finish what they start',
    caption: 'Across every cohort run in 2025, counted at the final submission rather than at the last login.',
  },
  {
    value: 94,
    label: 'Get feedback inside 48 hours',
    caption: 'Mentors mark on a rota, and a piece of work that waits longer than two days is escalated to the track lead.',
  },
  {
    value: 76,
    label: 'Take a second course',
    caption: 'Measured within a year of finishing the first one. It is the number we watch most closely.',
  },
];

/** Copy for the featured course block on the home page. */
export const CADENCE_FEATURED = {
  eyebrow: 'Starting soon',
  title: 'Three cohorts opening this autumn',
  subtitle:
    'Cadence runs around thirty cohorts a year and caps every one at twenty-four people, which is the largest group a mentor can read properly.',
  cta: 'See the full catalogue',
  ctaHref: '?page=courses',
} as const;

/** Masthead and controls for the catalogue page. */
export const CADENCE_COURSES_PAGE = {
  eyebrow: 'The catalogue',
  title: 'Nine courses, four tracks, one pace',
  subtitle:
    'Every course is taught live, capped at twenty-four, and marked by someone who does the work on weekdays. Pick a track to narrow the list.',
  filterLegend: 'Filter by track',
  filterGroup: 'Course tracks',
  resultsSuffix: 'courses shown',
  empty: 'Nothing in that track this term. Tell us what you were looking for and we will say whether it is coming.',
} as const;

/** Copy for the single-course page, beyond the course record itself. */
export const CADENCE_COURSE_PAGE = {
  eyebrow: 'Course detail',
  back: 'Back to the catalogue',
  backHref: '?page=courses',
  enrol: 'Reserve a place',
  enrolHref: '?page=contact',
  curriculumEyebrow: 'Curriculum',
  curriculumTitle: 'Six modules across six weeks',
  curriculumSubtitle:
    'Two live sessions a week, both recorded. Everything below is taught by Noor Haddad with a second mentor on marking.',
  outputsLabel: 'You hand in',
  lessonsSuffix: 'lessons',
  ringEyebrow: 'Track record',
  ringLabel: 'of the last three cohorts finished',
  certificateEyebrow: 'On completion',
  certificateTitle: 'A certificate with your spec attached',
  certificateBody:
    'Cadence issues a verifiable certificate that links to the motion spec you defended, so a hiring manager reads the work rather than the badge.',
  certificateMark: 'Verified',
  certificateCourse: 'Motion for Interfaces',
  certificateYear: '2026',
  mentorEyebrow: 'Taught by',
} as const;

/** Copy for the mentors page. */
export const CADENCE_MENTORS_PAGE = {
  eyebrow: 'The people marking your work',
  title: 'Forty-one mentors, all of them still doing the job',
  subtitle:
    'Cadence does not employ full-time instructors. Every mentor holds a working role on weekdays and takes at most two cohorts a term, which is what keeps the feedback specific.',
  yearsSuffix: 'years in the work',
  cta: 'Ask about a track',
  ctaHref: '?page=contact',
} as const;

/** Copy for the enrolment page, beyond the shared `contact` block. */
export const CADENCE_CONTACT_PAGE = {
  eyebrow: 'Enrolment',
  courseLabel: 'Which course',
  courseHint: 'Not sure yet is a fine answer',
  courseUndecided: 'Not sure yet',
  goalLabel: 'What you want to be able to do afterwards',
  sentTitle: 'Request received',
  sentBody:
    'Thank you. An advisor replies within one working day with the cohort dates, the payment options and an honest answer about whether the course fits.',
  note: 'Nothing is charged here. Payment is arranged after a short call, and places are held for five days.',
  detailsEyebrow: 'Other ways to reach us',
  officeHours: [
    {
      name: 'Enrolment desk',
      value: 'Monday to Friday, 9am to 7pm UK time. Same-day answers before 4pm.',
    },
    {
      name: 'Open clinic',
      value: 'Thursdays at 6pm UK time, thirty minutes, no booking. Bring a question about a track.',
    },
  ],
} as const;

/** Chrome that is not section copy: menu labels, skip link, card affordances. */
export const CADENCE_UI = {
  skipToContent: 'Skip to content',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  headerCta: 'Reserve a place',
  headerCtaHref: '?page=contact',
  viewCourse: 'Course detail',
  courseHref: '?page=course',
  ratingOf: 'out of 5',
  freePrice: 'Free',
} as const;

export const CADENCE_CONTENT: TemplateContent = {
  brand: 'Cadence',

  /*
   * Query hrefs, not anchors: the preview route reads `?page=` and hands it to
   * the template, so navigation works with no router and no link component. A
   * downloaded copy keeps working the same way.
   *
   * The `course` page is deliberately absent - it is a detail view reached from
   * a card, and a nav item for one course out of nine would be a lie.
   */
  nav: [
    { href: '?page=home', label: 'Home' },
    { href: '?page=courses', label: 'Courses' },
    { href: '?page=mentors', label: 'Mentors' },
    { href: '?page=contact', label: 'Enrol' },
  ],

  hero: {
    badge: 'Live cohorts, capped at twenty-four',
    title: 'Learn the thing',
    titleAccent: 'at the pace it takes',
    subtitle:
      'Cadence is an online academy for people already doing the work. Six-week cohorts, live sessions twice a week, and a mentor who reads what you hand in rather than a grade generated by a rubric.',
    ctaPrimary: 'Browse courses',
    ctaSecondary: 'Meet the mentors',
    stats: [
      { value: 12400, suffix: '+', label: 'Learners since 2019' },
      { value: 87, suffix: '%', label: 'Finish the cohort they start' },
      { value: 41, suffix: '', label: 'Mentors on the roster' },
    ],
  },

  marquee: [
    'Easing curves',
    'Type-level patterns',
    'Design tokens',
    'Warehouse modelling',
    'Discovery interviews',
    'Focus management',
    'Experiment power',
    'Product writing',
    'Roadmap sequencing',
  ],

  about: {
    eyebrow: 'About Cadence',
    title: 'Built by four people who kept teaching the same evening class',
    body: [
      'Cadence started in 2019 as a Tuesday evening session for eleven people in a borrowed room in Bristol. The same questions came up every week, the answers were the same every week, and none of the courses anyone could point to answered them in fewer than nine months.',
      'So the format got written down: six weeks, two live sessions, one mentor who does the job on weekdays, and a cap of twenty-four because that is the largest group whose work one person can actually read. Six years later the format has not moved. The catalogue has.',
    ],
    points: [
      'Cohorts capped at twenty-four, every time',
      'Work marked by a practitioner within two working days',
      'Every session recorded, so a missed week is not a lost week',
    ],
  },

  services: {
    eyebrow: 'How a cohort runs',
    title: 'Six weeks, and none of them passive',
    subtitle:
      'The shape is the same across all four tracks, which is why someone who has taken one Cadence course knows exactly what the second one will ask of them.',
    items: [
      {
        icon: CalendarClock,
        title: 'Two live sessions a week',
        body: 'Ninety minutes each, one teaching and one workshop, both recorded within the hour. Sessions run at 6pm UK time and again at 9am for the Pacific cohort.',
      },
      {
        icon: ClipboardCheck,
        title: 'Work marked by a person',
        body: 'Every submission gets written feedback from a mentor inside two working days. Not a score, not a checklist - notes on the specific thing you made.',
      },
      {
        icon: MessagesSquare,
        title: 'A group of twenty-four',
        body: 'Small enough that the mentor knows what you are building by week two, and that the person reviewing your work in week five has read your week-one notes.',
      },
      {
        icon: Repeat,
        title: 'A rerun if you need it',
        body: 'Miss more than two weeks and you can take the next cohort at no charge. Life happens mid-cohort more often than anyone plans for.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Cadence',
    title: 'What a capped cohort actually buys',
    subtitle:
      'We could run groups of two hundred and the recordings would be identical. These are the four things that would stop being true.',
    items: [
      {
        icon: Users,
        title: 'A mentor who knows your work',
        body: 'By week three your mentor can name the thing you keep doing. That is the difference between feedback and marking, and it does not survive a group of two hundred.',
      },
      {
        icon: Sparkles,
        title: 'Finishing, not enrolling',
        body: '87% of people who start a Cadence cohort finish it, counted at final submission. The industry figure for self-paced video courses sits closer to one in ten.',
      },
      {
        icon: Compass,
        title: 'An honest fit conversation',
        body: 'Advisors talk about half a dozen people a week out of a course. A refund six weeks later costs everyone more than a straight answer on the phone.',
      },
      {
        icon: Award,
        title: 'A certificate with work attached',
        body: 'Every certificate links to the artefact you defended. A hiring manager can read the spec, the profile or the write-out instead of trusting a badge.',
      },
    ],
  },

  faq: {
    eyebrow: 'Before you enrol',
    title: 'What people ask the advisors',
    items: [
      {
        question: 'How much time does a week actually take?',
        answer:
          'Three hours of live sessions and between three and five hours of work, depending on the course and how deep you go. People who try to fit it into under five hours a week tend to fall behind in week three, and we would rather say that now.',
      },
      {
        question: 'What happens if I miss a session?',
        answer:
          'Recordings go up within the hour and the workshop brief is written out, so a missed week is catchable. Miss more than two and we move you to the next cohort at no charge rather than let you finish half-present.',
      },
      {
        question: 'Do I need to be working in the field already?',
        answer:
          'For the Foundation courses, no. For Intermediate and Advanced, yes - they assume you have a real codebase, a real product or a real dataset to work on, because every exercise is applied to your own.',
      },
      {
        question: 'Is the certificate worth anything?',
        answer:
          'On its own, no certificate is. Ours links to the work you defended, which is the part that carries weight. We would rather you showed a hiring manager the spec than the badge.',
      },
      {
        question: 'Can my employer be invoiced?',
        answer:
          'Yes, and about two thirds are. We invoice in GBP, USD or EUR with 30-day terms, and the advisor will send a one-page summary written for a manager who has to approve it.',
      },
      {
        question: 'What if the course turns out to be wrong for me?',
        answer:
          'Full refund up to the end of week two, no argument and no form. After that we will move you to a different course instead, which is what most people actually want.',
      },
    ],
  },

  contact: {
    eyebrow: 'Reserve a place',
    title: 'Tell us what you want to be able to do',
    subtitle:
      'An advisor replies within one working day with cohort dates, an honest read on fit, and the option of a fifteen-minute call before anything is agreed. Nothing is charged on this page.',
    fields: {
      name: 'Your name',
      email: 'Email address',
      message: 'Anything we should know',
    },
    submit: 'Send request',
    details: [
      { label: 'Email', value: 'enrol@cadence.example' },
      { label: 'Telephone', value: '+44 117 496 0142' },
      { label: 'Studio', value: '12 Colston Yard, Bristol BS1 5BD' },
    ],
  },

  footer: {
    tagline: 'A small online academy running live, capped cohorts for people already doing the work.',
    columns: [
      {
        title: 'Learn',
        links: ['Course catalogue', 'Free foundation course', 'Cohort dates', 'Team enrolment'],
      },
      {
        title: 'Academy',
        links: ['Our mentors', 'How marking works', 'Certificates', 'Become a mentor'],
      },
      {
        title: 'Support',
        links: ['Enrolment questions', 'Refund policy', 'Accessibility statement', 'Open clinic'],
      },
    ],
    legal: '© 2026 Cadence Academy Ltd. Registered in England and Wales. All rights reserved.',
  },
};

/** The prompt a visitor copies to generate a site in this spirit. */
export const CADENCE_PROMPT = `Design a five-page website for an online learning academy called Cadence that runs live, capped cohorts.

Pages: home, courses, course detail, mentors, enrol. A shared header and footer wrap all five, each page opens with its own masthead, and the header nav marks the current page.

Art direction:
- Warm cream #fdfaf5 with deep aubergine #221033 ink, a vivid violet #7c3aed as the primary and a lime #a3e635 highlight. Exactly one inverted aubergine section, which carries the proof numbers.
- Friendly and energetic rather than corporate: a rounded geometric sans, display headlines scaling up to about 110px, big pill buttons, and very generous corner radii between 40px and 65px on cards and panels.
- Soft, wide shadows instead of borders. Lime is used for highlights and chips only, never as body text on cream, since it fails contrast there.
- No photography anywhere. Course thumbnails are layered CSS gradients in four variants, progress figures are conic-gradient rings, mentors are monogram discs, and the completion certificate is a CSS seal with a ribbon.

Sections: a hero with a badge, a two-part headline, two calls to action and three counters; a marquee of course topics; a founding story; a four-card "how a cohort runs" grid; an inverted section with three animated progress rings; a featured trio of courses; an accordion FAQ. The courses page is a nine-card grid filtered by track with pressed-state chips and a live result count. The course page carries a numbered curriculum accordion with durations, a track-record ring and a certificate. Mentors is a row of monogram discs with day jobs. Enrol is a front-end-only form with a course select and no payment fields.

Motion: everything eases on cubic-bezier(0.16, 1, 0.3, 1). Sections stagger in, counters count once, rings draw themselves, the marquee scrolls, and cards lift on hover. Under prefers-reduced-motion nothing animates and smooth scrolling is off.

Voice: warm but specific. Real course titles, real hours, real prices, real cohort dates, real completion rates, and no exclamation marks.`;
