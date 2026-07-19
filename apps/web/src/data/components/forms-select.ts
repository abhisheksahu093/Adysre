import type { ComponentEntry } from './types';

/**
 * Forms - select and multi-select.
 *
 * Everything here is one of three things, and the difference matters more than
 * the styling does:
 *
 * 1. A real `<select>` (`select-native`). The browser hands you keyboard
 *    support, type-ahead, the platform popup and the mobile wheel for free, and
 *    none of it can rot. It is the baseline every other entry is measured
 *    against, and it is the right answer more often than this file's length
 *    suggests.
 * 2. A listbox - a button that opens a `role="listbox"`. Chosen when the option
 *    rows need markup a native `<option>` cannot hold (icons, avatars,
 *    checkmarks) or when more than one value can be picked.
 * 3. A combobox - a text input that filters a listbox. Chosen when the list is
 *    long enough that scanning it is worse than typing.
 *
 * The listboxes and comboboxes all implement the same ARIA contract, because a
 * half-implemented one is worse than a native select in every measurable way:
 * `aria-haspopup` + `aria-expanded` on the trigger, `role="option"` with
 * `aria-selected` on every row, `aria-activedescendant` for virtual focus,
 * Arrow/Home/End/Enter/Escape, dismiss on outside click, and focus returned to
 * the trigger on close.
 */
