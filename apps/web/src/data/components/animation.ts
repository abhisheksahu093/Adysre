import type { ComponentEntry } from './types';

/**
 * Animation category.
 *
 * Scroll-triggered reveals are the classic a11y trap: content that only exists
 * once an animation has run is content some users never see. Both
 * implementations therefore start from "visible" and let the effect subtract -
 * the no-JS fallback is a `<noscript>` rule, and `prefers-reduced-motion` short-
 * circuits the animation to its final frame rather than disabling the reveal.
 */
export const animationComponents: ComponentEntry[] = [
  {
    slug: 'fade-in-on-scroll',
    category: 'animation',
    tags: ['scroll', 'reveal', 'fade', 'framer-motion', 'viewport'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-30',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '2.0.0',
    stats: { views: 3120, copies: 744, downloads: 208 },
    dependencies: [
      {
        name: 'framer-motion',
        version: '^12.42.2',
        url: 'https://www.npmjs.com/package/framer-motion',
      },
    ],
    variants: [
      { id: 'up', labelKey: 'up' },
      { id: 'down', labelKey: 'down' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'direction', type: "'up' | 'down' | 'none'", default: "'up'", descriptionKey: 'direction' },
      { name: 'distance', type: 'number', default: '24', descriptionKey: 'distance' },
      { name: 'delay', type: 'number', default: '0', descriptionKey: 'delay' },
      { name: 'duration', type: 'number', default: '0.5', descriptionKey: 'duration' },
      { name: 'once', type: 'boolean', default: 'true', descriptionKey: 'once' },
    ],
    code: {
      html: `<section class="reveal" data-reveal>
  <h2>Ship faster</h2>
  <p>Everything you need to go from idea to production, in one place.</p>
</section>

<section class="reveal" data-reveal data-reveal-delay="120">
  <h2>Scale calmly</h2>
  <p>Autoscaling, observability, and rollbacks that take one click.</p>
</section>

<!-- Without JS the observer never runs, so unhide everything up front. -->
<noscript>
  <style>
    .reveal { opacity: 1 !important; transform: none !important; }
  </style>
</noscript>

<script>
  (function () {
    var nodes = document.querySelectorAll('[data-reveal]');

    // No observer support, or the user asked for less motion: show immediately.
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      nodes.forEach(function (node) {
        node.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var node = entry.target;
          node.style.transitionDelay = (node.dataset.revealDelay || 0) + 'ms';
          node.classList.add('is-visible');
          observer.unobserve(node);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  })();
</script>`,
      css: `/*
 * No dark-mode block here, and none in the React tabs: the reveal only animates
 * opacity and transform, so it sets no colour of its own and whatever it wraps
 * keeps inheriting the theme. The Tailwind tab does carry dark: variants, but
 * only on the sample copy inside it.
 */
.reveal {
  max-width: 32rem;
  margin: 0 auto 6rem;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
  /* Keeps the reveal off the main thread. */
  will-change: opacity, transform;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
  will-change: auto;
}

/*
 * The script already skips the animation for these users, but the rule matters
 * for the frame before it runs - content must never be stuck at opacity: 0.
 */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}`,
      tailwind: `<!--
  Utility classes cover the two states; a small script flips between them.
  The starting state stays inline so no separate stylesheet is needed.
-->
<section
  class="mx-auto mb-24 max-w-lg translate-y-6 opacity-0 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
  data-reveal
>
  <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Ship faster</h2>
  <p class="mt-2 text-gray-600 dark:text-gray-400">Everything you need to go from idea to production, in one place.</p>
</section>

<section
  class="mx-auto mb-24 max-w-lg translate-y-6 opacity-0 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
  data-reveal
  data-reveal-delay="120"
>
  <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Scale calmly</h2>
  <p class="mt-2 text-gray-600 dark:text-gray-400">Autoscaling, observability, and rollbacks that take one click.</p>
</section>

<noscript>
  <style>
    [data-reveal] { opacity: 1 !important; transform: none !important; }
  </style>
</noscript>

<script>
  (function () {
    var nodes = document.querySelectorAll('[data-reveal]');

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      nodes.forEach(function (node) {
        node.dataset.visible = 'true';
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var node = entry.target;
          node.style.transitionDelay = (node.dataset.revealDelay || 0) + 'ms';
          node.dataset.visible = 'true';
          observer.unobserve(node);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  })();
</script>`,
      react: `import { motion, useReducedMotion } from 'framer-motion';

export function FadeInOnScroll({
  children,
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.5,
  once = true,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  const offset = direction === 'none' ? 0 : direction === 'down' ? -distance : distance;

  // Reduced motion keeps the reveal but drops the travel and the fade timing -
  // the content is present either way, never gated behind an animation.
  const hidden = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: offset };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: '0px 0px -10% 0px' }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}`,
      nextjs: `'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'none';
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function FadeInOnScroll({
  children,
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.5,
  once = true,
  className = '',
}: FadeInOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  const offset = direction === 'none' ? 0 : direction === 'down' ? -distance : distance;
  const hidden = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: offset };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: '0px 0px -10% 0px' }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}`,
      typescript: `import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export type FadeDirection = 'up' | 'down' | 'none';

export interface FadeInOnScrollProps {
  children: ReactNode;
  direction?: FadeDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function FadeInOnScroll({
  children,
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.5,
  once = true,
  className = '',
}: FadeInOnScrollProps): JSX.Element {
  const shouldReduceMotion: boolean | null = useReducedMotion();

  const offset: number = direction === 'none' ? 0 : direction === 'down' ? -distance : distance;
  const hidden = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: offset };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: '0px 0px -10% 0px' }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}`,
    },
  },
  {
    slug: 'stagger-reveal-grid',
    category: 'animation',
    tags: ['stagger', 'reveal', 'grid', 'intersection-observer', 'scroll'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'items', type: 'ReactNode[]', required: true, descriptionKey: 'items' },
      { name: 'minItemWidth', type: 'number', default: '180', descriptionKey: 'minItemWidth' },
      { name: 'staggerMs', type: 'number', default: '90', descriptionKey: 'staggerMs' },
      { name: 'distance', type: 'number', default: '16', descriptionKey: 'distance' },
      { name: 'once', type: 'boolean', default: 'true', descriptionKey: 'once' },
    ],
    code: {
      tailwind: `<!--
  A CSS grid whose items start hidden; one observer reveals them with a
  per-item transition delay. Reduced motion / no-JS shows them immediately.
-->
<ul
  class="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr))]"
  data-stagger
>
  <li class="translate-y-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 opacity-0 shadow-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">Realtime sync</li>
  <li class="translate-y-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 opacity-0 shadow-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">Edge caching</li>
  <li class="translate-y-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 opacity-0 shadow-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">Audit logs</li>
  <li class="translate-y-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 opacity-0 shadow-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">SSO &amp; SCIM</li>
</ul>

<noscript>
  <style>[data-stagger] > * { opacity: 1 !important; transform: none !important; }</style>
</noscript>

<script>
  (function () {
    var grid = document.querySelector('[data-stagger]');
    if (!grid) return;
    var items = grid.children;
    function showAll() {
      for (var i = 0; i < items.length; i++) items[i].dataset.shown = 'true';
    }
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      showAll();
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          for (var i = 0; i < items.length; i++) {
            items[i].style.transitionDelay = i * 90 + 'ms';
          }
          showAll();
          observer.disconnect();
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(grid);
  })();
</script>`,
      react: `'use client';

import { useEffect, useRef, useState } from 'react';

export function StaggerRevealGrid({
  items,
  minItemWidth = 180,
  staggerMs = 90,
  distance = 16,
  once = true,
  className = '',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion / no observer: show every item at once.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <ul
      ref={ref}
      className={\`grid gap-3 \${className}\`}
      style={{ gridTemplateColumns: \`repeat(auto-fill, minmax(min(100%, \${minItemWidth}px), 1fr))\` }}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={\`rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 \${
            visible ? 'opacity-100' : 'opacity-0'
          }\`}
          style={{
            transform: visible ? 'translateY(0)' : \`translateY(\${distance}px)\`,
            transitionDelay: visible ? \`\${index * staggerMs}ms\` : '0ms',
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface StaggerRevealGridProps {
  items: ReactNode[];
  minItemWidth?: number;
  staggerMs?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

export function StaggerRevealGrid({
  items,
  minItemWidth = 180,
  staggerMs = 90,
  distance = 16,
  once = true,
  className = '',
}: StaggerRevealGridProps): JSX.Element {
  const ref = useRef<HTMLUListElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion / no observer: show every item at once - the content is
    // never gated behind the animation.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const gridStyle: CSSProperties = {
    gridTemplateColumns: \`repeat(auto-fill, minmax(min(100%, \${minItemWidth}px), 1fr))\`,
  };

  return (
    <ul ref={ref} className={\`grid gap-3 \${className}\`} style={gridStyle}>
      {items.map((item, index) => (
        <li
          key={index}
          className={\`rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 \${
            visible ? 'opacity-100' : 'opacity-0'
          }\`}
          style={{
            transform: visible ? 'translateY(0)' : \`translateY(\${distance}px)\`,
            transitionDelay: visible ? \`\${index * staggerMs}ms\` : '0ms',
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'count-up-number',
    category: 'animation',
    tags: ['counter', 'count-up', 'stats', 'raf', 'numbers'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'value', type: 'number', required: true, descriptionKey: 'value' },
      { name: 'duration', type: 'number', default: '1600', descriptionKey: 'duration' },
      { name: 'decimals', type: 'number', default: '0', descriptionKey: 'decimals' },
      { name: 'prefix', type: 'string', default: "''", descriptionKey: 'prefix' },
      { name: 'suffix', type: 'string', default: "''", descriptionKey: 'suffix' },
    ],
    code: {
      tailwind: `<p class="text-4xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
  <span data-countup data-to="12500" data-decimals="0" data-prefix="$" data-suffix="+">$0+</span>
</p>

<script>
  (function () {
    var el = document.querySelector('[data-countup]');
    if (!el) return;
    var to = parseFloat(el.dataset.to || '0');
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    function fmt(n) {
      return (
        prefix +
        n.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) +
        suffix
      );
    }
    // Reduced motion / no observer: jump straight to the final value.
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.textContent = fmt(to);
      return;
    }
    function run() {
      var start = 0;
      function step(now) {
        if (!start) start = now;
        var p = Math.min((now - start) / 1600, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(to * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run();
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
  })();
</script>`,
      react: `'use client';

import { useEffect, useRef, useState } from 'react';

export function CountUpNumber({
  value,
  duration = 1600,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion / no observer: skip to the final value.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
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

  const format = (n) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <span ref={ref} className={\`tabular-nums \${className}\`} aria-label={\`\${prefix}\${format(value)}\${suffix}\`}>
      <span aria-hidden="true">
        {prefix}
        {format(display)}
        {suffix}
      </span>
    </span>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';

export interface CountUpNumberProps {
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
}: CountUpNumberProps): JSX.Element {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion / no observer: skip to the final value - screen readers
    // also get it via aria-label regardless.
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
    <span ref={ref} className={\`tabular-nums \${className}\`} aria-label={\`\${prefix}\${format(value)}\${suffix}\`}>
      <span aria-hidden="true">
        {prefix}
        {format(display)}
        {suffix}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'typewriter-text',
    category: 'animation',
    tags: ['typewriter', 'typing', 'text', 'cursor', 'loop'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'words', type: 'string[]', required: true, descriptionKey: 'words' },
      { name: 'typingSpeed', type: 'number', default: '90', descriptionKey: 'typingSpeed' },
      { name: 'deletingSpeed', type: 'number', default: '45', descriptionKey: 'deletingSpeed' },
      { name: 'pauseMs', type: 'number', default: '1400', descriptionKey: 'pauseMs' },
      { name: 'loop', type: 'boolean', default: 'true', descriptionKey: 'loop' },
      { name: 'showCursor', type: 'boolean', default: 'true', descriptionKey: 'showCursor' },
    ],
    code: {
      tailwind: `<!--
  A pure-CSS single-phrase typewriter: a steps() width animation reveals the
  text, a blinking right border plays the caret. Reduced motion shows it whole.
-->
<p
  class="inline-block overflow-hidden whitespace-nowrap border-r-2 border-gray-900 pr-1 font-mono text-xl font-semibold text-gray-900 motion-reduce:!w-full motion-reduce:border-transparent dark:border-gray-100 dark:text-gray-100"
  style="width: 22ch; animation: typing 2.4s steps(22, end) forwards, blink 800ms step-end infinite;"
>
  Build without limits.
</p>

<style>
  @keyframes typing {
    from { width: 0; }
    to { width: 22ch; }
  }
  @keyframes blink {
    50% { border-color: transparent; }
  }
</style>`,
      react: `'use client';

import { useEffect, useState } from 'react';

export function TypewriterText({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseMs = 1400,
  loop = true,
  showCursor = true,
  className = '',
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const current = words[index % words.length] ?? '';

  useEffect(() => {
    if (reduce || words.length === 0) return;

    // Fully typed: hold, then start deleting (unless done and not looping).
    if (!deleting && text === current) {
      if (!loop && index === words.length - 1) return;
      const hold = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(hold);
    }

    // Fully deleted: advance to the next word.
    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const tick = setTimeout(
      () => {
        setText((prev) => (deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)));
      },
      deleting ? deletingSpeed : typingSpeed,
    );
    return () => clearTimeout(tick);
  }, [text, deleting, current, index, loop, pauseMs, typingSpeed, deletingSpeed, reduce, words.length]);

  const display = reduce ? current : text;

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      {showCursor && !reduce ? (
        <span
          className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-current align-middle motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : null}
      <span className="sr-only">{current}</span>
    </span>
  );
}`,
      typescript: `'use client';

import { useEffect, useState } from 'react';

export interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  loop?: boolean;
  showCursor?: boolean;
  className?: string;
}

export function TypewriterText({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseMs = 1400,
  loop = true,
  showCursor = true,
  className = '',
}: TypewriterTextProps): JSX.Element {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Guard the index - words[] is T | undefined under noUncheckedIndexedAccess.
  const current = words[index % words.length] ?? '';

  useEffect(() => {
    if (reduce || words.length === 0) return;

    if (!deleting && text === current) {
      if (!loop && index === words.length - 1) return;
      const hold = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(hold);
    }

    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const tick = setTimeout(
      () => {
        setText((prev) => (deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)));
      },
      deleting ? deletingSpeed : typingSpeed,
    );
    return () => clearTimeout(tick);
  }, [text, deleting, current, index, loop, pauseMs, typingSpeed, deletingSpeed, reduce, words.length]);

  const display = reduce ? current : text;

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      {showCursor && !reduce ? (
        <span
          className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-current align-middle motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : null}
      <span className="sr-only">{current}</span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'scroll-progress-bar',
    category: 'animation',
    tags: ['scroll', 'progress', 'reading', 'indicator', 'bar'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'height', type: 'number', default: '4', descriptionKey: 'height' },
      { name: 'maxHeight', type: 'number', default: '288', descriptionKey: 'maxHeight' },
    ],
    code: {
      tailwind: `<!-- Progress is scoped to this scroll container, not the window. -->
<div class="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
  <div
    class="h-1 w-full bg-gray-200 dark:bg-gray-800"
    role="progressbar"
    aria-label="Reading progress"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="0"
    data-progress-track
  >
    <div
      class="h-full w-0 bg-blue-600 transition-[width] duration-150 ease-out motion-reduce:transition-none dark:bg-blue-500"
      data-progress-fill
    ></div>
  </div>
  <div class="max-h-72 overflow-y-auto px-4 py-3" data-progress-scroll>
    <!-- Long content goes here; the bar fills as it is scrolled. -->
  </div>
</div>

<script>
  (function () {
    var scroller = document.querySelector('[data-progress-scroll]');
    var fill = document.querySelector('[data-progress-fill]');
    var track = document.querySelector('[data-progress-track]');
    if (!scroller || !fill || !track) return;
    function update() {
      var max = scroller.scrollHeight - scroller.clientHeight;
      var p = max > 0 ? Math.min(scroller.scrollTop / max, 1) : 0;
      fill.style.width = p * 100 + '%';
      track.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    }
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  })();
</script>`,
      react: `'use client';

import { useEffect, useRef, useState } from 'react';

export function ScrollProgressBar({ children, height = 4, maxHeight = 288, className = '' }) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const update = () => {
      const max = node.scrollHeight - node.clientHeight;
      setProgress(max > 0 ? Math.min(node.scrollTop / max, 1) : 0);
    };

    update();
    node.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      node.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className={\`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}>
      <div
        className="w-full bg-gray-200 dark:bg-gray-800"
        style={{ height }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full bg-blue-600 transition-[width] duration-150 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: \`\${progress * 100}%\` }}
        />
      </div>
      <div ref={scrollRef} className="overflow-y-auto px-4 py-3" style={{ maxHeight }}>
        {children}
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface ScrollProgressBarProps {
  children: ReactNode;
  height?: number;
  maxHeight?: number;
  className?: string;
}

export function ScrollProgressBar({
  children,
  height = 4,
  maxHeight = 288,
  className = '',
}: ScrollProgressBarProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const update = () => {
      const max = node.scrollHeight - node.clientHeight;
      setProgress(max > 0 ? Math.min(node.scrollTop / max, 1) : 0);
    };

    update();
    node.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      node.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className={\`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 \${className}\`}>
      <div
        className="w-full bg-gray-200 dark:bg-gray-800"
        style={{ height }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full bg-blue-600 transition-[width] duration-150 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: \`\${progress * 100}%\` }}
        />
      </div>
      <div ref={scrollRef} className="overflow-y-auto px-4 py-3" style={{ maxHeight }}>
        {children}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'hover-lift-card',
    category: 'animation',
    tags: ['hover', 'card', 'lift', 'transition', 'shadow'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'liftPx', type: 'number', default: '8', descriptionKey: 'liftPx' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Rules travel in a scoped style tag; only transform/opacity animate. -->
<style>
  .hover-lift {
    transform: translateY(0);
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
  }
  .hover-lift:hover,
  .hover-lift:focus-within { transform: translateY(-8px); }
  @media (prefers-reduced-motion: reduce) {
    .hover-lift { transition: none; }
    .hover-lift:hover, .hover-lift:focus-within { transform: none; }
  }
</style>

<div class="hover-lift max-w-xs rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl focus-within:shadow-xl dark:border-gray-800 dark:bg-gray-900">
  <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Realtime collaboration</h3>
  <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Edit together with live cursors, comments and instant sync.</p>
</div>`,
      react: `export function HoverLiftCard({ title, description, liftPx = 8, className = '' }) {
  return (
    <>
      <style>{\`
        .adysre-hover-lift {
          transform: translateY(0);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
        }
        .adysre-hover-lift:hover,
        .adysre-hover-lift:focus-within { transform: translateY(var(--lift, -8px)); }
        @media (prefers-reduced-motion: reduce) {
          .adysre-hover-lift { transition: none; }
          .adysre-hover-lift:hover, .adysre-hover-lift:focus-within { transform: none; }
        }
      \`}</style>
      <div
        className={\`adysre-hover-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl focus-within:shadow-xl dark:border-gray-800 dark:bg-gray-900 \${className}\`}
        style={{ '--lift': \`-\${liftPx}px\` }}
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
    </>
  );
}`,
      typescript: `import type { CSSProperties } from 'react';

export interface HoverLiftCardProps {
  title: string;
  description?: string;
  liftPx?: number;
  className?: string;
}

export function HoverLiftCard({
  title,
  description,
  liftPx = 8,
  className = '',
}: HoverLiftCardProps): JSX.Element {
  return (
    <>
      <style>{\`
        .adysre-hover-lift {
          transform: translateY(0);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
        }
        .adysre-hover-lift:hover,
        .adysre-hover-lift:focus-within { transform: translateY(var(--lift, -8px)); }
        @media (prefers-reduced-motion: reduce) {
          .adysre-hover-lift { transition: none; }
          .adysre-hover-lift:hover, .adysre-hover-lift:focus-within { transform: none; }
        }
      \`}</style>
      <div
        className={\`adysre-hover-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl focus-within:shadow-xl dark:border-gray-800 dark:bg-gray-900 \${className}\`}
        style={{ '--lift': \`-\${liftPx}px\` } as CSSProperties}
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
    </>
  );
}`,
    },
  },
  {
    slug: 'gradient-text-animated',
    category: 'animation',
    tags: ['gradient', 'text', 'animation', 'background-clip', 'heading'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'text', type: 'string', required: true, descriptionKey: 'text' },
      { name: 'durationMs', type: 'number', default: '6000', descriptionKey: 'durationMs' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes gradient-pan { to { background-position: 200% center; } }
  .gradient-text {
    background-image: linear-gradient(90deg, #6366f1, #ec4899, #f59e0b, #6366f1);
    background-size: 200% auto;
    animation: gradient-pan 6s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .gradient-text { animation: none; background-position: 0 center; }
  }
</style>

<span class="gradient-text inline-block bg-clip-text text-4xl font-bold text-transparent">
  Ship something beautiful
</span>`,
      react: `export function GradientTextAnimated({ text, durationMs = 6000, className = '' }) {
  return (
    <>
      <style>{\`
        @keyframes adysre-gradient-pan { to { background-position: 200% center; } }
        @media (prefers-reduced-motion: reduce) {
          .adysre-gradient-text { animation: none !important; background-position: 0 center !important; }
        }
      \`}</style>
      <span
        className={\`adysre-gradient-text inline-block bg-clip-text text-transparent \${className}\`}
        style={{
          backgroundImage: 'linear-gradient(90deg, #6366f1, #ec4899, #f59e0b, #6366f1)',
          backgroundSize: '200% auto',
          animation: \`adysre-gradient-pan \${durationMs}ms linear infinite\`,
        }}
      >
        {text}
      </span>
    </>
  );
}`,
      typescript: `import type { CSSProperties } from 'react';

export interface GradientTextAnimatedProps {
  text: string;
  durationMs?: number;
  className?: string;
}

export function GradientTextAnimated({
  text,
  durationMs = 6000,
  className = '',
}: GradientTextAnimatedProps): JSX.Element {
  return (
    <>
      <style>{\`
        @keyframes adysre-gradient-pan { to { background-position: 200% center; } }
        @media (prefers-reduced-motion: reduce) {
          .adysre-gradient-text { animation: none !important; background-position: 0 center !important; }
        }
      \`}</style>
      <span
        className={\`adysre-gradient-text inline-block bg-clip-text text-transparent \${className}\`}
        style={{
          backgroundImage: 'linear-gradient(90deg, #6366f1, #ec4899, #f59e0b, #6366f1)',
          backgroundSize: '200% auto',
          animation: \`adysre-gradient-pan \${durationMs}ms linear infinite\`,
        } as CSSProperties}
      >
        {text}
      </span>
    </>
  );
}`,
    },
  },
  {
    slug: 'pulse-attention',
    category: 'animation',
    tags: ['pulse', 'attention', 'ring', 'ping', 'badge'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes pulse-ring {
    0% { transform: scale(0.9); opacity: 0.7; }
    70%, 100% { transform: scale(1.7); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pulse-ring { animation: none; opacity: 0; }
  }
</style>

<span class="relative inline-flex">
  <span class="pulse-ring absolute inset-0 rounded-full bg-blue-500/50" style="animation: pulse-ring 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;" aria-hidden="true"></span>
  <span class="relative inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white">New feature</span>
</span>`,
      react: `export function PulseAttention({ children, className = '' }) {
  return (
    <>
      <style>{\`
        @keyframes adysre-pulse-ring {
          0% { transform: scale(0.9); opacity: 0.7; }
          70%, 100% { transform: scale(1.7); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adysre-pulse-ring { animation: none !important; opacity: 0 !important; }
        }
      \`}</style>
      <span className={\`relative inline-flex \${className}\`}>
        <span
          className="adysre-pulse-ring absolute inset-0 rounded-full bg-blue-500/50"
          style={{ animation: 'adysre-pulse-ring 1.8s cubic-bezier(0, 0, 0.2, 1) infinite' }}
          aria-hidden="true"
        />
        <span className="relative">{children}</span>
      </span>
    </>
  );
}`,
      typescript: `import type { CSSProperties, ReactNode } from 'react';

export interface PulseAttentionProps {
  children: ReactNode;
  className?: string;
}

export function PulseAttention({ children, className = '' }: PulseAttentionProps): JSX.Element {
  return (
    <>
      <style>{\`
        @keyframes adysre-pulse-ring {
          0% { transform: scale(0.9); opacity: 0.7; }
          70%, 100% { transform: scale(1.7); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adysre-pulse-ring { animation: none !important; opacity: 0 !important; }
        }
      \`}</style>
      <span className={\`relative inline-flex \${className}\`}>
        <span
          className="adysre-pulse-ring absolute inset-0 rounded-full bg-blue-500/50"
          style={{ animation: 'adysre-pulse-ring 1.8s cubic-bezier(0, 0, 0.2, 1) infinite' } as CSSProperties}
          aria-hidden="true"
        />
        <span className="relative">{children}</span>
      </span>
    </>
  );
}`,
    },
  },
  {
    slug: 'flip-card-3d',
    category: 'animation',
    tags: ['flip', '3d', 'card', 'hover', 'transform'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'front', type: 'ReactNode', required: true, descriptionKey: 'front' },
      { name: 'back', type: 'ReactNode', required: true, descriptionKey: 'back' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Flips on hover and on keyboard focus of the tabbable front face. -->
<style>
  .flip { perspective: 1000px; }
  .flip-inner { transform-style: preserve-3d; transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1); }
  .flip:hover .flip-inner, .flip:focus-within .flip-inner { transform: rotateY(180deg); }
  .flip-face { backface-visibility: hidden; }
  .flip-back { transform: rotateY(180deg); }
  @media (prefers-reduced-motion: reduce) { .flip-inner { transition: none; } }
</style>

<div class="flip h-48 w-full max-w-xs">
  <div class="flip-inner relative h-full w-full">
    <div class="flip-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900" tabindex="0">
      <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">Pro plan</span>
      <span class="text-sm text-gray-500 dark:text-gray-400">Hover to reveal</span>
    </div>
    <div class="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-blue-500 bg-blue-600 p-6 text-center text-white">
      <span class="text-3xl font-bold">$29/mo</span>
      <span class="text-sm text-blue-100">Everything you need to scale</span>
    </div>
  </div>
</div>`,
      react: `export function FlipCard3D({ front, back, className = '' }) {
  return (
    <>
      <style>{\`
        .adysre-flip { perspective: 1000px; }
        .adysre-flip-inner { transform-style: preserve-3d; transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1); }
        .adysre-flip:hover .adysre-flip-inner, .adysre-flip:focus-within .adysre-flip-inner { transform: rotateY(180deg); }
        .adysre-flip-face { backface-visibility: hidden; }
        .adysre-flip-back { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) { .adysre-flip-inner { transition: none; } }
      \`}</style>
      <div className={\`adysre-flip h-full w-full \${className}\`}>
        <div className="adysre-flip-inner relative h-full w-full">
          <div
            className="adysre-flip-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900"
            tabIndex={0}
          >
            {front}
          </div>
          <div className="adysre-flip-face adysre-flip-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-blue-500 bg-blue-600 p-6 text-center text-white">
            {back}
          </div>
        </div>
      </div>
    </>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface FlipCard3DProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function FlipCard3D({ front, back, className = '' }: FlipCard3DProps): JSX.Element {
  return (
    <>
      <style>{\`
        .adysre-flip { perspective: 1000px; }
        .adysre-flip-inner { transform-style: preserve-3d; transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1); }
        .adysre-flip:hover .adysre-flip-inner, .adysre-flip:focus-within .adysre-flip-inner { transform: rotateY(180deg); }
        .adysre-flip-face { backface-visibility: hidden; }
        .adysre-flip-back { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) { .adysre-flip-inner { transition: none; } }
      \`}</style>
      <div className={\`adysre-flip h-full w-full \${className}\`}>
        <div className="adysre-flip-inner relative h-full w-full">
          <div
            className="adysre-flip-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900"
            tabIndex={0}
          >
            {front}
          </div>
          <div className="adysre-flip-face adysre-flip-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-blue-500 bg-blue-600 p-6 text-center text-white">
            {back}
          </div>
        </div>
      </div>
    </>
  );
}`,
    },
  },
  {
    slug: 'ripple-effect-button',
    category: 'animation',
    tags: ['ripple', 'button', 'click', 'material', 'interaction'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'onClick', type: '(e: MouseEvent) => void', descriptionKey: 'onClick' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes ripple { to { transform: scale(2.4); opacity: 0; } }
</style>

<button type="button" class="ripple-btn relative overflow-hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
  Click me
</button>

<script>
  (function () {
    var btn = document.querySelector('.ripple-btn');
    if (!btn) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    btn.addEventListener('click', function (e) {
      if (reduce) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var span = document.createElement('span');
      span.style.cssText =
        'position:absolute;border-radius:9999px;background:rgba(255,255,255,0.4);pointer-events:none;width:' +
        size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size / 2) +
        'px;top:' + (e.clientY - rect.top - size / 2) + 'px;animation:ripple 600ms ease-out forwards';
      btn.appendChild(span);
      setTimeout(function () { span.remove(); }, 600);
    });
  })();
</script>`,
      react: `'use client';

import { useCallback, useState } from 'react';

export function RippleEffectButton({ children, className = '', onClick }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback(
    (event) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const id = Date.now();
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        setRipples((prev) => [...prev, { id, x, y, size }]);
        window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      }
      onClick?.(event);
    },
    [onClick],
  );

  return (
    <>
      <style>{\`@keyframes adysre-ripple { to { transform: scale(2.4); opacity: 0; } }\`}</style>
      <button
        type="button"
        onClick={handleClick}
        className={\`relative overflow-hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 \${className}\`}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-white/40"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size, animation: 'adysre-ripple 600ms ease-out forwards' }}
          />
        ))}
        <span className="relative">{children}</span>
      </button>
    </>
  );
}`,
      typescript: `'use client';

import { useCallback, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface RippleEffectButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function RippleEffectButton({
  children,
  className = '',
  onClick,
}: RippleEffectButtonProps): JSX.Element {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const id = Date.now();
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        setRipples((prev) => [...prev, { id, x, y, size }]);
        window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      }
      onClick?.(event);
    },
    [onClick],
  );

  return (
    <>
      <style>{\`@keyframes adysre-ripple { to { transform: scale(2.4); opacity: 0; } }\`}</style>
      <button
        type="button"
        onClick={handleClick}
        className={\`relative overflow-hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 \${className}\`}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-white/40"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size, animation: 'adysre-ripple 600ms ease-out forwards' } as CSSProperties}
          />
        ))}
        <span className="relative">{children}</span>
      </button>
    </>
  );
}`,
    },
  },
  {
    slug: 'bounce-in-entrance',
    category: 'animation',
    tags: ['bounce', 'entrance', 'mount', 'keyframes', 'reveal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'delayMs', type: 'number', default: '0', descriptionKey: 'delayMs' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes bounce-in {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); opacity: 1; }
    70% { transform: scale(0.92); }
    100% { transform: scale(1); opacity: 1; }
  }
  .bounce-in { animation: bounce-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  @media (prefers-reduced-motion: reduce) {
    .bounce-in { animation: none; opacity: 1; transform: none; }
  }
</style>

<div class="bounce-in rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-6 text-center text-lg font-bold text-white shadow-lg">
  Welcome aboard
</div>`,
      react: `export function BounceInEntrance({ children, delayMs = 0, className = '' }) {
  return (
    <>
      <style>{\`
        @keyframes adysre-bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.92); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adysre-bounce-in { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      \`}</style>
      <div
        className={\`adysre-bounce-in \${className}\`}
        style={{ animation: 'adysre-bounce-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: \`\${delayMs}ms\` }}
      >
        {children}
      </div>
    </>
  );
}`,
      typescript: `import type { CSSProperties, ReactNode } from 'react';

export interface BounceInEntranceProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

export function BounceInEntrance({
  children,
  delayMs = 0,
  className = '',
}: BounceInEntranceProps): JSX.Element {
  return (
    <>
      <style>{\`
        @keyframes adysre-bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.92); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adysre-bounce-in { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      \`}</style>
      <div
        className={\`adysre-bounce-in \${className}\`}
        style={{ animation: 'adysre-bounce-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: \`\${delayMs}ms\` } as CSSProperties}
      >
        {children}
      </div>
    </>
  );
}`,
    },
  },
  {
    slug: 'parallax-layers',
    category: 'animation',
    tags: ['parallax', 'pointer', 'layers', 'depth', 'interactive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'strength', type: 'number', default: '40', descriptionKey: 'strength' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Pointer tracking is scoped to this container only, never the document. -->
<div class="parallax relative h-56 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
  <span data-depth="1" class="absolute left-8 top-8 h-16 w-16 rounded-full bg-white/20 transition-transform duration-200 ease-out will-change-transform"></span>
  <span data-depth="2" class="absolute right-10 top-12 h-10 w-10 rounded-lg bg-white/30 transition-transform duration-200 ease-out will-change-transform"></span>
  <span data-depth="3" class="absolute bottom-10 left-1/3 h-20 w-20 rounded-full bg-amber-300/40 transition-transform duration-200 ease-out will-change-transform"></span>
  <div data-depth="1.5" class="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out will-change-transform">
    <p class="text-lg font-bold text-white">Move your cursor</p>
  </div>
</div>

<script>
  (function () {
    var node = document.querySelector('.parallax');
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var layers = node.querySelectorAll('[data-depth]');
    node.addEventListener('pointermove', function (e) {
      var rect = node.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute('data-depth') || '0');
        layer.style.transform = 'translate3d(' + px * depth * 40 + 'px,' + py * depth * 40 + 'px,0)';
      });
    });
    node.addEventListener('pointerleave', function () {
      layers.forEach(function (layer) { layer.style.transform = 'translate3d(0,0,0)'; });
    });
  })();
</script>`,
      react: `'use client';

import { useEffect, useRef } from 'react';

export function ParallaxLayers({ className = '', strength = 40 }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const layers = Array.from(node.querySelectorAll('[data-depth]'));
    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? '0');
        layer.style.transform = \`translate3d(\${px * depth * strength}px, \${py * depth * strength}px, 0)\`;
      }
    };
    const reset = () => {
      for (const layer of layers) layer.style.transform = 'translate3d(0, 0, 0)';
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', reset);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={\`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 \${className}\`}
    >
      <span data-depth="1" className="absolute left-8 top-8 h-16 w-16 rounded-full bg-white/20 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <span data-depth="2" className="absolute right-10 top-12 h-10 w-10 rounded-lg bg-white/30 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <span data-depth="3" className="absolute bottom-10 left-1/3 h-20 w-20 rounded-full bg-amber-300/40 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <div data-depth="1.5" className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out will-change-transform">
        <p className="text-lg font-bold text-white drop-shadow">Move your cursor</p>
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface ParallaxLayersProps {
  strength?: number;
  className?: string;
}

export function ParallaxLayers({ className = '', strength = 40 }: ParallaxLayersProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const layers = Array.from(node.querySelectorAll<HTMLElement>('[data-depth]'));
    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? '0');
        layer.style.transform = \`translate3d(\${px * depth * strength}px, \${py * depth * strength}px, 0)\`;
      }
    };
    const reset = () => {
      for (const layer of layers) layer.style.transform = 'translate3d(0, 0, 0)';
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', reset);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={\`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 \${className}\`}
    >
      <span data-depth="1" className="absolute left-8 top-8 h-16 w-16 rounded-full bg-white/20 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <span data-depth="2" className="absolute right-10 top-12 h-10 w-10 rounded-lg bg-white/30 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <span data-depth="3" className="absolute bottom-10 left-1/3 h-20 w-20 rounded-full bg-amber-300/40 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <div data-depth="1.5" className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out will-change-transform">
        <p className="text-lg font-bold text-white drop-shadow">Move your cursor</p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'animated-checkmark-draw',
    category: 'animation',
    tags: ['checkmark', 'svg', 'draw', 'success', 'stroke'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'size', type: 'number', default: '96', descriptionKey: 'size' },
      { name: 'label', type: 'string', default: "'Success'", descriptionKey: 'label' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes draw { to { stroke-dashoffset: 0; } }
  .check-circle { stroke-dasharray: 160; stroke-dashoffset: 160; animation: draw 600ms ease-out forwards; }
  .check-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: draw 300ms ease-out 520ms forwards; }
  @media (prefers-reduced-motion: reduce) {
    .check-circle, .check-mark { animation: none; stroke-dashoffset: 0; }
  }
</style>

<div class="flex flex-col items-center gap-3 text-green-500 dark:text-green-400" role="img" aria-label="Success">
  <svg width="96" height="96" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    <circle class="check-circle" cx="26" cy="26" r="24" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    <path class="check-mark" d="M15 27 l7 7 l15 -15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Success</span>
</div>`,
      react: `export function AnimatedCheckmarkDraw({ size = 96, label = 'Success', className = '' }) {
  return (
    <>
      <style>{\`
        @keyframes adysre-draw { to { stroke-dashoffset: 0; } }
        .adysre-check-circle { stroke-dasharray: 160; stroke-dashoffset: 160; animation: adysre-draw 600ms ease-out forwards; }
        .adysre-check-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: adysre-draw 300ms ease-out 520ms forwards; }
        @media (prefers-reduced-motion: reduce) {
          .adysre-check-circle, .adysre-check-mark { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      \`}</style>
      <div className={\`flex flex-col items-center gap-3 text-green-500 dark:text-green-400 \${className}\`} role="img" aria-label={label}>
        <svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden="true">
          <circle className="adysre-check-circle" cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path className="adysre-check-mark" d="M15 27 l7 7 l15 -15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</span>
      </div>
    </>
  );
}`,
      typescript: `export interface AnimatedCheckmarkDrawProps {
  size?: number;
  label?: string;
  className?: string;
}

export function AnimatedCheckmarkDraw({
  size = 96,
  label = 'Success',
  className = '',
}: AnimatedCheckmarkDrawProps): JSX.Element {
  return (
    <>
      <style>{\`
        @keyframes adysre-draw { to { stroke-dashoffset: 0; } }
        .adysre-check-circle { stroke-dasharray: 160; stroke-dashoffset: 160; animation: adysre-draw 600ms ease-out forwards; }
        .adysre-check-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: adysre-draw 300ms ease-out 520ms forwards; }
        @media (prefers-reduced-motion: reduce) {
          .adysre-check-circle, .adysre-check-mark { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      \`}</style>
      <div className={\`flex flex-col items-center gap-3 text-green-500 dark:text-green-400 \${className}\`} role="img" aria-label={label}>
        <svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden="true">
          <circle className="adysre-check-circle" cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path className="adysre-check-mark" d="M15 27 l7 7 l15 -15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</span>
      </div>
    </>
  );
}`,
    },
  },
  {
    slug: 'blob-morph',
    category: 'animation',
    tags: ['blob', 'morph', 'gradient', 'organic', 'shape'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'size', type: 'number', default: '160', descriptionKey: 'size' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  /* Rotate is GPU-cheap; border-radius drives the organic morph. */
  @keyframes blob {
    0%, 100% { border-radius: 42% 58% 63% 37% / 42% 45% 55% 58%; transform: rotate(0deg); }
    33% { border-radius: 62% 38% 41% 59% / 63% 55% 45% 37%; transform: rotate(120deg); }
    66% { border-radius: 38% 62% 58% 42% / 45% 63% 37% 55%; transform: rotate(240deg); }
  }
  .blob { animation: blob 8s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
</style>

<div class="blob h-40 w-40 bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500" aria-hidden="true"></div>`,
      react: `export function BlobMorph({ size = 160, className = '' }) {
  return (
    <>
      <style>{\`
        @keyframes adysre-blob {
          0%, 100% { border-radius: 42% 58% 63% 37% / 42% 45% 55% 58%; transform: rotate(0deg); }
          33% { border-radius: 62% 38% 41% 59% / 63% 55% 45% 37%; transform: rotate(120deg); }
          66% { border-radius: 38% 62% 58% 42% / 45% 63% 37% 55%; transform: rotate(240deg); }
        }
        @media (prefers-reduced-motion: reduce) { .adysre-blob { animation: none !important; } }
      \`}</style>
      <div
        className={\`adysre-blob bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 \${className}\`}
        style={{ width: size, height: size, animation: 'adysre-blob 8s ease-in-out infinite' }}
        aria-hidden="true"
      />
    </>
  );
}`,
      typescript: `import type { CSSProperties } from 'react';

export interface BlobMorphProps {
  size?: number;
  className?: string;
}

export function BlobMorph({ size = 160, className = '' }: BlobMorphProps): JSX.Element {
  return (
    <>
      <style>{\`
        @keyframes adysre-blob {
          0%, 100% { border-radius: 42% 58% 63% 37% / 42% 45% 55% 58%; transform: rotate(0deg); }
          33% { border-radius: 62% 38% 41% 59% / 63% 55% 45% 37%; transform: rotate(120deg); }
          66% { border-radius: 38% 62% 58% 42% / 45% 63% 37% 55%; transform: rotate(240deg); }
        }
        @media (prefers-reduced-motion: reduce) { .adysre-blob { animation: none !important; } }
      \`}</style>
      <div
        className={\`adysre-blob bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 \${className}\`}
        style={{ width: size, height: size, animation: 'adysre-blob 8s ease-in-out infinite' } as CSSProperties}
        aria-hidden="true"
      />
    </>
  );
}`,
    },
  },
  {
    slug: 'text-scramble',
    category: 'animation',
    tags: ['scramble', 'text', 'decode', 'glitch', 'reveal'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'text', type: 'string', required: true, descriptionKey: 'text' },
      { name: 'speedMs', type: 'number', default: '40', descriptionKey: 'speedMs' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<span class="scramble font-mono text-xl font-semibold text-gray-900 dark:text-gray-100" data-text="DECRYPTING SIGNAL">DECRYPTING SIGNAL</span>

<script>
  (function () {
    var el = document.querySelector('.scramble');
    if (!el) return;
    var text = el.getAttribute('data-text') || '';
    var chars = '!<>-_\\\\/[]{}-=+*^?#';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = text; return; }
    var revealed = 0, frame = 0;
    var id = setInterval(function () {
      frame++;
      if (frame % 3 === 0) revealed++;
      var out = '';
      for (var i = 0; i < text.length; i++) {
        out += i < revealed || text[i] === ' ' ? text[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (revealed >= text.length) clearInterval(id);
    }, 40);
  })();
</script>`,
      react: `'use client';

import { useEffect, useState } from 'react';

const SCRAMBLE_CHARS = '!<>-_\\\\/[]{}-=+*^?#';

export function TextScramble({ text, speedMs = 40, className = '' }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    let revealed = 0;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame % 3 === 0) revealed += 1;
      const out = text
        .split('')
        .map((ch, i) => {
          if (i < revealed || ch === ' ') return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch;
        })
        .join('');
      setDisplay(out);
      if (revealed >= text.length) window.clearInterval(id);
    }, speedMs);
    return () => window.clearInterval(id);
  }, [text, speedMs]);

  return (
    <span className={\`font-mono \${className}\`} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}`,
      typescript: `'use client';

import { useEffect, useState } from 'react';

const SCRAMBLE_CHARS = '!<>-_\\\\/[]{}-=+*^?#';

export interface TextScrambleProps {
  text: string;
  speedMs?: number;
  className?: string;
}

export function TextScramble({ text, speedMs = 40, className = '' }: TextScrambleProps): JSX.Element {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    let revealed = 0;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame % 3 === 0) revealed += 1;
      const out = text
        .split('')
        .map((ch, i) => {
          if (i < revealed || ch === ' ') return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch;
        })
        .join('');
      setDisplay(out);
      if (revealed >= text.length) window.clearInterval(id);
    }, speedMs);
    return () => window.clearInterval(id);
  }, [text, speedMs]);

  return (
    <span className={\`font-mono \${className}\`} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'wave-text',
    category: 'animation',
    tags: ['wave', 'text', 'letters', 'stagger', 'bob'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'text', type: 'string', required: true, descriptionKey: 'text' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes wave { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-0.35em); } }
  .wave-letter { display: inline-block; animation: wave 1.6s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .wave-letter { animation: none; } }
</style>

<span class="inline-flex text-3xl font-bold text-blue-600 dark:text-blue-400" aria-label="Hello">
  <span class="wave-letter" style="animation-delay: 0ms;">H</span>
  <span class="wave-letter" style="animation-delay: 80ms;">e</span>
  <span class="wave-letter" style="animation-delay: 160ms;">l</span>
  <span class="wave-letter" style="animation-delay: 240ms;">l</span>
  <span class="wave-letter" style="animation-delay: 320ms;">o</span>
</span>`,
      react: `export function WaveText({ text, className = '' }) {
  const letters = text.split('');
  return (
    <>
      <style>{\`
        @keyframes adysre-wave { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-0.35em); } }
        @media (prefers-reduced-motion: reduce) { .adysre-wave-letter { animation: none !important; } }
      \`}</style>
      <span className={\`inline-flex \${className}\`} aria-label={text}>
        {letters.map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="adysre-wave-letter inline-block whitespace-pre"
            style={{ animation: 'adysre-wave 1.6s ease-in-out infinite', animationDelay: \`\${i * 80}ms\` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}`,
      typescript: `import type { CSSProperties } from 'react';

export interface WaveTextProps {
  text: string;
  className?: string;
}

export function WaveText({ text, className = '' }: WaveTextProps): JSX.Element {
  const letters = text.split('');
  return (
    <>
      <style>{\`
        @keyframes adysre-wave { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-0.35em); } }
        @media (prefers-reduced-motion: reduce) { .adysre-wave-letter { animation: none !important; } }
      \`}</style>
      <span className={\`inline-flex \${className}\`} aria-label={text}>
        {letters.map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="adysre-wave-letter inline-block whitespace-pre"
            style={{ animation: 'adysre-wave 1.6s ease-in-out infinite', animationDelay: \`\${i * 80}ms\` } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}`,
    },
  },
  {
    slug: 'confetti-burst',
    category: 'animation',
    tags: ['confetti', 'burst', 'celebrate', 'click', 'particles'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'label', type: 'string', default: "'Celebrate'", descriptionKey: 'label' },
      { name: 'particleCount', type: 'number', default: '24', descriptionKey: 'particleCount' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Particles are absolutely positioned inside this wrapper - never the document. -->
<style>
  @keyframes confetti {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
  }
</style>

<div class="confetti relative inline-flex">
  <span class="confetti-origin pointer-events-none absolute left-1/2 top-0 h-0 w-0"></span>
  <button type="button" class="confetti-btn relative rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
    Celebrate
  </button>
</div>

<script>
  (function () {
    var wrap = document.querySelector('.confetti');
    if (!wrap) return;
    var origin = wrap.querySelector('.confetti-origin');
    var btn = wrap.querySelector('.confetti-btn');
    var colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    btn.addEventListener('click', function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      for (var i = 0; i < 24; i++) {
        var a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 80;
        var p = document.createElement('span');
        p.style.cssText =
          'position:absolute;width:8px;height:8px;border-radius:2px;background:' + colors[i % colors.length] +
          ';--dx:' + Math.cos(a) * d + 'px;--dy:' + (Math.sin(a) * d - 30) + 'px;--rot:' +
          (Math.random() * 720 - 360) + 'deg;animation:confetti 900ms ease-out forwards';
        origin.appendChild(p);
      }
      setTimeout(function () { origin.innerHTML = ''; }, 1000);
    });
  })();
</script>`,
      react: `'use client';

import { useCallback, useState } from 'react';

const CONFETTI_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export function ConfettiBurst({ label = 'Celebrate', particleCount = 24, className = '' }) {
  const [particles, setParticles] = useState([]);

  const fire = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const batch = Array.from({ length: particleCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 80;
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 30,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#6366f1',
        rotate: Math.random() * 720 - 360,
      };
    });
    setParticles(batch);
    window.setTimeout(() => setParticles([]), 1000);
  }, [particleCount]);

  return (
    <>
      <style>{\`
        @keyframes adysre-confetti {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
        }
      \`}</style>
      <div className={\`relative inline-flex \${className}\`}>
        <div className="pointer-events-none absolute left-1/2 top-0 h-0 w-0" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute h-2 w-2 rounded-sm"
              style={{ backgroundColor: p.color, '--dx': \`\${p.dx}px\`, '--dy': \`\${p.dy}px\`, '--rot': \`\${p.rotate}deg\`, animation: 'adysre-confetti 900ms ease-out forwards' }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={fire}
          className="relative rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {label}
        </button>
      </div>
    </>
  );
}`,
      typescript: `'use client';

import { useCallback, useState } from 'react';
import type { CSSProperties } from 'react';

interface Particle {
  id: number;
  dx: number;
  dy: number;
  color: string;
  rotate: number;
}

const CONFETTI_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export interface ConfettiBurstProps {
  label?: string;
  particleCount?: number;
  className?: string;
}

export function ConfettiBurst({
  label = 'Celebrate',
  particleCount = 24,
  className = '',
}: ConfettiBurstProps): JSX.Element {
  const [particles, setParticles] = useState<Particle[]>([]);

  const fire = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const batch: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 80;
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 30,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#6366f1',
        rotate: Math.random() * 720 - 360,
      };
    });
    setParticles(batch);
    window.setTimeout(() => setParticles([]), 1000);
  }, [particleCount]);

  return (
    <>
      <style>{\`
        @keyframes adysre-confetti {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
        }
      \`}</style>
      <div className={\`relative inline-flex \${className}\`}>
        <div className="pointer-events-none absolute left-1/2 top-0 h-0 w-0" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute h-2 w-2 rounded-sm"
              style={{ backgroundColor: p.color, '--dx': \`\${p.dx}px\`, '--dy': \`\${p.dy}px\`, '--rot': \`\${p.rotate}deg\`, animation: 'adysre-confetti 900ms ease-out forwards' } as CSSProperties}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={fire}
          className="relative rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {label}
        </button>
      </div>
    </>
  );
}`,
    },
  },
  {
    slug: 'gradient-border-rotate',
    category: 'animation',
    tags: ['gradient', 'border', 'conic', 'rotate', 'card'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'borderWidth', type: 'number', default: '2', descriptionKey: 'borderWidth' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes border-spin { to { transform: translate(-50%, -50%) rotate(1turn); } }
  .border-spin { animation: border-spin 4s linear infinite; }
  @media (prefers-reduced-motion: reduce) { .border-spin { animation: none; } }
</style>

<div class="relative max-w-xs overflow-hidden rounded-2xl p-0.5">
  <span class="border-spin absolute left-1/2 top-1/2 z-0 aspect-square w-[220%]" style="background: conic-gradient(from 0deg, #6366f1, #ec4899, #f59e0b, #6366f1); transform: translate(-50%, -50%);" aria-hidden="true"></span>
  <div class="relative z-10 rounded-[14px] bg-white px-5 py-4 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Premium tier</h3>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Unlock every module and priority support.</p>
  </div>
</div>`,
      react: `export function GradientBorderRotate({ children, borderWidth = 2, className = '' }) {
  return (
    <>
      <style>{\`
        @keyframes adysre-border-spin { to { transform: translate(-50%, -50%) rotate(1turn); } }
        @media (prefers-reduced-motion: reduce) { .adysre-border-spin { animation: none !important; } }
      \`}</style>
      <div className={\`relative overflow-hidden rounded-2xl \${className}\`} style={{ padding: borderWidth }}>
        <span
          className="adysre-border-spin absolute left-1/2 top-1/2 z-0 aspect-square w-[220%]"
          aria-hidden="true"
          style={{
            background: 'conic-gradient(from 0deg, #6366f1, #ec4899, #f59e0b, #6366f1)',
            animation: 'adysre-border-spin 4s linear infinite',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div className="relative z-10 rounded-[14px] bg-white px-5 py-4 dark:bg-gray-900">{children}</div>
      </div>
    </>
  );
}`,
      typescript: `import type { CSSProperties, ReactNode } from 'react';

export interface GradientBorderRotateProps {
  children: ReactNode;
  borderWidth?: number;
  className?: string;
}

export function GradientBorderRotate({
  children,
  borderWidth = 2,
  className = '',
}: GradientBorderRotateProps): JSX.Element {
  return (
    <>
      <style>{\`
        @keyframes adysre-border-spin { to { transform: translate(-50%, -50%) rotate(1turn); } }
        @media (prefers-reduced-motion: reduce) { .adysre-border-spin { animation: none !important; } }
      \`}</style>
      <div className={\`relative overflow-hidden rounded-2xl \${className}\`} style={{ padding: borderWidth } as CSSProperties}>
        <span
          className="adysre-border-spin absolute left-1/2 top-1/2 z-0 aspect-square w-[220%]"
          aria-hidden="true"
          style={{
            background: 'conic-gradient(from 0deg, #6366f1, #ec4899, #f59e0b, #6366f1)',
            animation: 'adysre-border-spin 4s linear infinite',
            transform: 'translate(-50%, -50%)',
          } as CSSProperties}
        />
        <div className="relative z-10 rounded-[14px] bg-white px-5 py-4 dark:bg-gray-900">{children}</div>
      </div>
    </>
  );
}`,
    },
  },
  {
    slug: 'scroll-reveal-slide',
    category: 'animation',
    tags: ['scroll', 'reveal', 'slide', 'intersection-observer', 'viewport'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'left', labelKey: 'left' },
      { id: 'right', labelKey: 'right' },
      { id: 'up', labelKey: 'up' },
      { id: 'down', labelKey: 'down' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'from', type: "'left' | 'right' | 'up' | 'down'", default: "'left'", descriptionKey: 'from' },
      { name: 'distance', type: 'number', default: '40', descriptionKey: 'distance' },
      { name: 'once', type: 'boolean', default: 'true', descriptionKey: 'once' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The observer watches only this element, not the window. -->
<div class="reveal-slide max-w-sm translate-x-[-40px] opacity-0 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none" data-reveal-slide>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Slides into view</h3>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Reveal panels as they enter the viewport, from any direction.</p>
  </div>
</div>

<noscript><style>[data-reveal-slide]{opacity:1 !important;transform:none !important;}</style></noscript>

<script>
  (function () {
    var el = document.querySelector('[data-reveal-slide]');
    if (!el) return;
    function show() { el.style.opacity = '1'; el.style.transform = 'translate(0,0)'; }
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { show(); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(); obs.disconnect(); } });
    }, { threshold: 0.2 });
    obs.observe(el);
  })();
</script>`,
      react: `'use client';

import { useEffect, useRef, useState } from 'react';

export function ScrollRevealSlide({ children, from = 'left', distance = 40, once = true, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const offsetX = from === 'left' ? -distance : from === 'right' ? distance : 0;
  const offsetY = from === 'up' ? -distance : from === 'down' ? distance : 0;
  const style = visible
    ? { transform: 'translate(0, 0)', opacity: 1 }
    : { transform: \`translate(\${offsetX}px, \${offsetY}px)\`, opacity: 0 };

  return (
    <div ref={ref} className={\`transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none \${className}\`} style={style}>
      {children}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type SlideFrom = 'left' | 'right' | 'up' | 'down';

export interface ScrollRevealSlideProps {
  children: ReactNode;
  from?: SlideFrom;
  distance?: number;
  once?: boolean;
  className?: string;
}

export function ScrollRevealSlide({
  children,
  from = 'left',
  distance = 40,
  once = true,
  className = '',
}: ScrollRevealSlideProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const offsetX = from === 'left' ? -distance : from === 'right' ? distance : 0;
  const offsetY = from === 'up' ? -distance : from === 'down' ? distance : 0;
  const style: CSSProperties = visible
    ? { transform: 'translate(0, 0)', opacity: 1 }
    : { transform: \`translate(\${offsetX}px, \${offsetY}px)\`, opacity: 0 };

  return (
    <div ref={ref} className={\`transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none \${className}\`} style={style}>
      {children}
    </div>
  );
}`,
    },
  },
  {
    slug: 'hover-underline-grow',
    category: 'animation',
    tags: ['hover', 'underline', 'link', 'nav', 'transition'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'href', type: 'string', default: "'#'", descriptionKey: 'href' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  .underline-grow { position: relative; display: inline-block; }
  .underline-grow::after {
    content: '';
    position: absolute;
    left: 0; bottom: -2px;
    height: 2px; width: 100%;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .underline-grow:hover::after, .underline-grow:focus-visible::after { transform: scaleX(1); }
  @media (prefers-reduced-motion: reduce) { .underline-grow::after { transition: none; } }
</style>

<a href="#" class="underline-grow font-semibold text-gray-900 focus-visible:outline-none dark:text-gray-100">Product</a>`,
      react: `export function HoverUnderlineGrow({ children, href = '#', className = '' }) {
  return (
    <>
      <style>{\`
        .adysre-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          height: 2px;
          width: 100%;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .adysre-underline:hover::after, .adysre-underline:focus-visible::after { transform: scaleX(1); }
        @media (prefers-reduced-motion: reduce) { .adysre-underline::after { transition: none; } }
      \`}</style>
      <a
        href={href}
        className={\`adysre-underline relative inline-block font-semibold text-gray-900 focus-visible:outline-none dark:text-gray-100 \${className}\`}
      >
        {children}
      </a>
    </>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HoverUnderlineGrowProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export function HoverUnderlineGrow({
  children,
  href = '#',
  className = '',
}: HoverUnderlineGrowProps): JSX.Element {
  return (
    <>
      <style>{\`
        .adysre-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          height: 2px;
          width: 100%;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .adysre-underline:hover::after, .adysre-underline:focus-visible::after { transform: scaleX(1); }
        @media (prefers-reduced-motion: reduce) { .adysre-underline::after { transition: none; } }
      \`}</style>
      <a
        href={href}
        className={\`adysre-underline relative inline-block font-semibold text-gray-900 focus-visible:outline-none dark:text-gray-100 \${className}\`}
      >
        {children}
      </a>
    </>
  );
}`,
    },
  },
  {
    slug: 'card-tilt-3d',
    category: 'animation',
    tags: ['tilt', '3d', 'card', 'pointer', 'interactive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'maxTiltDeg', type: 'number', default: '12', descriptionKey: 'maxTiltDeg' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Tilt is scoped to the card and gated on (pointer: fine); touch stays flat. -->
<div class="tilt-card rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-4 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600"></div>
  <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Tilt me</h3>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Move your cursor across the card to see it respond in 3D.</p>
</div>

<script>
  (function () {
    var node = document.querySelector('.tilt-card');
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    node.addEventListener('pointermove', function (e) {
      var rect = node.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = 'perspective(800px) rotateY(' + px * 24 + 'deg) rotateX(' + -py * 24 + 'deg)';
    });
    node.addEventListener('pointerleave', function () {
      node.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  })();
</script>`,
      react: `'use client';

import { useEffect, useRef } from 'react';

export function CardTilt3D({ children, maxTiltDeg = 12, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = \`perspective(800px) rotateY(\${px * maxTiltDeg * 2}deg) rotateX(\${-py * maxTiltDeg * 2}deg)\`;
    };
    const reset = () => {
      node.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', reset);
    };
  }, [maxTiltDeg]);

  return (
    <div
      ref={ref}
      className={\`rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {children}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export interface CardTilt3DProps {
  children: ReactNode;
  maxTiltDeg?: number;
  className?: string;
}

export function CardTilt3D({ children, maxTiltDeg = 12, className = '' }: CardTilt3DProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = \`perspective(800px) rotateY(\${px * maxTiltDeg * 2}deg) rotateX(\${-py * maxTiltDeg * 2}deg)\`;
    };
    const reset = () => {
      node.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', reset);
    };
  }, [maxTiltDeg]);

  return (
    <div
      ref={ref}
      className={\`rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {children}
    </div>
  );
}`,
    },
  },
  {
    slug: 'animated-hamburger',
    category: 'animation',
    tags: ['hamburger', 'menu', 'toggle', 'icon', 'navbar'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'label', type: 'string', default: "'Toggle menu'", descriptionKey: 'label' },
      { name: 'onToggle', type: '(open: boolean) => void', descriptionKey: 'onToggle' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Bars morph into an X; state flips under reduced motion, only the transition drops. -->
<button type="button" class="hamburger inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900" aria-expanded="false" aria-label="Toggle menu">
  <span class="bar-1 h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100"></span>
  <span class="bar-2 h-0.5 w-6 rounded-full bg-gray-900 transition-opacity duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100"></span>
  <span class="bar-3 h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100"></span>
</button>

<script>
  (function () {
    var btn = document.querySelector('.hamburger');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.querySelector('.bar-1').style.transform = !open ? 'translateY(8px) rotate(45deg)' : '';
      btn.querySelector('.bar-2').style.opacity = !open ? '0' : '1';
      btn.querySelector('.bar-3').style.transform = !open ? 'translateY(-8px) rotate(-45deg)' : '';
    });
  })();
</script>`,
      react: `'use client';

import { useState } from 'react';

export function AnimatedHamburger({ label = 'Toggle menu', className = '', onToggle }) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-label={label}
      className={\`inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
    >
      <span className={\`h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 \${open ? 'translate-y-2 rotate-45' : ''}\`} />
      <span className={\`h-0.5 w-6 rounded-full bg-gray-900 transition-opacity duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 \${open ? 'opacity-0' : 'opacity-100'}\`} />
      <span className={\`h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 \${open ? '-translate-y-2 -rotate-45' : ''}\`} />
    </button>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface AnimatedHamburgerProps {
  label?: string;
  className?: string;
  onToggle?: (open: boolean) => void;
}

export function AnimatedHamburger({
  label = 'Toggle menu',
  className = '',
  onToggle,
}: AnimatedHamburgerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-label={label}
      className={\`inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
    >
      <span className={\`h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 \${open ? 'translate-y-2 rotate-45' : ''}\`} />
      <span className={\`h-0.5 w-6 rounded-full bg-gray-900 transition-opacity duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 \${open ? 'opacity-0' : 'opacity-100'}\`} />
      <span className={\`h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-100 \${open ? '-translate-y-2 -rotate-45' : ''}\`} />
    </button>
  );
}`,
    },
  },
  {
    slug: 'glitch-text',
    category: 'animation',
    tags: ['glitch', 'text', 'clip-path', 'distortion', 'cyberpunk'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'text', type: 'string', required: true, descriptionKey: 'text' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes glitch-1 {
    0%, 100% { clip-path: inset(0 0 85% 0); transform: translate(0, 0); }
    20% { clip-path: inset(20% 0 40% 0); transform: translate(-2px, -1px); }
    40% { clip-path: inset(60% 0 10% 0); transform: translate(2px, 1px); }
    60% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 1px); }
    80% { clip-path: inset(40% 0 30% 0); transform: translate(1px, -1px); }
  }
  @keyframes glitch-2 {
    0%, 100% { clip-path: inset(80% 0 5% 0); transform: translate(0, 0); }
    25% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 1px); }
    50% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, -1px); }
    75% { clip-path: inset(30% 0 45% 0); transform: translate(1px, 1px); }
  }
  .glitch-a { animation: glitch-1 2.4s infinite linear alternate; }
  .glitch-b { animation: glitch-2 2.8s infinite linear alternate; }
  @media (prefers-reduced-motion: reduce) { .glitch-a, .glitch-b { animation: none; opacity: 0; } }
</style>

<span class="relative inline-block text-3xl font-bold text-gray-900 dark:text-gray-100">
  <span class="relative z-10">SYSTEM ERROR</span>
  <span class="glitch-a absolute left-0 top-0 z-0 text-cyan-400" aria-hidden="true">SYSTEM ERROR</span>
  <span class="glitch-b absolute left-0 top-0 z-0 text-fuchsia-500" aria-hidden="true">SYSTEM ERROR</span>
</span>`,
      react: `export function GlitchText({ text, className = '' }) {
  return (
    <>
      <style>{\`
        @keyframes adysre-glitch-1 {
          0%, 100% { clip-path: inset(0 0 85% 0); transform: translate(0, 0); }
          20% { clip-path: inset(20% 0 40% 0); transform: translate(-2px, -1px); }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(2px, 1px); }
          60% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 1px); }
          80% { clip-path: inset(40% 0 30% 0); transform: translate(1px, -1px); }
        }
        @keyframes adysre-glitch-2 {
          0%, 100% { clip-path: inset(80% 0 5% 0); transform: translate(0, 0); }
          25% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 1px); }
          50% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, -1px); }
          75% { clip-path: inset(30% 0 45% 0); transform: translate(1px, 1px); }
        }
        .adysre-glitch-a { animation: adysre-glitch-1 2.4s infinite linear alternate; }
        .adysre-glitch-b { animation: adysre-glitch-2 2.8s infinite linear alternate; }
        @media (prefers-reduced-motion: reduce) {
          .adysre-glitch-a, .adysre-glitch-b { animation: none !important; opacity: 0 !important; }
        }
      \`}</style>
      <span className={\`relative inline-block font-bold \${className}\`}>
        <span className="relative z-10">{text}</span>
        <span className="adysre-glitch-a absolute left-0 top-0 z-0 text-cyan-400" aria-hidden="true">{text}</span>
        <span className="adysre-glitch-b absolute left-0 top-0 z-0 text-fuchsia-500" aria-hidden="true">{text}</span>
      </span>
    </>
  );
}`,
      typescript: `export interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps): JSX.Element {
  return (
    <>
      <style>{\`
        @keyframes adysre-glitch-1 {
          0%, 100% { clip-path: inset(0 0 85% 0); transform: translate(0, 0); }
          20% { clip-path: inset(20% 0 40% 0); transform: translate(-2px, -1px); }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(2px, 1px); }
          60% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 1px); }
          80% { clip-path: inset(40% 0 30% 0); transform: translate(1px, -1px); }
        }
        @keyframes adysre-glitch-2 {
          0%, 100% { clip-path: inset(80% 0 5% 0); transform: translate(0, 0); }
          25% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 1px); }
          50% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, -1px); }
          75% { clip-path: inset(30% 0 45% 0); transform: translate(1px, 1px); }
        }
        .adysre-glitch-a { animation: adysre-glitch-1 2.4s infinite linear alternate; }
        .adysre-glitch-b { animation: adysre-glitch-2 2.8s infinite linear alternate; }
        @media (prefers-reduced-motion: reduce) {
          .adysre-glitch-a, .adysre-glitch-b { animation: none !important; opacity: 0 !important; }
        }
      \`}</style>
      <span className={\`relative inline-block font-bold \${className}\`}>
        <span className="relative z-10">{text}</span>
        <span className="adysre-glitch-a absolute left-0 top-0 z-0 text-cyan-400" aria-hidden="true">{text}</span>
        <span className="adysre-glitch-b absolute left-0 top-0 z-0 text-fuchsia-500" aria-hidden="true">{text}</span>
      </span>
    </>
  );
}`,
    },
  },
];
