import type { ComponentContentMap } from '../types';

/** English prose for the docks category. Keys are component slugs. */
export const docksContent: ComponentContentMap = {
  'dock-macos-magnify': {
    title: 'macOS Magnify Dock',
    description:
      'A floating icon dock whose items swell under the pointer, the neighbours lifting less than the one you are on.',
    customization:
      'The effect is not "scale the hovered icon" - that reads as an ordinary hover state. It is a *gradient*: every item measures its own centre against the pointer and scales by a linear falloff, so the item under the cursor hits `MAX_SCALE` and its neighbours land somewhere between that and 1. `RANGE` is what makes or breaks it. At 110px it spans two or three icons and you get the wave; drop it near one icon width and the dock goes back to being a row of buttons. `transform-origin: bottom` matters just as much - anchored anywhere else the icons grow *through* the dock floor instead of rising out of it. Each icon carries a clipped `<span>` as its accessible name, deliberately not a `title` or a tooltip: magnification is a mouse affordance and communicates nothing to a screen reader, so the name has to live in the markup. Reduced motion is handled twice, and both halves are needed - the script bails before writing `--dock-scale`, and the CSS forces `transform: none` so a stale inline value from before the preference flipped cannot resurrect the effect. The end state is every icon at its true size, which is a dock, not a broken one.',
    seoTitle: 'macOS Magnify Dock - Free Animated Tailwind Component',
    seoDescription:
      'A macOS-style dock with pointer-distance magnification, accessible icon names and a reduced-motion fallback. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['macos dock', 'magnify dock', 'dock animation', 'hover scale dock', 'react dock component'],
  },
  'dock-bottom-mobile-nav': {
    title: 'Bottom Mobile Tab Bar',
    description:
      'A five-tab bottom bar with an active state, an unread badge and safe-area padding for notched phones.',
    customization:
      'Two details separate a tab bar that works on a real phone from one that only works in a screenshot. The first is `env(safe-area-inset-bottom)`: without it the labels sit under the home indicator on any modern iPhone, and you will not notice in a desktop browser. The second is the touch target - `min-h-[3.25rem]` with the label inside keeps every tab past the 44px floor even though the icon itself is 22px. The active tab is marked with `aria-current="page"` and the blue is styled off that attribute, so the colour and the announcement cannot drift apart; drive it from `usePathname()`. The badge is `aria-hidden` and the count is repeated in a clipped span - a bare red circle is decoration, "3 unread" is the information. Anything above 99 collapses to "99+" so a runaway count cannot stretch the tab. The bar is opaque rather than translucent on purpose: it lives under a thumb, over scrolling content, outdoors, and a blurred surface is where label contrast quietly dies.',
    seoTitle: 'Bottom Mobile Tab Bar - Free Responsive Navigation Component',
    seoDescription:
      'A mobile bottom tab bar with active states, unread badges and safe-area insets, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['bottom navigation', 'mobile tab bar', 'tabbar component', 'safe area inset', 'react bottom nav'],
  },
  'dock-floating-toolbar': {
    title: 'Floating Contextual Toolbar',
    description:
      'A floating strip of formatting actions with real separators and full arrow-key navigation.',
    customization:
      'This one is commands, not navigation, and the distinction drives the whole markup: `role="toolbar"` with `<button>`s rather than a `<nav>` of links. That role is a promise - it tells assistive tech the strip is a single Tab stop whose arrow keys move within it - so the roving tabindex here is not a nicety, it is what makes the promise true. Exactly one button holds `tabindex="0"` at a time; Arrow Left/Right walk and wrap, Home and End jump to the ends. Skip it and a seven-icon toolbar costs a keyboard user seven Tab presses just to get past. The toggles expose `aria-pressed` and are tinted off that same attribute, so "bold is on" is one fact rather than two that can disagree. Separators are `role="separator"` elements, not decorative `<div>`s, because the grouping they imply visually should be announced too. The focus ring is inset (`ring-inset`) rather than offset: an offset ring on a floating surface bleeds onto whatever the toolbar happens to be hovering over, which is exactly where it stops being visible.',
    seoTitle: 'Floating Contextual Toolbar - Free Accessible React Component',
    seoDescription:
      'A floating action toolbar with role="toolbar", roving tabindex arrow-key navigation, aria-pressed toggles and real separators. HTML, CSS, Tailwind, React and TypeScript.',
    keywords: ['floating toolbar', 'contextual toolbar', 'roving tabindex', 'formatting toolbar', 'react toolbar'],
  },
  'dock-vertical-rail': {
    title: 'Vertical Icon Rail Dock',
    description:
      'A floating vertical dock pinned to the left edge, with an active indicator that hangs off aria-current.',
    customization:
      'This is a dock, not a sidebar: it hugs its own content and floats at the vertical centre, so a short page and a long one get the same rail in the same place - no full-height column, no layout to reserve. The indicator bar and the tinted pill are both styled from `[aria-current="page"]`, which means the marker physically cannot point at a different item than the one a screen reader calls current. That is the entire reason to style off the attribute instead of an `.is-active` class. Every link is icon-only, so every link carries a clipped `<span>` as its accessible name - an icon rail without those is a row of unlabelled buttons to anyone not looking at it. Moving the rail to the right edge means swapping `left-4` for `right-4` and flipping the indicator to `-right-2`; that indicator is the only thing that knows which side it is on. On narrow screens, hide it and reach for the bottom tab bar instead - a left rail and a thumb do not meet.',
    seoTitle: 'Vertical Icon Rail Dock - Free Tailwind Navigation Component',
    seoDescription:
      'A floating vertical icon rail with accessible names, an aria-current active indicator and dark mode. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['vertical dock', 'icon rail', 'side navigation rail', 'floating rail', 'react vertical nav'],
  },
  'dock-labeled-icons': {
    title: 'Labeled Icon Dock',
    description: 'An icon dock whose labels fade in under the icon on hover and on keyboard focus.',
    customization:
      'The label is a permanent element that is merely faded - never `hidden`, never `display: none`. That is the point: it *is* the link\'s accessible name, so it has to stay in the accessibility tree whether or not a pointer happens to be nearby. Build the same thing as a tooltip and the icons become anonymous to every screen reader, which is the trap this component exists to avoid. The dock reserves the label row with `pb-6` and positions each label absolutely inside it, so revealing one costs no layout - without the reserved space every item would grow on hover and shove its neighbours sideways, and the dock would twitch under the pointer. The reveal fires on `group-focus-visible` as well as `group-hover`, because a keyboard user needs the label at least as much as a mouse user does. Labels are `pointer-events-none`; they overhang their neighbours and would otherwise swallow clicks meant for the icon beside them. Under reduced motion the fade lands immediately at the end state and only the slide is dropped - the label is information, so it is never the thing that gets removed.',
    seoTitle: 'Labeled Icon Dock - Free Hover Reveal Tailwind Component',
    seoDescription:
      'An icon dock with labels that reveal on hover and keyboard focus, staying in the accessibility tree at all times. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['labeled dock', 'icon dock', 'hover label', 'dock with labels', 'react icon dock'],
  },
  'dock-glass-blur': {
    title: 'Glass Blur Dock',
    description: 'A frosted-glass icon dock that lifts each item on hover, gated to fine pointers.',
    customization:
      'The surface is backdrop-blur over a /30 white fill, so it degrades to a legible translucent panel where backdrop-filter is unsupported. The hover lift is gated to `[@media(pointer:fine)]` and dropped under reduced motion, so a touch device never inherits a stuck hover.',
    seoTitle: 'Glass Blur Dock - Free Glassmorphism Tailwind Component',
    seoDescription:
      'A glassmorphic icon dock with accessible names, a pointer-gated hover lift and dark mode. Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['glass dock', 'glassmorphism', 'blur dock', 'frosted dock'],
  },
  'dock-icon-tooltips': {
    title: 'Icon Dock with Tooltips',
    description: 'An icon dock whose tooltip appears on hover and keyboard focus, above each button.',
    customization:
      'The tooltip is `aria-hidden` decoration: the real name lives in `aria-label`, so a screen reader is never handed an unnamed icon. The reveal is pure CSS on `group-hover`/`group-focus-visible`, is `pointer-events-none` so it can overhang a neighbour, and lands instantly under reduced motion.',
    seoTitle: 'Icon Dock with Tooltips - Free Accessible Tailwind Component',
    seoDescription:
      'An icon dock with hover and focus tooltips backed by aria-label, so icons keep an accessible name. Tailwind, React and TypeScript.',
    keywords: ['tooltip dock', 'icon tooltip', 'dock tooltips', 'accessible dock'],
  },
  'dock-segmented': {
    title: 'Segmented Control Dock',
    description: 'A floating segmented control that selects a single view from an icon-and-label set.',
    customization:
      'It is a `radiogroup` of `radio` buttons with exactly one `aria-checked`, so the tinted pill a sighted user sees and the state a screen reader hears are one fact. Each segment clears the 40px target with `h-10`; pass `defaultValue` to preselect and `onChange` to react to the choice.',
    seoTitle: 'Segmented Control Dock - Free Tailwind View Switcher',
    seoDescription:
      'A segmented control dock built as an accessible radiogroup with a single checked segment. Tailwind, React and TypeScript.',
    keywords: ['segmented control', 'view switcher', 'radiogroup dock', 'segmented dock'],
  },
  'dock-notification-badges': {
    title: 'Notification Badge Dock',
    description: 'An icon dock with numeric badges and a status dot, each announced to screen readers.',
    customization:
      'Every badge is `aria-hidden`; the count (or "new activity" for a bare dot) rides along in a clipped span so it is announced, not merely seen. A ring in the surface colour punches the badge off the icon, and any count above 99 collapses to "99+" so a runaway number cannot stretch the dock.',
    seoTitle: 'Notification Badge Dock - Free Tailwind Component',
    seoDescription:
      'An icon dock with accessible notification badges and a status dot, in Tailwind, React and TypeScript. Counts above 99 collapse to 99+.',
    keywords: ['badge dock', 'notification badge', 'unread count', 'dock badges'],
  },
  'dock-app-launcher': {
    title: 'App Launcher Dock',
    description: 'A launcher button that opens a grid popover of app links, closable with Escape.',
    customization:
      'The trigger owns `aria-haspopup`, `aria-expanded` and `aria-controls`; the grid is a `menu` of `menuitem` links. Escape closes it and returns focus to the trigger, so the popover is never a keyboard trap. The grid is `max-w-[calc(100vw-2rem)]` so it never runs off a 320px screen.',
    seoTitle: 'App Launcher Dock - Free Grid Popover Tailwind Component',
    seoDescription:
      'A dock launcher button that opens an accessible grid popover of apps, with Escape-to-close and focus return. Tailwind, React and TypeScript.',
    keywords: ['app launcher', 'grid popover', 'launcher dock', 'app grid'],
  },
  'dock-mini-player': {
    title: 'Mini Media Player Dock',
    description: 'A now-playing strip with transport controls, a play/pause toggle and a progress bar.',
    customization:
      'The play/pause button swaps both its icon and its `aria-label`, so the control never lies about what it does. Track text is `min-w-0` + `truncate` so a long title cannot push the strip off a 320px screen, and the progress bar is a real `progressbar` role with min/max/now, not a naked div.',
    seoTitle: 'Mini Media Player Dock - Free Tailwind Component',
    seoDescription:
      'A floating mini media player with accessible transport controls, a labelled play/pause toggle and a progressbar. Tailwind, React and TypeScript.',
    keywords: ['mini player', 'media controls', 'now playing', 'music dock'],
  },
  'dock-side-collapsible': {
    title: 'Collapsible Side Dock',
    description: 'A vertical rail that toggles between icon-only and icon-plus-label from one button.',
    customization:
      'The toggle owns `aria-expanded`, and both the label visibility and the chevron rotation read off it. When collapsed the labels become `sr-only` rather than being removed, so every item keeps its accessible name at any width. The chevron transition is dropped under reduced motion.',
    seoTitle: 'Collapsible Side Dock - Free Vertical Rail Tailwind Component',
    seoDescription:
      'A vertical dock that collapses to icons and expands to labels, keeping accessible names at every width. Tailwind, React and TypeScript.',
    keywords: ['collapsible rail', 'side dock', 'vertical dock', 'expandable sidebar'],
  },
  'dock-command-strip': {
    title: 'Command Strip Dock',
    description: 'A horizontal strip of command buttons, each with a visible label and a shortcut hint.',
    customization:
      'Each button shows its label (its accessible name) plus a `kbd` shortcut mirrored into `aria-keyshortcuts`, so the shortcut is announced too. The kbd hint only appears at `sm` and up, and the strip scrolls with `overflow-x-auto` rather than overflowing the page at 320px.',
    seoTitle: 'Command Strip Dock - Free Tailwind Shortcut Toolbar',
    seoDescription:
      'A command strip with labelled buttons and keyboard-shortcut hints exposed via aria-keyshortcuts. Tailwind, React and TypeScript.',
    keywords: ['command strip', 'shortcut toolbar', 'command dock', 'keyboard shortcuts'],
  },
  'dock-floating-actions': {
    title: 'Floating Actions Dock',
    description: 'A speed-dial FAB that fans out secondary actions above it on demand.',
    customization:
      'The main button owns `aria-expanded`. While collapsed the secondary actions are `aria-hidden` and `tabIndex={-1}`, so they leave the tab order entirely - invisible is not the same as unreachable. The staggered fan-out is dropped under reduced motion, landing on the resting state.',
    seoTitle: 'Floating Actions Dock - Free Speed-Dial FAB Component',
    seoDescription:
      'A floating action button that expands into accessible secondary actions, with reduced-motion support. Tailwind, React and TypeScript.',
    keywords: ['speed dial', 'floating action button', 'fab menu', 'floating actions'],
  },
  'dock-tab-bar': {
    title: 'Tab Bar Dock with Indicator',
    description: 'A floating tab bar whose pill indicator slides to the active tab.',
    customization:
      'The indicator is `aria-hidden` decoration positioned by translating it a whole tab width per index; `aria-current` on the active link is the announced state, so the two cannot drift. The slide is dropped under reduced motion, and the bar is `max-w-[calc(100vw-2rem)]` so it holds at 320px.',
    seoTitle: 'Tab Bar Dock with Indicator - Free Animated Tailwind Component',
    seoDescription:
      'A floating tab bar with a sliding pill indicator and aria-current active state, honouring reduced motion. Tailwind, React and TypeScript.',
    keywords: ['tab bar', 'sliding indicator', 'animated tabs', 'tab dock'],
  },
};
