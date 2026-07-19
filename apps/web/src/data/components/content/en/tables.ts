import type { ComponentContentMap } from '../types';

/** English prose for the tables category. Keys are component slugs. */
export const tablesContent: ComponentContentMap = {
  'table-basic-striped': {
    title: 'Basic Striped Table',
    description:
      'A data-driven table with zebra striping, wrapped in a horizontal scroller that keeps it usable at 320px.',
    customization:
      'Feed it `columns` and `rows`; striping is `odd:bg-*` on the row, not a class per row. The table keeps a `min-w` floor and the wrapping div scrolls sideways, so the columns never crush and the page never overflows.',
    seoTitle: 'Basic Striped Table - Free Tailwind CSS Component',
    seoDescription:
      'A responsive, data-driven striped table with a horizontal scroller, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['striped table', 'zebra table', 'data table', 'tailwind table'],
  },
  'table-sortable-header': {
    title: 'Sortable Header Table',
    description:
      'A table whose columns sort on a keyboard-reachable header button, with the state exposed via `aria-sort`.',
    customization:
      'Mark columns `sortable` and the header becomes a `<button>` that toggles ascending/descending; the `<th>` carries `aria-sort` so screen readers announce the order, and the arrow glyph is aria-hidden decoration echoing it.',
    seoTitle: 'Sortable Table - Free React Component',
    seoDescription:
      'An accessible sortable-column data table using aria-sort, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['sortable table', 'sort columns', 'aria-sort', 'data table'],
  },
  'table-selectable-rows': {
    title: 'Selectable Rows Table',
    description:
      'Row checkboxes with a tri-state select-all header and a live-updating selection count.',
    customization:
      'The header checkbox is genuinely tri-state - `indeterminate` is a DOM property with no attribute, so it is set via a ref in an effect. Each row checkbox gets an `aria-label` naming its row, and the selected row is tinted so selection is not carried by the checkmark alone.',
    seoTitle: 'Selectable Rows Table - Free React Component',
    seoDescription:
      'A data table with row selection, a tri-state select-all checkbox and a live count, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['selectable table', 'row selection', 'select all checkbox', 'bulk actions table'],
  },
  'table-with-avatars-status': {
    title: 'Avatars & Status Table',
    description:
      'A members table with gradient-initials avatars and status badges that pair a colour dot with a word.',
    customization:
      'Pass `people`; initials and a rotating gradient avatar are derived from the name, so no image is ever fetched or broken. Each status is a coloured dot plus a label - colour alone fails colour-blind users - and the dot is aria-hidden so it is not read twice.',
    seoTitle: 'User Table with Avatars and Status - Free Tailwind Component',
    seoDescription:
      'A members table with initials avatars and accessible status badges, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['user table', 'avatar table', 'status badge table', 'team members table'],
  },
  'table-sticky-header': {
    title: 'Sticky Header Table',
    description:
      'A scrollable table whose header pins to the top of its own scroll box as the body scrolls under it.',
    customization:
      'One box scrolls both ways: `overflow-auto` with a `maxHeight` for the vertical scroll and a `min-w` on the table for the horizontal. The header cells are `sticky top-0` with their own opaque background and `z-10` so the body rows never bleed through as they pass beneath.',
    seoTitle: 'Sticky Header Table - Free Tailwind CSS Component',
    seoDescription:
      'A vertically scrollable data table with a sticky, pinned header, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['sticky header table', 'pinned header', 'scrollable table', 'fixed header table'],
  },
  'table-expandable-rows': {
    title: 'Expandable Rows Table',
    description:
      'Each row expands to reveal a detail row spanning every column, toggled by an accessible disclosure button.',
    customization:
      'The detail is a second `<tr>` with a spanning cell, revealed below the summary. The toggle is a real `<button>` carrying `aria-expanded` and `aria-controls` pointing at the detail row, so its state and target are announced; the chevron just rotates.',
    seoTitle: 'Expandable Rows Table - Free React Component',
    seoDescription:
      'A data table with accessible expandable detail rows using aria-expanded, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['expandable table', 'row detail', 'collapsible rows', 'disclosure table'],
  },
  'table-pagination-footer': {
    title: 'Paginated Table',
    description:
      'Client-side pagination in a real `<tfoot>`, with a live "Showing X-Y of Z" range and Prev/Next controls.',
    customization:
      'Set `pageSize` and the table slices `rows` per page. The footer is a `<tfoot>` cell spanning every column; the range line is `aria-live` so it announces on change, and the Prev/Next buttons disable - not hide - at the ends so their position stays put.',
    seoTitle: 'Paginated Table - Free React Component',
    seoDescription:
      'A data table with client-side pagination, a live range readout and accessible controls, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['pagination table', 'paginated table', 'table footer', 'page controls'],
  },
  'table-editable-cells': {
    title: 'Editable Cells Table',
    description:
      'Inline cell editing: click a cell to swap in an input, commit on Enter or blur and cancel on Escape.',
    customization:
      'Mark columns `editable`; a reading cell is a full-width `<button>` (keyboard-reachable and obviously interactive) that swaps in an `<input>` with an `aria-label` naming the field. Commit on Enter or blur, cancel on Escape - the lost-edit-on-blur bug handled.',
    seoTitle: 'Editable Cells Table - Free React Component',
    seoDescription:
      'A data table with accessible inline cell editing and keyboard commit/cancel, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['editable table', 'inline edit', 'editable cells', 'data grid editing'],
  },
  'table-responsive-stacked': {
    title: 'Responsive Stacked Table',
    description:
      'One semantic table that renders as labelled cards on mobile and a normal grid from `md` up - no sideways scroll.',
    customization:
      'A single `<table>` changes its own `display`: below `md` every part is `block`, the `<thead>` is hidden and each `<td>` shows its column name from a `data-label` via `before:content-[attr(data-label)]`. At `md` the display utilities hand it back to the browser as a real table.',
    seoTitle: 'Responsive Stacked Table - Free Tailwind CSS Component',
    seoDescription:
      'A data table that collapses to labelled cards on mobile from a single semantic table, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['responsive table', 'stacked table', 'mobile table cards', 'data-label table'],
  },
  'table-data-toolbar': {
    title: 'Data Table Toolbar',
    description:
      'A table with a toolbar above it: text search, a category filter select and a column-visibility toggle.',
    customization:
      'The toolbar `flex-wrap`s so the three controls stack at 320px instead of overflowing. Search has an `sr-only` label and aria-hidden icon, the filter select filters on `filterKey`, and a `<details>` panel of checkboxes hides/shows columns - with an `aria-live` count of the filtered set.',
    seoTitle: 'Data Table with Toolbar - Free React Component',
    seoDescription:
      'A data table with search, filtering and column-visibility controls, in Tailwind, React and TypeScript. Responsive, accessible and MIT licensed.',
    keywords: ['data table toolbar', 'table search', 'table filter', 'column toggle table'],
  },
};
