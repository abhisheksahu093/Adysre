/**
 * Live preview for `testimonial-video-thumb`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface VideoTestimonial {
  quote: string;
  name: string;
  company?: string;
  href?: string;
}

interface TestimonialVideoThumbProps {
  heading?: string;
  items?: VideoTestimonial[];
  className?: string;
}

const DEFAULT_ITEMS: VideoTestimonial[] = [
  { quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', company: 'Northwind', href: '#' },
  { quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', company: 'Basepoint', href: '#' },
  { quote: 'Finally a dashboard the whole company reads.', name: 'Lena Vogel', company: 'Fathom', href: '#' },
];

function TestimonialVideoThumb({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialVideoThumbProps) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 ${className}`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <a href={t.href ?? '#'} className="group relative block aspect-video bg-gradient-to-br from-slate-700 to-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400">
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110 motion-reduce:transition-none">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 translate-x-0.5 text-gray-900"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
                <span className="sr-only">Play video testimonial from {t.name}</span>
              </a>
              <figcaption className="flex flex-1 flex-col p-5">
                <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
                <span className="mt-3 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.company ? <span className="text-gray-500 dark:text-gray-400"> · {t.company}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const minHeight = 620;

export default function TestimonialVideoThumbPreview() {
  return <TestimonialVideoThumb heading="Hear it from them" />;
}
