import type { ComponentEntry } from './types';

/**
 * Tabs category.
 *
 * Every entry here implements the full ARIA tabs pattern rather than styling a
 * row of buttons: `role="tablist"` / `role="tab"` / `role="tabpanel"`, wired
 * together with `aria-controls` + `aria-labelledby`, a **roving tabindex** (only
 * the selected tab is in the tab sequence, so Tab moves past the strip to the
 * panel instead of through every tab), and arrow-key navigation with Home/End.
 * That keyboard contract is the component - the underline, pill and box
 * treatments are the same machine wearing different clothes.
 *
 * The html/css tabs ship the same behaviour as vanilla JS in a `<script>`,
 * because tabs cannot be built without it: unlike the FAQ accordion there is no
 * native element that carries the semantics for free.
 */
export const tabsComponents: ComponentEntry[] = [
  {
    slug: 'tabs-underline',
    category: 'tabs',
    tags: ['tabs', 'underline', 'a11y', 'keyboard', 'navigation'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-12',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 2140, copies: 496, downloads: 138 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'TabItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'overview', label: 'Overview', content: <p>…</p> }]",
      },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The ARIA tabs pattern, in full:
  - the strip is role="tablist", each control role="tab", each panel role="tabpanel"
  - aria-controls points a tab at its panel; aria-labelledby points back
  - ROVING TABINDEX: the selected tab has tabindex="0", the rest tabindex="-1",
    so Tab lands on the strip once and then moves on to the panel
  - the panel takes tabindex="0" so it is reachable when it holds no controls
  Arrow/Home/End handling lives in the script below - without it this is just a
  row of buttons wearing tab roles.
-->
<div class="tabs" data-tabs>
  <div class="tabs__list" role="tablist" aria-label="Account settings">
    <button class="tabs__tab" type="button" role="tab" id="tab-overview" aria-controls="panel-overview" aria-selected="true" tabindex="0">
      Overview
    </button>
    <button class="tabs__tab" type="button" role="tab" id="tab-activity" aria-controls="panel-activity" aria-selected="false" tabindex="-1">
      Activity
    </button>
    <button class="tabs__tab" type="button" role="tab" id="tab-settings" aria-controls="panel-settings" aria-selected="false" tabindex="-1">
      Settings
    </button>
  </div>

  <div class="tabs__panel" role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" tabindex="0">
    <p>Your workspace is on the Team plan with five of ten seats in use.</p>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-activity" aria-labelledby="tab-activity" tabindex="0" hidden>
    <p>Nine deployments shipped this week, the last one four minutes ago.</p>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-settings" aria-labelledby="tab-settings" tabindex="0" hidden>
    <p>Two-factor authentication is enforced for every member of this workspace.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          // Roving tabindex: exactly one tab is ever in the tab sequence.
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      css: `.tabs {
  max-width: 42rem;
}

.tabs__list {
  display: flex;
  gap: 1.5rem;
  /* Scroll the strip instead of overflowing the page when the tabs don't fit. */
  overflow-x: auto;
  border-bottom: 1px solid #e5e7eb;
}

.tabs__tab {
  position: relative;
  padding: 0.75rem 0.125rem;
  border: 0;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: color 150ms ease;
}

/*
 * The underline is a pseudo-element sitting on the list's border, not a
 * border-bottom on the tab - a border would shift the label by a pixel as it
 * appears, and this way the indicator overlaps the hairline cleanly.
 */
.tabs__tab::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 2px;
  background-color: transparent;
}

.tabs__tab:hover {
  color: #111827;
}

.tabs__tab:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.tabs__tab[aria-selected='true'] {
  color: #2563eb;
}

.tabs__tab[aria-selected='true']::after {
  background-color: #2563eb;
}

.tabs__panel {
  padding-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.tabs__panel p {
  margin: 0;
}

.tabs__panel:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

@media (prefers-reduced-motion: reduce) {
  .tabs__tab {
    transition: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 */
@media (prefers-color-scheme: dark) {
  .tabs__list {
    border-bottom-color: #1f2937;
  }

  .tabs__tab {
    color: #9ca3af;
  }

  .tabs__tab:hover {
    color: #f3f4f6;
  }

  .tabs__tab:focus-visible {
    outline-color: #60a5fa;
  }

  .tabs__tab[aria-selected='true'] {
    color: #60a5fa;
  }

  .tabs__tab[aria-selected='true']::after {
    background-color: #60a5fa;
  }

  .tabs__panel {
    color: #d1d5db;
  }

  .tabs__panel:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!--
  Same markup and same script as the HTML tab - only the styling moves to
  utilities. The active underline is an aria-selected: variant, so the state
  lives in one place (the attribute the screen reader reads) instead of being
  mirrored by a class the JS has to keep in sync.
-->
<div class="max-w-2xl" data-tabs>
  <div class="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Account settings">
    <button
      class="relative px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400"
      type="button" role="tab" id="tab-overview" aria-controls="panel-overview" aria-selected="true" tabindex="0"
    >
      Overview
    </button>
    <button
      class="relative px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400"
      type="button" role="tab" id="tab-activity" aria-controls="panel-activity" aria-selected="false" tabindex="-1"
    >
      Activity
    </button>
    <button
      class="relative px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400"
      type="button" role="tab" id="tab-settings" aria-controls="panel-settings" aria-selected="false" tabindex="-1"
    >
      Settings
    </button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" tabindex="0">
    <p>Your workspace is on the Team plan with five of ten seats in use.</p>
  </div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="panel-activity" aria-labelledby="tab-activity" tabindex="0" hidden>
    <p>Nine deployments shipped this week, the last one four minutes ago.</p>
  </div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="panel-settings" aria-labelledby="tab-settings" tabindex="0" hidden>
    <p>Two-factor authentication is enforced for every member of this workspace.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsUnderline({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  // Arrow keys move selection AND focus (the "automatic activation" flavour of
  // the pattern, which is what APG recommends when panels are cheap to render).
  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsUnderlineProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsUnderline({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsUnderlineProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string): void {
    setActiveId(id);
    onSelect?.(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsUnderlineProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsUnderline({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsUnderlineProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-pills',
    category: 'tabs',
    tags: ['tabs', 'pills', 'segmented', 'a11y', 'keyboard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-18',
    updatedAt: '2026-06-20',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1486, copies: 352, downloads: 94 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'TabItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'day', label: 'Day', content: <p>…</p> }]",
      },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Pills: the tablist is a tinted track and the selected tab is a filled pill
  inside it. Same roles, same roving tabindex, same arrow keys as every other
  tabs entry - only the paint changes.
-->
<div class="tabs-pills" data-tabs-pills>
  <div class="tabs-pills__list" role="tablist" aria-label="Report range">
    <button class="tabs-pills__tab" type="button" role="tab" id="pill-day" aria-controls="pill-panel-day" aria-selected="true" tabindex="0">
      Day
    </button>
    <button class="tabs-pills__tab" type="button" role="tab" id="pill-week" aria-controls="pill-panel-week" aria-selected="false" tabindex="-1">
      Week
    </button>
    <button class="tabs-pills__tab" type="button" role="tab" id="pill-month" aria-controls="pill-panel-month" aria-selected="false" tabindex="-1">
      Month
    </button>
  </div>

  <div class="tabs-pills__panel" role="tabpanel" id="pill-panel-day" aria-labelledby="pill-day" tabindex="0">
    <p>1,284 requests served today with a median latency of 42ms.</p>
  </div>
  <div class="tabs-pills__panel" role="tabpanel" id="pill-panel-week" aria-labelledby="pill-week" tabindex="0" hidden>
    <p>9,731 requests this week - up 12% on the week before.</p>
  </div>
  <div class="tabs-pills__panel" role="tabpanel" id="pill-panel-month" aria-labelledby="pill-month" tabindex="0" hidden>
    <p>41,208 requests this month, with no incidents recorded.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-pills]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      css: `.tabs-pills {
  max-width: 42rem;
}

.tabs-pills__list {
  display: inline-flex;
  gap: 0.25rem;
  /* Cap at the parent width and scroll when the pills don't fit at 320px. */
  max-width: 100%;
  overflow-x: auto;
  padding: 0.25rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
}

.tabs-pills__tab {
  padding: 0.375rem 0.875rem;
  border: 0;
  border-radius: 9999px;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}

