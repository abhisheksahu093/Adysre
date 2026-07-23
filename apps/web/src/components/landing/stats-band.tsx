'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { STAT_META, type Stat as StatData } from '@/data/landing';
import { ACCENT_ICON } from './accent';

/** Ease-out so the count decelerates into its final value. */
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * A single metric: an accent chip, a figure that counts up the first time it
 * scrolls into view, and a label. The number is locale-formatted at every frame,
 * so digit grouping stays correct in every language. Under
 * `prefers-reduced-motion` it renders the final value at once, with no animation.
 *
 * Where the metric has a page behind it the whole tile is a link — a visitor who
 * reads "448 icons" and wants to see them should not have to hunt the nav for
 * the way in. `teams` has no page, so it renders as a plain tile.
 */
function Stat({
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
  const Icon = meta?.icon;

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
    <div ref={ref} className="flex flex-col items-start gap-3">
      {Icon && meta && (
        <span
          aria-hidden
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-transform',
            'group-hover:scale-105',
            ACCENT_ICON[meta.accent],
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      )}

      <div>
        <div className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
          {format.number(display)}
          {suffix && <span className="text-primary">{suffix}</span>}
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          {label}
          {meta?.href && (
            <ArrowUpRight
              className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );

  const tile = cn(
    'group relative rounded-xl border border-border bg-card p-5 transition-all',
    meta?.href &&
      'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  );

  return meta?.href ? (
    <Link href={meta.href} className={tile}>
      {body}
    </Link>
  ) : (
    <div className={tile}>{body}</div>
  );
}

/**
 * Headline metrics band. Client Component for the on-scroll count-up; the
 * figures are computed on the server (from the real catalogues) and handed in as
 * props, so no catalogue is bundled into this client chunk.
 */
export function StatsBand({ stats }: { stats: StatData[] }) {
  const t = useTranslations('landing');

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {t('stats.title')}
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Stat
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
