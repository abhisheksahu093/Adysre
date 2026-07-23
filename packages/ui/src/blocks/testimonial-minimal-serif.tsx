/**
 * Live preview for `testimonial-minimal-serif`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface TestimonialMinimalSerifProps {
  quote: string;
  name: string;
  role?: string;
  className?: string;
}

export function TestimonialMinimalSerif({
  quote,
  name,
  role,
  className = '',
}: TestimonialMinimalSerifProps) {
  return (
    <figure className={`mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 ${className}`}>
      <blockquote className="font-serif text-2xl italic leading-snug text-gray-900 sm:text-3xl dark:text-gray-100">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold not-italic text-gray-900 dark:text-gray-100">{name}</span>
        {role ? (
          <>
            <span className="mx-2 text-gray-300 dark:text-gray-600" aria-hidden="true">-</span>
            {role}
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

export const minHeight = 280;

export default function TestimonialMinimalSerifPreview() {
  return (
    <TestimonialMinimalSerif
      quote="The migration was boring in the best way - nothing broke, and nobody noticed."
      name="Sofia Bianchi"
      role="Product Designer, Vela"
    />
  );
}
