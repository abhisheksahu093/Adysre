import type { ComponentContentMap } from '../types';

/** English prose for the calendar category. Keys are component slugs. */
export const calendarContent: ComponentContentMap = {
  'calendar-month-grid': {
    title: "Month Grid Calendar",
    description:
      "A full month laid out as an accessible table with prev/next navigation, a today ring and a selectable day.",
    customization:
      "Drive it with `year`/`month` and mark days via `today` and `selected` ISO strings - never read the clock, or previews and tests drift. Wire `onSelect`, `onPrevMonth` and `onNextMonth` to your own state to make it interactive.",
    seoTitle: "Month Grid Calendar - Free Tailwind CSS Component",
    seoDescription:
      "An accessible month calendar built as a real HTML table with weekday headers, today ring and day selection, in Tailwind, React and TypeScript. MIT licensed.",
    keywords: ["calendar component", "month calendar", "tailwind calendar", "date grid"],
  },
  'calendar-mini-compact': {
    title: "Compact Mini Calendar",
    description:
      "A tight datepicker-body calendar with single-letter headers that drops into a popover at ~260px wide.",
    customization:
      "Same table semantics as the full grid but `h-8` cells and one-letter weekday headers; the full weekday stays in an `sr-only` span since S/S and T/T repeat. Feed `year`, `month`, `today` and `selected`, and handle `onSelect`.",
    seoTitle: "Compact Mini Calendar - Free Tailwind CSS Component",
    seoDescription:
      "A small popover-sized month calendar with single-letter weekday headers, in Tailwind, React and TypeScript. Accessible and MIT licensed.",
    keywords: ["mini calendar", "compact calendar", "datepicker calendar", "popover calendar"],
  },
  'calendar-week-strip': {
    title: "Week Day Strip",
    description:
      "A single week as seven equal-width day buttons that shrink to ~40px without overflowing a phone.",
    customization:
      "Set the leftmost day with `startDate`; the week is derived from there. `min-w-0` plus `flex-1` lets the columns shrink and the weekday label abbreviates to three letters. The today ring and selected fill are independent signals, so both can show at once.",
    seoTitle: "Week Day Strip Calendar - Free Tailwind CSS Component",
    seoDescription:
      "A horizontal seven-day week selector that stays usable at 320px, in Tailwind, React and TypeScript. Responsive and MIT licensed.",
    keywords: ["week strip", "day picker", "week calendar", "date selector"],
  },
  'calendar-day-schedule': {
    title: "Day Schedule Agenda",
    description:
      "A single day's hours as rows, each event dropped into the hour it starts - no overlap, no overflow.",
    customization:
      "An agenda rather than an absolute-positioned timeline, which trades pixel-exact durations for a layout that never collides or overflows at 320px. Pass `events` with `start`/`end`/`title`/`tone`, and bound the visible window with `fromHour`/`toHour`.",
    seoTitle: "Day Schedule Agenda - Free Tailwind CSS Component",
    seoDescription:
      "A single-day agenda that lays events into hourly rows, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.",
    keywords: ["day schedule", "agenda view", "daily calendar", "event schedule"],
  },
  'calendar-events-month': {
    title: "Events Month Calendar",
    description:
      "A month grid that carries event chips per day, truncating to two plus a \"+N more\" so busy days never blow out the row.",
    customization:
      "Pass `events` keyed by day-of-month. Cells are `align-top` and chips `truncate` so the column width never grows; only two chips render and the rest collapse to a count. \"Today\" is a filled disc on the date number, independent of event styling.",
    seoTitle: "Events Month Calendar - Free Tailwind CSS Component",
    seoDescription:
      "A month calendar with per-day event chips that truncate gracefully, in Tailwind, React and TypeScript. Accessible and MIT licensed.",
    keywords: ["events calendar", "month events", "calendar with events", "schedule calendar"],
  },
  'calendar-heatmap-year': {
    title: "Year Activity Heatmap",
    description:
      "A GitHub-style 53-week by 7-day contribution grid in a horizontal scroll container with a Less-to-More legend.",
    customization:
      "It cannot shrink below 53 columns, so it scrolls horizontally rather than squeezing squares into mush. Supply your own `levelFor(index)` returning 0-4 to colour each day; the grid is one `role=\"img\"` with a summary label because 371 announced squares would be noise.",
    seoTitle: "Year Activity Heatmap - Free Tailwind CSS Component",
    seoDescription:
      "A contribution-style yearly heatmap with a scrollable 53-week grid and intensity legend, in Tailwind, React and TypeScript. MIT licensed.",
    keywords: ["activity heatmap", "contribution graph", "year heatmap", "calendar heatmap"],
  },
  'calendar-upcoming-list': {
    title: "Upcoming Events List",
    description:
      "A vertical list of upcoming events, each a full-row link with a fixed date badge and a coloured tone dot.",
    customization:
      "Feed `events` with `day`/`weekday`/`title`/`time`/`tone`. The whole row is one link, not a tiny hotspot; the 44px date badge keeps titles aligned so they truncate instead of wrapping the badge. Tone dots are decorative - the title carries the meaning.",
    seoTitle: "Upcoming Events List - Free Tailwind CSS Component",
    seoDescription:
      "An accessible upcoming-events list with date badges and tone dots, in Tailwind, React and TypeScript. Responsive and MIT licensed.",
    keywords: ["upcoming events", "agenda list", "event list", "schedule list"],
  },
  'calendar-availability-slots': {
    title: "Availability Time Slots",
    description:
      "A booking grid of 30-minute slots - two columns on a phone, three on desktop - with taken slots shown struck through.",
    customization:
      "Pass `slots` with an optional `booked` flag; taken slots stay as disabled, struck-through buttons so the shape of the day stays legible rather than vanishing. The grid is `grid-cols-2 sm:grid-cols-3` so buttons never stretch into one wide column.",
    seoTitle: "Availability Time Slots - Free Tailwind CSS Component",
    seoDescription:
      "An accessible time-slot booking grid with disabled taken slots, in Tailwind, React and TypeScript. Responsive and MIT licensed.",
    keywords: ["time slots", "availability picker", "booking slots", "appointment calendar"],
  },
  'calendar-dual-month': {
    title: "Dual Month Range",
    description:
      "Two side-by-side months for range selection that stack to one column at 320px, with a shaded span between endpoints.",
    customization:
      "Set `rangeStart`/`rangeEnd` ISO strings; endpoints are filled and the days between get a lighter fill so the selection reads as one continuous span. The panels are `flex-col sm:flex-row` because two seven-column grids never fit a phone side by side.",
    seoTitle: "Dual Month Range Calendar - Free Tailwind CSS Component",
    seoDescription:
      "A two-month date-range calendar that stacks on mobile, with a shaded selection span, in Tailwind, React and TypeScript. MIT licensed.",
    keywords: ["date range calendar", "dual month", "range picker", "two month calendar"],
  },
  'calendar-year-overview': {
    title: "Year Overview Grid",
    description:
      "All twelve months as mini-tables that reflow from one column to four, with today marked once across the whole year.",
    customization:
      "Each tile is a real `<table>` with single-letter headers (full weekday in an `sr-only` span). The grid steps `1 / sm:2 / lg:3 / xl:4` columns so tiles reflow instead of shrinking below legibility. Only `year` and `today` are needed.",
    seoTitle: "Year Overview Calendar - Free Tailwind CSS Component",
    seoDescription:
      "A twelve-month year overview of mini calendars that reflows responsively, in Tailwind, React and TypeScript. Accessible and MIT licensed.",
    keywords: ["year calendar", "year overview", "twelve month calendar", "annual calendar"],
  },
};
