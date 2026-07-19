import type { ComponentContentMap } from '../types';

/** English prose for the team category. Keys are component slugs. */
export const teamContent: ComponentContentMap = {
  'team-grid-cards': {
    title: 'Team Grid Cards',
    description: 'A responsive card grid of people with gradient-initials avatars, names and roles.',
    customization:
      'Feed the roster through `members`; initials and a rotating gradient avatar are derived from each name, so nothing loads over the network. The grid reflows 1 → 2 → 3 → 4 columns so a full team never crushes into one unreadable row.',
    seoTitle: 'Team Grid Cards Section - Free Tailwind CSS Component',
    seoDescription:
      'A responsive team card grid with gradient-initials avatars, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['team grid', 'team cards', 'team section', 'meet the team'],
  },
  'team-with-social-links': {
    title: 'Team Cards With Social Links',
    description: 'Team cards where each person carries LinkedIn, X and GitHub links with per-person labels.',
    customization:
      'Each social link gets an accessible name like "Priya Raman on LinkedIn", not a bare "LinkedIn", so a screen-reader user tabbing the row knows whose profile opens; the icon SVG itself is `aria-hidden`. Pass `socials` per member as `{ platform, href }`.',
    seoTitle: 'Team Cards with Social Links - Free Tailwind CSS Component',
    seoDescription:
      'A team card grid with accessible per-person social links, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['team social links', 'team cards', 'people social', 'team section'],
  },
  'team-list-rows': {
    title: 'Team List Rows',
    description: 'A compact divided list of people, each row an avatar with name, role and an optional tag.',
    customization:
      'A dense roster layout: `min-w-0` and `truncate` let long names shorten instead of shoving the department tag off a 320px screen, and that tag hides below `sm`. Drive it with `members`, each optionally carrying a `department`.',
    seoTitle: 'Team List Rows Section - Free Tailwind CSS Component',
    seoDescription:
      'A compact divided team list with avatars and roles, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['team list', 'team rows', 'staff directory', 'people list'],
  },
  'team-leadership-featured': {
    title: 'Featured Leadership',
    description: 'A large featured leader card above a reflowing grid of the rest of the team.',
    customization:
      'The `leader` gets a wide card that stacks avatar-over-text on phones and goes side-by-side from `sm` up, with room for a `bio`; the remaining `members` fill a 1 → 2 → 3 → 4 grid below. Gradients and initials are derived from names.',
    seoTitle: 'Featured Leadership Team Section - Free Tailwind CSS Component',
    seoDescription:
      'A team section with a featured leader above a member grid, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['leadership section', 'featured team', 'founders section', 'team grid'],
  },
  'team-hover-overlay': {
    title: 'Team Hover Bio Overlay',
    description: 'Gradient tiles whose bio fades in over a scrim on hover and keyboard focus.',
    customization:
      'The reveal is bound to `:hover` *and* `:focus-visible` on the same link, so keyboard users get the bio too; the `bg-black/60` scrim is what keeps that text at 4.5:1 over the gradient, and `motion-reduce` drops the fade. Pass a `bio` and optional `href` per member.',
    seoTitle: 'Team Hover Overlay Section - Free Tailwind CSS Component',
    seoDescription:
      'A team grid with accessible hover-and-focus bio overlays, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['team hover', 'bio overlay', 'hover reveal team', 'team cards'],
  },
  'team-circular-avatars': {
    title: 'Circular Avatars',
    description: 'A dense grid of circular gradient-initials avatars with names and short roles.',
    customization:
      'A compact people wall: circular avatars pack denser than cards, so the grid runs 2 → 3 → 4 → 6 columns while still reflowing cleanly at 320px. Initials and gradients come from each name in `members`.',
    seoTitle: 'Circular Team Avatars Section - Free Tailwind CSS Component',
    seoDescription:
      'A dense grid of circular team avatars with names and roles, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['team avatars', 'circular avatars', 'people grid', 'team wall'],
  },
  'team-org-columns': {
    title: 'Team Org Columns',
    description: 'People grouped by department into reflowing columns, each under its own heading.',
    customization:
      'Pass `departments` of `{ name, members }`; each becomes a labelled column and the columns reflow 1 → 2 → 3. Rows use `min-w-0` and `truncate` so long names never overflow a narrow column.',
    seoTitle: 'Team Org Columns Section - Free Tailwind CSS Component',
    seoDescription:
      'A team section grouping people by department into columns, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['org chart', 'team by department', 'team columns', 'org structure'],
  },
  'team-minimal-names': {
    title: 'Minimal Team Names',
    description: 'An avatar-free, typographic list of names and roles that reflows into columns.',
    customization:
      'Deliberately avatar-free - the names carry the weight, separated by hairline rules and reflowing 1 → 2 → 3 columns. Feed it `members` of `{ name, role }`; it is the lightest possible team block.',
    seoTitle: 'Minimal Team Names Section - Free Tailwind CSS Component',
    seoDescription:
      'A minimal typographic team list of names and roles, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['minimal team', 'team names', 'typographic team', 'simple team list'],
  },
  'team-carousel-strip': {
    title: 'Team Carousel Strip',
    description: 'A horizontally scrolling, snap-aligned strip of team cards with no JavaScript.',
    customization:
      'A native CSS scroll-snap strip - no JS, no dependency. The scroll container is a labelled `region` with `tabindex="0"` so keyboard users can focus and arrow through it, which a bare overflow box cannot do. Drive the cards with `members`.',
    seoTitle: 'Team Carousel Strip - Free Tailwind CSS Component',
    seoDescription:
      'A CSS-only scroll-snap team carousel, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['team carousel', 'scroll snap team', 'team strip', 'horizontal team'],
  },
  'team-hiring-cta': {
    title: 'Team With Hiring Tile',
    description: 'A team card grid whose final tile is a dashed "join us" call to action.',
    customization:
      'The hiring tile shares the same grid cell as the people, so "join us" reads as one of the team rather than a detached banner; set its text and target with `hiringLabel` and `hiringHref`. The grid reflows 1 → 2 → 3 → 4.',
    seoTitle: 'Team Hiring CTA Section - Free Tailwind CSS Component',
    seoDescription:
      'A team grid with a built-in hiring call-to-action tile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['hiring cta', 'team careers', 'join the team', 'we are hiring'],
  },
};
