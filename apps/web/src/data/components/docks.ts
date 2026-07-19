import type { ComponentEntry } from './types';

/**
 * Docks category.
 *
 * A dock is a small floating bar of icon controls. Two things recur across all
 * five entries and are worth stating once here rather than five times below:
 *
 * 1. **Every control is icon-only, so every control carries a name.** Either an
 *    `aria-label` or a visually-hidden `<span>`. A tooltip is not an accessible
 *    name - it is a hover affordance a screen reader never sees.
 * 2. **A dock floats over arbitrary content, so it paints its own surface.**
 *    That means dark mode has to re-tune the surface, the border, the icon
 *    colour AND the focus ring: a `ring-offset` that assumes a white page turns
 *    into a dark halo the moment the dock sits on a photo. Each entry offsets
 *    its ring against the dock's own surface colour, not the page's.
 *
 * The shipped snippets use `fixed` because that is what a real dock wants. The
 * live previews bound it to a card instead - see the matching `*-preview.tsx`.
 */
export const docksComponents: ComponentEntry[] = [
  {
    slug: 'dock-macos-magnify',
    category: 'docks',
    tags: ['dock', 'magnify', 'hover', 'macos', 'animated'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-19',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.1.0',
    featured: true,
    stats: { views: 2140, copies: 486, downloads: 152 },
    variants: [{ id: 'horizontal', labelKey: 'horizontal' }],
    props: [
      { name: 'items', type: 'readonly DockItem[]', default: 'DEFAULT_ITEMS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Dock'", descriptionKey: 'ariaLabel' },
      { name: 'range', type: 'number', default: '110', descriptionKey: 'magnifyRange' },
      { name: 'maxScale', type: 'number', default: '1.6', descriptionKey: 'maxScale' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<nav class="dock" aria-label="Dock">
  <ul class="dock__list">
    <li class="dock__item">
      <a class="dock__link" href="/files" aria-current="page">
        <svg class="dock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        </svg>
        <!-- The label is the accessible name. It is clipped, not hidden: -->
        <!-- display:none or [hidden] would take it out of the a11y tree too. -->
        <span class="dock__label">Files</span>
      </a>
    </li>
    <li class="dock__item">
      <a class="dock__link" href="/mail">
        <svg class="dock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
        <span class="dock__label">Mail</span>
      </a>
    </li>
    <li class="dock__item">
      <a class="dock__link" href="/calendar">
        <svg class="dock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        <span class="dock__label">Calendar</span>
      </a>
    </li>
    <li class="dock__item">
      <a class="dock__link" href="/photos">
        <svg class="dock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 17 5-5 4 4 3-2 4 4" />
        </svg>
        <span class="dock__label">Photos</span>
      </a>
    </li>
    <li class="dock__item">
      <a class="dock__link" href="/settings">
        <svg class="dock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1" />
        </svg>
        <span class="dock__label">Settings</span>
      </a>
    </li>
  </ul>
</nav>

<script>
  (function () {
    // Distance in px from the pointer at which magnification has faded to
    // nothing, and the scale of the item directly under it. RANGE wider than
    // one item is what makes the NEIGHBOURS lift too - that gradient is the
    // whole effect. Drop RANGE to ~48 and only the hovered item moves, which
    // reads as a hover state, not a dock.
    var RANGE = 110;
    var MAX_SCALE = 1.6;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.dock').forEach(function (dock) {
      var links = Array.prototype.slice.call(dock.querySelectorAll('.dock__link'));

      function reset() {
        links.forEach(function (link) {
          link.style.removeProperty('--dock-scale');
        });
      }

      dock.addEventListener('mousemove', function (event) {
        // Bail before writing anything: the CSS below also forces scale(1)
        // under reduced motion, but leaving stale inline vars behind would
        // mean the dock re-magnifies the moment the media query flips back.
        if (reduce.matches) return;

        links.forEach(function (link) {
          var rect = link.getBoundingClientRect();
          var centre = rect.left + rect.width / 2;
          var distance = Math.abs(event.clientX - centre);
          // Linear falloff: 1 under the pointer, 0 at RANGE and beyond.
          var falloff = Math.max(0, 1 - distance / RANGE);
          link.style.setProperty('--dock-scale', String(1 + (MAX_SCALE - 1) * falloff));
        });
      });

      dock.addEventListener('mouseleave', reset);

      reduce.addEventListener('change', function () {
        if (reduce.matches) reset();
      });
    });
  })();
</script>`,
      css: `/*
 * The dock paints a translucent surface over whatever it floats above, so the
 * surface, the border, the icon colour and the focus ring all need a dark-mode
 * pass. #374151 on the light surface is 10.3:1; #e5e7eb on the dark one is
 * 12.6:1 - both clear 4.5:1 with room to spare, because a dock also has to
 * survive a busy wallpaper showing through the blur.
 */
.dock {
  display: inline-block;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.4);
  /* Progressive enhancement: without backdrop-filter the /75 surface is
     still opaque enough to keep the icons legible. */
  backdrop-filter: blur(12px);
}

.dock__list {
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dock__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  color: #374151;
  text-decoration: none;
  /* Anchored at the bottom so a magnified icon grows upward out of the dock
     rather than pushing through its floor. */
  transform: scale(var(--dock-scale, 1));
  transform-origin: bottom center;
  transition: transform 120ms ease-out, background-color 120ms ease-out;
}

.dock__link:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.dock__link[aria-current='page'] {
  color: #1d4ed8;
}

/* The dot marks the running/current item. It is decoration - aria-current is
   what actually announces it. */
.dock__link[aria-current='page']::after {
  content: '';
  position: absolute;
  bottom: 0.125rem;
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 9999px;
  background-color: currentColor;
}

.dock__item {
  position: relative;
  display: flex;
}

.dock__icon {
  width: 1.5rem;
  height: 1.5rem;
}

.dock__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Clipped, not hidden - this span IS the link's accessible name. */
.dock__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/*
 * Reduced motion lands on the resting state - every icon at its true size -
 * rather than freezing mid-magnification. transform:none beats the inline
 * --dock-scale the script may have written, so this holds even if the
 * preference flips while the pointer is inside the dock.
 */
@media (prefers-reduced-motion: reduce) {
  .dock__link {
    transform: none;
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .dock {
    border-color: rgba(255, 255, 255, 0.1);
    background-color: rgba(17, 24, 39, 0.75);
  }

  .dock__link {
    color: #e5e7eb;
  }

  .dock__link:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .dock__link[aria-current='page'] {
    color: #93c5fd;
  }

  .dock__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<nav
  class="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/75"
  aria-label="Dock"
  data-dock
>
  <ul class="flex items-end gap-1">
    <li class="relative flex">
      <a
        href="/files"
        aria-current="page"
        data-dock-item
        class="flex h-11 w-11 origin-bottom scale-[var(--dock-scale,1)] items-center justify-center rounded-xl text-blue-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:scale-100 motion-reduce:transition-none dark:text-blue-300 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        </svg>
        <span class="sr-only">Files</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/mail"
        data-dock-item
        class="flex h-11 w-11 origin-bottom scale-[var(--dock-scale,1)] items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:scale-100 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
        <span class="sr-only">Mail</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/calendar"
        data-dock-item
        class="flex h-11 w-11 origin-bottom scale-[var(--dock-scale,1)] items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:scale-100 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        <span class="sr-only">Calendar</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/photos"
        data-dock-item
        class="flex h-11 w-11 origin-bottom scale-[var(--dock-scale,1)] items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:scale-100 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 17 5-5 4 4 3-2 4 4" />
        </svg>
        <span class="sr-only">Photos</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/settings"
        data-dock-item
        class="flex h-11 w-11 origin-bottom scale-[var(--dock-scale,1)] items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:scale-100 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1" />
        </svg>
        <span class="sr-only">Settings</span>
      </a>
    </li>
  </ul>
</nav>

<script>
  // Same falloff as the CSS tab. The utilities read --dock-scale; this writes
  // it. motion-reduce:scale-100 is the CSS half of the reduced-motion story,
  // and the matchMedia guard below is the other half - an inline custom
  // property would otherwise keep feeding the utility a value.
  (function () {
    var RANGE = 110;
    var MAX_SCALE = 1.6;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('[data-dock]').forEach(function (dock) {
      var items = Array.prototype.slice.call(dock.querySelectorAll('[data-dock-item]'));

      function reset() {
        items.forEach(function (item) {
          item.style.removeProperty('--dock-scale');
        });
      }

      dock.addEventListener('mousemove', function (event) {
        if (reduce.matches) return;
        items.forEach(function (item) {
          var rect = item.getBoundingClientRect();
          var distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
          var falloff = Math.max(0, 1 - distance / RANGE);
          item.style.setProperty('--dock-scale', String(1 + (MAX_SCALE - 1) * falloff));
        });
      });

      dock.addEventListener('mouseleave', reset);
      reduce.addEventListener('change', function () {
        if (reduce.matches) reset();
      });
    });
  })();
</script>`,
      react: `'use client';

import { useEffect, useRef, useState } from 'react';

const RANGE = 110;
const MAX_SCALE = 1.6;

const ITEMS = [
  { id: 'files', href: '/files', label: 'Files', current: true, path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'mail', href: '/mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'calendar', href: '/calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
  { id: 'photos', href: '/photos', label: 'Photos', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

// Inline transform beats any motion-reduce: utility, so the preference has to
// be read in JS and the scaling skipped outright - not styled away.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function DockMacosMagnify({ onSelect }) {
  const [scales, setScales] = useState(() => ITEMS.map(() => 1));
  const listRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  function handleMove(event) {
    if (reduced || !listRef.current) return;
    const links = Array.from(listRef.current.querySelectorAll('a'));
    setScales(
      links.map((link) => {
        const rect = link.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
        const falloff = Math.max(0, 1 - distance / RANGE);
        return 1 + (MAX_SCALE - 1) * falloff;
      })
    );
  }

  const reset = () => setScales(ITEMS.map(() => 1));

  return (
    <nav
      aria-label="Dock"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/75"
    >
      <ul ref={listRef} className="flex items-end gap-1">
        {ITEMS.map((item, index) => (
          <li key={item.id} className="relative flex">
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              style={{ transform: 'scale(' + scales[index] + ')' }}
              className="flex h-11 w-11 origin-bottom items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              {/* The accessible name. Clipped, never [hidden]. */}
              <span className="sr-only">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      nextjs: `'use client';

// 'use client' is mandatory here: the magnification is a pointer-position
// calculation. There is no server-rendered version of this effect - the dock
// renders unmagnified on the server and comes alive on hydration.
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

const RANGE = 110;
const MAX_SCALE = 1.6;

interface DockItem {
  id: string;
  href: string;
  label: string;
  path: string;
  current?: boolean;
}

const ITEMS: readonly DockItem[] = [
  { id: 'files', href: '/files', label: 'Files', current: true, path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'mail', href: '/mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'calendar', href: '/calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
  { id: 'photos', href: '/photos', label: 'Photos', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

interface DockMacosMagnifyProps {
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function DockMacosMagnify({ onSelect, ariaLabel = 'Dock' }: DockMacosMagnifyProps) {
  const [scales, setScales] = useState<number[]>(() => ITEMS.map(() => 1));
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  function handleMove(event: MouseEvent<HTMLElement>): void {
    if (reduced || !listRef.current) return;
    const links = Array.from(listRef.current.querySelectorAll('a'));
    const clientX = event.clientX;
    setScales(
      links.map((link) => {
        const rect = link.getBoundingClientRect();
        const distance = Math.abs(clientX - (rect.left + rect.width / 2));
        const falloff = Math.max(0, 1 - distance / RANGE);
        return 1 + (MAX_SCALE - 1) * falloff;
      })
    );
  }

  const reset = (): void => setScales(ITEMS.map(() => 1));

  return (
    <nav
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/75"
    >
      <ul ref={listRef} className="flex items-end gap-1">
        {ITEMS.map((item, index) => (
          <li key={item.id} className="relative flex">
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              style={{ transform: 'scale(' + (scales[index] ?? 1) + ')' }}
              className="flex h-11 w-11 origin-bottom items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className="sr-only">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

export interface DockItem {
  /** Stable id handed back to onSelect. */
  id: string;
  href: string;
  /** Visible to screen readers only - this is the icon's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
  current?: boolean;
}

export interface DockMacosMagnifyProps {
  items?: readonly DockItem[];
  /** Fired with the id of the item the user activated. */
  onSelect?: (id: string) => void;
  /** Accessible name of the dock's nav landmark. */
  ariaLabel?: string;
  /** px from the pointer at which magnification fades to nothing. */
  range?: number;
  /** Scale of the item directly under the pointer. */
  maxScale?: number;
  className?: string;
}

const DEFAULT_ITEMS: readonly DockItem[] = [
  { id: 'files', href: '/files', label: 'Files', current: true, path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'mail', href: '/mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'calendar', href: '/calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
  { id: 'photos', href: '/photos', label: 'Photos', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = (): void => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function DockMacosMagnify({
  items = DEFAULT_ITEMS,
  onSelect,
  ariaLabel = 'Dock',
  range = 110,
  maxScale = 1.6,
  className = '',
}: DockMacosMagnifyProps): JSX.Element {
  const [scales, setScales] = useState<number[]>(() => items.map(() => 1));
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  function handleMove(event: MouseEvent<HTMLElement>): void {
    if (reduced || !listRef.current) return;
    const links = Array.from(listRef.current.querySelectorAll('a'));
    const clientX = event.clientX;
    setScales(
      links.map((link) => {
        const rect = link.getBoundingClientRect();
        const distance = Math.abs(clientX - (rect.left + rect.width / 2));
        const falloff = Math.max(0, 1 - distance / range);
        return 1 + (maxScale - 1) * falloff;
      })
    );
  }

  const reset = (): void => setScales(items.map(() => 1));

  return (
    <nav
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={
        'fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/75 ' +
        className
      }
    >
      <ul ref={listRef} className="flex items-end gap-1">
        {items.map((item, index) => (
          <li key={item.id} className="relative flex">
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              style={{ transform: 'scale(' + (scales[index] ?? 1) + ')' }}
              className="flex h-11 w-11 origin-bottom items-center justify-center rounded-xl text-gray-700 transition-transform duration-100 ease-out hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className="sr-only">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-bottom-mobile-nav',
    category: 'docks',
    tags: ['dock', 'mobile', 'tabbar', 'navigation', 'badge'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-22',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 1680, copies: 402, downloads: 118 },
    variants: [
      { id: 'horizontal', labelKey: 'horizontal' },
      { id: 'labeled', labelKey: 'labeled' },
    ],
    props: [
      { name: 'tabs', type: 'readonly TabItem[]', default: 'DEFAULT_TABS', descriptionKey: 'items' },
      { name: 'currentPath', type: 'string', descriptionKey: 'pathname', example: "'/search'" },
      { name: 'count', type: 'number', descriptionKey: 'count' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Primary'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<nav class="tabbar" aria-label="Primary">
  <ul class="tabbar__list">
    <li class="tabbar__item">
      <a class="tabbar__link" href="/" aria-current="page">
        <svg class="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m3 10.5 9-7.5 9 7.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
        </svg>
        <span class="tabbar__label">Home</span>
      </a>
    </li>
    <li class="tabbar__item">
      <a class="tabbar__link" href="/search">
        <svg class="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </svg>
        <span class="tabbar__label">Search</span>
      </a>
    </li>
    <li class="tabbar__item">
      <a class="tabbar__link" href="/create">
        <svg class="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M12 9v6M9 12h6" />
        </svg>
        <span class="tabbar__label">Create</span>
      </a>
    </li>
    <li class="tabbar__item">
      <a class="tabbar__link" href="/inbox">
        <span class="tabbar__iconwrap">
          <svg class="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M4 13h4l1.5 3h5L16 13h4" />
            <path d="M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
          </svg>
          <!-- The badge is decoration; the count also rides along in the -->
          <!-- link's own text so it is announced, not just seen. -->
          <span class="tabbar__badge" aria-hidden="true">3</span>
        </span>
        <span class="tabbar__label">Inbox</span>
        <span class="tabbar__sr">3 unread</span>
      </a>
    </li>
    <li class="tabbar__item">
      <a class="tabbar__link" href="/profile">
        <svg class="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
        <span class="tabbar__label">Profile</span>
      </a>
    </li>
  </ul>
</nav>`,
      css: `/*
 * A bottom tab bar is opaque on purpose: it sits under a thumb, over scrolling
 * content, on a phone in sunlight. #4b5563 on #fff is 7.6:1 and the blue
 * active state #1d4ed8 is 6.3:1; the dark pairs are #9ca3af (5.9:1) and
 * #93c5fd (8.1:1) on #111827. Every one clears 4.5:1.
 */
.tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
  /* Keeps the labels clear of the home indicator on notched phones. */
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.tabbar__list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tabbar__item {
  flex: 1 1 0;
}

.tabbar__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1875rem;
  /* 3.25rem clears the 44px minimum touch target with the label inside it. */
  min-height: 3.25rem;
  padding: 0.375rem 0.25rem;
  color: #4b5563;
  text-decoration: none;
}

.tabbar__iconwrap {
  position: relative;
  display: inline-flex;
}

.tabbar__icon {
  width: 1.375rem;
  height: 1.375rem;
}

.tabbar__label {
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1;
}

.tabbar__badge {
  position: absolute;
  top: -0.25rem;
  right: -0.375rem;
  min-width: 1rem;
  padding: 0 0.25rem;
  border-radius: 9999px;
  background-color: #dc2626;
  color: #fff;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1rem;
  text-align: center;
}

/*
 * The active tab is marked with aria-current in the markup and styled off that
 * same attribute - the colour and the announcement cannot drift apart.
 */
.tabbar__link[aria-current='page'] {
  color: #1d4ed8;
}

.tabbar__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
  border-radius: 0.5rem;
}

.tabbar__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-color-scheme: dark) {
  .tabbar {
    background-color: #111827;
    border-top-color: #1f2937;
  }

  .tabbar__link {
    color: #9ca3af;
  }

  .tabbar__link[aria-current='page'] {
    color: #93c5fd;
  }

  .tabbar__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<nav
  class="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom,0)] dark:border-gray-800 dark:bg-gray-900"
  aria-label="Primary"
>
  <ul class="flex">
    <li class="flex-1">
      <a
        href="/"
        aria-current="page"
        class="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 aria-[current=page]:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:aria-[current=page]:text-blue-300 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m3 10.5 9-7.5 9 7.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
        </svg>
        <span class="text-[0.6875rem] font-medium leading-none">Home</span>
      </a>
    </li>
    <li class="flex-1">
      <a
        href="/search"
        class="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </svg>
        <span class="text-[0.6875rem] font-medium leading-none">Search</span>
      </a>
    </li>
    <li class="flex-1">
      <a
        href="/create"
        class="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M12 9v6M9 12h6" />
        </svg>
        <span class="text-[0.6875rem] font-medium leading-none">Create</span>
      </a>
    </li>
    <li class="flex-1">
      <a
        href="/inbox"
        class="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:focus-visible:ring-blue-400"
      >
        <span class="relative inline-flex">
          <svg class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M4 13h4l1.5 3h5L16 13h4" />
            <path d="M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
          </svg>
          <span class="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white" aria-hidden="true">3</span>
        </span>
        <span class="text-[0.6875rem] font-medium leading-none">Inbox</span>
        <span class="sr-only">3 unread</span>
      </a>
    </li>
    <li class="flex-1">
      <a
        href="/profile"
        class="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
        <span class="text-[0.6875rem] font-medium leading-none">Profile</span>
      </a>
    </li>
  </ul>
</nav>`,
      react: `const TABS = [
  { id: 'home', href: '/', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'create', href: '/create', label: 'Create', path: 'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4ZM12 9v6M9 12h6' },
  { id: 'inbox', href: '/inbox', label: 'Inbox', count: 3, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'profile', href: '/profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockBottomMobileNav({ onSelect }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom,0)] dark:border-gray-800 dark:bg-gray-900"
    >
      <ul className="flex">
        {TABS.map((tab) => (
          <li key={tab.id} className="flex-1">
            <a
              href={tab.href}
              aria-current={tab.current ? 'page' : undefined}
              onClick={() => onSelect?.(tab.id)}
              className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 aria-[current=page]:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:aria-[current=page]:text-blue-300 dark:focus-visible:ring-blue-400"
            >
              <span className="relative inline-flex">
                <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={tab.path} />
                </svg>
                {tab.count ? (
                  <span aria-hidden="true" className="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white">
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                ) : null}
              </span>
              <span className="text-[0.6875rem] font-medium leading-none">{tab.label}</span>
              {/* The badge is aria-hidden, so the count is announced here instead. */}
              {tab.count ? <span className="sr-only">{tab.count} unread</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      nextjs: `// No 'use client': a tab bar holds no state of its own. The active tab comes
// from the router, so this renders as a Server Component. Swap usePathname in
// (and add 'use client') only if you cannot pass currentPath down.
import Link from 'next/link';

interface Tab {
  id: string;
  href: string;
  label: string;
  path: string;
  count?: number;
}

const TABS: readonly Tab[] = [
  { id: 'home', href: '/', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'create', href: '/create', label: 'Create', path: 'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4ZM12 9v6M9 12h6' },
  { id: 'inbox', href: '/inbox', label: 'Inbox', count: 3, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'profile', href: '/profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

interface DockBottomMobileNavProps {
  /** Pass the current pathname from the page so this stays a Server Component. */
  currentPath?: string;
  ariaLabel?: string;
}

export function DockBottomMobileNav({ currentPath = '/', ariaLabel = 'Primary' }: DockBottomMobileNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom,0)] dark:border-gray-800 dark:bg-gray-900"
    >
      <ul className="flex">
        {TABS.map((tab) => (
          <li key={tab.id} className="flex-1">
            <Link
              href={tab.href}
              aria-current={tab.href === currentPath ? 'page' : undefined}
              className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 aria-[current=page]:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:aria-[current=page]:text-blue-300 dark:focus-visible:ring-blue-400"
            >
              <span className="relative inline-flex">
                <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={tab.path} />
                </svg>
                {tab.count ? (
                  <span aria-hidden="true" className="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white">
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                ) : null}
              </span>
              <span className="text-[0.6875rem] font-medium leading-none">{tab.label}</span>
              {tab.count ? <span className="sr-only">{tab.count} unread</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `export interface TabItem {
  id: string;
  href: string;
  /** Visible label - also the link's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
  /** Unread count. Above 99 the badge collapses to "99+". */
  count?: number;
}

export interface DockBottomMobileNavProps {
  tabs?: readonly TabItem[];
  /** Marks the matching tab with aria-current="page". */
  currentPath?: string;
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_TABS: readonly TabItem[] = [
  { id: 'home', href: '/', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'create', href: '/create', label: 'Create', path: 'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4ZM12 9v6M9 12h6' },
  { id: 'inbox', href: '/inbox', label: 'Inbox', count: 3, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'profile', href: '/profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockBottomMobileNav({
  tabs = DEFAULT_TABS,
  currentPath = '/',
  onSelect,
  ariaLabel = 'Primary',
  className = '',
}: DockBottomMobileNavProps): JSX.Element {
  return (
    <nav
      aria-label={ariaLabel}
      className={
        'fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom,0)] dark:border-gray-800 dark:bg-gray-900 ' +
        className
      }
    >
      <ul className="flex">
        {tabs.map((tab) => (
          <li key={tab.id} className="flex-1">
            <a
              href={tab.href}
              aria-current={tab.href === currentPath ? 'page' : undefined}
              onClick={() => onSelect?.(tab.id)}
              className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-gray-600 aria-[current=page]:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:aria-[current=page]:text-blue-300 dark:focus-visible:ring-blue-400"
            >
              <span className="relative inline-flex">
                <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={tab.path} />
                </svg>
                {tab.count ? (
                  <span aria-hidden="true" className="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white">
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                ) : null}
              </span>
              <span className="text-[0.6875rem] font-medium leading-none">{tab.label}</span>
              {tab.count ? <span className="sr-only">{tab.count} unread</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-floating-toolbar',
    category: 'docks',
    tags: ['dock', 'toolbar', 'contextual', 'actions', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-14',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1120, copies: 268, downloads: 74 },
    variants: [
      { id: 'floating', labelKey: 'floating' },
      { id: 'horizontal', labelKey: 'horizontal' },
      { id: 'destructive', labelKey: 'destructive' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'actions', type: 'readonly ToolbarAction[]', default: 'DEFAULT_ACTIONS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'ariaLabel', type: 'string', default: "'Formatting'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A toolbar is commands, not navigation - so it is role="toolbar" with buttons,
  NOT a <nav> with links. The difference is not pedantry: role="toolbar" makes
  the whole strip one Tab stop and hands the arrow keys to the buttons inside,
  which is exactly what the roving tabindex below implements.
-->
<div class="toolbar" role="toolbar" aria-label="Formatting" aria-orientation="horizontal">
  <button class="toolbar__btn" type="button" aria-label="Bold" aria-pressed="true" tabindex="0">
    <svg class="toolbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7Zm0 7h7a3.5 3.5 0 0 1 0 7H7Z" />
    </svg>
  </button>
  <button class="toolbar__btn" type="button" aria-label="Italic" aria-pressed="false" tabindex="-1">
    <svg class="toolbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
      <path d="M15 5h-5M14 19H9M14 5l-4 14" />
    </svg>
  </button>
  <button class="toolbar__btn" type="button" aria-label="Underline" aria-pressed="false" tabindex="-1">
    <svg class="toolbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
      <path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" />
    </svg>
  </button>

  <!-- A real separator, not a styled div: it is announced as a group break. -->
  <div class="toolbar__sep" role="separator" aria-orientation="vertical"></div>

  <button class="toolbar__btn" type="button" aria-label="Add link" tabindex="-1">
    <svg class="toolbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  </button>
  <button class="toolbar__btn" type="button" aria-label="Add comment" tabindex="-1">
    <svg class="toolbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z" />
    </svg>
  </button>

  <div class="toolbar__sep" role="separator" aria-orientation="vertical"></div>

  <button class="toolbar__btn toolbar__btn--danger" type="button" aria-label="Delete" tabindex="-1">
    <svg class="toolbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  </button>
</div>

<script>
  // Roving tabindex: the toolbar is ONE Tab stop, and the arrow keys move
  // between the buttons inside it. Without this every icon is its own stop and
  // a seven-button toolbar costs a keyboard user seven presses to walk past.
  document.querySelectorAll('.toolbar').forEach(function (toolbar) {
    function buttons() {
      return Array.prototype.slice.call(toolbar.querySelectorAll('.toolbar__btn:not([disabled])'));
    }

    function focusAt(index) {
      var items = buttons();
      var next = items[(index + items.length) % items.length];
      items.forEach(function (item) {
        item.tabIndex = item === next ? 0 : -1;
      });
      next.focus();
    }

    toolbar.addEventListener('keydown', function (event) {
      var items = buttons();
      var current = items.indexOf(document.activeElement);
      if (current === -1) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusAt(current + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusAt(current - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        focusAt(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        focusAt(items.length - 1);
      }
    });

    toolbar.addEventListener('click', function (event) {
      var button = event.target.closest('.toolbar__btn');
      if (!button || !button.hasAttribute('aria-pressed')) return;
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    });
  });
</script>`,
      css: `/*
 * The toolbar floats over a document, so it carries its own opaque-ish surface
 * and a shadow to lift it off the page. #374151 on the light surface is 10.3:1
 * and #e5e7eb on the dark one is 12.6:1. The danger button's red is only used
 * for the icon, never as text on the surface: #b91c1c is 5.9:1 on white and
 * #fca5a5 is 7.4:1 on #111827.
 */
.toolbar {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.3125rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.875rem;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
}

.toolbar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 2.5rem = 40px, the minimum touch target size. */
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #374151;
  cursor: pointer;
}

.toolbar__btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

/* The pressed state is aria-pressed, and the fill is styled off it - one
   source of truth for "this formatting is on". */
.toolbar__btn[aria-pressed='true'] {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.toolbar__btn--danger {
  color: #b91c1c;
}

.toolbar__btn--danger:hover {
  background-color: #fee2e2;
}

.toolbar__btn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Inset so the ring stays inside the toolbar's own rounded surface instead of
   bleeding onto whatever the toolbar is floating over. */
.toolbar__btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -1px;
}

.toolbar__icon {
  width: 1.125rem;
  height: 1.125rem;
}

.toolbar__sep {
  width: 1px;
  height: 1.25rem;
  margin: 0 0.25rem;
  background-color: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  .toolbar {
    border-color: rgba(255, 255, 255, 0.1);
    background-color: rgba(17, 24, 39, 0.9);
  }

  .toolbar__btn {
    color: #e5e7eb;
  }

  .toolbar__btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .toolbar__btn[aria-pressed='true'] {
    background-color: #1e3a8a;
    color: #bfdbfe;
  }

  .toolbar__btn--danger {
    color: #fca5a5;
  }

  .toolbar__btn--danger:hover {
    background-color: rgba(153, 27, 27, 0.4);
  }

  .toolbar__btn:focus-visible {
    outline-color: #60a5fa;
  }

  .toolbar__sep {
    background-color: #374151;
  }
}`,
      tailwind: `<div
  class="fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-[0.875rem] border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
  role="toolbar"
  aria-label="Formatting"
  aria-orientation="horizontal"
  data-toolbar
>
  <button
    type="button"
    aria-label="Bold"
    aria-pressed="true"
    tabindex="0"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-pressed:bg-blue-900 dark:aria-pressed:text-blue-200"
  >
    <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7Zm0 7h7a3.5 3.5 0 0 1 0 7H7Z" />
    </svg>
  </button>
  <button
    type="button"
    aria-label="Italic"
    aria-pressed="false"
    tabindex="-1"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-pressed:bg-blue-900 dark:aria-pressed:text-blue-200"
  >
    <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
      <path d="M15 5h-5M14 19H9M14 5l-4 14" />
    </svg>
  </button>
  <button
    type="button"
    aria-label="Underline"
    aria-pressed="false"
    tabindex="-1"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-pressed:bg-blue-900 dark:aria-pressed:text-blue-200"
  >
    <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
      <path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" />
    </svg>
  </button>

  <div class="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" role="separator" aria-orientation="vertical"></div>

  <button
    type="button"
    aria-label="Add link"
    tabindex="-1"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
  >
    <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  </button>
  <button
    type="button"
    aria-label="Add comment"
    tabindex="-1"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
  >
    <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z" />
    </svg>
  </button>

  <div class="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" role="separator" aria-orientation="vertical"></div>

  <button
    type="button"
    aria-label="Delete"
    tabindex="-1"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-red-300 dark:hover:bg-red-900/40 dark:focus-visible:ring-blue-400"
  >
    <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  </button>
</div>

<script>
  // Roving tabindex - the toolbar is one Tab stop, arrows move within it.
  document.querySelectorAll('[data-toolbar]').forEach(function (toolbar) {
    function buttons() {
      return Array.prototype.slice.call(toolbar.querySelectorAll('button:not([disabled])'));
    }

    toolbar.addEventListener('keydown', function (event) {
      var items = buttons();
      var current = items.indexOf(document.activeElement);
      if (current === -1) return;

      var next = null;
      if (event.key === 'ArrowRight') next = (current + 1) % items.length;
      else if (event.key === 'ArrowLeft') next = (current - 1 + items.length) % items.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = items.length - 1;
      if (next === null) return;

      event.preventDefault();
      items.forEach(function (item, index) {
        item.tabIndex = index === next ? 0 : -1;
      });
      items[next].focus();
    });
  });
</script>`,
      react: `'use client';

import { useRef, useState } from 'react';

const ACTIONS = [
  { id: 'bold', label: 'Bold', toggle: true, path: 'M7 5h6a3.5 3.5 0 0 1 0 7H7Zm0 7h7a3.5 3.5 0 0 1 0 7H7Z' },
  { id: 'italic', label: 'Italic', toggle: true, path: 'M15 5h-5M14 19H9M14 5l-4 14' },
  { id: 'underline', label: 'Underline', toggle: true, path: 'M7 4v7a5 5 0 0 0 10 0V4M5 20h14' },
  { id: 'sep-1', separator: true },
  { id: 'link', label: 'Add link', path: 'M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1' },
  { id: 'comment', label: 'Add comment', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'sep-2', separator: true },
  { id: 'delete', label: 'Delete', danger: true, path: 'M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' },
];

const BUTTONS = ACTIONS.filter((action) => !action.separator);

export function DockFloatingToolbar({ onSelect }) {
  const [pressed, setPressed] = useState({ bold: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);

  // Roving tabindex: one Tab stop for the strip, arrows inside it.
  function handleKeyDown(event) {
    const keys = { ArrowRight: 1, ArrowLeft: -1 };
    let next = null;
    if (event.key in keys) next = (activeIndex + keys[event.key] + BUTTONS.length) % BUTTONS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = BUTTONS.length - 1;
    if (next === null) return;

    event.preventDefault();
    setActiveIndex(next);
    rootRef.current?.querySelectorAll('button')[next]?.focus();
  }

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label="Formatting"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className="fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-[0.875rem] border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      {ACTIONS.map((action) => {
        if (action.separator) {
          return <div key={action.id} role="separator" aria-orientation="vertical" className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />;
        }

        const index = BUTTONS.indexOf(action);
        return (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            aria-pressed={action.toggle ? Boolean(pressed[action.id]) : undefined}
            tabIndex={index === activeIndex ? 0 : -1}
            onFocus={() => setActiveIndex(index)}
            onClick={() => {
              if (action.toggle) setPressed((state) => ({ ...state, [action.id]: !state[action.id] }));
              onSelect?.(action.id);
            }}
            className={
              action.danger
                ? 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-red-300 dark:hover:bg-red-900/40 dark:focus-visible:ring-blue-400'
                : 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-pressed:bg-blue-900 dark:aria-pressed:text-blue-200'
            }
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={action.toggle ? 2 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={action.path} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}`,
      nextjs: `'use client';

// 'use client' is required: the toolbar owns pressed state and a roving
// tabindex, both of which are interaction state.
import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface ToolbarAction {
  id: string;
  label?: string;
  path?: string;
  toggle?: boolean;
  danger?: boolean;
  separator?: boolean;
}

const ACTIONS: readonly ToolbarAction[] = [
  { id: 'bold', label: 'Bold', toggle: true, path: 'M7 5h6a3.5 3.5 0 0 1 0 7H7Zm0 7h7a3.5 3.5 0 0 1 0 7H7Z' },
  { id: 'italic', label: 'Italic', toggle: true, path: 'M15 5h-5M14 19H9M14 5l-4 14' },
  { id: 'underline', label: 'Underline', toggle: true, path: 'M7 4v7a5 5 0 0 0 10 0V4M5 20h14' },
  { id: 'sep-1', separator: true },
  { id: 'link', label: 'Add link', path: 'M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1' },
  { id: 'comment', label: 'Add comment', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'sep-2', separator: true },
  { id: 'delete', label: 'Delete', danger: true, path: 'M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' },
];

const BUTTONS = ACTIONS.filter((action) => !action.separator);

interface DockFloatingToolbarProps {
  onSelect?: (id: string) => void;
  ariaLabel?: string;
}

export function DockFloatingToolbar({ onSelect, ariaLabel = 'Formatting' }: DockFloatingToolbarProps) {
  const [pressed, setPressed] = useState<Record<string, boolean>>({ bold: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = (activeIndex + 1) % BUTTONS.length;
    else if (event.key === 'ArrowLeft') next = (activeIndex - 1 + BUTTONS.length) % BUTTONS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = BUTTONS.length - 1;
    if (next === null) return;

    event.preventDefault();
    setActiveIndex(next);
    rootRef.current?.querySelectorAll('button')[next]?.focus();
  }

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className="fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-[0.875rem] border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      {ACTIONS.map((action) => {
        if (action.separator) {
          return <div key={action.id} role="separator" aria-orientation="vertical" className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />;
        }

        const index = BUTTONS.indexOf(action);
        return (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            aria-pressed={action.toggle ? Boolean(pressed[action.id]) : undefined}
            tabIndex={index === activeIndex ? 0 : -1}
            onFocus={() => setActiveIndex(index)}
            onClick={() => {
              if (action.toggle) setPressed((state) => ({ ...state, [action.id]: !state[action.id] }));
              onSelect?.(action.id);
            }}
            className={
              action.danger
                ? 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-red-300 dark:hover:bg-red-900/40 dark:focus-visible:ring-blue-400'
                : 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-pressed:bg-blue-900 dark:aria-pressed:text-blue-200'
            }
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={action.toggle ? 2 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={action.path} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}`,
      typescript: `import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface ToolbarAction {
  id: string;
  /** Accessible name. Required - these buttons are icon-only. */
  label?: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path?: string;
  /** Renders as a two-state toggle exposing aria-pressed. */
  toggle?: boolean;
  /** Destructive tint. */
  danger?: boolean;
  /** Renders a role="separator" rule instead of a button. */
  separator?: boolean;
}

export interface DockFloatingToolbarProps {
  actions?: readonly ToolbarAction[];
  /** Ids of the toggles that start pressed. */
  defaultPressed?: readonly string[];
  onSelect?: (id: string) => void;
  /** Accessible name of the toolbar. */
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ACTIONS: readonly ToolbarAction[] = [
  { id: 'bold', label: 'Bold', toggle: true, path: 'M7 5h6a3.5 3.5 0 0 1 0 7H7Zm0 7h7a3.5 3.5 0 0 1 0 7H7Z' },
  { id: 'italic', label: 'Italic', toggle: true, path: 'M15 5h-5M14 19H9M14 5l-4 14' },
  { id: 'underline', label: 'Underline', toggle: true, path: 'M7 4v7a5 5 0 0 0 10 0V4M5 20h14' },
  { id: 'sep-1', separator: true },
  { id: 'link', label: 'Add link', path: 'M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1' },
  { id: 'comment', label: 'Add comment', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'sep-2', separator: true },
  { id: 'delete', label: 'Delete', danger: true, path: 'M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' },
];

export function DockFloatingToolbar({
  actions = DEFAULT_ACTIONS,
  defaultPressed = ['bold'],
  onSelect,
  ariaLabel = 'Formatting',
  className = '',
}: DockFloatingToolbarProps): JSX.Element {
  const buttons = actions.filter((action) => !action.separator);
  const [pressed, setPressed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(defaultPressed.map((id) => [id, true]))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = (activeIndex + 1) % buttons.length;
    else if (event.key === 'ArrowLeft') next = (activeIndex - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    if (next === null) return;

    event.preventDefault();
    setActiveIndex(next);
    rootRef.current?.querySelectorAll('button')[next]?.focus();
  }

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={
        'fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-[0.875rem] border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90 ' +
        className
      }
    >
      {actions.map((action) => {
        if (action.separator) {
          return <div key={action.id} role="separator" aria-orientation="vertical" className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />;
        }

        const index = buttons.indexOf(action);
        return (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            aria-pressed={action.toggle ? Boolean(pressed[action.id]) : undefined}
            tabIndex={index === activeIndex ? 0 : -1}
            onFocus={() => setActiveIndex(index)}
            onClick={() => {
              if (action.toggle) setPressed((state) => ({ ...state, [action.id]: !state[action.id] }));
              onSelect?.(action.id);
            }}
            className={
              action.danger
                ? 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-red-300 dark:hover:bg-red-900/40 dark:focus-visible:ring-blue-400'
                : 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-pressed:bg-blue-100 aria-pressed:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-pressed:bg-blue-900 dark:aria-pressed:text-blue-200'
            }
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={action.toggle ? 2 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={action.path} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dock-vertical-rail',
    category: 'docks',
    tags: ['dock', 'vertical', 'rail', 'navigation', 'icons'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-30',
    updatedAt: '2026-07-02',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 940, copies: 197, downloads: 58 },
    variants: [
      { id: 'vertical', labelKey: 'vertical' },
      { id: 'floating', labelKey: 'floating' },
    ],
    props: [
      { name: 'items', type: 'readonly RailItem[]', default: 'DEFAULT_ITEMS', descriptionKey: 'items' },
      { name: 'currentPath', type: 'string', descriptionKey: 'pathname', example: "'/inbox'" },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Workspace'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<nav class="rail" aria-label="Workspace">
  <ul class="rail__list">
    <li class="rail__item">
      <a class="rail__link" href="/inbox" aria-current="page">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 13h4l1.5 3h5L16 13h4" />
          <path d="M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
        </svg>
        <span class="rail__label">Inbox</span>
      </a>
    </li>
    <li class="rail__item">
      <a class="rail__link" href="/projects">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        </svg>
        <span class="rail__label">Projects</span>
      </a>
    </li>
    <li class="rail__item">
      <a class="rail__link" href="/insights">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
        <span class="rail__label">Insights</span>
      </a>
    </li>
    <li class="rail__item">
      <a class="rail__link" href="/team">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 19a6 6 0 0 0-1.5-4" />
        </svg>
        <span class="rail__label">Team</span>
      </a>
    </li>
    <li class="rail__item">
      <a class="rail__link" href="/settings">
        <svg class="rail__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1" />
        </svg>
        <span class="rail__label">Settings</span>
      </a>
    </li>
  </ul>
</nav>`,
      css: `/*
 * A floating vertical dock, pinned to the middle of the left edge. It is not a
 * full-height sidebar: it hugs its own content, so a short page and a long one
 * get the same rail in the same place.
 *
 * #374151 on the light surface is 10.3:1, #e5e7eb on the dark one is 12.6:1.
 */
.rail {
  position: fixed;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.rail__list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rail__item {
  position: relative;
  display: flex;
}

.rail__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 120ms ease-out, color 120ms ease-out;
}

.rail__link:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.rail__link[aria-current='page'] {
  background-color: #dbeafe;
  color: #1d4ed8;
}

/*
 * The indicator bar hangs off aria-current, so it physically cannot point at a
 * different item than the one a screen reader calls current.
 */
.rail__link[aria-current='page']::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -0.5rem;
  width: 0.1875rem;
  height: 1.25rem;
  border-radius: 9999px;
  background-color: #1d4ed8;
  transform: translateY(-50%);
}

.rail__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -1px;
}

.rail__icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Clipped, not hidden - this span IS the link's accessible name. */
.rail__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .rail__link {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .rail {
    border-color: rgba(255, 255, 255, 0.1);
    background-color: rgba(17, 24, 39, 0.9);
  }

  .rail__link {
    color: #e5e7eb;
  }

  .rail__link:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .rail__link[aria-current='page'] {
    background-color: #1e3a8a;
    color: #bfdbfe;
  }

  .rail__link[aria-current='page']::before {
    background-color: #93c5fd;
  }

  .rail__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<nav
  class="fixed left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
  aria-label="Workspace"
>
  <ul class="flex flex-col gap-1">
    <li class="relative flex">
      <span class="absolute -left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-700 dark:bg-blue-300" aria-hidden="true"></span>
      <a
        href="/inbox"
        aria-current="page"
        class="flex h-10 w-10 items-center justify-center rounded-[0.625rem] bg-blue-100 text-blue-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 13h4l1.5 3h5L16 13h4" />
          <path d="M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
        </svg>
        <span class="sr-only">Inbox</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/projects"
        class="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        </svg>
        <span class="sr-only">Projects</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/insights"
        class="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
        <span class="sr-only">Insights</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/team"
        class="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 19a6 6 0 0 0-1.5-4" />
        </svg>
        <span class="sr-only">Team</span>
      </a>
    </li>
    <li class="relative flex">
      <a
        href="/settings"
        class="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1" />
        </svg>
        <span class="sr-only">Settings</span>
      </a>
    </li>
  </ul>
</nav>`,
      react: `const ITEMS = [
  { id: 'inbox', href: '/inbox', label: 'Inbox', current: true, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'projects', href: '/projects', label: 'Projects', path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'insights', href: '/insights', label: 'Insights', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'team', href: '/team', label: 'Team', path: 'M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 19a6 6 0 0 0-1.5-4' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export function DockVerticalRail({ onSelect }) {
  return (
    <nav
      aria-label="Workspace"
      className="fixed left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => (
          <li key={item.id} className="relative flex">
            {/* Decoration. aria-current below is what is announced. */}
            {item.current ? (
              <span aria-hidden="true" className="absolute -left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-700 dark:bg-blue-300" />
            ) : null}
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className="sr-only">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      nextjs: `// No 'use client': the rail holds no state - the active item comes from the
// route. Pass currentPath in from the page and this stays a Server Component.
import Link from 'next/link';

interface RailItem {
  id: string;
  href: string;
  label: string;
  path: string;
}

const ITEMS: readonly RailItem[] = [
  { id: 'inbox', href: '/inbox', label: 'Inbox', path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'projects', href: '/projects', label: 'Projects', path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'insights', href: '/insights', label: 'Insights', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'team', href: '/team', label: 'Team', path: 'M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 19a6 6 0 0 0-1.5-4' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

interface DockVerticalRailProps {
  currentPath?: string;
  ariaLabel?: string;
}

export function DockVerticalRail({ currentPath = '/inbox', ariaLabel = 'Workspace' }: DockVerticalRailProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="fixed left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const current = item.href === currentPath;
          return (
            <li key={item.id} className="relative flex">
              {current ? (
                <span aria-hidden="true" className="absolute -left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-700 dark:bg-blue-300" />
              ) : null}
              <Link
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={item.path} />
                </svg>
                <span className="sr-only">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}`,
      typescript: `export interface RailItem {
  id: string;
  href: string;
  /** Screen-reader-only text - this is the icon link's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
}

export interface DockVerticalRailProps {
  items?: readonly RailItem[];
  /** Marks the matching item with aria-current="page". */
  currentPath?: string;
  onSelect?: (id: string) => void;
  /** Accessible name of the rail's nav landmark. */
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: readonly RailItem[] = [
  { id: 'inbox', href: '/inbox', label: 'Inbox', path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'projects', href: '/projects', label: 'Projects', path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'insights', href: '/insights', label: 'Insights', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'team', href: '/team', label: 'Team', path: 'M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M17 19a6 6 0 0 0-1.5-4' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export function DockVerticalRail({
  items = DEFAULT_ITEMS,
  currentPath = '/inbox',
  onSelect,
  ariaLabel = 'Workspace',
  className = '',
}: DockVerticalRailProps): JSX.Element {
  return (
    <nav
      aria-label={ariaLabel}
      className={
        'fixed left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90 ' +
        className
      }
    >
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const current = item.href === currentPath;
          return (
            <li key={item.id} className="relative flex">
              {current ? (
                <span aria-hidden="true" className="absolute -left-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-700 dark:bg-blue-300" />
              ) : null}
              <a
                href={item.href}
                aria-current={current ? 'page' : undefined}
                onClick={() => onSelect?.(item.id)}
                className="flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-gray-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-100 aria-[current=page]:text-blue-700 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-900 dark:aria-[current=page]:text-blue-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={item.path} />
                </svg>
                <span className="sr-only">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-labeled-icons',
    category: 'docks',
    tags: ['dock', 'labels', 'hover', 'reveal', 'icons'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-11',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 780, copies: 163, downloads: 44 },
    variants: [
      { id: 'floating', labelKey: 'floating' },
      { id: 'horizontal', labelKey: 'horizontal' },
      { id: 'labeled', labelKey: 'labeled' },
    ],
    props: [
      { name: 'items', type: 'readonly LabeledDockItem[]', default: 'DEFAULT_ITEMS', descriptionKey: 'items' },
      { name: 'currentPath', type: 'string', descriptionKey: 'pathname', example: "'/library'" },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Dock'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The label under each icon is a real, permanent element - it is only faded and
  nudged, never [hidden] and never display:none. That is deliberate: it is the
  link's accessible name, so it must stay in the accessibility tree whether or
  not a pointer happens to be hovering. A tooltip cannot do this job.
-->
<nav class="labeldock" aria-label="Dock">
  <ul class="labeldock__list">
    <li class="labeldock__item">
      <a class="labeldock__link" href="/home" aria-current="page">
        <svg class="labeldock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m3 10.5 9-7.5 9 7.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
        </svg>
        <span class="labeldock__label">Home</span>
      </a>
    </li>
    <li class="labeldock__item">
      <a class="labeldock__link" href="/library">
        <svg class="labeldock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M5 4h4v16H5zM11 4h3v16h-3zM16.5 4.5l3.5 15" />
        </svg>
        <span class="labeldock__label">Library</span>
      </a>
    </li>
    <li class="labeldock__item">
      <a class="labeldock__link" href="/search">
        <svg class="labeldock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </svg>
        <span class="labeldock__label">Search</span>
      </a>
    </li>
    <li class="labeldock__item">
      <a class="labeldock__link" href="/saved">
        <svg class="labeldock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
        </svg>
        <span class="labeldock__label">Saved</span>
      </a>
    </li>
  </ul>
</nav>`,
      css: `/*
 * The dock reserves the label row with padding-bottom and positions each label
 * absolutely inside it. Revealing a label therefore costs no layout: without
 * the reserved space every item would grow on hover and shove its neighbours
 * sideways - the dock would twitch under the pointer.
 *
 * #374151 on the light surface is 10.3:1; #e5e7eb on the dark one is 12.6:1.
 */
.labeldock {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  padding: 0.5rem 0.5rem 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.labeldock__list {
  display: flex;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.labeldock__link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  color: #374151;
  text-decoration: none;
}

.labeldock__link:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.labeldock__link[aria-current='page'] {
  color: #1d4ed8;
}

.labeldock__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -1px;
}

.labeldock__icon {
  width: 1.5rem;
  height: 1.5rem;
}

.labeldock__label {
  position: absolute;
  top: calc(100% + 0.125rem);
  left: 50%;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  color: #4b5563;
  opacity: 0;
  transform: translate(-50%, 0.25rem);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
  /* The label must never eat the pointer - it overhangs its neighbours. */
  pointer-events: none;
}

/* :focus-visible as well as :hover - a keyboard user gets the same label. */
.labeldock__link:hover .labeldock__label,
.labeldock__link:focus-visible .labeldock__label {
  opacity: 1;
  transform: translate(-50%, 0);
}

/*
 * Reduced motion keeps the reveal - it is information, not decoration - and
 * drops only the slide. Fading straight to the end state, no travel.
 */
@media (prefers-reduced-motion: reduce) {
  .labeldock__label {
    transform: translate(-50%, 0);
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .labeldock {
    border-color: rgba(255, 255, 255, 0.1);
    background-color: rgba(17, 24, 39, 0.9);
  }

  .labeldock__link {
    color: #e5e7eb;
  }

  .labeldock__link:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .labeldock__link[aria-current='page'] {
    color: #93c5fd;
  }

  .labeldock__label {
    color: #d1d5db;
  }

  .labeldock__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<nav
  class="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 px-2 pb-6 pt-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
  aria-label="Dock"
>
  <ul class="flex gap-1">
    <li>
      <a
        href="/home"
        aria-current="page"
        class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-blue-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m3 10.5 9-7.5 9 7.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
        </svg>
        <span class="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
          Home
        </span>
      </a>
    </li>
    <li>
      <a
        href="/library"
        class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M5 4h4v16H5zM11 4h3v16h-3zM16.5 4.5l3.5 15" />
        </svg>
        <span class="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
          Library
        </span>
      </a>
    </li>
    <li>
      <a
        href="/search"
        class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </svg>
        <span class="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
          Search
        </span>
      </a>
    </li>
    <li>
      <a
        href="/saved"
        class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
        </svg>
        <span class="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
          Saved
        </span>
      </a>
    </li>
  </ul>
</nav>`,
      react: `const ITEMS = [
  { id: 'home', href: '/home', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'library', href: '/library', label: 'Library', path: 'M5 4h4v16H5zM11 4h3v16h-3zM16.5 4.5l3.5 15' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'saved', href: '/saved', label: 'Saved', path: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z' },
];

export function DockLabeledIcons({ onSelect }) {
  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 px-2 pb-6 pt-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      <ul className="flex gap-1">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              {/* Always in the DOM - this is the accessible name, merely faded. */}
              <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      nextjs: `// No 'use client': the reveal is pure CSS (group-hover / group-focus-visible),
// so there is no state and nothing to hydrate. This is a Server Component.
import Link from 'next/link';

interface DockItem {
  id: string;
  href: string;
  label: string;
  path: string;
}

const ITEMS: readonly DockItem[] = [
  { id: 'home', href: '/home', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'library', href: '/library', label: 'Library', path: 'M5 4h4v16H5zM11 4h3v16h-3zM16.5 4.5l3.5 15' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'saved', href: '/saved', label: 'Saved', path: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z' },
];

interface DockLabeledIconsProps {
  currentPath?: string;
  ariaLabel?: string;
}

export function DockLabeledIcons({ currentPath = '/home', ariaLabel = 'Dock' }: DockLabeledIconsProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 px-2 pb-6 pt-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      <ul className="flex gap-1">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              aria-current={item.href === currentPath ? 'page' : undefined}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `export interface LabeledDockItem {
  id: string;
  href: string;
  /**
   * The visible-on-hover label. It is permanently in the DOM and is the link's
   * accessible name - do not swap it for a tooltip.
   */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
}

export interface DockLabeledIconsProps {
  items?: readonly LabeledDockItem[];
  /** Marks the matching item with aria-current="page". */
  currentPath?: string;
  onSelect?: (id: string) => void;
  /** Accessible name of the dock's nav landmark. */
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: readonly LabeledDockItem[] = [
  { id: 'home', href: '/home', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'library', href: '/library', label: 'Library', path: 'M5 4h4v16H5zM11 4h3v16h-3zM16.5 4.5l3.5 15' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'saved', href: '/saved', label: 'Saved', path: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z' },
];

export function DockLabeledIcons({
  items = DEFAULT_ITEMS,
  currentPath = '/home',
  onSelect,
  ariaLabel = 'Dock',
  className = '',
}: DockLabeledIconsProps): JSX.Element {
  return (
    <nav
      aria-label={ariaLabel}
      className={
        'fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 px-2 pb-6 pt-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90 ' +
        className
      }
    >
      <ul className="flex gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.href === currentPath ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.125rem)] -translate-x-1/2 translate-y-1 whitespace-nowrap text-[0.6875rem] font-semibold leading-none text-gray-600 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-gray-300">
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-glass-blur',
    category: 'docks',
    tags: ['dock', 'glass', 'glassmorphism', 'blur', 'navigation'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'horizontal', labelKey: 'horizontal' }],
    props: [
      { name: 'items', type: 'readonly GlassDockItem[]', default: 'DEFAULT_ITEMS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Dock'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A frosted-glass dock. The surface leans on backdrop-blur, but the /30 white
  fill stays legible if backdrop-filter is unsupported. The hover lift is gated
  to (pointer: fine) so a touch device never inherits a stuck hover state.
-->
<nav
  class="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-white/40 bg-white/30 p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
  aria-label="Dock"
>
  <ul class="flex items-center gap-1">
    <li>
      <a href="/home" aria-current="page" class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 aria-[current=page]:text-blue-700 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" /></svg>
        <span class="sr-only">Home</span>
      </a>
    </li>
    <li>
      <a href="/search" class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6" /></svg>
        <span class="sr-only">Search</span>
      </a>
    </li>
    <li>
      <a href="/explore" class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5Z" /></svg>
        <span class="sr-only">Explore</span>
      </a>
    </li>
    <li>
      <a href="/messages" class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z" /></svg>
        <span class="sr-only">Messages</span>
      </a>
    </li>
    <li>
      <a href="/profile" class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0" /></svg>
        <span class="sr-only">Profile</span>
      </a>
    </li>
  </ul>
</nav>`,
      react: `const ITEMS = [
  { id: 'home', href: '/home', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'explore', href: '/explore', label: 'Explore', path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5Z' },
  { id: 'messages', href: '/messages', label: 'Messages', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'profile', href: '/profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockGlassBlur({ onSelect }) {
  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-white/40 bg-white/30 p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
    >
      <ul className="flex items-center gap-1">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 aria-[current=page]:text-blue-700 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className="sr-only">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `export interface GlassDockItem {
  id: string;
  href: string;
  /** Visible to screen readers only - the icon's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
  current?: boolean;
}

export interface DockGlassBlurProps {
  items?: readonly GlassDockItem[];
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: readonly GlassDockItem[] = [
  { id: 'home', href: '/home', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'search', href: '/search', label: 'Search', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'explore', href: '/explore', label: 'Explore', path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5Z' },
  { id: 'messages', href: '/messages', label: 'Messages', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'profile', href: '/profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockGlassBlur({
  items = DEFAULT_ITEMS,
  onSelect,
  ariaLabel = 'Dock',
  className = '',
}: DockGlassBlurProps): JSX.Element {
  return (
    <nav
      aria-label={ariaLabel}
      className={
        'fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-white/40 bg-white/30 p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 ' +
        className
      }
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition duration-150 ease-out hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 aria-[current=page]:text-blue-700 motion-reduce:transition-none [@media(pointer:fine)]:hover:-translate-y-1 dark:text-gray-100 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className="sr-only">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-icon-tooltips',
    category: 'docks',
    tags: ['dock', 'tooltip', 'icons', 'hover', 'accessible'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'horizontal', labelKey: 'horizontal' }],
    props: [
      { name: 'items', type: 'readonly TooltipDockItem[]', default: 'DEFAULT_ITEMS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Dock'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The tooltip is aria-hidden decoration - each button's real name lives in
  aria-label, so a screen reader is never handed an unnamed icon. The reveal is
  pure CSS (group-hover / group-focus-visible) and lands instantly under
  reduced motion. The tooltip is pointer-events-none so it can overhang a
  neighbour without swallowing its click.
-->
<nav
  class="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
  aria-label="Dock"
>
  <ul class="flex items-center gap-1">
    <li>
      <button type="button" aria-label="Files" aria-current="page" class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /></svg>
        <span aria-hidden="true" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Files</span>
      </button>
    </li>
    <li>
      <button type="button" aria-label="Mail" class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /></svg>
        <span aria-hidden="true" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Mail</span>
      </button>
    </li>
    <li>
      <button type="button" aria-label="Notes" class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5" /></svg>
        <span aria-hidden="true" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Notes</span>
      </button>
    </li>
    <li>
      <button type="button" aria-label="Settings" class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1" /></svg>
        <span aria-hidden="true" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Settings</span>
      </button>
    </li>
  </ul>
</nav>`,
      react: `const ITEMS = [
  { id: 'files', label: 'Files', current: true, path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'notes', label: 'Notes', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export function DockIconTooltips({ onSelect }) {
  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
    >
      <ul className="flex items-center gap-1">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={item.label}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              {/* aria-hidden: the accessible name is aria-label above, not this. */}
              <span aria-hidden="true" className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `export interface TooltipDockItem {
  id: string;
  /** Both the aria-label and the visible tooltip text. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
  current?: boolean;
}

export interface DockIconTooltipsProps {
  items?: readonly TooltipDockItem[];
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: readonly TooltipDockItem[] = [
  { id: 'files', label: 'Files', current: true, path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'notes', label: 'Notes', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export function DockIconTooltips({
  items = DEFAULT_ITEMS,
  onSelect,
  ariaLabel = 'Dock',
  className = '',
}: DockIconTooltipsProps): JSX.Element {
  return (
    <nav
      aria-label={ariaLabel}
      className={
        'fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85 ' +
        className
      }
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={item.label}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span aria-hidden="true" className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-segmented',
    category: 'docks',
    tags: ['dock', 'segmented', 'control', 'radiogroup', 'toggle'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'horizontal', labelKey: 'horizontal' }],
    props: [
      { name: 'segments', type: 'readonly Segment[]', default: 'DEFAULT_SEGMENTS', descriptionKey: 'items' },
      { name: 'defaultValue', type: 'string', descriptionKey: 'value' },
      { name: 'onChange', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'View'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A segmented control is single-select, so it is role="radiogroup" with
  role="radio" buttons and exactly one aria-checked="true". The tinted pill is
  styled off the checked segment, so the selection a sighted user sees and the
  one a screen reader hears are the same fact. Each segment clears the 40px
  target with h-10.
-->
<div class="fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 gap-1 rounded-2xl border border-black/10 bg-white/85 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85" role="radiogroup" aria-label="View">
  <button type="button" role="radio" aria-checked="false" class="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-gray-700 transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>
    List
  </button>
  <button type="button" role="radio" aria-checked="true" class="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 5h5v14H4zM10 5h5v9h-5zM16 5h4v6h-4z" /></svg>
    Board
  </button>
  <button type="button" role="radio" aria-checked="false" class="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-gray-700 transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4" /></svg>
    Calendar
  </button>
</div>`,
      react: `'use client';

import { useState } from 'react';

const SEGMENTS = [
  { id: 'list', label: 'List', path: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01' },
  { id: 'board', label: 'Board', path: 'M4 5h5v14H4zM10 5h5v9h-5zM16 5h4v6h-4z' },
  { id: 'calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
];

export function DockSegmented({ onChange }) {
  const [value, setValue] = useState('board');

  return (
    <div
      role="radiogroup"
      aria-label="View"
      className="fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 gap-1 rounded-2xl border border-black/10 bg-white/85 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
    >
      {SEGMENTS.map((seg) => {
        const active = seg.id === value;
        return (
          <button
            key={seg.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              setValue(seg.id);
              onChange?.(seg.id);
            }}
            className={
              'inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ' +
              (active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10')
            }
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={seg.path} />
            </svg>
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface Segment {
  id: string;
  /** Visible label - also the segment's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
}

export interface DockSegmentedProps {
  segments?: readonly Segment[];
  /** Id of the segment selected on mount. Defaults to the first. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_SEGMENTS: readonly Segment[] = [
  { id: 'list', label: 'List', path: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01' },
  { id: 'board', label: 'Board', path: 'M4 5h5v14H4zM10 5h5v9h-5zM16 5h4v6h-4z' },
  { id: 'calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
];

export function DockSegmented({
  segments = DEFAULT_SEGMENTS,
  defaultValue,
  onChange,
  ariaLabel = 'View',
  className = '',
}: DockSegmentedProps): JSX.Element {
  const [value, setValue] = useState<string>(defaultValue ?? segments[0]?.id ?? '');

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={
        'fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 gap-1 rounded-2xl border border-black/10 bg-white/85 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85 ' +
        className
      }
    >
      {segments.map((seg) => {
        const active = seg.id === value;
        return (
          <button
            key={seg.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              setValue(seg.id);
              onChange?.(seg.id);
            }}
            className={
              'inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ' +
              (active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10')
            }
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={seg.path} />
            </svg>
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}`,
    },
  },
  {
    slug: 'dock-notification-badges',
    category: 'docks',
    tags: ['dock', 'badge', 'notification', 'count', 'navigation'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'horizontal', labelKey: 'horizontal' }],
    props: [
      { name: 'items', type: 'readonly BadgeDockItem[]', default: 'DEFAULT_ITEMS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Dock'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Every badge is aria-hidden decoration - the count (or "new activity" for a
  bare dot) is repeated in a clipped span so it is announced, not merely seen.
  A ring in the surface colour punches the badge off the icon. Above 99 the pill
  collapses to "99+" so a runaway count cannot stretch the dock.
-->
<nav
  class="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
  aria-label="Dock"
>
  <ul class="flex items-center gap-1">
    <li>
      <a href="/home" aria-current="page" class="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" /></svg>
        <span class="sr-only">Home</span>
      </a>
    </li>
    <li>
      <a href="/inbox" class="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" /></svg>
        <span class="absolute right-1 top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white ring-2 ring-white dark:ring-gray-900" aria-hidden="true">8</span>
        <span class="sr-only">Inbox, 8 unread</span>
      </a>
    </li>
    <li>
      <a href="/chat" class="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z" /></svg>
        <span class="absolute right-1 top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white ring-2 ring-white dark:ring-gray-900" aria-hidden="true">99+</span>
        <span class="sr-only">Chat, 128 unread</span>
      </a>
    </li>
    <li>
      <a href="/activity" class="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
        <span class="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" aria-hidden="true"></span>
        <span class="sr-only">Activity, new activity</span>
      </a>
    </li>
    <li>
      <a href="/profile" class="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0" /></svg>
        <span class="sr-only">Profile</span>
      </a>
    </li>
  </ul>
</nav>`,
      react: `const ITEMS = [
  { id: 'home', href: '/home', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'inbox', href: '/inbox', label: 'Inbox', count: 8, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'chat', href: '/chat', label: 'Chat', count: 128, path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'activity', href: '/activity', label: 'Activity', dot: true, path: 'M3 12h4l2 6 4-14 2 8h6' },
  { id: 'profile', href: '/profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockNotificationBadges({ onSelect }) {
  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
    >
      <ul className="flex items-center gap-1">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              {typeof item.count === 'number' ? (
                <span aria-hidden="true" className="absolute right-1 top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white ring-2 ring-white dark:ring-gray-900">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              ) : null}
              {item.dot ? <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" /> : null}
              {/* Badges are decoration; the count is announced here. */}
              <span className="sr-only">
                {item.label}
                {typeof item.count === 'number' ? ', ' + item.count + ' unread' : item.dot ? ', new activity' : ''}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `export interface BadgeDockItem {
  id: string;
  href: string;
  /** Visible to screen readers only - the icon's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
  /** Numeric badge. Above 99 it collapses to "99+". */
  count?: number;
  /** Renders a bare status dot instead of a count. */
  dot?: boolean;
  current?: boolean;
}

export interface DockNotificationBadgesProps {
  items?: readonly BadgeDockItem[];
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: readonly BadgeDockItem[] = [
  { id: 'home', href: '/home', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'inbox', href: '/inbox', label: 'Inbox', count: 8, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'chat', href: '/chat', label: 'Chat', count: 128, path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'activity', href: '/activity', label: 'Activity', dot: true, path: 'M3 12h4l2 6 4-14 2 8h6' },
  { id: 'profile', href: '/profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockNotificationBadges({
  items = DEFAULT_ITEMS,
  onSelect,
  ariaLabel = 'Dock',
  className = '',
}: DockNotificationBadgesProps): JSX.Element {
  return (
    <nav
      aria-label={ariaLabel}
      className={
        'fixed bottom-6 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85 ' +
        className
      }
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              {typeof item.count === 'number' ? (
                <span aria-hidden="true" className="absolute right-1 top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white ring-2 ring-white dark:ring-gray-900">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              ) : null}
              {item.dot ? <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" /> : null}
              <span className="sr-only">
                {item.label}
                {typeof item.count === 'number' ? ', ' + item.count + ' unread' : item.dot ? ', new activity' : ''}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-app-launcher',
    category: 'docks',
    tags: ['dock', 'launcher', 'grid', 'popover', 'menu'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'popover', labelKey: 'floating' }],
    props: [
      { name: 'apps', type: 'readonly LauncherApp[]', default: 'DEFAULT_APPS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Applications'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A launcher button that opens a grid of app links. The trigger owns
  aria-haspopup, aria-expanded and aria-controls; the grid is role="menu" with
  role="menuitem" links. Shown here OPEN - the React/TypeScript variants wire
  the toggle and close on Escape. The popover is max-w-[calc(100vw-2rem)] so it
  never runs off a 320px screen.
-->
<div class="fixed bottom-6 left-1/2 -translate-x-1/2">
  <div id="app-grid" role="menu" aria-label="Applications" class="absolute bottom-[calc(100%+0.5rem)] left-1/2 w-60 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
    <ul class="grid grid-cols-3 gap-1">
      <li>
        <a href="/mail" role="menuitem" class="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-xl p-2 text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /></svg>
          <span class="text-[0.6875rem] font-medium leading-none">Mail</span>
        </a>
      </li>
      <li>
        <a href="/calendar" role="menuitem" class="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-xl p-2 text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4" /></svg>
          <span class="text-[0.6875rem] font-medium leading-none">Calendar</span>
        </a>
      </li>
      <li>
        <a href="/photos" role="menuitem" class="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-xl p-2 text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4" /></svg>
          <span class="text-[0.6875rem] font-medium leading-none">Photos</span>
        </a>
      </li>
    </ul>
  </div>
  <div class="rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85">
    <button type="button" aria-label="Applications" aria-haspopup="menu" aria-expanded="true" aria-controls="app-grid" class="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-expanded:bg-blue-100 aria-expanded:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-expanded:bg-blue-900 dark:aria-expanded:text-blue-200">
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 5h5v5H4zM15 5h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z" /></svg>
    </button>
  </div>
</div>`,
      react: `'use client';

import { useRef, useState } from 'react';

const APPS = [
  { id: 'mail', href: '/mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'calendar', href: '/calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
  { id: 'photos', href: '/photos', label: 'Photos', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'notes', href: '/notes', label: 'Notes', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'maps', href: '/maps', label: 'Maps', path: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14' },
  { id: 'music', href: '/music', label: 'Music', path: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z' },
];

export function DockAppLauncher({ onSelect }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  // Escape closes and returns focus to the trigger - a menu you cannot dismiss
  // from the keyboard is a trap.
  function handleKeyDown(event) {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2" onKeyDown={handleKeyDown}>
      {open ? (
        <div id="app-grid" role="menu" aria-label="Applications" className="absolute bottom-[calc(100%+0.5rem)] left-1/2 w-60 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
          <ul className="grid grid-cols-3 gap-1">
            {APPS.map((app) => (
              <li key={app.id}>
                <a
                  href={app.href}
                  role="menuitem"
                  onClick={() => onSelect?.(app.id)}
                  className="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-xl p-2 text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d={app.path} />
                  </svg>
                  <span className="text-[0.6875rem] font-medium leading-none">{app.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Applications"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="app-grid"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-expanded:bg-blue-100 aria-expanded:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-expanded:bg-blue-900 dark:aria-expanded:text-blue-200"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M4 5h5v5H4zM15 5h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface LauncherApp {
  id: string;
  href: string;
  /** Visible label under the icon; also the link's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
}

export interface DockAppLauncherProps {
  apps?: readonly LauncherApp[];
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_APPS: readonly LauncherApp[] = [
  { id: 'mail', href: '/mail', label: 'Mail', path: 'M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z' },
  { id: 'calendar', href: '/calendar', label: 'Calendar', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
  { id: 'photos', href: '/photos', label: 'Photos', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'notes', href: '/notes', label: 'Notes', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'maps', href: '/maps', label: 'Maps', path: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14' },
  { id: 'music', href: '/music', label: 'Music', path: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z' },
];

export function DockAppLauncher({
  apps = DEFAULT_APPS,
  onSelect,
  ariaLabel = 'Applications',
  className = '',
}: DockAppLauncherProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div className={'fixed bottom-6 left-1/2 -translate-x-1/2 ' + className} onKeyDown={handleKeyDown}>
      {open ? (
        <div id="app-grid" role="menu" aria-label={ariaLabel} className="absolute bottom-[calc(100%+0.5rem)] left-1/2 w-60 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
          <ul className="grid grid-cols-3 gap-1">
            {apps.map((app) => (
              <li key={app.id}>
                <a
                  href={app.href}
                  role="menuitem"
                  onClick={() => onSelect?.(app.id)}
                  className="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-xl p-2 text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d={app.path} />
                  </svg>
                  <span className="text-[0.6875rem] font-medium leading-none">{app.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85">
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="app-grid"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-expanded:bg-blue-100 aria-expanded:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-expanded:bg-blue-900 dark:aria-expanded:text-blue-200"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M4 5h5v5H4zM15 5h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'dock-mini-player',
    category: 'docks',
    tags: ['dock', 'player', 'media', 'controls', 'music'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'floating', labelKey: 'floating' }],
    props: [
      { name: 'title', type: 'string', default: "'Midnight Signals'", descriptionKey: 'title' },
      { name: 'artist', type: 'string', default: "'The Wavelengths'", descriptionKey: 'subtitle' },
      { name: 'progress', type: 'number', default: '42', descriptionKey: 'value' },
      { name: 'defaultPlaying', type: 'boolean', default: 'true', descriptionKey: 'active' },
      { name: 'onPlayPause', type: '(playing: boolean) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A now-playing strip. The track text is min-w-0 + truncate so a long title
  cannot push the strip past a 320px viewport. The transport buttons are icon
  only, so each carries an aria-label; the play/pause button swaps its label
  when toggled (see React/TypeScript). The progress bar is a real progressbar
  role, not a naked div.
-->
<div class="fixed bottom-6 left-1/2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
  <div class="flex items-center gap-3">
    <div class="h-11 w-11 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" aria-hidden="true"></div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Midnight Signals</p>
      <p class="truncate text-xs text-gray-600 dark:text-gray-400">The Wavelengths</p>
    </div>
    <div class="flex shrink-0 items-center gap-0.5">
      <button type="button" aria-label="Previous track" class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 6a1 1 0 0 1 2 0v5l8-5.2A1 1 0 0 1 18.5 6.6v10.8a1 1 0 0 1-1.5.8L9 13v5a1 1 0 0 1-2 0Z" /></svg>
      </button>
      <button type="button" aria-label="Pause" aria-pressed="true" class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:focus-visible:ring-blue-200">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
      </button>
      <button type="button" aria-label="Next track" class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17 6a1 1 0 0 0-2 0v5L7 5.8A1 1 0 0 0 5.5 6.6v10.8a1 1 0 0 0 1.5.8L15 13v5a1 1 0 0 0 2 0Z" /></svg>
      </button>
    </div>
  </div>
  <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10" role="progressbar" aria-label="Playback progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="42">
    <div class="h-full w-[42%] rounded-full bg-blue-600"></div>
  </div>
</div>`,
      react: `'use client';

import { useState } from 'react';

export function DockMiniPlayer({ title = 'Midnight Signals', artist = 'The Wavelengths', progress = 42, onPlayPause }) {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="fixed bottom-6 left-1/2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
          <p className="truncate text-xs text-gray-600 dark:text-gray-400">{artist}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" aria-label="Previous track" className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 6a1 1 0 0 1 2 0v5l8-5.2A1 1 0 0 1 18.5 6.6v10.8a1 1 0 0 1-1.5.8L9 13v5a1 1 0 0 1-2 0Z" /></svg>
          </button>
          <button
            type="button"
            aria-label={playing ? 'Pause' : 'Play'}
            aria-pressed={playing}
            onClick={() => {
              const next = !playing;
              setPlaying(next);
              onPlayPause?.(next);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:focus-visible:ring-blue-200"
          >
            {playing ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.2A1 1 0 0 1 9.5 4.3l9 6.8a1 1 0 0 1 0 1.8l-9 6.8A1 1 0 0 1 8 18.8Z" /></svg>
            )}
          </button>
          <button type="button" aria-label="Next track" className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17 6a1 1 0 0 0-2 0v5L7 5.8A1 1 0 0 0 5.5 6.6v10.8a1 1 0 0 0 1.5.8L15 13v5a1 1 0 0 0 2 0Z" /></svg>
          </button>
        </div>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10" role="progressbar" aria-label="Playback progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="h-full rounded-full bg-blue-600" style={{ width: progress + '%' }} />
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface DockMiniPlayerProps {
  title?: string;
  artist?: string;
  /** Playback progress, 0-100. */
  progress?: number;
  /** Whether the track starts playing. */
  defaultPlaying?: boolean;
  onPlayPause?: (playing: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

export function DockMiniPlayer({
  title = 'Midnight Signals',
  artist = 'The Wavelengths',
  progress = 42,
  defaultPlaying = true,
  onPlayPause,
  onPrev,
  onNext,
  className = '',
}: DockMiniPlayerProps): JSX.Element {
  const [playing, setPlaying] = useState(defaultPlaying);

  return (
    <div className={'fixed bottom-6 left-1/2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90 ' + className}>
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
          <p className="truncate text-xs text-gray-600 dark:text-gray-400">{artist}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" aria-label="Previous track" onClick={() => onPrev?.()} className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 6a1 1 0 0 1 2 0v5l8-5.2A1 1 0 0 1 18.5 6.6v10.8a1 1 0 0 1-1.5.8L9 13v5a1 1 0 0 1-2 0Z" /></svg>
          </button>
          <button
            type="button"
            aria-label={playing ? 'Pause' : 'Play'}
            aria-pressed={playing}
            onClick={() => {
              const next = !playing;
              setPlaying(next);
              onPlayPause?.(next);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white dark:focus-visible:ring-blue-200"
          >
            {playing ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.2A1 1 0 0 1 9.5 4.3l9 6.8a1 1 0 0 1 0 1.8l-9 6.8A1 1 0 0 1 8 18.8Z" /></svg>
            )}
          </button>
          <button type="button" aria-label="Next track" onClick={() => onNext?.()} className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17 6a1 1 0 0 0-2 0v5L7 5.8A1 1 0 0 0 5.5 6.6v10.8a1 1 0 0 0 1.5.8L15 13v5a1 1 0 0 0 2 0Z" /></svg>
          </button>
        </div>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10" role="progressbar" aria-label="Playback progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="h-full rounded-full bg-blue-600" style={{ width: progress + '%' }} />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'dock-side-collapsible',
    category: 'docks',
    tags: ['dock', 'vertical', 'collapsible', 'rail', 'sidebar'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'vertical', labelKey: 'vertical' }],
    props: [
      { name: 'items', type: 'readonly SideItem[]', default: 'DEFAULT_ITEMS', descriptionKey: 'items' },
      { name: 'defaultExpanded', type: 'boolean', default: 'true', descriptionKey: 'active' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Workspace'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      react: `'use client';

import { useState } from 'react';

const ITEMS = [
  { id: 'inbox', href: '/inbox', label: 'Inbox', current: true, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'projects', href: '/projects', label: 'Projects', path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'insights', href: '/insights', label: 'Insights', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export function DockSideCollapsible({ onSelect }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <nav
      aria-label="Workspace"
      className="fixed left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      {/* aria-expanded is the single source of truth; the labels below and the
          chevron rotation both read off this state. */}
      <button
        type="button"
        aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (expanded ? 'rotate-180' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-[0.625rem] text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              {/* Collapsed = sr-only, so the name survives even with no visible text. */}
              <span className={expanded ? 'whitespace-nowrap text-sm font-medium' : 'sr-only'}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
      tailwind: `<!--
  A vertical rail that toggles between icon-only and icon+label. Shown EXPANDED;
  the React/TypeScript variants own the toggle. When collapsed, each label
  becomes sr-only rather than being removed, so every item keeps its accessible
  name at any width. aria-expanded on the toggle is the source of truth.
-->
<nav class="fixed left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90" aria-label="Workspace">
  <button type="button" aria-label="Collapse menu" aria-expanded="true" class="mb-1 flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
    <svg class="h-6 w-6 rotate-180 transition-transform motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" /></svg>
  </button>
  <ul class="flex flex-col gap-1">
    <li>
      <a href="/inbox" aria-current="page" class="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-[0.625rem] text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300">
        <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" /></svg>
        <span class="whitespace-nowrap text-sm font-medium">Inbox</span>
      </a>
    </li>
    <li>
      <a href="/projects" class="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-[0.625rem] text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /></svg>
        <span class="whitespace-nowrap text-sm font-medium">Projects</span>
      </a>
    </li>
    <li>
      <a href="/insights" class="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-[0.625rem] text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
        <span class="whitespace-nowrap text-sm font-medium">Insights</span>
      </a>
    </li>
    <li>
      <a href="/settings" class="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-[0.625rem] text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
        <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1" /></svg>
        <span class="whitespace-nowrap text-sm font-medium">Settings</span>
      </a>
    </li>
  </ul>
</nav>`,
      typescript: `'use client';

import { useState } from 'react';

export interface SideItem {
  id: string;
  href: string;
  /** Visible when expanded; the sr-only accessible name when collapsed. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
  current?: boolean;
}

export interface DockSideCollapsibleProps {
  items?: readonly SideItem[];
  defaultExpanded?: boolean;
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: readonly SideItem[] = [
  { id: 'inbox', href: '/inbox', label: 'Inbox', current: true, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'projects', href: '/projects', label: 'Projects', path: 'M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' },
  { id: 'insights', href: '/insights', label: 'Insights', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'settings', href: '/settings', label: 'Settings', path: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1' },
];

export function DockSideCollapsible({
  items = DEFAULT_ITEMS,
  defaultExpanded = true,
  onSelect,
  ariaLabel = 'Workspace',
  className = '',
}: DockSideCollapsibleProps): JSX.Element {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <nav
      aria-label={ariaLabel}
      className={'fixed left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90 ' + className}
    >
      <button
        type="button"
        aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
      >
        <svg className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (expanded ? 'rotate-180' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => onSelect?.(item.id)}
              className="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-[0.625rem] text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:bg-blue-950 dark:aria-[current=page]:text-blue-300"
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={item.path} />
              </svg>
              <span className={expanded ? 'whitespace-nowrap text-sm font-medium' : 'sr-only'}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'dock-command-strip',
    category: 'docks',
    tags: ['dock', 'command', 'shortcuts', 'toolbar', 'actions'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'horizontal', labelKey: 'horizontal' }],
    props: [
      { name: 'commands', type: 'readonly Command[]', default: 'DEFAULT_COMMANDS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Commands'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A strip of command buttons. Each shows its visible label (its accessible name)
  plus a kbd shortcut hint, mirrored into aria-keyshortcuts so the shortcut is
  announced too. The kbd only appears at >= sm; the strip itself scrolls
  (overflow-x-auto) rather than overflowing the page at 320px.
-->
<div class="fixed bottom-6 left-1/2 w-full max-w-[calc(100vw-2rem)] -translate-x-1/2">
  <div role="toolbar" aria-label="Commands" class="mx-auto flex w-max max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
    <button type="button" aria-keyshortcuts="Ctrl+K" class="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
      <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6" /></svg>
      Search
      <kbd aria-hidden="true" class="hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[0.625rem] font-semibold text-gray-500 sm:inline dark:border-white/10 dark:bg-white/10 dark:text-gray-400">Ctrl+K</kbd>
    </button>
    <button type="button" aria-keyshortcuts="Ctrl+N" class="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
      <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>
      New
      <kbd aria-hidden="true" class="hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[0.625rem] font-semibold text-gray-500 sm:inline dark:border-white/10 dark:bg-white/10 dark:text-gray-400">Ctrl+N</kbd>
    </button>
    <button type="button" aria-keyshortcuts="C" class="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
      <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z" /></svg>
      Comment
      <kbd aria-hidden="true" class="hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[0.625rem] font-semibold text-gray-500 sm:inline dark:border-white/10 dark:bg-white/10 dark:text-gray-400">C</kbd>
    </button>
    <button type="button" aria-keyshortcuts="Ctrl+S" class="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400">
      <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" /></svg>
      Share
      <kbd aria-hidden="true" class="hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[0.625rem] font-semibold text-gray-500 sm:inline dark:border-white/10 dark:bg-white/10 dark:text-gray-400">Ctrl+S</kbd>
    </button>
  </div>
</div>`,
      react: `const COMMANDS = [
  { id: 'search', label: 'Search', keys: 'Ctrl+K', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'new', label: 'New', keys: 'Ctrl+N', path: 'M12 5v14M5 12h14' },
  { id: 'comment', label: 'Comment', keys: 'C', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'share', label: 'Share', keys: 'Ctrl+S', path: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13' },
];

export function DockCommandStrip({ onSelect }) {
  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-[calc(100vw-2rem)] -translate-x-1/2">
      <div role="toolbar" aria-label="Commands" className="mx-auto flex w-max max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
        {COMMANDS.map((cmd) => (
          <button
            key={cmd.id}
            type="button"
            aria-keyshortcuts={cmd.keys}
            onClick={() => onSelect?.(cmd.id)}
            className="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={cmd.path} />
            </svg>
            {cmd.label}
            {/* Decorative hint; the shortcut is announced via aria-keyshortcuts. */}
            <kbd aria-hidden="true" className="hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[0.625rem] font-semibold text-gray-500 sm:inline dark:border-white/10 dark:bg-white/10 dark:text-gray-400">
              {cmd.keys}
            </kbd>
          </button>
        ))}
      </div>
    </div>
  );
}`,
      typescript: `export interface Command {
  id: string;
  /** Visible label - also the button's accessible name. */
  label: string;
  /** Shortcut hint, shown in a kbd and mirrored to aria-keyshortcuts. */
  keys: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
}

export interface DockCommandStripProps {
  commands?: readonly Command[];
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_COMMANDS: readonly Command[] = [
  { id: 'search', label: 'Search', keys: 'Ctrl+K', path: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-3.6-3.6' },
  { id: 'new', label: 'New', keys: 'Ctrl+N', path: 'M12 5v14M5 12h14' },
  { id: 'comment', label: 'Comment', keys: 'C', path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'share', label: 'Share', keys: 'Ctrl+S', path: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13' },
];

export function DockCommandStrip({
  commands = DEFAULT_COMMANDS,
  onSelect,
  ariaLabel = 'Commands',
  className = '',
}: DockCommandStripProps): JSX.Element {
  return (
    <div className={'fixed bottom-6 left-1/2 w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 ' + className}>
      <div role="toolbar" aria-label={ariaLabel} className="mx-auto flex w-max max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90">
        {commands.map((cmd) => (
          <button
            key={cmd.id}
            type="button"
            aria-keyshortcuts={cmd.keys}
            onClick={() => onSelect?.(cmd.id)}
            className="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={cmd.path} />
            </svg>
            {cmd.label}
            <kbd aria-hidden="true" className="hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[0.625rem] font-semibold text-gray-500 sm:inline dark:border-white/10 dark:bg-white/10 dark:text-gray-400">
              {cmd.keys}
            </kbd>
          </button>
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'dock-floating-actions',
    category: 'docks',
    tags: ['dock', 'fab', 'speed-dial', 'actions', 'floating'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'floating', labelKey: 'floating' }],
    props: [
      { name: 'actions', type: 'readonly FloatingAction[]', default: 'DEFAULT_ACTIONS', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', descriptionKey: 'active' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      react: `'use client';

import { useState } from 'react';

const ACTIONS = [
  { id: 'note', label: 'New note', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'photo', label: 'Upload photo', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'event', label: 'New event', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
];

export function DockFloatingActions({ onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
      {/* Collapsed = hidden from AT and out of the tab order, not just invisible. */}
      <ul className="flex flex-col items-end gap-2" aria-hidden={!open}>
        {ACTIONS.map((action, index) => (
          <li
            key={action.id}
            className={
              'flex items-center gap-2 transition duration-200 ease-out motion-reduce:transition-none ' +
              (open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0')
            }
            style={{ transitionDelay: open ? index * 40 + 'ms' : '0ms' }}
          >
            <span className="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-gray-100 dark:text-gray-900">{action.label}</span>
            <button
              type="button"
              aria-label={action.label}
              tabIndex={open ? 0 : -1}
              onClick={() => onSelect?.(action.id)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={action.path} />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-label={open ? 'Close actions' : 'Open actions'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg className={'h-6 w-6 transition-transform duration-200 motion-reduce:transition-none ' + (open ? 'rotate-45' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
      tailwind: `<!--
  A speed-dial FAB. Shown OPEN; the React/TypeScript variants own the toggle.
  The main button owns aria-expanded. Collapsed, the secondary actions are
  aria-hidden and tabindex=-1 so they leave the tab order entirely - being
  invisible is not the same as being unreachable. The fan-out is dropped under
  reduced motion.
-->
<div class="fixed bottom-6 right-6 flex flex-col items-end gap-3">
  <ul class="flex flex-col items-end gap-2">
    <li class="flex items-center gap-2 transition duration-200 ease-out motion-reduce:transition-none">
      <span class="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-gray-100 dark:text-gray-900">New note</span>
      <button type="button" aria-label="New note" class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5" /></svg>
      </button>
    </li>
    <li class="flex items-center gap-2 transition duration-200 ease-out motion-reduce:transition-none">
      <span class="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-gray-100 dark:text-gray-900">Upload photo</span>
      <button type="button" aria-label="Upload photo" class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4" /></svg>
      </button>
    </li>
    <li class="flex items-center gap-2 transition duration-200 ease-out motion-reduce:transition-none">
      <span class="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-gray-100 dark:text-gray-900">New event</span>
      <button type="button" aria-label="New event" class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4" /></svg>
      </button>
    </li>
  </ul>
  <button type="button" aria-label="Close actions" aria-expanded="true" class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-6 w-6 rotate-45 transition-transform duration-200 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>
  </button>
</div>`,
      typescript: `'use client';

import { useState } from 'react';

export interface FloatingAction {
  id: string;
  /** Both the tooltip text and the button's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
}

export interface DockFloatingActionsProps {
  actions?: readonly FloatingAction[];
  onSelect?: (id: string) => void;
  defaultOpen?: boolean;
  className?: string;
}

const DEFAULT_ACTIONS: readonly FloatingAction[] = [
  { id: 'note', label: 'New note', path: 'M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 11h8M8 15h5' },
  { id: 'photo', label: 'Upload photo', path: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-1 13 5-5 4 4 3-2 4 4' },
  { id: 'event', label: 'New event', path: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM3 10h18M8 3v4M16 3v4' },
];

export function DockFloatingActions({
  actions = DEFAULT_ACTIONS,
  onSelect,
  defaultOpen = false,
  className = '',
}: DockFloatingActionsProps): JSX.Element {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={'fixed bottom-6 right-6 flex flex-col items-end gap-3 ' + className}>
      <ul className="flex flex-col items-end gap-2" aria-hidden={!open}>
        {actions.map((action, index) => (
          <li
            key={action.id}
            className={
              'flex items-center gap-2 transition duration-200 ease-out motion-reduce:transition-none ' +
              (open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0')
            }
            style={{ transitionDelay: open ? index * 40 + 'ms' : '0ms' }}
          >
            <span className="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-gray-100 dark:text-gray-900">{action.label}</span>
            <button
              type="button"
              aria-label={action.label}
              tabIndex={open ? 0 : -1}
              onClick={() => onSelect?.(action.id)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={action.path} />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-label={open ? 'Close actions' : 'Open actions'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg className={'h-6 w-6 transition-transform duration-200 motion-reduce:transition-none ' + (open ? 'rotate-45' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'dock-tab-bar',
    category: 'docks',
    tags: ['dock', 'tabs', 'indicator', 'navigation', 'animated'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'horizontal', labelKey: 'horizontal' }],
    props: [
      { name: 'tabs', type: 'readonly TabItem[]', default: 'DEFAULT_TABS', descriptionKey: 'items' },
      { name: 'defaultActive', type: 'string', descriptionKey: 'value' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'ariaLabel', type: 'string', default: "'Sections'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      react: `'use client';

import { useState } from 'react';

const TABS = [
  { id: 'home', href: '/home', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'trends', href: '/trends', label: 'Trends', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'saved', href: '/saved', label: 'Saved', path: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z' },
];

export function DockTabBar({ onSelect }) {
  const [active, setActive] = useState(0);
  const width = 100 / TABS.length;

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-6 left-1/2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90"
    >
      <div className="relative flex">
        {/* Decorative indicator; aria-current on the link is what is announced. */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 top-0 rounded-xl bg-blue-600/10 transition-transform duration-200 ease-out motion-reduce:transition-none dark:bg-blue-400/15"
          style={{ width: width + '%', transform: 'translateX(' + active * 100 + '%)' }}
        />
        {TABS.map((tab, index) => (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={index === active ? 'page' : undefined}
            onClick={() => {
              setActive(index);
              onSelect?.(tab.id);
            }}
            className="relative z-10 flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={tab.path} />
            </svg>
            <span className="text-[0.6875rem] font-medium leading-none">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}`,
      tailwind: `<!--
  A tab bar with a sliding indicator. Shown with the first tab active; the
  React/TypeScript variants move the indicator by translating it a whole tab
  width per index. The pill is aria-hidden decoration - aria-current on the
  active link is the announced state - and the slide is dropped under reduced
  motion.
-->
<nav class="fixed bottom-6 left-1/2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90" aria-label="Sections">
  <div class="relative flex">
    <span aria-hidden="true" class="absolute bottom-0 top-0 w-1/3 rounded-xl bg-blue-600/10 transition-transform duration-200 ease-out motion-reduce:transition-none dark:bg-blue-400/15"></span>
    <a href="/home" aria-current="page" class="relative z-10 flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" /></svg>
      <span class="text-[0.6875rem] font-medium leading-none">Home</span>
    </a>
    <a href="/trends" class="relative z-10 flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
      <span class="text-[0.6875rem] font-medium leading-none">Trends</span>
    </a>
    <a href="/saved" class="relative z-10 flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" /></svg>
      <span class="text-[0.6875rem] font-medium leading-none">Saved</span>
    </a>
  </div>
</nav>`,
      typescript: `'use client';

import { useState } from 'react';

export interface TabItem {
  id: string;
  href: string;
  /** Visible label - also the link's accessible name. */
  label: string;
  /** SVG path data drawn into a 24x24 viewBox. */
  path: string;
}

export interface DockTabBarProps {
  tabs?: readonly TabItem[];
  /** Id of the tab active on mount. Defaults to the first. */
  defaultActive?: string;
  onSelect?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_TABS: readonly TabItem[] = [
  { id: 'home', href: '/home', label: 'Home', path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'trends', href: '/trends', label: 'Trends', path: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { id: 'saved', href: '/saved', label: 'Saved', path: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z' },
];

export function DockTabBar({
  tabs = DEFAULT_TABS,
  defaultActive,
  onSelect,
  ariaLabel = 'Sections',
  className = '',
}: DockTabBarProps): JSX.Element {
  const initial = Math.max(0, tabs.findIndex((tab) => tab.id === defaultActive));
  const [active, setActive] = useState(initial);
  const width = 100 / tabs.length;

  return (
    <nav
      aria-label={ariaLabel}
      className={'fixed bottom-6 left-1/2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/90 p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/90 ' + className}
    >
      <div className="relative flex">
        <span
          aria-hidden="true"
          className="absolute bottom-0 top-0 rounded-xl bg-blue-600/10 transition-transform duration-200 ease-out motion-reduce:transition-none dark:bg-blue-400/15"
          style={{ width: width + '%', transform: 'translateX(' + active * 100 + '%)' }}
        />
        {tabs.map((tab, index) => (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={index === active ? 'page' : undefined}
            onClick={() => {
              setActive(index);
              onSelect?.(tab.id);
            }}
            className="relative z-10 flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-400 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={tab.path} />
            </svg>
            <span className="text-[0.6875rem] font-medium leading-none">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}`,
    },
  },
];
