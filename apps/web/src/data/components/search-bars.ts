import type { ComponentEntry } from './types';

/**
 * Search-bars category.
 *
 * Ten structurally different search surfaces, not ten skins of one input: a hero
 * combobox with suggestions, a navbar field that expands from an icon, a command
 * palette, a filtered result list, a recent-history dropdown, substring
 * highlighting, scoped tabs, a full-page overlay, a debounced "async" field, and
 * an inline table filter. The shared constraint is the accessibility contract of
 * autocomplete: the *input* must keep focus and own `aria-activedescendant`
 * while a separate `role="listbox"` holds the options, and any list that reflows
 * as you type has to announce its new count through an `aria-live` region - a
 * sighted user sees the list shrink, a screen-reader user hears nothing unless
 * you say it. Every "result set" here is a static in-memory array filtered on the
 * client; nothing hits the network, and the "async" variant only simulates
 * latency with a timer so the loading and empty states are real.
 */
export const searchBarsComponents: ComponentEntry[] = [
  {
    slug: 'search-hero-suggestions',
    category: 'search-bars',
    tags: ['search', 'combobox', 'autocomplete', 'suggestions', 'hero'],
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
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'suggestions', type: 'string[]', required: true, descriptionKey: 'suggestions' },
      { name: 'heading', type: 'string', default: "'Find anything'", descriptionKey: 'heading' },
      { name: 'placeholder', type: 'string', default: "'Search…'", descriptionKey: 'placeholder' },
      { name: 'onSelect', type: '(value: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The combobox pattern: the INPUT keeps focus and owns aria-activedescendant;
  the popup is a separate role="listbox". Keyboard users drive the whole thing
  from one control - focus never moves into the list. Shown here in its open
  state; wiring the filtering/keyboard logic is the React/TS tab's job.
-->
<section class="mx-auto w-full max-w-xl px-4 py-8 text-center">
  <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Find anything</h1>

  <div class="relative mt-5 text-left">
    <label class="sr-only" for="hero-search">Find anything</label>
    <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="9" cy="9" r="6" />
      <path d="m14 14 3 3" stroke-linecap="round" />
    </svg>
    <input
      id="hero-search"
      type="text"
      role="combobox"
      aria-expanded="true"
      aria-controls="hero-search-list"
      aria-autocomplete="list"
      aria-activedescendant="hero-opt-0"
      autocomplete="off"
      placeholder="Search…"
      class="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />

    <ul id="hero-search-list" role="listbox" class="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 text-left shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <li id="hero-opt-0" role="option" aria-selected="true" class="cursor-pointer px-4 py-2 text-sm bg-blue-600 text-white">Dashboard</li>
      <li id="hero-opt-1" role="option" aria-selected="false" class="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-200">Billing settings</li>
      <li id="hero-opt-2" role="option" aria-selected="false" class="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-200">API keys</li>
    </ul>
  </div>
</section>`,
      react: `import { useId, useMemo, useState } from 'react';

export function SearchHeroSuggestions({
  suggestions,
  heading = 'Find anything',
  placeholder = 'Search…',
  onSelect,
  className = '',
}) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const pool = term ? suggestions.filter((s) => s.toLowerCase().includes(term)) : suggestions;
    return pool.slice(0, 6);
  }, [suggestions, query]);

  const listId = \`\${baseId}-list\`;
  const showList = open && results.length > 0;
  const activeId = showList && active >= 0 ? \`\${baseId}-opt-\${active}\` : undefined;

  function commit(value) {
    setQuery(value);
    setOpen(false);
    setActive(-1);
    onSelect?.(value);
  }

  function onKeyDown(event) {
    if (!showList) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      const choice = active >= 0 ? results[active] : undefined;
      if (choice) {
        event.preventDefault();
        commit(choice);
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <section className={\`mx-auto w-full max-w-xl px-4 py-8 text-center \${className}\`}>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h1>

      <div className="relative mt-5 text-left">
        <label className="sr-only" htmlFor={\`\${baseId}-input\`}>{heading}</label>
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 3 3" strokeLinecap="round" />
        </svg>
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />

        {showList ? (
          <ul id={listId} role="listbox" className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 text-left shadow-lg dark:border-gray-800 dark:bg-gray-900">
            {results.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item}
                  id={\`\${baseId}-opt-\${index}\`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(event) => { event.preventDefault(); commit(item); }}
                  onMouseEnter={() => setActive(index)}
                  className={\`cursor-pointer px-4 py-2 text-sm \${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200'}\`}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `import { useId, useMemo, useState, type KeyboardEvent } from 'react';

