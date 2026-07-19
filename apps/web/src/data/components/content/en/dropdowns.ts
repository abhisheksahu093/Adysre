import type { ComponentContentMap } from '../types';

/** English prose for the dropdowns category. Keys are component slugs. */
export const dropdownsContent: ComponentContentMap = {
  'dropdown-basic': {
    title: 'Basic Dropdown',
    description: 'A menu button with the full keyboard model - arrows, Home/End, Escape, focus restore.',
    customization:
      'The WAI-ARIA menu button pattern is a bargain: `aria-haspopup="menu"` PROMISES a screen reader user that arrow keys work, and `role="menu"`/`role="menuitem"` repeat it on every row. Ship the roles without the key handling and you have told someone to press Down and then done nothing - measurably worse than a plain button and a list, which at least announces what it is. `aria-expanded` is the attribute people forget to UPDATE: a hardcoded `"false"` actively lies about a menu that is open on screen, so bind it to state. Down on the closed trigger opens onto the first item and Up onto the last; the ring wraps. These are menus of ACTIONS - for picking a value from a list you want a listbox (`forms-select`), because menuitem and option are not interchangeable.',
    seoTitle: 'Accessible Dropdown Menu - Free React Component',
    seoDescription:
      'A menu button dropdown with role="menu", arrow keys, Home/End, Escape and focus restore, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['dropdown menu', 'menu button', 'accessible dropdown', 'react dropdown', 'keyboard menu'],
  },
  'dropdown-with-icons': {
    title: 'Dropdown with Icons',
    description: 'A menu with a glyph on every row - icons as scanning aids, labels as the names.',
    customization:
      'Every icon is `aria-hidden` and every row keeps its text label. An icon beside a word is a scanning aid for people who already know the menu; it is never the name of the action. Strip the labels and you have a row of glyphs announcing "button, button, button". Draw them with `stroke="currentColor"` so they inherit the row\'s colour - including hover and the dark-mode shift - instead of carrying their own `dark:` variants and drifting out of step with the text beside them. At rest the glyph sits a step quieter than its label (`text-gray-500`) and snaps to `currentColor` on hover: the word is the action, the icon is the hint. `danger` is a flag on the item rather than a colour at the call site, so danger looks the same everywhere by construction.',
    seoTitle: 'Dropdown Menu with Icons - Free React Component',
    seoDescription:
      'An accessible dropdown menu with an icon per item, aria-hidden glyphs and full keyboard navigation, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['dropdown with icons', 'icon menu', 'menu icons', 'react dropdown icons'],
  },
  'dropdown-grouped': {
    title: 'Grouped Dropdown',
    description: 'A menu split into labelled sections with separators - groups that are real semantics.',
    customization:
      'Each section is a `role="group"` with `aria-labelledby` pointing at its own heading, so a screen reader announces "Editing, group" instead of running twelve unrelated commands together in one flat list. The heading is `aria-hidden` AND referenced by `aria-labelledby` - not a contradiction: labelledby reads a hidden element\'s text, so the group is named once, as a name, rather than also announced as a stray text node inside itself. The arrow-key ring is built by flattening the GROUPS, never by querying the DOM, which would sweep up labels and separators as focus stops. Arrows cross group boundaries without pausing: groups organise the eye, they do not partition the keyboard. Keep the section labels at `text-gray-500` or darker - uppercase 11px is already hard to read; do not also make it faint.',
    seoTitle: 'Grouped Dropdown Menu with Sections - Free React Component',
    seoDescription:
      'A dropdown menu with labelled groups, separators and role="group" semantics plus full keyboard navigation. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['grouped dropdown', 'menu groups', 'dropdown sections', 'menu separator'],
  },
  'dropdown-nested': {
    title: 'Nested Dropdown',
    description: 'A menu with a submenu that flies out sideways, driven by Left and Right.',
    customization:
      'The direction is the model. ArrowRight on a parent opens the flyout and lands on its first item; ArrowLeft closes it and puts focus back on the parent; Up/Down stay inside whichever level you are on. Left and Right map onto the direction the panel physically travels - the geometry is teaching the shortcut, which is why the submenu goes sideways rather than expanding in place. The parent row is both a `menuitem` and a menu trigger, carrying its own `aria-haspopup` and `aria-expanded`. The detail most implementations miss is that Escape inside a submenu closes ONE level: `stopPropagation` is load-bearing there, or the event also reaches the parent handler and the whole stack collapses - the user asked to step back, not to be ejected. The flyout overlaps its parent by 4px so the pointer cannot fall through a diagonal dead zone on the way over.',
    seoTitle: 'Nested Dropdown with Submenu - Free Accessible React Component',
    seoDescription:
      'A dropdown with a sideways-opening submenu driven by ArrowLeft/ArrowRight, with per-level Escape, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['nested dropdown', 'submenu', 'flyout menu', 'multi level menu', 'cascading menu'],
  },
  'dropdown-profile': {
    title: 'Profile Dropdown',
    description: 'An avatar trigger with an identity header, account items and sign out.',
    customization:
      'The header is not a menuitem. Your name and email are information, not commands - putting them on the arrow-key ring adds a stop that does nothing when you press Enter, so they sit outside the item list entirely. That is also why the trigger carries its own `aria-label` naming the person: an avatar has no text, and the popup\'s name is not the button\'s name. The image is `alt=""` because the name is beside it in text and "Avery Chen, image" then "Avery Chen" is noise. Sign out is separated but deliberately NOT red: it is reversible - you log back in - and spending the alarm here leaves nothing for "delete account" one row below. The menu is anchored `right-0`, since an avatar lives in the top-right corner and a menu growing rightward from it goes off the page. The email truncates rather than letting a 14rem box stretch to fit the longest address a user might have.',
    seoTitle: 'Profile Dropdown with Avatar - Free React Component',
    seoDescription:
      'An account dropdown with an avatar trigger, identity header, menu items and sign out, fully keyboard navigable. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['profile dropdown', 'avatar menu', 'account dropdown', 'user menu', 'sign out menu'],
  },
  'dropdown-mega': {
    title: 'Mega Menu Dropdown',
    description: 'A wide multi-column navigation panel where every link is a menuitem on one keyboard ring.',
    customization:
      'A mega menu is still a menu button, not a special case: `aria-haspopup="menu"` and `role="menu"` hold, and the arrow-key ring is the columns flattened in reading order, so Down walks column one top-to-bottom then jumps to the top of column two. Columns organise the eye; they never partition the keyboard. Each column is a `role="group"` with its own label. The panel is capped at `w-[min(44rem,calc(100vw-2rem))]` and its grid collapses to one column below `sm`, so it can never escape a 320px viewport.',
    seoTitle: 'Mega Menu Dropdown - Free Accessible React Component',
    seoDescription:
      'A responsive mega menu with grouped columns, menuitem links and full keyboard navigation, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['mega menu', 'dropdown navigation', 'multi column menu', 'mega dropdown'],
  },
  'dropdown-multi-column': {
    title: 'Multi-Column Dropdown',
    description: 'A menu that lays its items into balanced columns for scanning, on one wrapping ring.',
    customization:
      'The columns are for scanning; the arrow-key ring is still the items flattened in reading order and wrapping, so the keyboard behaves exactly like a single-column menu. Each column is a labelled `role="group"`. Below `sm` the grid collapses to one column and the panel is capped at `calc(100vw-2rem)`, so a long list never pushes off a phone screen.',
    seoTitle: 'Multi-Column Dropdown Menu - Free React Component',
    seoDescription:
      'A dropdown menu laid out in responsive columns with grouped sections and full keyboard navigation, in Tailwind, React and TypeScript.',
    keywords: ['multi column dropdown', 'column menu', 'grid dropdown', 'menu columns'],
  },
  'dropdown-search-filter': {
    title: 'Searchable Dropdown',
    description: 'A menu with a search field that narrows the items as you type.',
    customization:
      'The search field owns `aria-controls` and `aria-expanded`; the list below stays a `role="menu"` of actions. ArrowDown drops focus from the field onto the first match, the item ring wraps, and ArrowUp off the top row returns to the field - so the whole thing is reachable without touching the mouse. An empty result set shows a plain "No matches" row rather than an empty box. The panel is width-capped and scrolls internally, never past a 320px viewport.',
    seoTitle: 'Searchable Dropdown Menu with Filter - Free React Component',
    seoDescription:
      'A dropdown menu with a live search filter, keyboard navigation and an empty state, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['searchable dropdown', 'filter dropdown', 'search menu', 'autocomplete menu'],
  },
  'dropdown-checkbox-multi': {
    title: 'Multi-Select Dropdown',
    description: 'A menu of checkbox rows that stays open so you can tick several at once.',
    customization:
      'Each row is a `role="menuitemcheckbox"` carrying its own `aria-checked`, and toggling one deliberately leaves the menu OPEN - the whole point of multi-select is to tick several without the panel closing under you. The check-mark glyph is `aria-hidden`; `aria-checked` is the state a screen reader actually reads. The trigger shows a count badge so the current selection is legible without opening. Value is controlled, so the parent owns the source of truth.',
    seoTitle: 'Multi-Select Checkbox Dropdown - Free React Component',
    seoDescription:
      'A multi-select dropdown with menuitemcheckbox rows, a count badge and full keyboard navigation, in Tailwind, React and TypeScript.',
    keywords: ['multi select dropdown', 'checkbox dropdown', 'menuitemcheckbox', 'filter dropdown'],
  },
  'dropdown-radio-single': {
    title: 'Single-Select Dropdown',
    description: 'A menu where exactly one row is checked and picking a new one closes it.',
    customization:
      'Exactly one row is `aria-checked` at a time via `role="menuitemradio"`, and choosing a new one closes the menu - single-select is a decision, not an accumulation. The trigger shows the current value so the answer is visible without opening. The tick is `aria-hidden`; `aria-checked` carries the meaning. This is a menu of radios, not a `listbox` - use it when the options are few and read as commands; reach for `forms-select` when they are a long value list.',
    seoTitle: 'Single-Select Radio Dropdown - Free React Component',
    seoDescription:
      'A single-select dropdown with menuitemradio rows, a value-showing trigger and keyboard navigation, in Tailwind, React and TypeScript.',
    keywords: ['single select dropdown', 'radio dropdown', 'menuitemradio', 'select menu'],
  },
  'dropdown-account-switch': {
    title: 'Account Switcher Dropdown',
    description: 'A workspace switcher with avatars, the active one checked, and an add action.',
    customization:
      'Each workspace is a `role="menuitemradio"` because switching PICKS the active one - exactly one is `aria-checked`, marked with a trailing tick. "Add workspace" below the divider is a plain `menuitem`: it is an action, not one of the choices, and both sit on one arrow-key ring so it walks straight through the divider. Avatars are gradient initials, never images, so the component ships with no network dependency. Names and emails truncate rather than stretching the 18rem panel to fit the longest address.',
    seoTitle: 'Account Switcher Dropdown - Free React Component',
    seoDescription:
      'A workspace and account switcher dropdown with avatars, an active radio state and an add action, in Tailwind, React and TypeScript.',
    keywords: ['account switcher', 'workspace switcher', 'team switcher', 'account dropdown'],
  },
  'dropdown-notification': {
    title: 'Notification Dropdown',
    description: 'A bell trigger with an unread count opening a menu of notification rows.',
    customization:
      'The bell carries the unread count in its `aria-label` - a red dot alone says nothing to a screen reader. The panel is a `role="menu"`: "Mark all read", every notification row, and "View all" share one arrow-key ring in reading order, so the dividers never trap focus. Unread rows get a solid dot; read rows keep a transparent placeholder so titles stay aligned. Anchored `right-0` because a bell lives top-right, and width-capped so it never leaves a 320px viewport.',
    seoTitle: 'Notification Dropdown with Bell - Free React Component',
    seoDescription:
      'A notification bell dropdown with an unread count, notification rows, mark-all-read and view-all actions, in Tailwind, React and TypeScript.',
    keywords: ['notification dropdown', 'notification bell', 'notification menu', 'alerts dropdown'],
  },
  'dropdown-color-swatches': {
    title: 'Color Swatch Dropdown',
    description: 'A grid of colour swatches as a listbox, navigated with two-dimensional arrows.',
    customization:
      'Picking a colour is choosing a VALUE, so this is a `role="listbox"` of `role="option"` with `aria-selected`, not a menu - and Enter or Space commit the highlighted swatch. Arrows move in two dimensions across the grid: Left/Right by one, Up/Down by a full row, clamped at the edges. Each option is `aria-label`-led by its colour name so the choice is announced as "Blue", not by hex. The swatch background is the single place a raw colour value is allowed - here the colour literally IS the data.',
    seoTitle: 'Color Swatch Picker Dropdown - Free React Component',
    seoDescription:
      'A colour picker dropdown built as a listbox of swatches with two-dimensional arrow navigation and aria-selected, in Tailwind, React and TypeScript.',
    keywords: ['color picker dropdown', 'swatch picker', 'color swatches', 'listbox grid'],
  },
  'dropdown-command': {
    title: 'Command Palette Dropdown',
    description: 'A search-driven command list steered by a virtual highlight, combobox-style.',
    customization:
      'A command palette keeps focus in the input and moves a virtual highlight through the list with `aria-activedescendant` - the combobox pattern, not roving focus, because you have to keep typing while you steer. The input is a `role="combobox"` pointing at a `role="listbox"`; ArrowUp/Down wrap the highlight and Enter runs it. Filtering resets the highlight to the top so Enter never fires a stale command. The panel is width-capped and scrolls internally, so it survives a 320px screen.',
    seoTitle: 'Command Palette Dropdown - Free Accessible React Component',
    seoDescription:
      'A command palette dropdown with a combobox input, aria-activedescendant highlight, live filtering and keyboard run, in Tailwind, React and TypeScript.',
    keywords: ['command palette', 'command menu', 'combobox dropdown', 'cmdk'],
  },
  'dropdown-split-button': {
    title: 'Split Button Dropdown',
    description: 'A primary action button joined to a chevron that opens a menu of alternatives.',
    customization:
      'The primary half runs the default action on click; only the narrow chevron half owns the menu, so IT - not the whole control - carries `aria-haspopup`, `aria-expanded` and its own `aria-label` ("More actions"). Splitting the roles this way means a click on the big button never accidentally opens the menu. The secondary list is an ordinary `role="menu"` with the standard arrow-key ring, anchored `right-0` and width-capped so it never escapes a 320px viewport.',
    seoTitle: 'Split Button Dropdown - Free React Component',
    seoDescription:
      'A split button with a primary action and an attached dropdown of secondary actions, fully keyboard navigable, in Tailwind, React and TypeScript.',
    keywords: ['split button', 'split dropdown', 'button with menu', 'primary action dropdown'],
  },
};
