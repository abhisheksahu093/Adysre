import type { ComponentEntry } from './types';

/**
 * Time-pickers category.
 *
 * Ten structurally different ways to enter a time of day, not ten skins of one
 * field: an interval dropdown, +/- steppers, an analog dial, a 12/24h toggle, a
 * start/end range, a tappable slot grid, scrollable columns, a typed masked
 * input, a duration picker and a time+timezone pair. Two constraints recur.
 * First, a "time" is one 24-hour `HH:MM` string on the wire regardless of how it
 * is shown - the 12h/AM-PM presentation is a view concern, never the stored
 * value, so a picker and its consumer never disagree about what 1pm means.
 * Second, every control is keyboard-operable with a visible focus ring: a picker
 * you can only reach with a mouse is a picker half your users cannot use.
 */
export const timePickersComponents: ComponentEntry[] = [
  {
    slug: 'time-picker-dropdown-intervals',
    category: 'time-pickers',
    tags: ['time-picker', 'dropdown', 'select', 'intervals', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'filled', labelKey: 'filled' },
    ],
    props: [
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: "'09:30'" },
      { name: 'onChange', type: '(value: string) => void', required: true, descriptionKey: 'onChange' },
      { name: 'intervalMinutes', type: 'number', default: '30', descriptionKey: 'intervalMinutes' },
      { name: 'label', type: 'string', default: "'Time'", descriptionKey: 'label' },
      { name: 'id', type: 'string', default: "'time-dropdown'", descriptionKey: 'id' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-xs">
  <label for="time-dropdown" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
  <div class="relative">
    <!-- A native <select> is fully keyboard-operable for free; only the arrow is custom, so it is aria-hidden and pointer-events-none. -->
    <select id="time-dropdown" class="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      <option value="09:00">9:00 AM</option>
      <option value="09:30" selected>9:30 AM</option>
      <option value="10:00">10:00 AM</option>
      <option value="10:30">10:30 AM</option>
    </select>
    <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>
  </div>
</div>`,
      react: `import { useMemo } from 'react';

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24, minute) {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

export function TimePickerDropdownIntervals({
  value,
  onChange,
  intervalMinutes = 30,
  label = 'Time',
  id = 'time-dropdown',
  className = '',
}) {
  // Options are derived from the interval, so the value is always a real
  // HH:MM string on a grid and never a free-form typo.
  const options = useMemo(() => {
    const step = Math.min(60, Math.max(5, intervalMinutes));
    const out = [];
    for (let mins = 0; mins < 1440; mins += step) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
    }
    return out;
  }, [intervalMinutes]);

  return (
    <div className={'w-full max-w-xs ' + className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}`,
      typescript: `import { useMemo } from 'react';

export interface TimePickerDropdownIntervalsProps {
  /** Selected time as a 24-hour \`HH:MM\` string; must land on the interval grid. */
  value: string;
  onChange: (value: string) => void;
  /** Minutes between options, clamped to 5-60. */
  intervalMinutes?: number;
  label?: string;
  id?: string;
  className?: string;
}

interface TimeOption {
  value: string;
  label: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

export function TimePickerDropdownIntervals({
  value,
  onChange,
  intervalMinutes = 30,
  label = 'Time',
  id = 'time-dropdown',
  className = '',
}: TimePickerDropdownIntervalsProps): JSX.Element {
  const options = useMemo<TimeOption[]>(() => {
    const step = Math.min(60, Math.max(5, intervalMinutes));
    const out: TimeOption[] = [];
    for (let mins = 0; mins < 1440; mins += step) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
    }
    return out;
  }, [intervalMinutes]);

  return (
    <div className={'w-full max-w-xs ' + className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-steppers-input',
    category: 'time-pickers',
    tags: ['time-picker', 'stepper', 'spinbutton', 'increment', 'input'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'outline', labelKey: 'outline' },
    ],
    props: [
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: "'14:30'" },
      { name: 'onChange', type: '(value: string) => void', required: true, descriptionKey: 'onChange' },
      { name: 'minuteStep', type: 'number', default: '5', descriptionKey: 'minuteStep' },
      { name: 'label', type: 'string', default: "'Time'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-xs">
  <span class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
  <div class="flex items-center gap-2">
    <div class="flex flex-col items-center gap-1">
      <button type="button" aria-label="Increment hours" class="flex h-10 w-14 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" /></svg>
      </button>
      <div role="spinbutton" tabindex="0" aria-label="Hours" aria-valuenow="14" aria-valuemin="0" aria-valuemax="23" aria-valuetext="14" class="flex h-12 w-14 items-center justify-center rounded-lg border border-gray-300 bg-white text-2xl font-semibold tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">14</div>
      <button type="button" aria-label="Decrement hours" class="flex h-10 w-14 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
      </button>
    </div>
    <span class="pb-1 text-2xl font-semibold text-gray-400">:</span>
    <div class="flex flex-col items-center gap-1">
      <button type="button" aria-label="Increment minutes" class="flex h-10 w-14 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" /></svg>
      </button>
      <div role="spinbutton" tabindex="0" aria-label="Minutes" aria-valuenow="30" aria-valuemin="0" aria-valuemax="59" aria-valuetext="30" class="flex h-12 w-14 items-center justify-center rounded-lg border border-gray-300 bg-white text-2xl font-semibold tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">30</div>
      <button type="button" aria-label="Decrement minutes" class="flex h-10 w-14 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
      </button>
    </div>
  </div>
</div>`,
      react: `function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value) {
  const parts = value.split(':');
  const h = Number(parts[0] || '0') || 0;
  const m = Number(parts[1] || '0') || 0;
  return [h, m];
}

function wrap(n, max) {
  return ((n % max) + max) % max;
}

const btnCls =
  'flex h-10 w-14 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400';
const readoutCls =
  'flex h-12 w-14 items-center justify-center rounded-lg border border-gray-300 bg-white text-2xl font-semibold tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

function ChevronUp() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

export function TimePickerSteppersInput({ value, onChange, minuteStep = 5, label = 'Time', className = '' }) {
  const [hour, minute] = parseHM(value);
  const step = Math.min(30, Math.max(1, minuteStep));

  const setHour = (next) => onChange(pad2(wrap(next, 24)) + ':' + pad2(minute));
  const setMinute = (next) => onChange(pad2(hour) + ':' + pad2(wrap(next, 60)));

  return (
    <div className={'w-full max-w-xs ' + className}>
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <button type="button" aria-label="Increment hours" className={btnCls} onClick={() => setHour(hour + 1)}>
            <ChevronUp />
          </button>
          <div
            role="spinbutton"
            tabIndex={0}
            aria-label="Hours"
            aria-valuenow={hour}
            aria-valuemin={0}
            aria-valuemax={23}
            aria-valuetext={pad2(hour)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setHour(hour + 1);
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setHour(hour - 1);
              }
            }}
            className={readoutCls}
          >
            {pad2(hour)}
          </div>
          <button type="button" aria-label="Decrement hours" className={btnCls} onClick={() => setHour(hour - 1)}>
            <ChevronDown />
          </button>
        </div>

        <span className="pb-1 text-2xl font-semibold text-gray-400">:</span>

        <div className="flex flex-col items-center gap-1">
          <button type="button" aria-label="Increment minutes" className={btnCls} onClick={() => setMinute(minute + step)}>
            <ChevronUp />
          </button>
          <div
            role="spinbutton"
            tabIndex={0}
            aria-label="Minutes"
            aria-valuenow={minute}
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuetext={pad2(minute)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setMinute(minute + step);
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setMinute(minute - step);
              }
            }}
            className={readoutCls}
          >
            {pad2(minute)}
          </div>
          <button type="button" aria-label="Decrement minutes" className={btnCls} onClick={() => setMinute(minute - step)}>
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `export interface TimePickerSteppersInputProps {
  /** Selected time as a 24-hour \`HH:MM\` string. */
  value: string;
  onChange: (value: string) => void;
  /** Minutes added or removed per step, clamped to 1-30. */
  minuteStep?: number;
  label?: string;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value: string): [number, number] {
  const parts = value.split(':');
  const h = Number(parts[0] ?? '0') || 0;
  const m = Number(parts[1] ?? '0') || 0;
  return [h, m];
}

function wrap(n: number, max: number): number {
  return ((n % max) + max) % max;
}

const btnCls =
  'flex h-10 w-14 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400';
const readoutCls =
  'flex h-12 w-14 items-center justify-center rounded-lg border border-gray-300 bg-white text-2xl font-semibold tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

function ChevronUp(): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDown(): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

export function TimePickerSteppersInput({
  value,
  onChange,
  minuteStep = 5,
  label = 'Time',
  className = '',
}: TimePickerSteppersInputProps): JSX.Element {
  const [hour, minute] = parseHM(value);
  const step = Math.min(30, Math.max(1, minuteStep));

  const setHour = (next: number): void => onChange(pad2(wrap(next, 24)) + ':' + pad2(minute));
  const setMinute = (next: number): void => onChange(pad2(hour) + ':' + pad2(wrap(next, 60)));

  return (
    <div className={'w-full max-w-xs ' + className}>
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <button type="button" aria-label="Increment hours" className={btnCls} onClick={() => setHour(hour + 1)}>
            <ChevronUp />
          </button>
          <div
            role="spinbutton"
            tabIndex={0}
            aria-label="Hours"
            aria-valuenow={hour}
            aria-valuemin={0}
            aria-valuemax={23}
            aria-valuetext={pad2(hour)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setHour(hour + 1);
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setHour(hour - 1);
              }
            }}
            className={readoutCls}
          >
            {pad2(hour)}
          </div>
          <button type="button" aria-label="Decrement hours" className={btnCls} onClick={() => setHour(hour - 1)}>
            <ChevronDown />
          </button>
        </div>

        <span className="pb-1 text-2xl font-semibold text-gray-400">:</span>

        <div className="flex flex-col items-center gap-1">
          <button type="button" aria-label="Increment minutes" className={btnCls} onClick={() => setMinute(minute + step)}>
            <ChevronUp />
          </button>
          <div
            role="spinbutton"
            tabIndex={0}
            aria-label="Minutes"
            aria-valuenow={minute}
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuetext={pad2(minute)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setMinute(minute + step);
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setMinute(minute - step);
              }
            }}
            className={readoutCls}
          >
            {pad2(minute)}
          </div>
          <button type="button" aria-label="Decrement minutes" className={btnCls} onClick={() => setMinute(minute - step)}>
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-analog-dial',
    category: 'time-pickers',
    tags: ['time-picker', 'analog', 'clock', 'dial', 'svg'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'am', labelKey: 'am' },
      { id: 'pm', labelKey: 'pm' },
    ],
    props: [
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: "'10:00'" },
      { name: 'onChange', type: '(value: string) => void', required: true, descriptionKey: 'onChange' },
      { name: 'label', type: 'string', default: "'Select hour'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-[16rem]">
  <p class="mb-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Select hour</p>
  <div class="relative mx-auto aspect-square w-full rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
    <!-- The hand is a pure SVG overlay, decorative; the 12 hour marks are the real focusable controls. -->
    <svg viewBox="0 0 100 100" class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <line x1="50" y1="50" x2="50" y2="18" class="stroke-blue-600 dark:stroke-blue-400" stroke-width="2" stroke-linecap="round" />
      <circle cx="50" cy="50" r="2.5" class="fill-blue-600 dark:fill-blue-400" />
    </svg>
    <button type="button" aria-pressed="true" aria-label="10 o'clock" style="left:30%;top:16.7%" class="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400">10</button>
    <!-- ...remaining marks 1-12 positioned the same way... -->
  </div>
</div>`,
      react: `function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value) {
  const parts = value.split(':');
  const h = Number(parts[0] || '0') || 0;
  const m = Number(parts[1] || '0') || 0;
  return [h, m];
}

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function TimePickerAnalogDial({ value, onChange, label = 'Select hour', className = '' }) {
  const [hour24, minute] = parseHM(value);
  const isPM = hour24 >= 12;
  const shown = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const handAngle = shown * 30 * (Math.PI / 180);
  const handX = 50 + 32 * Math.sin(handAngle);
  const handY = 50 - 32 * Math.cos(handAngle);

  const pick = (h12) => {
    const base = h12 % 12;
    const next = isPM ? base + 12 : base;
    onChange(pad2(next % 24) + ':' + pad2(minute));
  };

  return (
    <div className={'w-full max-w-[16rem] ' + className}>
      <p className="mb-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <div className="relative mx-auto aspect-square w-full rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <line x1="50" y1="50" x2={handX} y2={handY} className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="2.5" className="fill-blue-600 dark:fill-blue-400" />
        </svg>
        {HOURS.map((h) => {
          const angle = h * 30 * (Math.PI / 180);
          const left = 50 + 40 * Math.sin(angle);
          const top = 50 - 40 * Math.cos(angle);
          const active = h === shown;
          return (
            <button
              key={h}
              type="button"
              onClick={() => pick(h)}
              aria-pressed={active}
              aria-label={h + " o'clock"}
              style={{ left: left + '%', top: top + '%' }}
              className={
                'absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                (active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800')
              }
            >
              {h}
            </button>
          );
        })}
      </div>
    </div>
  );
}`,
      typescript: `export interface TimePickerAnalogDialProps {
  /** Selected time as a 24-hour \`HH:MM\` string. */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value: string): [number, number] {
  const parts = value.split(':');
  const h = Number(parts[0] ?? '0') || 0;
  const m = Number(parts[1] ?? '0') || 0;
  return [h, m];
}

const HOURS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function TimePickerAnalogDial({
  value,
  onChange,
  label = 'Select hour',
  className = '',
}: TimePickerAnalogDialProps): JSX.Element {
  const [hour24, minute] = parseHM(value);
  const isPM = hour24 >= 12;
  const shown = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const handAngle = shown * 30 * (Math.PI / 180);
  const handX = 50 + 32 * Math.sin(handAngle);
  const handY = 50 - 32 * Math.cos(handAngle);

  const pick = (h12: number): void => {
    const base = h12 % 12;
    const next = isPM ? base + 12 : base;
    onChange(pad2(next % 24) + ':' + pad2(minute));
  };

  return (
    <div className={'w-full max-w-[16rem] ' + className}>
      <p className="mb-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <div className="relative mx-auto aspect-square w-full rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <line x1="50" y1="50" x2={handX} y2={handY} className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="2.5" className="fill-blue-600 dark:fill-blue-400" />
        </svg>
        {HOURS.map((h) => {
          const angle = h * 30 * (Math.PI / 180);
          const left = 50 + 40 * Math.sin(angle);
          const top = 50 - 40 * Math.cos(angle);
          const active = h === shown;
          return (
            <button
              key={h}
              type="button"
              onClick={() => pick(h)}
              aria-pressed={active}
              aria-label={h + " o'clock"}
              style={{ left: left + '%', top: top + '%' }}
              className={
                'absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                (active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800')
              }
            >
              {h}
            </button>
          );
        })}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-12h-24h-toggle',
    category: 'time-pickers',
    tags: ['time-picker', '12-hour', '24-hour', 'toggle', 'format'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'twelve', labelKey: 'twelve' },
      { id: 'twentyFour', labelKey: 'twentyFour' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: "'09:30'" },
      { name: 'onChange', type: '(value: string) => void', required: true, descriptionKey: 'onChange' },
      { name: 'minuteStep', type: 'number', default: '5', descriptionKey: 'minuteStep' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm">
  <div class="mb-2 flex items-center justify-between">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
    <div class="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="Time format">
      <button type="button" aria-pressed="true" class="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">12h</button>
      <button type="button" aria-pressed="false" class="rounded-md px-2.5 py-1 text-xs font-semibold text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:focus-visible:ring-blue-400">24h</button>
    </div>
  </div>
  <div class="flex items-center gap-2">
    <select aria-label="Hour" class="appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
      <option>9</option>
    </select>
    <span class="text-lg font-semibold text-gray-500 dark:text-gray-400">:</span>
    <select aria-label="Minute" class="appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
      <option>30</option>
    </select>
    <div class="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="AM or PM">
      <button type="button" aria-pressed="true" class="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">AM</button>
      <button type="button" aria-pressed="false" class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:focus-visible:ring-blue-400">PM</button>
    </div>
  </div>
</div>`,
      react: `import { useState } from 'react';

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value) {
  const parts = value.split(':');
  const h = Number(parts[0] || '0') || 0;
  const m = Number(parts[1] || '0') || 0;
  return [h, m];
}

const selectCls =
  'appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
const pillCls =
  'rounded-md px-2.5 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';

export function TimePicker12h24hToggle({ value, onChange, minuteStep = 5, className = '' }) {
  const [format, setFormat] = useState('12');
  const [hour, minute] = parseHM(value);
  const isPM = hour >= 12;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const step = Math.min(30, Math.max(1, minuteStep));
  const minutes = [];
  for (let m = 0; m < 60; m += step) minutes.push(m);
  const hours = format === '12'
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const setHour24 = (h) => onChange(pad2((h + 24) % 24) + ':' + pad2(minute));
  const setMinute = (m) => onChange(pad2(hour) + ':' + pad2(m));
  const setHour12 = (h12) => setHour24(isPM ? (h12 % 12) + 12 : h12 % 12);
  const setPeriod = (pm) => setHour24(pm ? (hour % 12) + 12 : hour % 12);

  return (
    <div className={'w-full max-w-sm ' + className}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
        <div className="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="Time format">
          <button type="button" aria-pressed={format === '12'} onClick={() => setFormat('12')} className={pillCls + ' py-1 ' + (format === '12' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>12h</button>
          <button type="button" aria-pressed={format === '24'} onClick={() => setFormat('24')} className={pillCls + ' py-1 ' + (format === '24' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>24h</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Hour"
          value={format === '12' ? hour12 : hour}
          onChange={(event) => (format === '12' ? setHour12(Number(event.target.value)) : setHour24(Number(event.target.value)))}
          className={selectCls}
        >
          {hours.map((h) => (
            <option key={h} value={h}>{format === '12' ? h : pad2(h)}</option>
          ))}
        </select>

        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">:</span>

        <select aria-label="Minute" value={minute} onChange={(event) => setMinute(Number(event.target.value))} className={selectCls}>
          {minutes.map((m) => (
            <option key={m} value={m}>{pad2(m)}</option>
          ))}
        </select>

        {format === '12' ? (
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="AM or PM">
            <button type="button" aria-pressed={!isPM} onClick={() => setPeriod(false)} className={pillCls + ' ' + (!isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>AM</button>
            <button type="button" aria-pressed={isPM} onClick={() => setPeriod(true)} className={pillCls + ' ' + (isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>PM</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TimePicker12h24hToggleProps {
  /** Canonical value, always a 24-hour \`HH:MM\` string regardless of display format. */
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  className?: string;
}

type TimeFormat = '12' | '24';

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value: string): [number, number] {
  const parts = value.split(':');
  const h = Number(parts[0] ?? '0') || 0;
  const m = Number(parts[1] ?? '0') || 0;
  return [h, m];
}

const selectCls =
  'appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
const pillCls =
  'rounded-md px-2.5 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';

export function TimePicker12h24hToggle({
  value,
  onChange,
  minuteStep = 5,
  className = '',
}: TimePicker12h24hToggleProps): JSX.Element {
  const [format, setFormat] = useState<TimeFormat>('12');
  const [hour, minute] = parseHM(value);
  const isPM = hour >= 12;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const step = Math.min(30, Math.max(1, minuteStep));
  const minutes: number[] = [];
  for (let m = 0; m < 60; m += step) minutes.push(m);
  const hours: number[] = format === '12'
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const setHour24 = (h: number): void => onChange(pad2((h + 24) % 24) + ':' + pad2(minute));
  const setMinute = (m: number): void => onChange(pad2(hour) + ':' + pad2(m));
  const setHour12 = (h12: number): void => setHour24(isPM ? (h12 % 12) + 12 : h12 % 12);
  const setPeriod = (pm: boolean): void => setHour24(pm ? (hour % 12) + 12 : hour % 12);

  return (
    <div className={'w-full max-w-sm ' + className}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
        <div className="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="Time format">
          <button type="button" aria-pressed={format === '12'} onClick={() => setFormat('12')} className={pillCls + ' py-1 ' + (format === '12' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>12h</button>
          <button type="button" aria-pressed={format === '24'} onClick={() => setFormat('24')} className={pillCls + ' py-1 ' + (format === '24' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>24h</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Hour"
          value={format === '12' ? hour12 : hour}
          onChange={(event) => (format === '12' ? setHour12(Number(event.target.value)) : setHour24(Number(event.target.value)))}
          className={selectCls}
        >
          {hours.map((h) => (
            <option key={h} value={h}>{format === '12' ? h : pad2(h)}</option>
          ))}
        </select>

        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">:</span>

        <select aria-label="Minute" value={minute} onChange={(event) => setMinute(Number(event.target.value))} className={selectCls}>
          {minutes.map((m) => (
            <option key={m} value={m}>{pad2(m)}</option>
          ))}
        </select>

        {format === '12' ? (
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="AM or PM">
            <button type="button" aria-pressed={!isPM} onClick={() => setPeriod(false)} className={pillCls + ' ' + (!isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>AM</button>
            <button type="button" aria-pressed={isPM} onClick={() => setPeriod(true)} className={pillCls + ' ' + (isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>PM</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-range-start-end',
    category: 'time-pickers',
    tags: ['time-picker', 'range', 'start-end', 'validation', 'select'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'stacked', labelKey: 'stacked' },
      { id: 'invalid', labelKey: 'invalid' },
    ],
    props: [
      { name: 'start', type: 'string', required: true, descriptionKey: 'start', example: "'09:00'" },
      { name: 'end', type: 'string', required: true, descriptionKey: 'end', example: "'10:30'" },
      { name: 'onChange', type: '(range: { start: string; end: string }) => void', required: true, descriptionKey: 'onChange' },
      { name: 'intervalMinutes', type: 'number', default: '30', descriptionKey: 'intervalMinutes' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-md">
  <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
    <div class="flex-1">
      <label for="range-start" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Start</label>
      <select id="range-start" class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="09:00" selected>9:00 AM</option>
        <option value="09:30">9:30 AM</option>
      </select>
    </div>
    <span aria-hidden="true" class="hidden pb-2.5 text-gray-400 sm:block">-</span>
    <div class="flex-1">
      <label for="range-end" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">End</label>
      <select id="range-end" class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="10:00">10:00 AM</option>
        <option value="10:30" selected>10:30 AM</option>
      </select>
    </div>
  </div>
</div>`,
      react: `import { useMemo } from 'react';

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24, minute) {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function buildOptions(step) {
  const out = [];
  for (let mins = 0; mins < 1440; mins += step) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
  }
  return out;
}

const selectCls =
  'w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerRangeStartEnd({ start, end, onChange, intervalMinutes = 30, className = '' }) {
  const options = useMemo(() => buildOptions(Math.min(60, Math.max(5, intervalMinutes))), [intervalMinutes]);
  // Times are HH:MM strings, so a plain string compare is a valid chronological compare.
  const invalid = end <= start;

  return (
    <div className={'w-full max-w-md ' + className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="range-start" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Start</label>
          <select id="range-start" value={start} onChange={(event) => onChange({ start: event.target.value, end })} className={selectCls + ' border-gray-300 dark:border-gray-700'}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <span aria-hidden="true" className="hidden pb-2.5 text-gray-400 sm:block">-</span>

        <div className="flex-1">
          <label htmlFor="range-end" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">End</label>
          <select
            id="range-end"
            value={end}
            onChange={(event) => onChange({ start, end: event.target.value })}
            aria-invalid={invalid}
            className={selectCls + (invalid ? ' border-red-500 dark:border-red-500' : ' border-gray-300 dark:border-gray-700')}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {invalid ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">End time must be after the start time.</p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useMemo } from 'react';

export interface TimeRange {
  start: string;
  end: string;
}

export interface TimePickerRangeStartEndProps {
  /** Range bounds as 24-hour \`HH:MM\` strings. */
  start: string;
  end: string;
  onChange: (range: TimeRange) => void;
  intervalMinutes?: number;
  className?: string;
}

interface TimeOption {
  value: string;
  label: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function buildOptions(step: number): TimeOption[] {
  const out: TimeOption[] = [];
  for (let mins = 0; mins < 1440; mins += step) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
  }
  return out;
}

const selectCls =
  'w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerRangeStartEnd({
  start,
  end,
  onChange,
  intervalMinutes = 30,
  className = '',
}: TimePickerRangeStartEndProps): JSX.Element {
  const options = useMemo<TimeOption[]>(() => buildOptions(Math.min(60, Math.max(5, intervalMinutes))), [intervalMinutes]);
  const invalid = end <= start;

  return (
    <div className={'w-full max-w-md ' + className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="range-start" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Start</label>
          <select id="range-start" value={start} onChange={(event) => onChange({ start: event.target.value, end })} className={selectCls + ' border-gray-300 dark:border-gray-700'}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <span aria-hidden="true" className="hidden pb-2.5 text-gray-400 sm:block">-</span>

        <div className="flex-1">
          <label htmlFor="range-end" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">End</label>
          <select
            id="range-end"
            value={end}
            onChange={(event) => onChange({ start, end: event.target.value })}
            aria-invalid={invalid}
            className={selectCls + (invalid ? ' border-red-500 dark:border-red-500' : ' border-gray-300 dark:border-gray-700')}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {invalid ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">End time must be after the start time.</p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-slots-grid',
    category: 'time-pickers',
    tags: ['time-picker', 'slots', 'grid', 'booking', 'radiogroup'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'dense', labelKey: 'dense' },
      { id: 'outline', labelKey: 'outline' },
    ],
    props: [
      { name: 'slots', type: 'string[]', required: true, descriptionKey: 'slots' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: "'10:00'" },
      { name: 'onChange', type: '(value: string) => void', required: true, descriptionKey: 'onChange' },
      { name: 'label', type: 'string', default: "'Available times'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<fieldset class="w-full">
  <legend class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Available times</legend>
  <!-- auto-fill + minmax lets the grid wrap from one column at 320px up to many, with no breakpoints. -->
  <div role="radiogroup" class="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
    <button type="button" role="radio" aria-checked="false" class="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium tabular-nums text-gray-700 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400">9:00 AM</button>
    <button type="button" role="radio" aria-checked="true" class="rounded-lg border border-blue-600 bg-blue-600 px-2 py-2 text-sm font-medium tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400">10:00 AM</button>
    <button type="button" role="radio" aria-checked="false" class="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium tabular-nums text-gray-700 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400">11:00 AM</button>
  </div>
</fieldset>`,
      react: `function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24, minute) {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function formatSlot(hm) {
  const parts = hm.split(':');
  return to12h(Number(parts[0] || '0') || 0, Number(parts[1] || '0') || 0);
}

export function TimePickerSlotsGrid({ slots, value, onChange, label = 'Available times', className = '' }) {
  return (
    <fieldset className={'w-full ' + className}>
      <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</legend>
      <div role="radiogroup" className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
        {slots.map((slot) => {
          const active = slot === value;
          return (
            <button
              key={slot}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(slot)}
              className={
                'rounded-lg border px-2 py-2 text-sm font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                (active
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600')
              }
            >
              {formatSlot(slot)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}`,
      typescript: `export interface TimePickerSlotsGridProps {
  /** Selectable slots as 24-hour \`HH:MM\` strings. */
  slots: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function formatSlot(hm: string): string {
  const parts = hm.split(':');
  return to12h(Number(parts[0] ?? '0') || 0, Number(parts[1] ?? '0') || 0);
}

export function TimePickerSlotsGrid({
  slots,
  value,
  onChange,
  label = 'Available times',
  className = '',
}: TimePickerSlotsGridProps): JSX.Element {
  return (
    <fieldset className={'w-full ' + className}>
      <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</legend>
      <div role="radiogroup" className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
        {slots.map((slot) => {
          const active = slot === value;
          return (
            <button
              key={slot}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(slot)}
              className={
                'rounded-lg border px-2 py-2 text-sm font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                (active
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600')
              }
            >
              {formatSlot(slot)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'time-picker-scroll-columns',
    category: 'time-pickers',
    tags: ['time-picker', 'scroll', 'columns', 'wheel', 'mobile'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: "'14:30'" },
      { name: 'onChange', type: '(value: string) => void', required: true, descriptionKey: 'onChange' },
      { name: 'minuteStep', type: 'number', default: '5', descriptionKey: 'minuteStep' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-xs rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="flex divide-x divide-gray-200 dark:divide-gray-800" role="group" aria-label="Select time">
    <div class="h-40 flex-1 space-y-1 overflow-y-auto scroll-smooth p-1" aria-label="Hour">
      <button type="button" aria-pressed="false" class="w-full rounded-md px-2 py-2 text-sm font-medium tabular-nums text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">01</button>
      <button type="button" aria-pressed="true" class="w-full rounded-md bg-blue-600 px-2 py-2 text-sm font-medium tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">02</button>
    </div>
    <div class="h-40 flex-1 space-y-1 overflow-y-auto scroll-smooth p-1" aria-label="Minute">
      <button type="button" aria-pressed="true" class="w-full rounded-md bg-blue-600 px-2 py-2 text-sm font-medium tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">30</button>
    </div>
    <div class="h-40 flex-1 space-y-1 overflow-y-auto scroll-smooth p-1" aria-label="Period">
      <button type="button" aria-pressed="false" class="w-full rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">AM</button>
      <button type="button" aria-pressed="true" class="w-full rounded-md bg-blue-600 px-2 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">PM</button>
    </div>
  </div>
</div>`,
      react: `function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value) {
  const parts = value.split(':');
  const h = Number(parts[0] || '0') || 0;
  const m = Number(parts[1] || '0') || 0;
  return [h, m];
}

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const colCls = 'h-40 flex-1 space-y-1 overflow-y-auto scroll-smooth p-1';

function cellCls(active) {
  return (
    'w-full rounded-md px-2 py-2 text-sm font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ' +
    (active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')
  );
}

export function TimePickerScrollColumns({ value, onChange, minuteStep = 5, className = '' }) {
  const [hour24, minute] = parseHM(value);
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const step = Math.min(30, Math.max(1, minuteStep));
  const minutes = [];
  for (let m = 0; m < 60; m += step) minutes.push(m);

  const commit = (h12, m, pm) => {
    const base = h12 % 12;
    onChange(pad2((pm ? base + 12 : base) % 24) + ':' + pad2(m));
  };

  return (
    <div className={'w-full max-w-xs rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ' + className}>
      <div className="flex divide-x divide-gray-200 dark:divide-gray-800" role="group" aria-label="Select time">
        <div className={colCls} aria-label="Hour">
          {HOURS.map((h) => (
            <button key={h} type="button" aria-pressed={h === hour12} onClick={() => commit(h, minute, isPM)} className={cellCls(h === hour12)}>{pad2(h)}</button>
          ))}
        </div>
        <div className={colCls} aria-label="Minute">
          {minutes.map((m) => (
            <button key={m} type="button" aria-pressed={m === minute} onClick={() => commit(hour12, m, isPM)} className={cellCls(m === minute)}>{pad2(m)}</button>
          ))}
        </div>
        <div className={colCls} aria-label="Period">
          {[false, true].map((pm) => (
            <button key={pm ? 'PM' : 'AM'} type="button" aria-pressed={pm === isPM} onClick={() => commit(hour12, minute, pm)} className={cellCls(pm === isPM)}>{pm ? 'PM' : 'AM'}</button>
          ))}
        </div>
      </div>
    </div>
  );
}`,
      typescript: `export interface TimePickerScrollColumnsProps {
  /** Selected time as a 24-hour \`HH:MM\` string. */
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value: string): [number, number] {
  const parts = value.split(':');
  const h = Number(parts[0] ?? '0') || 0;
  const m = Number(parts[1] ?? '0') || 0;
  return [h, m];
}

const HOURS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const colCls = 'h-40 flex-1 space-y-1 overflow-y-auto scroll-smooth p-1';

function cellCls(active: boolean): string {
  return (
    'w-full rounded-md px-2 py-2 text-sm font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ' +
    (active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')
  );
}

export function TimePickerScrollColumns({
  value,
  onChange,
  minuteStep = 5,
  className = '',
}: TimePickerScrollColumnsProps): JSX.Element {
  const [hour24, minute] = parseHM(value);
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const step = Math.min(30, Math.max(1, minuteStep));
  const minutes: number[] = [];
  for (let m = 0; m < 60; m += step) minutes.push(m);

  const commit = (h12: number, m: number, pm: boolean): void => {
    const base = h12 % 12;
    onChange(pad2((pm ? base + 12 : base) % 24) + ':' + pad2(m));
  };

  return (
    <div className={'w-full max-w-xs rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ' + className}>
      <div className="flex divide-x divide-gray-200 dark:divide-gray-800" role="group" aria-label="Select time">
        <div className={colCls} aria-label="Hour">
          {HOURS.map((h) => (
            <button key={h} type="button" aria-pressed={h === hour12} onClick={() => commit(h, minute, isPM)} className={cellCls(h === hour12)}>{pad2(h)}</button>
          ))}
        </div>
        <div className={colCls} aria-label="Minute">
          {minutes.map((m) => (
            <button key={m} type="button" aria-pressed={m === minute} onClick={() => commit(hour12, m, isPM)} className={cellCls(m === minute)}>{pad2(m)}</button>
          ))}
        </div>
        <div className={colCls} aria-label="Period">
          {[false, true].map((pm) => (
            <button key={pm ? 'PM' : 'AM'} type="button" aria-pressed={pm === isPM} onClick={() => commit(hour12, minute, pm)} className={cellCls(pm === isPM)}>{pm ? 'PM' : 'AM'}</button>
          ))}
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-keyboard-typed',
    category: 'time-pickers',
    tags: ['time-picker', 'keyboard', 'typed', 'masked', 'input'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'filled', labelKey: 'filled' },
    ],
    props: [
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: "'09:05'" },
      { name: 'onChange', type: '(value: string) => void', required: true, descriptionKey: 'onChange' },
      { name: 'label', type: 'string', default: "'Time'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-xs">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="typed-label">Time</span>
  <div class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400" role="group" aria-labelledby="typed-label">
    <input inputmode="numeric" aria-label="Hours" value="09" maxlength="2" class="w-10 bg-transparent text-center text-lg font-semibold tabular-nums text-gray-900 focus:outline-none dark:text-gray-100" />
    <span aria-hidden="true" class="text-lg font-semibold text-gray-400">:</span>
    <input inputmode="numeric" aria-label="Minutes" value="05" maxlength="2" class="w-10 bg-transparent text-center text-lg font-semibold tabular-nums text-gray-900 focus:outline-none dark:text-gray-100" />
    <div class="ml-auto inline-flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
      <button type="button" aria-pressed="true" class="bg-blue-600 px-2 py-1 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">AM</button>
      <button type="button" aria-pressed="false" class="px-2 py-1 text-xs font-semibold text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:focus-visible:ring-blue-400">PM</button>
    </div>
  </div>
</div>`,
      react: `import { useRef } from 'react';

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value) {
  const parts = value.split(':');
  const h = Number(parts[0] || '0') || 0;
  const m = Number(parts[1] || '0') || 0;
  return [h, m];
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function digitsOnly(raw) {
  return raw.split('').filter((c) => c >= '0' && c <= '9').join('').slice(0, 2);
}

const inputCls = 'w-10 bg-transparent text-center text-lg font-semibold tabular-nums text-gray-900 focus:outline-none dark:text-gray-100';
const periodCls = 'px-2 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';

export function TimePickerKeyboardTyped({ value, onChange, label = 'Time', className = '' }) {
  const minuteRef = useRef(null);
  const [hour, minute] = parseHM(value);
  const isPM = hour >= 12;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const commit = (h12, m, pm) => {
    const base = h12 % 12;
    onChange(pad2((pm ? base + 12 : base) % 24) + ':' + pad2(m));
  };

  const onHour = (raw) => {
    const digits = digitsOnly(raw);
    const h = digits === '' ? 12 : clamp(Number(digits), 1, 12);
    commit(h, minute, isPM);
    if (digits.length === 2 && minuteRef.current) minuteRef.current.focus();
  };

  const onMinute = (raw) => {
    const digits = digitsOnly(raw);
    commit(hour12, digits === '' ? 0 : clamp(Number(digits), 0, 59), isPM);
  };

  return (
    <div className={'w-full max-w-xs ' + className}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="typed-label">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400" role="group" aria-labelledby="typed-label">
        <input
          inputMode="numeric"
          aria-label="Hours"
          value={pad2(hour12)}
          maxLength={2}
          onChange={(event) => onHour(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              commit(hour12 === 12 ? 1 : hour12 + 1, minute, isPM);
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              commit(hour12 === 1 ? 12 : hour12 - 1, minute, isPM);
            }
          }}
          className={inputCls}
        />
        <span aria-hidden="true" className="text-lg font-semibold text-gray-400">:</span>
        <input
          ref={minuteRef}
          inputMode="numeric"
          aria-label="Minutes"
          value={pad2(minute)}
          maxLength={2}
          onChange={(event) => onMinute(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              commit(hour12, (minute + 1) % 60, isPM);
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              commit(hour12, (minute + 59) % 60, isPM);
            }
          }}
          className={inputCls}
        />
        <div className="ml-auto inline-flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
          <button type="button" aria-pressed={!isPM} onClick={() => commit(hour12, minute, false)} className={periodCls + ' ' + (!isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>AM</button>
          <button type="button" aria-pressed={isPM} onClick={() => commit(hour12, minute, true)} className={periodCls + ' ' + (isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>PM</button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useRef } from 'react';

export interface TimePickerKeyboardTypedProps {
  /** Selected time as a 24-hour \`HH:MM\` string. */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value: string): [number, number] {
  const parts = value.split(':');
  const h = Number(parts[0] ?? '0') || 0;
  const m = Number(parts[1] ?? '0') || 0;
  return [h, m];
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function digitsOnly(raw: string): string {
  return raw.split('').filter((c) => c >= '0' && c <= '9').join('').slice(0, 2);
}

const inputCls = 'w-10 bg-transparent text-center text-lg font-semibold tabular-nums text-gray-900 focus:outline-none dark:text-gray-100';
const periodCls = 'px-2 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';

export function TimePickerKeyboardTyped({
  value,
  onChange,
  label = 'Time',
  className = '',
}: TimePickerKeyboardTypedProps): JSX.Element {
  const minuteRef = useRef<HTMLInputElement | null>(null);
  const [hour, minute] = parseHM(value);
  const isPM = hour >= 12;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const commit = (h12: number, m: number, pm: boolean): void => {
    const base = h12 % 12;
    onChange(pad2((pm ? base + 12 : base) % 24) + ':' + pad2(m));
  };

  const onHour = (raw: string): void => {
    const digits = digitsOnly(raw);
    const h = digits === '' ? 12 : clamp(Number(digits), 1, 12);
    commit(h, minute, isPM);
    if (digits.length === 2 && minuteRef.current) minuteRef.current.focus();
  };

  const onMinute = (raw: string): void => {
    const digits = digitsOnly(raw);
    commit(hour12, digits === '' ? 0 : clamp(Number(digits), 0, 59), isPM);
  };

  return (
    <div className={'w-full max-w-xs ' + className}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="typed-label">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400" role="group" aria-labelledby="typed-label">
        <input
          inputMode="numeric"
          aria-label="Hours"
          value={pad2(hour12)}
          maxLength={2}
          onChange={(event) => onHour(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              commit(hour12 === 12 ? 1 : hour12 + 1, minute, isPM);
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              commit(hour12 === 1 ? 12 : hour12 - 1, minute, isPM);
            }
          }}
          className={inputCls}
        />
        <span aria-hidden="true" className="text-lg font-semibold text-gray-400">:</span>
        <input
          ref={minuteRef}
          inputMode="numeric"
          aria-label="Minutes"
          value={pad2(minute)}
          maxLength={2}
          onChange={(event) => onMinute(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              commit(hour12, (minute + 1) % 60, isPM);
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              commit(hour12, (minute + 59) % 60, isPM);
            }
          }}
          className={inputCls}
        />
        <div className="ml-auto inline-flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
          <button type="button" aria-pressed={!isPM} onClick={() => commit(hour12, minute, false)} className={periodCls + ' ' + (!isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>AM</button>
          <button type="button" aria-pressed={isPM} onClick={() => commit(hour12, minute, true)} className={periodCls + ' ' + (isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>PM</button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-duration',
    category: 'time-pickers',
    tags: ['time-picker', 'duration', 'hours-minutes', 'length', 'select'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'filled', labelKey: 'filled' },
    ],
    props: [
      { name: 'value', type: 'number', required: true, descriptionKey: 'value', example: '150' },
      { name: 'onChange', type: '(minutes: number) => void', required: true, descriptionKey: 'onChange' },
      { name: 'maxHours', type: 'number', default: '12', descriptionKey: 'maxHours' },
      { name: 'minuteStep', type: 'number', default: '5', descriptionKey: 'minuteStep' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm">
  <span class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <label for="dur-hours" class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Hours</label>
      <select id="dur-hours" class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="2" selected>2</option>
      </select>
    </div>
    <div>
      <label for="dur-minutes" class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Minutes</label>
      <select id="dur-minutes" class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="30" selected>30</option>
      </select>
    </div>
  </div>
  <p class="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">Total: <span class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">2h 30m</span></p>
</div>`,
      react: `function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

const selectCls =
  'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerDuration({ value, onChange, maxHours = 12, minuteStep = 5, className = '' }) {
  const total = Math.max(0, value);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const hourOptions = [];
  for (let h = 0; h <= maxHours; h += 1) hourOptions.push(h);
  const step = Math.min(30, Math.max(1, minuteStep));
  const minuteOptions = [];
  for (let m = 0; m < 60; m += step) minuteOptions.push(m);

  return (
    <div className={'w-full max-w-sm ' + className}>
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dur-hours" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Hours</label>
          <select id="dur-hours" value={hours} onChange={(event) => onChange(Number(event.target.value) * 60 + minutes)} className={selectCls}>
            {hourOptions.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dur-minutes" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Minutes</label>
          <select id="dur-minutes" value={minutes} onChange={(event) => onChange(hours * 60 + Number(event.target.value))} className={selectCls}>
            {minuteOptions.map((m) => (
              <option key={m} value={m}>{pad2(m)}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Total: <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{hours}h {pad2(minutes)}m</span>
      </p>
    </div>
  );
}`,
      typescript: `export interface TimePickerDurationProps {
  /** Duration in total minutes - the single number this control edits. */
  value: number;
  onChange: (minutes: number) => void;
  maxHours?: number;
  minuteStep?: number;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

const selectCls =
  'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerDuration({
  value,
  onChange,
  maxHours = 12,
  minuteStep = 5,
  className = '',
}: TimePickerDurationProps): JSX.Element {
  const total = Math.max(0, value);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const hourOptions: number[] = [];
  for (let h = 0; h <= maxHours; h += 1) hourOptions.push(h);
  const step = Math.min(30, Math.max(1, minuteStep));
  const minuteOptions: number[] = [];
  for (let m = 0; m < 60; m += step) minuteOptions.push(m);

  return (
    <div className={'w-full max-w-sm ' + className}>
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dur-hours" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Hours</label>
          <select id="dur-hours" value={hours} onChange={(event) => onChange(Number(event.target.value) * 60 + minutes)} className={selectCls}>
            {hourOptions.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dur-minutes" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Minutes</label>
          <select id="dur-minutes" value={minutes} onChange={(event) => onChange(hours * 60 + Number(event.target.value))} className={selectCls}>
            {minuteOptions.map((m) => (
              <option key={m} value={m}>{pad2(m)}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Total: <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{hours}h {pad2(minutes)}m</span>
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'time-picker-timezone-select',
    category: 'time-pickers',
    tags: ['time-picker', 'timezone', 'select', 'scheduling', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'stacked', labelKey: 'stacked' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'time', type: 'string', required: true, descriptionKey: 'time', example: "'09:30'" },
      { name: 'zone', type: 'string', required: true, descriptionKey: 'zone', example: "'America/New_York'" },
      { name: 'onChange', type: '(value: { time: string; zone: string }) => void', required: true, descriptionKey: 'onChange' },
      { name: 'zones', type: '{ value: string; label: string }[]', descriptionKey: 'zones' },
      { name: 'intervalMinutes', type: 'number', default: '30', descriptionKey: 'intervalMinutes' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-md">
  <div class="flex flex-col gap-3 sm:flex-row">
    <div class="sm:w-40">
      <label for="tz-time" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
      <select id="tz-time" class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="09:30" selected>9:30 AM</option>
      </select>
    </div>
    <div class="flex-1">
      <label for="tz-zone" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time zone</label>
      <select id="tz-zone" class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="America/New_York" selected>Eastern (ET)</option>
      </select>
    </div>
  </div>
</div>`,
      react: `import { useMemo } from 'react';

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24, minute) {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function buildOptions(step) {
  const out = [];
  for (let mins = 0; mins < 1440; mins += step) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
  }
  return out;
}

const DEFAULT_ZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Berlin', label: 'Central Europe (CET)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const selectCls =
  'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerTimezoneSelect({ time, zone, onChange, zones = DEFAULT_ZONES, intervalMinutes = 30, className = '' }) {
  const options = useMemo(() => buildOptions(Math.min(60, Math.max(5, intervalMinutes))), [intervalMinutes]);

  return (
    <div className={'w-full max-w-md ' + className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-40">
          <label htmlFor="tz-time" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
          <select id="tz-time" value={time} onChange={(event) => onChange({ time: event.target.value, zone })} className={selectCls}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="tz-zone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time zone</label>
          <select id="tz-zone" value={zone} onChange={(event) => onChange({ time, zone: event.target.value })} className={selectCls}>
            {zones.map((z) => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useMemo } from 'react';

export interface TimezoneOption {
  value: string;
  label: string;
}

export interface TimePickerTimezoneValue {
  time: string;
  zone: string;
}

export interface TimePickerTimezoneSelectProps {
  /** Wall-clock time as a 24-hour \`HH:MM\` string. */
  time: string;
  /** IANA zone id, e.g. \`America/New_York\`. */
  zone: string;
  onChange: (value: TimePickerTimezoneValue) => void;
  zones?: TimezoneOption[];
  intervalMinutes?: number;
  className?: string;
}

interface TimeOption {
  value: string;
  label: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function buildOptions(step: number): TimeOption[] {
  const out: TimeOption[] = [];
  for (let mins = 0; mins < 1440; mins += step) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
  }
  return out;
}

const DEFAULT_ZONES: TimezoneOption[] = [
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Berlin', label: 'Central Europe (CET)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const selectCls =
  'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerTimezoneSelect({
  time,
  zone,
  onChange,
  zones = DEFAULT_ZONES,
  intervalMinutes = 30,
  className = '',
}: TimePickerTimezoneSelectProps): JSX.Element {
  const options = useMemo<TimeOption[]>(() => buildOptions(Math.min(60, Math.max(5, intervalMinutes))), [intervalMinutes]);

  return (
    <div className={'w-full max-w-md ' + className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-40">
          <label htmlFor="tz-time" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
          <select id="tz-time" value={time} onChange={(event) => onChange({ time: event.target.value, zone })} className={selectCls}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="tz-zone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time zone</label>
          <select id="tz-zone" value={zone} onChange={(event) => onChange({ time, zone: event.target.value })} className={selectCls}>
            {zones.map((z) => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
];
