import type { ComponentContentMap } from '../types';

/** English prose for the time-pickers category. Keys are component slugs. */
export const timePickersContent: ComponentContentMap = {
  'time-picker-dropdown-intervals': {
    title: 'Interval Dropdown Time Picker',
    description:
      'A native select of times generated on a fixed interval, so the value always lands on the grid.',
    customization:
      'Set `intervalMinutes` (clamped 5-60) to change the granularity; a native `<select>` is used because it is keyboard-operable and screen-reader-friendly for free, with only the chevron drawn as an `aria-hidden` overlay.',
    seoTitle: 'Interval Dropdown Time Picker - Free React Component',
    seoDescription:
      'An accessible time picker built on a native select with times generated at a fixed interval, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['time picker', 'time dropdown', 'interval time select', 'tailwind time picker'],
  },
  'time-picker-steppers-input': {
    title: 'Stepper Time Input',
    description:
      'Hours and minutes as ARIA spinbuttons with plus/minus controls and arrow-key support.',
    customization:
      'Each field is a `role="spinbutton"` with live `aria-valuenow`/`aria-valuetext`, driven by the up/down buttons or the Arrow keys, and both wrap cleanly across 0. Tune `minuteStep` to change how far the minute field jumps per press.',
    seoTitle: 'Stepper Time Input - Free React Component',
    seoDescription:
      'A time input with increment and decrement steppers exposed as ARIA spinbuttons, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['stepper time input', 'spinbutton time picker', 'increment time', 'time input'],
  },
  'time-picker-analog-dial': {
    title: 'Analog Dial Time Picker',
    description:
      'A clock face whose twelve hour marks are real buttons, with an SVG hand pointing at the selection.',
    customization:
      'The marks are positioned with trigonometry around a percentage-based circle so the dial scales fluidly, and the hand is a decorative SVG overlay that follows the selected hour. AM/PM is preserved from the incoming value, and every mark is keyboard-focusable with a visible ring.',
    seoTitle: 'Analog Dial Time Picker - Free React Component',
    seoDescription:
      'An analog clock-face time picker with focusable hour marks and an SVG hand, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['analog time picker', 'clock picker', 'dial time picker', 'svg clock'],
  },
  'time-picker-12h-24h-toggle': {
    title: '12h / 24h Toggle Time Picker',
    description:
      'Hour and minute selects with a format switch, while the stored value stays 24-hour throughout.',
    customization:
      'The `value` is always a 24-hour `HH:MM` string; the 12h/24h toggle and AM/PM pills only change presentation, so consumers never have to guess what the picker meant. In 24-hour mode the AM/PM control disappears and the hour list runs 0-23.',
    seoTitle: '12-Hour / 24-Hour Time Picker - Free React Component',
    seoDescription:
      'A time picker that switches between 12-hour and 24-hour display while keeping a canonical 24-hour value, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['12 hour time picker', '24 hour time picker', 'am pm toggle', 'time format switch'],
  },
  'time-picker-range-start-end': {
    title: 'Start / End Range Time Picker',
    description:
      'Paired start and end selects that stack on mobile and flag an end that precedes the start.',
    customization:
      'Because both bounds are zero-padded `HH:MM` strings, a plain string comparison is a valid chronological check - an invalid end sets `aria-invalid`, reddens the field and surfaces a `role="alert"` message. The two selects sit side by side above `sm` and stack below it.',
    seoTitle: 'Start and End Time Range Picker - Free React Component',
    seoDescription:
      'A two-field time range picker with start/end validation that stacks on mobile, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['time range picker', 'start end time', 'time range select', 'from to time picker'],
  },
  'time-picker-slots-grid': {
    title: 'Slots Grid Time Picker',
    description:
      'A radiogroup of tappable time-slot buttons that wraps from one column at 320px upward.',
    customization:
      'Pass the bookable `slots` as 24-hour strings; the grid uses `auto-fill` with a `minmax(4.5rem,1fr)` track so it reflows across every width without breakpoints. Buttons carry `role="radio"` with `aria-checked` and a visible focus ring.',
    seoTitle: 'Time Slots Grid Picker - Free Tailwind CSS Component',
    seoDescription:
      'A responsive grid of selectable time slots as an accessible radiogroup, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['time slots grid', 'booking time picker', 'appointment slots', 'time slot buttons'],
  },
  'time-picker-scroll-columns': {
    title: 'Scroll Columns Time Picker',
    description:
      'Three independently scrollable columns of hours, minutes and AM/PM in a compact wheel-style panel.',
    customization:
      'Each column is an `overflow-y-auto` list of buttons with `aria-pressed` marking the active value; the selection recombines into a 24-hour `HH:MM` string on every tap. Adjust `minuteStep` to thin or thicken the minute column.',
    seoTitle: 'Scroll Columns Time Picker - Free React Component',
    seoDescription:
      'A mobile-style time picker with scrollable hour, minute and period columns, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['scroll time picker', 'wheel time picker', 'column time picker', 'mobile time picker'],
  },
  'time-picker-keyboard-typed': {
    title: 'Keyboard Typed Time Picker',
    description:
      'Two masked HH and MM fields that clamp input, auto-advance and respond to the arrow keys.',
    customization:
      'Typing is filtered to digits and clamped to valid ranges; a full two-digit hour auto-advances focus to the minutes field, and Arrow Up/Down nudge each segment. The container shows a single `focus-within` ring so the pair reads as one control.',
    seoTitle: 'Typed Time Input Picker - Free React Component',
    seoDescription:
      'A keyboard-first masked time input with clamping, auto-advance and arrow-key support, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['typed time input', 'masked time picker', 'keyboard time picker', 'time entry field'],
  },
  'time-picker-duration': {
    title: 'Duration Picker',
    description:
      'Hours and minutes selects that edit a single total-minutes value with a live summary.',
    customization:
      'The component edits one `value` in total minutes and reports it back the same way, so callers never juggle two fields; a polite `aria-live` line echoes the running total. Bound the range with `maxHours` and thin the minute list with `minuteStep`.',
    seoTitle: 'Duration Picker - Free React Component',
    seoDescription:
      'A duration picker with hours and minutes selects backed by a single total-minutes value, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['duration picker', 'length picker', 'hours minutes picker', 'time duration input'],
  },
  'time-picker-timezone-select': {
    title: 'Time + Timezone Picker',
    description:
      'A time select paired with an IANA timezone select for unambiguous cross-zone scheduling.',
    customization:
      'The `time` and `zone` are reported together so a scheduled moment is never ambiguous; the zone list is overridable via the `zones` prop and ships with a sensible default set. The two fields sit inline above `sm` and stack below it.',
    seoTitle: 'Time and Timezone Picker - Free React Component',
    seoDescription:
      'A combined time and timezone picker for cross-zone scheduling, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['timezone picker', 'time zone select', 'scheduling picker', 'time with timezone'],
  },
};
