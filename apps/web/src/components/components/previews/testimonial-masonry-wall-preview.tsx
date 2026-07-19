/**
 * Live preview for `testimonial-masonry-wall`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialMasonryWallProps {
  heading?: string;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.', name: 'Amara Okafor', role: 'Head of Operations, Northwind' },
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
  { quote: 'The migration was boring in the best way - nothing broke, and nobody noticed. That is the highest praise I can give an infra change.', name: 'Sofia Bianchi', role: 'Product Designer, Vela' },
  { quote: 'Support actually answers.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
  { quote: 'Our error rate dropped by half after we switched. Hard to argue with that.', name: 'Marcus Chen', role: 'CTO, Basepoint' },
  { quote: 'Finally a dashboard the whole company reads instead of ignoring.', name: 'Lena Vogel', role: 'Marketing Director, Fathom' },
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

function TestimonialMasonryWall({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialMasonryWallProps) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 ${className}`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((t, i) => (
          <figure key={i} className="mb-4 break-inside-avoid rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">{initials(t.name)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export const minHeight = 680;

export default function TestimonialMasonryWallPreview() {
  return <TestimonialMasonryWall heading="From the wall" />;
}