export const formsSelectComponents: ComponentEntry[] = [
  {
    slug: 'select-native',
    category: 'forms',
    tags: ['select', 'native', 'form', 'dropdown', 'zero-js'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-03',
    updatedAt: '2026-06-21',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 3120, copies: 941, downloads: 214 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'onSelect', type: '(value: string) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A real <select>. That is the entire component, and that is the point: the
  browser supplies keyboard navigation, type-ahead, the platform popup and the
  mobile wheel, and none of it can drift out of sync with a hand-rolled listbox.
  Only the box is restyled - the popup list is the OS's and stays that way.

  Reach for a custom listbox when an option row needs markup <option> cannot
  hold, or when more than one value can be chosen. Never reach for one because
  the arrow is the wrong grey.
-->
<div class="nsel">
  <label class="nsel__label" for="nsel-plan">Plan</label>
  <div class="nsel__control">
    <select class="nsel__select" id="nsel-plan" name="plan">
      <option value="starter">Starter</option>
      <option value="growth">Growth</option>
      <option value="scale">Scale</option>
      <option value="enterprise">Enterprise</option>
    </select>
    <svg class="nsel__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
</div>`,
      css: `.nsel__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.nsel__control {
  position: relative;
  display: block;
}

.nsel__select {
  /* Drops the OS arrow so the chevron below can take its place. Everything
     inside the popup stays native - appearance: none does not reach it. */
  appearance: none;
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
  /* The one lever CSS has over the native popup: without it the option list is
     painted light on a dark page. */
  color-scheme: light;
}

.nsel__select:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nsel__select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nsel__chevron {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  /* The chevron sits on top of the select, so clicks have to fall through it or
     a third of the control stops opening the popup. */
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  .nsel__label {
    color: #d1d5db;
  }

  .nsel__select {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
    color-scheme: dark;
  }

  .nsel__select:focus-visible {
    outline-color: #60a5fa;
  }

  .nsel__chevron {
    color: #9ca3af;
  }
}`,
      tailwind: `<div>
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="nsel-plan">
    Plan
  </label>
  <div class="relative">
    <select
      id="nsel-plan"
      name="plan"
      class="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:[color-scheme:dark] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <option value="starter">Starter</option>
      <option value="growth">Growth</option>
      <option value="scale">Scale</option>
      <option value="enterprise">Enterprise</option>
    </select>
    <svg
      class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true" focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
</div>`,
      react: `import { useId } from 'react';

export function NativeSelect({ label, items, value, onSelect, disabled = false, className = '' }) {
  const id = useId();

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onSelect?.(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:[color-scheme:dark] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {items.map((item) => (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useId } from 'react';

interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface NativeSelectProps {
  label: string;
  items: SelectItem[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

// 'use client' is here for useId and the change handler only - the markup this
// renders ships no listbox JS at all, which is the reason to choose it.
export function NativeSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  className = '',
}: NativeSelectProps) {
  const id = useId();

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onSelect?.(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:[color-scheme:dark] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {items.map((item) => (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

// Drop it in a <form> with a \`name\` and it posts without a line of client JS.`,
      typescript: `'use client';

import { useId } from 'react';

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps {
  /** Visible label. Required - a placeholder \`<option>\` is not a label. */
  label: string;
  items: SelectItem[];
  /** Controlled value. Omit for an uncontrolled select. */
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function NativeSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  className = '',
}: NativeSelectProps): JSX.Element {
  // useId ties the label to the select without asking the caller for an id, so
  // two of these on one page cannot collide.
  const id = useId();

  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onSelect?.(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:[color-scheme:dark] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {items.map((item) => (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ))}
        </select>
        {/* Decorative: the select already announces itself as a combobox. */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'select-custom',
    category: 'forms',
    tags: ['select', 'listbox', 'aria', 'keyboard', 'dropdown'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-04-17',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.3.0',
    featured: true,
    stats: { views: 2680, copies: 730, downloads: 198 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'onSelect', type: '(value: string) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The listbox pattern, in full. Everything below is what a native <select> gives
  you for nothing, which is why this markup is the price of admission rather
  than a nice-to-have:

  - the trigger is a button with aria-haspopup="listbox" and aria-expanded, so
    it announces "collapsed"/"expanded" instead of just "button";
  - the popup is role="listbox" and every row is role="option" with
    aria-selected - a <ul><li> alone announces as a bare list;
  - focus never leaves the trigger. aria-activedescendant points at the
    highlighted option instead, so typing keeps working and the browser's own
    focus ring stays on the control the user tabbed to;
  - the highlight is a background AND a bar in the leading gutter, because a
    background alone is a colour-only signal.
-->
<div class="csel">
  <span class="csel__label" id="csel-label">Plan</span>
  <button
    class="csel__trigger"
    id="csel-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="csel-listbox"
    aria-labelledby="csel-label csel-trigger"
  >
    <span class="csel__value">Growth</span>
    <svg class="csel__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
  <ul class="csel__listbox" id="csel-listbox" role="listbox" aria-labelledby="csel-label" tabindex="-1" hidden>
    <li class="csel__option" id="csel-opt-starter" role="option" data-value="starter" aria-selected="false">
      <span class="csel__marker" aria-hidden="true"></span>
      <span class="csel__option-label">Starter</span>
      <svg class="csel__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12 5 5L20 7" /></svg>
    </li>
    <li class="csel__option" id="csel-opt-growth" role="option" data-value="growth" aria-selected="true">
      <span class="csel__marker" aria-hidden="true"></span>
      <span class="csel__option-label">Growth</span>
      <svg class="csel__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12 5 5L20 7" /></svg>
    </li>
    <li class="csel__option" id="csel-opt-scale" role="option" data-value="scale" aria-selected="false">
      <span class="csel__marker" aria-hidden="true"></span>
      <span class="csel__option-label">Scale</span>
      <svg class="csel__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12 5 5L20 7" /></svg>
    </li>
    <li class="csel__option" id="csel-opt-enterprise" role="option" data-value="enterprise" aria-selected="false">
      <span class="csel__marker" aria-hidden="true"></span>
      <span class="csel__option-label">Enterprise</span>
      <svg class="csel__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12 5 5L20 7" /></svg>
    </li>
  </ul>
</div>

<script>
  document.querySelectorAll('.csel').forEach(function (root) {
    var trigger = root.querySelector('.csel__trigger');
    var listbox = root.querySelector('.csel__listbox');
    var valueEl = root.querySelector('.csel__value');
    var options = Array.prototype.slice.call(root.querySelectorAll('.csel__option'));
    var active = options.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; });
    if (active < 0) active = 0;

    function paint() {
      options.forEach(function (option, index) {
        option.classList.toggle('csel__option--active', index === active);
      });
      // Virtual focus: the DOM focus stays on the trigger, so this attribute is
      // the only thing telling a screen reader which row is current.
      listbox.setAttribute('aria-activedescendant', options[active] ? options[active].id : '');
      if (options[active]) options[active].scrollIntoView({ block: 'nearest' });
    }

    function setOpen(open) {
      listbox.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) paint();
    }

    function close() {
      setOpen(false);
      // Focus must come back to the trigger, or it lands on <body> and the next
      // Tab restarts from the top of the page.
      trigger.focus();
    }

    function commit(index) {
      var option = options[index];
      if (!option) return;
      options.forEach(function (o) { o.setAttribute('aria-selected', String(o === option)); });
      valueEl.textContent = option.querySelector('.csel__option-label').textContent;
      active = index;
      close();
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    options.forEach(function (option, index) {
      option.addEventListener('click', function () { commit(index); });
      option.addEventListener('mousemove', function () { active = index; paint(); });
    });

    trigger.addEventListener('keydown', function (event) {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      var key = event.key;

      if (!open && (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ')) {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;

      if (key === 'Escape') { event.preventDefault(); close(); return; }
      if (key === 'Enter' || key === ' ') { event.preventDefault(); commit(active); return; }
      if (key === 'Tab') { setOpen(false); return; }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = options.length - 1;
      else return;

      event.preventDefault();
      // Wrap, so End then ArrowDown lands back on the first row.
      active = (next + options.length) % options.length;
      paint();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.csel {
  position: relative;
}

.csel__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.csel__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.csel__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.csel__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.csel__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.csel__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

/* The listbox holds virtual focus, so it never shows a ring of its own - the
   ring the user sees belongs to the trigger, which is where focus really is. */
.csel__listbox:focus {
  outline: none;
}

.csel__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

/*
 * The highlight is two signals, not one. The background alone would be a
 * colour-only cue - it fails for anyone who cannot separate #f3f4f6 from #fff,
 * and it disappears entirely in forced-colours mode. The gutter bar is a shape
 * that is either there or not.
 */
.csel__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.csel__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.csel__option--active .csel__marker {
  background-color: #2563eb;
}

.csel__option-label {
  flex: 1;
}

.csel__check {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  color: #2563eb;
  visibility: hidden;
}

/* Selection is a tick, not a colour - the same reasoning as the marker. */
.csel__option[aria-selected='true'] .csel__check {
  visibility: visible;
}

@media (prefers-color-scheme: dark) {
  .csel__label {
    color: #d1d5db;
  }

  .csel__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .csel__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .csel__chevron {
    color: #9ca3af;
  }

  .csel__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .csel__option {
    color: #d1d5db;
  }

  .csel__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .csel__option--active .csel__marker,
  .csel__check {
    background-color: transparent;
    color: #60a5fa;
  }

  .csel__option--active .csel__marker {
    background-color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="csel-label">Plan</span>
  <button
    id="csel-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="true"
    aria-controls="csel-listbox"
    aria-labelledby="csel-label csel-trigger"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span>Growth</span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
  <ul
    id="csel-listbox"
    role="listbox"
    aria-labelledby="csel-label"
    aria-activedescendant="csel-opt-growth"
    tabindex="-1"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="csel-opt-starter" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Starter</span>
      <svg class="invisible h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
    </li>
    <li id="csel-opt-growth" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="flex-1">Growth</span>
      <svg class="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
    </li>
    <li id="csel-opt-scale" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Scale</span>
      <svg class="invisible h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
    </li>
    <li id="csel-opt-enterprise" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Enterprise</span>
      <svg class="invisible h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function CustomSelect({ label, items, value, onSelect, disabled = false, className = '' }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const found = items.findIndex((item) => item.value === value);
    return found === -1 ? 0 : found;
  });
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  const selected = items.find((item) => item.value === value);
  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index) {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className={\`relative \${className}\`} ref={rootRef}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id={\`\${baseId}-label\`}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose…'}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isSelected = item.value === value;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={isSelected}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                <svg
                  className={\`h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400 \${isSelected ? '' : 'invisible'}\`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  items: SelectItem[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  className = '',
}: CustomSelectProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const found = items.findIndex((item) => item.value === value);
    return found === -1 ? 0 : found;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const selected = items.find((item) => item.value === value);
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className={\`relative \${className}\`} ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose…'}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isSelected = item.value === value;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={isSelected}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                <svg
                  className={\`h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400 \${isSelected ? '' : 'invisible'}\`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  /** Visible label. Rendered as a <span> and wired with aria-labelledby,
   *  because a <label> only pairs with a real form control - never a button. */
  label: string;
  items: SelectItem[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  className = '',
}: CustomSelectProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  // The highlighted row. Distinct from \`value\`: arrowing moves this, only
  // Enter or a click moves the selection.
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const found = items.findIndex((item) => item.value === value);
    return found === -1 ? 0 : found;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const selected = items.find((item) => item.value === value);
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Keep the highlighted row in view when it moves by keyboard - without this
  // the list scrolls only on hover and arrowing past the fold goes blind.
  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      // Tab closes but does not restore focus - the browser is already moving
      // it to the next control and stealing it back would trap the user.
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className={\`relative \${className}\`} ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        // Both ids: the label names the control, the trigger's own text
        // supplies the current value. "Plan, Growth, collapsed".
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose…'}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          // Virtual focus. The DOM focus stays on the trigger; this is the only
          // thing telling a screen reader which row is current.
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isSelected = item.value === value;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={isSelected}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                {/* The highlight is a bar plus a background, never a background
                    alone - colour on its own is not a signal everyone can see. */}
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                <svg
                  className={\`h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400 \${isSelected ? '' : 'invisible'}\`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'select-with-icons',
    category: 'forms',
    tags: ['select', 'icon', 'listbox', 'dropdown', 'aria'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-02',
    updatedAt: '2026-06-27',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1740, copies: 462, downloads: 118 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'IconSelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'onSelect', type: '(value: string) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  The one thing a native <select> genuinely cannot do: an <option> may contain
  text and nothing else, so a glyph per row forces a listbox. That is the trade
  being made here - you are giving up the platform's popup to gain 16px of SVG,
  so the icon had better be carrying information.

  Every icon is aria-hidden. The row already says "Engineering"; an icon that
  announces itself as well produces "Engineering Engineering".
-->
<div class="isel">
  <span class="isel__label" id="isel-label">Team</span>
  <button class="isel__trigger" id="isel-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="isel-listbox" aria-labelledby="isel-label isel-trigger">
    <span class="isel__selected">
      <svg class="isel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
      <span>Engineering</span>
    </span>
    <svg class="isel__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <ul class="isel__listbox" id="isel-listbox" role="listbox" aria-labelledby="isel-label" tabindex="-1" hidden>
    <li class="isel__option" id="isel-opt-design" role="option" data-value="design" aria-selected="false">
      <span class="isel__marker" aria-hidden="true"></span>
      <svg class="isel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
      <span class="isel__option-label">Design</span>
    </li>
    <li class="isel__option" id="isel-opt-engineering" role="option" data-value="engineering" aria-selected="true">
      <span class="isel__marker" aria-hidden="true"></span>
      <svg class="isel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
      <span class="isel__option-label">Engineering</span>
    </li>
    <li class="isel__option" id="isel-opt-marketing" role="option" data-value="marketing" aria-selected="false">
      <span class="isel__marker" aria-hidden="true"></span>
      <svg class="isel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
      <span class="isel__option-label">Marketing</span>
    </li>
    <li class="isel__option" id="isel-opt-sales" role="option" data-value="sales" aria-selected="false">
      <span class="isel__marker" aria-hidden="true"></span>
      <svg class="isel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 3v18h18M18 9l-5 5-3-3-4 4" /></svg>
      <span class="isel__option-label">Sales</span>
    </li>
    <li class="isel__option" id="isel-opt-support" role="option" data-value="support" aria-selected="false">
      <span class="isel__marker" aria-hidden="true"></span>
      <svg class="isel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
      <span class="isel__option-label">Support</span>
    </li>
  </ul>
</div>

<script>
  document.querySelectorAll('.isel').forEach(function (root) {
    var trigger = root.querySelector('.isel__trigger');
    var listbox = root.querySelector('.isel__listbox');
    var selectedSlot = root.querySelector('.isel__selected');
    var options = Array.prototype.slice.call(root.querySelectorAll('.isel__option'));
    var active = Math.max(0, options.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; }));

    function paint() {
      options.forEach(function (option, index) {
        option.classList.toggle('isel__option--active', index === active);
      });
      listbox.setAttribute('aria-activedescendant', options[active] ? options[active].id : '');
      if (options[active]) options[active].scrollIntoView({ block: 'nearest' });
    }

    function setOpen(open) {
      listbox.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) paint();
    }

    function close() { setOpen(false); trigger.focus(); }

    function commit(index) {
      var option = options[index];
      if (!option) return;
      options.forEach(function (o) { o.setAttribute('aria-selected', String(o === option)); });
      // Mirror the row's icon into the trigger - the glyph is half the value.
      selectedSlot.innerHTML =
        option.querySelector('.isel__icon').outerHTML +
        '<span>' + option.querySelector('.isel__option-label').textContent + '</span>';
      active = index;
      close();
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    options.forEach(function (option, index) {
      option.addEventListener('click', function () { commit(index); });
      option.addEventListener('mousemove', function () { active = index; paint(); });
    });

    trigger.addEventListener('keydown', function (event) {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      var key = event.key;
      if (!open) {
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (key === 'Escape') { event.preventDefault(); close(); return; }
      if (key === 'Enter' || key === ' ') { event.preventDefault(); commit(active); return; }
      if (key === 'Tab') { setOpen(false); return; }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = options.length - 1;
      else return;
      event.preventDefault();
      active = (next + options.length) % options.length;
      paint();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.isel {
  position: relative;
}

.isel__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.isel__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.isel__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.isel__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.isel__selected {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.isel__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  /* Deliberately dimmer than the label it sits beside. The icon is a landmark
     for scanning, not the content - 4.5:1 is a text requirement and a
     decorative glyph is held to 3:1 instead. */
  color: #6b7280;
}

.isel__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.isel__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.isel__listbox:focus {
  outline: none;
}

.isel__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.isel__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.isel__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.isel__option--active .isel__marker {
  background-color: #2563eb;
}

/* The icon rides the row's colour when highlighted, so it does not stay grey on
   a row that has otherwise darkened. */
.isel__option--active .isel__icon {
  color: #2563eb;
}

.isel__option[aria-selected='true'] {
  font-weight: 600;
}

.isel__option-label {
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .isel__label {
    color: #d1d5db;
  }

  .isel__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .isel__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .isel__icon,
  .isel__chevron {
    color: #9ca3af;
  }

  .isel__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .isel__option {
    color: #d1d5db;
  }

  .isel__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .isel__option--active .isel__marker,
  .isel__option--active .isel__icon {
    background-color: #60a5fa;
    color: #60a5fa;
  }

  .isel__option--active .isel__icon {
    background-color: transparent;
  }
}`,
      tailwind: `<div class="relative">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="isel-label">Team</span>
  <button
    id="isel-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="true"
    aria-controls="isel-listbox"
    aria-labelledby="isel-label isel-trigger"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span class="inline-flex min-w-0 items-center gap-2">
      <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
      <span>Engineering</span>
    </span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <ul
    id="isel-listbox"
    role="listbox"
    aria-labelledby="isel-label"
    aria-activedescendant="isel-opt-engineering"
    tabindex="-1"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="isel-opt-design" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg>
      <span class="flex-1">Design</span>
    </li>
    <li id="isel-opt-engineering" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <svg class="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
      <span class="flex-1">Engineering</span>
    </li>
    <li id="isel-opt-marketing" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
      <span class="flex-1">Marketing</span>
    </li>
    <li id="isel-opt-sales" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18M18 9l-5 5-3-3-4 4" /></svg>
      <span class="flex-1">Sales</span>
    </li>
    <li id="isel-opt-support" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
      <span class="flex-1">Support</span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function IconSelect({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const found = items.findIndex((item) => item.value === value);
    return found === -1 ? 0 : found;
  });
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const selected = items.find((item) => item.value === value);
  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index) {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id={\`\${baseId}-label\`}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          {selected ? (
            <>
              <span className="shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true">
                {selected.icon}
              </span>
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Choose a team…</span>
          )}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isSelected = item.value === value;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                } \${isSelected ? 'font-semibold' : ''}\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span
                  aria-hidden="true"
                  className={\`shrink-0 \${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }\`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

interface IconSelectItem {
  value: string;
  label: string;
  icon: ReactNode;
}

interface IconSelectProps {
  label: string;
  items: IconSelectItem[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export function IconSelect({ label, items, value, onSelect, disabled = false }: IconSelectProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const found = items.findIndex((item) => item.value === value);
    return found === -1 ? 0 : found;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = items.find((item) => item.value === value);
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          {selected ? (
            <>
              <span className="shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true">
                {selected.icon}
              </span>
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Choose a team…</span>
          )}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isSelected = item.value === value;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                } \${isSelected ? 'font-semibold' : ''}\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span
                  aria-hidden="true"
                  className={\`shrink-0 \${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }\`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface IconSelectItem {
  value: string;
  label: string;
  /** Rendered in the row and mirrored into the trigger once selected.
   *  Always decorative - \`label\` is what gets announced. */
  icon: ReactNode;
}

export interface IconSelectProps {
  label: string;
  items: IconSelectItem[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export function IconSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: IconSelectProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const found = items.findIndex((item) => item.value === value);
    return found === -1 ? 0 : found;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = items.find((item) => item.value === value);
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          {selected ? (
            <>
              {/* Mirroring the glyph into the trigger is the whole point - a
                  closed control that drops it loses half its information. */}
              <span className="shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true">
                {selected.icon}
              </span>
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Choose a team…</span>
          )}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isSelected = item.value === value;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                } \${isSelected ? 'font-semibold' : ''}\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span
                  aria-hidden="true"
                  className={\`shrink-0 \${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }\`}
                >
                  {item.icon}
                </span>
                {/* Selection is weight as well as a tint - the bold row survives
                    a greyscale screenshot, the blue one does not. */}
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'select-grouped',
    category: 'forms',
    tags: ['select', 'grouped', 'listbox', 'optgroup', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-15',
    updatedAt: '2026-07-04',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1310, copies: 348, downloads: 89 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'OptionGroup[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'onSelect', type: '(value: string) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  A grouped listbox - the ARIA analogue of <optgroup>. Two rules make the
  grouping real rather than decorative:

  1. The heading is NOT an option. It sits in a role="group" that carries
     aria-labelledby pointing at it, so a screen reader announces "Americas,
     group" as it crosses the boundary and never lets the user select the word
     "Americas".
  2. The keyboard treats the list as flat. Arrowing runs straight through the
     headings - group boundaries are an announcement, not a stop.

  If your rows are plain text and single-select, note that <select><optgroup>
  does all of this natively and cannot regress. This markup earns its keep only
  once the rows need more than text.
-->
<div class="gsel">
  <span class="gsel__label" id="gsel-label">Region</span>
  <button class="gsel__trigger" id="gsel-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="gsel-listbox" aria-labelledby="gsel-label gsel-trigger">
    <span class="gsel__value">Germany</span>
    <svg class="gsel__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <div class="gsel__listbox" id="gsel-listbox" role="listbox" aria-labelledby="gsel-label" tabindex="-1" hidden>
    <div role="group" aria-labelledby="gsel-group-americas">
      <div class="gsel__heading" id="gsel-group-americas" role="presentation">Americas</div>
      <div class="gsel__option" id="gsel-opt-us" role="option" data-value="us" aria-selected="false"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">United States</span></div>
      <div class="gsel__option" id="gsel-opt-ca" role="option" data-value="ca" aria-selected="false"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">Canada</span></div>
      <div class="gsel__option" id="gsel-opt-br" role="option" data-value="br" aria-selected="false"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">Brazil</span></div>
    </div>
    <div role="group" aria-labelledby="gsel-group-emea">
      <div class="gsel__heading" id="gsel-group-emea" role="presentation">EMEA</div>
      <div class="gsel__option" id="gsel-opt-de" role="option" data-value="de" aria-selected="true"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">Germany</span></div>
      <div class="gsel__option" id="gsel-opt-fr" role="option" data-value="fr" aria-selected="false"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">France</span></div>
      <div class="gsel__option" id="gsel-opt-uk" role="option" data-value="uk" aria-selected="false"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">United Kingdom</span></div>
    </div>
    <div role="group" aria-labelledby="gsel-group-apac">
      <div class="gsel__heading" id="gsel-group-apac" role="presentation">APAC</div>
      <div class="gsel__option" id="gsel-opt-jp" role="option" data-value="jp" aria-selected="false"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">Japan</span></div>
      <div class="gsel__option" id="gsel-opt-au" role="option" data-value="au" aria-selected="false"><span class="gsel__marker" aria-hidden="true"></span><span class="gsel__option-label">Australia</span></div>
    </div>
  </div>
</div>

<script>
  document.querySelectorAll('.gsel').forEach(function (root) {
    var trigger = root.querySelector('.gsel__trigger');
    var listbox = root.querySelector('.gsel__listbox');
    var valueEl = root.querySelector('.gsel__value');
    // Flattened on purpose: the headings are skipped entirely, so ArrowDown at
    // the end of Americas lands on Germany, not on the word "EMEA".
    var options = Array.prototype.slice.call(root.querySelectorAll('.gsel__option'));
    var active = Math.max(0, options.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; }));

    function paint() {
      options.forEach(function (option, index) {
        option.classList.toggle('gsel__option--active', index === active);
      });
      listbox.setAttribute('aria-activedescendant', options[active] ? options[active].id : '');
      if (options[active]) options[active].scrollIntoView({ block: 'nearest' });
    }

    function setOpen(open) {
      listbox.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) paint();
    }

    function close() { setOpen(false); trigger.focus(); }

    function commit(index) {
      var option = options[index];
      if (!option) return;
      options.forEach(function (o) { o.setAttribute('aria-selected', String(o === option)); });
      valueEl.textContent = option.querySelector('.gsel__option-label').textContent;
      active = index;
      close();
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    options.forEach(function (option, index) {
      option.addEventListener('click', function () { commit(index); });
      option.addEventListener('mousemove', function () { active = index; paint(); });
    });

    trigger.addEventListener('keydown', function (event) {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      var key = event.key;
      if (!open) {
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (key === 'Escape') { event.preventDefault(); close(); return; }
      if (key === 'Enter' || key === ' ') { event.preventDefault(); commit(active); return; }
      if (key === 'Tab') { setOpen(false); return; }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = options.length - 1;
      else return;
      event.preventDefault();
      active = (next + options.length) % options.length;
      paint();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.gsel {
  position: relative;
}

.gsel__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.gsel__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.gsel__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.gsel__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gsel__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.gsel__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 16rem;
  padding: 0.25rem;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.gsel__listbox:focus {
  outline: none;
}

/*
 * The heading sticks to the top of the scroll box, so the group a row belongs
 * to is still on screen after scrolling past its boundary - the visual half of
 * the same information aria-labelledby gives a screen reader.
 */
.gsel__heading {
  position: sticky;
  top: 0;
  padding: 0.375rem 0.5rem 0.375rem 0.75rem;
  background-color: #fff;
  color: #6b7280;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.gsel__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.gsel__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.gsel__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.gsel__option--active .gsel__marker {
  background-color: #2563eb;
}

.gsel__option[aria-selected='true'] {
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .gsel__label {
    color: #d1d5db;
  }

  .gsel__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .gsel__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .gsel__chevron {
    color: #9ca3af;
  }

  .gsel__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  /* The heading must repaint its own background, not inherit - it is sticky, so
     rows scroll underneath it and a transparent heading smears. */
  .gsel__heading {
    background-color: #111827;
    color: #9ca3af;
  }

  .gsel__option {
    color: #d1d5db;
  }

  .gsel__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .gsel__option--active .gsel__marker {
    background-color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="gsel-label">Region</span>
  <button
    id="gsel-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="true"
    aria-controls="gsel-listbox"
    aria-labelledby="gsel-label gsel-trigger"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span>Germany</span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <div
    id="gsel-listbox"
    role="listbox"
    aria-labelledby="gsel-label"
    aria-activedescendant="gsel-opt-de"
    tabindex="-1"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
  >
    <div role="group" aria-labelledby="gsel-group-americas">
      <div id="gsel-group-americas" role="presentation" class="sticky top-0 bg-white py-1.5 pl-3 pr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        Americas
      </div>
      <div id="gsel-opt-us" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>United States
      </div>
      <div id="gsel-opt-ca" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>Canada
      </div>
      <div id="gsel-opt-br" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>Brazil
      </div>
    </div>
    <div role="group" aria-labelledby="gsel-group-emea">
      <div id="gsel-group-emea" role="presentation" class="sticky top-0 bg-white py-1.5 pl-3 pr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        EMEA
      </div>
      <div id="gsel-opt-de" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>Germany
      </div>
      <div id="gsel-opt-fr" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>France
      </div>
      <div id="gsel-opt-uk" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>United Kingdom
      </div>
    </div>
    <div role="group" aria-labelledby="gsel-group-apac">
      <div id="gsel-group-apac" role="presentation" class="sticky top-0 bg-white py-1.5 pl-3 pr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        APAC
      </div>
      <div id="gsel-opt-jp" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>Japan
      </div>
      <div id="gsel-opt-au" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>Australia
      </div>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function GroupedSelect({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  // One flat array of every option, in DOM order. The keyboard runs on this;
  // the headings exist only for rendering and announcement.
  const flat = useMemo(
    () => items.flatMap((group) => group.options.map((option) => ({ ...option, group: group.label }))),
    [items],
  );

  const [activeIndex, setActiveIndex] = useState(() => {
    const found = flat.findIndex((option) => option.value === value);
    return found === -1 ? 0 : found;
  });

  const selected = flat.find((option) => option.value === value);
  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index) {
    const option = flat[index];
    if (!option) return;
    onSelect?.(option.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % flat.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(flat.length - 1);
        return;
      default:
    }
  }

  let cursor = -1;

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id={\`\${baseId}-label\`}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a region…'}
        </span>
        <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group) => (
            <div key={group.label} role="group" aria-labelledby={\`\${baseId}-group-\${group.label}\`}>
              <div
                id={\`\${baseId}-group-\${group.label}\`}
                role="presentation"
                className="sticky top-0 bg-white py-1.5 pl-3 pr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                {group.label}
              </div>
              {group.options.map((option) => {
                cursor += 1;
                const index = cursor;
                const isActive = index === activeIndex;
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300'
                    } \${isSelected ? 'font-semibold' : ''}\`}
                  >
                    <span
                      aria-hidden="true"
                      className={\`h-4 w-0.5 shrink-0 rounded-full \${
                        isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                      }\`}
                    />
                    {option.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface GroupOption {
  value: string;
  label: string;
}

interface OptionGroup {
  label: string;
  options: GroupOption[];
}

interface GroupedSelectProps {
  label: string;
  items: OptionGroup[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export function GroupedSelect({ label, items, value, onSelect, disabled = false }: GroupedSelectProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const flat = useMemo(
    () => items.flatMap((group) => group.options.map((option) => ({ ...option, group: group.label }))),
    [items],
  );

  const [activeIndex, setActiveIndex] = useState(() => {
    const found = flat.findIndex((option) => option.value === value);
    return found === -1 ? 0 : found;
  });

  const selected = flat.find((option) => option.value === value);
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const option = flat[index];
    if (!option) return;
    onSelect?.(option.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % flat.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(flat.length - 1);
        return;
      default:
    }
  }

  let cursor = -1;

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a region…'}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group) => (
            <div key={group.label} role="group" aria-labelledby={\`\${baseId}-group-\${group.label}\`}>
              <div
                id={\`\${baseId}-group-\${group.label}\`}
                role="presentation"
                className="sticky top-0 bg-white py-1.5 pl-3 pr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                {group.label}
              </div>
              {group.options.map((option) => {
                cursor += 1;
                const index = cursor;
                const isActive = index === activeIndex;
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300'
                    } \${isSelected ? 'font-semibold' : ''}\`}
                  >
                    <span
                      aria-hidden="true"
                      className={\`h-4 w-0.5 shrink-0 rounded-full \${
                        isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                      }\`}
                    />
                    {option.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface GroupOption {
  value: string;
  label: string;
}

export interface OptionGroup {
  label: string;
  options: GroupOption[];
}

export interface GroupedSelectProps {
  label: string;
  /** Groups in render order. Headings are announced, never selectable. */
  items: OptionGroup[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export function GroupedSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: GroupedSelectProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /**
   * The grouping is a rendering concern; the keyboard is not. Flattening once
   * here means ArrowDown at the bottom of one group falls into the top of the
   * next without a single special case - the alternative is a two-dimensional
   * cursor and a bug for every boundary.
   */
  const flat = useMemo(
    () => items.flatMap((group) => group.options.map((option) => ({ ...option, group: group.label }))),
    [items],
  );

  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const found = flat.findIndex((option) => option.value === value);
    return found === -1 ? 0 : found;
  });

  const selected = flat.find((option) => option.value === value);
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const option = flat[index];
    if (!option) return;
    onSelect?.(option.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % flat.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
        return;
      // Home/End are absolute - first and last option in the whole listbox,
      // not the first of the current group.
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(flat.length - 1);
        return;
      default:
    }
  }

  // Walks in lockstep with \`flat\` as the groups render, so each row knows its
  // index in the flattened list without a second lookup.
  let cursor = -1;

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a region…'}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((group) => (
            // role="group" + aria-labelledby is what makes the heading a
            // boundary a screen reader announces rather than a styled div.
            <div key={group.label} role="group" aria-labelledby={\`\${baseId}-group-\${group.label}\`}>
              <div
                id={\`\${baseId}-group-\${group.label}\`}
                role="presentation"
                className="sticky top-0 bg-white py-1.5 pl-3 pr-2 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                {group.label}
              </div>
              {group.options.map((option) => {
                cursor += 1;
                const index = cursor;
                const isActive = index === activeIndex;
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300'
                    } \${isSelected ? 'font-semibold' : ''}\`}
                  >
                    <span
                      aria-hidden="true"
                      className={\`h-4 w-0.5 shrink-0 rounded-full \${
                        isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                      }\`}
                    />
                    {option.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'select-with-error',
    category: 'forms',
    tags: ['select', 'error', 'validation', 'aria-invalid', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-28',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.1.1',
    stats: { views: 1590, copies: 421, downloads: 103 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'onSelect', type: '(value: string) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  An invalid select. Three things do the work, and none of them is the red
  border:

  - aria-invalid="true" is what makes a screen reader say "invalid entry". A red
    border says nothing to anyone who cannot see it.
  - aria-describedby carries BOTH ids - the hint and the error. Order matters:
    they are announced in the order listed, so the error comes last and is what
    the user is left with. Replacing the hint with the error instead of
    appending it would silently drop the instruction the user still needs.
  - The message pairs an icon with the text. Red alone is a colour-only signal
    and roughly one man in twelve cannot act on it.

  The error text is NOT role="alert" here: it is already described by the
  control, so an alert would announce it a second time on every focus.
-->
<div class="esel esel--invalid">
  <span class="esel__label" id="esel-label">Billing country</span>
  <button
    class="esel__trigger"
    id="esel-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="esel-listbox"
    aria-labelledby="esel-label esel-trigger"
    aria-invalid="true"
    aria-describedby="esel-hint esel-error"
  >
    <span class="esel__value esel__value--empty">Choose a country…</span>
    <svg class="esel__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <ul class="esel__listbox" id="esel-listbox" role="listbox" aria-labelledby="esel-label" tabindex="-1" hidden>
    <li class="esel__option" id="esel-opt-de" role="option" data-value="de" aria-selected="false"><span class="esel__marker" aria-hidden="true"></span>Germany</li>
    <li class="esel__option" id="esel-opt-fr" role="option" data-value="fr" aria-selected="false"><span class="esel__marker" aria-hidden="true"></span>France</li>
    <li class="esel__option" id="esel-opt-nl" role="option" data-value="nl" aria-selected="false"><span class="esel__marker" aria-hidden="true"></span>Netherlands</li>
    <li class="esel__option" id="esel-opt-es" role="option" data-value="es" aria-selected="false"><span class="esel__marker" aria-hidden="true"></span>Spain</li>
  </ul>
  <p class="esel__hint" id="esel-hint">Sets the tax rate on your invoices.</p>
  <p class="esel__error" id="esel-error">
    <svg class="esel__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
    Select a billing country to continue.
  </p>
</div>

<script>
  document.querySelectorAll('.esel').forEach(function (root) {
    var trigger = root.querySelector('.esel__trigger');
    var listbox = root.querySelector('.esel__listbox');
    var valueEl = root.querySelector('.esel__value');
    var options = Array.prototype.slice.call(root.querySelectorAll('.esel__option'));
    var active = 0;

    function paint() {
      options.forEach(function (option, index) {
        option.classList.toggle('esel__option--active', index === active);
      });
      listbox.setAttribute('aria-activedescendant', options[active] ? options[active].id : '');
    }

    function setOpen(open) {
      listbox.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) paint();
    }

    function close() { setOpen(false); trigger.focus(); }

    function commit(index) {
      var option = options[index];
      if (!option) return;
      options.forEach(function (o) { o.setAttribute('aria-selected', String(o === option)); });
      valueEl.textContent = option.textContent.trim();
      valueEl.classList.remove('esel__value--empty');
      active = index;

      // Clearing the error is not cosmetic: aria-invalid and the describedby
      // list have to come off together, or the control keeps announcing an
      // error the user has already fixed.
      root.classList.remove('esel--invalid');
      trigger.removeAttribute('aria-invalid');
      trigger.setAttribute('aria-describedby', 'esel-hint');
      close();
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    options.forEach(function (option, index) {
      option.addEventListener('click', function () { commit(index); });
      option.addEventListener('mousemove', function () { active = index; paint(); });
    });

    trigger.addEventListener('keydown', function (event) {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      var key = event.key;
      if (!open) {
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (key === 'Escape') { event.preventDefault(); close(); return; }
      if (key === 'Enter' || key === ' ') { event.preventDefault(); commit(active); return; }
      if (key === 'Tab') { setOpen(false); return; }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = options.length - 1;
      else return;
      event.preventDefault();
      active = (next + options.length) % options.length;
      paint();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.esel {
  position: relative;
}

.esel__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.esel__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.esel__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * Driven by the attribute, not a class. The style cannot then be applied
 * without the semantics that make it mean something - which is exactly the bug
 * this pattern exists to prevent.
 */
.esel__trigger[aria-invalid='true'] {
  border-color: #dc2626;
  /* A second ring inside the border: the invalid box reads as thicker as well
     as redder, so the state survives a greyscale screenshot. */
  box-shadow: inset 0 0 0 1px #dc2626;
}

.esel__trigger[aria-invalid='true']:focus-visible {
  outline-color: #dc2626;
}

.esel__value--empty {
  color: #6b7280;
}

.esel__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.esel__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.esel__listbox:focus {
  outline: none;
}

.esel__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.esel__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.esel__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.esel__option--active .esel__marker {
  background-color: #2563eb;
}

.esel__hint {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  /* #6b7280 on #fff is 4.83:1 - small text has no exemption, and the hint is
     the smallest text on the control. */
  color: #6b7280;
}

.esel__error {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  font-weight: 500;
  /* #b91c1c, not #ef4444: the lighter red is 3.7:1 on white and fails. */
  color: #b91c1c;
}

.esel__error-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  margin-top: 0.0625rem;
}

.esel:not(.esel--invalid) .esel__error {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .esel__label {
    color: #d1d5db;
  }

  .esel__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .esel__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .esel__trigger[aria-invalid='true'] {
    border-color: #f87171;
    box-shadow: inset 0 0 0 1px #f87171;
  }

  .esel__trigger[aria-invalid='true']:focus-visible {
    outline-color: #f87171;
  }

  .esel__value--empty,
  .esel__chevron {
    color: #9ca3af;
  }

  .esel__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .esel__option {
    color: #d1d5db;
  }

  .esel__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .esel__option--active .esel__marker {
    background-color: #60a5fa;
  }

  .esel__hint {
    color: #9ca3af;
  }

  /* The red has to travel the other way in dark mode - #b91c1c is 3.1:1 on
     #111827. #fca5a5 clears 7:1. */
  .esel__error {
    color: #fca5a5;
  }
}`,
      tailwind: `<div class="relative">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="esel-label">Billing country</span>
  <button
    id="esel-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="esel-listbox"
    aria-labelledby="esel-label esel-trigger"
    aria-invalid="true"
    aria-describedby="esel-hint esel-error"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[invalid=true]:border-red-600 aria-[invalid=true]:shadow-[inset_0_0_0_1px_#dc2626] aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[invalid=true]:border-red-400 dark:aria-[invalid=true]:shadow-[inset_0_0_0_1px_#f87171] dark:aria-[invalid=true]:focus-visible:ring-red-400"
  >
    <span class="text-gray-500 dark:text-gray-400">Choose a country…</span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <ul id="esel-listbox" role="listbox" aria-labelledby="esel-label" tabindex="-1" hidden class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900">
    <li id="esel-opt-de" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300"><span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>Germany</li>
    <li id="esel-opt-fr" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300"><span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>France</li>
    <li id="esel-opt-nl" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300"><span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>Netherlands</li>
    <li id="esel-opt-es" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300"><span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>Spain</li>
  </ul>
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id="esel-hint">Sets the tax rate on your invoices.</p>
  <p class="mt-1 flex items-start gap-1.5 text-xs font-medium text-red-700 dark:text-red-300" id="esel-error">
    <svg class="mt-px h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
    Select a billing country to continue.
  </p>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function SelectWithError({ label, items, value, message, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const invalid = Boolean(message);
  const hintId = \`\${baseId}-hint\`;
  const errorId = \`\${baseId}-error\`;
  const selected = items.find((item) => item.value === value);
  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index) {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id={\`\${baseId}-label\`}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? \`\${hintId} \${errorId}\` : hintId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-600 aria-[invalid=true]:shadow-[inset_0_0_0_1px_#dc2626] aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[invalid=true]:border-red-400 dark:aria-[invalid=true]:shadow-[inset_0_0_0_1px_#f87171] dark:aria-[invalid=true]:focus-visible:ring-red-400"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a country…'}
        </span>
        <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={item.value === value}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                {item.label}
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={hintId}>
        Sets the tax rate on your invoices.
      </p>
      {invalid && (
        <p className="mt-1 flex items-start gap-1.5 text-xs font-medium text-red-700 dark:text-red-300" id={errorId}>
          <svg className="mt-px h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {message}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface SelectWithErrorProps {
  label: string;
  items: SelectItem[];
  value?: string;
  /** Present means invalid. Absent means valid. One source of truth. */
  message?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export function SelectWithError({
  label,
  items,
  value,
  message,
  onSelect,
  disabled = false,
}: SelectWithErrorProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const invalid = Boolean(message);
  const hintId = \`\${baseId}-hint\`;
  const errorId = \`\${baseId}-error\`;
  const selected = items.find((item) => item.value === value);
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        aria-invalid={invalid || undefined}
        // Hint AND error, in that order - the error is announced last, so it is
        // what the user is left holding.
        aria-describedby={invalid ? \`\${hintId} \${errorId}\` : hintId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-600 aria-[invalid=true]:shadow-[inset_0_0_0_1px_#dc2626] aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[invalid=true]:border-red-400 dark:aria-[invalid=true]:shadow-[inset_0_0_0_1px_#f87171] dark:aria-[invalid=true]:focus-visible:ring-red-400"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a country…'}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={item.value === value}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                {item.label}
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={hintId}>
        Sets the tax rate on your invoices.
      </p>
      {invalid ? (
        <p
          className="mt-1 flex items-start gap-1.5 text-xs font-medium text-red-700 dark:text-red-300"
          id={errorId}
        >
          <svg
            className="mt-px h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {message}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface SelectWithErrorProps {
  label: string;
  items: SelectItem[];
  value?: string;
  /**
   * The error text. Its presence IS the invalid state - there is no separate
   * \`invalid\` boolean to fall out of step with it, so a red control with no
   * message (or a message with no aria-invalid) cannot be expressed.
   */
  message?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export function SelectWithError({
  label,
  items,
  value,
  message,
  onSelect,
  disabled = false,
}: SelectWithErrorProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const invalid = Boolean(message);
  const hintId = \`\${baseId}-hint\`;
  const errorId = \`\${baseId}-error\`;
  const selected = items.find((item) => item.value === value);
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number): void {
    const item = items[index];
    if (!item) return;
    onSelect?.(item.value);
    setActiveIndex(index);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        // undefined, not false: aria-invalid="false" is legal but noisier than
        // omitting the attribute, and every styling hook here keys off presence.
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? \`\${hintId} \${errorId}\` : hintId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-600 aria-[invalid=true]:shadow-[inset_0_0_0_1px_#dc2626] aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[invalid=true]:border-red-400 dark:aria-[invalid=true]:shadow-[inset_0_0_0_1px_#f87171] dark:aria-[invalid=true]:focus-visible:ring-red-400"
      >
        <span className={selected ? '' : 'text-gray-500 dark:text-gray-400'}>
          {selected ? selected.label : 'Choose a country…'}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={item.value === value}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                {item.label}
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={hintId}>
        Sets the tax rate on your invoices.
      </p>
      {invalid ? (
        // No role="alert": the control already describes this text, so an alert
        // would announce it a second time on every focus.
        <p
          className="mt-1 flex items-start gap-1.5 text-xs font-medium text-red-700 dark:text-red-300"
          id={errorId}
        >
          <svg
            className="mt-px h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {message}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-chips',
    category: 'forms',
    tags: ['multiselect', 'chips', 'tags', 'listbox', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 2210, copies: 596, downloads: 161 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  The structural trap in this pattern: a chip needs a remove button, and a
  button cannot live inside a button. So the control is a DIV that looks like a
  field - the chips and the popup toggle are siblings inside it, not children of
  one another.

  That gives every chip its own tab stop, which is the point. "Remove React" is
  a real, reachable action; the alternative is reopening the popup and hunting
  for a row to untick.

  Two other things worth copying:
  - The popup carries aria-multiselectable="true". Without it a screen reader
    announces a single-select listbox and the user has no reason to expect a
    second pick to stick.
  - Picking does NOT close the popup. It is multi-select; closing after every
    tick would make choosing four things cost four round trips.
-->
<div class="mchips">
  <span class="mchips__label" id="mchips-label">Skills</span>
  <div class="mchips__control">
    <span class="mchips__chip">
      React
      <button class="mchips__remove" type="button" aria-label="Remove React">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </span>
    <span class="mchips__chip">
      TypeScript
      <button class="mchips__remove" type="button" aria-label="Remove TypeScript">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </span>
    <button
      class="mchips__toggle"
      id="mchips-toggle"
      type="button"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-controls="mchips-listbox"
      aria-labelledby="mchips-label mchips-toggle"
    >
      <span class="mchips__placeholder">Add a skill…</span>
      <svg class="mchips__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
    </button>
  </div>
  <ul class="mchips__listbox" id="mchips-listbox" role="listbox" aria-multiselectable="true" aria-labelledby="mchips-label" tabindex="-1" hidden>
    <li class="mchips__option" id="mchips-opt-react" role="option" data-value="React" aria-selected="true"><span class="mchips__marker" aria-hidden="true"></span><span class="mchips__box" aria-hidden="true"></span><span class="mchips__option-label">React</span></li>
    <li class="mchips__option" id="mchips-opt-ts" role="option" data-value="TypeScript" aria-selected="true"><span class="mchips__marker" aria-hidden="true"></span><span class="mchips__box" aria-hidden="true"></span><span class="mchips__option-label">TypeScript</span></li>
    <li class="mchips__option" id="mchips-opt-go" role="option" data-value="Go" aria-selected="false"><span class="mchips__marker" aria-hidden="true"></span><span class="mchips__box" aria-hidden="true"></span><span class="mchips__option-label">Go</span></li>
    <li class="mchips__option" id="mchips-opt-rust" role="option" data-value="Rust" aria-selected="false"><span class="mchips__marker" aria-hidden="true"></span><span class="mchips__box" aria-hidden="true"></span><span class="mchips__option-label">Rust</span></li>
    <li class="mchips__option" id="mchips-opt-sql" role="option" data-value="SQL" aria-selected="false"><span class="mchips__marker" aria-hidden="true"></span><span class="mchips__box" aria-hidden="true"></span><span class="mchips__option-label">SQL</span></li>
    <li class="mchips__option" id="mchips-opt-figma" role="option" data-value="Figma" aria-selected="false"><span class="mchips__marker" aria-hidden="true"></span><span class="mchips__box" aria-hidden="true"></span><span class="mchips__option-label">Figma</span></li>
  </ul>
</div>

<script>
  document.querySelectorAll('.mchips').forEach(function (root) {
    var toggle = root.querySelector('.mchips__toggle');
    var listbox = root.querySelector('.mchips__listbox');
    var control = root.querySelector('.mchips__control');
    var options = Array.prototype.slice.call(root.querySelectorAll('.mchips__option'));
    var active = 0;

    function paint() {
      options.forEach(function (option, index) {
        option.classList.toggle('mchips__option--active', index === active);
      });
      listbox.setAttribute('aria-activedescendant', options[active] ? options[active].id : '');
      if (options[active]) options[active].scrollIntoView({ block: 'nearest' });
    }

    function renderChips() {
      Array.prototype.slice.call(root.querySelectorAll('.mchips__chip')).forEach(function (chip) {
        chip.remove();
      });
      options
        .filter(function (o) { return o.getAttribute('aria-selected') === 'true'; })
        .forEach(function (option) {
          var value = option.dataset.value;
          var chip = document.createElement('span');
          chip.className = 'mchips__chip';
          chip.textContent = value;
          var remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'mchips__remove';
          remove.setAttribute('aria-label', 'Remove ' + value);
          remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>';
          remove.addEventListener('click', function () {
            option.setAttribute('aria-selected', 'false');
            renderChips();
            // Focus would land on <body> once this button is destroyed. Hand it
            // to the toggle so the next Tab continues from the right place.
            toggle.focus();
          });
          chip.appendChild(remove);
          control.insertBefore(chip, toggle);
        });
      toggle.querySelector('.mchips__placeholder').textContent =
        options.some(function (o) { return o.getAttribute('aria-selected') === 'true'; })
          ? 'Add a skill…'
          : 'Choose skills…';
    }

    function setOpen(open) {
      listbox.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) paint();
    }

    function toggleOption(index) {
      var option = options[index];
      if (!option) return;
      option.setAttribute('aria-selected', String(option.getAttribute('aria-selected') !== 'true'));
      renderChips();
      // The popup deliberately stays open - this is multi-select.
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    options.forEach(function (option, index) {
      option.addEventListener('click', function () { toggleOption(index); paint(); });
      option.addEventListener('mousemove', function () { active = index; paint(); });
    });

    toggle.addEventListener('keydown', function (event) {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      var key = event.key;
      if (!open) {
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (key === 'Escape') { event.preventDefault(); setOpen(false); toggle.focus(); return; }
      if (key === 'Enter' || key === ' ') { event.preventDefault(); toggleOption(active); return; }
      if (key === 'Tab') { setOpen(false); return; }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = options.length - 1;
      else return;
      event.preventDefault();
      active = (next + options.length) % options.length;
      paint();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.mchips {
  position: relative;
}

.mchips__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/*
 * A div dressed as a field. It must react to focus INSIDE it, not on it -
 * :focus-within is what keeps the box ringed while the real focus is on a chip
 * button or the toggle.
 */
.mchips__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
}

.mchips__control:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mchips__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.25rem 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background-color: #eff6ff;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 500;
}

.mchips__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.mchips__remove svg {
  width: 0.625rem;
  height: 0.625rem;
}

.mchips__remove:hover {
  background-color: rgba(30, 64, 175, 0.15);
}

.mchips__remove:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.mchips__toggle {
  display: flex;
  flex: 1;
  min-width: 6rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.25rem 0.25rem 0.25rem 0.375rem;
  border: 0;
  background: transparent;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

/* The control already draws the ring via :focus-within - a second one here
   would double up. */
.mchips__toggle:focus-visible {
  outline: none;
}

.mchips__placeholder {
  color: #6b7280;
}

.mchips__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.mchips__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mchips__listbox:focus {
  outline: none;
}

.mchips__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.mchips__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.mchips__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.mchips__option--active .mchips__marker {
  background-color: #2563eb;
}

/*
 * A drawn checkbox, not a real one - a real <input> inside role="option" would
 * put a second interactive node in a place the listbox pattern says has none.
 * It is aria-hidden; aria-selected is what actually carries the state.
 */
.mchips__box {
  position: relative;
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  border: 1px solid #9ca3af;
  border-radius: 0.25rem;
}

.mchips__option[aria-selected='true'] .mchips__box {
  border-color: #2563eb;
  background-color: #2563eb;
}

.mchips__option[aria-selected='true'] .mchips__box::after {
  content: '';
  position: absolute;
  left: 0.25rem;
  top: 0.0625rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.mchips__option-label {
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .mchips__label {
    color: #d1d5db;
  }

  .mchips__control {
    border-color: #374151;
    background-color: #111827;
  }

  .mchips__control:focus-within {
    outline-color: #60a5fa;
  }

  /* #1e3a8a with #bfdbfe is 7.4:1 - the light chip's palette inverted rather
     than dimmed, because a translucent chip on #111827 loses its edge. */
  .mchips__chip {
    background-color: #1e3a8a;
    color: #bfdbfe;
  }

  .mchips__remove:hover {
    background-color: rgba(191, 219, 254, 0.2);
  }

  .mchips__remove:focus-visible {
    outline-color: #60a5fa;
  }

  .mchips__placeholder,
  .mchips__chevron {
    color: #9ca3af;
  }

  .mchips__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .mchips__option {
    color: #d1d5db;
  }

  .mchips__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .mchips__option--active .mchips__marker {
    background-color: #60a5fa;
  }

  .mchips__box {
    border-color: #6b7280;
  }

  .mchips__option[aria-selected='true'] .mchips__box {
    border-color: #3b82f6;
    background-color: #3b82f6;
  }
}`,
      tailwind: `<div class="relative">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="mchips-label">Skills</span>
  <div class="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
    <span class="inline-flex items-center gap-1 rounded-md bg-blue-50 py-0.5 pl-2 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      React
      <button type="button" aria-label="Remove React" class="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-blue-800/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-blue-200/20 dark:focus-visible:outline-blue-400">
        <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </span>
    <span class="inline-flex items-center gap-1 rounded-md bg-blue-50 py-0.5 pl-2 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      TypeScript
      <button type="button" aria-label="Remove TypeScript" class="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-blue-800/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-blue-200/20 dark:focus-visible:outline-blue-400">
        <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </span>
    <button
      id="mchips-toggle"
      type="button"
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-controls="mchips-listbox"
      aria-labelledby="mchips-label mchips-toggle"
      class="flex min-w-24 flex-1 items-center justify-between gap-2 rounded py-1 pl-1.5 pr-1 text-left text-sm focus-visible:outline-none"
    >
      <span class="text-gray-500 dark:text-gray-400">Add a skill…</span>
      <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
  </div>
  <ul
    id="mchips-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-labelledby="mchips-label"
    aria-activedescendant="mchips-opt-react"
    tabindex="-1"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="mchips-opt-react" role="option" aria-selected="true" class="group flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[0.25rem] border border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500" aria-hidden="true">
        <svg class="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7" /></svg>
      </span>
      <span class="flex-1">React</span>
    </li>
    <li id="mchips-opt-ts" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[0.25rem] border border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500" aria-hidden="true">
        <svg class="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7" /></svg>
      </span>
      <span class="flex-1">TypeScript</span>
    </li>
    <li id="mchips-opt-go" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="h-3.5 w-3.5 shrink-0 rounded-[0.25rem] border border-gray-400 dark:border-gray-500" aria-hidden="true"></span>
      <span class="flex-1">Go</span>
    </li>
    <li id="mchips-opt-rust" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="h-3.5 w-3.5 shrink-0 rounded-[0.25rem] border border-gray-400 dark:border-gray-500" aria-hidden="true"></span>
      <span class="flex-1">Rust</span>
    </li>
    <li id="mchips-opt-sql" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="h-3.5 w-3.5 shrink-0 rounded-[0.25rem] border border-gray-400 dark:border-gray-500" aria-hidden="true"></span>
      <span class="flex-1">SQL</span>
    </li>
    <li id="mchips-opt-figma" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="h-3.5 w-3.5 shrink-0 rounded-[0.25rem] border border-gray-400 dark:border-gray-500" aria-hidden="true"></span>
      <span class="flex-1">Figma</span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

function OptionBox({ checked }) {
  return (
    <span
      aria-hidden="true"
      className={\`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[0.25rem] border \${
        checked
          ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
          : 'border-gray-400 dark:border-gray-500'
      }\`}
    >
      {checked && (
        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 5 5L20 7" />
        </svg>
      )}
    </span>
  );
}

export function MultiselectChips({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  const optionId = (index) => \`\${baseId}-option-\${index}\`;
  const selected = items.filter((item) => value.includes(item.value));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next) {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id={\`\${baseId}-label\`}>
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 py-0.5 pl-2 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
            <button
              type="button"
              aria-label={\`Remove \${item.label}\`}
              disabled={disabled}
              onClick={() => {
                toggleValue(item.value);
                toggleRef.current?.focus();
              }}
              className="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-blue-800/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-blue-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <button
          ref={toggleRef}
          id={\`\${baseId}-toggle\`}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-labelledby={\`\${baseId}-label \${baseId}-toggle\`}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          className="flex min-w-24 flex-1 items-center justify-between gap-2 rounded py-1 pl-1.5 pr-1 text-left text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-gray-500 dark:text-gray-400">
            {selected.length ? 'Add a skill…' : 'Choose skills…'}
          </span>
          <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <OptionBox checked={checked} />
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectChipsProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

function OptionBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={\`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[0.25rem] border \${
        checked
          ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
          : 'border-gray-400 dark:border-gray-500'
      }\`}
    >
      {checked ? (
        <svg
          className="h-2.5 w-2.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 5 5L20 7" />
        </svg>
      ) : null}
    </span>
  );
}

export function MultiselectChips({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectChipsProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;
  const selected = items.filter((item) => value.includes(item.value));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 py-0.5 pl-2 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
            <button
              type="button"
              aria-label={\`Remove \${item.label}\`}
              disabled={disabled}
              onClick={() => {
                toggleValue(item.value);
                toggleRef.current?.focus();
              }}
              className="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-blue-800/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-blue-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <button
          ref={toggleRef}
          id={\`\${baseId}-toggle\`}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-labelledby={\`\${baseId}-label \${baseId}-toggle\`}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          className="flex min-w-24 flex-1 items-center justify-between gap-2 rounded py-1 pl-1.5 pr-1 text-left text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-gray-500 dark:text-gray-400">
            {selected.length ? 'Add a skill…' : 'Choose skills…'}
          </span>
          <svg
            className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <OptionBox checked={checked} />
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface MultiselectChipsProps {
  label: string;
  items: SelectItem[];
  /** Selected values. Controlled - the component owns no selection state. */
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * A drawn box, not an <input type="checkbox">. The listbox pattern says a
 * role="option" contains no interactive descendants, so a real checkbox here
 * would add a focusable node the pattern has nowhere to put. aria-selected on
 * the row is the state; this is its picture.
 */
function OptionBox({ checked }: { checked: boolean }): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={\`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[0.25rem] border \${
        checked
          ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
          : 'border-gray-400 dark:border-gray-500'
      }\`}
    >
      {checked ? (
        <svg
          className="h-2.5 w-2.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 5 5L20 7" />
        </svg>
      ) : null}
    </span>
  );
}

export function MultiselectChips({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectChipsProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;
  const selected = items.filter((item) => value.includes(item.value));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      // Enter ticks the row and leaves the popup open. Closing on every pick
      // would make four choices cost four round trips.
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      {/*
        A div dressed as a field, because the chips need their own buttons and a
        button cannot nest inside one. :focus-within keeps the box ringed while
        the real focus sits on a chip or the toggle.
      */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 py-0.5 pl-2 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
            <button
              type="button"
              // "Remove React", not "Remove" - every chip's button would
              // otherwise announce identically in a list of them.
              aria-label={\`Remove \${item.label}\`}
              disabled={disabled}
              onClick={() => {
                toggleValue(item.value);
                // This button is about to be unmounted. Hand focus over first,
                // or it falls to <body> and the next Tab restarts from the top.
                toggleRef.current?.focus();
              }}
              className="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-blue-800/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-blue-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <button
          ref={toggleRef}
          id={\`\${baseId}-toggle\`}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-labelledby={\`\${baseId}-label \${baseId}-toggle\`}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          className="flex min-w-24 flex-1 items-center justify-between gap-2 rounded py-1 pl-1.5 pr-1 text-left text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-gray-500 dark:text-gray-400">
            {selected.length ? 'Add a skill…' : 'Choose skills…'}
          </span>
          <svg
            className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          // Without this a screen reader announces a single-select listbox and
          // the user has no reason to expect the second pick to stick.
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <OptionBox checked={checked} />
                <span className="flex-1">{item.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-checkbox-list',
    category: 'forms',
    tags: ['multiselect', 'checkbox', 'fieldset', 'dropdown', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-14',
    updatedAt: '2026-07-06',
    license: 'MIT',
    version: '1.0.3',
    stats: { views: 1880, copies: 511, downloads: 134 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  Deliberately NOT a listbox. The popup is a <fieldset> of real checkboxes,
  which buys three things a role="listbox" cannot:

  - No aria-activedescendant, no arrow-key handler, no virtual focus. Tab and
    Space are the browser's, and they already work.
  - Every box posts itself in a form submission. No hidden inputs to sync.
  - "Checked"/"not checked" is announced by the platform, in the user's own
    words, with no aria-selected to keep in step.

  The cost is that Tab now walks every option rather than skipping the group -
  fine for eight rows, wrong for eighty. Past that, use the listbox
  (multiselect-chips) and pay for the keyboard handler.

  The toggle still needs aria-expanded: it is a disclosure, and a button whose
  popup state is invisible to a screen reader is a button that announces
  nothing when pressed.
-->
<div class="mcheck">
  <button
    class="mcheck__toggle"
    id="mcheck-toggle"
    type="button"
    aria-expanded="false"
    aria-controls="mcheck-panel"
  >
    <span class="mcheck__summary">Notifications: 2 selected</span>
    <svg class="mcheck__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <div class="mcheck__panel" id="mcheck-panel" hidden>
    <fieldset class="mcheck__fieldset">
      <legend class="mcheck__legend">Notify me about</legend>
      <label class="mcheck__row"><input class="mcheck__input" type="checkbox" name="notify" value="mentions" checked /><span>Mentions</span></label>
      <label class="mcheck__row"><input class="mcheck__input" type="checkbox" name="notify" value="replies" checked /><span>Replies</span></label>
      <label class="mcheck__row"><input class="mcheck__input" type="checkbox" name="notify" value="assignments" /><span>Assignments</span></label>
      <label class="mcheck__row"><input class="mcheck__input" type="checkbox" name="notify" value="deploys" /><span>Deploys</span></label>
      <label class="mcheck__row"><input class="mcheck__input" type="checkbox" name="notify" value="digest" /><span>Weekly digest</span></label>
      <label class="mcheck__row"><input class="mcheck__input" type="checkbox" name="notify" value="billing" /><span>Billing alerts</span></label>
    </fieldset>
  </div>
</div>

<script>
  document.querySelectorAll('.mcheck').forEach(function (root) {
    var toggle = root.querySelector('.mcheck__toggle');
    var panel = root.querySelector('.mcheck__panel');
    var summary = root.querySelector('.mcheck__summary');
    var inputs = Array.prototype.slice.call(root.querySelectorAll('.mcheck__input'));

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open && inputs[0]) inputs[0].focus();
    }

    function renderSummary() {
      var count = inputs.filter(function (i) { return i.checked; }).length;
      summary.textContent = 'Notifications: ' + (count === 0 ? 'none selected' : count + ' selected');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    inputs.forEach(function (input) {
      input.addEventListener('change', renderSummary);
    });

    // Escape from anywhere inside the popup, including from a checkbox - the
    // one key a disclosure must honour and the easiest one to forget.
    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggle.focus();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.mcheck {
  position: relative;
}

.mcheck__toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.mcheck__toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mcheck__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.mcheck__panel {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mcheck__fieldset {
  margin: 0;
  padding: 0.5rem;
  border: 0;
}

/*
 * The legend is the group's accessible name - it is what makes six loose
 * checkboxes one question. Visually it doubles as the panel heading, so it is
 * not hidden.
 */
.mcheck__legend {
  padding: 0 0.25rem 0.375rem;
  color: #6b7280;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mcheck__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.mcheck__row:hover {
  background-color: #f3f4f6;
}

/* The row highlights when the box inside it is focused, so the keyboard
   position is legible at row scale and not just at the 14px box. */
.mcheck__row:has(.mcheck__input:focus-visible) {
  background-color: #f3f4f6;
  box-shadow: inset 2px 0 0 #2563eb;
}

.mcheck__input {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  /* Paints the native tick in the brand colour and gives the popup the right
     scrollbar and control chrome per theme. */
  accent-color: #2563eb;
  cursor: pointer;
}

.mcheck__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .mcheck__toggle {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .mcheck__toggle:focus-visible {
    outline-color: #60a5fa;
  }

  .mcheck__chevron {
    color: #9ca3af;
  }

  .mcheck__panel {
    border-color: #374151;
    background-color: #111827;
    color-scheme: dark;
  }

  .mcheck__legend {
    color: #9ca3af;
  }

  .mcheck__row {
    color: #d1d5db;
  }

  .mcheck__row:hover,
  .mcheck__row:has(.mcheck__input:focus-visible) {
    background-color: #1f2937;
  }

  .mcheck__row:has(.mcheck__input:focus-visible) {
    box-shadow: inset 2px 0 0 #60a5fa;
  }

  .mcheck__input {
    accent-color: #3b82f6;
  }

  .mcheck__input:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <button
    id="mcheck-toggle"
    type="button"
    aria-expanded="true"
    aria-controls="mcheck-panel"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span>Notifications: 2 selected</span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <div
    id="mcheck-panel"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
  >
    <fieldset class="border-0 p-2">
      <legend class="px-1 pb-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Notify me about
      </legend>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" name="notify" value="mentions" checked class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Mentions</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" name="notify" value="replies" checked class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Replies</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" name="notify" value="assignments" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Assignments</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" name="notify" value="deploys" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Deploys</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" name="notify" value="digest" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Weekly digest</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" name="notify" value="billing" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Billing alerts</span>
      </label>
    </fieldset>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function MultiselectCheckboxList({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) firstInputRef.current?.focus();
  }, [open]);

  function toggleValue(next) {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={\`\${baseId}-panel\`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span>
          {label}: {value.length === 0 ? 'none selected' : \`\${value.length} selected\`}
        </span>
        <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          id={\`\${baseId}-panel\`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          <fieldset className="border-0 p-2">
            <legend className="px-1 pb-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {label}
            </legend>
            {items.map((item, index) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
              >
                <input
                  ref={index === 0 ? firstInputRef : undefined}
                  type="checkbox"
                  checked={value.includes(item.value)}
                  onChange={() => toggleValue(item.value)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectCheckboxListProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

export function MultiselectCheckboxList({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectCheckboxListProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) firstInputRef.current?.focus();
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={\`\${baseId}-panel\`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span>
          {label}: {value.length === 0 ? 'none selected' : \`\${value.length} selected\`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={\`\${baseId}-panel\`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          <fieldset className="border-0 p-2">
            <legend className="px-1 pb-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {label}
            </legend>
            {items.map((item, index) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
              >
                <input
                  ref={index === 0 ? firstInputRef : undefined}
                  type="checkbox"
                  checked={value.includes(item.value)}
                  onChange={() => toggleValue(item.value)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface MultiselectCheckboxListProps {
  /** Names the fieldset and heads the summary: "Notifications: 2 selected". */
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * A disclosure over a checkbox group - pointedly NOT a listbox.
 *
 * Real <input type="checkbox"> means the browser owns Tab and Space, the
 * platform announces "checked" in the user's own words, and there is no
 * aria-selected to fall out of step with the visual tick. The whole
 * aria-activedescendant apparatus disappears.
 *
 * The trade: Tab walks every option instead of skipping the group. Fine at
 * eight rows, wrong at eighty - past that reach for the listbox and pay for the
 * keyboard handler.
 */
export function MultiselectCheckboxList({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectCheckboxListProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Real focus moves into the panel - there is no virtual cursor to stand in
  // for it, so the first box has to actually receive it.
  useEffect(() => {
    if (open) firstInputRef.current?.focus();
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      // On the wrapper, not the toggle: focus is inside the panel by then, so a
      // handler on the button would never see the key.
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        // A disclosure, not a listbox trigger - so aria-expanded without
        // aria-haspopup="listbox", which would promise a listbox that is not there.
        aria-expanded={open}
        aria-controls={\`\${baseId}-panel\`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {/* A count, not a list of names - the closed control has one line and
            six labels do not fit in it. */}
        <span>
          {label}: {value.length === 0 ? 'none selected' : \`\${value.length} selected\`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={\`\${baseId}-panel\`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          {/* fieldset + legend is what makes six loose checkboxes one question.
              Without it they announce as six unrelated controls. */}
          <fieldset className="border-0 p-2">
            <legend className="px-1 pb-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {label}
            </legend>
            {items.map((item, index) => (
              // The <label> wraps the input, so the whole row is the hit target
              // and no htmlFor/id pairing can rot.
              <label
                key={item.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
              >
                <input
                  ref={index === 0 ? firstInputRef : undefined}
                  type="checkbox"
                  checked={value.includes(item.value)}
                  onChange={() => toggleValue(item.value)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-inline-tags',
    category: 'forms',
    tags: ['multiselect', 'tags', 'backspace', 'keyboard', 'listbox'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-19',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1420, copies: 367, downloads: 94 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  Tags live INSIDE the trigger, not beside it. That is the whole difference from
  multiselect-chips, and it is a real one: the tags here are plain text with no
  remove buttons, so the trigger stays a single button and a single tab stop.

  Removal is Backspace, the way every tag field since the first one has worked -
  and the reason the tags can afford to have no buttons at all. Two guards make
  it safe:

  - Backspace only fires while the popup is CLOSED. Open, it belongs to the list.
  - Every removal is announced through a live region. A destructive key with no
    feedback is a key that quietly eats work - the tag vanished from the screen,
    and a screen-reader user has no idea which one.

  Untick a row in the popup and the tag goes too; Backspace is the shortcut, not
  the only route.
-->
<div class="mtags">
  <span class="mtags__label" id="mtags-label">Labels</span>
  <button
    class="mtags__trigger"
    id="mtags-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="mtags-listbox"
    aria-labelledby="mtags-label mtags-trigger"
    aria-describedby="mtags-hint"
  >
    <span class="mtags__tags">
      <span class="mtags__tag">bug</span>
      <span class="mtags__tag">regression</span>
      <span class="mtags__tag">p1</span>
    </span>
    <svg class="mtags__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <p class="mtags__hint" id="mtags-hint">Press Backspace to remove the last label.</p>
  <ul class="mtags__listbox" id="mtags-listbox" role="listbox" aria-multiselectable="true" aria-labelledby="mtags-label" tabindex="-1" hidden>
    <li class="mtags__option" id="mtags-opt-bug" role="option" data-value="bug" aria-selected="true"><span class="mtags__marker" aria-hidden="true"></span><span class="mtags__option-label">bug</span></li>
    <li class="mtags__option" id="mtags-opt-regression" role="option" data-value="regression" aria-selected="true"><span class="mtags__marker" aria-hidden="true"></span><span class="mtags__option-label">regression</span></li>
    <li class="mtags__option" id="mtags-opt-p1" role="option" data-value="p1" aria-selected="true"><span class="mtags__marker" aria-hidden="true"></span><span class="mtags__option-label">p1</span></li>
    <li class="mtags__option" id="mtags-opt-docs" role="option" data-value="docs" aria-selected="false"><span class="mtags__marker" aria-hidden="true"></span><span class="mtags__option-label">docs</span></li>
    <li class="mtags__option" id="mtags-opt-good-first" role="option" data-value="good first issue" aria-selected="false"><span class="mtags__marker" aria-hidden="true"></span><span class="mtags__option-label">good first issue</span></li>
    <li class="mtags__option" id="mtags-opt-wontfix" role="option" data-value="wontfix" aria-selected="false"><span class="mtags__marker" aria-hidden="true"></span><span class="mtags__option-label">wontfix</span></li>
  </ul>
  <!--
    polite, not assertive: removing a tag is the user's own deliberate act, so
    it should queue behind whatever is speaking rather than interrupt it.
  -->
  <p class="mtags__live" role="status" aria-live="polite"></p>
</div>

<script>
  document.querySelectorAll('.mtags').forEach(function (root) {
    var trigger = root.querySelector('.mtags__trigger');
    var listbox = root.querySelector('.mtags__listbox');
    var tagsSlot = root.querySelector('.mtags__tags');
    var live = root.querySelector('.mtags__live');
    var options = Array.prototype.slice.call(root.querySelectorAll('.mtags__option'));
    var active = 0;

    function selectedOptions() {
      return options.filter(function (o) { return o.getAttribute('aria-selected') === 'true'; });
    }

    function paint() {
      options.forEach(function (option, index) {
        option.classList.toggle('mtags__option--active', index === active);
      });
      listbox.setAttribute('aria-activedescendant', options[active] ? options[active].id : '');
    }

    function renderTags() {
      var chosen = selectedOptions();
      tagsSlot.innerHTML = '';
      if (!chosen.length) {
        var empty = document.createElement('span');
        empty.className = 'mtags__placeholder';
        empty.textContent = 'Add labels…';
        tagsSlot.appendChild(empty);
        return;
      }
      chosen.forEach(function (option) {
        var tag = document.createElement('span');
        tag.className = 'mtags__tag';
        tag.textContent = option.dataset.value;
        tagsSlot.appendChild(tag);
      });
    }

    function setOpen(open) {
      listbox.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) paint();
    }

    function toggleOption(index) {
      var option = options[index];
      if (!option) return;
      option.setAttribute('aria-selected', String(option.getAttribute('aria-selected') !== 'true'));
      renderTags();
    }

    function removeLast() {
      var chosen = selectedOptions();
      var last = chosen[chosen.length - 1];
      if (!last) return;
      last.setAttribute('aria-selected', 'false');
      renderTags();
      live.textContent = last.dataset.value + ' removed. ' + selectedOptions().length + ' labels remaining.';
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    options.forEach(function (option, index) {
      option.addEventListener('click', function () { toggleOption(index); paint(); });
      option.addEventListener('mousemove', function () { active = index; paint(); });
    });

    trigger.addEventListener('keydown', function (event) {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      var key = event.key;

      if (!open) {
        // Backspace lives here and only here - with the list open it belongs to
        // the list, and eating tags from under an open popup is chaos.
        if (key === 'Backspace') { event.preventDefault(); removeLast(); return; }
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (key === 'Escape') { event.preventDefault(); setOpen(false); trigger.focus(); return; }
      if (key === 'Enter' || key === ' ') { event.preventDefault(); toggleOption(active); return; }
      if (key === 'Tab') { setOpen(false); return; }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = options.length - 1;
      else return;
      event.preventDefault();
      active = (next + options.length) % options.length;
      paint();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.mtags {
  position: relative;
}

.mtags__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.mtags__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 2.375rem;
  padding: 0.3125rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.mtags__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mtags__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mtags__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
}

/*
 * A span, not a button. The tags are inert text inside the trigger - which is
 * what lets the whole control stay one tab stop. Backspace is the affordance
 * that replaces the missing × .
 */
.mtags__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.0625rem 0.375rem;
  border-radius: 0.25rem;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
}

.mtags__placeholder {
  color: #6b7280;
}

.mtags__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.mtags__hint {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.mtags__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mtags__listbox:focus {
  outline: none;
}

.mtags__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.mtags__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.mtags__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.mtags__option--active .mtags__marker {
  background-color: #2563eb;
}

/* A chosen row gets a tick appended in ::after - content, not just colour. */
.mtags__option[aria-selected='true'] .mtags__option-label::after {
  content: ' ✓';
  color: #2563eb;
  font-weight: 700;
}

.mtags__option-label {
  flex: 1;
}

/*
 * Visually hidden, still announced. display:none or visibility:hidden would
 * take it out of the accessibility tree and the live region would never speak.
 */
.mtags__live {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-color-scheme: dark) {
  .mtags__label {
    color: #d1d5db;
  }

  .mtags__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .mtags__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .mtags__tag {
    background-color: #374151;
    color: #e5e7eb;
  }

  .mtags__placeholder,
  .mtags__chevron,
  .mtags__hint {
    color: #9ca3af;
  }

  .mtags__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .mtags__option {
    color: #d1d5db;
  }

  .mtags__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .mtags__option--active .mtags__marker {
    background-color: #60a5fa;
  }

  .mtags__option[aria-selected='true'] .mtags__option-label::after {
    color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="mtags-label">Labels</span>
  <button
    id="mtags-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="true"
    aria-controls="mtags-listbox"
    aria-labelledby="mtags-label mtags-trigger"
    aria-describedby="mtags-hint"
    class="flex min-h-[2.375rem] w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-2 py-[0.3125rem] text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span class="flex min-w-0 flex-wrap items-center gap-1">
      <span class="inline-flex items-center rounded px-1.5 py-px text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">bug</span>
      <span class="inline-flex items-center rounded px-1.5 py-px text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">regression</span>
      <span class="inline-flex items-center rounded px-1.5 py-px text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">p1</span>
    </span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id="mtags-hint">Press Backspace to remove the last label.</p>
  <ul
    id="mtags-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-labelledby="mtags-label"
    aria-activedescendant="mtags-opt-bug"
    tabindex="-1"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="mtags-opt-bug" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="flex-1">bug</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mtags-opt-regression" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">regression</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mtags-opt-p1" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">p1</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mtags-opt-docs" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">docs</span>
    </li>
    <li id="mtags-opt-good-first" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">good first issue</span>
    </li>
    <li id="mtags-opt-wontfix" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">wontfix</span>
    </li>
  </ul>
  <p class="sr-only" role="status" aria-live="polite">p1 removed. 2 labels remaining.</p>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function MultiselectInlineTags({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const optionId = (index) => \`\${baseId}-option-\${index}\`;
  const selected = items.filter((item) => value.includes(item.value));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next) {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function removeLast() {
    const last = value[value.length - 1];
    if (last === undefined) return;
    const item = items.find((i) => i.value === last);
    onSelect?.(value.slice(0, -1));
    setAnnouncement(\`\${item?.label ?? last} removed. \${value.length - 1} labels remaining.\`);
  }

  function onKeyDown(event) {
    if (!open) {
      if (event.key === 'Backspace') {
        event.preventDefault();
        removeLast();
        return;
      }
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id={\`\${baseId}-label\`}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        aria-describedby={\`\${baseId}-hint\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex min-h-[2.375rem] w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-2 py-[0.3125rem] text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="flex min-w-0 flex-wrap items-center gap-1">
          {selected.length ? (
            selected.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center rounded bg-gray-100 px-1.5 py-px text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {item.label}
              </span>
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Add labels…</span>
          )}
        </span>
        <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-hint\`}>
        Press Backspace to remove the last label.
      </p>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                {checked && (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectInlineTagsProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

export function MultiselectInlineTags({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectInlineTagsProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;
  const selected = items.filter((item) => value.includes(item.value));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function removeLast(): void {
    const last = value[value.length - 1];
    if (last === undefined) return;
    const item = items.find((i) => i.value === last);
    onSelect?.(value.slice(0, -1));
    setAnnouncement(\`\${item?.label ?? last} removed. \${value.length - 1} labels remaining.\`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (event.key === 'Backspace') {
        event.preventDefault();
        removeLast();
        return;
      }
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        aria-describedby={\`\${baseId}-hint\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex min-h-[2.375rem] w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-2 py-[0.3125rem] text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="flex min-w-0 flex-wrap items-center gap-1">
          {selected.length ? (
            selected.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center rounded bg-gray-100 px-1.5 py-px text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {item.label}
              </span>
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Add labels…</span>
          )}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-hint\`}>
        Press Backspace to remove the last label.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                {checked ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface MultiselectInlineTagsProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * Tags render INSIDE the trigger as inert text - no × buttons - which is what
 * keeps the whole control a single tab stop. Backspace is the affordance that
 * replaces them, and the hint below says so, because an invisible shortcut is
 * not an affordance at all.
 */
export function MultiselectInlineTags({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectInlineTagsProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;
  const selected = items.filter((item) => value.includes(item.value));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function removeLast(): void {
    const last = value[value.length - 1];
    if (last === undefined) return;
    const item = items.find((i) => i.value === last);
    onSelect?.(value.slice(0, -1));
    // Backspace destroys work silently otherwise: the tag leaves the screen and
    // a screen-reader user never learns which one went.
    setAnnouncement(\`\${item?.label ?? last} removed. \${value.length - 1} labels remaining.\`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      // Backspace is bound only while the popup is CLOSED. Open, the key
      // belongs to the list, and eating tags from under it is chaos.
      if (event.key === 'Backspace') {
        event.preventDefault();
        removeLast();
        return;
      }
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        // The trigger's own text is the tag list, so it doubles as the value.
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        aria-describedby={\`\${baseId}-hint\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex min-h-[2.375rem] w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-2 py-[0.3125rem] text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className="flex min-w-0 flex-wrap items-center gap-1">
          {selected.length ? (
            selected.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center rounded bg-gray-100 px-1.5 py-px text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {item.label}
              </span>
            ))
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Add labels…</span>
          )}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-hint\`}>
        Press Backspace to remove the last label.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                {/* A tick, not just a tint - the mark survives greyscale. */}
                {checked ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
      {/* polite: removal is the user's own act, so it queues rather than
          interrupts. sr-only, never display:none - hidden text is not announced. */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-limit',
    category: 'forms',
    tags: ['multiselect', 'limit', 'aria-disabled', 'listbox', 'live-region'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-26',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 980, copies: 241, downloads: 63 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'count', type: 'number', default: '3', descriptionKey: 'count' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  A cap of three. The interesting decisions are all about what happens AT the
  cap, and every one of them is a rule about not lying to the user:

  - Capped rows get aria-disabled="true", NOT the disabled attribute and not
    removal from the list. They stay reachable by arrow key and still announce
    themselves, so the user can read what they are missing and understand why.
    A row that vanishes at the cap is a row the user thinks they imagined.
  - The reason is stated, not implied. "3 of 3 chosen - remove one to add
    another" is wired via aria-describedby AND spoken through a live region the
    moment the cap is reached.
  - Rows already chosen never disable. Untick has to keep working at the cap, or
    the control becomes a trap.
-->
<div class="mlimit">
  <span class="mlimit__label" id="mlimit-label">Focus areas</span>
  <button
    class="mlimit__trigger"
    id="mlimit-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="mlimit-listbox"
    aria-labelledby="mlimit-label mlimit-trigger"
    aria-describedby="mlimit-status"
  >
    <span class="mlimit__value">Performance, Accessibility, Security</span>
    <svg class="mlimit__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <p class="mlimit__status mlimit__status--full" id="mlimit-status" role="status" aria-live="polite">
    3 of 3 chosen - remove one to add another.
  </p>
  <ul class="mlimit__listbox" id="mlimit-listbox" role="listbox" aria-multiselectable="true" aria-labelledby="mlimit-label" tabindex="-1" hidden>
    <li class="mlimit__option" id="mlimit-opt-perf" role="option" data-value="Performance" aria-selected="true"><span class="mlimit__marker" aria-hidden="true"></span><span class="mlimit__option-label">Performance</span><span class="mlimit__tick" aria-hidden="true">✓</span></li>
    <li class="mlimit__option" id="mlimit-opt-a11y" role="option" data-value="Accessibility" aria-selected="true"><span class="mlimit__marker" aria-hidden="true"></span><span class="mlimit__option-label">Accessibility</span><span class="mlimit__tick" aria-hidden="true">✓</span></li>
    <li class="mlimit__option" id="mlimit-opt-sec" role="option" data-value="Security" aria-selected="true"><span class="mlimit__marker" aria-hidden="true"></span><span class="mlimit__option-label">Security</span><span class="mlimit__tick" aria-hidden="true">✓</span></li>
    <li class="mlimit__option" id="mlimit-opt-dx" role="option" data-value="Developer experience" aria-selected="false" aria-disabled="true"><span class="mlimit__marker" aria-hidden="true"></span><span class="mlimit__option-label">Developer experience</span><span class="mlimit__tick" aria-hidden="true">✓</span></li>
    <li class="mlimit__option" id="mlimit-opt-seo" role="option" data-value="SEO" aria-selected="false" aria-disabled="true"><span class="mlimit__marker" aria-hidden="true"></span><span class="mlimit__option-label">SEO</span><span class="mlimit__tick" aria-hidden="true">✓</span></li>
    <li class="mlimit__option" id="mlimit-opt-i18n" role="option" data-value="Internationalisation" aria-selected="false" aria-disabled="true"><span class="mlimit__marker" aria-hidden="true"></span><span class="mlimit__option-label">Internationalisation</span><span class="mlimit__tick" aria-hidden="true">✓</span></li>
  </ul>
</div>

<script>
  document.querySelectorAll('.mlimit').forEach(function (root) {
    var LIMIT = 3;
    var trigger = root.querySelector('.mlimit__trigger');
    var listbox = root.querySelector('.mlimit__listbox');
    var valueEl = root.querySelector('.mlimit__value');
    var status = root.querySelector('.mlimit__status');
    var options = Array.prototype.slice.call(root.querySelectorAll('.mlimit__option'));
    var active = 0;

    function chosen() {
      return options.filter(function (o) { return o.getAttribute('aria-selected') === 'true'; });
    }

    function render() {
      var picked = chosen();
      var full = picked.length >= LIMIT;

      options.forEach(function (option) {
        var isSelected = option.getAttribute('aria-selected') === 'true';
        // Selected rows NEVER disable - untick has to keep working at the cap
        // or the control is a trap.
        if (full && !isSelected) option.setAttribute('aria-disabled', 'true');
        else option.removeAttribute('aria-disabled');
      });

      valueEl.textContent = picked.length
        ? picked.map(function (o) { return o.dataset.value; }).join(', ')
        : 'Choose up to 3…';
      valueEl.classList.toggle('mlimit__value--empty', picked.length === 0);

      status.textContent = full
        ? LIMIT + ' of ' + LIMIT + ' chosen - remove one to add another.'
        : picked.length + ' of ' + LIMIT + ' chosen.';
      status.classList.toggle('mlimit__status--full', full);
    }

    function paint() {
      options.forEach(function (option, index) {
        option.classList.toggle('mlimit__option--active', index === active);
      });
      listbox.setAttribute('aria-activedescendant', options[active] ? options[active].id : '');
      if (options[active]) options[active].scrollIntoView({ block: 'nearest' });
    }

    function setOpen(open) {
      listbox.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) paint();
    }

    function toggleOption(index) {
      var option = options[index];
      // aria-disabled is advisory - the browser will still deliver the click,
      // so the guard has to be enforced here in code.
      if (!option || option.getAttribute('aria-disabled') === 'true') return;
      option.setAttribute('aria-selected', String(option.getAttribute('aria-selected') !== 'true'));
      render();
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    options.forEach(function (option, index) {
      option.addEventListener('click', function () { toggleOption(index); paint(); });
      option.addEventListener('mousemove', function () { active = index; paint(); });
    });

    trigger.addEventListener('keydown', function (event) {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      var key = event.key;
      if (!open) {
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (key === 'Escape') { event.preventDefault(); setOpen(false); trigger.focus(); return; }
      if (key === 'Enter' || key === ' ') { event.preventDefault(); toggleOption(active); return; }
      if (key === 'Tab') { setOpen(false); return; }

      var next = active;
      // Arrowing crosses disabled rows rather than skipping them: the user is
      // entitled to read what the cap is costing them.
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = options.length - 1;
      else return;
      event.preventDefault();
      active = (next + options.length) % options.length;
      paint();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });

    render();
  });
</script>`,
      css: `.mlimit {
  position: relative;
}

.mlimit__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.mlimit__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.mlimit__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mlimit__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mlimit__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mlimit__value--empty {
  color: #6b7280;
}

.mlimit__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.mlimit__status {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

/* At the cap the status stops being a counter and starts being an instruction,
   so it earns weight and colour. Amber, not red - nothing is wrong. */
.mlimit__status--full {
  color: #92400e;
  font-weight: 500;
}

.mlimit__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mlimit__listbox:focus {
  outline: none;
}

.mlimit__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.mlimit__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.mlimit__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.mlimit__option--active .mlimit__marker {
  background-color: #2563eb;
}

/*
 * Dimmed but readable. This is the point of aria-disabled over the disabled
 * attribute - the row is still reachable, still announced, still legible. Note
 * opacity stays at 0.6 rather than 0.4: the user has to be able to READ what
 * the cap is costing them.
 */
.mlimit__option[aria-disabled='true'] {
  opacity: 0.6;
  cursor: not-allowed;
}

.mlimit__tick {
  color: #2563eb;
  font-weight: 700;
  visibility: hidden;
}

.mlimit__option[aria-selected='true'] .mlimit__tick {
  visibility: visible;
}

.mlimit__option-label {
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .mlimit__label {
    color: #d1d5db;
  }

  .mlimit__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .mlimit__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .mlimit__value--empty,
  .mlimit__chevron,
  .mlimit__status {
    color: #9ca3af;
  }

  /* #92400e is 2.4:1 on #111827 - unusable. #fcd34d clears 9:1. */
  .mlimit__status--full {
    color: #fcd34d;
  }

  .mlimit__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .mlimit__option {
    color: #d1d5db;
  }

  .mlimit__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .mlimit__option--active .mlimit__marker {
    background-color: #60a5fa;
  }

  .mlimit__tick {
    color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <span class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="mlimit-label">Focus areas</span>
  <button
    id="mlimit-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="true"
    aria-controls="mlimit-listbox"
    aria-labelledby="mlimit-label mlimit-trigger"
    aria-describedby="mlimit-status"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span class="truncate">Performance, Accessibility, Security</span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <p class="mt-1.5 text-xs font-medium text-amber-800 dark:text-amber-300" id="mlimit-status" role="status" aria-live="polite">
    3 of 3 chosen - remove one to add another.
  </p>
  <ul
    id="mlimit-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-labelledby="mlimit-label"
    aria-activedescendant="mlimit-opt-perf"
    tabindex="-1"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="mlimit-opt-perf" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="flex-1">Performance</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mlimit-opt-a11y" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Accessibility</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mlimit-opt-sec" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Security</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mlimit-opt-dx" role="option" aria-selected="false" aria-disabled="true" class="flex cursor-not-allowed items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 opacity-60 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Developer experience</span>
    </li>
    <li id="mlimit-opt-seo" role="option" aria-selected="false" aria-disabled="true" class="flex cursor-not-allowed items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 opacity-60 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">SEO</span>
    </li>
    <li id="mlimit-opt-i18n" role="option" aria-selected="false" aria-disabled="true" class="flex cursor-not-allowed items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 opacity-60 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Internationalisation</span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function MultiselectLimit({ label, items, value, count = 3, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const full = value.length >= count;
  const optionId = (index) => \`\${baseId}-option-\${index}\`;
  const selectedLabels = items.filter((i) => value.includes(i.value)).map((i) => i.label);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function isCapped(itemValue) {
    return full && !value.includes(itemValue);
  }

  function toggleValue(next) {
    if (isCapped(next)) return;
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id={\`\${baseId}-label\`}>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        aria-describedby={\`\${baseId}-status\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={\`truncate \${selectedLabels.length ? '' : 'text-gray-500 dark:text-gray-400'}\`}>
          {selectedLabels.length ? selectedLabels.join(', ') : \`Choose up to \${count}…\`}
        </span>
        <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
        className={\`mt-1.5 text-xs \${
          full ? 'font-medium text-amber-800 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'
        }\`}
      >
        {full
          ? \`\${count} of \${count} chosen - remove one to add another.\`
          : \`\${value.length} of \${count} chosen.\`}
      </p>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            const capped = isCapped(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                aria-disabled={capped || undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  capped ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                {checked && (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectLimitProps {
  label: string;
  items: SelectItem[];
  value: string[];
  /** Maximum selections. */
  count?: number;
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

export function MultiselectLimit({
  label,
  items,
  value,
  count = 3,
  onSelect,
  disabled = false,
}: MultiselectLimitProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const full = value.length >= count;
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;
  const selectedLabels = items.filter((i) => value.includes(i.value)).map((i) => i.label);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function isCapped(itemValue: string): boolean {
    return full && !value.includes(itemValue);
  }

  function toggleValue(next: string): void {
    if (isCapped(next)) return;
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        aria-describedby={\`\${baseId}-status\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={\`truncate \${selectedLabels.length ? '' : 'text-gray-500 dark:text-gray-400'}\`}>
          {selectedLabels.length ? selectedLabels.join(', ') : \`Choose up to \${count}…\`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
        className={\`mt-1.5 text-xs \${
          full ? 'font-medium text-amber-800 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'
        }\`}
      >
        {full
          ? \`\${count} of \${count} chosen - remove one to add another.\`
          : \`\${value.length} of \${count} chosen.\`}
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            const capped = isCapped(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                aria-disabled={capped || undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  capped ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                {checked ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface MultiselectLimitProps {
  label: string;
  items: SelectItem[];
  value: string[];
  /** Maximum number of selections. Rows beyond it go aria-disabled, not away. */
  count?: number;
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

export function MultiselectLimit({
  label,
  items,
  value,
  count = 3,
  onSelect,
  disabled = false,
}: MultiselectLimitProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const full = value.length >= count;
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;
  const selectedLabels = items.filter((i) => value.includes(i.value)).map((i) => i.label);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  /** Capped, not disabled: an already-chosen row must always stay untickable
   *  or the cap becomes a trap the user cannot back out of. */
  function isCapped(itemValue: string): boolean {
    return full && !value.includes(itemValue);
  }

  function toggleValue(next: string): void {
    // aria-disabled is advisory - the browser still delivers the click, so the
    // guard has to live in code as well as in the attribute.
    if (isCapped(next)) return;
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[activeIndex];
        if (item) toggleValue(item.value);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      // Arrowing crosses capped rows rather than skipping them - the user is
      // entitled to read what the limit is costing them.
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <span
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        id={\`\${baseId}-label\`}
      >
        {label}
      </span>
      <button
        ref={triggerRef}
        id={\`\${baseId}-trigger\`}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-labelledby={\`\${baseId}-label \${baseId}-trigger\`}
        // The status is described by the control, so the rule is read out with
        // the field rather than sitting there as unannounced small print.
        aria-describedby={\`\${baseId}-status\`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span className={\`truncate \${selectedLabels.length ? '' : 'text-gray-500 dark:text-gray-400'}\`}>
          {selectedLabels.length ? selectedLabels.join(', ') : \`Choose up to \${count}…\`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {/*
        Doubles as the describedby target and a live region, so hitting the cap
        is announced the moment it happens rather than only on the next focus.
        The text states the remedy - "remove one to add another" - because
        "maximum reached" tells the user they are stuck without telling them how
        to get unstuck.
      */}
      <p
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
        className={\`mt-1.5 text-xs \${
          full ? 'font-medium text-amber-800 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'
        }\`}
      >
        {full
          ? \`\${count} of \${count} chosen - remove one to add another.\`
          : \`\${value.length} of \${count} chosen.\`}
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={\`\${baseId}-label\`}
          aria-activedescendant={optionId(activeIndex)}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const checked = value.includes(item.value);
            const capped = isCapped(item.value);
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                // aria-disabled, never the disabled attribute: the row stays
                // reachable and readable. A row that vanishes at the cap is a
                // row the user thinks they imagined.
                aria-disabled={capped || undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => toggleValue(item.value)}
                className={\`flex items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  capped ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                <span className="flex-1">{item.label}</span>
                {checked ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-grouped',
    category: 'forms',
    tags: ['multiselect', 'grouped', 'select-all', 'indeterminate', 'checkbox'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 640, copies: 148, downloads: 41 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'PermissionGroup[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  Grouped multi-select with a select-all per group. A listbox cannot do this:
  "Select all" is a control, and role="option" may not contain one. Real
  checkboxes in nested fieldsets can, so that is what this is.

  The part everyone gets wrong is the third state. A select-all box has three,
  not two - all, none, and SOME - and \`indeterminate\` is the only way to say
  the third. It is a DOM property, not an attribute: you cannot write it in
  markup, only set it from script (which is why the boxes below are wired up on
  load rather than marked up as mixed).

  Get it wrong and the box shows "unchecked" for a half-chosen group, so a
  screen-reader user hears "not checked", ticks it expecting no change, and
  silently grants four permissions they never asked for.

  Every fieldset's legend names its group, so each checkbox announces as
  "Billing, View invoices, checked" rather than a loose "View invoices" with no
  clue which of the three sections it belongs to.
-->
<div class="mgroup">
  <button class="mgroup__toggle" id="mgroup-toggle" type="button" aria-expanded="false" aria-controls="mgroup-panel">
    <span class="mgroup__summary">Permissions: 3 selected</span>
    <svg class="mgroup__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <div class="mgroup__panel" id="mgroup-panel" hidden>
    <fieldset class="mgroup__group" data-group="Billing">
      <legend class="mgroup__legend">Billing</legend>
      <label class="mgroup__row mgroup__row--all">
        <input class="mgroup__all" type="checkbox" aria-label="Select all Billing" />
        <span>Select all</span>
      </label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="billing:read" checked /><span>View invoices</span></label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="billing:write" /><span>Edit payment methods</span></label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="billing:refund" /><span>Issue refunds</span></label>
    </fieldset>
    <fieldset class="mgroup__group" data-group="Members">
      <legend class="mgroup__legend">Members</legend>
      <label class="mgroup__row mgroup__row--all">
        <input class="mgroup__all" type="checkbox" aria-label="Select all Members" />
        <span>Select all</span>
      </label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="members:read" checked /><span>View members</span></label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="members:invite" checked /><span>Invite members</span></label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="members:remove" /><span>Remove members</span></label>
    </fieldset>
    <fieldset class="mgroup__group" data-group="Projects">
      <legend class="mgroup__legend">Projects</legend>
      <label class="mgroup__row mgroup__row--all">
        <input class="mgroup__all" type="checkbox" aria-label="Select all Projects" />
        <span>Select all</span>
      </label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="projects:read" /><span>View projects</span></label>
      <label class="mgroup__row"><input class="mgroup__item" type="checkbox" value="projects:deploy" /><span>Deploy</span></label>
    </fieldset>
  </div>
</div>

<script>
  document.querySelectorAll('.mgroup').forEach(function (root) {
    var toggle = root.querySelector('.mgroup__toggle');
    var panel = root.querySelector('.mgroup__panel');
    var summary = root.querySelector('.mgroup__summary');
    var groups = Array.prototype.slice.call(root.querySelectorAll('.mgroup__group'));

    function syncGroup(group) {
      var all = group.querySelector('.mgroup__all');
      var items = Array.prototype.slice.call(group.querySelectorAll('.mgroup__item'));
      var checked = items.filter(function (i) { return i.checked; }).length;
      all.checked = checked === items.length;
      // The third state. Property only - there is no HTML attribute for it, so
      // it has to be set here every time the group changes.
      all.indeterminate = checked > 0 && checked < items.length;
    }

    function syncSummary() {
      var total = Array.prototype.slice.call(root.querySelectorAll('.mgroup__item'))
        .filter(function (i) { return i.checked; }).length;
      summary.textContent = 'Permissions: ' + (total === 0 ? 'none selected' : total + ' selected');
    }

    function syncAll() {
      groups.forEach(syncGroup);
      syncSummary();
    }

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    groups.forEach(function (group) {
      var all = group.querySelector('.mgroup__all');
      var items = Array.prototype.slice.call(group.querySelectorAll('.mgroup__item'));

      all.addEventListener('change', function () {
        // A half-chosen group resolves to "all", never to "none" - the user
        // clicked toward completion, not away from their own work.
        items.forEach(function (item) { item.checked = all.checked; });
        syncAll();
      });

      items.forEach(function (item) {
        item.addEventListener('change', syncAll);
      });
    });

    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggle.focus();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });

    syncAll();
  });
</script>`,
      css: `.mgroup {
  position: relative;
}

.mgroup__toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.mgroup__toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mgroup__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #6b7280;
}

.mgroup__panel {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 17rem;
  padding: 0.5rem;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mgroup__group {
  margin: 0;
  padding: 0;
  border: 0;
}

.mgroup__group + .mgroup__group {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f3f4f6;
}

.mgroup__legend {
  padding: 0 0.25rem 0.25rem;
  color: #6b7280;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mgroup__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3125rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.mgroup__row:hover {
  background-color: #f3f4f6;
}

.mgroup__row:has(input:focus-visible) {
  background-color: #f3f4f6;
  box-shadow: inset 2px 0 0 #2563eb;
}

/* The select-all row reads as a header for the rows below it, and the children
   indent under it - the hierarchy is spatial, not just semantic. */
.mgroup__row--all {
  font-weight: 600;
  color: #111827;
}

.mgroup__row:not(.mgroup__row--all) {
  padding-left: 1.25rem;
}

.mgroup__all,
.mgroup__item {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.mgroup__all:focus-visible,
.mgroup__item:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * The dash the browser paints for :indeterminate is the third state made
 * visible. It is a distinct SHAPE - not a tick, not empty - so "some" is
 * legible without colour and matches what the platform announces as "mixed".
 */
.mgroup__all:indeterminate {
  outline-offset: 1px;
}

@media (prefers-color-scheme: dark) {
  .mgroup__toggle {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .mgroup__toggle:focus-visible {
    outline-color: #60a5fa;
  }

  .mgroup__chevron {
    color: #9ca3af;
  }

  .mgroup__panel {
    border-color: #374151;
    background-color: #111827;
    color-scheme: dark;
  }

  .mgroup__group + .mgroup__group {
    border-top-color: #1f2937;
  }

  .mgroup__legend {
    color: #9ca3af;
  }

  .mgroup__row {
    color: #d1d5db;
  }

  .mgroup__row--all {
    color: #f9fafb;
  }

  .mgroup__row:hover,
  .mgroup__row:has(input:focus-visible) {
    background-color: #1f2937;
  }

  .mgroup__row:has(input:focus-visible) {
    box-shadow: inset 2px 0 0 #60a5fa;
  }

  .mgroup__all,
  .mgroup__item {
    accent-color: #3b82f6;
  }

  .mgroup__all:focus-visible,
  .mgroup__item:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <button
    id="mgroup-toggle"
    type="button"
    aria-expanded="true"
    aria-controls="mgroup-panel"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span>Permissions: 3 selected</span>
    <svg class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  </button>
  <div
    id="mgroup-panel"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-[17rem] overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
  >
    <fieldset class="border-0 p-0">
      <legend class="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Billing</legend>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-[0.3125rem] text-sm font-semibold text-gray-900 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-50 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" aria-label="Select all Billing" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Select all</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="billing:read" checked class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>View invoices</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="billing:write" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Edit payment methods</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="billing:refund" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Issue refunds</span>
      </label>
    </fieldset>
    <fieldset class="mt-2 border-0 border-t border-gray-100 p-0 pt-2 dark:border-gray-800">
      <legend class="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Members</legend>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-[0.3125rem] text-sm font-semibold text-gray-900 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-50 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" aria-label="Select all Members" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Select all</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="members:read" checked class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>View members</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="members:invite" checked class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Invite members</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="members:remove" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Remove members</span>
      </label>
    </fieldset>
    <fieldset class="mt-2 border-0 border-t border-gray-100 p-0 pt-2 dark:border-gray-800">
      <legend class="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Projects</legend>
      <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-[0.3125rem] text-sm font-semibold text-gray-900 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-50 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" aria-label="Select all Projects" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Select all</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="projects:read" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>View projects</span>
      </label>
      <label class="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
        <input type="checkbox" value="projects:deploy" class="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span>Deploy</span>
      </label>
    </fieldset>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

function SelectAllBox({ groupLabel, state, onToggle }) {
  const ref = useRef(null);

  // indeterminate has no HTML attribute - it is a DOM property, so React cannot
  // set it from JSX and it has to be written on every render.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = state === 'some';
  }, [state]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={state === 'all'}
      aria-label={\`Select all \${groupLabel}\`}
      onChange={onToggle}
      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
    />
  );
}

export function MultiselectGrouped({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function groupState(group) {
    const chosen = group.options.filter((option) => value.includes(option.value)).length;
    if (chosen === 0) return 'none';
    if (chosen === group.options.length) return 'all';
    return 'some';
  }

  function toggleGroup(group) {
    const values = group.options.map((option) => option.value);
    // 'some' resolves to all, never to none - the user clicked toward
    // completion, not away from their own work.
    const next = groupState(group) === 'all'
      ? value.filter((v) => !values.includes(v))
      : [...value, ...values.filter((v) => !value.includes(v))];
    onSelect?.(next);
  }

  function toggleValue(next) {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={\`\${baseId}-panel\`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span>
          {label}: {value.length === 0 ? 'none selected' : \`\${value.length} selected\`}
        </span>
        <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          id={\`\${baseId}-panel\`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-[17rem] overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          {items.map((group, index) => (
            <fieldset
              key={group.label}
              className={\`border-0 p-0 \${index > 0 ? 'mt-2 border-t border-gray-100 pt-2 dark:border-gray-800' : ''}\`}
            >
              <legend className="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {group.label}
              </legend>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-[0.3125rem] text-sm font-semibold text-gray-900 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-50 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
                <SelectAllBox
                  groupLabel={group.label}
                  state={groupState(group)}
                  onToggle={() => toggleGroup(group)}
                />
                <span>Select all</span>
              </label>
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => toggleValue(option.value)}
                    className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface GroupOption {
  value: string;
  label: string;
}

interface PermissionGroup {
  label: string;
  options: GroupOption[];
}

interface MultiselectGroupedProps {
  label: string;
  items: PermissionGroup[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

type GroupState = 'none' | 'some' | 'all';

function SelectAllBox({
  groupLabel,
  state,
  onToggle,
}: {
  groupLabel: string;
  state: GroupState;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = state === 'some';
  }, [state]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={state === 'all'}
      aria-label={\`Select all \${groupLabel}\`}
      onChange={onToggle}
      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
    />
  );
}

export function MultiselectGrouped({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectGroupedProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function groupState(group: PermissionGroup): GroupState {
    const chosen = group.options.filter((option) => value.includes(option.value)).length;
    if (chosen === 0) return 'none';
    if (chosen === group.options.length) return 'all';
    return 'some';
  }

  function toggleGroup(group: PermissionGroup): void {
    const values = group.options.map((option) => option.value);
    const next =
      groupState(group) === 'all'
        ? value.filter((v) => !values.includes(v))
        : [...value, ...values.filter((v) => !value.includes(v))];
    onSelect?.(next);
  }

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={\`\${baseId}-panel\`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span>
          {label}: {value.length === 0 ? 'none selected' : \`\${value.length} selected\`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={\`\${baseId}-panel\`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-[17rem] overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          {items.map((group, index) => (
            <fieldset
              key={group.label}
              className={\`border-0 p-0 \${
                index > 0 ? 'mt-2 border-t border-gray-100 pt-2 dark:border-gray-800' : ''
              }\`}
            >
              <legend className="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {group.label}
              </legend>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-[0.3125rem] text-sm font-semibold text-gray-900 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-50 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
                <SelectAllBox
                  groupLabel={group.label}
                  state={groupState(group)}
                  onToggle={() => toggleGroup(group)}
                />
                <span>Select all</span>
              </label>
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => toggleValue(option.value)}
                    className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';

export interface GroupOption {
  value: string;
  label: string;
}

export interface PermissionGroup {
  label: string;
  options: GroupOption[];
}

export interface MultiselectGroupedProps {
  label: string;
  items: PermissionGroup[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * A select-all box has THREE states, not two. Modelling it as a boolean is the
 * bug - 'some' is a state the type system should force you to handle.
 */
type GroupState = 'none' | 'some' | 'all';

function SelectAllBox({
  groupLabel,
  state,
  onToggle,
}: {
  groupLabel: string;
  state: GroupState;
  onToggle: () => void;
}): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);

  /**
   * \`indeterminate\` is a DOM property with no HTML attribute - there is no
   * \`indeterminate={...}\` for JSX to render, so it must be written imperatively
   * on every change.
   *
   * Skip this and a half-chosen group paints and announces as "not checked". A
   * screen-reader user then ticks it expecting nothing to change, and quietly
   * grants every permission in the group.
   */
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = state === 'some';
  }, [state]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={state === 'all'}
      // "Select all Billing", not "Select all" - three identical accessible
      // names in one panel are three coin flips. The visible text is still
      // contained in the name, so label-in-name holds.
      aria-label={\`Select all \${groupLabel}\`}
      onChange={onToggle}
      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
    />
  );
}

export function MultiselectGrouped({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectGroupedProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Derived, never stored. A cached group state is a group state that drifts
  // out of sync with the boxes it claims to summarise.
  function groupState(group: PermissionGroup): GroupState {
    const chosen = group.options.filter((option) => value.includes(option.value)).length;
    if (chosen === 0) return 'none';
    if (chosen === group.options.length) return 'all';
    return 'some';
  }

  function toggleGroup(group: PermissionGroup): void {
    const values = group.options.map((option) => option.value);
    // 'some' resolves to ALL, never to none: the user clicked toward
    // completion, not to throw away the picks they already made.
    const next =
      groupState(group) === 'all'
        ? value.filter((v) => !values.includes(v))
        : [...value, ...values.filter((v) => !value.includes(v))];
    onSelect?.(next);
  }

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={\`\${baseId}-panel\`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span>
          {label}: {value.length === 0 ? 'none selected' : \`\${value.length} selected\`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={\`\${baseId}-panel\`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-[17rem] overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          {items.map((group, index) => (
            // One fieldset per group: the legend is what makes each box
            // announce as "Billing, View invoices" rather than a loose "View
            // invoices" with no clue which section it belongs to.
            <fieldset
              key={group.label}
              className={\`border-0 p-0 \${
                index > 0 ? 'mt-2 border-t border-gray-100 pt-2 dark:border-gray-800' : ''
              }\`}
            >
              <legend className="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {group.label}
              </legend>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-[0.3125rem] text-sm font-semibold text-gray-900 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-50 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
                <SelectAllBox
                  groupLabel={group.label}
                  state={groupState(group)}
                  onToggle={() => toggleGroup(group)}
                />
                <span>Select all</span>
              </label>
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => toggleValue(option.value)}
                    className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-search-basic',
    category: 'forms',
    tags: ['multiselect', 'search', 'combobox', 'filter', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-04-11',
    updatedAt: '2026-07-07',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 2410, copies: 662, downloads: 177 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  A COMBOBOX, not a listbox with a search box bolted on. The difference is where
  the roles go, and it matters:

  - role="combobox" belongs on the INPUT, not on a wrapper. The input is the
    control; wrapping it changes what gets announced and breaks the pairing with
    aria-controls.
  - aria-autocomplete="list" tells the user the typing filters a list rather
    than completing the text inline.
  - Because the input is a real form control, a real <label for> works. No
    aria-labelledby gymnastics - this is the one popup pattern that gets a
    genuine label.
  - Focus STAYS in the input the whole time. Arrow keys move
    aria-activedescendant, never DOM focus, or typing would stop working the
    moment you arrowed into the list.

  The result count is announced through a live region: filtering silently
  redraws the screen, and a screen-reader user has no way to know that "sq" left
  one row standing.
-->
<div class="msearch">
  <label class="msearch__label" for="msearch-input">Skills</label>
  <div class="msearch__control">
    <svg class="msearch__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    <input
      class="msearch__input"
      id="msearch-input"
      type="text"
      role="combobox"
      aria-expanded="false"
      aria-controls="msearch-listbox"
      aria-autocomplete="list"
      aria-describedby="msearch-count"
      autocomplete="off"
      placeholder="Filter skills…"
    />
  </div>
  <p class="msearch__count" id="msearch-count" role="status" aria-live="polite">6 skills available. 2 selected.</p>
  <ul class="msearch__listbox" id="msearch-listbox" role="listbox" aria-multiselectable="true" aria-label="Skills" hidden></ul>
</div>

<script>
  document.querySelectorAll('.msearch').forEach(function (root) {
    var DATA = ['React', 'TypeScript', 'Go', 'Rust', 'SQL', 'Figma'];
    var input = root.querySelector('.msearch__input');
    var listbox = root.querySelector('.msearch__listbox');
    var count = root.querySelector('.msearch__count');
    var chosen = ['React', 'TypeScript'];
    var results = DATA.slice();
    var active = 0;

    function optionId(index) { return 'msearch-opt-' + index; }

    function render() {
      var query = input.value.trim().toLowerCase();
      results = DATA.filter(function (item) { return item.toLowerCase().includes(query); });
      if (active >= results.length) active = Math.max(0, results.length - 1);

      listbox.innerHTML = '';
      if (!results.length) {
        var empty = document.createElement('li');
        empty.className = 'msearch__empty';
        // role="presentation": an empty-state row is not an option and must not
        // be arrowable or selectable.
        empty.setAttribute('role', 'presentation');
        empty.textContent = 'No skills match “' + input.value + '”.';
        listbox.appendChild(empty);
      } else {
        results.forEach(function (item, index) {
          var li = document.createElement('li');
          li.className = 'msearch__option' + (index === active ? ' msearch__option--active' : '');
          li.id = optionId(index);
          li.setAttribute('role', 'option');
          li.setAttribute('aria-selected', String(chosen.includes(item)));
          li.innerHTML =
            '<span class="msearch__marker" aria-hidden="true"></span>' +
            '<span class="msearch__option-label">' + item + '</span>' +
            '<span class="msearch__tick" aria-hidden="true">✓</span>';
          li.addEventListener('mousedown', function (event) {
            // mousedown, not click, and prevented: a click would blur the input
            // first, closing the popup out from under the pointer.
            event.preventDefault();
            toggle(item);
          });
          li.addEventListener('mousemove', function () { active = index; paintActive(); });
          listbox.appendChild(li);
        });
      }

      listbox.setAttribute('aria-activedescendant', results.length ? optionId(active) : '');
      count.textContent =
        (results.length === 0
          ? 'No skills match.'
          : results.length + (results.length === 1 ? ' skill' : ' skills') + ' available.') +
        ' ' + chosen.length + ' selected.';
    }

    function paintActive() {
      Array.prototype.slice.call(listbox.querySelectorAll('.msearch__option')).forEach(function (el, index) {
        el.classList.toggle('msearch__option--active', index === active);
      });
      listbox.setAttribute('aria-activedescendant', results.length ? optionId(active) : '');
    }

    function setOpen(open) {
      listbox.hidden = !open;
      input.setAttribute('aria-expanded', String(open));
      if (open) render();
    }

    function toggle(item) {
      var at = chosen.indexOf(item);
      if (at === -1) chosen.push(item);
      else chosen.splice(at, 1);
      render();
    }

    input.addEventListener('focus', function () { setOpen(true); });
    input.addEventListener('input', function () {
      active = 0;
      setOpen(true);
      render();
    });

    input.addEventListener('keydown', function (event) {
      var open = input.getAttribute('aria-expanded') === 'true';
      var key = event.key;

      if (!open && (key === 'ArrowDown' || key === 'ArrowUp')) {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;

      if (key === 'Escape') { event.preventDefault(); setOpen(false); return; }
      if (key === 'Enter') {
        event.preventDefault();
        if (results[active]) toggle(results[active]);
        return;
      }
      if (!results.length) return;

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else return;
      event.preventDefault();
      active = (next + results.length) % results.length;
      paintActive();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });

    render();
  });
</script>`,
      css: `.msearch {
  position: relative;
}

.msearch__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.msearch__control {
  position: relative;
  display: block;
}

.msearch__icon {
  position: absolute;
  top: 50%;
  left: 0.625rem;
  transform: translateY(-50%);
  width: 0.875rem;
  height: 0.875rem;
  color: #6b7280;
  pointer-events: none;
}

.msearch__input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.msearch__input::placeholder {
  /* A placeholder is a hint, never the label - the <label> above is what names
     this control, and this text disappears the moment you type. */
  color: #6b7280;
}

.msearch__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.msearch__input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.msearch__count {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.msearch__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.msearch__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.msearch__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.msearch__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.msearch__option--active .msearch__marker {
  background-color: #2563eb;
}

.msearch__tick {
  color: #2563eb;
  font-weight: 700;
  visibility: hidden;
}

.msearch__option[aria-selected='true'] .msearch__tick {
  visibility: visible;
}

.msearch__option-label {
  flex: 1;
}

.msearch__empty {
  padding: 0.75rem 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
}

@media (prefers-color-scheme: dark) {
  .msearch__label {
    color: #d1d5db;
  }

  .msearch__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .msearch__input:focus-visible {
    outline-color: #60a5fa;
  }

  .msearch__icon,
  .msearch__input::placeholder,
  .msearch__count,
  .msearch__empty {
    color: #9ca3af;
  }

  .msearch__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .msearch__option {
    color: #d1d5db;
  }

  .msearch__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .msearch__option--active .msearch__marker {
    background-color: #60a5fa;
  }

  .msearch__tick {
    color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="msearch-input">Skills</label>
  <div class="relative">
    <svg class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    <input
      id="msearch-input"
      type="text"
      role="combobox"
      aria-expanded="true"
      aria-controls="msearch-listbox"
      aria-autocomplete="list"
      aria-activedescendant="msearch-opt-0"
      aria-describedby="msearch-count"
      autocomplete="off"
      placeholder="Filter skills…"
      class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    />
  </div>
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id="msearch-count" role="status" aria-live="polite">6 skills available. 2 selected.</p>
  <ul
    id="msearch-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-label="Skills"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="msearch-opt-0" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="flex-1">React</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="msearch-opt-1" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">TypeScript</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="msearch-opt-2" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Go</span>
    </li>
    <li id="msearch-opt-3" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Rust</span>
    </li>
    <li id="msearch-opt-4" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">SQL</span>
    </li>
    <li id="msearch-opt-5" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Figma</span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function MultiselectSearch({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const optionId = (index) => \`\${baseId}-option-\${index}\`;
  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next) {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event) {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        return;
      case 'Enter': {
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
      case 'ArrowDown':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={\`\${baseId}-input\`}>
        {label}
      </label>
      <div className="relative">
        <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-count\`}
          autoComplete="off"
          placeholder="Filter skills…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-count\`} role="status" aria-live="polite">
        {results.length === 0
          ? 'No skills match.'
          : \`\${results.length} \${results.length === 1 ? 'skill' : 'skills'} available.\`}{' '}
        {value.length} selected.
      </p>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li role="presentation" className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
              No skills match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(item.value);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {checked && (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectSearchProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

export function MultiselectSearch({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;
  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        return;
      case 'Enter': {
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
      case 'ArrowDown':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-count\`}
          autoComplete="off"
          placeholder="Filter skills…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
      </div>
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-count\`}
        role="status"
        aria-live="polite"
      >
        {results.length === 0
          ? 'No skills match.'
          : \`\${results.length} \${results.length === 1 ? 'skill' : 'skills'} available.\`}{' '}
        {value.length} selected.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No skills match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(item.value);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface MultiselectSearchProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

export function MultiselectSearch({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  /**
   * Clamped rather than reset. The list shrinks under the cursor as the user
   * types, so an index that was valid a keystroke ago may not be now - and an
   * aria-activedescendant pointing at an id that no longer exists is a silent
   * screen reader.
   */
  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        return;
      case 'Enter': {
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
      // Arrows move the virtual cursor only. DOM focus never leaves the input -
      // move it into the list and the user cannot type another character.
      case 'ArrowDown':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      {/* A real <label htmlFor>: the combobox is the one popup pattern whose
          trigger is an actual form control, so it gets a real label rather than
          aria-labelledby. */}
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={\`\${baseId}-input\`}
          type="text"
          // role goes on the INPUT, never on a wrapper - the input is the
          // control, and wrapping it breaks the aria-controls pairing.
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          // "list": typing filters a list rather than completing the text.
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-count\`}
          // Or the browser's own history dropdown covers the listbox.
          autoComplete="off"
          placeholder="Filter skills…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
      </div>
      {/* Filtering silently redraws the screen. Without this a screen-reader
          user has no way to know "sq" left one row standing. */}
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-count\`}
        role="status"
        aria-live="polite"
      >
        {results.length === 0
          ? 'No skills match.'
          : \`\${results.length} \${results.length === 1 ? 'skill' : 'skills'} available.\`}{' '}
        {value.length} selected.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            // presentation, not option: an empty state is not selectable and
            // must not be arrowable.
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No skills match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  // mousedown + preventDefault, not click: a click would blur
                  // the input first and close the popup out from under the
                  // pointer before the selection ever landed.
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(item.value);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-search-async',
    category: 'forms',
    tags: ['multiselect', 'async', 'debounce', 'loading', 'combobox'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-04-25',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1760, copies: 428, downloads: 112 },
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'loading', labelKey: 'loading' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  The same combobox as multiselect-search-basic, with the results coming from
  somewhere slow. Everything below exists because the network is not instant and
  not ordered:

  - DEBOUNCE. 250ms after the last keystroke, not on every one. "typescript" is
    one request, not ten.
  - RACE GUARD. Each request gets a sequence number, and a response whose number
    is stale is dropped. Without it, typing "go" then "golang" can paint the
    slower "go" results over the newer ones - a bug that only shows up on a bad
    connection, which is to say: on a user's connection, not yours.
  - THREE empty states, not one. "Type to search" (idle), "Searching…"
    (in flight) and "No results" (answered) are three different facts and the
    user is entitled to know which one they are in. Collapsing them into one
    "No results" tells a lie for as long as the request is open.
  - aria-busy on the listbox, plus the status in a live region - a spinner is
    invisible to a screen reader.

  The fetch here is stubbed with a local promise so the snippet runs anywhere.
  Swap searchProjects() for your endpoint; keep the seq guard.
-->
<div class="masync">
  <label class="masync__label" for="masync-input">Projects</label>
  <div class="masync__control">
    <input
      class="masync__input"
      id="masync-input"
      type="text"
      role="combobox"
      aria-expanded="false"
      aria-controls="masync-listbox"
      aria-autocomplete="list"
      aria-describedby="masync-status"
      autocomplete="off"
      placeholder="Search projects…"
    />
    <span class="masync__spinner" hidden aria-hidden="true"></span>
  </div>
  <p class="masync__status" id="masync-status" role="status" aria-live="polite">Type to search projects.</p>
  <ul class="masync__listbox" id="masync-listbox" role="listbox" aria-multiselectable="true" aria-label="Projects" hidden></ul>
</div>

<script>
  document.querySelectorAll('.masync').forEach(function (root) {
    var DEBOUNCE_MS = 250;
    var input = root.querySelector('.masync__input');
    var listbox = root.querySelector('.masync__listbox');
    var status = root.querySelector('.masync__status');
    var spinner = root.querySelector('.masync__spinner');

    var CATALOGUE = [
      'api-gateway', 'billing-service', 'design-tokens', 'docs-site',
      'edge-cache', 'identity-provider', 'mobile-app', 'web-dashboard',
    ];

    var chosen = [];
    var results = [];
    var active = 0;
    var timer = null;
    var seq = 0;

    // STUB. Replace with fetch('/api/projects?q=' + encodeURIComponent(query)).
    // Never let a component library snippet touch the network.
    function searchProjects(query) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var q = query.trim().toLowerCase();
          resolve(CATALOGUE.filter(function (name) { return name.includes(q); }));
        }, 400);
      });
    }

    function optionId(index) { return 'masync-opt-' + index; }

    function setBusy(busy) {
      spinner.hidden = !busy;
      listbox.setAttribute('aria-busy', String(busy));
    }

    function renderList() {
      listbox.innerHTML = '';
      results.forEach(function (name, index) {
        var li = document.createElement('li');
        li.className = 'masync__option' + (index === active ? ' masync__option--active' : '');
        li.id = optionId(index);
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(chosen.includes(name)));
        li.innerHTML =
          '<span class="masync__marker" aria-hidden="true"></span>' +
          '<span class="masync__option-label">' + name + '</span>' +
          '<span class="masync__tick" aria-hidden="true">✓</span>';
        li.addEventListener('mousedown', function (event) {
          event.preventDefault();
          var at = chosen.indexOf(name);
          if (at === -1) chosen.push(name);
          else chosen.splice(at, 1);
          renderList();
        });
        li.addEventListener('mousemove', function () {
          active = index;
          renderList();
        });
        listbox.appendChild(li);
      });
      listbox.setAttribute('aria-activedescendant', results.length ? optionId(active) : '');
      listbox.hidden = !results.length || input.getAttribute('aria-expanded') !== 'true';
    }

    function run(query) {
      if (!query.trim()) {
        seq += 1; // invalidate anything in flight
        setBusy(false);
        results = [];
        renderList();
        status.textContent = 'Type to search projects.';
        return;
      }

      var mine = ++seq;
      setBusy(true);
      status.textContent = 'Searching…';

      searchProjects(query).then(function (found) {
        // The race guard. A slower earlier request must never paint over a
        // faster later one.
        if (mine !== seq) return;
        setBusy(false);
        results = found;
        active = 0;
        renderList();
        status.textContent = found.length
          ? found.length + (found.length === 1 ? ' project' : ' projects') + ' found. ' + chosen.length + ' selected.'
          : 'No projects match “' + query + '”.';
      });
    }

    input.addEventListener('input', function () {
      input.setAttribute('aria-expanded', 'true');
      window.clearTimeout(timer);
      // Debounced: one request per pause, not one per keystroke.
      timer = window.setTimeout(function () { run(input.value); }, DEBOUNCE_MS);
    });

    input.addEventListener('keydown', function (event) {
      var key = event.key;
      if (key === 'Escape') {
        event.preventDefault();
        input.setAttribute('aria-expanded', 'false');
        listbox.hidden = true;
        return;
      }
      if (!results.length) return;
      if (key === 'Enter') {
        event.preventDefault();
        var name = results[active];
        var at = chosen.indexOf(name);
        if (at === -1) chosen.push(name);
        else chosen.splice(at, 1);
        renderList();
        return;
      }
      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else return;
      event.preventDefault();
      active = (next + results.length) % results.length;
      renderList();
    });

    document.addEventListener('mousedown', function (event) {
      if (root.contains(event.target)) return;
      input.setAttribute('aria-expanded', 'false');
      listbox.hidden = true;
    });
  });
</script>`,
      css: `.masync {
  position: relative;
}

.masync__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.masync__control {
  position: relative;
  display: block;
}

.masync__input {
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.masync__input::placeholder {
  color: #6b7280;
}

.masync__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.masync__input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* The spinner sits inside the field rather than replacing the list: the old
   results stay readable while the new ones load, so the layout does not
   collapse and reflow on every pause in typing. */
.masync__spinner {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid #d1d5db;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: masync-spin 700ms linear infinite;
}

@keyframes masync-spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .masync__spinner {
    animation-duration: 2s;
  }
}

.masync__status {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.masync__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

/* Stale results dim while the next request is in flight - the list is still
   readable, but visibly not the answer to what you just typed. */
.masync__listbox[aria-busy='true'] {
  opacity: 0.6;
}

.masync__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  cursor: pointer;
}

.masync__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.masync__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.masync__option--active .masync__marker {
  background-color: #2563eb;
}

.masync__tick {
  color: #2563eb;
  font-weight: 700;
  visibility: hidden;
}

.masync__option[aria-selected='true'] .masync__tick {
  visibility: visible;
}

.masync__option-label {
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .masync__label {
    color: #d1d5db;
  }

  .masync__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .masync__input:focus-visible {
    outline-color: #60a5fa;
  }

  .masync__input::placeholder,
  .masync__status {
    color: #9ca3af;
  }

  .masync__spinner {
    border-color: #374151;
    border-top-color: #60a5fa;
  }

  .masync__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .masync__option {
    color: #d1d5db;
  }

  .masync__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .masync__option--active .masync__marker {
    background-color: #60a5fa;
  }

  .masync__tick {
    color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="masync-input">Projects</label>
  <div class="relative">
    <input
      id="masync-input"
      type="text"
      role="combobox"
      aria-expanded="true"
      aria-controls="masync-listbox"
      aria-autocomplete="list"
      aria-activedescendant="masync-opt-0"
      aria-describedby="masync-status"
      autocomplete="off"
      placeholder="Search projects…"
      class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    />
    <span
      class="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:[animation-duration:2s] dark:border-gray-700 dark:border-t-blue-400"
      aria-hidden="true"
    ></span>
  </div>
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id="masync-status" role="status" aria-live="polite">Searching…</p>
  <ul
    id="masync-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-busy="true"
    aria-label="Projects"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg aria-busy:opacity-60 dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="masync-opt-0" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 font-mono text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="flex-1">api-gateway</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="masync-opt-1" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 font-mono text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">billing-service</span>
    </li>
    <li id="masync-opt-2" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 font-mono text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">edge-cache</span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const CATALOGUE = [
  'api-gateway', 'billing-service', 'design-tokens', 'docs-site',
  'edge-cache', 'identity-provider', 'mobile-app', 'web-dashboard',
];

// STUB - replace with fetch('/api/projects?q=' + encodeURIComponent(query)).
function searchProjects(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(CATALOGUE.filter((name) => name.includes(q)));
    }, 400);
  });
}

export function MultiselectSearchAsync({ label, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const seqRef = useRef(0);

  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!query.trim()) {
      seqRef.current += 1;
      setResults([]);
      setLoading(false);
      setSearched(false);
      return undefined;
    }

    const mine = ++seqRef.current;
    setLoading(true);
    const timer = setTimeout(() => {
      searchProjects(query).then((found) => {
        if (mine !== seqRef.current) return;
        setResults(found);
        setActiveIndex(0);
        setLoading(false);
        setSearched(true);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next) {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function statusText() {
    if (!query.trim()) return 'Type to search projects.';
    if (loading) return 'Searching…';
    if (!results.length) return \`No projects match “\${query}”.\`;
    return \`\${results.length} \${results.length === 1 ? 'project' : 'projects'} found. \${value.length} selected.\`;
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = results[activeIndex];
      if (name) toggleValue(name);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={\`\${baseId}-input\`}>
        {label}
      </label>
      <div className="relative">
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(activeIndex) : undefined}
          aria-describedby={\`\${baseId}-status\`}
          autoComplete="off"
          placeholder="Search projects…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        {loading && (
          <span
            className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:[animation-duration:2s] dark:border-gray-700 dark:border-t-blue-400"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-status\`} role="status" aria-live="polite">
        {statusText()}
      </p>
      {open && (searched || loading) && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-busy={loading}
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg aria-busy:opacity-60 dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 && !loading ? (
            <li role="presentation" className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
              No projects match “{query}”.
            </li>
          ) : (
            results.map((name, index) => {
              const isActive = index === activeIndex;
              const checked = value.includes(name);
              return (
                <li
                  key={name}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(name);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 font-mono text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{name}</span>
                  {checked && (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface MultiselectSearchAsyncProps {
  label: string;
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

const CATALOGUE = [
  'api-gateway',
  'billing-service',
  'design-tokens',
  'docs-site',
  'edge-cache',
  'identity-provider',
  'mobile-app',
  'web-dashboard',
];

// STUB - replace with a fetch to your own route handler.
function searchProjects(query: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(CATALOGUE.filter((name) => name.includes(q)));
    }, 400);
  });
}

export function MultiselectSearchAsync({
  label,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchAsyncProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef(0);

  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!query.trim()) {
      seqRef.current += 1;
      setResults([]);
      setLoading(false);
      setSearched(false);
      return undefined;
    }

    const mine = ++seqRef.current;
    setLoading(true);
    const timer = setTimeout(() => {
      void searchProjects(query).then((found) => {
        if (mine !== seqRef.current) return;
        setResults(found);
        setActiveIndex(0);
        setLoading(false);
        setSearched(true);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function statusText(): string {
    if (!query.trim()) return 'Type to search projects.';
    if (loading) return 'Searching…';
    if (!results.length) return \`No projects match “\${query}”.\`;
    return \`\${results.length} \${results.length === 1 ? 'project' : 'projects'} found. \${value.length} selected.\`;
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = results[activeIndex];
      if (name) toggleValue(name);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(activeIndex) : undefined}
          aria-describedby={\`\${baseId}-status\`}
          autoComplete="off"
          placeholder="Search projects…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        {loading ? (
          <span
            className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:[animation-duration:2s] dark:border-gray-700 dark:border-t-blue-400"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {statusText()}
      </p>
      {open && (searched || loading) ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-busy={loading}
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg aria-busy:opacity-60 dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 && !loading ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No projects match “{query}”.
            </li>
          ) : (
            results.map((name, index) => {
              const isActive = index === activeIndex;
              const checked = value.includes(name);
              return (
                <li
                  key={name}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(name);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 font-mono text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{name}</span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface MultiselectSearchAsyncProps {
  label: string;
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

const DEBOUNCE_MS = 250;

const CATALOGUE: readonly string[] = [
  'api-gateway',
  'billing-service',
  'design-tokens',
  'docs-site',
  'edge-cache',
  'identity-provider',
  'mobile-app',
  'web-dashboard',
];

/**
 * STUB. A local promise with a setTimeout so the snippet runs anywhere with no
 * server behind it. Replace the body with your fetch:
 *
 *   const res = await fetch(\`/api/projects?q=\${encodeURIComponent(query)}\`);
 *   return res.json();
 *
 * Keep the sequence guard in the caller either way - it is not the transport's
 * job.
 */
function searchProjects(query: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(CATALOGUE.filter((name) => name.includes(q)));
    }, 400);
  });
}

export function MultiselectSearchAsync({
  label,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchAsyncProps): JSX.Element {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  /** Has a request ever ANSWERED for the current query? This is what separates
   *  "no results" from "not asked yet" - collapsing the two shows an empty
   *  state that is a lie for as long as the request is open. */
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * The race guard. Responses do not arrive in the order they were sent, so
   * every request takes a ticket and a response holding a stale one is thrown
   * away. Without this, typing "go" then "golang" can paint the older "go"
   * results over the newer ones - a bug that only reproduces on a slow
   * connection, which is to say on a user's, never on yours.
   */
  const seqRef = useRef(0);

  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!query.trim()) {
      // Bump the ticket so anything in flight lands stale and is dropped.
      seqRef.current += 1;
      setResults([]);
      setLoading(false);
      setSearched(false);
      return undefined;
    }

    const mine = ++seqRef.current;
    setLoading(true);

    // Debounced: one request per pause in typing, not one per keystroke.
    const timer = setTimeout(() => {
      void searchProjects(query).then((found) => {
        if (mine !== seqRef.current) return;
        setResults(found);
        setActiveIndex(0);
        setLoading(false);
        setSearched(true);
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  /** Three states, three sentences. Idle, in flight, answered. */
  function statusText(): string {
    if (!query.trim()) return 'Type to search projects.';
    if (loading) return 'Searching…';
    if (!results.length) return \`No projects match “\${query}”.\`;
    return \`\${results.length} \${results.length === 1 ? 'project' : 'projects'} found. \${value.length} selected.\`;
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = results[activeIndex];
      if (name) toggleValue(name);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(activeIndex) : undefined}
          aria-describedby={\`\${baseId}-status\`}
          autoComplete="off"
          placeholder="Search projects…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        {/* The spinner lives in the field, not in place of the list: old results
            stay readable while the next ones load, so the popup does not
            collapse and reflow on every pause. */}
        {loading ? (
          <span
            className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:[animation-duration:2s] dark:border-gray-700 dark:border-t-blue-400"
            aria-hidden="true"
          />
        ) : null}
      </div>
      {/* The spinner is invisible to a screen reader. This is not. */}
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {statusText()}
      </p>
      {open && (searched || loading) ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          // Announces the list as stale while the next request is out.
          aria-busy={loading}
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg aria-busy:opacity-60 dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 && !loading ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No projects match “{query}”.
            </li>
          ) : (
            results.map((name, index) => {
              const isActive = index === activeIndex;
              const checked = value.includes(name);
              return (
                <li
                  key={name}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(name);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 font-mono text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{name}</span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-search-create',
    category: 'forms',
    tags: ['multiselect', 'create', 'combobox', 'tags', 'search'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-09',
    updatedAt: '2026-07-10',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1330, copies: 342, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'text', labelKey: 'text' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'string[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  A combobox that can invent a row. Four decisions worth stealing:

  - The create row IS a role="option", not a button below the list. In the
    combobox pattern it is exactly what it looks like: one more thing Enter can
    land on. A button there would be unreachable by the arrow keys that got the
    user to the bottom of the list in the first place.
  - It appears only when there is no EXACT match, not when there are no results.
    Type "des" against "design" and you want the filtered list; the offer to
    create "des" would be noise. It also sits LAST, so it can never steal the
    Enter meant for a real result.
  - The label is quoted - Create “design system”. Without the quotes, a tag with
    a trailing space or an odd capital is invisible before you commit it.
  - Freshly created tags are announced. Otherwise the row silently changes shape
    under the cursor and nothing says what happened.
-->
<div class="mcreate">
  <label class="mcreate__label" for="mcreate-input">Tags</label>
  <input
    class="mcreate__input"
    id="mcreate-input"
    type="text"
    role="combobox"
    aria-expanded="false"
    aria-controls="mcreate-listbox"
    aria-autocomplete="list"
    aria-describedby="mcreate-status"
    autocomplete="off"
    placeholder="Search or create a tag…"
  />
  <p class="mcreate__status" id="mcreate-status" role="status" aria-live="polite">4 tags available.</p>
  <ul class="mcreate__listbox" id="mcreate-listbox" role="listbox" aria-multiselectable="true" aria-label="Tags" hidden></ul>
</div>

<script>
  document.querySelectorAll('.mcreate').forEach(function (root) {
    var input = root.querySelector('.mcreate__input');
    var listbox = root.querySelector('.mcreate__listbox');
    var status = root.querySelector('.mcreate__status');

    var known = ['design', 'engineering', 'research', 'roadmap'];
    var chosen = [];
    var rows = [];
    var active = 0;

    function optionId(index) { return 'mcreate-opt-' + index; }

    function build() {
      var query = input.value.trim();
      var q = query.toLowerCase();
      var matches = known.filter(function (t) { return t.toLowerCase().includes(q); });

      rows = matches.map(function (tag) { return { kind: 'tag', tag: tag }; });

      // Exact match, not "no results": typing "des" against "design" should
      // filter, not offer to create a second nearly identical tag. Last in the
      // list so it can never steal the Enter meant for a real one.
      var exact = known.some(function (t) { return t.toLowerCase() === q; });
      if (query && !exact) rows.push({ kind: 'create', tag: query });

      if (active >= rows.length) active = Math.max(0, rows.length - 1);
    }

    function render() {
      build();
      listbox.innerHTML = '';

      rows.forEach(function (row, index) {
        var li = document.createElement('li');
        li.id = optionId(index);
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(row.kind === 'tag' && chosen.includes(row.tag)));
        li.className =
          (row.kind === 'create' ? 'mcreate__option mcreate__option--create' : 'mcreate__option') +
          (index === active ? ' mcreate__option--active' : '');

        if (row.kind === 'create') {
          li.innerHTML =
            '<span class="mcreate__marker" aria-hidden="true"></span>' +
            '<svg class="mcreate__plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>' +
            '<span class="mcreate__option-label">Create “' + row.tag + '”</span>';
        } else {
          li.innerHTML =
            '<span class="mcreate__marker" aria-hidden="true"></span>' +
            '<span class="mcreate__option-label">' + row.tag + '</span>' +
            '<span class="mcreate__tick" aria-hidden="true">✓</span>';
        }

        li.addEventListener('mousedown', function (event) {
          event.preventDefault();
          commit(index);
        });
        li.addEventListener('mousemove', function () {
          active = index;
          render();
        });
        listbox.appendChild(li);
      });

      listbox.setAttribute('aria-activedescendant', rows.length ? optionId(active) : '');
      listbox.hidden = !rows.length || input.getAttribute('aria-expanded') !== 'true';
      if (!input.value.trim()) status.textContent = known.length + ' tags available.';
    }

    function commit(index) {
      var row = rows[index];
      if (!row) return;

      if (row.kind === 'create') {
        known.push(row.tag);
        chosen.push(row.tag);
        input.value = '';
        active = 0;
        render();
        status.textContent = 'Created and added “' + row.tag + '”. ' + chosen.length + ' selected.';
        return;
      }

      var at = chosen.indexOf(row.tag);
      if (at === -1) chosen.push(row.tag);
      else chosen.splice(at, 1);
      render();
      status.textContent = chosen.length + ' selected.';
    }

    input.addEventListener('focus', function () {
      input.setAttribute('aria-expanded', 'true');
      render();
    });

    input.addEventListener('input', function () {
      input.setAttribute('aria-expanded', 'true');
      active = 0;
      render();
    });

    input.addEventListener('keydown', function (event) {
      var key = event.key;
      if (key === 'Escape') {
        event.preventDefault();
        input.setAttribute('aria-expanded', 'false');
        listbox.hidden = true;
        return;
      }
      if (!rows.length) return;
      if (key === 'Enter') { event.preventDefault(); commit(active); return; }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else return;
      event.preventDefault();
      active = (next + rows.length) % rows.length;
      render();
    });

    document.addEventListener('mousedown', function (event) {
      if (root.contains(event.target)) return;
      input.setAttribute('aria-expanded', 'false');
      listbox.hidden = true;
    });

    render();
  });
</script>`,
      css: `.mcreate {
  position: relative;
}

.mcreate__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.mcreate__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.mcreate__input::placeholder {
  color: #6b7280;
}

.mcreate__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mcreate__input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mcreate__status {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.mcreate__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mcreate__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.mcreate__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.mcreate__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.mcreate__option--active .mcreate__marker {
  background-color: #2563eb;
}

/*
 * The create row is set apart by a rule above it and a plus glyph, not by
 * colour: it is a different KIND of action, and the difference has to survive
 * greyscale. It still highlights exactly like every other option, because
 * arrowing onto it is ordinary.
 */
.mcreate__option--create {
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 0.375rem 0.375rem;
  font-weight: 500;
}

.mcreate__plus {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  color: #2563eb;
}

.mcreate__tick {
  color: #2563eb;
  font-weight: 700;
  visibility: hidden;
}

.mcreate__option[aria-selected='true'] .mcreate__tick {
  visibility: visible;
}

.mcreate__option-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-color-scheme: dark) {
  .mcreate__label {
    color: #d1d5db;
  }

  .mcreate__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .mcreate__input:focus-visible {
    outline-color: #60a5fa;
  }

  .mcreate__input::placeholder,
  .mcreate__status {
    color: #9ca3af;
  }

  .mcreate__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .mcreate__option {
    color: #d1d5db;
  }

  .mcreate__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .mcreate__option--active .mcreate__marker {
    background-color: #60a5fa;
  }

  .mcreate__option--create {
    border-top-color: #374151;
  }

  .mcreate__plus,
  .mcreate__tick {
    color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="mcreate-input">Tags</label>
  <input
    id="mcreate-input"
    type="text"
    role="combobox"
    aria-expanded="true"
    aria-controls="mcreate-listbox"
    aria-autocomplete="list"
    aria-activedescendant="mcreate-opt-1"
    aria-describedby="mcreate-status"
    autocomplete="off"
    placeholder="Search or create a tag…"
    value="design system"
    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  />
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id="mcreate-status" role="status" aria-live="polite">1 tag available.</p>
  <ul
    id="mcreate-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-label="Tags"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="mcreate-opt-0" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1 truncate">design</span>
    </li>
    <li id="mcreate-opt-1" role="option" aria-selected="false" class="mt-1 flex cursor-pointer items-center gap-2 rounded-b-md border-t border-gray-200 bg-gray-100 py-2 pl-1 pr-2 pt-2 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <svg class="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      <span class="flex-1 truncate">Create “design system”</span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function MultiselectSearchCreate({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [known, setKnown] = useState(items);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef(null);

  const rows = useMemo(() => {
    const trimmed = query.trim();
    const q = trimmed.toLowerCase();
    const matches = known
      .filter((tag) => tag.toLowerCase().includes(q))
      .map((tag) => ({ kind: 'tag', tag }));
    const exact = known.some((tag) => tag.toLowerCase() === q);
    if (trimmed && !exact) matches.push({ kind: 'create', tag: trimmed });
    return matches;
  }, [known, query]);

  const clamped = Math.min(activeIndex, Math.max(0, rows.length - 1));
  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function commit(index) {
    const row = rows[index];
    if (!row) return;

    if (row.kind === 'create') {
      setKnown((prev) => [...prev, row.tag]);
      onSelect?.([...value, row.tag]);
      setQuery('');
      setActiveIndex(0);
      setAnnouncement(\`Created and added “\${row.tag}”.\`);
      return;
    }
    onSelect?.(value.includes(row.tag) ? value.filter((v) => v !== row.tag) : [...value, row.tag]);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!rows.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(clamped);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % rows.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + rows.length) % rows.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={\`\${baseId}-input\`}>
        {label}
      </label>
      <input
        id={\`\${baseId}-input\`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-autocomplete="list"
        aria-activedescendant={open && rows.length ? optionId(clamped) : undefined}
        aria-describedby={\`\${baseId}-status\`}
        autoComplete="off"
        placeholder="Search or create a tag…"
        disabled={disabled}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      />
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-status\`} role="status" aria-live="polite">
        {announcement || \`\${rows.length} \${rows.length === 1 ? 'result' : 'results'}. \${value.length} selected.\`}
      </p>
      {open && rows.length > 0 && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {rows.map((row, index) => {
            const isActive = index === clamped;
            const checked = row.kind === 'tag' && value.includes(row.tag);
            return (
              <li
                key={\`\${row.kind}-\${row.tag}\`}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(index);
                }}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  row.kind === 'create'
                    ? 'mt-1 rounded-b-md border-t border-gray-200 pt-2 font-medium dark:border-gray-700'
                    : ''
                } \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                {row.kind === 'create' && (
                  <svg className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                )}
                <span className="flex-1 truncate">
                  {row.kind === 'create' ? \`Create “\${row.tag}”\` : row.tag}
                </span>
                {checked && (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface MultiselectSearchCreateProps {
  label: string;
  items: string[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

type Row = { kind: 'tag' | 'create'; tag: string };

export function MultiselectSearchCreate({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchCreateProps) {
  const baseId = useId();
  const [known, setKnown] = useState<string[]>(items);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const rows = useMemo<Row[]>(() => {
    const trimmed = query.trim();
    const q = trimmed.toLowerCase();
    const matches: Row[] = known
      .filter((tag) => tag.toLowerCase().includes(q))
      .map((tag) => ({ kind: 'tag', tag }));
    const exact = known.some((tag) => tag.toLowerCase() === q);
    if (trimmed && !exact) matches.push({ kind: 'create', tag: trimmed });
    return matches;
  }, [known, query]);

  const clamped = Math.min(activeIndex, Math.max(0, rows.length - 1));
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function commit(index: number): void {
    const row = rows[index];
    if (!row) return;

    if (row.kind === 'create') {
      setKnown((prev) => [...prev, row.tag]);
      onSelect?.([...value, row.tag]);
      setQuery('');
      setActiveIndex(0);
      setAnnouncement(\`Created and added “\${row.tag}”.\`);
      return;
    }
    onSelect?.(value.includes(row.tag) ? value.filter((v) => v !== row.tag) : [...value, row.tag]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!rows.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(clamped);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % rows.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + rows.length) % rows.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <input
        id={\`\${baseId}-input\`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-autocomplete="list"
        aria-activedescendant={open && rows.length ? optionId(clamped) : undefined}
        aria-describedby={\`\${baseId}-status\`}
        autoComplete="off"
        placeholder="Search or create a tag…"
        disabled={disabled}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      />
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {announcement ||
          \`\${rows.length} \${rows.length === 1 ? 'result' : 'results'}. \${value.length} selected.\`}
      </p>
      {open && rows.length > 0 ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {rows.map((row, index) => {
            const isActive = index === clamped;
            const checked = row.kind === 'tag' && value.includes(row.tag);
            return (
              <li
                key={\`\${row.kind}-\${row.tag}\`}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(index);
                }}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  row.kind === 'create'
                    ? 'mt-1 rounded-b-md border-t border-gray-200 pt-2 font-medium dark:border-gray-700'
                    : ''
                } \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                {row.kind === 'create' ? (
                  <svg
                    className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                ) : null}
                <span className="flex-1 truncate">
                  {row.kind === 'create' ? \`Create “\${row.tag}”\` : row.tag}
                </span>
                {checked ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface MultiselectSearchCreateProps {
  label: string;
  /** Tags that already exist. Anything the user creates is appended locally -
   *  persist it in \`onSelect\` if it needs to outlive the page. */
  items: string[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * A row is either an existing tag or the offer to create one. Modelling both as
 * the same shape is what lets the arrow keys treat the create row as ordinary -
 * which is the whole trick.
 */
type Row = { kind: 'tag' | 'create'; tag: string };

export function MultiselectSearchCreate({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchCreateProps): JSX.Element {
  const baseId = useId();
  const [known, setKnown] = useState<string[]>(items);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const rows = useMemo<Row[]>(() => {
    const trimmed = query.trim();
    const q = trimmed.toLowerCase();
    const matches: Row[] = known
      .filter((tag) => tag.toLowerCase().includes(q))
      .map((tag) => ({ kind: 'tag', tag }));

    /**
     * The offer appears when there is no EXACT match - not when there are no
     * results at all. Type "des" against "design" and you want the filtered
     * list; offering to create "des" beside it is noise, and one Enter away
     * from a near-duplicate tag nobody meant to make.
     *
     * It goes LAST so it can never steal the Enter meant for a real result.
     */
    const exact = known.some((tag) => tag.toLowerCase() === q);
    if (trimmed && !exact) matches.push({ kind: 'create', tag: trimmed });
    return matches;
  }, [known, query]);

  // The list reshapes on every keystroke, so the cursor is clamped rather than
  // trusted - a stale index means aria-activedescendant points at nothing.
  const clamped = Math.min(activeIndex, Math.max(0, rows.length - 1));
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function commit(index: number): void {
    const row = rows[index];
    if (!row) return;

    if (row.kind === 'create') {
      setKnown((prev) => [...prev, row.tag]);
      onSelect?.([...value, row.tag]);
      // Clearing the query is what makes the new tag appear in the plain list
      // rather than leaving the create row on screen offering itself again.
      setQuery('');
      setActiveIndex(0);
      setAnnouncement(\`Created and added “\${row.tag}”.\`);
      return;
    }
    onSelect?.(value.includes(row.tag) ? value.filter((v) => v !== row.tag) : [...value, row.tag]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!rows.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(clamped);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % rows.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + rows.length) % rows.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <input
        id={\`\${baseId}-input\`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={\`\${baseId}-listbox\`}
        aria-autocomplete="list"
        aria-activedescendant={open && rows.length ? optionId(clamped) : undefined}
        aria-describedby={\`\${baseId}-status\`}
        autoComplete="off"
        placeholder="Search or create a tag…"
        disabled={disabled}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      />
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {announcement ||
          \`\${rows.length} \${rows.length === 1 ? 'result' : 'results'}. \${value.length} selected.\`}
      </p>
      {open && rows.length > 0 ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {rows.map((row, index) => {
            const isActive = index === clamped;
            const checked = row.kind === 'tag' && value.includes(row.tag);
            return (
              // The create row is a role="option", not a button under the list.
              // In this pattern it is exactly what it looks like: one more thing
              // Enter can land on. A button there would be unreachable by the
              // arrows that got the user to the bottom of the list.
              <li
                key={\`\${row.kind}-\${row.tag}\`}
                id={optionId(index)}
                role="option"
                aria-selected={checked}
                onMouseMove={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(index);
                }}
                className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                  row.kind === 'create'
                    ? 'mt-1 rounded-b-md border-t border-gray-200 pt-2 font-medium dark:border-gray-700'
                    : ''
                } \${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300'
                }\`}
              >
                <span
                  aria-hidden="true"
                  className={\`h-4 w-0.5 shrink-0 rounded-full \${
                    isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                  }\`}
                />
                {row.kind === 'create' ? (
                  <svg
                    className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                ) : null}
                {/* Quoted, so a stray trailing space or an odd capital is
                    visible BEFORE it becomes a permanent tag. */}
                <span className="flex-1 truncate">
                  {row.kind === 'create' ? \`Create “\${row.tag}”\` : row.tag}
                </span>
                {checked ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-search-avatars',
    category: 'forms',
    tags: ['multiselect', 'people', 'avatar', 'combobox', 'search'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-22',
    updatedAt: '2026-07-11',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1970, copies: 503, downloads: 129 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'avatar', labelKey: 'avatar' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'Person[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  A people picker. The row is three things - avatar, name, email - and each one
  has a rule:

  - The AVATAR is decorative, always. It sits next to the name it depicts, so
    alt text would produce "Ada Lovelace Ada Lovelace". aria-hidden, alt="", no
    exceptions. Initials are a fallback that cannot 404.
  - The EMAIL is not decoration - it is how you tell two Chens apart. It is real
    text in the row, and the filter searches it: "@adysre" finds every colleague.
  - The row's accessible name is therefore "Ada Lovelace ada@adysre.com", which is
    exactly what a human would say out loud to disambiguate.

  Contrast note: the email is the smallest text here and still holds 4.5:1.
  There is no exemption for secondary text.
-->
<div class="mavatar">
  <label class="mavatar__label" for="mavatar-input">Assignees</label>
  <div class="mavatar__control">
    <span class="mavatar__chip">
      <span class="mavatar__chip-avatar" aria-hidden="true">AL</span>
      Ada Lovelace
      <button class="mavatar__remove" type="button" aria-label="Remove Ada Lovelace">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </span>
    <input
      class="mavatar__input"
      id="mavatar-input"
      type="text"
      role="combobox"
      aria-expanded="false"
      aria-controls="mavatar-listbox"
      aria-autocomplete="list"
      aria-describedby="mavatar-status"
      autocomplete="off"
      placeholder="Search people…"
    />
  </div>
  <p class="mavatar__status" id="mavatar-status" role="status" aria-live="polite">5 people available. 1 selected.</p>
  <ul class="mavatar__listbox" id="mavatar-listbox" role="listbox" aria-multiselectable="true" aria-label="Assignees" hidden>
    <li class="mavatar__option" id="mavatar-opt-0" role="option" aria-selected="true">
      <span class="mavatar__marker" aria-hidden="true"></span>
      <span class="mavatar__avatar" aria-hidden="true">AL</span>
      <span class="mavatar__person">
        <span class="mavatar__name">Ada Lovelace</span>
        <span class="mavatar__email">ada@adysre.com</span>
      </span>
      <span class="mavatar__tick" aria-hidden="true">✓</span>
    </li>
    <li class="mavatar__option" id="mavatar-opt-1" role="option" aria-selected="false">
      <span class="mavatar__marker" aria-hidden="true"></span>
      <span class="mavatar__avatar" aria-hidden="true">GH</span>
      <span class="mavatar__person">
        <span class="mavatar__name">Grace Hopper</span>
        <span class="mavatar__email">grace@adysre.com</span>
      </span>
      <span class="mavatar__tick" aria-hidden="true">✓</span>
    </li>
    <li class="mavatar__option" id="mavatar-opt-2" role="option" aria-selected="false">
      <span class="mavatar__marker" aria-hidden="true"></span>
      <span class="mavatar__avatar" aria-hidden="true">AT</span>
      <span class="mavatar__person">
        <span class="mavatar__name">Alan Turing</span>
        <span class="mavatar__email">alan@adysre.com</span>
      </span>
      <span class="mavatar__tick" aria-hidden="true">✓</span>
    </li>
  </ul>
</div>

<script>
  document.querySelectorAll('.mavatar').forEach(function (root) {
    var PEOPLE = [
      { id: 'ada', name: 'Ada Lovelace', email: 'ada@adysre.com' },
      { id: 'grace', name: 'Grace Hopper', email: 'grace@adysre.com' },
      { id: 'alan', name: 'Alan Turing', email: 'alan@adysre.com' },
      { id: 'katherine', name: 'Katherine Johnson', email: 'katherine@adysre.com' },
      { id: 'linus', name: 'Linus Chen', email: 'linus@adysre.com' },
    ];

    var input = root.querySelector('.mavatar__input');
    var listbox = root.querySelector('.mavatar__listbox');
    var control = root.querySelector('.mavatar__control');
    var status = root.querySelector('.mavatar__status');
    var chosen = ['ada'];
    var results = PEOPLE.slice();
    var active = 0;

    function initials(name) {
      return name.split(' ').map(function (part) { return part[0]; }).join('').slice(0, 2).toUpperCase();
    }

    function optionId(index) { return 'mavatar-opt-' + index; }

    function renderChips() {
      Array.prototype.slice.call(root.querySelectorAll('.mavatar__chip')).forEach(function (c) { c.remove(); });
      chosen.forEach(function (id) {
        var person = PEOPLE.find(function (p) { return p.id === id; });
        if (!person) return;
        var chip = document.createElement('span');
        chip.className = 'mavatar__chip';
        chip.innerHTML =
          '<span class="mavatar__chip-avatar" aria-hidden="true">' + initials(person.name) + '</span>' +
          person.name;
        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'mavatar__remove';
        remove.setAttribute('aria-label', 'Remove ' + person.name);
        remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>';
        remove.addEventListener('click', function () {
          chosen = chosen.filter(function (c) { return c !== id; });
          renderAll();
          input.focus();
        });
        chip.appendChild(remove);
        control.insertBefore(chip, input);
      });
    }

    function renderList() {
      var q = input.value.trim().toLowerCase();
      // Name AND email: "@adysre" finds everyone, "chen" finds one person.
      results = PEOPLE.filter(function (p) {
        return p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
      });
      if (active >= results.length) active = Math.max(0, results.length - 1);

      listbox.innerHTML = '';
      if (!results.length) {
        var empty = document.createElement('li');
        empty.setAttribute('role', 'presentation');
        empty.className = 'mavatar__empty';
        empty.textContent = 'Nobody matches “' + input.value + '”.';
        listbox.appendChild(empty);
      } else {
        results.forEach(function (person, index) {
          var li = document.createElement('li');
          li.id = optionId(index);
          li.className = 'mavatar__option' + (index === active ? ' mavatar__option--active' : '');
          li.setAttribute('role', 'option');
          li.setAttribute('aria-selected', String(chosen.includes(person.id)));
          li.innerHTML =
            '<span class="mavatar__marker" aria-hidden="true"></span>' +
            '<span class="mavatar__avatar" aria-hidden="true">' + initials(person.name) + '</span>' +
            '<span class="mavatar__person"><span class="mavatar__name">' + person.name +
            '</span><span class="mavatar__email">' + person.email + '</span></span>' +
            '<span class="mavatar__tick" aria-hidden="true">✓</span>';
          li.addEventListener('mousedown', function (event) {
            event.preventDefault();
            toggle(person.id);
          });
          li.addEventListener('mousemove', function () { active = index; renderList(); });
          listbox.appendChild(li);
        });
      }

      listbox.setAttribute('aria-activedescendant', results.length ? optionId(active) : '');
      listbox.hidden = input.getAttribute('aria-expanded') !== 'true';
      status.textContent =
        (results.length ? results.length + (results.length === 1 ? ' person' : ' people') + ' available.' : 'Nobody matches.') +
        ' ' + chosen.length + ' selected.';
    }

    function renderAll() { renderChips(); renderList(); }

    function toggle(id) {
      if (chosen.includes(id)) chosen = chosen.filter(function (c) { return c !== id; });
      else chosen.push(id);
      renderAll();
    }

    input.addEventListener('focus', function () {
      input.setAttribute('aria-expanded', 'true');
      renderList();
    });

    input.addEventListener('input', function () {
      input.setAttribute('aria-expanded', 'true');
      active = 0;
      renderList();
    });

    input.addEventListener('keydown', function (event) {
      var key = event.key;
      if (key === 'Escape') {
        event.preventDefault();
        input.setAttribute('aria-expanded', 'false');
        listbox.hidden = true;
        return;
      }
      if (key === 'Backspace' && !input.value && chosen.length) {
        event.preventDefault();
        chosen = chosen.slice(0, -1);
        renderAll();
        return;
      }
      if (!results.length) return;
      if (key === 'Enter') {
        event.preventDefault();
        toggle(results[active].id);
        return;
      }
      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else return;
      event.preventDefault();
      active = (next + results.length) % results.length;
      renderList();
    });

    document.addEventListener('mousedown', function (event) {
      if (root.contains(event.target)) return;
      input.setAttribute('aria-expanded', 'false');
      listbox.hidden = true;
    });

    renderAll();
  });
</script>`,
      css: `.mavatar {
  position: relative;
}

.mavatar__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.mavatar__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
}

.mavatar__control:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mavatar__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.25rem 0.125rem 0.125rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
}

.mavatar__chip-avatar,
.mavatar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 9999px;
  /* #4338ca on #e0e7ff is 7.9:1 - initials are text and are held to the text
     bar, however small the circle is. */
  background-color: #e0e7ff;
  color: #4338ca;
  font-weight: 700;
}

.mavatar__chip-avatar {
  width: 1.125rem;
  height: 1.125rem;
  font-size: 0.5rem;
}

.mavatar__avatar {
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.625rem;
}

.mavatar__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.875rem;
  height: 0.875rem;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.mavatar__remove svg {
  width: 0.5625rem;
  height: 0.5625rem;
}

.mavatar__remove:hover {
  background-color: rgba(55, 65, 81, 0.15);
}

.mavatar__remove:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.mavatar__input {
  flex: 1;
  min-width: 7rem;
  padding: 0.25rem;
  border: 0;
  background: transparent;
  color: #111827;
  font-size: 0.875rem;
}

.mavatar__input::placeholder {
  color: #6b7280;
}

/* The control draws the ring via :focus-within - a second one on the bare input
   would double up inside it. */
.mavatar__input:focus {
  outline: none;
}

.mavatar__status {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.mavatar__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mavatar__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem 0.375rem 0.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.mavatar__marker {
  width: 0.125rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.mavatar__option--active {
  background-color: #f3f4f6;
}

.mavatar__option--active .mavatar__marker {
  background-color: #2563eb;
}

.mavatar__person {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  line-height: 1.2;
}

.mavatar__name {
  color: #111827;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Secondary, not exempt: 4.83:1 on white. The email is the field that tells two
   people with the same name apart, so it has to be readable. */
.mavatar__email {
  color: #6b7280;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mavatar__tick {
  color: #2563eb;
  font-weight: 700;
  visibility: hidden;
}

.mavatar__option[aria-selected='true'] .mavatar__tick {
  visibility: visible;
}

.mavatar__empty {
  padding: 0.75rem 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
}

@media (prefers-color-scheme: dark) {
  .mavatar__label {
    color: #d1d5db;
  }

  .mavatar__control {
    border-color: #374151;
    background-color: #111827;
  }

  .mavatar__control:focus-within {
    outline-color: #60a5fa;
  }

  .mavatar__chip {
    background-color: #374151;
    color: #e5e7eb;
  }

  .mavatar__chip-avatar,
  .mavatar__avatar {
    background-color: #3730a3;
    color: #e0e7ff;
  }

  .mavatar__remove:hover {
    background-color: rgba(229, 231, 235, 0.2);
  }

  .mavatar__remove:focus-visible {
    outline-color: #60a5fa;
  }

  .mavatar__input {
    color: #f3f4f6;
  }

  .mavatar__input::placeholder,
  .mavatar__status,
  .mavatar__email,
  .mavatar__empty {
    color: #9ca3af;
  }

  .mavatar__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .mavatar__option--active {
    background-color: #1f2937;
  }

  .mavatar__option--active .mavatar__marker {
    background-color: #60a5fa;
  }

  .mavatar__name {
    color: #f3f4f6;
  }

  .mavatar__tick {
    color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="mavatar-input">Assignees</label>
  <div class="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-0.5 pl-0.5 pr-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
      <span class="inline-flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[0.5rem] font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100" aria-hidden="true">AL</span>
      Ada Lovelace
      <button type="button" aria-label="Remove Ada Lovelace" class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-gray-700/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-gray-200/20 dark:focus-visible:outline-blue-400">
        <svg class="h-[0.5625rem] w-[0.5625rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </span>
    <input
      id="mavatar-input"
      type="text"
      role="combobox"
      aria-expanded="true"
      aria-controls="mavatar-listbox"
      aria-autocomplete="list"
      aria-activedescendant="mavatar-opt-0"
      aria-describedby="mavatar-status"
      autocomplete="off"
      placeholder="Search people…"
      class="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-400"
    />
  </div>
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id="mavatar-status" role="status" aria-live="polite">5 people available. 1 selected.</p>
  <ul
    id="mavatar-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-label="Assignees"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="mavatar-opt-0" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-1.5 pl-1 pr-2 dark:bg-gray-800">
      <span class="h-7 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[0.625rem] font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100" aria-hidden="true">AL</span>
      <span class="flex min-w-0 flex-1 flex-col leading-tight">
        <span class="truncate text-sm text-gray-900 dark:text-gray-100">Ada Lovelace</span>
        <span class="truncate text-xs text-gray-500 dark:text-gray-400">ada@adysre.com</span>
      </span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mavatar-opt-1" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-1.5 pl-1 pr-2">
      <span class="h-7 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[0.625rem] font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100" aria-hidden="true">GH</span>
      <span class="flex min-w-0 flex-1 flex-col leading-tight">
        <span class="truncate text-sm text-gray-900 dark:text-gray-100">Grace Hopper</span>
        <span class="truncate text-xs text-gray-500 dark:text-gray-400">grace@adysre.com</span>
      </span>
    </li>
    <li id="mavatar-opt-2" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-1.5 pl-1 pr-2">
      <span class="h-7 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[0.625rem] font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100" aria-hidden="true">AT</span>
      <span class="flex min-w-0 flex-1 flex-col leading-tight">
        <span class="truncate text-sm text-gray-900 dark:text-gray-100">Alan Turing</span>
        <span class="truncate text-xs text-gray-500 dark:text-gray-400">alan@adysre.com</span>
      </span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={\`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100 \${
        size === 'sm' ? 'h-[1.125rem] w-[1.125rem] text-[0.5rem]' : 'h-7 w-7 text-[0.625rem]'
      }\`}
    >
      {initials(name)}
    </span>
  );
}

export function PeoplePicker({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (person) => person.name.toLowerCase().includes(q) || person.email.toLowerCase().includes(q),
    );
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((person) => value.includes(person.id));
  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(id) {
    onSelect?.(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'Backspace' && !query && value.length) {
      event.preventDefault();
      onSelect?.(value.slice(0, -1));
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const person = results[clamped];
      if (person) toggleValue(person.id);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + results.length) % results.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={\`\${baseId}-input\`}>
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((person) => (
          <span
            key={person.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-0.5 pl-0.5 pr-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            <Avatar name={person.name} size="sm" />
            {person.name}
            <button
              type="button"
              aria-label={\`Remove \${person.name}\`}
              onClick={() => {
                toggleValue(person.id);
                inputRef.current?.focus();
              }}
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-gray-700/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-gray-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg className="h-[0.5625rem] w-[0.5625rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-status\`}
          autoComplete="off"
          placeholder="Search people…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-status\`} role="status" aria-live="polite">
        {results.length
          ? \`\${results.length} \${results.length === 1 ? 'person' : 'people'} available.\`
          : 'Nobody matches.'}{' '}
        {value.length} selected.
      </p>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li role="presentation" className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
              Nobody matches “{query}”.
            </li>
          ) : (
            results.map((person, index) => {
              const isActive = index === clamped;
              const checked = value.includes(person.id);
              return (
                <li
                  key={person.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(person.id);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-1.5 pl-1 pr-2 \${
                    isActive ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-7 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <Avatar name={person.name} />
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm text-gray-900 dark:text-gray-100">{person.name}</span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">{person.email}</span>
                  </span>
                  {checked && (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface Person {
  id: string;
  name: string;
  email: string;
}

interface PeoplePickerProps {
  label: string;
  items: Person[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={\`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100 \${
        size === 'sm' ? 'h-[1.125rem] w-[1.125rem] text-[0.5rem]' : 'h-7 w-7 text-[0.625rem]'
      }\`}
    >
      {initials(name)}
    </span>
  );
}

export function PeoplePicker({ label, items, value, onSelect, disabled = false }: PeoplePickerProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (person) => person.name.toLowerCase().includes(q) || person.email.toLowerCase().includes(q),
    );
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((person) => value.includes(person.id));
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(id: string): void {
    onSelect?.(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'Backspace' && !query && value.length) {
      event.preventDefault();
      onSelect?.(value.slice(0, -1));
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const person = results[clamped];
      if (person) toggleValue(person.id);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + results.length) % results.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((person) => (
          <span
            key={person.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-0.5 pl-0.5 pr-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            <Avatar name={person.name} size="sm" />
            {person.name}
            <button
              type="button"
              aria-label={\`Remove \${person.name}\`}
              onClick={() => {
                toggleValue(person.id);
                inputRef.current?.focus();
              }}
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-gray-700/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-gray-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg
                className="h-[0.5625rem] w-[0.5625rem]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-status\`}
          autoComplete="off"
          placeholder="Search people…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {results.length
          ? \`\${results.length} \${results.length === 1 ? 'person' : 'people'} available.\`
          : 'Nobody matches.'}{' '}
        {value.length} selected.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Nobody matches “{query}”.
            </li>
          ) : (
            results.map((person, index) => {
              const isActive = index === clamped;
              const checked = value.includes(person.id);
              return (
                <li
                  key={person.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(person.id);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-1.5 pl-1 pr-2 \${
                    isActive ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-7 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <Avatar name={person.name} />
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm text-gray-900 dark:text-gray-100">
                      {person.name}
                    </span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {person.email}
                    </span>
                  </span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Person {
  id: string;
  name: string;
  /** Not decoration - this is how two people with the same name are told
   *  apart, so it is real text in the row and the filter searches it. */
  email: string;
}

export interface PeoplePickerProps {
  label: string;
  items: Person[];
  /** Selected person ids. */
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Initials rather than a photo URL: an avatar that cannot 404, cannot leak a
 * request to a third party, and cannot shift the layout when it loads late.
 *
 * aria-hidden without exception. The avatar sits directly beside the name it
 * depicts, so any alt text at all produces "Ada Lovelace Ada Lovelace".
 */
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={\`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100 \${
        size === 'sm' ? 'h-[1.125rem] w-[1.125rem] text-[0.5rem]' : 'h-7 w-7 text-[0.625rem]'
      }\`}
    >
      {initials(name)}
    </span>
  );
}

export function PeoplePicker({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: PeoplePickerProps): JSX.Element {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Name AND email. "@adysre" finds every colleague; "chen" finds the one you
    // meant. Searching the name alone makes the email decoration after all.
    return items.filter(
      (person) => person.name.toLowerCase().includes(q) || person.email.toLowerCase().includes(q),
    );
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((person) => value.includes(person.id));
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(id: string): void {
    onSelect?.(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    // Only on an EMPTY query - otherwise Backspace is editing text and taking
    // it away would be indefensible.
    if (event.key === 'Backspace' && !query && value.length) {
      event.preventDefault();
      onSelect?.(value.slice(0, -1));
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const person = results[clamped];
      if (person) toggleValue(person.id);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((clamped + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((clamped - 1 + results.length) % results.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((person) => (
          <span
            key={person.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-0.5 pl-0.5 pr-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            <Avatar name={person.name} size="sm" />
            {person.name}
            <button
              type="button"
              aria-label={\`Remove \${person.name}\`}
              onClick={() => {
                toggleValue(person.id);
                // The chip is about to unmount - hand focus back to the input,
                // which is where the user was going anyway.
                inputRef.current?.focus();
              }}
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-gray-700/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:hover:bg-gray-200/20 dark:focus-visible:outline-blue-400"
            >
              <svg
                className="h-[0.5625rem] w-[0.5625rem]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-status\`}
          autoComplete="off"
          placeholder="Search people…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {results.length
          ? \`\${results.length} \${results.length === 1 ? 'person' : 'people'} available.\`
          : 'Nobody matches.'}{' '}
        {value.length} selected.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Nobody matches “{query}”.
            </li>
          ) : (
            results.map((person, index) => {
              const isActive = index === clamped;
              const checked = value.includes(person.id);
              return (
                // The row's accessible name comes out as "Ada Lovelace
                // ada@adysre.com" - exactly what a person would say aloud to
                // disambiguate.
                <li
                  key={person.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(person.id);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-1.5 pl-1 pr-2 \${
                    isActive ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-7 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <Avatar name={person.name} />
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm text-gray-900 dark:text-gray-100">
                      {person.name}
                    </span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {person.email}
                    </span>
                  </span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'multiselect-search-keyboard',
    category: 'forms',
    tags: ['multiselect', 'keyboard', 'combobox', 'shortcuts', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-03',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 720, copies: 169, downloads: 47 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'SelectItem[]', required: true, descriptionKey: 'items' },
      { name: 'value', type: 'string[]', required: true, descriptionKey: 'value' },
      { name: 'onSelect', type: '(next: string[]) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  The full keyboard contract, written out. Every other combobox in this category
  implements a subset; this one is the reference.

    ↓ / ↑        move the highlight, wrapping at both ends
    Home / End   first / last result - absolute, not per screenful
    Enter        toggle the highlighted row; the list stays open
    Escape       TWO stages: clear the query first, close only if empty
    Backspace    on an empty query, remove the last chip
    Tab          close and move on - never trap focus

  Two of those deserve their reasons spelled out:

  ESCAPE IS TWO-STAGE. One press to undo the filter, a second to leave. A single
  Escape that closes a popup holding a half-typed query throws away work to
  perform a lesser action - the user wanted their list back, not their field
  gone. Every good picker on the platform does this and no spec mandates it.

  WRAPPING. ↓ at the bottom lands on the top. In a list you filter down to two
  rows, wrapping is the difference between a flick and a count.

  The shortcuts are also PRINTED, in a legend wired up with aria-describedby. An
  undiscoverable shortcut is a shortcut that does not exist.
-->
<div class="mkeys">
  <label class="mkeys__label" for="mkeys-input">Commands</label>
  <div class="mkeys__control">
    <span class="mkeys__chip">Deploy</span>
    <input
      class="mkeys__input"
      id="mkeys-input"
      type="text"
      role="combobox"
      aria-expanded="false"
      aria-controls="mkeys-listbox"
      aria-autocomplete="list"
      aria-describedby="mkeys-help mkeys-status"
      autocomplete="off"
      placeholder="Type to filter…"
    />
  </div>
  <p class="mkeys__help" id="mkeys-help">
    <kbd class="mkeys__kbd">↑</kbd><kbd class="mkeys__kbd">↓</kbd> move ·
    <kbd class="mkeys__kbd">Home</kbd><kbd class="mkeys__kbd">End</kbd> jump ·
    <kbd class="mkeys__kbd">Enter</kbd> toggle ·
    <kbd class="mkeys__kbd">Esc</kbd> clear, then close ·
    <kbd class="mkeys__kbd">⌫</kbd> remove last
  </p>
  <p class="mkeys__status" id="mkeys-status" role="status" aria-live="polite">6 commands available. 1 selected.</p>
  <ul class="mkeys__listbox" id="mkeys-listbox" role="listbox" aria-multiselectable="true" aria-label="Commands" hidden></ul>
</div>

<script>
  document.querySelectorAll('.mkeys').forEach(function (root) {
    var DATA = ['Build', 'Deploy', 'Rollback', 'Restart', 'Scale up', 'Scale down'];
    var input = root.querySelector('.mkeys__input');
    var listbox = root.querySelector('.mkeys__listbox');
    var control = root.querySelector('.mkeys__control');
    var status = root.querySelector('.mkeys__status');

    var chosen = ['Deploy'];
    var results = DATA.slice();
    var active = 0;

    function optionId(index) { return 'mkeys-opt-' + index; }

    function renderChips() {
      Array.prototype.slice.call(root.querySelectorAll('.mkeys__chip')).forEach(function (c) { c.remove(); });
      chosen.forEach(function (name) {
        var chip = document.createElement('span');
        chip.className = 'mkeys__chip';
        chip.textContent = name;
        control.insertBefore(chip, input);
      });
    }

    function renderList() {
      var q = input.value.trim().toLowerCase();
      results = DATA.filter(function (item) { return item.toLowerCase().includes(q); });
      if (active >= results.length) active = Math.max(0, results.length - 1);

      listbox.innerHTML = '';
      if (!results.length) {
        var empty = document.createElement('li');
        empty.setAttribute('role', 'presentation');
        empty.className = 'mkeys__empty';
        empty.textContent = 'No commands match “' + input.value + '”.';
        listbox.appendChild(empty);
      } else {
        results.forEach(function (name, index) {
          var li = document.createElement('li');
          li.id = optionId(index);
          li.className = 'mkeys__option' + (index === active ? ' mkeys__option--active' : '');
          li.setAttribute('role', 'option');
          li.setAttribute('aria-selected', String(chosen.includes(name)));
          li.innerHTML =
            '<span class="mkeys__marker" aria-hidden="true"></span>' +
            '<span class="mkeys__option-label">' + name + '</span>' +
            '<span class="mkeys__tick" aria-hidden="true">✓</span>';
          li.addEventListener('mousedown', function (event) {
            event.preventDefault();
            toggle(name);
          });
          li.addEventListener('mousemove', function () { active = index; renderList(); });
          listbox.appendChild(li);
        });
      }

      listbox.setAttribute('aria-activedescendant', results.length ? optionId(active) : '');
      listbox.hidden = input.getAttribute('aria-expanded') !== 'true';
      status.textContent =
        (results.length
          ? results.length + (results.length === 1 ? ' command' : ' commands') + ' available.'
          : 'No commands match.') + ' ' + chosen.length + ' selected.';
      if (results[active]) {
        var el = listbox.querySelector('#' + optionId(active));
        if (el) el.scrollIntoView({ block: 'nearest' });
      }
    }

    function render() { renderChips(); renderList(); }

    function toggle(name) {
      var at = chosen.indexOf(name);
      if (at === -1) chosen.push(name);
      else chosen.splice(at, 1);
      render();
    }

    function setOpen(open) {
      input.setAttribute('aria-expanded', String(open));
      listbox.hidden = !open;
      if (open) renderList();
    }

    input.addEventListener('focus', function () { setOpen(true); });
    input.addEventListener('input', function () {
      active = 0;
      setOpen(true);
    });

    input.addEventListener('keydown', function (event) {
      var key = event.key;
      var open = input.getAttribute('aria-expanded') === 'true';

      if (key === 'Escape') {
        event.preventDefault();
        // Stage one: give the list back. Stage two: leave.
        if (input.value) {
          input.value = '';
          active = 0;
          renderList();
        } else {
          setOpen(false);
        }
        return;
      }

      if (key === 'Tab') {
        // Never swallowed - the browser is moving focus on and stealing it back
        // would trap the user in the control.
        setOpen(false);
        return;
      }

      if (key === 'Backspace' && !input.value && chosen.length) {
        event.preventDefault();
        chosen.pop();
        render();
        return;
      }

      if (!open && (key === 'ArrowDown' || key === 'ArrowUp')) {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (!open || !results.length) return;

      if (key === 'Enter') {
        event.preventDefault();
        toggle(results[active]);
        return;
      }

      var next = active;
      if (key === 'ArrowDown') next = active + 1;
      else if (key === 'ArrowUp') next = active - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = results.length - 1;
      else return;

      event.preventDefault();
      // Wrapping: ↓ at the bottom lands on the top. In a two-row filtered list
      // that is the difference between a flick and a count.
      active = (next + results.length) % results.length;
      renderList();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });

    render();
  });
</script>`,
      css: `.mkeys {
  position: relative;
}

.mkeys__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.mkeys__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
}

.mkeys__control:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.mkeys__chip {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background-color: #eff6ff;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 500;
}

.mkeys__input {
  flex: 1;
  min-width: 7rem;
  padding: 0.25rem;
  border: 0;
  background: transparent;
  color: #111827;
  font-size: 0.875rem;
}

.mkeys__input::placeholder {
  color: #6b7280;
}

.mkeys__input:focus {
  outline: none;
}

/*
 * The printed shortcuts. Not decoration: an undiscoverable shortcut is a
 * shortcut that does not exist, and this is the only thing standing between
 * Home/End and nobody ever pressing them.
 */
.mkeys__help {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin: 0.375rem 0 0;
  color: #6b7280;
  font-size: 0.6875rem;
}

.mkeys__kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.125rem;
  padding: 0 0.25rem;
  border: 1px solid #d1d5db;
  border-bottom-width: 2px;
  border-radius: 0.25rem;
  background-color: #f9fafb;
  color: #374151;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.625rem;
  line-height: 1.125rem;
}

.mkeys__status {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.mkeys__listbox {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.mkeys__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.mkeys__marker {
  width: 0.125rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: transparent;
}

.mkeys__option--active {
  background-color: #f3f4f6;
  color: #111827;
}

.mkeys__option--active .mkeys__marker {
  background-color: #2563eb;
}

.mkeys__tick {
  color: #2563eb;
  font-weight: 700;
  visibility: hidden;
}

.mkeys__option[aria-selected='true'] .mkeys__tick {
  visibility: visible;
}

.mkeys__option-label {
  flex: 1;
}

.mkeys__empty {
  padding: 0.75rem 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
}

@media (prefers-color-scheme: dark) {
  .mkeys__label {
    color: #d1d5db;
  }

  .mkeys__control {
    border-color: #374151;
    background-color: #111827;
  }

  .mkeys__control:focus-within {
    outline-color: #60a5fa;
  }

  .mkeys__chip {
    background-color: #1e3a8a;
    color: #bfdbfe;
  }

  .mkeys__input {
    color: #f3f4f6;
  }

  .mkeys__input::placeholder,
  .mkeys__help,
  .mkeys__status,
  .mkeys__empty {
    color: #9ca3af;
  }

  .mkeys__kbd {
    border-color: #4b5563;
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .mkeys__listbox {
    border-color: #374151;
    background-color: #111827;
  }

  .mkeys__option {
    color: #d1d5db;
  }

  .mkeys__option--active {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .mkeys__option--active .mkeys__marker {
    background-color: #60a5fa;
  }

  .mkeys__tick {
    color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative">
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="mkeys-input">Commands</label>
  <div class="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
    <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">Deploy</span>
    <input
      id="mkeys-input"
      type="text"
      role="combobox"
      aria-expanded="true"
      aria-controls="mkeys-listbox"
      aria-autocomplete="list"
      aria-activedescendant="mkeys-opt-0"
      aria-describedby="mkeys-help mkeys-status"
      autocomplete="off"
      placeholder="Type to filter…"
      class="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-400"
    />
  </div>
  <p class="mt-1.5 flex flex-wrap items-center gap-1 text-[0.6875rem] text-gray-500 dark:text-gray-400" id="mkeys-help">
    <kbd class="inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">↑</kbd>
    <kbd class="inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">↓</kbd> move ·
    <kbd class="inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">Home</kbd>
    <kbd class="inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">End</kbd> jump ·
    <kbd class="inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">Enter</kbd> toggle ·
    <kbd class="inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">Esc</kbd> clear, then close ·
    <kbd class="inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">⌫</kbd> remove last
  </p>
  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400" id="mkeys-status" role="status" aria-live="polite">6 commands available. 1 selected.</p>
  <ul
    id="mkeys-listbox"
    role="listbox"
    aria-multiselectable="true"
    aria-label="Commands"
    class="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li id="mkeys-opt-0" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 py-2 pl-1 pr-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      <span class="flex-1">Build</span>
    </li>
    <li id="mkeys-opt-1" role="option" aria-selected="true" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Deploy</span>
      <span class="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
    </li>
    <li id="mkeys-opt-2" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Rollback</span>
    </li>
    <li id="mkeys-opt-3" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Restart</span>
    </li>
    <li id="mkeys-opt-4" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Scale up</span>
    </li>
    <li id="mkeys-opt-5" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm text-gray-700 dark:text-gray-300">
      <span class="h-4 w-0.5 shrink-0 rounded-full bg-transparent" aria-hidden="true"></span>
      <span class="flex-1">Scale down</span>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

const KBD =
  'inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

export function MultiselectSearchKeyboard({ label, items, value, onSelect, disabled = false }) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const optionRefs = useRef([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((item) => value.includes(item.value));
  const optionId = (index) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[clamped]?.scrollIntoView({ block: 'nearest' });
  }, [open, clamped]);

  function toggleValue(next) {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        // Two stages: give the list back, then leave.
        if (query) {
          setQuery('');
          setActiveIndex(0);
        } else {
          setOpen(false);
        }
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'Backspace':
        if (query || !value.length) return;
        event.preventDefault();
        onSelect?.(value.slice(0, -1));
        return;
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      case 'Home':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(results.length - 1);
        return;
      case 'Enter': {
        if (!open || !results.length) return;
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={\`\${baseId}-input\`}>
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
          </span>
        ))}
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-help \${baseId}-status\`}
          autoComplete="off"
          placeholder="Type to filter…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
      <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[0.6875rem] text-gray-500 dark:text-gray-400" id={\`\${baseId}-help\`}>
        <kbd className={KBD}>↑</kbd>
        <kbd className={KBD}>↓</kbd> move · <kbd className={KBD}>Home</kbd>
        <kbd className={KBD}>End</kbd> jump · <kbd className={KBD}>Enter</kbd> toggle ·{' '}
        <kbd className={KBD}>Esc</kbd> clear, then close · <kbd className={KBD}>⌫</kbd> remove last
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400" id={\`\${baseId}-status\`} role="status" aria-live="polite">
        {results.length
          ? \`\${results.length} \${results.length === 1 ? 'command' : 'commands'} available.\`
          : 'No commands match.'}{' '}
        {value.length} selected.
      </p>
      {open && (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li role="presentation" className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
              No commands match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(item.value);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {checked && (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface SelectItem {
  value: string;
  label: string;
}

interface MultiselectSearchKeyboardProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

const KBD =
  'inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

export function MultiselectSearchKeyboard({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchKeyboardProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((item) => value.includes(item.value));
  const optionId = (index: number) => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[clamped]?.scrollIntoView({ block: 'nearest' });
  }, [open, clamped]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        if (query) {
          setQuery('');
          setActiveIndex(0);
        } else {
          setOpen(false);
        }
        return;
      case 'Tab':
        setOpen(false);
        return;
      case 'Backspace':
        if (query || !value.length) return;
        event.preventDefault();
        onSelect?.(value.slice(0, -1));
        return;
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      case 'Home':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(results.length - 1);
        return;
      case 'Enter': {
        if (!open || !results.length) return;
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
          </span>
        ))}
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          aria-describedby={\`\${baseId}-help \${baseId}-status\`}
          autoComplete="off"
          placeholder="Type to filter…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
      <p
        className="mt-1.5 flex flex-wrap items-center gap-1 text-[0.6875rem] text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-help\`}
      >
        <kbd className={KBD}>↑</kbd>
        <kbd className={KBD}>↓</kbd> move · <kbd className={KBD}>Home</kbd>
        <kbd className={KBD}>End</kbd> jump · <kbd className={KBD}>Enter</kbd> toggle ·{' '}
        <kbd className={KBD}>Esc</kbd> clear, then close · <kbd className={KBD}>⌫</kbd> remove last
      </p>
      <p
        className="mt-1 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {results.length
          ? \`\${results.length} \${results.length === 1 ? 'command' : 'commands'} available.\`
          : 'No commands match.'}{' '}
        {value.length} selected.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No commands match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(item.value);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SelectItem {
  value: string;
  label: string;
}

export interface MultiselectSearchKeyboardProps {
  label: string;
  items: SelectItem[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
}

const KBD =
  'inline-flex min-w-[1.125rem] items-center justify-center rounded border border-b-2 border-gray-300 bg-gray-50 px-1 font-mono text-[0.625rem] leading-[1.125rem] text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

/**
 * The complete keyboard contract for a multi-select combobox:
 *
 *   ↓ / ↑        move the highlight, wrapping at both ends
 *   Home / End   first / last result - absolute, not per screenful
 *   Enter        toggle the highlighted row; the popup stays open
 *   Escape       two stages - clear the query, then close
 *   Backspace    on an empty query, remove the last chip
 *   Tab          close and move on; never trapped
 *
 * DOM focus never leaves the input. Every one of these moves
 * aria-activedescendant instead - move real focus into the list and the user
 * cannot type another character.
 */
export function MultiselectSearchKeyboard({
  label,
  items,
  value,
  onSelect,
  disabled = false,
}: MultiselectSearchKeyboardProps): JSX.Element {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const clamped = Math.min(activeIndex, Math.max(0, results.length - 1));
  const selected = items.filter((item) => value.includes(item.value));
  const optionId = (index: number): string => \`\${baseId}-option-\${index}\`;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Home/End are worthless if the row they select is off screen.
  useEffect(() => {
    if (open) optionRefs.current[clamped]?.scrollIntoView({ block: 'nearest' });
  }, [open, clamped]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      /**
       * TWO-STAGE ESCAPE. One press gives the full list back; a second leaves.
       *
       * A single Escape that closes a popup holding a half-typed query throws
       * away work to perform the lesser of the two actions - the user wanted
       * their list back, not their field gone. No spec mandates this; every
       * picker worth using does it anyway.
       */
      case 'Escape':
        event.preventDefault();
        if (query) {
          setQuery('');
          setActiveIndex(0);
        } else {
          setOpen(false);
        }
        return;
      // Never preventDefault'd: the browser is moving focus on, and stealing it
      // back is how a combobox becomes a keyboard trap.
      case 'Tab':
        setOpen(false);
        return;
      // Only on an empty query - otherwise Backspace is editing text, and
      // eating a chip instead would be indefensible.
      case 'Backspace':
        if (query || !value.length) return;
        event.preventDefault();
        onSelect?.(value.slice(0, -1));
        return;
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        // Wrapping. ↓ at the bottom lands on the top: in a list filtered down
        // to two rows that is the difference between a flick and a count.
        else if (results.length) setActiveIndex((clamped + 1) % results.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) setActiveIndex((clamped - 1 + results.length) % results.length);
        return;
      // Absolute, not per screenful - End means the last result, not the bottom
      // of the visible box.
      case 'Home':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case 'End':
        if (!open || !results.length) return;
        event.preventDefault();
        setActiveIndex(results.length - 1);
        return;
      // Toggles and leaves the popup open - it is multi-select, and closing on
      // every pick makes four choices cost four round trips.
      case 'Enter': {
        if (!open || !results.length) return;
        event.preventDefault();
        const item = results[clamped];
        if (item) toggleValue(item.value);
        return;
      }
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={\`\${baseId}-input\`}
      >
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:outline-blue-400">
        {selected.map((item) => (
          <span
            key={item.value}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {item.label}
          </span>
        ))}
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={\`\${baseId}-listbox\`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? optionId(clamped) : undefined}
          // Both: the printed shortcuts AND the live result count.
          aria-describedby={\`\${baseId}-help \${baseId}-status\`}
          autoComplete="off"
          placeholder="Type to filter…"
          disabled={disabled}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="min-w-28 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
      {/*
        The shortcuts, printed. This is not decoration - an undiscoverable
        shortcut is a shortcut that does not exist, and this legend is the only
        thing standing between Home/End and nobody ever pressing them.
      */}
      <p
        className="mt-1.5 flex flex-wrap items-center gap-1 text-[0.6875rem] text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-help\`}
      >
        <kbd className={KBD}>↑</kbd>
        <kbd className={KBD}>↓</kbd> move · <kbd className={KBD}>Home</kbd>
        <kbd className={KBD}>End</kbd> jump · <kbd className={KBD}>Enter</kbd> toggle ·{' '}
        <kbd className={KBD}>Esc</kbd> clear, then close · <kbd className={KBD}>⌫</kbd> remove last
      </p>
      <p
        className="mt-1 text-xs text-gray-500 dark:text-gray-400"
        id={\`\${baseId}-status\`}
        role="status"
        aria-live="polite"
      >
        {results.length
          ? \`\${results.length} \${results.length === 1 ? 'command' : 'commands'} available.\`
          : 'No commands match.'}{' '}
        {value.length} selected.
      </p>
      {open ? (
        <ul
          id={\`\${baseId}-listbox\`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No commands match “{query}”.
            </li>
          ) : (
            results.map((item, index) => {
              const isActive = index === clamped;
              const checked = value.includes(item.value);
              return (
                <li
                  key={item.value}
                  id={optionId(index)}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(item.value);
                  }}
                  className={\`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 text-sm \${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }\`}
                >
                  <span
                    aria-hidden="true"
                    className={\`h-4 w-0.5 shrink-0 rounded-full \${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }\`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
];
