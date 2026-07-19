import type { ComponentContentMap } from '../types';

/** English prose for the search-bars category. Keys are component slugs. */
export const searchBarsContent: ComponentContentMap = {
  'search-hero-suggestions': {
    title: 'Hero Search with Suggestions',
    description:
      'A large hero search field with a live combobox suggestion list driven by the keyboard.',
    customization:
      'The input keeps focus and owns `aria-activedescendant`; the popup is a separate `role="listbox"`, so Arrow/Enter/Escape all work without focus ever leaving the field. Pass your own `suggestions` pool - filtering is client-side and capped at six matches.',
    seoTitle: 'Hero Search with Autocomplete Suggestions - Free React Component',
    seoDescription:
      'An accessible hero search combobox with keyboard-driven suggestions, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['search combobox', 'autocomplete search', 'hero search', 'suggestions dropdown'],
  },
  'search-navbar-expand': {
    title: 'Expanding Navbar Search',
    description:
      'A navbar search icon that expands into a full input on click and collapses when empty.',
    customization:
      'Width animates, not `display` - a `display:none` field cannot be focused and would skip the transition, so the collapsed field stays in the DOM at zero width with `aria-hidden` and `tabIndex={-1}`. Focus is moved into the field on the next frame after it expands.',
    seoTitle: 'Expanding Navbar Search Bar - Free React Component',
    seoDescription:
      'A header search that expands from an icon to an input, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['navbar search', 'expanding search', 'header search icon', 'collapsible search'],
  },
  'search-command-modal': {
    title: 'Command Palette Search',
    description:
      'A ⌘K-style command palette opened by a button, with keyboard-navigable filtered commands.',
    customization:
      'The palette opens from a real button - the `⌘K` badge is a visual affordance only, never a bound global shortcut that would fight the host page. Arrow keys move the active row, Enter runs it, Escape and a backdrop click close. Feed it your own `commands` with optional trailing hints.',
    seoTitle: 'Command Palette Search Modal - Free React Component',
    seoDescription:
      'An accessible cmdk-style command palette with keyboard navigation, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['command palette', 'cmdk search', 'command modal', 'search dialog'],
  },
  'search-with-filters': {
    title: 'Search with Filter Chips',
    description:
      'A search field over toggleable category chips that narrow an in-memory result list.',
    customization:
      'The chips are toggle buttons carrying `aria-pressed`, so a screen reader announces their state rather than relying on colour alone; query and category compose with AND. The result count sits in an `aria-live` region so it is announced as the list reflows.',
    seoTitle: 'Search with Category Filters - Free React Component',
    seoDescription:
      'A search bar with toggleable filter chips and a live result count, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['search filters', 'faceted search', 'filter chips', 'search with categories'],
  },
  'search-recent-history': {
    title: 'Search with Recent History',
    description:
      'A search field that drops down recent searches on focus, each removable individually.',
    customization:
      'Recent searches show only when the field is focused and empty; submitting de-dupes to the front and caps the list at five. Rows use `onMouseDown` with `preventDefault` so the tap registers before the blur closes the panel, and each has its own remove button.',
    seoTitle: 'Search Bar with Recent History - Free React Component',
    seoDescription:
      'A search input with a removable recent-searches dropdown, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['recent searches', 'search history', 'search dropdown', 'recent queries'],
  },
  'search-results-highlight': {
    title: 'Search Results Highlight',
    description:
      'A search field that filters a list and wraps the matched substring in a semantic mark.',
    customization:
      'The match is wrapped in `<mark>`, which conveys relevance semantically rather than just painting a yellow span, while the surrounding text stays plain. Matching is case-insensitive and the running count is announced through an `aria-live` region.',
    seoTitle: 'Search with Highlighted Matches - Free React Component',
    seoDescription:
      'A search list that highlights matched text with a semantic mark element, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['highlight search', 'mark match', 'search highlighting', 'text match highlight'],
  },
  'search-scoped-tabs': {
    title: 'Scoped Search Tabs',
    description:
      'A search field with segmented scope tabs that narrow the same result set client-side.',
    customization:
      'The scopes are segmented toggle buttons with `aria-pressed`; an implicit "All" scope is prepended and the tabs wrap rather than overflow at 320px. Scope and query compose with AND, and the count lives in an `aria-live` region.',
    seoTitle: 'Scoped Search Tabs - Free React Component',
    seoDescription:
      'A search bar with segmented scope tabs, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['scoped search', 'search tabs', 'segmented search', 'search scope filter'],
  },
  'search-fullpage-overlay': {
    title: 'Full-Page Search Overlay',
    description:
      'A button that opens a full-viewport search overlay with a large field and live results.',
    customization:
      'The overlay is a `role="dialog"` with `aria-modal`; it autofocuses the field, closes on Escape or the close button, and announces its result count via an off-screen `aria-live` region. Results are capped at eight and filtered from your in-memory `items`.',
    seoTitle: 'Full-Page Search Overlay - Free React Component',
    seoDescription:
      'A full-screen search overlay with a large input and live results, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['fullscreen search', 'search overlay', 'full page search', 'search modal overlay'],
  },
  'search-debounced-async': {
    title: 'Debounced Async Search',
    description:
      'A search field that debounces input, shows an in-field spinner, then reveals filtered results.',
    customization:
      'A timer stands in for network latency - no request is made - so the loading, empty and result states are all real; the effect cleanup cancels a stale query when you keep typing. `aria-busy` and an `aria-live` status announce the searching and count states. Tune the wait with `delay`.',
    seoTitle: 'Debounced Async Search - Free React Component',
    seoDescription:
      'A debounced search with a loading spinner and empty state, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['debounced search', 'async search', 'search loading spinner', 'search debounce'],
  },
  'search-inline-table-filter': {
    title: 'Inline Table Filter',
    description:
      'A search field above a table that filters rows live across every column, with a scroll wrapper.',
    customization:
      'A row survives when any of its cells contains the term; the header stays put and an empty state spans all columns. The table sits in an `overflow-x-auto` wrapper so it scrolls sideways instead of widening the page at 320px, and the visible-of-total count is announced via `aria-live`.',
    seoTitle: 'Inline Table Filter Search - Free React Component',
    seoDescription:
      'A search input that filters table rows live across all columns, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['table filter', 'filter table rows', 'inline search table', 'searchable table'],
  },
};
