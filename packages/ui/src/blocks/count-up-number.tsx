'use client';

/**
 * Live preview for `count-up-number`.
 *
 * Mirrors the `typescript` code variant (minus the JSX.Element annotation, per
 * the preview convention). Keep in step with `src/data/components/animation.ts`.
 */
import { useEffect, useRef, useState } from 'react';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUpNumber({
  value,
  duration = 1600,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(value * easeOut(progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          raf = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const format = (n: number): string =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={`${prefix}${format(value)}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {format(display)}
        {suffix}
      </span>
    </span>
  );
}

export const minHeight = 220;

export default function CountUpNumberPreview() {
  const stats: { value: number; prefix?: string; suffix?: string; label: string }[] = [
    { value: 12500, prefix: '$', suffix: '+', label: 'Monthly revenue' },
    { value: 98.6, suffix: '%', label: 'Uptime' },
    { value: 340, suffix: 'k', label: 'Active users' },
  ];

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 px-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <p className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
            <CountUpNumber
              value={stat.value}
              decimals={stat.value % 1 === 0 ? 0 : 1}
              {...(stat.prefix ? { prefix: stat.prefix } : {})}
              {...(stat.suffix ? { suffix: stat.suffix } : {})}
            />
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
