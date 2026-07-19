/**
 * Live preview for `marquee-testimonials-strip`.
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
export const minHeight = 240;

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const TESTIMONIALS_KEYFRAMES = `
  @keyframes marquee-testimonials-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'It paid for itself in the first week. We shipped the migration in two days.', name: 'Maya Rao', role: 'Head of Platform' },
  { quote: 'Support answered in minutes and actually fixed the root cause. Rare.', name: 'Jonah Lee', role: 'CTO, Northwind' },
  { quote: 'The API is the first one my team did not fight. It just does the obvious thing.', name: 'Priya Shah', role: 'Staff Engineer' },
  { quote: 'We cut onboarding from a week to an afternoon. The docs carry their weight.', name: 'Diego Ruiz', role: 'VP Engineering' },
];

const initials = (name: string): string => name.split(' ').map((part) => part[0]).slice(0, 2).join('');

interface MarqueeTestimonialsStripProps {
  items?: Testimonial[];
  durationSeconds?: number;
  className?: string;
}

function MarqueeTestimonialsStrip({ items = DEFAULT_ITEMS, durationSeconds = 40, className = '' }: MarqueeTestimonialsStripProps) {
  const group = (hidden: boolean) => (
    <ul
      className={hidden ? 'flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:hidden' : 'flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'}
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li key={item.name} className="w-72 shrink-0">
          <figure className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{item.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white" aria-hidden="true">{initials(item.name)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`w-full overflow-hidden py-6 ${className}`} aria-label="What customers say">
      <style>{TESTIMONIALS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-testimonials-scroll_40s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeTestimonialsStripPreview() {
  return <MarqueeTestimonialsStrip />;
}
