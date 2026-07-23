/**
 * Live preview for `comparison-highlight-diff`.
 *
 * Mirrors the `typescript` code variant. The winning cell is tinted AND marked
 * with a star glyph plus a visually-hidden "(best)" - colour alone never
 * carries the verdict. Keep this in step with
 * `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
type DiffWinner = 'a' | 'b' | 'tie';

interface DiffRow {
  id: string;
  label: string;
  a: string;
  b: string;
  winner: DiffWinner;
}

interface ComparisonHighlightDiffProps {
  labelA: string;
  labelB: string;
  rows: DiffRow[];
  className?: string;
}

export function ComparisonHighlightDiff({ labelA, labelB, rows, className = '' }: ComparisonHighlightDiffProps) {
  const cellClass = (win: boolean) =>
    `rounded-lg border px-3 py-2 text-sm ${
      win
        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100'
        : 'border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300'
    }`;

  return (
    <div className={`grid w-full gap-3 ${className}`}>
      {rows.map((row) => (
        <div key={row.id}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {row.label}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                { key: 'a' as const, label: labelA, value: row.a },
                { key: 'b' as const, label: labelB, value: row.b },
              ]
            ).map((side) => {
              const win = row.winner === side.key;
              return (
                <div key={side.key} className={cellClass(win)}>
                  <span className="mb-0.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {side.label}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {win ? (
                      <span aria-hidden="true" className="text-emerald-700 dark:text-emerald-400">
                        ★
                      </span>
                    ) : null}
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
}

const SAMPLE_ROWS: DiffRow[] = [
  { id: 'price', label: 'Starting price', a: '$19 / mo', b: '$29 / mo', winner: 'a' },
  { id: 'uptime', label: 'Uptime SLA', a: '99.9%', b: '99.99%', winner: 'b' },
  { id: 'seats', label: 'Included seats', a: '5', b: '5', winner: 'tie' },
  { id: 'support', label: 'Support', a: 'Email only', b: '24/7 chat', winner: 'b' },
];

export default function ComparisonHighlightDiffPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonHighlightDiff labelA="Basic" labelB="Plus" rows={SAMPLE_ROWS} />
      </div>
    </section>
  );
}

export const minHeight = 360;
