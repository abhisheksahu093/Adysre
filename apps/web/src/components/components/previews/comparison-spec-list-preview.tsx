/**
 * Live preview for `comparison-spec-list`.
 *
 * Mirrors the `typescript` code variant. A three-up spec sheet built from a
 * <dl>: on mobile each value carries an inline product label and the header
 * row is hidden, so the sheet stacks without losing which value belongs to
 * which product. Keep this in step with `src/data/components/comparisons.ts`.
 */
interface SpecRow {
  id: string;
  label: string;
  a: string;
  b: string;
}

interface ComparisonSpecListProps {
  productA: string;
  productB: string;
  specs: SpecRow[];
  className?: string;
}

function ComparisonSpecList({ productA, productB, specs, className = '' }: ComparisonSpecListProps) {
  return (
    <section className={`w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-800 ${className}`}>
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
              <span className="font-semibold text-gray-400 sm:hidden dark:text-gray-500">{productA}: </span>
              {spec.a}
            </dd>
            <dd className="m-0 text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold text-gray-400 sm:hidden dark:text-gray-500">{productB}: </span>
              {spec.b}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const SAMPLE_SPECS: SpecRow[] = [
  { id: 'storage', label: 'Storage', a: '256 GB', b: '1 TB' },
  { id: 'ram', label: 'Memory', a: '8 GB', b: '16 GB' },
  { id: 'battery', label: 'Battery', a: '18 h', b: '22 h' },
  { id: 'weight', label: 'Weight', a: '1.4 kg', b: '1.2 kg' },
];

export default function ComparisonSpecListPreview() {
  return <ComparisonSpecList productA="Model A" productB="Model B" specs={SAMPLE_SPECS} />;
}

export const minHeight = 320;
