import type { ComponentContentMap } from '../types';

/** English prose for the alerts category. Keys are component slugs. */
export const alertsContent: ComponentContentMap = {
  'alert-inline': {
    title: 'Inline Alert',
    description: 'A static status message in four severities, sitting in the flow.',
    customization:
      'Let the role follow the severity: only an error earns role="alert", which is assertive and cuts a screen-reader user off mid-sentence. Info, success and a warning they can finish their paragraph before acting on are all role="status". Keep an icon per severity and keep the shapes distinct - colour on its own excludes roughly one man in twelve. If you re-theme, measure: text-{c}-500 on white lands near 2-3:1, while the text-{c}-800 on bg-{c}-50 pairs here run 6.8-8.0:1.',
    seoTitle: 'Inline Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible inline alert with info, success, warning and error severities, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['inline alert', 'alert component', 'tailwind alert', 'status message'],
  },
  'alert-with-actions': {
    title: 'Alert with Actions',
    description: 'A status message that asks for something back.',
    customization:
      'Wire the region to its own title and body with aria-labelledby and aria-describedby, and keep the buttons inside it - "Upgrade plan" announced on its own says nothing about what it fixes. Two actions is the ceiling; a third is a sign the alert is really a dialog. Solid buttons have to invert against a -50 tint (white on amber-800 is 6.84:1) because the tint itself is far too light to carry a filled control.',
    seoTitle: 'Alert with Actions - Free Tailwind CSS Component',
    seoDescription:
      'An accessible alert with inline actions and described-by wiring, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['alert with actions', 'alert buttons', 'tailwind alert cta', 'quota warning'],
  },
  'alert-dismissible': {
    title: 'Dismissible Alert',
    description: 'A closable status message that hands focus somewhere sensible.',
    customization:
      'Dismissal is a focus problem first: the close button removes itself, and the browser\'s fallback is to drop focus on <body>, stranding keyboard users at the top of the page. Move focus to a stable neighbour before unmounting. Give the button a name that says what it closes - a dozen buttons called "Dismiss" are indistinguishable in a screen reader\'s element list. If the alert must stay gone across navigations, persist that server-side; local state alone means it returns on the next load.',
    seoTitle: 'Dismissible Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible dismissible alert with correct focus handling, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['dismissible alert', 'closable alert', 'tailwind alert close', 'alert focus'],
  },
  'alert-callout': {
    title: 'Callout',
    description: 'The "Note:" block in a page of prose - an alert with no ARIA at all.',
    customization:
      'What defines this one is what it omits. No role, no live region: it is body copy that was on the page before the reader arrived, and there is no event to announce. <aside> exposes it as a complementary landmark, so it can be skipped or jumped to exactly as a sighted reader skims a sidebar. Keep the label as real text - it is read first and it is what makes the block make sense out of context. The accent bar and icon are decoration layered on a signal that already reads without them.',
    seoTitle: 'Callout Block - Free Tailwind CSS Component',
    seoDescription:
      'A documentation-style callout using a complementary landmark and no live region, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['callout', 'note block', 'docs callout', 'tailwind callout'],
  },
  'alert-banner-top': {
    title: 'Top Alert Banner',
    description: 'A page-wide status bar for a condition that is true right now.',
    customization:
      'Render it first in the DOM, above the header, as a real block in the flow - never position: fixed. At 200% zoom the viewport is a few hundred CSS pixels tall and a fixed bar eats a third of it; in flow, the page simply starts lower. Use <section aria-label>, not <header>, so you don\'t add a second banner landmark. Reach for role="alert" only if the bar can appear after load in response to something; on a page that ships with it, the assertive region has nothing to announce anyway.',
    seoTitle: 'Top Alert Banner - Free Tailwind CSS Component',
    seoDescription:
      'A full-width in-flow status banner with landmark labelling, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['top banner', 'announcement bar', 'status banner', 'tailwind alert banner'],
  },
  'alert-success-solid': {
    title: 'Solid Alert',
    description: 'A loud, filled confirmation alert with a real dismiss button.',
    customization:
      'The fill is the contrast trap: white on green-500/600 fails AA, so the solids use the -700/-800 shades (white on green-700 is 4.9:1, amber-800 6.8:1). Keep the per-severity icon shape and give the dismiss button a name that says what it closes.',
    seoTitle: 'Solid Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible filled alert in four severities with AA-safe solid backgrounds, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['solid alert', 'filled alert', 'tailwind alert', 'success alert'],
  },
  'alert-outline': {
    title: 'Outline Alert',
    description: 'The quiet variant - a coloured border and text on the page background.',
    customization:
      'It leans on -700 text (light) and -300 text (dark), which clear AA on white and gray-900, plus the per-severity icon shape. A border colour alone is the weakest signal there is, so the icon always rides along.',
    seoTitle: 'Outline Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible outline alert in four severities using only a border and text, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['outline alert', 'bordered alert', 'tailwind alert', 'minimal alert'],
  },
  'alert-soft-tint': {
    title: 'Soft Tint Alert',
    description: 'A gentle tinted alert with the severity icon in its own swatch.',
    customization:
      'The icon sits in a tinted chip so the severity reads as a shape-in-a-swatch before the text; body copy uses the neutral gray ramp for calm long-form contrast. Retint by swapping the -50/-100 surface and -700/-200 chip pairs together.',
    seoTitle: 'Soft Tint Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible soft-tinted alert with a chipped icon in four severities, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['soft alert', 'tinted alert', 'tailwind alert', 'subtle alert'],
  },
  'alert-with-icon-list': {
    title: 'Alert with List',
    description: 'A "fix these first" summary over a real, semantic list of specifics.',
    customization:
      'Keep the list a genuine <ul> so a screen reader announces the count and lets users step through it. Each row is items-start with a flex-none marker and a min-w-0 text cell, so long lines wrap under themselves instead of overflowing at 320px. role="alert" only while it blocks the user.',
    seoTitle: 'Alert with List - Free Tailwind CSS Component',
    seoDescription:
      'An accessible alert wrapping a semantic list of validation errors, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['validation alert', 'error list', 'tailwind alert', 'form errors'],
  },
  'alert-progress-timed': {
    title: 'Auto-dismiss Alert',
    description: 'A self-clearing alert with a visible countdown bar.',
    customization:
      'The bar is decorative (aria-hidden) and the remaining time is never announced tick-by-tick; motion-reduce:hidden drops the animation while the timer still fires. Never auto-dismiss the only copy of critical text - this is for acknowledgements the user can also find elsewhere.',
    seoTitle: 'Auto-dismiss Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible timed alert with a motion-reduce-aware progress bar, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['auto-dismiss alert', 'timed alert', 'progress alert', 'tailwind alert'],
  },
  'alert-expandable-details': {
    title: 'Expandable Alert',
    description: 'A short summary that opens onto the noisy detail on demand.',
    customization:
      'The HTML build uses native <details>/<summary> for a zero-JS disclosure; React uses a button with aria-expanded and aria-controls. Keep the detail in a <pre> that scrolls on its own so a long unbreakable line never widens the page at 320px.',
    seoTitle: 'Expandable Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible expandable alert with a disclosure for stack traces and logs, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['expandable alert', 'disclosure alert', 'tailwind alert', 'error details'],
  },
  'alert-cookie-consent': {
    title: 'Cookie Consent',
    description: 'A labelled cookie banner with an equally prominent reject button.',
    customization:
      'It is a labelled region, not a live alert or a modal - it must not trap focus, and "Reject" has to be a real, equal-weight button, because consent that only offers "Accept" is not consent. Buttons stack under the copy at 320px and sit inline from sm: up.',
    seoTitle: 'Cookie Consent Banner - Free Tailwind CSS Component',
    seoDescription:
      'An accessible cookie consent banner with symmetric accept and reject actions, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['cookie consent', 'gdpr banner', 'consent banner', 'tailwind alert'],
  },
  'alert-system-status': {
    title: 'System Status',
    description: 'A service health row where the state is never carried by colour alone.',
    customization:
      'Each state pairs a distinct icon shape (check / triangle / cross) with a written label ("Operational"), so greyscale and screen-reader users get the status from the shape and the words. The coloured dot is aria-hidden; the label text is the real signal.',
    seoTitle: 'System Status Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible service-status row with operational, degraded and down states, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['system status', 'uptime alert', 'health status', 'tailwind alert'],
  },
  'alert-countdown': {
    title: 'Countdown Alert',
    description: 'A live countdown to a deadline that stays quiet for screen readers.',
    customization:
      'The per-second digits are aria-hidden; a single aria-live="polite" region carries a coarse phrase ("about 2 hours left") that changes rarely, so a screen reader is not flooded. tabular-nums keeps the width steady as digits tick. Pass the deadline as an epoch-millisecond timestamp.',
    seoTitle: 'Countdown Alert - Free Tailwind CSS Component',
    seoDescription:
      'An accessible countdown alert with a quiet live region and tabular digits, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['countdown alert', 'deadline timer', 'urgency alert', 'tailwind alert'],
  },
  'alert-stacked-group': {
    title: 'Stacked Alert Group',
    description: 'Several related alerts as one labelled, navigable region.',
    customization:
      'A single aria-labelledby region wraps the stack so a screen-reader user hears the group name once and steps through the members, rather than fielding three separately-announced alerts. The members carry no live role - they are present on load - and each severity still reads from its colour+icon pair.',
    seoTitle: 'Stacked Alert Group - Free Tailwind CSS Component',
    seoDescription:
      'An accessible group of stacked alerts under one labelled region, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['alert group', 'stacked alerts', 'notice list', 'tailwind alert'],
  },
};
