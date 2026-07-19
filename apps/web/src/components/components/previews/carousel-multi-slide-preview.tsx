'use client';

import { useRef } from 'react';

/**
 * Live preview for `carousel-multi-slide`.
 *
 * Mirrors the `typescript` code variant with five sample cards: three across
 * from `sm` up, one on a phone. The arrows scroll by exactly one card, measured
 * from the DOM, and the track is a focusable scroll region - swipe or scroll it
 * directly. Keep this in step with `src/data/components/carousel.ts`.
 */
interface Slide {
  id: string;
  title: string;
  copy: string;
}

interface CarouselMultiSlideProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

function CarouselMultiSlide({ items, className = '', ariaLabel = 'Carousel' }: CarouselMultiSlideProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByStep = (direction: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild;
    if (!slide) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const step = slide.getBoundingClientRect().width + gap;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className={`max-w-3xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">What&apos;s inside</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slides"
            onClick={() => scrollByStep(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slides"
            onClick={() => scrollByStep(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="group"
        aria-label="Slides, scrollable"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item: Slide, i: number) => (
          <article
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950"
          >
            <h3 className="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const SAMPLE_SLIDES: Slide[] = [
  { id: 'analytics', title: 'Analytics', copy: 'Every metric that matters, live.' },
  { id: 'automations', title: 'Automations', copy: 'Turn a repeated click into a rule.' },
  { id: 'integrations', title: 'Integrations', copy: 'Forty connectors and a webhook.' },
  { id: 'audit', title: 'Audit log', copy: 'Who changed what, and when.' },
  { id: 'reports', title: 'Reports', copy: 'Scheduled, and in your inbox.' },
];

export default function CarouselMultiSlidePreview() {
  return <CarouselMultiSlide items={SAMPLE_SLIDES} ariaLabel="Feature tour" className="w-full" />;
}
