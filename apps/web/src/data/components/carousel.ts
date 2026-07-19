import type { ComponentEntry } from './types';

/**
 * Carousel category.
 *
 * The a11y contract every entry here keeps, per the APG carousel pattern:
 * - the root is a labelled `role="region"` with `aria-roledescription="carousel"`
 * - each slide is a `role="group"` / `aria-roledescription="slide"` with an
 *   "N of M" label, so a screen reader user always knows where they are
 * - prev/next are real `<button>`s with real labels, never clickable divs
 * - the slide container is `aria-live="polite"` so a manual change is announced
 *   - EXCEPT while autoplay is running, where it drops to "off": a carousel that
 *   announces itself every five seconds is unusable, which is why the autoplay
 *   entry flips the value with the play state rather than hard-coding it.
 * - `prefers-reduced-motion` stops autoplay entirely and makes moves instant.
 */
export const carouselComponents: ComponentEntry[] = [
  {
    slug: 'carousel-basic',
    category: 'carousel',
    tags: ['carousel', 'slider', 'arrows', 'dots', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-26',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 2380, copies: 541, downloads: 162 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      {
        name: 'items',
        type: 'Slide[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'analytics', title: 'Analytics', copy: '…' }]",
      },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A carousel is a region, not a div with arrows:
  - role="region" + aria-roledescription="carousel" + aria-label names the whole
    thing, so it appears in the landmark list and announces as a carousel
  - the viewport is aria-live="polite": moving a slide announces the new one
    without stealing focus. (Autoplay must NOT do this - see carousel-autoplay.)
  - each slide is role="group" aria-roledescription="slide" aria-label="N of M"
  - inactive slides are aria-hidden so their text is not read while off-screen
  The track is one flex row translated by whole viewport widths; the script only
  ever sets a transform and some attributes.
-->
<section class="carousel" aria-roledescription="carousel" aria-label="Product highlights" data-carousel>
  <div class="carousel__viewport" aria-live="polite">
    <div class="carousel__track" data-carousel-track>
      <div class="carousel__slide carousel__slide--a" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <h3 class="carousel__title">Analytics</h3>
        <p class="carousel__copy">Every metric that matters, updated the moment it changes.</p>
      </div>
      <div class="carousel__slide carousel__slide--b" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
        <h3 class="carousel__title">Automations</h3>
        <p class="carousel__copy">Turn a repeated click into a rule that runs itself.</p>
      </div>
      <div class="carousel__slide carousel__slide--c" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
        <h3 class="carousel__title">Integrations</h3>
        <p class="carousel__copy">Forty connectors, and a webhook for everything else.</p>
      </div>
    </div>

    <button class="carousel__arrow carousel__arrow--prev" type="button" aria-label="Previous slide" data-carousel-prev>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button class="carousel__arrow carousel__arrow--next" type="button" aria-label="Next slide" data-carousel-next>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>

  <div class="carousel__dots" data-carousel-dots>
    <button class="carousel__dot" type="button" aria-label="Go to slide 1" aria-current="true"></button>
    <button class="carousel__dot" type="button" aria-label="Go to slide 2"></button>
    <button class="carousel__dot" type="button" aria-label="Go to slide 3"></button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-carousel]').forEach(function (root) {
      var track = root.querySelector('[data-carousel-track]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-carousel-dots] button'));
      var index = 0;

      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(' + index * -100 + '%)';

        slides.forEach(function (slide, i) {
          // Off-screen slides are still in the DOM: hide them from AT.
          if (i === index) slide.removeAttribute('aria-hidden');
          else slide.setAttribute('aria-hidden', 'true');
        });

        dots.forEach(function (dot, i) {
          if (i === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      root.querySelector('[data-carousel-prev]').addEventListener('click', function () {
        go(index - 1);
      });
      root.querySelector('[data-carousel-next]').addEventListener('click', function () {
        go(index + 1);
      });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          go(i);
        });
      });
    });
  })();
</script>`,
      css: `.carousel {
  max-width: 42rem;
}

.carousel__viewport {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
}

.carousel__track {
  display: flex;
  transition: transform 400ms ease;
}

.carousel__slide {
  flex: 0 0 100%;
  padding: 3rem 2rem;
  color: #ffffff;
}

/* White text on these gradients clears 5:1 at every stop, in both themes. */
.carousel__slide--a {
  background-image: linear-gradient(135deg, #2563eb, #4f46e5);
}

.carousel__slide--b {
  background-image: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.carousel__slide--c {
  background-image: linear-gradient(135deg, #0f766e, #0369a1);
}

.carousel__title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.carousel__copy {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  opacity: 0.9;
}

.carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
}

.carousel__arrow svg {
  width: 1.125rem;
  height: 1.125rem;
}

.carousel__arrow:hover {
  background-color: #f9fafb;
  color: #111827;
}

.carousel__arrow:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.carousel__arrow--prev {
  left: 0.75rem;
}

.carousel__arrow--next {
  right: 0.75rem;
}

.carousel__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
}

/* gray-500 rather than a pale grey: a dot is a UI component, so it needs 3:1
   against the page, and #6b7280 clears that on white and on near-black alike. */
.carousel__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background-color: #6b7280;
  cursor: pointer;
}

.carousel__dot:hover {
  background-color: #4b5563;
}

.carousel__dot:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.carousel__dot[aria-current='true'] {
  width: 1.25rem;
  background-color: #2563eb;
}

