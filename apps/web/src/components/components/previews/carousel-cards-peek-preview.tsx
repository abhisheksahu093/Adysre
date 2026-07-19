'use client';

import { useRef } from 'react';

/**
 * Live preview for `carousel-cards-peek`.
 *
 * Mirrors the `typescript` code variant with four sample cards. Cards are 85%
 * wide (70% from `sm`) and snap-center, so a neighbour peeks at each edge; the
 * arrows nudge by one card width measured from the DOM. Keep this in step with
 * `src/data/components/carousel.ts`.
 */
interface PeekCard {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselCardsPeekProps {
  items: PeekCard[];
  className?: string;
  ariaLabel?: string;
}

function CarouselCardsPeek({ items, className = '', ariaLabel = 'Carousel' }: CarouselCardsPeekProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const step = (dir: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild;
    if (!slide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * (slide.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className={`max-w-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="mb-3 flex justify-end gap-1.5">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => step(-1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => step(1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div
        ref={trackRef}
        role="group"
        aria-label="Slides, scrollable"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item: PeekCard, i: number) => (
          <article
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className="shrink-0 basis-[85%] snap-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:basis-[70%] dark:border-gray-800 dark:bg-gray-950"
          >
            <div className={`aspect-[16/9] w-full ${item.background}`} />
            <div className="p-5">
              <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const SAMPLE_CARDS: PeekCard[] = [
  { id: 'analytics', title: 'Analytics', copy: 'Every metric that matters, live.', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' },
  { id: 'automations', title: 'Automations', copy: 'Turn a repeated click into a rule.', background: 'bg-gradient-to-br from-indigo-600 to-violet-600' },
  { id: 'integrations', title: 'Integrations', copy: 'Forty connectors and a webhook.', background: 'bg-gradient-to-br from-teal-700 to-sky-700' },
  { id: 'audit', title: 'Audit log', copy: 'Who changed what, and when.', background: 'bg-gradient-to-br from-rose-600 to-orange-500' },
];

export const minHeight = 320;

export default function CarouselCardsPeekPreview() {
  return <CarouselCardsPeek items={SAMPLE_CARDS} ariaLabel="Featured work" className="w-full" />;
}
