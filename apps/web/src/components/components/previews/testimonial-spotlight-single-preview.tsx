/**
 * Live preview for `testimonial-spotlight-single`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface TestimonialSpotlightSingleProps {
  quote: string;
  name: string;
  role?: string;
  className?: string;
}

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

function TestimonialSpotlightSingle({
  quote,
  name,
  role,
  className = '',
}: TestimonialSpotlightSingleProps) {
  return (
    <section className={`mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mx-auto h-8 w-8 text-blue-500/40 dark:text-blue-400/40">
        <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2H5v2h4V9zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2h-2v2h4V9z" />
      </svg>

      <figure>
        <blockquote className="mt-5 text-xl font-medium leading-relaxed tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="mt-6 flex flex-col items-center gap-3">
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-base font-semibold text-white">
            {initials(name)}
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
            {role ? <span className="block text-xs text-gray-500 dark:text-gray-400">{role}</span> : null}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}

export const minHeight = 340;

export default function TestimonialSpotlightSinglePreview() {
  return (
    <TestimonialSpotlightSingle
      quote="The migration was boring in the best way - nothing broke, and nobody noticed."
      name="Sofia Bianchi"
      role="Product Designer, Vela"
    />
  );
}
