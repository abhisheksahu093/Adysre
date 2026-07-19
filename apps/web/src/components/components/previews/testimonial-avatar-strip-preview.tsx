/**
 * Live preview for `testimonial-avatar-strip`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/testimonials.ts`.
 */
interface TestimonialAvatarStripProps {
  names?: string[];
  rating?: number;
  label?: string;
  quote?: string;
  className?: string;
}

const DEFAULT_NAMES = ['Amara Okafor', 'Diego Ramirez', 'Priya Nair', 'Sofia Bianchi'];
const GRADIENTS = [
  'from-blue-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

function Stars({ rating = 5, max = 5 }: { rating?: number; max?: number }) {
  const filled = Math.max(0, Math.min(max, Math.round(rating)));
  return (
    <div className="mt-4 flex items-center justify-center gap-0.5" role="img" aria-label={`Rated ${filled} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={`h-4 w-4 ${i < filled ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialAvatarStrip({
  names = DEFAULT_NAMES,
  rating = 5,
  label = 'Loved by 2,000+ teams',
  quote = 'The one tool nobody on the team wants to give up.',
  className = '',
}: TestimonialAvatarStripProps) {
  const shown = names.slice(0, 4);
  const extra = names.length - shown.length;
  return (
    <section className={`mx-auto w-full max-w-xl px-4 py-10 text-center sm:px-6 ${className}`}>
      <ul className="flex justify-center -space-x-3">
        {shown.map((name, i) => (
          <li key={i} className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-950`}>
            {initials(name)}
          </li>
        ))}
        {extra > 0 ? (
          <li className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-950">
            +{extra}
          </li>
        ) : null}
      </ul>

      <Stars rating={rating} />

      <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      {quote ? <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">&ldquo;{quote}&rdquo;</p> : null}
    </section>
  );
}

export const minHeight = 240;

export default function TestimonialAvatarStripPreview() {
  return (
    <TestimonialAvatarStrip names={['Amara Okafor', 'Diego Ramirez', 'Priya Nair', 'Sofia Bianchi', 'Marcus Chen', 'Lena Vogel', 'Owen Park', 'Nia Adams', 'Tomas Reyes']} />
  );
}
