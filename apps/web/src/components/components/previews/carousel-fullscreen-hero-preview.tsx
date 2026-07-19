'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-fullscreen-hero`.
 *
 * Mirrors the `typescript` code variant with two gradient hero panels. Off-screen
 * CTAs drop out of the tab order; controls sit on translucent chips for contrast.
 * Keep this in step with `src/data/components/carousel.ts`.
 */
interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  href?: string;
  background: string;
}

interface CarouselFullscreenHeroProps {
  items: HeroSlide[];
  className?: string;
  ariaLabel?: string;
}

function CarouselFullscreenHero({ items, className = '', ariaLabel = 'Featured' }: CarouselFullscreenHeroProps) {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={`relative overflow-hidden rounded-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        aria-live="polite"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item: HeroSlide, i: number) => (
          <div
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            aria-hidden={i !== index}
            className={`flex min-h-[20rem] shrink-0 basis-full flex-col justify-center px-6 py-14 text-white sm:px-12 ${item.background}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{item.eyebrow}</p>
            <h2 className="mt-2 max-w-lg text-3xl font-bold sm:text-4xl">{item.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">{item.copy}</p>
            <a
              href={item.href ?? '#'}
              tabIndex={i === index ? 0 : -1}
              className="mt-6 inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              {item.cta}
            </a>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {items.map((item: HeroSlide, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              i === index ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

const SAMPLE_SLIDES: HeroSlide[] = [
  { id: 'ship', eyebrow: 'New', title: 'Ship faster with one shared workspace', copy: 'Docs, tasks and dashboards where your team already works.', cta: 'Get started', background: 'bg-gradient-to-br from-blue-600 to-indigo-700' },
  { id: 'secure', eyebrow: 'Enterprise', title: 'Security that clears the audit', copy: 'SSO, SCIM and an immutable log, ready on day one.', cta: 'Talk to sales', background: 'bg-gradient-to-br from-teal-700 to-emerald-700' },
];

export const minHeight = 380;

export default function CarouselFullscreenHeroPreview() {
  return <CarouselFullscreenHero items={SAMPLE_SLIDES} ariaLabel="Featured" className="w-full" />;
}
