import {
  Accessibility,
  Baby,
  CalendarCheck,
  Clock3,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Wallet,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * PULSE - content for the dental and health clinic template.
 *
 * The template's own copy, in English, deliberately untranslated: it is part of
 * the artifact a visitor downloads and rewrites (see `types.ts`). Sections read
 * from here and hold no strings of their own, so a clinic re-branding this
 * template edits exactly one file.
 *
 * The voice is the point of the design: calm, concrete and free of sales
 * punctuation. Every number, price band and opening hour reads like something a
 * real practice would put on its door.
 */
export const PULSE_CONTENT: TemplateContent = {
  brand: 'Pulse',

  nav: [
    { href: '#about', label: 'The practice' },
    { href: '#services', label: 'Treatments' },
    { href: '#why', label: 'Why Pulse' },
    { href: '#faq', label: 'Questions' },
  ],

  hero: {
    badge: 'Accepting new NHS and private patients',
    title: 'Dentistry that feels',
    titleAccent: 'calm from the first visit',
    subtitle:
      'Pulse is a family dental and health practice in Bristol. Longer appointments, prices written down before we start, and a team that explains every option in plain words.',
    ctaPrimary: 'Book an appointment',
    ctaSecondary: 'See treatment prices',
    stats: [
      { value: 14, suffix: ' yrs', label: 'Caring for Clifton' },
      { value: 26, suffix: 'k', label: 'Appointments kept' },
      { value: 98, suffix: '%', label: 'Would recommend us' },
    ],
  },

  marquee: [
    'Denplan',
    'Bupa Dental',
    'AXA Health',
    'Vitality',
    'Simplyhealth',
    'CQC registered',
    'GDC registered',
    'Invisalign provider',
  ],

  about: {
    eyebrow: 'The practice',
    title: 'A small team, a long list of people we have known for years',
    body: [
      'Dr Amara Whitfield opened Pulse in 2012 after a decade in hospital oral surgery, with one rule that has not changed: nobody leaves a chair without understanding what was found, what it costs and what happens if they wait.',
      'Six clinicians now work from four surgeries on Lindfield Row. We book thirty-minute check-ups rather than fifteen, keep two emergency slots free every weekday morning, and see children under 18 free of charge when a parent is registered.',
    ],
    points: [
      'Dr Amara Whitfield BDS, MFDS RCS - GDC 84102',
      'Four surgeries, all on the ground floor',
      'Written treatment plan before any work begins',
      'Interest-free payment plans over 10 months',
    ],
  },

  services: {
    eyebrow: 'Treatments',
    title: 'Everything a family needs, under one roof',
    subtitle:
      'Routine care, cosmetic work and urgent appointments are handled by the same team, so your notes and X-rays never have to travel.',
    items: [
      {
        icon: Stethoscope,
        title: 'Check-ups and hygiene',
        body: 'A thirty-minute exam with oral cancer screening, digital X-rays when they are due, and a hygienist appointment in the same visit where we can. From £48.',
      },
      {
        icon: Smile,
        title: 'Invisalign and braces',
        body: 'A digital scan instead of putty, a preview of the finished smile before you commit, and refinements included. Most adult cases finish in 6 to 11 months.',
      },
      {
        icon: Sparkles,
        title: 'Whitening and bonding',
        body: 'Take-home whitening trays made from your own scan, and composite bonding to close small gaps or repair chipped edges in a single appointment.',
      },
      {
        icon: ShieldCheck,
        title: 'Implants and crowns',
        body: 'Single implants, bridges and same-week emergency crowns, planned with a 3D scan and placed by Dr Whitfield. Ten-year guarantee with regular maintenance.',
      },
      {
        icon: CalendarCheck,
        title: 'Same-day emergencies',
        body: 'Two slots held every weekday at 08:30 and 14:00 for pain, swelling or a broken tooth. Registered patients are seen the same day, others within 48 hours.',
      },
      {
        icon: Baby,
        title: 'Children and teens',
        body: 'Free care for under-18s when a parent is registered, fluoride varnish from age three, and first visits booked as a look-around with nothing done.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Pulse',
    title: 'Four things patients tell us they were looking for',
    subtitle:
      'None of them are clever. They are simply the parts of dental care that are usually left vague, written down instead.',
    items: [
      {
        icon: Wallet,
        title: 'Prices before treatment',
        body: 'Every plan is itemised and signed before we pick up an instrument. If a filling turns out to need a crown, we stop and ask rather than adding it to the bill.',
      },
      {
        icon: Clock3,
        title: 'Appointments that run on time',
        body: 'We hold buffer time in every list, so the average wait past your appointment time last year was four minutes. If we run late, reception tells you before you leave home.',
      },
      {
        icon: HeartHandshake,
        title: 'Support for dental anxiety',
        body: 'Longer first visits with nothing done, hand signals agreed in advance, and IV sedation with a qualified anaesthetist for treatment that cannot wait.',
      },
      {
        icon: Accessibility,
        title: 'Step-free and unhurried',
        body: 'All four surgeries are on the ground floor with a level entrance, a hearing loop at reception, and quiet early-morning slots for anyone who needs them.',
      },
    ],
  },

  faq: {
    eyebrow: 'Common questions',
    title: 'What people ask before they register',
    items: [
      {
        question: 'Are you taking NHS patients?',
        answer:
          'Yes, for children and for adults on the Bristol NHS waiting list, which currently runs at about eleven weeks. Private appointments are usually available within a week, and both are seen by the same clinicians.',
      },
      {
        question: 'Which insurers do you work with?',
        answer:
          'We are recognised by Denplan, Bupa Dental, AXA Health, Vitality and Simplyhealth. Reception submits the claim for you and takes only the excess on the day.',
      },
      {
        question: 'What does a first appointment involve?',
        answer:
          'A full examination, a soft-tissue and oral cancer screening, X-rays if you are due them, and a written plan emailed the same afternoon. It takes about forty minutes and costs £48.',
      },
      {
        question: 'Can I pay for treatment monthly?',
        answer:
          'Any plan over £400 can be split across ten months with no interest, arranged in the practice with no credit application for existing patients.',
      },
      {
        question: 'What happens if I have pain at the weekend?',
        answer:
          'Call the practice number and the answerphone gives you the on-call clinician. Saturday morning surgery runs from 09:00 to 13:00, and outside those hours we arrange care through the Bristol out-of-hours service.',
      },
      {
        question: 'Is there parking nearby?',
        answer:
          'Two accessible bays sit directly outside the door on Lindfield Row, and the Berkeley Place car park is a three-minute walk. Clifton Down station is ten minutes on foot.',
      },
    ],
  },

  contact: {
    eyebrow: 'Book a visit',
    title: 'Tell us what is bothering you and we will find a time',
    subtitle:
      'Reception reads every message the same working day. For pain or swelling, please call instead so we can hold one of the morning emergency slots for you.',
    fields: { name: 'Your name', email: 'Email address', message: 'How can we help' },
    submit: 'Request an appointment',
    details: [
      { label: 'Phone', value: '0117 496 0182' },
      { label: 'Email', value: 'reception@pulsedental.example' },
      { label: 'Practice', value: '14 Lindfield Row, Clifton, Bristol BS8 2QT' },
      { label: 'Weekdays', value: 'Monday to Friday, 08:00 - 18:30' },
      { label: 'Saturday', value: '09:00 - 13:00, emergencies only' },
    ],
  },

  footer: {
    tagline: 'A calm dental and health practice in Clifton, Bristol, looking after families since 2012.',
    columns: [
      {
        title: 'Treatments',
        links: ['Check-ups and hygiene', 'Invisalign and braces', 'Implants and crowns', 'Emergency care'],
      },
      { title: 'Practice', links: ['Our team', 'Fees and payment plans', 'New patients', 'Careers'] },
      { title: 'Patient info', links: ['Complaints policy', 'Privacy notice', 'CQC report', 'Accessibility'] },
    ],
    legal: '© 2026 Pulse Dental & Health Ltd. Registered in England 08214467.',
  },
};

/** The prompt a visitor copies to generate a page in this spirit. */
export const PULSE_PROMPT = `Design a single-page website for a family dental and health clinic called Pulse.

Art direction:
- Soft white (#ffffff) page on pale blue-grey surfaces (#f2f6fc), never dark. Two large blurred gradient orbs float slowly behind the hero.
- Trustworthy medical blue #2563eb as the primary accent, mint #10b981 as the secondary, used for checkmarks, small badges and one hover state.
- Very rounded geometry: 24px cards, fully pill-shaped buttons, pill nav items and pill form fields. Soft, wide, low-opacity shadows instead of borders wherever possible.
- Type: a friendly humanist sans throughout, generous line height, headings at -0.02em tracking, eyebrows in small semibold blue rather than uppercase mono.
- Lots of air: 8rem section padding, wide gutters, short measure on body copy.

Sections in order: a translucent sticky header with a pill nav and a pill booking button, a hero split between the headline and a floating practice-details card, a soft band of insurer names, an about section pairing the practice story with a checklist, a three-column treatment grid, a four-card reasons grid, an accordion FAQ, a booking form beside opening hours, and a footer with three link columns.

Motion: sections rise 18px and fade as they enter view, the hero counters count up once, the orbs drift on a 14-second loop, cards lift 4px on hover, and every animation stops under prefers-reduced-motion.

Voice: reassuring and specific. Real treatment names, real prices, real opening hours, no exclamation marks and no marketing superlatives.`;
