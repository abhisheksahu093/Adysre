'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-testimonial`.
 *
 * Mirrors the `typescript` code variant with two sample quotes. Each slide is a
 * blockquote with a gradient initials avatar - no image assets. Keep this in step
 * with `src/data/components/carousel.ts`.
 */
interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  accent: string;
}

interface CarouselTestimonialProps {
  items: Testimonial[];
  className?: string;
  ariaLabel?: string;
}

const initials = (name: string): string =>
  name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

function CarouselTestimonial({ items, className = '', ariaLabel = 'Testimonials' }: CarouselTestimonialProps) {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={`max-w-xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950" aria-live="polite">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item: Testimonial, i: number) => (
            <figure
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
              className="shrink-0 basis-full p-6 sm:p-8"
            >
              <blockquote className="text-base leading-relaxed text-gray-800 dark:text-gray-100">{`"${item.quote}"`}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ${item.accent}`}>
                  {initials(item.name)}
                </span>
                <span className="text-sm">
                  <span className="block font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                  <span className="block text-gray-500 dark:text-gray-400">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((item: Testimonial, i: number) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index ? true : undefined}
              onClick={() => go(i)}
              className={`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
                i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => go(index - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => go(index + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { id: 'ada', quote: 'The dashboard paid for itself in a week - we stopped exporting to spreadsheets entirely.', name: 'Ada Lovelace', role: 'CTO, Analytical Engines', accent: 'from-blue-600 to-indigo-600' },
  { id: 'grace', quote: 'Setup took an afternoon and the audit log alone got us through the SOC 2 review.', name: 'Grace Hopper', role: 'VP Eng, Compiler Co', accent: 'from-teal-700 to-sky-700' },
];

export const minHeight = 240;

export default function CarouselTestimonialPreview() {
  return <CarouselTestimonial items={SAMPLE_TESTIMONIALS} ariaLabel="What customers say" className="w-full" />;
}
