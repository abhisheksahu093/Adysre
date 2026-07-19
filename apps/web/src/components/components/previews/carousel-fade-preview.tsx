'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-fade`.
 *
 * Mirrors the `typescript` code variant with three sample slides. Press an arrow
 * or a dot and the slides cross-fade in place - no track, no transform, just
 * opacity over a fixed-height stage. Under `prefers-reduced-motion` the same
 * change happens as a cut. Keep this in step with `src/data/components/carousel.ts`.
 */
interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselFadeProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

function CarouselFade({ items, className = '', ariaLabel = 'Carousel' }: CarouselFadeProps) {
  const [index, setIndex] = useState<number>(0);

  const go = (next: number): void => {
    setIndex((next + items.length) % items.length);
  };

  return (
    <section className={`max-w-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      {/* Fixed height: absolutely positioned slides cannot size the stage. */}
      <div className="relative h-56 overflow-hidden rounded-xl" aria-live="polite">
        {items.map((item: Slide, i: number) => {
          const isActive = i === index;

          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 px-8 py-12 text-white transition-opacity duration-500 motion-reduce:transition-none ${item.background} ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          );
        })}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg
            className="h-[1.125rem] w-[1.125rem]"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg
            className="h-[1.125rem] w-[1.125rem]"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {items.map((item: Slide, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
              i === index
                ? 'w-5 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

const SAMPLE_SLIDES: Slide[] = [
  {
    id: 'analytics',
    title: 'Analytics',
    copy: 'Every metric that matters, updated the moment it changes.',
    background: 'bg-gradient-to-br from-blue-600 to-indigo-600',
  },
  {
    id: 'automations',
    title: 'Automations',
    copy: 'Turn a repeated click into a rule that runs itself.',
    background: 'bg-gradient-to-br from-indigo-600 to-violet-600',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    copy: 'Forty connectors, and a webhook for everything else.',
    background: 'bg-gradient-to-br from-teal-700 to-sky-700',
  },
];

export default function CarouselFadePreview() {
  return <CarouselFade items={SAMPLE_SLIDES} ariaLabel="Product highlights" className="w-full" />;
}
