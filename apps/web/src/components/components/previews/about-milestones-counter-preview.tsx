'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `about-milestones-counter`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 280;

interface CounterStat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface AboutMilestonesCounterProps {
  kicker?: string;
  title?: string;
  stats: CounterStat[];
  durationMs?: number;
  className?: string;
}

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

function CountUp({ value, prefix = '', suffix = '', durationMs = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        observer.disconnect();
        const step = (now: number) => {
          if (!start) start = now;
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function AboutMilestonesCounter({
  kicker,
  title,
  stats,
  durationMs = 1600,
  className = '',
}: AboutMilestonesCounterProps) {
  return (
    <section
      aria-labelledby="abt-counter-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-counter-title"
          className="mb-8 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {stats.map((stat: CounterStat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="text-4xl font-bold leading-none tracking-tight text-gray-900 dark:text-gray-100">
              <CountUp value={stat.value} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} durationMs={durationMs} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AboutMilestonesCounterPreview() {
  return (
    <AboutMilestonesCounter
      kicker="Six years, counted"
      title="The numbers, so far"
      stats={[
        { value: 148, label: 'Projects shipped' },
        { value: 94, suffix: '%', label: 'Client retention' },
        { value: 9, label: 'Countries' },
        { value: 12, label: 'People' },
      ]}
    />
  );
}
