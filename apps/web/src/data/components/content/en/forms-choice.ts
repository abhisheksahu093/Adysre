import type { ComponentContentMap } from '../types';

/** English prose for the forms choice controls (checkbox and radio). Keys are component slugs. */
export const formsChoiceContent: ComponentContentMap = {
  'checkbox-basic': {
    title: 'Checkbox with Label and Helper Text',
    description:
      'A native checkbox wired to its own label and hint - the three-element field every form starts from.',
    customization:
      'The whole component is `accent-color`, and that is deliberate: it keeps the platform\'s own checkmark, so the checked state is carried by a glyph rather than by blue alone and survives greyscale. Recolour it with `accent-blue-600`, and lift it a step in dark mode - a mid-blue that reads well on white goes muddy on `gray-900`. The 20px box looks small against the 24px minimum target, but the label is `htmlFor`-linked and therefore part of the same target; keep it a real `<label>` and the size takes care of itself.',
    seoTitle: 'Accessible Checkbox with Label and Helper Text - Free Component',
    seoDescription:
      'A native checkbox with a linked label and aria-describedby helper text, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['checkbox', 'tailwind checkbox', 'accessible checkbox', 'form checkbox', 'react checkbox'],
  },
  'checkbox-card': {
    title: 'Checkbox Card',
    description:
      'A selectable card whose entire surface is the target - and which is still a real checkbox underneath.',
    customization:
      'The input is `sr-only`, not `hidden`: clipping keeps it in the tab order and in the accessibility tree, which is the only reason the card is keyboard-operable and posts with the form. Everything visual hangs off `has-[:checked]:` on the card and `peer-checked:` on the tick box - no state, no handler, no `useState`. Swap `blue-50`/`blue-950` for your brand tint, but keep the tick: the tint alone is a colour-only signal and fails 1.4.1.',
    seoTitle: 'Checkbox Card - Free Tailwind Selectable Card Component',
    seoDescription:
      'A selectable checkbox card built on a real native input with peer-checked styling, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['checkbox card', 'selectable card', 'tailwind checkbox card', 'peer-checked', 'addon picker'],
  },
  'checkbox-switch': {
    title: 'Toggle Switch',
    description:
      'A settings toggle styled over a native checkbox, with `role="switch"` on the input itself.',
    customization:
      'This is a checkbox wearing a different picture - and it has to be. A `role="switch"` div has to reimplement Space, focus, the label link and form submission, and still cannot be posted; the input here gets all of it for nothing. `role="switch"` is valid on `input[type=checkbox]` and only changes the announcement from "checked" to "on/off". The thumb slides via `peer-checked:after:translate-x-5`, so state is carried by position as well as by the track colour - recolour `peer-checked:bg-blue-600` freely, the greyscale reading survives. The off-state `bg-gray-400` steps to `dark:bg-gray-600` so the track stays visible against a dark page.',
    seoTitle: 'Accessible Toggle Switch - Free Tailwind CSS Component',
    seoDescription:
      'A toggle switch built on a real checkbox with role="switch", CSS-only animation and a visible focus ring, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['toggle switch', 'tailwind switch', 'accessible switch', 'checkbox toggle', 'settings toggle'],
  },
  'checkbox-indeterminate': {
    title: 'Indeterminate Checkbox Tree',
    description:
      'A parent checkbox that goes mixed when only some of its children are selected.',
    customization:
      'The one thing to take from this component: `indeterminate` is a DOM **property**, not an attribute. There is no `<input indeterminate>`, React has no such prop, and `setAttribute(\'indeterminate\', \'\')` does nothing - it can only be written to the element instance, which is why every variant here reaches for a ref or a script. `aria-checked="mixed"` is set beside it so the state is announced and not merely drawn. The boxes keep `accent-color` rather than a hand-rolled span precisely so the platform draws its own dash for the mixed state. Clicking a mixed parent selects everything, matching every file manager on the platform; invert that in the `onChange` if your product wants the opposite.',
    seoTitle: 'Indeterminate Checkbox (Mixed State) - Free React Component',
    seoDescription:
      'A parent/child checkbox tree with a correct indeterminate DOM property and aria-checked="mixed", in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: [
      'indeterminate checkbox',
      'mixed checkbox',
      'parent child checkbox',
      'aria-checked mixed',
      'react indeterminate',
    ],
  },
  'checkbox-list-group': {
    title: 'Checkbox List Group with Select All',
    description:
      'A bordered list of checkbox rows with a tri-state select-all and a live count in the header.',
    customization:
      'The select-all is tri-state on purpose. A select-all that shows plain "unchecked" while three of five rows are ticked is misreporting the selection, so it takes the same `indeterminate` DOM property as the tree component. Each row is a full-width `<label>`, which is what makes the whole strip the target rather than the 20px box - keep the `py-3` if you shrink the text. The card is a surface of its own, so dark mode moves the shell, the hairlines and the header tint together; changing only the border leaves a white card punched into a dark page.',
    seoTitle: 'Checkbox List with Select All - Free Tailwind Component',
    seoDescription:
      'A bordered checkbox list group with a tri-state select-all and live selection count, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['select all checkbox', 'checkbox list', 'bulk select', 'checkbox group', 'tailwind list group'],
  },
  'radio-basic': {
    title: 'Radio Group',
    description:
      'A native radio group in a fieldset, with a legend that gives it an accessible name.',
    customization:
      'The `<fieldset>`/`<legend>` is the component. Without it the group announces as "Monthly, radio button, 1 of 3" and never says what is being chosen - a group with no accessible name is a bug, not a style choice. The shared `name` is what makes the options exclusive and what gives you arrow-key traversal and a single tab stop with no roving-tabindex code. `accent-color` keeps the platform dot, so the selection is a mark and not just a hue. Drop the `value`/`onChange` pair for `defaultChecked` and the whole thing becomes a Server Component that posts with the form.',
    seoTitle: 'Accessible Radio Group with Fieldset and Legend - Free Component',
    seoDescription:
      'A native radio group with a fieldset, legend and aria-describedby hint, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['radio group', 'fieldset legend', 'accessible radio', 'tailwind radio', 'react radio group'],
  },
  'radio-card': {
    title: 'Radio Card Group',
    description: 'Selectable cards for a single choice - a plan picker built on a real radio group.',
    customization:
      'Same pattern as the checkbox card, with the exclusivity the radio type gives you for free: arrow keys move the selection between cards, Tab enters and leaves the group as one stop, and the form posts one value. None of that survives being rebuilt on divs. The dot is drawn with a `radial-gradient` background rather than a nested element, so there is nothing to show and hide - it simply appears under `peer-checked:`. Retint `has-[:checked]:bg-blue-50` for your brand and keep the dot; the tint is reinforcement, not the signal.',
    seoTitle: 'Radio Card Group - Free Tailwind Plan Picker Component',
    seoDescription:
      'Selectable radio cards for plan and option pickers, built on native inputs with a fieldset and legend, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['radio card', 'plan picker', 'selectable card', 'tailwind radio card', 'pricing selector'],
  },
  'radio-button-group': {
    title: 'Segmented Radio Control',
    description:
      'A segmented control - the look of a button row, the behaviour of a native radio group.',
    customization:
      'The reason to build a segmented control this way rather than as buttons with an `.is-active` class: exclusivity, arrow-key traversal, one tab stop and form submission all come from the radio type, and none of them are in this snippet\'s code. The selected face is the raised surface on both themes - `bg-white` on a `gray-100` track, `bg-gray-700` on a `gray-800` one - because inverting that reads as recessed rather than selected. The tick is laid out at `opacity-0` rather than removed so the label does not shift sideways when the selection moves, and it is what keeps the selected state readable for anyone who cannot separate the two greys.',
    seoTitle: 'Segmented Control from Radio Buttons - Free Tailwind Component',
    seoDescription:
      'An accessible segmented control built on a native radio group with keyboard traversal for free, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['segmented control', 'radio button group', 'toggle group', 'tailwind segmented', 'filter control'],
  },
  'radio-with-description': {
    title: 'Radio Group with Descriptions',
    description: 'Each option carries a title and an explaining line, wired with aria-describedby.',
    customization:
      'The split between the title and the description is the whole point. The title sits inside the `<label>` and is the option\'s name; the description sits outside it and is referenced with `aria-describedby`, so it is announced *after* the name. Wrap both in the label instead and you get an option called "Private Only people you invite can open the workspace", read in full on every arrow-key press. The description is the smallest text here and the first thing to fail contrast - `text-gray-600` on white and `text-gray-400` on `gray-900` both clear 4.5:1; do not dim them further to make the line look secondary, the size already does that.',
    seoTitle: 'Radio Group with Descriptions - Free Accessible Component',
    seoDescription:
      'A radio group where each option has a title and an aria-describedby description, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: [
      'radio with description',
      'aria-describedby',
      'radio option description',
      'settings radio',
      'tailwind radio group',
    ],
  },
  'radio-inline': {
    title: 'Inline Radio Group',
    description: 'A radio group laid out in a row, for two to four short options.',
    customization:
      'Use it where a stacked list would waste a whole block of the form and the labels are one or two words. `flex-wrap` is load-bearing: a row that cannot break either overflows the form or forces a horizontal scroll at 320px, and at 200% zoom that is a reflow failure rather than a cosmetic one. The `gap-y-2` matters for the same reason - it is what stops wrapped rows colliding. Everything else is `radio-basic`: same fieldset, same legend, same native dot.',
    seoTitle: 'Inline Radio Group - Free Tailwind CSS Component',
    seoDescription:
      'A horizontal radio group that wraps cleanly at small widths, with a fieldset and legend, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['inline radio', 'horizontal radio group', 'radio row', 'tailwind radio inline', 'compact radio'],
  },
};
