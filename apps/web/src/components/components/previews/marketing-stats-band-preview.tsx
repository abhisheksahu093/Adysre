/**
 * Live preview for `marketing-stats-band`.
 *
 * Mirrors the `typescript` code variant verbatim. Text sits on a gradient, so a
 * `bg-black/30` scrim layer holds contrast. The stats collapse to one column on
 * phones. The section itself is width-agnostic (`w-full`); the preview supplies
 * the page shell that centres it. Keep in step with
 * `src/data/components/marketing.ts`.
 */
interface Stat {
  value: string;
  label: string;
}

interface StatsBandProps {
  title?: string;
  stats: Stat[];
  className?: string;
}

function StatsBand({ title, stats, className = '' }: StatsBandProps) {
  return (
    <section
      className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 ${className}`}
    >
      {/* Scrim: white numerals stay AA over the full sweep of the gradient. */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative px-6 py-10 sm:px-8">
        {title ? (
          <h2 className="mb-8 text-center text-lg font-semibold text-white/90">{title}</h2>
        ) : null}
        <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <dt className="order-2 mt-1 text-sm font-medium text-white/80">{stat.label}</dt>
              <dd className="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function MarketingStatsBandPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <StatsBand
          title="Teams ship faster on ADYSRE"
          stats={[
            { value: '12,000+', label: 'Active teams' },
            { value: '99.98%', label: 'Uptime' },
            { value: '4.9/5', label: 'Average rating' },
            { value: '40+', label: 'Integrations' },
          ]}
        />
      </div>
    </section>
  );
}

export const minHeight = 280;
