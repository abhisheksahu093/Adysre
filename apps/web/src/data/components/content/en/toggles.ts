import type { ComponentContentMap } from '../types';

/** English prose for the toggles category. Keys are component slugs. */
export const togglesContent: ComponentContentMap = {
  'toggle-switch-basic': {
    title: 'Basic Switch',
    description:
      'A labelled on/off switch built on a real checkbox with `role="switch"`, driven entirely by CSS.',
    customization:
      'The thumb slides via `peer-checked:after:translate-x-5`, so the state reads by POSITION as well as colour and survives greyscale. It stays uncontrolled - the checkbox owns its value and you read it from `onChange` - so it ships no JS state.',
    seoTitle: 'Basic Toggle Switch - Free Tailwind CSS Component',
    seoDescription:
      'An accessible on/off switch on a native checkbox with role="switch", in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['toggle switch', 'on off switch', 'tailwind switch', 'accessible switch'],
  },
  'toggle-switch-labeled': {
    title: 'Labeled Switch',
    description:
      'A switch that prints ON/OFF inside the track so the state is legible without any colour.',
    customization:
      'Every visual layer is a direct sibling of the input because `peer-checked` reaches siblings, not descendants of a sibling. Swap `onText`/`offText` for I/O or 1/0; the input keeps its name through `aria-label`.',
    seoTitle: 'Labeled On/Off Switch - Free Tailwind CSS Component',
    seoDescription:
      'A toggle switch with ON/OFF text inside the track for colour-independent state, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['labeled switch', 'on off toggle', 'text switch', 'ios switch'],
  },
  'toggle-switch-icons': {
    title: 'Icon Switch',
    description:
      'A switch whose check and cross icons swap with state, so it reads in pure greyscale.',
    customization:
      'The check/cross SVGs stand in for ON/OFF text and are `aria-hidden`; the real name rides on the input `aria-label`. Replace the paths with sun/moon or lock/unlock without touching the sliding thumb.',
    seoTitle: 'Icon Toggle Switch - Free Tailwind CSS Component',
    seoDescription:
      'A switch with check/cross icons that swap with state for colour-independent legibility, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['icon switch', 'toggle with icons', 'theme switch', 'check switch'],
  },
  'toggle-segmented-control': {
    title: 'Segmented Control',
    description:
      'An exclusive segmented picker built from a real radio group inside a fieldset.',
    customization:
      'Radios give arrow-key roving and a single-selection announcement for free; the chosen segment reads by a raised white fill plus weight, not hue. Pass any number of `options` - each label flexes to an equal share of the track.',
    seoTitle: 'Segmented Control - Free Tailwind CSS Component',
    seoDescription:
      'An accessible segmented control on a native radio group, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['segmented control', 'radio toggle', 'ios segmented', 'tab toggle'],
  },
  'toggle-button-group-multi': {
    title: 'Multi-Select Button Group',
    description:
      'A toolbar of `aria-pressed` buttons where several toggles can be active at once.',
    customization:
      'Independent picks are pressed buttons in a `role="group"`, never radios - the state reads by FILL (solid vs outlined) so it holds up with colour stripped. Feed `options` of `{ id, label, icon }` and read the live set from `onChange`.',
    seoTitle: 'Multi-Toggle Button Group - Free React Component',
    seoDescription:
      'A toolbar of aria-pressed toggle buttons with independent multi-select state, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['toggle button group', 'aria-pressed', 'toolbar toggle', 'multi select buttons'],
  },
  'toggle-pill-single': {
    title: 'Single Pill Toggle',
    description:
      'A sticky Follow/Following pill on one `aria-pressed` button whose label and icon change with state.',
    customization:
      'The visible text flips between `label` and `pressedLabel` and a check appears when pressed, so the toggle never leans on the fill colour alone. Drive it from `onChange` to persist the follow.',
    seoTitle: 'Follow Toggle Pill - Free React Component',
    seoDescription:
      'A single aria-pressed pill toggle (Follow/Following) with a label and icon that change with state, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['follow button', 'pill toggle', 'aria-pressed', 'subscribe toggle'],
  },
  'toggle-card-select': {
    title: 'Card Select',
    description:
      'A grid of selectable cards backed by a radio group, showing a ring and a check on the chosen one.',
    customization:
      '`has-[:checked]` rings the selected card while `peer-checked` reveals a filled check badge, so "selected" is a ring plus a tick - never colour on its own. Cards collapse from two columns to one below `sm`.',
    seoTitle: 'Selectable Card Radio Group - Free Tailwind CSS Component',
    seoDescription:
      'An accessible card selector on a native radio group with ring and check indicators, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['card select', 'radio cards', 'plan picker', 'selectable cards'],
  },
  'toggle-switch-async': {
    title: 'Async Switch',
    description:
      'A switch that shows a spinner and waits for the server before committing the new state.',
    customization:
      'It stays on its old value until `onCommit` resolves - `aria-busy` and a thumb spinner mark the pending frame, so the UI never lies with an optimistic flip. Wire `onCommit` to your persistence call and it reverts automatically on rejection.',
    seoTitle: 'Async Loading Toggle Switch - Free React Component',
    seoDescription:
      'A switch with a pending spinner and aria-busy that commits only after the server confirms, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['async switch', 'loading toggle', 'aria-busy', 'optimistic switch'],
  },
  'toggle-row-settings': {
    title: 'Settings Row Switch',
    description:
      'A settings-list row pairing a title and helper text with a switch, tappable across its full width.',
    customization:
      'The whole row is the `<label>`, so the tap target is the entire card rather than the 44px track, and the helper text is wired via `aria-describedby`. The text column shrinks with `min-w-0` so the row never overflows at 320px.',
    seoTitle: 'Settings Row Toggle - Free Tailwind CSS Component',
    seoDescription:
      'A settings-list row with title, description and an accessible switch, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['settings toggle', 'switch row', 'preferences row', 'list switch'],
  },
  'toggle-collapse-disclosure': {
    title: 'Collapse Disclosure',
    description:
      'A show/hide disclosure on native `<details>`/`<summary>` with a chevron that rotates on open.',
    customization:
      'The native element carries expanded state, keyboard support and the open/closed announcement with zero JS, and it works before hydration. The chevron rotates via `group-open:rotate-180`, so the state reads from geometry rather than a colour swap.',
    seoTitle: 'Collapsible Disclosure Toggle - Free Tailwind CSS Component',
    seoDescription:
      'An accessible show/hide disclosure on native details/summary with a rotating chevron, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['disclosure toggle', 'details summary', 'collapse toggle', 'accordion item'],
  },
};
