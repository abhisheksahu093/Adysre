import type { ComponentContentMap } from '../types';

/** English prose for the notifications category. Keys are component slugs. */
export const notificationsContent: ComponentContentMap = {
  'toast-basic': {
    title: 'Basic Toast',
    description: 'A transient, auto-dismissing confirmation announced politely.',
    customization:
      'Keep the region mounted and empty in your app shell and push toasts into it - a role="status" element populated in the same tick it mounts is usually never announced. Auto-dismiss is a convenience, not a delivery mechanism: anything the user must act on belongs in an alert that stays put. Five seconds is the floor for a short string; scale it up with the length of the message, and pause the timer on hover and focus so a toast can never expire while someone is reaching for its button.',
    seoTitle: 'Toast Notification - Free Tailwind CSS Component',
    seoDescription:
      'An accessible auto-dismissing toast with a polite live region, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['toast notification', 'snackbar', 'tailwind toast', 'aria-live toast'],
  },
  'toast-stack': {
    title: 'Toast Stack',
    description: 'A capped queue of toasts sharing one live region.',
    customization:
      'The cap is the part to tune, and the part not to remove - three is a sensible default and unbounded is how a failing retry loop covers the viewport. Overflow should wait its turn rather than render. Consider collapsing duplicates into a count ("Retrying - 4 times") instead of stacking identical strings, which is both quieter and more informative. The whole stack lives in one region: adding a region per toast means adding a race per toast.',
    seoTitle: 'Toast Stack - Free Tailwind CSS Component',
    seoDescription:
      'A stacked toast queue with a visible cap and one shared live region, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['toast stack', 'notification queue', 'tailwind toasts', 'stacked toasts'],
  },
  'notification-inline-banner': {
    title: 'Inline Notification Banner',
    description: 'New activity announced in the flow, without an overlay.',
    customization:
      'Use this where a toast would be wrong because the event is about the content the user is already looking at - "3 new posts", "someone else edited this row". Keep the slot reserved with a min-height whether or not it holds anything, or the banner arriving shoves the page down under the reader\'s cursor. The action should consume the event (scroll to the new items, merge them in) rather than just navigate away; a banner you can only dismiss is a toast that overstayed.',
    seoTitle: 'Inline Notification Banner - Free Tailwind CSS Component',
    seoDescription:
      'An in-flow notification banner with a reserved slot and polite live region, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['notification banner', 'inline banner', 'new items banner', 'tailwind banner'],
  },
  'notification-list-panel': {
    title: 'Notification List Panel',
    description: 'The inbox behind the bell - everything the toasts already discarded.',
    customization:
      'Deliberately has no live region: the user opened this, so nothing in it is an interruption. Mark rows read on open only if opening really is reading - if the list is long enough to scroll, mark on click instead, or people lose things they never saw. Keep the unread dot paired with its visually hidden "Unread", and render the dot transparently rather than conditionally so the text never shifts when a row changes state.',
    seoTitle: 'Notification Panel - Free Tailwind CSS Component',
    seoDescription:
      'An accessible notification list panel with unread state and dismissal, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['notification panel', 'notification inbox', 'unread list', 'tailwind dropdown panel'],
  },
  'notification-badge-bell': {
    title: 'Notification Bell Badge',
    description: 'An unread counter that accrues without ever interrupting.',
    customization:
      'The visible number is decoration - aria-hidden - and the button\'s accessible name carries the sentence, because "button, 3" tells a screen-reader user nothing. Keep the polite announcement in its own hidden span; putting aria-live on the button makes several screen readers re-read the entire button on every tick. Render nothing at zero rather than an empty badge, and if the count updates often, debounce the announcement - the badge\'s job is to be ignorable.',
    seoTitle: 'Notification Bell Badge - Free Tailwind CSS Component',
    seoDescription:
      'A bell icon with an accessible unread count badge and polite live region, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['notification badge', 'bell icon badge', 'unread count', 'tailwind badge'],
  },
  'notification-toast-success': {
    title: 'Success Toast',
    description: 'A polite success toast with an icon, capped width and a real dismiss button.',
    customization:
      'Keep it role="status", never role="alert" - a confirmation should not interrupt a screen-reader user mid-sentence. The check icon is not decoration; it carries the same meaning the green does, so the toast still reads as success without colour. Width is capped at the viewport so it can never overflow at 320px.',
    seoTitle: 'Success Toast - Free Tailwind CSS Component',
    seoDescription:
      'An accessible success toast with a polite live region and viewport-capped width, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['success toast', 'confirmation toast', 'tailwind toast', 'aria-live status'],
  },
  'notification-toast-progress': {
    title: 'Progress Toast',
    description: 'A toast with a countdown bar that respects reduced motion.',
    customization:
      'The bar is a single width transition, so motion-reduce switches only the animation off - the toast still dismisses on its timer. Pause the timer on hover and focus in production so nobody loses a toast they were reaching for, and scale the duration with the message length.',
    seoTitle: 'Progress Toast - Free Tailwind CSS Component',
    seoDescription:
      'A toast with an accessible countdown progress bar honouring prefers-reduced-motion, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['progress toast', 'countdown toast', 'auto dismiss toast', 'motion reduce'],
  },
  'notification-in-app-feed': {
    title: 'In-App Notification Feed',
    description: 'A scannable activity feed with typed icons and no interrupting live region.',
    customization:
      'No live region on purpose: the user opened this to read it, so nothing here is an interruption. Each row leads with a typed icon plus an sr-only word so meaning never rides on colour alone. Swap the type map for your own event kinds; the row stays wrapping and legible down to 320px.',
    seoTitle: 'In-App Notification Feed - Free Tailwind CSS Component',
    seoDescription:
      'An accessible in-app notification feed with typed icons and semantic list markup, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['notification feed', 'activity feed', 'in-app inbox', 'tailwind feed'],
  },
  'notification-grouped': {
    title: 'Grouped Notification',
    description: 'Many related events collapsed into one line with an initials avatar stack.',
    customization:
      'Grouping is how a busy feed stays readable - collapse "12 people reacted" into one row instead of twelve. The avatars are initials, never remote images, and each carries the full name so the group is not shape-and-colour alone. Tune how many actors show before the +N overflow.',
    seoTitle: 'Grouped Notification - Free Tailwind CSS Component',
    seoDescription:
      'A grouped notification that summarises many events with an initials avatar stack, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['grouped notification', 'notification digest', 'avatar stack', 'tailwind notification'],
  },
  'notification-with-avatar': {
    title: 'Notification With Avatar',
    description: 'A single notification row with an initials avatar and an accessible unread marker.',
    customization:
      'The avatar falls back to initials so it always renders without a network request. Unread is both a dot and an sr-only "Unread" word, because a coloured dot on its own is colour-only signalling. The row wraps its text under the avatar at 320px rather than overflowing.',
    seoTitle: 'Notification With Avatar - Free Tailwind CSS Component',
    seoDescription:
      'A notification row with an initials avatar and an accessible unread indicator, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['notification avatar', 'mention notification', 'unread indicator', 'tailwind notification'],
  },
  'notification-settings-list': {
    title: 'Notification Settings List',
    description: 'A preferences list of channels with accessible switch toggles.',
    customization:
      'Each toggle is a real button with role="switch" and aria-checked, so its state is carried by the knob position and the ARIA state, never colour alone. Rows stack at the phone width and only justify into a row once there is space, so label and switch never collide at 320px.',
    seoTitle: 'Notification Settings List - Free Tailwind CSS Component',
    seoDescription:
      'An accessible notification preferences list with switch toggles, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['notification settings', 'preferences toggle', 'switch list', 'tailwind switch'],
  },
  'notification-permission-prompt': {
    title: 'Notification Permission Prompt',
    description: 'A soft opt-in card shown before the one-shot browser permission dialog.',
    customization:
      'The native Notification.requestPermission() prompt fires once and a "block" is hard to reverse, so earn the yes here first and only call it after the user taps Allow. Both choices are real buttons; they stack full-width at 320px and sit side by side once there is room.',
    seoTitle: 'Notification Permission Prompt - Free Tailwind CSS Component',
    seoDescription:
      'A pre-permission opt-in prompt for web push notifications, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['permission prompt', 'push opt-in', 'notification consent', 'tailwind prompt'],
  },
  'notification-snackbar-action': {
    title: 'Snackbar With Action',
    description: 'A dark snackbar carrying one reversible action such as Undo.',
    customization:
      'The action is a real button, not the whole bar - a bar-wide target traps anyone who only meant to read it. Keep role="status" polite, cap the width at the viewport, and let the message wrap rather than push the buttons off-screen at 320px.',
    seoTitle: 'Snackbar With Action - Free Tailwind CSS Component',
    seoDescription:
      'An accessible snackbar with an Undo-style action and polite live region, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['snackbar', 'undo snackbar', 'action toast', 'tailwind snackbar'],
  },
  'notification-banner-gradient': {
    title: 'Gradient Announcement Banner',
    description: 'A dismissible announcement banner on a gradient, with an icon and CTA.',
    customization:
      'This is a marketing message, not a pushed event, so it carries no live region. Text is solid white on a saturated fill for AA contrast and an icon sits alongside so the meaning survives without colour. It stacks at 320px and becomes a row once there is space.',
    seoTitle: 'Gradient Announcement Banner - Free Tailwind CSS Component',
    seoDescription:
      'A dismissible gradient announcement banner with an icon and call to action, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['announcement banner', 'gradient banner', 'promo banner', 'tailwind banner'],
  },
  'notification-empty-state': {
    title: 'Notification Empty State',
    description: 'A zero-state for an empty inbox with an inline illustration.',
    customization:
      'The illustration is an inline SVG with no network image to fail, and it is aria-hidden because the heading already says everything. Give the empty state a job - a link to notification settings or a way to catch up - so it is a next step, not a dead end.',
    seoTitle: 'Notification Empty State - Free Tailwind CSS Component',
    seoDescription:
      'A notification inbox empty state with an inline illustration and optional action, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['empty state', 'zero state', 'notification inbox', 'tailwind empty state'],
  },
};
