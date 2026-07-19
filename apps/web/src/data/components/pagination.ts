import type { ComponentEntry } from './types';

/**
 * Pagination category.
 *
 * The through-line for all five: a page control is navigation, so it is built
 * from real links inside a labelled `<nav>`. Anchors are what make a page
 * bookmarkable, middle-clickable and reachable with JavaScript off - rebuilding
 * them as `<button>` buys nothing and throws all three away. The two
 * append-style entries (load-more, infinite-sentinel) add the piece that
 * feed-shaped UIs almost always omit: an announcement that the list grew.
 */
export const paginationComponents: ComponentEntry[] = [
  {
    slug: 'pagination-numbered',
    category: 'pagination',
    tags: ['pagination', 'links', 'ellipsis', 'navigation', 'aria-current'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 1980, copies: 542, downloads: 137 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '10' },
      {
        name: 'buildHref',
        type: '(page: number) => string',
        required: true,
        descriptionKey: 'buildHref',
        example: "(page) => '?page=' + page",
      },
      { name: 'siblingCount', type: 'number', default: '1', descriptionKey: 'siblingCount' },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Page 1 of 10, so Previous has nowhere to go. An anchor with no href is not
  focusable and exposes no link role - which is the closest an <a> gets to a
  disabled <button> - and aria-disabled tells a screen reader why it is inert
  rather than leaving it to be silently skipped.

  The ellipsis is aria-hidden: the numbers on either side of it already say
  pages were skipped, and "horizontal ellipsis" read aloud between 4 and 10 is
  noise, not information.
-->
<nav class="pager" aria-label="Pagination">
  <ul class="pager__list">
    <li><a class="pager__link pager__link--disabled" aria-disabled="true">Previous</a></li>
    <li><a class="pager__link pager__link--current" href="?page=1" aria-current="page">1</a></li>
    <li><a class="pager__link" href="?page=2">2</a></li>
    <li><a class="pager__link" href="?page=3">3</a></li>
    <li><span class="pager__ellipsis" aria-hidden="true">&hellip;</span></li>
    <li><a class="pager__link" href="?page=10">10</a></li>
    <li><a class="pager__link" href="?page=2">Next</a></li>
  </ul>
</nav>`,
      css: `.pager__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pager__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 2.5rem square keeps every digit on the same target size, so "1" and "10"
     do not produce two differently sized hit areas in the same row. */
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.625rem;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-decoration: none;
  transition: background-color 150ms, color 150ms;
}

.pager__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.pager__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* The current page is the one thing that must survive a colour-blind user or a
   forced-colours mode, so it is a filled surface and a bolder weight - not a
   tint alone. aria-current carries the same fact to a screen reader. */
.pager__link--current {
  background-color: #2563eb;
  color: #fff;
  font-weight: 600;
}

.pager__link--current:hover {
  background-color: #1d4ed8;
  color: #fff;
}

.pager__link--disabled {
  color: #9ca3af;
  cursor: default;
}

.pager__link--disabled:hover {
  background-color: transparent;
  color: #9ca3af;
}

.pager__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

/*
 * Every resting link here is transparent - the digits sit directly on whatever
 * the page background is, so all of them need re-tuning for a dark surface or
 * they vanish. The current page is the exception: it paints its own blue and
 * its white label clears AA on either theme, so only its hover is touched.
 * The disabled grey is lifted to #6b7280 because #9ca3af on a dark background
 * is the one pairing here that drops under 4.5:1.
 */
@media (prefers-color-scheme: dark) {
  .pager__link {
    color: #d1d5db;
  }

  .pager__link:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .pager__link:focus-visible {
    outline-color: #60a5fa;
  }

  .pager__link--disabled,
  .pager__link--disabled:hover {
    color: #6b7280;
    background-color: transparent;
  }

  .pager__ellipsis {
    color: #9ca3af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pager__link {
    transition: none;
  }
}`,
      tailwind: `<nav aria-label="Pagination">
  <ul class="flex list-none flex-wrap items-center justify-center gap-1 p-0">
    <li>
      <a
        aria-disabled="true"
        class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-gray-400 dark:text-gray-500"
      >
        Previous
      </a>
    </li>
    <li>
      <a
        href="?page=1"
        aria-current="page"
        class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-blue-600 px-2.5 text-sm font-semibold tabular-nums text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        1
      </a>
    </li>
    <li>
      <a
        href="?page=2"
        class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        2
      </a>
    </li>
    <li>
      <a
        href="?page=3"
        class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        3
      </a>
    </li>
    <li>
      <span class="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">
        &hellip;
      </span>
    </li>
    <li>
      <a
        href="?page=10"
        class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        10
      </a>
    </li>
    <li>
      <a
        href="?page=2"
        class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Next
      </a>
    </li>
  </ul>
</nav>`,
      react: `const LINK =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white hover:bg-blue-700';
const OFF = 'text-gray-400 dark:text-gray-500';

/**
 * Collapses a long page count to first + a window around current + last,
 * inserting gap markers. Returning markers rather than pre-rendered nodes keeps
 * this pure and testable - the component decides what a gap looks like.
 */
function pageRange(currentPage, totalPages, siblingCount = 1) {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  siblingCount = 1,
  ariaLabel = 'Pagination',
  className = '',
}) {
  const range = pageRange(currentPage, totalPages, siblingCount);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex list-none flex-wrap items-center justify-center gap-1 p-0">
        <li>
          {/* No href at the bounds: an anchor without one is unfocusable and
              exposes no link role, so it cannot be activated by any input
              method. aria-disabled explains the state rather than hiding it. */}
          {hasPrev ? (
            <a href={buildHref(currentPage - 1)} className={\`\${LINK} \${REST}\`}>
              Previous
            </a>
          ) : (
            <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
              Previous
            </a>
          )}
        </li>

        {range.map((item) =>
          typeof item === 'string' ? (
            <li key={item}>
              <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">
                &hellip;
              </span>
            </li>
          ) : (
            <li key={item}>
              <a
                href={buildHref(item)}
                // The only accessible signal for "you are here". The blue fill
                // is the sighted half of the same message.
                aria-current={item === currentPage ? 'page' : undefined}
                className={\`\${LINK} \${item === currentPage ? CURRENT : REST}\`}
              >
                {item}
              </a>
            </li>
          ),
        )}

        <li>
          {hasNext ? (
            <a href={buildHref(currentPage + 1)} className={\`\${LINK} \${REST}\`}>
              Next
            </a>
          ) : (
            <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
              Next
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}`,
      nextjs: `import type { ReactElement } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  siblingCount?: number;
  ariaLabel?: string;
  className?: string;
}

const LINK =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white hover:bg-blue-700';
const OFF = 'text-gray-400 dark:text-gray-500';

function pageRange(currentPage: number, totalPages: number, siblingCount: number): (number | string)[] {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range: (number | string)[] = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

/**
 * No 'use client'. Pagination holds no state - the URL does. Read \`page\` from
 * searchParams in the route, pass it down, and this renders on the server with
 * zero JavaScript shipped. Drop a \`<Link>\` in place of \`<a>\` for client-side
 * transitions; the accessibility contract is identical either way.
 */
export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  siblingCount = 1,
  ariaLabel = 'Pagination',
  className = '',
}: PaginationProps) {
  const range = pageRange(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex list-none flex-wrap items-center justify-center gap-1 p-0">
        <li>
          {currentPage > 1 ? (
            <a href={buildHref(currentPage - 1)} className={\`\${LINK} \${REST}\`}>
              Previous
            </a>
          ) : (
            <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
              Previous
            </a>
          )}
        </li>

        {range.map((item: number | string): ReactElement => (
          typeof item === 'string' ? (
            <li key={item}>
              <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">
                &hellip;
              </span>
            </li>
          ) : (
            <li key={item}>
              <a
                href={buildHref(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                className={\`\${LINK} \${item === currentPage ? CURRENT : REST}\`}
              >
                {item}
              </a>
            </li>
          )
        ))}

        <li>
          {currentPage < totalPages ? (
            <a href={buildHref(currentPage + 1)} className={\`\${LINK} \${REST}\`}>
              Next
            </a>
          ) : (
            <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
              Next
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}`,
      typescript: `import type { ReactElement } from 'react';

/** A page number, or a marker for a collapsed run of pages. */
export type PageItem = number | 'gap-start' | 'gap-end';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Must return a real URL - it is what makes a page bookmarkable. */
  buildHref: (page: number) => string;
  /** Pages kept either side of the current one before collapsing to a gap. */
  siblingCount?: number;
  ariaLabel?: string;
  className?: string;
}

const LINK =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white hover:bg-blue-700';
const OFF = 'text-gray-400 dark:text-gray-500';

/**
 * The union return type is the point: a gap is not page -1 or page 0, it is a
 * different kind of thing, and \`typeof item === 'number'\` then narrows it at
 * the one place that cares. Encoding gaps as sentinel numbers is how these
 * components end up rendering a link to page NaN.
 */
export function pageRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PageItem[] {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range: PageItem[] = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  siblingCount = 1,
  ariaLabel = 'Pagination',
  className = '',
}: PaginationProps): JSX.Element {
  const range = pageRange(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex list-none flex-wrap items-center justify-center gap-1 p-0">
        <li>
          {currentPage > 1 ? (
            <a href={buildHref(currentPage - 1)} className={\`\${LINK} \${REST}\`}>
              Previous
            </a>
          ) : (
            <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
              Previous
            </a>
          )}
        </li>

        {range.map((item: PageItem): ReactElement => (
          typeof item === 'number' ? (
            <li key={item}>
              <a
                href={buildHref(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                className={\`\${LINK} \${item === currentPage ? CURRENT : REST}\`}
              >
                {item}
              </a>
            </li>
          ) : (
            <li key={item}>
              <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">
                &hellip;
              </span>
            </li>
          )
        ))}

        <li>
          {currentPage < totalPages ? (
            <a href={buildHref(currentPage + 1)} className={\`\${LINK} \${REST}\`}>
              Next
            </a>
          ) : (
            <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
              Next
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-prev-next',
    category: 'pagination',
    tags: ['pagination', 'prev-next', 'minimal', 'navigation', 'status'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-29',
    updatedAt: '2026-06-21',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1310, copies: 388, downloads: 92 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'text', labelKey: 'text' },
    ],
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '10' },
      {
        name: 'buildHref',
        type: '(page: number) => string',
        required: true,
        descriptionKey: 'buildHref',
        example: "(page) => '?page=' + page",
      },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  No number list at all - two links and a position readout. Worth preferring
  over numbered pages when the total is unknown or unstable (a live feed, a
  cursor-paged API), because a numbered strip promises a page 7 that may not
  exist by the time it is clicked.

  "Page 3 of 10" is a real text node between the two links, not a title
  attribute, so it is the accessible answer to "where am I" - the piece a
  bare Previous/Next pair is usually missing.
-->
<nav class="prevnext" aria-label="Pagination">
  <a class="prevnext__link" href="?page=2" rel="prev">
    <svg class="prevnext__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m15 18-6-6 6-6" />
    </svg>
    Previous
  </a>

  <p class="prevnext__status" aria-live="polite">Page 3 of 10</p>

  <a class="prevnext__link" href="?page=4" rel="next">
    Next
    <svg class="prevnext__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m9 18 6-6-6-6" />
    </svg>
  </a>
</nav>`,
      css: `.prevnext {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  max-width: 28rem;
}

.prevnext__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 2.5rem;
  padding: 0 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 150ms, color 150ms;
}

.prevnext__link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.prevnext__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * The disabled end of the pair. Dropping the href is what actually disables it
 * - the styling below only makes that visible. Restoring pointer-events here
 * would do nothing, since there is no navigation left to trigger.
 */
.prevnext__link--disabled {
  border-color: #e5e7eb;
  color: #9ca3af;
  cursor: default;
}

.prevnext__link--disabled:hover {
  background-color: transparent;
  color: #9ca3af;
}

.prevnext__icon {
  width: 1rem;
  height: 1rem;
}

.prevnext__status {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

/*
 * Both links are transparent at rest and the readout is bare text, so all three
 * inherit the page background and all three need re-tuning. #6b7280 clears
 * 4.5:1 on white but not on #030712, hence the lift to #9ca3af for the status
 * line and the matching drop for the disabled link.
 */
@media (prefers-color-scheme: dark) {
  .prevnext__link {
    border-color: #374151;
    color: #d1d5db;
  }

  .prevnext__link:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .prevnext__link:focus-visible {
    outline-color: #60a5fa;
  }

  .prevnext__link--disabled,
  .prevnext__link--disabled:hover {
    border-color: #1f2937;
    color: #6b7280;
    background-color: transparent;
  }

  .prevnext__status {
    color: #9ca3af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .prevnext__link {
    transition: none;
  }
}`,
      tailwind: `<nav aria-label="Pagination" class="flex w-full max-w-md items-center justify-between gap-4">
  <a
    href="?page=2"
    rel="prev"
    class="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m15 18-6-6 6-6" />
    </svg>
    Previous
  </a>

  <p class="m-0 text-sm tabular-nums text-gray-500 dark:text-gray-400" aria-live="polite">Page 3 of 10</p>

  <a
    href="?page=4"
    rel="next"
    class="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Next
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m9 18 6-6-6-6" />
    </svg>
  </a>
</nav>`,
      react: `const LINK =
  'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

function Chevron({ direction }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function PrevNextPagination({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={\`flex w-full max-w-md items-center justify-between gap-4 \${className}\`}>
      {hasPrev ? (
        <a href={buildHref(currentPage - 1)} rel="prev" className={\`\${LINK} \${REST}\`}>
          <Chevron direction="prev" />
          Previous
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          <Chevron direction="prev" />
          Previous
        </a>
      )}

      {/* Polite, not assertive: the position changes as a result of the user's
          own click, so it should land after whatever they are already hearing
          rather than interrupt it. */}
      <p className="m-0 text-sm tabular-nums text-gray-500 dark:text-gray-400" aria-live="polite">
        Page {currentPage} of {totalPages}
      </p>

      {hasNext ? (
        <a href={buildHref(currentPage + 1)} rel="next" className={\`\${LINK} \${REST}\`}>
          Next
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          Next
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}`,
      nextjs: `interface PrevNextPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const LINK =
  'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

function Chevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

/**
 * No 'use client' - the page number lives in the URL, so this is a Server
 * Component and ships no JavaScript. rel="prev"/"next" is not decoration: it
 * tells crawlers and reader modes how the sequence is ordered.
 */
export function PrevNextPagination({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: PrevNextPaginationProps) {
  return (
    <nav aria-label={ariaLabel} className={\`flex w-full max-w-md items-center justify-between gap-4 \${className}\`}>
      {currentPage > 1 ? (
        <a href={buildHref(currentPage - 1)} rel="prev" className={\`\${LINK} \${REST}\`}>
          <Chevron direction="prev" />
          Previous
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          <Chevron direction="prev" />
          Previous
        </a>
      )}

      <p className="m-0 text-sm tabular-nums text-gray-500 dark:text-gray-400" aria-live="polite">
        Page {currentPage} of {totalPages}
      </p>

      {currentPage < totalPages ? (
        <a href={buildHref(currentPage + 1)} rel="next" className={\`\${LINK} \${REST}\`}>
          Next
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          Next
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}`,
      typescript: `export interface PrevNextPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const LINK =
  'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

function Chevron({ direction }: { direction: 'prev' | 'next' }): JSX.Element {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function PrevNextPagination({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: PrevNextPaginationProps): JSX.Element {
  return (
    <nav aria-label={ariaLabel} className={\`flex w-full max-w-md items-center justify-between gap-4 \${className}\`}>
      {currentPage > 1 ? (
        <a href={buildHref(currentPage - 1)} rel="prev" className={\`\${LINK} \${REST}\`}>
          <Chevron direction="prev" />
          Previous
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          <Chevron direction="prev" />
          Previous
        </a>
      )}

      <p className="m-0 text-sm tabular-nums text-gray-500 dark:text-gray-400" aria-live="polite">
        Page {currentPage} of {totalPages}
      </p>

      {currentPage < totalPages ? (
        <a href={buildHref(currentPage + 1)} rel="next" className={\`\${LINK} \${REST}\`}>
          Next
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          Next
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-load-more',
    category: 'pagination',
    tags: ['pagination', 'load-more', 'aria-live', 'append', 'progressive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-18',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1540, copies: 431, downloads: 118 },
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'loading', labelKey: 'loading' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'items', type: 'Result[]', required: true, descriptionKey: 'items' },
      { name: 'total', type: 'number', required: true, descriptionKey: 'totalItems', example: '12' },
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
      { name: 'onLoadMore', type: '() => void', descriptionKey: 'onLoadMore' },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The status line is the whole point of this component. Appending rows to a list
  is a silent DOM mutation: a sighted user sees the page grow, a screen-reader
  user hears nothing at all and has no way to know the button worked. The
  aria-live region turns "12 more rows appeared somewhere above you" into a
  sentence.

  It must be in the DOM on first paint and stay there - a live region injected
  at the same moment its text changes is not announced by most screen readers,
  which is the single most common way this pattern is got wrong.
-->
<div class="feed">
  <ul class="feed__list" id="feed-list">
    <li class="feed__item"><span class="feed__title">Quarterly revenue report</span><span class="feed__meta">Finance</span></li>
    <li class="feed__item"><span class="feed__title">Onboarding checklist</span><span class="feed__meta">People</span></li>
    <li class="feed__item"><span class="feed__title">Incident post-mortem</span><span class="feed__meta">Engineering</span></li>
    <li class="feed__item"><span class="feed__title">Brand guidelines</span><span class="feed__meta">Design</span></li>
  </ul>

  <p class="feed__status" id="feed-status" role="status" aria-live="polite">Showing 4 of 12 results</p>

  <nav aria-label="Pagination">
    <button class="feed__more" id="feed-more" type="button">Load more</button>
  </nav>
</div>

<script>
  (function () {
    var PAGE_SIZE = 4;
    var TOTAL = 12;
    var list = document.getElementById('feed-list');
    var status = document.getElementById('feed-status');
    var button = document.getElementById('feed-more');

    var REMAINING = [
      { title: 'Security review', meta: 'Engineering' },
      { title: 'Pricing experiment', meta: 'Growth' },
      { title: 'Support playbook', meta: 'Success' },
      { title: 'Hiring plan', meta: 'People' },
      { title: 'Roadmap Q3', meta: 'Product' },
      { title: 'Vendor audit', meta: 'Finance' },
      { title: 'Accessibility audit', meta: 'Design' },
      { title: 'Data retention policy', meta: 'Legal' }
    ];

    var shown = PAGE_SIZE;

    button.addEventListener('click', function () {
      // aria-busy + disabled while the request is in flight, so a second click
      // cannot queue a duplicate page. Swap the timeout for your fetch.
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.textContent = 'Loading…';

      window.setTimeout(function () {
        var next = REMAINING.splice(0, PAGE_SIZE);
        next.forEach(function (row) {
          var li = document.createElement('li');
          li.className = 'feed__item';
          var title = document.createElement('span');
          title.className = 'feed__title';
          title.textContent = row.title;
          var meta = document.createElement('span');
          meta.className = 'feed__meta';
          meta.textContent = row.meta;
          li.appendChild(title);
          li.appendChild(meta);
          list.appendChild(li);
        });

        shown += next.length;
        status.textContent = 'Showing ' + shown + ' of ' + TOTAL + ' results';

        if (shown >= TOTAL) {
          // Kept in the DOM rather than removed: yanking the element the user
          // just activated drops their focus to <body> and loses their place.
          button.textContent = 'All results loaded';
          button.setAttribute('aria-disabled', 'true');
          button.removeAttribute('aria-busy');
          return;
        }

        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = 'Load more';
      }, 600);
    });
  })();
</script>`,
      css: `.feed {
  width: 100%;
  max-width: 28rem;
}

.feed__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.feed__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.feed__item:first-child {
  border-top: 0;
}

.feed__title {
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
}

.feed__meta {
  color: #6b7280;
  font-size: 0.75rem;
}

.feed__status {
  margin: 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.feed__more {
  display: block;
  width: 100%;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
}

.feed__more:hover:not(:disabled):not([aria-disabled='true']) {
  background-color: #f3f4f6;
  color: #111827;
}

.feed__more:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * :disabled is dimmed but NOT given pointer-events: none - the button must stay
 * hoverable so its tooltip and cursor still explain the state, and it stays
 * focusable via aria-disabled in the exhausted case so the user's focus is not
 * thrown to <body> when the last page lands.
 */
.feed__more:disabled,
.feed__more[aria-disabled='true'] {
  opacity: 0.55;
  cursor: default;
}

/*
 * The list is a card with its own #fff-by-default surface inherited from the
 * page, and the row text sits directly on it - so the surface, the hairlines
 * and both text colours all invert. The #6b7280 meta grey clears 4.5:1 on
 * white but not on #030712, which is why it lifts to #9ca3af rather than
 * staying put.
 */
@media (prefers-color-scheme: dark) {
  .feed__list {
    border-color: #1f2937;
  }

  .feed__item {
    border-top-color: #1f2937;
  }

  .feed__title {
    color: #f3f4f6;
  }

  .feed__meta,
  .feed__status {
    color: #9ca3af;
  }

  .feed__more {
    border-color: #374151;
    color: #d1d5db;
  }

  .feed__more:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .feed__more:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feed__more {
    transition: none;
  }
}`,
      tailwind: `<div class="w-full max-w-md">
  <ul class="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Quarterly revenue report</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">Finance</span>
    </li>
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Onboarding checklist</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">People</span>
    </li>
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Incident post-mortem</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">Engineering</span>
    </li>
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Brand guidelines</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">Design</span>
    </li>
  </ul>

  <p class="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
    Showing 4 of 12 results
  </p>

  <nav aria-label="Pagination">
    <button
      type="button"
      class="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Load more
    </button>
  </nav>
</div>`,
      react: `import { useState } from 'react';

export function LoadMorePagination({
  items,
  total,
  loading = false,
  onLoadMore,
  ariaLabel = 'Pagination',
  className = '',
}) {
  const exhausted = items.length >= total;

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <ul className="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</span>
          </li>
        ))}
      </ul>

      {/*
        Rendered unconditionally so it exists before the first append. A live
        region mounted at the same moment its content changes is usually not
        announced - the browser has to be watching it beforehand.
      */}
      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      <nav aria-label={ariaLabel}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading || exhausted}
          aria-busy={loading}
          className="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Loading…' : exhausted ? 'All results loaded' : 'Load more'}
        </button>
      </nav>
    </div>
  );
}

// Usage - the parent owns the data, the component owns the announcement.
export function Example({ allResults }) {
  const [shown, setShown] = useState(4);
  return (
    <LoadMorePagination
      items={allResults.slice(0, shown)}
      total={allResults.length}
      onLoadMore={() => setShown((n) => Math.min(n + 4, allResults.length))}
    />
  );
}`,
      nextjs: `'use client';

interface Result {
  id: string;
  title: string;
  meta: string;
}

interface LoadMorePaginationProps {
  items: Result[];
  total: number;
  loading?: boolean;
  onLoadMore?: () => void;
  ariaLabel?: string;
  className?: string;
}

// 'use client' is required here and not on the numbered pager: this one appends
// to a list held in React state rather than reading a page number out of the
// URL, so it cannot render on the server. If the list can live in the URL,
// prefer the numbered pager and ship no JavaScript at all.
export function LoadMorePagination({
  items,
  total,
  loading = false,
  onLoadMore,
  ariaLabel = 'Pagination',
  className = '',
}: LoadMorePaginationProps) {
  const exhausted = items.length >= total;

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <ul className="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
        {items.map((item: Result) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</span>
          </li>
        ))}
      </ul>

      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      <nav aria-label={ariaLabel}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading || exhausted}
          aria-busy={loading}
          className="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Loading…' : exhausted ? 'All results loaded' : 'Load more'}
        </button>
      </nav>
    </div>
  );
}`,
      typescript: `export interface Result {
  id: string;
  title: string;
  meta: string;
}

export interface LoadMorePaginationProps {
  /** The slice rendered so far - the parent owns the windowing. */
  items: Result[];
  /** Full result count. Drives both the announcement and the exhausted state. */
  total: number;
  loading?: boolean;
  onLoadMore?: () => void;
  ariaLabel?: string;
  className?: string;
}

export function LoadMorePagination({
  items,
  total,
  loading = false,
  onLoadMore,
  ariaLabel = 'Pagination',
  className = '',
}: LoadMorePaginationProps): JSX.Element {
  const exhausted = items.length >= total;
  const label = loading ? 'Loading…' : exhausted ? 'All results loaded' : 'Load more';

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <ul className="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
        {items.map((item: Result) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</span>
          </li>
        ))}
      </ul>

      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      <nav aria-label={ariaLabel}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading || exhausted}
          aria-busy={loading}
          className="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {label}
        </button>
      </nav>
    </div>
  );
}`,
    },
  },
  {
    slug: 'pagination-infinite-sentinel',
    category: 'pagination',
    tags: ['pagination', 'infinite-scroll', 'intersection-observer', 'aria-live', 'sentinel'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1120, copies: 296, downloads: 81 },
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'loading', labelKey: 'loading' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'items', type: 'Result[]', required: true, descriptionKey: 'items' },
      { name: 'total', type: 'number', required: true, descriptionKey: 'totalItems', example: '16' },
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
      { name: 'onLoadMore', type: '() => void', descriptionKey: 'onLoadMore' },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Infinite scroll, built so it is still operable without scrolling.

  Two things make that true. First, the Load more button is REAL and always
  present - the sentinel only clicks it early. Keyboard users never scroll a
  viewport in the way this pattern assumes; strip the button out and the feed
  becomes reachable by mouse wheel and nothing else. Second, the aria-live
  region names the count after every append, because rows arriving unprompted
  are otherwise completely silent.

  rootMargin pre-fetches one viewport ahead so the content is usually there
  before the user reaches the bottom. Widen it to prefetch sooner, at the cost
  of loading pages nobody looks at.
-->
<div class="infeed">
  <ul class="infeed__list" id="infeed-list">
    <li class="infeed__item"><span class="infeed__title">Quarterly revenue report</span><span class="infeed__meta">Finance</span></li>
    <li class="infeed__item"><span class="infeed__title">Onboarding checklist</span><span class="infeed__meta">People</span></li>
    <li class="infeed__item"><span class="infeed__title">Incident post-mortem</span><span class="infeed__meta">Engineering</span></li>
    <li class="infeed__item"><span class="infeed__title">Brand guidelines</span><span class="infeed__meta">Design</span></li>
  </ul>

  <div class="infeed__sentinel" id="infeed-sentinel" aria-hidden="true"></div>

  <p class="infeed__status" id="infeed-status" role="status" aria-live="polite">Showing 4 of 16 results</p>

  <nav aria-label="Pagination">
    <button class="infeed__more" id="infeed-more" type="button">Load more</button>
  </nav>
</div>

<script>
  (function () {
    var PAGE_SIZE = 4;
    var TOTAL = 16;
    var list = document.getElementById('infeed-list');
    var status = document.getElementById('infeed-status');
    var button = document.getElementById('infeed-more');
    var sentinel = document.getElementById('infeed-sentinel');

    var REMAINING = [
      { title: 'Security review', meta: 'Engineering' },
      { title: 'Pricing experiment', meta: 'Growth' },
      { title: 'Support playbook', meta: 'Success' },
      { title: 'Hiring plan', meta: 'People' },
      { title: 'Roadmap Q3', meta: 'Product' },
      { title: 'Vendor audit', meta: 'Finance' },
      { title: 'Accessibility audit', meta: 'Design' },
      { title: 'Data retention policy', meta: 'Legal' },
      { title: 'Latency budget', meta: 'Engineering' },
      { title: 'Partner agreement', meta: 'Legal' },
      { title: 'Churn analysis', meta: 'Growth' },
      { title: 'Design tokens v2', meta: 'Design' }
    ];

    var shown = PAGE_SIZE;
    var busy = false;

    function loadMore() {
      if (busy || shown >= TOTAL) return;
      busy = true;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.textContent = 'Loading…';

      window.setTimeout(function () {
        var next = REMAINING.splice(0, PAGE_SIZE);
        next.forEach(function (row) {
          var li = document.createElement('li');
          li.className = 'infeed__item';
          var title = document.createElement('span');
          title.className = 'infeed__title';
          title.textContent = row.title;
          var meta = document.createElement('span');
          meta.className = 'infeed__meta';
          meta.textContent = row.meta;
          li.appendChild(title);
          li.appendChild(meta);
          list.appendChild(li);
        });

        shown += next.length;
        status.textContent = 'Showing ' + shown + ' of ' + TOTAL + ' results';
        busy = false;
        button.removeAttribute('aria-busy');

        if (shown >= TOTAL) {
          button.textContent = 'All results loaded';
          button.setAttribute('aria-disabled', 'true');
          observer.disconnect();
          return;
        }

        button.disabled = false;
        button.textContent = 'Load more';
      }, 600);
    }

    // The observer is a convenience layer over the button, not a replacement
    // for it - both paths call the same loadMore().
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0] && entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(sentinel);
    button.addEventListener('click', loadMore);
  })();
</script>`,
      css: `.infeed {
  width: 100%;
  max-width: 28rem;
}

.infeed__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.infeed__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.infeed__item:first-child {
  border-top: 0;
}

.infeed__title {
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
}

.infeed__meta {
  color: #6b7280;
  font-size: 0.75rem;
}

/*
 * A zero-height trip wire. It must have layout - display: none or height: 0
 * with no box would never intersect and the observer would sit silent forever -
 * so it gets 1px and is hidden from assistive tech instead, since it is a
 * scroll-position implementation detail and not content.
 */
.infeed__sentinel {
  height: 1px;
}

.infeed__status {
  margin: 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.infeed__more {
  display: block;
  width: 100%;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
}

.infeed__more:hover:not(:disabled):not([aria-disabled='true']) {
  background-color: #f3f4f6;
  color: #111827;
}

.infeed__more:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.infeed__more:disabled,
.infeed__more[aria-disabled='true'] {
  opacity: 0.55;
  cursor: default;
}

/*
 * Same reasoning as the load-more feed: the card surface, its hairlines and the
 * row text all inherit the page background, so all of them invert. The sentinel
 * has no paint of its own and needs nothing here.
 */
@media (prefers-color-scheme: dark) {
  .infeed__list {
    border-color: #1f2937;
  }

  .infeed__item {
    border-top-color: #1f2937;
  }

  .infeed__title {
    color: #f3f4f6;
  }

  .infeed__meta,
  .infeed__status {
    color: #9ca3af;
  }

  .infeed__more {
    border-color: #374151;
    color: #d1d5db;
  }

  .infeed__more:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .infeed__more:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .infeed__more {
    transition: none;
  }
}`,
      tailwind: `<div class="w-full max-w-md">
  <ul class="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Quarterly revenue report</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">Finance</span>
    </li>
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Onboarding checklist</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">People</span>
    </li>
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Incident post-mortem</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">Engineering</span>
    </li>
    <li class="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800">
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Brand guidelines</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">Design</span>
    </li>
  </ul>

  <!-- h-px, not hidden: an element with no box never intersects. -->
  <div class="h-px" aria-hidden="true"></div>

  <p class="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
    Showing 4 of 16 results
  </p>

  <nav aria-label="Pagination">
    <button
      type="button"
      class="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Load more
    </button>
  </nav>
</div>`,
      react: `import { useEffect, useRef } from 'react';

export function InfinitePagination({
  items,
  total,
  loading = false,
  onLoadMore,
  ariaLabel = 'Pagination',
  className = '',
}) {
  const sentinelRef = useRef(null);
  const exhausted = items.length >= total;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || exhausted || loading) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore?.();
      },
      // One viewport of lead time, so the next page usually lands before the
      // user reaches the end of this one.
      { rootMargin: '200px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // Re-subscribing on every load is deliberate: the sentinel may still be on
    // screen after an append, and a live observer would fire once, not again.
  }, [items.length, exhausted, loading, onLoadMore]);

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <ul className="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</span>
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      {/* Not a fallback - the primary control. The observer is the shortcut. */}
      <nav aria-label={ariaLabel}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading || exhausted}
          aria-busy={loading}
          className="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Loading…' : exhausted ? 'All results loaded' : 'Load more'}
        </button>
      </nav>
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef } from 'react';

