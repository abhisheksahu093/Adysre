'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `carousel-scroll-snap`.
 *
 * Mirrors the `typescript` code variant with three full slides. The whole thing
 * is one native scroll-snap container - swipe or scroll it directly; the dots
 * call scrollTo and track the position back. Keep this in step with
 * `src/data/components/carousel.ts`.
 */
interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselScrollSnapProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselScrollSnap({ items, className = '', ariaLabel = 'Carousel' }: CarouselScrollSnapProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = (): void => setCurrent(Math.round(track.scrollLeft / track.clientWidth));
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number): void => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section className={`max-w-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        role="group"
        aria-label="Slides, scrollable"
        tabIndex={0}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item: Slide, i: number) => (
          <div
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className={`w-full shrink-0 snap-center basis-full px-8 py-12 text-white ${item.background}`}
          >
            <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
            <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {items.map((item: Slide, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? true : undefined}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
              i === current ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }`}
          />
        ))}
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

export default function CarouselScrollSnapPreview() {
  return <CarouselScrollSnap items={SAMPLE_SLIDES} ariaLabel="Product highlights" className="w-full" />;
}
