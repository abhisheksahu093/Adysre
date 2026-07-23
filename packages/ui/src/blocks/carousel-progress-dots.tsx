'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-progress-dots`.
 *
 * Mirrors the `typescript` code variant with three sample slides. A determinate
 * bar fills to (index+1)/total beside the steering dots. Keep this in step with
 * `src/data/components/carousel.ts`.
 */
interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselProgressDotsProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselProgressDots({ items, className = '', ariaLabel = 'Carousel' }: CarouselProgressDotsProps) {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={`max-w-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative overflow-hidden rounded-xl" aria-live="polite">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item: Slide, i: number) => (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
              className={`shrink-0 basis-full px-8 py-12 text-white ${item.background}`}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true">
          <div
            className="h-full rounded-full bg-blue-600 transition-[width] duration-500 motion-reduce:transition-none dark:bg-blue-400"
            style={{ width: `${((index + 1) / items.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-2">
          {items.map((item: Slide, i: number) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? true : undefined}
              onClick={() => go(i)}
              className={`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
                i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
              }`}
            />
          ))}
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

export default function CarouselProgressDotsPreview() {
  return <CarouselProgressDots items={SAMPLE_SLIDES} ariaLabel="Product highlights" className="w-full" />;
}
