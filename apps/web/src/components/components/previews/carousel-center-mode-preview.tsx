'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-center-mode`.
 *
 * Mirrors the `typescript` code variant with three sample cards. The active card
 * is centred at 70% width; neighbours scale to 90% at half opacity. The offset
 * `calc(15% - index*70%)` keeps the current card dead centre. Keep this in step
 * with `src/data/components/carousel.ts`.
 */
interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselCenterModeProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

function CarouselCenterMode({ items, className = '', ariaLabel = 'Carousel' }: CarouselCenterModeProps) {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={`mx-auto max-w-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden" aria-live="polite">
        <div
          className="flex items-center transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(calc(15% - ${index * 70}%))` }}
        >
          {items.map((item: Slide, i: number) => (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
              className={`shrink-0 basis-[70%] px-2 transition-all duration-500 motion-reduce:transition-none ${
                i === index ? '' : 'scale-90 opacity-50'
              }`}
            >
              <div className={`flex h-40 flex-col justify-end rounded-xl p-5 text-white ${item.background}`}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/90">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

const SAMPLE_SLIDES: Slide[] = [
  { id: 'analytics', title: 'Analytics', copy: 'Every metric that matters.', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' },
  { id: 'automations', title: 'Automations', copy: 'Turn a click into a rule.', background: 'bg-gradient-to-br from-indigo-600 to-violet-600' },
  { id: 'integrations', title: 'Integrations', copy: 'Forty connectors.', background: 'bg-gradient-to-br from-teal-700 to-sky-700' },
];

export const minHeight = 224;

export default function CarouselCenterModePreview() {
  return <CarouselCenterMode items={SAMPLE_SLIDES} ariaLabel="Highlights" className="w-full" />;
}
