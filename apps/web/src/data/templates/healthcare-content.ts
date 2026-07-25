import {
  Activity,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  Clock,
  Eye,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Video,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * ASTER - content for a clean, trustworthy healthcare & medical website.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * Seven pages, routed by `?page=`. The identity is calm and human-centred: a
 * white ground, a trustworthy blue with a fresh teal accent, soft rounded cards
 * and generous space. Doctors, departments and figures are ILLUSTRATIVE (a
 * template ships no photography, so portraits are soft plates).
 */

export const ASTER_PAGES = ['home', 'doctors', 'departments', 'appointments', 'blog', 'about', 'contact'] as const;
export type AsterPageId = (typeof ASTER_PAGES)[number];

export const ASTER_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Book appointment',
  emergency: '24/7 Emergency: (800) 555 0199',
} as const;

export const ASTER_NAV: { id: AsterPageId; label: string }[] = [
  { id: 'departments', label: 'Departments' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'blog', label: 'Health blog' },
  { id: 'about', label: 'About' },
];

export const ASTER_PAGE_META: { id: AsterPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  ...ASTER_NAV,
  { id: 'contact', label: 'Contact' },
];

export interface AsterMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const ASTER_MASTHEADS: Record<Exclude<AsterPageId, 'home'>, AsterMasthead> = {
  doctors: {
    eyebrow: 'Our doctors',
    title: 'Specialists who listen first.',
    subtitle: 'Board-certified physicians across every major specialty, here for the whole of your care, not just the appointment.',
  },
  departments: {
    eyebrow: 'Departments',
    title: 'Every specialty, under one calm roof.',
    subtitle: 'From cardiology to paediatrics, coordinated care that talks to itself so you never have to repeat your story.',
  },
  appointments: {
    eyebrow: 'Appointments',
    title: 'Booking care should be the easy part.',
    subtitle: 'Book online in under a minute, in person or by video. Same-week slots for most specialties.',
  },
  blog: {
    eyebrow: 'Health blog',
    title: 'Advice you can actually trust.',
    subtitle: 'Practical, plain-language health writing, reviewed by our clinicians.',
  },
  about: {
    eyebrow: 'About Aster',
    title: 'A hospital that feels human.',
    subtitle: 'Twenty-five years of putting the person before the procedure, with the technology to back it up.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'We are here when you need us.',
    subtitle: 'Reception is open around the clock. For emergencies, call the line at the top of the page.',
  },
};

export const ASTER_DEPARTMENTS: { icon: typeof HeartPulse; title: string; body: string }[] = [
  { icon: HeartPulse, title: 'Cardiology', body: 'Heart health, from prevention and screening to advanced intervention.' },
  { icon: Brain, title: 'Neurology', body: 'Brain, spine and nerve care, with imaging and rehabilitation in-house.' },
  { icon: Baby, title: 'Paediatrics', body: 'Gentle, unhurried care for children, from newborns to teens.' },
  { icon: Bone, title: 'Orthopaedics', body: 'Bones and joints, from sports injuries to joint replacement.' },
  { icon: Eye, title: 'Ophthalmology', body: 'Eye health and vision, with same-day diagnostics and surgery.' },
  { icon: Stethoscope, title: 'General medicine', body: 'Your first stop and your steady constant, coordinating everything else.' },
];

export interface AsterDoctor {
  name: string;
  specialty: string;
  plate: string;
}

export const ASTER_DOCTORS: AsterDoctor[] = [
  { name: 'Dr. Amara Okafor', specialty: 'Cardiology', plate: 'as-plate-a' },
  { name: 'Dr. Liam Berg', specialty: 'Neurology', plate: 'as-plate-b' },
  { name: 'Dr. Priya Nair', specialty: 'Paediatrics', plate: 'as-plate-c' },
  { name: 'Dr. Marco Ferri', specialty: 'Orthopaedics', plate: 'as-plate-a' },
];

export const ASTER_STEPS: { icon: typeof HeartPulse; title: string; body: string }[] = [
  { icon: CalendarCheck, title: 'Book', body: 'Choose a specialty and a time online, or call reception. Under a minute, no account needed.' },
  { icon: UserRound, title: 'See a specialist', body: 'In person or by video, with your history already to hand so you never repeat yourself.' },
  { icon: HeartPulse, title: 'Ongoing care', body: 'One coordinated plan across every department, followed up so nothing falls between the cracks.' },
];

export const ASTER_STATS = [
  { value: 25, suffix: '', label: 'Years of care' },
  { value: 120, suffix: '+', label: 'Specialists' },
  { value: 98, suffix: '%', label: 'Would recommend' },
  { value: 40, suffix: 'K', label: 'Patients a year' },
];

export const ASTER_TESTIMONIALS: { quote: string; author: string; role: string }[] = [
  { quote: 'They explained everything in plain words and never made me feel rushed. I have not felt that cared for in years.', author: 'Rosa M.', role: 'Cardiology patient' },
  { quote: 'Booked online on a Sunday, seen on Tuesday. My whole family goes here now.', author: 'The Andersen family', role: 'Paediatrics' },
  { quote: 'One team, one plan, and everyone actually talked to each other. That is rarer than it should be.', author: 'David P.', role: 'Orthopaedics patient' },
];

export interface AsterPost {
  title: string;
  tag: string;
  date: string;
  excerpt: string;
  plate: string;
}

export const ASTER_POSTS: AsterPost[] = [
  { title: 'Five heart-healthy habits that actually stick', tag: 'Cardiology', date: 'Jul 2026', excerpt: 'Small, boring, repeatable. The changes that lower your risk are rarely the dramatic ones.', plate: 'as-plate-b' },
  { title: 'When a headache is worth a second look', tag: 'Neurology', date: 'Jun 2026', excerpt: 'Most headaches are nothing. Here is how to tell the few that are worth a call.', plate: 'as-plate-c' },
  { title: 'A calmer first visit for anxious kids', tag: 'Paediatrics', date: 'May 2026', excerpt: 'What we do, and what you can do at home, to make the clinic feel safe.', plate: 'as-plate-a' },
];