@media (prefers-reduced-motion: reduce) {
  .carousel__track {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .carousel__arrow {
    border-color: #374151;
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .carousel__arrow:hover {
    background-color: #374151;
    color: #ffffff;
  }

  .carousel__arrow:focus-visible {
    outline-color: #60a5fa;
  }

  .carousel__dot:hover {
    background-color: #9ca3af;
  }

  .carousel__dot:focus-visible {
    outline-color: #60a5fa;
  }

  .carousel__dot[aria-current='true'] {
    background-color: #60a5fa;
  }
}`,
      tailwind: `<!--
  Same markup, same script; the transform is still set from JS because a
  utility class cannot know the index. motion-reduce:transition-none makes the
  move instant for anyone who asked for less motion.
-->
<section class="max-w-2xl" aria-roledescription="carousel" aria-label="Product highlights" data-carousel>
  <div class="relative overflow-hidden rounded-xl" aria-live="polite">
    <div class="flex transition-transform duration-400 ease-out motion-reduce:transition-none" data-carousel-track>
      <div class="shrink-0 basis-full bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <h3 class="mb-2 text-xl font-semibold">Analytics</h3>
        <p class="text-sm leading-relaxed text-white/90">Every metric that matters, updated the moment it changes.</p>
      </div>
      <div class="shrink-0 basis-full bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
        <h3 class="mb-2 text-xl font-semibold">Automations</h3>
        <p class="text-sm leading-relaxed text-white/90">Turn a repeated click into a rule that runs itself.</p>
      </div>
      <div class="shrink-0 basis-full bg-gradient-to-br from-teal-700 to-sky-700 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
        <h3 class="mb-2 text-xl font-semibold">Integrations</h3>
        <p class="text-sm leading-relaxed text-white/90">Forty connectors, and a webhook for everything else.</p>
      </div>
    </div>

    <button
      class="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      type="button" aria-label="Previous slide" data-carousel-prev
    >
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button
      class="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      type="button" aria-label="Next slide" data-carousel-next
    >
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>

  <div class="flex justify-center gap-2 pt-3" data-carousel-dots>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 1" aria-current="true"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 2"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 3"></button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-carousel]').forEach(function (root) {
      var track = root.querySelector('[data-carousel-track]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-carousel-dots] button'));
      var index = 0;

      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(' + index * -100 + '%)';

        slides.forEach(function (slide, i) {
          if (i === index) slide.removeAttribute('aria-hidden');
          else slide.setAttribute('aria-hidden', 'true');
        });

        dots.forEach(function (dot, i) {
          if (i === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      root.querySelector('[data-carousel-prev]').addEventListener('click', function () {
        go(index - 1);
      });
      root.querySelector('[data-carousel-next]').addEventListener('click', function () {
        go(index + 1);
      });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          go(i);
        });
      });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselBasic({ items, onSelect, className = '', ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0);

  function go(next) {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    if (onSelect) onSelect(wrapped);
  }

  return (
    <section className={\`max-w-2xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      {/* polite, not assertive: announce the new slide, never interrupt. */}
      <div className="relative overflow-hidden rounded-xl" aria-live="polite">
        <div
          className="flex transition-transform duration-400 ease-out motion-reduce:transition-none"
          style={{ transform: \`translateX(-\${index * 100}%)\` }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className={\`shrink-0 basis-full px-8 py-12 text-white \${item.background}\`}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={i !== index}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Go to slide \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'w-5 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }\`}
          />
        ))}
      </div>
    </section>
  );
}`,
      nextjs: `'use client';

import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the slide's background. */
  background: string;
}

interface CarouselBasicProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselBasic({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselBasicProps) {
  const [index, setIndex] = useState(0);

  function go(next: number): void {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    onSelect?.(wrapped);
  }

  return (
    <section className={\`max-w-2xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative overflow-hidden rounded-xl" aria-live="polite">
        <div
          className="flex transition-transform duration-400 ease-out motion-reduce:transition-none"
          style={{ transform: \`translateX(-\${index * 100}%)\` }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className={\`shrink-0 basis-full px-8 py-12 text-white \${item.background}\`}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={i !== index}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Go to slide \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'w-5 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }\`}
          />
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the slide's background. */
  background: string;
}

export interface CarouselBasicProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselBasic({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselBasicProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);

  const go = (next: number): void => {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    onSelect?.(wrapped);
  };

  return (
    <section className={\`max-w-2xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative overflow-hidden rounded-xl" aria-live="polite">
        <div
          className="flex transition-transform duration-400 ease-out motion-reduce:transition-none"
          style={{ transform: \`translateX(-\${index * 100}%)\` }}
        >
          {items.map((item: Slide, i: number) => (
            <div
              key={item.id}
              className={\`shrink-0 basis-full px-8 py-12 text-white \${item.background}\`}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={i !== index}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {items.map((item: Slide, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Go to slide \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'w-5 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }\`}
          />
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-autoplay',
    category: 'carousel',
    tags: ['carousel', 'autoplay', 'timer', 'reduced-motion', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-19',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1640, copies: 372, downloads: 108 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'idle', labelKey: 'idle' },
    ],
    props: [
      {
        name: 'items',
        type: 'Slide[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'analytics', title: 'Analytics', copy: '…' }]",
      },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Autoplay is the version that gets accessibility wrong most often. Four rules,
  all implemented below:
  1. WCAG 2.2.2: anything that moves for more than 5s needs a pause control.
     There is a real play/pause button, and its label flips with the state.
  2. It pauses on hover AND on focus-within - a keyboard user tabbing to the next
     arrow must not have the slide move out from under them.
  3. prefers-reduced-motion: reduce => it never starts, and the transition is
     removed. Not "slower": off.
  4. aria-live is "off" while playing (an announcement every 5s is noise) and
     flips to "polite" the moment it pauses, so manual moves are still announced.
-->
<section class="ap-carousel" aria-roledescription="carousel" aria-label="Product highlights" data-ap-carousel>
  <div class="ap-carousel__viewport" aria-live="off" data-ap-live>
    <div class="ap-carousel__track" data-ap-track>
      <div class="ap-carousel__slide ap-carousel__slide--a" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <h3 class="ap-carousel__title">Analytics</h3>
        <p class="ap-carousel__copy">Every metric that matters, updated the moment it changes.</p>
      </div>
      <div class="ap-carousel__slide ap-carousel__slide--b" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
        <h3 class="ap-carousel__title">Automations</h3>
        <p class="ap-carousel__copy">Turn a repeated click into a rule that runs itself.</p>
      </div>
      <div class="ap-carousel__slide ap-carousel__slide--c" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
        <h3 class="ap-carousel__title">Integrations</h3>
        <p class="ap-carousel__copy">Forty connectors, and a webhook for everything else.</p>
      </div>
    </div>
  </div>

  <div class="ap-carousel__bar">
    <button class="ap-carousel__toggle" type="button" aria-label="Pause automatic slide show" data-ap-toggle>
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-ap-icon-pause>
        <path d="M6.5 4h2.5v12H6.5zM11 4h2.5v12H11z" />
      </svg>
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-ap-icon-play hidden>
        <path d="M6.5 4l9 6-9 6z" />
      </svg>
    </button>

    <div class="ap-carousel__dots" data-ap-dots>
      <button class="ap-carousel__dot" type="button" aria-label="Go to slide 1" aria-current="true"></button>
      <button class="ap-carousel__dot" type="button" aria-label="Go to slide 2"></button>
      <button class="ap-carousel__dot" type="button" aria-label="Go to slide 3"></button>
    </div>

    <div class="ap-carousel__arrows">
      <button class="ap-carousel__arrow" type="button" aria-label="Previous slide" data-ap-prev>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="ap-carousel__arrow" type="button" aria-label="Next slide" data-ap-next>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</section>

<script>
  (function () {
    var INTERVAL = 5000;

    document.querySelectorAll('[data-ap-carousel]').forEach(function (root) {
      var track = root.querySelector('[data-ap-track]');
      var live = root.querySelector('[data-ap-live]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-ap-dots] button'));
      var toggle = root.querySelector('[data-ap-toggle]');
      var iconPause = root.querySelector('[data-ap-icon-pause]');
      var iconPlay = root.querySelector('[data-ap-icon-play]');

      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var index = 0;
      var playing = !reduced; // never auto-start under reduced motion
      var hovered = false;
      var focused = false;
      var timer = null;

      function render() {
        track.style.transform = 'translateX(' + index * -100 + '%)';
        slides.forEach(function (slide, i) {
          if (i === index) slide.removeAttribute('aria-hidden');
          else slide.setAttribute('aria-hidden', 'true');
        });
        dots.forEach(function (dot, i) {
          if (i === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      function running() {
        return playing && !hovered && !focused && !reduced;
      }

      function sync() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        if (running()) {
          timer = setInterval(function () {
            index = (index + 1) % slides.length;
            render();
          }, INTERVAL);
        }
        // Silent while it moves on its own; announces once it stops.
        live.setAttribute('aria-live', running() ? 'off' : 'polite');
        iconPause.hidden = !playing;
        iconPlay.hidden = playing;
        toggle.setAttribute(
          'aria-label',
          playing ? 'Pause automatic slide show' : 'Start automatic slide show'
        );
      }

      function go(next) {
        index = (next + slides.length) % slides.length;
        render();
      }

      if (reduced) track.style.transition = 'none';

      root.addEventListener('mouseenter', function () {
        hovered = true;
        sync();
      });
      root.addEventListener('mouseleave', function () {
        hovered = false;
        sync();
      });
      root.addEventListener('focusin', function () {
        focused = true;
        sync();
      });
      root.addEventListener('focusout', function () {
        focused = false;
        sync();
      });

      toggle.addEventListener('click', function () {
        playing = !playing;
        sync();
      });
      root.querySelector('[data-ap-prev]').addEventListener('click', function () {
        go(index - 1);
      });
      root.querySelector('[data-ap-next]').addEventListener('click', function () {
        go(index + 1);
      });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          go(i);
        });
      });

      render();
      sync();
    });
  })();
</script>`,
      css: `.ap-carousel {
  max-width: 42rem;
}

.ap-carousel__viewport {
  overflow: hidden;
  border-radius: 0.75rem;
}

.ap-carousel__track {
  display: flex;
  transition: transform 500ms ease;
}

.ap-carousel__slide {
  flex: 0 0 100%;
  padding: 3rem 2rem;
  color: #ffffff;
}

.ap-carousel__slide--a {
  background-image: linear-gradient(135deg, #2563eb, #4f46e5);
}

.ap-carousel__slide--b {
  background-image: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.ap-carousel__slide--c {
  background-image: linear-gradient(135deg, #0f766e, #0369a1);
}

.ap-carousel__title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.ap-carousel__copy {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  opacity: 0.9;
}

.ap-carousel__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.75rem;
}

.ap-carousel__toggle,
.ap-carousel__arrow {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
}

.ap-carousel__toggle svg,
.ap-carousel__arrow svg {
  width: 1rem;
  height: 1rem;
}

.ap-carousel__toggle:hover,
.ap-carousel__arrow:hover {
  background-color: #f9fafb;
  color: #111827;
}

.ap-carousel__toggle:focus-visible,
.ap-carousel__arrow:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.ap-carousel__dots {
  display: flex;
  flex: 1;
  justify-content: center;
  gap: 0.5rem;
}

.ap-carousel__arrows {
  display: flex;
  gap: 0.375rem;
}

.ap-carousel__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background-color: #6b7280;
  cursor: pointer;
}

.ap-carousel__dot:hover {
  background-color: #4b5563;
}

.ap-carousel__dot:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.ap-carousel__dot[aria-current='true'] {
  width: 1.25rem;
  background-color: #2563eb;
}

/*
 * Reduced motion: the script already refuses to auto-start, and this removes the
 * slide transition so a manual move is a cut, not a glide. Both halves matter -
 * CSS alone would still leave a carousel that changes on its own.
 */
@media (prefers-reduced-motion: reduce) {
  .ap-carousel__track {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .ap-carousel__toggle,
  .ap-carousel__arrow {
    border-color: #374151;
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .ap-carousel__toggle:hover,
  .ap-carousel__arrow:hover {
    background-color: #374151;
    color: #ffffff;
  }

  .ap-carousel__toggle:focus-visible,
  .ap-carousel__arrow:focus-visible {
    outline-color: #60a5fa;
  }

  .ap-carousel__dot:hover {
    background-color: #9ca3af;
  }

  .ap-carousel__dot:focus-visible {
    outline-color: #60a5fa;
  }

  .ap-carousel__dot[aria-current='true'] {
    background-color: #60a5fa;
  }
}`,
      tailwind: `<!--
  Utilities carry the paint; the script carries the four autoplay rules (pause
  control, pause on hover/focus, reduced-motion off, aria-live flipping).
-->
<section class="max-w-2xl" aria-roledescription="carousel" aria-label="Product highlights" data-ap-carousel>
  <div class="overflow-hidden rounded-xl" aria-live="off" data-ap-live>
    <div class="flex transition-transform duration-500 ease-out motion-reduce:transition-none" data-ap-track>
      <div class="shrink-0 basis-full bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <h3 class="mb-2 text-xl font-semibold">Analytics</h3>
        <p class="text-sm leading-relaxed text-white/90">Every metric that matters, updated the moment it changes.</p>
      </div>
      <div class="shrink-0 basis-full bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
        <h3 class="mb-2 text-xl font-semibold">Automations</h3>
        <p class="text-sm leading-relaxed text-white/90">Turn a repeated click into a rule that runs itself.</p>
      </div>
      <div class="shrink-0 basis-full bg-gradient-to-br from-teal-700 to-sky-700 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
        <h3 class="mb-2 text-xl font-semibold">Integrations</h3>
        <p class="text-sm leading-relaxed text-white/90">Forty connectors, and a webhook for everything else.</p>
      </div>
    </div>
  </div>

  <div class="flex items-center gap-3 pt-3">
    <button
      class="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      type="button" aria-label="Pause automatic slide show" data-ap-toggle
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-ap-icon-pause>
        <path d="M6.5 4h2.5v12H6.5zM11 4h2.5v12H11z" />
      </svg>
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-ap-icon-play hidden>
        <path d="M6.5 4l9 6-9 6z" />
      </svg>
    </button>

    <div class="flex flex-1 justify-center gap-2" data-ap-dots>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 1" aria-current="true"></button>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 2"></button>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 3"></button>
    </div>

    <div class="flex gap-1.5">
      <button
        class="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-label="Previous slide" data-ap-prev
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        class="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-label="Next slide" data-ap-next
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</section>

<script>
  (function () {
    var INTERVAL = 5000;

    document.querySelectorAll('[data-ap-carousel]').forEach(function (root) {
      var track = root.querySelector('[data-ap-track]');
      var live = root.querySelector('[data-ap-live]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-ap-dots] button'));
      var toggle = root.querySelector('[data-ap-toggle]');
      var iconPause = root.querySelector('[data-ap-icon-pause]');
      var iconPlay = root.querySelector('[data-ap-icon-play]');

      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var index = 0;
      var playing = !reduced;
      var hovered = false;
      var focused = false;
      var timer = null;

      function render() {
        track.style.transform = 'translateX(' + index * -100 + '%)';
        slides.forEach(function (slide, i) {
          if (i === index) slide.removeAttribute('aria-hidden');
          else slide.setAttribute('aria-hidden', 'true');
        });
        dots.forEach(function (dot, i) {
          if (i === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      function running() {
        return playing && !hovered && !focused && !reduced;
      }

      function sync() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        if (running()) {
          timer = setInterval(function () {
            index = (index + 1) % slides.length;
            render();
          }, INTERVAL);
        }
        live.setAttribute('aria-live', running() ? 'off' : 'polite');
        iconPause.hidden = !playing;
        iconPlay.hidden = playing;
        toggle.setAttribute(
          'aria-label',
          playing ? 'Pause automatic slide show' : 'Start automatic slide show'
        );
      }

      function go(next) {
        index = (next + slides.length) % slides.length;
        render();
      }

      root.addEventListener('mouseenter', function () {
        hovered = true;
        sync();
      });
      root.addEventListener('mouseleave', function () {
        hovered = false;
        sync();
      });
      root.addEventListener('focusin', function () {
        focused = true;
        sync();
      });
      root.addEventListener('focusout', function () {
        focused = false;
        sync();
      });

      toggle.addEventListener('click', function () {
        playing = !playing;
        sync();
      });
      root.querySelector('[data-ap-prev]').addEventListener('click', function () {
        go(index - 1);
      });
      root.querySelector('[data-ap-next]').addEventListener('click', function () {
        go(index + 1);
      });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          go(i);
        });
      });

      render();
      sync();
    });
  })();
</script>`,
      react: `import { useEffect, useState } from 'react';

const INTERVAL = 5000;

export function CarouselAutoplay({ items, onSelect, className = '', ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Read the preference on the client only, and keep listening: users flip this
  // mid-session, and a carousel that keeps moving after they did is the bug.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const running = playing && !hovered && !focused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), INTERVAL);
    return () => clearInterval(timer);
  }, [running, items.length]);

  function go(next) {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    if (onSelect) onSelect(wrapped);
  }

  return (
    <section
      className={\`max-w-2xl \${className}\`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {/* Silent while it advances itself; polite the moment it stops. */}
      <div className="overflow-hidden rounded-xl" aria-live={running ? 'off' : 'polite'}>
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: \`translateX(-\${index * 100}%)\` }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className={\`shrink-0 basis-full px-8 py-12 text-white \${item.background}\`}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={i !== index}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          aria-label={playing ? 'Pause automatic slide show' : 'Start automatic slide show'}
          onClick={() => setPlaying((value) => !value)}
          className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {playing ? (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4h2.5v12H6.5zM11 4h2.5v12H11z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4l9 6-9 6z" />
            </svg>
          )}
        </button>

        <div className="flex flex-1 justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={\`Go to slide \${i + 1}\`}
              aria-current={i === index ? true : undefined}
              onClick={() => go(i)}
              className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                i === index
                  ? 'w-5 bg-blue-600 dark:bg-blue-400'
                  : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
              }\`}
            />
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}`,
      nextjs: `'use client';

import { useEffect, useState } from 'react';

const INTERVAL = 5000;

export interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselAutoplayProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselAutoplay({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselAutoplayProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent): void => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const running = playing && !hovered && !focused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), INTERVAL);
    return () => clearInterval(timer);
  }, [running, items.length]);

  function go(next: number): void {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    onSelect?.(wrapped);
  }

  return (
    <section
      className={\`max-w-2xl \${className}\`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="overflow-hidden rounded-xl" aria-live={running ? 'off' : 'polite'}>
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: \`translateX(-\${index * 100}%)\` }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className={\`shrink-0 basis-full px-8 py-12 text-white \${item.background}\`}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={i !== index}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          aria-label={playing ? 'Pause automatic slide show' : 'Start automatic slide show'}
          onClick={() => setPlaying((value) => !value)}
          className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {playing ? (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4h2.5v12H6.5zM11 4h2.5v12H11z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4l9 6-9 6z" />
            </svg>
          )}
        </button>

        <div className="flex flex-1 justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={\`Go to slide \${i + 1}\`}
              aria-current={i === index ? true : undefined}
              onClick={() => go(i)}
              className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                i === index
                  ? 'w-5 bg-blue-600 dark:bg-blue-400'
                  : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
              }\`}
            />
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import { useEffect, useState } from 'react';

const INTERVAL = 5000;

export interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

export interface CarouselAutoplayProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselAutoplay({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselAutoplayProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [hovered, setHovered] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    const query: MediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent): void => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const running: boolean = playing && !hovered && !focused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setIndex((i: number) => (i + 1) % items.length), INTERVAL);
    return () => clearInterval(timer);
  }, [running, items.length]);

  const go = (next: number): void => {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    onSelect?.(wrapped);
  };

  return (
    <section
      className={\`max-w-2xl \${className}\`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="overflow-hidden rounded-xl" aria-live={running ? 'off' : 'polite'}>
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: \`translateX(-\${index * 100}%)\` }}
        >
          {items.map((item: Slide, i: number) => (
            <div
              key={item.id}
              className={\`shrink-0 basis-full px-8 py-12 text-white \${item.background}\`}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={i !== index}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          aria-label={playing ? 'Pause automatic slide show' : 'Start automatic slide show'}
          onClick={() => setPlaying((value: boolean) => !value)}
          className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {playing ? (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4h2.5v12H6.5zM11 4h2.5v12H11z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.5 4l9 6-9 6z" />
            </svg>
          )}
        </button>

        <div className="flex flex-1 justify-center gap-2">
          {items.map((item: Slide, i: number) => (
            <button
              key={item.id}
              type="button"
              aria-label={\`Go to slide \${i + 1}\`}
              aria-current={i === index ? true : undefined}
              onClick={() => go(i)}
              className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                i === index
                  ? 'w-5 bg-blue-600 dark:bg-blue-400'
                  : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
              }\`}
            />
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-thumbnails',
    category: 'carousel',
    tags: ['carousel', 'thumbnails', 'gallery', 'images', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-09',
    updatedAt: '2026-07-02',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1284, copies: 291, downloads: 83 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      {
        name: 'items',
        type: 'GalleryImage[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'front', imageSrc: '/promo/all-access.svg', imageAlt: 'Front view' }]",
      },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A thumbnail gallery, not a slide show: the strip is the primary control, so
  each thumb is a real button carrying the image's name ("Show Front view") and
  aria-current marks the one on display. The selected thumb is marked by a ring
  AND by full opacity - never by colour alone.
  The big image keeps its alt text; the thumbs are decorative repeats of it, so
  their <img> alt is empty and the button label does the talking.
-->
<div class="thumbs" data-thumbs>
  <section class="thumbs__main" aria-roledescription="carousel" aria-label="Product gallery">
    <div class="thumbs__stage" aria-live="polite">
      <img class="thumbs__image" src="/promo/all-access.svg" alt="Front view" data-thumbs-image />
    </div>
  </section>

  <div class="thumbs__strip" role="group" aria-label="Choose an image" data-thumbs-strip>
    <button class="thumbs__thumb" type="button" aria-label="Show Front view" aria-current="true" data-src="/promo/all-access.svg" data-alt="Front view">
      <img src="/promo/all-access.svg" alt="" />
    </button>
    <button class="thumbs__thumb" type="button" aria-label="Show Side view" data-src="/promo/all-access.svg" data-alt="Side view">
      <img src="/promo/all-access.svg" alt="" />
    </button>
    <button class="thumbs__thumb" type="button" aria-label="Show Detail view" data-src="/promo/all-access.svg" data-alt="Detail view">
      <img src="/promo/all-access.svg" alt="" />
    </button>
    <button class="thumbs__thumb" type="button" aria-label="Show Packaging" data-src="/promo/all-access.svg" data-alt="Packaging">
      <img src="/promo/all-access.svg" alt="" />
    </button>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-thumbs]').forEach(function (root) {
      var image = root.querySelector('[data-thumbs-image]');
      var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-thumbs-strip] button'));

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          image.src = thumb.dataset.src;
          // The alt travels with the image: the live region announces the new
          // name, so the user hears WHICH image they landed on.
          image.alt = thumb.dataset.alt;

          thumbs.forEach(function (other) {
            if (other === thumb) other.setAttribute('aria-current', 'true');
            else other.removeAttribute('aria-current');
          });
        });
      });
    });
  })();
</script>`,
      css: `.thumbs {
  max-width: 32rem;
}

.thumbs__stage {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
}

.thumbs__image {
  display: block;
  width: 100%;
  height: 16rem;
  object-fit: contain;
}

.thumbs__strip {
  display: flex;
  gap: 0.5rem;
  /* Scroll the strip instead of squashing the thumbs when they don't fit. */
  overflow-x: auto;
  padding-top: 0.75rem;
}

.thumbs__thumb {
  flex: none;
  overflow: hidden;
  width: 4rem;
  height: 4rem;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  opacity: 0.65;
  cursor: pointer;
}

.thumbs__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbs__thumb:hover {
  opacity: 1;
}

.thumbs__thumb:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Selected = ring + full opacity. Two signals, never colour alone. */
.thumbs__thumb[aria-current='true'] {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #2563eb;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .thumbs__thumb {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .thumbs__stage {
    border-color: #1f2937;
    background-color: #111827;
  }

  .thumbs__thumb {
    border-color: #1f2937;
    background-color: #111827;
  }

  .thumbs__thumb:focus-visible {
    outline-color: #60a5fa;
  }

  .thumbs__thumb[aria-current='true'] {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px #60a5fa;
  }
}`,
      tailwind: `<!-- Same script; aria-current: drives the ring so state lives in one attribute. -->
<div class="max-w-lg" data-thumbs>
  <section aria-roledescription="carousel" aria-label="Product gallery">
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" aria-live="polite">
      <img class="block h-64 w-full object-contain" src="/promo/all-access.svg" alt="Front view" data-thumbs-image />
    </div>
  </section>

  <div class="flex gap-2 overflow-x-auto pt-3" role="group" aria-label="Choose an image" data-thumbs-strip>
    <button
      class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400"
      type="button" aria-label="Show Front view" aria-current="true" data-src="/promo/all-access.svg" data-alt="Front view"
    >
      <img class="h-full w-full object-contain" src="/promo/all-access.svg" alt="" />
    </button>
    <button
      class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400"
      type="button" aria-label="Show Side view" data-src="/promo/all-access.svg" data-alt="Side view"
    >
      <img class="h-full w-full object-contain" src="/promo/all-access.svg" alt="" />
    </button>
    <button
      class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400"
      type="button" aria-label="Show Detail view" data-src="/promo/all-access.svg" data-alt="Detail view"
    >
      <img class="h-full w-full object-contain" src="/promo/all-access.svg" alt="" />
    </button>
    <button
      class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400"
      type="button" aria-label="Show Packaging" data-src="/promo/all-access.svg" data-alt="Packaging"
    >
      <img class="h-full w-full object-contain" src="/promo/all-access.svg" alt="" />
    </button>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-thumbs]').forEach(function (root) {
      var image = root.querySelector('[data-thumbs-image]');
      var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-thumbs-strip] button'));

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          image.src = thumb.dataset.src;
          image.alt = thumb.dataset.alt;

          thumbs.forEach(function (other) {
            if (other === thumb) other.setAttribute('aria-current', 'true');
            else other.removeAttribute('aria-current');
          });
        });
      });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselThumbnails({ items, onSelect, className = '', ariaLabel = 'Gallery' }) {
  const [index, setIndex] = useState(0);
  const active = items[index];

  function select(next) {
    setIndex(next);
    if (onSelect) onSelect(next);
  }

  if (!active) return null;

  return (
    <div className={\`max-w-lg \${className}\`}>
      <section aria-roledescription="carousel" aria-label={ariaLabel}>
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          {/* key forces a swap so the live region sees a new node, not a mutated src. */}
          <img
            key={active.id}
            className="block h-64 w-full object-contain"
            src={active.imageSrc}
            alt={active.imageAlt}
          />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pt-3" role="group" aria-label="Choose an image">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Show \${item.imageAlt}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => select(i)}
            className={\`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
            }\`}
          >
            {/* alt="" - the button's label already names this image. */}
            <img className="h-full w-full object-contain" src={item.imageSrc} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useState } from 'react';

export interface GalleryImage {
  id: string;
  imageSrc: string;
  imageAlt: string;
}

interface CarouselThumbnailsProps {
  items: GalleryImage[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselThumbnails({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Gallery',
}: CarouselThumbnailsProps) {
  const [index, setIndex] = useState(0);
  const active = items[index];

  function select(next: number): void {
    setIndex(next);
    onSelect?.(next);
  }

  if (!active) return null;

  return (
    <div className={\`max-w-lg \${className}\`}>
      <section aria-roledescription="carousel" aria-label={ariaLabel}>
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          {/* next/image works here too - swap the tag and set fill + sizes. */}
          <img
            key={active.id}
            className="block h-64 w-full object-contain"
            src={active.imageSrc}
            alt={active.imageAlt}
          />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pt-3" role="group" aria-label="Choose an image">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Show \${item.imageAlt}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => select(i)}
            className={\`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
            }\`}
          >
            <img className="h-full w-full object-contain" src={item.imageSrc} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface GalleryImage {
  id: string;
  imageSrc: string;
  imageAlt: string;
}

export interface CarouselThumbnailsProps {
  items: GalleryImage[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselThumbnails({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Gallery',
}: CarouselThumbnailsProps): JSX.Element | null {
  const [index, setIndex] = useState<number>(0);
  const active = items[index];

  const select = (next: number): void => {
    setIndex(next);
    onSelect?.(next);
  };

  if (!active) return null;

  return (
    <div className={\`max-w-lg \${className}\`}>
      <section aria-roledescription="carousel" aria-label={ariaLabel}>
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          <img
            key={active.id}
            className="block h-64 w-full object-contain"
            src={active.imageSrc}
            alt={active.imageAlt}
          />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pt-3" role="group" aria-label="Choose an image">
        {items.map((item: GalleryImage, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Show \${item.imageAlt}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => select(i)}
            className={\`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
            }\`}
          >
            <img className="h-full w-full object-contain" src={item.imageSrc} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}`,
    },
  },

  {
    slug: 'carousel-multi-slide',
    category: 'carousel',
    tags: ['carousel', 'slider', 'responsive', 'scroll-snap', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-16',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 962, copies: 218, downloads: 59 },
    variants: [
      { id: 'multiple', labelKey: 'multiple' },
      { id: 'single', labelKey: 'single' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'Slide[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'analytics', title: 'Analytics', copy: '…' }]",
      },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Three across on desktop, one on mobile - built on scroll-snap rather than a
  transform, which buys three things a translateX carousel has to fake:
  - the browser does the responsive maths (the slide is a flex-basis, and how
    many fit is whatever fits); no matchMedia, no per-breakpoint index juggling
  - touch swipe and trackpad scroll work for free, with native momentum
  - the track is a focusable scroll region (tabindex="0" + role="group" + label),
    so keyboard users can scroll it with the arrow keys the browser gives them
  The buttons scroll by exactly one slide, measured from the DOM.
-->
<section class="multi" aria-roledescription="carousel" aria-label="Feature tour" data-multi>
  <div class="multi__header">
    <h2 class="multi__heading">What's inside</h2>
    <div class="multi__arrows">
      <button class="multi__arrow" type="button" aria-label="Previous slides" data-multi-prev>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="multi__arrow" type="button" aria-label="Next slides" data-multi-next>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>

  <div class="multi__track" role="group" aria-label="Slides, scrollable" tabindex="0" data-multi-track>
    <article class="multi__slide" role="group" aria-roledescription="slide" aria-label="1 of 5">
      <h3 class="multi__title">Analytics</h3>
      <p class="multi__copy">Every metric that matters, live.</p>
    </article>
    <article class="multi__slide" role="group" aria-roledescription="slide" aria-label="2 of 5">
      <h3 class="multi__title">Automations</h3>
      <p class="multi__copy">Turn a repeated click into a rule.</p>
    </article>
    <article class="multi__slide" role="group" aria-roledescription="slide" aria-label="3 of 5">
      <h3 class="multi__title">Integrations</h3>
      <p class="multi__copy">Forty connectors and a webhook.</p>
    </article>
    <article class="multi__slide" role="group" aria-roledescription="slide" aria-label="4 of 5">
      <h3 class="multi__title">Audit log</h3>
      <p class="multi__copy">Who changed what, and when.</p>
    </article>
    <article class="multi__slide" role="group" aria-roledescription="slide" aria-label="5 of 5">
      <h3 class="multi__title">Reports</h3>
      <p class="multi__copy">Scheduled, and in your inbox.</p>
    </article>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-multi]').forEach(function (root) {
      var track = root.querySelector('[data-multi-track]');

      // Measure one step from the DOM: slide width + the flex gap. Nothing here
      // needs to know the breakpoint - whatever CSS decided, this reads back.
      function step() {
        var slide = track.firstElementChild;
        if (!slide) return 0;
        var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
        return slide.getBoundingClientRect().width + gap;
      }

      var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';

      root.querySelector('[data-multi-prev]').addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: behavior });
      });
      root.querySelector('[data-multi-next]').addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: behavior });
      });
    });
  })();
