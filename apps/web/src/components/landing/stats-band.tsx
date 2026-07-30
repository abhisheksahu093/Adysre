'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { useReducedMotion } from 'framer-motion';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { STAT_META, type Stat as StatData } from '@/data/landing';
import { Hud } from './workbench/panel';

/** Ease-out so the count decelerates into its final value. */
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * One reading on the status bar: a figure that counts up the first time it
 * scrolls into view, over the name of the catalogue it measures. The number is
 * locale-formatted on every frame, so digit grouping stays correct in every
 * language. Under `prefers-reduced-motion` the final value renders at once.
 *
 * Where the figure has a page behind it the whole cell is a link - someone who
 * reads "448 icons" and wants to see them should not have to hunt the nav.
 */
function Reading({
  id,
  value,
  suffix,
  label,
}: {
  id: string;
  value: number;
  suffix?: string | undefined;
  label: string;
}) {
  const format = useFormatter();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(reduce ? value : 0);

  const meta = STAT_META[id];

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let start = 0;
    const duration = 1400;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const tick = (now: number) => {
          if (!start) start = now;
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(value * easeOut(progress)));
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, reduce]);

  const body = (
    <div ref={ref} className="flex flex-col gap-1 px-4 py-3.5 sm:px-5">
      <span className="font-hud text-[19px] font-medium leading-none tabular-nums text-foreground sm:text-[22px]">
        {format.number(display)}
        {suffix}
      </span>
      <Hud className="truncate">{label}</Hud>
    </div>
  );

  const cell = 'block h-full bg-panel transition-colors';

  return meta?.href ? (
    <Link
      href={meta.href}
      className={cn(
        cell,
        'hover:bg-panel-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
      )}
    >
      {body}
    </Link>
  ) : (
    <div className={cell}>{body}</div>
  );
}

/**
 * The status bar under the board: every catalogue in the product, measured.
 *
 * It replaces the old grid of stat cards. A status bar is what a work surface
 * puts its numbers in, and running them together in one ruled strip says "this
 * is the size of the thing" better than seven boxes do. The dividers are drawn
 * by the grid itself (a gap filled by the panel border colour), so the strip
 * stays ruled at every breakpoint without per-cell border juggling.
 *
 * Client Component for the on-scroll count-up; the figures are computed on the
 * server from the real catalogues and handed in as props, so no catalogue is
 * bundled into this chunk.
 */
export function StatsBand({ stats }: { stats: StatData[] }) {
  const t = useTranslations('landing');

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="sr-only">{t('stats.title')}</h2>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-7">
        {stats.map((s) => (
          <Reading
            key={s.id}
            id={s.id}
            value={s.value}
            suffix={s.suffix}
            label={t(`stats.items.${s.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
