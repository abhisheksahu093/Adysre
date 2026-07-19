import type { ComponentContentMap } from '../types';

/** English prose for the about category. Keys are component slugs. */
export const aboutContent: ComponentContentMap = {
  'about-story': {
    title: 'About Story',
    description: 'Founding narrative beside a portrait, with a founding-year callout.',
    customization:
      'The narrative is one string per paragraph rendered as real `<p>` elements - never one blob split by `<br>`, which gives a screen reader nothing to jump between and a translator no units that make sense. `max-w-prose` holds the measure even as the column widens, which is why the portrait takes the 5fr side of a 7fr/5fr split rather than half the page. The founding-year callout is an `<aside>` because it is genuinely tangential to the prose beside it, and it wears a left rule rather than a card so it stays a note instead of being promoted into a competing block. The portrait\'s `alt` is empty on purpose: the caption underneath names the founders, and filling both in makes a screen reader say the names twice in a row.',
    seoTitle: 'About Story Section - Free Tailwind CSS Component',
    seoDescription:
      'A founding-story section with portrait and year callout, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['about story', 'company story', 'about section', 'founding story'],
  },
  'about-team-grid': {
    title: 'About Team Grid',
    description: 'Avatar cards with name, role, short bio and social links.',
    customization:
      'The social links compose their accessible name from the person: "Priya Raman on LinkedIn", not "LinkedIn". Twelve people otherwise announce as twelve identical LinkedIn/GitHub pairs, and the links dialog every screen reader offers becomes worthless. Avatars carry `alt=""` because the heading beneath is the name - put it in both and it is announced twice, back to back. Roles are `<p>`, not `<h4>`: a job title is not a section of the document, and promoting it puts one phantom entry per person in the outline. The avatar is a fixed square plus `object-fit: cover`, so a portrait and a landscape headshot both land as the same circle instead of one squashing; the 36px social target stays put even though the glyph inside is 18px.',
    seoTitle: 'Team Grid with Avatars - Free React Component',
    seoDescription:
      'An accessible team grid with avatars, roles and per-person labelled social links. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['team grid', 'team section', 'avatar cards', 'about team', 'meet the team'],
  },
  'about-stats': {
    title: 'About Stats',
    description: 'Four big metrics with their labels, marked up as a definition list.',
    customization:
      'A `<dl>`, because each metric is a value and the term that names it. As plain divs, "12" and "People" are two unrelated strings, and eight of them in a row give a screen reader no clue which label owns which number. `flex-col-reverse` is what lets the value paint above its label while the DOM keeps `dt` before `dd` - so it still reads aloud as "People, 12". Values are pre-formatted strings ("94%", "£4.2m"); localising currency and percent belongs to the page, not here. Two columns on a phone and four from `sm`: four big numbers across a 390px screen are about 80px each, which is where a stats band stops being legible and starts being a texture.',
    seoTitle: 'About Stats Section - Free Tailwind CSS Component',
    seoDescription:
      'A four-metric stats band built on a semantic definition list, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['stats section', 'metrics band', 'company stats', 'numbers section'],
  },
  'about-timeline': {
    title: 'About Timeline',
    description: 'Dated milestones running down a rail, oldest first.',
    customization:
      'Each date is a `<time dateTime="2019-04">` with the machine-readable value and the human label kept as separate strings - so "April 2019" can be translated, or rewritten as "Spring 2019", without the date it encodes changing underneath it. An `<ol>`, because a history is a sequence: it announces "1 of 5" even though the rail that shows it is decoration a screen reader cannot see. The rail is a `::before` and the node an `::after`, both on the item itself, so neither can drift from the list; `last:before:hidden` ends the rail at the final milestone rather than trailing it into empty space. On a dark surface the hairline rail lifts to `gray-700` or it simply disappears.',
    seoTitle: 'Company Timeline Section - Free React Component',
    seoDescription:
      'A milestone timeline with a connector rail and semantic time elements, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['timeline', 'milestones', 'company history', 'about timeline', 'vertical timeline'],
  },
  'about-values': {
    title: 'About Values',
    description: 'Value cards pairing an icon with a principle and the copy that explains it.',
    customization:
      'The principle is the heading and the copy explains it - not the other way round. A values section headed "Value 01" with the principle buried in the paragraph gives the outline a list of numbers and gives anyone skimming headings nothing at all. Icons are `aria-hidden`: a lightbulb beside "Say the hard thing early" is decoration, and "image, lightbulb" before every principle is noise between the reader and the point. The cards are tinted panels rather than bordered boxes, because values are prose and four hairlines around four paragraphs impose a structure the content does not have. Note the tint inverts in dark mode - lighter than the page, where on light it was darker.',
    seoTitle: 'Company Values Cards - Free Tailwind CSS Component',
    seoDescription:
      'Value cards with icons and principles as headings, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['values section', 'company values', 'principles cards', 'about values'],
  },
  'about-mission-vision': {
    title: 'About Mission & Vision',
    description: 'Two panels - mission and vision - each with an icon, overline and copy.',
    customization:
      'The panels sit two-up from `md` and stack cleanly below it, so nothing overflows a 320px phone. Icons are `aria-hidden` because the overline beneath already names each panel; pass any inline SVG as the `icon` prop, or omit it and the badge is skipped.',
    seoTitle: 'Mission & Vision Section - Free Tailwind CSS Component',
    seoDescription:
      'A two-panel mission and vision section in Tailwind, React and TypeScript. Responsive, dark-mode and MIT licensed.',
    keywords: ['mission vision', 'purpose section', 'about mission', 'company vision'],
  },
  'about-image-story': {
    title: 'About Image Story',
    description: 'Founding copy beside a CSS-gradient media panel - no image asset to load.',
    customization:
      'The visual is a pure CSS gradient with a decorative monogram, so there is no asset to download and it fills the panel at any width; swap `panelClassName` for your own gradient utilities. The two columns stack below `md`, and `max-w-prose` holds the text measure as the column widens.',
    seoTitle: 'Image Story Section - Free Tailwind CSS Component',
    seoDescription:
      'A two-column about section pairing prose with a CSS-gradient panel, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['about story', 'gradient panel', 'two column about', 'image story'],
  },
  'about-founder-note': {
    title: 'About Founder Note',
    description: 'A signed letter from the founder with an initials-avatar signature block.',
    customization:
      'The signature is a real `figcaption` - an initials avatar, a name and a role - not an image of a scribble, so it stays legible and translatable. Omit `initials` and the avatar is dropped; the letter body is one string per paragraph.',
    seoTitle: 'Founder Note Section - Free React Component',
    seoDescription:
      'A signed founder letter with an initials signature block, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['founder note', 'founder letter', 'ceo message', 'about founder'],
  },
  'about-culture-values-grid': {
    title: 'About Culture Values Grid',
    description: 'Culture principles in a check-marked grid, the principle as each heading.',
    customization:
      'Each principle is the heading and the check is `aria-hidden` decoration, so the outline reads as content rather than a list of ticks. `min-w-0` on the text column lets long words wrap instead of forcing a row past the grid track at 320px.',
    seoTitle: 'Culture Values Grid - Free Tailwind CSS Component',
    seoDescription:
      'A culture and values grid with checkmarks and principle headings, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['culture values', 'company culture', 'values grid', 'about culture'],
  },
  'about-milestones-counter': {
    title: 'About Milestones Counter',
    description: 'Stat band whose numbers count up from zero the moment it scrolls into view.',
    customization:
      'Each number animates from zero only when the band enters the viewport, via an `IntersectionObserver`, and jumps straight to its final value under `prefers-reduced-motion` - the count is motion, not content. Values are numbers with optional `prefix`/`suffix` so "94%" or "£4.2m" format without hardcoding.',
    seoTitle: 'Animated Stat Counter Section - Free React Component',
    seoDescription:
      'An in-view count-up stats band that respects reduced motion, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['animated counter', 'count up stats', 'number counter', 'stats section'],
  },
  'about-two-column-intro': {
    title: 'About Two-Column Intro',
    description: 'A large heading in one column and the lead paragraphs in the other.',
    customization:
      'The heading owns its own column so it can run large without crowding the prose, and the two stack in source order the moment the screen is too narrow. Paragraphs are one string each, rendered as real `<p>` elements.',
    seoTitle: 'Two-Column Intro Section - Free Tailwind CSS Component',
    seoDescription:
      'A two-column about intro with a large heading and lead copy, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['two column intro', 'about intro', 'lead section', 'company intro'],
  },
  'about-quote-highlight': {
    title: 'About Quote Highlight',
    description: 'A large pull quote with an initials avatar and attribution beneath.',
    customization:
      'The quote is a real `<blockquote>` and the attribution is a `<figcaption>` outside it - the name is not part of the words being quoted. The oversized quotation mark is decorative and `aria-hidden`; omit `initials` to drop the avatar.',
    seoTitle: 'Pull Quote Section - Free Tailwind CSS Component',
    seoDescription:
      'A centered pull-quote highlight with attribution, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['pull quote', 'blockquote section', 'testimonial quote', 'about quote'],
  },
  'about-process-steps': {
    title: 'About Process Steps',
    description: 'A numbered, ordered list of the steps in how the team works.',
    customization:
      'An `<ol>`, because the steps are a sequence - the order is content, not styling - so the number badge is `aria-hidden` decoration derived from the index. Cards drop from four columns to two to one as the screen narrows.',
    seoTitle: 'Process Steps Section - Free React Component',
    seoDescription:
      'A numbered process/how-it-works section on a semantic ordered list, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['process steps', 'how it works', 'numbered steps', 'about process'],
  },
  'about-awards-logos': {
    title: 'About Awards & Logos',
    description: 'Award badges with inline-SVG laurels above a wrapping press-logo strip.',
    customization:
      'The laurel badges are decorative inline SVG while the award name and issuer stay real, readable text - never baked into the graphic. Press logos are inline SVG marks beside a wordmark; pass your own via the `logos` prop, or omit it and the strip is skipped.',
    seoTitle: 'Awards & Press Logos Section - Free Tailwind CSS Component',
    seoDescription:
      'An awards and press-logo section with inline-SVG badges and no image assets, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['awards section', 'press logos', 'as seen in', 'recognition badges'],
  },
  'about-cta-join': {
    title: 'About CTA Join',
    description: 'A gradient call-to-action banner inviting readers to join the team.',
    customization:
      'The gradient panel is decorative; contrast is carried by white text on the darkest stop, which stays AA across the whole gradient. Buttons stack full-width on a phone and sit inline from `sm`, each a 40px-plus tap target; omit `secondaryLabel` for a single button.',
    seoTitle: 'Join Us CTA Banner - Free Tailwind CSS Component',
    seoDescription:
      'A gradient careers call-to-action banner with stacking buttons, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['cta banner', 'join us', 'careers cta', 'about cta'],
  },
};
