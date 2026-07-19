import type { ComponentContentMap } from '../types';

/** English prose for the tabs category. Keys are component slugs. */
export const tabsContent: ComponentContentMap = {
  'tabs-underline': {
    title: 'Underline Tabs',
    description: 'A keyboard-accessible tab strip with the active tab underlined.',
    customization:
      'The indicator is an `::after` pseudo-element pinned to the list\'s hairline, not a `border-bottom` on the tab - a border would nudge the label by a pixel as it appeared. Change the accent in the two `aria-selected` rules and nowhere else; the state lives in the ARIA attribute, so the paint and the screen-reader announcement can never drift apart. Keep the roving tabindex intact: exactly one tab is `tabIndex={0}`, which is what lets Tab skip the strip and land on the panel rather than walking through every tab.',
    seoTitle: 'Underline Tabs - Free Accessible React Component',
    seoDescription:
      'An ARIA tabs component with underlined selection, roving tabindex and arrow-key navigation. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['underline tabs', 'accessible tabs', 'react tabs', 'aria tabs', 'tailwind tabs'],
  },

  'tabs-pills': {
    title: 'Pill Tabs',
    description: 'A segmented control where the selected tab becomes a filled pill.',
    customization:
      'The tinted track is the `tablist` itself, so the pills have nothing to align against but their own container - adjust `p-1` and the gap together or the pill will not sit centred. The fill stays `blue-600` in dark mode on purpose: white text on `blue-500` measures 3.7:1 and fails AA, while `blue-600` holds 5.2:1 on both themes. Best for two to four short, mutually exclusive options; longer labels want the underline variant.',
    seoTitle: 'Pill Tabs - Free Accessible Segmented Control',
    seoDescription:
      'A pill-style ARIA tabs component with roving tabindex and arrow keys, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pill tabs', 'segmented control', 'accessible tabs', 'react tabs', 'tailwind tabs'],
  },

  'tabs-boxed': {
    title: 'Boxed Tabs',
    description: 'Folder-style tabs where the active tab joins the panel below it.',
    customization:
      'The seam is the entire trick: the tablist draws a hairline, each tab sits on it with `-mb-px`, and the selected tab paints its own bottom border in the panel\'s background colour so the two read as one sheet. If a gap or a line reappears, it is because the tab\'s `border-b` colour and the panel\'s `bg` have drifted apart - they must match in both light and dark. Suits a code/preview switcher where the panel is a visible surface rather than bare prose.',
    seoTitle: 'Boxed Tabs - Free Accessible Folder Tabs',
    seoDescription:
      'Folder-style ARIA tabs whose active tab joins the panel, with roving tabindex and arrow keys. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['boxed tabs', 'folder tabs', 'accessible tabs', 'react tabs', 'tailwind tabs'],
  },

  'tabs-vertical': {
    title: 'Vertical Tabs',
    description: 'A tab rail down the left with the panel beside it.',
    customization:
      'Turning tabs vertical is two changes, not one: `aria-orientation="vertical"` on the tablist, and Up/Down bound instead of Left/Right. Doing only the CSS is the classic bug - a strip that looks vertical but answers to the wrong keys. The rail folds above the panel below `sm` because a 11rem rail plus prose does not fit a phone; the roles and keys are untouched by that fold. Good for settings pages where the sections outnumber what a horizontal strip can hold.',
    seoTitle: 'Vertical Tabs - Free Accessible Side Tabs',
    seoDescription:
      'A vertical ARIA tabs component with aria-orientation, Up/Down arrow keys and roving tabindex. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['vertical tabs', 'side tabs', 'accessible tabs', 'react tabs', 'settings tabs'],
  },

  'tabs-with-icons': {
    title: 'Icon Tabs',
    description: 'Tabs that pair a leading icon with a visible label.',
    customization:
      'Icons are drawn with `currentColor` and marked `aria-hidden`, so one `aria-selected` rule paints the icon and the label together and the accessible name stays the visible text. If you ever drop the label to save space, the tab needs an `aria-label` carrying the same words - an icon-only tab with no name is unusable with a screen reader, and the icon alone rarely survives a user\'s first guess anyway. Swap in any 20×20 stroke icon set; the `1.125rem` box keeps the row rhythm.',
    seoTitle: 'Icon Tabs - Free Accessible Tabs with Icons',
    seoDescription:
      'An ARIA tabs component with leading icons, roving tabindex and arrow-key navigation, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['icon tabs', 'tabs with icons', 'accessible tabs', 'react tabs', 'tailwind tabs'],
  },

  'tabs-segmented': {
    title: 'Segmented Tabs',
    description: 'An iOS-style segmented control where the selected tab lifts to a card.',
    customization:
      'The track is the `tablist` and the selected segment is a white, shadowed card inside it; keep the track padding and the segment radius in step or the card will not sit flush. Best for two to four short, equal-weight options - longer labels or more than four segments want the scrollable or overflow variants.',
    seoTitle: 'Segmented Tabs - Free Accessible Segmented Control',
    seoDescription:
      'A segmented-control ARIA tabs component with roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['segmented tabs', 'segmented control', 'accessible tabs', 'react tabs'],
  },

  'tabs-scrollable': {
    title: 'Scrollable Tabs',
    description: 'A tab strip that scrolls sideways when the tabs outrun the row.',
    customization:
      'The strip is `overflow-x-auto` with scroll-snap, so it never pushes the page wider than the viewport at 320px; arrow-key focus scrolls the next tab into view for free. Swap the underline paint for pills without touching the scroll behaviour - it lives on the tablist, not the tabs.',
    seoTitle: 'Scrollable Tabs - Free Accessible Overflowing Tabs',
    seoDescription:
      'A horizontally scrollable ARIA tabs component with scroll-snap, roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['scrollable tabs', 'overflow tabs', 'accessible tabs', 'react tabs'],
  },

  'tabs-with-badges': {
    title: 'Tabs with Badges',
    description: 'Underline tabs that carry a count badge beside each label.',
    customization:
      'The badge sits next to a visible label and is marked `aria-hidden`, so it stays out of the accessible name; when the count itself matters to a screen reader, fold it into an `aria-label` on the tab instead. The active badge inverts to the accent so it never competes with the underline.',
    seoTitle: 'Tabs with Badges - Free Accessible Count Tabs',
    seoDescription:
      'An ARIA tabs component with count badges, roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['badge tabs', 'count tabs', 'accessible tabs', 'react tabs'],
  },

  'tabs-closable': {
    title: 'Closable Tabs',
    description: 'Editor-style tabs each with a real close button you can dismiss.',
    customization:
      'The close control is a real sibling `<button>` with its own `aria-label`, not a glyph baked into the tab - nested buttons are invalid and an icon inside the tab is not separately operable. Closing the active tab moves selection (and focus) to a neighbour so the keyboard user is never stranded.',
    seoTitle: 'Closable Tabs - Free Accessible Dismissible Tabs',
    seoDescription:
      'An ARIA tabs component with per-tab close buttons, roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['closable tabs', 'dismissible tabs', 'accessible tabs', 'react tabs'],
  },

  'tabs-card-panels': {
    title: 'Card Panel Tabs',
    description: 'Pill tabs above a raised, bordered card panel.',
    customization:
      'The panel is a bordered, shadowed surface, so the switch reads as swapping the contents of one card rather than editing loose prose. Match the panel `border` and `bg` across light and dark, and keep the tab gap above the card so the two never touch.',
    seoTitle: 'Card Panel Tabs - Free Accessible Card Tabs',
    seoDescription:
      'An ARIA tabs component with raised card panels, roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['card tabs', 'panel tabs', 'accessible tabs', 'react tabs'],
  },

  'tabs-animated-indicator': {
    title: 'Animated Indicator Tabs',
    description: 'A single underline bar that slides between tabs as selection moves.',
    customization:
      'One shared indicator is measured from the active tab\'s `offsetLeft`/`offsetWidth` after layout, so it tracks the tab through wrapping and font swaps rather than hard-coding positions. The slide honours `motion-reduce`, snapping instantly for users who ask for less motion - keep that guard if you retune the duration.',
    seoTitle: 'Animated Indicator Tabs - Free Accessible Sliding Tabs',
    seoDescription:
      'An ARIA tabs component with a sliding underline indicator that respects reduced motion, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['animated tabs', 'sliding indicator', 'accessible tabs', 'react tabs'],
  },

  'tabs-icon-only': {
    title: 'Icon-only Tabs',
    description: 'Compact icon tabs with no visible label, each named for AT.',
    customization:
      'Every tab MUST carry an `aria-label`, because the icon is `aria-hidden` and is the only thing shown - an unlabelled icon tab is unusable with a screen reader. Buttons stay 40px square to keep a comfortable tap target; pair with a tooltip if the icons are not self-evident.',
    seoTitle: 'Icon-only Tabs - Free Accessible Icon Tabs',
    seoDescription:
      'An icon-only ARIA tabs component with per-tab aria-labels, roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['icon tabs', 'icon-only tabs', 'accessible tabs', 'react tabs'],
  },

  'tabs-full-width': {
    title: 'Full-width Tabs',
    description: 'Tabs that split the row into equal columns to fill their container.',
    customization:
      'Each tab is `flex-1` with `min-w-0` and `truncate`, so the strip fills the width and long labels shorten instead of forcing an overflow - the layout of choice for a mobile bottom bar. Cap the tab count to what fits legibly; past four or five, reach for the scrollable or overflow variant.',
    seoTitle: 'Full-width Tabs - Free Accessible Equal-width Tabs',
    seoDescription:
      'A full-width ARIA tabs component with equal-width tabs, roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['full width tabs', 'equal width tabs', 'accessible tabs', 'react tabs'],
  },

  'tabs-nested': {
    title: 'Nested Tabs',
    description: 'Tabs inside a tab panel, each level with its own keyboard scope.',
    customization:
      'One self-contained `Tabs` component reused at both levels is what keeps the inner strip from answering the outer strip\'s arrow keys - each `tablist` runs its own roving tabindex. Style the inner level differently (pills under an underline) so the hierarchy reads at a glance, and keep nesting to two levels before a user loses the plot.',
    seoTitle: 'Nested Tabs - Free Accessible Two-level Tabs',
    seoDescription:
      'A nested ARIA tabs component where each level keeps its own roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['nested tabs', 'sub tabs', 'accessible tabs', 'react tabs'],
  },

  'tabs-with-dropdown-overflow': {
    title: 'Tabs with Overflow Menu',
    description: 'A tab strip whose tail collapses into a "More" dropdown menu.',
    customization:
      'Tabs past `maxVisible` fold into a `More` menu instead of scrolling; the trigger reports `aria-haspopup="menu"` and `aria-expanded`, lights up when the active tab is hidden inside it, and the menu closes on Escape, outside click, or selection. Keep the first visible tab in the tab sequence when the active tab is in the menu so keyboard users still reach the strip.',
    seoTitle: 'Tabs with Overflow Menu - Free Accessible Overflow Tabs',
    seoDescription:
      'An ARIA tabs component that collapses extra tabs into a dropdown menu, with roving tabindex and arrow keys, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['overflow tabs', 'dropdown tabs', 'accessible tabs', 'react tabs'],
  },
};
