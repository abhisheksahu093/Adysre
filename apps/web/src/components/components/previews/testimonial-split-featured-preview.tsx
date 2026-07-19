/**
 * Live preview for `testimonial-split-featured`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialSplitFeaturedProps {
  featured?: Testimonial;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_FEATURED: Testimonial = {
  quote: 'We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.',
  name: 'Amara Okafor',
  role: 'Head of Operations, Northwind',
};

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Cadence' },
  { quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Loom Labs' },
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

function TestimonialSplitFeatured({
  featured = DEFAULT_FEATURED,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialSplitFeaturedProps) {
  return (
    <section className={`mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 ${className}`}>
      <figure className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 text-white">
        <blockquote className="text-xl font-medium leading-relaxed sm:text-2xl">&ldquo;{featured.quote}&rdquo;</blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">{initials(featured.name)}</span>
          <span>
            <span className="block text-sm font-semibold">{featured.name}</span>
            {featured.role ? <span className="block text-xs text-blue-100">{featured.role}</span> : null}
          </span>
        </figcaption>
      </figure>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
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

export default function TestimonialSplitFeaturedPreview() {
  return <TestimonialSplitFeatured />;
}
