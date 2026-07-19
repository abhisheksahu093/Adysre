'use client';

import { useRef, useState } from 'react';

/**
 * Live preview for `carousel-thumbnail-sync`.
 *
 * Mirrors the `typescript` code variant with three frames. Selecting a thumb
 * pages the stage, and the active thumb scrolls itself into view so a long rail
 * never drifts from the stage. Keep this in step with `src/data/components/carousel.ts`.
 */
interface Frame {
  id: string;
  label: string;
  background: string;
}

interface CarouselThumbnailSyncProps {
  items: Frame[];
  className?: string;
  ariaLabel?: string;
}

function CarouselThumbnailSync({ items, className = '', ariaLabel = 'Gallery' }: CarouselThumbnailSyncProps) {
  const [index, setIndex] = useState<number>(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (next: number): void => {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    thumbRefs.current[wrapped]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return (
    <section className={`max-w-2xl ${className}`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-xl" aria-live="polite">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item: Frame, i: number) => (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
              className={`flex aspect-[16/9] shrink-0 basis-full items-end p-5 text-white ${item.background}`}
            >
              <span className="text-lg font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item: Frame, i: number) => (
          <button
            key={item.id}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            aria-label={`Show ${item.label}`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={`h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br ring-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${item.background} ${
              i === index ? 'opacity-100 !ring-blue-600 dark:!ring-blue-400' : 'opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

const SAMPLE_FRAMES: Frame[] = [
  { id: 'overview', label: 'Overview', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' },
  { id: 'reports', label: 'Reports', background: 'bg-gradient-to-br from-indigo-600 to-violet-600' },
  { id: 'settings', label: 'Settings', background: 'bg-gradient-to-br from-teal-700 to-sky-700' },
];

export const minHeight = 300;

export default function CarouselThumbnailSyncPreview() {
  return <CarouselThumbnailSync items={SAMPLE_FRAMES} ariaLabel="Screens" className="w-full" />;
}
