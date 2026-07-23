/**
 * Live preview for `stats-dark-gradient`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
interface DarkStatItem {
  label: string;
  value: string;
}

interface StatsDarkGradientProps {
  items?: DarkStatItem[];
  eyebrow?: string;
  className?: string;
}

const DEFAULT_ITEMS: DarkStatItem[] = [
  { label: 'Uptime SLA', value: '99.98%' },
  { label: 'Countries served', value: '140+' },
  { label: 'Requests / day', value: '2.4B' },
  { label: 'Avg. response', value: '48ms' },
];

export function StatsDarkGradient({ items = DEFAULT_ITEMS, eyebrow, className = '' }: StatsDarkGradientProps) {
  return (
    <section className={`w-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 px-6 py-10 sm:px-10 ${className}`}>
      {eyebrow ? (
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-300">{eyebrow}</p>
      ) : null}
      <dl className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col text-center">
            <dd className="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{item.value}</dd>
            <dt className="order-2 mt-1 text-sm text-gray-400">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export const minHeight = 280;

export default function StatsDarkGradientPreview() {
  return <StatsDarkGradient eyebrow="By the numbers" />;
}
