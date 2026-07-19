import type { ComponentContentMap } from '../types';

/** English prose for the tags category. Keys are component slugs. */
export const tagsContent: ComponentContentMap = {
  'tag-input-chips': {
    title: 'Tag Input Chips',
    description:
      'A text field that turns typed values into removable chips, with the chips wrapping above the input.',
    customization:
      'Enter or a comma commits a chip and Backspace on an empty field removes the last; entries are de-duped case-insensitively and `max` caps the count. Removing a chip returns focus to the input so a keyboard user is never stranded on a button that just unmounted.',
    seoTitle: 'Tag Input Chips - Free React Tailwind Component',
    seoDescription:
      'An accessible tags input that renders typed values as removable, wrapping chips and manages focus, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['tag input', 'chips input', 'tokenizer', 'multi-value field'],
  },
  'tag-removable-list': {
    title: 'Removable Tag List',
    description:
      'A wrapping list of chips, each with a real remove button and an accessible label.',
    customization:
      'Each chip owns a `<button aria-label="Remove …">` rather than a bare glyph, and the row is a `<ul>` that wraps at any width. Clearing the last chip swaps in an empty-state line instead of collapsing to nothing.',
    seoTitle: 'Removable Tag List - Free Tailwind CSS Component',
    seoDescription:
      'A list of dismissible chips with accessible remove buttons that wraps on any screen, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['removable tags', 'dismissible chips', 'filter chips', 'tag list'],
  },
  'tag-colored-categories': {
    title: 'Colored Category Tags',
    description:
      'Category labels tinted from a fixed, contrast-safe colour palette keyed by name.',
    customization:
      'Colour is a closed set (`gray`, `blue`, `green`, `amber`, `red`, `purple`), each a full static class string so Tailwind never purges it and each tint keeps a readable text pairing in both themes. Free-form hex is deliberately not allowed - an arbitrary colour cannot guarantee its own contrast.',
    seoTitle: 'Colored Category Tags - Free Tailwind CSS Component',
    seoDescription:
      'Category tags with a fixed, accessible colour palette for light and dark, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['category tags', 'colored labels', 'colored badges', 'tag colors'],
  },
  'tag-filter-toggle': {
    title: 'Filter Toggle Tags',
    description:
      'A wrapping row of toggle chips for faceted filtering, each carrying its pressed state.',
    customization:
      'Each filter is a button with `aria-pressed`, so its on/off state reaches a screen reader rather than living in colour alone; a clear-all link appears once anything is active. Drive selections through `onChange`.',
    seoTitle: 'Filter Toggle Tags - Free React Tailwind Component',
    seoDescription:
      'Accessible toggle-chip filters with aria-pressed state and a clear-all, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['filter tags', 'toggle chips', 'faceted filters', 'filter pills'],
  },
  'tag-autocomplete': {
    title: 'Tag Autocomplete',
    description:
      'A combobox that filters a suggestion list as you type and adds the picked value as a chip.',
    customization:
      'The field is a `role="combobox"` wired to a `role="listbox"`; matches exclude tags already chosen, and blur is delayed so an option click registers before the list unmounts. Feed the pool through `suggestions`.',
    seoTitle: 'Tag Autocomplete - Free React Tailwind Component',
    seoDescription:
      'An accessible tag autocomplete combobox with a filtered suggestion listbox, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['tag autocomplete', 'combobox tags', 'tag suggestions', 'typeahead tags'],
  },
  'tag-overflow-counter': {
    title: 'Tag Overflow Counter',
    description:
      'Shows the first few tags and rolls the rest into a +N button that expands them.',
    customization:
      'Set how many chips show before the overflow with `max`; the `+N` control carries an `aria-label` naming the hidden count and correctly singularises "tag" versus "tags". Clicking it reveals the full wrapping set.',
    seoTitle: 'Tag Overflow Counter - Free React Tailwind Component',
    seoDescription:
      'A tag row that collapses extras into an accessible +N counter and expands on demand, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['tag overflow', 'plus n more', 'truncated tags', 'tag counter'],
  },
  'tag-selectable-grid': {
    title: 'Selectable Tag Grid',
    description:
      'A wrapping grid of multi-select tags with a check cue layered on top of the selected colour.',
    customization:
      'Each option is an `aria-pressed` button; the check glyph is a redundant, decorative signal on top of the state colour so selection never relies on hue alone. Pass the choices via `options` and read them back through `onChange`.',
    seoTitle: 'Selectable Tag Grid - Free React Tailwind Component',
    seoDescription:
      'An accessible multi-select tag grid with redundant check cues, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['selectable tags', 'multi-select chips', 'interest picker', 'tag grid'],
  },
  'tag-with-icons': {
    title: 'Tags With Icons',
    description:
      'Chips that pair a leading icon from a small fixed set with their text label.',
    customization:
      'Each item names one of `star`, `bolt`, `check` or `tag`; the glyph is `aria-hidden` because the text already names the tag, and the icons are inline SVG paths so nothing loads over the network. The row wraps at any width.',
    seoTitle: 'Tags With Icons - Free Tailwind CSS Component',
    seoDescription:
      'Tag chips with leading inline-SVG icons and a decorative-glyph pattern, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['tags with icons', 'icon chips', 'labeled tags', 'icon tags'],
  },
  'tag-editable': {
    title: 'Editable Tags',
    description:
      'Chips whose label doubles as an edit button, swapping in an inline field to rename.',
    customization:
      'Activating a chip opens an inline input that selects its text; Enter commits, Escape cancels, and clearing the field deletes the tag rather than leaving a blank chip. Each chip also keeps its own accessible remove button.',
    seoTitle: 'Editable Tags - Free React Tailwind Component',
    seoDescription:
      'Inline-editable tag chips with rename-on-click, keyboard commit and cancel, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['editable tags', 'inline edit chips', 'rename tags', 'editable chips'],
  },
  'tag-size-variants': {
    title: 'Tag Size Variants',
    description:
      'One chip rendered at three sizes, with padding and text scaling together per step.',
    customization:
      'The `size` prop picks `sm`, `md` or `lg`; each maps to a static class string so padding and font size step in proportion. Pass `className` to extend a single instance without touching the size scale.',
    seoTitle: 'Tag Size Variants - Free Tailwind CSS Component',
    seoDescription:
      'A tag chip with small, medium and large size variants that scale proportionally, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['tag sizes', 'chip sizes', 'badge size variants', 'small medium large tag'],
  },
};