</script>`,
      css: `.multi {
  max-width: 48rem;
}

.multi__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
}

.multi__heading {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.multi__arrows {
  display: flex;
  gap: 0.375rem;
}

.multi__arrow {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
}

.multi__arrow svg {
  width: 1rem;
  height: 1rem;
}

.multi__arrow:hover {
  background-color: #f9fafb;
  color: #111827;
}

.multi__arrow:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.multi__track {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding-bottom: 0.25rem;
}

.multi__track::-webkit-scrollbar {
  display: none;
}

/* The scroll region is focusable, so it needs a visible focus ring like any
   other control. */
.multi__track:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.75rem;
}

.multi__slide {
  flex: 0 0 100%; /* one across on phones */
  scroll-snap-align: start;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #ffffff;
}

/* Three across once there is room. (100% - 2 gaps) / 3 keeps the gap honest. */
@media (min-width: 40rem) {
  .multi__slide {
    flex: 0 0 calc((100% - 2rem) / 3);
  }
}

.multi__title {
  margin: 0 0 0.375rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.multi__copy {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

@media (prefers-reduced-motion: reduce) {
  .multi__track {
    scroll-behavior: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .multi__heading {
    color: #f3f4f6;
  }

  .multi__arrow {
    border-color: #374151;
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .multi__arrow:hover {
    background-color: #374151;
    color: #ffffff;
  }

  .multi__arrow:focus-visible {
    outline-color: #60a5fa;
  }

  .multi__track:focus-visible {
    outline-color: #60a5fa;
  }

  .multi__slide {
    border-color: #1f2937;
    background-color: #030712;
  }

  .multi__title {
    color: #f3f4f6;
  }

  .multi__copy {
    color: #d1d5db;
  }
}`,
      tailwind: `<!--
  basis-full sm:basis-[calc((100%-2rem)/3)] is the whole responsive story: one
  slide on a phone, three from sm up, with the 1rem gaps subtracted so the third
  card does not spill. snap-x + snap-start hold the alignment.
-->
<section class="max-w-3xl" aria-roledescription="carousel" aria-label="Feature tour" data-multi>
  <div class="flex items-center justify-between pb-3">
    <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">What's inside</h2>
    <div class="flex gap-1.5">
      <button
        class="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-label="Previous slides" data-multi-prev
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        class="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-label="Next slides" data-multi-next
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>

  <div
    class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
    role="group" aria-label="Slides, scrollable" tabindex="0" data-multi-track
  >
    <article class="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="1 of 5">
      <h3 class="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">Analytics</h3>
      <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Every metric that matters, live.</p>
    </article>
    <article class="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="2 of 5">
      <h3 class="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">Automations</h3>
      <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Turn a repeated click into a rule.</p>
    </article>
    <article class="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="3 of 5">
      <h3 class="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">Integrations</h3>
      <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Forty connectors and a webhook.</p>
    </article>
    <article class="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="4 of 5">
      <h3 class="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">Audit log</h3>
      <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Who changed what, and when.</p>
    </article>
    <article class="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="5 of 5">
      <h3 class="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">Reports</h3>
      <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Scheduled, and in your inbox.</p>
    </article>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-multi]').forEach(function (root) {
      var track = root.querySelector('[data-multi-track]');

      function step() {
        var slide = track.firstElementChild;
        if (!slide) return 0;
        var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
        return slide.getBoundingClientRect().width + gap;
      }

      var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';

      root.querySelector('[data-multi-prev]').addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: behavior });
      });
      root.querySelector('[data-multi-next]').addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: behavior });
      });
    });
  })();
