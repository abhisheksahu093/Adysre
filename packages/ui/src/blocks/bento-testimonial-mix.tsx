/**
 * Live preview for `bento-testimonial-mix`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  gradient: string;
  featured?: boolean;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

const TESTIMONIALS: Testimonial[] = [
  { quote: "We shipped a rebuild in six weeks that we'd budgeted six months for. It is the tool we didn't know the team was missing.", name: 'Ana Mendes', role: 'VP Engineering, Northwind', gradient: 'from-indigo-400 to-blue-500', featured: true, className: 'sm:col-span-2 sm:row-span-2' },
  { quote: 'Setup took an afternoon.', name: 'Tomas K.', gradient: 'from-rose-400 to-orange-500' },
  { quote: 'Support actually replies.', name: 'Rin L.', gradient: 'from-emerald-400 to-teal-500' },
];

export function BentoTestimonialMix({ testimonials = TESTIMONIALS, className = '' }: { testimonials?: Testimonial[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 ${className}`}>
      {testimonials.map((t, i) =>
        t.featured ? (
          <figure key={i} className={`flex flex-col justify-between rounded-2xl bg-gray-900 p-6 text-white dark:bg-gray-800 ${t.className ?? ''}`}>
            <blockquote className="text-lg font-medium leading-relaxed">{'"'}{t.quote}{'"'}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold ${t.gradient}`} aria-hidden="true">{initials(t.name)}</span>
              <span>
                <span className="block text-sm font-semibold">{t.name}</span>
                {t.role ? <span className="block text-xs text-gray-300">{t.role}</span> : null}
              </span>
            </figcaption>
          </figure>
        ) : (
          <figure key={i} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{'"'}{t.quote}{'"'}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${t.gradient}`} aria-hidden="true">{initials(t.name)}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
            </figcaption>
          </figure>
        ),
      )}
    </section>
  );
}

export const minHeight = 520;

export default function BentoTestimonialMixPreview() {
  return <BentoTestimonialMix />;
}
