import type { ComponentEntry } from './types';

/**
 * Pricing category.
 *
 * These are page-level pricing *sections*, which is what separates them from
 * `pricing-card` in the cards category: that one is a single tier you compose
 * yourself, these are the whole comparison surface - the grid, the switch, the
 * table, the calculator - with the cross-tier decisions already made.
 *
 * The recurring problem across all five is that price is a number a user has to
 * trust. Every variant here keeps the amount as real text (never a background
 * image, never an icon), and every control that changes it says so out loud.
 */
export const pricingComponents: ComponentEntry[] = [
  {
    slug: 'pricing-three-tier',
    category: 'pricing',
    tags: ['pricing', 'tiers', 'saas', 'grid', 'plans'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.3.0',
    featured: true,
    stats: { views: 3180, copies: 842, downloads: 231 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'tiers', type: 'Tier[]', default: 'TIERS', descriptionKey: 'tiers' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The tiers are a <ul>, not three sibling <article>s. A screen reader then
  announces "list, 3 items" before the first plan, which is the one fact a
  non-sighted user cannot get any other way: how many options they are choosing
  between. The visual grid is the list's styling, not its structure.
-->
<section class="tiers" aria-labelledby="tiers-heading">
  <h2 class="tiers__heading" id="tiers-heading">Simple, predictable pricing</h2>
  <p class="tiers__sub">No setup fees. Cancel any time.</p>

  <ul class="tiers__list">
    <li class="tiers__item">
      <article class="tiers__card" aria-labelledby="tiers-starter">
        <h3 class="tiers__name" id="tiers-starter">Starter</h3>
        <p class="tiers__blurb">For side projects and trials.</p>

        <p class="tiers__price">
          <span class="tiers__amount">$0</span>
          <span class="tiers__period">/month</span>
        </p>

        <ul class="tiers__features">
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            3 projects
          </li>
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Community support
          </li>
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            1 GB storage
          </li>
        </ul>

        <a class="tiers__cta" href="#">Get started<span class="tiers__sr"> with Starter</span></a>
      </article>
    </li>

    <li class="tiers__item">
      <article class="tiers__card tiers__card--highlighted" aria-labelledby="tiers-pro">
        <p class="tiers__badge">Most popular</p>

        <h3 class="tiers__name" id="tiers-pro">Pro</h3>
        <p class="tiers__blurb">For teams shipping to production.</p>

        <p class="tiers__price">
          <span class="tiers__amount">$19</span>
          <span class="tiers__period">/month</span>
        </p>

        <ul class="tiers__features">
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Unlimited projects
          </li>
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Priority support
          </li>
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            100 GB storage
          </li>
        </ul>

        <a class="tiers__cta tiers__cta--solid" href="#">Get started<span class="tiers__sr"> with Pro</span></a>
      </article>
    </li>

    <li class="tiers__item">
      <article class="tiers__card" aria-labelledby="tiers-enterprise">
        <h3 class="tiers__name" id="tiers-enterprise">Enterprise</h3>
        <p class="tiers__blurb">For organisations with contracts.</p>

        <p class="tiers__price">
          <span class="tiers__amount">$49</span>
          <span class="tiers__period">/month</span>
        </p>

        <ul class="tiers__features">
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            SSO and SCIM
          </li>
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            99.9% uptime SLA
          </li>
          <li class="tiers__feature">
            <svg class="tiers__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Unlimited storage
          </li>
        </ul>

        <a class="tiers__cta" href="#">Get started<span class="tiers__sr"> with Enterprise</span></a>
      </article>
    </li>
  </ul>
</section>`,
      css: `.tiers {
  max-width: 64rem;
  margin: 0 auto;
}

.tiers__heading {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  color: #111827;
}

.tiers__sub {
  margin: 0.5rem 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
}

.tiers__list {
  display: grid;
  gap: 1.5rem;
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

/*
 * One column until there is room for three. Two columns is deliberately skipped:
 * at that width the third tier wraps alone onto a second row and reads as an
 * afterthought rather than as a peer of the other two.
 */
@media (min-width: 56rem) {
  .tiers__list {
    grid-template-columns: repeat(3, 1fr);
    /* Stretch so a tier with one extra feature does not make its card taller. */
    align-items: stretch;
  }
}

.tiers__item {
  display: flex;
}

.tiers__card {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.tiers__card--highlighted {
  border-color: #2563eb;
  box-shadow: 0 20px 40px -24px rgba(37, 99, 235, 0.55);
}

.tiers__badge {
  position: absolute;
  top: -0.75rem;
  left: 1.75rem;
  margin: 0;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  background: #2563eb;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.tiers__name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.tiers__blurb {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: #4b5563;
}

.tiers__price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 1.25rem 0 0;
}

.tiers__amount {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.tiers__period {
  font-size: 0.875rem;
  color: #4b5563;
}

.tiers__features {
  flex: 1;
  display: grid;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 0;
  list-style: none;
}

.tiers__feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.tiers__check {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #2563eb;
}

.tiers__cta {
  display: block;
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: transparent;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background-color 150ms, color 150ms;
}

.tiers__cta:hover {
  background: #f3f4f6;
}

.tiers__cta--solid {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

.tiers__cta--solid:hover {
  background: #1d4ed8;
}

.tiers__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * Three CTAs that all say "Get started" are indistinguishable in a screen
 * reader's link list, where links are read out of context. The suffix names the
 * tier for that list without repeating it visually.
 */
.tiers__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The badge and the solid CTA keep #2563eb - white on it clears AA on either
 * theme - while every surface that inherits the page background is re-tuned.
 */
@media (prefers-color-scheme: dark) {
  .tiers__heading,
  .tiers__name,
  .tiers__amount {
    color: #f3f4f6;
  }

  .tiers__sub,
  .tiers__blurb,
  .tiers__period {
    color: #9ca3af;
  }

  .tiers__card {
    border-color: #1f2937;
    background: #111827;
  }

  .tiers__card--highlighted {
    border-color: #2563eb;
  }

  .tiers__feature {
    color: #d1d5db;
  }

  .tiers__check {
    color: #60a5fa;
  }

  .tiers__cta {
    border-color: #374151;
    color: #93c5fd;
  }

  .tiers__cta:hover {
    background: #1f2937;
  }

  .tiers__cta--solid {
    border-color: #2563eb;
    color: #fff;
  }

  .tiers__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tiers__cta {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto max-w-5xl" aria-labelledby="tiers-heading">
  <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100" id="tiers-heading">
    Simple, predictable pricing
  </h2>
  <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">No setup fees. Cancel any time.</p>

  <ul class="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-labelledby="tiers-starter">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="tiers-starter">Starter</h3>
        <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">For side projects and trials.</p>

        <p class="mt-5 flex items-baseline gap-1">
          <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$0</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>

        <ul class="my-6 grid flex-1 gap-3">
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            3 projects
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Community support
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            1 GB storage
          </li>
        </ul>

        <a href="#" class="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          Get started<span class="sr-only"> with Starter</span>
        </a>
      </article>
    </li>

    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl border border-blue-600 bg-white p-7 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)] dark:bg-gray-900" aria-labelledby="tiers-pro">
        <p class="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
          Most popular
        </p>

        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="tiers-pro">Pro</h3>
        <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">For teams shipping to production.</p>

        <p class="mt-5 flex items-baseline gap-1">
          <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$19</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>

        <ul class="my-6 grid flex-1 gap-3">
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Unlimited projects
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Priority support
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            100 GB storage
          </li>
        </ul>

        <a href="#" class="block rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          Get started<span class="sr-only"> with Pro</span>
        </a>
      </article>
    </li>

    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-labelledby="tiers-enterprise">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="tiers-enterprise">Enterprise</h3>
        <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">For organisations with contracts.</p>

        <p class="mt-5 flex items-baseline gap-1">
          <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$49</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>

        <ul class="my-6 grid flex-1 gap-3">
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            SSO and SCIM
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            99.9% uptime SLA
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            Unlimited storage
          </li>
        </ul>

        <a href="#" class="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          Get started<span class="sr-only"> with Enterprise</span>
        </a>
      </article>
    </li>
  </ul>
</section>`,
      react: `const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For side projects and trials.',
    price: '$0',
    period: '/month',
    features: ['3 projects', 'Community support', '1 GB storage'],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    blurb: 'For teams shipping to production.',
    price: '$19',
    period: '/month',
    features: ['Unlimited projects', 'Priority support', '100 GB storage'],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    blurb: 'For organisations with contracts.',
    price: '$49',
    period: '/month',
    features: ['SSO and SCIM', '99.9% uptime SLA', 'Unlimited storage'],
    highlighted: false,
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingThreeTier({ tiers = TIERS, ctaLabel = 'Get started', className = '' }) {
  return (
    <section className={\`mx-auto max-w-5xl \${className}\`} aria-labelledby="tiers-heading">
      <h2
        className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="tiers-heading"
      >
        Simple, predictable pricing
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        No setup fees. Cancel any time.
      </p>

      <ul className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`tiers-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-7 dark:bg-gray-900',
                tier.highlighted
                  ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
                  : 'border border-gray-200 shadow-sm dark:border-gray-800',
              ].join(' ')}
            >
              {tier.highlighted && (
                <p className="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
                  Most popular
                </p>
              )}

              <h3
                className="text-base font-semibold text-gray-900 dark:text-gray-100"
                id={\`tiers-\${tier.id}\`}
              >
                {tier.name}
              </h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{tier.blurb}</p>

              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {tier.price}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>

              <ul className="my-6 grid flex-1 gap-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={[
                  'block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted
                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                {/* Out of context every CTA reads "Get started"; this names the tier. */}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      nextjs: `import Link from 'next/link';

// Nothing here holds state - the grid is a static price list, so it stays a
// Server Component and ships no JavaScript at all.
interface Tier {
  id: string;
  name: string;
  blurb: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

interface PricingThreeTierProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For side projects and trials.',
    price: '$0',
    period: '/month',
    features: ['3 projects', 'Community support', '1 GB storage'],
  },
  {
    id: 'pro',
    name: 'Pro',
    blurb: 'For teams shipping to production.',
    price: '$19',
    period: '/month',
    features: ['Unlimited projects', 'Priority support', '100 GB storage'],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    blurb: 'For organisations with contracts.',
    price: '$49',
    period: '/month',
    features: ['SSO and SCIM', '99.9% uptime SLA', 'Unlimited storage'],
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingThreeTier({
  tiers = TIERS,
  ctaLabel = 'Get started',
  className = '',
}: PricingThreeTierProps) {
  return (
    <section className={\`mx-auto max-w-5xl \${className}\`} aria-labelledby="tiers-heading">
      <h2
        className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="tiers-heading"
      >
        Simple, predictable pricing
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        No setup fees. Cancel any time.
      </p>

      <ul className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`tiers-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-7 dark:bg-gray-900',
                tier.highlighted
                  ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
                  : 'border border-gray-200 shadow-sm dark:border-gray-800',
              ].join(' ')}
            >
              {tier.highlighted && (
                <p className="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
                  Most popular
                </p>
              )}

              <h3
                className="text-base font-semibold text-gray-900 dark:text-gray-100"
                id={\`tiers-\${tier.id}\`}
              >
                {tier.name}
              </h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{tier.blurb}</p>

              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {tier.price}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>

              <ul className="my-6 grid flex-1 gap-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={\`/signup?plan=\${tier.id}\`}
                className={[
                  'block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted
                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Tier {
  id: string;
  name: string;
  blurb: string;
  price: string;
  /** Rendered next to the amount, e.g. "/month". Kept separate so the amount
   *  can carry its own type scale without a nested span in the data. */
  period: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingThreeTierProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For side projects and trials.',
    price: '$0',
    period: '/month',
    features: ['3 projects', 'Community support', '1 GB storage'],
  },
  {
    id: 'pro',
    name: 'Pro',
    blurb: 'For teams shipping to production.',
    price: '$19',
    period: '/month',
    features: ['Unlimited projects', 'Priority support', '100 GB storage'],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    blurb: 'For organisations with contracts.',
    price: '$49',
    period: '/month',
    features: ['SSO and SCIM', '99.9% uptime SLA', 'Unlimited storage'],
  },
];

function CheckIcon(): JSX.Element {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingThreeTier({
  tiers = TIERS,
  ctaLabel = 'Get started',
  className = '',
}: PricingThreeTierProps): JSX.Element {
  return (
    <section className={\`mx-auto max-w-5xl \${className}\`} aria-labelledby="tiers-heading">
      <h2
        className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="tiers-heading"
      >
        Simple, predictable pricing
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        No setup fees. Cancel any time.
      </p>

      <ul className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier: Tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`tiers-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-7 dark:bg-gray-900',
                tier.highlighted
                  ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
                  : 'border border-gray-200 shadow-sm dark:border-gray-800',
              ].join(' ')}
            >
              {tier.highlighted ? (
                <p className="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
                  Most popular
                </p>
              ) : null}

              <h3
                className="text-base font-semibold text-gray-900 dark:text-gray-100"
                id={\`tiers-\${tier.id}\`}
              >
                {tier.name}
              </h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{tier.blurb}</p>

              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {tier.price}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>

              <ul className="my-6 grid flex-1 gap-3">
                {tier.features.map((feature: string) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={\`/signup?plan=\${tier.id}\`}
                className={[
                  'block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted
                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-toggle-billing',
    category: 'pricing',
    tags: ['pricing', 'toggle', 'switch', 'billing', 'annual'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-11',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2260, copies: 597, downloads: 164 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Choose plan'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A switch is an on/off control, so it takes ONE label describing the on state
  ("Bill annually") - not the "Monthly | Annually" pair you usually see, which
  is really a two-option choice wearing a switch's clothes. If both periods
  deserve equal weight, use the radio fieldset in the Customization notes
  instead; role="switch" then becomes a lie about what the control does.

  The savings badge sits outside the label so "Save 20%" is not read as part of
  the switch's accessible name.
-->
<section class="billing" aria-labelledby="billing-heading">
  <h2 class="billing__heading" id="billing-heading">Pricing</h2>

  <div class="billing__control">
    <span class="billing__label" id="billing-switch-label">Bill annually</span>
    <button
      class="billing__switch"
      type="button"
      role="switch"
      aria-checked="false"
      aria-labelledby="billing-switch-label"
      aria-describedby="billing-save"
    >
      <span class="billing__thumb" aria-hidden="true"></span>
    </button>
    <span class="billing__save" id="billing-save">Save 20%</span>
  </div>

  <ul class="billing__list">
    <li class="billing__item">
      <article class="billing__card" aria-labelledby="billing-starter">
        <h3 class="billing__name" id="billing-starter">Starter</h3>
        <p class="billing__price">
          <!--
            data-* holds both amounts so the script never does arithmetic on a
            rendered string - parsing "$19" back into a number is how currency
            symbols and thousands separators break a pricing page.
          -->
          <span class="billing__amount" data-monthly="$0" data-annual="$0">$0</span>
          <span class="billing__period">/month</span>
        </p>
        <p class="billing__note" data-monthly="Free forever" data-annual="Free forever">Free forever</p>
        <a class="billing__cta" href="#">Choose plan<span class="billing__sr"> Starter</span></a>
      </article>
    </li>

    <li class="billing__item">
      <article class="billing__card billing__card--highlighted" aria-labelledby="billing-pro">
        <h3 class="billing__name" id="billing-pro">Pro</h3>
        <p class="billing__price">
          <span class="billing__amount" data-monthly="$19" data-annual="$15">$19</span>
          <span class="billing__period">/month</span>
        </p>
        <p class="billing__note" data-monthly="Billed monthly" data-annual="Billed $180 annually">Billed monthly</p>
        <a class="billing__cta billing__cta--solid" href="#">Choose plan<span class="billing__sr"> Pro</span></a>
      </article>
    </li>

    <li class="billing__item">
      <article class="billing__card" aria-labelledby="billing-enterprise">
        <h3 class="billing__name" id="billing-enterprise">Enterprise</h3>
        <p class="billing__price">
          <span class="billing__amount" data-monthly="$49" data-annual="$39">$49</span>
          <span class="billing__period">/month</span>
        </p>
        <p class="billing__note" data-monthly="Billed monthly" data-annual="Billed $468 annually">Billed monthly</p>
        <a class="billing__cta" href="#">Choose plan<span class="billing__sr"> Enterprise</span></a>
      </article>
    </li>
  </ul>
</section>

<script>
  document.querySelectorAll('.billing').forEach(function (root) {
    var toggle = root.querySelector('.billing__switch');
    var swappable = root.querySelectorAll('[data-monthly]');

    function render(annual) {
      toggle.setAttribute('aria-checked', String(annual));
      swappable.forEach(function (node) {
        node.textContent = annual ? node.dataset.annual : node.dataset.monthly;
      });
    }

    toggle.addEventListener('click', function () {
      render(toggle.getAttribute('aria-checked') !== 'true');
    });

    // role="switch" on a <button> already gives Enter and Space for free - the
    // browser fires click for both - so there is no keydown handler here.
    render(false);
  });
</script>`,
      css: `.billing {
  max-width: 60rem;
  margin: 0 auto;
}

.billing__heading {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  color: #111827;
}

.billing__control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.billing__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.billing__switch {
  position: relative;
  flex: none;
  width: 2.75rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background: #9ca3af;
  cursor: pointer;
  transition: background-color 150ms;
}

/*
 * The checked state is styled off the ARIA attribute rather than a class, so the
 * only way to make the switch *look* on is to also tell assistive tech it is on.
 * The two cannot drift apart.
 */
.billing__switch[aria-checked='true'] {
  background: #2563eb;
}

.billing__switch:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.billing__thumb {
  position: absolute;
  top: 0.1875rem;
  left: 0.1875rem;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 9999px;
  background: #fff;
  transition: transform 150ms;
}

.billing__switch[aria-checked='true'] .billing__thumb {
  transform: translateX(1.25rem);
}

.billing__save {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: #dcfce7;
  color: #166534;
  font-size: 0.75rem;
  font-weight: 600;
}

.billing__list {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 52rem) {
  .billing__list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.billing__item {
  display: flex;
}

.billing__card {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
}

.billing__card--highlighted {
  border-color: #2563eb;
}

.billing__name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.billing__price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 0.75rem 0 0;
}

.billing__amount {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
  /* Tabular figures stop the row jiggling as $19 swaps to $15. */
  font-variant-numeric: tabular-nums;
}

.billing__period {
  font-size: 0.875rem;
  color: #4b5563;
}

.billing__note {
  /* Reserved height: without it the card grows by a line when the annual note
     wraps, and the whole grid reflows mid-toggle. */
  min-height: 2.5rem;
  margin: 0.5rem 0 1.25rem;
  font-size: 0.8125rem;
  color: #4b5563;
}

.billing__cta {
  display: block;
  margin-top: auto;
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.billing__cta--solid {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

.billing__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.billing__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The savings badge is the one to watch - #166534 on #dcfce7 is a light-mode
 * pairing, and inverting only the background would drop it far below AA, so
 * both halves flip together.
 */
@media (prefers-color-scheme: dark) {
  .billing__heading,
  .billing__name,
  .billing__amount {
    color: #f3f4f6;
  }

  .billing__label {
    color: #d1d5db;
  }

  .billing__period,
  .billing__note {
    color: #9ca3af;
  }

  .billing__switch {
    background: #4b5563;
  }

  .billing__save {
    background: #14532d;
    color: #bbf7d0;
  }

  .billing__card {
    border-color: #1f2937;
    background: #111827;
  }

  .billing__card--highlighted {
    border-color: #2563eb;
  }

  .billing__cta {
    border-color: #374151;
    color: #93c5fd;
  }

  .billing__cta--solid {
    border-color: #2563eb;
    color: #fff;
  }

  .billing__switch:focus-visible,
  .billing__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .billing__switch,
  .billing__thumb {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto max-w-4xl" aria-labelledby="billing-heading">
  <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100" id="billing-heading">
    Pricing
  </h2>

  <div class="mt-6 flex items-center justify-center gap-3">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300" id="billing-switch-label">Bill annually</span>
    <button
      type="button"
      role="switch"
      aria-checked="false"
      aria-labelledby="billing-switch-label"
      aria-describedby="billing-save"
      class="group relative h-6 w-11 flex-none rounded-full bg-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-checked:bg-blue-600 dark:bg-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <span
        class="absolute left-[0.1875rem] top-[0.1875rem] h-[1.125rem] w-[1.125rem] rounded-full bg-white transition-transform group-aria-checked:translate-x-5 motion-reduce:transition-none"
        aria-hidden="true"
      ></span>
    </button>
    <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200" id="billing-save">
      Save 20%
    </span>
  </div>

  <ul class="mt-8 grid gap-6 md:grid-cols-3">
    <li class="flex">
      <article class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" aria-labelledby="billing-starter">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="billing-starter">Starter</h3>
        <p class="mt-3 flex items-baseline gap-1">
          <span class="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100" data-monthly="$0" data-annual="$0">$0</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>
        <p class="mb-5 mt-2 min-h-10 text-[0.8125rem] text-gray-600 dark:text-gray-400" data-monthly="Free forever" data-annual="Free forever">Free forever</p>
        <a href="#" class="mt-auto block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          Choose plan<span class="sr-only"> Starter</span>
        </a>
      </article>
    </li>

    <li class="flex">
      <article class="flex flex-1 flex-col rounded-2xl border border-blue-600 bg-white p-6 dark:bg-gray-900" aria-labelledby="billing-pro">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="billing-pro">Pro</h3>
        <p class="mt-3 flex items-baseline gap-1">
          <span class="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100" data-monthly="$19" data-annual="$15">$19</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>
        <p class="mb-5 mt-2 min-h-10 text-[0.8125rem] text-gray-600 dark:text-gray-400" data-monthly="Billed monthly" data-annual="Billed $180 annually">Billed monthly</p>
        <a href="#" class="mt-auto block rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          Choose plan<span class="sr-only"> Pro</span>
        </a>
      </article>
    </li>

    <li class="flex">
      <article class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" aria-labelledby="billing-enterprise">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="billing-enterprise">Enterprise</h3>
        <p class="mt-3 flex items-baseline gap-1">
          <span class="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100" data-monthly="$49" data-annual="$39">$49</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>
        <p class="mb-5 mt-2 min-h-10 text-[0.8125rem] text-gray-600 dark:text-gray-400" data-monthly="Billed monthly" data-annual="Billed $468 annually">Billed monthly</p>
        <a href="#" class="mt-auto block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          Choose plan<span class="sr-only"> Enterprise</span>
        </a>
      </article>
    </li>
  </ul>
</section>

<script>
  document.querySelectorAll('[role="switch"][aria-labelledby="billing-switch-label"]').forEach(function (toggle) {
    var root = toggle.closest('section');
    var swappable = root.querySelectorAll('[data-monthly]');

    function render(annual) {
      toggle.setAttribute('aria-checked', String(annual));
      swappable.forEach(function (node) {
        node.textContent = annual ? node.dataset.annual : node.dataset.monthly;
      });
    }

    toggle.addEventListener('click', function () {
      render(toggle.getAttribute('aria-checked') !== 'true');
    });
  });
</script>`,
      react: `import { useState } from 'react';

const TIERS = [
  { id: 'starter', name: 'Starter', monthly: 0, annual: 0, highlighted: false },
  { id: 'pro', name: 'Pro', monthly: 19, annual: 15, highlighted: true },
  { id: 'enterprise', name: 'Enterprise', monthly: 49, annual: 39, highlighted: false },
];

export function PricingToggleBilling({ ctaLabel = 'Choose plan', className = '' }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section className={\`mx-auto max-w-4xl \${className}\`} aria-labelledby="billing-heading">
      <h2
        className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="billing-heading"
      >
        Pricing
      </h2>

      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300" id="billing-switch-label">
          Bill annually
        </span>
        {/*
          A real button with role="switch": Enter and Space come from the button,
          so there is no key handling to write and none to get wrong.
        */}
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-labelledby="billing-switch-label"
          aria-describedby="billing-save"
          onClick={() => setAnnual((value) => !value)}
          className="group relative h-6 w-11 flex-none rounded-full bg-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-checked:bg-blue-600 dark:bg-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <span
            className="absolute left-[0.1875rem] top-[0.1875rem] h-[1.125rem] w-[1.125rem] rounded-full bg-white transition-transform group-aria-checked:translate-x-5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
        <span
          className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200"
          id="billing-save"
        >
          Save 20%
        </span>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => {
          const amount = annual ? tier.annual : tier.monthly;
          const note =
            amount === 0
              ? 'Free forever'
              : annual
                ? \`Billed $\${tier.annual * 12} annually\`
                : 'Billed monthly';

          return (
            <li className="flex" key={tier.id}>
              <article
                aria-labelledby={\`billing-\${tier.id}\`}
                className={[
                  'flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                  tier.highlighted
                    ? 'border border-blue-600'
                    : 'border border-gray-200 dark:border-gray-800',
                ].join(' ')}
              >
                <h3
                  className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  id={\`billing-\${tier.id}\`}
                >
                  {tier.name}
                </h3>

                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
                    \${amount}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                </p>

                <p className="mb-5 mt-2 min-h-10 text-[0.8125rem] text-gray-600 dark:text-gray-400">
                  {note}
                </p>

                <a
                  href="#"
                  className={[
                    'mt-auto block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                    tier.highlighted
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-blue-700 dark:border-gray-700 dark:text-blue-300',
                  ].join(' ')}
                >
                  {ctaLabel}
                  <span className="sr-only"> {tier.name}</span>
                </a>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}`,
      nextjs: `'use client';

import { useState } from 'react';

interface Tier {
  id: string;
  name: string;
  /** Amounts are numbers, not "$19" strings - the annual total is arithmetic,
   *  and formatting a number is far easier than parsing a formatted one back. */
  monthly: number;
  annual: number;
  highlighted?: boolean;
}

interface PricingToggleBillingProps {
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  { id: 'starter', name: 'Starter', monthly: 0, annual: 0 },
  { id: 'pro', name: 'Pro', monthly: 19, annual: 15, highlighted: true },
  { id: 'enterprise', name: 'Enterprise', monthly: 49, annual: 39 },
];

export function PricingToggleBilling({
  ctaLabel = 'Choose plan',
  className = '',
}: PricingToggleBillingProps) {
  const [annual, setAnnual] = useState<boolean>(false);

  return (
    <section className={\`mx-auto max-w-4xl \${className}\`} aria-labelledby="billing-heading">
      <h2
        className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="billing-heading"
      >
        Pricing
      </h2>

      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300" id="billing-switch-label">
          Bill annually
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-labelledby="billing-switch-label"
          aria-describedby="billing-save"
          onClick={() => setAnnual((value) => !value)}
          className="group relative h-6 w-11 flex-none rounded-full bg-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-checked:bg-blue-600 dark:bg-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <span
            className="absolute left-[0.1875rem] top-[0.1875rem] h-[1.125rem] w-[1.125rem] rounded-full bg-white transition-transform group-aria-checked:translate-x-5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
        <span
          className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200"
          id="billing-save"
        >
          Save 20%
        </span>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => {
          const amount = annual ? tier.annual : tier.monthly;
          const note =
            amount === 0
              ? 'Free forever'
              : annual
                ? \`Billed $\${tier.annual * 12} annually\`
                : 'Billed monthly';

          return (
            <li className="flex" key={tier.id}>
              <article
                aria-labelledby={\`billing-\${tier.id}\`}
                className={[
                  'flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                  tier.highlighted
                    ? 'border border-blue-600'
                    : 'border border-gray-200 dark:border-gray-800',
                ].join(' ')}
              >
                <h3
                  className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  id={\`billing-\${tier.id}\`}
                >
                  {tier.name}
                </h3>

                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
                    \${amount}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                </p>

                <p className="mb-5 mt-2 min-h-10 text-[0.8125rem] text-gray-600 dark:text-gray-400">
                  {note}
                </p>

                <a
                  href={\`/signup?plan=\${tier.id}&period=\${annual ? 'annual' : 'monthly'}\`}
                  className={[
                    'mt-auto block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                    tier.highlighted
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-blue-700 dark:border-gray-700 dark:text-blue-300',
                  ].join(' ')}
                >
                  {ctaLabel}
                  <span className="sr-only"> {tier.name}</span>
                </a>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface Tier {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  highlighted?: boolean;
}

export interface PricingToggleBillingProps {
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  { id: 'starter', name: 'Starter', monthly: 0, annual: 0 },
  { id: 'pro', name: 'Pro', monthly: 19, annual: 15, highlighted: true },
  { id: 'enterprise', name: 'Enterprise', monthly: 49, annual: 39 },
];

export function PricingToggleBilling({
  ctaLabel = 'Choose plan',
  className = '',
}: PricingToggleBillingProps): JSX.Element {
  const [annual, setAnnual] = useState<boolean>(false);

  return (
    <section className={\`mx-auto max-w-4xl \${className}\`} aria-labelledby="billing-heading">
      <h2
        className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="billing-heading"
      >
        Pricing
      </h2>

      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300" id="billing-switch-label">
          Bill annually
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-labelledby="billing-switch-label"
          aria-describedby="billing-save"
          onClick={() => setAnnual((value: boolean) => !value)}
          className="group relative h-6 w-11 flex-none rounded-full bg-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-checked:bg-blue-600 dark:bg-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <span
            className="absolute left-[0.1875rem] top-[0.1875rem] h-[1.125rem] w-[1.125rem] rounded-full bg-white transition-transform group-aria-checked:translate-x-5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
        <span
          className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200"
          id="billing-save"
        >
          Save 20%
        </span>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier: Tier) => {
          const amount: number = annual ? tier.annual : tier.monthly;
          const note: string =
            amount === 0
              ? 'Free forever'
              : annual
                ? \`Billed $\${tier.annual * 12} annually\`
                : 'Billed monthly';

          return (
            <li className="flex" key={tier.id}>
              <article
                aria-labelledby={\`billing-\${tier.id}\`}
                className={[
                  'flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                  tier.highlighted
                    ? 'border border-blue-600'
                    : 'border border-gray-200 dark:border-gray-800',
                ].join(' ')}
              >
                <h3
                  className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  id={\`billing-\${tier.id}\`}
                >
                  {tier.name}
                </h3>

                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
                    \${amount}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                </p>

                <p className="mb-5 mt-2 min-h-10 text-[0.8125rem] text-gray-600 dark:text-gray-400">
                  {note}
                </p>

                <a
                  href={\`/signup?plan=\${tier.id}\`}
                  className={[
                    'mt-auto block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                    tier.highlighted
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-blue-700 dark:border-gray-700 dark:text-blue-300',
                  ].join(' ')}
                >
                  {ctaLabel}
                  <span className="sr-only"> {tier.name}</span>
                </a>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-single-card',
    category: 'pricing',
    tags: ['pricing', 'single', 'split', 'card', 'cta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-29',
    updatedAt: '2026-06-20',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1490, copies: 386, downloads: 97 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'highlighted', labelKey: 'highlighted' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name', example: "'Pro'" },
      { name: 'price', type: 'string', required: true, descriptionKey: 'price', example: '$19' },
      { name: 'period', type: 'string', default: "'/month'", descriptionKey: 'period' },
      { name: 'copy', type: 'string', required: true, descriptionKey: 'copy' },
      { name: 'features', type: 'string[]', required: true, descriptionKey: 'features' },
      { name: 'ctaLabel', type: 'string', default: "'Get access'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  One plan, so there is nothing to compare and no grid to build. The layout
  splits instead: the pitch and the feature list get the wide side, the price and
  the CTA get a tinted panel of their own. The panel is what a returning visitor
  scans for, so it stays a fixed, self-contained block rather than sitting at the
  bottom of a column whose height depends on how many features you listed.

  Source order puts the pitch first - on a narrow screen the panel stacks under
  it, which is also the order it should be read in.
-->
<article class="solo" aria-labelledby="solo-name">
  <div class="solo__body">
    <p class="solo__kicker">One plan</p>
    <h3 class="solo__name" id="solo-name">Pro</h3>
    <p class="solo__copy">
      Everything you need to ship, at one price. No seat maths, no feature gates,
      no sales call.
    </p>

    <p class="solo__included">What's included</p>
    <ul class="solo__features">
      <li class="solo__feature">
        <svg class="solo__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        Unlimited projects
      </li>
      <li class="solo__feature">
        <svg class="solo__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        Unlimited team members
      </li>
      <li class="solo__feature">
        <svg class="solo__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        100 GB storage
      </li>
      <li class="solo__feature">
        <svg class="solo__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        Priority support
      </li>
      <li class="solo__feature">
        <svg class="solo__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        SSO and audit log
      </li>
      <li class="solo__feature">
        <svg class="solo__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        99.9% uptime SLA
      </li>
    </ul>
  </div>

  <div class="solo__panel">
    <p class="solo__panel-label">Flat monthly rate</p>
    <p class="solo__price">
      <span class="solo__amount">$19</span>
      <span class="solo__period">/month</span>
    </p>
    <a class="solo__cta" href="#">Get access</a>
    <p class="solo__note">Invoices and VAT receipts included. Cancel any time.</p>
  </div>
</article>`,
      css: `.solo {
  display: grid;
  max-width: 56rem;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

/*
 * 1.6fr / 1fr rather than 2fr / 1fr: the panel has to stay wide enough that
 * "$19" and "/month" share a line at every breakpoint above this one. Wrapping
 * the period onto its own line reads as a different price.
 */
@media (min-width: 48rem) {
  .solo {
    grid-template-columns: 1.6fr 1fr;
  }
}

.solo__body {
  padding: 2rem;
}

.solo__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1d4ed8;
}

.solo__name {
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.solo__copy {
  margin: 0.5rem 0 0;
  max-width: 34rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #4b5563;
}

.solo__included {
  margin: 1.75rem 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b7280;
}

.solo__features {
  display: grid;
  gap: 0.625rem;
  margin: 0.875rem 0 0;
  padding: 0;
  list-style: none;
}

/* Two columns only once each label has room to sit on one line. */
@media (min-width: 30rem) {
  .solo__features {
    grid-template-columns: repeat(2, 1fr);
  }
}

.solo__feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.solo__check {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #2563eb;
}

.solo__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* The divider moves from the top to the side when the layout goes horizontal. */
@media (min-width: 48rem) {
  .solo__panel {
    border-top: 0;
    border-left: 1px solid #e5e7eb;
  }
}

.solo__panel-label {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #4b5563;
}

.solo__price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 0.5rem 0 0;
}

.solo__amount {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #111827;
}

.solo__period {
  font-size: 0.875rem;
  color: #4b5563;
}

.solo__cta {
  display: block;
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background-color 150ms;
}

.solo__cta:hover {
  background: #1d4ed8;
}

.solo__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.solo__note {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #6b7280;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The panel's whole job is to sit a step apart from the card, so it inverts the
 * relationship rather than the colour - a hair lighter than the card on dark,
 * where on light it was a hair darker.
 */
@media (prefers-color-scheme: dark) {
  .solo {
    border-color: #1f2937;
    background: #111827;
  }

  .solo__kicker {
    color: #93c5fd;
  }

  .solo__name,
  .solo__amount {
    color: #f3f4f6;
  }

  .solo__copy,
  .solo__period,
  .solo__panel-label {
    color: #9ca3af;
  }

  .solo__included,
  .solo__note {
    color: #9ca3af;
  }

  .solo__feature {
    color: #d1d5db;
  }

  .solo__check {
    color: #60a5fa;
  }

  .solo__panel {
    border-color: #1f2937;
    background: #1f2937;
  }

  .solo__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .solo__cta {
    transition: none;
  }
}`,
      tailwind: `<article
  class="mx-auto grid max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[1.6fr_1fr] dark:border-gray-800 dark:bg-gray-900"
  aria-labelledby="solo-name"
>
  <div class="p-8">
    <p class="text-xs font-semibold uppercase tracking-[0.06em] text-blue-700 dark:text-blue-300">One plan</p>
    <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100" id="solo-name">Pro</h3>
    <p class="mt-2 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Everything you need to ship, at one price. No seat maths, no feature gates, no sales call.
    </p>

    <p class="mt-7 text-xs font-semibold uppercase tracking-[0.04em] text-gray-500 dark:text-gray-400">
      What's included
    </p>
    <ul class="mt-3.5 grid gap-2.5 sm:grid-cols-2">
      <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        Unlimited projects
      </li>
      <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        Unlimited team members
      </li>
      <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        100 GB storage
      </li>
      <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        Priority support
      </li>
      <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        SSO and audit log
      </li>
      <li class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        99.9% uptime SLA
      </li>
    </ul>
  </div>

  <div class="flex flex-col justify-center border-t border-gray-200 bg-gray-50 p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-800">
    <p class="text-[0.8125rem] font-medium text-gray-600 dark:text-gray-400">Flat monthly rate</p>

    <p class="mt-2 flex items-baseline gap-1">
      <span class="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">$19</span>
      <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
    </p>

    <a
      href="#"
      class="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
    >
      Get access
    </a>

    <p class="mt-3 text-xs leading-normal text-gray-500 dark:text-gray-400">
      Invoices and VAT receipts included. Cancel any time.
    </p>
  </div>
</article>`,
      react: `const FEATURES = [
  'Unlimited projects',
  'Unlimited team members',
  '100 GB storage',
  'Priority support',
  'SSO and audit log',
  '99.9% uptime SLA',
];

function CheckIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingSingleCard({
  name = 'Pro',
  price = '$19',
  period = '/month',
  copy = 'Everything you need to ship, at one price. No seat maths, no feature gates, no sales call.',
  features = FEATURES,
  ctaLabel = 'Get access',
  ctaHref = '#',
  className = '',
}) {
  return (
    <article
      aria-labelledby="solo-name"
      className={\`mx-auto grid max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[1.6fr_1fr] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-blue-700 dark:text-blue-300">
          One plan
        </p>
        <h3
          className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          id="solo-name"
        >
          {name}
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.04em] text-gray-500 dark:text-gray-400">
          What&apos;s included
        </p>
        <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center border-t border-gray-200 bg-gray-50 p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-800">
        <p className="text-[0.8125rem] font-medium text-gray-600 dark:text-gray-400">Flat monthly rate</p>

        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
        </p>

        <a
          href={ctaHref}
          className="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
        >
          {ctaLabel}
        </a>

        <p className="mt-3 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Invoices and VAT receipts included. Cancel any time.
        </p>
      </div>
    </article>
  );
}`,
      nextjs: `import Link from 'next/link';

// One price, no controls - a Server Component, so no 'use client'.
interface PricingSingleCardProps {
  name?: string;
  price?: string;
  period?: string;
  copy?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const FEATURES: string[] = [
  'Unlimited projects',
  'Unlimited team members',
  '100 GB storage',
  'Priority support',
  'SSO and audit log',
  '99.9% uptime SLA',
];

function CheckIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingSingleCard({
  name = 'Pro',
  price = '$19',
  period = '/month',
  copy = 'Everything you need to ship, at one price. No seat maths, no feature gates, no sales call.',
  features = FEATURES,
  ctaLabel = 'Get access',
  ctaHref = '/signup',
  className = '',
}: PricingSingleCardProps) {
  return (
    <article
      aria-labelledby="solo-name"
      className={\`mx-auto grid max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[1.6fr_1fr] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-blue-700 dark:text-blue-300">
          One plan
        </p>
        <h3
          className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          id="solo-name"
        >
          {name}
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.04em] text-gray-500 dark:text-gray-400">
          What&apos;s included
        </p>
        <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center border-t border-gray-200 bg-gray-50 p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-800">
        <p className="text-[0.8125rem] font-medium text-gray-600 dark:text-gray-400">Flat monthly rate</p>

        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
        </p>

        <Link
          href={ctaHref}
          className="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
        >
          {ctaLabel}
        </Link>

        <p className="mt-3 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Invoices and VAT receipts included. Cancel any time.
        </p>
      </div>
    </article>
  );
}`,
      typescript: `export interface PricingSingleCardProps {
  name?: string;
  /** Pre-formatted, currency symbol and all. Formatting is the caller's job:
   *  it is the only place that knows the visitor's locale. */
  price?: string;
  period?: string;
  copy?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const FEATURES: string[] = [
  'Unlimited projects',
  'Unlimited team members',
  '100 GB storage',
  'Priority support',
  'SSO and audit log',
  '99.9% uptime SLA',
];

function CheckIcon(): JSX.Element {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingSingleCard({
  name = 'Pro',
  price = '$19',
  period = '/month',
  copy = 'Everything you need to ship, at one price. No seat maths, no feature gates, no sales call.',
  features = FEATURES,
  ctaLabel = 'Get access',
  ctaHref = '#',
  className = '',
}: PricingSingleCardProps): JSX.Element {
  return (
    <article
      aria-labelledby="solo-name"
      className={\`mx-auto grid max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[1.6fr_1fr] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-blue-700 dark:text-blue-300">
          One plan
        </p>
        <h3
          className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          id="solo-name"
        >
          {name}
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.04em] text-gray-500 dark:text-gray-400">
          What&apos;s included
        </p>
        <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
          {features.map((feature: string) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center border-t border-gray-200 bg-gray-50 p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-800">
        <p className="text-[0.8125rem] font-medium text-gray-600 dark:text-gray-400">Flat monthly rate</p>

        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
        </p>

        <a
          href={ctaHref}
          className="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
        >
          {ctaLabel}
        </a>

        <p className="mt-3 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Invoices and VAT receipts included. Cancel any time.
        </p>
      </div>
    </article>
  );
}`,
    },
  },
  {
    slug: 'pricing-comparison-grid',
    category: 'pricing',
    tags: ['pricing', 'table', 'comparison', 'features', 'matrix'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 1870, copies: 449, downloads: 118 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [{ name: 'className', type: 'string', descriptionKey: 'className' }],
    code: {
      html: `<!--
  This is a real <table>, and it has to be. A grid of divs looks identical and
  loses the only thing that makes the data navigable without sight: with
  scope="col" on the plans and scope="row" on the features, a screen reader
  announces "Pro, Priority support, Included" when the user lands on a cell. Take
  the table away and that cell announces "Included" - true, but about what?

  Two rules the ticks depend on:
   1. The svg is aria-hidden and every boolean cell carries real text next to it.
      An icon alone conveys nothing, and title/aria-label on an <svg> is read
      inconsistently across screen readers.
   2. ✓ and ✗ differ in shape, not just colour, so the answer survives being
      printed in greyscale or read by someone who cannot separate red from green.

  The scroll container is focusable (tabindex="0") with a role and a name: a
  region that scrolls but cannot be focused is unreachable for anyone driving
  the page from the keyboard alone.
-->
<div class="matrix__scroll" role="region" aria-labelledby="matrix-caption" tabindex="0">
  <table class="matrix">
    <caption class="matrix__caption" id="matrix-caption">Compare plans</caption>

    <thead>
      <tr>
        <th class="matrix__corner" scope="col">Feature</th>
        <th class="matrix__plan" scope="col">
          Starter
          <span class="matrix__plan-price">$0/month</span>
        </th>
        <th class="matrix__plan matrix__plan--highlighted" scope="col">
          Pro
          <span class="matrix__plan-price">$19/month</span>
        </th>
        <th class="matrix__plan" scope="col">
          Enterprise
          <span class="matrix__plan-price">$49/month</span>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <th class="matrix__row" scope="row">Projects</th>
        <td class="matrix__cell">3</td>
        <td class="matrix__cell">Unlimited</td>
        <td class="matrix__cell">Unlimited</td>
      </tr>
      <tr>
        <th class="matrix__row" scope="row">Storage</th>
        <td class="matrix__cell">1 GB</td>
        <td class="matrix__cell">100 GB</td>
        <td class="matrix__cell">Unlimited</td>
      </tr>
      <tr>
        <th class="matrix__row" scope="row">Priority support</th>
        <td class="matrix__cell">
          <svg class="matrix__icon matrix__icon--no" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell">
          <svg class="matrix__icon matrix__icon--yes" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          <span class="matrix__sr">Included</span>
        </td>
        <td class="matrix__cell">
          <svg class="matrix__icon matrix__icon--yes" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          <span class="matrix__sr">Included</span>
        </td>
      </tr>
      <tr>
        <th class="matrix__row" scope="row">SSO and SCIM</th>
        <td class="matrix__cell">
          <svg class="matrix__icon matrix__icon--no" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell">
          <svg class="matrix__icon matrix__icon--no" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell">
          <svg class="matrix__icon matrix__icon--yes" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          <span class="matrix__sr">Included</span>
        </td>
      </tr>
      <tr>
        <th class="matrix__row" scope="row">Uptime SLA</th>
        <td class="matrix__cell">
          <svg class="matrix__icon matrix__icon--no" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="matrix__sr">Not included</span>
        </td>
        <td class="matrix__cell">99.5%</td>
        <td class="matrix__cell">99.9%</td>
      </tr>
    </tbody>
  </table>
</div>`,
      css: `/*
 * The wrapper scrolls, not the table: a table with overflow on itself cannot
 * scroll (the element's display type has no scroll container), which is the
 * usual reason a comparison table clips its last plan on a phone.
 */
.matrix__scroll {
  max-width: 60rem;
  margin: 0 auto;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
}

.matrix__scroll:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.matrix {
  width: 100%;
  min-width: 40rem;
  border-collapse: collapse;
  text-align: left;
}

.matrix__caption {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.matrix__corner,
.matrix__plan {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  vertical-align: bottom;
}

.matrix__plan {
  text-align: center;
}

.matrix__plan--highlighted {
  /* An inset shadow, not a border: a border here would fight border-collapse
     and shift every cell in the column by a pixel. */
  box-shadow: inset 0 -2px 0 0 #2563eb;
}

.matrix__plan-price {
  display: block;
  margin-top: 0.125rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: #4b5563;
}

.matrix__row {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.matrix__cell {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  text-align: center;
  font-size: 0.875rem;
  color: #374151;
}

.matrix tbody tr:last-child .matrix__row,
.matrix tbody tr:last-child .matrix__cell {
  border-bottom: 0;
}

.matrix__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.matrix__icon--yes {
  color: #15803d;
}

.matrix__icon--no {
  color: #9ca3af;
}

.matrix__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The tick is the subtle one - #15803d is a light-mode green that falls under
 * 4.5:1 on a dark surface, so it lifts to #4ade80 rather than staying put.
 */
@media (prefers-color-scheme: dark) {
  .matrix__scroll {
    border-color: #1f2937;
    background: #111827;
  }

  .matrix__caption {
    color: #f3f4f6;
  }

  .matrix__corner,
  .matrix__plan {
    border-color: #1f2937;
    background: #1f2937;
    color: #f3f4f6;
  }

  .matrix__plan-price {
    color: #9ca3af;
  }

  .matrix__row,
  .matrix__cell {
    border-color: #1f2937;
    color: #d1d5db;
  }

  .matrix__icon--yes {
    color: #4ade80;
  }

  .matrix__icon--no {
    color: #6b7280;
  }

  .matrix__scroll:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<div
  class="mx-auto max-w-4xl overflow-x-auto rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
  role="region"
  aria-labelledby="matrix-caption"
  tabindex="0"
>
  <table class="w-full min-w-[40rem] border-collapse text-left">
    <caption class="px-5 py-4 text-left text-base font-semibold text-gray-900 dark:text-gray-100" id="matrix-caption">
      Compare plans
    </caption>

    <thead>
      <tr>
        <th class="border-b border-gray-200 bg-gray-50 px-5 py-3.5 align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100" scope="col">
          Feature
        </th>
        <th class="border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-center align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100" scope="col">
          Starter
          <span class="mt-0.5 block text-xs font-normal text-gray-600 dark:text-gray-400">$0/month</span>
        </th>
        <th class="border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-center align-bottom text-sm font-semibold text-gray-900 shadow-[inset_0_-2px_0_0_#2563eb] dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100" scope="col">
          Pro
          <span class="mt-0.5 block text-xs font-normal text-gray-600 dark:text-gray-400">$19/month</span>
        </th>
        <th class="border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-center align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100" scope="col">
          Enterprise
          <span class="mt-0.5 block text-xs font-normal text-gray-600 dark:text-gray-400">$49/month</span>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <th class="border-b border-gray-100 px-5 py-3.5 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300" scope="row">Projects</th>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">3</td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
      </tr>
      <tr>
        <th class="border-b border-gray-100 px-5 py-3.5 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300" scope="row">Storage</th>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">1 GB</td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">100 GB</td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">Unlimited</td>
      </tr>
      <tr>
        <th class="border-b border-gray-100 px-5 py-3.5 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300" scope="row">Priority support</th>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm dark:border-gray-800">
          <svg class="inline h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm dark:border-gray-800">
          <svg class="inline h-5 w-5 text-green-700 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          <span class="sr-only">Included</span>
        </td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm dark:border-gray-800">
          <svg class="inline h-5 w-5 text-green-700 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          <span class="sr-only">Included</span>
        </td>
      </tr>
      <tr>
        <th class="border-b border-gray-100 px-5 py-3.5 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300" scope="row">SSO and SCIM</th>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm dark:border-gray-800">
          <svg class="inline h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm dark:border-gray-800">
          <svg class="inline h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="sr-only">Not included</span>
        </td>
        <td class="border-b border-gray-100 px-5 py-3.5 text-center text-sm dark:border-gray-800">
          <svg class="inline h-5 w-5 text-green-700 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          <span class="sr-only">Included</span>
        </td>
      </tr>
      <tr>
        <th class="px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300" scope="row">Uptime SLA</th>
        <td class="px-5 py-3.5 text-center text-sm">
          <svg class="inline h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
          <span class="sr-only">Not included</span>
        </td>
        <td class="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">99.5%</td>
        <td class="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">99.9%</td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `const PLANS = [
  { id: 'starter', name: 'Starter', price: '$0/month', highlighted: false },
  { id: 'pro', name: 'Pro', price: '$19/month', highlighted: true },
  { id: 'enterprise', name: 'Enterprise', price: '$49/month', highlighted: false },
];

// A cell is either a string to print or a boolean to render as a tick/cross.
const ROWS = [
  { id: 'projects', label: 'Projects', cells: ['3', 'Unlimited', 'Unlimited'] },
  { id: 'storage', label: 'Storage', cells: ['1 GB', '100 GB', 'Unlimited'] },
  { id: 'support', label: 'Priority support', cells: [false, true, true] },
  { id: 'sso', label: 'SSO and SCIM', cells: [false, false, true] },
  { id: 'sla', label: 'Uptime SLA', cells: [false, '99.5%', '99.9%'] },
];

function BooleanCell({ value }) {
  return (
    <>
      {value ? (
        <svg
          className="inline h-5 w-5 text-green-700 dark:text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      ) : (
        <svg
          className="inline h-5 w-5 text-gray-400 dark:text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      )}
      {/* The icon is decoration; this is the answer. */}
      <span className="sr-only">{value ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function PricingComparisonGrid({ className = '' }) {
  const cell = 'border-b border-gray-100 px-5 py-3.5 dark:border-gray-800';

  return (
    <div
      role="region"
      aria-labelledby="matrix-caption"
      tabIndex={0}
      className={\`mx-auto max-w-4xl overflow-x-auto rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
    >
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption
          className="px-5 py-4 text-left text-base font-semibold text-gray-900 dark:text-gray-100"
          id="matrix-caption"
        >
          Compare plans
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 bg-gray-50 px-5 py-3.5 align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
            >
              Feature
            </th>
            {PLANS.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={[
                  'border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-center align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100',
                  plan.highlighted ? 'shadow-[inset_0_-2px_0_0_#2563eb]' : '',
                ].join(' ')}
              >
                {plan.name}
                <span className="mt-0.5 block text-xs font-normal text-gray-600 dark:text-gray-400">
                  {plan.price}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ROWS.map((row) => (
            <tr key={row.id}>
              <th
                scope="row"
                className={\`\${cell} text-sm font-medium text-gray-700 dark:text-gray-300\`}
              >
                {row.label}
              </th>
              {row.cells.map((value, index) => (
                <td
                  key={PLANS[index].id}
                  className={\`\${cell} text-center text-sm text-gray-700 dark:text-gray-300\`}
                >
                  {typeof value === 'boolean' ? <BooleanCell value={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      nextjs: `// A static table - no state, so no 'use client'.
interface Plan {
  id: string;
  name: string;
  price: string;
  highlighted?: boolean;
}

/** A cell is prose to print, or a boolean the component renders as a tick. */
type Cell = string | boolean;

interface Row {
  id: string;
  label: string;
  cells: Cell[];
}

interface PricingComparisonGridProps {
  className?: string;
}

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', price: '$0/month' },
  { id: 'pro', name: 'Pro', price: '$19/month', highlighted: true },
  { id: 'enterprise', name: 'Enterprise', price: '$49/month' },
];

const ROWS: Row[] = [
  { id: 'projects', label: 'Projects', cells: ['3', 'Unlimited', 'Unlimited'] },
  { id: 'storage', label: 'Storage', cells: ['1 GB', '100 GB', 'Unlimited'] },
  { id: 'support', label: 'Priority support', cells: [false, true, true] },
  { id: 'sso', label: 'SSO and SCIM', cells: [false, false, true] },
  { id: 'sla', label: 'Uptime SLA', cells: [false, '99.5%', '99.9%'] },
];

function BooleanCell({ value }: { value: boolean }) {
  return (
    <>
      {value ? (
        <svg
          className="inline h-5 w-5 text-green-700 dark:text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      ) : (
        <svg
          className="inline h-5 w-5 text-gray-400 dark:text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      )}
      <span className="sr-only">{value ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function PricingComparisonGrid({ className = '' }: PricingComparisonGridProps) {
  const cell = 'border-b border-gray-100 px-5 py-3.5 dark:border-gray-800';

  return (
    <div
      role="region"
      aria-labelledby="matrix-caption"
      tabIndex={0}
      className={\`mx-auto max-w-4xl overflow-x-auto rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
    >
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption
          className="px-5 py-4 text-left text-base font-semibold text-gray-900 dark:text-gray-100"
          id="matrix-caption"
        >
          Compare plans
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 bg-gray-50 px-5 py-3.5 align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
            >
              Feature
            </th>
            {PLANS.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={[
                  'border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-center align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100',
                  plan.highlighted ? 'shadow-[inset_0_-2px_0_0_#2563eb]' : '',
                ].join(' ')}
              >
                {plan.name}
                <span className="mt-0.5 block text-xs font-normal text-gray-600 dark:text-gray-400">
                  {plan.price}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ROWS.map((row) => (
            <tr key={row.id}>
              <th
                scope="row"
                className={\`\${cell} text-sm font-medium text-gray-700 dark:text-gray-300\`}
              >
                {row.label}
              </th>
              {row.cells.map((value, index) => (
                <td
                  key={PLANS[index]?.id ?? index}
                  className={\`\${cell} text-center text-sm text-gray-700 dark:text-gray-300\`}
                >
                  {typeof value === 'boolean' ? <BooleanCell value={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `export interface Plan {
  id: string;
  name: string;
  price: string;
  highlighted?: boolean;
}

/**
 * A cell is either prose ("100 GB") or a boolean. Modelling it as a union rather
 * than as two parallel row types is what lets one table mix "99.5%" and a tick
 * in the same column - and it forces the render to branch, so a boolean can
 * never be printed as the string "false".
 */
export type Cell = string | boolean;

export interface Row {
  id: string;
  label: string;
  /** Positional: index N is PLANS[N]. Length is checked at render time. */
  cells: Cell[];
}

export interface PricingComparisonGridProps {
  className?: string;
}

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', price: '$0/month' },
  { id: 'pro', name: 'Pro', price: '$19/month', highlighted: true },
  { id: 'enterprise', name: 'Enterprise', price: '$49/month' },
];

const ROWS: Row[] = [
  { id: 'projects', label: 'Projects', cells: ['3', 'Unlimited', 'Unlimited'] },
  { id: 'storage', label: 'Storage', cells: ['1 GB', '100 GB', 'Unlimited'] },
  { id: 'support', label: 'Priority support', cells: [false, true, true] },
  { id: 'sso', label: 'SSO and SCIM', cells: [false, false, true] },
  { id: 'sla', label: 'Uptime SLA', cells: [false, '99.5%', '99.9%'] },
];

function BooleanCell({ value }: { value: boolean }): JSX.Element {
  return (
    <>
      {value ? (
        <svg
          className="inline h-5 w-5 text-green-700 dark:text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      ) : (
        <svg
          className="inline h-5 w-5 text-gray-400 dark:text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      )}
      <span className="sr-only">{value ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function PricingComparisonGrid({
  className = '',
}: PricingComparisonGridProps): JSX.Element {
  const cell = 'border-b border-gray-100 px-5 py-3.5 dark:border-gray-800';

  return (
    <div
      role="region"
      aria-labelledby="matrix-caption"
      tabIndex={0}
      className={\`mx-auto max-w-4xl overflow-x-auto rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
    >
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption
          className="px-5 py-4 text-left text-base font-semibold text-gray-900 dark:text-gray-100"
          id="matrix-caption"
        >
          Compare plans
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 bg-gray-50 px-5 py-3.5 align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
            >
              Feature
            </th>
            {PLANS.map((plan: Plan) => (
              <th
                key={plan.id}
                scope="col"
                className={[
                  'border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-center align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100',
                  plan.highlighted ? 'shadow-[inset_0_-2px_0_0_#2563eb]' : '',
                ].join(' ')}
              >
                {plan.name}
                <span className="mt-0.5 block text-xs font-normal text-gray-600 dark:text-gray-400">
                  {plan.price}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ROWS.map((row: Row) => (
            <tr key={row.id}>
              <th
                scope="row"
                className={\`\${cell} text-sm font-medium text-gray-700 dark:text-gray-300\`}
              >
                {row.label}
              </th>
              {row.cells.map((value: Cell, index: number) => (
                <td
                  key={PLANS[index]?.id ?? index}
                  className={\`\${cell} text-center text-sm text-gray-700 dark:text-gray-300\`}
                >
                  {typeof value === 'boolean' ? <BooleanCell value={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },
  {
    slug: 'pricing-usage-slider',
    category: 'pricing',
    tags: ['pricing', 'slider', 'calculator', 'usage', 'range'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-24',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1340, copies: 302, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'name', type: 'string', default: "'Team'", descriptionKey: 'name' },
      { name: 'ctaLabel', type: 'string', default: "'Start free trial'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A native <input type="range">, not a div with a drag handler. It arrives with
  arrow keys, Home/End, Page Up/Down, the correct touch target, and the
  platform's own high-contrast rendering - none of which a custom slider gets
  without hundreds of lines, and most of which it never gets at all.

  The price goes in an <output>, which maps to role="status" and is therefore
  already a polite live region: the recomputed total announces itself without an
  explicit aria-live. It is spelled out anyway because a few screen-reader and
  browser pairings still do not map <output> to a live region, and a silent
  price is the one failure this component cannot afford.

  Note aria-live on the OUTPUT, not on a wrapper - a live region announces its
  own subtree, so wrapping it would re-announce the label on every drag.
-->
<form class="usage" aria-labelledby="usage-heading">
  <h3 class="usage__heading" id="usage-heading">Team</h3>
  <p class="usage__blurb">Pay for the seats you use. Every feature is included at every size.</p>

  <div class="usage__field">
    <label class="usage__label" for="usage-seats">Team members</label>
    <!--
      The range's own value is announced as a bare number ("12"), so
      aria-valuetext gives it a unit. Without it the control says "12" and the
      user has to guess what of.
    -->
    <input
      class="usage__range"
      id="usage-seats"
      type="range"
      min="1"
      max="50"
      step="1"
      value="5"
      aria-valuetext="5 seats"
    />
    <div class="usage__scale" aria-hidden="true">
      <span>1</span>
      <span>50</span>
    </div>
  </div>

  <p class="usage__result">
    <output class="usage__output" for="usage-seats" aria-live="polite">
      <span class="usage__total">$60</span>
      <span class="usage__period">/month</span>
      <span class="usage__breakdown">5 seats × $12</span>
    </output>
  </p>

  <a class="usage__cta" href="#">Start free trial</a>
</form>

<script>
  document.querySelectorAll('.usage').forEach(function (root) {
    var range = root.querySelector('.usage__range');
    var total = root.querySelector('.usage__total');
    var breakdown = root.querySelector('.usage__breakdown');
    var PER_SEAT = 12;

    function render() {
      var seats = Number(range.value);
      total.textContent = '$' + seats * PER_SEAT;
      breakdown.textContent = seats + (seats === 1 ? ' seat' : ' seats') + ' × $' + PER_SEAT;
      range.setAttribute('aria-valuetext', seats + (seats === 1 ? ' seat' : ' seats'));
    }

    // 'input' rather than 'change': change only fires when the drag ends, so the
    // price would freeze mid-gesture - exactly when the user is watching it.
    range.addEventListener('input', render);
    render();
  });
</script>`,
      css: `.usage {
  max-width: 26rem;
  margin: 0 auto;
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.usage__heading {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.usage__blurb {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.usage__field {
  margin-top: 1.75rem;
}

.usage__label {
  display: block;
  margin-bottom: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.usage__range {
  display: block;
  width: 100%;
  /* accent-color re-tints the native track and thumb in one line, and keeps the
     platform's own thumb - including its forced-colours rendering. */
  accent-color: #2563eb;
  cursor: pointer;
}

.usage__range:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 4px;
}

.usage__scale {
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.usage__result {
  display: flex;
  margin: 1.5rem 0 0;
  padding: 1rem;
  border-radius: 0.75rem;
  background: #f9fafb;
}

.usage__output {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem;
}

.usage__total {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
  /* Tabular figures: without them the total shifts sideways as it counts up,
     which reads as the layout twitching under the user's thumb. */
  font-variant-numeric: tabular-nums;
}

.usage__period {
  font-size: 0.875rem;
  color: #4b5563;
}

.usage__breakdown {
  flex-basis: 100%;
  font-size: 0.75rem;
  color: #6b7280;
}

.usage__cta {
  display: block;
  margin-top: 1.25rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  background: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background-color 150ms;
}

.usage__cta:hover {
  background: #1d4ed8;
}

.usage__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * accent-color has to be re-set: #2563eb is picked to sit against a white track,
 * and the browser derives the unfilled track from the surface, so the pairing
 * loses contrast once the card goes dark.
 */
@media (prefers-color-scheme: dark) {
  .usage {
    border-color: #1f2937;
    background: #111827;
  }

  .usage__heading,
  .usage__total {
    color: #f3f4f6;
  }

  .usage__blurb,
  .usage__period {
    color: #9ca3af;
  }

  .usage__label {
    color: #d1d5db;
  }

  .usage__scale,
  .usage__breakdown {
    color: #9ca3af;
  }

  .usage__range {
    accent-color: #60a5fa;
  }

  .usage__result {
    background: #1f2937;
  }

  .usage__range:focus-visible,
  .usage__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .usage__cta {
    transition: none;
  }
}`,
      tailwind: `<form class="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-labelledby="usage-heading">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100" id="usage-heading">Team</h3>
  <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
    Pay for the seats you use. Every feature is included at every size.
  </p>

  <div class="mt-7">
    <label class="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300" for="usage-seats">
      Team members
    </label>
    <input
      class="block w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:accent-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      id="usage-seats"
      type="range"
      min="1"
      max="50"
      step="1"
      value="5"
      aria-valuetext="5 seats"
    />
    <div class="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
      <span>1</span>
      <span>50</span>
    </div>
  </div>

  <p class="mt-6 flex rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
    <output class="flex flex-wrap items-baseline gap-1" for="usage-seats" aria-live="polite">
      <span class="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">$60</span>
      <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
      <span class="basis-full text-xs text-gray-500 dark:text-gray-400">5 seats × $12</span>
    </output>
  </p>

  <a
    href="#"
    class="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Start free trial
  </a>
</form>

<script>
  document.querySelectorAll('#usage-seats').forEach(function (range) {
    var form = range.closest('form');
    var output = form.querySelector('output');
    var total = output.children[0];
    var breakdown = output.children[2];
    var PER_SEAT = 12;

    function render() {
      var seats = Number(range.value);
      var unit = seats === 1 ? ' seat' : ' seats';
      total.textContent = '$' + seats * PER_SEAT;
      breakdown.textContent = seats + unit + ' × $' + PER_SEAT;
      range.setAttribute('aria-valuetext', seats + unit);
    }

    range.addEventListener('input', render);
    render();
  });
</script>`,
      react: `import { useState } from 'react';

const PER_SEAT = 12;
const MIN_SEATS = 1;
const MAX_SEATS = 50;

export function PricingUsageSlider({
  name = 'Team',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}) {
  const [seats, setSeats] = useState(5);
  const unit = seats === 1 ? 'seat' : 'seats';

  return (
    <form
      aria-labelledby="usage-heading"
      className={\`mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" id="usage-heading">
        {name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Pay for the seats you use. Every feature is included at every size.
      </p>

      <div className="mt-7">
        <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="usage-seats">
          Team members
        </label>
        <input
          id="usage-seats"
          type="range"
          min={MIN_SEATS}
          max={MAX_SEATS}
          step={1}
          value={seats}
          // Without this the control announces a bare "12" with no unit.
          aria-valuetext={\`\${seats} \${unit}\`}
          onChange={(event) => setSeats(Number(event.target.value))}
          className="block w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:accent-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
          <span>{MIN_SEATS}</span>
          <span>{MAX_SEATS}</span>
        </div>
      </div>

      <p className="mt-6 flex rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
        {/* <output> is role="status" - already polite. aria-live is belt and braces. */}
        <output className="flex flex-wrap items-baseline gap-1" htmlFor="usage-seats" aria-live="polite">
          <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
            \${seats * PER_SEAT}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
          <span className="basis-full text-xs text-gray-500 dark:text-gray-400">
            {seats} {unit} × \${PER_SEAT}
          </span>
        </output>
      </p>

      <a
        href={ctaHref}
        className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </form>
  );
}`,
      nextjs: `'use client';

import { useState } from 'react';

// The slider is state, so this one genuinely needs 'use client' - unlike the
// static tiers, which stay on the server.
interface PricingUsageSliderProps {
  name?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const PER_SEAT = 12;
const MIN_SEATS = 1;
const MAX_SEATS = 50;

export function PricingUsageSlider({
  name = 'Team',
  ctaLabel = 'Start free trial',
  ctaHref = '/signup',
  className = '',
}: PricingUsageSliderProps) {
  const [seats, setSeats] = useState<number>(5);
  const unit = seats === 1 ? 'seat' : 'seats';

  return (
    <form
      aria-labelledby="usage-heading"
      className={\`mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" id="usage-heading">
        {name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Pay for the seats you use. Every feature is included at every size.
      </p>

      <div className="mt-7">
        <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="usage-seats">
          Team members
        </label>
        <input
          id="usage-seats"
          type="range"
          min={MIN_SEATS}
          max={MAX_SEATS}
          step={1}
          value={seats}
          aria-valuetext={\`\${seats} \${unit}\`}
          onChange={(event) => setSeats(Number(event.target.value))}
          className="block w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:accent-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
          <span>{MIN_SEATS}</span>
          <span>{MAX_SEATS}</span>
        </div>
      </div>

      <p className="mt-6 flex rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
        <output className="flex flex-wrap items-baseline gap-1" htmlFor="usage-seats" aria-live="polite">
          <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
            \${seats * PER_SEAT}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
          <span className="basis-full text-xs text-gray-500 dark:text-gray-400">
            {seats} {unit} × \${PER_SEAT}
          </span>
        </output>
      </p>

      <a
        href={\`\${ctaHref}?seats=\${seats}\`}
        className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </form>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface PricingUsageSliderProps {
  name?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/** Cents would be safer for money, but at whole-dollar seat pricing the float
 *  never gets a chance to drift. Swap to cents the moment a price gains a
 *  decimal - 12.99 * 3 is already 38.97000000000001. */
const PER_SEAT = 12;
const MIN_SEATS = 1;
const MAX_SEATS = 50;

export function PricingUsageSlider({
  name = 'Team',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: PricingUsageSliderProps): JSX.Element {
  const [seats, setSeats] = useState<number>(5);
  const unit: string = seats === 1 ? 'seat' : 'seats';

  return (
    <form
      aria-labelledby="usage-heading"
      className={\`mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" id="usage-heading">
        {name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Pay for the seats you use. Every feature is included at every size.
      </p>

      <div className="mt-7">
        <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="usage-seats">
          Team members
        </label>
        <input
          id="usage-seats"
          type="range"
          min={MIN_SEATS}
          max={MAX_SEATS}
          step={1}
          value={seats}
          aria-valuetext={\`\${seats} \${unit}\`}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSeats(Number(event.target.value))}
          className="block w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:accent-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
          <span>{MIN_SEATS}</span>
          <span>{MAX_SEATS}</span>
        </div>
      </div>

      <p className="mt-6 flex rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
        <output className="flex flex-wrap items-baseline gap-1" htmlFor="usage-seats" aria-live="polite">
          <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
            \${seats * PER_SEAT}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
          <span className="basis-full text-xs text-gray-500 dark:text-gray-400">
            {seats} {unit} × \${PER_SEAT}
          </span>
        </output>
      </p>

      <a
        href={ctaHref}
        className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </form>
  );
}`,
    },
  },
  {
    slug: 'pricing-two-tier',
    category: 'pricing',
    tags: ['pricing', 'tiers', 'two-tier', 'saas', 'plans'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'tiers', type: 'Tier[]', default: 'TIERS', descriptionKey: 'tiers' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Two tiers stack to one column below sm; the highlighted tier uses a 2px
     border plus a text badge, never colour alone. -->
<section class="mx-auto w-full max-w-3xl px-4" aria-labelledby="two-tier-heading">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="two-tier-heading">
    Two plans, no surprises
  </h2>

  <ul class="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch">
    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" aria-labelledby="two-tier-basic">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="two-tier-basic">Basic</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Everything a solo maker needs to launch.</p>
        <p class="mt-4 flex items-baseline gap-1">
          <span class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$12</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>1 workspace</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>10 GB storage</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Email support</li>
        </ul>
        <a href="#" class="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started<span class="sr-only"> with Basic</span></a>
      </article>
    </li>

    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-sm dark:border-blue-500 dark:bg-gray-900" aria-labelledby="two-tier-premium">
        <p class="absolute -top-3 left-6 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">Recommended</p>
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="two-tier-premium">Premium</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">For growing teams that ship weekly.</p>
        <p class="mt-4 flex items-baseline gap-1">
          <span class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$29</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
        </p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Unlimited workspaces</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>250 GB storage</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Priority support</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Audit log</li>
        </ul>
        <a href="#" class="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started<span class="sr-only"> with Premium</span></a>
      </article>
    </li>
  </ul>
</section>`,
      react: `const TIERS = [
  { id: 'basic', name: 'Basic', blurb: 'Everything a solo maker needs to launch.', price: '$12', period: '/month', features: ['1 workspace', '10 GB storage', 'Email support'] },
  { id: 'premium', name: 'Premium', blurb: 'For growing teams that ship weekly.', price: '$29', period: '/month', features: ['Unlimited workspaces', '250 GB storage', 'Priority support', 'Audit log'], highlighted: true },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingTwoTier({ tiers = TIERS, ctaLabel = 'Get started', className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 \${className}\`} aria-labelledby="two-tier-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="two-tier-heading">
        Two plans, no surprises
      </h2>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`two-tier-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.highlighted ? 'border-2 border-blue-600 shadow-sm dark:border-blue-500' : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              {tier.highlighted && (
                <p className="absolute -top-3 left-6 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">Recommended</p>
              )}
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={\`two-tier-\${tier.id}\`}>{tier.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{tier.blurb}</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{tier.price}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Tier {
  id: string;
  name: string;
  blurb: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingTwoTierProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  { id: 'basic', name: 'Basic', blurb: 'Everything a solo maker needs to launch.', price: '$12', period: '/month', features: ['1 workspace', '10 GB storage', 'Email support'] },
  { id: 'premium', name: 'Premium', blurb: 'For growing teams that ship weekly.', price: '$29', period: '/month', features: ['Unlimited workspaces', '250 GB storage', 'Priority support', 'Audit log'], highlighted: true },
];

function CheckIcon(): JSX.Element {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingTwoTier({ tiers = TIERS, ctaLabel = 'Get started', className = '' }: PricingTwoTierProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 \${className}\`} aria-labelledby="two-tier-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="two-tier-heading">
        Two plans, no surprises
      </h2>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch">
        {tiers.map((tier: Tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`two-tier-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.highlighted ? 'border-2 border-blue-600 shadow-sm dark:border-blue-500' : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              {tier.highlighted ? (
                <p className="absolute -top-3 left-6 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">Recommended</p>
              ) : null}
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={\`two-tier-\${tier.id}\`}>{tier.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{tier.blurb}</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{tier.price}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-enterprise-cta',
    category: 'pricing',
    tags: ['pricing', 'enterprise', 'cta', 'contact-sales', 'banner'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'ctaLabel', type: 'string', default: "'Contact sales'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The buttons stack under the copy at phone widths (flex-col) and move beside
     it from sm up; the panel never forces a horizontal scroll. -->
<section class="mx-auto w-full max-w-4xl px-4" aria-labelledby="enterprise-cta-heading">
  <div class="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-gray-800 dark:bg-gray-900">
    <div class="min-w-0">
      <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">Enterprise</p>
      <h2 class="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100" id="enterprise-cta-heading">
        Need a plan for your whole company?
      </h2>
      <p class="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Custom volume pricing, SSO, a dedicated success manager and a 99.9% uptime SLA. Tell us what you need and we will size a plan to fit.
      </p>
    </div>
    <div class="flex flex-col gap-3 sm:flex-none">
      <a href="#" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Contact sales</a>
      <a href="#" class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">View docs</a>
    </div>
  </div>
</section>`,
      react: `export function PricingEnterpriseCta({
  eyebrow = 'Enterprise',
  title = 'Need a plan for your whole company?',
  description = 'Custom volume pricing, SSO, a dedicated success manager and a 99.9% uptime SLA. Tell us what you need and we will size a plan to fit.',
  ctaLabel = 'Contact sales',
  ctaHref = '#',
  secondaryLabel = 'View docs',
  secondaryHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 \${className}\`} aria-labelledby="enterprise-cta-heading">
      <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{eyebrow}</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100" id="enterprise-cta-heading">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-none">
          <a href={ctaHref} className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
          {secondaryLabel && (
            <a href={secondaryHref} className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{secondaryLabel}</a>
          )}
        </div>
      </div>
    </section>
  );
}`,
      typescript: `export interface PricingEnterpriseCtaProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function PricingEnterpriseCta({
  eyebrow = 'Enterprise',
  title = 'Need a plan for your whole company?',
  description = 'Custom volume pricing, SSO, a dedicated success manager and a 99.9% uptime SLA. Tell us what you need and we will size a plan to fit.',
  ctaLabel = 'Contact sales',
  ctaHref = '#',
  secondaryLabel = 'View docs',
  secondaryHref = '#',
  className = '',
}: PricingEnterpriseCtaProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 \${className}\`} aria-labelledby="enterprise-cta-heading">
      <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{eyebrow}</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100" id="enterprise-cta-heading">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-none">
          <a href={ctaHref} className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
          {secondaryLabel ? (
            <a href={secondaryHref} className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{secondaryLabel}</a>
          ) : null}
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-feature-table',
    category: 'pricing',
    tags: ['pricing', 'table', 'comparison', 'features', 'matrix'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'plans', type: 'string[]', default: 'PLANS', descriptionKey: 'plans' },
      { name: 'rows', type: 'FeatureRow[]', default: 'ROWS', descriptionKey: 'rows' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The WRAPPER scrolls (overflow-x-auto + tabindex + role=region), not the
     table; the table keeps a min-width so columns never crush, and the page
     itself never overflows at 320px. Booleans render as icon PLUS text. -->
<section class="mx-auto w-full max-w-4xl px-4" aria-labelledby="feature-table-heading">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="feature-table-heading">
    Compare every plan
  </h2>
  <div class="mt-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800" tabindex="0" role="region" aria-label="Plan comparison, scrollable">
    <table class="w-full min-w-[34rem] border-collapse text-left text-sm">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-800">
          <th scope="col" class="p-4 font-semibold text-gray-900 dark:text-gray-100">Feature</th>
          <th scope="col" class="p-4 font-semibold text-gray-900 dark:text-gray-100">Starter</th>
          <th scope="col" class="p-4 font-semibold text-gray-900 dark:text-gray-100">Team</th>
          <th scope="col" class="p-4 font-semibold text-gray-900 dark:text-gray-100">Business</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100 dark:border-gray-800/60">
          <th scope="row" class="p-4 font-medium text-gray-700 dark:text-gray-300">Projects</th>
          <td class="p-4"><span class="text-gray-700 dark:text-gray-300">3</span></td>
          <td class="p-4"><span class="text-gray-700 dark:text-gray-300">25</span></td>
          <td class="p-4"><span class="text-gray-700 dark:text-gray-300">Unlimited</span></td>
        </tr>
        <tr class="border-b border-gray-100 dark:border-gray-800/60">
          <th scope="row" class="p-4 font-medium text-gray-700 dark:text-gray-300">Priority support</th>
          <td class="p-4"><span class="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500"><svg class="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.4 5A1 1 0 0 0 5 6.4L8.6 10 5 13.6A1 1 0 0 0 6.4 15L10 11.4 13.6 15a1 1 0 0 0 1.4-1.4L11.4 10 15 6.4A1 1 0 0 0 13.6 5L10 8.6 6.4 5Z" /></svg>Not included</span></td>
          <td class="p-4"><span class="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400"><svg class="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Included</span></td>
          <td class="p-4"><span class="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400"><svg class="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Included</span></td>
        </tr>
        <tr class="border-b border-gray-100 last:border-0 dark:border-gray-800/60">
          <th scope="row" class="p-4 font-medium text-gray-700 dark:text-gray-300">SSO / SAML</th>
          <td class="p-4"><span class="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500"><svg class="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.4 5A1 1 0 0 0 5 6.4L8.6 10 5 13.6A1 1 0 0 0 6.4 15L10 11.4 13.6 15a1 1 0 0 0 1.4-1.4L11.4 10 15 6.4A1 1 0 0 0 13.6 5L10 8.6 6.4 5Z" /></svg>Not included</span></td>
          <td class="p-4"><span class="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500"><svg class="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.4 5A1 1 0 0 0 5 6.4L8.6 10 5 13.6A1 1 0 0 0 6.4 15L10 11.4 13.6 15a1 1 0 0 0 1.4-1.4L11.4 10 15 6.4A1 1 0 0 0 13.6 5L10 8.6 6.4 5Z" /></svg>Not included</span></td>
          <td class="p-4"><span class="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400"><svg class="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Included</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</section>`,
      react: `const PLANS = ['Starter', 'Team', 'Business'];

const ROWS = [
  { feature: 'Projects', values: ['3', '25', 'Unlimited'] },
  { feature: 'Team members', values: ['1', '10', 'Unlimited'] },
  { feature: 'Priority support', values: [false, true, true] },
  { feature: 'SSO / SAML', values: [false, false, true] },
  { feature: 'Audit log', values: [false, true, true] },
];

function CellValue({ value }) {
  if (typeof value === 'string') return <span className="text-gray-700 dark:text-gray-300">{value}</span>;
  if (value) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400">
        <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
        Included
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
      <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.4 5A1 1 0 0 0 5 6.4L8.6 10 5 13.6A1 1 0 0 0 6.4 15L10 11.4 13.6 15a1 1 0 0 0 1.4-1.4L11.4 10 15 6.4A1 1 0 0 0 13.6 5L10 8.6 6.4 5Z" /></svg>
      Not included
    </span>
  );
}

export function PricingFeatureTable({ plans = PLANS, rows = ROWS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 \${className}\`} aria-labelledby="feature-table-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="feature-table-heading">
        Compare every plan
      </h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800" tabIndex={0} role="region" aria-label="Plan comparison, scrollable">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th scope="col" className="p-4 font-semibold text-gray-900 dark:text-gray-100">Feature</th>
              {plans.map((plan) => (
                <th key={plan} scope="col" className="p-4 font-semibold text-gray-900 dark:text-gray-100">{plan}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-gray-100 last:border-0 dark:border-gray-800/60">
                <th scope="row" className="p-4 font-medium text-gray-700 dark:text-gray-300">{row.feature}</th>
                {row.values.map((value, i) => (
                  <td key={\`\${row.feature}-\${plans[i] ?? i}\`} className="p-4"><CellValue value={value} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}`,
      typescript: `export interface FeatureRow {
  feature: string;
  values: Array<string | boolean>;
}

export interface PricingFeatureTableProps {
  plans?: string[];
  rows?: FeatureRow[];
  className?: string;
}

const PLANS = ['Starter', 'Team', 'Business'];

const ROWS: FeatureRow[] = [
  { feature: 'Projects', values: ['3', '25', 'Unlimited'] },
  { feature: 'Team members', values: ['1', '10', 'Unlimited'] },
  { feature: 'Priority support', values: [false, true, true] },
  { feature: 'SSO / SAML', values: [false, false, true] },
  { feature: 'Audit log', values: [false, true, true] },
];

function CellValue({ value }: { value: string | boolean }): JSX.Element {
  if (typeof value === 'string') return <span className="text-gray-700 dark:text-gray-300">{value}</span>;
  if (value) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400">
        <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
        Included
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
      <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.4 5A1 1 0 0 0 5 6.4L8.6 10 5 13.6A1 1 0 0 0 6.4 15L10 11.4 13.6 15a1 1 0 0 0 1.4-1.4L11.4 10 15 6.4A1 1 0 0 0 13.6 5L10 8.6 6.4 5Z" /></svg>
      Not included
    </span>
  );
}

export function PricingFeatureTable({ plans = PLANS, rows = ROWS, className = '' }: PricingFeatureTableProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 \${className}\`} aria-labelledby="feature-table-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="feature-table-heading">
        Compare every plan
      </h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800" tabIndex={0} role="region" aria-label="Plan comparison, scrollable">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th scope="col" className="p-4 font-semibold text-gray-900 dark:text-gray-100">Feature</th>
              {plans.map((plan: string) => (
                <th key={plan} scope="col" className="p-4 font-semibold text-gray-900 dark:text-gray-100">{plan}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: FeatureRow) => (
              <tr key={row.feature} className="border-b border-gray-100 last:border-0 dark:border-gray-800/60">
                <th scope="row" className="p-4 font-medium text-gray-700 dark:text-gray-300">{row.feature}</th>
                {row.values.map((value: string | boolean, i: number) => (
                  <td key={\`\${row.feature}-\${plans[i] ?? i}\`} className="p-4"><CellValue value={value} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-gradient-cards',
    category: 'pricing',
    tags: ['pricing', 'gradient', 'cards', 'tiers', 'colorful'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'tiers', type: 'Tier[]', default: 'TIERS', descriptionKey: 'tiers' },
      { name: 'ctaLabel', type: 'string', default: "'Choose plan'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Gradients are decorative only; the price stays real text on a dark-enough
     gradient to clear AA, and "Most popular" is a text badge plus a ring, not
     colour alone. One column on phones, two at sm, three at lg. -->
<section class="mx-auto w-full max-w-5xl px-4" aria-labelledby="gradient-cards-heading">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="gradient-cards-heading">
    Pick your gradient
  </h2>
  <ul class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
    <li class="flex">
      <article class="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-6 text-white" aria-labelledby="gradient-lite">
        <h3 class="text-base font-semibold" id="gradient-lite">Lite</h3>
        <p class="mt-3 flex items-baseline gap-1"><span class="text-4xl font-bold tracking-tight">$9</span><span class="text-sm text-white/80">/mo</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>5 projects</li>
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>2 GB storage</li>
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Community support</li>
        </ul>
        <a href="#" class="block rounded-lg bg-white/95 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none">Choose plan<span class="sr-only"> Lite</span></a>
      </article>
    </li>
    <li class="flex">
      <article class="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white ring-2 ring-white/70 ring-offset-2 ring-offset-white dark:ring-offset-gray-950" aria-labelledby="gradient-plus">
        <p class="mb-3 inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">Most popular</p>
        <h3 class="text-base font-semibold" id="gradient-plus">Plus</h3>
        <p class="mt-3 flex items-baseline gap-1"><span class="text-4xl font-bold tracking-tight">$24</span><span class="text-sm text-white/80">/mo</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Unlimited projects</li>
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>100 GB storage</li>
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Priority support</li>
        </ul>
        <a href="#" class="block rounded-lg bg-white/95 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none">Choose plan<span class="sr-only"> Plus</span></a>
      </article>
    </li>
    <li class="flex">
      <article class="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-700 p-6 text-white" aria-labelledby="gradient-scale">
        <h3 class="text-base font-semibold" id="gradient-scale">Scale</h3>
        <p class="mt-3 flex items-baseline gap-1"><span class="text-4xl font-bold tracking-tight">$59</span><span class="text-sm text-white/80">/mo</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Everything in Plus</li>
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>SSO &amp; SCIM</li>
          <li class="flex items-start gap-2 text-sm text-white/90"><svg class="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Dedicated manager</li>
        </ul>
        <a href="#" class="block rounded-lg bg-white/95 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none">Choose plan<span class="sr-only"> Scale</span></a>
      </article>
    </li>
  </ul>
</section>`,
      react: `const TIERS = [
  { id: 'lite', name: 'Lite', price: '$9', period: '/mo', features: ['5 projects', '2 GB storage', 'Community support'], gradient: 'from-slate-700 to-slate-900' },
  { id: 'plus', name: 'Plus', price: '$24', period: '/mo', features: ['Unlimited projects', '100 GB storage', 'Priority support'], gradient: 'from-blue-600 to-indigo-700', featured: true },
  { id: 'scale', name: 'Scale', price: '$59', period: '/mo', features: ['Everything in Plus', 'SSO & SCIM', 'Dedicated manager'], gradient: 'from-violet-600 to-fuchsia-700' },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingGradientCards({ tiers = TIERS, ctaLabel = 'Choose plan', className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 \${className}\`} aria-labelledby="gradient-cards-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="gradient-cards-heading">
        Pick your gradient
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`gradient-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white',
                tier.gradient,
                tier.featured ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-white dark:ring-offset-gray-950' : '',
              ].join(' ')}
            >
              {tier.featured && (
                <p className="mb-3 inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">Most popular</p>
              )}
              <h3 className="text-base font-semibold" id={\`gradient-\${tier.id}\`}>{tier.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                <span className="text-sm text-white/80">{tier.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-white/90"><CheckIcon />{feature}</li>
                ))}
              </ul>
              <a href="#" className="block rounded-lg bg-white/95 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none">
                {ctaLabel}
                <span className="sr-only"> {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  gradient: string;
  featured?: boolean;
}

export interface PricingGradientCardsProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  { id: 'lite', name: 'Lite', price: '$9', period: '/mo', features: ['5 projects', '2 GB storage', 'Community support'], gradient: 'from-slate-700 to-slate-900' },
  { id: 'plus', name: 'Plus', price: '$24', period: '/mo', features: ['Unlimited projects', '100 GB storage', 'Priority support'], gradient: 'from-blue-600 to-indigo-700', featured: true },
  { id: 'scale', name: 'Scale', price: '$59', period: '/mo', features: ['Everything in Plus', 'SSO & SCIM', 'Dedicated manager'], gradient: 'from-violet-600 to-fuchsia-700' },
];

function CheckIcon(): JSX.Element {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingGradientCards({ tiers = TIERS, ctaLabel = 'Choose plan', className = '' }: PricingGradientCardsProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 \${className}\`} aria-labelledby="gradient-cards-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="gradient-cards-heading">
        Pick your gradient
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier: Tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`gradient-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white',
                tier.gradient,
                tier.featured ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-white dark:ring-offset-gray-950' : '',
              ].join(' ')}
            >
              {tier.featured ? (
                <p className="mb-3 inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">Most popular</p>
              ) : null}
              <h3 className="text-base font-semibold" id={\`gradient-\${tier.id}\`}>{tier.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                <span className="text-sm text-white/80">{tier.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-white/90"><CheckIcon />{feature}</li>
                ))}
              </ul>
              <a href="#" className="block rounded-lg bg-white/95 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none">
                {ctaLabel}
                <span className="sr-only"> {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-minimal',
    category: 'pricing',
    tags: ['pricing', 'minimal', 'single', 'simple', 'clean'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'price', type: 'string', default: "'$16'", descriptionKey: 'price' },
      { name: 'features', type: 'string[]', default: 'FEATURES', descriptionKey: 'features' },
      { name: 'ctaLabel', type: 'string', default: "'Start free trial'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- One centred plan, no card chrome; type scales stay fluid so nothing clips at
     320px. -->
<section class="mx-auto w-full max-w-md px-4 text-center" aria-labelledby="minimal-heading">
  <h2 class="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400" id="minimal-heading">Pro</h2>
  <p class="mt-3 flex items-baseline justify-center gap-1">
    <span class="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$16</span>
    <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
  </p>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">One plan. Everything included.</p>
  <ul class="mx-auto mt-6 grid max-w-xs gap-2.5 text-left">
    <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Unlimited projects</li>
    <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>All integrations</li>
    <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>No usage caps</li>
    <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Cancel anytime</li>
  </ul>
  <a href="#" class="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900">Start free trial</a>
</section>`,
      react: `const FEATURES = ['Unlimited projects', 'All integrations', 'No usage caps', 'Cancel anytime'];

export function PricingMinimal({
  name = 'Pro',
  price = '$16',
  period = '/month',
  description = 'One plan. Everything included.',
  features = FEATURES,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-md px-4 text-center \${className}\`} aria-labelledby="minimal-heading">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400" id="minimal-heading">{name}</h2>
      <p className="mt-3 flex items-baseline justify-center gap-1">
        <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
      </p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <ul className="mx-auto mt-6 grid max-w-xs gap-2.5 text-left">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
            {feature}
          </li>
        ))}
      </ul>
      <a href={ctaHref} className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
    </section>
  );
}`,
      typescript: `export interface PricingMinimalProps {
  name?: string;
  price?: string;
  period?: string;
  description?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const FEATURES = ['Unlimited projects', 'All integrations', 'No usage caps', 'Cancel anytime'];

export function PricingMinimal({
  name = 'Pro',
  price = '$16',
  period = '/month',
  description = 'One plan. Everything included.',
  features = FEATURES,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: PricingMinimalProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-md px-4 text-center \${className}\`} aria-labelledby="minimal-heading">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400" id="minimal-heading">{name}</h2>
      <p className="mt-3 flex items-baseline justify-center gap-1">
        <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
      </p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <ul className="mx-auto mt-6 grid max-w-xs gap-2.5 text-left">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
            {feature}
          </li>
        ))}
      </ul>
      <a href={ctaHref} className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-annual-discount',
    category: 'pricing',
    tags: ['pricing', 'annual', 'discount', 'savings', 'yearly'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'tiers', type: 'Tier[]', default: 'TIERS', descriptionKey: 'tiers' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Static annual pricing: the crossed-out monthly price uses <s> (real
     strikethrough semantics), and the discount is stated in words ("Save 20%")
     rather than signalled by colour alone. -->
<section class="mx-auto w-full max-w-3xl px-4" aria-labelledby="annual-discount-heading">
  <div class="text-center">
    <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="annual-discount-heading">Save with annual billing</h2>
    <p class="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">Two months free every year</p>
  </div>
  <ul class="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch">
    <li class="flex">
      <article class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" aria-labelledby="annual-solo">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="annual-solo">Solo</h3>
          <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">Save 20%</span>
        </div>
        <p class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$8</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/mo</span>
          <s class="text-sm text-gray-400 dark:text-gray-500">$10</s>
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Billed $96 yearly</p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>1 seat</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>20 GB storage</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Standard support</li>
        </ul>
        <a href="#" class="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started<span class="sr-only"> with Solo</span></a>
      </article>
    </li>
    <li class="flex">
      <article class="flex flex-1 flex-col rounded-2xl border-2 border-blue-600 bg-white p-6 dark:border-blue-500 dark:bg-gray-900" aria-labelledby="annual-team">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="annual-team">Team</h3>
          <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">Save 20%</span>
        </div>
        <p class="mt-4 flex items-baseline gap-2">
          <span class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$20</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/mo</span>
          <s class="text-sm text-gray-400 dark:text-gray-500">$25</s>
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Billed $240 yearly</p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>5 seats</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>500 GB storage</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Priority support</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Audit log</li>
        </ul>
        <a href="#" class="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started<span class="sr-only"> with Team</span></a>
      </article>
    </li>
  </ul>
</section>`,
      react: `const TIERS = [
  { id: 'solo', name: 'Solo', annualPerMonth: '$8', monthlyPrice: '$10', billedNote: 'Billed $96 yearly', savings: 'Save 20%', features: ['1 seat', '20 GB storage', 'Standard support'] },
  { id: 'team', name: 'Team', annualPerMonth: '$20', monthlyPrice: '$25', billedNote: 'Billed $240 yearly', savings: 'Save 20%', features: ['5 seats', '500 GB storage', 'Priority support', 'Audit log'], highlighted: true },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingAnnualDiscount({ tiers = TIERS, ctaLabel = 'Get started', className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 \${className}\`} aria-labelledby="annual-discount-heading">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="annual-discount-heading">Save with annual billing</h2>
        <p className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">Two months free every year</p>
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`annual-\${tier.id}\`}
              className={[
                'flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.highlighted ? 'border-2 border-blue-600 dark:border-blue-500' : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={\`annual-\${tier.id}\`}>{tier.name}</h3>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">{tier.savings}</span>
              </div>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{tier.annualPerMonth}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">/mo</span>
                <s className="text-sm text-gray-400 dark:text-gray-500">{tier.monthlyPrice}</s>
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{tier.billedNote}</p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckIcon />{feature}</li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Tier {
  id: string;
  name: string;
  annualPerMonth: string;
  monthlyPrice: string;
  billedNote: string;
  savings: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingAnnualDiscountProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  { id: 'solo', name: 'Solo', annualPerMonth: '$8', monthlyPrice: '$10', billedNote: 'Billed $96 yearly', savings: 'Save 20%', features: ['1 seat', '20 GB storage', 'Standard support'] },
  { id: 'team', name: 'Team', annualPerMonth: '$20', monthlyPrice: '$25', billedNote: 'Billed $240 yearly', savings: 'Save 20%', features: ['5 seats', '500 GB storage', 'Priority support', 'Audit log'], highlighted: true },
];

function CheckIcon(): JSX.Element {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingAnnualDiscount({ tiers = TIERS, ctaLabel = 'Get started', className = '' }: PricingAnnualDiscountProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 \${className}\`} aria-labelledby="annual-discount-heading">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="annual-discount-heading">Save with annual billing</h2>
        <p className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">Two months free every year</p>
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch">
        {tiers.map((tier: Tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`annual-\${tier.id}\`}
              className={[
                'flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.highlighted ? 'border-2 border-blue-600 dark:border-blue-500' : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={\`annual-\${tier.id}\`}>{tier.name}</h3>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">{tier.savings}</span>
              </div>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{tier.annualPerMonth}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">/mo</span>
                <s className="text-sm text-gray-400 dark:text-gray-500">{tier.monthlyPrice}</s>
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{tier.billedNote}</p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckIcon />{feature}</li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-per-seat',
    category: 'pricing',
    tags: ['pricing', 'per-seat', 'calculator', 'stepper', 'team'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      { name: 'perSeat', type: 'number', default: '7', descriptionKey: 'perSeat' },
      { name: 'minSeats', type: 'number', default: '1', descriptionKey: 'minSeats' },
      { name: 'maxSeats', type: 'number', default: '50', descriptionKey: 'maxSeats' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Stepper buttons are 40x40 tap targets; the live total sits in an <output>
     with aria-live so the recomputed price is announced. Vanilla JS keeps the
     count clamped between min and max. -->
<section class="mx-auto w-full max-w-md px-4" aria-labelledby="per-seat-heading" data-per-seat="7" data-min="1" data-max="50">
  <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="per-seat-heading">Team plan</h2>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">$7 per seat, per month.</p>
    <div class="mt-5 flex items-center justify-between gap-4">
      <span id="per-seat-label" class="text-sm font-medium text-gray-700 dark:text-gray-300">Seats</span>
      <div class="flex items-center gap-2">
        <button type="button" data-step="-1" aria-label="Remove one seat" class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">&minus;</button>
        <span data-seats class="w-10 text-center text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite" aria-labelledby="per-seat-label">3</span>
        <button type="button" data-step="1" aria-label="Add one seat" class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">+</button>
      </div>
    </div>
    <p class="mt-6 flex flex-wrap items-baseline gap-x-2 border-t border-gray-100 pt-5 dark:border-gray-800">
      <output data-total class="text-3xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite">$21</output>
      <span class="text-sm text-gray-600 dark:text-gray-400">/month</span>
      <span data-summary class="basis-full text-xs text-gray-500 dark:text-gray-400">3 seats &times; $7</span>
    </p>
    <a href="#" class="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Start with this team</a>
  </div>
</section>
<script>
  document.querySelectorAll('[data-per-seat]').forEach(function (root) {
    var per = Number(root.dataset.perSeat), min = Number(root.dataset.min), max = Number(root.dataset.max);
    var seatsEl = root.querySelector('[data-seats]'), totalEl = root.querySelector('[data-total]'), summaryEl = root.querySelector('[data-summary]');
    var dec = root.querySelector('[data-step="-1"]'), inc = root.querySelector('[data-step="1"]');
    var seats = Number(seatsEl.textContent) || min;
    function render() {
      seatsEl.textContent = String(seats);
      totalEl.textContent = '$' + per * seats;
      summaryEl.textContent = seats + (seats === 1 ? ' seat' : ' seats') + ' \\u00d7 $' + per;
      dec.disabled = seats <= min;
      inc.disabled = seats >= max;
    }
    dec.addEventListener('click', function () { seats = Math.max(min, seats - 1); render(); });
    inc.addEventListener('click', function () { seats = Math.min(max, seats + 1); render(); });
    render();
  });
</script>`,
      react: `import { useState } from 'react';

export function PricingPerSeat({
  perSeat = 7,
  minSeats = 1,
  maxSeats = 50,
  initialSeats = 3,
  currency = '$',
  ctaLabel = 'Start with this team',
  className = '',
}) {
  const [seats, setSeats] = useState(initialSeats);
  const clamp = (n) => Math.min(maxSeats, Math.max(minSeats, n));
  const total = perSeat * seats;
  const seatWord = seats === 1 ? 'seat' : 'seats';

  return (
    <section className={\`mx-auto w-full max-w-md px-4 \${className}\`} aria-labelledby="per-seat-heading">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100" id="per-seat-heading">Team plan</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{currency}{perSeat} per seat, per month.</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span id="per-seat-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">Seats</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSeats((s) => clamp(s - 1))} disabled={seats <= minSeats} aria-label="Remove one seat" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">&minus;</button>
            <span className="w-10 text-center text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite" aria-labelledby="per-seat-label">{seats}</span>
            <button type="button" onClick={() => setSeats((s) => clamp(s + 1))} disabled={seats >= maxSeats} aria-label="Add one seat" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">+</button>
          </div>
        </div>
        <p className="mt-6 flex flex-wrap items-baseline gap-x-2 border-t border-gray-100 pt-5 dark:border-gray-800">
          <output className="text-3xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite">{currency}{total}</output>
          <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
          <span className="basis-full text-xs text-gray-500 dark:text-gray-400">{seats} {seatWord} &times; {currency}{perSeat}</span>
        </p>
        <a href="#" className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface PricingPerSeatProps {
  perSeat?: number;
  minSeats?: number;
  maxSeats?: number;
  initialSeats?: number;
  currency?: string;
  ctaLabel?: string;
  className?: string;
}

export function PricingPerSeat({
  perSeat = 7,
  minSeats = 1,
  maxSeats = 50,
  initialSeats = 3,
  currency = '$',
  ctaLabel = 'Start with this team',
  className = '',
}: PricingPerSeatProps): JSX.Element {
  const [seats, setSeats] = useState<number>(initialSeats);
  const clamp = (n: number): number => Math.min(maxSeats, Math.max(minSeats, n));
  const total = perSeat * seats;
  const seatWord = seats === 1 ? 'seat' : 'seats';

  return (
    <section className={\`mx-auto w-full max-w-md px-4 \${className}\`} aria-labelledby="per-seat-heading">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100" id="per-seat-heading">Team plan</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{currency}{perSeat} per seat, per month.</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span id="per-seat-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">Seats</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSeats((s) => clamp(s - 1))} disabled={seats <= minSeats} aria-label="Remove one seat" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">&minus;</button>
            <span className="w-10 text-center text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite" aria-labelledby="per-seat-label">{seats}</span>
            <button type="button" onClick={() => setSeats((s) => clamp(s + 1))} disabled={seats >= maxSeats} aria-label="Add one seat" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">+</button>
          </div>
        </div>
        <p className="mt-6 flex flex-wrap items-baseline gap-x-2 border-t border-gray-100 pt-5 dark:border-gray-800">
          <output className="text-3xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100" aria-live="polite">{currency}{total}</output>
          <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
          <span className="basis-full text-xs text-gray-500 dark:text-gray-400">{seats} {seatWord} &times; {currency}{perSeat}</span>
        </p>
        <a href="#" className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-freemium',
    category: 'pricing',
    tags: ['pricing', 'freemium', 'free', 'upgrade', 'two-plan'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'plans', type: 'Plan[]', default: 'PLANS', descriptionKey: 'plans' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Free and paid stack to one column below md; the paid card inverts to a dark
     surface so the upgrade reads as the emphasis without relying on hue. -->
<section class="mx-auto w-full max-w-3xl px-4" aria-labelledby="freemium-heading">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="freemium-heading">Start free, upgrade when ready</h2>
  <ul class="mt-8 grid gap-5 md:grid-cols-2 md:items-stretch">
    <li class="flex">
      <article class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100" aria-labelledby="freemium-free">
        <h3 class="text-base font-semibold" id="freemium-free">Free</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Get started, no card required.</p>
        <p class="mt-4 flex items-baseline gap-1"><span class="text-3xl font-bold tracking-tight">$0</span><span class="text-sm text-gray-600 dark:text-gray-400">forever</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>1 project</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>100 monthly events</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Community support</li>
        </ul>
        <a href="#" class="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Create free account</a>
      </article>
    </li>
    <li class="flex">
      <article class="flex flex-1 flex-col rounded-2xl bg-gray-900 p-6 text-white dark:bg-gray-800" aria-labelledby="freemium-pro">
        <h3 class="text-base font-semibold" id="freemium-pro">Pro</h3>
        <p class="mt-1 text-sm text-gray-300">Everything in Free, plus room to grow.</p>
        <p class="mt-4 flex items-baseline gap-1"><span class="text-3xl font-bold tracking-tight">$18</span><span class="text-sm text-gray-300">/month</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-200"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Unlimited projects</li>
          <li class="flex items-start gap-2 text-sm text-gray-200"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Unlimited events</li>
          <li class="flex items-start gap-2 text-sm text-gray-200"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Priority support</li>
          <li class="flex items-start gap-2 text-sm text-gray-200"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Custom domains</li>
        </ul>
        <a href="#" class="block rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none">Upgrade to Pro</a>
      </article>
    </li>
  </ul>
</section>`,
      react: `const PLANS = [
  { id: 'free', name: 'Free', price: '$0', period: 'forever', blurb: 'Get started, no card required.', features: ['1 project', '100 monthly events', 'Community support'], ctaLabel: 'Create free account' },
  { id: 'pro', name: 'Pro', price: '$18', period: '/month', blurb: 'Everything in Free, plus room to grow.', features: ['Unlimited projects', 'Unlimited events', 'Priority support', 'Custom domains'], ctaLabel: 'Upgrade to Pro', paid: true },
];

export function PricingFreemium({ plans = PLANS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 \${className}\`} aria-labelledby="freemium-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="freemium-heading">Start free, upgrade when ready</h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-2 md:items-stretch">
        {plans.map((plan) => (
          <li className="flex" key={plan.id}>
            <article
              aria-labelledby={\`freemium-\${plan.id}\`}
              className={[
                'flex flex-1 flex-col rounded-2xl p-6',
                plan.paid ? 'bg-gray-900 text-white dark:bg-gray-800' : 'border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100',
              ].join(' ')}
            >
              <h3 className="text-base font-semibold" id={\`freemium-\${plan.id}\`}>{plan.name}</h3>
              <p className={\`mt-1 text-sm \${plan.paid ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}\`}>{plan.blurb}</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                <span className={\`text-sm \${plan.paid ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}\`}>{plan.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className={\`flex items-start gap-2 text-sm \${plan.paid ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}\`}>
                    <svg className={\`mt-0.5 h-4 w-4 flex-none \${plan.paid ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'}\`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none',
                  plan.paid ? 'bg-white text-gray-900 hover:bg-gray-200 focus-visible:ring-white focus-visible:ring-offset-gray-900' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                ].join(' ')}
              >
                {plan.ctaLabel}
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  ctaLabel: string;
  paid?: boolean;
}

export interface PricingFreemiumProps {
  plans?: Plan[];
  className?: string;
}

const PLANS: Plan[] = [
  { id: 'free', name: 'Free', price: '$0', period: 'forever', blurb: 'Get started, no card required.', features: ['1 project', '100 monthly events', 'Community support'], ctaLabel: 'Create free account' },
  { id: 'pro', name: 'Pro', price: '$18', period: '/month', blurb: 'Everything in Free, plus room to grow.', features: ['Unlimited projects', 'Unlimited events', 'Priority support', 'Custom domains'], ctaLabel: 'Upgrade to Pro', paid: true },
];

export function PricingFreemium({ plans = PLANS, className = '' }: PricingFreemiumProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 \${className}\`} aria-labelledby="freemium-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="freemium-heading">Start free, upgrade when ready</h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-2 md:items-stretch">
        {plans.map((plan: Plan) => (
          <li className="flex" key={plan.id}>
            <article
              aria-labelledby={\`freemium-\${plan.id}\`}
              className={[
                'flex flex-1 flex-col rounded-2xl p-6',
                plan.paid ? 'bg-gray-900 text-white dark:bg-gray-800' : 'border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100',
              ].join(' ')}
            >
              <h3 className="text-base font-semibold" id={\`freemium-\${plan.id}\`}>{plan.name}</h3>
              <p className={\`mt-1 text-sm \${plan.paid ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}\`}>{plan.blurb}</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                <span className={\`text-sm \${plan.paid ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}\`}>{plan.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {plan.features.map((feature: string) => (
                  <li key={feature} className={\`flex items-start gap-2 text-sm \${plan.paid ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}\`}>
                    <svg className={\`mt-0.5 h-4 w-4 flex-none \${plan.paid ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'}\`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none',
                  plan.paid ? 'bg-white text-gray-900 hover:bg-gray-200 focus-visible:ring-white focus-visible:ring-offset-gray-900' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                ].join(' ')}
              >
                {plan.ctaLabel}
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-highlight-popular',
    category: 'pricing',
    tags: ['pricing', 'popular', 'highlight', 'tiers', 'badge'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'tiers', type: 'Tier[]', default: 'TIERS', descriptionKey: 'tiers' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The popular tier is cued by BOTH a text badge ("Most popular") and a ring,
     never colour alone; one column on phones, three from lg. -->
<section class="mx-auto w-full max-w-5xl px-4" aria-labelledby="highlight-popular-heading">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="highlight-popular-heading">Plans for every stage</h2>
  <ul class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" aria-labelledby="popular-hobby">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="popular-hobby">Hobby</h3>
        <p class="mt-3 flex items-baseline gap-1"><span class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$0</span><span class="text-sm text-gray-600 dark:text-gray-400">/mo</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>1 project</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Community support</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>1 GB bandwidth</li>
        </ul>
        <a href="#" class="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started<span class="sr-only"> with Hobby</span></a>
      </article>
    </li>
    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl bg-white p-6 ring-2 ring-blue-600 dark:bg-gray-900 dark:ring-blue-500" aria-labelledby="popular-pro">
        <p class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">Most popular</p>
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="popular-pro">Pro</h3>
        <p class="mt-3 flex items-baseline gap-1"><span class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$20</span><span class="text-sm text-gray-600 dark:text-gray-400">/mo</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Unlimited projects</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Priority support</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>100 GB bandwidth</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Analytics</li>
        </ul>
        <a href="#" class="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started<span class="sr-only"> with Pro</span></a>
      </article>
    </li>
    <li class="flex">
      <article class="relative flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900" aria-labelledby="popular-team">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="popular-team">Team</h3>
        <p class="mt-3 flex items-baseline gap-1"><span class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$50</span><span class="text-sm text-gray-600 dark:text-gray-400">/mo</span></p>
        <ul class="my-5 grid flex-1 gap-2.5">
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Everything in Pro</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>SSO</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Roles &amp; permissions</li>
          <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Audit log</li>
        </ul>
        <a href="#" class="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Get started<span class="sr-only"> with Team</span></a>
      </article>
    </li>
  </ul>
</section>`,
      react: `const TIERS = [
  { id: 'hobby', name: 'Hobby', price: '$0', period: '/mo', features: ['1 project', 'Community support', '1 GB bandwidth'] },
  { id: 'pro', name: 'Pro', price: '$20', period: '/mo', features: ['Unlimited projects', 'Priority support', '100 GB bandwidth', 'Analytics'], popular: true },
  { id: 'team', name: 'Team', price: '$50', period: '/mo', features: ['Everything in Pro', 'SSO', 'Roles & permissions', 'Audit log'] },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingHighlightPopular({ tiers = TIERS, ctaLabel = 'Get started', className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 \${className}\`} aria-labelledby="highlight-popular-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="highlight-popular-heading">Plans for every stage</h2>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`popular-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.popular ? 'ring-2 ring-blue-600 dark:ring-blue-500' : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              {tier.popular && (
                <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">Most popular</p>
              )}
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={\`popular-\${tier.id}\`}>{tier.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{tier.price}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckIcon />{feature}</li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

export interface PricingHighlightPopularProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  { id: 'hobby', name: 'Hobby', price: '$0', period: '/mo', features: ['1 project', 'Community support', '1 GB bandwidth'] },
  { id: 'pro', name: 'Pro', price: '$20', period: '/mo', features: ['Unlimited projects', 'Priority support', '100 GB bandwidth', 'Analytics'], popular: true },
  { id: 'team', name: 'Team', price: '$50', period: '/mo', features: ['Everything in Pro', 'SSO', 'Roles & permissions', 'Audit log'] },
];

function CheckIcon(): JSX.Element {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingHighlightPopular({ tiers = TIERS, ctaLabel = 'Get started', className = '' }: PricingHighlightPopularProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 \${className}\`} aria-labelledby="highlight-popular-heading">
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100" id="highlight-popular-heading">Plans for every stage</h2>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier: Tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={\`popular-\${tier.id}\`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.popular ? 'ring-2 ring-blue-600 dark:ring-blue-500' : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              {tier.popular ? (
                <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">Most popular</p>
              ) : null}
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={\`popular-\${tier.id}\`}>{tier.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{tier.price}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>
              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckIcon />{feature}</li>
                ))}
              </ul>
              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'pricing-faq-combined',
    category: 'pricing',
    tags: ['pricing', 'faq', 'accordion', 'details', 'combined'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'price', type: 'string', default: "'$16'", descriptionKey: 'price' },
      { name: 'features', type: 'string[]', default: 'FEATURES', descriptionKey: 'features' },
      { name: 'faqs', type: 'Faq[]', default: 'FAQS', descriptionKey: 'faqs' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The FAQ uses native <details>/<summary>: zero JavaScript, keyboard-operable
     for free, and the chevron rotates via group-open. The price panel and the
     FAQ stack to one column below lg. -->
<section class="mx-auto w-full max-w-4xl px-4" aria-labelledby="faq-combined-heading">
  <h2 class="sr-only" id="faq-combined-heading">Pricing and frequently asked questions</h2>
  <div class="grid gap-6 lg:grid-cols-2 lg:items-start">
    <article class="rounded-2xl border-2 border-blue-600 bg-white p-6 dark:border-blue-500 dark:bg-gray-900">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Pro</h3>
      <p class="mt-3 flex items-baseline gap-1"><span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$16</span><span class="text-sm text-gray-600 dark:text-gray-400">/month</span></p>
      <ul class="my-5 grid gap-2.5">
        <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Unlimited projects</li>
        <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>All integrations</li>
        <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><svg class="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>Priority support</li>
      </ul>
      <a href="#" class="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Start free trial</a>
    </article>
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Frequently asked</h3>
      <ul class="mt-3 grid gap-2">
        <li>
          <details class="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100">Is there a free trial?<svg class="h-4 w-4 flex-none text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" /></svg></summary>
            <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Yes. 14 days, no card required. Cancel any time before it ends and you are not charged.</p>
          </details>
        </li>
        <li>
          <details class="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100">Can I change plans later?<svg class="h-4 w-4 flex-none text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" /></svg></summary>
            <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Upgrade or downgrade whenever you like. Changes are prorated to the day.</p>
          </details>
        </li>
        <li>
          <details class="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100">Do you offer refunds?<svg class="h-4 w-4 flex-none text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" /></svg></summary>
            <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">We refund annual plans in full within 30 days of purchase, no questions asked.</p>
          </details>
        </li>
      </ul>
    </div>
  </div>
</section>`,
      react: `const FEATURES = ['Unlimited projects', 'All integrations', 'Priority support'];

const FAQS = [
  { id: 'trial', question: 'Is there a free trial?', answer: 'Yes. 14 days, no card required. Cancel any time before it ends and you are not charged.' },
  { id: 'switch', question: 'Can I change plans later?', answer: 'Upgrade or downgrade whenever you like. Changes are prorated to the day.' },
  { id: 'refund', question: 'Do you offer refunds?', answer: 'We refund annual plans in full within 30 days of purchase, no questions asked.' },
];

export function PricingFaqCombined({
  planName = 'Pro',
  price = '$16',
  period = '/month',
  features = FEATURES,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  faqs = FAQS,
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 \${className}\`} aria-labelledby="faq-combined-heading">
      <h2 className="sr-only" id="faq-combined-heading">Pricing and frequently asked questions</h2>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <article className="rounded-2xl border-2 border-blue-600 bg-white p-6 dark:border-blue-500 dark:bg-gray-900">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{planName}</h3>
          <p className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
          </p>
          <ul className="my-5 grid gap-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
                {feature}
              </li>
            ))}
          </ul>
          <a href={ctaHref} className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
        </article>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Frequently asked</h3>
          <ul className="mt-3 grid gap-2">
            {faqs.map((faq) => (
              <li key={faq.id}>
                <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100">
                    {faq.question}
                    <svg className="h-4 w-4 flex-none text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" /></svg>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface PricingFaqCombinedProps {
  planName?: string;
  price?: string;
  period?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  faqs?: Faq[];
  className?: string;
}

const FEATURES = ['Unlimited projects', 'All integrations', 'Priority support'];

const FAQS: Faq[] = [
  { id: 'trial', question: 'Is there a free trial?', answer: 'Yes. 14 days, no card required. Cancel any time before it ends and you are not charged.' },
  { id: 'switch', question: 'Can I change plans later?', answer: 'Upgrade or downgrade whenever you like. Changes are prorated to the day.' },
  { id: 'refund', question: 'Do you offer refunds?', answer: 'We refund annual plans in full within 30 days of purchase, no questions asked.' },
];

export function PricingFaqCombined({
  planName = 'Pro',
  price = '$16',
  period = '/month',
  features = FEATURES,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  faqs = FAQS,
  className = '',
}: PricingFaqCombinedProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 \${className}\`} aria-labelledby="faq-combined-heading">
      <h2 className="sr-only" id="faq-combined-heading">Pricing and frequently asked questions</h2>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <article className="rounded-2xl border-2 border-blue-600 bg-white p-6 dark:border-blue-500 dark:bg-gray-900">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{planName}</h3>
          <p className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
          </p>
          <ul className="my-5 grid gap-2.5">
            {features.map((feature: string) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" /></svg>
                {feature}
              </li>
            ))}
          </ul>
          <a href={ctaHref} className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
        </article>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Frequently asked</h3>
          <ul className="mt-3 grid gap-2">
            {faqs.map((faq: Faq) => (
              <li key={faq.id}>
                <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100">
                    {faq.question}
                    <svg className="h-4 w-4 flex-none text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" /></svg>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
];
