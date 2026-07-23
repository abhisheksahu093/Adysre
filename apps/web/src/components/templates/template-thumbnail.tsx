'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from 'adysre';

/**
 * A live, scaled-down iframe of a template's preview route.
 *
 * Not a screenshot: a template is judged on its layout, and a stale PNG starts
 * lying the first time a section changes. The frame only mounts once it nears
 * the viewport, so a long gallery does not open twenty documents at once, and it
 * is inert (`pointer-events-none`, `tabIndex={-1}`) because whatever wraps it is
 * the real click target.
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
            'pointer-events-none absolute left-0 top-0 h-[1000px] w-[1440px] origin-top-left',
            scale === 'lg' ? 'scale-[0.42] sm:scale-[0.38]' : 'scale-[0.32] sm:scale-[0.28]',
          )}
        >
          <iframe
            src={`/template-preview/${slug}`}
            title={name}
            tabIndex={-1}
            aria-hidden
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>
      ) : null}
    </div>
  );
}
