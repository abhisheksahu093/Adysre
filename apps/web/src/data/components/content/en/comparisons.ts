import type { ComponentContentMap } from '../types';

/** English prose for the comparisons category. Keys are component slugs. */
export const comparisonsContent: ComponentContentMap = {
  'comparison-table': {
    title: 'Comparison Table',
    description: 'A plan-versus-feature matrix built as a real table, with readable boolean cells.',
    customization:
      'Rows are positional: `values[i]` belongs to `plans[i]`, and a boolean renders as a ✓/✗ pair while a string renders verbatim - which is what lets "Unlimited" and "included" share one row type instead of forcing two components. The part to leave alone is the header wiring. `<th scope="col">` on the plan names and `<th scope="row">` on the feature names is what makes a cell announce as "Priority support, Pro, Included"; rebuild the same grid out of divs and that cell announces "Included" - true, but of what? The same logic drives the ✓: it is `aria-hidden` and the word beside it is `sr-only`, so an icon-only cell never reaches a screen reader as an empty one. Overflow lives on the wrapper, never the table, so the feature column cannot scroll out of view.',
    seoTitle: 'Comparison Table - Free Accessible React Component',
    seoDescription:
      'A plan comparison table with real table semantics, scoped headers and screen-reader-safe ✓/✗ cells. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['comparison table', 'pricing comparison', 'accessible table', 'react comparison table'],
  },

  'comparison-image-slider': {
    title: 'Before / After Image Slider',
    description: 'Two photographs stacked under a draggable wipe handle that also works from the keyboard.',
    customization:
      'The wipe is a `clip-path: inset()` on the top layer rather than a width change, because both layers stay full size and therefore pixel-aligned - resize one instead and the two photographs slide against each other as the edge moves. The handle is the reason this component is rated advanced: it is a real `role="slider"` with `aria-valuenow`, arrow keys, Shift for ten-percent jumps and Home/End, because a handle you can only drag is a handle a keyboard user cannot touch at all, and `role="slider"` without key handling is a promise the component does not keep. Pointer Events (plus `setPointerCapture`) cover mouse, touch and pen in one path and keep the drag alive when the cursor leaves the frame; `touch-action: none` is what stops a touch drag scrolling the page instead. Give both images real, different alt text - they are two pictures, not one with a decoration on top.',
    seoTitle: 'Before After Image Slider - Free Accessible Component',
    seoDescription:
      'A draggable before/after image comparison slider with a keyboard-operable role="slider" handle. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['before after slider', 'image comparison slider', 'accessible slider', 'react image wipe'],
  },

  'comparison-two-column': {
    title: 'Two-Column Comparison',
    description: 'Two independent lists side by side - the versus layout that is deliberately not a table.',
    customization:
      'This is the entry to reach for when the two sides do not share a row axis. "Version history is a filename" has no counterpart in the right-hand list, and pairing the two into `<tr>`s would invent a relationship that is not there - so each side is its own `<section>` with its own `<h3>` and `<ul>`, and a screen-reader user reads one side end to end instead of zig-zagging across a fake matrix. The `tone` field drives the glyph, the accent rule and the visually-hidden "Included:" / "Not included:" prefix together, so the three can never drift apart. The accent is a 3px top rule rather than a background fill on purpose: tint the whole column and both lists\' body copy has to be re-checked for contrast against a second surface. It collapses to one column below 40rem, and unlike a comparison table it still reads correctly stacked.',
    seoTitle: 'Two-Column Comparison - Free Accessible Component',
    seoDescription:
      'A versus-style two-column comparison of independent lists with screen-reader-safe markers. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['two column comparison', 'versus layout', 'before after list', 'react comparison'],
  },

  'comparison-feature-matrix': {
    title: 'Feature Matrix',
    description: 'A long, grouped comparison table with sticky plan headers and an accented column.',
    customization:
      'The grown-up version of the comparison table: enough rows that they need sorting into groups, which is where the markup earns its keep. Each group is its own `<tbody>` headed by a `<th scope="colgroup" colspan>` - that is what makes "Security" a heading for the rows beneath it rather than a wide decorative cell, and it is the thing a grid of divs simply cannot express. Column headers are sticky and therefore need an opaque background, so they carry a real surface colour and get repainted in the dark block rather than left to inherit. The recommended column is accented with a tint, but the tint is only ever reinforcement: the plan\'s own "Popular" badge is a text node, so it survives forced-colours mode, a colour-filtered screen and a black-and-white printout - all of which erase the blue.',
    seoTitle: 'Feature Comparison Matrix - Free Accessible Component',
    seoDescription:
      'A grouped feature comparison matrix with sticky headers, colgroup headings and accessible ✓/✗ cells. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['feature matrix', 'comparison matrix', 'grouped table', 'pricing feature table'],
  },

  'comparison-before-after-cards': {
    title: 'Before / After Cards',
    description: 'Two captioned figures side by side, showing both states at once.',
    customization:
      'The trade-off against the wipe slider is visibility: a moving edge always hides half of whatever side you are not looking at, so use these cards when the differences are spread across the frame and both states need to be readable at the same time. Each card is a `<figure>` with a `<figcaption>` because that is literally what the elements mean - a picture and a caption about that picture - and the binding is structural, so there is no `aria-describedby` to wire up and none to rot. The "Before" / "After" pill is a real text node rather than `aria-hidden` decoration: the caption never repeats it, so hiding it would drop the one word that says which state you are looking at. The pill carries its own near-opaque plate and white text, which is why it clears 4.5:1 over any photograph and needs no dark-mode rule at all.',
    seoTitle: 'Before After Cards - Free Accessible Component',
    seoDescription:
      'A before/after comparison built from two captioned figures, with correct figure and figcaption semantics. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['before after cards', 'comparison cards', 'figure figcaption', 'react before after'],
  },

  'comparison-pricing-toggle': {
    title: 'Pricing Toggle Comparison',
    description: 'Plan cards whose prices switch between monthly and annual from an accessible toggle.',
    customization:
      'The React and TypeScript variants use a real radiogroup (two radios, not two unlabelled buttons) so the billing choice is announced and arrow-navigable; the Tailwind variant does the same job with a single labelled checkbox and `group-has-[:checked]` so it swaps every price with no JavaScript. Mark a plan `featured` to accent its border, and the grid steps one -> two -> three columns as space allows.',
    seoTitle: 'Pricing Toggle Comparison - Free Accessible Component',
    seoDescription:
      'A monthly/annual pricing toggle over responsive plan cards, with an accessible radiogroup and a JS-free CSS-only variant. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['pricing toggle', 'monthly annual switch', 'pricing comparison', 'billing toggle'],
  },

  'comparison-vs-versus': {
    title: 'Versus Comparison',
    description: 'Two labelled panels with a decorative VS badge that steps aside when they stack.',
    customization:
      'Each side is its own `aria-label`led `<section>` with a heading, tagline and neutral bullet list, so a screen reader reads one contender end to end. The central "VS" badge is `aria-hidden` and `sm:block` only, so it never floats over the first card once the two panels stack into a single column below 40rem.',
    seoTitle: 'Versus Comparison (A vs B) - Free Component',
    seoDescription:
      'A two-panel "A vs B" versus comparison with a decorative VS divider that hides on mobile. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['versus comparison', 'a vs b', 'vs layout', 'product comparison'],
  },

  'comparison-pros-cons': {
    title: 'Pros and Cons',
    description: 'Two lists of pros and cons where each item carries an icon and a hidden label.',
    customization:
      'Rename the columns with `prosLabel` / `consLabel`. Every glyph is `aria-hidden` and paired with a visually-hidden "Pro:" / "Con:" prefix, so the verdict never rides on colour alone - it survives greyscale, forced-colours and a screen reader. The two lists stack to one column below 40rem.',
    seoTitle: 'Pros and Cons List - Free Accessible Component',
    seoDescription:
      'A pros-and-cons comparison with icon-plus-text markers that never rely on colour alone. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['pros and cons', 'advantages disadvantages', 'decision list', 'comparison list'],
  },

  'comparison-three-column': {
    title: 'Three-Column Comparison',
    description: 'Three plan columns that collapse to two then one, keeping excluded rows aligned.',
    customization:
      'Mark one column `highlight` to accent its border and add a "Popular" badge. An excluded feature keeps its row - an `aria-hidden` cross plus a visually-hidden "Not included:" and a strikethrough - so the three lists stay row-aligned instead of silently dropping absent features. Grid steps one -> two -> three columns.',
    seoTitle: 'Three-Column Comparison - Free Accessible Component',
    seoDescription:
      'A three-column plan comparison that stacks on mobile and keeps included/excluded rows aligned with icon-plus-text markers. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['three column comparison', 'plan comparison', 'pricing columns', 'feature columns'],
  },

  'comparison-spec-list': {
    title: 'Spec Comparison List',
    description: 'A two-product spec sheet built from a definition list that stacks cleanly on mobile.',
    customization:
      'Built from a `<dl>` rather than a table so it needs no horizontal scroll: on mobile the header row hides and each value carries its own inline product label, so a stacked spec never loses which value belongs to which product. Set `productA` / `productB` for the column names and feed any number of `specs`.',
    seoTitle: 'Spec Comparison List - Free Accessible Component',
    seoDescription:
      'A two-product spec sheet from a definition list that stacks without a scrolling table. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['spec comparison', 'spec sheet', 'product specs', 'definition list comparison'],
  },

  'comparison-plan-matrix': {
    title: 'Plan Matrix',
    description: 'A pricing matrix with a price under each plan name, scrolling inside its wrapper.',
    customization:
      'A real `<table>` with scoped headers and a price line under each plan name. The wrapper - not the table - scrolls and the table holds a `min-w`, so at 320px the plan columns scroll while the feature column stays anchored. Boolean cells render an `aria-hidden` ✓/✗ plus a visually-hidden word; strings render verbatim, so "Unlimited" and a checkmark share one row type.',
    seoTitle: 'Plan Comparison Matrix - Free Accessible Component',
    seoDescription:
      'A pricing plan matrix table with prices in the header, scoped headers and screen-reader-safe boolean cells that scrolls without breaking the page. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['plan matrix', 'pricing matrix', 'comparison table', 'feature matrix'],
  },

  'comparison-highlight-diff': {
    title: 'Highlighted Difference',
    description: 'Attribute rows where the winning side is tinted and flagged, never colour alone.',
    customization:
      'Set each row\'s `winner` to `a`, `b` or `tie`. The winning cell is tinted AND flagged with a `★` glyph plus a visually-hidden "(best)", so the verdict survives forced-colours, greyscale and a screen reader. The two cells per row stack to one column below 40rem.',
    seoTitle: 'Highlighted Difference Comparison - Free Component',
    seoDescription:
      'A head-to-head comparison that highlights the winning value per attribute with tint plus an icon, never colour alone. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['difference highlight', 'winner comparison', 'head to head', 'diff comparison'],
  },

  'comparison-side-by-side-cards': {
    title: 'Side-by-Side Product Cards',
    description: 'Two product cards with gradient avatars, feature lists and CTAs that stack on mobile.',
    customization:
      'Each card carries a gradient initials tile (no external image to load), a price, a feature list and a real link CTA with a focus-visible ring. Mark one `featured` to accent its border and give it the solid CTA. The two cards stack to one column below 40rem.',
    seoTitle: 'Side-by-Side Product Cards - Free Component',
    seoDescription:
      'Two side-by-side product comparison cards with gradient avatars, feature lists and CTAs, responsive down to 320px. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['product comparison cards', 'side by side cards', 'plan cards', 'pricing cards'],
  },

  'comparison-checkmark-grid': {
    title: 'Checkmark Grid',
    description: 'A compact support grid of pure ✓/✗ cells inside a table that scrolls, not the page.',
    customization:
      'A pure boolean grid: every cell is an `aria-hidden` ✓/✗ paired with a visually-hidden "Supported" / "Not supported", inside a real table with scoped headers. The wrapper scrolls and the table holds a `min-w`, so the capability column stays on screen at 320px. Positional `support[i]` maps to `options[i]`.',
    seoTitle: 'Checkmark Comparison Grid - Free Accessible Component',
    seoDescription:
      'A compact support/feature checkmark grid with scoped table headers and screen-reader-safe ✓/✗ cells that scrolls in its wrapper. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['checkmark grid', 'support grid', 'feature grid', 'comparison checkmarks'],
  },

  'comparison-tiered-features': {
    title: 'Tiered Features',
    description: 'Plan tiers that state what they inherit in words rather than re-listing every feature.',
    customization:
      'Each higher tier sets `inheritsFrom` and lists only what it adds ("Everything in Team, plus"), which is shorter to read and makes it impossible for the lists to drift out of sync. Mark one tier `featured` to accent its border; the grid steps one -> two -> three columns.',
    seoTitle: 'Tiered Features Comparison - Free Component',
    seoDescription:
      'A tiered pricing feature comparison where each tier inherits the one below in words instead of repeating features. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['tiered features', 'pricing tiers', 'feature tiers', 'plan tiers'],
  },
};
