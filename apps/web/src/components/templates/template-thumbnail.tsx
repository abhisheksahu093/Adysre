'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from 'adysre';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A live, scaled-down iframe of a template's preview route.
 *
 * Not a screenshot: a template is judged on its layout, and a stale PNG starts
 * lying the first time a section changes. The frame only mounts once it nears
 * the viewport, so a long gallery does not open twenty documents at once, and it
 * is inert (`pointer-events-none`, `tabIndex={-1}`) because whatever wraps it is
 * the real click target.
 *
 * Two things fill the gap before the preview is painted, so a card is never
 * blank: a page-shaped skeleton shows while the frame is still off-screen and
 * while it loads, then cross-fades to the iframe on its `load` event.
 *
 * Shared by the gallery card and the landing showcase (Rule 3) — those two
 * differ only in what surrounds the frame.
 */
export function TemplateThumbnail({
  slug,
  name,
  className,
  scale = 'sm',
}: {
  slug: string;
  name: string;
  className?: string;
  /** `sm` suits a gallery card; `lg` gives a taller landing tile more detail. */
  scale?: 'sm' | 'lg';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: '300px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  return (
    <div ref={ref} className={cn('relative h-full w-full overflow-hidden', className)}>
      {near ? (
        <div
          className={cn(
            'pointer-events-none absolute left-0 top-0 h-[1000px] w-[1440px] origin-top-left transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            scale === 'lg' ? 'scale-[0.42] sm:scale-[0.38]' : 'scale-[0.32] sm:scale-[0.28]',
          )}
        >
          <iframe
            src={`/template-preview/${slug}`}
            title={name}
            tabIndex={-1}
            aria-hidden
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
          />
        </div>
      ) : null}

      <ThumbnailSkeleton
        className={cn(
          'transition-opacity duration-500',
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      />
    </div>
  );
}

/**
 * A wireframe of a generic marketing page (nav, hero, a grid of cards) shown at
 * the card's own scale. It stands in for any template, so it never implies a
 * layout the real preview will not have, and it pulses via the shared Skeleton
 * primitive (still under reduced motion).
 */
function ThumbnailSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 flex flex-col gap-3 bg-card p-4 sm:p-5', className)}
    >
      {/* nav */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <div className="hidden gap-3 sm:flex">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-2.5 w-10" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      {/* hero */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-2 w-20 rounded-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="mt-2 h-2.5 w-2/3" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* card grid */}
      <div className="mt-auto grid grid-cols-3 gap-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5]" />
        ))}
      </div>
    </div>
  );
}
