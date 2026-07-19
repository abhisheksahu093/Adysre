import type { ComponentContentMap } from '../types';

/**
 * English prose for the select / multi-select forms entries. Keys are slugs.
 *
 * The customization notes lean hard on one theme, because it is the one that
 * decides whether these components work: a listbox is a promise to reimplement
 * everything a native `<select>` does for free, and the styling is the cheapest
 * part of keeping it.
 */
export const formsSelectContent: ComponentContentMap = {
  'select-native': {
    title: 'Native Select',
    description:
      'A styled native `<select>` - the accessible baseline, with the platform popup left intact.',
    customization:
      'The only thing restyled is the box: `appearance-none` drops the OS arrow so the chevron can take its place, and everything inside the popup stays the browser’s. That is the trade being made, and it is a good one - you get keyboard navigation, type-ahead and the iOS wheel for free, and none of it can rot. `color-scheme` is the one lever CSS has over the popup itself; without it the option list paints light on a dark page. Reach for `select-custom` when an option row needs markup `<option>` cannot hold - never because the arrow is the wrong grey.',
    seoTitle: 'Styled Native Select - Free Accessible Form Component',
    seoDescription:
      'A restyled native HTML select with dark mode and a custom chevron, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['native select', 'html select', 'styled select', 'accessible select', 'tailwind select'],
  },
  'select-custom': {
    title: 'Custom Select',
    description:
      'A listbox with the full ARIA pattern - virtual focus, arrow keys, and dismiss on outside click.',
    customization:
      'The part to keep is not the styling, it is the contract: `aria-haspopup="listbox"` and `aria-expanded` on the trigger, `role="option"` with `aria-selected` on every row, and `aria-activedescendant` for virtual focus. That last one is what people cut, and it is the load-bearing piece - DOM focus stays on the trigger while only the attribute moves, which is how the browser’s own focus ring stays where the user put it. Note `activeIndex` and `value` are separate state: arrowing moves the highlight, only Enter moves the selection. Collapse the two and the list commits on every keypress.',
    seoTitle: 'Custom Select Listbox - Free Accessible React Component',
    seoDescription:
      'A keyboard-navigable custom select implementing the full ARIA listbox pattern, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['custom select', 'aria listbox', 'accessible dropdown', 'keyboard select', 'react select'],
  },
  'select-with-icons': {
    title: 'Select with Icons',
    description: 'A listbox with an icon per option, mirrored into the trigger once chosen.',
    customization:
      'This is the case that justifies leaving `<select>` behind: an `<option>` may contain text and nothing else, so a glyph per row forces a listbox. Every icon is `aria-hidden` - the row already says "Engineering", and an icon that announces itself as well produces "Engineering Engineering". Mirroring the glyph into the closed trigger is not decoration either; a control that drops it loses half the information the moment it closes. Selection is carried by weight as well as tint, so the chosen row survives a greyscale screenshot.',
    seoTitle: 'Select with Icons - Free Accessible Dropdown Component',
    seoDescription:
      'An icon-per-option select built on the ARIA listbox pattern, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['select with icons', 'icon dropdown', 'listbox icons', 'custom select icons'],
  },
  'select-grouped': {
    title: 'Grouped Select',
    description:
      'A listbox with labelled groups - the ARIA analogue of `<optgroup>`, with a flat keyboard.',
    customization:
      'Two rules make the grouping real rather than decorative. The heading is not an option: it lives in a `role="group"` carrying `aria-labelledby`, so a screen reader announces "Americas, group" at the boundary and the word "Americas" is never selectable. And the keyboard treats the list as flat - the options are flattened once with `flatMap`, so ArrowDown at the bottom of one group falls into the top of the next with no special case. Home/End are absolute, not per-group. If your rows are plain text and single-select, `<select><optgroup>` does all of this natively and cannot regress - this markup earns its keep only past that point.',
    seoTitle: 'Grouped Select Listbox - Free Accessible Component',
    seoDescription:
      'A grouped select with ARIA role="group" headings and flat keyboard navigation, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['grouped select', 'optgroup', 'aria group listbox', 'select categories'],
  },
  'select-with-error': {
    title: 'Select with Error',
    description:
      'An invalid select wired with `aria-invalid` and `aria-describedby` - not just a red border.',
    customization:
      'The red border is the least important part. `aria-invalid="true"` is what makes a screen reader say "invalid entry"; colour says nothing to anyone who cannot see it. `aria-describedby` carries both the hint and the error, in that order, because they are announced in the order listed and the error should be what the user is left holding - replacing the hint with the error silently drops an instruction they still need. The presence of `message` IS the invalid state: there is no separate boolean to fall out of step with it, so a red control with no message cannot be expressed. Note the error text has no `role="alert"` - the control already describes it, and an alert would announce it twice on every focus.',
    seoTitle: 'Select with Error State - Free Accessible Form Component',
    seoDescription:
      'An invalid select with aria-invalid, aria-describedby and an AA-contrast error message, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['select error', 'aria-invalid', 'form validation', 'accessible error message'],
  },
  'multiselect-chips': {
    title: 'Multiselect with Chips',
    description: 'Chosen options as removable chips in the control, over a multi-select listbox.',
    customization:
      'The structural trap: a chip needs a remove button, and a button cannot nest inside a button. So the control is a `<div>` dressed as a field with the chips and the toggle as siblings, and `:focus-within` keeps the box ringed while real focus sits on a chip. That buys every chip its own tab stop, which is the point - "Remove React" is a real, reachable action rather than a trip back into the popup. Each remove button hands focus to the toggle before it unmounts itself, or focus falls to `<body>`. `aria-multiselectable="true"` is not optional: without it the popup announces as single-select and nobody expects the second pick to stick.',
    seoTitle: 'Multiselect with Chips - Free Accessible React Component',
    seoDescription:
      'A multi-select listbox with removable chips, full ARIA and keyboard support, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['multiselect chips', 'multi select tags', 'aria multiselectable', 'react multiselect'],
  },
  'multiselect-checkbox-list': {
    title: 'Multiselect Checkbox List',
    description: 'A disclosure over a fieldset of real checkboxes - no listbox, no virtual focus.',
    customization:
      'Pointedly not a listbox. Real `<input type="checkbox">` means the browser owns Tab and Space, the platform announces "checked" in the user’s own words, and there is no `aria-selected` to drift from the visual tick - the whole `aria-activedescendant` apparatus disappears. `fieldset` + `legend` is what makes six loose checkboxes one question. The trade is that Tab now walks every option instead of skipping the group: fine at eight rows, wrong at eighty. Past that, use `multiselect-chips` and pay for the keyboard handler. The toggle takes `aria-expanded` without `aria-haspopup="listbox"` - it is a disclosure, and promising a listbox that is not there is worse than promising nothing.',
    seoTitle: 'Multiselect Checkbox Dropdown - Free Accessible Component',
    seoDescription:
      'A checkbox-list multi-select dropdown using a real fieldset and native checkboxes, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['checkbox dropdown', 'multiselect checkbox', 'fieldset legend', 'accessible checkbox list'],
  },
  'multiselect-inline-tags': {
    title: 'Multiselect Inline Tags',
    description: 'Tags rendered inside the trigger, with Backspace removing the last one.',
    customization:
      'The tags here are inert text with no remove buttons, which is exactly what keeps the whole control one tab stop - the difference from `multiselect-chips`, and a real one. Backspace is the affordance that replaces the missing ×, and the printed hint below says so, because an invisible shortcut is not an affordance. Two guards make it safe: it fires only while the popup is closed (open, the key belongs to the list), and every removal goes through a polite live region - a destructive key with no feedback quietly eats work, since the tag leaves the screen and a screen-reader user never learns which one went.',
    seoTitle: 'Inline Tag Multiselect - Free Accessible React Component',
    seoDescription:
      'A multi-select with inline tags and Backspace-to-remove, announced through a live region, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['inline tags input', 'tag multiselect', 'backspace remove tag', 'aria live region'],
  },
  'multiselect-limit': {
    title: 'Multiselect with Limit',
    description: 'A capped multi-select that disables the rest at the cap - and says why.',
    customization:
      'Every decision here is a rule about not lying to the user. Capped rows get `aria-disabled="true"`, never the `disabled` attribute and never removal: they stay arrowable, announced and legible at 0.6 opacity, because the user is entitled to read what the cap is costing them - a row that vanishes is a row they think they imagined. Already-chosen rows never disable, or untick stops working and the cap becomes a trap. The status doubles as the `aria-describedby` target and a live region, so hitting the cap is announced when it happens; it states the remedy ("remove one to add another") because "maximum reached" tells you that you are stuck without telling you how to get unstuck. `aria-disabled` is advisory - the click still fires, so the guard lives in code too.',
    seoTitle: 'Multiselect with Max Limit - Free Accessible Component',
    seoDescription:
      'A capped multi-select using aria-disabled and a live status region to explain the limit, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['multiselect limit', 'max selections', 'aria-disabled', 'accessible limit message'],
  },
  'multiselect-grouped': {
    title: 'Grouped Multiselect',
    description: 'Grouped checkboxes with a three-state select-all per group.',
    customization:
      'A select-all box has three states, not two - all, none, and *some* - and `indeterminate` is the only way to say the third. It is a DOM property with no HTML attribute, so JSX cannot render it and it has to be written imperatively on every change. Skip that and a half-chosen group paints and announces as "not checked": a screen-reader user ticks it expecting nothing to change and silently grants every permission in the group. Note "some" resolves to *all* on click, never to none - the user clicked toward completion, not to throw away their own work. The group state is derived on every render, never cached, because a cached summary is a summary that drifts.',
    seoTitle: 'Grouped Multiselect with Select All - Free Component',
    seoDescription:
      'A grouped checkbox multi-select with three-state indeterminate select-all, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['select all checkbox', 'indeterminate checkbox', 'grouped multiselect', 'permissions picker'],
  },
  'multiselect-search-basic': {
    title: 'Multiselect with Search',
    description: 'A combobox that filters as you type, over a multi-select listbox.',
    customization:
      'A combobox, not a listbox with a search box bolted on. `role="combobox"` goes on the input itself - wrapping it breaks the `aria-controls` pairing - and because the input is a real form control, this is the one popup pattern that gets a genuine `<label htmlFor>` rather than `aria-labelledby` gymnastics. DOM focus never leaves the input; arrows move `aria-activedescendant` only, or typing stops working the moment you arrow into the list. Two details worth copying: the active index is *clamped* rather than trusted, since the list shrinks under the cursor as you type and a stale id points at nothing; and rows use `onMouseDown` with `preventDefault`, because a click would blur the input and close the popup before the selection landed.',
    seoTitle: 'Searchable Multiselect - Free Accessible Combobox Component',
    seoDescription:
      'A filtering multi-select combobox with full ARIA and keyboard support, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['searchable multiselect', 'aria combobox', 'filter dropdown', 'react combobox'],
  },
  'multiselect-search-async': {
    title: 'Async Multiselect Search',
    description: 'A debounced combobox with real loading, empty and idle states - and a race guard.',
    customization:
      'The fetch is stubbed with a local promise and a `setTimeout` so the snippet runs anywhere; swap `searchProjects()` for your endpoint and keep everything around it. The debounce is the obvious part. The race guard is the one that matters: each request takes a sequence number and a response holding a stale one is dropped, or typing "go" then "golang" can paint the slower earlier results over the newer ones - a bug that only reproduces on a bad connection, which is to say on a user’s, never on yours. There are three empty states, not one: "type to search", "searching…" and "no results" are three different facts, and collapsing them means showing an empty state that is a lie for as long as the request is open. `aria-busy` plus the live region carry all of it - a spinner is invisible to a screen reader.',
    seoTitle: 'Async Multiselect Search - Free Debounced Combobox Component',
    seoDescription:
      'A debounced async multi-select combobox with loading and empty states and a race-condition guard, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['async combobox', 'debounced search', 'race condition', 'loading state dropdown'],
  },
  'multiselect-search-create': {
    title: 'Multiselect with Create',
    description: 'A combobox that offers to create the tag you just typed when nothing matches.',
    customization:
      'The create row is a `role="option"`, not a button under the list - in this pattern it is exactly what it looks like: one more thing Enter can land on. A button there would be unreachable by the arrows that got the user to the bottom of the list. It appears on no *exact* match rather than no results at all: type "des" against "design" and you want the filtered list, not an offer to make a near-duplicate one Enter away. It sits last so it can never steal the Enter meant for a real result. The label is quoted - `Create “design system”` - so a trailing space or an odd capital is visible before it becomes a permanent tag.',
    seoTitle: 'Multiselect with Create Option - Free Combobox Component',
    seoDescription:
      'A searchable multi-select that offers to create missing tags, built on the ARIA combobox pattern, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['create tag combobox', 'creatable select', 'tag input', 'add new option dropdown'],
  },
  'multiselect-search-avatars': {
    title: 'People Picker',
    description: 'An avatar, name and email per row, with the filter searching name and email both.',
    customization:
      'Three parts, three rules. The avatar is decorative without exception - it sits beside the name it depicts, so any alt text at all produces "Ada Lovelace Ada Lovelace"; initials are used over photo URLs because they cannot 404, cannot leak a request to a third party, and cannot shift the layout when they load late. The email is not decoration: it is how you tell two Chens apart, so it is real text in the row and the filter searches it - "@adysre" finds every colleague. The row’s accessible name comes out as "Ada Lovelace ada@adysre.com", which is exactly what a person would say aloud to disambiguate. The email is the smallest text here and still holds 4.5:1; secondary text has no exemption.',
    seoTitle: 'People Picker with Avatars - Free Accessible Component',
    seoDescription:
      'An avatar-and-email people picker built on the ARIA combobox pattern, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['people picker', 'avatar multiselect', 'user select component', 'assignee picker'],
  },
  'multiselect-search-keyboard': {
    title: 'Keyboard Multiselect',
    description:
      'The complete keyboard contract - arrows, Home/End, Enter, two-stage Escape and Backspace.',
    customization:
      'Every other combobox in this category implements a subset of this one. Two behaviours are worth lifting wholesale. Escape is two-stage: one press clears the query, a second closes - a single Escape that dismisses a popup holding a half-typed query throws away work to perform the lesser action, since the user wanted their list back, not their field gone. No spec mandates it; every picker worth using does it. And the arrows wrap: ↓ at the bottom lands on the top, which in a list filtered to two rows is the difference between a flick and a count. Home/End are absolute - the last result, not the bottom of the visible box - and pair with `scrollIntoView`, because a jump to a row you cannot see is not a jump. Tab is never swallowed, or the combobox becomes a keyboard trap. The shortcuts are printed in a legend wired up with `aria-describedby`: an undiscoverable shortcut is a shortcut that does not exist.',
    seoTitle: 'Keyboard-First Multiselect - Free Accessible Combobox',
    seoDescription:
      'A multi-select combobox with the full keyboard contract: arrows, Home/End, Enter, two-stage Escape and Backspace. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['keyboard combobox', 'accessible multiselect', 'keyboard shortcuts dropdown', 'aria activedescendant'],
  },
};
