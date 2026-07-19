'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-parallax`.
 *
 * Mirrors the `typescript` code variant with three panels. Each panel moves 100%
 * per step while its backdrop lags at 30% and over-scales, reading as depth. All
 * transform-only, reduced-motion aware. Keep this in step with
 * `src/data/components/carousel.ts`.
 */
interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselParallaxProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

function CarouselParallax({ items, className = '', ariaLabel = 'Carousel' }: CarouselParallaxProps) {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={`relative h-64 overflow-hidden rounded-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div aria-live="polite">
        {items.map((item: Slide, i: number) => {
          const offset = i - index;
          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
              className="absolute inset-0 transition-transform duration-700 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(${offset * 100}%)` }}
            >
              <div
                className={`absolute inset-0 scale-125 transition-transform duration-700 ease-out motion-reduce:transition-none ${item.background}`}
                style={{ transform: `translateX(${offset * 30}%)` }}
              />
              <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-1 max-w-sm text-sm text-white/90">{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}

const SAMPLE_SLIDES: Slide[] = [
  { id: 'analytics', title: 'Analytics', copy: 'Every metric that matters, updated the moment it changes.', background: 'bg-gradient-to-br from-blue-600 to-indigo-700' },
  { id: 'automations', title: 'Automations', copy: 'Turn a repeated click into a rule that runs itself.', background: 'bg-gradient-to-br from-teal-700 to-emerald-700' },
  { id: 'integrations', title: 'Integrations', copy: 'Forty connectors, and a webhook for everything else.', background: 'bg-gradient-to-br from-violet-700 to-fuchsia-700' },
];

export const minHeight = 280;

export default function CarouselParallaxPreview() {
  return <CarouselParallax items={SAMPLE_SLIDES} ariaLabel="Highlights" className="w-full" />;
}
