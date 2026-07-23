/**
 * Live preview for `testimonial-carousel`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialCarouselProps {
  heading?: string;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', role: 'CTO, Basepoint' },
  { quote: 'Finally a dashboard the whole company reads instead of ignoring.', name: 'Lena Vogel', role: 'Marketing Director, Fathom' },
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
  { quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialCarousel({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialCarouselProps) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 ${className}`}>
      {heading ? (
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul
        tabIndex={0}
        aria-label="Customer testimonials, scroll horizontally"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
      >
        {items.map((t, i) => (
          <li key={i} className="w-full shrink-0 basis-[85%] snap-start sm:basis-[46%] lg:basis-[31%]">
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">{initials(t.name)}</span>
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

export const minHeight = 300;

export default function TestimonialCarouselPreview() {
  return <TestimonialCarousel heading="What customers say" />;
}
