import { CalendarHeart, Flame, Leaf, Soup, Sparkle, Wheat, Wine, Users } from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * SAFFRON - content for the fine-dining restaurant template.
 *
 * English, untranslated, and part of the artifact: a visitor downloads this
 * file and rewrites it into their own restaurant. Sections read from here and
 * hold no copy of their own.
 */
export const SAFFRON_CONTENT: TemplateContent = {
  brand: 'Saffron',

  nav: [
    { href: '#about', label: 'Our story' },
    { href: '#services', label: 'The menu' },
    { href: '#why', label: 'The room' },
    { href: '#faq', label: 'Visiting' },
  ],

  hero: {
    badge: 'Winter tasting menu, now serving',
    title: 'Twelve courses,',
    titleAccent: 'one long evening',
    subtitle:
      'A thirty-seat room in the old spice quarter, where the menu changes with the market and dinner is meant to take four hours. Reservations open on the first of each month.',
    ctaPrimary: 'Reserve a table',
    ctaSecondary: 'Read the menu',
    stats: [
      { value: 12, suffix: '', label: 'Courses' },
      { value: 30, suffix: '', label: 'Seats nightly' },
      { value: 9, suffix: 'yrs', label: 'On Bridge Street' },
    ],
  },

  marquee: [
    'Michelin Guide',
    'World’s 50 Best: Discovery',
    'Good Food Award',
    'Slow Food Alliance',
    'Terroir Prize',
    'Harvest Table',
  ],

  about: {
    eyebrow: 'Our story',
    title: 'A kitchen built around what the market has that morning',
    body: [
      'Saffron began in 2017 as a supper club in the back of a spice merchant’s shop, cooking for whoever turned up. The menu was whatever the growers on Bridge Street had left at closing, and it changed every night out of necessity rather than principle.',
      'Nine years later the room is our own and the principle stayed. Chef Amara Idowu writes the menu each morning after the market, so no two weeks taste the same and nothing travels further than the county line to reach the pass.',
    ],
    points: [
      'Menu rewritten daily, printed at four o’clock',
      'Every producer within sixty miles, named on the card',
      'Whole-animal butchery and a zero-waste larder',
    ],
  },

  services: {
    eyebrow: 'The menu',
    title: 'Four ways to spend an evening',
    subtitle:
      'Every seating is a set menu. Tell us about allergies when you book and the kitchen will write around them rather than remove a course.',
    items: [
      {
        icon: Soup,
        title: 'The tasting menu',
        body: 'Twelve courses across four hours, from the market that morning. £145 per guest, served to the whole table.',
      },
      {
        icon: Leaf,
        title: 'The garden menu',
        body: 'The same twelve courses, drawn entirely from the kitchen garden and our growers. Vegan on request, never an afterthought.',
      },
      {
        icon: Wine,
        title: 'Cellar pairing',
        body: 'Nine glasses chosen by our sommelier, weighted toward small growers and older vintages. £95, or £45 without alcohol.',
      },
      {
        icon: Users,
        title: 'The chef’s table',
        body: 'Six seats at the pass, cooked and explained by the team in front of you. Wednesdays and Thursdays only.',
      },
    ],
  },

  why: {
    eyebrow: 'The room',
    title: 'Why people come back',
    subtitle: 'Four things we decided early, and have not been talked out of since.',
    items: [
      {
        icon: Flame,
        title: 'One kitchen, one seating',
        body: 'Thirty guests, all seated within half an hour. Nobody is rushed for a second turn, because there is no second turn.',
      },
      {
        icon: Wheat,
        title: 'Growers on the card',
        body: 'Every producer is named beside the course they made possible. If it is not from within sixty miles, we tell you why.',
      },
      {
        icon: Sparkle,
        title: 'Service without theatre',
        body: 'Our team explains a dish when it helps and steps away when it does not. No scripts, no performance, no hovering.',
      },
      {
        icon: CalendarHeart,
        title: 'A table that keeps',
        body: 'Booked for something that matters? Tell us. Anniversaries, birthdays and first dates are written into the evening.',
      },
    ],
  },

  faq: {
    eyebrow: 'Visiting',
    title: 'Before you book',
    items: [
      {
        question: 'How far ahead should we reserve?',
        answer:
          'Reservations for the following month open at 9am on the first, and the weekends usually go the same day. Midweek tables are often available a fortnight out, and we hold six seats each night for walk-ins at the counter.',
      },
      {
        question: 'Can you cook around allergies and diets?',
        answer:
          'Yes, and gladly - tell us when you book rather than on the night. The kitchen rewrites courses around an allergy instead of removing them, so nobody at the table eats a shorter menu.',
      },
      {
        question: 'Is there a dress code?',
        answer:
          'None. Come as you would to a good friend’s dinner. The room is warm, so most guests leave a jacket at the door.',
      },
      {
        question: 'How long is dinner?',
        answer:
          'Between three and a half and four hours for the full menu. If you have a train or a sitter to relieve, say so when you arrive and we will pace the kitchen accordingly.',
      },
      {
        question: 'Do you take large groups?',
        answer:
          'Up to eight in the main room, and the whole restaurant for private dinners on Sundays and Mondays. Write to us and Amara will plan the menu with you.',
      },
    ],
  },

  contact: {
    eyebrow: 'Reservations',
    title: 'Come and eat with us',
    subtitle:
      'Send us the date and we will confirm within the day. For same-evening tables, please telephone the restaurant - the inbox moves slower than the room does.',
    fields: { name: 'Your name', email: 'Email address', message: 'Date, guests and anything we should know' },
    submit: 'Request a table',
    details: [
      { label: 'Address', value: '14 Bridge Street, Old Spice Quarter' },
      { label: 'Telephone', value: '+44 20 7946 0312' },
      { label: 'Dinner', value: 'Wednesday to Sunday, from 6pm' },
    ],
  },

  footer: {
    tagline: 'A thirty-seat kitchen on Bridge Street, cooking what the market brought that morning.',
    columns: [
      { title: 'The restaurant', links: ['Our story', 'The menu', 'The chef’s table', 'Private dining'] },
      { title: 'Visiting', links: ['Reservations', 'Opening hours', 'Getting here', 'Gift vouchers'] },
      { title: 'Follow', links: ['Instagram', 'Newsletter', 'Press', 'Careers'] },
    ],
    legal: '© 2026 Saffron. Bridge Street. All rights reserved.',
  },
};