.tabs-pills__tab:hover {
  color: #111827;
}

.tabs-pills__tab:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * blue-600 rather than a lighter blue in both themes: white text on #2563eb is
 * 5.2:1, while the same text on blue-500 would fall to 3.7:1 and fail AA.
 */
.tabs-pills__tab[aria-selected='true'] {
  background-color: #2563eb;
  color: #ffffff;
}

.tabs-pills__tab[aria-selected='true']:hover {
  color: #ffffff;
}

.tabs-pills__panel {
  padding-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.tabs-pills__panel p {
  margin: 0;
}

.tabs-pills__panel:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

@media (prefers-reduced-motion: reduce) {
  .tabs-pills__tab {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .tabs-pills__list {
    background-color: #111827;
  }

  .tabs-pills__tab {
    color: #9ca3af;
  }

  .tabs-pills__tab:hover {
    color: #f3f4f6;
  }

  .tabs-pills__tab:focus-visible {
    outline-color: #60a5fa;
  }

  .tabs-pills__tab[aria-selected='true'] {
    background-color: #2563eb;
    color: #ffffff;
  }

  .tabs-pills__panel {
    color: #d1d5db;
  }

  .tabs-pills__panel:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!-- The pill track is the tablist itself; aria-selected: paints the filled pill. -->
<div class="max-w-2xl" data-tabs-pills>
  <div class="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-900" role="tablist" aria-label="Report range">
    <button
      class="rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-selected:bg-blue-600 aria-selected:text-white dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-selected:text-white"
      type="button" role="tab" id="pill-day" aria-controls="pill-panel-day" aria-selected="true" tabindex="0"
    >
      Day
    </button>
    <button
      class="rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-selected:bg-blue-600 aria-selected:text-white dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-selected:text-white"
      type="button" role="tab" id="pill-week" aria-controls="pill-panel-week" aria-selected="false" tabindex="-1"
    >
      Week
    </button>
    <button
      class="rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-selected:bg-blue-600 aria-selected:text-white dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-selected:text-white"
      type="button" role="tab" id="pill-month" aria-controls="pill-panel-month" aria-selected="false" tabindex="-1"
    >
      Month
    </button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="pill-panel-day" aria-labelledby="pill-day" tabindex="0">
    <p>1,284 requests served today with a median latency of 42ms.</p>
  </div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="pill-panel-week" aria-labelledby="pill-week" tabindex="0" hidden>
    <p>9,731 requests this week - up 12% on the week before.</p>
  </div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="pill-panel-month" aria-labelledby="pill-month" tabindex="0" hidden>
    <p>41,208 requests this month, with no incidents recorded.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-pills]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsPills({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-900"
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsPillsProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsPills({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsPillsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string): void {
    setActiveId(id);
    onSelect?.(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-900"
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsPillsProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsPills({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsPillsProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-900"
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-boxed',
    category: 'tabs',
    tags: ['tabs', 'boxed', 'folder', 'a11y', 'keyboard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-02',
    updatedAt: '2026-07-05',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 918, copies: 207, downloads: 55 },
    variants: [
      { id: 'card', labelKey: 'card' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      {
        name: 'items',
        type: 'TabItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'preview', label: 'Preview', content: <p>…</p> }]",
      },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Boxed (folder) tabs. The trick is the seam: the tablist has a bottom border,
  the selected tab pulls itself down 1px (margin-bottom: -1px) and paints its own
  background over that border, so the tab and the panel below read as one sheet
  of paper. Everything else is the same ARIA + roving tabindex machinery.
-->
<div class="tabs-boxed" data-tabs-boxed>
  <div class="tabs-boxed__list" role="tablist" aria-label="Editor view">
    <button class="tabs-boxed__tab" type="button" role="tab" id="box-preview" aria-controls="box-panel-preview" aria-selected="true" tabindex="0">
      Preview
    </button>
    <button class="tabs-boxed__tab" type="button" role="tab" id="box-code" aria-controls="box-panel-code" aria-selected="false" tabindex="-1">
      Code
    </button>
    <button class="tabs-boxed__tab" type="button" role="tab" id="box-console" aria-controls="box-panel-console" aria-selected="false" tabindex="-1">
      Console
    </button>
  </div>

  <div class="tabs-boxed__panel" role="tabpanel" id="box-panel-preview" aria-labelledby="box-preview" tabindex="0">
    <p>The rendered result, refreshed on every save.</p>
  </div>
  <div class="tabs-boxed__panel" role="tabpanel" id="box-panel-code" aria-labelledby="box-code" tabindex="0" hidden>
    <p>142 lines of TypeScript across three modules.</p>
  </div>
  <div class="tabs-boxed__panel" role="tabpanel" id="box-panel-console" aria-labelledby="box-console" tabindex="0" hidden>
    <p>No errors. Two warnings about unused imports.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-boxed]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      css: `.tabs-boxed {
  max-width: 42rem;
}

.tabs-boxed__list {
  display: flex;
  gap: 0.25rem;
  /* Scroll the strip instead of overflowing the page when the tabs don't fit. */
  overflow-x: auto;
  border-bottom: 1px solid #e5e7eb;
}

.tabs-boxed__tab {
  margin-bottom: -1px; /* sit on the list's hairline, ready to cover it */
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem 0.5rem 0 0;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
}

.tabs-boxed__tab:hover {
  background-color: #f9fafb;
  color: #111827;
}

.tabs-boxed__tab:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

/* The seam: same background as the panel, and no bottom border. */
.tabs-boxed__tab[aria-selected='true'] {
  border-color: #e5e7eb;
  border-bottom-color: #ffffff;
  background-color: #ffffff;
  color: #111827;
}

.tabs-boxed__panel {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-top: 0;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: #ffffff;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.tabs-boxed__panel p {
  margin: 0;
}

.tabs-boxed__panel:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

@media (prefers-color-scheme: dark) {
  .tabs-boxed__list {
    border-bottom-color: #1f2937;
  }

  .tabs-boxed__tab {
    color: #9ca3af;
  }

  .tabs-boxed__tab:hover {
    background-color: #111827;
    color: #f3f4f6;
  }

  .tabs-boxed__tab:focus-visible {
    outline-color: #60a5fa;
  }

  .tabs-boxed__tab[aria-selected='true'] {
    border-color: #1f2937;
    border-bottom-color: #030712;
    background-color: #030712;
    color: #f3f4f6;
  }

  .tabs-boxed__panel {
    border-color: #1f2937;
    background-color: #030712;
    color: #d1d5db;
  }

  .tabs-boxed__panel:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!--
  -mb-px on the tabs plus a matching bottom border colour on the selected one is
  what joins the active tab to the panel. Keep the tab's border-b colour equal to
  the panel's background in BOTH themes or the seam reappears.
-->
<div class="max-w-2xl" data-tabs-boxed>
  <div class="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Editor view">
    <button
      class="-mb-px rounded-t-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:border-gray-200 aria-selected:border-b-white aria-selected:bg-white aria-selected:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-gray-800 dark:aria-selected:border-b-gray-950 dark:aria-selected:bg-gray-950 dark:aria-selected:text-gray-100"
      type="button" role="tab" id="box-preview" aria-controls="box-panel-preview" aria-selected="true" tabindex="0"
    >
      Preview
    </button>
    <button
      class="-mb-px rounded-t-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:border-gray-200 aria-selected:border-b-white aria-selected:bg-white aria-selected:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-gray-800 dark:aria-selected:border-b-gray-950 dark:aria-selected:bg-gray-950 dark:aria-selected:text-gray-100"
      type="button" role="tab" id="box-code" aria-controls="box-panel-code" aria-selected="false" tabindex="-1"
    >
      Code
    </button>
    <button
      class="-mb-px rounded-t-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:border-gray-200 aria-selected:border-b-white aria-selected:bg-white aria-selected:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-gray-800 dark:aria-selected:border-b-gray-950 dark:aria-selected:bg-gray-950 dark:aria-selected:text-gray-100"
      type="button" role="tab" id="box-console" aria-controls="box-panel-console" aria-selected="false" tabindex="-1"
    >
      Console
    </button>
  </div>

  <div class="rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="box-panel-preview" aria-labelledby="box-preview" tabindex="0">
    <p>The rendered result, refreshed on every save.</p>
  </div>
  <div class="rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="box-panel-code" aria-labelledby="box-code" tabindex="0" hidden>
    <p>142 lines of TypeScript across three modules.</p>
  </div>
  <div class="rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="box-panel-console" aria-labelledby="box-console" tabindex="0" hidden>
    <p>No errors. Two warnings about unused imports.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-boxed]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsBoxed({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px rounded-t-lg border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-gray-200 border-b-white bg-white text-gray-900 dark:border-gray-800 dark:border-b-gray-950 dark:bg-gray-950 dark:text-gray-100'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsBoxedProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsBoxed({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsBoxedProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string): void {
    setActiveId(id);
    onSelect?.(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px rounded-t-lg border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-gray-200 border-b-white bg-white text-gray-900 dark:border-gray-800 dark:border-b-gray-950 dark:bg-gray-950 dark:text-gray-100'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsBoxedProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsBoxed({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsBoxedProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px rounded-t-lg border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-gray-200 border-b-white bg-white text-gray-900 dark:border-gray-800 dark:border-b-gray-950 dark:bg-gray-950 dark:text-gray-100'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-vertical',
    category: 'tabs',
    tags: ['tabs', 'vertical', 'sidebar', 'a11y', 'keyboard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-24',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 704, copies: 168, downloads: 47 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'TabItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'profile', label: 'Profile', content: <p>…</p> }]",
      },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Vertical tabs. Two things change with the axis, and both matter:
  1. aria-orientation="vertical" on the tablist, which tells the screen reader
     (and the user) that Up/Down are the movement keys here.
  2. the script binds ArrowUp/ArrowDown instead of ArrowLeft/ArrowRight.
  Getting the CSS to stack without doing (1) and (2) is the classic bug - the
  strip looks vertical but only answers to left/right.
-->
<div class="tabs-vert" data-tabs-vert>
  <div class="tabs-vert__list" role="tablist" aria-label="Settings sections" aria-orientation="vertical">
    <button class="tabs-vert__tab" type="button" role="tab" id="vert-profile" aria-controls="vert-panel-profile" aria-selected="true" tabindex="0">
      Profile
    </button>
    <button class="tabs-vert__tab" type="button" role="tab" id="vert-security" aria-controls="vert-panel-security" aria-selected="false" tabindex="-1">
      Security
    </button>
    <button class="tabs-vert__tab" type="button" role="tab" id="vert-billing" aria-controls="vert-panel-billing" aria-selected="false" tabindex="-1">
      Billing
    </button>
    <button class="tabs-vert__tab" type="button" role="tab" id="vert-api" aria-controls="vert-panel-api" aria-selected="false" tabindex="-1">
      API keys
    </button>
  </div>

  <div class="tabs-vert__panel" role="tabpanel" id="vert-panel-profile" aria-labelledby="vert-profile" tabindex="0">
    <p>Your display name and avatar are visible to everyone in the workspace.</p>
  </div>
  <div class="tabs-vert__panel" role="tabpanel" id="vert-panel-security" aria-labelledby="vert-security" tabindex="0" hidden>
    <p>Two-factor authentication is on. Recovery codes were generated in April.</p>
  </div>
  <div class="tabs-vert__panel" role="tabpanel" id="vert-panel-billing" aria-labelledby="vert-billing" tabindex="0" hidden>
    <p>The Team plan renews on 1 August. Invoices go to billing@example.com.</p>
  </div>
  <div class="tabs-vert__panel" role="tabpanel" id="vert-panel-api" aria-labelledby="vert-api" tabindex="0" hidden>
    <p>Three live keys. The oldest has not been used in 60 days - consider revoking it.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-vert]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          // Vertical orientation: Down/Up, not Right/Left.
          if (event.key === 'ArrowDown') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      css: `.tabs-vert {
  display: flex;
  gap: 1.5rem;
  max-width: 42rem;
}

.tabs-vert__list {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 0.125rem;
  width: 11rem;
  border-right: 1px solid #e5e7eb;
  padding-right: 0.75rem;
}

.tabs-vert__tab {
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  color: #4b5563;
  cursor: pointer;
}

.tabs-vert__tab:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.tabs-vert__tab:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

.tabs-vert__tab[aria-selected='true'] {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.tabs-vert__panel {
  flex: 1;
  min-width: 0;
  padding-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.tabs-vert__panel p {
  margin: 0;
}

.tabs-vert__panel:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

/* Stack under the panel on narrow screens - a 11rem rail plus prose does not
   fit a phone. The roles and keys are unchanged; only the layout folds. */
@media (max-width: 40rem) {
  .tabs-vert {
    flex-direction: column;
    gap: 0.75rem;
  }

  .tabs-vert__list {
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid #e5e7eb;
    padding-right: 0;
    padding-bottom: 0.75rem;
  }
}

@media (prefers-color-scheme: dark) {
  .tabs-vert__list {
    border-right-color: #1f2937;
  }

  .tabs-vert__tab {
    color: #9ca3af;
  }

  .tabs-vert__tab:hover {
    background-color: #111827;
    color: #f3f4f6;
  }

  .tabs-vert__tab:focus-visible {
    outline-color: #60a5fa;
  }

  .tabs-vert__tab[aria-selected='true'] {
    background-color: #172554;
    color: #93c5fd;
  }

  .tabs-vert__panel {
    color: #d1d5db;
  }

  .tabs-vert__panel:focus-visible {
    outline-color: #60a5fa;
  }

  @media (max-width: 40rem) {
    .tabs-vert__list {
      border-bottom-color: #1f2937;
    }
  }
}`,
      tailwind: `<!--
  aria-orientation="vertical" is not decoration: it is the contract that Up/Down
  move between these tabs, and the script below honours it.
-->
<div class="flex max-w-2xl flex-col gap-3 sm:flex-row sm:gap-6" data-tabs-vert>
  <div
    class="flex shrink-0 flex-col gap-0.5 border-b border-gray-200 pb-3 sm:w-44 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 dark:border-gray-800"
    role="tablist" aria-label="Settings sections" aria-orientation="vertical"
  >
    <button
      class="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-blue-950 dark:aria-selected:text-blue-300"
      type="button" role="tab" id="vert-profile" aria-controls="vert-panel-profile" aria-selected="true" tabindex="0"
    >
      Profile
    </button>
    <button
      class="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-blue-950 dark:aria-selected:text-blue-300"
      type="button" role="tab" id="vert-security" aria-controls="vert-panel-security" aria-selected="false" tabindex="-1"
    >
      Security
    </button>
    <button
      class="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-blue-950 dark:aria-selected:text-blue-300"
      type="button" role="tab" id="vert-billing" aria-controls="vert-panel-billing" aria-selected="false" tabindex="-1"
    >
      Billing
    </button>
    <button
      class="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-blue-950 dark:aria-selected:text-blue-300"
      type="button" role="tab" id="vert-api" aria-controls="vert-panel-api" aria-selected="false" tabindex="-1"
    >
      API keys
    </button>
  </div>

  <div class="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="vert-panel-profile" aria-labelledby="vert-profile" tabindex="0">
    <p>Your display name and avatar are visible to everyone in the workspace.</p>
  </div>
  <div class="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="vert-panel-security" aria-labelledby="vert-security" tabindex="0" hidden>
    <p>Two-factor authentication is on. Recovery codes were generated in April.</p>
  </div>
  <div class="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="vert-panel-billing" aria-labelledby="vert-billing" tabindex="0" hidden>
    <p>The Team plan renews on 1 August. Invoices go to billing@example.com.</p>
  </div>
  <div class="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="vert-panel-api" aria-labelledby="vert-api" tabindex="0" hidden>
    <p>Three live keys. The oldest has not been used in 60 days - consider revoking it.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-vert]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowDown') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsVertical({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  // Vertical orientation => Up/Down are the movement keys.
  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`flex max-w-2xl flex-col gap-3 sm:flex-row sm:gap-6 \${className}\`}>
      <div
        className="flex shrink-0 flex-col gap-0.5 border-b border-gray-200 pb-3 sm:w-44 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 dark:border-gray-800"
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`rounded-md px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsVerticalProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsVertical({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsVerticalProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string): void {
    setActiveId(id);
    onSelect?.(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`flex max-w-2xl flex-col gap-3 sm:flex-row sm:gap-6 \${className}\`}>
      <div
        className="flex shrink-0 flex-col gap-0.5 border-b border-gray-200 pb-3 sm:w-44 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 dark:border-gray-800"
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`rounded-md px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsVerticalProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsVertical({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsVerticalProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`flex max-w-2xl flex-col gap-3 sm:flex-row sm:gap-6 \${className}\`}>
      <div
        className="flex shrink-0 flex-col gap-0.5 border-b border-gray-200 pb-3 sm:w-44 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 dark:border-gray-800"
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
      >
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`rounded-md px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-with-icons',
    category: 'tabs',
    tags: ['tabs', 'icons', 'a11y', 'keyboard', 'navigation'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-28',
    updatedAt: '2026-06-30',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1102, copies: 263, downloads: 71 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'text', labelKey: 'text' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'TabItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'inbox', label: 'Inbox', icon: <InboxIcon />, content: <p>…</p> }]",
      },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Icon + label tabs. The icons are aria-hidden and the label stays visible: the
  icon is a scanning aid, never the accessible name. If you ever hide the label
  to save space, the tab needs an aria-label carrying the same words - an
  icon-only tab with no name is unusable with a screen reader.
-->
<div class="tabs-icons" data-tabs-icons>
  <div class="tabs-icons__list" role="tablist" aria-label="Mailbox">
    <button class="tabs-icons__tab" type="button" role="tab" id="ico-inbox" aria-controls="ico-panel-inbox" aria-selected="true" tabindex="0">
      <svg class="tabs-icons__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M2.5 12.5h4l1 2h5l1-2h4M2.5 12.5 4 4.5h12l1.5 8v3a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-3Z" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Inbox
    </button>
    <button class="tabs-icons__tab" type="button" role="tab" id="ico-starred" aria-controls="ico-panel-starred" aria-selected="false" tabindex="-1">
      <svg class="tabs-icons__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="m10 2.5 2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 14.48l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76L10 2.5Z" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Starred
    </button>
    <button class="tabs-icons__tab" type="button" role="tab" id="ico-archive" aria-controls="ico-panel-archive" aria-selected="false" tabindex="-1">
      <svg class="tabs-icons__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M2.5 6.5h15m-13.5 0v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9M3.5 3.5h13v3h-13v-3ZM8 10h4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Archive
    </button>
  </div>

  <div class="tabs-icons__panel" role="tabpanel" id="ico-panel-inbox" aria-labelledby="ico-inbox" tabindex="0">
    <p>12 unread messages, 3 of them flagged as urgent.</p>
  </div>
  <div class="tabs-icons__panel" role="tabpanel" id="ico-panel-starred" aria-labelledby="ico-starred" tabindex="0" hidden>
    <p>4 starred threads. Nothing new since Tuesday.</p>
  </div>
  <div class="tabs-icons__panel" role="tabpanel" id="ico-panel-archive" aria-labelledby="ico-archive" tabindex="0" hidden>
    <p>1,204 archived messages, searchable for two years.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-icons]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      css: `.tabs-icons {
  max-width: 42rem;
}

.tabs-icons__list {
  display: flex;
  gap: 0.5rem;
  /* Scroll the strip instead of overflowing the page when the tabs don't fit. */
  overflow-x: auto;
  border-bottom: 1px solid #e5e7eb;
}

.tabs-icons__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
}

.tabs-icons__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  /* currentColor, so the icon inherits every state the label already has. */
  color: currentColor;
}

.tabs-icons__tab:hover {
  color: #111827;
}

.tabs-icons__tab:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
  border-radius: 0.25rem;
}

.tabs-icons__tab[aria-selected='true'] {
  border-bottom-color: #2563eb;
  color: #2563eb;
}

.tabs-icons__panel {
  padding-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.tabs-icons__panel p {
  margin: 0;
}

.tabs-icons__panel:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

@media (prefers-color-scheme: dark) {
  .tabs-icons__list {
    border-bottom-color: #1f2937;
  }

  .tabs-icons__tab {
    color: #9ca3af;
  }

  .tabs-icons__tab:hover {
    color: #f3f4f6;
  }

  .tabs-icons__tab:focus-visible {
    outline-color: #60a5fa;
  }

  .tabs-icons__tab[aria-selected='true'] {
    border-bottom-color: #60a5fa;
    color: #60a5fa;
  }

  .tabs-icons__panel {
    color: #d1d5db;
  }

  .tabs-icons__panel:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!-- The icon inherits currentColor, so one aria-selected: rule paints both. -->
<div class="max-w-2xl" data-tabs-icons>
  <div class="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Mailbox">
    <button
      class="-mb-px inline-flex items-center gap-2 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400"
      type="button" role="tab" id="ico-inbox" aria-controls="ico-panel-inbox" aria-selected="true" tabindex="0"
    >
      <svg class="h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M2.5 12.5h4l1 2h5l1-2h4M2.5 12.5 4 4.5h12l1.5 8v3a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-3Z" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Inbox
    </button>
    <button
      class="-mb-px inline-flex items-center gap-2 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400"
      type="button" role="tab" id="ico-starred" aria-controls="ico-panel-starred" aria-selected="false" tabindex="-1"
    >
      <svg class="h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="m10 2.5 2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 14.48l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76L10 2.5Z" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Starred
    </button>
    <button
      class="-mb-px inline-flex items-center gap-2 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400"
      type="button" role="tab" id="ico-archive" aria-controls="ico-panel-archive" aria-selected="false" tabindex="-1"
    >
      <svg class="h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M2.5 6.5h15m-13.5 0v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9M3.5 3.5h13v3h-13v-3ZM8 10h4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Archive
    </button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ico-panel-inbox" aria-labelledby="ico-inbox" tabindex="0">
    <p>12 unread messages, 3 of them flagged as urgent.</p>
  </div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ico-panel-starred" aria-labelledby="ico-starred" tabindex="0" hidden>
    <p>4 starred threads. Nothing new since Tuesday.</p>
  </div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ico-panel-archive" aria-labelledby="ico-archive" tabindex="0" hidden>
    <p>1,204 archived messages, searchable for two years.</p>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-icons]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

      function select(index, setFocus) {
        tabs.forEach(function (tab, i) {
          var isSelected = i === index;
          tab.setAttribute('aria-selected', String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;
          if (panels[i]) panels[i].hidden = !isSelected;
        });
        if (setFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          select(i, false);
        });

        tab.addEventListener('keydown', function (event) {
          var next = -1;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;

          event.preventDefault();
          select(next, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsWithIcons({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {/* aria-hidden on the wrapper: the label is the accessible name. */}
              <span className="flex h-[1.125rem] w-[1.125rem] flex-none items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface TabsWithIconsProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsWithIcons({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsWithIconsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string): void {
    setActiveId(id);
    onSelect?.(id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              <span className="flex h-[1.125rem] w-[1.125rem] flex-none items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

export interface TabsWithIconsProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsWithIcons({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsWithIconsProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              <span className="flex h-[1.125rem] w-[1.125rem] flex-none items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-segmented',
    category: 'tabs',
    tags: ['tabs', 'segmented', 'control', 'a11y', 'keyboard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'all', label: 'All', content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Segmented control: the tinted track is the tablist; aria-selected: paints the raised card. -->
<div class="max-w-2xl" data-tabs-segmented>
  <div class="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label="Ticket status">
    <button class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-white aria-selected:text-gray-900 aria-selected:shadow-sm dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-gray-950 dark:aria-selected:text-gray-100" type="button" role="tab" id="seg-all" aria-controls="seg-panel-all" aria-selected="true" tabindex="0">All</button>
    <button class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-white aria-selected:text-gray-900 aria-selected:shadow-sm dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-gray-950 dark:aria-selected:text-gray-100" type="button" role="tab" id="seg-open" aria-controls="seg-panel-open" aria-selected="false" tabindex="-1">Open</button>
    <button class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-white aria-selected:text-gray-900 aria-selected:shadow-sm dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-gray-950 dark:aria-selected:text-gray-100" type="button" role="tab" id="seg-closed" aria-controls="seg-panel-closed" aria-selected="false" tabindex="-1">Closed</button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="seg-panel-all" aria-labelledby="seg-all" tabindex="0"><p>Every ticket across the workspace, newest first.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="seg-panel-open" aria-labelledby="seg-open" tabindex="0" hidden><p>18 open tickets, 4 waiting on a customer reply.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="seg-panel-closed" aria-labelledby="seg-closed" tabindex="0" hidden><p>231 closed this quarter, median resolution 6h.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-segmented]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1; // roving tabindex
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsSegmented({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsSegmentedProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsSegmented({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsSegmentedProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-scrollable',
    category: 'tabs',
    tags: ['tabs', 'scrollable', 'overflow', 'a11y', 'keyboard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'overview', label: 'Overview', content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The tablist is overflow-x-auto with scroll-snap, so it scrolls sideways instead of overflowing the page at 320px. -->
<div class="max-w-2xl" data-tabs-scrollable>
  <div class="flex snap-x gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Project sections">
    <button class="relative shrink-0 snap-start whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="scr-overview" aria-controls="scr-panel-overview" aria-selected="true" tabindex="0">Overview</button>
    <button class="relative shrink-0 snap-start whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="scr-analytics" aria-controls="scr-panel-analytics" aria-selected="false" tabindex="-1">Analytics</button>
    <button class="relative shrink-0 snap-start whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="scr-members" aria-controls="scr-panel-members" aria-selected="false" tabindex="-1">Members</button>
    <button class="relative shrink-0 snap-start whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="scr-billing" aria-controls="scr-panel-billing" aria-selected="false" tabindex="-1">Billing</button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="scr-panel-overview" aria-labelledby="scr-overview" tabindex="0"><p>A summary of the whole project at a glance.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="scr-panel-analytics" aria-labelledby="scr-analytics" tabindex="0" hidden><p>Traffic climbed 8% week over week.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="scr-panel-members" aria-labelledby="scr-members" tabindex="0" hidden><p>24 members across 5 teams.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="scr-panel-billing" aria-labelledby="scr-billing" tabindex="0" hidden><p>Team plan, renews on the 1st.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-scrollable]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus) tabs[i].focus(); // focusing scrolls the tab into view
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsScrollable({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex snap-x gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative shrink-0 snap-start whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsScrollableProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsScrollable({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsScrollableProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex snap-x gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative shrink-0 snap-start whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-with-badges',
    category: 'tabs',
    tags: ['tabs', 'badge', 'count', 'a11y', 'keyboard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'inbox', label: 'Inbox', badge: 12, content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The count badge sits beside a visible label and is aria-hidden, so it stays out of the accessible name. -->
<div class="max-w-2xl" data-tabs-badges>
  <div class="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Conversations">
    <button class="group relative inline-flex items-center gap-2 whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="bdg-inbox" aria-controls="bdg-panel-inbox" aria-selected="true" tabindex="0">
      Inbox
      <span class="inline-flex min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-semibold text-gray-600 group-aria-selected:bg-blue-600 group-aria-selected:text-white dark:bg-gray-800 dark:text-gray-300 dark:group-aria-selected:bg-blue-500" aria-hidden="true">12</span>
    </button>
    <button class="group relative inline-flex items-center gap-2 whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="bdg-mentions" aria-controls="bdg-panel-mentions" aria-selected="false" tabindex="-1">
      Mentions
      <span class="inline-flex min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-semibold text-gray-600 group-aria-selected:bg-blue-600 group-aria-selected:text-white dark:bg-gray-800 dark:text-gray-300 dark:group-aria-selected:bg-blue-500" aria-hidden="true">3</span>
    </button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="bdg-panel-inbox" aria-labelledby="bdg-inbox" tabindex="0"><p>12 conversations need a first reply.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="bdg-panel-mentions" aria-labelledby="bdg-mentions" tabindex="0" hidden><p>3 threads mention you directly.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-badges]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsWithBadges({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative inline-flex items-center gap-2 whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
              {typeof item.badge === 'number' ? (
                <span
                  aria-hidden="true"
                  className={\`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold \${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }\`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number;
  content: ReactNode;
}

export interface TabsWithBadgesProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsWithBadges({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsWithBadgesProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative inline-flex items-center gap-2 whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
              {typeof item.badge === 'number' ? (
                <span
                  aria-hidden="true"
                  className={\`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold \${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }\`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-closable',
    category: 'tabs',
    tags: ['tabs', 'closable', 'editor', 'a11y', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'index', label: 'index.ts', content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onClose', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Closable tabs. The close control is a real sibling <button> with its own
  aria-label - NOT a glyph inside the tab (nested buttons are invalid, and an
  icon inside the tab is not separately operable). The script removes the tab and
  moves selection to a neighbour when the active tab is closed.
-->
<div class="max-w-2xl" data-tabs-closable>
  <div class="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Open files">
    <span class="inline-flex shrink-0 items-center">
      <button class="-mb-px whitespace-nowrap rounded-t-md border-b-2 border-transparent py-2 pl-3 pr-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="cl-index" aria-controls="cl-panel-index" aria-selected="true" tabindex="0">index.ts</button>
      <button class="-mb-px flex h-6 w-6 flex-none items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400" type="button" data-close aria-label="Close index.ts">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke-linecap="round" /></svg>
      </button>
    </span>
    <span class="inline-flex shrink-0 items-center">
      <button class="-mb-px whitespace-nowrap rounded-t-md border-b-2 border-transparent py-2 pl-3 pr-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="cl-app" aria-controls="cl-panel-app" aria-selected="false" tabindex="-1">app.tsx</button>
      <button class="-mb-px flex h-6 w-6 flex-none items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400" type="button" data-close aria-label="Close app.tsx">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke-linecap="round" /></svg>
      </button>
    </span>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="cl-panel-index" aria-labelledby="cl-index" tabindex="0"><p>The entry point that wires the app together.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="cl-panel-app" aria-labelledby="cl-app" tabindex="0" hidden><p>The root component and its providers.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-closable]').forEach(function (root) {
      function tabs() { return [].slice.call(root.querySelectorAll('[role="tab"]')); }
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(tab, focus) {
        tabs().forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus && tab) tab.focus();
      }
      root.addEventListener('click', function (e) {
        var tab = e.target.closest('[role="tab"]');
        if (tab) { select(tab, false); return; }
        var close = e.target.closest('[data-close]');
        if (!close) return;
        var group = close.closest('span');
        var owned = group.querySelector('[role="tab"]');
        var list = tabs();
        var idx = list.indexOf(owned);
        var wasActive = owned.getAttribute('aria-selected') === 'true';
        var panel = panelFor(owned);
        if (panel) panel.remove();
        group.remove();
        if (wasActive) {
          var next = tabs();
          var fallback = next[idx] || next[idx - 1] || next[0];
          if (fallback) select(fallback, true);
        }
      });
      root.addEventListener('keydown', function (e) {
        var tab = e.target.closest('[role="tab"]');
        if (!tab) return;
        var list = tabs();
        var i = list.indexOf(tab);
        var n = -1;
        if (e.key === 'ArrowRight') n = (i + 1) % list.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + list.length) % list.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = list.length - 1;
        else return;
        e.preventDefault();
        select(list[n], true);
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsClosable({ items, defaultTabId, onClose, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState(items);
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function onKeyDown(event) {
    const index = openItems.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % openItems.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + openItems.length) % openItems.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = openItems.length - 1;
    else return;

    event.preventDefault();
    const item = openItems[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  }

  function close(id) {
    const index = openItems.findIndex((item) => item.id === id);
    const remaining = openItems.filter((item) => item.id !== id);
    setOpenItems(remaining);
    if (onClose) onClose(id);
    if (id === activeId) {
      const fallback = remaining[index] ?? remaining[index - 1] ?? remaining[0];
      setActiveId(fallback?.id);
      if (fallback) window.requestAnimationFrame(() => tabRefs.current[fallback.id]?.focus());
    }
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {openItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <span key={item.id} className="inline-flex shrink-0 items-center">
              <button
                type="button"
                role="tab"
                id={\`\${baseId}-\${item.id}-tab\`}
                aria-controls={\`\${baseId}-\${item.id}-panel\`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                ref={(node) => { tabRefs.current[item.id] = node; }}
                onClick={() => setActiveId(item.id)}
                onKeyDown={onKeyDown}
                className={\`-mb-px whitespace-nowrap rounded-t-md border-b-2 py-2 pl-3 pr-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }\`}
              >
                {item.label}
              </button>
              <button
                type="button"
                onClick={() => close(item.id)}
                aria-label={\`Close \${item.label}\`}
                className="-mb-px flex h-6 w-6 flex-none items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          );
        })}
      </div>

      {openItems.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsClosableProps {
  items: TabItem[];
  defaultTabId?: string;
  onClose?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsClosable({
  items,
  defaultTabId,
  onClose,
  className = '',
  ariaLabel = 'Tabs',
}: TabsClosableProps): JSX.Element {
  const baseId = useId();
  const [openItems, setOpenItems] = useState<TabItem[]>(items);
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = openItems.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % openItems.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + openItems.length) % openItems.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = openItems.length - 1;
    else return;

    event.preventDefault();
    const item = openItems[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  };

  const close = (id: string): void => {
    const index = openItems.findIndex((item: TabItem) => item.id === id);
    const remaining = openItems.filter((item: TabItem) => item.id !== id);
    setOpenItems(remaining);
    onClose?.(id);
    if (id === activeId) {
      const fallback = remaining[index] ?? remaining[index - 1] ?? remaining[0];
      setActiveId(fallback?.id);
      if (fallback) window.requestAnimationFrame(() => tabRefs.current[fallback.id]?.focus());
    }
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {openItems.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <span key={item.id} className="inline-flex shrink-0 items-center">
              <button
                type="button"
                role="tab"
                id={\`\${baseId}-\${item.id}-tab\`}
                aria-controls={\`\${baseId}-\${item.id}-panel\`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
                onClick={() => setActiveId(item.id)}
                onKeyDown={onKeyDown}
                className={\`-mb-px whitespace-nowrap rounded-t-md border-b-2 py-2 pl-3 pr-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }\`}
              >
                {item.label}
              </button>
              <button
                type="button"
                onClick={() => close(item.id)}
                aria-label={\`Close \${item.label}\`}
                className="-mb-px flex h-6 w-6 flex-none items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          );
        })}
      </div>

      {openItems.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-card-panels',
    category: 'tabs',
    tags: ['tabs', 'card', 'panel', 'a11y', 'keyboard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'shipping', label: 'Shipping', content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Pill tabs above a raised card panel: the switch reads as swapping the contents of one card. -->
<div class="max-w-2xl" data-tabs-card>
  <div class="mb-3 flex max-w-full gap-1 overflow-x-auto" role="tablist" aria-label="Product details">
    <button class="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-blue-950 dark:aria-selected:text-blue-300" type="button" role="tab" id="cd-shipping" aria-controls="cd-panel-shipping" aria-selected="true" tabindex="0">Shipping</button>
    <button class="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-blue-950 dark:aria-selected:text-blue-300" type="button" role="tab" id="cd-returns" aria-controls="cd-panel-returns" aria-selected="false" tabindex="-1">Returns</button>
    <button class="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-blue-950 dark:aria-selected:text-blue-300" type="button" role="tab" id="cd-warranty" aria-controls="cd-panel-warranty" aria-selected="false" tabindex="-1">Warranty</button>
  </div>

  <div class="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="cd-panel-shipping" aria-labelledby="cd-shipping" tabindex="0"><p>Free two-day shipping on orders over $50, tracked end to end.</p></div>
  <div class="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="cd-panel-returns" aria-labelledby="cd-returns" tabindex="0" hidden><p>30-day returns, prepaid label, refunded within three business days.</p></div>
  <div class="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="cd-panel-warranty" aria-labelledby="cd-warranty" tabindex="0" hidden><p>Two-year limited warranty covering manufacturing defects.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-card]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsCardPanels({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="mb-3 flex max-w-full gap-1 overflow-x-auto" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsCardPanelsProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsCardPanels({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsCardPanelsProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="mb-3 flex max-w-full gap-1 overflow-x-auto" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-animated-indicator',
    category: 'tabs',
    tags: ['tabs', 'animated', 'indicator', 'a11y', 'motion'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'design', label: 'Design', content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  One underline bar slides between tabs. The script measures the active tab's
  offsetLeft/offsetWidth and writes them to the indicator; the CSS transition
  animates the slide and is dropped under prefers-reduced-motion.
-->
<div class="max-w-2xl" data-tabs-animated>
  <div class="relative">
    <div class="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Project phase">
      <button class="whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="an-design" aria-controls="an-panel-design" aria-selected="true" tabindex="0">Design</button>
      <button class="whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="an-build" aria-controls="an-panel-build" aria-selected="false" tabindex="-1">Build</button>
      <button class="whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="an-launch" aria-controls="an-panel-launch" aria-selected="false" tabindex="-1">Launch</button>
    </div>
    <span data-indicator aria-hidden="true" class="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-[left,width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"></span>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="an-panel-design" aria-labelledby="an-design" tabindex="0"><p>Wireframes approved, hi-fi mocks in review.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="an-panel-build" aria-labelledby="an-build" tabindex="0" hidden><p>Two of five milestones shipped this sprint.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="an-panel-launch" aria-labelledby="an-launch" tabindex="0" hidden><p>Targeting the last week of the quarter.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-animated]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      var indicator = root.querySelector('[data-indicator]');
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function move(tab) {
        if (indicator) { indicator.style.left = tab.offsetLeft + 'px'; indicator.style.width = tab.offsetWidth + 'px'; }
      }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
          if (on) move(t);
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
      var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      if (initial) move(initial);
      window.addEventListener('resize', function () { if (initial) move(root.querySelector('[aria-selected="true"]') || initial); });
    });
  })();
</script>`,
      react: `import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

export function TabsAnimatedIndicator({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});

  const measure = () => {
    const node = activeId ? tabRefs.current[activeId] : null;
    if (node) setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
  };

  useLayoutEffect(measure, [activeId, items]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={\`\${baseId}-\${item.id}-tab\`}
                aria-controls={\`\${baseId}-\${item.id}-panel\`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                ref={(node) => { tabRefs.current[item.id] = node; }}
                onClick={() => select(item.id)}
                onKeyDown={onKeyDown}
                className={\`whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none \${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }\`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-0 h-0.5 bg-blue-600 transition-[left,width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsAnimatedIndicatorProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsAnimatedIndicator({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsAnimatedIndicatorProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const measure = (): void => {
    const node = activeId ? tabRefs.current[activeId] : null;
    if (node) setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
  };

  useLayoutEffect(measure, [activeId, items]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
          {items.map((item: TabItem) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={\`\${baseId}-\${item.id}-tab\`}
                aria-controls={\`\${baseId}-\${item.id}-panel\`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
                onClick={() => select(item.id)}
                onKeyDown={onKeyDown}
                className={\`whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none \${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }\`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-0 h-0.5 bg-blue-600 transition-[left,width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-icon-only',
    category: 'tabs',
    tags: ['tabs', 'icon', 'compact', 'a11y', 'keyboard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'grid', label: 'Grid view', icon: <svg/>, content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Icon-only tabs: each tab carries an aria-label because the icon (aria-hidden) is the only thing shown. 40px square keeps a tap target. -->
<div class="max-w-2xl" data-tabs-icononly>
  <div class="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label="View mode">
    <button class="flex h-10 w-10 flex-none items-center justify-center rounded-md text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-white aria-selected:text-blue-600 aria-selected:shadow-sm dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-gray-950 dark:aria-selected:text-blue-400" type="button" role="tab" aria-label="Grid view" id="io-grid" aria-controls="io-panel-grid" aria-selected="true" tabindex="0">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5" aria-hidden="true"><path d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z" stroke-linejoin="round" /></svg>
    </button>
    <button class="flex h-10 w-10 flex-none items-center justify-center rounded-md text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-white aria-selected:text-blue-600 aria-selected:shadow-sm dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:bg-gray-950 dark:aria-selected:text-blue-400" type="button" role="tab" aria-label="List view" id="io-list" aria-controls="io-panel-list" aria-selected="false" tabindex="-1">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5" aria-hidden="true"><path d="M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01" stroke-linecap="round" /></svg>
    </button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="io-panel-grid" aria-labelledby="io-grid" tabindex="0"><p>Assets shown as a grid of thumbnails.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="io-panel-list" aria-labelledby="io-list" tabindex="0" hidden><p>Assets shown as a dense, sortable list.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-icononly]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsIconOnly({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-label={item.label}
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`flex h-10 w-10 flex-none items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-950 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              <span className="h-5 w-5" aria-hidden="true">{item.icon}</span>
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

export interface TabsIconOnlyProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsIconOnly({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsIconOnlyProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-label={item.label}
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`flex h-10 w-10 flex-none items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-950 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              <span className="h-5 w-5" aria-hidden="true">{item.icon}</span>
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-full-width',
    category: 'tabs',
    tags: ['tabs', 'full-width', 'equal', 'a11y', 'keyboard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'summary', label: 'Summary', content: <p>…</p> }]" },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Equal-width tabs: each tab is flex-1 with min-w-0/truncate, so the strip fills the row and long labels shorten instead of overflowing. -->
<div class="max-w-2xl" data-tabs-fullwidth>
  <div class="flex border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Account tabs">
    <button class="-mb-px min-w-0 flex-1 truncate border-b-2 border-transparent px-2 py-2.5 text-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="fw-summary" aria-controls="fw-panel-summary" aria-selected="true" tabindex="0">Summary</button>
    <button class="-mb-px min-w-0 flex-1 truncate border-b-2 border-transparent px-2 py-2.5 text-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="fw-activity" aria-controls="fw-panel-activity" aria-selected="false" tabindex="-1">Activity</button>
    <button class="-mb-px min-w-0 flex-1 truncate border-b-2 border-transparent px-2 py-2.5 text-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:border-blue-600 aria-selected:text-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:border-blue-400 dark:aria-selected:text-blue-400" type="button" role="tab" id="fw-notes" aria-controls="fw-panel-notes" aria-selected="false" tabindex="-1">Notes</button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="fw-panel-summary" aria-labelledby="fw-summary" tabindex="0"><p>Key numbers for the account at a glance.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="fw-panel-activity" aria-labelledby="fw-activity" tabindex="0" hidden><p>The most recent events on this account.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="fw-panel-notes" aria-labelledby="fw-notes" tabindex="0" hidden><p>Internal notes shared with your team.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-fullwidth]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

export function TabsFullWidth({ items, defaultTabId, onSelect, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});

  function select(id) {
    setActiveId(id);
    if (onSelect) onSelect(id);
  }

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px min-w-0 flex-1 truncate border-b-2 px-2 py-2.5 text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsFullWidthProps {
  items: TabItem[];
  defaultTabId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabsFullWidth({
  items,
  defaultTabId,
  onSelect,
  className = '',
  ariaLabel = 'Tabs',
}: TabsFullWidthProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onSelect?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={\`-mb-px min-w-0 flex-1 truncate border-b-2 px-2 py-2.5 text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'tabs-nested',
    category: 'tabs',
    tags: ['tabs', 'nested', 'sub-tabs', 'a11y', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'account', label: 'Account', content: <p>…</p> }]" },
      { name: 'variant', type: "'underline' | 'pills'", descriptionKey: 'className' },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Nested tabs. The correctness point is scope: the script keys each tablist to
  its OWN tabs and finds panels by aria-controls, so the inner strip does not
  answer the outer strip's arrow keys and each level runs its own roving tabindex.
-->
<div class="max-w-2xl" data-tabs-nested>
  <div class="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Settings">
    <button class="relative whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="ns-account" aria-controls="ns-panel-account" aria-selected="true" tabindex="0">Account</button>
    <button class="relative whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="ns-workspace" aria-controls="ns-panel-workspace" aria-selected="false" tabindex="-1">Workspace</button>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ns-panel-account" aria-labelledby="ns-account" tabindex="0"><p>Your profile, email and password live here.</p></div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ns-panel-workspace" aria-labelledby="ns-workspace" tabindex="0" hidden>
    <p class="mb-3">Manage how billing works for the whole workspace.</p>
    <div class="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-800" role="tablist" aria-label="Billing sections">
      <button class="whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-blue-600 aria-selected:text-white dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-white" type="button" role="tab" id="ns-plan" aria-controls="ns-panel-plan" aria-selected="true" tabindex="0">Plan</button>
      <button class="whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:bg-blue-600 aria-selected:text-white dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-white" type="button" role="tab" id="ns-invoices" aria-controls="ns-panel-invoices" aria-selected="false" tabindex="-1">Invoices</button>
    </div>
    <div class="pt-3 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ns-panel-plan" aria-labelledby="ns-plan" tabindex="0"><p>Team plan, 24 seats, renews monthly.</p></div>
    <div class="pt-3 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ns-panel-invoices" aria-labelledby="ns-invoices" tabindex="0" hidden><p>12 paid invoices, all downloadable as PDF.</p></div>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-nested] [role="tablist"]').forEach(function (list) {
      // :scope keeps each tablist to its own tabs, so nesting stays isolated.
      var tabs = [].slice.call(list.querySelectorAll(':scope > [role="tab"]'));
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      function select(i, focus) {
        tabs.forEach(function (t, n) {
          var on = n === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var p = panelFor(t);
          if (p) p.hidden = !on;
        });
        if (focus) tabs[i].focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          select(n, true);
        });
      });
    });
  })();
</script>`,
      react: `import { useId, useRef, useState } from 'react';

// One self-contained Tabs, reused at both levels: each instance owns its state,
// so the inner strip never answers the outer strip's keys.
export function Tabs({ items, variant = 'underline', defaultTabId, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef({});
  const isPills = variant === 'pills';

  function onKeyDown(event) {
    const index = items.findIndex((item) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  }

  return (
    <div className={className}>
      <div
        className={
          isPills
            ? 'inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-800'
            : 'flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800'
        }
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const base = isPills
            ? 'rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400'
            : 'relative px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
          const activeCls = isPills
            ? 'bg-blue-600 text-white'
            : 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400';
          const idleCls = isPills
            ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100';
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={\`whitespace-nowrap \${base} \${isActive ? activeCls : idleCls}\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

// Usage: an inner <Tabs variant="pills"> lives inside an outer panel's content.
// const inner = <Tabs items={billingItems} variant="pills" ariaLabel="Billing" />;
// <Tabs items={[{ id: 'workspace', label: 'Workspace', content: inner }]} />`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  variant?: 'underline' | 'pills';
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

// One self-contained Tabs, reused at both levels: each instance owns its state,
// so the inner strip never answers the outer strip's keys.
export function Tabs({
  items,
  variant = 'underline',
  defaultTabId,
  className = '',
  ariaLabel = 'Tabs',
}: TabsProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isPills = variant === 'pills';

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={className}>
      <div
        className={
          isPills
            ? 'inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-800'
            : 'flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800'
        }
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          const base = isPills
            ? 'rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400'
            : 'relative px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
          const activeCls = isPills
            ? 'bg-blue-600 text-white'
            : 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400';
          const idleCls = isPills
            ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100';
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={\`whitespace-nowrap \${base} \${isActive ? activeCls : idleCls}\`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

// Usage: an inner <Tabs variant="pills"> lives inside an outer panel's content.
// const inner = <Tabs items={billingItems} variant="pills" ariaLabel="Billing" />;
// <Tabs items={[{ id: 'workspace', label: 'Workspace', content: inner }]} />`,
    },
  },

  {
    slug: 'tabs-with-dropdown-overflow',
    category: 'tabs',
    tags: ['tabs', 'overflow', 'dropdown', 'menu', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, descriptionKey: 'items', example: "[{ id: 'general', label: 'General', content: <p>…</p> }]" },
      { name: 'maxVisible', type: 'number', default: '3', descriptionKey: 'className' },
      { name: 'defaultTabId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Overflow tabs. Tabs past a threshold fold into a "More" menu instead of
  scrolling. The trigger reports aria-haspopup="menu" and aria-expanded, lights up
  when the active tab is hidden inside it, and the menu closes on Escape, outside
  click or selection.
-->
<div class="max-w-2xl" data-tabs-overflow>
  <div class="flex items-stretch gap-6 border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Settings">
    <button class="relative whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="ov-general" aria-controls="ov-panel-general" aria-selected="true" tabindex="0">General</button>
    <button class="relative whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="ov-members" aria-controls="ov-panel-members" aria-selected="false" tabindex="-1">Members</button>
    <button class="relative whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none aria-selected:text-blue-600 aria-selected:after:bg-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:aria-selected:text-blue-400 dark:aria-selected:after:bg-blue-400" type="button" role="tab" id="ov-billing" aria-controls="ov-panel-billing" aria-selected="false" tabindex="-1">Billing</button>

    <div class="relative flex items-stretch" data-overflow-wrap>
      <button class="relative inline-flex items-center gap-1 whitespace-nowrap px-0.5 py-3 text-sm font-medium text-gray-600 transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400" type="button" data-more aria-haspopup="menu" aria-expanded="false">
        More
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" class="h-4 w-4" aria-hidden="true"><path d="m6 8 4 4 4-4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="absolute right-0 top-full z-10 mt-1 hidden min-w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900" role="menu" aria-label="More tabs" data-menu>
        <button class="block w-full rounded-md px-3 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400" type="button" role="menuitem" data-target="ov-webhooks">Webhooks</button>
        <button class="block w-full rounded-md px-3 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400" type="button" role="menuitem" data-target="ov-audit">Audit log</button>
      </div>
    </div>
  </div>

  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ov-panel-general" aria-labelledby="ov-general" tabindex="0"><p>Workspace name, logo and default language.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ov-panel-members" aria-labelledby="ov-members" tabindex="0" hidden><p>24 members across 5 teams.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ov-panel-billing" aria-labelledby="ov-billing" tabindex="0" hidden><p>Team plan, renews on the 1st.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ov-panel-webhooks" aria-labelledby="ov-webhooks" tabindex="0" hidden><p>Two endpoints, both responding with 200.</p></div>
  <div class="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400" role="tabpanel" id="ov-panel-audit" aria-labelledby="ov-audit" tabindex="0" hidden><p>Every privileged action, retained for a year.</p></div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-tabs-overflow]').forEach(function (root) {
      var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
      var wrap = root.querySelector('[data-overflow-wrap]');
      var more = root.querySelector('[data-more]');
      var menu = root.querySelector('[data-menu]');
      var menuItems = [].slice.call(root.querySelectorAll('[role="menuitem"]'));
      function panelById(id) { return document.getElementById('ov-panel-' + id.replace('ov-', '')); }
      function panelFor(t) { return document.getElementById(t.getAttribute('aria-controls')); }
      var overflowIds = menuItems.map(function (m) { return m.getAttribute('data-target'); });

      function selectId(id, focusTab) {
        tabs.concat([]).forEach(function () {});
        // hide every panel, then show the target's
        root.querySelectorAll('[role="tabpanel"]').forEach(function (p) { p.hidden = p.id !== 'ov-panel-' + id.replace('ov-', ''); });
        tabs.forEach(function (t) {
          var on = t.id === id;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
        });
        var inOverflow = overflowIds.indexOf(id) !== -1;
        if (inOverflow) {
          more.setAttribute('aria-selected', 'true');
          more.classList.add('text-blue-600', 'dark:text-blue-400');
          if (tabs[0]) tabs[0].tabIndex = 0; // keep the strip reachable by Tab
        } else {
          more.removeAttribute('aria-selected');
          more.classList.remove('text-blue-600', 'dark:text-blue-400');
        }
        var owner = document.getElementById(id);
        if (focusTab && owner) owner.focus();
      }

      function closeMenu() { menu.classList.add('hidden'); more.setAttribute('aria-expanded', 'false'); }
      function openMenu() { menu.classList.remove('hidden'); more.setAttribute('aria-expanded', 'true'); }

      tabs.forEach(function (t) {
        t.addEventListener('click', function () { selectId(t.id, false); });
        t.addEventListener('keydown', function (e) {
          var i = tabs.indexOf(t);
          var n = -1;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          else return;
          e.preventDefault();
          selectId(tabs[n].id, true);
        });
      });

      more.addEventListener('click', function () {
        if (menu.classList.contains('hidden')) openMenu(); else closeMenu();
      });
      more.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

      menuItems.forEach(function (m) {
        m.addEventListener('click', function () {
          selectId(m.getAttribute('data-target'), false);
          closeMenu();
          more.focus();
        });
      });

      document.addEventListener('mousedown', function (e) {
        if (!wrap.contains(e.target)) closeMenu();
      });
    });
  })();
</script>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function TabsWithDropdownOverflow({ items, maxVisible = 3, defaultTabId, className = '', ariaLabel = 'Tabs' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const tabRefs = useRef({});
  const moreRef = useRef(null);
  const wrapRef = useRef(null);

  const visible = items.slice(0, maxVisible);
  const overflow = items.slice(maxVisible);
  const activeInOverflow = overflow.some((item) => item.id === activeId);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  function onKeyDown(event) {
    const index = visible.findIndex((item) => item.id === activeId);
    const from = index === -1 ? 0 : index;
    let next = -1;
    if (event.key === 'ArrowRight') next = (from + 1) % visible.length;
    else if (event.key === 'ArrowLeft') next = (from - 1 + visible.length) % visible.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = visible.length - 1;
    else return;

    event.preventDefault();
    const item = visible[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  }

  function pickFromMenu(id) {
    setActiveId(id);
    setMenuOpen(false);
    moreRef.current?.focus();
  }

  // Keep the first visible tab tabbable when the active tab is hidden in the menu.
  const rovingId = activeInOverflow ? visible[0]?.id : activeId;

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex items-stretch gap-6 border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {visible.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={item.id === rovingId ? 0 : -1}
              ref={(node) => { tabRefs.current[item.id] = node; }}
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}

        {overflow.length > 0 ? (
          <div ref={wrapRef} className="relative flex items-stretch">
            <button
              type="button"
              ref={moreRef}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false); }}
              className={\`relative inline-flex items-center gap-1 whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                activeInOverflow
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              More
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
                <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {menuOpen ? (
              <div role="menu" aria-label="More tabs" className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {overflow.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => pickFromMenu(item.id)}
                    className={\`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                      item.id === activeId
                        ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }\`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsWithDropdownOverflowProps {
  items: TabItem[];
  maxVisible?: number;
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

export function TabsWithDropdownOverflow({
  items,
  maxVisible = 3,
  defaultTabId,
  className = '',
  ariaLabel = 'Tabs',
}: TabsWithDropdownOverflowProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const visible = items.slice(0, maxVisible);
  const overflow = items.slice(maxVisible);
  const activeInOverflow = overflow.some((item: TabItem) => item.id === activeId);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (event: MouseEvent): void => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = visible.findIndex((item: TabItem) => item.id === activeId);
    const from = index === -1 ? 0 : index;
    let next = -1;
    if (event.key === 'ArrowRight') next = (from + 1) % visible.length;
    else if (event.key === 'ArrowLeft') next = (from - 1 + visible.length) % visible.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = visible.length - 1;
    else return;

    event.preventDefault();
    const item = visible[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  };

  const pickFromMenu = (id: string): void => {
    setActiveId(id);
    setMenuOpen(false);
    moreRef.current?.focus();
  };

  // Keep the first visible tab tabbable when the active tab is hidden in the menu.
  const rovingId = activeInOverflow ? visible[0]?.id : activeId;

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex items-stretch gap-6 border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {visible.map((item: TabItem) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${item.id}-tab\`}
              aria-controls={\`\${baseId}-\${item.id}-panel\`}
              aria-selected={isActive}
              tabIndex={item.id === rovingId ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => { tabRefs.current[item.id] = node; }}
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={\`relative whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              {item.label}
            </button>
          );
        })}

        {overflow.length > 0 ? (
          <div ref={wrapRef} className="relative flex items-stretch">
            <button
              type="button"
              ref={moreRef}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => { if (event.key === 'Escape') setMenuOpen(false); }}
              className={\`relative inline-flex items-center gap-1 whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                activeInOverflow
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }\`}
            >
              More
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
                <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {menuOpen ? (
              <div role="menu" aria-label="More tabs" className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {overflow.map((item: TabItem) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => pickFromMenu(item.id)}
                    className={\`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
                      item.id === activeId
                        ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }\`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={\`\${baseId}-\${item.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${item.id}-tab\`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    },
  },
];
