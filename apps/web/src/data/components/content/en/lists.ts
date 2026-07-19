import type { ComponentContentMap } from '../types';

/** English prose for the lists category. Keys are component slugs. */
export const listsContent: ComponentContentMap = {
  'list-divided-basic': {
    title: 'Divided List',
    description: 'A semantic list of rows with a primary label and an optional trailing meta value.',
    customization:
      'Feed rows through `items`; the trailing `secondary` hides below `sm` so it never fights the label at 320px - keep it as a redundant hint, not the only place a value lives. `min-w-0` + `truncate` on the primary text is what stops a long label overflowing the row.',
    seoTitle: 'Divided List - Free Tailwind CSS Component',
    seoDescription:
      'A responsive semantic list with divided rows and truncating text, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['divided list', 'list rows', 'ul component', 'tailwind list'],
  },
  'list-avatar-actions': {
    title: 'Avatar List With Actions',
    description: 'Contact rows with a gradient initials avatar, name, email and a trailing action button.',
    customization:
      'Avatars are gradient circles carrying initials - no external images, and `aria-hidden` because the name sits beside them. The email hides below `sm` and the trailing button is a full 40px tap target so a thumb never misses it.',
    seoTitle: 'Avatar List With Actions - Free React Component',
    seoDescription:
      'A contact list with gradient initials avatars and a trailing action button, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['avatar list', 'contact list', 'list with actions', 'initials avatar'],
  },
  'list-selectable-checkbox': {
    title: 'Selectable Checkbox List',
    description: 'Multi-select rows where the whole row is the label and checked rows tint their background.',
    customization:
      'State lives in a `Set`; the header count reflects it live. The entire row is the `<label>`, so the hit area is the row rather than a 20px box, and the checked tint is paired with the native check so colour is never the only signal.',
    seoTitle: 'Selectable Checkbox List - Free React Component',
    seoDescription:
      'A multi-select list with full-row labels and a live selection count, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['selectable list', 'checkbox list', 'multi select', 'list selection'],
  },
  'list-inbox-two-line': {
    title: 'Two-Line Inbox List',
    description: 'An email-style list with sender, subject, a preview line, a timestamp and an unread dot.',
    customization:
      'The timestamp is `shrink-0` so it never truncates while sender and subject each take `min-w-0` + `truncate`. The preview is the third tier and hides below `sm`; the unread dot is doubled by a bold sender so the cue is not colour-only.',
    seoTitle: 'Two-Line Inbox List - Free Tailwind CSS Component',
    seoDescription:
      'An email inbox list with sender, subject, preview and unread state, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['inbox list', 'email list', 'two line list', 'unread list'],
  },
  'list-media-thumbnail': {
    title: 'Media Thumbnail List',
    description: 'Rows fronted by a fixed gradient thumbnail tile with a title, description and trailing badge.',
    customization:
      'The thumbnail is a `shrink-0` gradient tile carrying a short glyph - no image to preload or let rot. The description truncates and the trailing badge hides below `sm`, so the title always wins the space it needs.',
    seoTitle: 'Media Thumbnail List - Free Tailwind CSS Component',
    seoDescription:
      'A media list with gradient thumbnail tiles, in Tailwind, React and TypeScript. Responsive, image-free and MIT licensed.',
    keywords: ['media list', 'thumbnail list', 'file list', 'gradient thumbnail'],
  },
  'list-stats-trailing': {
    title: 'Stats List',
    description: 'A list pairing each label with a trailing value and a coloured up/down delta.',
    customization:
      'The value and delta sit in a `shrink-0` column with `tabular-nums` so numbers align and never truncate. The delta colour is doubled by an arrow glyph, keeping the trend readable without relying on colour alone.',
    seoTitle: 'Stats List - Free Tailwind CSS Component',
    seoDescription:
      'A metrics list with trailing values and trend deltas, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['stats list', 'metrics list', 'kpi list', 'trend list'],
  },
  'list-grouped-sticky-headers': {
    title: 'Grouped List With Sticky Headers',
    description: 'A scrollable list whose section headers pin to the top as their rows scroll under them.',
    customization:
      'Sticky headers with zero JS: each heading is `position:sticky top-0` inside a scroll container that owns the height and overflow, so the page never scrolls sideways. Pass `groups` of labelled rows; each row keeps the truncate defence.',
    seoTitle: 'Grouped List With Sticky Headers - Free CSS Component',
    seoDescription:
      'A grouped, scrollable list with CSS-only sticky section headers, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['grouped list', 'sticky headers', 'section list', 'scrollable list'],
  },
  'list-expandable-rows': {
    title: 'Expandable List Rows',
    description: 'Disclosure rows built on native details/summary that expand to reveal more content.',
    customization:
      'Native `<details>`/`<summary>` makes each row keyboard-operable and screen-reader-announced with no JS; the chevron rotates via `group-open`. The summary meta hides below `sm` and the whole summary is a 44px tap target.',
    seoTitle: 'Expandable List Rows - Free Tailwind CSS Component',
    seoDescription:
      'A list of expandable disclosure rows using native details/summary, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['expandable list', 'accordion list', 'details summary', 'disclosure rows'],
  },
  'list-numbered-ranking': {
    title: 'Numbered Ranking List',
    description: 'An ordered leaderboard where the rank badge accents the top three and scores align on the right.',
    customization:
      'A real `<ol>` carries the ordering semantically. The top three rank badges take a medal fill so the podium reads at a glance, and the value column uses `tabular-nums` so scores line up regardless of digit count.',
    seoTitle: 'Numbered Ranking List - Free Tailwind CSS Component',
    seoDescription:
      'An ordered ranking list with medal accents and aligned scores, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['ranking list', 'leaderboard', 'numbered list', 'ordered list'],
  },
  'list-keyboard-move': {
    title: 'Keyboard Reorderable List',
    description: 'Rows reordered with up/down buttons - the accessible baseline that drag-and-drop forgets.',
    customization:
      'Two 40px move buttons per row work with a keyboard, a switch or a screen reader; end rows disable the button that would do nothing and an `aria-live` region announces each move. The label truncates so controls stay reachable at 320px.',
    seoTitle: 'Keyboard Reorderable List - Free React Component',
    seoDescription:
      'An accessible reorderable list with up/down move buttons and live announcements, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['reorderable list', 'keyboard reorder', 'move up down', 'accessible list'],
  },
};