/** The prompt a visitor copies to generate a page in this spirit. */
export const SAFFRON_PROMPT = `Design a single-page website for an intimate fine-dining restaurant called Saffron.

Art direction:
- Warm and editorial, the opposite of a tech page. Cream paper background (#faf6ee), deep forest-green ink (#16301f), and a burnt-saffron accent (#c2622a) used sparingly for rules, small caps and one button.
- Type does the work: a large serif display face for headings at tight tracking with generous line height, small-caps letterspaced serif for eyebrows, and a plain serif for body copy at a comfortable reading size.
- No photography. Compose plates and produce from layered CSS radial gradients inside circles, framed by thin rules - suggestive rather than literal.
- Lots of whitespace, thin 1px rules as section dividers, and asymmetric two-column layouts that let text breathe.

Sections in order: a header that starts transparent and turns to blurred cream on scroll, a hero with a small-caps eyebrow, a two-line serif headline, a paragraph, two calls to action and three understated figures; a quiet accolades strip; an about section pairing the story with a plated composition that parallaxes gently; a four-card menu; a numbered "why" list with oversized serif numerals; an accordion FAQ; a reservation form beside address and hours; and a footer with three link columns.

Motion: sections fade and rise as they enter view, the plated composition drifts on scroll parallax, a thin saffron rule draws itself under each section heading, and everything stills under prefers-reduced-motion.

Voice: warm, specific and understated. Real details - a street, a chef's name, prices, opening hours. No exclamation marks and no marketing adjectives.`;
