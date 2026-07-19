import type { ComponentContentMap } from '../types';

/** English prose for the menus category. Keys are component slugs. */
export const menusContent: ComponentContentMap = {
  'menu-context-right-click': {
    title: 'Right-Click Context Menu',
    description:
      'A context menu that opens at the pointer on right-click, scoped to its own area so the native browser menu still works elsewhere.',
    customization:
      'The wrapper calls `preventDefault` on `contextmenu` only inside itself, and positions the menu with `left`/`top` relative to the area rather than the viewport, so it can never break the page or escape its container. Escape or any outside press closes it; arrow keys rove the items.',
    seoTitle: 'Right-Click Context Menu - Free React Component',
    seoDescription:
      'An accessible right-click context menu scoped to a demo area, with keyboard navigation, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['context menu', 'right-click menu', 'contextual menu', 'react context menu'],
  },
  'menu-kebab-row-actions': {
    title: 'Kebab Row Actions Menu',
    description:
      'A three-dot overflow button on a list row that opens a menu of row actions.',
    customization:
      'The kebab carries a real `aria-label` and `aria-haspopup`, and the menu is anchored to the row’s right edge in an absolutely positioned layer so it never widens the row. Arrow keys rove, Escape returns focus to the trigger, and a `danger` action renders in red.',
    seoTitle: 'Kebab Menu Row Actions - Free React Component',
    seoDescription:
      'An accessible three-dot overflow menu for list and table row actions, in Tailwind, React and TypeScript. Keyboard-navigable and MIT licensed.',
    keywords: ['kebab menu', 'row actions', 'overflow menu', 'three dot menu'],
  },
  'menu-nested-submenu': {
    title: 'Nested Submenu',
    description:
      'A menu with a flyout submenu that opens sideways, with full arrow-key navigation between levels.',
    customization:
      'ArrowRight opens the submenu and ArrowLeft (or Escape) steps back one level rather than closing the whole stack - the detail most implementations miss. Any item can carry an `items` array to become a submenu parent; the chevron and `aria-haspopup` are added automatically.',
    seoTitle: 'Nested Submenu Flyout - Free React Component',
    seoDescription:
      'An accessible nested menu with a keyboard-navigable flyout submenu, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['nested menu', 'submenu', 'flyout menu', 'multi-level menu'],
  },
  'menu-menubar-desktop': {
    title: 'Desktop Menu Bar',
    description:
      'A horizontal application menu bar of File / Edit / View menus with desktop-style keyboard navigation.',
    customization:
      'A true `role="menubar"`: Left/Right move between the top-level items, ArrowDown opens the focused one, and once a menu is open Left/Right walk sideways to the adjacent menu. Feed it `sections`, each with its own `items`; Escape closes and restores focus to the trigger.',
    seoTitle: 'Desktop Menu Bar - Free React Component',
    seoDescription:
      'An accessible desktop-style application menu bar with full keyboard navigation, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['menu bar', 'menubar', 'application menu', 'desktop menu'],
  },
  'menu-mobile-bottom-sheet': {
    title: 'Mobile Bottom Sheet Menu',
    description:
      'A bottom action sheet that slides up over a scrim, with large touch targets and a drag handle.',
    customization:
      'The scrim and sheet are positioned within the component’s own bounded panel for the demo; in a real full-screen app you render the same markup at the document root with `fixed`. Every action is at least 44px tall, a scrim tap or Escape closes, and arrow keys rove the list.',
    seoTitle: 'Mobile Bottom Sheet Menu - Free React Component',
    seoDescription:
      'An accessible mobile action sheet with a scrim, drag handle and large tap targets, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['bottom sheet', 'action sheet', 'mobile menu', 'ios menu'],
  },
  'menu-icon-grid-launcher': {
    title: 'Icon Grid App Launcher',
    description:
      'An app-launcher popover of gradient icon tiles arranged in a grid, with two-dimensional arrow-key navigation.',
    customization:
      'Pass `tiles` with a Tailwind `gradient` per app and a `columns` count. Because the layout is a grid, Left/Right move by one and Up/Down move by a full row; the initial of each label stands in for a real icon so nothing ships a broken image. Escape closes and restores focus.',
    seoTitle: 'Icon Grid App Launcher Menu - Free React Component',
    seoDescription:
      'An accessible app-launcher grid menu with 2D keyboard navigation, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['app launcher', 'icon grid menu', 'apps menu', 'grid menu'],
  },
  'menu-account-menu': {
    title: 'Account Menu',
    description:
      'A user menu triggered by an avatar, with an identity header above the profile, settings and sign-out commands.',
    customization:
      'Initials and a gradient avatar are derived from `name`. The identity header is presentational - not a `menuitem` - so arrow keys skip it and land on the first real command; the sign-out entry renders in red via its `danger` flag. Escape closes and restores focus to the trigger.',
    seoTitle: 'Account User Menu - Free React Component',
    seoDescription:
      'An accessible account menu with an avatar trigger and identity header, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['account menu', 'user menu', 'avatar menu', 'profile dropdown'],
  },
  'menu-filter-checkbox-menu': {
    title: 'Filter Checkbox Menu',
    description:
      'A multi-select filter menu of checkboxes with a live count badge and a clear-all action.',
    customization:
      'Each option is a `role="menuitemcheckbox"` with a real `aria-checked`, and activating one does not close the menu because filtering is a multi-select act. Drive it with `defaultSelected` and read changes from `onChange`; the trigger shows a live count and the footer clears every selection.',
    seoTitle: 'Filter Checkbox Menu - Free React Component',
    seoDescription:
      'An accessible multi-select filter menu with menuitemcheckbox options and a count badge, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['filter menu', 'checkbox menu', 'multi-select menu', 'menuitemcheckbox'],
  },
  'menu-pinnable-favorites': {
    title: 'Pinnable Favorites Menu',
    description:
      'A menu whose items can be pinned into a Favorites group at the top, toggled with a star.',
    customization:
      'Each row is a `role="menuitemcheckbox"` where checked means pinned; toggling the star moves the row between the Pinned and All groups without closing the menu. The group headings are `role="presentation"` so arrow-key roving flows across every item regardless of group.',
    seoTitle: 'Pinnable Favorites Menu - Free React Component',
    seoDescription:
      'An accessible menu with pinnable favorites that regroup on toggle, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['pinnable menu', 'favorites menu', 'pin to top', 'grouped menu'],
  },
  'menu-keyboard-full': {
    title: 'Full Keyboard Menu',
    description:
      'The reference keyboard menu: wrapping arrows, Home/End, Enter/Space, Escape, and typeahead that jumps to the first matching item.',
    customization:
      'This is the pattern the `role="menu"` contract promises. Arrows wrap top-to-bottom, Home/End jump the ends, Enter/Space activate, Escape closes and restores focus, and typing a letter jumps to the first item whose label starts with what you typed - the buffer clearing itself after a short pause.',
    seoTitle: 'Full Keyboard Accessible Menu - Free React Component',
    seoDescription:
      'A fully keyboard-accessible menu with typeahead, wrapping arrows and Home/End, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['keyboard menu', 'accessible menu', 'menu typeahead', 'aria menu'],
  },
};
