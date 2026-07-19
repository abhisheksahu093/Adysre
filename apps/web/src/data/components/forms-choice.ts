import type { ComponentEntry } from './types';

/**
 * Forms - choice controls (checkbox and radio).
 *
 * One rule runs through all ten entries and is worth stating once: every one of
 * them is a real `<input type="checkbox">` or `<input type="radio">` underneath,
 * even the ones that look like switches, cards or segmented controls. Those are
 * a visually-hidden input plus a styled sibling driven by `:checked` - never a
 * div with a click handler. The native input is what makes them tabbable,
 * form-submittable, and correctly announced; a `role="switch"` div has to
 * reimplement all three and still loses form submission.
 *
 * `category` is 'forms' for every entry - the file split is by control type, the
 * taxonomy is not.
 */
export const formsChoiceComponents: ComponentEntry[] = [
  {
    slug: 'checkbox-basic',
    category: 'forms',
    tags: ['checkbox', 'form', 'label', 'helper', 'accessible'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-06',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 3120, copies: 940, downloads: 214 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'text', labelKey: 'text' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Three elements, three links between them. \`for\` matches \`id\`, so clicking the
  text toggles the box - that is also what gives the control a target far larger
  than the 20px square. \`aria-describedby\` points at the hint, so a screen
  reader reads it after the label instead of leaving it orphaned on screen.
-->
<div class="checkbox-field">
  <input
    class="checkbox-field__input"
    type="checkbox"
    id="newsletter"
    name="newsletter"
    aria-describedby="newsletter-hint"
    checked
  />
  <div class="checkbox-field__text">
    <label class="checkbox-field__label" for="newsletter">Email me product updates</label>
    <p class="checkbox-field__hint" id="newsletter-hint">
      About one email a month. Unsubscribe at any time.
    </p>
  </div>
</div>`,
      css: `.checkbox-field {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.checkbox-field__input {
  /* 1.25rem is the glyph; the label beside it carries the rest of the target,
     which is why the label must stay clickable rather than being a plain span. */
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.125rem 0 0;
  flex-shrink: 0;
  /* accent-color keeps the platform's own checkmark. That matters: the checked
     state is then carried by a glyph, not by colour alone. */
  accent-color: #2563eb;
  cursor: pointer;
}

.checkbox-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.checkbox-field__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkbox-field__label {
  display: block;
  min-height: 1.5rem;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
}

.checkbox-field__hint {
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  color: #4b5563;
}

/*
 * Nothing here paints its own surface - the label and hint sit directly on the
 * page background, so both have to be re-tuned to hold 4.5:1 on a dark one. The
 * accent is lifted a step for the same reason.
 */
@media (prefers-color-scheme: dark) {
  .checkbox-field__input {
    accent-color: #3b82f6;
  }

  .checkbox-field__input:focus-visible {
    outline-color: #60a5fa;
  }

  .checkbox-field__label {
    color: #f3f4f6;
  }

  .checkbox-field__hint {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex items-start gap-2.5">
  <input
    type="checkbox"
    id="newsletter"
    name="newsletter"
    aria-describedby="newsletter-hint"
    checked
    class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  />
  <div>
    <label
      for="newsletter"
      class="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
    >
      Email me product updates
    </label>
    <p id="newsletter-hint" class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
      About one email a month. Unsubscribe at any time.
    </p>
  </div>
</div>`,
      react: `export function CheckboxField({ id, label, hint, ...props }) {
  const hintId = hint ? id + '-hint' : undefined;

  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        aria-describedby={hintId}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        {...props}
      />
      <div>
        <label
          htmlFor={id}
          className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
        {hint && (
          <p id={hintId} className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}`,
      nextjs: `import type { InputHTMLAttributes } from 'react';

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  id: string;
  label: string;
  hint?: string;
}

// No 'use client': an uncontrolled checkbox holds its state in the DOM, so this
// renders as a Server Component inside a form. Add 'use client' only if you lift
// \`checked\` into React state.
export function CheckboxField({ id, label, hint, ...props }: CheckboxFieldProps) {
  const hintId = hint ? id + '-hint' : undefined;

  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        aria-describedby={hintId}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        {...props}
      />
      <div>
        <label
          htmlFor={id}
          className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
        {hint ? (
          <p id={hintId} className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import type { InputHTMLAttributes } from 'react';

export interface CheckboxFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  /** Required - it is what \`htmlFor\` and \`aria-describedby\` are derived from. */
  id: string;
  label: string;
  hint?: string;
}

export function CheckboxField({ id, label, hint, ...props }: CheckboxFieldProps): JSX.Element {
  const hintId = hint ? id + '-hint' : undefined;

  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        aria-describedby={hintId}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        {...props}
      />
      <div>
        <label
          htmlFor={id}
          className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
        {hint ? (
          <p id={hintId} className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'checkbox-card',
    category: 'forms',
    tags: ['checkbox', 'card', 'selectable', 'addons', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-21',
    updatedAt: '2026-06-29',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1980, copies: 512, downloads: 143 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The whole card is the target, and it is still a real checkbox: the card IS the
  <label>, and the input inside it is visually hidden - clipped, not
  \`display: none\`, which would drop it from the tab order. Keyboard, form
  submission and the screen-reader announcement all come from the input for free.

  The checked state is not carried by the blue tint: the box on the left fills in
  and shows a checkmark, so it survives greyscale and colour blindness.
-->
<label class="choice-card" for="addon-analytics">
  <input
    class="choice-card__input"
    type="checkbox"
    id="addon-analytics"
    name="addons"
    value="analytics"
    checked
  />
  <span class="choice-card__box" aria-hidden="true">
    <svg class="choice-card__tick" viewBox="0 0 20 20" fill="currentColor" focusable="false">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  </span>
  <span class="choice-card__body">
    <span class="choice-card__title">Advanced analytics</span>
    <span class="choice-card__desc">Funnels, retention and cohort reports.</span>
  </span>
</label>`,
      css: `.choice-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;
}

/*
 * Clipped, not hidden. \`display: none\` or \`visibility: hidden\` would remove the
 * input from the tab order and from the accessibility tree - the card would then
 * be a picture of a checkbox rather than one.
 */
.choice-card__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.choice-card:hover {
  background-color: #f9fafb;
}

.choice-card:has(.choice-card__input:checked) {
  border-color: #2563eb;
  background-color: #eff6ff;
}

/* The ring has to live on the card, because the input it belongs to is 1px. */
.choice-card:has(.choice-card__input:focus-visible) {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.choice-card:has(.choice-card__input:disabled) {
  cursor: not-allowed;
  opacity: 0.5;
}

.choice-card__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  border: 1px solid #9ca3af;
  border-radius: 0.25rem;
  background-color: #fff;
  color: #fff;
}

.choice-card__tick {
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0;
}

.choice-card__input:checked ~ .choice-card__box {
  border-color: #2563eb;
  background-color: #2563eb;
}

.choice-card__input:checked ~ .choice-card__box .choice-card__tick {
  opacity: 1;
}

.choice-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.choice-card__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.choice-card__desc {
  font-size: 0.75rem;
  color: #4b5563;
}

/*
 * The card paints its own surface, so dark mode is a full re-skin rather than a
 * label tweak - and the checked tint has to be dark enough that white body text
 * still clears 4.5:1 on it.
 */
@media (prefers-color-scheme: dark) {
  .choice-card {
    border-color: #374151;
    background-color: #111827;
  }

  .choice-card:hover {
    background-color: #1f2937;
  }

  .choice-card:has(.choice-card__input:checked) {
    border-color: #3b82f6;
    background-color: #172554;
  }

  .choice-card:has(.choice-card__input:focus-visible) {
    outline-color: #60a5fa;
  }

  .choice-card__box {
    border-color: #6b7280;
    background-color: #111827;
  }

  .choice-card__input:checked ~ .choice-card__box {
    border-color: #3b82f6;
    background-color: #3b82f6;
  }

  .choice-card__title {
    color: #f3f4f6;
  }

  .choice-card__desc {
    color: #9ca3af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .choice-card {
    transition: none;
  }
}`,
      tailwind: `<label
  for="addon-analytics"
  class="relative flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
>
  <input type="checkbox" id="addon-analytics" name="addons" value="analytics" checked class="peer sr-only" />
  <span
    aria-hidden="true"
    class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-400 bg-white text-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:[&>svg]:opacity-100 dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500"
  >
    <svg class="h-3.5 w-3.5 opacity-0" viewBox="0 0 20 20" fill="currentColor" focusable="false">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  </span>
  <span class="flex flex-col gap-0.5">
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Advanced analytics</span>
    <span class="text-xs text-gray-600 dark:text-gray-400">Funnels, retention and cohort reports.</span>
  </span>
</label>`,
      react: `export function CheckboxCard({ id, title, description, ...props }) {
  return (
    <label
      htmlFor={id}
      className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
    >
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-400 bg-white text-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:[&>svg]:opacity-100 dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500"
      >
        <svg className="h-3.5 w-3.5 opacity-0" viewBox="0 0 20 20" fill="currentColor" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{description}</span>
      </span>
    </label>
  );
}`,
      nextjs: `import type { InputHTMLAttributes } from 'react';

interface CheckboxCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  id: string;
  title: string;
  description: string;
}

// Stateless and uncontrolled - no 'use client'. The tint, the tick and the focus
// ring are all \`:checked\`/\`:focus-visible\` reacting to the native input, so React
// never has to know the card was clicked.
export function CheckboxCard({ id, title, description, ...props }: CheckboxCardProps) {
  return (
    <label
      htmlFor={id}
      className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
    >
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-400 bg-white text-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:[&>svg]:opacity-100 dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500"
      >
        <svg className="h-3.5 w-3.5 opacity-0" viewBox="0 0 20 20" fill="currentColor" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{description}</span>
      </span>
    </label>
  );
}`,
      typescript: `import type { InputHTMLAttributes } from 'react';

export interface CheckboxCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  id: string;
  title: string;
  description: string;
}

export function CheckboxCard({
  id,
  title,
  description,
  ...props
}: CheckboxCardProps): JSX.Element {
  return (
    <label
      htmlFor={id}
      className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
    >
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-400 bg-white text-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:[&>svg]:opacity-100 dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500"
      >
        <svg className="h-3.5 w-3.5 opacity-0" viewBox="0 0 20 20" fill="currentColor" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{description}</span>
      </span>
    </label>
  );
}`,
    },
  },
  {
    slug: 'checkbox-switch',
    category: 'forms',
    tags: ['switch', 'toggle', 'checkbox', 'settings', 'accessible'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-04',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.3.0',
    featured: true,
    stats: { views: 4310, copies: 1288, downloads: 372 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A switch is a checkbox with a different picture on top of it - nothing more.
  \`role="switch"\` is allowed on \`input[type=checkbox]\` and changes the
  announcement from "checked" to "on/off"; it rides on the real input, which is
  what keeps Space, form submission and the label association intact. Putting
  \`role="switch"\` on a div and rebuilding those by hand is a downgrade, not a
  technique.

  The state is carried by the thumb's POSITION as well as the track colour, so it
  survives greyscale.
-->
<div class="switch-field">
  <label class="switch" for="two-factor">
    <input
      class="switch__input"
      type="checkbox"
      id="two-factor"
      name="two-factor"
      role="switch"
      aria-describedby="two-factor-hint"
      checked
    />
    <span class="switch__track" aria-hidden="true"></span>
    <span class="switch__label">Two-factor authentication</span>
  </label>
  <p class="switch__hint" id="two-factor-hint">
    Ask for a code from your authenticator app at every sign-in.
  </p>
</div>`,
      css: `.switch {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.switch__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 2.75rem x 1.5rem - the track alone clears the 24px minimum target. */
.switch__track {
  position: relative;
  flex-shrink: 0;
  width: 2.75rem;
  height: 1.5rem;
  margin-top: 0.125rem;
  border-radius: 9999px;
  background-color: #9ca3af;
  transition: background-color 150ms;
}

.switch__track::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 150ms;
}

.switch__input:checked ~ .switch__track {
  background-color: #2563eb;
}

.switch__input:checked ~ .switch__track::after {
  transform: translateX(1.25rem);
}

.switch__input:focus-visible ~ .switch__track {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.switch__input:disabled ~ .switch__track,
.switch__input:disabled ~ .switch__label {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch__label {
  min-height: 1.5rem;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.switch__hint {
  margin: 0.25rem 0 0;
  padding-left: 3.5rem;
  font-size: 0.75rem;
  color: #4b5563;
}

/*
 * The off track is the one thing that has to change: #9ca3af reads as grey on
 * white but is nearly invisible on #111827, so it steps down to a lighter grey
 * that keeps the track distinguishable from the page.
 */
@media (prefers-color-scheme: dark) {
  .switch__track {
    background-color: #4b5563;
  }

  .switch__input:checked ~ .switch__track {
    background-color: #3b82f6;
  }

  .switch__input:focus-visible ~ .switch__track {
    outline-color: #60a5fa;
  }

  .switch__label {
    color: #f3f4f6;
  }

  .switch__hint {
    color: #9ca3af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .switch__track,
  .switch__track::after {
    transition: none;
  }
}`,
      tailwind: `<div>
  <label for="two-factor" class="flex cursor-pointer items-start gap-3">
    <input
      type="checkbox"
      id="two-factor"
      name="two-factor"
      role="switch"
      aria-describedby="two-factor-hint"
      checked
      class="peer sr-only"
    />
    <span
      aria-hidden="true"
      class="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-400 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
    ></span>
    <span class="min-h-6 text-sm font-medium leading-6 text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
      Two-factor authentication
    </span>
  </label>
  <p id="two-factor-hint" class="mt-1 pl-14 text-xs text-gray-600 dark:text-gray-400">
    Ask for a code from your authenticator app at every sign-in.
  </p>
</div>`,
      react: `export function Switch({ id, label, hint, ...props }) {
  const hintId = hint ? id + '-hint' : undefined;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-describedby={hintId}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-400 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
        />
        <span className="min-h-6 text-sm font-medium leading-6 text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
          {label}
        </span>
      </label>
      {hint && (
        <p id={hintId} className="mt-1 pl-14 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `import type { InputHTMLAttributes } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'role'> {
  id: string;
  label: string;
  hint?: string;
}

// No 'use client' - the thumb slides on \`peer-checked:\`, which is CSS reacting to
// the native input. This is the whole argument for the sr-only-input pattern: the
// switch animates without a single line of JavaScript.
export function Switch({ id, label, hint, ...props }: SwitchProps) {
  const hintId = hint ? id + '-hint' : undefined;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          // Allowed on a checkbox input, and the reason it announces "on"/"off"
          // rather than "checked"/"not checked".
          role="switch"
          aria-describedby={hintId}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-400 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
        />
        <span className="min-h-6 text-sm font-medium leading-6 text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
          {label}
        </span>
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 pl-14 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import type { InputHTMLAttributes } from 'react';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'role'> {
  id: string;
  label: string;
  hint?: string;
}

export function Switch({ id, label, hint, ...props }: SwitchProps): JSX.Element {
  const hintId = hint ? id + '-hint' : undefined;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-describedby={hintId}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-400 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
        />
        <span className="min-h-6 text-sm font-medium leading-6 text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
          {label}
        </span>
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 pl-14 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'checkbox-indeterminate',
    category: 'forms',
    tags: ['checkbox', 'indeterminate', 'tree', 'parent', 'mixed'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-26',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1460, copies: 398, downloads: 121 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'multiple', labelKey: 'multiple' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  THE thing people get wrong: \`indeterminate\` is a DOM PROPERTY, not an
  attribute. There is no \`<input indeterminate>\` - writing it in the markup does
  nothing at all. It can only be set from script, which is why this snippet ships
  with one. \`aria-checked="mixed"\` is set alongside it so the state is announced
  and not merely drawn.

  A parent whose children are partly selected is neither checked nor unchecked,
  and the native mixed glyph (a dash, not a tick) is what says so.
-->
<fieldset class="tree">
  <legend class="tree__legend">Notify me about</legend>

  <label class="tree__row" for="notify-all">
    <input class="tree__input tree__input--parent" type="checkbox" id="notify-all" />
    <span class="tree__text">All activity</span>
  </label>

  <ul class="tree__children">
    <li>
      <label class="tree__row" for="notify-mentions">
        <input class="tree__input tree__input--child" type="checkbox" id="notify-mentions" name="notify" value="mentions" checked />
        <span class="tree__text">Mentions and replies</span>
      </label>
    </li>
    <li>
      <label class="tree__row" for="notify-assign">
        <input class="tree__input tree__input--child" type="checkbox" id="notify-assign" name="notify" value="assignments" />
        <span class="tree__text">Assignments</span>
      </label>
    </li>
    <li>
      <label class="tree__row" for="notify-deploys">
        <input class="tree__input tree__input--child" type="checkbox" id="notify-deploys" name="notify" value="deploys" />
        <span class="tree__text">Deploys</span>
      </label>
    </li>
  </ul>
</fieldset>

<script>
  document.querySelectorAll('.tree').forEach(function (root) {
    var parent = root.querySelector('.tree__input--parent');
    var children = Array.prototype.slice.call(root.querySelectorAll('.tree__input--child'));

    function syncParent() {
      var checked = children.filter(function (child) { return child.checked; }).length;
      var all = checked === children.length;
      var none = checked === 0;

      parent.checked = all;
      // Property, not attribute - parent.setAttribute('indeterminate', '') is a
      // no-op and is the bug this component exists to prevent.
      parent.indeterminate = !all && !none;
      parent.setAttribute('aria-checked', parent.indeterminate ? 'mixed' : String(all));
    }

    // Clicking the parent is all-or-nothing: from mixed it selects everything,
    // which is what every file manager on the platform does.
    parent.addEventListener('change', function () {
      children.forEach(function (child) { child.checked = parent.checked; });
      syncParent();
    });

    children.forEach(function (child) {
      child.addEventListener('change', syncParent);
    });

    syncParent();
  });
</script>`,
      css: `.tree {
  margin: 0;
  padding: 0;
  border: 0;
}

.tree__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.tree__row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 1.75rem;
  cursor: pointer;
}

.tree__input {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  /* Native rendering is the point here - the platform already draws a dash for
     the mixed state, and no hand-rolled box gets that for free. */
  accent-color: #2563eb;
  cursor: pointer;
}

.tree__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.tree__text {
  font-size: 0.875rem;
  color: #111827;
}

.tree__children {
  margin: 0.25rem 0 0;
  padding: 0 0 0 1.875rem;
  list-style: none;
  border-left: 1px solid #e5e7eb;
  margin-left: 0.5rem;
}

.tree__children .tree__text {
  color: #4b5563;
}

/* Text and the hairline guide sit on the page background, so both are re-tuned. */
@media (prefers-color-scheme: dark) {
  .tree__legend,
  .tree__text {
    color: #f3f4f6;
  }

  .tree__input {
    accent-color: #3b82f6;
  }

  .tree__input:focus-visible {
    outline-color: #60a5fa;
  }

  .tree__children {
    border-left-color: #374151;
  }

  .tree__children .tree__text {
    color: #9ca3af;
  }
}`,
      tailwind: `<fieldset class="border-0 p-0">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
    Notify me about
  </legend>

  <label for="notify-all" class="flex min-h-7 cursor-pointer items-center gap-2.5">
    <!-- Still needs the script below: indeterminate cannot be expressed here. -->
    <input
      type="checkbox"
      id="notify-all"
      data-tree-parent
      class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
    />
    <span class="text-sm text-gray-900 dark:text-gray-100">All activity</span>
  </label>

  <ul class="ml-2 mt-1 list-none border-l border-gray-200 pl-[1.875rem] dark:border-gray-700">
    <li>
      <label for="notify-mentions" class="flex min-h-7 cursor-pointer items-center gap-2.5">
        <input type="checkbox" id="notify-mentions" name="notify" value="mentions" checked data-tree-child class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Mentions and replies</span>
      </label>
    </li>
    <li>
      <label for="notify-assign" class="flex min-h-7 cursor-pointer items-center gap-2.5">
        <input type="checkbox" id="notify-assign" name="notify" value="assignments" data-tree-child class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Assignments</span>
      </label>
    </li>
    <li>
      <label for="notify-deploys" class="flex min-h-7 cursor-pointer items-center gap-2.5">
        <input type="checkbox" id="notify-deploys" name="notify" value="deploys" data-tree-child class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Deploys</span>
      </label>
    </li>
  </ul>
</fieldset>

<script>
  document.querySelectorAll('fieldset:has([data-tree-parent])').forEach(function (root) {
    var parent = root.querySelector('[data-tree-parent]');
    var children = Array.prototype.slice.call(root.querySelectorAll('[data-tree-child]'));

    function syncParent() {
      var checked = children.filter(function (child) { return child.checked; }).length;
      var all = checked === children.length;
      parent.checked = all;
      parent.indeterminate = !all && checked > 0;
      parent.setAttribute('aria-checked', parent.indeterminate ? 'mixed' : String(all));
    }

    parent.addEventListener('change', function () {
      children.forEach(function (child) { child.checked = parent.checked; });
      syncParent();
    });
    children.forEach(function (child) { child.addEventListener('change', syncParent); });
    syncParent();
  });
</script>`,
      react: `import { useEffect, useRef, useState } from 'react';

const OPTIONS = [
  { value: 'mentions', label: 'Mentions and replies' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'deploys', label: 'Deploys' },
];

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function IndeterminateCheckboxTree() {
  const [selected, setSelected] = useState(['mentions']);
  const parentRef = useRef(null);

  const allChecked = selected.length === OPTIONS.length;
  const mixed = selected.length > 0 && !allChecked;

  // There is no \`indeterminate\` JSX attribute, because there is no such HTML
  // attribute - React would drop it. It is a DOM property, so it has to be
  // written through a ref after every render.
  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = mixed;
  }, [mixed]);

  function toggle(value) {
    setSelected((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Notify me about
      </legend>

      <label htmlFor="notify-all" className="flex min-h-7 cursor-pointer items-center gap-2.5">
        <input
          ref={parentRef}
          id="notify-all"
          type="checkbox"
          checked={allChecked}
          aria-checked={mixed ? 'mixed' : allChecked}
          onChange={() => setSelected(allChecked ? [] : OPTIONS.map((o) => o.value))}
          className={BOX}
        />
        <span className="text-sm text-gray-900 dark:text-gray-100">All activity</span>
      </label>

      <ul className="ml-2 mt-1 list-none border-l border-gray-200 pl-[1.875rem] dark:border-gray-700">
        {OPTIONS.map((option) => (
          <li key={option.value}>
            <label
              htmlFor={'notify-' + option.value}
              className="flex min-h-7 cursor-pointer items-center gap-2.5"
            >
              <input
                id={'notify-' + option.value}
                type="checkbox"
                name="notify"
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className={BOX}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

const OPTIONS: readonly Option[] = [
  { value: 'mentions', label: 'Mentions and replies' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'deploys', label: 'Deploys' },
];

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

// 'use client' is required: the mixed state can only be written to the DOM node
// through a ref in an effect.
export function IndeterminateCheckboxTree() {
  const [selected, setSelected] = useState<string[]>(['mentions']);
  const parentRef = useRef<HTMLInputElement>(null);

  const allChecked = selected.length === OPTIONS.length;
  const mixed = selected.length > 0 && !allChecked;

  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = mixed;
  }, [mixed]);

  function toggle(value: string): void {
    setSelected((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Notify me about
      </legend>

      <label htmlFor="notify-all" className="flex min-h-7 cursor-pointer items-center gap-2.5">
        <input
          ref={parentRef}
          id="notify-all"
          type="checkbox"
          checked={allChecked}
          aria-checked={mixed ? 'mixed' : allChecked}
          onChange={() => setSelected(allChecked ? [] : OPTIONS.map((o) => o.value))}
          className={BOX}
        />
        <span className="text-sm text-gray-900 dark:text-gray-100">All activity</span>
      </label>

      <ul className="ml-2 mt-1 list-none border-l border-gray-200 pl-[1.875rem] dark:border-gray-700">
        {OPTIONS.map((option) => (
          <li key={option.value}>
            <label
              htmlFor={'notify-' + option.value}
              className="flex min-h-7 cursor-pointer items-center gap-2.5"
            >
              <input
                id={'notify-' + option.value}
                type="checkbox"
                name="notify"
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className={BOX}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';

export interface IndeterminateOption {
  value: string;
  label: string;
}

export interface IndeterminateCheckboxTreeProps {
  legend: string;
  parentLabel: string;
  options: readonly IndeterminateOption[];
  defaultSelected?: readonly string[];
  onSelectionChange?: (selected: string[]) => void;
}

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function IndeterminateCheckboxTree({
  legend,
  parentLabel,
  options,
  defaultSelected = [],
  onSelectionChange,
}: IndeterminateCheckboxTreeProps): JSX.Element {
  const [selected, setSelected] = useState<string[]>([...defaultSelected]);
  const parentRef = useRef<HTMLInputElement>(null);

  const allChecked = selected.length === options.length && options.length > 0;
  const mixed = selected.length > 0 && !allChecked;

  /**
   * \`indeterminate\` is a DOM property with no HTML attribute and no JSX prop -
   * it exists only on the element instance, so a ref is the only way to set it.
   * \`aria-checked="mixed"\` below is the announced half of the same state.
   */
  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = mixed;
  }, [mixed]);

  function commit(next: string[]): void {
    setSelected(next);
    onSelectionChange?.(next);
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <label htmlFor="tree-all" className="flex min-h-7 cursor-pointer items-center gap-2.5">
        <input
          ref={parentRef}
          id="tree-all"
          type="checkbox"
          checked={allChecked}
          aria-checked={mixed ? 'mixed' : allChecked}
          onChange={() => commit(allChecked ? [] : options.map((o) => o.value))}
          className={BOX}
        />
        <span className="text-sm text-gray-900 dark:text-gray-100">{parentLabel}</span>
      </label>

      <ul className="ml-2 mt-1 list-none border-l border-gray-200 pl-[1.875rem] dark:border-gray-700">
        {options.map((option) => (
          <li key={option.value}>
            <label
              htmlFor={'tree-' + option.value}
              className="flex min-h-7 cursor-pointer items-center gap-2.5"
            >
              <input
                id={'tree-' + option.value}
                type="checkbox"
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() =>
                  commit(
                    selected.includes(option.value)
                      ? selected.filter((v) => v !== option.value)
                      : [...selected, option.value],
                  )
                }
                className={BOX}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'checkbox-list-group',
    category: 'forms',
    tags: ['checkbox', 'list', 'select-all', 'bordered', 'bulk'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1240, copies: 331, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A bordered list of rows, each row a full-width <label> so the whole strip is
  the target, not the 20px box. The header carries a select-all which is itself a
  real checkbox - and it goes mixed when the selection is partial, because a
  select-all that shows "unchecked" while three of five rows are ticked is lying.

  The <fieldset>/<legend> pair is what gives the group a name; without it a
  screen reader reads five unrelated checkboxes with no idea what they belong to.
-->
<fieldset class="list-group">
  <legend class="list-group__legend">Sync these repositories</legend>

  <div class="list-group__box">
    <label class="list-group__row list-group__row--head" for="repos-all">
      <input class="list-group__input list-group__input--all" type="checkbox" id="repos-all" />
      <span class="list-group__title">Select all</span>
      <span class="list-group__count" data-count>0 of 3 selected</span>
    </label>

    <label class="list-group__row" for="repo-web">
      <input class="list-group__input list-group__input--item" type="checkbox" id="repo-web" name="repos" value="web" checked />
      <span class="list-group__body">
        <span class="list-group__title">adysre/web</span>
        <span class="list-group__meta">Updated 2 hours ago</span>
      </span>
    </label>

    <label class="list-group__row" for="repo-api">
      <input class="list-group__input list-group__input--item" type="checkbox" id="repo-api" name="repos" value="api" />
      <span class="list-group__body">
        <span class="list-group__title">adysre/api</span>
        <span class="list-group__meta">Updated yesterday</span>
      </span>
    </label>

    <label class="list-group__row" for="repo-worker">
      <input class="list-group__input list-group__input--item" type="checkbox" id="repo-worker" name="repos" value="worker" />
      <span class="list-group__body">
        <span class="list-group__title">adysre/worker</span>
        <span class="list-group__meta">Updated last week</span>
      </span>
    </label>
  </div>
</fieldset>

<script>
  document.querySelectorAll('.list-group').forEach(function (root) {
    var all = root.querySelector('.list-group__input--all');
    var items = Array.prototype.slice.call(root.querySelectorAll('.list-group__input--item'));
    var count = root.querySelector('[data-count]');

    function sync() {
      var checked = items.filter(function (item) { return item.checked; }).length;
      var every = checked === items.length;

      all.checked = every;
      // DOM property - it has no HTML attribute, so this line is the only way
      // the dash ever appears.
      all.indeterminate = !every && checked > 0;
      all.setAttribute('aria-checked', all.indeterminate ? 'mixed' : String(every));
      count.textContent = checked + ' of ' + items.length + ' selected';
    }

    all.addEventListener('change', function () {
      items.forEach(function (item) { item.checked = all.checked; });
      sync();
    });
    items.forEach(function (item) { item.addEventListener('change', sync); });
    sync();
  });
</script>`,
      css: `.list-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.list-group__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.list-group__box {
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background-color: #fff;
  overflow: hidden;
}

.list-group__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  /* The row is the target; 0.75rem of vertical padding around a 20px box puts
     it well past the 24px minimum on the axis that matters. */
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.list-group__row + .list-group__row {
  border-top: 1px solid #e5e7eb;
}

.list-group__row:hover {
  background-color: #f9fafb;
}

.list-group__row--head {
  background-color: #f9fafb;
  font-weight: 600;
}

.list-group__row--head:hover {
  background-color: #f3f4f6;
}

.list-group__input {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.list-group__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.list-group__body {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.list-group__title {
  font-size: 0.875rem;
  color: #111827;
}

.list-group__meta {
  font-size: 0.75rem;
  color: #4b5563;
}

.list-group__count {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 400;
  color: #4b5563;
  font-variant-numeric: tabular-nums;
}

/*
 * The box is a surface of its own, so it inverts wholesale: shell, hairlines and
 * the header tint all move together, or the list reads as a white card punched
 * into a dark page.
 */
@media (prefers-color-scheme: dark) {
  .list-group__legend,
  .list-group__title {
    color: #f3f4f6;
  }

  .list-group__box {
    border-color: #374151;
    background-color: #111827;
  }

  .list-group__row + .list-group__row {
    border-top-color: #374151;
  }

  .list-group__row:hover {
    background-color: #1f2937;
  }

  .list-group__row--head {
    background-color: #1f2937;
  }

  .list-group__row--head:hover {
    background-color: #374151;
  }

  .list-group__input {
    accent-color: #3b82f6;
  }

  .list-group__input:focus-visible {
    outline-color: #60a5fa;
  }

  .list-group__meta,
  .list-group__count {
    color: #9ca3af;
  }
}`,
      tailwind: `<fieldset class="border-0 p-0">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
    Sync these repositories
  </legend>

  <div class="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
    <label
      for="repos-all"
      class="flex cursor-pointer items-center gap-3 bg-gray-50 px-4 py-3 font-semibold hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <input type="checkbox" id="repos-all" data-all class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="text-sm text-gray-900 dark:text-gray-100">Select all</span>
      <span data-count class="ml-auto text-xs font-normal tabular-nums text-gray-600 dark:text-gray-400">0 of 3 selected</span>
    </label>

    <label for="repo-web" class="flex cursor-pointer items-center gap-3 border-t border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
      <input type="checkbox" id="repo-web" name="repos" value="web" checked data-item class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="flex flex-col gap-0.5">
        <span class="text-sm text-gray-900 dark:text-gray-100">adysre/web</span>
        <span class="text-xs text-gray-600 dark:text-gray-400">Updated 2 hours ago</span>
      </span>
    </label>

    <label for="repo-api" class="flex cursor-pointer items-center gap-3 border-t border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
      <input type="checkbox" id="repo-api" name="repos" value="api" data-item class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="flex flex-col gap-0.5">
        <span class="text-sm text-gray-900 dark:text-gray-100">adysre/api</span>
        <span class="text-xs text-gray-600 dark:text-gray-400">Updated yesterday</span>
      </span>
    </label>

    <label for="repo-worker" class="flex cursor-pointer items-center gap-3 border-t border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
      <input type="checkbox" id="repo-worker" name="repos" value="worker" data-item class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="flex flex-col gap-0.5">
        <span class="text-sm text-gray-900 dark:text-gray-100">adysre/worker</span>
        <span class="text-xs text-gray-600 dark:text-gray-400">Updated last week</span>
      </span>
    </label>
  </div>
</fieldset>

<script>
  document.querySelectorAll('fieldset:has([data-all])').forEach(function (root) {
    var all = root.querySelector('[data-all]');
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-item]'));
    var count = root.querySelector('[data-count]');

    function sync() {
      var checked = items.filter(function (item) { return item.checked; }).length;
      var every = checked === items.length;
      all.checked = every;
      all.indeterminate = !every && checked > 0;
      all.setAttribute('aria-checked', all.indeterminate ? 'mixed' : String(every));
      count.textContent = checked + ' of ' + items.length + ' selected';
    }

    all.addEventListener('change', function () {
      items.forEach(function (item) { item.checked = all.checked; });
      sync();
    });
    items.forEach(function (item) { item.addEventListener('change', sync); });
    sync();
  });
</script>`,
      react: `import { useEffect, useRef, useState } from 'react';

const REPOS = [
  { value: 'web', name: 'adysre/web', meta: 'Updated 2 hours ago' },
  { value: 'api', name: 'adysre/api', meta: 'Updated yesterday' },
  { value: 'worker', name: 'adysre/worker', meta: 'Updated last week' },
];

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function CheckboxListGroup() {
  const [selected, setSelected] = useState(['web']);
  const allRef = useRef(null);

  const every = selected.length === REPOS.length;
  const mixed = selected.length > 0 && !every;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = mixed;
  }, [mixed]);

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Sync these repositories
      </legend>

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
        <label
          htmlFor="repos-all"
          className="flex cursor-pointer items-center gap-3 bg-gray-50 px-4 py-3 font-semibold hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <input
            ref={allRef}
            id="repos-all"
            type="checkbox"
            checked={every}
            aria-checked={mixed ? 'mixed' : every}
            onChange={() => setSelected(every ? [] : REPOS.map((r) => r.value))}
            className={BOX}
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">Select all</span>
          <span className="ml-auto text-xs font-normal tabular-nums text-gray-600 dark:text-gray-400">
            {selected.length} of {REPOS.length} selected
          </span>
        </label>

        {REPOS.map((repo) => (
          <label
            key={repo.value}
            htmlFor={'repo-' + repo.value}
            className="flex cursor-pointer items-center gap-3 border-t border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <input
              id={'repo-' + repo.value}
              type="checkbox"
              name="repos"
              value={repo.value}
              checked={selected.includes(repo.value)}
              onChange={() =>
                setSelected((current) =>
                  current.includes(repo.value)
                    ? current.filter((v) => v !== repo.value)
                    : [...current, repo.value],
                )
              }
              className={BOX}
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm text-gray-900 dark:text-gray-100">{repo.name}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{repo.meta}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef, useState } from 'react';

interface Repo {
  value: string;
  name: string;
  meta: string;
}

const REPOS: readonly Repo[] = [
  { value: 'web', name: 'adysre/web', meta: 'Updated 2 hours ago' },
  { value: 'api', name: 'adysre/api', meta: 'Updated yesterday' },
  { value: 'worker', name: 'adysre/worker', meta: 'Updated last week' },
];

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

// 'use client': the selection drives the count and the select-all's mixed state,
// which is written through a ref.
export function CheckboxListGroup() {
  const [selected, setSelected] = useState<string[]>(['web']);
  const allRef = useRef<HTMLInputElement>(null);

  const every = selected.length === REPOS.length;
  const mixed = selected.length > 0 && !every;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = mixed;
  }, [mixed]);

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Sync these repositories
      </legend>

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
        <label
          htmlFor="repos-all"
          className="flex cursor-pointer items-center gap-3 bg-gray-50 px-4 py-3 font-semibold hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <input
            ref={allRef}
            id="repos-all"
            type="checkbox"
            checked={every}
            aria-checked={mixed ? 'mixed' : every}
            onChange={() => setSelected(every ? [] : REPOS.map((r) => r.value))}
            className={BOX}
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">Select all</span>
          <span className="ml-auto text-xs font-normal tabular-nums text-gray-600 dark:text-gray-400">
            {selected.length} of {REPOS.length} selected
          </span>
        </label>

        {REPOS.map((repo) => (
          <label
            key={repo.value}
            htmlFor={'repo-' + repo.value}
            className="flex cursor-pointer items-center gap-3 border-t border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <input
              id={'repo-' + repo.value}
              type="checkbox"
              name="repos"
              value={repo.value}
              checked={selected.includes(repo.value)}
              onChange={() =>
                setSelected((current) =>
                  current.includes(repo.value)
                    ? current.filter((v) => v !== repo.value)
                    : [...current, repo.value],
                )
              }
              className={BOX}
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm text-gray-900 dark:text-gray-100">{repo.name}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{repo.meta}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';

export interface CheckboxListItem {
  value: string;
  name: string;
  meta?: string;
}

export interface CheckboxListGroupProps {
  legend: string;
  items: readonly CheckboxListItem[];
  defaultSelected?: readonly string[];
  onSelectionChange?: (selected: string[]) => void;
}

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function CheckboxListGroup({
  legend,
  items,
  defaultSelected = [],
  onSelectionChange,
}: CheckboxListGroupProps): JSX.Element {
  const [selected, setSelected] = useState<string[]>([...defaultSelected]);
  const allRef = useRef<HTMLInputElement>(null);

  const every = selected.length === items.length && items.length > 0;
  const mixed = selected.length > 0 && !every;

  // The select-all is tri-state on purpose: showing it unchecked while some rows
  // are ticked misreports the selection.
  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = mixed;
  }, [mixed]);

  function commit(next: string[]): void {
    setSelected(next);
    onSelectionChange?.(next);
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
        <label
          htmlFor="list-all"
          className="flex cursor-pointer items-center gap-3 bg-gray-50 px-4 py-3 font-semibold hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <input
            ref={allRef}
            id="list-all"
            type="checkbox"
            checked={every}
            aria-checked={mixed ? 'mixed' : every}
            onChange={() => commit(every ? [] : items.map((i) => i.value))}
            className={BOX}
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">Select all</span>
          <span className="ml-auto text-xs font-normal tabular-nums text-gray-600 dark:text-gray-400">
            {selected.length} of {items.length} selected
          </span>
        </label>

        {items.map((item) => (
          <label
            key={item.value}
            htmlFor={'list-' + item.value}
            className="flex cursor-pointer items-center gap-3 border-t border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <input
              id={'list-' + item.value}
              type="checkbox"
              value={item.value}
              checked={selected.includes(item.value)}
              onChange={() =>
                commit(
                  selected.includes(item.value)
                    ? selected.filter((v) => v !== item.value)
                    : [...selected, item.value],
                )
              }
              className={BOX}
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm text-gray-900 dark:text-gray-100">{item.name}</span>
              {item.meta ? (
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.meta}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'radio-basic',
    category: 'forms',
    tags: ['radio', 'fieldset', 'legend', 'form', 'accessible'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-07-06',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 2870, copies: 812, downloads: 196 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'text', labelKey: 'text' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'groupName' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The <fieldset>/<legend> is not decoration. A bare list of radios announces as
  "Weekly, radio button, 1 of 3" with no clue what is being chosen - the legend
  is what makes it "Billing period: Weekly, radio button, 1 of 3". A group with
  no accessible name is a bug, not a style choice.

  The shared \`name\` is what makes them exclusive and what makes arrow keys walk
  the group. Every input still gets its own id and its own label.
-->
<fieldset class="radio-group" aria-describedby="billing-hint">
  <legend class="radio-group__legend">Billing period</legend>

  <label class="radio-group__row" for="billing-monthly">
    <input class="radio-group__input" type="radio" id="billing-monthly" name="billing" value="monthly" checked />
    <span class="radio-group__label">Monthly</span>
  </label>

  <label class="radio-group__row" for="billing-quarterly">
    <input class="radio-group__input" type="radio" id="billing-quarterly" name="billing" value="quarterly" />
    <span class="radio-group__label">Every 3 months</span>
  </label>

  <label class="radio-group__row" for="billing-yearly">
    <input class="radio-group__input" type="radio" id="billing-yearly" name="billing" value="yearly" />
    <span class="radio-group__label">Yearly</span>
  </label>

  <p class="radio-group__hint" id="billing-hint">You can change this at any time from Settings.</p>
</fieldset>`,
      css: `.radio-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-group__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.radio-group__row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 1.75rem;
  cursor: pointer;
}

.radio-group__input {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  /* Keeps the platform's own dot, so the selected state is a mark and not just
     a hue - it survives greyscale and every form of colour blindness. */
  accent-color: #2563eb;
  cursor: pointer;
}

.radio-group__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.radio-group__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.radio-group__label {
  font-size: 0.875rem;
  color: #111827;
}

.radio-group__hint {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .radio-group__legend,
  .radio-group__label {
    color: #f3f4f6;
  }

  .radio-group__input {
    accent-color: #3b82f6;
  }

  .radio-group__input:focus-visible {
    outline-color: #60a5fa;
  }

  .radio-group__hint {
    color: #9ca3af;
  }
}`,
      tailwind: `<fieldset class="border-0 p-0" aria-describedby="billing-hint">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
    Billing period
  </legend>

  <label for="billing-monthly" class="flex min-h-7 cursor-pointer items-center gap-2.5">
    <input type="radio" id="billing-monthly" name="billing" value="monthly" checked class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
    <span class="text-sm text-gray-900 dark:text-gray-100">Monthly</span>
  </label>

  <label for="billing-quarterly" class="flex min-h-7 cursor-pointer items-center gap-2.5">
    <input type="radio" id="billing-quarterly" name="billing" value="quarterly" class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
    <span class="text-sm text-gray-900 dark:text-gray-100">Every 3 months</span>
  </label>

  <label for="billing-yearly" class="flex min-h-7 cursor-pointer items-center gap-2.5">
    <input type="radio" id="billing-yearly" name="billing" value="yearly" class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
    <span class="text-sm text-gray-900 dark:text-gray-100">Yearly</span>
  </label>

  <p id="billing-hint" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
    You can change this at any time from Settings.
  </p>
</fieldset>`,
      react: `const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function RadioGroup({ name, legend, hint, options, value, onChange }) {
  const hintId = hint ? name + '-hint' : undefined;

  return (
    <fieldset className="border-0 p-0" aria-describedby={hintId}>
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={name + '-' + option.value}
          className="flex min-h-7 cursor-pointer items-center gap-2.5"
        >
          <input
            id={name + '-' + option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className={DOT}
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
        </label>
      ))}

      {hint && (
        <p id={hintId} className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      )}
    </fieldset>
  );
}`,
      nextjs: `'use client';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  legend: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

// 'use client' because it is controlled. Drop the \`value\`/\`onChange\` pair, add
// \`defaultChecked\`, and it becomes a Server Component that posts with the form.
export function RadioGroup({ name, legend, options, value, onChange, hint }: RadioGroupProps) {
  const hintId = hint ? name + '-hint' : undefined;

  return (
    <fieldset className="border-0 p-0" aria-describedby={hintId}>
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={name + '-' + option.value}
          className="flex min-h-7 cursor-pointer items-center gap-2.5"
        >
          <input
            id={name + '-' + option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className={DOT}
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
        </label>
      ))}

      {hint ? (
        <p id={hintId} className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}`,
      typescript: `'use client';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  /** Shared across the inputs - it is what makes them exclusive. */
  name: string;
  /** Rendered as the <legend>; it is the group's accessible name. */
  legend: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  hint,
}: RadioGroupProps): JSX.Element {
  const hintId = hint ? name + '-hint' : undefined;

  return (
    <fieldset className="border-0 p-0" aria-describedby={hintId}>
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={name + '-' + option.value}
          className="flex min-h-7 cursor-pointer items-center gap-2.5"
        >
          <input
            id={name + '-' + option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className={DOT}
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
        </label>
      ))}

      {hint ? (
        <p id={hintId} className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'radio-card',
    category: 'forms',
    tags: ['radio', 'card', 'plan', 'selectable', 'pricing'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-12',
    updatedAt: '2026-07-10',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2410, copies: 664, downloads: 178 },
    variants: [
      { id: 'card', labelKey: 'card' },
      { id: 'default', labelKey: 'default' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'groupName' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Selectable cards, one choice. Same trick as the checkbox card - the card IS the
  label and the radio inside it is clipped, not removed - so the group keeps the
  behaviour people forget to rebuild: arrow keys move the selection between
  cards, Tab enters and leaves the group as one stop, and the form posts \`plan\`.

  The <fieldset>/<legend> names the group. The dot on the right marks the choice,
  so the ring and tint are reinforcement rather than the only signal.
-->
<fieldset class="radio-cards">
  <legend class="radio-cards__legend">Choose a plan</legend>

  <label class="radio-card" for="plan-starter">
    <input class="radio-card__input" type="radio" id="plan-starter" name="plan" value="starter" checked />
    <span class="radio-card__body">
      <span class="radio-card__title">Starter</span>
      <span class="radio-card__meta">$12 / month · 3 projects</span>
    </span>
    <span class="radio-card__dot" aria-hidden="true"></span>
  </label>

  <label class="radio-card" for="plan-growth">
    <input class="radio-card__input" type="radio" id="plan-growth" name="plan" value="growth" />
    <span class="radio-card__body">
      <span class="radio-card__title">Growth</span>
      <span class="radio-card__meta">$29 / month · Unlimited projects</span>
    </span>
    <span class="radio-card__dot" aria-hidden="true"></span>
  </label>

  <label class="radio-card" for="plan-scale">
    <input class="radio-card__input" type="radio" id="plan-scale" name="plan" value="scale" />
    <span class="radio-card__body">
      <span class="radio-card__title">Scale</span>
      <span class="radio-card__meta">$79 / month · SSO and audit log</span>
    </span>
    <span class="radio-card__dot" aria-hidden="true"></span>
  </label>
</fieldset>`,
      css: `.radio-cards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-cards__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.radio-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;
}

.radio-card__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.radio-card:hover {
  background-color: #f9fafb;
}

.radio-card:has(.radio-card__input:checked) {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.radio-card:has(.radio-card__input:focus-visible) {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.radio-card:has(.radio-card__input:disabled) {
  cursor: not-allowed;
  opacity: 0.5;
}

.radio-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.radio-card__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.radio-card__meta {
  font-size: 0.75rem;
  color: #4b5563;
}

.radio-card__dot {
  margin-left: auto;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #9ca3af;
  border-radius: 9999px;
  background-color: #fff;
}

/* The inner dot is drawn with a radial gradient so there is no extra element to
   hide and reveal - it is 0-sized until the input is checked. */
.radio-card__input:checked ~ .radio-card__dot {
  border-color: #2563eb;
  background-image: radial-gradient(circle, #2563eb 0 45%, transparent 46%);
}

@media (prefers-color-scheme: dark) {
  .radio-cards__legend,
  .radio-card__title {
    color: #f3f4f6;
  }

  .radio-card {
    border-color: #374151;
    background-color: #111827;
  }

  .radio-card:hover {
    background-color: #1f2937;
  }

  .radio-card:has(.radio-card__input:checked) {
    border-color: #3b82f6;
    background-color: #172554;
  }

  .radio-card:has(.radio-card__input:focus-visible) {
    outline-color: #60a5fa;
  }

  .radio-card__meta {
    color: #9ca3af;
  }

  .radio-card__dot {
    border-color: #6b7280;
    background-color: #111827;
  }

  .radio-card__input:checked ~ .radio-card__dot {
    border-color: #3b82f6;
    background-image: radial-gradient(circle, #60a5fa 0 45%, transparent 46%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .radio-card {
    transition: none;
  }
}`,
      tailwind: `<fieldset class="flex flex-col gap-2 border-0 p-0">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
    Choose a plan
  </legend>

  <label
    for="plan-starter"
    class="relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
  >
    <input type="radio" id="plan-starter" name="plan" value="starter" checked class="peer sr-only" />
    <span class="flex flex-col gap-0.5">
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Starter</span>
      <span class="text-xs text-gray-600 dark:text-gray-400">$12 / month · 3 projects</span>
    </span>
    <span
      aria-hidden="true"
      class="ml-auto h-5 w-5 shrink-0 rounded-full border border-gray-400 bg-white peer-checked:border-blue-600 peer-checked:bg-[radial-gradient(circle,#2563eb_0_45%,transparent_46%)] dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-[radial-gradient(circle,#60a5fa_0_45%,transparent_46%)]"
    ></span>
  </label>

  <label
    for="plan-growth"
    class="relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
  >
    <input type="radio" id="plan-growth" name="plan" value="growth" class="peer sr-only" />
    <span class="flex flex-col gap-0.5">
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Growth</span>
      <span class="text-xs text-gray-600 dark:text-gray-400">$29 / month · Unlimited projects</span>
    </span>
    <span
      aria-hidden="true"
      class="ml-auto h-5 w-5 shrink-0 rounded-full border border-gray-400 bg-white peer-checked:border-blue-600 peer-checked:bg-[radial-gradient(circle,#2563eb_0_45%,transparent_46%)] dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-[radial-gradient(circle,#60a5fa_0_45%,transparent_46%)]"
    ></span>
  </label>

  <label
    for="plan-scale"
    class="relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400"
  >
    <input type="radio" id="plan-scale" name="plan" value="scale" class="peer sr-only" />
    <span class="flex flex-col gap-0.5">
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Scale</span>
      <span class="text-xs text-gray-600 dark:text-gray-400">$79 / month · SSO and audit log</span>
    </span>
    <span
      aria-hidden="true"
      class="ml-auto h-5 w-5 shrink-0 rounded-full border border-gray-400 bg-white peer-checked:border-blue-600 peer-checked:bg-[radial-gradient(circle,#2563eb_0_45%,transparent_46%)] dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-[radial-gradient(circle,#60a5fa_0_45%,transparent_46%)]"
    ></span>
  </label>
</fieldset>`,
      react: `const CARD =
  'relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400';

const DOT =
  'ml-auto h-5 w-5 shrink-0 rounded-full border border-gray-400 bg-white peer-checked:border-blue-600 peer-checked:bg-[radial-gradient(circle,#2563eb_0_45%,transparent_46%)] dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-[radial-gradient(circle,#60a5fa_0_45%,transparent_46%)]';

export function RadioCardGroup({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label key={option.value} htmlFor={name + '-' + option.value} className={CARD}>
          <input
            id={name + '-' + option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {option.title}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{option.meta}</span>
          </span>
          <span aria-hidden="true" className={DOT} />
        </label>
      ))}
    </fieldset>
  );
}`,
      nextjs: `'use client';

interface RadioCardOption {
  value: string;
  title: string;
  meta: string;
}

interface RadioCardGroupProps {
  name: string;
  legend: string;
  options: readonly RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
}

const CARD =
  'relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400';

const DOT =
  'ml-auto h-5 w-5 shrink-0 rounded-full border border-gray-400 bg-white peer-checked:border-blue-600 peer-checked:bg-[radial-gradient(circle,#2563eb_0_45%,transparent_46%)] dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-[radial-gradient(circle,#60a5fa_0_45%,transparent_46%)]';

// 'use client' only because it is controlled - the tint, the dot and the ring are
// pure CSS off the native radio and would work without React at all.
export function RadioCardGroup({ name, legend, options, value, onChange }: RadioCardGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label key={option.value} htmlFor={name + '-' + option.value} className={CARD}>
          <input
            id={name + '-' + option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {option.title}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{option.meta}</span>
          </span>
          <span aria-hidden="true" className={DOT} />
        </label>
      ))}
    </fieldset>
  );
}`,
      typescript: `'use client';

export interface RadioCardOption {
  value: string;
  title: string;
  meta: string;
}

export interface RadioCardGroupProps {
  name: string;
  legend: string;
  options: readonly RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
}

const CARD =
  'relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400';

const DOT =
  'ml-auto h-5 w-5 shrink-0 rounded-full border border-gray-400 bg-white peer-checked:border-blue-600 peer-checked:bg-[radial-gradient(circle,#2563eb_0_45%,transparent_46%)] dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-[radial-gradient(circle,#60a5fa_0_45%,transparent_46%)]';

export function RadioCardGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: RadioCardGroupProps): JSX.Element {
  return (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label key={option.value} htmlFor={name + '-' + option.value} className={CARD}>
          <input
            id={name + '-' + option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {option.title}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{option.meta}</span>
          </span>
          <span aria-hidden="true" className={DOT} />
        </label>
      ))}
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'radio-button-group',
    category: 'forms',
    tags: ['radio', 'segmented', 'toggle', 'filter', 'control'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-03',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1890, copies: 547, downloads: 132 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'groupName' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A segmented control is a radio group wearing a different coat. Built this way it
  is exclusive for free, arrow keys walk the segments, and it posts \`range\` with
  the form - none of which a row of buttons with a \`.is-active\` class gets.

  A selected segment cannot be signalled by the fill alone: the tick tells anyone
  who cannot separate the two greys which one is on.
-->
<fieldset class="segmented">
  <legend class="segmented__legend">Date range</legend>

  <div class="segmented__track">
    <label class="segmented__option" for="range-7d">
      <input class="segmented__input" type="radio" id="range-7d" name="range" value="7d" checked />
      <span class="segmented__face">
        <svg class="segmented__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        7 days
      </span>
    </label>

    <label class="segmented__option" for="range-30d">
      <input class="segmented__input" type="radio" id="range-30d" name="range" value="30d" />
      <span class="segmented__face">
        <svg class="segmented__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        30 days
      </span>
    </label>

    <label class="segmented__option" for="range-90d">
      <input class="segmented__input" type="radio" id="range-90d" name="range" value="90d" />
      <span class="segmented__face">
        <svg class="segmented__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        90 days
      </span>
    </label>
  </div>
</fieldset>`,
      css: `.segmented {
  margin: 0;
  padding: 0;
  border: 0;
}

.segmented__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

/* Segments never wrap, so when the labels outgrow a 320px viewport the track
   scrolls inside itself rather than pushing the page wide. */
.segmented__track {
  display: inline-flex;
  max-width: 100%;
  gap: 0.125rem;
  padding: 0.25rem;
  border-radius: 0.625rem;
  background-color: #f3f4f6;
  overflow-x: auto;
}

.segmented__option {
  flex: 1;
  cursor: pointer;
}

.segmented__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.segmented__face {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  /* 2rem tall - the segment, not the invisible input, is the target. */
  min-height: 2rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  white-space: nowrap;
  transition: background-color 150ms, color 150ms;
}

.segmented__option:hover .segmented__face {
  color: #111827;
}

.segmented__tick {
  width: 0.875rem;
  height: 0.875rem;
  /* Reserved, not collapsed: laying it out at zero width would make the label
     shift sideways every time the selection moves. */
  opacity: 0;
}

.segmented__input:checked ~ .segmented__face {
  background-color: #fff;
  color: #111827;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

.segmented__input:checked ~ .segmented__face .segmented__tick {
  opacity: 1;
  color: #2563eb;
}

.segmented__input:focus-visible ~ .segmented__face {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.segmented__input:disabled ~ .segmented__face {
  opacity: 0.5;
  cursor: not-allowed;
}

/*
 * The track and the selected face are a light/dark pair by construction: the
 * selected segment has to be the LIGHTER surface on a light track and the
 * lighter one on a dark track too, or "raised" reads as "recessed".
 */
@media (prefers-color-scheme: dark) {
  .segmented__legend {
    color: #f3f4f6;
  }

  .segmented__track {
    background-color: #1f2937;
  }

  .segmented__face {
    color: #9ca3af;
  }

  .segmented__option:hover .segmented__face {
    color: #f3f4f6;
  }

  .segmented__input:checked ~ .segmented__face {
    background-color: #374151;
    color: #f9fafb;
  }

  .segmented__input:checked ~ .segmented__face .segmented__tick {
    color: #60a5fa;
  }

  .segmented__input:focus-visible ~ .segmented__face {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .segmented__face {
    transition: none;
  }
}`,
      tailwind: `<fieldset class="border-0 p-0">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">Date range</legend>

  <div class="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[0.625rem] bg-gray-100 p-1 dark:bg-gray-800">
    <label for="range-7d" class="flex-1 cursor-pointer">
      <input type="radio" id="range-7d" name="range" value="7d" checked class="peer sr-only" />
      <span class="flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none dark:text-gray-400 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-50 dark:peer-focus-visible:outline-blue-400">
        <svg class="h-3.5 w-3.5 text-blue-600 opacity-0 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        7 days
      </span>
    </label>

    <label for="range-30d" class="flex-1 cursor-pointer">
      <input type="radio" id="range-30d" name="range" value="30d" class="peer sr-only" />
      <span class="flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none dark:text-gray-400 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-50 dark:peer-focus-visible:outline-blue-400">
        <svg class="h-3.5 w-3.5 text-blue-600 opacity-0 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        30 days
      </span>
    </label>

    <label for="range-90d" class="flex-1 cursor-pointer">
      <input type="radio" id="range-90d" name="range" value="90d" class="peer sr-only" />
      <span class="flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none dark:text-gray-400 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-50 dark:peer-focus-visible:outline-blue-400">
        <svg class="h-3.5 w-3.5 text-blue-600 opacity-0 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        90 days
      </span>
    </label>
  </div>
</fieldset>`,
      react: `const FACE =
  'flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none dark:text-gray-400 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-50 dark:peer-focus-visible:outline-blue-400';

function Tick() {
  return (
    <svg
      className="h-3.5 w-3.5 text-blue-600 opacity-0 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function SegmentedRadioGroup({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[0.625rem] bg-gray-100 p-1 dark:bg-gray-800">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={name + '-' + option.value}
            className="flex-1 cursor-pointer"
          >
            <input
              id={name + '-' + option.value}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className={FACE}>
              <Tick />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
      nextjs: `'use client';

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedRadioGroupProps {
  name: string;
  legend: string;
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

const FACE =
  'flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none dark:text-gray-400 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-50 dark:peer-focus-visible:outline-blue-400';

function Tick() {
  return (
    <svg
      className="h-3.5 w-3.5 text-blue-600 opacity-0 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

// 'use client' for the controlled value. Note there is no roving-tabindex code
// here and none is needed: a native radio group already gives you one tab stop
// and arrow-key traversal.
export function SegmentedRadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: SegmentedRadioGroupProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[0.625rem] bg-gray-100 p-1 dark:bg-gray-800">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={name + '-' + option.value}
            className="flex-1 cursor-pointer"
          >
            <input
              id={name + '-' + option.value}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className={FACE}>
              <Tick />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
      typescript: `'use client';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedRadioGroupProps {
  name: string;
  legend: string;
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

const FACE =
  'flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none dark:text-gray-400 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-50 dark:peer-focus-visible:outline-blue-400';

function Tick(): JSX.Element {
  return (
    <svg
      className="h-3.5 w-3.5 text-blue-600 opacity-0 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function SegmentedRadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: SegmentedRadioGroupProps): JSX.Element {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[0.625rem] bg-gray-100 p-1 dark:bg-gray-800">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={name + '-' + option.value}
            className="flex-1 cursor-pointer"
          >
            <input
              id={name + '-' + option.value}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className={FACE}>
              <Tick />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'radio-with-description',
    category: 'forms',
    tags: ['radio', 'description', 'aria-describedby', 'settings', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-22',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1310, copies: 356, downloads: 94 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'groupName' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Each option is a title plus a line explaining it. The split matters: the title
  is inside the <label>, so it is the option's NAME; the description is outside
  it and wired with aria-describedby, so it is announced after the name rather
  than being welded into it. Putting both in the label gives you an option called
  "Private Only people you invite can open the workspace", read out in full on
  every arrow-key press.
-->
<fieldset class="radio-desc">
  <legend class="radio-desc__legend">Workspace visibility</legend>

  <div class="radio-desc__row">
    <input class="radio-desc__input" type="radio" id="vis-private" name="visibility" value="private" aria-describedby="vis-private-desc" checked />
    <div class="radio-desc__text">
      <label class="radio-desc__title" for="vis-private">Private</label>
      <p class="radio-desc__desc" id="vis-private-desc">Only people you invite can open the workspace.</p>
    </div>
  </div>

  <div class="radio-desc__row">
    <input class="radio-desc__input" type="radio" id="vis-team" name="visibility" value="team" aria-describedby="vis-team-desc" />
    <div class="radio-desc__text">
      <label class="radio-desc__title" for="vis-team">Everyone at ADYSRE</label>
      <p class="radio-desc__desc" id="vis-team-desc">Anyone with a verified company email can join.</p>
    </div>
  </div>

  <div class="radio-desc__row">
    <input class="radio-desc__input" type="radio" id="vis-public" name="visibility" value="public" aria-describedby="vis-public-desc" />
    <div class="radio-desc__text">
      <label class="radio-desc__title" for="vis-public">Public</label>
      <p class="radio-desc__desc" id="vis-public-desc">Anyone with the link can read; only members can edit.</p>
    </div>
  </div>
</fieldset>`,
      css: `.radio-desc {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-desc__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.radio-desc__row {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.radio-desc__input {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.125rem 0 0;
  flex-shrink: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.radio-desc__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.radio-desc__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.radio-desc__title {
  display: block;
  min-height: 1.5rem;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
}

.radio-desc__desc {
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: #4b5563;
}

/*
 * The description is the smallest text on the component and the first thing to
 * fail contrast: #4b5563 clears AA on white, and #9ca3af clears it on #111827.
 * Do not reach for a dimmer grey to make it "secondary" - the size already does
 * that job.
 */
@media (prefers-color-scheme: dark) {
  .radio-desc__legend,
  .radio-desc__title {
    color: #f3f4f6;
  }

  .radio-desc__input {
    accent-color: #3b82f6;
  }

  .radio-desc__input:focus-visible {
    outline-color: #60a5fa;
  }

  .radio-desc__desc {
    color: #9ca3af;
  }
}`,
      tailwind: `<fieldset class="flex flex-col gap-3.5 border-0 p-0">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
    Workspace visibility
  </legend>

  <div class="flex items-start gap-2.5">
    <input type="radio" id="vis-private" name="visibility" value="private" aria-describedby="vis-private-desc" checked class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
    <div>
      <label for="vis-private" class="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Private</label>
      <p id="vis-private-desc" class="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">Only people you invite can open the workspace.</p>
    </div>
  </div>

  <div class="flex items-start gap-2.5">
    <input type="radio" id="vis-team" name="visibility" value="team" aria-describedby="vis-team-desc" class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
    <div>
      <label for="vis-team" class="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Everyone at ADYSRE</label>
      <p id="vis-team-desc" class="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">Anyone with a verified company email can join.</p>
    </div>
  </div>

  <div class="flex items-start gap-2.5">
    <input type="radio" id="vis-public" name="visibility" value="public" aria-describedby="vis-public-desc" class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
    <div>
      <label for="vis-public" class="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Public</label>
      <p id="vis-public-desc" class="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">Anyone with the link can read; only members can edit.</p>
    </div>
  </div>
</fieldset>`,
      react: `const DOT =
  'mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function DescribedRadioGroup({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-3.5 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => {
        const id = name + '-' + option.value;
        const descId = id + '-desc';

        return (
          <div key={option.value} className="flex items-start gap-2.5">
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-describedby={descId}
              className={DOT}
            />
            <div>
              <label
                htmlFor={id}
                className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                {option.title}
              </label>
              <p id={descId} className="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
}`,
      nextjs: `'use client';

interface DescribedOption {
  value: string;
  title: string;
  description: string;
}

interface DescribedRadioGroupProps {
  name: string;
  legend: string;
  options: readonly DescribedOption[];
  value: string;
  onChange: (value: string) => void;
}

const DOT =
  'mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function DescribedRadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: DescribedRadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-3.5 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => {
        const id = name + '-' + option.value;
        const descId = id + '-desc';

        return (
          <div key={option.value} className="flex items-start gap-2.5">
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              // The description is referenced, not wrapped: it is announced after
              // the option's name instead of becoming part of it.
              aria-describedby={descId}
              className={DOT}
            />
            <div>
              <label
                htmlFor={id}
                className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                {option.title}
              </label>
              <p id={descId} className="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
}`,
      typescript: `'use client';

export interface DescribedOption {
  value: string;
  /** Goes inside the <label> - this is the option's accessible name. */
  title: string;
  /** Referenced by aria-describedby, so it is announced after the name. */
  description: string;
}

export interface DescribedRadioGroupProps {
  name: string;
  legend: string;
  options: readonly DescribedOption[];
  value: string;
  onChange: (value: string) => void;
}

const DOT =
  'mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function DescribedRadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: DescribedRadioGroupProps): JSX.Element {
  return (
    <fieldset className="flex flex-col gap-3.5 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => {
        const id = name + '-' + option.value;
        const descId = id + '-desc';

        return (
          <div key={option.value} className="flex items-start gap-2.5">
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-describedby={descId}
              className={DOT}
            />
            <div>
              <label
                htmlFor={id}
                className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                {option.title}
              </label>
              <p
                id={descId}
                className="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400"
              >
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
}`,
    },
  },
  {
    slug: 'radio-inline',
    category: 'forms',
    tags: ['radio', 'inline', 'horizontal', 'compact', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 720, copies: 188, downloads: 47 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'groupName' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The same radio group as \`radio-basic\`, laid out in a row - for two or three
  short options where a stacked list wastes a whole block of the form.

  \`flex-wrap\` is not optional. A row of options that cannot wrap either overflows
  the form or forces a horizontal scroll at 320px, and at 200% zoom that is a
  reflow failure, not a cosmetic one.
-->
<fieldset class="radio-inline">
  <legend class="radio-inline__legend">Priority</legend>

  <div class="radio-inline__options">
    <label class="radio-inline__row" for="priority-low">
      <input class="radio-inline__input" type="radio" id="priority-low" name="priority" value="low" />
      <span class="radio-inline__label">Low</span>
    </label>

    <label class="radio-inline__row" for="priority-normal">
      <input class="radio-inline__input" type="radio" id="priority-normal" name="priority" value="normal" checked />
      <span class="radio-inline__label">Normal</span>
    </label>

    <label class="radio-inline__row" for="priority-high">
      <input class="radio-inline__input" type="radio" id="priority-high" name="priority" value="high" />
      <span class="radio-inline__label">High</span>
    </label>

    <label class="radio-inline__row" for="priority-urgent">
      <input class="radio-inline__input" type="radio" id="priority-urgent" name="priority" value="urgent" />
      <span class="radio-inline__label">Urgent</span>
    </label>
  </div>
</fieldset>`,
      css: `.radio-inline {
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-inline__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.radio-inline__options {
  display: flex;
  flex-wrap: wrap;
  /* Row gap as well as column gap, so wrapped rows do not collide. */
  gap: 0.5rem 1.25rem;
}

.radio-inline__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.75rem;
  cursor: pointer;
}

.radio-inline__input {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.radio-inline__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.radio-inline__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.radio-inline__label {
  font-size: 0.875rem;
  color: #111827;
  white-space: nowrap;
}

@media (prefers-color-scheme: dark) {
  .radio-inline__legend,
  .radio-inline__label {
    color: #f3f4f6;
  }

  .radio-inline__input {
    accent-color: #3b82f6;
  }

  .radio-inline__input:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<fieldset class="border-0 p-0">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">Priority</legend>

  <div class="flex flex-wrap gap-x-5 gap-y-2">
    <label for="priority-low" class="flex min-h-7 cursor-pointer items-center gap-2">
      <input type="radio" id="priority-low" name="priority" value="low" class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Low</span>
    </label>

    <label for="priority-normal" class="flex min-h-7 cursor-pointer items-center gap-2">
      <input type="radio" id="priority-normal" name="priority" value="normal" checked class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Normal</span>
    </label>

    <label for="priority-high" class="flex min-h-7 cursor-pointer items-center gap-2">
      <input type="radio" id="priority-high" name="priority" value="high" class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">High</span>
    </label>

    <label for="priority-urgent" class="flex min-h-7 cursor-pointer items-center gap-2">
      <input type="radio" id="priority-urgent" name="priority" value="urgent" class="h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400" />
      <span class="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Urgent</span>
    </label>
  </div>
</fieldset>`,
      react: `const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function InlineRadioGroup({ name, legend, options, value, onChange }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={name + '-' + option.value}
            className="flex min-h-7 cursor-pointer items-center gap-2"
          >
            <input
              id={name + '-' + option.value}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={DOT}
            />
            <span className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
      nextjs: `'use client';

interface InlineOption {
  value: string;
  label: string;
}

interface InlineRadioGroupProps {
  name: string;
  legend: string;
  options: readonly InlineOption[];
  value: string;
  onChange: (value: string) => void;
}

const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function InlineRadioGroup({ name, legend, options, value, onChange }: InlineRadioGroupProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {/* flex-wrap, not nowrap: the row has to be allowed to break at 320px. */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={name + '-' + option.value}
            className="flex min-h-7 cursor-pointer items-center gap-2"
          >
            <input
              id={name + '-' + option.value}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={DOT}
            />
            <span className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
      typescript: `'use client';

export interface InlineOption {
  value: string;
  label: string;
}

export interface InlineRadioGroupProps {
  name: string;
  legend: string;
  options: readonly InlineOption[];
  value: string;
  onChange: (value: string) => void;
}

const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function InlineRadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: InlineRadioGroupProps): JSX.Element {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={name + '-' + option.value}
            className="flex min-h-7 cursor-pointer items-center gap-2"
          >
            <input
              id={name + '-' + option.value}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={DOT}
            />
            <span className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}`,
    },
  },
];
