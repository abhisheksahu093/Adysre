'use client';

/**
 * Live preview for `testimonial-card`.
 *
 * Mirrors the `typescript` code variant verbatim. The avatar points at a local
 * SVG so the preview never hits the network.
 * Keep this in step with `src/data/components/cards.ts`.
 */
interface TestimonialCardProps {
  quote: string;
  name: string;
  company: string;
  avatarSrc: string;
  rating?: number;
  className?: string;
}

const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

function TestimonialCard({
  quote,
  name,
  company,
  avatarSrc,
  rating = 5,
  className = '',
}: TestimonialCardProps) {
  return (
    <figure
      className={`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <p className="flex gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i: number) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i <= rating ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </p>

      <blockquote className="mt-3.5">
        <p className="text-[0.9375rem] leading-7 text-gray-700 dark:text-gray-300">&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
        <img
          className="h-10 w-10 flex-none rounded-full bg-gray-100 object-cover dark:bg-gray-800"
          src={avatarSrc}
          alt=""
          width={40}
          height={40}
        />
        <span>
          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
          <span className="block text-[0.8125rem] text-gray-600 dark:text-gray-400">{company}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function TestimonialCardPreview() {
  return (
    <TestimonialCard
      quote="We shipped our billing rewrite two sprints early. The part I still can't get over is that support tickets went down, not up."
      name="Marcus Lindqvist"
      company="VP Engineering, Northwind"
      avatarSrc="/promo/all-access.svg"
      rating={5}
    />
  );
}
