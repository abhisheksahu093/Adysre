/**
 * Live preview for `comparison-vs-versus`.
 *
 * Mirrors the `typescript` code variant. Each side is its own labelled
 * <section>; the "VS" badge is aria-hidden decoration between them and hides
 * when the columns stack. Keep this in step with `src/data/components/comparisons.ts`.
 */
interface VersusSide {
  id: string;
  name: string;
  tagline?: string;
  points: string[];
}

interface ComparisonVsVersusProps {
  left: VersusSide;
  right: VersusSide;
  className?: string;
}

function ComparisonVsVersus({ left, right, className = '' }: ComparisonVsVersusProps) {
  const sides = [left, right];

  return (
    <section className={`relative w-full max-w-3xl ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {sides.map((side) => (
          <section
            key={side.id}
            aria-label={side.name}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{side.name}</h3>
            {side.tagline ? (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{side.tagline}</p>
            ) : null}
            <ul className="mt-3 grid gap-2">
              {side.points.map((point) => (
                <li
                  key={point}
                  className="grid grid-cols-[0.75rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Decorative divider badge - hidden while the two panels are stacked. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm sm:block dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
      >
        VS
      </span>
    </section>
  );
}

export default function ComparisonVsVersusPreview() {
  return (
    <ComparisonVsVersus
      left={{
        id: 'notion',
        name: 'Notion',
        tagline: 'Docs-first workspace',
        points: ['Flexible pages', 'Great for wikis', 'Weaker at structured data'],
      }}
      right={{
        id: 'adysre',
        name: 'ADYSRE',
        tagline: 'Operations platform',
        points: ['Records, not pages', 'Role-based access', 'Reports that refresh themselves'],
      }}
    />
  );
}

export const minHeight = 320;
