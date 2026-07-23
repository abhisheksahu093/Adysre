/**
 * Live preview for `bento-icon-features`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
type IconName = 'bolt' | 'shield' | 'chart';

interface IconFeature {
  icon: IconName;
  title: string;
  description: string;
  className?: string;
}

function Icon({ name }: { name: IconName }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, className: 'h-5 w-5', 'aria-hidden': true } as const;
  if (name === 'shield')
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
      </svg>
    );
  if (name === 'chart')
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M8 15v-4m4 4V9m4 6v-2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

const FEATURES: IconFeature[] = [
  { icon: 'bolt', title: 'Fast by default', description: 'Edge-rendered and cached - pages arrive before the spinner would.', className: 'sm:col-span-2' },
  { icon: 'shield', title: 'Secure', description: 'SOC 2 controls baked in.' },
  { icon: 'chart', title: 'Insightful', description: 'Metrics that mean something.' },
];

export function BentoIconFeatures({ features = FEATURES, className = '' }: { features?: IconFeature[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 ${className}`}>
      {features.map((f, i) => (
        <article key={i} className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${f.className ?? ''}`}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Icon name={f.icon} />
          </span>
          <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}

export const minHeight = 480;

export default function BentoIconFeaturesPreview() {
  return <BentoIconFeatures />;
}
