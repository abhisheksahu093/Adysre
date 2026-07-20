'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { useReducedMotion } from 'framer-motion';
import type { Stat as StatData } from '@/data/landing';

/** Ease-out so the count decelerates into its final value. */
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * A single metric that counts up from zero the first time it scrolls into view.
 * The number is locale-formatted at every frame, so grouping stays correct in
 * every language. Under prefers-reduced-motion it renders the final value at
 * once, with no animation.
 */
function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string | undefined;
  label: string;
}) {
  const format = useFormatter();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(reduce ? value : 0);

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

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {format.number(display)}
        {suffix && <span className="text-primary">{suffix}</span>}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/**
 * Headline metrics band. Client Component for the on-scroll count-up; the
 * figures are computed on the server (from the real catalogues) and handed in
 * as props, so no catalogue is bundled into this client chunk.
 */
export function StatsBand({ stats }: { stats: StatData[] }) {
  const t = useTranslations('landing');

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border bg-muted/20 p-10 sm:gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Stat key={s.id} value={s.value} suffix={s.suffix} label={t(`stats.items.${s.id}`)} />
        ))}
      </div>
    </section>
  );
}