export const ASTER_CONTENT: TemplateContent = {
  brand: 'Aster',

  nav: ASTER_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Now accepting new patients',
    title: 'Expert care,',
    titleAccent: 'delivered with warmth.',
    subtitle:
      'A modern hospital that puts the person before the procedure. Board-certified specialists, same-week appointments, and one team that coordinates the whole of your care.',
    ctaPrimary: 'Book appointment',
    ctaSecondary: 'Find a doctor',
    stats: [
      { value: 25, suffix: '', label: 'Years' },
      { value: 120, suffix: '+', label: 'Specialists' },
      { value: 98, suffix: '%', label: 'Recommend' },
    ],
  },

  marquee: ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealth', 'Humana', 'Medicare', 'Kaiser'],

  about: {
    eyebrow: 'About Aster',
    title: 'A hospital that feels human.',
    body: [
      'For twenty-five years, Aster has believed that good medicine begins with being listened to. We pair board-certified specialists with the time and technology to do the job properly.',
      'Care here is coordinated by design: your cardiologist, your GP and your physio share one record and one plan, so you never have to be the messenger between them.',
    ],
    points: [
      'One shared record across every department',
      'Same-week appointments for most specialties',
      'In person or by secure video visit',
      'Most major insurance accepted',
    ],
  },

  services: {
    eyebrow: 'Departments',
    title: 'Every specialty, under one calm roof.',
    subtitle: 'Coordinated care that talks to itself, so your treatment is one conversation, not a dozen disconnected ones.',
    items: ASTER_DEPARTMENTS.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'Why Aster',
    title: 'Care you can feel good about.',
    subtitle: 'The things that turn a hospital visit from an ordeal into something you can trust.',
    items: [
      { icon: Clock, title: '24/7 emergency', body: 'A full emergency department and a nurse on the phone at any hour, every day.' },
      { icon: ShieldCheck, title: 'Board-certified', body: 'Every physician is certified and audited. Your care is in genuinely expert hands.' },
      { icon: Video, title: 'Video visits', body: 'See a specialist from home for follow-ups and advice, on your schedule.' },
      { icon: Activity, title: 'Modern facilities', body: 'On-site imaging, labs and surgery, so your care rarely has to leave the building.' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Good to know.',
    items: [
      { question: 'How quickly can I be seen?', answer: 'Most specialties have same-week appointments, and urgent cases are seen the same day. The emergency department is open around the clock.' },
      { question: 'Do you take my insurance?', answer: 'We accept most major insurers and offer transparent self-pay pricing. Reception will confirm your cover before any appointment.' },
      { question: 'Can I see a doctor by video?', answer: 'Yes. Follow-ups, advice and many first consultations can be done by secure video visit, with the same doctor you would see in person.' },
      { question: 'Is my record shared between departments?', answer: 'Within Aster, yes, so your team is always on the same page. Nothing is shared outside the hospital without your explicit consent.' },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'We are here when you need us.',
    subtitle: 'Reception is open around the clock. For emergencies, call the line at the top of the page.',
    fields: { name: 'Your name', email: 'Email', message: 'How can we help?' },
    submit: 'Request a call back',
    details: [
      { label: 'Reception', value: '(800) 555 0180' },
      { label: 'Emergency', value: '(800) 555 0199, 24/7' },
      { label: 'Address', value: '900 Wellness Way, Riverside' },
      { label: 'Hours', value: 'Clinics 8am to 8pm, ED always' },
    ],
  },

  footer: {
    tagline: 'A modern hospital that puts the person before the procedure. Care, coordinated.',
    columns: [
      { title: 'Care', links: ['Departments', 'Doctors', 'Appointments', 'Emergency', 'Video visits'] },
      { title: 'Hospital', links: ['About', 'Health blog', 'Careers', 'Contact'] },
      { title: 'Patients', links: ['Insurance', 'Pricing', 'Records', 'Patient portal'] },
    ],
    legal: '© 2026 Aster Health. A template. Doctors, departments and figures are illustrative.',
  },
};

export const ASTER_PROMPT = `Design a seven-page website (Home, Doctors, Departments, Appointments, Health Blog, About, Contact) for a modern hospital called Aster, in a clean, trustworthy, human-centred style.

Visual direction: calm and reassuring. A white ground, a trustworthy blue (#1f7ae0) with a fresh teal accent (#16b8a6), soft rounded cards, gentle shadows and generous whitespace. A clean sans throughout, friendly rather than clinical. Portraits and imagery are stood in by soft blue/teal plates (a template ships no photography).

Motion: Anime.js for gentle scroll reveals, staggered headlines and count-up figures; a soft PULSE on the primary accent (a heartbeat, calmed for reduced motion); a floating appointment card beside the hero; hover-lift on cards; an accreditation logo marquee; Lenis smooth scroll. Everything degrades under prefers-reduced-motion.

Sections (Home): a header with an emergency line and a Book-appointment CTA; a warm hero with a headline whose second line is the teal accent, subtitle, two CTAs, trust stats and a floating "next available appointment" card; an accreditation marquee; a human "about the hospital" band; a departments grid with icons; a why-choose-us row; featured doctors as soft cards; a three-step "how it works"; discreet numbers; patient voices; a health-blog teaser; an FAQ; a closing invitation; a footer. Inner pages open with a masthead and recompose the shared sections.

Tone: warm, plain-spoken, expert. Puts the person before the procedure.`;
