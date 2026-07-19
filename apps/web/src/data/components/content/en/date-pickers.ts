import type { ComponentContentMap } from '../types';

/** English prose for the date-pickers category. Keys are component slugs. */
export const datePickersContent: ComponentContentMap = {
  'date-picker-input-popover': {
    title: 'Input With Popover Calendar',
    description:
      'A read-only field that opens an absolutely positioned calendar popover, filling the input on select.',
    customization:
      'The field is `readOnly` so the calendar is the only way in - no half-typed dates to parse. `aria-expanded` on the trigger tells assistive tech the popover state, and the grid is a real `<table>` so each `<th scope="col">` announces its weekday over the whole column.',
    seoTitle: 'Date Picker Input With Popover - Free Tailwind Component',
    seoDescription:
      'An accessible date input that opens a calendar popover, in Tailwind, React and TypeScript. Deterministic, WCAG AA and MIT licensed.',
    keywords: ['date picker', 'calendar popover', 'date input', 'tailwind date picker'],
  },
  'date-picker-inline-calendar': {
    title: 'Inline Calendar',
    description:
      'An always-visible single-month calendar with month navigation and a selected day.',
    customization:
      'No trigger, no popover - the calendar is the control. `today` is a prop rather than `new Date()`, so the same July 2026 renders in every preview, screenshot and test. Each day is an `h-10` button because at 320px the seven columns are ~41px wide and the column width is the tap target.',
    seoTitle: 'Inline Calendar Date Picker - Free Tailwind Component',
    seoDescription:
      'An always-on month calendar with navigation and selection, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['inline calendar', 'date picker', 'month calendar', 'tailwind calendar'],
  },
  'date-picker-range-single-month': {
    title: 'Date Range (Single Month)',
    description:
      'Pick a start and end date in one month; the days between highlight as a range.',
    customization:
      'The two clicks set start then end, swapping if you pick the earlier day second. Range membership compares ISO strings directly - they are zero-padded, so lexical order is chronological order. Endpoints are solid; the days between get a light fill.',
    seoTitle: 'Date Range Picker Single Month - Free Tailwind Component',
    seoDescription:
      'A single-month date range picker with start, end and highlighted span, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['date range picker', 'range calendar', 'start end date', 'tailwind range'],
  },
  'date-picker-range-dual-month': {
    title: 'Date Range (Dual Month)',
    description:
      'Two side-by-side months sharing one range, stacking to a single column on mobile.',
    customization:
      'Both months read one start/end pair, so a range can span the boundary. The grid is `sm:grid-cols-2`, so below `sm` the second month drops beneath the first instead of overflowing a phone. Navigation shifts both months together.',
    seoTitle: 'Dual Month Date Range Picker - Free Tailwind Component',
    seoDescription:
      'A two-month date range picker that stacks on mobile, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['dual month range', 'date range picker', 'two month calendar', 'responsive date picker'],
  },
  'date-picker-with-presets': {
    title: 'Date Picker With Presets',
    description:
      'A calendar beside quick-pick shortcuts like Today, Tomorrow and Next week.',
    customization:
      'Presets are computed by adding days to the `today` prop, so they stay deterministic and never read the clock; choosing one both selects the date and navigates the grid to its month. The shortcut column sits beside the calendar above `sm` and wraps above it below.',
    seoTitle: 'Date Picker With Presets - Free Tailwind Component',
    seoDescription:
      'A date picker with quick-pick preset shortcuts beside a calendar, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['date picker presets', 'quick date shortcuts', 'calendar presets', 'tailwind date picker'],
  },
  'date-picker-dropdown-selects': {
    title: 'Date Picker With Dropdown Selects',
    description:
      'Native month and year selects above the grid for fast jumps across the calendar.',
    customization:
      'Month and year are real `<select>` menus, so navigation is keyboard- and screen-reader-native and you can jump years without clicking a chevron dozens of times. The `years` prop bounds the range; changing either select re-renders the month.',
    seoTitle: 'Date Picker Dropdown Selects - Free Tailwind Component',
    seoDescription:
      'A date picker with native month and year select menus over a calendar grid, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['date picker dropdown', 'month year select', 'calendar navigation', 'tailwind date picker'],
  },
  'date-picker-input-masked': {
    title: 'Masked Date Input',
    description:
      'A keyboard-first MM/DD/YYYY field that masks as you type and mirrors a valid parse in a mini calendar.',
    customization:
      'Digits are masked into `MM/DD/YYYY` on every keystroke; a complete, valid entry drives the calendar and flips `aria-invalid` off, while clicking a day writes back into the field. Validation rejects impossible days by checking the real length of the month.',
    seoTitle: 'Masked Date Input Picker - Free React Component',
    seoDescription:
      'A masked MM/DD/YYYY date input with live validation and a linked calendar, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['masked date input', 'date mask', 'mm/dd/yyyy input', 'date validation'],
  },
  'date-picker-min-max-bounds': {
    title: 'Date Picker With Min/Max Bounds',
    description:
      'A calendar where days outside a min-max window are truly disabled, not just greyed.',
    customization:
      'Out-of-range days carry the real `disabled` attribute plus `aria-disabled`, so they take no click and leave the tab order - greying alone would still let a keyboard or screen-reader user select a blocked date. Pass `min` and `max` as ISO strings to move the window.',
    seoTitle: 'Date Picker With Min Max Bounds - Free Tailwind Component',
    seoDescription:
      'A date picker that disables days outside a min/max range, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['min max date picker', 'disabled dates', 'bounded calendar', 'date range limit'],
  },
  'date-picker-birthday': {
    title: 'Birthday Date Picker',
    description:
      'Three native day, month and year selects - the right tool for a date decades in the past.',
    customization:
      'A calendar grid is cruelty for a birthday: nobody wants to page a calendar back forty years. Three selects jump straight there; the day count adjusts to the chosen month and year, and the computed age is measured against the `today` prop, never the clock.',
    seoTitle: 'Birthday Date Picker - Free React Component',
    seoDescription:
      'A day/month/year select-based birthday picker with computed age, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['birthday picker', 'date of birth input', 'dob select', 'age picker'],
  },
  'date-picker-week-picker': {
    title: 'Week Picker',
    description:
      'Clicking any day selects its whole Sunday-Saturday week, highlighting the entire row.',
    customization:
      'One click picks the week the day belongs to; every cell in that week carries `aria-selected`, and the row endpoints round while the middle stays square to read as one band. Week bounds are derived from the clicked date, so selection always snaps to a full seven days.',
    seoTitle: 'Week Picker Calendar - Free Tailwind Component',
    seoDescription:
      'A calendar that selects a whole week from any day, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['week picker', 'select week', 'weekly date picker', 'calendar week selection'],
  },
};
