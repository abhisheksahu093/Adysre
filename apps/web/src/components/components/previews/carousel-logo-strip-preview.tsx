'use client';

/**
 * Live preview for `carousel-logo-strip`.
 *
 * Mirrors the `typescript` code variant with five gradient logo chips. The list
 * is rendered twice and the track slides -50% for a seamless marquee that pauses
 * on hover and stops under reduced motion. Keep this in step with
 * `src/data/components/carousel.ts`.
 */
interface Logo {
  id: string;
  name: string;
  accent: string;
}

interface CarouselLogoStripProps {
  items: Logo[];
  className?: string;
  ariaLabel?: string;
}

function CarouselLogoStrip({ items, className = '', ariaLabel = 'Trusted by' }: CarouselLogoStripProps) {
  const chip = (item: Logo, hidden: boolean) => (
    <li key={`${hidden ? 'b' : 'a'}-${item.id}`}>
      <span className={`grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br text-sm font-semibold text-white ${item.accent}`}>
        {item.name}
      </span>
    </li>
  );

  return (
    <section
      className={`group overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <style>{'@keyframes adysreLogoScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}</style>
      <div className="flex w-max [animation:adysreLogoScroll_24s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
        <ul className="flex shrink-0 items-center gap-8 pr-8">{items.map((item: Logo) => chip(item, false))}</ul>
        <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
          {items.map((item: Logo) => chip(item, true))}
        </ul>
      </div>
    </section>
  );
}

const SAMPLE_LOGOS: Logo[] = [
  { id: 'acme', name: 'Acme', accent: 'from-blue-600 to-indigo-600' },
  { id: 'globex', name: 'Globex', accent: 'from-indigo-600 to-violet-600' },
  { id: 'initech', name: 'Initech', accent: 'from-teal-700 to-sky-700' },
  { id: 'umbrella', name: 'Umbrella', accent: 'from-rose-600 to-orange-500' },
  { id: 'hooli', name: 'Hooli', accent: 'from-emerald-600 to-teal-600' },
];

export const minHeight = 96;

export default function CarouselLogoStripPreview() {
  return <CarouselLogoStrip items={SAMPLE_LOGOS} ariaLabel="Trusted by leading teams" className="w-full" />;
}
