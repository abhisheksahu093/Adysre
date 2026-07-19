import type { ComponentEntry } from './types';

/**
 * Comparisons category.
 *
 * Three of these five are matrices, and a matrix is a `<table>` - not a grid of
 * divs. The distinction is the whole accessibility story of the category: a
 * real table gives every cell a row and column header, so a screen reader
 * announces "Priority support, Pro, Included" instead of the bare word
 * "Included" with nothing to anchor it to. The two non-matrix entries
 * (`comparison-two-column`, `comparison-before-after-cards`) are deliberately
 * NOT tables, because two independent lists and two captioned figures are not
 * matrices and forcing them into one would be the same mistake in reverse.
 */
export const comparisonsComponents: ComponentEntry[] = [
  {
    slug: 'comparison-table',
    category: 'comparisons',
    tags: ['comparison', 'table', 'pricing', 'features', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 1980, copies: 512, downloads: 143 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'ComparisonRow[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'sso', label: 'SSO & SAML', values: [false, false, true] }]",
      },
      {
        name: 'plans',
        type: 'string[]',
        required: true,
        descriptionKey: 'columns',
        example: "['Starter', 'Pro', 'Enterprise']",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A comparison is a matrix, and a matrix is a table. The <caption> names it, the
  plan names are <th scope="col"> and the feature names are <th scope="row">, so
  landing on a cell announces "Priority support, Pro, Included". Rebuild the
  same thing out of divs and that cell announces "Included" - true, but of what?
-->
<div class="cmp-table">
  <table class="cmp-table__table">
    <caption class="cmp-table__caption">Plan comparison - what each tier includes</caption>
    <thead>
      <tr>
        <th class="cmp-table__col cmp-table__col--feature" scope="col">Feature</th>
        <th class="cmp-table__col" scope="col">Starter</th>
        <th class="cmp-table__col" scope="col">Pro</th>
        <th class="cmp-table__col" scope="col">Enterprise</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="cmp-table__row-head" scope="row">Projects</th>
        <td class="cmp-table__cell">3</td>
        <td class="cmp-table__cell">Unlimited</td>
        <td class="cmp-table__cell">Unlimited</td>
      </tr>
      <tr>
        <th class="cmp-table__row-head" scope="row">Team members</th>
        <td class="cmp-table__cell">1</td>
        <td class="cmp-table__cell">10</td>
        <td class="cmp-table__cell">Unlimited</td>
      </tr>
      <tr>
        <th class="cmp-table__row-head" scope="row">Priority support</th>
        <!--
          The glyph is aria-hidden and the word beside it is visually hidden:
          sighted users get ✓/✗, everyone else gets "Included"/"Not included".
          An icon-only cell is an empty cell to a screen reader.
        -->
        <td class="cmp-table__cell">
          <span class="cmp-table__no" aria-hidden="true">✗</span>
          <span class="cmp-table__sr">Not included</span>
        </td>
        <td class="cmp-table__cell">
          <span class="cmp-table__yes" aria-hidden="true">✓</span>
          <span class="cmp-table__sr">Included</span>
        </td>
        <td class="cmp-table__cell">
          <span class="cmp-table__yes" aria-hidden="true">✓</span>
          <span class="cmp-table__sr">Included</span>
        </td>
      </tr>
      <tr>
        <th class="cmp-table__row-head" scope="row">Audit log</th>
        <td class="cmp-table__cell">
          <span class="cmp-table__no" aria-hidden="true">✗</span>
          <span class="cmp-table__sr">Not included</span>
        </td>
        <td class="cmp-table__cell">
          <span class="cmp-table__yes" aria-hidden="true">✓</span>
          <span class="cmp-table__sr">Included</span>
        </td>
        <td class="cmp-table__cell">
          <span class="cmp-table__yes" aria-hidden="true">✓</span>
          <span class="cmp-table__sr">Included</span>
        </td>
      </tr>
      <tr>
        <th class="cmp-table__row-head" scope="row">SSO & SAML</th>
        <td class="cmp-table__cell">
          <span class="cmp-table__no" aria-hidden="true">✗</span>
          <span class="cmp-table__sr">Not included</span>
        </td>
        <td class="cmp-table__cell">
          <span class="cmp-table__no" aria-hidden="true">✗</span>
          <span class="cmp-table__sr">Not included</span>
        </td>
        <td class="cmp-table__cell">
          <span class="cmp-table__yes" aria-hidden="true">✓</span>
          <span class="cmp-table__sr">Included</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
      css: `/*
 * The wrapper scrolls, not the table. A comparison has as many columns as you
 * have plans, and the one thing that must never happen is the feature name
 * scrolling out of view - so the overflow lives here and the table keeps its
 * natural width.
 */
.cmp-table {
  width: 100%;
  overflow-x: auto;
}

.cmp-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  text-align: left;
}

/*
 * Visible, not sr-only. A caption is the table's accessible name AND useful
 * context for everyone; hiding it is a habit worth breaking.
 */
.cmp-table__caption {
  padding-bottom: 0.75rem;
  color: #4b5563;
  text-align: left;
}

.cmp-table__col {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-weight: 600;
  text-align: center;
}

.cmp-table__col--feature {
  text-align: left;
  color: #374151;
  font-weight: 500;
}

.cmp-table__row-head {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  font-weight: 500;
}

.cmp-table__cell {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  text-align: center;
}

.cmp-table__table tbody tr:last-child .cmp-table__row-head,
.cmp-table__table tbody tr:last-child .cmp-table__cell {
  border-bottom: 0;
}

/* #047857 clears 4.5:1 on white; the lighter emerald most people reach for
   (#10b981) does not. */
.cmp-table__yes {
  color: #047857;
  font-weight: 700;
}

.cmp-table__no {
  color: #6b7280;
  font-weight: 700;
}

/* The standard visually-hidden recipe: off-screen but still in the a11y tree.
   display:none or visibility:hidden would remove it from both. */
.cmp-table__sr {
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

/*
 * Every colour in this table is inherited from the page rather than painted on
 * a surface of its own, so all of it - headings, cells, rules and both glyphs -
 * has to be re-tuned for a dark background. #34d399 and #9ca3af are the lightest
 * pair that still clears 4.5:1 on #030712.
 */
@media (prefers-color-scheme: dark) {
  .cmp-table__caption {
    color: #9ca3af;
  }

  .cmp-table__col {
    border-bottom-color: #1f2937;
    color: #f3f4f6;
  }

  .cmp-table__col--feature,
  .cmp-table__row-head,
  .cmp-table__cell {
    color: #d1d5db;
  }

  .cmp-table__row-head,
  .cmp-table__cell {
    border-bottom-color: #1f2937;
  }

  .cmp-table__yes {
    color: #34d399;
  }

  .cmp-table__no {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="w-full overflow-x-auto">
  <table class="w-full border-collapse text-left text-sm">
    <caption class="pb-3 text-left text-gray-600 dark:text-gray-400">
      Plan comparison - what each tier includes
    </caption>
    <thead>
      <tr>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Feature</th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">Starter</th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">Pro</th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">Enterprise</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Projects</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">3</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
      </tr>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Team members</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">1</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">10</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
      </tr>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Priority support</th>
        <!-- ✓/✗ is aria-hidden; the sr-only word is what a screen reader reads. -->
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span>
          <span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span class="sr-only">Included</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span class="sr-only">Included</span>
        </td>
      </tr>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Audit log</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span>
          <span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span class="sr-only">Included</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span class="sr-only">Included</span>
        </td>
      </tr>
      <tr>
        <th scope="row" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">SSO &amp; SAML</th>
        <td class="px-3 py-2.5 text-center">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span>
          <span class="sr-only">Not included</span>
        </td>
        <td class="px-3 py-2.5 text-center">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span>
          <span class="sr-only">Not included</span>
        </td>
        <td class="px-3 py-2.5 text-center">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span class="sr-only">Included</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `const PLANS = ['Starter', 'Pro', 'Enterprise'];

// A row's values line up with PLANS by index. Booleans render as ✓/✗, strings
// render as themselves - one table handles "Unlimited" and "included" alike.
const ROWS = [
  { id: 'projects', label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
  { id: 'members', label: 'Team members', values: ['1', '10', 'Unlimited'] },
  { id: 'support', label: 'Priority support', values: [false, true, true] },
  { id: 'audit', label: 'Audit log', values: [false, true, true] },
  { id: 'sso', label: 'SSO & SAML', values: [false, false, true] },
];

// The glyph carries no information a screen reader can reach, so the word
// beside it does. Never ship the ✓ on its own.
function BoolCell({ on }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function ComparisonTable({ items = ROWS, plans = PLANS, className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Plan comparison - what each tier includes
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan}
                scope="col"
                className="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id}>
              <th
                scope="row"
                className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 last:border-0 dark:border-gray-800 dark:text-gray-300"
              >
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={plans[i]}
                  className="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface ComparisonRow {
  id: string;
  label: string;
  /** Positional - one entry per plan, in the same order as \`plans\`. */
  values: Array<boolean | string>;
}

interface ComparisonTableProps {
  items: ComparisonRow[];
  plans: string[];
  className?: string;
}

function BoolCell({ on }: { on: boolean }): ReactNode {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

// No 'use client' - a comparison table holds no state. It renders on the server
// and ships zero JavaScript, which is the whole point of reaching for a table
// instead of a widget.
export function ComparisonTable({ items, plans, className = '' }: ComparisonTableProps) {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Plan comparison - what each tier includes
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan}
                scope="col"
                className="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id}>
              <th
                scope="row"
                className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={plans[i]}
                  className="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `export interface ComparisonRow {
  id: string;
  label: string;
  /**
   * Positional: \`values[i]\` belongs to \`plans[i]\`. A boolean renders as a
   * ✓/✗ pair, a string renders verbatim - so "Unlimited" and "included" can
   * share one row type instead of forcing two table components.
   */
  values: Array<boolean | string>;
}

export interface ComparisonTableProps {
  items: ComparisonRow[];
  plans: string[];
  className?: string;
}

function BoolCell({ on }: { on: boolean }): JSX.Element {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function ComparisonTable({ items, plans, className = '' }: ComparisonTableProps): JSX.Element {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Plan comparison - what each tier includes
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan: string) => (
              <th
                key={plan}
                scope="col"
                className="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row: ComparisonRow) => (
            <tr key={row.id}>
              <th
                scope="row"
                className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                {row.label}
              </th>
              {row.values.map((value: boolean | string, i: number) => (
                <td
                  key={plans[i]}
                  className="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },

  {
    slug: 'comparison-image-slider',
    category: 'comparisons',
    tags: ['comparison', 'slider', 'before-after', 'drag', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-21',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1460, copies: 322, downloads: 97 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      {
        name: 'before',
        type: 'WipeImage',
        required: true,
        descriptionKey: 'beforeSrc',
        example: "{ src: '/images/before.jpg', alt: 'The kitchen before the refit' }",
      },
      {
        name: 'after',
        type: 'WipeImage',
        required: true,
        descriptionKey: 'afterSrc',
        example: "{ src: '/images/after.jpg', alt: 'The kitchen after the refit' }",
      },
      { name: 'defaultValue', type: 'number', default: '50', descriptionKey: 'sliderPosition' },
      { name: 'ariaLabel', type: 'string', descriptionKey: 'ariaLabel', example: "'Reveal the before image'" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Two photographs stacked, with the top one clipped to a movable edge. The edge
  is the entire control - and a control you can only drag is a control a
  keyboard user cannot touch. It is a real role="slider": arrow keys nudge,
  Home/End jump to either extreme, and aria-valuenow reports where it is.
  Both images keep their own alt text. They are two different pictures of the
  same place, not one picture with a decoration on top.
-->
<div class="wipe" data-wipe>
  <img class="wipe__image" src="/images/kitchen-after.jpg" alt="Kitchen after the renovation" />

  <div class="wipe__clip" data-wipe-clip>
    <img class="wipe__image" src="/images/kitchen-before.jpg" alt="Kitchen before the renovation" />
  </div>

  <span class="wipe__tag wipe__tag--before" aria-hidden="true">Before</span>
  <span class="wipe__tag wipe__tag--after" aria-hidden="true">After</span>

  <div
    class="wipe__handle"
    data-wipe-handle
    role="slider"
    tabindex="0"
    aria-label="Reveal the before image"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="50"
    aria-valuetext="50% before"
  >
    <span class="wipe__grip" aria-hidden="true"></span>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-wipe]').forEach(function (root) {
      var clip = root.querySelector('[data-wipe-clip]');
      var handle = root.querySelector('[data-wipe-handle]');
      var pos = 50;

      function set(next) {
        pos = Math.min(100, Math.max(0, next));
        // inset() from the right: the before image keeps its left-hand slice.
        clip.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
        handle.style.left = pos + '%';
        handle.setAttribute('aria-valuenow', String(Math.round(pos)));
        handle.setAttribute('aria-valuetext', Math.round(pos) + '% before');
      }

      function fromPointer(event) {
        var rect = root.getBoundingClientRect();
        set(((event.clientX - rect.left) / rect.width) * 100);
      }

      // One pointer path covers mouse, touch and pen; the capture keeps the drag
      // alive after the cursor leaves the frame, which a mousemove listener on
      // the element alone would not.
      root.addEventListener('pointerdown', function (event) {
        root.setPointerCapture(event.pointerId);
        fromPointer(event);
      });

      root.addEventListener('pointermove', function (event) {
        if (root.hasPointerCapture(event.pointerId)) fromPointer(event);
      });

      handle.addEventListener('keydown', function (event) {
        // Shift jumps in tens - 100 arrow presses to cross the image is not a
        // keyboard equivalent of a drag, it is a punishment.
        var step = event.shiftKey ? 10 : 1;
        var next = null;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = pos - step;
        else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = pos + step;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 100;

        if (next === null) return;
        event.preventDefault();
        set(next);
      });

      set(pos);
    });
  })();
</script>`,
      css: `.wipe {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 34rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  /* The pointer is a wipe control across the whole frame, so a text cursor here
     would be a lie about what dragging does. */
  cursor: ew-resize;
  /* Without this a touch drag scrolls the page instead of moving the handle. */
  touch-action: none;
  user-select: none;
}

.wipe__image {
  display: block;
  width: 100%;
  height: 18rem;
  object-fit: cover;
}

/*
 * The clipped layer sits exactly on top of the base image. Both are full size -
 * clip-path hides the overflow, so the two photographs stay pixel-aligned no
 * matter where the edge is. Resizing one layer instead would slide it.
 */
.wipe__clip {
  position: absolute;
  inset: 0;
  clip-path: inset(0 50% 0 0);
}

.wipe__tag {
  position: absolute;
  top: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: rgba(3, 7, 18, 0.75);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  pointer-events: none;
}

.wipe__tag--before {
  left: 0.75rem;
}

.wipe__tag--after {
  right: 0.75rem;
}

.wipe__handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  /* Centres a 2.5rem target on a 2px line: the seam reads as hairline-thin but
     the thing you have to hit is a full-size touch target. */
  margin-left: -1.25rem;
  cursor: ew-resize;
}

/* The visible seam. */
.wipe__handle::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  margin-left: -1px;
  background-color: #fff;
}

.wipe__grip {
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: 2px solid #fff;
  background-color: rgba(3, 7, 18, 0.6);
}

.wipe__handle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/*
 * The photographs paint the whole frame, so the seam, the grip and the tags
 * need no dark treatment - they already sit on image pixels and carry a white
 * stroke for it. Only the container border (which touches the page) and the
 * focus ring inherit the theme.
 */
@media (prefers-color-scheme: dark) {
  .wipe {
    border-color: #1f2937;
  }

  .wipe__handle:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!-- Same script as the HTML tab; the classes change, the behaviour does not. -->
<div
  class="relative w-full max-w-lg cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
  data-wipe
>
  <img class="block h-72 w-full object-cover" src="/images/kitchen-after.jpg" alt="Kitchen after the renovation" />

  <div class="absolute inset-0 [clip-path:inset(0_50%_0_0)]" data-wipe-clip>
    <img class="block h-72 w-full object-cover" src="/images/kitchen-before.jpg" alt="Kitchen before the renovation" />
  </div>

  <span class="pointer-events-none absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">Before</span>
  <span class="pointer-events-none absolute right-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">After</span>

  <div
    class="absolute bottom-0 top-0 -ml-5 flex w-10 cursor-ew-resize items-center justify-center before:absolute before:bottom-0 before:left-1/2 before:top-0 before:-ml-px before:w-0.5 before:bg-white before:content-[''] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    style="left: 50%"
    data-wipe-handle
    role="slider"
    tabindex="0"
    aria-label="Reveal the before image"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="50"
    aria-valuetext="50% before"
  >
    <span class="relative h-8 w-8 rounded-full border-2 border-white bg-gray-950/60" aria-hidden="true"></span>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-wipe]').forEach(function (root) {
      var clip = root.querySelector('[data-wipe-clip]');
      var handle = root.querySelector('[data-wipe-handle]');
      var pos = 50;

      function set(next) {
        pos = Math.min(100, Math.max(0, next));
        // An inline clipPath overrides the arbitrary [clip-path:…] utility that
        // only sets the starting position.
        clip.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
        handle.style.left = pos + '%';
        handle.setAttribute('aria-valuenow', String(Math.round(pos)));
        handle.setAttribute('aria-valuetext', Math.round(pos) + '% before');
      }

      function fromPointer(event) {
        var rect = root.getBoundingClientRect();
        set(((event.clientX - rect.left) / rect.width) * 100);
      }

      root.addEventListener('pointerdown', function (event) {
        root.setPointerCapture(event.pointerId);
        fromPointer(event);
      });

      root.addEventListener('pointermove', function (event) {
        if (root.hasPointerCapture(event.pointerId)) fromPointer(event);
      });

      // Without this the handle is a control no keyboard user can operate, and
      // the role="slider" above would be a promise the widget does not keep.
      handle.addEventListener('keydown', function (event) {
        var step = event.shiftKey ? 10 : 1;
        var next = null;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = pos - step;
        else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = pos + step;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 100;

        if (next === null) return;
        event.preventDefault();
        set(next);
      });

      set(pos);
    });
  })();
</script>`,
      react: `import { useCallback, useRef, useState } from 'react';

export function ComparisonImageSlider({
  before,
  after,
  defaultValue = 50,
  ariaLabel = 'Reveal the before image',
  className = '',
}) {
  const [pos, setPos] = useState(defaultValue);
  const rootRef = useRef(null);

  const clamp = (n) => Math.min(100, Math.max(0, n));

  const fromPointer = useCallback((event) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((event.clientX - rect.left) / rect.width) * 100));
  }, []);

  // Arrow keys are not an enhancement. Without them role="slider" promises an
  // interaction the component does not actually support.
  function onKeyDown(event) {
    const step = event.shiftKey ? 10 : 1;
    let next = null;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = pos - step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = pos + step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;

    if (next === null) return;
    event.preventDefault();
    setPos(clamp(next));
  }

  const rounded = Math.round(pos);

  return (
    <div
      ref={rootRef}
      className={\`relative w-full max-w-lg cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
      }}
    >
      <img className="block h-72 w-full object-cover" src={after.src} alt={after.alt} />

      <div className="absolute inset-0" style={{ clipPath: \`inset(0 \${100 - pos}% 0 0)\` }}>
        <img className="block h-72 w-full object-cover" src={before.src} alt={before.alt} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">
        After
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={\`\${rounded}% before\`}
        onKeyDown={onKeyDown}
        style={{ left: \`\${pos}%\` }}
        className="absolute bottom-0 top-0 -ml-5 flex w-10 cursor-ew-resize items-center justify-center before:absolute before:bottom-0 before:left-1/2 before:top-0 before:-ml-px before:w-0.5 before:bg-white before:content-[''] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <span className="relative h-8 w-8 rounded-full border-2 border-white bg-gray-950/60" aria-hidden="true" />
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

interface WipeImage {
  src: string;
  alt: string;
}

interface ComparisonImageSliderProps {
  before: WipeImage;
  after: WipeImage;
  defaultValue?: number;
  ariaLabel?: string;
  className?: string;
}

// 'use client' is required: the wipe position is state driven by pointer and
// keyboard events, neither of which exist on the server.
export function ComparisonImageSlider({
  before,
  after,
  defaultValue = 50,
  ariaLabel = 'Reveal the before image',
  className = '',
}: ComparisonImageSliderProps) {
  const [pos, setPos] = useState<number>(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);

  const clamp = (n: number): number => Math.min(100, Math.max(0, n));

  const fromPointer = useCallback((event: PointerEvent<HTMLDivElement>): void => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((event.clientX - rect.left) / rect.width) * 100));
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const step = event.shiftKey ? 10 : 1;
    let next: number | null = null;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = pos - step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = pos + step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;

    if (next === null) return;
    event.preventDefault();
    setPos(clamp(next));
  }

  const rounded = Math.round(pos);

  return (
    <div
      ref={rootRef}
      className={\`relative w-full max-w-lg cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
      }}
    >
      {/* next/image is the better default for real photos; plain img keeps the
          snippet copy-pasteable outside Next. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="block h-72 w-full object-cover" src={after.src} alt={after.alt} />

      <div className="absolute inset-0" style={{ clipPath: \`inset(0 \${100 - pos}% 0 0)\` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="block h-72 w-full object-cover" src={before.src} alt={before.alt} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">
        After
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={\`\${rounded}% before\`}
        onKeyDown={onKeyDown}
        style={{ left: \`\${pos}%\` }}
        className="absolute bottom-0 top-0 -ml-5 flex w-10 cursor-ew-resize items-center justify-center before:absolute before:bottom-0 before:left-1/2 before:top-0 before:-ml-px before:w-0.5 before:bg-white before:content-[''] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <span className="relative h-8 w-8 rounded-full border-2 border-white bg-gray-950/60" aria-hidden="true" />
      </div>
    </div>
  );
}`,
      typescript: `import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

export interface WipeImage {
  src: string;
  /** Real alt text. The two images are different photographs, not one decorated. */
  alt: string;
}

export interface ComparisonImageSliderProps {
  before: WipeImage;
  after: WipeImage;
  /** Opening wipe position, 0-100. Clamped on every change. */
  defaultValue?: number;
  /** Names the handle for a screen reader. role="slider" has no implicit name. */
  ariaLabel?: string;
  className?: string;
}

export function ComparisonImageSlider({
  before,
  after,
  defaultValue = 50,
  ariaLabel = 'Reveal the before image',
  className = '',
}: ComparisonImageSliderProps): JSX.Element {
  const [pos, setPos] = useState<number>(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);

  const clamp = (n: number): number => Math.min(100, Math.max(0, n));

  const fromPointer = useCallback((event: PointerEvent<HTMLDivElement>): void => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((event.clientX - rect.left) / rect.width) * 100));
  }, []);

  /**
   * The keyboard contract for role="slider": arrows step, Shift steps by ten,
   * Home/End saturate. preventDefault stops ArrowUp/Down scrolling the page out
   * from under the control the user is operating.
   */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const step = event.shiftKey ? 10 : 1;
    let next: number | null = null;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = pos - step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = pos + step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;

    if (next === null) return;
    event.preventDefault();
    setPos(clamp(next));
  }

  const rounded = Math.round(pos);

  return (
    <div
      ref={rootRef}
      className={\`relative w-full max-w-lg cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
      }}
    >
      <img className="block h-72 w-full object-cover" src={after.src} alt={after.alt} />

      <div className="absolute inset-0" style={{ clipPath: \`inset(0 \${100 - pos}% 0 0)\` }}>
        <img className="block h-72 w-full object-cover" src={before.src} alt={before.alt} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white" aria-hidden="true">
        After
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={\`\${rounded}% before\`}
        onKeyDown={onKeyDown}
        style={{ left: \`\${pos}%\` }}
        className="absolute bottom-0 top-0 -ml-5 flex w-10 cursor-ew-resize items-center justify-center before:absolute before:bottom-0 before:left-1/2 before:top-0 before:-ml-px before:w-0.5 before:bg-white before:content-[''] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <span className="relative h-8 w-8 rounded-full border-2 border-white bg-gray-950/60" aria-hidden="true" />
      </div>
    </div>
  );
}`,
    },
  },

  {
    slug: 'comparison-two-column',
    category: 'comparisons',
    tags: ['comparison', 'two-column', 'versus', 'list', 'marketing'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-30',
    updatedAt: '2026-06-21',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1310, copies: 358, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker', example: "'Why teams switch'" },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      {
        name: 'items',
        type: 'ComparisonColumn[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'before', heading: 'Spreadsheets', tone: 'negative', points: ['…'] }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Deliberately NOT a table. The two columns do not share a row axis: "Version
  history is a filename" has no counterpart in the right-hand list, and pairing
  them into <tr>s would invent a relationship that is not there. Two independent
  <section>s with their own <h3> and <ul> say exactly what is true - two lists,
  side by side.
  Each column's heading is its own landmark label, so a screen reader user can
  read one side end-to-end instead of zig-zagging across a fake matrix.
-->
<section class="versus" aria-labelledby="versus-title">
  <p class="versus__kicker">Why teams switch</p>
  <h2 class="versus__title" id="versus-title">Spreadsheets vs. a real system</h2>

  <div class="versus__grid">
    <section class="versus__col versus__col--negative" aria-labelledby="versus-before">
      <h3 class="versus__heading" id="versus-before">Spreadsheets</h3>
      <ul class="versus__list">
        <li class="versus__item">
          <span class="versus__mark versus__mark--no" aria-hidden="true">✗</span>
          <span class="versus__sr">Not included:</span>
          Version history is a filename
        </li>
        <li class="versus__item">
          <span class="versus__mark versus__mark--no" aria-hidden="true">✗</span>
          <span class="versus__sr">Not included:</span>
          Permissions end at "share the link"
        </li>
        <li class="versus__item">
          <span class="versus__mark versus__mark--no" aria-hidden="true">✗</span>
          <span class="versus__sr">Not included:</span>
          Every report is rebuilt by hand
        </li>
      </ul>
    </section>

    <section class="versus__col versus__col--positive" aria-labelledby="versus-after">
      <h3 class="versus__heading" id="versus-after">ADYSRE</h3>
      <ul class="versus__list">
        <li class="versus__item">
          <span class="versus__mark versus__mark--yes" aria-hidden="true">✓</span>
          <span class="versus__sr">Included:</span>
          A full audit trail on every record
        </li>
        <li class="versus__item">
          <span class="versus__mark versus__mark--yes" aria-hidden="true">✓</span>
          <span class="versus__sr">Included:</span>
          Role-based access down to the field
        </li>
        <li class="versus__item">
          <span class="versus__mark versus__mark--yes" aria-hidden="true">✓</span>
          <span class="versus__sr">Included:</span>
          Reports that refresh themselves
        </li>
      </ul>
    </section>
  </div>
</section>`,
      css: `.versus {
  width: 100%;
  max-width: 48rem;
}

.versus__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #4b5563;
}

.versus__title {
  margin: 0.375rem 0 1.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

/*
 * One column below 40rem, two above. Stacking is not a fallback here - read
 * top-to-bottom the two lists still make sense in sequence, which is exactly why
 * this shape survives narrow screens and a comparison table does not.
 */
.versus__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 40rem) {
  .versus__grid {
    grid-template-columns: 1fr 1fr;
  }
}

.versus__col {
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
}

/* A hairline top rule tints the column without tinting the text behind it -
   a full background fill would force both lists' body copy to be re-checked
   for contrast against two different surfaces. */
.versus__col--negative {
  border-top: 3px solid #9ca3af;
}

.versus__col--positive {
  border-top: 3px solid #047857;
}

.versus__heading {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.versus__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.625rem;
}

.versus__item {
  display: grid;
  grid-template-columns: 1rem 1fr;
  gap: 0.5rem;
  align-items: start;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
}

.versus__mark {
  font-weight: 700;
  line-height: 1.5;
}

.versus__mark--yes {
  color: #047857;
}

.versus__mark--no {
  color: #6b7280;
}

.versus__sr {
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

/*
 * The columns paint a white card in light mode, so in dark mode the surface
 * flips and everything on it follows. The two accent rules stay recognisable
 * (grey vs green) but lighten, because a 3px line at #047857 on #030712 is
 * effectively invisible.
 */
@media (prefers-color-scheme: dark) {
  .versus__kicker {
    color: #9ca3af;
  }

  .versus__title,
  .versus__heading {
    color: #f3f4f6;
  }

  .versus__col {
    border-color: #1f2937;
    background-color: #111827;
  }

  .versus__col--negative {
    border-top-color: #6b7280;
  }

  .versus__col--positive {
    border-top-color: #34d399;
  }

  .versus__item {
    color: #d1d5db;
  }

  .versus__mark--yes {
    color: #34d399;
  }

  .versus__mark--no {
    color: #9ca3af;
  }
}`,
      tailwind: `<section class="w-full max-w-3xl" aria-labelledby="versus-title">
  <p class="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Why teams switch</p>
  <h2 class="mb-5 mt-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100" id="versus-title">
    Spreadsheets vs. a real system
  </h2>

  <div class="grid gap-4 sm:grid-cols-2">
    <!-- Two sections, not two table columns: the rows do not correspond. -->
    <section
      class="rounded-xl border border-t-[3px] border-gray-200 border-t-gray-400 bg-white p-5 dark:border-gray-800 dark:border-t-gray-500 dark:bg-gray-900"
      aria-labelledby="versus-before"
    >
      <h3 class="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100" id="versus-before">Spreadsheets</h3>
      <ul class="grid gap-2.5">
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span>
          <span><span class="sr-only">Not included: </span>Version history is a filename</span>
        </li>
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span>
          <span><span class="sr-only">Not included: </span>Permissions end at "share the link"</span>
        </li>
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span>
          <span><span class="sr-only">Not included: </span>Every report is rebuilt by hand</span>
        </li>
      </ul>
    </section>

    <section
      class="rounded-xl border border-t-[3px] border-gray-200 border-t-emerald-700 bg-white p-5 dark:border-gray-800 dark:border-t-emerald-400 dark:bg-gray-900"
      aria-labelledby="versus-after"
    >
      <h3 class="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100" id="versus-after">ADYSRE</h3>
      <ul class="grid gap-2.5">
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span><span class="sr-only">Included: </span>A full audit trail on every record</span>
        </li>
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span><span class="sr-only">Included: </span>Role-based access down to the field</span>
        </li>
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span><span class="sr-only">Included: </span>Reports that refresh themselves</span>
        </li>
      </ul>
    </section>
  </div>
</section>`,
      react: `import { useId } from 'react';

const COLUMNS = [
  {
    id: 'before',
    heading: 'Spreadsheets',
    tone: 'negative',
    points: [
      'Version history is a filename',
      'Permissions end at "share the link"',
      'Every report is rebuilt by hand',
    ],
  },
  {
    id: 'after',
    heading: 'ADYSRE',
    tone: 'positive',
    points: [
      'A full audit trail on every record',
      'Role-based access down to the field',
      'Reports that refresh themselves',
    ],
  },
];

export function ComparisonTwoColumn({ kicker, title, items = COLUMNS, className = '' }) {
  const titleId = useId();

  return (
    <section className={\`w-full max-w-3xl \${className}\`} aria-labelledby={titleId}>
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          {kicker}
        </p>
      )}
      <h2 className="mb-5 mt-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100" id={titleId}>
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((column) => {
          const positive = column.tone === 'positive';
          return (
            <section
              key={column.id}
              aria-labelledby={\`\${titleId}-\${column.id}\`}
              className={\`rounded-xl border border-t-[3px] border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${
                positive
                  ? 'border-t-emerald-700 dark:border-t-emerald-400'
                  : 'border-t-gray-400 dark:border-t-gray-500'
              }\`}
            >
              <h3
                id={\`\${titleId}-\${column.id}\`}
                className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100"
              >
                {column.heading}
              </h3>
              <ul className="grid gap-2.5">
                {column.points.map((point) => (
                  <li
                    key={point}
                    className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    <span
                      aria-hidden="true"
                      className={
                        positive ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'
                      }
                    >
                      {positive ? '✓' : '✗'}
                    </span>
                    <span>
                      {/* The mark is decorative; this is what gets announced. */}
                      <span className="sr-only">{positive ? 'Included: ' : 'Not included: '}</span>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}`,
      nextjs: `import { useId } from 'react';

type Tone = 'positive' | 'negative';

interface ComparisonColumn {
  id: string;
  heading: string;
  tone: Tone;
  points: string[];
}

interface ComparisonTwoColumnProps {
  kicker?: string;
  title: string;
  items: ComparisonColumn[];
  className?: string;
}

// No 'use client': useId runs on the server too, and nothing here is
// interactive. Two lists and a heading - it renders to static HTML.
export function ComparisonTwoColumn({ kicker, title, items, className = '' }: ComparisonTwoColumnProps) {
  const titleId = useId();

  return (
    <section className={\`w-full max-w-3xl \${className}\`} aria-labelledby={titleId}>
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          {kicker}
        </p>
      ) : null}
      <h2 className="mb-5 mt-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100" id={titleId}>
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((column) => {
          const positive = column.tone === 'positive';
          return (
            <section
              key={column.id}
              aria-labelledby={\`\${titleId}-\${column.id}\`}
              className={\`rounded-xl border border-t-[3px] border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${
                positive
                  ? 'border-t-emerald-700 dark:border-t-emerald-400'
                  : 'border-t-gray-400 dark:border-t-gray-500'
              }\`}
            >
              <h3
                id={\`\${titleId}-\${column.id}\`}
                className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100"
              >
                {column.heading}
              </h3>
              <ul className="grid gap-2.5">
                {column.points.map((point) => (
                  <li
                    key={point}
                    className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    <span
                      aria-hidden="true"
                      className={
                        positive ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'
                      }
                    >
                      {positive ? '✓' : '✗'}
                    </span>
                    <span>
                      <span className="sr-only">{positive ? 'Included: ' : 'Not included: '}</span>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}`,
      typescript: `import { useId } from 'react';

export type ComparisonTone = 'positive' | 'negative';

export interface ComparisonColumn {
  id: string;
  heading: string;
  /**
   * Drives the ✓/✗ glyph, the accent rule AND the visually-hidden prefix, so
   * the three can never disagree about which side of the comparison this is.
   */
  tone: ComparisonTone;
  points: string[];
}

export interface ComparisonTwoColumnProps {
  kicker?: string;
  title: string;
  items: ComparisonColumn[];
  className?: string;
}

export function ComparisonTwoColumn({
  kicker,
  title,
  items,
  className = '',
}: ComparisonTwoColumnProps): JSX.Element {
  const titleId = useId();

  return (
    <section className={\`w-full max-w-3xl \${className}\`} aria-labelledby={titleId}>
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          {kicker}
        </p>
      ) : null}
      <h2 className="mb-5 mt-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100" id={titleId}>
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((column: ComparisonColumn) => {
          const positive = column.tone === 'positive';
          return (
            <section
              key={column.id}
              aria-labelledby={\`\${titleId}-\${column.id}\`}
              className={\`rounded-xl border border-t-[3px] border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${
                positive
                  ? 'border-t-emerald-700 dark:border-t-emerald-400'
                  : 'border-t-gray-400 dark:border-t-gray-500'
              }\`}
            >
              <h3
                id={\`\${titleId}-\${column.id}\`}
                className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100"
              >
                {column.heading}
              </h3>
              <ul className="grid gap-2.5">
                {column.points.map((point: string) => (
                  <li
                    key={point}
                    className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    <span
                      aria-hidden="true"
                      className={
                        positive ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'
                      }
                    >
                      {positive ? '✓' : '✗'}
                    </span>
                    <span>
                      <span className="sr-only">{positive ? 'Included: ' : 'Not included: '}</span>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'comparison-feature-matrix',
    category: 'comparisons',
    tags: ['comparison', 'matrix', 'table', 'grouped', 'enterprise'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1075, copies: 246, downloads: 71 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'FeatureGroup[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'security', label: 'Security', rows: [{ id: 'sso', label: 'SSO', values: [false, true] }] }]",
      },
      {
        name: 'plans',
        type: 'MatrixPlan[]',
        required: true,
        descriptionKey: 'columns',
        example: "[{ id: 'pro', label: 'Pro', badge: 'Recommended' }]",
      },
      { name: 'highlighted', type: 'string', descriptionKey: 'highlighted', example: "'Pro'" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The grown-up version of comparison-table: many rows, sorted into groups.
  The group heading is a <th scope="colgroup"> spanning the width inside its own
  <tbody> - that is what makes "Security" a heading for the rows beneath it
  rather than a stray cell. A styled <tr> of divs cannot express it.
  <thead> repeats on print and on paginated AT output for free, which is most of
  the reason a long matrix should be a table and not a grid.
-->
<div class="matrix">
  <table class="matrix__table">
    <caption class="matrix__caption">Feature availability by plan</caption>
    <thead>
      <tr>
        <th class="matrix__col matrix__col--feature" scope="col">Feature</th>
        <th class="matrix__col" scope="col">Starter</th>
        <th class="matrix__col matrix__col--accent" scope="col">
          Pro
          <span class="matrix__badge">Popular</span>
        </th>
        <th class="matrix__col" scope="col">Enterprise</th>
      </tr>
    </thead>

    <tbody class="matrix__group">
      <tr>
        <th class="matrix__group-head" scope="colgroup" colspan="4">Collaboration</th>
      </tr>
      <tr>
        <th class="matrix__row-head" scope="row">Team members</th>
        <td class="matrix__cell">1</td>
        <td class="matrix__cell matrix__cell--accent">10</td>
        <td class="matrix__cell">Unlimited</td>
      </tr>
      <tr>
        <th class="matrix__row-head" scope="row">Guest access</th>
        <td class="matrix__cell">
          <span class="matrix__no" aria-hidden="true">✗</span><span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell matrix__cell--accent">
          <span class="matrix__yes" aria-hidden="true">✓</span><span class="matrix__sr">Included</span>
        </td>
        <td class="matrix__cell">
          <span class="matrix__yes" aria-hidden="true">✓</span><span class="matrix__sr">Included</span>
        </td>
      </tr>
    </tbody>

    <tbody class="matrix__group">
      <tr>
        <th class="matrix__group-head" scope="colgroup" colspan="4">Security</th>
      </tr>
      <tr>
        <th class="matrix__row-head" scope="row">SSO & SAML</th>
        <td class="matrix__cell">
          <span class="matrix__no" aria-hidden="true">✗</span><span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell matrix__cell--accent">
          <span class="matrix__no" aria-hidden="true">✗</span><span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell">
          <span class="matrix__yes" aria-hidden="true">✓</span><span class="matrix__sr">Included</span>
        </td>
      </tr>
      <tr>
        <th class="matrix__row-head" scope="row">Audit log retention</th>
        <td class="matrix__cell">7 days</td>
        <td class="matrix__cell matrix__cell--accent">90 days</td>
        <td class="matrix__cell">Unlimited</td>
      </tr>
    </tbody>

    <tbody class="matrix__group">
      <tr>
        <th class="matrix__group-head" scope="colgroup" colspan="4">Support</th>
      </tr>
      <tr>
        <th class="matrix__row-head" scope="row">Response time</th>
        <td class="matrix__cell">Community</td>
        <td class="matrix__cell matrix__cell--accent">24 hours</td>
        <td class="matrix__cell">1 hour</td>
      </tr>
      <tr>
        <th class="matrix__row-head" scope="row">Dedicated manager</th>
        <td class="matrix__cell">
          <span class="matrix__no" aria-hidden="true">✗</span><span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell matrix__cell--accent">
          <span class="matrix__no" aria-hidden="true">✗</span><span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell">
          <span class="matrix__yes" aria-hidden="true">✓</span><span class="matrix__sr">Included</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
      css: `.matrix {
  width: 100%;
  overflow-x: auto;
}

.matrix__table {
  width: 100%;
  min-width: 34rem;
  border-collapse: collapse;
  font-size: 0.875rem;
  text-align: left;
}

.matrix__caption {
  padding-bottom: 0.75rem;
  color: #4b5563;
  text-align: left;
}

/*
 * Sticky column headers: a matrix long enough to need groups is long enough
 * that the plan names scroll away, and a cell whose column you cannot see is a
 * number without a meaning.
 */
.matrix__col {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
  color: #111827;
  font-weight: 600;
  text-align: center;
}

.matrix__col--feature {
  text-align: left;
  color: #374151;
  font-weight: 500;
}

.matrix__badge {
  display: block;
  margin-top: 0.125rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #1d4ed8;
}

.matrix__group-head {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  color: #111827;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: left;
}

.matrix__row-head {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  font-weight: 500;
}

.matrix__cell {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  text-align: center;
}

/* The accent is a tint on the recommended column, never the only signal - the
   "Popular" badge in the header is a text node that survives colour filtering,
   forced-colours mode and a black-and-white printout. */
.matrix__col--accent,
.matrix__cell--accent {
  background-color: #eff6ff;
}

.matrix__yes {
  color: #047857;
  font-weight: 700;
}

.matrix__no {
  color: #6b7280;
  font-weight: 700;
}

.matrix__sr {
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

/*
 * The sticky header needs an opaque background or rows scroll through it, so it
 * carries a real surface colour and must be repainted here rather than left to
 * inherit. Same for the group bands and the accent tint: #eff6ff becomes a very
 * dark blue that still separates the column without dropping its text below
 * 4.5:1.
 */
@media (prefers-color-scheme: dark) {
  .matrix__caption {
    color: #9ca3af;
  }

  .matrix__col {
    border-bottom-color: #1f2937;
    background-color: #030712;
    color: #f3f4f6;
  }

  .matrix__col--feature,
  .matrix__row-head,
  .matrix__cell {
    color: #d1d5db;
  }

  .matrix__badge {
    color: #93c5fd;
  }

  .matrix__group-head {
    border-bottom-color: #1f2937;
    background-color: #111827;
    color: #f3f4f6;
  }

  .matrix__row-head,
  .matrix__cell {
    border-bottom-color: #1f2937;
  }

  .matrix__col--accent,
  .matrix__cell--accent {
    background-color: #17243f;
  }

  .matrix__yes {
    color: #34d399;
  }

  .matrix__no {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[34rem] border-collapse text-left text-sm">
    <caption class="pb-3 text-left text-gray-600 dark:text-gray-400">Feature availability by plan</caption>
    <thead>
      <tr>
        <th scope="col" class="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">Feature</th>
        <th scope="col" class="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">Starter</th>
        <!-- The tint is reinforcement; "Popular" is the signal that survives a
             greyscale print. -->
        <th scope="col" class="sticky top-0 z-10 border-b border-gray-200 bg-blue-50 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:bg-blue-950/50 dark:text-gray-100">
          Pro
          <span class="mt-0.5 block text-[0.6875rem] font-semibold text-blue-700 dark:text-blue-300">Popular</span>
        </th>
        <th scope="col" class="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">Enterprise</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <th scope="colgroup" colspan="4" class="border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          Collaboration
        </th>
      </tr>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Team members</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">1</td>
        <td class="border-b border-gray-100 bg-blue-50 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:bg-blue-950/50 dark:text-gray-300">10</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
      </tr>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Guest access</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span><span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 bg-blue-50 px-3 py-2.5 text-center dark:border-gray-800 dark:bg-blue-950/50">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span><span class="sr-only">Included</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span><span class="sr-only">Included</span>
        </td>
      </tr>
    </tbody>

    <tbody>
      <tr>
        <th scope="colgroup" colspan="4" class="border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          Security
        </th>
      </tr>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">SSO &amp; SAML</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span><span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 bg-blue-50 px-3 py-2.5 text-center dark:border-gray-800 dark:bg-blue-950/50">
          <span class="font-bold text-gray-500" aria-hidden="true">✗</span><span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span><span class="sr-only">Included</span>
        </td>
      </tr>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Audit log retention</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">7 days</td>
        <td class="border-b border-gray-100 bg-blue-50 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:bg-blue-950/50 dark:text-gray-300">90 days</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `const PLANS = [
  { id: 'starter', label: 'Starter' },
  { id: 'pro', label: 'Pro', badge: 'Popular' },
  { id: 'enterprise', label: 'Enterprise' },
];

const GROUPS = [
  {
    id: 'collaboration',
    label: 'Collaboration',
    rows: [
      { id: 'members', label: 'Team members', values: ['1', '10', 'Unlimited'] },
      { id: 'guests', label: 'Guest access', values: [false, true, true] },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    rows: [
      { id: 'sso', label: 'SSO & SAML', values: [false, false, true] },
      { id: 'audit', label: 'Audit log retention', values: ['7 days', '90 days', 'Unlimited'] },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    rows: [
      { id: 'response', label: 'Response time', values: ['Community', '24 hours', '1 hour'] },
      { id: 'csm', label: 'Dedicated manager', values: [false, false, true] },
    ],
  },
];

function BoolCell({ on }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function ComparisonFeatureMatrix({ items = GROUPS, plans = PLANS, highlighted = 'pro', className = '' }) {
  // A tint alone would vanish under forced-colours; the plan's own badge is the
  // durable signal, so accent is only ever reinforcement.
  const accent = (planId) =>
    planId === highlighted ? 'bg-blue-50 dark:bg-blue-950/50' : '';

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Feature availability by plan
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={\`sticky top-0 z-10 border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100 \${
                  accent(plan.id) || 'bg-white dark:bg-gray-950'
                }\`}
              >
                {plan.label}
                {plan.badge && (
                  <span className="mt-0.5 block text-[0.6875rem] font-semibold text-blue-700 dark:text-blue-300">
                    {plan.badge}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* One tbody per group: the group heading is a real colgroup header for
            the rows it owns, which a single flat tbody cannot express. */}
        {items.map((group) => (
          <tbody key={group.id}>
            <tr>
              <th
                scope="colgroup"
                colSpan={plans.length + 1}
                className="border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                {group.label}
              </th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td
                    key={plans[i].id}
                    className={\`border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300 \${accent(plans[i].id)}\`}
                  >
                    {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface MatrixPlan {
  id: string;
  label: string;
  badge?: string;
}

interface MatrixRow {
  id: string;
  label: string;
  values: Array<boolean | string>;
}

interface FeatureGroup {
  id: string;
  label: string;
  rows: MatrixRow[];
}

interface ComparisonFeatureMatrixProps {
  items: FeatureGroup[];
  plans: MatrixPlan[];
  /** Plan id to accent. Reinforces the badge; never the only signal. */
  highlighted?: string;
  className?: string;
}

function BoolCell({ on }: { on: boolean }): ReactNode {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

// Stateless - no 'use client'. A long matrix is exactly the thing you want the
// server to render and the browser to never re-run.
export function ComparisonFeatureMatrix({
  items,
  plans,
  highlighted,
  className = '',
}: ComparisonFeatureMatrixProps) {
  const accent = (planId: string): string =>
    planId === highlighted ? 'bg-blue-50 dark:bg-blue-950/50' : '';

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Feature availability by plan
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={\`sticky top-0 z-10 border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100 \${
                  accent(plan.id) || 'bg-white dark:bg-gray-950'
                }\`}
              >
                {plan.label}
                {plan.badge ? (
                  <span className="mt-0.5 block text-[0.6875rem] font-semibold text-blue-700 dark:text-blue-300">
                    {plan.badge}
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>

        {items.map((group) => (
          <tbody key={group.id}>
            <tr>
              <th
                scope="colgroup"
                colSpan={plans.length + 1}
                className="border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                {group.label}
              </th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td
                    key={plans[i]?.id ?? i}
                    className={\`border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300 \${accent(plans[i]?.id ?? '')}\`}
                  >
                    {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}`,
      typescript: `export interface MatrixPlan {
  id: string;
  label: string;
  /** Rendered under the plan name. The accessible half of "recommended". */
  badge?: string;
}

export interface MatrixRow {
  id: string;
  label: string;
  /** Positional against \`plans\`. Booleans become ✓/✗ + a hidden word. */
  values: Array<boolean | string>;
}

export interface FeatureGroup {
  id: string;
  label: string;
  rows: MatrixRow[];
}

export interface ComparisonFeatureMatrixProps {
  items: FeatureGroup[];
  plans: MatrixPlan[];
  highlighted?: string;
  className?: string;
}

function BoolCell({ on }: { on: boolean }): JSX.Element {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function ComparisonFeatureMatrix({
  items,
  plans,
  highlighted,
  className = '',
}: ComparisonFeatureMatrixProps): JSX.Element {
  const accent = (planId: string): string =>
    planId === highlighted ? 'bg-blue-50 dark:bg-blue-950/50' : '';

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Feature availability by plan
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan: MatrixPlan) => (
              <th
                key={plan.id}
                scope="col"
                className={\`sticky top-0 z-10 border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100 \${
                  accent(plan.id) || 'bg-white dark:bg-gray-950'
                }\`}
              >
                {plan.label}
                {plan.badge ? (
                  <span className="mt-0.5 block text-[0.6875rem] font-semibold text-blue-700 dark:text-blue-300">
                    {plan.badge}
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>

        {items.map((group: FeatureGroup) => (
          <tbody key={group.id}>
            <tr>
              {/* scope="colgroup" + colSpan is what makes this a heading for the
                  rows below rather than a wide, decorative cell. */}
              <th
                scope="colgroup"
                colSpan={plans.length + 1}
                className="border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                {group.label}
              </th>
            </tr>
            {group.rows.map((row: MatrixRow) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {row.label}
                </th>
                {row.values.map((value: boolean | string, i: number) => (
                  <td
                    key={plans[i]?.id ?? i}
                    className={\`border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300 \${accent(plans[i]?.id ?? '')}\`}
                  >
                    {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}`,
    },
  },

  {
    slug: 'comparison-before-after-cards',
    category: 'comparisons',
    tags: ['comparison', 'before-after', 'figure', 'cards', 'showcase'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-08',
    updatedAt: '2026-06-29',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 940, copies: 201, downloads: 58 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      {
        name: 'items',
        type: 'BeforeAfterItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'before', label: 'Before', imageSrc: '/images/before.jpg', imageAlt: '…', caption: '…' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Two <figure>s, not a table and not two bullet lists: each card is a picture
  with a caption about that picture, which is precisely what <figure> and
  <figcaption> mean. The caption is tied to its image by the element itself, so
  no aria-describedby wiring is needed and none can rot.
  Unlike the wipe slider, both images are fully visible at once - use this when
  the differences are spread across the frame and a moving edge would hide half
  of whichever side you are not looking at.
-->
<section class="ba" aria-labelledby="ba-title">
  <h2 class="ba__title" id="ba-title">Dashboard redesign</h2>

  <div class="ba__grid">
    <figure class="ba__card">
      <span class="ba__tag ba__tag--before">Before</span>
      <img class="ba__image" src="/images/dashboard-before.jpg" alt="The old dashboard: twelve stat tiles competing for attention" />
      <figcaption class="ba__caption">
        Twelve tiles, no hierarchy. Every metric shouted, so none of them landed.
      </figcaption>
    </figure>

    <figure class="ba__card">
      <span class="ba__tag ba__tag--after">After</span>
      <img class="ba__image" src="/images/dashboard-after.jpg" alt="The new dashboard: one headline metric above a compact table" />
      <figcaption class="ba__caption">
        One headline metric, the rest demoted to a table. Task time fell by 40%.
      </figcaption>
    </figure>
  </div>
</section>`,
      css: `.ba {
  width: 100%;
  max-width: 48rem;
}

.ba__title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.ba__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 40rem) {
  .ba__grid {
    grid-template-columns: 1fr 1fr;
  }
}

.ba__card {
  position: relative;
  overflow: hidden;
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
}

.ba__image {
  display: block;
  width: 100%;
  height: 12rem;
  object-fit: cover;
}

/*
 * The tag sits on the photograph, so it cannot inherit a page colour - it
 * carries its own near-opaque plate and white text, which holds 4.5:1 over any
 * image underneath. That is also why it needs no dark-mode rule.
 */
.ba__tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: rgba(3, 7, 18, 0.75);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}

.ba__caption {
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
}

@media (prefers-color-scheme: dark) {
  .ba__title {
    color: #f3f4f6;
  }

  .ba__card {
    border-color: #1f2937;
    background-color: #111827;
  }

  .ba__caption {
    color: #d1d5db;
  }
}`,
      tailwind: `<section class="w-full max-w-3xl" aria-labelledby="ba-title">
  <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100" id="ba-title">Dashboard redesign</h2>

  <div class="grid gap-4 sm:grid-cols-2">
    <!-- figure/figcaption ties each caption to its own image with no ARIA. -->
    <figure class="relative m-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <span class="absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white">Before</span>
      <img class="block h-48 w-full object-cover" src="/images/dashboard-before.jpg" alt="The old dashboard: twelve stat tiles competing for attention" />
      <figcaption class="px-4 py-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        Twelve tiles, no hierarchy. Every metric shouted, so none of them landed.
      </figcaption>
    </figure>

    <figure class="relative m-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <span class="absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white">After</span>
      <img class="block h-48 w-full object-cover" src="/images/dashboard-after.jpg" alt="The new dashboard: one headline metric above a compact table" />
      <figcaption class="px-4 py-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        One headline metric, the rest demoted to a table. Task time fell by 40%.
      </figcaption>
    </figure>
  </div>
</section>`,
      react: `import { useId } from 'react';

const ITEMS = [
  {
    id: 'before',
    label: 'Before',
    imageSrc: '/images/dashboard-before.jpg',
    imageAlt: 'The old dashboard: twelve stat tiles competing for attention',
    caption: 'Twelve tiles, no hierarchy. Every metric shouted, so none of them landed.',
  },
  {
    id: 'after',
    label: 'After',
    imageSrc: '/images/dashboard-after.jpg',
    imageAlt: 'The new dashboard: one headline metric above a compact table',
    caption: 'One headline metric, the rest demoted to a table. Task time fell by 40%.',
  },
];

export function ComparisonBeforeAfterCards({ title, items = ITEMS, className = '' }) {
  const titleId = useId();

  return (
    <section className={\`w-full max-w-3xl \${className}\`} aria-labelledby={titleId}>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100" id={titleId}>
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <figure
            key={item.id}
            className="relative m-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            {/* Not aria-hidden: "Before" is information, and the caption below
                does not repeat it. */}
            <span className="absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white">
              {item.label}
            </span>
            <img className="block h-48 w-full object-cover" src={item.imageSrc} alt={item.imageAlt} />
            <figcaption className="px-4 py-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}`,
      nextjs: `import { useId } from 'react';

interface BeforeAfterItem {
  id: string;
  label: string;
  imageSrc: string;
  /** Describes the picture, not the label. "Before" is already a text node. */
  imageAlt: string;
  caption: string;
}

interface ComparisonBeforeAfterCardsProps {
  title: string;
  items: BeforeAfterItem[];
  className?: string;
}

// Stateless - no 'use client'.
export function ComparisonBeforeAfterCards({
  title,
  items,
  className = '',
}: ComparisonBeforeAfterCardsProps) {
  const titleId = useId();

  return (
    <section className={\`w-full max-w-3xl \${className}\`} aria-labelledby={titleId}>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100" id={titleId}>
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <figure
            key={item.id}
            className="relative m-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <span className="absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white">
              {item.label}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="block h-48 w-full object-cover" src={item.imageSrc} alt={item.imageAlt} />
            <figcaption className="px-4 py-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useId } from 'react';

export interface BeforeAfterItem {
  id: string;
  /** The pill on the image - "Before" / "After". A real text node, not ARIA. */
  label: string;
  imageSrc: string;
  imageAlt: string;
  /** Rendered in the <figcaption>, so it is bound to this image by the DOM. */
  caption: string;
}

export interface ComparisonBeforeAfterCardsProps {
  title: string;
  items: BeforeAfterItem[];
  className?: string;
}

export function ComparisonBeforeAfterCards({
  title,
  items,
  className = '',
}: ComparisonBeforeAfterCardsProps): JSX.Element {
  const titleId = useId();

  return (
    <section className={\`w-full max-w-3xl \${className}\`} aria-labelledby={titleId}>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100" id={titleId}>
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item: BeforeAfterItem) => (
          <figure
            key={item.id}
            className="relative m-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <span className="absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white">
              {item.label}
            </span>
            <img className="block h-48 w-full object-cover" src={item.imageSrc} alt={item.imageAlt} />
            <figcaption className="px-4 py-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'comparison-pricing-toggle',
    category: 'comparisons',
    tags: ['comparison', 'pricing', 'toggle', 'billing', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      {
        name: 'plans',
        type: 'TogglePlan[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'pro', name: 'Pro', monthly: 29, annual: 278, features: ['Audit log'] }]",
      },
      { name: 'currency', type: 'string', default: "'$'", descriptionKey: 'currency' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  CSS-only: the checkbox lives anywhere inside the group and group-has-[:checked]
  swaps every monthly figure for its annual one - no JavaScript. The toggle is a
  labelled checkbox so it is operable and announced without extra ARIA.
-->
<section class="group w-full max-w-3xl">
  <div class="mb-6 flex justify-center">
    <label class="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
      <span>Monthly</span>
      <input type="checkbox" class="peer sr-only" aria-label="Bill annually" />
      <span class="relative h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 motion-reduce:transition-none dark:bg-gray-700 dark:peer-checked:bg-blue-500"></span>
      <span>Annual <span class="text-emerald-700 dark:text-emerald-400">-20%</span></span>
    </label>
  </div>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <section aria-label="Starter" class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Starter</h3>
      <p class="mt-2 flex items-baseline gap-1">
        <span class="text-3xl font-bold text-gray-900 group-has-[:checked]:hidden dark:text-gray-100">$12</span>
        <span class="hidden text-3xl font-bold text-gray-900 group-has-[:checked]:inline dark:text-gray-100">$115</span>
        <span class="text-sm text-gray-500 dark:text-gray-400"><span class="group-has-[:checked]:hidden">/mo</span><span class="hidden group-has-[:checked]:inline">/yr</span></span>
      </p>
      <ul class="mt-4 grid gap-2">
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span><span class="sr-only">Included: </span>3 projects</span>
        </li>
      </ul>
    </section>

    <section aria-label="Pro" class="flex flex-col rounded-xl border border-blue-600 bg-white p-5 dark:border-blue-400 dark:bg-gray-900">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Pro</h3>
      <p class="mt-2 flex items-baseline gap-1">
        <span class="text-3xl font-bold text-gray-900 group-has-[:checked]:hidden dark:text-gray-100">$29</span>
        <span class="hidden text-3xl font-bold text-gray-900 group-has-[:checked]:inline dark:text-gray-100">$278</span>
        <span class="text-sm text-gray-500 dark:text-gray-400"><span class="group-has-[:checked]:hidden">/mo</span><span class="hidden group-has-[:checked]:inline">/yr</span></span>
      </p>
      <ul class="mt-4 grid gap-2">
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
          <span><span class="sr-only">Included: </span>Unlimited projects</span>
        </li>
      </ul>
    </section>
  </div>
</section>`,
      react: `import { useState } from 'react';

const SAMPLE_PLANS = [
  { id: 'starter', name: 'Starter', monthly: 12, annual: 115, features: ['3 projects', 'Community support'] },
  { id: 'pro', name: 'Pro', monthly: 29, annual: 278, featured: true, features: ['Unlimited projects', 'Priority support'] },
  { id: 'scale', name: 'Scale', monthly: 79, annual: 758, features: ['SSO & SAML', 'Dedicated manager'] },
];

// The toggle is a real radiogroup: two radios, not two unlabelled buttons, so a
// screen reader announces the billing choice and arrow keys move between them.
export function ComparisonPricingToggle({ plans = SAMPLE_PLANS, currency = '$', className = '' }) {
  const [cycle, setCycle] = useState('monthly');
  const annual = cycle === 'annual';

  return (
    <section className={\`w-full max-w-3xl \${className}\`}>
      <div className="mb-6 flex justify-center">
        <div role="radiogroup" aria-label="Billing cycle" className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
          {['monthly', 'annual'].map((option) => {
            const active = cycle === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCycle(option)}
                className={\`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${active ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}\`}
              >
                {option}
                {option === 'annual' ? <span className="ml-1 text-emerald-700 dark:text-emerald-400">-20%</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <section
            key={plan.id}
            aria-label={plan.name}
            className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${plan.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{plan.name}</h3>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currency}{annual ? plan.annual : plan.monthly}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/{annual ? 'yr' : 'mo'}</span>
            </p>
            <ul className="mt-4 grid gap-2">
              {plan.features.map((feature) => (
                <li key={feature} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                  <span><span className="sr-only">Included: </span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TogglePlan {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  features: string[];
  featured?: boolean;
}

export interface ComparisonPricingToggleProps {
  plans: TogglePlan[];
  currency?: string;
  className?: string;
}

type BillingCycle = 'monthly' | 'annual';

export function ComparisonPricingToggle({ plans, currency = '$', className = '' }: ComparisonPricingToggleProps): JSX.Element {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const annual = cycle === 'annual';

  return (
    <section className={\`w-full max-w-3xl \${className}\`}>
      <div className="mb-6 flex justify-center">
        <div role="radiogroup" aria-label="Billing cycle" className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
          {(['monthly', 'annual'] as const).map((option: BillingCycle) => {
            const active = cycle === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCycle(option)}
                className={\`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${active ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}\`}
              >
                {option}
                {option === 'annual' ? <span className="ml-1 text-emerald-700 dark:text-emerald-400">-20%</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan: TogglePlan) => (
          <section
            key={plan.id}
            aria-label={plan.name}
            className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${plan.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{plan.name}</h3>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currency}{annual ? plan.annual : plan.monthly}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/{annual ? 'yr' : 'mo'}</span>
            </p>
            <ul className="mt-4 grid gap-2">
              {plan.features.map((feature: string) => (
                <li key={feature} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                  <span><span className="sr-only">Included: </span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'comparison-vs-versus',
    category: 'comparisons',
    tags: ['comparison', 'versus', 'two-column', 'marketing', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      {
        name: 'left',
        type: 'VersusSide',
        required: true,
        descriptionKey: 'items',
        example: "{ id: 'a', name: 'Notion', tagline: 'Docs-first', points: ['Flexible pages'] }",
      },
      { name: 'right', type: 'VersusSide', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two labelled <section>s side by side with a decorative "VS" badge between
  them. The badge is aria-hidden and hides once the panels stack, so a stacked
  screen never shows a floating "VS" over the first card.
-->
<section class="relative w-full max-w-3xl">
  <div class="grid gap-4 sm:grid-cols-2">
    <section aria-label="Notion" class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Notion</h3>
      <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Docs-first workspace</p>
      <ul class="mt-3 grid gap-2">
        <li class="grid grid-cols-[0.75rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
          <span>Flexible pages</span>
        </li>
      </ul>
    </section>

    <section aria-label="ADYSRE" class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">ADYSRE</h3>
      <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Operations platform</p>
      <ul class="mt-3 grid gap-2">
        <li class="grid grid-cols-[0.75rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
          <span>Role-based access</span>
        </li>
      </ul>
    </section>
  </div>

  <span class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm sm:block dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" aria-hidden="true">VS</span>
</section>`,
      react: `const LEFT = { id: 'notion', name: 'Notion', tagline: 'Docs-first workspace', points: ['Flexible pages', 'Great for wikis', 'Weaker at structured data'] };
const RIGHT = { id: 'adysre', name: 'ADYSRE', tagline: 'Operations platform', points: ['Records, not pages', 'Role-based access', 'Reports that refresh themselves'] };

export function ComparisonVsVersus({ left = LEFT, right = RIGHT, className = '' }) {
  const sides = [left, right];

  return (
    <section className={\`relative w-full max-w-3xl \${className}\`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {sides.map((side) => (
          <section key={side.id} aria-label={side.name} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{side.name}</h3>
            {side.tagline ? <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{side.tagline}</p> : null}
            <ul className="mt-3 grid gap-2">
              {side.points.map((point) => (
                <li key={point} className="grid grid-cols-[0.75rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Decorative divider - hidden while the panels are stacked. */}
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm sm:block dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
        VS
      </span>
    </section>
  );
}`,
      typescript: `export interface VersusSide {
  id: string;
  name: string;
  tagline?: string;
  points: string[];
}

export interface ComparisonVsVersusProps {
  left: VersusSide;
  right: VersusSide;
  className?: string;
}

export function ComparisonVsVersus({ left, right, className = '' }: ComparisonVsVersusProps): JSX.Element {
  const sides: VersusSide[] = [left, right];

  return (
    <section className={\`relative w-full max-w-3xl \${className}\`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {sides.map((side: VersusSide) => (
          <section key={side.id} aria-label={side.name} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{side.name}</h3>
            {side.tagline ? <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{side.tagline}</p> : null}
            <ul className="mt-3 grid gap-2">
              {side.points.map((point: string) => (
                <li key={point} className="grid grid-cols-[0.75rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Decorative divider - hidden while the panels are stacked. */}
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm sm:block dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100">
        VS
      </span>
    </section>
  );
}`,
    },
  },

  {
    slug: 'comparison-pros-cons',
    category: 'comparisons',
    tags: ['comparison', 'pros-cons', 'list', 'decision', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'prosLabel', type: 'string', default: "'Pros'", descriptionKey: 'label' },
      { name: 'consLabel', type: 'string', default: "'Cons'", descriptionKey: 'label' },
      { name: 'pros', type: 'string[]', required: true, descriptionKey: 'items', example: "['No per-seat billing']" },
      { name: 'cons', type: 'string[]', required: true, descriptionKey: 'items', example: "['You own the upgrades']" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Each glyph is aria-hidden and paired with a visually-hidden "Pro:" / "Con:"
  prefix, so a screen reader never hears a bare "+" with nothing to anchor it.
  Colour is reinforced by the +/- and ✓/✗ glyphs, never the sole signal.
-->
<section class="w-full max-w-2xl">
  <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Should you self-host?</h2>
  <div class="grid gap-4 sm:grid-cols-2">
    <section aria-label="Pros" class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        <span aria-hidden="true">✓</span>Pros
      </h3>
      <ul class="grid gap-2">
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">+</span>
          <span><span class="sr-only">Pro: </span>No per-seat billing</span>
        </li>
      </ul>
    </section>

    <section aria-label="Cons" class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400">
        <span aria-hidden="true">✗</span>Cons
      </h3>
      <ul class="grid gap-2">
        <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-bold text-rose-700 dark:text-rose-400" aria-hidden="true">−</span>
          <span><span class="sr-only">Con: </span>You own the upgrades</span>
        </li>
      </ul>
    </section>
  </div>
</section>`,
      react: `export function ComparisonProsCons({ title, prosLabel = 'Pros', consLabel = 'Cons', pros = [], cons = [], className = '' }) {
  const columns = [
    { id: 'pros', label: prosLabel, items: pros, positive: true },
    { id: 'cons', label: consLabel, items: cons, positive: false },
  ];

  return (
    <section className={\`w-full max-w-2xl \${className}\`}>
      {title ? <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {columns.map((col) => (
          <section key={col.id} aria-label={col.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className={\`mb-3 flex items-center gap-2 text-sm font-semibold \${col.positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}\`}>
              <span aria-hidden="true">{col.positive ? '✓' : '✗'}</span>
              {col.label}
            </h3>
            <ul className="grid gap-2">
              {col.items.map((item) => (
                <li key={item} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className={\`font-bold \${col.positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}\`}>
                    {col.positive ? '+' : '−'}
                  </span>
                  <span><span className="sr-only">{col.positive ? 'Pro: ' : 'Con: '}</span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `export interface ComparisonProsConsProps {
  title?: string;
  prosLabel?: string;
  consLabel?: string;
  pros: string[];
  cons: string[];
  className?: string;
}

interface ProsConsColumn {
  id: string;
  label: string;
  items: string[];
  positive: boolean;
}

export function ComparisonProsCons({ title, prosLabel = 'Pros', consLabel = 'Cons', pros, cons, className = '' }: ComparisonProsConsProps): JSX.Element {
  const columns: ProsConsColumn[] = [
    { id: 'pros', label: prosLabel, items: pros, positive: true },
    { id: 'cons', label: consLabel, items: cons, positive: false },
  ];

  return (
    <section className={\`w-full max-w-2xl \${className}\`}>
      {title ? <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {columns.map((col: ProsConsColumn) => (
          <section key={col.id} aria-label={col.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className={\`mb-3 flex items-center gap-2 text-sm font-semibold \${col.positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}\`}>
              <span aria-hidden="true">{col.positive ? '✓' : '✗'}</span>
              {col.label}
            </h3>
            <ul className="grid gap-2">
              {col.items.map((item: string) => (
                <li key={item} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className={\`font-bold \${col.positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}\`}>
                    {col.positive ? '+' : '−'}
                  </span>
                  <span><span className="sr-only">{col.positive ? 'Pro: ' : 'Con: '}</span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'comparison-three-column',
    category: 'comparisons',
    tags: ['comparison', 'three-column', 'pricing', 'plans', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'primary' },
    ],
    props: [
      {
        name: 'columns',
        type: 'ThreeColItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'team', name: 'Team', price: '$29', highlight: true, features: [{ label: 'SSO', included: true }] }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Three plan columns that collapse to two then one. An excluded feature keeps its
  row - an aria-hidden ✗ plus a visually-hidden "Not included:" - so the lists
  stay row-aligned across columns instead of silently dropping absent rows.
-->
<div class="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <section aria-label="Free" class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between gap-2">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Free</h3>
    </div>
    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">$0</p>
    <ul class="mt-4 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>1 workspace</span>
      </li>
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-gray-400 dark:text-gray-600" aria-hidden="true">✗</span>
        <span class="text-gray-400 line-through dark:text-gray-600"><span class="sr-only">Not included: </span>Audit log</span>
      </li>
    </ul>
  </section>

  <section aria-label="Team" class="flex flex-col rounded-xl border border-blue-600 bg-white p-5 ring-1 ring-blue-600 dark:border-blue-400 dark:bg-gray-900 dark:ring-blue-400">
    <div class="flex items-center justify-between gap-2">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Team</h3>
      <span class="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">Popular</span>
    </div>
    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">$29</p>
    <ul class="mt-4 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>Audit log</span>
      </li>
    </ul>
  </section>

  <section aria-label="Enterprise" class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between gap-2">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Enterprise</h3>
    </div>
    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Custom</p>
    <ul class="mt-4 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>SSO & SAML</span>
      </li>
    </ul>
  </section>
</div>`,
      react: `const COLUMNS = [
  { id: 'free', name: 'Free', price: '$0', features: [{ label: '1 workspace', included: true }, { label: 'Audit log', included: false }] },
  { id: 'team', name: 'Team', price: '$29', highlight: true, features: [{ label: 'Unlimited workspaces', included: true }, { label: 'Audit log', included: true }] },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: [{ label: 'SSO & SAML', included: true }, { label: 'Dedicated manager', included: true }] },
];

export function ComparisonThreeColumn({ columns = COLUMNS, className = '' }) {
  return (
    <div className={\`grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3 \${className}\`}>
      {columns.map((col) => (
        <section
          key={col.id}
          aria-label={col.name}
          className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${col.highlight ? 'border-blue-600 ring-1 ring-blue-600 dark:border-blue-400 dark:ring-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{col.name}</h3>
            {col.highlight ? <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">Popular</span> : null}
          </div>
          {col.price ? <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{col.price}</p> : null}
          <ul className="mt-4 grid gap-2">
            {col.features.map((feature) => (
              <li key={feature.label} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" className={feature.included ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-400 dark:text-gray-600'}>
                  {feature.included ? '✓' : '✗'}
                </span>
                <span className={feature.included ? '' : 'text-gray-400 line-through dark:text-gray-600'}>
                  <span className="sr-only">{feature.included ? 'Included: ' : 'Not included: '}</span>{feature.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}`,
      typescript: `export interface ThreeColFeature {
  label: string;
  included: boolean;
}

export interface ThreeColItem {
  id: string;
  name: string;
  price?: string;
  highlight?: boolean;
  features: ThreeColFeature[];
}

export interface ComparisonThreeColumnProps {
  columns: ThreeColItem[];
  className?: string;
}

export function ComparisonThreeColumn({ columns, className = '' }: ComparisonThreeColumnProps): JSX.Element {
  return (
    <div className={\`grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3 \${className}\`}>
      {columns.map((col: ThreeColItem) => (
        <section
          key={col.id}
          aria-label={col.name}
          className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${col.highlight ? 'border-blue-600 ring-1 ring-blue-600 dark:border-blue-400 dark:ring-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{col.name}</h3>
            {col.highlight ? <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">Popular</span> : null}
          </div>
          {col.price ? <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{col.price}</p> : null}
          <ul className="mt-4 grid gap-2">
            {col.features.map((feature: ThreeColFeature) => (
              <li key={feature.label} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" className={feature.included ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-400 dark:text-gray-600'}>
                  {feature.included ? '✓' : '✗'}
                </span>
                <span className={feature.included ? '' : 'text-gray-400 line-through dark:text-gray-600'}>
                  <span className="sr-only">{feature.included ? 'Included: ' : 'Not included: '}</span>{feature.label}
                </span>
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
    slug: 'comparison-spec-list',
    category: 'comparisons',
    tags: ['comparison', 'spec-sheet', 'products', 'definition-list', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'striped', labelKey: 'bordered' },
    ],
    props: [
      { name: 'productA', type: 'string', required: true, descriptionKey: 'columns' },
      { name: 'productB', type: 'string', required: true, descriptionKey: 'columns' },
      {
        name: 'specs',
        type: 'SpecRow[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'ram', label: 'Memory', a: '8 GB', b: '16 GB' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A three-up spec sheet from a <dl>. On mobile the header row hides and each
  value carries its own inline product label, so the sheet stacks without
  losing which value belongs to which product - no table to scroll.
-->
<section class="w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-800">
  <div class="hidden grid-cols-[1fr_1fr_1fr] gap-3 border-b border-gray-200 px-4 py-3 sm:grid dark:border-gray-800">
    <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">Spec</span>
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Model A</span>
    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Model B</span>
  </div>
  <dl class="divide-y divide-gray-100 dark:divide-gray-800">
    <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[1fr_1fr_1fr] sm:gap-3">
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Memory</dt>
      <dd class="m-0 text-sm text-gray-900 dark:text-gray-100"><span class="font-semibold text-gray-400 sm:hidden dark:text-gray-500">Model A: </span>8 GB</dd>
      <dd class="m-0 text-sm text-gray-900 dark:text-gray-100"><span class="font-semibold text-gray-400 sm:hidden dark:text-gray-500">Model B: </span>16 GB</dd>
    </div>
    <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[1fr_1fr_1fr] sm:gap-3">
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</dt>
      <dd class="m-0 text-sm text-gray-900 dark:text-gray-100"><span class="font-semibold text-gray-400 sm:hidden dark:text-gray-500">Model A: </span>256 GB</dd>
      <dd class="m-0 text-sm text-gray-900 dark:text-gray-100"><span class="font-semibold text-gray-400 sm:hidden dark:text-gray-500">Model B: </span>1 TB</dd>
    </div>
  </dl>
</section>`,
      react: `const SPECS = [
  { id: 'storage', label: 'Storage', a: '256 GB', b: '1 TB' },
  { id: 'ram', label: 'Memory', a: '8 GB', b: '16 GB' },
  { id: 'battery', label: 'Battery', a: '18 h', b: '22 h' },
];

export function ComparisonSpecList({ productA = 'Model A', productB = 'Model B', specs = SPECS, className = '' }) {
  return (
    <section className={\`w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}>
      <div className="hidden grid-cols-[1fr_1fr_1fr] gap-3 border-b border-gray-200 px-4 py-3 sm:grid dark:border-gray-800">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Spec</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{productA}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{productB}</span>
      </div>
      <dl className="divide-y divide-gray-100 dark:divide-gray-800">
        {specs.map((spec) => (
          <div key={spec.id} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[1fr_1fr_1fr] sm:gap-3">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{spec.label}</dt>
            <dd className="m-0 text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold text-gray-400 sm:hidden dark:text-gray-500">{productA}: </span>{spec.a}
            </dd>
            <dd className="m-0 text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold text-gray-400 sm:hidden dark:text-gray-500">{productB}: </span>{spec.b}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
      typescript: `export interface SpecRow {
  id: string;
  label: string;
  a: string;
  b: string;
}

export interface ComparisonSpecListProps {
  productA: string;
  productB: string;
  specs: SpecRow[];
  className?: string;
}

export function ComparisonSpecList({ productA, productB, specs, className = '' }: ComparisonSpecListProps): JSX.Element {
  return (
    <section className={\`w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}>
      <div className="hidden grid-cols-[1fr_1fr_1fr] gap-3 border-b border-gray-200 px-4 py-3 sm:grid dark:border-gray-800">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Spec</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{productA}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{productB}</span>
      </div>
      <dl className="divide-y divide-gray-100 dark:divide-gray-800">
        {specs.map((spec: SpecRow) => (
          <div key={spec.id} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[1fr_1fr_1fr] sm:gap-3">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{spec.label}</dt>
            <dd className="m-0 text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold text-gray-400 sm:hidden dark:text-gray-500">{productA}: </span>{spec.a}
            </dd>
            <dd className="m-0 text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold text-gray-400 sm:hidden dark:text-gray-500">{productB}: </span>{spec.b}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
    },
  },

  {
    slug: 'comparison-plan-matrix',
    category: 'comparisons',
    tags: ['comparison', 'matrix', 'table', 'pricing', 'a11y'],
    difficulty: 'intermediate',
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
      {
        name: 'plans',
        type: 'MatrixPlan[]',
        required: true,
        descriptionKey: 'columns',
        example: "[{ name: 'Pro', price: '$29' }]",
      },
      {
        name: 'rows',
        type: 'MatrixRow[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'sso', label: 'SSO & SAML', values: [false, false, true] }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A real table with a price under each plan name. The wrapper (not the table)
  scrolls and the table keeps a min-width, so at 320px the columns scroll while
  the feature column stays put. Boolean cells are ✓/✗ (aria-hidden) + sr-only word.
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
    <thead>
      <tr>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Feature</th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="block font-semibold text-gray-900 dark:text-gray-100">Starter</span>
          <span class="block text-xs font-normal text-gray-500 dark:text-gray-400">$0</span>
        </th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="block font-semibold text-gray-900 dark:text-gray-100">Pro</span>
          <span class="block text-xs font-normal text-gray-500 dark:text-gray-400">$29</span>
        </th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="block font-semibold text-gray-900 dark:text-gray-100">Enterprise</span>
          <span class="block text-xs font-normal text-gray-500 dark:text-gray-400">Custom</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Seats</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">1</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">10</td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
      </tr>
      <tr>
        <th scope="row" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">SSO &amp; SAML</th>
        <td class="px-3 py-2.5 text-center">
          <span class="font-bold text-gray-400 dark:text-gray-600" aria-hidden="true">✗</span><span class="sr-only">Not included</span>
        </td>
        <td class="px-3 py-2.5 text-center">
          <span class="font-bold text-gray-400 dark:text-gray-600" aria-hidden="true">✗</span><span class="sr-only">Not included</span>
        </td>
        <td class="px-3 py-2.5 text-center">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span><span class="sr-only">Included</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `const PLANS = [
  { name: 'Starter', price: '$0' },
  { name: 'Pro', price: '$29' },
  { name: 'Enterprise', price: 'Custom' },
];

const ROWS = [
  { id: 'seats', label: 'Seats', values: ['1', '10', 'Unlimited'] },
  { id: 'support', label: 'Priority support', values: [false, true, true] },
  { id: 'sso', label: 'SSO & SAML', values: [false, false, true] },
];

function BoolCell({ on }) {
  return (
    <>
      <span aria-hidden="true" className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-400 dark:text-gray-600'}>
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function ComparisonPlanMatrix({ plans = PLANS, rows = ROWS, className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Feature</th>
            {plans.map((plan) => (
              <th key={plan.name} scope="col" className="border-b border-gray-200 px-3 py-2.5 text-center dark:border-gray-800">
                <span className="block font-semibold text-gray-900 dark:text-gray-100">{plan.name}</span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">{plan.price}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 last:border-0 dark:border-gray-800 dark:text-gray-300">{row.label}</th>
              {row.values.map((value, i) => (
                <td key={\`\${row.id}-\${i}\`} className="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">
                  {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `export interface MatrixPlan {
  name: string;
  price: string;
}

export interface MatrixRow {
  id: string;
  label: string;
  /** Positional: values[i] belongs to plans[i]. Boolean -> ✓/✗, string -> verbatim. */
  values: Array<boolean | string>;
}

export interface ComparisonPlanMatrixProps {
  plans: MatrixPlan[];
  rows: MatrixRow[];
  className?: string;
}

function BoolCell({ on }: { on: boolean }): JSX.Element {
  return (
    <>
      <span aria-hidden="true" className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-400 dark:text-gray-600'}>
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function ComparisonPlanMatrix({ plans, rows, className = '' }: ComparisonPlanMatrixProps): JSX.Element {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Feature</th>
            {plans.map((plan: MatrixPlan) => (
              <th key={plan.name} scope="col" className="border-b border-gray-200 px-3 py-2.5 text-center dark:border-gray-800">
                <span className="block font-semibold text-gray-900 dark:text-gray-100">{plan.name}</span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">{plan.price}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: MatrixRow) => (
            <tr key={row.id}>
              <th scope="row" className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 last:border-0 dark:border-gray-800 dark:text-gray-300">{row.label}</th>
              {row.values.map((value: boolean | string, i: number) => (
                <td key={\`\${row.id}-\${i}\`} className="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300">
                  {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },

  {
    slug: 'comparison-highlight-diff',
    category: 'comparisons',
    tags: ['comparison', 'diff', 'highlight', 'winner', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'labelA', type: 'string', required: true, descriptionKey: 'columns' },
      { name: 'labelB', type: 'string', required: true, descriptionKey: 'columns' },
      {
        name: 'rows',
        type: 'DiffRow[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'sla', label: 'Uptime SLA', a: '99.9%', b: '99.99%', winner: 'b' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The winning cell is tinted AND flagged with a ★ glyph plus a visually-hidden
  "(best)" - colour never carries the verdict alone, so it survives forced
  colours and greyscale. Cells stack to one column below 40rem.
-->
<div class="grid w-full max-w-2xl gap-3">
  <div>
    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Uptime SLA</p>
    <div class="grid gap-2 sm:grid-cols-2">
      <div class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">
        <span class="mb-0.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Basic</span>
        <span class="flex items-center gap-1.5">99.9%</span>
      </div>
      <div class="rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100">
        <span class="mb-0.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Plus</span>
        <span class="flex items-center gap-1.5">
          <span class="text-emerald-700 dark:text-emerald-400" aria-hidden="true">★</span>99.99%<span class="sr-only"> (best)</span>
        </span>
      </div>
    </div>
  </div>
</div>`,
      react: `const ROWS = [
  { id: 'price', label: 'Starting price', a: '$19 / mo', b: '$29 / mo', winner: 'a' },
  { id: 'uptime', label: 'Uptime SLA', a: '99.9%', b: '99.99%', winner: 'b' },
  { id: 'support', label: 'Support', a: 'Email only', b: '24/7 chat', winner: 'b' },
];

export function ComparisonHighlightDiff({ labelA = 'Basic', labelB = 'Plus', rows = ROWS, className = '' }) {
  const cellClass = (win) =>
    \`rounded-lg border px-3 py-2 text-sm \${win ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100' : 'border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300'}\`;

  return (
    <div className={\`grid w-full max-w-2xl gap-3 \${className}\`}>
      {rows.map((row) => (
        <div key={row.id}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{row.label}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[{ key: 'a', label: labelA, value: row.a }, { key: 'b', label: labelB, value: row.b }].map((side) => {
              const win = row.winner === side.key;
              return (
                <div key={side.key} className={cellClass(win)}>
                  <span className="mb-0.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">{side.label}</span>
                  <span className="flex items-center gap-1.5">
                    {win ? <span aria-hidden="true" className="text-emerald-700 dark:text-emerald-400">★</span> : null}
                    {side.value}
                    {win ? <span className="sr-only"> (best)</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}`,
      typescript: `export type DiffWinner = 'a' | 'b' | 'tie';

export interface DiffRow {
  id: string;
  label: string;
  a: string;
  b: string;
  winner: DiffWinner;
}

export interface ComparisonHighlightDiffProps {
  labelA: string;
  labelB: string;
  rows: DiffRow[];
  className?: string;
}

export function ComparisonHighlightDiff({ labelA, labelB, rows, className = '' }: ComparisonHighlightDiffProps): JSX.Element {
  const cellClass = (win: boolean): string =>
    \`rounded-lg border px-3 py-2 text-sm \${win ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100' : 'border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300'}\`;

  return (
    <div className={\`grid w-full max-w-2xl gap-3 \${className}\`}>
      {rows.map((row: DiffRow) => (
        <div key={row.id}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{row.label}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              { key: 'a' as const, label: labelA, value: row.a },
              { key: 'b' as const, label: labelB, value: row.b },
            ]).map((side) => {
              const win = row.winner === side.key;
              return (
                <div key={side.key} className={cellClass(win)}>
                  <span className="mb-0.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">{side.label}</span>
                  <span className="flex items-center gap-1.5">
                    {win ? <span aria-hidden="true" className="text-emerald-700 dark:text-emerald-400">★</span> : null}
                    {side.value}
                    {win ? <span className="sr-only"> (best)</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'comparison-side-by-side-cards',
    category: 'comparisons',
    tags: ['comparison', 'cards', 'products', 'cta', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      {
        name: 'products',
        type: 'SideCard[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'cloud', name: 'ADYSRE Cloud', price: '$29/mo', features: ['Zero maintenance'], ctaLabel: 'Start', ctaHref: '#' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two product cards that stack below 40rem. The avatar is a gradient tile with
  initials (aria-hidden) - no external image to load. The CTA is a real link
  with a focus-visible ring.
-->
<div class="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
  <section aria-label="ADYSRE Cloud" class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center gap-3">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white" aria-hidden="true">AC</span>
      <div class="min-w-0">
        <h3 class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">ADYSRE Cloud</h3>
        <p class="truncate text-xs text-gray-500 dark:text-gray-400">Fully managed</p>
      </div>
    </div>
    <p class="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">$29/mo</p>
    <ul class="mt-3 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>Zero maintenance</span>
      </li>
    </ul>
    <a href="#" class="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Start free</a>
  </section>

  <section aria-label="Self Hosted" class="flex flex-col rounded-xl border border-blue-600 bg-white p-5 dark:border-blue-400 dark:bg-gray-900">
    <div class="flex items-center gap-3">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white" aria-hidden="true">SH</span>
      <div class="min-w-0">
        <h3 class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">Self Hosted</h3>
        <p class="truncate text-xs text-gray-500 dark:text-gray-400">Your infrastructure</p>
      </div>
    </div>
    <p class="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">$0/mo</p>
    <ul class="mt-3 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>Data in your VPC</span>
      </li>
    </ul>
    <a href="#" class="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">View the docs</a>
  </section>
</div>`,
      react: `const PRODUCTS = [
  { id: 'cloud', name: 'ADYSRE Cloud', subtitle: 'Fully managed', price: '$29/mo', features: ['Zero maintenance', 'Automatic backups'], ctaLabel: 'Start free', ctaHref: '#' },
  { id: 'self', name: 'Self Hosted', subtitle: 'Your infrastructure', price: '$0/mo', featured: true, features: ['Data in your VPC', 'No per-seat billing'], ctaLabel: 'View the docs', ctaHref: '#' },
];

function initials(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function ComparisonSideBySideCards({ products = PRODUCTS, className = '' }) {
  return (
    <div className={\`grid w-full max-w-3xl gap-4 sm:grid-cols-2 \${className}\`}>
      {products.map((product) => (
        <section
          key={product.id}
          aria-label={product.name}
          className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${product.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
        >
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">{initials(product.name)}</span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">{product.name}</h3>
              {product.subtitle ? <p className="truncate text-xs text-gray-500 dark:text-gray-400">{product.subtitle}</p> : null}
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{product.price}</p>
          <ul className="mt-3 grid gap-2">
            {product.features.map((feature) => (
              <li key={feature} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                <span><span className="sr-only">Included: </span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href={product.ctaHref}
            className={\`mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${product.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
          >
            {product.ctaLabel}
          </a>
        </section>
      ))}
    </div>
  );
}`,
      typescript: `export interface SideCard {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}

export interface ComparisonSideBySideCardsProps {
  products: SideCard[];
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function ComparisonSideBySideCards({ products, className = '' }: ComparisonSideBySideCardsProps): JSX.Element {
  return (
    <div className={\`grid w-full max-w-3xl gap-4 sm:grid-cols-2 \${className}\`}>
      {products.map((product: SideCard) => (
        <section
          key={product.id}
          aria-label={product.name}
          className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${product.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
        >
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">{initials(product.name)}</span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">{product.name}</h3>
              {product.subtitle ? <p className="truncate text-xs text-gray-500 dark:text-gray-400">{product.subtitle}</p> : null}
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{product.price}</p>
          <ul className="mt-3 grid gap-2">
            {product.features.map((feature: string) => (
              <li key={feature} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                <span><span className="sr-only">Included: </span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href={product.ctaHref}
            className={\`mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${product.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
          >
            {product.ctaLabel}
          </a>
        </section>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'comparison-checkmark-grid',
    category: 'comparisons',
    tags: ['comparison', 'checkmark', 'grid', 'table', 'a11y'],
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
      {
        name: 'options',
        type: 'string[]',
        required: true,
        descriptionKey: 'columns',
        example: "['Free', 'Pro', 'Team']",
      },
      {
        name: 'rows',
        type: 'CheckGridRow[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'sso', label: 'SSO', support: [false, false, true] }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A pure support grid: every cell is a boolean, so each is an aria-hidden ✓/✗
  plus a visually-hidden "Supported"/"Not supported". It is a real table (scoped
  headers) and its wrapper scrolls, keeping the capability column on screen at 320px.
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[32rem] border-collapse text-left text-sm">
    <thead>
      <tr>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Capability</th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">Free</th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">Pro</th>
        <th scope="col" class="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">Team</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row" class="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Webhooks</th>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-gray-400 dark:text-gray-600" aria-hidden="true">✗</span><span class="sr-only">Not supported</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span><span class="sr-only">Supported</span>
        </td>
        <td class="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
          <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span><span class="sr-only">Supported</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `const OPTIONS = ['Free', 'Pro', 'Team'];

const ROWS = [
  { id: 'api', label: 'REST API', support: [true, true, true] },
  { id: 'webhooks', label: 'Webhooks', support: [false, true, true] },
  { id: 'sso', label: 'SSO', support: [false, false, true] },
];

export function ComparisonCheckmarkGrid({ options = OPTIONS, rows = ROWS, className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Capability</th>
            {options.map((option) => (
              <th key={option} scope="col" className="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">{option}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 last:border-0 dark:border-gray-800 dark:text-gray-300">{row.label}</th>
              {row.support.map((on, i) => (
                <td key={\`\${row.id}-\${i}\`} className="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
                  <span aria-hidden="true" className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-400 dark:text-gray-600'}>{on ? '✓' : '✗'}</span>
                  <span className="sr-only">{on ? 'Supported' : 'Not supported'}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `export interface CheckGridRow {
  id: string;
  label: string;
  /** Positional: support[i] belongs to options[i]. */
  support: boolean[];
}

export interface ComparisonCheckmarkGridProps {
  options: string[];
  rows: CheckGridRow[];
  className?: string;
}

export function ComparisonCheckmarkGrid({ options, rows, className = '' }: ComparisonCheckmarkGridProps): JSX.Element {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">Capability</th>
            {options.map((option: string) => (
              <th key={option} scope="col" className="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">{option}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: CheckGridRow) => (
            <tr key={row.id}>
              <th scope="row" className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 last:border-0 dark:border-gray-800 dark:text-gray-300">{row.label}</th>
              {row.support.map((on: boolean, i: number) => (
                <td key={\`\${row.id}-\${i}\`} className="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800">
                  <span aria-hidden="true" className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-400 dark:text-gray-600'}>{on ? '✓' : '✗'}</span>
                  <span className="sr-only">{on ? 'Supported' : 'Not supported'}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },

  {
    slug: 'comparison-tiered-features',
    category: 'comparisons',
    tags: ['comparison', 'tiers', 'features', 'pricing', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      {
        name: 'tiers',
        type: 'Tier[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'team', name: 'Team', price: '$29', inheritsFrom: 'Starter', features: ['Priority support'] }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Tiers stack into a responsive grid. Each higher tier states what it inherits
  in words ("Everything in Team, plus") instead of re-listing every lower
  feature - shorter to read and impossible to let the lists drift out of sync.
-->
<div class="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <section aria-label="Starter" class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Starter</h3>
    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">$0</p>
    <ul class="mt-2 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>1 project</span>
      </li>
    </ul>
  </section>

  <section aria-label="Team" class="flex flex-col rounded-xl border border-blue-600 bg-white p-5 dark:border-blue-400 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Team</h3>
    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">$29</p>
    <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Everything in Starter, plus</p>
    <ul class="mt-2 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>Priority support</span>
      </li>
    </ul>
  </section>

  <section aria-label="Enterprise" class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Enterprise</h3>
    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Custom</p>
    <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Everything in Team, plus</p>
    <ul class="mt-2 grid gap-2">
      <li class="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-bold text-emerald-700 dark:text-emerald-400" aria-hidden="true">✓</span>
        <span><span class="sr-only">Included: </span>SSO & SAML</span>
      </li>
    </ul>
  </section>
</div>`,
      react: `const TIERS = [
  { id: 'starter', name: 'Starter', price: '$0', features: ['1 project', 'Community support'] },
  { id: 'team', name: 'Team', price: '$29', inheritsFrom: 'Starter', featured: true, features: ['Unlimited projects', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', inheritsFrom: 'Team', features: ['SSO & SAML', 'Dedicated manager'] },
];

export function ComparisonTieredFeatures({ tiers = TIERS, className = '' }) {
  return (
    <div className={\`grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3 \${className}\`}>
      {tiers.map((tier) => (
        <section
          key={tier.id}
          aria-label={tier.name}
          className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${tier.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h3>
          {tier.price ? <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{tier.price}</p> : null}
          {tier.inheritsFrom ? <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Everything in {tier.inheritsFrom}, plus</p> : null}
          <ul className="mt-2 grid gap-2">
            {tier.features.map((feature) => (
              <li key={feature} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                <span><span className="sr-only">Included: </span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}`,
      typescript: `export interface Tier {
  id: string;
  name: string;
  price?: string;
  inheritsFrom?: string;
  features: string[];
  featured?: boolean;
}

export interface ComparisonTieredFeaturesProps {
  tiers: Tier[];
  className?: string;
}

export function ComparisonTieredFeatures({ tiers, className = '' }: ComparisonTieredFeaturesProps): JSX.Element {
  return (
    <div className={\`grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3 \${className}\`}>
      {tiers.map((tier: Tier) => (
        <section
          key={tier.id}
          aria-label={tier.name}
          className={\`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 \${tier.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'}\`}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h3>
          {tier.price ? <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{tier.price}</p> : null}
          {tier.inheritsFrom ? <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Everything in {tier.inheritsFrom}, plus</p> : null}
          <ul className="mt-2 grid gap-2">
            {tier.features.map((feature: string) => (
              <li key={feature} className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">✓</span>
                <span><span className="sr-only">Included: </span>{feature}</span>
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
];
