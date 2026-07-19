import type { ComponentContentMap } from '../types';

/** English prose for the tooltips category. Keys are component slugs. */
export const tooltipsContent: ComponentContentMap = {
  'tooltip-basic': {
    title: 'Basic Tooltip',
    description: 'A short hint that appears above a control on hover and on keyboard focus.',
    customization:
      'The trigger is a real `<button>` so a keyboard Tab and a touch tap can both summon the tip - the Tailwind tab does it with `group-focus-within`, the React tab with an `onFocus` that opens instantly while hover waits out `delay`. `role="tooltip"` plus `aria-describedby` is what makes a screen reader announce it as the control’s description.',
    seoTitle: 'Accessible Tooltip - Free Tailwind CSS Component',
    seoDescription:
      'A hover- and focus-triggered tooltip with role="tooltip" and aria-describedby, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['tooltip', 'accessible tooltip', 'tailwind tooltip', 'hover tooltip'],
  },
  'tooltip-positions': {
    title: 'Positioned Tooltip',
    description: 'A tooltip that anchors to the top, right, bottom or left of its trigger via a `side` prop.',
    customization:
      'Each side is an offset preset applied to one shared bubble, so switching placement is a single prop and never a re-style. Keep the tip on whichever side has room - near a viewport edge the top/bottom variants stay centred while left/right buy horizontal space.',
    seoTitle: 'Tooltip Positions (Top, Right, Bottom, Left) - Free Component',
    seoDescription:
      'A tooltip with four placement options driven by a side prop, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['tooltip position', 'tooltip placement', 'top bottom tooltip', 'tailwind tooltip'],
  },
  'tooltip-delay-group': {
    title: 'Delay Group Tooltip',
    description: 'A row of tooltips that share a delay: the first waits, the rest open instantly while you sweep across.',
    customization:
      'Wrap the row in `TooltipGroup`; the first tip opens after `delay`, and once one has opened the group stays "warm" for `skipDelay` so neighbours open with no wait. The Tailwind tab is the CSS-only baseline (independent per-item tips) because shared cross-element timing is genuinely JS.',
    seoTitle: 'Tooltip Delay Group - Free React Component',
    seoDescription:
      'A tooltip provider that shares an open-delay across a group so a toolbar feels instant, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['tooltip delay', 'tooltip group', 'tooltip provider', 'toolbar tooltip'],
  },
  'tooltip-rich': {
    title: 'Rich Tooltip',
    description: 'A wider tooltip with a bold title over a line of supporting description.',
    customization:
      'Keep the content read-only - the moment you put a link or button inside, it stops being a tooltip and needs popover focus management. The bubble is capped at `max-w-[calc(100vw-2rem)]` so it never overflows a phone.',
    seoTitle: 'Rich Tooltip with Title and Body - Free Component',
    seoDescription:
      'A tooltip with a title and description line, non-interactive and accessible, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['rich tooltip', 'tooltip with title', 'description tooltip', 'tailwind tooltip'],
  },
  'tooltip-icon-help': {
    title: 'Help Icon Tooltip',
    description: 'A "?" help dot beside a label that reveals an explanatory hint on hover or focus.',
    customization:
      'The icon button carries an `aria-label` because a bare "?" is not an accessible name, and `aria-describedby` points at the hint. Pass the visible label as `children` and the explanation as `hint`.',
    seoTitle: 'Help Icon Tooltip - Free Tailwind CSS Component',
    seoDescription:
      'An accessible "?" help-icon tooltip for form fields, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['help tooltip', 'icon tooltip', 'form field help', 'question mark tooltip'],
  },
  'tooltip-truncation': {
    title: 'Truncation Tooltip',
    description: 'Ellipsised text that reveals the full string in a tooltip on hover and focus.',
    customization:
      'The clipped text is itself the trigger, made a `<button>` so it takes focus and a tap - truncated text with no way to read the rest is a dead end on a phone. Constrain the trigger width via `className`; the full string stays the button’s own text so a screen reader reads it whole.',
    seoTitle: 'Truncated Text Tooltip - Free Tailwind CSS Component',
    seoDescription:
      'A tooltip that reveals the full value of ellipsis-truncated text, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['truncation tooltip', 'ellipsis tooltip', 'overflow text', 'truncate tooltip'],
  },
  'tooltip-kbd-shortcut': {
    title: 'Keyboard Shortcut Tooltip',
    description: 'A tooltip pairing an action label with its hotkey rendered in real `<kbd>` elements.',
    customization:
      'Pass the `keys` array - each becomes its own `<kbd>` so they read as keys, not prose. The whole bubble is one tooltip described by the trigger, so the shortcut is announced as part of the description.',
    seoTitle: 'Keyboard Shortcut Tooltip - Free Component',
    seoDescription:
      'A tooltip showing an action and its keyboard shortcut in kbd elements, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['keyboard shortcut tooltip', 'kbd tooltip', 'hotkey tooltip', 'shortcut hint'],
  },
  'tooltip-follow-cursor': {
    title: 'Follow Cursor Tooltip',
    description: 'A tooltip that tracks the pointer as it moves across the trigger, with a fixed fallback for keyboard.',
    customization:
      'The React/TS tabs update coordinates on every `mousemove`; when the tip is summoned by focus instead (no pointer to follow) it falls back to a fixed anchor above the trigger, which is exactly what the CSS-only Tailwind tab renders.',
    seoTitle: 'Follow-Cursor Tooltip - Free React Component',
    seoDescription:
      'A tooltip that follows the mouse pointer with a keyboard-focus fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['follow cursor tooltip', 'mouse tooltip', 'pointer tooltip', 'cursor tracking'],
  },
  'tooltip-click-pin': {
    title: 'Click to Pin Tooltip',
    description: 'A tooltip that previews on hover or focus and latches open when the trigger is clicked.',
    customization:
      'Hover and focus preview the hint; a click pins it so it survives the pointer leaving, and `aria-pressed` reflects the pinned state to assistive tech. Escape unpins and closes. The Tailwind tab is the hover/focus baseline since the latch is persistent state.',
    seoTitle: 'Click-to-Pin Tooltip - Free React Component',
    seoDescription:
      'A tooltip that pins open on click with an aria-pressed latch and Escape to dismiss, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['pin tooltip', 'click tooltip', 'toggle tooltip', 'sticky tooltip'],
  },
  'tooltip-status-bar': {
    title: 'Status Bar Tooltips',
    description: 'An editor-style bottom bar whose compact items each reveal a tooltip above on hover or focus.',
    customization:
      'Feed the bar through `items`; each cell gets its own focus-reachable tooltip. The row wraps rather than scrolls on purpose - an overflow container would clip the upward-opening tips.',
    seoTitle: 'Status Bar Tooltips - Free Tailwind CSS Component',
    seoDescription:
      'An IDE-style status bar with a tooltip on each item, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['status bar tooltip', 'toolbar tooltip', 'footer bar', 'editor status bar'],
  },
};
