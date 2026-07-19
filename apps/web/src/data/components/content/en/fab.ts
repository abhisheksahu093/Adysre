import type { ComponentContentMap } from '../types';

/** English prose for the fab category. Keys are component slugs. */
export const fabContent: ComponentContentMap = {
  'fab-basic': {
    title: 'Basic Floating Action Button',
    description:
      'A round, fixed icon button for the one action a screen is really about - with a ring that survives any backdrop.',
    customization:
      'An icon is not a name. The SVG here is `aria-hidden`, so strip the `aria-label` and a screen reader announces "button" and stops - the user is told something is clickable and nothing about what it does. That label is the component, the circle is decoration. The other detail worth keeping is the focus ring: a blue ring drawn straight onto a blue button is invisible, so the CSS stacks two shadows - an inner ring in the *page* colour, then the ring itself - and the Tailwind tab does the same with `ring-offset-2 ring-offset-white dark:ring-offset-gray-950`. Change the FAB\'s background and you must change that offset to match whatever it now sits on, or the ring disappears again. The hover lift is behind `motion-safe:`; the colour change is not, because that is feedback rather than motion. One FAB per screen - a second one means neither is *the* action.',
    seoTitle: 'Floating Action Button - Free Accessible Tailwind Component',
    seoDescription:
      'A round floating action button with a proper accessible name and a focus ring that reads on any surface. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['floating action button', 'fab component', 'tailwind fab', 'react floating button', 'icon button'],
  },
  'fab-extended': {
    title: 'Extended Floating Action Button',
    description:
      'A pill-shaped FAB carrying its icon and a visible label, for when the action needs saying out loud.',
    customization:
      'The reason to reach for this over the round one is not shape, it is that the label is *visible text* - which makes it the accessible name automatically. There is no `aria-label` to write, therefore no `aria-label` to forget to update when "New invoice" becomes "New estimate". Two strings cannot drift when there is only one. Keep the icon `aria-hidden`: it repeats the label, and a screen reader announcing "plus New invoice" is noise. Budget the width honestly - an extended FAB is `auto`-width and a long label will happily run under a phone\'s edge; two words is the working limit, and if you need three you probably need a toolbar. Below `sm` many designs swap this for the round variant, which is a `hidden sm:inline-flex` on one and the inverse on the other.',
    seoTitle: 'Extended FAB with Label - Free Tailwind CSS Component',
    seoDescription:
      'A pill-shaped extended floating action button with an icon and a visible label that doubles as its accessible name. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['extended fab', 'pill button', 'labeled floating button', 'tailwind extended fab', 'material fab'],
  },
  'fab-speed-dial': {
    title: 'Speed Dial FAB',
    description:
      'A FAB that expands into a stack of actions - the disclosure pattern, with Escape and focus return wired up.',
    customization:
      'This is a **disclosure**, not a `role="menu"`. `aria-expanded` on the trigger and `aria-controls` pointing at the `<ul>` is the entire contract, and the plus rotating into a cross hangs off that same `aria-expanded` - so the icon physically cannot point the wrong way. The three things half-built speed dials skip are all here: opening moves focus into the first action (otherwise the keyboard is still on the trigger while the eye is on a stack that appeared somewhere else); Escape collapses it; and closing returns focus to the trigger, because the button focus *was* on has just been removed from the document and focus falls to `<body>` if you do not catch it. Each action is a real `<button>` with its own `aria-label` - they are icon-only, so each one needs its own name, not a shared one. The staggered entrance sits behind `motion-safe:`/`prefers-reduced-motion` and the reduced fallback lands on the *end* state - opacity 1, no transform - so a reduced-motion user gets the stack instantly rather than frozen half-faded. Swap `DEFAULT_ACTIONS` for yours; three to five is the range where a dial beats a menu.',
    seoTitle: 'Speed Dial FAB - Free Accessible React Component',
    seoDescription:
      'An expanding speed dial floating action button using the disclosure pattern, with Escape to close, focus movement and focus restoration. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['speed dial fab', 'expanding fab', 'fab menu', 'accessible speed dial', 'react fab actions'],
  },
  'fab-with-tooltip': {
    title: 'FAB with Tooltip',
    description:
      'A round FAB whose label appears on hover and on focus - while the real accessible name lives on the button.',
    customization:
      'The trap this component exists to avoid: **a tooltip is not an accessible name.** It is a popup that assistive tech may never announce, that does not exist at all on touch, and that vanishes the moment the pointer leaves. So the button keeps its `aria-label` and the bubble is `aria-hidden` - the name is stated once where it counts, the bubble is a picture of it for sighted users, and both read from the same `label` prop so they cannot disagree. The second detail is `peer-focus-visible` sitting alongside `peer-hover`: a tooltip that only answers to the mouse is invisible to exactly the keyboard users who most need to know what an unlabelled circle does. The bubble inverts in dark mode (`bg-gray-900` → `dark:bg-gray-50`) rather than staying dark, because a tooltip has to read as a foreground object on both themes. `pointer-events-none` keeps it from ever sitting between the cursor and the button it describes.',
    seoTitle: 'FAB with Tooltip - Free Accessible Tailwind Component',
    seoDescription:
      'A floating action button with a tooltip that shows on hover and keyboard focus, with a proper aria-label as the accessible name. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['fab tooltip', 'floating button tooltip', 'accessible tooltip', 'tailwind fab hover label', 'icon button tooltip'],
  },
  'fab-scroll-to-top': {
    title: 'Scroll to Top FAB',
    description:
      'A back-to-top button that appears past a scroll threshold and leaves the tab order when it leaves the screen.',
    customization:
      'The bug in nearly every back-to-top button on the web: it is faded to `opacity: 0`, and a transparent button is **still focusable**. Tab lands on it, the focus ring draws over empty space, and a keyboard user is on a control they cannot see. The React tabs unmount it outright; the HTML and Tailwind tabs use `inert`, which drops it from both the tab order and the accessibility tree in one attribute, written by the same handler that flips the paint - so invisible and unfocusable can never come apart. `window.scrollTo` is passed `behavior: reduced ? \'auto\' : \'smooth\'` from a live `matchMedia` check, because a smooth scroll is a full-viewport animation and CSS alone cannot reach a JS scroll call. The appearance fade is behind `motion-safe:`/`prefers-reduced-motion` and its reduced fallback lands on the end state - the button still appears and disappears at the threshold, it just cuts. Tune `distance`: 320px is roughly one viewport on a phone, which is the point at which "back to top" starts meaning something.',
    seoTitle: 'Scroll to Top Button - Free Accessible React Component',
    seoDescription:
      'A scroll-to-top floating button that appears past a threshold, respects reduced motion and leaves the tab order while hidden. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['scroll to top button', 'back to top fab', 'smooth scroll button', 'react scroll to top', 'tailwind back to top'],
  },
  'fab-menu-radial': {
    title: 'Radial Menu FAB',
    description:
      'A FAB whose actions fan out along a quarter arc, using the disclosure pattern with focusable-only-when-open actions.',
    customization:
      'Actions stay mounted and toggle `invisible` (visibility, not just opacity) so a collapsed action leaves the tab order - a transparent-but-focusable control is the bug this avoids. Each action carries its own `aria-label`, the arc positions are per-item translate utilities, and the whole expansion sits behind `motion-reduce`.',
    seoTitle: 'Radial Menu FAB - Free Accessible React Component',
    seoDescription:
      'A radial speed-dial floating action button whose actions fan out on an arc, built as a disclosure with keyboard-safe visibility. Tailwind, React and TypeScript.',
    keywords: ['radial fab', 'radial menu', 'speed dial', 'fab actions'],
  },
  'fab-morphing': {
    title: 'Morphing FAB',
    description:
      'A toggle FAB that morphs its shape, colour and icon between two states, all hung off aria-pressed.',
    customization:
      'It is a toggle, so state lives on `aria-pressed`; the border-radius morph, colour swap and icon swap all follow that one attribute, so the shape can never contradict the announced state. The morph transition is dropped for reduced-motion users.',
    seoTitle: 'Morphing FAB - Free Animated Tailwind Component',
    seoDescription:
      'A morphing floating action button that toggles shape, colour and icon on aria-pressed, with reduced-motion support. Tailwind, React and TypeScript.',
    keywords: ['morphing fab', 'toggle fab', 'animated button', 'record button'],
  },
  'fab-labeled-pill': {
    title: 'Labeled Pill FAB',
    description:
      'A round FAB that expands into a labelled pill on hover and keyboard focus, its label doubling as the accessible name.',
    customization:
      'The label is real text inside the button, so it is the accessible name even while clipped to width 0 - no `aria-label` to keep in sync. It reveals on hover AND `focus-visible`, and expands leftward so a right-anchored FAB never runs off the edge.',
    seoTitle: 'Labeled Pill FAB - Free Tailwind CSS Component',
    seoDescription:
      'A floating action button that expands from a circle into a labelled pill on hover and focus, with the label as its accessible name. Tailwind, React and TypeScript.',
    keywords: ['labeled fab', 'expanding pill', 'hover label fab', 'extended fab'],
  },
  'fab-multi-action-list': {
    title: 'Multi-Action List FAB',
    description:
      'A FAB that opens a vertical list of labelled actions, each row naming itself, with Escape and focus return wired up.',
    customization:
      'Each row carries visible text, so the label is the accessible name - no per-row `aria-label` to drift. The disclosure contract is `aria-expanded` plus `aria-controls`; Escape closes it and closing returns focus to the trigger the actions came from.',
    seoTitle: 'Multi-Action List FAB - Free Accessible React Component',
    seoDescription:
      'A floating action button that expands into a vertical list of labelled actions, using the disclosure pattern with focus management. Tailwind, React and TypeScript.',
    keywords: ['multi action fab', 'fab menu list', 'labeled actions', 'speed dial list'],
  },
  'fab-chat-bubble': {
    title: 'Chat Bubble FAB',
    description:
      'A chat launcher FAB with an unread badge that opens a small message panel, the count folded into its accessible name.',
    customization:
      'The unread count lives in the button\'s `aria-label` ("Open chat, 3 unread"), not only in the coloured badge, which is `aria-hidden`. The panel is capped with `max-w-[calc(100vw-3rem)]` so it never crosses the viewport edge on a phone, and it slides in only under `motion-safe`.',
    seoTitle: 'Chat Bubble FAB - Free Accessible Tailwind Component',
    seoDescription:
      'A chat launcher floating action button with an unread badge and a message panel, with the count announced in the accessible name. Tailwind, React and TypeScript.',
    keywords: ['chat fab', 'chat launcher', 'support bubble', 'unread badge fab'],
  },
  'fab-progress-ring': {
    title: 'Progress Ring FAB',
    description:
      'A FAB wrapped in an SVG progress ring driven by a single 0-100 prop, with the ring as pure decoration.',
    customization:
      'The ring is `aria-hidden`; the button keeps a plain `aria-label`, so the arc never becomes the only way to read progress. The arc is a `stroke-dashoffset` computed from the clamped `progress`, and its transition is dropped for reduced-motion users.',
    seoTitle: 'Progress Ring FAB - Free SVG Tailwind Component',
    seoDescription:
      'A floating action button with a circular SVG progress ring driven by a 0-100 prop, decorative and reduced-motion aware. Tailwind, React and TypeScript.',
    keywords: ['progress fab', 'circular progress', 'upload button', 'svg ring fab'],
  },
  'fab-draggable-visual': {
    title: 'Draggable FAB',
    description:
      'A FAB the user can drag with a pointer or nudge with the arrow keys, so the reposition is not mouse-only.',
    customization:
      'Pointer drag alone would strand keyboard users, so the arrow keys move it too and that is stated in the `aria-label`. `touch-none` stops a drag from also scrolling the page under the finger, and the position is applied as a `transform` offset from the anchored corner.',
    seoTitle: 'Draggable FAB - Free Interactive React Component',
    seoDescription:
      'A draggable floating action button with pointer and keyboard repositioning and touch-safe drag handling. Tailwind, React and TypeScript.',
    keywords: ['draggable fab', 'movable button', 'pointer drag', 'repositionable fab'],
  },
  'fab-bottom-sheet-trigger': {
    title: 'Bottom Sheet FAB',
    description:
      'A FAB that opens a modal bottom sheet of actions, with Escape to close and focus that moves in and returns.',
    customization:
      'The sheet is a modal dialog: `aria-modal`, an Escape close, focus moved to the first action on open, and focus returned to the trigger on close. The scrim and the sheet slide and fade only under `motion-safe`.',
    seoTitle: 'Bottom Sheet FAB - Free Accessible React Component',
    seoDescription:
      'A floating action button that opens a modal bottom sheet with focus management and reduced-motion support. Tailwind, React and TypeScript.',
    keywords: ['bottom sheet fab', 'action sheet', 'mobile sheet', 'dialog trigger'],
  },
  'fab-badge-count': {
    title: 'Badge Count FAB',
    description:
      'A FAB with a numeric badge whose count is announced in the accessible name and clamps to 99+.',
    customization:
      'The count belongs in the accessible name ("Notifications, 5 unread"), so the badge is `aria-hidden` and the `aria-label` carries the number. Counts over 99 clamp to "99+" so the badge cannot grow wide enough to escape the FAB.',
    seoTitle: 'Badge Count FAB - Free Accessible Tailwind Component',
    seoDescription:
      'A floating action button with a numeric notification badge whose count is announced and capped at 99+. Tailwind, React and TypeScript.',
    keywords: ['badge fab', 'notification count', 'unread fab', 'count badge'],
  },
  'fab-mini': {
    title: 'Mini FAB',
    description:
      'A compact 44px FAB - trimmed to the minimum comfortable touch target and no smaller.',
    customization:
      'A mini FAB is 44px, not smaller: that is the floor for a comfortable touch target, so "mini" trims the standard 56px to the minimum and stops. The `aria-label` remains the whole accessible name; the smaller glyph does not change that.',
    seoTitle: 'Mini FAB - Free Compact Tailwind Component',
    seoDescription:
      'A compact 44px mini floating action button that stays at the minimum comfortable touch target. Tailwind, React and TypeScript.',
    keywords: ['mini fab', 'small fab', 'compact button', 'icon button'],
  },
};