</script>`,
      react: `import { useRef } from 'react';

export function CarouselMultiSlide({ items, onSelect, className = '', ariaLabel = 'Carousel' }) {
  const trackRef = useRef(null);

  // One step = slide width + gap, measured live. No breakpoint logic in JS:
  // whatever CSS is showing (1 or 3 across), this reads it back.
  function scrollByStep(direction) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild;
    if (!slide) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const step = slide.getBoundingClientRect().width + gap;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' });
    if (onSelect) onSelect(Math.round((track.scrollLeft + direction * step) / step));
  }

  return (
    <section className={\`max-w-3xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">What's inside</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slides"
            onClick={() => scrollByStep(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slides"
            onClick={() => scrollByStep(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* A focusable scroll region: keyboard users get the browser's own arrow-key scrolling. */}
      <div
        ref={trackRef}
        role="group"
        aria-label="Slides, scrollable"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <article
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={\`\${i + 1} of \${items.length}\`}
            className="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950"
          >
            <h3 className="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}`,
      nextjs: `'use client';

import { useRef } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
}

interface CarouselMultiSlideProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselMultiSlide({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselMultiSlideProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  function scrollByStep(direction: 1 | -1): void {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild;
    if (!slide) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const step = slide.getBoundingClientRect().width + gap;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' });
    onSelect?.(Math.round((track.scrollLeft + direction * step) / step));
  }

  return (
    <section className={\`max-w-3xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">What&apos;s inside</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slides"
            onClick={() => scrollByStep(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slides"
            onClick={() => scrollByStep(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="group"
        aria-label="Slides, scrollable"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <article
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={\`\${i + 1} of \${items.length}\`}
            className="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950"
          >
            <h3 className="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useRef } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
}

export interface CarouselMultiSlideProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselMultiSlide({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselMultiSlideProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByStep = (direction: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild;
    if (!slide) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const step = slide.getBoundingClientRect().width + gap;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' });
    onSelect?.(Math.round((track.scrollLeft + direction * step) / step));
  };

  return (
    <section className={\`max-w-3xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">What&apos;s inside</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slides"
            onClick={() => scrollByStep(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slides"
            onClick={() => scrollByStep(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="group"
        aria-label="Slides, scrollable"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item: Slide, i: number) => (
          <article
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={\`\${i + 1} of \${items.length}\`}
            className="shrink-0 basis-full snap-start rounded-xl border border-gray-200 bg-white p-5 sm:basis-[calc((100%-2rem)/3)] dark:border-gray-800 dark:bg-gray-950"
          >
            <h3 className="mb-1.5 text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-fade',
    category: 'carousel',
    tags: ['carousel', 'fade', 'crossfade', 'slideshow', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-04',
    updatedAt: '2026-06-26',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1358, copies: 307, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      {
        name: 'items',
        type: 'Slide[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'analytics', title: 'Analytics', copy: '…' }]",
      },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Cross-fade instead of slide. Structurally this is a stack, not a row: every
  slide is absolutely positioned in the same box and only opacity changes, so
  there is no track and no transform.
  Two consequences worth knowing:
  - the stage needs an explicit height (absolute children do not size a parent)
  - the faded-out slides are still painted underneath, so they get aria-hidden
    AND pointer-events: none - otherwise an invisible slide would swallow clicks
  Under reduced motion the fade becomes a cut (transition: none), which is the
  right answer: the user still gets the change, without the dissolve.
-->
<section class="fade-car" aria-roledescription="carousel" aria-label="Product highlights" data-fade>
  <div class="fade-car__stage" aria-live="polite">
    <div class="fade-car__slide fade-car__slide--a is-active" role="group" aria-roledescription="slide" aria-label="1 of 3">
      <h3 class="fade-car__title">Analytics</h3>
      <p class="fade-car__copy">Every metric that matters, updated the moment it changes.</p>
    </div>
    <div class="fade-car__slide fade-car__slide--b" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
      <h3 class="fade-car__title">Automations</h3>
      <p class="fade-car__copy">Turn a repeated click into a rule that runs itself.</p>
    </div>
    <div class="fade-car__slide fade-car__slide--c" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
      <h3 class="fade-car__title">Integrations</h3>
      <p class="fade-car__copy">Forty connectors, and a webhook for everything else.</p>
    </div>

    <button class="fade-car__arrow fade-car__arrow--prev" type="button" aria-label="Previous slide" data-fade-prev>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button class="fade-car__arrow fade-car__arrow--next" type="button" aria-label="Next slide" data-fade-next>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>

  <div class="fade-car__dots" data-fade-dots>
    <button class="fade-car__dot" type="button" aria-label="Go to slide 1" aria-current="true"></button>
    <button class="fade-car__dot" type="button" aria-label="Go to slide 2"></button>
    <button class="fade-car__dot" type="button" aria-label="Go to slide 3"></button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-fade]').forEach(function (root) {
      var slides = Array.prototype.slice.call(root.querySelectorAll('.fade-car__slide'));
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-fade-dots] button'));
      var index = 0;

      function go(next) {
        index = (next + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
          if (i === index) slide.removeAttribute('aria-hidden');
          else slide.setAttribute('aria-hidden', 'true');
        });

        dots.forEach(function (dot, i) {
          if (i === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      root.querySelector('[data-fade-prev]').addEventListener('click', function () {
        go(index - 1);
      });
      root.querySelector('[data-fade-next]').addEventListener('click', function () {
        go(index + 1);
      });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          go(i);
        });
      });
    });
  })();
</script>`,
      css: `.fade-car {
  max-width: 42rem;
}

.fade-car__stage {
  position: relative;
  /* Absolute children cannot size their parent - the stage owns the height. */
  height: 14rem;
  overflow: hidden;
  border-radius: 0.75rem;
}

.fade-car__slide {
  position: absolute;
  inset: 0;
  padding: 3rem 2rem;
  color: #ffffff;
  opacity: 0;
  pointer-events: none; /* an invisible slide must not eat clicks */
  transition: opacity 500ms ease;
}

.fade-car__slide.is-active {
  opacity: 1;
  pointer-events: auto;
}

.fade-car__slide--a {
  background-image: linear-gradient(135deg, #2563eb, #4f46e5);
}

.fade-car__slide--b {
  background-image: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.fade-car__slide--c {
  background-image: linear-gradient(135deg, #0f766e, #0369a1);
}

.fade-car__title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.fade-car__copy {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  opacity: 0.9;
}

.fade-car__arrow {
  position: absolute;
  top: 50%;
  z-index: 1;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
}

.fade-car__arrow svg {
  width: 1.125rem;
  height: 1.125rem;
}

.fade-car__arrow:hover {
  background-color: #f9fafb;
  color: #111827;
}

.fade-car__arrow:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.fade-car__arrow--prev {
  left: 0.75rem;
}

.fade-car__arrow--next {
  right: 0.75rem;
}

.fade-car__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
}

.fade-car__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background-color: #6b7280;
  cursor: pointer;
}

.fade-car__dot:hover {
  background-color: #4b5563;
}

.fade-car__dot:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.fade-car__dot[aria-current='true'] {
  width: 1.25rem;
  background-color: #2563eb;
}

/* Reduced motion: cut, do not dissolve. */
@media (prefers-reduced-motion: reduce) {
  .fade-car__slide {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .fade-car__arrow {
    border-color: #374151;
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .fade-car__arrow:hover {
    background-color: #374151;
    color: #ffffff;
  }

  .fade-car__arrow:focus-visible {
    outline-color: #60a5fa;
  }

  .fade-car__dot:hover {
    background-color: #9ca3af;
  }

  .fade-car__dot:focus-visible {
    outline-color: #60a5fa;
  }

  .fade-car__dot[aria-current='true'] {
    background-color: #60a5fa;
  }
}`,
      tailwind: `<!--
  A stack, not a row: inset-0 on every slide, opacity does the work.
  motion-reduce:transition-none turns the dissolve into a cut.
-->
<section class="max-w-2xl" aria-roledescription="carousel" aria-label="Product highlights" data-fade>
  <div class="relative h-56 overflow-hidden rounded-xl" aria-live="polite">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-12 text-white opacity-100 transition-opacity duration-500 motion-reduce:transition-none" role="group" aria-roledescription="slide" aria-label="1 of 3" data-fade-slide>
      <h3 class="mb-2 text-xl font-semibold">Analytics</h3>
      <p class="text-sm leading-relaxed text-white/90">Every metric that matters, updated the moment it changes.</p>
    </div>
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-12 text-white opacity-0 transition-opacity duration-500 motion-reduce:transition-none" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true" data-fade-slide>
      <h3 class="mb-2 text-xl font-semibold">Automations</h3>
      <p class="text-sm leading-relaxed text-white/90">Turn a repeated click into a rule that runs itself.</p>
    </div>
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-700 to-sky-700 px-8 py-12 text-white opacity-0 transition-opacity duration-500 motion-reduce:transition-none" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true" data-fade-slide>
      <h3 class="mb-2 text-xl font-semibold">Integrations</h3>
      <p class="text-sm leading-relaxed text-white/90">Forty connectors, and a webhook for everything else.</p>
    </div>

    <button
      class="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      type="button" aria-label="Previous slide" data-fade-prev
    >
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button
      class="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      type="button" aria-label="Next slide" data-fade-next
    >
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>

  <div class="flex justify-center gap-2 pt-3" data-fade-dots>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 1" aria-current="true"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 2"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 3"></button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-fade]').forEach(function (root) {
      var slides = Array.prototype.slice.call(root.querySelectorAll('[data-fade-slide]'));
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-fade-dots] button'));
      var index = 0;

      function go(next) {
        index = (next + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
          var isActive = i === index;
          slide.classList.toggle('opacity-100', isActive);
          slide.classList.toggle('opacity-0', !isActive);
          slide.classList.toggle('pointer-events-none', !isActive);
          if (isActive) slide.removeAttribute('aria-hidden');
          else slide.setAttribute('aria-hidden', 'true');
        });

        dots.forEach(function (dot, i) {
          if (i === index) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      root.querySelector('[data-fade-prev]').addEventListener('click', function () {
        go(index - 1);
      });
      root.querySelector('[data-fade-next]').addEventListener('click', function () {
        go(index + 1);
      });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          go(i);
        });
      });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselFade({ items, onSelect, className = '', ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0);

  function go(next) {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    if (onSelect) onSelect(wrapped);
  }

  return (
    <section className={\`max-w-2xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      {/* Fixed height: absolutely positioned slides cannot size the stage. */}
      <div className="relative h-56 overflow-hidden rounded-xl" aria-live="polite">
        {items.map((item, i) => {
          const isActive = i === index;

          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={!isActive}
              className={\`absolute inset-0 px-8 py-12 text-white transition-opacity duration-500 motion-reduce:transition-none \${item.background} \${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }\`}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          );
        })}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Go to slide \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'w-5 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }\`}
          />
        ))}
      </div>
    </section>
  );
}`,
      nextjs: `'use client';

import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  background: string;
}

interface CarouselFadeProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselFade({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselFadeProps) {
  const [index, setIndex] = useState(0);

  function go(next: number): void {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    onSelect?.(wrapped);
  }

  return (
    <section className={\`max-w-2xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative h-56 overflow-hidden rounded-xl" aria-live="polite">
        {items.map((item, i) => {
          const isActive = i === index;

          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={!isActive}
              className={\`absolute inset-0 px-8 py-12 text-white transition-opacity duration-500 motion-reduce:transition-none \${item.background} \${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }\`}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          );
        })}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Go to slide \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'w-5 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }\`}
          />
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the slide's background. */
  background: string;
}

export interface CarouselFadeProps {
  items: Slide[];
  onSelect?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function CarouselFade({
  items,
  onSelect,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselFadeProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);

  const go = (next: number): void => {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    onSelect?.(wrapped);
  };

  return (
    <section className={\`max-w-2xl \${className}\`} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative h-56 overflow-hidden rounded-xl" aria-live="polite">
        {items.map((item: Slide, i: number) => {
          const isActive = i === index;

          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={\`\${i + 1} of \${items.length}\`}
              aria-hidden={!isActive}
              className={\`absolute inset-0 px-8 py-12 text-white transition-opacity duration-500 motion-reduce:transition-none \${item.background} \${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }\`}
            >
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          );
        })}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pt-3">
        {items.map((item: Slide, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Go to slide \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => go(i)}
            className={\`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
              i === index
                ? 'w-5 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
            }\`}
          />
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-cards-peek',
    category: 'carousel',
    tags: ['carousel', 'cards', 'peek', 'scroll-snap', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'PeekCard[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', title: 'Analytics', copy: '…', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Carousel'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- Peek carousel: cards are 85% wide and snap-center, so the neighbours stay
     half-visible as a "there is more" cue. Scroll-snap does the paging; the
     arrows nudge by exactly one card width measured from the DOM. -->
<section class="max-w-2xl" aria-roledescription="carousel" aria-label="Featured work" data-peek>
  <div class="mb-3 flex justify-end gap-1.5">
    <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Previous slide" data-peek-prev>
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
    <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Next slide" data-peek-next>
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
  </div>
  <div class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden" role="group" aria-label="Slides, scrollable" tabindex="0" data-peek-track>
    <article class="shrink-0 basis-[85%] snap-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:basis-[70%] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="1 of 3">
      <div class="aspect-[16/9] w-full bg-gradient-to-br from-blue-600 to-indigo-600"></div>
      <div class="p-5"><h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">Analytics</h3><p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Every metric that matters, live.</p></div>
    </article>
    <article class="shrink-0 basis-[85%] snap-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:basis-[70%] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="2 of 3">
      <div class="aspect-[16/9] w-full bg-gradient-to-br from-indigo-600 to-violet-600"></div>
      <div class="p-5"><h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">Automations</h3><p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Turn a repeated click into a rule.</p></div>
    </article>
    <article class="shrink-0 basis-[85%] snap-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:basis-[70%] dark:border-gray-800 dark:bg-gray-950" role="group" aria-roledescription="slide" aria-label="3 of 3">
      <div class="aspect-[16/9] w-full bg-gradient-to-br from-teal-700 to-sky-700"></div>
      <div class="p-5"><h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">Integrations</h3><p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">Forty connectors and a webhook.</p></div>
    </article>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-peek]').forEach(function (root) {
      var track = root.querySelector('[data-peek-track]');
      function step(dir) {
        var slide = track.firstElementChild;
        if (!slide) return;
        var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        track.scrollBy({ left: dir * (slide.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' });
      }
      root.querySelector('[data-peek-prev]').addEventListener('click', function () { step(-1); });
      root.querySelector('[data-peek-next]').addEventListener('click', function () { step(1); });
    });
  })();
</script>`,
      react: `import { useRef } from 'react';

export function CarouselCardsPeek({ items, className = '', ariaLabel = 'Carousel' }) {
  const trackRef = useRef(null);

  // One card width plus the computed gap, read from the DOM - so widening the
  // cards needs no JS change.
  const step = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild;
    if (!slide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * (slide.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="mb-3 flex justify-end gap-1.5">
        <button type="button" aria-label="Previous slide" onClick={() => step(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" aria-label="Next slide" onClick={() => step(1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div ref={trackRef} role="group" aria-label="Slides, scrollable" tabIndex={0} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <article key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} className="shrink-0 basis-[85%] snap-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:basis-[70%] dark:border-gray-800 dark:bg-gray-950">
            <div className={'aspect-[16/9] w-full ' + item.background} />
            <div className="p-5">
              <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useRef } from 'react';

export interface PeekCard {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the card's media tile. */
  background: string;
}

export interface CarouselCardsPeekProps {
  items: PeekCard[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselCardsPeek({ items, className = '', ariaLabel = 'Carousel' }: CarouselCardsPeekProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const step = (dir: 1 | -1): void => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild;
    if (!slide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * (slide.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="mb-3 flex justify-end gap-1.5">
        <button type="button" aria-label="Previous slide" onClick={() => step(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" aria-label="Next slide" onClick={() => step(1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div ref={trackRef} role="group" aria-label="Slides, scrollable" tabIndex={0} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden">
        {items.map((item: PeekCard, i: number) => (
          <article key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} className="shrink-0 basis-[85%] snap-center overflow-hidden rounded-xl border border-gray-200 bg-white sm:basis-[70%] dark:border-gray-800 dark:bg-gray-950">
            <div className={'aspect-[16/9] w-full ' + item.background} />
            <div className="p-5">
              <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'carousel-vertical',
    category: 'carousel',
    tags: ['carousel', 'vertical', 'slider', 'transform', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Slide[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', title: 'Analytics', copy: '…', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Carousel'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- Same transform carousel, turned 90deg: the track is a flex column and the
     move is translateY, not translateX. Up/Down replace Prev/Next, and the
     stage needs an explicit height because the slides no longer fill it. -->
<section class="max-w-md" aria-roledescription="carousel" aria-label="Product highlights" data-vcar>
  <div class="flex gap-3">
    <div class="relative h-56 flex-1 overflow-hidden rounded-xl" aria-live="polite">
      <div class="flex h-full flex-col transition-transform duration-500 ease-out motion-reduce:transition-none" data-vcar-track>
        <div class="flex h-full shrink-0 basis-full flex-col justify-end bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-6 text-white" role="group" aria-roledescription="slide" aria-label="1 of 3">
          <h3 class="mb-1 text-lg font-semibold">Analytics</h3><p class="text-sm leading-relaxed text-white/90">Every metric that matters, updated the moment it changes.</p>
        </div>
        <div class="flex h-full shrink-0 basis-full flex-col justify-end bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-6 text-white" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
          <h3 class="mb-1 text-lg font-semibold">Automations</h3><p class="text-sm leading-relaxed text-white/90">Turn a repeated click into a rule that runs itself.</p>
        </div>
        <div class="flex h-full shrink-0 basis-full flex-col justify-end bg-gradient-to-br from-teal-700 to-sky-700 px-6 py-6 text-white" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
          <h3 class="mb-1 text-lg font-semibold">Integrations</h3><p class="text-sm leading-relaxed text-white/90">Forty connectors, and a webhook for everything else.</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center gap-3">
      <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Previous slide" data-vcar-prev>
        <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12.5 5-5 5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="flex flex-col gap-2" data-vcar-dots>
        <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:h-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 1" aria-current="true"></button>
        <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:h-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 2"></button>
        <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:h-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 3"></button>
      </div>
      <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Next slide" data-vcar-next>
        <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-vcar]').forEach(function (root) {
      var track = root.querySelector('[data-vcar-track]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-vcar-dots] button'));
      var index = 0;
      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateY(' + index * -100 + '%)';
        slides.forEach(function (s, i) { if (i === index) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
        dots.forEach(function (d, i) { if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      }
      root.querySelector('[data-vcar-prev]').addEventListener('click', function () { go(index - 1); });
      root.querySelector('[data-vcar-next]').addEventListener('click', function () { go(index + 1); });
      dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselVertical({ items, className = '', ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0);
  const go = (next) => setIndex((next + items.length) % items.length);

  return (
    <section className={'max-w-md ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex gap-3">
        {/* Explicit height: the column track fills it, translateY pages by 100%. */}
        <div className="relative h-56 flex-1 overflow-hidden rounded-xl" aria-live="polite">
          <div className="flex h-full flex-col transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateY(-' + index * 100 + '%)' }}>
            {items.map((item, i) => (
              <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'flex h-full shrink-0 basis-full flex-col justify-end px-6 py-6 text-white ' + item.background}>
                <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12.5 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'w-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === index ? 'h-5 bg-blue-600 dark:bg-blue-400' : 'h-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
            ))}
          </div>
          <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the slide's background. */
  background: string;
}

export interface CarouselVerticalProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselVertical({ items, className = '', ariaLabel = 'Carousel' }: CarouselVerticalProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={'max-w-md ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex gap-3">
        <div className="relative h-56 flex-1 overflow-hidden rounded-xl" aria-live="polite">
          <div className="flex h-full flex-col transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateY(-' + index * 100 + '%)' }}>
            {items.map((item: Slide, i: number) => (
              <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'flex h-full shrink-0 basis-full flex-col justify-end px-6 py-6 text-white ' + item.background}>
                <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12.5 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex flex-col gap-2">
            {items.map((item: Slide, i: number) => (
              <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'w-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === index ? 'h-5 bg-blue-600 dark:bg-blue-400' : 'h-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
            ))}
          </div>
          <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-center-mode',
    category: 'carousel',
    tags: ['carousel', 'center', 'coverflow', 'transform', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Slide[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', title: 'Analytics', copy: '…', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Carousel'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- Center mode: the active card sits centred at 70% width with the neighbours
     peeking and dimmed. The track offset is calc(15% - index*70%) - 15% is half
     of the 30% a 70% card leaves, so the current card lands dead centre. -->
<section class="mx-auto max-w-2xl" aria-roledescription="carousel" aria-label="Highlights" data-cm>
  <div class="overflow-hidden">
    <div class="flex items-center transition-transform duration-500 ease-out motion-reduce:transition-none" style="transform: translateX(15%);" data-cm-track>
      <div class="shrink-0 basis-[70%] px-2 transition-all duration-500 motion-reduce:transition-none" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="flex h-40 flex-col justify-end rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white"><h3 class="text-lg font-semibold">Analytics</h3><p class="text-sm text-white/90">Every metric that matters.</p></div>
      </div>
      <div class="shrink-0 basis-[70%] px-2 scale-90 opacity-50 transition-all duration-500 motion-reduce:transition-none" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
        <div class="flex h-40 flex-col justify-end rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white"><h3 class="text-lg font-semibold">Automations</h3><p class="text-sm text-white/90">Turn a click into a rule.</p></div>
      </div>
      <div class="shrink-0 basis-[70%] px-2 scale-90 opacity-50 transition-all duration-500 motion-reduce:transition-none" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
        <div class="flex h-40 flex-col justify-end rounded-xl bg-gradient-to-br from-teal-700 to-sky-700 p-5 text-white"><h3 class="text-lg font-semibold">Integrations</h3><p class="text-sm text-white/90">Forty connectors.</p></div>
      </div>
    </div>
  </div>
  <div class="mt-3 flex items-center justify-center gap-4">
    <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Previous slide" data-cm-prev>
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
    <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Next slide" data-cm-next>
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-cm]').forEach(function (root) {
      var track = root.querySelector('[data-cm-track]');
      var slides = Array.prototype.slice.call(track.children);
      var index = 0;
      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(calc(15% - ' + index * 70 + '%))';
        slides.forEach(function (s, i) {
          if (i === index) { s.classList.remove('scale-90', 'opacity-50'); s.removeAttribute('aria-hidden'); }
          else { s.classList.add('scale-90', 'opacity-50'); s.setAttribute('aria-hidden', 'true'); }
        });
      }
      root.querySelector('[data-cm-prev]').addEventListener('click', function () { go(index - 1); });
      root.querySelector('[data-cm-next]').addEventListener('click', function () { go(index + 1); });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselCenterMode({ items, className = '', ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0);
  const go = (next) => setIndex((next + items.length) % items.length);

  return (
    <section className={'mx-auto max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden" aria-live="polite">
        {/* 15% centres a 70%-wide card; each step shifts the track by 70%. */}
        <div className="flex items-center transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(calc(15% - ' + index * 70 + '%))' }}>
          {items.map((item, i) => (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'shrink-0 basis-[70%] px-2 transition-all duration-500 motion-reduce:transition-none ' + (i === index ? '' : 'scale-90 opacity-50')}>
              <div className={'flex h-40 flex-col justify-end rounded-xl p-5 text-white ' + item.background}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/90">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the card background. */
  background: string;
}

export interface CarouselCenterModeProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselCenterMode({ items, className = '', ariaLabel = 'Carousel' }: CarouselCenterModeProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={'mx-auto max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden" aria-live="polite">
        <div className="flex items-center transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(calc(15% - ' + index * 70 + '%))' }}>
          {items.map((item: Slide, i: number) => (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'shrink-0 basis-[70%] px-2 transition-all duration-500 motion-reduce:transition-none ' + (i === index ? '' : 'scale-90 opacity-50')}>
              <div className={'flex h-40 flex-col justify-end rounded-xl p-5 text-white ' + item.background}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/90">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'carousel-progress-dots',
    category: 'carousel',
    tags: ['carousel', 'progress', 'dots', 'transform', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Slide[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', title: 'Analytics', copy: '…', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Carousel'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- A basic slide carousel with a determinate progress bar: the fill width is
     (index+1)/total, so the bar doubles as "how far through you are". The dots
     remain the real controls; the bar is aria-hidden decoration. -->
<section class="max-w-2xl" aria-roledescription="carousel" aria-label="Product highlights" data-pd>
  <div class="relative overflow-hidden rounded-xl" aria-live="polite">
    <div class="flex transition-transform duration-500 ease-out motion-reduce:transition-none" data-pd-track>
      <div class="shrink-0 basis-full bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="1 of 3"><h3 class="mb-2 text-xl font-semibold">Analytics</h3><p class="text-sm leading-relaxed text-white/90">Every metric that matters, updated the moment it changes.</p></div>
      <div class="shrink-0 basis-full bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true"><h3 class="mb-2 text-xl font-semibold">Automations</h3><p class="text-sm leading-relaxed text-white/90">Turn a repeated click into a rule that runs itself.</p></div>
      <div class="shrink-0 basis-full bg-gradient-to-br from-teal-700 to-sky-700 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true"><h3 class="mb-2 text-xl font-semibold">Integrations</h3><p class="text-sm leading-relaxed text-white/90">Forty connectors, and a webhook for everything else.</p></div>
    </div>
  </div>
  <div class="mt-4 flex items-center gap-4">
    <div class="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true">
      <div class="h-full rounded-full bg-blue-600 transition-[width] duration-500 motion-reduce:transition-none dark:bg-blue-400" style="width: 33.333%;" data-pd-bar></div>
    </div>
    <div class="flex gap-2" data-pd-dots>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 1" aria-current="true"></button>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 2"></button>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to slide 3"></button>
    </div>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-pd]').forEach(function (root) {
      var track = root.querySelector('[data-pd-track]');
      var bar = root.querySelector('[data-pd-bar]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-pd-dots] button'));
      var index = 0;
      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(' + index * -100 + '%)';
        bar.style.width = ((index + 1) / slides.length) * 100 + '%';
        slides.forEach(function (s, i) { if (i === index) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
        dots.forEach(function (d, i) { if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      }
      dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselProgressDots({ items, className = '', ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0);
  const go = (next) => setIndex((next + items.length) % items.length);

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative overflow-hidden rounded-xl" aria-live="polite">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
          {items.map((item, i) => (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'shrink-0 basis-full px-8 py-12 text-white ' + item.background}>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        {/* Decorative: the fill mirrors the current index, dots do the steering. */}
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true">
          <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500 motion-reduce:transition-none dark:bg-blue-400" style={{ width: ((index + 1) / items.length) * 100 + '%' }} />
        </div>
        <div className="flex gap-2">
          {items.map((item, i) => (
            <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
          ))}
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the slide's background. */
  background: string;
}

export interface CarouselProgressDotsProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselProgressDots({ items, className = '', ariaLabel = 'Carousel' }: CarouselProgressDotsProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="relative overflow-hidden rounded-xl" aria-live="polite">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
          {items.map((item: Slide, i: number) => (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'shrink-0 basis-full px-8 py-12 text-white ' + item.background}>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true">
          <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500 motion-reduce:transition-none dark:bg-blue-400" style={{ width: ((index + 1) / items.length) * 100 + '%' }} />
        </div>
        <div className="flex gap-2">
          {items.map((item: Slide, i: number) => (
            <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
          ))}
        </div>
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-testimonial',
    category: 'carousel',
    tags: ['carousel', 'testimonial', 'quotes', 'slider', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Testimonial[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', quote: '…', name: 'Ada Lovelace', role: 'CTO, Analytical', accent: 'from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Testimonials'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- Testimonial slider: each slide is a blockquote with a gradient avatar built
     from the author's initials, so there are no image assets. Slides page with a
     transform; the avatar tile is aria-hidden since the name is real text. -->
<section class="max-w-xl" aria-roledescription="carousel" aria-label="What customers say" data-tc>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950" aria-live="polite">
    <div class="flex transition-transform duration-500 ease-out motion-reduce:transition-none" data-tc-track>
      <figure class="shrink-0 basis-full p-6 sm:p-8" role="group" aria-roledescription="slide" aria-label="1 of 2">
        <blockquote class="text-base leading-relaxed text-gray-800 dark:text-gray-100">"The dashboard paid for itself in a week - we stopped exporting to spreadsheets entirely."</blockquote>
        <figcaption class="mt-5 flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white" aria-hidden="true">AL</span>
          <span class="text-sm"><span class="block font-semibold text-gray-900 dark:text-gray-100">Ada Lovelace</span><span class="block text-gray-500 dark:text-gray-400">CTO, Analytical Engines</span></span>
        </figcaption>
      </figure>
      <figure class="shrink-0 basis-full p-6 sm:p-8" role="group" aria-roledescription="slide" aria-label="2 of 2" aria-hidden="true">
        <blockquote class="text-base leading-relaxed text-gray-800 dark:text-gray-100">"Setup took an afternoon and the audit log alone got us through the SOC 2 review."</blockquote>
        <figcaption class="mt-5 flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-700 to-sky-700 text-sm font-semibold text-white" aria-hidden="true">GH</span>
          <span class="text-sm"><span class="block font-semibold text-gray-900 dark:text-gray-100">Grace Hopper</span><span class="block text-gray-500 dark:text-gray-400">VP Eng, Compiler Co</span></span>
        </figcaption>
      </figure>
    </div>
  </div>
  <div class="mt-4 flex items-center justify-between">
    <div class="flex gap-2" data-tc-dots>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to testimonial 1" aria-current="true"></button>
      <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:w-5 aria-[current=true]:bg-blue-600 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:bg-blue-400" type="button" aria-label="Go to testimonial 2"></button>
    </div>
    <div class="flex gap-1.5">
      <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Previous testimonial" data-tc-prev>
        <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <button class="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Next testimonial" data-tc-next>
        <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-tc]').forEach(function (root) {
      var track = root.querySelector('[data-tc-track]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-tc-dots] button'));
      var index = 0;
      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(' + index * -100 + '%)';
        slides.forEach(function (s, i) { if (i === index) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
        dots.forEach(function (d, i) { if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      }
      root.querySelector('[data-tc-prev]').addEventListener('click', function () { go(index - 1); });
      root.querySelector('[data-tc-next]').addEventListener('click', function () { go(index + 1); });
      dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function CarouselTestimonial({ items, className = '', ariaLabel = 'Testimonials' }) {
  const [index, setIndex] = useState(0);
  const go = (next) => setIndex((next + items.length) % items.length);

  return (
    <section className={'max-w-xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950" aria-live="polite">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
          {items.map((item, i) => (
            <figure key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className="shrink-0 basis-full p-6 sm:p-8">
              <blockquote className="text-base leading-relaxed text-gray-800 dark:text-gray-100">{'"' + item.quote + '"'}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className={'grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ' + item.accent}>{initials(item.name)}</span>
                <span className="text-sm"><span className="block font-semibold text-gray-900 dark:text-gray-100">{item.name}</span><span className="block text-gray-500 dark:text-gray-400">{item.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((item, i) => (
            <button key={item.id} type="button" aria-label={'Go to testimonial ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button type="button" aria-label="Previous testimonial" onClick={() => go(index - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next testimonial" onClick={() => go(index + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** Tailwind gradient stops for the initials avatar, e.g. 'from-blue-600 to-indigo-600'. */
  accent: string;
}

export interface CarouselTestimonialProps {
  items: Testimonial[];
  className?: string;
  ariaLabel?: string;
}

const initials = (name: string): string => name.split(' ').map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase();

export function CarouselTestimonial({ items, className = '', ariaLabel = 'Testimonials' }: CarouselTestimonialProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={'max-w-xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950" aria-live="polite">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
          {items.map((item: Testimonial, i: number) => (
            <figure key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className="shrink-0 basis-full p-6 sm:p-8">
              <blockquote className="text-base leading-relaxed text-gray-800 dark:text-gray-100">{'"' + item.quote + '"'}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className={'grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ' + item.accent}>{initials(item.name)}</span>
                <span className="text-sm"><span className="block font-semibold text-gray-900 dark:text-gray-100">{item.name}</span><span className="block text-gray-500 dark:text-gray-400">{item.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((item: Testimonial, i: number) => (
            <button key={item.id} type="button" aria-label={'Go to testimonial ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button type="button" aria-label="Previous testimonial" onClick={() => go(index - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next testimonial" onClick={() => go(index + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-logo-strip',
    category: 'carousel',
    tags: ['carousel', 'logos', 'marquee', 'reduced-motion', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Logo[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', name: 'Acme', accent: 'from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Trusted by'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- An infinite logo marquee with no assets: each logo is a gradient chip with
     initials. The list is rendered twice and the track slides -50%, so the loop
     is seamless. It pauses on hover and, under reduced motion, stops entirely -
     the wrapper is scrollable so the logos stay reachable when the motion is off. -->
<section class="group max-w-3xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-roledescription="carousel" aria-label="Trusted by leading teams">
  <style>@keyframes adysreLogoScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}</style>
  <div class="flex w-max [animation:adysreLogoScroll_24s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
    <ul class="flex shrink-0 items-center gap-8 pr-8">
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white">Acme</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-semibold text-white">Globex</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-teal-700 to-sky-700 text-sm font-semibold text-white">Initech</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-rose-600 to-orange-500 text-sm font-semibold text-white">Umbrella</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-semibold text-white">Hooli</span></li>
    </ul>
    <ul class="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white">Acme</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-semibold text-white">Globex</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-teal-700 to-sky-700 text-sm font-semibold text-white">Initech</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-rose-600 to-orange-500 text-sm font-semibold text-white">Umbrella</span></li>
      <li><span class="grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-semibold text-white">Hooli</span></li>
    </ul>
  </div>
</section>`,
      react: `export function CarouselLogoStrip({ items, className = '', ariaLabel = 'Trusted by' }) {
  const chip = (item, hidden) => (
    <li key={(hidden ? 'b-' : 'a-') + item.id}>
      <span className={'grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br text-sm font-semibold text-white ' + item.accent}>{item.name}</span>
    </li>
  );

  return (
    <section className={'group overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      {/* Keyframes injected inline so the component stays self-contained. */}
      <style>{'@keyframes adysreLogoScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}</style>
      <div className="flex w-max [animation:adysreLogoScroll_24s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
        <ul className="flex shrink-0 items-center gap-8 pr-8">{items.map((item) => chip(item, false))}</ul>
        <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">{items.map((item) => chip(item, true))}</ul>
      </div>
    </section>
  );
}`,
      typescript: `import type { JSX } from 'react';

export interface Logo {
  id: string;
  name: string;
  /** Tailwind gradient stops for the chip, e.g. 'from-blue-600 to-indigo-600'. */
  accent: string;
}

export interface CarouselLogoStripProps {
  items: Logo[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselLogoStrip({ items, className = '', ariaLabel = 'Trusted by' }: CarouselLogoStripProps): JSX.Element {
  const chip = (item: Logo, hidden: boolean): JSX.Element => (
    <li key={(hidden ? 'b-' : 'a-') + item.id}>
      <span className={'grid h-12 w-24 place-items-center rounded-lg bg-gradient-to-br text-sm font-semibold text-white ' + item.accent}>{item.name}</span>
    </li>
  );

  return (
    <section className={'group overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <style>{'@keyframes adysreLogoScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}</style>
      <div className="flex w-max [animation:adysreLogoScroll_24s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
        <ul className="flex shrink-0 items-center gap-8 pr-8">{items.map((item: Logo) => chip(item, false))}</ul>
        <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">{items.map((item: Logo) => chip(item, true))}</ul>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'carousel-fullscreen-hero',
    category: 'carousel',
    tags: ['carousel', 'hero', 'fullscreen', 'slider', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'HeroSlide[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', eyebrow: 'New', title: 'Ship faster', copy: '…', cta: 'Get started', background: 'bg-gradient-to-br from-blue-600 to-indigo-700' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Featured'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- A full-bleed hero carousel: each slide is a gradient panel with an eyebrow,
     heading, copy and a real CTA link. Overlaid arrows and dots keep contrast
     with a translucent chip behind them. Slides page with a transform. -->
<section class="relative overflow-hidden rounded-2xl" aria-roledescription="carousel" aria-label="Featured" data-fh>
  <div class="flex transition-transform duration-500 ease-out motion-reduce:transition-none" aria-live="polite" data-fh-track>
    <div class="flex min-h-[20rem] shrink-0 basis-full flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-14 text-white sm:px-12" role="group" aria-roledescription="slide" aria-label="1 of 2">
      <p class="text-xs font-semibold uppercase tracking-wide text-white/80">New</p>
      <h2 class="mt-2 max-w-lg text-3xl font-bold sm:text-4xl">Ship faster with one shared workspace</h2>
      <p class="mt-3 max-w-md text-sm leading-relaxed text-white/90">Docs, tasks and dashboards where your team already works.</p>
      <a class="mt-6 inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700" href="#">Get started</a>
    </div>
    <div class="flex min-h-[20rem] shrink-0 basis-full flex-col justify-center bg-gradient-to-br from-teal-700 to-emerald-700 px-6 py-14 text-white sm:px-12" role="group" aria-roledescription="slide" aria-label="2 of 2" aria-hidden="true">
      <p class="text-xs font-semibold uppercase tracking-wide text-white/80">Enterprise</p>
      <h2 class="mt-2 max-w-lg text-3xl font-bold sm:text-4xl">Security that clears the audit</h2>
      <p class="mt-3 max-w-md text-sm leading-relaxed text-white/90">SSO, SCIM and an immutable log, ready on day one.</p>
      <a class="mt-6 inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700" href="#">Talk to sales</a>
    </div>
  </div>

  <button class="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" aria-label="Previous slide" data-fh-prev>
    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </button>
  <button class="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" aria-label="Next slide" data-fh-next>
    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </button>

  <div class="absolute inset-x-0 bottom-4 flex justify-center gap-2" data-fh-dots>
    <button class="h-2 w-2 rounded-full bg-white/50 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white aria-[current=true]:w-5 aria-[current=true]:bg-white" type="button" aria-label="Go to slide 1" aria-current="true"></button>
    <button class="h-2 w-2 rounded-full bg-white/50 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white aria-[current=true]:w-5 aria-[current=true]:bg-white" type="button" aria-label="Go to slide 2"></button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-fh]').forEach(function (root) {
      var track = root.querySelector('[data-fh-track]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-fh-dots] button'));
      var index = 0;
      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(' + index * -100 + '%)';
        slides.forEach(function (s, i) { if (i === index) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
        dots.forEach(function (d, i) { if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      }
      root.querySelector('[data-fh-prev]').addEventListener('click', function () { go(index - 1); });
      root.querySelector('[data-fh-next]').addEventListener('click', function () { go(index + 1); });
      dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselFullscreenHero({ items, className = '', ariaLabel = 'Featured' }) {
  const [index, setIndex] = useState(0);
  const go = (next) => setIndex((next + items.length) % items.length);

  return (
    <section className={'relative overflow-hidden rounded-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" aria-live="polite" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
        {items.map((item, i) => (
          <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'flex min-h-[20rem] shrink-0 basis-full flex-col justify-center px-6 py-14 text-white sm:px-12 ' + item.background}>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{item.eyebrow}</p>
            <h2 className="mt-2 max-w-lg text-3xl font-bold sm:text-4xl">{item.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">{item.copy}</p>
            <a href={item.href ?? '#'} tabIndex={i === index ? 0 : -1} className="mt-6 inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2">{item.cta}</a>
          </div>
        ))}
      </div>

      <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {items.map((item, i) => (
          <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ' + (i === index ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80')} />
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  href?: string;
  /** Tailwind gradient utilities for the panel background. */
  background: string;
}

export interface CarouselFullscreenHeroProps {
  items: HeroSlide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselFullscreenHero({ items, className = '', ariaLabel = 'Featured' }: CarouselFullscreenHeroProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={'relative overflow-hidden rounded-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" aria-live="polite" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
        {items.map((item: HeroSlide, i: number) => (
          <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'flex min-h-[20rem] shrink-0 basis-full flex-col justify-center px-6 py-14 text-white sm:px-12 ' + item.background}>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{item.eyebrow}</p>
            <h2 className="mt-2 max-w-lg text-3xl font-bold sm:text-4xl">{item.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">{item.copy}</p>
            {/* Off-screen slides are removed from the tab order so focus never lands there. */}
            <a href={item.href ?? '#'} tabIndex={i === index ? 0 : -1} className="mt-6 inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2">{item.cta}</a>
          </div>
        ))}
      </div>

      <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {items.map((item: HeroSlide, i: number) => (
          <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ' + (i === index ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80')} />
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-thumbnail-sync',
    category: 'carousel',
    tags: ['carousel', 'thumbnails', 'sync', 'gallery', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Frame[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', label: 'Overview', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Gallery'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- Main stage synced to a thumbnail rail: arrows move the stage, and whichever
     thumb becomes current scrolls itself into view, so the rail and stage never
     drift apart. Each thumb is a real button labelled with the frame name. -->
<section class="max-w-2xl" aria-roledescription="carousel" aria-label="Screens" data-ts>
  <div class="overflow-hidden rounded-xl" aria-live="polite">
    <div class="flex transition-transform duration-500 ease-out motion-reduce:transition-none" data-ts-track>
      <div class="flex aspect-[16/9] shrink-0 basis-full items-end bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white" role="group" aria-roledescription="slide" aria-label="1 of 3"><span class="text-lg font-semibold">Overview</span></div>
      <div class="flex aspect-[16/9] shrink-0 basis-full items-end bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white" role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true"><span class="text-lg font-semibold">Reports</span></div>
      <div class="flex aspect-[16/9] shrink-0 basis-full items-end bg-gradient-to-br from-teal-700 to-sky-700 p-5 text-white" role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true"><span class="text-lg font-semibold">Settings</span></div>
    </div>
  </div>
  <div class="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-ts-thumbs>
    <button class="h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 opacity-50 ring-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-blue-600 dark:focus-visible:ring-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" aria-label="Show Overview" aria-current="true"></button>
    <button class="h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 opacity-50 ring-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-blue-600 dark:focus-visible:ring-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" aria-label="Show Reports"></button>
    <button class="h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br from-teal-700 to-sky-700 opacity-50 ring-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-blue-600 dark:focus-visible:ring-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" aria-label="Show Settings"></button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-ts]').forEach(function (root) {
      var track = root.querySelector('[data-ts-track]');
      var slides = Array.prototype.slice.call(track.children);
      var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-ts-thumbs] button'));
      var index = 0;
      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(' + index * -100 + '%)';
        slides.forEach(function (s, i) { if (i === index) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
        thumbs.forEach(function (t, i) {
          if (i === index) { t.setAttribute('aria-current', 'true'); t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
          else t.removeAttribute('aria-current');
        });
      }
      thumbs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });
    });
  })();
</script>`,
      react: `import { useRef, useState } from 'react';

export function CarouselThumbnailSync({ items, className = '', ariaLabel = 'Gallery' }) {
  const [index, setIndex] = useState(0);
  const thumbRefs = useRef([]);

  const go = (next) => {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    // Keep the active thumb visible in the rail when the stage moves.
    thumbRefs.current[wrapped]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-xl" aria-live="polite">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
          {items.map((item, i) => (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'flex aspect-[16/9] shrink-0 basis-full items-end p-5 text-white ' + item.background}>
              <span className="text-lg font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <button key={item.id} ref={(el) => { thumbRefs.current[i] = el; }} type="button" aria-label={'Show ' + item.label} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br ring-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ' + item.background + ' ' + (i === index ? 'opacity-100 !ring-blue-600 dark:!ring-blue-400' : 'opacity-50')} />
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useRef, useState } from 'react';

export interface Frame {
  id: string;
  label: string;
  /** Tailwind gradient utilities shared by the stage and its thumbnail. */
  background: string;
}

export interface CarouselThumbnailSyncProps {
  items: Frame[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselThumbnailSync({ items, className = '', ariaLabel = 'Gallery' }: CarouselThumbnailSyncProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (next: number): void => {
    const wrapped = (next + items.length) % items.length;
    setIndex(wrapped);
    thumbRefs.current[wrapped]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="overflow-hidden rounded-xl" aria-live="polite">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
          {items.map((item: Frame, i: number) => (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className={'flex aspect-[16/9] shrink-0 basis-full items-end p-5 text-white ' + item.background}>
              <span className="text-lg font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item: Frame, i: number) => (
          <button key={item.id} ref={(el) => { thumbRefs.current[i] = el; }} type="button" aria-label={'Show ' + item.label} aria-current={i === index ? true : undefined} onClick={() => go(i)} className={'h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br ring-2 ring-transparent transition focus-visible:outline-none focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ' + item.background + ' ' + (i === index ? 'opacity-100 !ring-blue-600 dark:!ring-blue-400' : 'opacity-50')} />
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'carousel-parallax',
    category: 'carousel',
    tags: ['carousel', 'parallax', 'depth', 'transform', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Slide[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', title: 'Analytics', copy: '…', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Carousel'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- Parallax: each panel translates a full 100% per step, but its gradient
     backdrop is counter-shifted 30% and over-scaled so it lags behind the text,
     reading as depth. Everything is transform-only and honours reduced motion. -->
<section class="relative h-64 overflow-hidden rounded-2xl" aria-roledescription="carousel" aria-label="Highlights" data-px>
  <div aria-live="polite">
    <div class="absolute inset-0 transition-transform duration-700 ease-out motion-reduce:transition-none" style="transform: translateX(0%);" data-px-panel role="group" aria-roledescription="slide" aria-label="1 of 3">
      <div class="absolute inset-0 scale-125 bg-gradient-to-br from-blue-600 to-indigo-700 transition-transform duration-700 ease-out motion-reduce:transition-none" style="transform: translateX(0%);" data-px-bg></div>
      <div class="relative flex h-full flex-col justify-end p-6 text-white sm:p-8"><h3 class="text-2xl font-bold">Analytics</h3><p class="mt-1 max-w-sm text-sm text-white/90">Every metric that matters, updated the moment it changes.</p></div>
    </div>
    <div class="absolute inset-0 transition-transform duration-700 ease-out motion-reduce:transition-none" style="transform: translateX(100%);" data-px-panel role="group" aria-roledescription="slide" aria-label="2 of 3" aria-hidden="true">
      <div class="absolute inset-0 scale-125 bg-gradient-to-br from-teal-700 to-emerald-700 transition-transform duration-700 ease-out motion-reduce:transition-none" style="transform: translateX(30%);" data-px-bg></div>
      <div class="relative flex h-full flex-col justify-end p-6 text-white sm:p-8"><h3 class="text-2xl font-bold">Automations</h3><p class="mt-1 max-w-sm text-sm text-white/90">Turn a repeated click into a rule that runs itself.</p></div>
    </div>
    <div class="absolute inset-0 transition-transform duration-700 ease-out motion-reduce:transition-none" style="transform: translateX(200%);" data-px-panel role="group" aria-roledescription="slide" aria-label="3 of 3" aria-hidden="true">
      <div class="absolute inset-0 scale-125 bg-gradient-to-br from-violet-700 to-fuchsia-700 transition-transform duration-700 ease-out motion-reduce:transition-none" style="transform: translateX(60%);" data-px-bg></div>
      <div class="relative flex h-full flex-col justify-end p-6 text-white sm:p-8"><h3 class="text-2xl font-bold">Integrations</h3><p class="mt-1 max-w-sm text-sm text-white/90">Forty connectors, and a webhook for everything else.</p></div>
    </div>
  </div>

  <button class="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" aria-label="Previous slide" data-px-prev>
    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </button>
  <button class="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" aria-label="Next slide" data-px-next>
    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </button>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-px]').forEach(function (root) {
      var panels = Array.prototype.slice.call(root.querySelectorAll('[data-px-panel]'));
      var index = 0;
      function go(next) {
        index = (next + panels.length) % panels.length;
        panels.forEach(function (panel, i) {
          var offset = i - index;
          panel.style.transform = 'translateX(' + offset * 100 + '%)';
          var bg = panel.querySelector('[data-px-bg]');
          if (bg) bg.style.transform = 'translateX(' + offset * 30 + '%)';
          if (i === index) panel.removeAttribute('aria-hidden');
          else panel.setAttribute('aria-hidden', 'true');
        });
      }
      root.querySelector('[data-px-prev]').addEventListener('click', function () { go(index - 1); });
      root.querySelector('[data-px-next]').addEventListener('click', function () { go(index + 1); });
    });
  })();
</script>`,
      react: `import { useState } from 'react';

export function CarouselParallax({ items, className = '', ariaLabel = 'Carousel' }) {
  const [index, setIndex] = useState(0);
  const go = (next) => setIndex((next + items.length) % items.length);

  return (
    <section className={'relative h-64 overflow-hidden rounded-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div aria-live="polite">
        {items.map((item, i) => {
          const offset = i - index;
          return (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className="absolute inset-0 transition-transform duration-700 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(' + offset * 100 + '%)' }}>
              {/* Backdrop lags at 30% and is over-scaled so its edges never show. */}
              <div className={'absolute inset-0 scale-125 transition-transform duration-700 ease-out motion-reduce:transition-none ' + item.background} style={{ transform: 'translateX(' + offset * 30 + '%)' }} />
              <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-1 max-w-sm text-sm text-white/90">{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the parallax backdrop. */
  background: string;
}

export interface CarouselParallaxProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselParallax({ items, className = '', ariaLabel = 'Carousel' }: CarouselParallaxProps): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const go = (next: number): void => setIndex((next + items.length) % items.length);

  return (
    <section className={'relative h-64 overflow-hidden rounded-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div aria-live="polite">
        {items.map((item: Slide, i: number) => {
          const offset = i - index;
          return (
            <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} aria-hidden={i !== index} className="absolute inset-0 transition-transform duration-700 ease-out motion-reduce:transition-none" style={{ transform: 'translateX(' + offset * 100 + '%)' }}>
              <div className={'absolute inset-0 scale-125 transition-transform duration-700 ease-out motion-reduce:transition-none ' + item.background} style={{ transform: 'translateX(' + offset * 30 + '%)' }} />
              <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-1 max-w-sm text-sm text-white/90">{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m12.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </section>
  );
}`,
    },
  },

  {
    slug: 'carousel-scroll-snap',
    category: 'carousel',
    tags: ['carousel', 'scroll-snap', 'css', 'slider', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'Slide[]', required: true, descriptionKey: 'items', example: "[{ id: 'a', title: 'Analytics', copy: '…', background: 'bg-gradient-to-br from-blue-600 to-indigo-600' }]" },
      { name: 'className', type: 'string', descriptionKey: 'className' },
      { name: 'ariaLabel', type: 'string', default: "'Carousel'", descriptionKey: 'ariaLabel' },
    ],
    code: {
      tailwind: `<!-- The whole carousel is one scroll-snap container: swipe, trackpad and the
     browser's own focus scrolling all page it for free. The track is a focusable
     scroll region; the dots call scrollTo, and no transform is ever set. -->
<section class="max-w-2xl" aria-roledescription="carousel" aria-label="Product highlights" data-ss>
  <div class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden" role="group" aria-label="Slides, scrollable" tabindex="0" data-ss-track>
    <div class="w-full shrink-0 snap-center basis-full bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="1 of 3"><h3 class="mb-2 text-xl font-semibold">Analytics</h3><p class="text-sm leading-relaxed text-white/90">Every metric that matters, updated the moment it changes.</p></div>
    <div class="w-full shrink-0 snap-center basis-full bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="2 of 3"><h3 class="mb-2 text-xl font-semibold">Automations</h3><p class="text-sm leading-relaxed text-white/90">Turn a repeated click into a rule that runs itself.</p></div>
    <div class="w-full shrink-0 snap-center basis-full bg-gradient-to-br from-teal-700 to-sky-700 px-8 py-12 text-white" role="group" aria-roledescription="slide" aria-label="3 of 3"><h3 class="mb-2 text-xl font-semibold">Integrations</h3><p class="text-sm leading-relaxed text-white/90">Forty connectors, and a webhook for everything else.</p></div>
  </div>
  <div class="mt-3 flex justify-center gap-2" data-ss-dots>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Go to slide 1"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Go to slide 2"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:hover:bg-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Go to slide 3"></button>
  </div>
</section>

<script>
  (function () {
    document.querySelectorAll('[data-ss]').forEach(function (root) {
      var track = root.querySelector('[data-ss-track]');
      var slides = Array.prototype.slice.call(track.children);
      var dots = Array.prototype.slice.call(root.querySelectorAll('[data-ss-dots] button'));
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          var slide = slides[i];
          if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        });
      });
      // Reflect the scrolled position on the dots.
      track.addEventListener('scroll', function () {
        var current = Math.round(track.scrollLeft / track.clientWidth);
        dots.forEach(function (dot, i) { if (i === current) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
      });
      var first = dots[0];
      if (first) first.setAttribute('aria-current', 'true');
    });
  })();
</script>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function CarouselScrollSnap({ items, className = '', ariaLabel = 'Carousel' }) {
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => setCurrent(Math.round(track.scrollLeft / track.clientWidth));
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i];
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div ref={trackRef} role="group" aria-label="Slides, scrollable" tabIndex={0} className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} className={'w-full shrink-0 snap-center basis-full px-8 py-12 text-white ' + item.background}>
            <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
            <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {items.map((item, i) => (
          <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === current ? true : undefined} onClick={() => goTo(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === current ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';

export interface Slide {
  id: string;
  title: string;
  copy: string;
  /** Tailwind gradient utilities for the slide's background. */
  background: string;
}

export interface CarouselScrollSnapProps {
  items: Slide[];
  className?: string;
  ariaLabel?: string;
}

export function CarouselScrollSnap({ items, className = '', ariaLabel = 'Carousel' }: CarouselScrollSnapProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = (): void => setCurrent(Math.round(track.scrollLeft / track.clientWidth));
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number): void => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section className={'max-w-2xl ' + className} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div ref={trackRef} role="group" aria-label="Slides, scrollable" tabIndex={0} className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:scroll-auto dark:focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden">
        {items.map((item: Slide, i: number) => (
          <div key={item.id} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + items.length} className={'w-full shrink-0 snap-center basis-full px-8 py-12 text-white ' + item.background}>
            <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
            <p className="text-sm leading-relaxed text-white/90">{item.copy}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {items.map((item: Slide, i: number) => (
          <button key={item.id} type="button" aria-label={'Go to slide ' + (i + 1)} aria-current={i === current ? true : undefined} onClick={() => goTo(i)} className={'h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + (i === current ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-2 bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400')} />
        ))}
      </div>
    </section>
  );
}`,
    },
  },
];
