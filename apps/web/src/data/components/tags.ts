import type { ComponentEntry } from './types';

/**
 * Tags category.
 *
 * Ten structurally different tag/chip patterns, not ten recolours of one pill.
 * The shared constraint is the one that makes tags hard: a chip row holds an
 * unknown number of items of unknown width, so every variant here wraps
 * (`flex-wrap`) - a horizontal-scrolling or clipped chip row is the failure mode
 * this batch exists to avoid. The second shared rule is the remove affordance:
 * where a chip is dismissible it is a real `<button>` with an
 * `aria-label="Remove …"`, never a bare glyph, and the input-driven variants
 * return focus to the field after a removal so a keyboard user is never
 * stranded on a control that just vanished.
 */
export const tagsComponents: ComponentEntry[] = [
  {
    slug: 'tag-input-chips',
    category: 'tags',
    tags: ['tags', 'chips', 'input', 'multi-value', 'form'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'limited', labelKey: 'limited' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'defaultTags', type: 'string[]', default: '[]', descriptionKey: 'defaultTags' },
      { name: 'placeholder', type: 'string', default: "'Add a tag…'", descriptionKey: 'placeholder' },
      { name: 'max', type: 'number', descriptionKey: 'max' },
      { name: 'onChange', type: '(tags: string[]) => void', descriptionKey: 'onChange' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The whole box is the input surface: focus-within lifts the ring so a chip row
  plus a text field reads as one control. The chips wrap above the input rather
  than pushing it off the right edge - min-w keeps the field usable once wrapped.
-->
<div class="w-full">
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="tag-input">Tags</label>
  <div class="flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400">
    <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-2.5 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
      Design
      <button type="button" aria-label="Remove Design" class="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-3.5 w-3.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </span>
    <input id="tag-input" type="text" placeholder="Add a tag…" class="min-w-[8rem] flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-400" />
  </div>
</div>`,
      react: `import { useId, useRef, useState } from 'react';

export function TagInputChips({
  label,
  defaultTags = [],
  placeholder = 'Add a tag…',
  max,
  onChange,
  className = '',
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [tags, setTags] = useState(defaultTags);
  const [draft, setDraft] = useState('');

  const atLimit = max !== undefined && tags.length >= max;

  function commit(next) {
    setTags(next);
    onChange?.(next);
  }

  function addTag(raw) {
    const value = raw.trim();
    if (!value || atLimit) return;
    // Case-insensitive de-dupe: two chips differing only in case read as one tag.
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    commit([...tags, value]);
    setDraft('');
  }

  function removeAt(index) {
    commit(tags.filter((_, i) => i !== index));
    // Focus returns to the field so a keyboard user is not stranded on a button that just unmounted.
    inputRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      commit(tags.slice(0, -1));
    }
  }

  return (
    <div className={\`w-full \${className}\`}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex cursor-text flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400"
      >
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-2.5 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={\`Remove \${tag}\`}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </span>
        ))}
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={draft}
          disabled={atLimit}
          placeholder={atLimit ? 'Limit reached' : placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-[8rem] flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState, type KeyboardEvent } from 'react';

export interface TagInputChipsProps {
  label: string;
  defaultTags?: string[];
  placeholder?: string;
  /** Cap the chip count; the field disables itself once reached. */
  max?: number;
  onChange?: (tags: string[]) => void;
  className?: string;
}

export function TagInputChips({
  label,
  defaultTags = [],
  placeholder = 'Add a tag…',
  max,
  onChange,
  className = '',
}: TagInputChipsProps): JSX.Element {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [draft, setDraft] = useState('');

  const atLimit = max !== undefined && tags.length >= max;

  function commit(next: string[]): void {
    setTags(next);
    onChange?.(next);
  }

  function addTag(raw: string): void {
    const value = raw.trim();
    if (!value || atLimit) return;
    // Case-insensitive de-dupe: two chips differing only in case read as one tag.
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    commit([...tags, value]);
    setDraft('');
  }

  function removeAt(index: number): void {
    commit(tags.filter((_, i) => i !== index));
    // Focus returns to the field so a keyboard user is not stranded on a button that just unmounted.
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      commit(tags.slice(0, -1));
    }
  }

  return (
    <div className={\`w-full \${className}\`}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex cursor-text flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400"
      >
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-2.5 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={\`Remove \${tag}\`}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </span>
        ))}
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={draft}
          disabled={atLimit}
          placeholder={atLimit ? 'Limit reached' : placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-[8rem] flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'tag-removable-list',
    category: 'tags',
    tags: ['tags', 'chips', 'removable', 'filters', 'list'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'empty', labelKey: 'empty' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Applied filters'", descriptionKey: 'label' },
      { name: 'defaultTags', type: 'string[]', default: '[]', descriptionKey: 'defaultTags' },
      { name: 'onRemove', type: '(tag: string, tags: string[]) => void', descriptionKey: 'onRemove' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full">
  <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Applied filters</p>
  <!-- A <ul> because it is a list; the row wraps so any number of chips is safe. -->
  <ul class="flex flex-wrap gap-2">
    <li>
      <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
        In stock
        <button type="button" aria-label="Remove In stock" class="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-3.5 w-3.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </span>
    </li>
  </ul>
</div>`,
      react: `import { useState } from 'react';

export function TagRemovableList({
  label = 'Applied filters',
  defaultTags = [],
  onRemove,
  className = '',
}) {
  const [tags, setTags] = useState(defaultTags);

  function remove(tag) {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    onRemove?.(tag, next);
  }

  return (
    <div className={\`w-full \${className}\`}>
      {label ? (
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      ) : null}
      {tags.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No tags applied.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {tag}
                <button
                  type="button"
                  onClick={() => remove(tag)}
                  aria-label={\`Remove \${tag}\`}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TagRemovableListProps {
  label?: string;
  defaultTags?: string[];
  onRemove?: (tag: string, tags: string[]) => void;
  className?: string;
}

export function TagRemovableList({
  label = 'Applied filters',
  defaultTags = [],
  onRemove,
  className = '',
}: TagRemovableListProps): JSX.Element {
  const [tags, setTags] = useState<string[]>(defaultTags);

  function remove(tag: string): void {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    onRemove?.(tag, next);
  }

  return (
    <div className={\`w-full \${className}\`}>
      {label ? (
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      ) : null}
      {tags.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No tags applied.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {tag}
                <button
                  type="button"
                  onClick={() => remove(tag)}
                  aria-label={\`Remove \${tag}\`}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    },
  },
  {
    slug: 'tag-colored-categories',
    category: 'tags',
    tags: ['tags', 'categories', 'colored', 'labels', 'badges'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'solid', labelKey: 'solid' },
      { id: 'dot', labelKey: 'dot' },
    ],
    props: [
      { name: 'items', type: 'Array<{ label: string; color: TagColor }>', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Colour is a fixed palette keyed by name, not free-form hex. A closed set is the
  only way tint + text keep a readable pairing in both themes - an arbitrary
  colour cannot guarantee its own contrast.
-->
<ul class="flex flex-wrap gap-2">
  <li>
    <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">Engineering</span>
  </li>
  <li>
    <span class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">Design</span>
  </li>
  <li>
    <span class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-sm font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">Sales</span>
  </li>
</ul>`,
      react: `const COLORS = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};

export function TagColoredCategories({ items, className = '' }) {
  return (
    <ul className={\`flex flex-wrap gap-2 \${className}\`}>
      {items.map((item) => (
        <li key={item.label}>
          <span className={\`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium \${COLORS[item.color] ?? COLORS.gray}\`}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export type TagColor = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'purple';

export interface TagCategory {
  label: string;
  color: TagColor;
}

export interface TagColoredCategoriesProps {
  items: TagCategory[];
  className?: string;
}

// Static class strings per colour so Tailwind's compiler sees every variant -
// a template-built class like \`bg-\${color}-50\` would be purged from the build.
const COLORS: Record<TagColor, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};

export function TagColoredCategories({ items, className = '' }: TagColoredCategoriesProps): JSX.Element {
  return (
    <ul className={\`flex flex-wrap gap-2 \${className}\`}>
      {items.map((item) => (
        <li key={item.label}>
          <span className={\`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium \${COLORS[item.color]}\`}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'tag-filter-toggle',
    category: 'tags',
    tags: ['tags', 'filter', 'toggle', 'facets', 'chips'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'active', labelKey: 'active' },
    ],
    props: [
      { name: 'options', type: 'string[]', required: true, descriptionKey: 'options' },
      { name: 'defaultActive', type: 'string[]', default: '[]', descriptionKey: 'defaultActive' },
      { name: 'onChange', type: '(active: string[]) => void', descriptionKey: 'onChange' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Each filter is a toggle button carrying aria-pressed - that is what tells a
  screen reader the chip is on, since colour alone never can.
-->
<div class="w-full">
  <div class="flex flex-wrap gap-2">
    <button type="button" aria-pressed="true" class="rounded-full border border-blue-600 bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900">Remote</button>
    <button type="button" aria-pressed="false" class="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900">Full-time</button>
  </div>
</div>`,
      react: `import { useState } from 'react';

export function TagFilterToggle({ options, defaultActive = [], onChange, className = '' }) {
  const [active, setActive] = useState(defaultActive);

  function toggle(option) {
    const next = active.includes(option)
      ? active.filter((o) => o !== option)
      : [...active, option];
    setActive(next);
    onChange?.(next);
  }

  return (
    <div className={\`w-full \${className}\`}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = active.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option)}
              className={\`rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900 \${
                on
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }\`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {active.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            setActive([]);
            onChange?.([]);
          }}
          className="mt-3 text-sm font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400"
        >
          Clear {active.length} selected
        </button>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TagFilterToggleProps {
  options: string[];
  defaultActive?: string[];
  onChange?: (active: string[]) => void;
  className?: string;
}

export function TagFilterToggle({
  options,
  defaultActive = [],
  onChange,
  className = '',
}: TagFilterToggleProps): JSX.Element {
  const [active, setActive] = useState<string[]>(defaultActive);

  function toggle(option: string): void {
    const next = active.includes(option)
      ? active.filter((o) => o !== option)
      : [...active, option];
    setActive(next);
    onChange?.(next);
  }

  return (
    <div className={\`w-full \${className}\`}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = active.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option)}
              className={\`rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900 \${
                on
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }\`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {active.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            setActive([]);
            onChange?.([]);
          }}
          className="mt-3 text-sm font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400"
        >
          Clear {active.length} selected
        </button>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'tag-autocomplete',
    category: 'tags',
    tags: ['tags', 'autocomplete', 'combobox', 'suggestions', 'input'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'suggestions', type: 'string[]', required: true, descriptionKey: 'suggestions' },
      { name: 'defaultTags', type: 'string[]', default: '[]', descriptionKey: 'defaultTags' },
      { name: 'placeholder', type: 'string', default: "'Search tags…'", descriptionKey: 'placeholder' },
      { name: 'onChange', type: '(tags: string[]) => void', descriptionKey: 'onChange' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm">
  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="ac-input">Skills</label>
  <div class="mb-2 flex flex-wrap gap-2">
    <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
      TypeScript
      <button type="button" aria-label="Remove TypeScript" class="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-3.5 w-3.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </span>
  </div>
  <div class="relative">
    <input id="ac-input" type="text" role="combobox" aria-expanded="true" aria-controls="ac-list" placeholder="Search tags…" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
    <ul id="ac-list" role="listbox" class="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <li role="option" aria-selected="false" class="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">React</li>
      <li role="option" aria-selected="false" class="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">Rust</li>
    </ul>
  </div>
</div>`,
      react: `import { useId, useMemo, useState } from 'react';

export function TagAutocomplete({
  label,
  suggestions,
  defaultTags = [],
  placeholder = 'Search tags…',
  onChange,
  className = '',
}) {
  const listId = useId();
  const inputId = useId();
  const [tags, setTags] = useState(defaultTags);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suggestions.filter((s) => !tags.includes(s) && s.toLowerCase().includes(q));
  }, [suggestions, tags, query]);

  function commit(next) {
    setTags(next);
    onChange?.(next);
  }

  function add(tag) {
    if (tags.includes(tag)) return;
    commit([...tags, tag]);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {tags.length > 0 ? (
        <ul className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {tag}
                <button
                  type="button"
                  onClick={() => commit(tags.filter((t) => t !== tag))}
                  aria-label={\`Remove \${tag}\`}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        {open && matches.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {matches.map((match) => (
              <li key={match} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => add(match)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                >
                  {match}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useMemo, useState } from 'react';

export interface TagAutocompleteProps {
  label: string;
  suggestions: string[];
  defaultTags?: string[];
  placeholder?: string;
  onChange?: (tags: string[]) => void;
  className?: string;
}

export function TagAutocomplete({
  label,
  suggestions,
  defaultTags = [],
  placeholder = 'Search tags…',
  onChange,
  className = '',
}: TagAutocompleteProps): JSX.Element {
  const listId = useId();
  const inputId = useId();
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suggestions.filter((s) => !tags.includes(s) && s.toLowerCase().includes(q));
  }, [suggestions, tags, query]);

  function commit(next: string[]): void {
    setTags(next);
    onChange?.(next);
  }

  function add(tag: string): void {
    if (tags.includes(tag)) return;
    commit([...tags, tag]);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {tags.length > 0 ? (
        <ul className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {tag}
                <button
                  type="button"
                  onClick={() => commit(tags.filter((t) => t !== tag))}
                  aria-label={\`Remove \${tag}\`}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          // Delay so a click on an option registers before the list unmounts.
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        {open && matches.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {matches.map((match) => (
              <li key={match} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => add(match)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                >
                  {match}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'tag-overflow-counter',
    category: 'tags',
    tags: ['tags', 'overflow', 'counter', 'truncate', 'chips'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'expanded', labelKey: 'expanded' },
    ],
    props: [
      { name: 'tags', type: 'string[]', required: true, descriptionKey: 'tags' },
      { name: 'max', type: 'number', default: '3', descriptionKey: 'max' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Show the first few chips and roll the rest into a +N button. The button
  carries an aria-label naming the hidden count so it is not just "+2".
-->
<div class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">Marketing</span>
  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">Design</span>
  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">Sales</span>
  <button type="button" aria-label="Show 2 more tags" class="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">+2</button>
</div>`,
      react: `import { useState } from 'react';

export function TagOverflowCounter({ tags, max = 3, className = '' }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? tags : tags.slice(0, max);
  const hidden = tags.length - visible.length;

  return (
    <div className={\`flex flex-wrap items-center gap-2 \${className}\`}>
      {visible.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {tag}
        </span>
      ))}
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={\`Show \${hidden} more \${hidden === 1 ? 'tag' : 'tags'}\`}
          className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          +{hidden}
        </button>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TagOverflowCounterProps {
  tags: string[];
  /** How many chips to show before collapsing the rest into +N. */
  max?: number;
  className?: string;
}

export function TagOverflowCounter({ tags, max = 3, className = '' }: TagOverflowCounterProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? tags : tags.slice(0, max);
  const hidden = tags.length - visible.length;

  return (
    <div className={\`flex flex-wrap items-center gap-2 \${className}\`}>
      {visible.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {tag}
        </span>
      ))}
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={\`Show \${hidden} more \${hidden === 1 ? 'tag' : 'tags'}\`}
          className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          +{hidden}
        </button>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'tag-selectable-grid',
    category: 'tags',
    tags: ['tags', 'selectable', 'grid', 'multi-select', 'interests'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'selected', labelKey: 'selected' },
    ],
    props: [
      { name: 'options', type: 'string[]', required: true, descriptionKey: 'options' },
      { name: 'defaultSelected', type: 'string[]', default: '[]', descriptionKey: 'defaultSelected' },
      { name: 'onChange', type: '(selected: string[]) => void', descriptionKey: 'onChange' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A wrapping grid of multi-select chips. Each is aria-pressed; the check glyph is
  a redundant, decorative cue on top of the state colour, never the only signal.
-->
<div class="flex flex-wrap gap-2">
  <button type="button" aria-pressed="true" class="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-950 dark:text-blue-200 dark:focus-visible:ring-offset-gray-900">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
    Photography
  </button>
  <button type="button" aria-pressed="false" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900">Travel</button>
</div>`,
      react: `import { useState } from 'react';

export function TagSelectableGrid({ options, defaultSelected = [], onChange, className = '' }) {
  const [selected, setSelected] = useState(defaultSelected);

  function toggle(option) {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    setSelected(next);
    onChange?.(next);
  }

  return (
    <div className={\`flex flex-wrap gap-2 \${className}\`}>
      {options.map((option) => {
        const on = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(option)}
            className={\`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900 \${
              on
                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            }\`}
          >
            {on ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
            {option}
          </button>
        );
      })}
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TagSelectableGridProps {
  options: string[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  className?: string;
}

export function TagSelectableGrid({
  options,
  defaultSelected = [],
  onChange,
  className = '',
}: TagSelectableGridProps): JSX.Element {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  function toggle(option: string): void {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    setSelected(next);
    onChange?.(next);
  }

  return (
    <div className={\`flex flex-wrap gap-2 \${className}\`}>
      {options.map((option) => {
        const on = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(option)}
            className={\`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900 \${
              on
                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            }\`}
          >
            {on ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
            {option}
          </button>
        );
      })}
    </div>
  );
}`,
    },
  },
  {
    slug: 'tag-with-icons',
    category: 'tags',
    tags: ['tags', 'icons', 'chips', 'labels', 'metadata'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'outline', labelKey: 'outline' },
    ],
    props: [
      { name: 'items', type: 'Array<{ label: string; icon: TagIcon }>', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The leading glyph is aria-hidden: the text label already names the tag. -->
<ul class="flex flex-wrap gap-2">
  <li>
    <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
      <svg viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5 text-amber-500" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
      Featured
    </span>
  </li>
  <li>
    <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
      <svg viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5 text-blue-500" aria-hidden="true"><path d="M13 2 4.5 13H11l-1 9 8.5-11H12z" /></svg>
      Fast
    </span>
  </li>
</ul>`,
      react: `const ICONS = {
  star: { className: 'text-amber-500', path: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z' },
  bolt: { className: 'text-blue-500', path: 'M13 2 4.5 13H11l-1 9 8.5-11H12z' },
  check: { className: 'text-green-500', path: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z' },
  tag: { className: 'text-purple-500', path: 'M2 12 12 2h8v8L10 20z M15.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' },
};

export function TagWithIcons({ items, className = '' }) {
  return (
    <ul className={\`flex flex-wrap gap-2 \${className}\`}>
      {items.map((item) => {
        const icon = ICONS[item.icon] ?? ICONS.tag;
        return (
          <li key={item.label}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className={\`h-3.5 w-3.5 \${icon.className}\`} aria-hidden="true">
                <path d={icon.path} />
              </svg>
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}`,
      typescript: `export type TagIcon = 'star' | 'bolt' | 'check' | 'tag';

export interface TagWithIconItem {
  label: string;
  icon: TagIcon;
}

export interface TagWithIconsProps {
  items: TagWithIconItem[];
  className?: string;
}

const ICONS: Record<TagIcon, { className: string; path: string }> = {
  star: { className: 'text-amber-500', path: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z' },
  bolt: { className: 'text-blue-500', path: 'M13 2 4.5 13H11l-1 9 8.5-11H12z' },
  check: { className: 'text-green-500', path: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z' },
  tag: { className: 'text-purple-500', path: 'M2 12 12 2h8v8L10 20z M15.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' },
};

export function TagWithIcons({ items, className = '' }: TagWithIconsProps): JSX.Element {
  return (
    <ul className={\`flex flex-wrap gap-2 \${className}\`}>
      {items.map((item) => {
        const icon = ICONS[item.icon];
        return (
          <li key={item.label}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className={\`h-3.5 w-3.5 \${icon.className}\`} aria-hidden="true">
                <path d={icon.path} />
              </svg>
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'tag-editable',
    category: 'tags',
    tags: ['tags', 'editable', 'inline-edit', 'chips', 'rename'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'editing', labelKey: 'editing' },
    ],
    props: [
      { name: 'defaultTags', type: 'string[]', default: '[]', descriptionKey: 'defaultTags' },
      { name: 'onChange', type: '(tags: string[]) => void', descriptionKey: 'onChange' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A chip whose label doubles as an "Edit" button; activating it swaps in a text
  field (Enter commits, Escape cancels). Static markup shows the resting state.
-->
<ul class="flex flex-wrap gap-2">
  <li>
    <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-1 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
      <button type="button" aria-label="Edit backend" class="rounded-full px-2 py-0.5 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400">backend</button>
      <button type="button" aria-label="Remove backend" class="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-3.5 w-3.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </span>
  </li>
</ul>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function TagEditable({ defaultTags = [], onChange, className = '' }) {
  const [tags, setTags] = useState(defaultTags);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing !== null) inputRef.current?.select();
  }, [editing]);

  function commit(next) {
    setTags(next);
    onChange?.(next);
  }

  function startEdit(index) {
    setEditing(index);
    setDraft(tags[index] ?? '');
  }

  function saveEdit() {
    if (editing === null) return;
    const value = draft.trim();
    const next = value
      ? tags.map((t, i) => (i === editing ? value : t))
      : tags.filter((_, i) => i !== editing);
    commit(next);
    setEditing(null);
  }

  return (
    <ul className={\`flex flex-wrap gap-2 \${className}\`}>
      {tags.map((tag, index) =>
        editing === index ? (
          <li key={\`edit-\${index}\`}>
            <input
              ref={inputRef}
              value={draft}
              aria-label={\`Rename \${tag}\`}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={saveEdit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  saveEdit();
                } else if (event.key === 'Escape') {
                  setEditing(null);
                }
              }}
              className="w-28 rounded-full border border-blue-500 bg-white px-3 py-1 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"
            />
          </li>
        ) : (
          <li key={tag}>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-1 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <button
                type="button"
                onClick={() => startEdit(index)}
                aria-label={\`Edit \${tag}\`}
                className="rounded-full px-2 py-0.5 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400"
              >
                {tag}
              </button>
              <button
                type="button"
                onClick={() => commit(tags.filter((_, i) => i !== index))}
                aria-label={\`Remove \${tag}\`}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';

export interface TagEditableProps {
  defaultTags?: string[];
  onChange?: (tags: string[]) => void;
  className?: string;
}

export function TagEditable({ defaultTags = [], onChange, className = '' }: TagEditableProps): JSX.Element {
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing !== null) inputRef.current?.select();
  }, [editing]);

  function commit(next: string[]): void {
    setTags(next);
    onChange?.(next);
  }

  function startEdit(index: number): void {
    setEditing(index);
    setDraft(tags[index] ?? '');
  }

  function saveEdit(): void {
    if (editing === null) return;
    const value = draft.trim();
    // An emptied field deletes the tag rather than leaving a blank chip.
    const next = value
      ? tags.map((t, i) => (i === editing ? value : t))
      : tags.filter((_, i) => i !== editing);
    commit(next);
    setEditing(null);
  }

  return (
    <ul className={\`flex flex-wrap gap-2 \${className}\`}>
      {tags.map((tag, index) =>
        editing === index ? (
          <li key={\`edit-\${index}\`}>
            <input
              ref={inputRef}
              value={draft}
              aria-label={\`Rename \${tag}\`}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={saveEdit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  saveEdit();
                } else if (event.key === 'Escape') {
                  setEditing(null);
                }
              }}
              className="w-28 rounded-full border border-blue-500 bg-white px-3 py-1 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"
            />
          </li>
        ) : (
          <li key={tag}>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-1 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <button
                type="button"
                onClick={() => startEdit(index)}
                aria-label={\`Edit \${tag}\`}
                className="rounded-full px-2 py-0.5 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400"
              >
                {tag}
              </button>
              <button
                type="button"
                onClick={() => commit(tags.filter((_, i) => i !== index))}
                aria-label={\`Remove \${tag}\`}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'tag-size-variants',
    category: 'tags',
    tags: ['tags', 'sizes', 'chips', 'scale', 'variants'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'sm', labelKey: 'sm' },
      { id: 'md', labelKey: 'md' },
      { id: 'lg', labelKey: 'lg' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", descriptionKey: 'size' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- One chip, three sizes - padding and text scale together per step. -->
<div class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">Small</span>
  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">Medium</span>
  <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-base font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">Large</span>
</div>`,
      react: `const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function TagSizeVariants({ label, size = 'md', className = '' }) {
  return (
    <span
      className={\`inline-flex items-center rounded-full bg-gray-100 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200 \${SIZES[size] ?? SIZES.md} \${className}\`}
    >
      {label}
    </span>
  );
}`,
      typescript: `export type TagSize = 'sm' | 'md' | 'lg';

export interface TagSizeVariantsProps {
  label: string;
  size?: TagSize;
  className?: string;
}

const SIZES: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function TagSizeVariants({ label, size = 'md', className = '' }: TagSizeVariantsProps): JSX.Element {
  return (
    <span
      className={\`inline-flex items-center rounded-full bg-gray-100 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200 \${SIZES[size]} \${className}\`}
    >
      {label}
    </span>
  );
}`,
    },
  },
];
