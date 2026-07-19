import type { ComponentContentMap } from '../types';

/** English prose for the pricing category. Keys are component slugs. */
export const pricingContent: ComponentContentMap = {
  'pricing-three-tier': {
    title: 'Three-Tier Pricing',
    description: 'The canonical Starter / Pro / Enterprise grid, with the middle tier promoted.',
    customization:
      'The tiers are a `<ul>`, which is the decision worth keeping: a screen reader then announces "list, 3 items" before the first plan, and how many options exist is precisely the fact a non-sighted user cannot recover from the visual grid. The layout jumps from one column straight to three and deliberately skips two - at that width the third tier wraps onto a row of its own and reads as an afterthought rather than a peer. Every CTA says "Get started", so each carries an `sr-only` suffix naming its tier; links are read out of context in a screen reader’s link list, where three identical "Get started" entries are useless. Swap which tier is `highlighted` and the badge, border and solid CTA follow together - they are one flag, not three.',
    seoTitle: 'Three-Tier Pricing Table - Free Accessible Component',
    seoDescription:
      'A responsive three-tier SaaS pricing grid with a highlighted plan and correct list semantics. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pricing table', 'three tier pricing', 'saas pricing', 'tailwind pricing'],
  },

  'pricing-toggle-billing': {
    title: 'Monthly / Annual Toggle',
    description: 'A pricing grid with a real switch that recomputes every price.',
    customization:
      'The control is a `<button role="switch">` with one label describing its on state ("Bill annually") - not the "Monthly | Annually" pair you usually see, which is a two-option choice wearing a switch’s clothes. If both periods deserve equal weight, use a `<fieldset>` of two radios instead and `role="switch"` stops being a lie about what the control does. Two details keep it honest: the checked styling hangs off `[aria-checked="true"]` rather than a class, so making it *look* on forces telling assistive tech it is on; and the amounts live as numbers, never as parsed "$19" strings - the annual total is arithmetic, and formatting a number is far easier than parsing a formatted one back. The note line has a reserved `min-h-10` because the annual copy is longer, and without it the whole grid reflows mid-toggle.',
    seoTitle: 'Pricing Billing Toggle - Free Accessible Switch Component',
    seoDescription:
      'A monthly/annual pricing toggle built on a real ARIA switch, with prices that recompute. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pricing toggle', 'billing switch', 'annual pricing toggle', 'aria switch'],
  },

  'pricing-single-card': {
    title: 'Single Plan Card',
    description: 'One plan in a split card: the pitch on one side, the price panel on the other.',
    customization:
      'With one plan there is nothing to compare, so the usual vertical card wastes the width it has. This splits instead - pitch and features take the wide side, price and CTA get a tinted panel that stays a fixed, self-contained block a returning visitor can scan for, rather than drifting down the page as the feature list grows. The grid is `1.6fr 1fr` rather than `2fr 1fr` for one reason: the panel must stay wide enough that "$19" and "/month" share a line, because a wrapped period reads as a different price. Source order puts the pitch first, which is also the order it stacks and should be read in. `price` is a pre-formatted string, currency symbol and all - formatting belongs to the caller, the only layer that knows the visitor’s locale.',
    seoTitle: 'Single Plan Pricing Card - Free Accessible Component',
    seoDescription:
      'A one-plan split pricing card with a dedicated price panel and feature list. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['single plan pricing', 'one price card', 'split pricing card', 'tailwind pricing'],
  },

  'pricing-comparison-grid': {
    title: 'Plan Comparison Table',
    description: 'A real table comparing every feature across plans, with accessible tick cells.',
    customization:
      'This is a real `<table>`, and it has to be. A grid of divs looks identical and throws away the only thing that makes the data navigable without sight: with `scope="col"` on the plans and `scope="row"` on the features, a screen reader announces "Pro, Priority support, Included" when the user lands on a cell - remove the table and that cell announces "Included", which is true but about nothing. The tick cells follow two rules. The `<svg>` is `aria-hidden` and every boolean carries real `sr-only` text beside it, because an icon alone conveys nothing and `title` on an SVG is read inconsistently; and ✓ and ✗ differ in shape rather than only colour, so the answer survives greyscale printing and colour-blind readers. The scroll wrapper is focusable with a name - a region that scrolls but cannot be focused is unreachable from the keyboard - and the wrapper scrolls, not the table, since a table cannot form a scroll container itself. That is the usual reason a comparison table clips its last plan on a phone. Cells are typed `string | boolean`, so one column can mix "99.5%" with a tick and the render is forced to branch rather than printing the string "false".',
    seoTitle: 'Pricing Comparison Table - Free Accessible Component',
    seoDescription:
      'A plan-by-feature pricing comparison table with real table semantics, scoped headers and screen-reader text on every tick. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pricing comparison table', 'feature matrix', 'accessible table', 'compare plans'],
  },

  'pricing-usage-slider': {
    title: 'Usage Slider Pricing',
    description: 'A seat slider that recomputes the price live, built on a native range input.',
    customization:
      'It is a native `<input type="range">`, not a div with a drag handler: arrow keys, Home/End, Page Up/Down, the correct touch target and the platform’s forced-colours rendering all arrive for free, and a custom slider gets most of them only after hundreds of lines - some of them never. Three things make the price trustworthy. The listener is `input`, not `change`, or the total would freeze mid-drag, exactly when the user is watching it. The price sits in an `<output>`, which maps to `role="status"` and is already a polite live region; `aria-live` is spelled out anyway because a few screen-reader and browser pairings still do not map `<output>`, and a silent price is the one failure this component cannot afford - note it goes on the output itself, not a wrapper, or every drag re-announces the label. And `aria-valuetext` gives the value a unit, since the raw control announces a bare "12" and leaves the user to guess what of. Change `PER_SEAT` to reprice; move to integer cents the moment a price gains a decimal, because `12.99 * 3` is already `38.97000000000001`.',
    seoTitle: 'Usage Slider Pricing Calculator - Free Accessible Component',
    seoDescription:
      'A seat-based pricing calculator built on a native range input with a live-announced total. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pricing slider', 'usage based pricing', 'pricing calculator', 'range input pricing'],
  },

  'pricing-two-tier': {
    title: 'Two-Tier Pricing',
    description: 'A Basic / Premium pair that stacks to one column on phones.',
    customization:
      'Pass your own `tiers`; mark one `highlighted` to give it the 2px border and text badge. The emphasis is a border weight plus a "Recommended" label, never colour alone, so the choice survives greyscale.',
    seoTitle: 'Two-Tier Pricing Table - Free Accessible Component',
    seoDescription:
      'A responsive two-tier pricing grid with a highlighted plan, real list semantics and per-tier CTAs. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['two tier pricing', 'pricing table', 'saas pricing', 'tailwind pricing'],
  },

  'pricing-enterprise-cta': {
    title: 'Enterprise Contact Banner',
    description: 'A contact-sales panel that puts the copy and buttons side by side on desktop.',
    customization:
      'Override `title`, `description` and both CTAs. The buttons stack under the copy at phone widths and move beside it from `sm` up, so the panel never forces a horizontal scroll at 320px.',
    seoTitle: 'Enterprise Contact-Sales CTA - Free Component',
    seoDescription:
      'A responsive enterprise contact-sales banner with primary and secondary actions. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['enterprise cta', 'contact sales banner', 'pricing cta', 'sales banner'],
  },

  'pricing-feature-table': {
    title: 'Feature Comparison Table',
    description: 'A real table comparing features across plans, scrollable inside its own wrapper.',
    customization:
      'The wrapper (not the table) carries `overflow-x-auto` and a focusable `role="region"`, and the table keeps a `min-w-[34rem]`, so on a phone the table scrolls inside its card while the page never overflows. Boolean cells render an icon *and* text ("Included" / "Not included"), and ✓ and ✗ differ in shape, so the answer never depends on colour.',
    seoTitle: 'Pricing Feature Comparison Table - Free Accessible Component',
    seoDescription:
      'A plan-by-feature comparison table with scoped headers, a scrollable wrapper and icon-plus-text cells. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['feature comparison table', 'pricing matrix', 'accessible table', 'compare plans'],
  },

  'pricing-gradient-cards': {
    title: 'Gradient Pricing Cards',
    description: 'Tier cards on decorative gradients, with the popular one ringed and labelled.',
    customization:
      'Each tier carries its own `gradient` class pair; the price stays real text on a dark-enough gradient to clear AA. The featured tier is cued by a "Most popular" text badge plus a ring, not by hue, and the whole grid collapses to one column on phones.',
    seoTitle: 'Gradient Pricing Cards - Free Accessible Component',
    seoDescription:
      'Colorful gradient pricing tiers with accessible contrast, a text badge and a responsive one-to-three column grid. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['gradient pricing cards', 'colorful pricing', 'pricing tiers', 'tailwind gradient'],
  },

  'pricing-minimal': {
    title: 'Minimal Single Plan',
    description: 'One centred plan with no card chrome, sized for a simple product.',
    customization:
      'Pass `price`, `features` and `ctaLabel`; there is deliberately no card border, so the price carries the layout. Type scales stay fluid and the block is capped at `max-w-md`, so nothing clips at 320px.',
    seoTitle: 'Minimal Pricing Component - Free Accessible Component',
    seoDescription:
      'A clean single-plan pricing block with a centred price and feature list. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['minimal pricing', 'single plan pricing', 'simple pricing', 'tailwind pricing'],
  },

  'pricing-annual-discount': {
    title: 'Annual Discount Pricing',
    description: 'Annual-billed tiers that show the saving as a badge and strike out the monthly price.',
    customization:
      'The crossed-out monthly price uses a real `<s>` element and the discount is spelled out ("Save 20%"), so the saving is never signalled by colour alone. Provide `annualPerMonth`, `monthlyPrice`, `billedNote` and `savings` per tier; the grid stacks to one column on phones.',
    seoTitle: 'Annual Discount Pricing - Free Accessible Component',
    seoDescription:
      'A yearly-billing pricing grid with a savings badge and struck-through monthly price. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['annual pricing', 'yearly discount', 'pricing savings', 'annual billing'],
  },

  'pricing-per-seat': {
    title: 'Per-Seat Calculator',
    description: 'A seat stepper that recomputes the monthly total and announces it live.',
    customization:
      'Set `perSeat`, `minSeats` and `maxSeats`; the stepper buttons are 40x40 tap targets and the total sits in an `<output>` with `aria-live` so it is announced as the count changes. Move to integer cents before a price gains a decimal - `12.99 * 3` is already `38.97000000000001`.',
    seoTitle: 'Per-Seat Pricing Calculator - Free Accessible Component',
    seoDescription:
      'A per-seat pricing calculator with an accessible stepper and a live-announced total. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['per seat pricing', 'seat calculator', 'pricing stepper', 'team pricing'],
  },

  'pricing-freemium': {
    title: 'Freemium Two-Plan',
    description: 'A Free and a Pro card, the paid one inverted to a dark surface for emphasis.',
    customization:
      'Pass two `plans`; the one marked `paid` inverts to a dark surface so the upgrade reads as the emphasis without relying on hue. The pair stacks to one column below `md`, and each plan owns its CTA label.',
    seoTitle: 'Freemium Pricing Component - Free Accessible Component',
    seoDescription:
      'A free-versus-paid two-plan pricing layout with an inverted upgrade card. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['freemium pricing', 'free vs pro', 'two plan pricing', 'upgrade card'],
  },

  'pricing-highlight-popular': {
    title: 'Highlighted Popular Tier',
    description: 'Three tiers where the popular one is ringed and carries a text badge.',
    customization:
      'Mark one tier `popular` and it gets both a ring and a centred "Most popular" badge - two cues, so the emphasis never depends on colour alone. The grid runs one column on phones, two at `sm` and three from `lg`.',
    seoTitle: 'Popular Tier Pricing - Free Accessible Component',
    seoDescription:
      'A three-tier pricing grid with a highlighted most-popular plan cued by a ring and a text badge. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['popular plan pricing', 'most popular tier', 'pricing tiers', 'highlighted pricing'],
  },

  'pricing-faq-combined': {
    title: 'Pricing + FAQ',
    description: 'A price panel beside a native accordion of common billing questions.',
    customization:
      'The FAQ uses native `<details>`/`<summary>`, so it works with zero JavaScript and is keyboard-operable for free; the chevron rotates via `group-open`. Provide `faqs` and the plan `features`; the price panel and the FAQ stack to one column below `lg`.',
    seoTitle: 'Pricing with FAQ - Free Accessible Component',
    seoDescription:
      'A combined pricing panel and FAQ accordion built on native details/summary. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['pricing faq', 'pricing accordion', 'billing questions', 'details summary faq'],
  },
};
