'use client';

import { useId } from 'react';

/**
 * Live preview for `comparison-two-column`.
 *
 * Mirrors the `typescript` code variant. Deliberately not a table: the two
 * lists have no shared row axis, so each side is its own labelled <section>.
 * Keep this in step with `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
type ComparisonTone = 'positive' | 'negative';

interface ComparisonColumn {
  id: string;
  heading: string;
  /** Drives the glyph, the accent rule and the visually-hidden prefix together. */
  tone: ComparisonTone;
  points: string[];
}

interface ComparisonTwoColumnProps {
  kicker?: string;
  title: string;
  items: ComparisonColumn[];
  className?: string;
}

function ComparisonTwoColumn({ kicker, title, items, className = '' }: ComparisonTwoColumnProps) {
  const titleId = useId();

  return (
    <section className={`w-full ${className}`} aria-labelledby={titleId}>
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
              aria-labelledby={`${titleId}-${column.id}`}
              className={`rounded-xl border border-t-[3px] border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${
                positive
                  ? 'border-t-emerald-700 dark:border-t-emerald-400'
                  : 'border-t-gray-400 dark:border-t-gray-500'
              }`}
            >
              <h3
                id={`${titleId}-${column.id}`}
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
}

const SAMPLE_COLUMNS: ComparisonColumn[] = [
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

export default function ComparisonTwoColumnPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonTwoColumn
          kicker="Why teams switch"
          title="Spreadsheets vs. a real system"
          items={SAMPLE_COLUMNS}
        />
      </div>
    </section>
  );
}
