import type { ComponentEntry } from './types';

/**
 * Toggles category.
 *
 * Ten ways to flip state, with one discipline shared by all of them: the state
 * is never colour alone. Every control here moves something (a thumb), reveals
 * something (ON/OFF text, an icon, a check, a chevron) or fills something (a
 * pressed button) - a control that changes only hue is unreadable to roughly
 * one in twelve men. The second discipline is semantic: switches are
 * `role="switch"` + `aria-checked` (usually a real checkbox), exclusive picks
 * are radios, independent picks are `aria-pressed` buttons. Those are three
 * different announcements to a screen reader and are deliberately not
 * interchangeable.
 *
 * Distinct from `checkbox-switch` in forms-choice: everything here is
 * `toggle-` prefixed and leans on POSITION/ICON/TEXT for state, not the track
 * colour.
 */
export const togglesComponents: ComponentEntry[] = [
  {
    slug: 'toggle-switch-basic',
    category: 'toggles',
    tags: ['toggle', 'switch', 'checkbox', 'settings', 'aria'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 2860, copies: 1054, downloads: 240 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', descriptionKey: 'defaultChecked' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'onChange', type: '(checked: boolean) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  A switch is a checkbox wearing a different picture. role="switch" rides on the
  real <input>, which keeps Space, form submission and label association for
  free. The state is carried by the thumb's POSITION (translate-x), not only the
  track colour, so it survives greyscale.
-->
<label class="inline-flex cursor-pointer items-center gap-3">
  <input type="checkbox" role="switch" class="peer sr-only" checked />
  <span
    aria-hidden="true"
    class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
  ></span>
  <span class="text-sm font-medium text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
    Email notifications
  </span>
</label>`,
      react: `import { useId } from 'react';

export function ToggleSwitchBasic({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  className = '',
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={\`inline-flex items-center gap-3 \${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} \${className}\`}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="peer sr-only"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
      />
      <span className="text-sm font-medium text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
        {label}
      </span>
    </label>
  );
}`,
      typescript: `import { useId } from 'react';

export interface ToggleSwitchBasicProps {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

// Uncontrolled: the checkbox owns its state and CSS paints the thumb via
// peer-checked, so this ships no JS state. Read the value from onChange.
export function ToggleSwitchBasic({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  className = '',
}: ToggleSwitchBasicProps): JSX.Element {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={\`inline-flex items-center gap-3 \${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} \${className}\`}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="peer sr-only"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
      />
      <span className="text-sm font-medium text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
        {label}
      </span>
    </label>
  );
}`,
    },
  },
  {
    slug: 'toggle-switch-labeled',
    category: 'toggles',
    tags: ['toggle', 'switch', 'on-off', 'label', 'aria'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2110, copies: 742, downloads: 176 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'onText', type: 'string', default: "'On'", descriptionKey: 'onText' },
      { name: 'offText', type: 'string', default: "'Off'", descriptionKey: 'offText' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', descriptionKey: 'defaultChecked' },
      { name: 'onChange', type: '(checked: boolean) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  ON/OFF text lives INSIDE the track so the state reads in pure greyscale. Note
  every visual layer is a direct sibling of the input: peer-checked only reaches
  siblings of the peer, never descendants of a sibling, so the track, both
  labels and the thumb sit flat next to the checkbox. The input carries the
  accessible name via aria-label; the printed On/Off are decorative.
-->
<div class="inline-flex items-center gap-3">
  <label class="relative inline-flex h-7 w-16 shrink-0 cursor-pointer items-center">
    <input type="checkbox" role="switch" aria-label="Wi-Fi" class="peer sr-only" checked />
    <span
      aria-hidden="true"
      class="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
    ></span>
    <span aria-hidden="true" class="pointer-events-none absolute left-2 text-[0.625rem] font-bold uppercase tracking-wide text-white opacity-0 peer-checked:opacity-100">On</span>
    <span aria-hidden="true" class="pointer-events-none absolute right-2 text-[0.625rem] font-bold uppercase tracking-wide text-gray-700 peer-checked:opacity-0 dark:text-gray-100">Off</span>
    <span aria-hidden="true" class="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-9 motion-reduce:transition-none"></span>
  </label>
  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Wi-Fi</span>
</div>`,
      react: `export function ToggleSwitchLabeled({
  label,
  onText = 'On',
  offText = 'Off',
  defaultChecked = false,
  onChange,
  className = '',
}) {
  return (
    <div className={\`inline-flex items-center gap-3 \${className}\`}>
      <label className="relative inline-flex h-7 w-16 shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          role="switch"
          aria-label={label}
          className="peer sr-only"
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
        />
        <span aria-hidden="true" className="pointer-events-none absolute left-2 text-[0.625rem] font-bold uppercase tracking-wide text-white opacity-0 peer-checked:opacity-100">
          {onText}
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute right-2 text-[0.625rem] font-bold uppercase tracking-wide text-gray-700 peer-checked:opacity-0 dark:text-gray-100">
          {offText}
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-9 motion-reduce:transition-none" />
      </label>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
    </div>
  );
}`,
      typescript: `export interface ToggleSwitchLabeledProps {
  label: string;
  onText?: string;
  offText?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function ToggleSwitchLabeled({
  label,
  onText = 'On',
  offText = 'Off',
  defaultChecked = false,
  onChange,
  className = '',
}: ToggleSwitchLabeledProps): JSX.Element {
  return (
    <div className={\`inline-flex items-center gap-3 \${className}\`}>
      <label className="relative inline-flex h-7 w-16 shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          role="switch"
          aria-label={label}
          className="peer sr-only"
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
        />
        <span aria-hidden="true" className="pointer-events-none absolute left-2 text-[0.625rem] font-bold uppercase tracking-wide text-white opacity-0 peer-checked:opacity-100">
          {onText}
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute right-2 text-[0.625rem] font-bold uppercase tracking-wide text-gray-700 peer-checked:opacity-0 dark:text-gray-100">
          {offText}
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-9 motion-reduce:transition-none" />
      </label>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'toggle-switch-icons',
    category: 'toggles',
    tags: ['toggle', 'switch', 'icon', 'theme', 'aria'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2540, copies: 918, downloads: 205 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', descriptionKey: 'defaultChecked' },
      { name: 'onChange', type: '(checked: boolean) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Same sibling-flat structure as the labeled switch, but a check/cross SVG stands
  in for the ON/OFF text. The icon is the state, so the control is legible even
  to someone who cannot tell the two track colours apart. Icons are aria-hidden;
  the input's aria-label is the real name.
-->
<label class="relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center">
  <input type="checkbox" role="switch" aria-label="Autoplay" class="peer sr-only" checked />
  <span
    aria-hidden="true"
    class="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-600 dark:bg-gray-600 dark:peer-checked:bg-emerald-500 dark:peer-focus-visible:outline-emerald-400"
  ></span>
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" class="pointer-events-none absolute left-1.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100"><path d="M4 10l4 4 8-9" stroke-linecap="round" stroke-linejoin="round" /></svg>
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" class="pointer-events-none absolute right-1.5 h-3 w-3 text-gray-100 peer-checked:opacity-0"><path d="M5 5l10 10M15 5L5 15" stroke-linecap="round" /></svg>
  <span aria-hidden="true" class="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-7 motion-reduce:transition-none"></span>
</label>`,
      react: `export function ToggleSwitchIcons({
  label,
  defaultChecked = false,
  onChange,
  className = '',
}) {
  return (
    <label className={\`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center \${className}\`}>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-600 dark:bg-gray-600 dark:peer-checked:bg-emerald-500 dark:peer-focus-visible:outline-emerald-400"
      />
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} className="pointer-events-none absolute left-1.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100">
        <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} className="pointer-events-none absolute right-1.5 h-3 w-3 text-gray-100 peer-checked:opacity-0">
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-7 motion-reduce:transition-none" />
    </label>
  );
}`,
      typescript: `export interface ToggleSwitchIconsProps {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function ToggleSwitchIcons({
  label,
  defaultChecked = false,
  onChange,
  className = '',
}: ToggleSwitchIconsProps): JSX.Element {
  return (
    <label className={\`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center \${className}\`}>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-600 dark:bg-gray-600 dark:peer-checked:bg-emerald-500 dark:peer-focus-visible:outline-emerald-400"
      />
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} className="pointer-events-none absolute left-1.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100">
        <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} className="pointer-events-none absolute right-1.5 h-3 w-3 text-gray-100 peer-checked:opacity-0">
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-7 motion-reduce:transition-none" />
    </label>
  );
}`,
    },
  },
  {
    slug: 'toggle-segmented-control',
    category: 'toggles',
    tags: ['toggle', 'segmented', 'radio', 'tabs', 'aria'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 3320, copies: 1288, downloads: 301 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'legend', type: 'string', required: true, descriptionKey: 'legend' },
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'options', type: '{ value: string; label: string }[]', required: true, descriptionKey: 'options' },
      { name: 'defaultValue', type: 'string', descriptionKey: 'defaultValue' },
      { name: 'onChange', type: '(value: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  An exclusive pick is a radio group, not a row of buttons - so a real
  <fieldset>/<legend> with radios gives arrow-key roving and a single-selection
  announcement for free. The chosen segment reads by FILL + shadow + weight, not
  hue: peer-checked paints a raised white pill that is obvious in greyscale.
-->
<fieldset class="inline-flex w-full max-w-xs rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
  <legend class="sr-only">View density</legend>
  <label class="flex-1">
    <input type="radio" name="density" value="comfortable" class="peer sr-only" checked />
    <span class="flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:font-semibold peer-checked:text-gray-900 peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:text-gray-300 dark:peer-checked:bg-gray-950 dark:peer-checked:text-white">Comfortable</span>
  </label>
  <label class="flex-1">
    <input type="radio" name="density" value="compact" class="peer sr-only" />
    <span class="flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:font-semibold peer-checked:text-gray-900 peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:text-gray-300 dark:peer-checked:bg-gray-950 dark:peer-checked:text-white">Compact</span>
  </label>
</fieldset>`,
      react: `export function ToggleSegmentedControl({
  legend,
  name,
  options,
  defaultValue,
  onChange,
  className = '',
}) {
  const initial = defaultValue ?? options[0]?.value;
  return (
    <fieldset className={\`inline-flex w-full max-w-xs rounded-lg bg-gray-100 p-1 dark:bg-gray-800 \${className}\`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((opt) => (
        <label key={opt.value} className="flex-1">
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === initial}
            className="peer sr-only"
            onChange={() => onChange?.(opt.value)}
          />
          <span className="flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:font-semibold peer-checked:text-gray-900 peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:text-gray-300 dark:peer-checked:bg-gray-950 dark:peer-checked:text-white">
            {opt.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}`,
      typescript: `export interface SegmentedOption {
  value: string;
  label: string;
}

export interface ToggleSegmentedControlProps {
  legend: string;
  name: string;
  options: SegmentedOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ToggleSegmentedControl({
  legend,
  name,
  options,
  defaultValue,
  onChange,
  className = '',
}: ToggleSegmentedControlProps): JSX.Element {
  const initial = defaultValue ?? options[0]?.value;
  return (
    <fieldset className={\`inline-flex w-full max-w-xs rounded-lg bg-gray-100 p-1 dark:bg-gray-800 \${className}\`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((opt) => (
        <label key={opt.value} className="flex-1">
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === initial}
            className="peer sr-only"
            onChange={() => onChange?.(opt.value)}
          />
          <span className="flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:font-semibold peer-checked:text-gray-900 peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:text-gray-300 dark:peer-checked:bg-gray-950 dark:peer-checked:text-white">
            {opt.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'toggle-button-group-multi',
    category: 'toggles',
    tags: ['toggle', 'button-group', 'aria-pressed', 'toolbar', 'multi'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2480, copies: 903, downloads: 198 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'options', type: '{ id: string; label: string; icon: ReactNode }[]', required: true, descriptionKey: 'options' },
      { name: 'defaultPressed', type: 'string[]', default: '[]', descriptionKey: 'defaultPressed' },
      { name: 'onChange', type: '(pressed: string[]) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Independent on/off picks (bold AND italic AND underline) are aria-pressed
  buttons in a role="group", NOT radios - several can be on at once, which is a
  different announcement from a single-choice segmented control. State reads by
  FILL: a pressed button is solid, an idle one is outlined, so it is obvious with
  colour stripped.
-->
<div role="group" aria-label="Text formatting" class="inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
  <button type="button" aria-pressed="true" aria-label="Bold" class="inline-flex h-10 w-10 items-center justify-center bg-blue-600 text-sm font-bold text-white transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">B</button>
  <button type="button" aria-pressed="false" aria-label="Italic" class="inline-flex h-10 w-10 items-center justify-center border-l border-gray-300 bg-white text-sm italic text-gray-700 transition-colors hover:bg-gray-100 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">I</button>
  <button type="button" aria-pressed="false" aria-label="Underline" class="inline-flex h-10 w-10 items-center justify-center border-l border-gray-300 bg-white text-sm text-gray-700 underline transition-colors hover:bg-gray-100 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">U</button>
</div>`,
      react: `'use client';

import { useState } from 'react';

export function ToggleButtonGroupMulti({
  label,
  options,
  defaultPressed = [],
  onChange,
  className = '',
}) {
  const [pressed, setPressed] = useState(defaultPressed);
  const toggle = (id) => {
    const next = pressed.includes(id) ? pressed.filter((x) => x !== id) : [...pressed, id];
    setPressed(next);
    onChange?.(next);
  };
  return (
    <div role="group" aria-label={label} className={\`inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 \${className}\`}>
      {options.map((opt, i) => {
        const on = pressed.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={on}
            aria-label={opt.label}
            onClick={() => toggle(opt.id)}
            className={\`inline-flex h-10 w-10 items-center justify-center text-sm font-semibold transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 \${i > 0 ? 'border-l border-gray-300 dark:border-gray-700' : ''} \${on ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'}\`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

export interface ToggleButtonOption {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface ToggleButtonGroupMultiProps {
  label: string;
  options: ToggleButtonOption[];
  defaultPressed?: string[];
  onChange?: (pressed: string[]) => void;
  className?: string;
}

export function ToggleButtonGroupMulti({
  label,
  options,
  defaultPressed = [],
  onChange,
  className = '',
}: ToggleButtonGroupMultiProps): JSX.Element {
  const [pressed, setPressed] = useState<string[]>(defaultPressed);
  const toggle = (id: string) => {
    const next = pressed.includes(id) ? pressed.filter((x) => x !== id) : [...pressed, id];
    setPressed(next);
    onChange?.(next);
  };
  return (
    <div role="group" aria-label={label} className={\`inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 \${className}\`}>
      {options.map((opt, i) => {
        const on = pressed.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={on}
            aria-label={opt.label}
            onClick={() => toggle(opt.id)}
            className={\`inline-flex h-10 w-10 items-center justify-center text-sm font-semibold transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 \${i > 0 ? 'border-l border-gray-300 dark:border-gray-700' : ''} \${on ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'}\`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}`,
    },
  },
  {
    slug: 'toggle-pill-single',
    category: 'toggles',
    tags: ['toggle', 'pill', 'aria-pressed', 'follow', 'button'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2740, copies: 1010, downloads: 221 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'pressedLabel', type: 'string', required: true, descriptionKey: 'pressedLabel' },
      { name: 'defaultPressed', type: 'boolean', default: 'false', descriptionKey: 'defaultPressed' },
      { name: 'onChange', type: '(pressed: boolean) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  A single sticky on/off (Follow / Following) is one aria-pressed button. The
  LABEL text itself changes with state and a check appears when pressed, so the
  toggle never depends on the fill colour to be understood.
-->
<button type="button" aria-pressed="true" class="inline-flex items-center gap-1.5 rounded-full border border-blue-600 bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3.5 w-3.5"><path d="M4 10l4 4 8-9" stroke-linecap="round" stroke-linejoin="round" /></svg>
  Following
</button>`,
      react: `'use client';

import { useState } from 'react';

export function TogglePillSingle({
  label,
  pressedLabel,
  defaultPressed = false,
  onChange,
  className = '',
}) {
  const [on, setOn] = useState(defaultPressed);
  const flip = () => {
    setOn(!on);
    onChange?.(!on);
  };
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={flip}
      className={\`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 \${on ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'} \${className}\`}
    >
      {on ? (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
          <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {on ? pressedLabel : label}
    </button>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface TogglePillSingleProps {
  label: string;
  pressedLabel: string;
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  className?: string;
}

export function TogglePillSingle({
  label,
  pressedLabel,
  defaultPressed = false,
  onChange,
  className = '',
}: TogglePillSingleProps): JSX.Element {
  const [on, setOn] = useState<boolean>(defaultPressed);
  const flip = () => {
    setOn(!on);
    onChange?.(!on);
  };
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={flip}
      className={\`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 \${on ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'} \${className}\`}
    >
      {on ? (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
          <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {on ? pressedLabel : label}
    </button>
  );
}`,
    },
  },
  {
    slug: 'toggle-card-select',
    category: 'toggles',
    tags: ['toggle', 'card', 'radio', 'select', 'plan'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 3010, copies: 1140, downloads: 268 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'legend', type: 'string', required: true, descriptionKey: 'legend' },
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'options', type: '{ value: string; title: string; detail: string }[]', required: true, descriptionKey: 'options' },
      { name: 'defaultValue', type: 'string', descriptionKey: 'defaultValue' },
      { name: 'onChange', type: '(value: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Selectable cards are still a radio group underneath - the whole card is the
  label, the radio is sr-only. has-[:checked] rings the chosen card and
  peer-checked reveals a filled check badge, so "selected" is a ring PLUS a tick,
  never colour on its own. Cards stack to one column below sm.
-->
<fieldset class="grid w-full gap-3 sm:grid-cols-2">
  <legend class="sr-only">Choose a plan</legend>
  <label class="relative flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-colors has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:has-[:checked]:border-blue-400">
    <input type="radio" name="plan" value="starter" class="peer sr-only" checked />
    <span aria-hidden="true" class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 peer-checked:opacity-100">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3 w-3"><path d="M4 10l4 4 8-9" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
    <span class="text-sm font-semibold text-gray-900 dark:text-white">Starter</span>
    <span class="mt-1 text-xs text-gray-500 dark:text-gray-400">$9 / month</span>
  </label>
  <label class="relative flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-colors has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:has-[:checked]:border-blue-400">
    <input type="radio" name="plan" value="pro" class="peer sr-only" />
    <span aria-hidden="true" class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 peer-checked:opacity-100">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3 w-3"><path d="M4 10l4 4 8-9" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
    <span class="text-sm font-semibold text-gray-900 dark:text-white">Pro</span>
    <span class="mt-1 text-xs text-gray-500 dark:text-gray-400">$29 / month</span>
  </label>
</fieldset>`,
      react: `export function ToggleCardSelect({
  legend,
  name,
  options,
  defaultValue,
  onChange,
  className = '',
}) {
  const initial = defaultValue ?? options[0]?.value;
  return (
    <fieldset className={\`grid w-full gap-3 sm:grid-cols-2 \${className}\`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="relative flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-colors has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:has-[:checked]:border-blue-400"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === initial}
            className="peer sr-only"
            onChange={() => onChange?.(opt.value)}
          />
          <span aria-hidden="true" className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 peer-checked:opacity-100">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
              <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{opt.title}</span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{opt.detail}</span>
        </label>
      ))}
    </fieldset>
  );
}`,
      typescript: `export interface CardSelectOption {
  value: string;
  title: string;
  detail: string;
}

export interface ToggleCardSelectProps {
  legend: string;
  name: string;
  options: CardSelectOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ToggleCardSelect({
  legend,
  name,
  options,
  defaultValue,
  onChange,
  className = '',
}: ToggleCardSelectProps): JSX.Element {
  const initial = defaultValue ?? options[0]?.value;
  return (
    <fieldset className={\`grid w-full gap-3 sm:grid-cols-2 \${className}\`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="relative flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-colors has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:has-[:checked]:border-blue-400"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === initial}
            className="peer sr-only"
            onChange={() => onChange?.(opt.value)}
          />
          <span aria-hidden="true" className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 peer-checked:opacity-100">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
              <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{opt.title}</span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{opt.detail}</span>
        </label>
      ))}
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'toggle-switch-async',
    category: 'toggles',
    tags: ['toggle', 'switch', 'async', 'loading', 'aria-busy'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2190, copies: 806, downloads: 172 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'loading', labelKey: 'loading' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', descriptionKey: 'defaultChecked' },
      { name: 'onCommit', type: '(checked: boolean) => Promise<void>', required: true, descriptionKey: 'onCommit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A switch that persists to a server must not lie: it stays on its old value
  until the write resolves. This is the pending frame - role="switch" with
  aria-busy="true" and disabled, a spinner riding in the thumb, so the state is
  never guessed from an optimistic colour flip.
-->
<button type="button" role="switch" aria-checked="false" aria-busy="true" disabled class="inline-flex cursor-progress items-center gap-3">
  <span aria-hidden="true" class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 opacity-70 dark:bg-gray-600">
    <span class="absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
      <span class="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:animate-none"></span>
    </span>
  </span>
  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Sync to cloud</span>
</button>`,
      react: `'use client';

import { useState } from 'react';

export function ToggleSwitchAsync({
  label,
  defaultChecked = false,
  onCommit,
  className = '',
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const [pending, setPending] = useState(false);
  const flip = async () => {
    if (pending) return;
    const next = !checked;
    setPending(true);
    try {
      await onCommit(next);
      setChecked(next); // only commit the UI once the write actually landed
    } finally {
      setPending(false);
    }
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={pending}
      disabled={pending}
      onClick={flip}
      className={\`group inline-flex items-center gap-3 \${pending ? 'cursor-progress' : 'cursor-pointer'} \${className}\`}
    >
      <span
        aria-hidden="true"
        className={\`relative h-6 w-11 shrink-0 rounded-full transition-colors \${pending ? 'opacity-70' : ''} \${checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'} group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-blue-600\`}
      >
        <span className={\`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform motion-reduce:transition-none \${checked ? 'translate-x-5' : ''}\`}>
          {pending ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:animate-none" />
          ) : null}
        </span>
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
    </button>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface ToggleSwitchAsyncProps {
  label: string;
  defaultChecked?: boolean;
  /** Persist the change; the thumb only moves after this resolves. */
  onCommit: (checked: boolean) => Promise<void>;
  className?: string;
}

export function ToggleSwitchAsync({
  label,
  defaultChecked = false,
  onCommit,
  className = '',
}: ToggleSwitchAsyncProps): JSX.Element {
  const [checked, setChecked] = useState<boolean>(defaultChecked);
  const [pending, setPending] = useState<boolean>(false);
  const flip = async () => {
    if (pending) return;
    const next = !checked;
    setPending(true);
    try {
      await onCommit(next);
      setChecked(next);
    } finally {
      setPending(false);
    }
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={pending}
      disabled={pending}
      onClick={flip}
      className={\`group inline-flex items-center gap-3 \${pending ? 'cursor-progress' : 'cursor-pointer'} \${className}\`}
    >
      <span
        aria-hidden="true"
        className={\`relative h-6 w-11 shrink-0 rounded-full transition-colors \${pending ? 'opacity-70' : ''} \${checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'} group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-blue-600\`}
      >
        <span className={\`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform motion-reduce:transition-none \${checked ? 'translate-x-5' : ''}\`}>
          {pending ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:animate-none" />
          ) : null}
        </span>
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
    </button>
  );
}`,
    },
  },
  {
    slug: 'toggle-row-settings',
    category: 'toggles',
    tags: ['toggle', 'switch', 'settings', 'list', 'row'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2620, copies: 972, downloads: 214 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', descriptionKey: 'defaultChecked' },
      { name: 'onChange', type: '(checked: boolean) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  A settings-list row: title + helper text on the left, switch on the right. The
  helper text is wired to the input via aria-describedby, and the whole row is a
  <label> so the tap target is the entire row, not just the 44px track. The row
  survives 320px because the text column can shrink (min-w-0) while the switch
  stays put.
-->
<label class="flex w-full max-w-md cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
  <span class="min-w-0">
    <span class="block text-sm font-medium text-gray-900 dark:text-gray-100">Weekly digest</span>
    <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">A Monday summary of everything that changed.</span>
  </span>
  <input type="checkbox" role="switch" class="peer sr-only" checked />
  <span
    aria-hidden="true"
    class="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
  ></span>
</label>`,
      react: `import { useId } from 'react';

export function ToggleRowSettings({
  title,
  description,
  defaultChecked = false,
  onChange,
  className = '',
}) {
  const hintId = useId();
  return (
    <label className={\`flex w-full max-w-md cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 \${className}\`}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{title}</span>
        {description ? (
          <span id={hintId} className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {description}
          </span>
        ) : null}
      </span>
      <input
        type="checkbox"
        role="switch"
        aria-describedby={description ? hintId : undefined}
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
      />
    </label>
  );
}`,
      typescript: `import { useId } from 'react';

export interface ToggleRowSettingsProps {
  title: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function ToggleRowSettings({
  title,
  description,
  defaultChecked = false,
  onChange,
  className = '',
}: ToggleRowSettingsProps): JSX.Element {
  const hintId = useId();
  return (
    <label className={\`flex w-full max-w-md cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 \${className}\`}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{title}</span>
        {description ? (
          <span id={hintId} className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {description}
          </span>
        ) : null}
      </span>
      <input
        type="checkbox"
        role="switch"
        aria-describedby={description ? hintId : undefined}
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
      />
    </label>
  );
}`,
    },
  },
  {
    slug: 'toggle-collapse-disclosure',
    category: 'toggles',
    tags: ['toggle', 'disclosure', 'collapse', 'accordion', 'details'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2380, copies: 874, downloads: 190 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'summary', type: 'string', required: true, descriptionKey: 'summary' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', descriptionKey: 'defaultOpen' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A show/hide toggle is a native <details>/<summary>: it carries expanded state,
  keyboard support and the open/closed announcement with zero JS, and it works
  before hydration. The chevron ROTATES on open (group-open:rotate-180), so the
  state reads from geometry, not a colour swap. The default triangle marker is
  removed so only the chevron speaks.
-->
<details class="group w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800">
  <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:focus-visible:outline-blue-400">
    Shipping &amp; returns
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none"><path d="M5 8l5 5 5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </summary>
  <div class="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
    Free returns within 30 days. Orders ship in 1-2 business days.
  </div>
</details>`,
      react: `export function ToggleCollapseDisclosure({
  summary,
  children,
  defaultOpen = false,
  className = '',
}) {
  return (
    <details open={defaultOpen} className={\`group w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:focus-visible:outline-blue-400">
        {summary}
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none">
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        {children}
      </div>
    </details>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface ToggleCollapseDisclosureProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ToggleCollapseDisclosure({
  summary,
  children,
  defaultOpen = false,
  className = '',
}: ToggleCollapseDisclosureProps): JSX.Element {
  return (
    <details open={defaultOpen} className={\`group w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:focus-visible:outline-blue-400">
        {summary}
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none">
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        {children}
      </div>
    </details>
  );
}`,
    },
  },
];