interface Result {
  id: string;
  title: string;
  meta: string;
}

interface InfinitePaginationProps {
  items: Result[];
  total: number;
  loading?: boolean;
  onLoadMore?: () => void;
  ariaLabel?: string;
  className?: string;
}

export function InfinitePagination({
  items,
  total,
  loading = false,
  onLoadMore,
  ariaLabel = 'Pagination',
  className = '',
}: InfinitePaginationProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const exhausted = items.length >= total;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || exhausted || loading) return undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) onLoadMore?.();
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [items.length, exhausted, loading, onLoadMore]);

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <ul className="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
        {items.map((item: Result) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</span>
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      <nav aria-label={ariaLabel}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading || exhausted}
          aria-busy={loading}
          className="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Loading…' : exhausted ? 'All results loaded' : 'Load more'}
        </button>
      </nav>
    </div>
  );
}`,
      typescript: `import { useEffect, useRef } from 'react';

export interface Result {
  id: string;
  title: string;
  meta: string;
}

export interface InfinitePaginationProps {
  items: Result[];
  total: number;
  loading?: boolean;
  onLoadMore?: () => void;
  /**
   * Scroll container the sentinel is measured against. Omit to use the
   * viewport. Pass it when the feed scrolls inside a panel - the default root
   * is the viewport, so a sentinel inside an overflow container is judged
   * against the wrong box and either never fires or fires immediately.
   */
  root?: Element | null;
  ariaLabel?: string;
  className?: string;
}

