/**
 * Live preview for `comparison-pros-cons`.
 *
 * Mirrors the `typescript` code variant. Each glyph is aria-hidden and paired
 * with a visually-hidden "Pro:" / "Con:" prefix, so a screen reader never gets
 * a bare "+" with no anchor. Keep this in step with
 * `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface ComparisonProsConsProps {
  title?: string;
  prosLabel?: string;
  consLabel?: string;
  pros: string[];
  cons: string[];
  className?: string;
}

function ComparisonProsCons({
  title,
  prosLabel = 'Pros',
  consLabel = 'Cons',
  pros,
  cons,
  className = '',
}: ComparisonProsConsProps) {
  const columns = [
    { id: 'pros', label: prosLabel, items: pros, positive: true },
    { id: 'cons', label: consLabel, items: cons, positive: false },
  ];

  return (
    <section className={`w-full ${className}`}>
      {title ? <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {columns.map((col) => (
          <section
            key={col.id}
            aria-label={col.label}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <h3
              className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
                col.positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
              }`}
            >
              <span aria-hidden="true">{col.positive ? '✓' : '✗'}</span>
              {col.label}
            </h3>
            <ul className="grid gap-2">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span
                    aria-hidden="true"
                    className={`font-bold ${
                      col.positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {col.positive ? '+' : '−'}
                  </span>
                  <span>
                    <span className="sr-only">{col.positive ? 'Pro: ' : 'Con: '}</span>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

export default function ComparisonProsConsPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonProsCons
          title="Should you self-host?"
          pros={['No per-seat billing', 'Data stays in your VPC', 'Full API access']}
          cons={['You own the upgrades', 'Needs an on-call rotation', 'Slower to start']}
        />
      </div>
    </section>
  );
}

export const minHeight = 300;
