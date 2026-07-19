/**
 * Live preview for `testimonial-rating-cards`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface RatedTestimonial {
  rating: number;
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialRatingCardsProps {
  heading?: string;
  items?: RatedTestimonial[];
  className?: string;
}

const DEFAULT_ITEMS: RatedTestimonial[] = [
  { rating: 5, quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead' },
  { rating: 5, quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder' },
  { rating: 4, quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', role: 'CTO' },
];

function Stars({ rating = 5, max = 5 }: { rating?: number; max?: number }) {
  const filled = Math.max(0, Math.min(max, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${filled} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={`h-4 w-4 ${i < filled ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialRatingCards({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialRatingCardsProps) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 ${className}`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <Stars rating={t.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="text-gray-500 dark:text-gray-400"> · {t.role}</span> : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const minHeight = 560;

export default function TestimonialRatingCardsPreview() {
  return <TestimonialRatingCards heading="Rated by real users" />;
}
