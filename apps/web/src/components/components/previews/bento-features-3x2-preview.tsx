/**
 * Live preview for `bento-features-3x2`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface Feature {
  title: string;
  description: string;
  className?: string;
}

const FEATURES: Feature[] = [
  { title: 'Realtime sync', description: 'Every change lands on every device the instant it happens - no refresh, no merge dialog.', className: 'sm:col-span-2 sm:row-span-2' },
  { title: 'Version history', description: 'Roll back to any point.' },
  { title: 'Access control', description: 'Roles down to the field.' },
  { title: 'Audit log', description: 'Who did what, when.' },
  { title: 'Integrations', description: 'Connect the tools your team already lives in, in a couple of clicks.', className: 'sm:col-span-2' },
];

function BentoFeatures3x2({ features = FEATURES, className = '' }: { features?: Feature[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 ${className}`}>
      {features.map((f, i) => (
        <article
          key={i}
          className={`flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${f.className ?? ''}`}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}

export const minHeight = 720;

export default function BentoFeatures3x2Preview() {
  return <BentoFeatures3x2 />;
}
