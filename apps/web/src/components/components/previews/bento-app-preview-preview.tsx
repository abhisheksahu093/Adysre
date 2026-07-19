/**
 * Live preview for `bento-app-preview`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface AppFeature {
  title: string;
  description: string;
}

const FEATURES: AppFeature[] = [
  { title: 'One dashboard', description: 'Everything in a glance.' },
  { title: 'Live data', description: 'Updates as it happens.' },
];

function BentoAppPreview({ features = FEATURES, className = '' }: { features?: AppFeature[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:col-span-2 sm:row-span-2" aria-hidden="true">
        <div className="flex items-center gap-1.5 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="space-y-3 p-5">
          <div className="h-24 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
      {features.map((f, i) => (
        <article key={i} className="flex min-h-28 flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}

export const minHeight = 540;

export default function BentoAppPreviewPreview() {
  return <BentoAppPreview />;
}
