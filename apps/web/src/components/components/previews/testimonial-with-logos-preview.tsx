/**
 * Live preview for `testimonial-with-logos`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface LogoTestimonial {
  logo: string;
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialWithLogosProps {
  heading?: string;
  items?: LogoTestimonial[];
  className?: string;
}

const DEFAULT_ITEMS: LogoTestimonial[] = [
  { logo: 'Northwind', quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', role: 'Head of Operations' },
  { logo: 'Loom Labs', quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder' },
  { logo: 'Cadence', quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead' },
  { logo: 'Fathom', quote: 'Finally a dashboard the whole company reads.', name: 'Lena Vogel', role: 'Marketing Director' },
];

function TestimonialWithLogos({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialWithLogosProps) {
  return (
    <section className={`mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 ${className}`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.logo}</p>
              <blockquote className="mt-3 flex-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? ` · ${t.role}` : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const minHeight = 480;

export default function TestimonialWithLogosPreview() {
  return <TestimonialWithLogos heading="Trusted across industries" />;
}
