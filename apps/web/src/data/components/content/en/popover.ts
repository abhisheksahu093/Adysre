import type { ComponentContentMap } from '../types';

/** English prose for the popover category. Keys are component slugs. */
export const popoverContent: ComponentContentMap = {
  'popover-basic': {
    title: 'Basic Popover',
    description: 'A click-triggered panel anchored to its button, with Escape and outside-click dismiss.',
    customization:
      'A popover is a modal\'s opposite number: it floats over the page without taking it away, so there is no focus trap and no scroll lock here - and there should not be. What it still owes is the rest of the contract: `aria-expanded` bound to state, `aria-controls` naming the panel, Escape to close, and focus handed back to the trigger so Tab does not resume from a node that no longer exists. `aria-haspopup="dialog"`, not `"menu"` - this holds prose, and promising a menu makes a screen reader announce arrow-key navigation that does not exist. The outside-click listener uses `mousedown` rather than `click` so the panel is gone before the element underneath reacts.',
    seoTitle: 'Click Popover - Free Accessible React Component',
    seoDescription:
      'A click-triggered popover with aria-expanded, Escape, focus restore and outside-click dismiss, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['popover', 'click popover', 'accessible popover', 'react popover', 'dropdown panel'],
  },
  'popover-tooltip': {
    title: 'Tooltip',
    description:
      'A hint that opens on hover AND keyboard focus, with role="tooltip" and aria-describedby.',
    customization:
      'The hover-only tooltip is the most common accessibility regression on the web: it works perfectly for the person who wrote it and does not exist for anyone navigating by keyboard - or on any touch screen, which cannot produce hover at all. So there are four listeners in two pairs: `mouseenter`/`mouseleave` and `focus`/`blur`. The focus pair is not an enhancement, it is half the component. `aria-describedby` is the other half: without that id link the bubble is a floating div that happens to sit near a button, semantically unrelated to it. It is hidden with `visibility`, never `display: none`, because a display:none element leaves the accessibility tree and takes the description with it. Escape dismisses it even while hovered - per APG, a bubble may be covering the very thing you are trying to read. Keep it plain text: a tooltip may not contain interactive content (reach for `popover-rich-content` instead). Tune `delay` to stop it strobing as the pointer crosses a row of controls.',
    seoTitle: 'Accessible Tooltip with Hover and Focus - Free React Component',
    seoDescription:
      'A tooltip that opens on hover and keyboard focus, with role="tooltip", aria-describedby and Escape to dismiss. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['tooltip', 'accessible tooltip', 'hover tooltip', 'aria-describedby', 'react tooltip'],
  },
  'popover-rich-content': {
    title: 'Rich Content Popover',
    description: 'A popover with a heading, body copy and an action - labelled by its own heading.',
    customization:
      'The button inside is exactly why this is a `role="dialog"` and not a tooltip: a tooltip may not contain interactive content, because you cannot hover your way into a bubble that closes the moment the pointer leaves the trigger. That single fact decides the whole component - click-triggered, focus moved into the panel on open, `aria-labelledby` pointing at the visible `<h3>` rather than a hand-written `aria-label` that will drift from it. The focus move uses `requestAnimationFrame` because the panel does not exist until React commits the render. Note the link colour flips to `blue-300` on dark: `blue-700` is tuned for white and fails AA outright on a near-black panel.',
    seoTitle: 'Rich Popover with Heading and Action - Free React Component',
    seoDescription:
      'An accessible popover holding a heading, copy and a call to action, labelled by its own heading, in HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['rich popover', 'popover with button', 'popover card', 'popover dialog'],
  },
  'popover-menu': {
    title: 'Popover Menu',
    description: 'A popover holding menu items, with the full arrow-key model and Escape.',
    customization:
      'The moment a popover holds a list of ACTIONS it stops being a dialog and becomes a menu, and the contract changes with it: `aria-haspopup="menu"` promises the arrow-key model, `role="menu"`/`role="menuitem"` describe it, and the key handling is the promise being kept. Shipping the roles without the keys is the worse failure - it tells a screen reader user to press Down and then does nothing when they do. Down on the closed trigger opens onto the first item, Up onto the last; the ring wraps both ways because a menu is a ring, not a list with two dead ends. `<li role="none">` is not noise: `role="menu"` only permits menuitem children and a stray listitem breaks the structure. Style `:focus-visible` alongside `:hover` - arrow keys move real focus, and that highlight is the cursor.',
    seoTitle: 'Popover Menu with Keyboard Navigation - Free React Component',
    seoDescription:
      'A popover menu with role="menu", arrow keys, Home/End, Escape and focus restore, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['popover menu', 'menu popover', 'keyboard menu', 'accessible menu', 'menuitem'],
  },
  'popover-arrow': {
    title: 'Popover with Arrow',
    description: 'An anchored popover with a pointing tail that says which control it belongs to.',
    customization:
      'Worth reaching for when several triggers sit close together and "the panel under the button" is ambiguous. The arrow is a rotated square with only `border-l` and `border-t`, not a CSS border triangle: a triangle is one solid colour and cannot carry the panel\'s 1px border across its two visible faces, so on a bordered panel it reads as a blob stuck to the edge. Rotated 45°, those two borders become the tail\'s outward-facing edges and continue the panel\'s outline - give it all four and you get a diamond seam. Recolour the arrow WITH the panel in dark mode or it stays a white chip on a dark card, which is the most visible way to get this wrong. It is `aria-hidden`: it draws a relationship `aria-controls` has already stated properly.',
    seoTitle: 'Popover with Arrow Pointer - Free Tailwind CSS Component',
    seoDescription:
      'An anchored popover with a CSS arrow that continues the panel border, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['popover arrow', 'popover with pointer', 'css arrow', 'tooltip arrow', 'anchored popover'],
  },
  'popover-form': {
    title: 'Inline Form Popover',
    description: 'A click-triggered panel holding a small edit form, with focus moved into the field.',
    customization:
      'An inline form is a `role="dialog"` labelled by its heading, opened on click and with focus moved into the first field on open (via `requestAnimationFrame`, since the panel does not exist until React commits the render). Submitting and Cancel both close and return focus to the trigger; Escape does the same. The panel is `w-72 max-w-[calc(100vw-2rem)]`, so it never escapes a 320px viewport.',
    seoTitle: 'Inline Edit Form Popover - Free Accessible React Component',
    seoDescription:
      'A popover with an inline edit form, focus moved into the field on open, Escape and outside-click dismiss, in Tailwind, React and TypeScript.',
    keywords: ['form popover', 'inline edit', 'edit popover', 'popover form'],
  },
  'popover-confirm': {
    title: 'Confirm Popover',
    description: 'A lightweight confirmation with role="alertdialog", focused on the safe action.',
    customization:
      'This is a `role="alertdialog"`, not a plain dialog: it interrupts to ask about a consequence, so it is labelled by its title AND described by its message. Focus lands on the SAFE choice (Cancel) on open - a destructive default one keystroke from Enter is a trap. Escape cancels and restores focus to the trigger. Recolour the confirm button per intent; the red here signals an irreversible action.',
    seoTitle: 'Confirm Action Popover - Free Accessible React Component',
    seoDescription:
      'A confirmation popover with role="alertdialog", a safe default focus, Escape and outside-click dismiss, in Tailwind, React and TypeScript.',
    keywords: ['confirm popover', 'alertdialog', 'confirmation dialog', 'delete confirm'],
  },
  'popover-user-card': {
    title: 'User Card Popover',
    description: 'A profile card in a dialog: gradient-initials avatar, name, role and a follow action.',
    customization:
      'A `role="dialog"` labelled by the person\'s name, holding a Follow action - which is precisely why it is a dialog and not a tooltip. The avatar is initials on a gradient, so there is no external image to load or fail. Names and roles `truncate` inside a `min-w-0` column so a long value cannot force the panel wider than the viewport.',
    seoTitle: 'User Profile Card Popover - Free React Component',
    seoDescription:
      'A user card popover with a gradient-initials avatar, name, role and follow action, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['user card', 'profile popover', 'hover profile', 'avatar popover'],
  },
  'popover-color-picker': {
    title: 'Color Picker Popover',
    description: 'A swatch grid in a dialog, wired as a radiogroup so the choice is single-select.',
    customization:
      'Swatches are `role="radio"` inside a `role="radiogroup"` - a colour choice is single-select, and that pairing is what makes a reader announce "6 of 8, selected". Each swatch carries an `aria-label` because a colour block has no text of its own. Pass `colors` as objects with a literal Tailwind class (e.g. `bg-blue-500`) so the JIT compiler can see and generate it - a computed class name would be purged.',
    seoTitle: 'Color Picker Popover - Free Accessible React Component',
    seoDescription:
      'A colour swatch popover wired as a radiogroup with per-swatch labels, Escape and outside-click dismiss, in Tailwind, React and TypeScript.',
    keywords: ['color picker', 'swatch popover', 'radiogroup', 'colour picker'],
  },
  'popover-date-mini': {
    title: 'Mini Date Picker Popover',
    description: 'A compact month grid in a dialog: leading blanks, pressed selection, pick-to-close.',
    customization:
      'A single-month grid built from the Date API: `getDay()` of the 1st gives the leading blank count and day 0 of the next month gives the last day. The selected day is a real `aria-pressed` button, and picking one closes and restores focus to the trigger. `month` is 0-based to match the Date constructor. The panel stays inside a 320px viewport via `w-64 max-w-[calc(100vw-2rem)]`.',
    seoTitle: 'Mini Date Picker Popover - Free React Component',
    seoDescription:
      'A compact single-month date-picker popover with a Date-driven grid, pressed selection and Escape dismiss, in Tailwind, React and TypeScript.',
    keywords: ['date picker', 'mini calendar', 'month popover', 'date popover'],
  },
  'popover-emoji': {
    title: 'Emoji Picker Popover',
    description: 'A grid of reaction buttons in a dialog, each with a real accessible name.',
    customization:
      'A grid of reaction buttons in a `role="dialog"`. Each button carries an `aria-label` because the glyph alone announces inconsistently across screen readers, and the emoji itself is `aria-hidden` so it is not read twice. Picking one closes and restores focus to the trigger. No image assets - the emoji are text.',
    seoTitle: 'Emoji Reaction Picker Popover - Free React Component',
    seoDescription:
      'An emoji reaction popover with a labelled button grid, Escape and outside-click dismiss, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['emoji picker', 'reaction popover', 'emoji popover', 'reactions'],
  },
  'popover-share': {
    title: 'Share Popover',
    description: 'A dialog with a read-only link field, a copy button and stacking destination chips.',
    customization:
      'A `role="dialog"` with a read-only link field and a Copy button that selects the text, writes to the clipboard where available, and flips to a confirmed state. The input/button row is `flex-col` on mobile and `sm:flex-row` from 640px, and the destination chips wrap - so nothing overflows a 320px viewport. The Clipboard call is optional-chained to degrade quietly where the API is blocked.',
    seoTitle: 'Share Link Popover - Free Accessible React Component',
    seoDescription:
      'A share popover with a copy-to-clipboard link field and destination chips, Escape and outside-click dismiss, in Tailwind, React and TypeScript.',
    keywords: ['share popover', 'copy link', 'share menu', 'clipboard popover'],
  },
  'popover-nested': {
    title: 'Nested Menu Popover',
    description: 'A menu whose last item opens a submenu - flying out on desktop, stacking at 320px.',
    customization:
      'A `role="menu"` whose last item opens a nested `role="menu"`: `aria-haspopup="menu"` and `aria-expanded` describe the branch, ArrowRight/Enter open it, ArrowLeft/Escape step back one layer at a time. The submenu flies out to the right on `sm+` but stacks inline at 320px, so it never leaves a narrow viewport - the single hardest part of a real flyout. Leaf clicks close the whole tree and return focus to the trigger.',
    seoTitle: 'Nested Submenu Popover - Free Accessible React Component',
    seoDescription:
      'A nested menu popover with a keyboard-navigable submenu that flies out on desktop and stacks on mobile, in Tailwind, React and TypeScript.',
    keywords: ['nested menu', 'submenu popover', 'flyout menu', 'cascading menu'],
  },
  'popover-hover-card': {
    title: 'Hover Card',
    description: 'A rich preview card that opens on hover AND keyboard focus, not hover alone.',
    customization:
      'The one popover that opens on hover - but hover alone is a bug, invisible to the keyboard and impossible on touch. So it opens on hover AND focus, the same pairing the tooltip needs. A short `delay` stops it flickering as the pointer passes; the `relatedTarget` check on blur keeps it open while focus moves into the card\'s own link. Escape dismisses immediately. Unlike the click popovers it holds a link, so it is a non-modal card rather than a tooltip.',
    seoTitle: 'Hover Card with Hover and Focus - Free React Component',
    seoDescription:
      'A hover-card popover that opens on hover and keyboard focus, with an open delay, Escape dismiss and a gradient-initials avatar, in Tailwind, React and TypeScript.',
    keywords: ['hover card', 'hover preview', 'profile hover', 'link preview'],
  },
  'popover-notification': {
    title: 'Notification Popover',
    description: 'A bell trigger with an announced unread count, opening a dialog list of notifications.',
    customization:
      'A bell whose unread count is announced via `aria-label` (`"Notifications, 2 unread"`), not just painted on the badge. It opens a `role="dialog"` list with a "Mark all read" action that disables itself at zero. The panel anchors to the trigger\'s RIGHT edge (`right-0`) because a top-right bell would run a left-anchored panel off-screen, and stays inside the viewport with `max-w-[calc(100vw-2rem)]`. Escape closes and restores focus.',
    seoTitle: 'Notification Bell Popover - Free Accessible React Component',
    seoDescription:
      'A notification popover with an announced unread badge, a mark-all-read action and Escape dismiss, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['notification popover', 'notification bell', 'unread badge', 'inbox popover'],
  },
};