export function InfinitePagination({
  items,
  total,
  loading = false,
  onLoadMore,
  root = null,
  ariaLabel = 'Pagination',
  className = '',
}: InfinitePaginationProps): JSX.Element {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const exhausted = items.length >= total;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || exhausted || loading) return undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) onLoadMore?.();
      },
      { root, rootMargin: '200px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [items.length, exhausted, loading, onLoadMore, root]);

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <ul className="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
        {items.map((item: Result) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</span>
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      <nav aria-label={ariaLabel}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading || exhausted}
          aria-busy={loading}
          className="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Loading…' : exhausted ? 'All results loaded' : 'Load more'}
        </button>
      </nav>
    </div>
  );
}`,
    },
  },
  {
    slug: 'pagination-with-page-size',
    category: 'pagination',
    tags: ['pagination', 'page-size', 'select', 'table-footer', 'range'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-30',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 940, copies: 251, downloads: 66 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '1' },
      { name: 'pageSize', type: 'number', required: true, descriptionKey: 'pageSize', example: '10' },
      { name: 'totalItems', type: 'number', required: true, descriptionKey: 'totalItems', example: '48' },
      {
        name: 'buildHref',
        type: '(page: number, pageSize: number) => string',
        required: true,
        descriptionKey: 'buildHref',
        example: "(page, size) => '?page=' + page + '&pageSize=' + size",
      },
      { name: 'onPageSizeChange', type: '(pageSize: number) => void', descriptionKey: 'onPageSizeChange' },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The bar that sits under a data table: a range readout, a rows-per-page select
  and the two step links.

  The select is a real <select> with a real <label for>, not a custom listbox.
  Native gets the mobile wheel picker, type-ahead and the platform's own
  keyboard model for free, and none of that is worth rebuilding for a control
  with four options.

  Changing the size navigates rather than mutating in place, and resets to
  page 1 - page 5 of a 10-per-page list is nowhere in particular once the size
  becomes 50, and silently landing the user somewhere unrelated is worse than
  sending them to the top.
-->
<nav class="pgsize" aria-label="Pagination">
  <p class="pgsize__range" role="status" aria-live="polite">Showing 1&ndash;10 of 48</p>

  <div class="pgsize__controls">
    <label class="pgsize__label" for="page-size">Rows per page</label>
    <select class="pgsize__select" id="page-size" name="pageSize">
      <option value="10" selected>10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>

    <a class="pgsize__step pgsize__step--disabled" aria-disabled="true">Previous</a>
    <a class="pgsize__step" href="?page=2&amp;pageSize=10" rel="next">Next</a>
  </div>
</nav>

<script>
  (function () {
    var select = document.getElementById('page-size');

    // No JS? The select still submits with its form, or the server reads the
    // default. This only upgrades the interaction; it does not enable it.
    select.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('pageSize', select.value);
      url.searchParams.set('page', '1');
      window.location.assign(url.toString());
    });
  })();
</script>`,
      css: `.pgsize {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  width: 100%;
  max-width: 32rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.pgsize__range {
  margin: 0;
  color: #374151;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.pgsize__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.pgsize__label {
  color: #6b7280;
  font-size: 0.875rem;
  /* Visible, not sr-only: a bare "10" beside two arrows is a riddle for
     everyone, not only screen-reader users. */
  white-space: nowrap;
}

.pgsize__select {
  height: 2.5rem;
  padding: 0 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #111827;
  font-size: 0.875rem;
}

.pgsize__select:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.pgsize__step {
  display: inline-flex;
  align-items: center;
  height: 2.5rem;
  padding: 0 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 150ms, color 150ms;
}

.pgsize__step:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.pgsize__step:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.pgsize__step--disabled {
  border-color: #e5e7eb;
  color: #9ca3af;
  cursor: default;
}

.pgsize__step--disabled:hover {
  background-color: transparent;
  color: #9ca3af;
}

/*
 * The bar is a transparent card - its border, the range text, the select chrome
 * and both step links all read against the page background, so every one of
 * them is re-tuned. The select keeps a transparent background so it picks up
 * the surface it is dropped onto rather than punching a light rectangle into a
 * dark table footer; color-scheme is what makes the native dropdown itself
 * follow.
 */
@media (prefers-color-scheme: dark) {
  .pgsize {
    border-color: #1f2937;
    color-scheme: dark;
  }

  .pgsize__range {
    color: #d1d5db;
  }

  .pgsize__label {
    color: #9ca3af;
  }

  .pgsize__select {
    border-color: #374151;
    color: #f3f4f6;
  }

  .pgsize__step {
    border-color: #374151;
    color: #d1d5db;
  }

  .pgsize__step:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .pgsize__select:focus-visible,
  .pgsize__step:focus-visible {
    outline-color: #60a5fa;
  }

  .pgsize__step--disabled,
  .pgsize__step--disabled:hover {
    border-color: #1f2937;
    color: #6b7280;
    background-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pgsize__step {
    transition: none;
  }
}`,
      tailwind: `<nav
  aria-label="Pagination"
  class="flex w-full max-w-lg flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800 dark:[color-scheme:dark]"
>
  <p class="m-0 text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
    Showing 1&ndash;10 of 48
  </p>

  <div class="flex flex-wrap items-center gap-2">
    <label class="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" for="page-size">Rows per page</label>
    <select
      id="page-size"
      name="pageSize"
      class="h-10 rounded-md border border-gray-300 bg-transparent px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <option value="10" selected>10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>

    <a
      aria-disabled="true"
      class="inline-flex h-10 items-center rounded-md border border-gray-200 px-2.5 text-sm font-medium text-gray-400 dark:border-gray-800 dark:text-gray-500"
    >
      Previous
    </a>
    <a
      href="?page=2&amp;pageSize=10"
      rel="next"
      class="inline-flex h-10 items-center rounded-md border border-gray-300 px-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Next
    </a>
  </div>
</nav>`,
      react: `const STEP =
  'inline-flex h-10 items-center rounded-md border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

const PAGE_SIZES = [10, 25, 50, 100];

export function PageSizePagination({
  currentPage,
  pageSize,
  totalItems,
  buildHref,
  onPageSizeChange,
  ariaLabel = 'Pagination',
  className = '',
}) {
  // Derived, never stored. A totalPages held in state is a second source of
  // truth that drifts the moment pageSize changes under it.
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label={ariaLabel}
      className={\`flex w-full max-w-lg flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800 dark:[color-scheme:dark] \${className}\`}
    >
      <p className="m-0 text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        Showing {first}&ndash;{last} of {totalItems}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" htmlFor="page-size">
          Rows per page
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          className="h-10 rounded-md border border-gray-300 bg-transparent px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {currentPage > 1 ? (
          <a href={buildHref(currentPage - 1, pageSize)} rel="prev" className={\`\${STEP} \${REST}\`}>
            Previous
          </a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>
            Previous
          </a>
        )}

        {currentPage < totalPages ? (
          <a href={buildHref(currentPage + 1, pageSize)} rel="next" className={\`\${STEP} \${REST}\`}>
            Next
          </a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>
            Next
          </a>
        )}
      </div>
    </nav>
  );
}`,
      nextjs: `'use client';

interface PageSizePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  buildHref: (page: number, pageSize: number) => string;
  onPageSizeChange?: (pageSize: number) => void;
  ariaLabel?: string;
  className?: string;
}

const STEP =
  'inline-flex h-10 items-center rounded-md border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

const PAGE_SIZES = [10, 25, 50, 100];

/**
 * 'use client' only for the select's onChange. Everything else - the range, the
 * step links - is derived from props and would render on the server happily.
 * Wire the select to a form GET or a router.push and the boundary disappears.
 */
export function PageSizePagination({
  currentPage,
  pageSize,
  totalItems,
  buildHref,
  onPageSizeChange,
  ariaLabel = 'Pagination',
  className = '',
}: PageSizePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label={ariaLabel}
      className={\`flex w-full max-w-lg flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800 dark:[color-scheme:dark] \${className}\`}
    >
      <p className="m-0 text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        Showing {first}&ndash;{last} of {totalItems}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" htmlFor="page-size">
          Rows per page
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          className="h-10 rounded-md border border-gray-300 bg-transparent px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {PAGE_SIZES.map((size: number) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {currentPage > 1 ? (
          <a href={buildHref(currentPage - 1, pageSize)} rel="prev" className={\`\${STEP} \${REST}\`}>
            Previous
          </a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>
            Previous
          </a>
        )}

        {currentPage < totalPages ? (
          <a href={buildHref(currentPage + 1, pageSize)} rel="next" className={\`\${STEP} \${REST}\`}>
            Next
          </a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>
            Next
          </a>
        )}
      </div>
    </nav>
  );
}`,
      typescript: `import type { ChangeEvent } from 'react';

export interface PageSizePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  /** Both arguments matter: changing the size must reset the page to 1. */
  buildHref: (page: number, pageSize: number) => string;
  onPageSizeChange?: (pageSize: number) => void;
  ariaLabel?: string;
  className?: string;
}

const STEP =
  'inline-flex h-10 items-center rounded-md border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

const PAGE_SIZES: readonly number[] = [10, 25, 50, 100];

export function PageSizePagination({
  currentPage,
  pageSize,
  totalItems,
  buildHref,
  onPageSizeChange,
  ariaLabel = 'Pagination',
  className = '',
}: PageSizePaginationProps): JSX.Element {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label={ariaLabel}
      className={\`flex w-full max-w-lg flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800 dark:[color-scheme:dark] \${className}\`}
    >
      <p className="m-0 text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        Showing {first}&ndash;{last} of {totalItems}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" htmlFor="page-size">
          Rows per page
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onPageSizeChange?.(Number(event.target.value))
          }
          className="h-10 rounded-md border border-gray-300 bg-transparent px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {PAGE_SIZES.map((size: number) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {currentPage > 1 ? (
          <a href={buildHref(currentPage - 1, pageSize)} rel="prev" className={\`\${STEP} \${REST}\`}>
            Previous
          </a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>
            Previous
          </a>
        )}

        {currentPage < totalPages ? (
          <a href={buildHref(currentPage + 1, pageSize)} rel="next" className={\`\${STEP} \${REST}\`}>
            Next
          </a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>
            Next
          </a>
        )}
      </div>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-compact-dots',
    category: 'pagination',
    tags: ['pagination', 'dots', 'compact', 'navigation', 'aria-current'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '2' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '6' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The visible dot is 10px, but each dot is wrapped in a 40px-square link so the
  tap target clears the minimum - the small mark is decoration, the hit area is
  the control. aria-current + a wider filled dot carry "you are here" to both a
  screen reader and a colour-blind user.
-->
<nav aria-label="Pagination" class="flex items-center justify-center gap-1">
  <a href="?page=1" rel="prev" aria-label="Previous page" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
  </a>
  <span class="flex flex-wrap items-center justify-center">
    <a href="?page=1" aria-label="Go to page 1" class="group inline-flex h-10 w-10 items-center justify-center focus-visible:outline-none">
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 transition-all group-hover:bg-gray-400 group-focus-visible:ring-2 group-focus-visible:ring-blue-600 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-gray-600 dark:group-hover:bg-gray-500 dark:group-focus-visible:ring-blue-400 dark:group-focus-visible:ring-offset-gray-900"></span>
    </a>
    <a href="?page=2" aria-current="page" aria-label="Go to page 2, current page" class="group inline-flex h-10 w-10 items-center justify-center focus-visible:outline-none">
      <span class="h-2.5 w-5 rounded-full bg-blue-600 transition-all group-focus-visible:ring-2 group-focus-visible:ring-blue-600 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-blue-500 dark:group-focus-visible:ring-blue-400 dark:group-focus-visible:ring-offset-gray-900"></span>
    </a>
    <a href="?page=3" aria-label="Go to page 3" class="group inline-flex h-10 w-10 items-center justify-center focus-visible:outline-none">
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 transition-all group-hover:bg-gray-400 group-focus-visible:ring-2 group-focus-visible:ring-blue-600 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-gray-600 dark:group-hover:bg-gray-500 dark:group-focus-visible:ring-blue-400 dark:group-focus-visible:ring-offset-gray-900"></span>
    </a>
  </span>
  <a href="?page=3" rel="next" aria-label="Next page" class="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
  </a>
</nav>`,
      react: `const ARROW =
  'inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const ARROW_ON = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const ARROW_OFF = 'text-gray-300 dark:text-gray-700';
const DOT =
  'h-2.5 rounded-full transition-all group-focus-visible:ring-2 group-focus-visible:ring-blue-600 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white motion-reduce:transition-none dark:group-focus-visible:ring-blue-400 dark:group-focus-visible:ring-offset-gray-900';

function Chevron({ direction }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function CompactDotsPagination({ currentPage, totalPages, buildHref, ariaLabel = 'Pagination', className = '' }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label={ariaLabel} className={\`flex items-center justify-center gap-1 \${className}\`}>
      {currentPage > 1 ? (
        <a href={buildHref(currentPage - 1)} rel="prev" aria-label="Previous page" className={\`\${ARROW} \${ARROW_ON}\`}>
          <Chevron direction="prev" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={\`\${ARROW} \${ARROW_OFF}\`}>
          <Chevron direction="prev" />
        </a>
      )}

      <span className="flex flex-wrap items-center justify-center">
        {pages.map((page) => {
          const current = page === currentPage;
          return (
            <a
              key={page}
              href={buildHref(page)}
              aria-current={current ? 'page' : undefined}
              aria-label={current ? \`Go to page \${page}, current page\` : \`Go to page \${page}\`}
              className="group inline-flex h-10 w-10 items-center justify-center focus-visible:outline-none"
            >
              <span className={\`\${DOT} \${current ? 'w-5 bg-blue-600 dark:bg-blue-500' : 'w-2.5 bg-gray-300 group-hover:bg-gray-400 dark:bg-gray-600 dark:group-hover:bg-gray-500'}\`} />
            </a>
          );
        })}
      </span>

      {currentPage < totalPages ? (
        <a href={buildHref(currentPage + 1)} rel="next" aria-label="Next page" className={\`\${ARROW} \${ARROW_ON}\`}>
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={\`\${ARROW} \${ARROW_OFF}\`}>
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}`,
      typescript: `export interface CompactDotsPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Must return a real URL - a dot is still a link, not a scripted jump. */
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const ARROW =
  'inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const ARROW_ON = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const ARROW_OFF = 'text-gray-300 dark:text-gray-700';
const DOT =
  'h-2.5 rounded-full transition-all group-focus-visible:ring-2 group-focus-visible:ring-blue-600 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white motion-reduce:transition-none dark:group-focus-visible:ring-blue-400 dark:group-focus-visible:ring-offset-gray-900';

function Chevron({ direction }: { direction: 'prev' | 'next' }): JSX.Element {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function CompactDotsPagination({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: CompactDotsPaginationProps): JSX.Element {
  const pages: number[] = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label={ariaLabel} className={\`flex items-center justify-center gap-1 \${className}\`}>
      {currentPage > 1 ? (
        <a href={buildHref(currentPage - 1)} rel="prev" aria-label="Previous page" className={\`\${ARROW} \${ARROW_ON}\`}>
          <Chevron direction="prev" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={\`\${ARROW} \${ARROW_OFF}\`}>
          <Chevron direction="prev" />
        </a>
      )}

      <span className="flex flex-wrap items-center justify-center">
        {pages.map((page: number) => {
          const current = page === currentPage;
          return (
            <a
              key={page}
              href={buildHref(page)}
              aria-current={current ? 'page' : undefined}
              aria-label={current ? \`Go to page \${page}, current page\` : \`Go to page \${page}\`}
              className="group inline-flex h-10 w-10 items-center justify-center focus-visible:outline-none"
            >
              <span className={\`\${DOT} \${current ? 'w-5 bg-blue-600 dark:bg-blue-500' : 'w-2.5 bg-gray-300 group-hover:bg-gray-400 dark:bg-gray-600 dark:group-hover:bg-gray-500'}\`} />
            </a>
          );
        })}
      </span>

      {currentPage < totalPages ? (
        <a href={buildHref(currentPage + 1)} rel="next" aria-label="Next page" className={\`\${ARROW} \${ARROW_ON}\`}>
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={\`\${ARROW} \${ARROW_OFF}\`}>
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-rounded-pills',
    category: 'pagination',
    tags: ['pagination', 'pills', 'rounded', 'ellipsis', 'links'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '10' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'siblingCount', type: 'number', default: '1', descriptionKey: 'siblingCount' },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<nav aria-label="Pagination">
  <ul class="flex list-none flex-wrap items-center justify-center gap-1.5 p-0">
    <li><a href="?page=1" aria-current="page" class="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-blue-600 px-3 text-sm font-semibold tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">1</a></li>
    <li><a href="?page=2" class="inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">2</a></li>
    <li><a href="?page=3" class="inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">3</a></li>
    <li><span class="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">&hellip;</span></li>
    <li><a href="?page=10" class="inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">10</a></li>
  </ul>
</nav>`,
      react: `const PILL =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white';

function pageRange(currentPage, totalPages, siblingCount = 1) {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export function RoundedPillsPagination({ currentPage, totalPages, buildHref, siblingCount = 1, ariaLabel = 'Pagination', className = '' }) {
  const range = pageRange(currentPage, totalPages, siblingCount);
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex list-none flex-wrap items-center justify-center gap-1.5 p-0">
        {range.map((item) =>
          typeof item === 'string' ? (
            <li key={item}>
              <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">&hellip;</span>
            </li>
          ) : (
            <li key={item}>
              <a href={buildHref(item)} aria-current={item === currentPage ? 'page' : undefined} className={\`\${PILL} \${item === currentPage ? CURRENT : REST}\`}>
                {item}
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}`,
      typescript: `import type { ReactElement } from 'react';

export type PageItem = number | 'gap-start' | 'gap-end';

export interface RoundedPillsPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  siblingCount?: number;
  ariaLabel?: string;
  className?: string;
}

const PILL =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white';

export function pageRange(currentPage: number, totalPages: number, siblingCount = 1): PageItem[] {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range: PageItem[] = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export function RoundedPillsPagination({
  currentPage,
  totalPages,
  buildHref,
  siblingCount = 1,
  ariaLabel = 'Pagination',
  className = '',
}: RoundedPillsPaginationProps): JSX.Element {
  const range = pageRange(currentPage, totalPages, siblingCount);
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex list-none flex-wrap items-center justify-center gap-1.5 p-0">
        {range.map((item: PageItem): ReactElement =>
          typeof item === 'number' ? (
            <li key={item}>
              <a href={buildHref(item)} aria-current={item === currentPage ? 'page' : undefined} className={\`\${PILL} \${item === currentPage ? CURRENT : REST}\`}>
                {item}
              </a>
            </li>
          ) : (
            <li key={item}>
              <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">&hellip;</span>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-arrows-only',
    category: 'pagination',
    tags: ['pagination', 'arrows', 'icon', 'first-last', 'minimal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '10' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Icon-only controls, so each carries a text label the icon replaces visually -
  aria-label on the link, and a visually-hidden live status names the position
  for anyone who cannot see the four arrows change state.
-->
<nav aria-label="Pagination" class="inline-flex items-center gap-1">
  <a href="?page=1" aria-label="First page" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg>
  </a>
  <a href="?page=2" rel="prev" aria-label="Previous page" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
  </a>
  <span class="sr-only" role="status" aria-live="polite">Page 3 of 10</span>
  <a href="?page=4" rel="next" aria-label="Next page" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
  </a>
  <a href="?page=10" aria-label="Last page" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m13 17 5-5-5-5" /><path d="m6 17 5-5-5-5" /></svg>
  </a>
</nav>`,
      react: `const BTN =
  'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const ON = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

const ICONS = {
  first: ['m11 17-5-5 5-5', 'm18 17-5-5 5-5'],
  prev: ['m15 18-6-6 6-6'],
  next: ['m9 18 6-6-6-6'],
  last: ['m13 17 5-5-5-5', 'm6 17 5-5-5-5'],
};

function Icon({ name }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICONS[name].map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

function Arrow({ enabled, href, rel, label, name }) {
  return enabled ? (
    <a href={href} rel={rel} aria-label={label} className={\`\${BTN} \${ON}\`}><Icon name={name} /></a>
  ) : (
    <a aria-disabled="true" aria-label={label} className={\`\${BTN} \${OFF}\`}><Icon name={name} /></a>
  );
}

export function ArrowsOnlyPagination({ currentPage, totalPages, buildHref, ariaLabel = 'Pagination', className = '' }) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <nav aria-label={ariaLabel} className={\`inline-flex items-center gap-1 \${className}\`}>
      <Arrow enabled={hasPrev} href={buildHref(1)} label="First page" name="first" />
      <Arrow enabled={hasPrev} href={buildHref(currentPage - 1)} rel="prev" label="Previous page" name="prev" />
      <span className="sr-only" role="status" aria-live="polite">Page {currentPage} of {totalPages}</span>
      <Arrow enabled={hasNext} href={buildHref(currentPage + 1)} rel="next" label="Next page" name="next" />
      <Arrow enabled={hasNext} href={buildHref(totalPages)} label="Last page" name="last" />
    </nav>
  );
}`,
      typescript: `type IconName = 'first' | 'prev' | 'next' | 'last';

export interface ArrowsOnlyPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const BTN =
  'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const ON = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

const ICONS: Record<IconName, string[]> = {
  first: ['m11 17-5-5 5-5', 'm18 17-5-5 5-5'],
  prev: ['m15 18-6-6 6-6'],
  next: ['m9 18 6-6-6-6'],
  last: ['m13 17 5-5-5-5', 'm6 17 5-5-5-5'],
};

function Icon({ name }: { name: IconName }): JSX.Element {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICONS[name].map((d: string) => <path key={d} d={d} />)}
    </svg>
  );
}

function Arrow({ enabled, href, rel, label, name }: { enabled: boolean; href: string; rel?: string; label: string; name: IconName }): JSX.Element {
  return enabled ? (
    <a href={href} rel={rel} aria-label={label} className={\`\${BTN} \${ON}\`}><Icon name={name} /></a>
  ) : (
    <a aria-disabled="true" aria-label={label} className={\`\${BTN} \${OFF}\`}><Icon name={name} /></a>
  );
}

export function ArrowsOnlyPagination({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: ArrowsOnlyPaginationProps): JSX.Element {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <nav aria-label={ariaLabel} className={\`inline-flex items-center gap-1 \${className}\`}>
      <Arrow enabled={hasPrev} href={buildHref(1)} label="First page" name="first" />
      <Arrow enabled={hasPrev} href={buildHref(currentPage - 1)} rel="prev" label="Previous page" name="prev" />
      <span className="sr-only" role="status" aria-live="polite">Page {currentPage} of {totalPages}</span>
      <Arrow enabled={hasNext} href={buildHref(currentPage + 1)} rel="next" label="Next page" name="next" />
      <Arrow enabled={hasNext} href={buildHref(totalPages)} label="Last page" name="last" />
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-jump-to-page',
    category: 'pagination',
    tags: ['pagination', 'jump', 'input', 'form', 'interactive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '24' },
      { name: 'onPageChange', type: '(page: number) => void', required: true, descriptionKey: 'onPageChange' },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<nav aria-label="Pagination" class="flex flex-wrap items-center justify-center gap-2">
  <a href="?page=2" rel="prev" class="inline-flex h-10 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Previous</a>

  <form class="flex items-center gap-2" action="" method="get">
    <label for="jump-page" class="text-sm text-gray-600 dark:text-gray-400">Page</label>
    <input id="jump-page" name="page" type="number" inputmode="numeric" min="1" max="24" value="3" class="h-10 w-16 rounded-lg border border-gray-300 bg-transparent px-2 text-center text-sm tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900" />
    <span class="text-sm tabular-nums text-gray-600 dark:text-gray-400">of 24</span>
    <button type="submit" class="inline-flex h-10 items-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Go</button>
  </form>

  <a href="?page=4" rel="next" class="inline-flex h-10 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Next</a>
</nav>`,
      react: `import { useState } from 'react';

const STEP =
  'inline-flex h-10 items-center rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

export function JumpToPagePagination({ currentPage, totalPages, onPageChange, ariaLabel = 'Pagination', className = '' }) {
  const [value, setValue] = useState(String(currentPage));

  function submit(event) {
    event.preventDefault();
    // Clamp on submit rather than trusting the field: min/max on a number input
    // is advisory, not enforced, so a hand-typed 999 must be caught here.
    const next = Math.min(Math.max(1, Math.trunc(Number(value) || currentPage)), totalPages);
    setValue(String(next));
    onPageChange(next);
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={\`flex flex-wrap items-center justify-center gap-2 \${className}\`}>
      <button type="button" disabled={!hasPrev} onClick={() => onPageChange(currentPage - 1)} className={\`\${STEP} \${hasPrev ? REST : OFF} disabled:cursor-default\`}>Previous</button>

      <form className="flex items-center gap-2" onSubmit={submit}>
        <label htmlFor="jump-page" className="text-sm text-gray-600 dark:text-gray-400">Page</label>
        <input
          id="jump-page"
          name="page"
          type="number"
          inputMode="numeric"
          min={1}
          max={totalPages}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-10 w-16 rounded-lg border border-gray-300 bg-transparent px-2 text-center text-sm tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <span className="text-sm tabular-nums text-gray-600 dark:text-gray-400">of {totalPages}</span>
        <button type="submit" className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Go</button>
      </form>

      <button type="button" disabled={!hasNext} onClick={() => onPageChange(currentPage + 1)} className={\`\${STEP} \${hasNext ? REST : OFF} disabled:cursor-default\`}>Next</button>
    </nav>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export interface JumpToPagePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
  className?: string;
}

const STEP =
  'inline-flex h-10 items-center rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

export function JumpToPagePagination({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = 'Pagination',
  className = '',
}: JumpToPagePaginationProps): JSX.Element {
  const [value, setValue] = useState<string>(String(currentPage));

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const next = Math.min(Math.max(1, Math.trunc(Number(value) || currentPage)), totalPages);
    setValue(String(next));
    onPageChange(next);
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={\`flex flex-wrap items-center justify-center gap-2 \${className}\`}>
      <button type="button" disabled={!hasPrev} onClick={() => onPageChange(currentPage - 1)} className={\`\${STEP} \${hasPrev ? REST : OFF} disabled:cursor-default\`}>Previous</button>

      <form className="flex items-center gap-2" onSubmit={submit}>
        <label htmlFor="jump-page" className="text-sm text-gray-600 dark:text-gray-400">Page</label>
        <input
          id="jump-page"
          name="page"
          type="number"
          inputMode="numeric"
          min={1}
          max={totalPages}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
          className="h-10 w-16 rounded-lg border border-gray-300 bg-transparent px-2 text-center text-sm tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <span className="text-sm tabular-nums text-gray-600 dark:text-gray-400">of {totalPages}</span>
        <button type="submit" className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Go</button>
      </form>

      <button type="button" disabled={!hasNext} onClick={() => onPageChange(currentPage + 1)} className={\`\${STEP} \${hasNext ? REST : OFF} disabled:cursor-default\`}>Next</button>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-range-info',
    category: 'pagination',
    tags: ['pagination', 'range', 'results', 'status', 'prev-next'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '2' },
      { name: 'pageSize', type: 'number', required: true, descriptionKey: 'pageSize', example: '10' },
      { name: 'totalItems', type: 'number', required: true, descriptionKey: 'totalItems', example: '240' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<nav aria-label="Pagination" class="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-between">
  <p class="m-0 text-sm tabular-nums text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
    Showing <span class="font-medium text-gray-900 dark:text-gray-100">11&ndash;20</span> of <span class="font-medium text-gray-900 dark:text-gray-100">240</span>
  </p>
  <div class="flex items-center gap-2">
    <a href="?page=1" rel="prev" class="inline-flex h-10 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Previous</a>
    <a href="?page=3" rel="next" class="inline-flex h-10 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Next</a>
  </div>
</nav>`,
      react: `const STEP =
  'inline-flex h-10 items-center rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

export function RangeInfoPagination({ currentPage, pageSize, totalItems, buildHref, ariaLabel = 'Pagination', className = '' }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={\`flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-between \${className}\`}>
      <p className="m-0 text-sm tabular-nums text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
        Showing <span className="font-medium text-gray-900 dark:text-gray-100">{first}&ndash;{last}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <a href={buildHref(currentPage - 1)} rel="prev" className={\`\${STEP} \${REST}\`}>Previous</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Previous</a>
        )}
        {hasNext ? (
          <a href={buildHref(currentPage + 1)} rel="next" className={\`\${STEP} \${REST}\`}>Next</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Next</a>
        )}
      </div>
    </nav>
  );
}`,
      typescript: `export interface RangeInfoPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const STEP =
  'inline-flex h-10 items-center rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

export function RangeInfoPagination({
  currentPage,
  pageSize,
  totalItems,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: RangeInfoPaginationProps): JSX.Element {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={\`flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-between \${className}\`}>
      <p className="m-0 text-sm tabular-nums text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
        Showing <span className="font-medium text-gray-900 dark:text-gray-100">{first}&ndash;{last}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <a href={buildHref(currentPage - 1)} rel="prev" className={\`\${STEP} \${REST}\`}>Previous</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Previous</a>
        )}
        {hasNext ? (
          <a href={buildHref(currentPage + 1)} rel="next" className={\`\${STEP} \${REST}\`}>Next</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Next</a>
        )}
      </div>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-bordered',
    category: 'pagination',
    tags: ['pagination', 'bordered', 'segmented', 'ellipsis', 'links'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '10' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'siblingCount', type: 'number', default: '1', descriptionKey: 'siblingCount' },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  One shared border on the group and divide-x hairlines between cells, so the
  segments read as a single control. overflow-hidden clips the fill of the
  current cell to the rounded corners; overflow-x-auto lets the strip scroll
  rather than overflow the viewport if the range is wide on a narrow screen.
-->
<nav aria-label="Pagination" class="max-w-full overflow-x-auto">
  <ul class="inline-flex list-none divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 p-0 dark:divide-gray-700 dark:border-gray-700">
    <li><a href="?page=1" aria-current="page" class="inline-flex h-10 min-w-10 items-center justify-center bg-blue-600 px-3 text-sm font-semibold tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400">1</a></li>
    <li><a href="?page=2" class="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100">2</a></li>
    <li><a href="?page=3" class="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100">3</a></li>
    <li><span class="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">&hellip;</span></li>
    <li><a href="?page=10" class="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100">10</a></li>
  </ul>
</nav>`,
      react: `const CELL =
  'inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none';
const REST = 'font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white focus-visible:ring-blue-400';

function pageRange(currentPage, totalPages, siblingCount = 1) {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export function BorderedPagination({ currentPage, totalPages, buildHref, siblingCount = 1, ariaLabel = 'Pagination', className = '' }) {
  const range = pageRange(currentPage, totalPages, siblingCount);
  return (
    <nav aria-label={ariaLabel} className={\`max-w-full overflow-x-auto \${className}\`}>
      <ul className="inline-flex list-none divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 p-0 dark:divide-gray-700 dark:border-gray-700">
        {range.map((item) =>
          typeof item === 'string' ? (
            <li key={item}>
              <span className="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">&hellip;</span>
            </li>
          ) : (
            <li key={item}>
              <a href={buildHref(item)} aria-current={item === currentPage ? 'page' : undefined} className={\`\${CELL} \${item === currentPage ? CURRENT : REST}\`}>
                {item}
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}`,
      typescript: `import type { ReactElement } from 'react';

export type PageItem = number | 'gap-start' | 'gap-end';

export interface BorderedPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  siblingCount?: number;
  ariaLabel?: string;
  className?: string;
}

const CELL =
  'inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none';
const REST = 'font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white focus-visible:ring-blue-400';

export function pageRange(currentPage: number, totalPages: number, siblingCount = 1): PageItem[] {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range: PageItem[] = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export function BorderedPagination({
  currentPage,
  totalPages,
  buildHref,
  siblingCount = 1,
  ariaLabel = 'Pagination',
  className = '',
}: BorderedPaginationProps): JSX.Element {
  const range = pageRange(currentPage, totalPages, siblingCount);
  return (
    <nav aria-label={ariaLabel} className={\`max-w-full overflow-x-auto \${className}\`}>
      <ul className="inline-flex list-none divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 p-0 dark:divide-gray-700 dark:border-gray-700">
        {range.map((item: PageItem): ReactElement =>
          typeof item === 'number' ? (
            <li key={item}>
              <a href={buildHref(item)} aria-current={item === currentPage ? 'page' : undefined} className={\`\${CELL} \${item === currentPage ? CURRENT : REST}\`}>
                {item}
              </a>
            </li>
          ) : (
            <li key={item}>
              <span className="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">&hellip;</span>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-simple-count',
    category: 'pagination',
    tags: ['pagination', 'simple', 'count', 'minimal', 'prev-next'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '12' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<nav aria-label="Pagination" class="inline-flex items-center gap-3">
  <a href="?page=2" rel="prev" aria-label="Previous page" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
  </a>
  <span class="text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">Page <span class="font-semibold text-gray-900 dark:text-gray-100">3</span> of 12</span>
  <a href="?page=4" rel="next" aria-label="Next page" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
  </a>
</nav>`,
      react: `const BTN =
  'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const ON = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

function Chevron({ direction }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function SimpleCountPagination({ currentPage, totalPages, buildHref, ariaLabel = 'Pagination', className = '' }) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <nav aria-label={ariaLabel} className={\`inline-flex items-center gap-3 \${className}\`}>
      {hasPrev ? (
        <a href={buildHref(currentPage - 1)} rel="prev" aria-label="Previous page" className={\`\${BTN} \${ON}\`}><Chevron direction="prev" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={\`\${BTN} \${OFF}\`}><Chevron direction="prev" /></a>
      )}
      <span className="text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        Page <span className="font-semibold text-gray-900 dark:text-gray-100">{currentPage}</span> of {totalPages}
      </span>
      {hasNext ? (
        <a href={buildHref(currentPage + 1)} rel="next" aria-label="Next page" className={\`\${BTN} \${ON}\`}><Chevron direction="next" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={\`\${BTN} \${OFF}\`}><Chevron direction="next" /></a>
      )}
    </nav>
  );
}`,
      typescript: `export interface SimpleCountPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const BTN =
  'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const ON = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

function Chevron({ direction }: { direction: 'prev' | 'next' }): JSX.Element {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function SimpleCountPagination({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: SimpleCountPaginationProps): JSX.Element {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <nav aria-label={ariaLabel} className={\`inline-flex items-center gap-3 \${className}\`}>
      {hasPrev ? (
        <a href={buildHref(currentPage - 1)} rel="prev" aria-label="Previous page" className={\`\${BTN} \${ON}\`}><Chevron direction="prev" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={\`\${BTN} \${OFF}\`}><Chevron direction="prev" /></a>
      )}
      <span className="text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        Page <span className="font-semibold text-gray-900 dark:text-gray-100">{currentPage}</span> of {totalPages}
      </span>
      {hasNext ? (
        <a href={buildHref(currentPage + 1)} rel="next" aria-label="Next page" className={\`\${BTN} \${ON}\`}><Chevron direction="next" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={\`\${BTN} \${OFF}\`}><Chevron direction="next" /></a>
      )}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-table-footer',
    category: 'pagination',
    tags: ['pagination', 'table', 'footer', 'range', 'prev-next'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '2' },
      { name: 'pageSize', type: 'number', required: true, descriptionKey: 'pageSize', example: '10' },
      { name: 'totalItems', type: 'number', required: true, descriptionKey: 'totalItems', example: '240' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A footer bar meant to sit under a table: border-t joins it to the grid above,
  and it stacks to two rows under sm so the readout never collides with the
  controls on a phone.
-->
<nav aria-label="Pagination" class="flex w-full flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
  <p class="m-0 text-sm tabular-nums text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
    <span class="font-medium text-gray-900 dark:text-gray-100">11&ndash;20</span> of <span class="font-medium text-gray-900 dark:text-gray-100">240</span>
  </p>
  <div class="flex items-center gap-2">
    <span class="mr-1 text-sm tabular-nums text-gray-500 dark:text-gray-400">Page 2 of 24</span>
    <a href="?page=1" rel="prev" class="inline-flex h-10 items-center rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Previous</a>
    <a href="?page=3" rel="next" class="inline-flex h-10 items-center rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Next</a>
  </div>
</nav>`,
      react: `const STEP =
  'inline-flex h-10 items-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

export function TableFooterPagination({ currentPage, pageSize, totalItems, buildHref, ariaLabel = 'Pagination', className = '' }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={\`flex w-full flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 \${className}\`}>
      <p className="m-0 text-sm tabular-nums text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
        <span className="font-medium text-gray-900 dark:text-gray-100">{first}&ndash;{last}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="mr-1 text-sm tabular-nums text-gray-500 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
        {hasPrev ? (
          <a href={buildHref(currentPage - 1)} rel="prev" className={\`\${STEP} \${REST}\`}>Previous</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Previous</a>
        )}
        {hasNext ? (
          <a href={buildHref(currentPage + 1)} rel="next" className={\`\${STEP} \${REST}\`}>Next</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Next</a>
        )}
      </div>
    </nav>
  );
}`,
      typescript: `export interface TableFooterPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const STEP =
  'inline-flex h-10 items-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

export function TableFooterPagination({
  currentPage,
  pageSize,
  totalItems,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: TableFooterPaginationProps): JSX.Element {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className={\`flex w-full flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 \${className}\`}>
      <p className="m-0 text-sm tabular-nums text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
        <span className="font-medium text-gray-900 dark:text-gray-100">{first}&ndash;{last}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="mr-1 text-sm tabular-nums text-gray-500 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
        {hasPrev ? (
          <a href={buildHref(currentPage - 1)} rel="prev" className={\`\${STEP} \${REST}\`}>Previous</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Previous</a>
        )}
        {hasNext ? (
          <a href={buildHref(currentPage + 1)} rel="next" className={\`\${STEP} \${REST}\`}>Next</a>
        ) : (
          <a aria-disabled="true" className={\`\${STEP} \${OFF}\`}>Next</a>
        )}
      </div>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-cursor-based',
    category: 'pagination',
    tags: ['pagination', 'cursor', 'keyset', 'api', 'prev-next'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'prevCursor', type: 'string | null', required: true, descriptionKey: 'prevCursor' },
      { name: 'nextCursor', type: 'string | null', required: true, descriptionKey: 'nextCursor' },
      { name: 'buildHref', type: '(cursor: string) => string', required: true, descriptionKey: 'buildHref', example: "(cursor) => '?after=' + cursor" },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Cursor pagination has no page numbers to render - the server hands back an
  opaque token for the next and previous slice, and a null token is the only
  signal that an end has been reached. So the control is exactly two links, each
  present only when its cursor exists.
-->
<nav aria-label="Pagination" class="flex items-center justify-between gap-3">
  <a href="?before=eyJpZCI6MTB9" rel="prev" class="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
    Newer
  </a>
  <a href="?after=eyJpZCI6MjB9" rel="next" class="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Older
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
  </a>
</nav>`,
      react: `const LINK =
  'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

function Chevron({ direction }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function CursorPagination({ prevCursor, nextCursor, buildHref, ariaLabel = 'Pagination', className = '' }) {
  return (
    <nav aria-label={ariaLabel} className={\`flex items-center justify-between gap-3 \${className}\`}>
      {prevCursor !== null ? (
        <a href={buildHref(prevCursor)} rel="prev" className={\`\${LINK} \${REST}\`}>
          <Chevron direction="prev" />
          Newer
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          <Chevron direction="prev" />
          Newer
        </a>
      )}
      {nextCursor !== null ? (
        <a href={buildHref(nextCursor)} rel="next" className={\`\${LINK} \${REST}\`}>
          Older
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          Older
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}`,
      typescript: `export interface CursorPaginationProps {
  /** Opaque token for the previous slice, or null at the start. */
  prevCursor: string | null;
  /** Opaque token for the next slice, or null at the end. */
  nextCursor: string | null;
  buildHref: (cursor: string) => string;
  ariaLabel?: string;
  className?: string;
}

const LINK =
  'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

function Chevron({ direction }: { direction: 'prev' | 'next' }): JSX.Element {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function CursorPagination({
  prevCursor,
  nextCursor,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: CursorPaginationProps): JSX.Element {
  return (
    <nav aria-label={ariaLabel} className={\`flex items-center justify-between gap-3 \${className}\`}>
      {prevCursor !== null ? (
        <a href={buildHref(prevCursor)} rel="prev" className={\`\${LINK} \${REST}\`}>
          <Chevron direction="prev" />
          Newer
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          <Chevron direction="prev" />
          Newer
        </a>
      )}
      {nextCursor !== null ? (
        <a href={buildHref(nextCursor)} rel="next" className={\`\${LINK} \${REST}\`}>
          Older
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" className={\`\${LINK} \${OFF}\`}>
          Older
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'pagination-mini',
    category: 'pagination',
    tags: ['pagination', 'mini', 'compact', 'inline', 'prev-next'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'currentPage', type: 'number', required: true, descriptionKey: 'currentPage', example: '3' },
      { name: 'totalPages', type: 'number', required: true, descriptionKey: 'totalPages', example: '12' },
      { name: 'buildHref', type: '(page: number) => string', required: true, descriptionKey: 'buildHref', example: "(page) => '?page=' + page" },
      { name: 'ariaLabel', type: 'string', default: "'Pagination'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A pill-shaped inline control for tight spots like a card header. The label is
  small, but the two arrow links keep a full 40px-square hit area - visual
  density never shrinks the tap target below the accessible minimum.
-->
<nav aria-label="Pagination" class="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700">
  <a href="?page=2" rel="prev" aria-label="Previous page" class="inline-flex h-10 w-10 items-center justify-center rounded-l-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
  </a>
  <span class="min-w-14 px-1 text-center text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">3 / 12</span>
  <a href="?page=4" rel="next" aria-label="Next page" class="inline-flex h-10 w-10 items-center justify-center rounded-r-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
  </a>
</nav>`,
      react: `const BTN =
  'inline-flex h-10 w-10 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none';
const ON = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

function Chevron({ direction }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function MiniPagination({ currentPage, totalPages, buildHref, ariaLabel = 'Pagination', className = '' }) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <nav aria-label={ariaLabel} className={\`inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700 \${className}\`}>
      {hasPrev ? (
        <a href={buildHref(currentPage - 1)} rel="prev" aria-label="Previous page" className={\`\${BTN} \${ON} rounded-l-full\`}><Chevron direction="prev" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={\`\${BTN} \${OFF} rounded-l-full\`}><Chevron direction="prev" /></a>
      )}
      <span className="min-w-14 px-1 text-center text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        {currentPage} / {totalPages}
      </span>
      {hasNext ? (
        <a href={buildHref(currentPage + 1)} rel="next" aria-label="Next page" className={\`\${BTN} \${ON} rounded-r-full\`}><Chevron direction="next" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={\`\${BTN} \${OFF} rounded-r-full\`}><Chevron direction="next" /></a>
      )}
    </nav>
  );
}`,
      typescript: `export interface MiniPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

const BTN =
  'inline-flex h-10 w-10 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none';
const ON = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

function Chevron({ direction }: { direction: 'prev' | 'next' }): JSX.Element {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export function MiniPagination({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel = 'Pagination',
  className = '',
}: MiniPaginationProps): JSX.Element {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <nav aria-label={ariaLabel} className={\`inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700 \${className}\`}>
      {hasPrev ? (
        <a href={buildHref(currentPage - 1)} rel="prev" aria-label="Previous page" className={\`\${BTN} \${ON} rounded-l-full\`}><Chevron direction="prev" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={\`\${BTN} \${OFF} rounded-l-full\`}><Chevron direction="prev" /></a>
      )}
      <span className="min-w-14 px-1 text-center text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        {currentPage} / {totalPages}
      </span>
      {hasNext ? (
        <a href={buildHref(currentPage + 1)} rel="next" aria-label="Next page" className={\`\${BTN} \${ON} rounded-r-full\`}><Chevron direction="next" /></a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={\`\${BTN} \${OFF} rounded-r-full\`}><Chevron direction="next" /></a>
      )}
    </nav>
  );
}`,
    },
  },
];
