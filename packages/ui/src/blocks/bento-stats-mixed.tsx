/**
 * Live preview for `bento-stats-mixed`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface Stat {
  value: string;
  label: string;
  featured?: boolean;
  className?: string;
}

const STATS: Stat[] = [
  { value: '99.99%', label: 'Uptime across all regions, measured every minute', featured: true, className: 'sm:col-span-2 sm:row-span-2' },
  { value: '2.4M', label: 'Requests per minute', className: 'sm:col-span-2' },
  { value: '38ms', label: 'p95 latency' },
  { value: '150+', label: 'Edge locations' },
];

export function BentoStatsMixed({ stats = STATS, className = '' }: { stats?: Stat[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-4 sm:p-6 ${className}`}>
      {stats.map((s, i) =>
        s.featured ? (
          <dl key={i} className={`flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white ${s.className ?? ''}`}>
            <dd className="order-1 text-4xl font-bold tracking-tight sm:text-5xl">{s.value}</dd>
            <dt className="order-2 mt-2 text-sm font-medium text-blue-100">{s.label}</dt>
          </dl>
        ) : (
          <dl key={i} className={`flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${s.className ?? ''}`}>
            <dd className="order-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</dd>
            <dt className="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">{s.label}</dt>
          </dl>
        ),
      )}
    </section>
  );
}

export const minHeight = 500;

export default function BentoStatsMixedPreview() {
  return <BentoStatsMixed />;
}
