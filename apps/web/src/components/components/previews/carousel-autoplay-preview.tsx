'use client';

import { useEffect, useState } from 'react';

/**
 * Live preview for `carousel-autoplay`.
 *
 * Mirrors the `typescript` code variant, with the interval shortened to 3s so
 * the motion is visible in a small preview frame. Everything else is the real
 * component: it pauses on hover and on focus, the pause button works, and under
 * `prefers-reduced-motion` it never starts and the moves are instant.
 * Keep this in step with `src/data/components/carousel.ts`.
 */
const INTERVAL = 3000;

interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselAutoplayProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

function CarouselAutoplay({ items, className = '', ariaLabel = 'Carousel' }: CarouselAutoplayProps) {
  const [index, setIndex] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [hovered, setHovered] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    const query: MediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent): void => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const running: boolean = playing && !hovered && !focused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setIndex((i: number) => (i + 1) % items.length), INTERVAL);
    return () => clearInterval(timer);
  }, [running, items.length]);

  const go = (next: number): void => {
    setIndex((next + items.length) % items.length);
  };

  return (
    <section
      className={`max-w-2xl ${className}`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="overflow-hidden rounded-xl" aria-live={running ? 'off' : 'polite'}>
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item: Slide, i: number) => (
            <div
              key={item.id}
              className={`shrink-0 basis-full px-8 py-12 text-white ${item.background}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          aria-label={playing ? 'Pause automatic slide show' : 'Start automatic slide show'}
          onClick={() => setPlaying((value: boolean) => !value)}
          className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {playing ? (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4h2.5v12H6.5zM11 4h2.5v12H11z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4l9 6-9 6z" />
            </svg>
          )}
        </button>

        <div className="flex flex-1 justify-center gap-2">
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

        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
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

export default function CarouselAutoplayPreview() {
  return <CarouselAutoplay items={SAMPLE_SLIDES} ariaLabel="Product highlights" className="w-full" />;
}
