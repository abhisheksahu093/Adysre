import type { ComponentEntry } from './types';

/**
 * Lists category.
 *
 * Ten structurally different list rows, not ten recolours of one. The shared
 * constraint is the reason this batch exists: a list row is the widest thing a
 * layout owns - avatar, two lines of text, a timestamp and an action all fight
 * for one line - and it has to survive a 320px phone without either overflowing
 * the page or crushing its tap targets. Every row here uses the same defence:
 * `min-w-0` + `truncate` on the flexible text so it clips instead of pushing,
 * secondary metadata that wraps below or hides under `sm:`, and trailing
 * controls that stay at least 40px so a thumb can still hit them.
 */
export const listsComponents: ComponentEntry[] = [
  {
    slug: 'list-divided-basic',
    category: 'lists',
    tags: ['list', 'divided', 'basic', 'ul', 'rows'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'items', type: 'ListItem[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'List'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  A real <ul>/<li>, not a stack of <div>s: a screen reader announces "list, 4
  items" and lets the user jump the whole block. min-w-0 + truncate on the
  primary text is what stops a long label from shoving the meta off-screen at
  320px; the meta itself hides below sm rather than wrapping into the label.
-->
<ul class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Team members">
  <li class="flex items-center justify-between gap-3 px-4 py-3">
    <span class="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">Amara Okafor</span>
    <span class="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">Owner</span>
  </li>
  <li class="flex items-center justify-between gap-3 px-4 py-3">
    <span class="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">Bhavesh Ramachandran</span>
    <span class="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">Admin</span>
  </li>
  <li class="flex items-center justify-between gap-3 px-4 py-3">
    <span class="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">Chen Wei</span>
    <span class="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">Member</span>
  </li>
</ul>`,
      react: `export function ListDividedBasic({ items, ariaLabel = 'List' }) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {item.primary}
          </span>
          {item.secondary ? (
            <span className="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">
              {item.secondary}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface ListItem {
  id: string;
  primary: string;
  /** Hidden below sm - it must not be the only place a value lives. */
  secondary?: string;
}

export interface ListDividedBasicProps {
  items: ListItem[];
  ariaLabel?: string;
}

export function ListDividedBasic({
  items,
  ariaLabel = 'List',
}: ListDividedBasicProps): JSX.Element {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {item.primary}
          </span>
          {item.secondary ? (
            <span className="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">
              {item.secondary}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'list-avatar-actions',
    category: 'lists',
    tags: ['list', 'avatar', 'actions', 'contacts', 'initials'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'ContactItem[]', required: true, descriptionKey: 'items' },
      { name: 'actionLabel', type: 'string', default: "'Options'", descriptionKey: 'actionLabel' },
      { name: 'ariaLabel', type: 'string', default: "'Contacts'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  No external images: the avatar is a gradient circle carrying the initials,
  aria-hidden because the name sits right beside it. The email is the row's
  secondary line and hides below sm; the trailing button is h-10 w-10 (40px) so
  it is a real tap target on touch, never a 24px icon you keep missing.
-->
<ul class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Contacts">
  <li class="flex items-center gap-3 px-3 py-2.5">
    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white" aria-hidden="true">AO</span>
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Amara Okafor</span>
      <span class="block truncate text-xs text-gray-500 dark:text-gray-400">amara@adysre.com</span>
    </span>
    <button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400" aria-label="Options for Amara Okafor">
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path d="M10 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM11.5 15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg>
    </button>
  </li>
</ul>`,
      react: `const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
];

function initials(name) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ListAvatarActions({ items, actionLabel = 'Options', ariaLabel = 'Contacts' }) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <span
            aria-hidden="true"
            className={\`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br \${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} text-xs font-semibold text-white\`}
          >
            {initials(item.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.name}
            </span>
            {item.email ? (
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                {item.email}
              </span>
            ) : null}
          </span>
          <button
            type="button"
            aria-label={\`\${actionLabel} for \${item.name}\`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M10 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM11.5 15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
] as const;

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export interface ContactItem {
  id: string;
  name: string;
  email?: string;
}

export interface ListAvatarActionsProps {
  items: ContactItem[];
  actionLabel?: string;
  ariaLabel?: string;
}

export function ListAvatarActions({
  items,
  actionLabel = 'Options',
  ariaLabel = 'Contacts',
}: ListAvatarActionsProps): JSX.Element {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <span
            aria-hidden="true"
            className={\`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br \${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} text-xs font-semibold text-white\`}
          >
            {initials(item.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.name}
            </span>
            {item.email ? (
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                {item.email}
              </span>
            ) : null}
          </span>
          <button
            type="button"
            aria-label={\`\${actionLabel} for \${item.name}\`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M10 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM11.5 15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'list-selectable-checkbox',
    category: 'lists',
    tags: ['list', 'selectable', 'checkbox', 'multi-select', 'interactive'],
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
      { name: 'items', type: 'SelectableItem[]', required: true, descriptionKey: 'items' },
      { name: 'defaultSelected', type: 'string[]', default: '[]', descriptionKey: 'defaultSelected' },
      { name: 'legend', type: 'string', default: "'Select items'", descriptionKey: 'legend' },
    ],
    code: {
      tailwind: `<!--
  The whole row is the <label>, so the hit area is the row, not a 20px box. The
  checked state paints a tinted background AND the native check stays visible -
  colour is never the only signal. min-w-0 + truncate keeps a long name from
  shoving the checkbox off the edge at 320px.
-->
<fieldset class="w-full border-0 p-0">
  <legend class="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">Select items</legend>
  <ul class="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
    <li>
      <label class="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50 has-[:checked]:bg-blue-50 dark:hover:bg-gray-800 dark:has-[:checked]:bg-blue-950">
        <input type="checkbox" class="h-5 w-5 shrink-0 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500" checked />
        <span class="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">Q3 revenue report.pdf</span>
      </label>
    </li>
    <li>
      <label class="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50 has-[:checked]:bg-blue-50 dark:hover:bg-gray-800 dark:has-[:checked]:bg-blue-950">
        <input type="checkbox" class="h-5 w-5 shrink-0 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500" />
        <span class="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">Design system audit.fig</span>
      </label>
    </li>
  </ul>
</fieldset>`,
      react: `import { useState } from 'react';

export function ListSelectableCheckbox({ items, defaultSelected = [], legend = 'Select items' }) {
  const [selected, setSelected] = useState(new Set(defaultSelected));

  function toggle(id) {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <fieldset className="w-full border-0 p-0">
      <legend className="mb-2 flex w-full items-center justify-between p-0">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{legend}</span>
        <span className="text-xs font-normal tabular-nums text-gray-500 dark:text-gray-400">
          {selected.size} selected
        </span>
      </legend>
      <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50 has-[:checked]:bg-blue-50 dark:hover:bg-gray-800 dark:has-[:checked]:bg-blue-950">
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggle(item.id)}
                className="h-5 w-5 shrink-0 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500"
              />
              <span className="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}`,
      typescript: `import { useState } from 'react';

export interface SelectableItem {
  id: string;
  label: string;
}

export interface ListSelectableCheckboxProps {
  items: SelectableItem[];
  defaultSelected?: string[];
  legend?: string;
}

export function ListSelectableCheckbox({
  items,
  defaultSelected = [],
  legend = 'Select items',
}: ListSelectableCheckboxProps): JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));

  function toggle(id: string): void {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <fieldset className="w-full border-0 p-0">
      <legend className="mb-2 flex w-full items-center justify-between p-0">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{legend}</span>
        <span className="text-xs font-normal tabular-nums text-gray-500 dark:text-gray-400">
          {selected.size} selected
        </span>
      </legend>
      <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50 has-[:checked]:bg-blue-50 dark:hover:bg-gray-800 dark:has-[:checked]:bg-blue-950">
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggle(item.id)}
                className="h-5 w-5 shrink-0 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500"
              />
              <span className="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
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
    slug: 'list-inbox-two-line',
    category: 'lists',
    tags: ['list', 'inbox', 'email', 'two-line', 'unread'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'unread', labelKey: 'unread' },
    ],
    props: [
      { name: 'items', type: 'InboxItem[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Inbox'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  Three text spans compete for one line: sender, subject and time. The time is
  shrink-0 so it never truncates (a half-clipped timestamp is useless); sender
  and subject each get min-w-0 + truncate. The preview line is the row's third
  tier and hides below sm - on a phone the subject is enough. The unread dot is
  a redundant cue: the sender also goes bold, so colour is not the only signal.
-->
<ul class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Inbox">
  <li>
    <a href="#" class="flex gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
      <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-label="Unread"></span>
      <span class="min-w-0 flex-1">
        <span class="flex items-baseline justify-between gap-2">
          <span class="min-w-0 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Stripe</span>
          <span class="shrink-0 text-xs text-gray-400 dark:text-gray-500">9:41 AM</span>
        </span>
        <span class="mt-0.5 block truncate text-sm text-gray-700 dark:text-gray-300">Your payout is on the way</span>
        <span class="mt-0.5 hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">$4,208.00 will arrive in your account within 2 business days.</span>
      </span>
    </a>
  </li>
</ul>`,
      react: `export function ListInboxTwoLine({ items, ariaLabel = 'Inbox' }) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href ?? '#'}
            className="flex gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <span
              aria-label={item.unread ? 'Unread' : undefined}
              className={\`mt-1.5 h-2 w-2 shrink-0 rounded-full \${item.unread ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}\`}
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span
                  className={\`min-w-0 truncate text-sm text-gray-900 dark:text-gray-100 \${item.unread ? 'font-semibold' : 'font-medium'}\`}
                >
                  {item.sender}
                </span>
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{item.time}</span>
              </span>
              <span className="mt-0.5 block truncate text-sm text-gray-700 dark:text-gray-300">
                {item.subject}
              </span>
              {item.preview ? (
                <span className="mt-0.5 hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">
                  {item.preview}
                </span>
              ) : null}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface InboxItem {
  id: string;
  sender: string;
  subject: string;
  time: string;
  preview?: string;
  href?: string;
  unread?: boolean;
}

export interface ListInboxTwoLineProps {
  items: InboxItem[];
  ariaLabel?: string;
}

export function ListInboxTwoLine({
  items,
  ariaLabel = 'Inbox',
}: ListInboxTwoLineProps): JSX.Element {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href ?? '#'}
            className="flex gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <span
              aria-label={item.unread ? 'Unread' : undefined}
              className={\`mt-1.5 h-2 w-2 shrink-0 rounded-full \${item.unread ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}\`}
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span
                  className={\`min-w-0 truncate text-sm text-gray-900 dark:text-gray-100 \${item.unread ? 'font-semibold' : 'font-medium'}\`}
                >
                  {item.sender}
                </span>
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{item.time}</span>
              </span>
              <span className="mt-0.5 block truncate text-sm text-gray-700 dark:text-gray-300">
                {item.subject}
              </span>
              {item.preview ? (
                <span className="mt-0.5 hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">
                  {item.preview}
                </span>
              ) : null}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'list-media-thumbnail',
    category: 'lists',
    tags: ['list', 'media', 'thumbnail', 'gradient', 'rows'],
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
    ],
    props: [
      { name: 'items', type: 'MediaItem[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Media'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  The thumbnail is a fixed-size gradient tile (no external image to preload or
  let rot) carrying a mono glyph. It is shrink-0 so it holds its 48px square
  while the text column takes min-w-0 + truncate. The description is line-clamped
  to one line and the trailing badge hides below sm.
-->
<ul class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Media">
  <li class="flex items-center gap-3 px-3 py-2.5">
    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-bold text-white" aria-hidden="true">MP4</span>
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Launch teaser final cut</span>
      <span class="block truncate text-xs text-gray-500 dark:text-gray-400">1920x1080 · 24 MB · edited 2h ago</span>
    </span>
    <span class="hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">Video</span>
  </li>
</ul>`,
      react: `const THUMB_GRADIENTS = [
  'from-rose-500 to-orange-500',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-green-600',
];

export function ListMediaThumbnail({ items, ariaLabel = 'Media' }) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <span
            aria-hidden="true"
            className={\`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br \${THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]} text-sm font-bold text-white\`}
          >
            {item.glyph}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.title}
            </span>
            {item.description ? (
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
            ) : null}
          </span>
          {item.badge ? (
            <span className="hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">
              {item.badge}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `const THUMB_GRADIENTS = [
  'from-rose-500 to-orange-500',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-green-600',
] as const;

export interface MediaItem {
  id: string;
  title: string;
  /** Short glyph shown in the gradient tile, e.g. a file type. */
  glyph: string;
  description?: string;
  badge?: string;
}

export interface ListMediaThumbnailProps {
  items: MediaItem[];
  ariaLabel?: string;
}

export function ListMediaThumbnail({
  items,
  ariaLabel = 'Media',
}: ListMediaThumbnailProps): JSX.Element {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <span
            aria-hidden="true"
            className={\`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br \${THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]} text-sm font-bold text-white\`}
          >
            {item.glyph}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.title}
            </span>
            {item.description ? (
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
            ) : null}
          </span>
          {item.badge ? (
            <span className="hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">
              {item.badge}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'list-stats-trailing',
    category: 'lists',
    tags: ['list', 'stats', 'metrics', 'trailing', 'trend'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'trend', labelKey: 'trend' },
    ],
    props: [
      { name: 'items', type: 'StatItem[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Statistics'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  The value and its delta live in a shrink-0 column so the number is never
  truncated - a half-shown metric is worse than none. The label column takes
  min-w-0 + truncate. Delta colour (green up / red down) is doubled by an arrow
  glyph so it is not colour-only. tabular-nums keeps the digits from jittering.
-->
<ul class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Statistics">
  <li class="flex items-center justify-between gap-3 px-4 py-3">
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Monthly active users</span>
      <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Last 30 days</span>
    </span>
    <span class="flex shrink-0 flex-col items-end">
      <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">48,290</span>
      <span class="text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">&#9650; 12.4%</span>
    </span>
  </li>
</ul>`,
      react: `export function ListStatsTrailing({ items, ariaLabel = 'Statistics' }) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => {
        const up = (item.trend ?? 'up') === 'up';
        return (
          <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
              {item.sublabel ? (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {item.sublabel}
                </span>
              ) : null}
            </span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {item.value}
              </span>
              {item.delta ? (
                <span
                  className={\`text-xs font-medium tabular-nums \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}\`}
                >
                  {up ? '\\u25B2' : '\\u25BC'} {item.delta}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}`,
      typescript: `export interface StatItem {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  delta?: string;
  trend?: 'up' | 'down';
}

export interface ListStatsTrailingProps {
  items: StatItem[];
  ariaLabel?: string;
}

export function ListStatsTrailing({
  items,
  ariaLabel = 'Statistics',
}: ListStatsTrailingProps): JSX.Element {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => {
        const up = (item.trend ?? 'up') === 'up';
        return (
          <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
              {item.sublabel ? (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {item.sublabel}
                </span>
              ) : null}
            </span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {item.value}
              </span>
              {item.delta ? (
                <span
                  className={\`text-xs font-medium tabular-nums \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}\`}
                >
                  {up ? '\\u25B2' : '\\u25BC'} {item.delta}
                </span>
              ) : null}
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
    slug: 'list-grouped-sticky-headers',
    category: 'lists',
    tags: ['list', 'grouped', 'sticky', 'sections', 'scroll'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'scroll', labelKey: 'scroll' },
    ],
    props: [
      { name: 'groups', type: 'ListGroup[]', required: true, descriptionKey: 'groups' },
      { name: 'ariaLabel', type: 'string', default: "'Grouped list'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  Sticky headers with zero JS: each group heading is position:sticky top-0 inside
  a scroll container, so it pins while its own rows scroll under it and is pushed
  out by the next heading. The container owns the height and the overflow; the
  page never scrolls sideways. Each row keeps the min-w-0 + truncate defence.
-->
<div class="max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" aria-label="Grouped list" role="group">
  <div class="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 dark:text-gray-400">A</div>
  <ul class="divide-y divide-gray-100 dark:divide-gray-800">
    <li class="truncate px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100">Amara Okafor</li>
    <li class="truncate px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100">Anders Bakke</li>
  </ul>
  <div class="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 dark:text-gray-400">B</div>
  <ul class="divide-y divide-gray-100 dark:divide-gray-800">
    <li class="truncate px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100">Bhavesh Ramachandran</li>
  </ul>
</div>`,
      react: `export function ListGroupedStickyHeaders({ groups, ariaLabel = 'Grouped list' }) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      {groups.map((group) => (
        <section key={group.label}>
          <h3 className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 dark:text-gray-400">
            {group.label}
          </h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {group.items.map((item) => (
              <li
                key={item.id}
                className="truncate px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              >
                {item.primary}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}`,
      typescript: `export interface GroupRow {
  id: string;
  primary: string;
}

export interface ListGroup {
  label: string;
  items: GroupRow[];
}

export interface ListGroupedStickyHeadersProps {
  groups: ListGroup[];
  ariaLabel?: string;
}

export function ListGroupedStickyHeaders({
  groups,
  ariaLabel = 'Grouped list',
}: ListGroupedStickyHeadersProps): JSX.Element {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      {groups.map((group) => (
        <section key={group.label}>
          <h3 className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 dark:text-gray-400">
            {group.label}
          </h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {group.items.map((item) => (
              <li
                key={item.id}
                className="truncate px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              >
                {item.primary}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'list-expandable-rows',
    category: 'lists',
    tags: ['list', 'expandable', 'accordion', 'details', 'disclosure'],
    difficulty: 'intermediate',
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
      { name: 'items', type: 'ExpandableItem[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Expandable list'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  Native <details>/<summary>: the whole disclosure is keyboard-operable and
  screen-reader-announced with zero JS. The chevron rotates via the open state
  using group-open, and the marker is removed so we control it. The summary row
  keeps min-w-0 + truncate; the meta hides below sm; the whole summary is a
  44px-tall tap target.
-->
<ul class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Expandable list">
  <li>
    <details class="group">
      <summary class="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <span class="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">Deploy pipeline failed</span>
        <span class="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">2 min ago</span>
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd"/></svg>
      </summary>
      <div class="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400">Step 4 of 7 timed out after 600s while waiting for the health check to pass.</div>
    </details>
  </li>
</ul>`,
      react: `export function ListExpandableRows({ items, ariaLabel = 'Expandable list' }) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id}>
          <details className="group" open={item.defaultOpen}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.title}
              </span>
              {item.meta ? (
                <span className="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">
                  {item.meta}
                </span>
              ) : null}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400">{item.content}</div>
          </details>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface ExpandableItem {
  id: string;
  title: string;
  content: ReactNode;
  meta?: string;
  defaultOpen?: boolean;
}

export interface ListExpandableRowsProps {
  items: ExpandableItem[];
  ariaLabel?: string;
}

export function ListExpandableRows({
  items,
  ariaLabel = 'Expandable list',
}: ListExpandableRowsProps): JSX.Element {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id}>
          <details className="group" open={item.defaultOpen}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.title}
              </span>
              {item.meta ? (
                <span className="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">
                  {item.meta}
                </span>
              ) : null}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400">{item.content}</div>
          </details>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'list-numbered-ranking',
    category: 'lists',
    tags: ['list', 'numbered', 'ranking', 'leaderboard', 'ordered'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'podium', labelKey: 'podium' },
    ],
    props: [
      { name: 'items', type: 'RankItem[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Ranking'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  A real <ol>: the rank is the list's own semantics, not text we typed. The rank
  badge is shrink-0 and the top three get an accent fill so the podium reads at a
  glance without relying on the number alone. The name takes min-w-0 + truncate;
  the value sits in a shrink-0 tabular-nums column so scores line up.
-->
<ol class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Ranking">
  <li class="flex items-center gap-3 px-4 py-3">
    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-950" aria-hidden="true">1</span>
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Amara Okafor</span>
      <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Growth team</span>
    </span>
    <span class="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">2,940</span>
  </li>
  <li class="flex items-center gap-3 px-4 py-3">
    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300" aria-hidden="true">4</span>
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">Chen Wei</span>
      <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Platform team</span>
    </span>
    <span class="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">1,880</span>
  </li>
</ol>`,
      react: `export function ListNumberedRanking({ items, ariaLabel = 'Ranking' }) {
  return (
    <ol
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => {
        const rank = index + 1;
        const medal =
          rank === 1
            ? 'bg-amber-400 text-amber-950'
            : rank === 2
              ? 'bg-gray-300 text-gray-800'
              : rank === 3
                ? 'bg-orange-300 text-orange-950'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
        return (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <span
              aria-hidden="true"
              className={\`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold \${medal}\`}
            >
              {rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </span>
              {item.hint ? (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {item.hint}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {item.value}
            </span>
          </li>
        );
      })}
    </ol>
  );
}`,
      typescript: `export interface RankItem {
  id: string;
  name: string;
  value: string;
  hint?: string;
}

export interface ListNumberedRankingProps {
  items: RankItem[];
  ariaLabel?: string;
}

export function ListNumberedRanking({
  items,
  ariaLabel = 'Ranking',
}: ListNumberedRankingProps): JSX.Element {
  return (
    <ol
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => {
        const rank = index + 1;
        const medal =
          rank === 1
            ? 'bg-amber-400 text-amber-950'
            : rank === 2
              ? 'bg-gray-300 text-gray-800'
              : rank === 3
                ? 'bg-orange-300 text-orange-950'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
        return (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <span
              aria-hidden="true"
              className={\`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold \${medal}\`}
            >
              {rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </span>
              {item.hint ? (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {item.hint}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {item.value}
            </span>
          </li>
        );
      })}
    </ol>
  );
}`,
    },
  },
  {
    slug: 'list-keyboard-move',
    category: 'lists',
    tags: ['list', 'reorder', 'keyboard', 'move', 'accessible'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'reordered', labelKey: 'reordered' },
    ],
    props: [
      { name: 'items', type: 'MovableItem[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Reorderable list'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!--
  Reordering without drag-and-drop: two 40px buttons per row move an item up or
  down. This is the accessible baseline drag libraries forget - it works with a
  keyboard, a switch and a screen reader. End rows disable the button that would
  do nothing. An aria-live region announces each move; the label takes min-w-0 +
  truncate so the controls never get pushed off a 320px row.
-->
<ul class="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900" aria-label="Reorderable list">
  <li class="flex items-center gap-2 px-3 py-2">
    <span class="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">First priority task</span>
    <button type="button" disabled class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400" aria-label="Move First priority task up">
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path fill-rule="evenodd" d="M10 5a.75.75 0 0 1 .55.24l4.25 4.5a.75.75 0 1 1-1.1 1.02L10 6.85l-3.7 3.91a.75.75 0 1 1-1.1-1.02l4.25-4.5A.75.75 0 0 1 10 5Z" clip-rule="evenodd"/></svg>
    </button>
    <button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400" aria-label="Move First priority task down">
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path fill-rule="evenodd" d="M10 15a.75.75 0 0 1-.55-.24l-4.25-4.5a.75.75 0 1 1 1.1-1.02L10 13.15l3.7-3.91a.75.75 0 1 1 1.1 1.02l-4.25 4.5A.75.75 0 0 1 10 15Z" clip-rule="evenodd"/></svg>
    </button>
  </li>
</ul>`,
      react: `import { useState } from 'react';

export function ListKeyboardMove({ items, ariaLabel = 'Reorderable list' }) {
  const [order, setOrder] = useState(items);
  const [status, setStatus] = useState('');

  function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      const moved = next[index];
      next[index] = next[target];
      next[target] = moved;
      return next;
    });
    setStatus(\`\${order[index].label} moved to position \${target + 1}\`);
  }

  return (
    <>
      <ul
        aria-label={ariaLabel}
        className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
      >
        {order.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
              {item.label}
            </span>
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={\`Move \${item.label} up\`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path fillRule="evenodd" d="M10 5a.75.75 0 0 1 .55.24l4.25 4.5a.75.75 0 1 1-1.1 1.02L10 6.85l-3.7 3.91a.75.75 0 1 1-1.1-1.02l4.25-4.5A.75.75 0 0 1 10 5Z" clipRule="evenodd" /></svg>
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === order.length - 1}
              aria-label={\`Move \${item.label} down\`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path fillRule="evenodd" d="M10 15a.75.75 0 0 1-.55-.24l-4.25-4.5a.75.75 0 1 1 1.1-1.02L10 13.15l3.7-3.91a.75.75 0 1 1 1.1 1.02l-4.25 4.5A.75.75 0 0 1 10 15Z" clipRule="evenodd" /></svg>
            </button>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">{status}</p>
    </>
  );
}`,
      typescript: `import { useState } from 'react';

export interface MovableItem {
  id: string;
  label: string;
}

export interface ListKeyboardMoveProps {
  items: MovableItem[];
  ariaLabel?: string;
}

export function ListKeyboardMove({
  items,
  ariaLabel = 'Reorderable list',
}: ListKeyboardMoveProps): JSX.Element {
  const [order, setOrder] = useState<MovableItem[]>(items);
  const [status, setStatus] = useState('');

  function move(index: number, delta: number): void {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    const label = order[index]?.label ?? '';
    setOrder((current) => {
      const next = [...current];
      const a = next[index];
      const b = next[target];
      if (a && b) {
        next[index] = b;
        next[target] = a;
      }
      return next;
    });
    setStatus(\`\${label} moved to position \${target + 1}\`);
  }

  return (
    <>
      <ul
        aria-label={ariaLabel}
        className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
      >
        {order.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
              {item.label}
            </span>
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={\`Move \${item.label} up\`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path fillRule="evenodd" d="M10 5a.75.75 0 0 1 .55.24l4.25 4.5a.75.75 0 1 1-1.1 1.02L10 6.85l-3.7 3.91a.75.75 0 1 1-1.1-1.02l4.25-4.5A.75.75 0 0 1 10 5Z" clipRule="evenodd" /></svg>
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === order.length - 1}
              aria-label={\`Move \${item.label} down\`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path fillRule="evenodd" d="M10 15a.75.75 0 0 1-.55-.24l-4.25-4.5a.75.75 0 1 1 1.1-1.02L10 13.15l3.7-3.91a.75.75 0 1 1 1.1 1.02l-4.25 4.5A.75.75 0 0 1 10 15Z" clipRule="evenodd" /></svg>
            </button>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">{status}</p>
    </>
  );
}`,
    },
  },
];