export interface SearchHeroSuggestionsProps {
  /** The full suggestion pool. Filtered client-side; the first 6 matches show. */
  suggestions: string[];
  heading?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

export function SearchHeroSuggestions({
  suggestions,
  heading = 'Find anything',
  placeholder = 'Search…',
  onSelect,
  className = '',
}: SearchHeroSuggestionsProps): JSX.Element {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const results = useMemo<string[]>(() => {
    const term = query.trim().toLowerCase();
    const pool = term ? suggestions.filter((s) => s.toLowerCase().includes(term)) : suggestions;
    return pool.slice(0, 6);
  }, [suggestions, query]);

  const listId = \`\${baseId}-list\`;
  const showList = open && results.length > 0;
  const activeId = showList && active >= 0 ? \`\${baseId}-opt-\${active}\` : undefined;

  function commit(value: string): void {
    setQuery(value);
    setOpen(false);
    setActive(-1);
    onSelect?.(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (!showList) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      // Guard the index access - the highlighted row may be -1 (nothing active).
      const choice = active >= 0 ? results[active] : undefined;
      if (choice) {
        event.preventDefault();
        commit(choice);
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <section className={\`mx-auto w-full max-w-xl px-4 py-8 text-center \${className}\`}>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h1>

      <div className="relative mt-5 text-left">
        <label className="sr-only" htmlFor={\`\${baseId}-input\`}>{heading}</label>
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 3 3" strokeLinecap="round" />
        </svg>
        <input
          id={\`\${baseId}-input\`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />

        {showList ? (
          <ul id={listId} role="listbox" className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 text-left shadow-lg dark:border-gray-800 dark:bg-gray-900">
            {results.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item}
                  id={\`\${baseId}-opt-\${index}\`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(event) => { event.preventDefault(); commit(item); }}
                  onMouseEnter={() => setActive(index)}
                  className={\`cursor-pointer px-4 py-2 text-sm \${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200'}\`}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'search-navbar-expand',
    category: 'search-bars',
    tags: ['search', 'navbar', 'expand', 'icon', 'header'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'collapsed', labelKey: 'collapsed' },
      { id: 'expanded', labelKey: 'expanded' },
    ],
    props: [
      { name: 'placeholder', type: 'string', default: "'Search…'", descriptionKey: 'placeholder' },
      { name: 'brand', type: 'string', default: "'Adysre'", descriptionKey: 'brand' },
      { name: 'onSearch', type: '(value: string) => void', descriptionKey: 'onSearch' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Width animates, not display. A display:none field can't be focused and skips
  the transition; collapsed it's 0-width, aria-hidden and out of the tab order.
  Shown expanded here.
-->
<div class="flex items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950">
  <span class="mr-auto text-sm font-semibold text-gray-900 dark:text-gray-100">Adysre</span>
  <form role="search" class="flex items-center">
    <label class="sr-only" for="nav-search">Search</label>
    <input
      id="nav-search"
      type="search"
      placeholder="Search…"
      autocomplete="off"
      class="h-9 w-40 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 transition-[width,opacity,padding] duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none sm:w-56 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />
    <button type="submit" aria-label="Submit search" class="ml-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 3 3" stroke-linecap="round" />
      </svg>
    </button>
  </form>
</div>`,
      react: `import { useId, useRef, useState } from 'react';

export function SearchNavbarExpand({
  placeholder = 'Search…',
  brand = 'Adysre',
  onSearch,
  className = '',
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  function expand() {
    setOpen(true);
    // Focus after the state flush so the field is interactive when it appears.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className={\`flex items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mr-auto text-sm font-semibold text-gray-900 dark:text-gray-100">{brand}</span>

      <form role="search" className="flex items-center" onSubmit={(event) => { event.preventDefault(); onSearch?.(query); }}>
        <label className="sr-only" htmlFor={inputId}>Search</label>
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
          onBlur={() => { if (!query) setOpen(false); }}
          className={\`h-9 rounded-lg bg-gray-50 text-sm text-gray-900 transition-[width,opacity,padding] duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 \${open ? 'w-40 border border-gray-300 px-3 opacity-100 sm:w-56 dark:border-gray-700' : 'w-0 border-0 px-0 opacity-0'}\`}
        />
        <button
          type={open ? 'submit' : 'button'}
          onClick={() => { if (!open) expand(); }}
          aria-label={open ? 'Submit search' : 'Open search'}
          aria-expanded={open}
          className="ml-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" strokeLinecap="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';

export interface SearchNavbarExpandProps {
  placeholder?: string;
  brand?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchNavbarExpand({
  placeholder = 'Search…',
  brand = 'Adysre',
  onSearch,
  className = '',
}: SearchNavbarExpandProps): JSX.Element {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  function expand(): void {
    setOpen(true);
    // Focus after the state flush so the field is interactive when it appears.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className={\`flex items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mr-auto text-sm font-semibold text-gray-900 dark:text-gray-100">{brand}</span>

      <form role="search" className="flex items-center" onSubmit={(event) => { event.preventDefault(); onSearch?.(query); }}>
        <label className="sr-only" htmlFor={inputId}>Search</label>
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          // Width, not display, animates - so aria-hidden + tabIndex do the work
          // of removing the collapsed field from assistive tech and the tab order.
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
          onBlur={() => { if (!query) setOpen(false); }}
          className={\`h-9 rounded-lg bg-gray-50 text-sm text-gray-900 transition-[width,opacity,padding] duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 \${open ? 'w-40 border border-gray-300 px-3 opacity-100 sm:w-56 dark:border-gray-700' : 'w-0 border-0 px-0 opacity-0'}\`}
        />
        <button
          type={open ? 'submit' : 'button'}
          onClick={() => { if (!open) expand(); }}
          aria-label={open ? 'Submit search' : 'Open search'}
          aria-expanded={open}
          className="ml-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" strokeLinecap="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}`,
    },
  },
  {
    slug: 'search-command-modal',
    category: 'search-bars',
    tags: ['search', 'command', 'palette', 'modal', 'dialog'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'closed', labelKey: 'closed' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'commands', type: 'Command[]', required: true, descriptionKey: 'commands' },
      { name: 'buttonLabel', type: 'string', default: "'Search…'", descriptionKey: 'buttonLabel' },
      { name: 'onRun', type: '(id: string) => void', descriptionKey: 'onRun' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A command palette opened by a BUTTON. The ⌘K hint is a visual affordance only -
  a copy-paste component must not bind a real global shortcut and fight the host
  page's own key handling. Shown open.
-->
<div>
  <button type="button" aria-haspopup="dialog" class="inline-flex w-full max-w-xs items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:focus-visible:ring-blue-400">
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" stroke-linecap="round" /></svg>
    <span class="mr-auto">Search…</span>
    <kbd class="rounded border border-gray-300 px-1.5 text-xs dark:border-gray-700">⌘K</kbd>
  </button>

  <div class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[10vh]">
    <div role="dialog" aria-modal="true" aria-label="Command menu" class="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center gap-2 border-b border-gray-200 px-3 dark:border-gray-800">
        <svg class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" stroke-linecap="round" /></svg>
        <label class="sr-only" for="cmd-input">Type a command</label>
        <input id="cmd-input" type="text" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant="cmd-opt-new" aria-autocomplete="list" autocomplete="off" placeholder="Type a command or search…" class="w-full bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-400" />
      </div>
      <ul id="cmd-list" role="listbox" aria-label="Commands" class="max-h-72 overflow-auto p-1">
        <li id="cmd-opt-new" role="option" aria-selected="true" class="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"><span>New document</span><span class="text-blue-100">C</span></li>
        <li id="cmd-opt-invite" role="option" aria-selected="false" class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200"><span>Invite teammate</span><span class="text-gray-400">I</span></li>
      </ul>
    </div>
  </div>
</div>`,
      react: `import { useId, useMemo, useState } from 'react';

export function SearchCommandModal({
  commands,
  buttonLabel = 'Search…',
  onRun,
  className = '',
}) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(term));
  }, [commands, query]);

  function close() { setOpen(false); setQuery(''); setActive(0); }
  function run(id) { onRun?.(id); close(); }

  function onKeyDown(event) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (event.key === 'Enter') { const c = results[active]; if (c) { event.preventDefault(); run(c.id); } }
    else if (event.key === 'Escape') { event.preventDefault(); close(); }
  }

  const listId = \`\${baseId}-list\`;
  const activeCmd = results[active];
  const activeId = activeCmd ? \`\${baseId}-opt-\${activeCmd.id}\` : undefined;

  return (
    <div className={className}>
      {/* A real button opens the palette. Binding a global ⌘K here would hijack
          the host page's shortcuts - the kbd hint is decoration, not a handler. */}
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => { setOpen(true); setActive(0); }}
        className="inline-flex w-full max-w-xs items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
        <span className="mr-auto">{buttonLabel}</span>
        <kbd className="rounded border border-gray-300 px-1.5 text-xs dark:border-gray-700">⌘K</kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[10vh]" role="presentation" onClick={close}>
          <div role="dialog" aria-modal="true" aria-label="Command menu" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 border-b border-gray-200 px-3 dark:border-gray-800">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
              <label className="sr-only" htmlFor={\`\${baseId}-input\`}>Type a command</label>
              <input
                id={\`\${baseId}-input\`}
                autoFocus
                type="text"
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                autoComplete="off"
                value={query}
                placeholder="Type a command or search…"
                onChange={(event) => { setQuery(event.target.value); setActive(0); }}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-400"
              />
            </div>

            <ul id={listId} role="listbox" aria-label="Commands" className="max-h-72 overflow-auto p-1">
              {results.length === 0 ? (
                <li role="presentation" className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No commands found.</li>
              ) : results.map((cmd, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={cmd.id}
                    id={\`\${baseId}-opt-\${cmd.id}\`}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(event) => { event.preventDefault(); run(cmd.id); }}
                    onMouseEnter={() => setActive(index)}
                    className={\`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm \${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200'}\`}
                  >
                    <span>{cmd.label}</span>
                    {cmd.hint ? <span className={isActive ? 'text-blue-100' : 'text-gray-400'}>{cmd.hint}</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId, useMemo, useState, type KeyboardEvent } from 'react';

export interface Command {
  id: string;
  label: string;
  /** Optional trailing hint, e.g. a shortcut letter or category. */
  hint?: string;
}

export interface SearchCommandModalProps {
  commands: Command[];
  buttonLabel?: string;
  onRun?: (id: string) => void;
  className?: string;
}

export function SearchCommandModal({
  commands,
  buttonLabel = 'Search…',
  onRun,
  className = '',
}: SearchCommandModalProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo<Command[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(term));
  }, [commands, query]);

  function close(): void { setOpen(false); setQuery(''); setActive(0); }
  function run(id: string): void { onRun?.(id); close(); }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (event.key === 'Enter') { const c = results[active]; if (c) { event.preventDefault(); run(c.id); } }
    else if (event.key === 'Escape') { event.preventDefault(); close(); }
  }

  const listId = \`\${baseId}-list\`;
  const activeCmd = results[active];
  const activeId = activeCmd ? \`\${baseId}-opt-\${activeCmd.id}\` : undefined;

  return (
    <div className={className}>
      {/* A real button opens the palette. Binding a global ⌘K here would hijack
          the host page's shortcuts - the kbd hint is decoration, not a handler. */}
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => { setOpen(true); setActive(0); }}
        className="inline-flex w-full max-w-xs items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
        <span className="mr-auto">{buttonLabel}</span>
        <kbd className="rounded border border-gray-300 px-1.5 text-xs dark:border-gray-700">⌘K</kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[10vh]" role="presentation" onClick={close}>
          <div role="dialog" aria-modal="true" aria-label="Command menu" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 border-b border-gray-200 px-3 dark:border-gray-800">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
              <label className="sr-only" htmlFor={\`\${baseId}-input\`}>Type a command</label>
              <input
                id={\`\${baseId}-input\`}
                autoFocus
                type="text"
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                autoComplete="off"
                value={query}
                placeholder="Type a command or search…"
                onChange={(event) => { setQuery(event.target.value); setActive(0); }}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-400"
              />
            </div>

            <ul id={listId} role="listbox" aria-label="Commands" className="max-h-72 overflow-auto p-1">
              {results.length === 0 ? (
                <li role="presentation" className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No commands found.</li>
              ) : results.map((cmd, index) => {
                const isActive = index === active;
                return (
                  <li
                    key={cmd.id}
                    id={\`\${baseId}-opt-\${cmd.id}\`}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(event) => { event.preventDefault(); run(cmd.id); }}
                    onMouseEnter={() => setActive(index)}
                    className={\`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm \${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200'}\`}
                  >
                    <span>{cmd.label}</span>
                    {cmd.hint ? <span className={isActive ? 'text-blue-100' : 'text-gray-400'}>{cmd.hint}</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'search-with-filters',
    category: 'search-bars',
    tags: ['search', 'filters', 'facets', 'chips', 'results'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'filtered', labelKey: 'filtered' },
    ],
    props: [
      { name: 'items', type: 'SearchItem[]', required: true, descriptionKey: 'items' },
      { name: 'categories', type: 'string[]', required: true, descriptionKey: 'categories' },
      { name: 'placeholder', type: 'string', default: "'Search…'", descriptionKey: 'placeholder' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="mx-auto w-full max-w-lg">
  <label class="sr-only" for="filter-search">Search</label>
  <input id="filter-search" type="search" placeholder="Search…" autocomplete="off" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />

  <!-- Filter chips are toggle buttons - aria-pressed carries the on/off state. -->
  <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
    <button type="button" aria-pressed="true" class="rounded-full border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium text-white">All</button>
    <button type="button" aria-pressed="false" class="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200">Design</button>
    <button type="button" aria-pressed="false" class="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200">Engineering</button>
  </div>

  <p class="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">3 results</p>

  <ul class="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
    <li class="flex items-center justify-between gap-3 py-2.5"><span class="text-sm text-gray-900 dark:text-gray-100">Design tokens guide</span><span class="rounded-full bg-gray-100 px-2 py-0.5 text-[0.6875rem] text-gray-600 dark:bg-gray-800 dark:text-gray-300">Design</span></li>
  </ul>
</div>`,
      react: `import { useId, useMemo, useState } from 'react';

export function SearchWithFilters({
  items,
  categories,
  placeholder = 'Search…',
  className = '',
}) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const options = ['All', ...categories];

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === 'All' || item.category === category;
      const inQuery = !term || item.title.toLowerCase().includes(term);
      return inCategory && inQuery;
    });
  }, [items, query, category]);

  return (
    <div className={\`mx-auto w-full max-w-lg \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {options.map((option) => {
          const on = option === category;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => setCategory(option)}
              className={\`rounded-full border px-3 py-1 text-xs font-medium \${on ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200'}\`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No results match your filters.</p>
      ) : (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-sm text-gray-900 dark:text-gray-100">{item.title}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.6875rem] text-gray-600 dark:bg-gray-800 dark:text-gray-300">{item.category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { useId, useMemo, useState } from 'react';

export interface SearchItem {
  id: string;
  title: string;
  category: string;
}

export interface SearchWithFiltersProps {
  items: SearchItem[];
  categories: string[];
  placeholder?: string;
  className?: string;
}

export function SearchWithFilters({
  items,
  categories,
  placeholder = 'Search…',
  className = '',
}: SearchWithFiltersProps): JSX.Element {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const options: string[] = ['All', ...categories];

  const results = useMemo<SearchItem[]>(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === 'All' || item.category === category;
      const inQuery = !term || item.title.toLowerCase().includes(term);
      return inCategory && inQuery;
    });
  }, [items, query, category]);

  return (
    <div className={\`mx-auto w-full max-w-lg \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      {/* Filter chips are toggle buttons; aria-pressed carries their state so a
          screen reader announces "pressed"/"not pressed", not just a colour. */}
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {options.map((option) => {
          const on = option === category;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => setCategory(option)}
              className={\`rounded-full border px-3 py-1 text-xs font-medium \${on ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200'}\`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No results match your filters.</p>
      ) : (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-sm text-gray-900 dark:text-gray-100">{item.title}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.6875rem] text-gray-600 dark:bg-gray-800 dark:text-gray-300">{item.category}</span>
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
    slug: 'search-recent-history',
    category: 'search-bars',
    tags: ['search', 'recent', 'history', 'dropdown', 'suggestions'],
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
      { name: 'initialRecent', type: 'string[]', default: '[]', descriptionKey: 'initialRecent' },
      { name: 'placeholder', type: 'string', default: "'Search…'", descriptionKey: 'placeholder' },
      { name: 'onSearch', type: '(value: string) => void', descriptionKey: 'onSearch' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Recent searches show on focus while the field is empty. Each row has its
     own remove button, so clearing one entry never nukes the whole history. -->
<div class="relative mx-auto w-full max-w-md">
  <label class="sr-only" for="recent-search">Search</label>
  <input id="recent-search" type="search" placeholder="Search…" autocomplete="off" aria-expanded="true" aria-controls="recent-list" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />

  <div id="recent-list" class="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
    <p class="px-3 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Recent</p>
    <ul class="py-1">
      <li class="flex items-center">
        <button type="button" class="flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">
          <svg class="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" stroke-linecap="round" /></svg>
          annual report
        </button>
        <button type="button" aria-label="Remove annual report" class="px-3 py-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke-linecap="round" /></svg></button>
      </li>
    </ul>
  </div>
</div>`,
      react: `import { useId, useState } from 'react';

export function SearchRecentHistory({
  initialRecent = [],
  placeholder = 'Search…',
  onSearch,
  className = '',
}) {
  const inputId = useId();
  const [recent, setRecent] = useState(initialRecent);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const showHistory = open && query.trim() === '' && recent.length > 0;

  function submit(value) {
    const term = value.trim();
    if (!term) return;
    // Newest first, de-duped, capped at five - a history, not a log.
    setRecent((prev) => [term, ...prev.filter((r) => r !== term)].slice(0, 5));
    setQuery(term);
    setOpen(false);
    onSearch?.(term);
  }

  function remove(value) {
    setRecent((prev) => prev.filter((r) => r !== value));
  }

  return (
    <div className={\`relative mx-auto w-full max-w-md \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        aria-expanded={showHistory}
        aria-controls={\`\${inputId}-list\`}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => { if (event.key === 'Enter') submit(query); }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      {showHistory ? (
        <div id={\`\${inputId}-list\`} className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <p className="px-3 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Recent</p>
          <ul className="py-1">
            {recent.map((term) => (
              <li key={term} className="flex items-center">
                <button
                  type="button"
                  onMouseDown={(event) => { event.preventDefault(); submit(term); }}
                  className="flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <svg className="h-3.5 w-3.5 flex-none text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" strokeLinecap="round" /></svg>
                  <span className="truncate">{term}</span>
                </button>
                <button
                  type="button"
                  aria-label={\`Remove \${term}\`}
                  onMouseDown={(event) => { event.preventDefault(); remove(term); }}
                  className="px-3 py-2 text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId, useState } from 'react';

export interface SearchRecentHistoryProps {
  initialRecent?: string[];
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchRecentHistory({
  initialRecent = [],
  placeholder = 'Search…',
  onSearch,
  className = '',
}: SearchRecentHistoryProps): JSX.Element {
  const inputId = useId();
  const [recent, setRecent] = useState<string[]>(initialRecent);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const showHistory = open && query.trim() === '' && recent.length > 0;

  function submit(value: string): void {
    const term = value.trim();
    if (!term) return;
    // Newest first, de-duped, capped at five - a history, not a log.
    setRecent((prev) => [term, ...prev.filter((r) => r !== term)].slice(0, 5));
    setQuery(term);
    setOpen(false);
    onSearch?.(term);
  }

  function remove(value: string): void {
    setRecent((prev) => prev.filter((r) => r !== value));
  }

  return (
    <div className={\`relative mx-auto w-full max-w-md \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        aria-expanded={showHistory}
        aria-controls={\`\${inputId}-list\`}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => { if (event.key === 'Enter') submit(query); }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      {showHistory ? (
        <div id={\`\${inputId}-list\`} className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <p className="px-3 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Recent</p>
          <ul className="py-1">
            {recent.map((term) => (
              <li key={term} className="flex items-center">
                {/* onMouseDown, not onClick - a click fires after the input blurs
                    and closes the panel, so the row would vanish before the tap. */}
                <button
                  type="button"
                  onMouseDown={(event) => { event.preventDefault(); submit(term); }}
                  className="flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <svg className="h-3.5 w-3.5 flex-none text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" strokeLinecap="round" /></svg>
                  <span className="truncate">{term}</span>
                </button>
                <button
                  type="button"
                  aria-label={\`Remove \${term}\`}
                  onMouseDown={(event) => { event.preventDefault(); remove(term); }}
                  className="px-3 py-2 text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'search-results-highlight',
    category: 'search-bars',
    tags: ['search', 'highlight', 'mark', 'results', 'match'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'matched', labelKey: 'matched' },
    ],
    props: [
      { name: 'items', type: 'HighlightItem[]', required: true, descriptionKey: 'items' },
      { name: 'placeholder', type: 'string', default: "'Search…'", descriptionKey: 'placeholder' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="mx-auto w-full max-w-md">
  <label class="sr-only" for="hl-search">Search</label>
  <input id="hl-search" type="search" placeholder="Search…" autocomplete="off" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
  <p class="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">2 matches</p>
  <ul class="mt-1 space-y-1">
    <!-- The match is wrapped in <mark>, which is semantic (relevance), not just a
         yellow span; the surrounding text stays plain. -->
    <li class="rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">Quarterly <mark class="rounded bg-yellow-200 text-gray-900 dark:bg-yellow-500/40 dark:text-yellow-100">report</mark></li>
    <li class="rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">Annual <mark class="rounded bg-yellow-200 text-gray-900 dark:bg-yellow-500/40 dark:text-yellow-100">report</mark> 2026</li>
  </ul>
</div>`,
      react: `import { Fragment, useId, useMemo, useState } from 'react';

// Splits text into matched/unmatched parts. The matched part becomes <mark>.
function highlight(text, term) {
  if (!term) return [{ text, match: false }];
  const parts = [];
  const lower = text.toLowerCase();
  const needle = term.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const found = lower.indexOf(needle, i);
    if (found === -1) { parts.push({ text: text.slice(i), match: false }); break; }
    if (found > i) parts.push({ text: text.slice(i, found), match: false });
    parts.push({ text: text.slice(found, found + needle.length), match: true });
    i = found + needle.length;
  }
  return parts;
}

export function SearchResultsHighlight({
  items,
  placeholder = 'Search…',
  className = '',
}) {
  const inputId = useId();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.label.toLowerCase().includes(term));
  }, [items, query]);

  const term = query.trim();

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'match' : 'matches'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No matches.</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {results.map((item) => (
            <li key={item.id} className="rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
              {highlight(item.label, term).map((part, index) =>
                part.match ? (
                  <mark key={index} className="rounded bg-yellow-200 text-gray-900 dark:bg-yellow-500/40 dark:text-yellow-100">{part.text}</mark>
                ) : (
                  <Fragment key={index}>{part.text}</Fragment>
                ),
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { Fragment, useId, useMemo, useState } from 'react';

export interface HighlightItem {
  id: string;
  label: string;
}

interface HighlightPart {
  text: string;
  match: boolean;
}

// Splits text into matched/unmatched parts. The matched part becomes <mark>.
function highlight(text: string, term: string): HighlightPart[] {
  if (!term) return [{ text, match: false }];
  const parts: HighlightPart[] = [];
  const lower = text.toLowerCase();
  const needle = term.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const found = lower.indexOf(needle, i);
    if (found === -1) { parts.push({ text: text.slice(i), match: false }); break; }
    if (found > i) parts.push({ text: text.slice(i, found), match: false });
    parts.push({ text: text.slice(found, found + needle.length), match: true });
    i = found + needle.length;
  }
  return parts;
}

export interface SearchResultsHighlightProps {
  items: HighlightItem[];
  placeholder?: string;
  className?: string;
}

export function SearchResultsHighlight({
  items,
  placeholder = 'Search…',
  className = '',
}: SearchResultsHighlightProps): JSX.Element {
  const inputId = useId();
  const [query, setQuery] = useState('');

  const results = useMemo<HighlightItem[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.label.toLowerCase().includes(term));
  }, [items, query]);

  const term = query.trim();

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'match' : 'matches'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No matches.</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {results.map((item) => (
            <li key={item.id} className="rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
              {/* <mark> is semantic - it marks relevance, not just paints yellow. */}
              {highlight(item.label, term).map((part, index) =>
                part.match ? (
                  <mark key={index} className="rounded bg-yellow-200 text-gray-900 dark:bg-yellow-500/40 dark:text-yellow-100">{part.text}</mark>
                ) : (
                  <Fragment key={index}>{part.text}</Fragment>
                ),
              )}
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
    slug: 'search-scoped-tabs',
    category: 'search-bars',
    tags: ['search', 'scope', 'tabs', 'segmented', 'filter'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'all', labelKey: 'all' },
      { id: 'scoped', labelKey: 'scoped' },
    ],
    props: [
      { name: 'items', type: 'ScopedItem[]', required: true, descriptionKey: 'items' },
      { name: 'scopes', type: 'Scope[]', required: true, descriptionKey: 'scopes' },
      { name: 'placeholder', type: 'string', default: "'Search…'", descriptionKey: 'placeholder' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="mx-auto w-full max-w-md">
  <label class="sr-only" for="scope-search">Search</label>
  <input id="scope-search" type="search" placeholder="Search…" autocomplete="off" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />

  <!-- Scopes narrow the same result set. Segmented buttons, aria-pressed state. -->
  <div class="mt-3 inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-800" role="group" aria-label="Search scope">
    <button type="button" aria-pressed="true" class="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white">All</button>
    <button type="button" aria-pressed="false" class="rounded-md px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Docs</button>
    <button type="button" aria-pressed="false" class="rounded-md px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">People</button>
  </div>

  <p class="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">4 results</p>
  <ul class="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
    <li class="py-2.5 text-sm text-gray-900 dark:text-gray-100">Getting started</li>
  </ul>
</div>`,
      react: `import { useId, useMemo, useState } from 'react';

export function SearchScopedTabs({
  items,
  scopes,
  placeholder = 'Search…',
  className = '',
}) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const inScope = scope === 'all' || item.scope === scope;
      const inQuery = !term || item.title.toLowerCase().includes(term);
      return inScope && inQuery;
    });
  }, [items, query, scope]);

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <div className="mt-3 inline-flex max-w-full flex-wrap rounded-lg border border-gray-200 p-0.5 dark:border-gray-800" role="group" aria-label="Search scope">
        {[{ id: 'all', label: 'All' }, ...scopes].map((s) => {
          const on = s.id === scope;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setScope(s.id)}
              className={\`rounded-md px-3 py-1 text-xs font-medium \${on ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}\`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">Nothing in this scope.</p>
      ) : (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="py-2.5 text-sm text-gray-900 dark:text-gray-100">{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { useId, useMemo, useState } from 'react';

export interface Scope {
  id: string;
  label: string;
}

export interface ScopedItem {
  id: string;
  title: string;
  scope: string;
}

export interface SearchScopedTabsProps {
  items: ScopedItem[];
  scopes: Scope[];
  placeholder?: string;
  className?: string;
}

export function SearchScopedTabs({
  items,
  scopes,
  placeholder = 'Search…',
  className = '',
}: SearchScopedTabsProps): JSX.Element {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const results = useMemo<ScopedItem[]>(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const inScope = scope === 'all' || item.scope === scope;
      const inQuery = !term || item.title.toLowerCase().includes(term);
      return inScope && inQuery;
    });
  }, [items, query, scope]);

  const tabs: Scope[] = [{ id: 'all', label: 'All' }, ...scopes];

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      {/* Scopes narrow the same in-memory set - they don't fetch a new one. */}
      <div className="mt-3 inline-flex max-w-full flex-wrap rounded-lg border border-gray-200 p-0.5 dark:border-gray-800" role="group" aria-label="Search scope">
        {tabs.map((s) => {
          const on = s.id === scope;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setScope(s.id)}
              className={\`rounded-md px-3 py-1 text-xs font-medium \${on ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}\`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">Nothing in this scope.</p>
      ) : (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="py-2.5 text-sm text-gray-900 dark:text-gray-100">{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    },
  },
  {
    slug: 'search-fullpage-overlay',
    category: 'search-bars',
    tags: ['search', 'overlay', 'fullpage', 'modal', 'dialog'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'closed', labelKey: 'closed' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'items', type: 'OverlayItem[]', required: true, descriptionKey: 'items' },
      { name: 'buttonLabel', type: 'string', default: "'Search'", descriptionKey: 'buttonLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div>
  <button type="button" aria-haspopup="dialog" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400">
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" stroke-linecap="round" /></svg>
    Search
  </button>

  <!-- Full-viewport overlay. The close button is a real control, and Escape
       also dismisses it in the React/TS tab. Shown open. -->
  <div class="fixed inset-0 z-50 bg-white/95 p-4 backdrop-blur dark:bg-gray-950/95" role="dialog" aria-modal="true" aria-label="Search">
    <div class="mx-auto flex max-w-2xl items-center gap-3 pt-4">
      <svg class="h-6 w-6 flex-none text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" stroke-linecap="round" /></svg>
      <label class="sr-only" for="overlay-input">Search</label>
      <input id="overlay-input" type="text" placeholder="Type to search…" autocomplete="off" class="w-full border-0 bg-transparent py-2 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100" />
      <button type="button" aria-label="Close search" class="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"><svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke-linecap="round" /></svg></button>
    </div>
    <ul class="mx-auto mt-6 max-w-2xl space-y-1">
      <li class="rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800">Getting started guide</li>
    </ul>
  </div>
</div>`,
      react: `import { useId, useMemo, useState } from 'react';

export function SearchFullpageOverlay({
  items,
  buttonLabel = 'Search',
  className = '',
}) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items.slice(0, 8);
    return items.filter((item) => item.title.toLowerCase().includes(term)).slice(0, 8);
  }, [items, query]);

  function close() { setOpen(false); setQuery(''); }

  return (
    <div className={className}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
        {buttonLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-white/95 p-4 backdrop-blur dark:bg-gray-950/95"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onKeyDown={(event) => { if (event.key === 'Escape') close(); }}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3 pt-4">
            <svg className="h-6 w-6 flex-none text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
            <label className="sr-only" htmlFor={inputId}>Search</label>
            <input
              id={inputId}
              autoFocus
              type="text"
              value={query}
              placeholder="Type to search…"
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-0 bg-transparent py-2 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
            />
            <button type="button" aria-label="Close search" onClick={close} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /></svg>
            </button>
          </div>

          <p className="sr-only" role="status" aria-live="polite">{results.length} results</p>

          {results.length === 0 ? (
            <p className="mx-auto mt-6 max-w-2xl px-3 text-sm text-gray-600 dark:text-gray-300">No results.</p>
          ) : (
            <ul className="mx-auto mt-6 max-w-2xl space-y-1">
              {results.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={close} className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">{item.title}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId, useMemo, useState } from 'react';

export interface OverlayItem {
  id: string;
  title: string;
}

export interface SearchFullpageOverlayProps {
  items: OverlayItem[];
  buttonLabel?: string;
  className?: string;
}

export function SearchFullpageOverlay({
  items,
  buttonLabel = 'Search',
  className = '',
}: SearchFullpageOverlayProps): JSX.Element {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo<OverlayItem[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items.slice(0, 8);
    return items.filter((item) => item.title.toLowerCase().includes(term)).slice(0, 8);
  }, [items, query]);

  function close(): void { setOpen(false); setQuery(''); }

  return (
    <div className={className}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
        {buttonLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-white/95 p-4 backdrop-blur dark:bg-gray-950/95"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onKeyDown={(event) => { if (event.key === 'Escape') close(); }}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3 pt-4">
            <svg className="h-6 w-6 flex-none text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
            <label className="sr-only" htmlFor={inputId}>Search</label>
            <input
              id={inputId}
              autoFocus
              type="text"
              value={query}
              placeholder="Type to search…"
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-0 bg-transparent py-2 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
            />
            <button type="button" aria-label="Close search" onClick={close} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /></svg>
            </button>
          </div>

          {/* Visually the shrinking list is obvious; a screen reader needs it said. */}
          <p className="sr-only" role="status" aria-live="polite">{results.length} results</p>

          {results.length === 0 ? (
            <p className="mx-auto mt-6 max-w-2xl px-3 text-sm text-gray-600 dark:text-gray-300">No results.</p>
          ) : (
            <ul className="mx-auto mt-6 max-w-2xl space-y-1">
              {results.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={close} className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">{item.title}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'search-debounced-async',
    category: 'search-bars',
    tags: ['search', 'debounce', 'async', 'loading', 'spinner'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'loading', labelKey: 'loading' },
    ],
    props: [
      { name: 'items', type: 'AsyncItem[]', required: true, descriptionKey: 'items' },
      { name: 'delay', type: 'number', default: '350', descriptionKey: 'delay' },
      { name: 'placeholder', type: 'string', default: "'Search…'", descriptionKey: 'placeholder' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="mx-auto w-full max-w-md">
  <div class="relative">
    <label class="sr-only" for="async-search">Search</label>
    <input id="async-search" type="search" placeholder="Search…" autocomplete="off" aria-busy="true" class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
    <!-- Spinner sits inside the field while the (simulated) request is in flight. -->
    <svg class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600 motion-reduce:animate-none dark:text-blue-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="3" class="opacity-25" />
      <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </svg>
  </div>
  <p class="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">Searching…</p>
</div>`,
      react: `import { useEffect, useId, useState } from 'react';

export function SearchDebouncedAsync({
  items,
  delay = 350,
  placeholder = 'Search…',
  className = '',
}) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = query.trim().toLowerCase();
    if (!term) { setResults([]); setLoading(false); return; }
    setLoading(true);
    // No network: a timer stands in for latency so the loading + empty states
    // are exercised. The cleanup cancels a stale query when you keep typing.
    const id = window.setTimeout(() => {
      setResults(items.filter((item) => item.title.toLowerCase().includes(term)));
      setLoading(false);
    }, delay);
    return () => window.clearTimeout(id);
  }, [items, query, delay]);

  const term = query.trim();

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`}>
      <div className="relative">
        <label className="sr-only" htmlFor={inputId}>Search</label>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          aria-busy={loading}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        {loading ? (
          <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600 motion-reduce:animate-none dark:text-blue-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {loading ? 'Searching…' : term ? \`\${results.length} \${results.length === 1 ? 'result' : 'results'}\` : ''}
      </p>

      {!loading && term && results.length > 0 ? (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="py-2.5 text-sm text-gray-900 dark:text-gray-100">{item.title}</li>
          ))}
        </ul>
      ) : null}

      {!loading && term && results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No results for “{term}”.</p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useState } from 'react';

export interface AsyncItem {
  id: string;
  title: string;
}

export interface SearchDebouncedAsyncProps {
  items: AsyncItem[];
  /** Debounce window in ms, standing in for request latency. */
  delay?: number;
  placeholder?: string;
  className?: string;
}

export function SearchDebouncedAsync({
  items,
  delay = 350,
  placeholder = 'Search…',
  className = '',
}: SearchDebouncedAsyncProps): JSX.Element {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AsyncItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = query.trim().toLowerCase();
    if (!term) { setResults([]); setLoading(false); return; }
    setLoading(true);
    // No network: a timer stands in for latency so the loading + empty states
    // are exercised. The cleanup cancels a stale query when you keep typing.
    const id = window.setTimeout(() => {
      setResults(items.filter((item) => item.title.toLowerCase().includes(term)));
      setLoading(false);
    }, delay);
    return () => window.clearTimeout(id);
  }, [items, query, delay]);

  const term = query.trim();

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`}>
      <div className="relative">
        <label className="sr-only" htmlFor={inputId}>Search</label>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          aria-busy={loading}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        {loading ? (
          <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600 motion-reduce:animate-none dark:text-blue-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {loading ? 'Searching…' : term ? \`\${results.length} \${results.length === 1 ? 'result' : 'results'}\` : ''}
      </p>

      {!loading && term && results.length > 0 ? (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="py-2.5 text-sm text-gray-900 dark:text-gray-100">{item.title}</li>
          ))}
        </ul>
      ) : null}

      {!loading && term && results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No results for “{term}”.</p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'search-inline-table-filter',
    category: 'search-bars',
    tags: ['search', 'table', 'filter', 'inline', 'rows'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'filtered', labelKey: 'filtered' },
    ],
    props: [
      { name: 'columns', type: 'string[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'TableRow[]', required: true, descriptionKey: 'rows' },
      { name: 'placeholder', type: 'string', default: "'Filter rows…'", descriptionKey: 'placeholder' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full">
  <label class="sr-only" for="table-filter">Filter rows</label>
  <input id="table-filter" type="search" placeholder="Filter rows…" autocomplete="off" class="mb-3 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
  <p class="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">2 of 3 rows</p>

  <!-- The wrapper scrolls sideways so the table never pushes the page wider. -->
  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
    <table class="w-full min-w-[24rem] text-left text-sm">
      <thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        <tr><th scope="col" class="px-3 py-2 font-medium">Name</th><th scope="col" class="px-3 py-2 font-medium">Role</th></tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
        <tr class="text-gray-800 dark:text-gray-100"><td class="px-3 py-2">Ada Lovelace</td><td class="px-3 py-2">Engineer</td></tr>
        <tr class="text-gray-800 dark:text-gray-100"><td class="px-3 py-2">Grace Hopper</td><td class="px-3 py-2">Admiral</td></tr>
      </tbody>
    </table>
  </div>
</div>`,
      react: `import { useId, useMemo, useState } from 'react';

export function SearchInlineTableFilter({
  columns,
  rows,
  placeholder = 'Filter rows…',
  className = '',
}) {
  const inputId = useId();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    // A row matches when ANY cell contains the term.
    return rows.filter((row) => row.cells.some((cell) => cell.toLowerCase().includes(term)));
  }, [rows, query]);

  return (
    <div className={\`w-full \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Filter rows</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="mb-3 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <p className="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {filtered.length} of {rows.length} rows
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[24rem] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col" className="px-3 py-2 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-gray-600 dark:text-gray-300">No matching rows.</td>
              </tr>
            ) : filtered.map((row) => (
              <tr key={row.id} className="text-gray-800 dark:text-gray-100">
                {row.cells.map((cell, index) => (
                  <td key={index} className="px-3 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useMemo, useState } from 'react';

export interface TableRow {
  id: string;
  /** One string per column, in column order. */
  cells: string[];
}

export interface SearchInlineTableFilterProps {
  columns: string[];
  rows: TableRow[];
  placeholder?: string;
  className?: string;
}

export function SearchInlineTableFilter({
  columns,
  rows,
  placeholder = 'Filter rows…',
  className = '',
}: SearchInlineTableFilterProps): JSX.Element {
  const inputId = useId();
  const [query, setQuery] = useState('');

  const filtered = useMemo<TableRow[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    // A row matches when ANY cell contains the term.
    return rows.filter((row) => row.cells.some((cell) => cell.toLowerCase().includes(term)));
  }, [rows, query]);

  return (
    <div className={\`w-full \${className}\`}>
      <label className="sr-only" htmlFor={inputId}>Filter rows</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="mb-3 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <p className="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {filtered.length} of {rows.length} rows
      </p>

      {/* The wrapper scrolls sideways so the table never widens the page at 320px. */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[24rem] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col" className="px-3 py-2 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-gray-600 dark:text-gray-300">No matching rows.</td>
              </tr>
            ) : filtered.map((row) => (
              <tr key={row.id} className="text-gray-800 dark:text-gray-100">
                {row.cells.map((cell, index) => (
                  <td key={index} className="px-3 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,
    },
  },
];
