'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-vertical`.
 *
 * Mirrors the `typescript` code variant with three sample slides. The track is a
 * flex column paged with translateY; Up/Down buttons and a vertical dot rail sit
 * beside a fixed-height stage. Keep this in step with `src/data/components/carousel.ts`.
 */
interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselVerticalProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

function CarouselVertical({ items, className = '', ariaLabel = 'Carousel' }: CarouselVerticalProps) {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={`max-w-md ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex gap-3">
        <div className="relative h-56 flex-1 overflow-hidden rounded-xl" aria-live="polite">
          <div
            className="flex h-full flex-col transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateY(-${index * 100}%)` }}
          >
            {items.map((item: Slide, i: number) => (
              <div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${items.length}`}
                aria-hidden={i !== index}
                className={`flex h-full shrink-0 basis-full flex-col justify-end px-6 py-6 text-white ${item.background}`}
              >
                <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 12.5 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex flex-col gap-2">
            {items.map((item: Slide, i: number) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? true : undefined}
                onClick={() => go(i)}
                className={`w-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
                  i === index ? 'h-5 bg-blue-600 dark:bg-blue-400' : 'h-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

const SAMPLE_SLIDES: Slide[] = [
  { id: 'analytics', title: 'Analytics', copy: 'Every metric that matters, updated the moment it changes.', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' },
  { id: 'automations', title: 'Automations', copy: 'Turn a repeated click into a rule that runs itself.', background: 'bg-gradient-to-br from-indigo-600 to-violet-600' },
  { id: 'integrations', title: 'Integrations', copy: 'Forty connectors, and a webhook for everything else.', background: 'bg-gradient-to-br from-teal-700 to-sky-700' },
];

export const minHeight = 240;

export default function CarouselVerticalPreview() {
  return <CarouselVertical items={SAMPLE_SLIDES} ariaLabel="Product highlights" className="w-full" />;
}
