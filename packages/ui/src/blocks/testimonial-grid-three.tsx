/**
 * Live preview for `testimonial-grid-three`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialGridThreeProps {
  heading?: string;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', role: 'Head of Operations, Northwind' },
  { quote: 'Support actually answers, and the docs are good enough that we rarely need them.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
  { quote: 'It paid for itself in the first month. I do not say that about many tools.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialGridThree({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialGridThreeProps) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 ${className}`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {heading}
        </h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const minHeight = 640;

export default function TestimonialGridThreePreview() {
  return <TestimonialGridThree heading="Loved by teams everywhere" />;
}
