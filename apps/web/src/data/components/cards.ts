import type { ComponentEntry } from './types';

/**
 * Cards category.
 *
 * The pricing card is a plain content card, not a form - the CTA is the only
 * interactive element, so it stays a Server Component in the Next.js variant.
 * The "most popular" badge is decorative styling on top of an `aria-labelledby`
 * region so the tier name is what a screen reader announces.
 */
export const cardComponents: ComponentEntry[] = [
  {
    slug: 'pricing-card',
    category: 'cards',
    tags: ['pricing', 'card', 'saas', 'cta', 'tiers'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-18',
    updatedAt: '2026-07-02',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 2140, copies: 512, downloads: 143 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'price', type: 'string', required: true, descriptionKey: 'price', example: '$29' },
      { name: 'period', type: 'string', default: "'/month'", descriptionKey: 'period' },
      { name: 'features', type: 'string[]', required: true, descriptionKey: 'features' },
      { name: 'highlighted', type: 'boolean', default: 'false', descriptionKey: 'highlighted' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
    ],
    code: {
      html: `<article class="pricing-card pricing-card--highlighted" aria-labelledby="pricing-card-pro">
  <p class="pricing-card__badge">Most popular</p>

  <h3 class="pricing-card__name" id="pricing-card-pro">Pro</h3>

  <p class="pricing-card__price">
    <span class="pricing-card__amount">$29</span>
    <span class="pricing-card__period">/month</span>
  </p>

  <ul class="pricing-card__features">
    <li class="pricing-card__feature">
      <svg class="pricing-card__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
      Unlimited projects
    </li>
    <li class="pricing-card__feature">
      <svg class="pricing-card__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
      Priority support
    </li>
    <li class="pricing-card__feature">
      <svg class="pricing-card__check" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
      Advanced analytics
    </li>
  </ul>

  <a class="pricing-card__cta" href="#">Get started</a>
</article>`,
      css: `.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 22rem;
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.pricing-card--highlighted {
  border-color: #2563eb;
  box-shadow: 0 20px 40px -24px rgba(37, 99, 235, 0.55);
}

.pricing-card__badge {
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

.pricing-card__name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.pricing-card__price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 0.75rem 0 0;
}

.pricing-card__amount {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.pricing-card__period {
  font-size: 0.875rem;
  color: #6b7280;
}

.pricing-card__features {
  flex: 1;
  margin: 1.5rem 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.75rem;
}

.pricing-card__feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.pricing-card__check {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #2563eb;
}

.pricing-card__cta {
  display: block;
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

.pricing-card__cta:hover {
  background: #1d4ed8;
}

.pricing-card__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The badge and CTA keep #2563eb - white on it clears AA on either theme.
 */
@media (prefers-color-scheme: dark) {
  .pricing-card {
    border-color: #1f2937;
    background: #111827;
  }

  .pricing-card--highlighted {
    border-color: #2563eb;
  }

  .pricing-card__name,
  .pricing-card__amount {
    color: #f3f4f6;
  }

  .pricing-card__period {
    color: #9ca3af;
  }

  .pricing-card__feature {
    color: #d1d5db;
  }

  .pricing-card__check {
    color: #60a5fa;
  }

  .pricing-card__cta:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<article
  class="relative flex max-w-sm flex-col rounded-2xl border border-blue-600 bg-white p-7 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)] dark:bg-gray-900"
  aria-labelledby="pricing-card-pro"
>
  <p class="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
    Most popular
  </p>

  <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100" id="pricing-card-pro">Pro</h3>

  <p class="mt-3 flex items-baseline gap-1">
    <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$29</span>
    <span class="text-sm text-gray-500 dark:text-gray-400">/month</span>
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
      Advanced analytics
    </li>
  </ul>

  <a
    href="#"
    class="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Get started
  </a>
</article>`,
      react: `function CheckIcon() {
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

export function PricingCard({
  name,
  price,
  period = '/month',
  features,
  highlighted = false,
  ctaLabel = 'Get started',
  ctaHref = '#',
}) {
  const headingId = \`pricing-card-\${name.toLowerCase().replace(/\\s+/g, '-')}\`;

  return (
    <article
      aria-labelledby={headingId}
      className={[
        'relative flex max-w-sm flex-col rounded-2xl bg-white p-7 dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 shadow-sm dark:border-gray-800',
      ].join(' ')}
    >
      {highlighted && (
        <p className="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
          Most popular
        </p>
      )}

      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={headingId}>
        {name}
      </h3>

      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
      </p>

      <ul className="my-6 grid flex-1 gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={ctaHref}
        className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </article>
  );
}`,
      nextjs: `import Link from 'next/link';

// No state and no effects - this stays a Server Component, so no 'use client'.
interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

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

export function PricingCard({
  name,
  price,
  period = '/month',
  features,
  highlighted = false,
  ctaLabel = 'Get started',
  ctaHref = '#',
}: PricingCardProps) {
  const headingId = \`pricing-card-\${name.toLowerCase().replace(/\\s+/g, '-')}\`;

  return (
    <article
      aria-labelledby={headingId}
      className={[
        'relative flex max-w-sm flex-col rounded-2xl bg-white p-7 dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 shadow-sm dark:border-gray-800',
      ].join(' ')}
    >
      {highlighted && (
        <p className="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
          Most popular
        </p>
      )}

      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={headingId}>
        {name}
      </h3>

      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
      </p>

      <ul className="my-6 grid flex-1 gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </Link>
    </article>
  );
}`,
      typescript: `export interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

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

export function PricingCard({
  name,
  price,
  period = '/month',
  features,
  highlighted = false,
  ctaLabel = 'Get started',
  ctaHref = '#',
}: PricingCardProps): JSX.Element {
  const headingId = \`pricing-card-\${name.toLowerCase().replace(/\\s+/g, '-')}\`;

  return (
    <article
      aria-labelledby={headingId}
      className={[
        'relative flex max-w-sm flex-col rounded-2xl bg-white p-7 dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 shadow-sm dark:border-gray-800',
      ].join(' ')}
    >
      {highlighted ? (
        <p className="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
          Most popular
        </p>
      ) : null}

      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={headingId}>
        {name}
      </h3>

      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
      </p>

      <ul className="my-6 grid flex-1 gap-3">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={ctaHref}
        className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </article>
  );
}`,
    },
  },
  {
    slug: 'profile-card',
    category: 'cards',
    tags: ['profile', 'team', 'avatar', 'social', 'bio'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-12',
    updatedAt: '2026-06-20',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1680, copies: 402, downloads: 118 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'personName' },
      { name: 'role', type: 'string', required: true, descriptionKey: 'role' },
      { name: 'bio', type: 'string', required: true, descriptionKey: 'bio' },
      { name: 'avatarSrc', type: 'string', required: true, descriptionKey: 'avatarSrc' },
      { name: 'socials', type: 'ProfileSocial[]', default: '[]', descriptionKey: 'socials' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<article class="profile-card">
  <img class="profile-card__avatar" src="/your-image.jpg" alt="" width="80" height="80" />

  <h3 class="profile-card__name">Amara Okafor</h3>
  <p class="profile-card__role">Principal Designer</p>
  <p class="profile-card__bio">
    Twelve years spent turning sprawling product surfaces into design systems teams actually keep using.
  </p>

  <ul class="profile-card__socials">
    <li>
      <a class="profile-card__social" href="#">
        <svg class="profile-card__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.4L17.8 20Z" />
        </svg>
        <span class="profile-card__sr">Amara on X</span>
      </a>
    </li>
    <li>
      <a class="profile-card__social" href="#">
        <svg class="profile-card__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.4-.03-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z" />
        </svg>
        <span class="profile-card__sr">Amara on LinkedIn</span>
      </a>
    </li>
    <li>
      <a class="profile-card__social" href="#">
        <svg class="profile-card__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.51-4.94.01-1.09.4-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
        <span class="profile-card__sr">Amara on GitHub</span>
      </a>
    </li>
  </ul>
</article>`,
      css: `.profile-card {
  width: 100%;
  max-width: 20rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  text-align: center;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.profile-card__avatar {
  width: 5rem;
  height: 5rem;
  margin: 0 auto;
  display: block;
  border-radius: 9999px;
  object-fit: cover;
  background: #f3f4f6;
}

.profile-card__name {
  margin: 1rem 0 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.profile-card__role {
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d4ed8;
}

.profile-card__bio {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.profile-card__socials {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
}

.profile-card__social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  color: #4b5563;
  transition: background-color 150ms, color 150ms;
}

.profile-card__social:hover {
  background: #f3f4f6;
  color: #111827;
}

.profile-card__social:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.profile-card__icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Visually hidden, still announced - every icon link keeps a real name. */
.profile-card__sr {
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

@media (prefers-reduced-motion: reduce) {
  .profile-card__social {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .profile-card {
    border-color: #1f2937;
    background: #111827;
  }

  .profile-card__avatar {
    background: #1f2937;
  }

  .profile-card__name {
    color: #f3f4f6;
  }

  .profile-card__role {
    color: #60a5fa;
  }

  .profile-card__bio {
    color: #d1d5db;
  }

  .profile-card__social {
    color: #9ca3af;
  }

  .profile-card__social:hover {
    background: #1f2937;
    color: #f3f4f6;
  }

  .profile-card__social:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<article class="w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <img
    class="mx-auto block h-20 w-20 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
    src="/your-image.jpg"
    alt=""
    width="80"
    height="80"
  />

  <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Amara Okafor</h3>
  <p class="mt-0.5 text-sm font-medium text-blue-700 dark:text-blue-400">Principal Designer</p>
  <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
    Twelve years spent turning sprawling product surfaces into design systems teams actually keep using.
  </p>

  <ul class="mt-5 flex justify-center gap-2">
    <li>
      <a
        href="#"
        class="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.4L17.8 20Z" />
        </svg>
        <span class="sr-only">Amara on X</span>
      </a>
    </li>
    <li>
      <a
        href="#"
        class="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.4-.03-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z" />
        </svg>
        <span class="sr-only">Amara on LinkedIn</span>
      </a>
    </li>
    <li>
      <a
        href="#"
        class="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.51-4.94.01-1.09.4-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
        <span class="sr-only">Amara on GitHub</span>
      </a>
    </li>
  </ul>
</article>`,
      react: `const SOCIAL_PATHS = {
  x: 'M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.4L17.8 20Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.4-.03-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z',
  github:
    'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.51-4.94.01-1.09.4-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
};

export function ProfileCard({ name, role, bio, avatarSrc, socials = [], className = '' }) {
  return (
    <article
      className={\`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img
        className="mx-auto block h-20 w-20 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
        src={avatarSrc}
        alt=""
        width={80}
        height={80}
      />

      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
      <p className="mt-0.5 text-sm font-medium text-blue-700 dark:text-blue-400">{role}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p>

      {socials.length > 0 && (
        <ul className="mt-5 flex justify-center gap-2">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_PATHS[social.id]} />
                </svg>
                <span className="sr-only">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}`,
      nextjs: `// Presentational only - no state, so this stays a Server Component.
type SocialId = 'x' | 'linkedin' | 'github';

interface ProfileSocial {
  id: SocialId;
  /** Full accessible name, e.g. "Amara on GitHub". */
  label: string;
  href: string;
}

interface ProfileCardProps {
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  socials?: ProfileSocial[];
  className?: string;
}

const SOCIAL_PATHS: Record<SocialId, string> = {
  x: 'M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.4L17.8 20Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.4-.03-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z',
  github:
    'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.51-4.94.01-1.09.4-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
};

export function ProfileCard({ name, role, bio, avatarSrc, socials = [], className = '' }: ProfileCardProps) {
  return (
    <article
      className={\`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {/* Swap for next/image once you know the avatar's real dimensions. */}
      <img
        className="mx-auto block h-20 w-20 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
        src={avatarSrc}
        alt=""
        width={80}
        height={80}
      />

      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
      <p className="mt-0.5 text-sm font-medium text-blue-700 dark:text-blue-400">{role}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p>

      {socials.length > 0 ? (
        <ul className="mt-5 flex justify-center gap-2">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_PATHS[social.id]} />
                </svg>
                <span className="sr-only">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}`,
      typescript: `export type SocialId = 'x' | 'linkedin' | 'github';

export interface ProfileSocial {
  id: SocialId;
  /** Full accessible name, e.g. "Amara on GitHub". */
  label: string;
  href: string;
}

export interface ProfileCardProps {
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  socials?: ProfileSocial[];
  className?: string;
}

const SOCIAL_PATHS: Record<SocialId, string> = {
  x: 'M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.4L17.8 20Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.4-.03-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z',
  github:
    'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.51-4.94.01-1.09.4-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
};

export function ProfileCard({
  name,
  role,
  bio,
  avatarSrc,
  socials = [],
  className = '',
}: ProfileCardProps): JSX.Element {
  return (
    <article
      className={\`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img
        className="mx-auto block h-20 w-20 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
        src={avatarSrc}
        alt=""
        width={80}
        height={80}
      />

      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
      <p className="mt-0.5 text-sm font-medium text-blue-700 dark:text-blue-400">{role}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p>

      {socials.length > 0 ? (
        <ul className="mt-5 flex justify-center gap-2">
          {socials.map((social: ProfileSocial) => (
            <li key={social.id}>
              <a
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_PATHS[social.id]} />
                </svg>
                <span className="sr-only">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}`,
    },
  },
  {
    slug: 'stat-card',
    category: 'cards',
    tags: ['stat', 'metric', 'kpi', 'dashboard', 'trend'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-28',
    updatedAt: '2026-06-30',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1975, copies: 588, downloads: 164 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'trendUp', labelKey: 'trendUp' },
      { id: 'trendDown', labelKey: 'trendDown' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'statLabel' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value', example: '48,120' },
      { name: 'delta', type: 'string', required: true, descriptionKey: 'delta', example: '12.5%' },
      { name: 'trend', type: "'up' | 'down'", default: "'up'", descriptionKey: 'trend' },
      {
        name: 'period',
        type: 'string',
        default: "'vs last month'",
        descriptionKey: 'comparisonPeriod',
      },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<article class="stat-card">
  <div class="stat-card__head">
    <p class="stat-card__label">Monthly recurring revenue</p>
    <span class="stat-card__icon" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a1 1 0 0 1 1 1v1.1c1.7.3 3 1.5 3 3.1a1 1 0 1 1-2 0c0-.6-.8-1.2-2-1.2s-2 .6-2 1.2.8 1.2 2 1.2c2.2 0 4 1.4 4 3.2 0 1.6-1.3 2.8-3 3.1V16a1 1 0 1 1-2 0v-1.3c-1.7-.3-3-1.5-3-3.1a1 1 0 1 1 2 0c0 .6.8 1.2 2 1.2s2-.6 2-1.2-.8-1.2-2-1.2c-2.2 0-4-1.4-4-3.2 0-1.6 1.3-2.8 3-3.1V3a1 1 0 0 1 1-1Z" />
      </svg>
    </span>
  </div>

  <p class="stat-card__value">$48,120</p>

  <p class="stat-card__trend">
    <span class="stat-card__delta stat-card__delta--up">
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 4a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L11 7.4V15a1 1 0 1 1-2 0V7.4L6.7 9.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 10 4Z" />
      </svg>
      <span class="stat-card__sr">Up</span>
      12.5%
    </span>
    <span class="stat-card__period">vs last month</span>
  </p>
</article>`,
      css: `.stat-card {
  width: 100%;
  max-width: 20rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.stat-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.stat-card__label {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: #eff6ff;
  color: #1d4ed8;
}

.stat-card__icon svg {
  width: 1.125rem;
  height: 1.125rem;
}

.stat-card__value {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
}

.stat-card__delta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
}

.stat-card__delta svg {
  width: 0.875rem;
  height: 0.875rem;
}

.stat-card__delta--up {
  background: #f0fdf4;
  color: #15803d;
}

.stat-card__delta--down {
  background: #fef2f2;
  color: #b91c1c;
}

/* The arrow is decorative; direction is carried by this text for AT. */
.stat-card__sr {
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

.stat-card__period {
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .stat-card {
    border-color: #1f2937;
    background: #111827;
  }

  .stat-card__label,
  .stat-card__period {
    color: #9ca3af;
  }

  .stat-card__icon {
    background: #172554;
    color: #93c5fd;
  }

  .stat-card__value {
    color: #f3f4f6;
  }

  .stat-card__delta--up {
    background: #052e16;
    color: #86efac;
  }

  .stat-card__delta--down {
    background: #450a0a;
    color: #fca5a5;
  }
}`,
      tailwind: `<article class="w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <div class="flex items-start justify-between gap-3">
    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly recurring revenue</p>
    <span
      class="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      aria-hidden="true"
    >
      <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a1 1 0 0 1 1 1v1.1c1.7.3 3 1.5 3 3.1a1 1 0 1 1-2 0c0-.6-.8-1.2-2-1.2s-2 .6-2 1.2.8 1.2 2 1.2c2.2 0 4 1.4 4 3.2 0 1.6-1.3 2.8-3 3.1V16a1 1 0 1 1-2 0v-1.3c-1.7-.3-3-1.5-3-3.1a1 1 0 1 1 2 0c0 .6.8 1.2 2 1.2s2-.6 2-1.2-.8-1.2-2-1.2c-2.2 0-4-1.4-4-3.2 0-1.6 1.3-2.8 3-3.1V3a1 1 0 0 1 1-1Z" />
      </svg>
    </span>
  </div>

  <p class="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$48,120</p>

  <p class="mt-2 flex items-center gap-1.5 text-sm">
    <span class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 4a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L11 7.4V15a1 1 0 1 1-2 0V7.4L6.7 9.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 10 4Z" />
      </svg>
      <span class="sr-only">Up</span>
      12.5%
    </span>
    <span class="text-gray-600 dark:text-gray-400">vs last month</span>
  </p>
</article>`,
      react: `const TREND_STYLES = {
  up: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  down: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const TREND_PATHS = {
  up: 'M10 4a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L11 7.4V15a1 1 0 1 1-2 0V7.4L6.7 9.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 10 4Z',
  down: 'M10 16a1 1 0 0 1-.7-.3l-4-4a1 1 0 0 1 1.4-1.4L9 12.6V5a1 1 0 1 1 2 0v7.6l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-.7.3Z',
};

export function StatCard({ label, value, delta, trend = 'up', period = 'vs last month', icon, className = '' }) {
  return (
    <article
      className={\`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        {icon && (
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>

      <p className="mt-2 flex items-center gap-1.5 text-sm">
        <span className={\`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold \${TREND_STYLES[trend]}\`}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d={TREND_PATHS[trend]} />
          </svg>
          <span className="sr-only">{trend === 'up' ? 'Up' : 'Down'}</span>
          {delta}
        </span>
        <span className="text-gray-600 dark:text-gray-400">{period}</span>
      </p>
    </article>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

// Read-only metric - no state, so no 'use client'.
type Trend = 'up' | 'down';

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  trend?: Trend;
  period?: string;
  icon?: ReactNode;
  className?: string;
}

const TREND_STYLES: Record<Trend, string> = {
  up: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  down: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const TREND_PATHS: Record<Trend, string> = {
  up: 'M10 4a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L11 7.4V15a1 1 0 1 1-2 0V7.4L6.7 9.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 10 4Z',
  down: 'M10 16a1 1 0 0 1-.7-.3l-4-4a1 1 0 0 1 1.4-1.4L9 12.6V5a1 1 0 1 1 2 0v7.6l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-.7.3Z',
};

export function StatCard({
  label,
  value,
  delta,
  trend = 'up',
  period = 'vs last month',
  icon,
  className = '',
}: StatCardProps) {
  return (
    <article
      className={\`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        {icon ? (
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>

      <p className="mt-2 flex items-center gap-1.5 text-sm">
        <span className={\`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold \${TREND_STYLES[trend]}\`}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d={TREND_PATHS[trend]} />
          </svg>
          <span className="sr-only">{trend === 'up' ? 'Up' : 'Down'}</span>
          {delta}
        </span>
        <span className="text-gray-600 dark:text-gray-400">{period}</span>
      </p>
    </article>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export type Trend = 'up' | 'down';

export interface StatCardProps {
  label: string;
  value: string;
  /** Change since the comparison period, pre-formatted, e.g. '12.5%'. */
  delta: string;
  trend?: Trend;
  period?: string;
  icon?: ReactNode;
  className?: string;
}

const TREND_STYLES: Record<Trend, string> = {
  up: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  down: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const TREND_PATHS: Record<Trend, string> = {
  up: 'M10 4a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L11 7.4V15a1 1 0 1 1-2 0V7.4L6.7 9.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 10 4Z',
  down: 'M10 16a1 1 0 0 1-.7-.3l-4-4a1 1 0 0 1 1.4-1.4L9 12.6V5a1 1 0 1 1 2 0v7.6l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-.7.3Z',
};

export function StatCard({
  label,
  value,
  delta,
  trend = 'up',
  period = 'vs last month',
  icon,
  className = '',
}: StatCardProps): JSX.Element {
  return (
    <article
      className={\`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        {icon ? (
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>

      <p className="mt-2 flex items-center gap-1.5 text-sm">
        <span className={\`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold \${TREND_STYLES[trend]}\`}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d={TREND_PATHS[trend]} />
          </svg>
          <span className="sr-only">{trend === 'up' ? 'Up' : 'Down'}</span>
          {delta}
        </span>
        <span className="text-gray-600 dark:text-gray-400">{period}</span>
      </p>
    </article>
  );
}`,
    },
  },
  {
    slug: 'product-card',
    category: 'cards',
    tags: ['product', 'ecommerce', 'shop', 'rating', 'cart'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-06',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.3.0',
    featured: true,
    stats: { views: 3120, copies: 874, downloads: 251 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'price', type: 'string', required: true, descriptionKey: 'price', example: '$128' },
      { name: 'imageSrc', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', required: true, descriptionKey: 'imageAlt' },
      { name: 'rating', type: 'number', required: true, descriptionKey: 'rating', example: '4.5' },
      { name: 'reviewCount', type: 'number', required: true, descriptionKey: 'reviewCount' },
      { name: 'ctaLabel', type: 'string', default: "'Add to cart'", descriptionKey: 'ctaLabel' },
      { name: 'onAddToCart', type: '() => void', descriptionKey: 'onAddToCart' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<article class="product-card">
  <img class="product-card__image" src="/your-image.jpg" alt="Aster wool throw in oat" width="320" height="320" />

  <div class="product-card__body">
    <h3 class="product-card__title">Aster Wool Throw</h3>

    <p class="product-card__rating" role="img" aria-label="Rated 4.5 out of 5 from 128 reviews">
      <svg class="product-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="product-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="product-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="product-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="product-card__star product-card__star--empty" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <span class="product-card__reviews">(128)</span>
    </p>

    <div class="product-card__footer">
      <p class="product-card__price">$128</p>
      <button class="product-card__cta" type="button">Add to cart</button>
    </div>
  </div>
</article>`,
      css: `.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 18rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.product-card__image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #f3f4f6;
}

.product-card__body {
  padding: 1rem;
}

.product-card__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  margin: 0.5rem 0 0;
}

.product-card__star {
  width: 0.875rem;
  height: 0.875rem;
  color: #d97706;
}

.product-card__star--empty {
  color: #d1d5db;
}

.product-card__reviews {
  margin-left: 0.375rem;
  font-size: 0.75rem;
  color: #4b5563;
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.875rem;
}

.product-card__price {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.product-card__cta {
  padding: 0.5rem 0.875rem;
  border: 0;
  border-radius: 0.5rem;
  background: #111827;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms;
}

.product-card__cta:hover {
  background: #374151;
}

.product-card__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .product-card__cta {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .product-card {
    border-color: #1f2937;
    background: #111827;
  }

  .product-card__image {
    background: #1f2937;
  }

  .product-card__title,
  .product-card__price {
    color: #f3f4f6;
  }

  .product-card__star {
    color: #fbbf24;
  }

  .product-card__star--empty {
    color: #4b5563;
  }

  .product-card__reviews {
    color: #9ca3af;
  }

  .product-card__cta {
    background: #f3f4f6;
    color: #111827;
  }

  .product-card__cta:hover {
    background: #d1d5db;
  }

  .product-card__cta:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<article class="flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <img
    class="aspect-square w-full bg-gray-100 object-cover dark:bg-gray-800"
    src="/your-image.jpg"
    alt="Aster wool throw in oat"
    width="320"
    height="320"
  />

  <div class="p-4">
    <h3 class="text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">Aster Wool Throw</h3>

    <p class="mt-2 flex items-center gap-0.5" role="img" aria-label="Rated 4.5 out of 5 from 128 reviews">
      <svg class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <svg class="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
      <span class="ml-1.5 text-xs text-gray-600 dark:text-gray-400">(128)</span>
    </p>

    <div class="mt-3.5 flex items-center justify-between gap-3">
      <p class="text-lg font-bold text-gray-900 dark:text-gray-100">$128</p>
      <button
        type="button"
        class="rounded-lg bg-gray-900 px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Add to cart
      </button>
    </div>
  </div>
</article>`,
      react: `const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

function Stars({ rating, reviewCount }) {
  return (
    <p
      className="mt-2 flex items-center gap-0.5"
      role="img"
      aria-label={\`Rated \${rating} out of 5 from \${reviewCount} reviews\`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={\`h-3.5 w-3.5 \${i <= Math.round(rating) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">({reviewCount})</span>
    </p>
  );
}

export function ProductCard({
  title,
  price,
  imageSrc,
  imageAlt,
  rating,
  reviewCount,
  ctaLabel = 'Add to cart',
  onAddToCart,
  className = '',
}) {
  return (
    <article
      className={\`flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img
        className="aspect-square w-full bg-gray-100 object-cover dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={320}
        height={320}
      />

      <div className="p-4">
        <h3 className="text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

        <Stars rating={rating} reviewCount={reviewCount} />

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{price}</p>
          <button
            type="button"
            onClick={onAddToCart}
            className="rounded-lg bg-gray-900 px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}`,
      nextjs: `'use client';

// 'use client' because onAddToCart is an event handler - the card itself holds
// no state, so drop the directive if you render it without one.
interface ProductCardProps {
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  ctaLabel?: string;
  onAddToCart?: () => void;
  className?: string;
}

const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

function Stars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <p
      className="mt-2 flex items-center gap-0.5"
      role="img"
      aria-label={\`Rated \${rating} out of 5 from \${reviewCount} reviews\`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={\`h-3.5 w-3.5 \${i <= Math.round(rating) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">({reviewCount})</span>
    </p>
  );
}

export function ProductCard({
  title,
  price,
  imageSrc,
  imageAlt,
  rating,
  reviewCount,
  ctaLabel = 'Add to cart',
  onAddToCart,
  className = '',
}: ProductCardProps) {
  return (
    <article
      className={\`flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img
        className="aspect-square w-full bg-gray-100 object-cover dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={320}
        height={320}
      />

      <div className="p-4">
        <h3 className="text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

        <Stars rating={rating} reviewCount={reviewCount} />

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{price}</p>
          <button
            type="button"
            onClick={onAddToCart}
            className="rounded-lg bg-gray-900 px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}`,
      typescript: `export interface ProductCardProps {
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  /** 0-5, halves allowed. Rounded for the stars, exact in the label. */
  rating: number;
  reviewCount: number;
  ctaLabel?: string;
  onAddToCart?: () => void;
  className?: string;
}

const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

function Stars({ rating, reviewCount }: { rating: number; reviewCount: number }): JSX.Element {
  return (
    <p
      className="mt-2 flex items-center gap-0.5"
      role="img"
      aria-label={\`Rated \${rating} out of 5 from \${reviewCount} reviews\`}
    >
      {[1, 2, 3, 4, 5].map((i: number) => (
        <svg
          key={i}
          className={\`h-3.5 w-3.5 \${i <= Math.round(rating) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">({reviewCount})</span>
    </p>
  );
}

export function ProductCard({
  title,
  price,
  imageSrc,
  imageAlt,
  rating,
  reviewCount,
  ctaLabel = 'Add to cart',
  onAddToCart,
  className = '',
}: ProductCardProps): JSX.Element {
  return (
    <article
      className={\`flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img
        className="aspect-square w-full bg-gray-100 object-cover dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={320}
        height={320}
      />

      <div className="p-4">
        <h3 className="text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

        <Stars rating={rating} reviewCount={reviewCount} />

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{price}</p>
          <button
            type="button"
            onClick={onAddToCart}
            className="rounded-lg bg-gray-900 px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}`,
    },
  },
  {
    slug: 'blog-post-card',
    category: 'cards',
    tags: ['blog', 'article', 'post', 'author', 'cover'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-24',
    updatedAt: '2026-07-04',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2260, copies: 517, downloads: 139 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'href', type: 'string', required: true, descriptionKey: 'href' },
      { name: 'excerpt', type: 'string', required: true, descriptionKey: 'excerpt' },
      { name: 'category', type: 'string', required: true, descriptionKey: 'category' },
      { name: 'coverSrc', type: 'string', required: true, descriptionKey: 'coverSrc' },
      { name: 'authorName', type: 'string', required: true, descriptionKey: 'authorName' },
      {
        name: 'authorAvatarSrc',
        type: 'string',
        required: true,
        descriptionKey: 'authorAvatarSrc',
      },
      { name: 'date', type: 'string', required: true, descriptionKey: 'date', example: '2026-06-18' },
      {
        name: 'dateLabel',
        type: 'string',
        required: true,
        descriptionKey: 'dateLabel',
        example: '18 Jun 2026',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<article class="blog-card">
  <img class="blog-card__cover" src="/your-image.jpg" alt="" width="384" height="200" />

  <div class="blog-card__body">
    <p class="blog-card__chip">Engineering</p>

    <h3 class="blog-card__title">
      <a class="blog-card__link" href="#">Why we rewrote our design tokens in one afternoon</a>
    </h3>

    <p class="blog-card__excerpt">
      Four years of drift left us with 312 colours for what turned out to be nine decisions. Here is how we found them.
    </p>

    <div class="blog-card__meta">
      <img class="blog-card__avatar" src="/your-image.jpg" alt="" width="28" height="28" />
      <span class="blog-card__author">Priya Raman</span>
      <span class="blog-card__dot" aria-hidden="true">&middot;</span>
      <time class="blog-card__date" datetime="2026-06-18">18 Jun 2026</time>
    </div>
  </div>
</article>`,
      css: `.blog-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 24rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.blog-card__cover {
  width: 100%;
  height: 12.5rem;
  object-fit: cover;
  background: #f3f4f6;
}

.blog-card__body {
  padding: 1.25rem;
}

.blog-card__chip {
  display: inline-block;
  margin: 0;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.blog-card__title {
  margin: 0.625rem 0 0;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.4;
  color: #111827;
}

.blog-card__link {
  color: inherit;
  text-decoration: none;
}

/* Stretches the link's hit area over the whole card without nesting <a>s;
   the .blog-card rule above is the positioned ancestor it resolves against. */
.blog-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.blog-card__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 4px;
}

.blog-card__excerpt {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.blog-card__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: #4b5563;
}

.blog-card__avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  object-fit: cover;
  background: #f3f4f6;
}

.blog-card__author {
  font-weight: 500;
  color: #111827;
}

@media (prefers-color-scheme: dark) {
  .blog-card {
    border-color: #1f2937;
    background: #111827;
  }

  .blog-card__cover,
  .blog-card__avatar {
    background: #1f2937;
  }

  .blog-card__chip {
    background: #172554;
    color: #93c5fd;
  }

  .blog-card__title,
  .blog-card__author {
    color: #f3f4f6;
  }

  .blog-card__excerpt,
  .blog-card__meta {
    color: #d1d5db;
  }

  .blog-card__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<article class="relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <img class="h-[12.5rem] w-full bg-gray-100 object-cover dark:bg-gray-800" src="/your-image.jpg" alt="" width="384" height="200" />

  <div class="p-5">
    <p class="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      Engineering
    </p>

    <h3 class="mt-2.5 text-[1.0625rem] font-semibold leading-snug text-gray-900 dark:text-gray-100">
      <a
        href="#"
        class="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Why we rewrote our design tokens in one afternoon
      </a>
    </h3>

    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Four years of drift left us with 312 colours for what turned out to be nine decisions. Here is how we found them.
    </p>

    <div class="mt-4 flex items-center gap-2 text-[0.8125rem] text-gray-600 dark:text-gray-300">
      <img class="h-7 w-7 rounded-full bg-gray-100 object-cover dark:bg-gray-800" src="/your-image.jpg" alt="" width="28" height="28" />
      <span class="font-medium text-gray-900 dark:text-gray-100">Priya Raman</span>
      <span aria-hidden="true">&middot;</span>
      <time datetime="2026-06-18">18 Jun 2026</time>
    </div>
  </div>
</article>`,
      react: `export function BlogPostCard({
  title,
  href,
  excerpt,
  category,
  coverSrc,
  authorName,
  authorAvatarSrc,
  date,
  dateLabel,
  className = '',
}) {
  return (
    <article
      className={\`relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img className="h-[12.5rem] w-full bg-gray-100 object-cover dark:bg-gray-800" src={coverSrc} alt="" width={384} height={200} />

      <div className="p-5">
        <p className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {category}
        </p>

        <h3 className="mt-2.5 text-[1.0625rem] font-semibold leading-snug text-gray-900 dark:text-gray-100">
          {/* after:inset-0 makes the whole card clickable from one real link. */}
          <a
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </a>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{excerpt}</p>

        <div className="mt-4 flex items-center gap-2 text-[0.8125rem] text-gray-600 dark:text-gray-300">
          <img className="h-7 w-7 rounded-full bg-gray-100 object-cover dark:bg-gray-800" src={authorAvatarSrc} alt="" width={28} height={28} />
          <span className="font-medium text-gray-900 dark:text-gray-100">{authorName}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={date}>{dateLabel}</time>
        </div>
      </div>
    </article>
  );
}`,
      nextjs: `import Link from 'next/link';

// Static content - Server Component, no 'use client'.
interface BlogPostCardProps {
  title: string;
  href: string;
  excerpt: string;
  category: string;
  coverSrc: string;
  authorName: string;
  authorAvatarSrc: string;
  /** Machine-readable, e.g. '2026-06-18'. */
  date: string;
  /** Human-readable, e.g. '18 Jun 2026'. */
  dateLabel: string;
  className?: string;
}

export function BlogPostCard({
  title,
  href,
  excerpt,
  category,
  coverSrc,
  authorName,
  authorAvatarSrc,
  date,
  dateLabel,
  className = '',
}: BlogPostCardProps) {
  return (
    <article
      className={\`relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img className="h-[12.5rem] w-full bg-gray-100 object-cover dark:bg-gray-800" src={coverSrc} alt="" width={384} height={200} />

      <div className="p-5">
        <p className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {category}
        </p>

        <h3 className="mt-2.5 text-[1.0625rem] font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <Link
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{excerpt}</p>

        <div className="mt-4 flex items-center gap-2 text-[0.8125rem] text-gray-600 dark:text-gray-300">
          <img className="h-7 w-7 rounded-full bg-gray-100 object-cover dark:bg-gray-800" src={authorAvatarSrc} alt="" width={28} height={28} />
          <span className="font-medium text-gray-900 dark:text-gray-100">{authorName}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={date}>{dateLabel}</time>
        </div>
      </div>
    </article>
  );
}`,
      typescript: `export interface BlogPostCardProps {
  title: string;
  href: string;
  excerpt: string;
  category: string;
  coverSrc: string;
  authorName: string;
  authorAvatarSrc: string;
  /** Machine-readable, e.g. '2026-06-18'. */
  date: string;
  /** Human-readable, e.g. '18 Jun 2026'. */
  dateLabel: string;
  className?: string;
}

export function BlogPostCard({
  title,
  href,
  excerpt,
  category,
  coverSrc,
  authorName,
  authorAvatarSrc,
  date,
  dateLabel,
  className = '',
}: BlogPostCardProps): JSX.Element {
  return (
    <article
      className={\`relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img className="h-[12.5rem] w-full bg-gray-100 object-cover dark:bg-gray-800" src={coverSrc} alt="" width={384} height={200} />

      <div className="p-5">
        <p className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {category}
        </p>

        <h3 className="mt-2.5 text-[1.0625rem] font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <a
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </a>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{excerpt}</p>

        <div className="mt-4 flex items-center gap-2 text-[0.8125rem] text-gray-600 dark:text-gray-300">
          <img className="h-7 w-7 rounded-full bg-gray-100 object-cover dark:bg-gray-800" src={authorAvatarSrc} alt="" width={28} height={28} />
          <span className="font-medium text-gray-900 dark:text-gray-100">{authorName}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={date}>{dateLabel}</time>
        </div>
      </div>
    </article>
  );
}`,
    },
  },
  {
    slug: 'testimonial-card',
    category: 'cards',
    tags: ['testimonial', 'quote', 'review', 'social-proof', 'rating'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-02',
    updatedAt: '2026-07-11',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1840, copies: 466, downloads: 121 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'quote', type: 'string', required: true, descriptionKey: 'quote' },
      { name: 'name', type: 'string', required: true, descriptionKey: 'personName' },
      { name: 'company', type: 'string', required: true, descriptionKey: 'company' },
      { name: 'avatarSrc', type: 'string', required: true, descriptionKey: 'avatarSrc' },
      { name: 'rating', type: 'number', default: '5', descriptionKey: 'rating' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<figure class="testimonial-card">
  <p class="testimonial-card__rating" role="img" aria-label="Rated 5 out of 5">
    <svg class="testimonial-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="testimonial-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="testimonial-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="testimonial-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="testimonial-card__star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
  </p>

  <blockquote class="testimonial-card__quote">
    <p>&ldquo;We shipped our billing rewrite two sprints early. The part I still can&rsquo;t get over is that support tickets went down, not up.&rdquo;</p>
  </blockquote>

  <figcaption class="testimonial-card__author">
    <img class="testimonial-card__avatar" src="/your-image.jpg" alt="" width="40" height="40" />
    <span>
      <span class="testimonial-card__name">Marcus Lindqvist</span>
      <span class="testimonial-card__company">VP Engineering, Northwind</span>
    </span>
  </figcaption>
</figure>`,
      css: `.testimonial-card {
  width: 100%;
  max-width: 24rem;
  margin: 0;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.testimonial-card__rating {
  display: flex;
  gap: 0.125rem;
  margin: 0;
}

.testimonial-card__star {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

.testimonial-card__quote {
  margin: 0.875rem 0 0;
}

.testimonial-card__quote p {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #374151;
}

.testimonial-card__author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.testimonial-card__avatar {
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
  background: #f3f4f6;
}

.testimonial-card__name {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.testimonial-card__company {
  display: block;
  font-size: 0.8125rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .testimonial-card {
    border-color: #1f2937;
    background: #111827;
  }

  .testimonial-card__star {
    color: #fbbf24;
  }

  .testimonial-card__quote p {
    color: #d1d5db;
  }

  .testimonial-card__author {
    border-top-color: #1f2937;
  }

  .testimonial-card__avatar {
    background: #1f2937;
  }

  .testimonial-card__name {
    color: #f3f4f6;
  }

  .testimonial-card__company {
    color: #9ca3af;
  }
}`,
      tailwind: `<figure class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <p class="flex gap-0.5" role="img" aria-label="Rated 5 out of 5">
    <svg class="h-4 w-4 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="h-4 w-4 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="h-4 w-4 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="h-4 w-4 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
    <svg class="h-4 w-4 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z" /></svg>
  </p>

  <blockquote class="mt-3.5">
    <p class="text-[0.9375rem] leading-7 text-gray-700 dark:text-gray-300">
      &ldquo;We shipped our billing rewrite two sprints early. The part I still can&rsquo;t get over is that support tickets went down, not up.&rdquo;
    </p>
  </blockquote>

  <figcaption class="mt-5 flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
    <img class="h-10 w-10 flex-none rounded-full bg-gray-100 object-cover dark:bg-gray-800" src="/your-image.jpg" alt="" width="40" height="40" />
    <span>
      <span class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Marcus Lindqvist</span>
      <span class="block text-[0.8125rem] text-gray-600 dark:text-gray-400">VP Engineering, Northwind</span>
    </span>
  </figcaption>
</figure>`,
      react: `const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

export function TestimonialCard({ quote, name, company, avatarSrc, rating = 5, className = '' }) {
  return (
    <figure
      className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {/* role="img" + label: five separate stars would otherwise be five nodes of noise. */}
      <p className="flex gap-0.5" role="img" aria-label={\`Rated \${rating} out of 5\`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={\`h-4 w-4 \${i <= rating ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </p>

      <blockquote className="mt-3.5">
        <p className="text-[0.9375rem] leading-7 text-gray-700 dark:text-gray-300">&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
        <img className="h-10 w-10 flex-none rounded-full bg-gray-100 object-cover dark:bg-gray-800" src={avatarSrc} alt="" width={40} height={40} />
        <span>
          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
          <span className="block text-[0.8125rem] text-gray-600 dark:text-gray-400">{company}</span>
        </span>
      </figcaption>
    </figure>
  );
}`,
      nextjs: `// Static quote - Server Component, no 'use client'.
interface TestimonialCardProps {
  quote: string;
  name: string;
  company: string;
  avatarSrc: string;
  rating?: number;
  className?: string;
}

const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

export function TestimonialCard({ quote, name, company, avatarSrc, rating = 5, className = '' }: TestimonialCardProps) {
  return (
    <figure
      className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <p className="flex gap-0.5" role="img" aria-label={\`Rated \${rating} out of 5\`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={\`h-4 w-4 \${i <= rating ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </p>

      <blockquote className="mt-3.5">
        <p className="text-[0.9375rem] leading-7 text-gray-700 dark:text-gray-300">&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
        <img className="h-10 w-10 flex-none rounded-full bg-gray-100 object-cover dark:bg-gray-800" src={avatarSrc} alt="" width={40} height={40} />
        <span>
          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
          <span className="block text-[0.8125rem] text-gray-600 dark:text-gray-400">{company}</span>
        </span>
      </figcaption>
    </figure>
  );
}`,
      typescript: `export interface TestimonialCardProps {
  /** Quote text without surrounding quotation marks - the card adds them. */
  quote: string;
  name: string;
  company: string;
  avatarSrc: string;
  /** Whole stars, 0-5. */
  rating?: number;
  className?: string;
}

const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

export function TestimonialCard({
  quote,
  name,
  company,
  avatarSrc,
  rating = 5,
  className = '',
}: TestimonialCardProps): JSX.Element {
  return (
    <figure
      className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <p className="flex gap-0.5" role="img" aria-label={\`Rated \${rating} out of 5\`}>
        {[1, 2, 3, 4, 5].map((i: number) => (
          <svg
            key={i}
            className={\`h-4 w-4 \${i <= rating ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </p>

      <blockquote className="mt-3.5">
        <p className="text-[0.9375rem] leading-7 text-gray-700 dark:text-gray-300">&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
        <img
          className="h-10 w-10 flex-none rounded-full bg-gray-100 object-cover dark:bg-gray-800"
          src={avatarSrc}
          alt=""
          width={40}
          height={40}
        />
        <span>
          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
          <span className="block text-[0.8125rem] text-gray-600 dark:text-gray-400">{company}</span>
        </span>
      </figcaption>
    </figure>
  );
}`,
    },
  },
  {
    slug: 'notification-card',
    category: 'cards',
    tags: ['notification', 'alert', 'toast', 'dismiss', 'status'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-15',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1420, copies: 361, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      {
        name: 'timestamp',
        type: 'string',
        required: true,
        descriptionKey: 'timestamp',
        example: '2 minutes ago',
      },
      {
        name: 'severity',
        type: "'info' | 'success' | 'warning'",
        default: "'info'",
        descriptionKey: 'severity',
      },
      {
        name: 'dismissLabel',
        type: 'string',
        default: "'Dismiss notification'",
        descriptionKey: 'dismissLabel',
      },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<article class="notice notice--success" role="status">
  <span class="notice__icon" aria-hidden="true">
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
    </svg>
  </span>

  <div class="notice__body">
    <p class="notice__title">Backup completed</p>
    <p class="notice__message">All 1,284 records were exported to your S3 bucket.</p>
    <p class="notice__time">2 minutes ago</p>
  </div>

  <button class="notice__dismiss" type="button" aria-label="Dismiss notification">
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </button>
</article>`,
      css: `.notice {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  max-width: 24rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 8px 24px -12px rgba(16, 24, 40, 0.25);
}

.notice__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
}

.notice__icon svg {
  width: 1.125rem;
  height: 1.125rem;
}

.notice--info .notice__icon {
  background: #eff6ff;
  color: #1d4ed8;
}

.notice--success .notice__icon {
  background: #f0fdf4;
  color: #15803d;
}

.notice--warning .notice__icon {
  background: #fffbeb;
  color: #b45309;
}

.notice__body {
  flex: 1;
  min-width: 0;
}

.notice__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.notice__message {
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4b5563;
}

.notice__time {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #4b5563;
}

.notice__dismiss {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  margin: -0.25rem -0.25rem 0 0;
  padding: 0;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
}

.notice__dismiss svg {
  width: 1rem;
  height: 1rem;
}

.notice__dismiss:hover {
  background: #f3f4f6;
  color: #111827;
}

.notice__dismiss:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .notice__dismiss {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .notice {
    border-color: #1f2937;
    background: #111827;
  }

  .notice--info .notice__icon {
    background: #172554;
    color: #93c5fd;
  }

  .notice--success .notice__icon {
    background: #052e16;
    color: #86efac;
  }

  .notice--warning .notice__icon {
    background: #451a03;
    color: #fcd34d;
  }

  .notice__title {
    color: #f3f4f6;
  }

  .notice__message,
  .notice__time {
    color: #9ca3af;
  }

  .notice__dismiss {
    color: #9ca3af;
  }

  .notice__dismiss:hover {
    background: #1f2937;
    color: #f3f4f6;
  }

  .notice__dismiss:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<article
  class="flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900"
  role="status"
>
  <span
    class="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
    aria-hidden="true"
  >
    <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
    </svg>
  </span>

  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Backup completed</p>
    <p class="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">All 1,284 records were exported to your S3 bucket.</p>
    <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">2 minutes ago</p>
  </div>

  <button
    type="button"
    aria-label="Dismiss notification"
    class="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </button>
</article>`,
      react: `import { useState } from 'react';

const SEVERITY_STYLES = {
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning: 'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
};

export function NotificationCard({
  title,
  message,
  timestamp,
  severity = 'info',
  dismissLabel = 'Dismiss notification',
  onDismiss,
  className = '',
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <article
      role="status"
      className={\`flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        className={\`flex h-8 w-8 flex-none items-center justify-center rounded-lg \${SEVERITY_STYLES[severity]}\`}
        aria-hidden="true"
      >
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </article>
  );
}`,
      nextjs: `'use client';

// Holds its own dismissed state, so this one really does need 'use client'.
import { useState } from 'react';

type Severity = 'info' | 'success' | 'warning';

interface NotificationCardProps {
  title: string;
  message: string;
  timestamp: string;
  severity?: Severity;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

const SEVERITY_PATHS: Record<Severity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning: 'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
};

export function NotificationCard({
  title,
  message,
  timestamp,
  severity = 'info',
  dismissLabel = 'Dismiss notification',
  onDismiss,
  className = '',
}: NotificationCardProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <article
      role="status"
      className={\`flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        className={\`flex h-8 w-8 flex-none items-center justify-center rounded-lg \${SEVERITY_STYLES[severity]}\`}
        aria-hidden="true"
      >
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </article>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export type Severity = 'info' | 'success' | 'warning';

export interface NotificationCardProps {
  title: string;
  message: string;
  /** Pre-formatted, e.g. '2 minutes ago'. */
  timestamp: string;
  severity?: Severity;
  /** Accessible name for the dismiss button. */
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

const SEVERITY_PATHS: Record<Severity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning: 'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
};

export function NotificationCard({
  title,
  message,
  timestamp,
  severity = 'info',
  dismissLabel = 'Dismiss notification',
  onDismiss,
  className = '',
}: NotificationCardProps): JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(true);

  if (!visible) return null;

  const handleDismiss = (): void => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <article
      role="status"
      className={\`flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        className={\`flex h-8 w-8 flex-none items-center justify-center rounded-lg \${SEVERITY_STYLES[severity]}\`}
        aria-hidden="true"
      >
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </article>
  );
}`,
    },
  },
  {
    slug: 'image-overlay-card',
    category: 'cards',
    tags: ['image', 'overlay', 'gradient', 'hover', 'zoom'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-24',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1560, copies: 398, downloads: 104 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'href', type: 'string', required: true, descriptionKey: 'href' },
      { name: 'imageSrc', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<a class="overlay-card" href="#">
  <img class="overlay-card__image" src="/your-image.jpg" alt="" width="384" height="288" />

  <!-- The scrim is what makes white text legible over an unknown photo. -->
  <span class="overlay-card__scrim" aria-hidden="true"></span>

  <span class="overlay-card__content">
    <span class="overlay-card__kicker">Field notes</span>
    <span class="overlay-card__title">Three weeks above the tree line</span>
  </span>
</a>`,
      css: `.overlay-card {
  position: relative;
  display: block;
  width: 100%;
  max-width: 24rem;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 1rem;
  text-decoration: none;
  background: #111827;
}

.overlay-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease;
}

.overlay-card:hover .overlay-card__image,
.overlay-card:focus-visible .overlay-card__image {
  transform: scale(1.05);
}

.overlay-card__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0) 75%);
}

.overlay-card__content {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  padding: 1.25rem;
}

.overlay-card__kicker {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  /* White on the 0.85 scrim clears AA comfortably in either OS theme. */
  color: #e5e7eb;
}

.overlay-card__title {
  display: block;
  margin-top: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
}

.overlay-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Reduced motion: keep the card, drop the zoom. */
@media (prefers-reduced-motion: reduce) {
  .overlay-card__image {
    transition: none;
  }

  .overlay-card:hover .overlay-card__image,
  .overlay-card:focus-visible .overlay-card__image {
    transform: none;
  }
}`,
      tailwind: `<a
  href="#"
  class="group relative block aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  <img
    class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
    src="/your-image.jpg"
    alt=""
    width="384"
    height="288"
  />

  <span class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" aria-hidden="true"></span>

  <span class="absolute inset-x-0 bottom-0 p-5">
    <span class="block text-[0.6875rem] font-semibold uppercase tracking-widest text-gray-200">Field notes</span>
    <span class="mt-1 block text-xl font-bold leading-snug text-white">Three weeks above the tree line</span>
  </span>
</a>`,
      react: `export function ImageOverlayCard({ title, kicker, href, imageSrc, imageAlt = '', className = '' }) {
  return (
    <a
      href={href}
      className={\`group relative block aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
    >
      <img
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        src={imageSrc}
        alt={imageAlt}
        width={384}
        height={288}
      />

      {/* Scrim: the only reason white text is readable over an unknown photo. */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" aria-hidden="true" />

      <span className="absolute inset-x-0 bottom-0 p-5">
        {kicker && <span className="block text-[0.6875rem] font-semibold uppercase tracking-widest text-gray-200">{kicker}</span>}
        <span className="mt-1 block text-xl font-bold leading-snug text-white">{title}</span>
      </span>
    </a>
  );
}`,
      nextjs: `import Link from 'next/link';

// Hover and zoom are pure CSS - no state, so this stays a Server Component.
interface ImageOverlayCardProps {
  title: string;
  kicker?: string;
  href: string;
  imageSrc: string;
  /** Empty by default: the title beside it already names the destination. */
  imageAlt?: string;
  className?: string;
}

export function ImageOverlayCard({
  title,
  kicker,
  href,
  imageSrc,
  imageAlt = '',
  className = '',
}: ImageOverlayCardProps) {
  return (
    <Link
      href={href}
      className={\`group relative block aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
    >
      <img
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        src={imageSrc}
        alt={imageAlt}
        width={384}
        height={288}
      />

      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" aria-hidden="true" />

      <span className="absolute inset-x-0 bottom-0 p-5">
        {kicker ? (
          <span className="block text-[0.6875rem] font-semibold uppercase tracking-widest text-gray-200">{kicker}</span>
        ) : null}
        <span className="mt-1 block text-xl font-bold leading-snug text-white">{title}</span>
      </span>
    </Link>
  );
}`,
      typescript: `export interface ImageOverlayCardProps {
  title: string;
  kicker?: string;
  href: string;
  imageSrc: string;
  /** Empty by default: the title beside it already names the destination. */
  imageAlt?: string;
  className?: string;
}

export function ImageOverlayCard({
  title,
  kicker,
  href,
  imageSrc,
  imageAlt = '',
  className = '',
}: ImageOverlayCardProps): JSX.Element {
  return (
    <a
      href={href}
      className={\`group relative block aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
    >
      <img
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        src={imageSrc}
        alt={imageAlt}
        width={384}
        height={288}
      />

      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" aria-hidden="true" />

      <span className="absolute inset-x-0 bottom-0 p-5">
        {kicker ? (
          <span className="block text-[0.6875rem] font-semibold uppercase tracking-widest text-gray-200">{kicker}</span>
        ) : null}
        <span className="mt-1 block text-xl font-bold leading-snug text-white">{title}</span>
      </span>
    </a>
  );
}`,
    },
  },
  {
    slug: 'feature-card',
    category: 'cards',
    tags: ['feature', 'icon', 'marketing', 'grid', 'link'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-11',
    updatedAt: '2026-06-26',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2410, copies: 673, downloads: 187 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', required: true, descriptionKey: 'copy' },
      { name: 'icon', type: 'ReactNode', required: true, descriptionKey: 'icon' },
      { name: 'ctaLabel', type: 'string', default: "'Learn more'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<article class="feature-card">
  <span class="feature-card__tile" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4.5 13.2a1 1 0 0 0 .8 1.6H10l-1 7.2 8.5-11.2a1 1 0 0 0-.8-1.6H12l1-7.2Z" />
    </svg>
  </span>

  <h3 class="feature-card__title">Instant preview builds</h3>

  <p class="feature-card__copy">
    Every pull request gets its own URL in under thirty seconds, torn down the moment the branch merges.
  </p>

  <a class="feature-card__link" href="#">
    Learn more
    <svg class="feature-card__arrow" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </a>
</article>`,
      css: `.feature-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 20rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.feature-card__tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background: #eff6ff;
  color: #1d4ed8;
}

.feature-card__tile svg {
  width: 1.375rem;
  height: 1.375rem;
}

.feature-card__title {
  margin: 1rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.feature-card__copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.feature-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1d4ed8;
  text-decoration: none;
}

.feature-card__link:hover {
  text-decoration: underline;
}

.feature-card__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.feature-card__arrow {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform 150ms;
}

.feature-card__link:hover .feature-card__arrow {
  transform: translateX(2px);
}

@media (prefers-reduced-motion: reduce) {
  .feature-card__arrow {
    transition: none;
  }

  .feature-card__link:hover .feature-card__arrow {
    transform: none;
  }
}

@media (prefers-color-scheme: dark) {
  .feature-card {
    border-color: #1f2937;
    background: #111827;
  }

  .feature-card__tile {
    background: #172554;
    color: #93c5fd;
  }

  .feature-card__title {
    color: #f3f4f6;
  }

  .feature-card__copy {
    color: #d1d5db;
  }

  .feature-card__link {
    color: #60a5fa;
  }

  .feature-card__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<article class="flex w-full max-w-xs flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <span
    class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
    aria-hidden="true"
  >
    <svg class="h-[1.375rem] w-[1.375rem]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4.5 13.2a1 1 0 0 0 .8 1.6H10l-1 7.2 8.5-11.2a1 1 0 0 0-.8-1.6H12l1-7.2Z" />
    </svg>
  </span>

  <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Instant preview builds</h3>

  <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
    Every pull request gets its own URL in under thirty seconds, torn down the moment the branch merges.
  </p>

  <a
    href="#"
    class="group mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Learn more
    <svg
      class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </a>
</article>`,
      react: `export function FeatureCard({ title, copy, icon, ctaLabel = 'Learn more', ctaHref, className = '' }) {
  return (
    <article
      className={\`flex w-full max-w-xs flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>

      {ctaHref && (
        <a
          href={ctaHref}
          className="group mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
          <span className="sr-only"> about {title}</span>
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </a>
      )}
    </article>
  );
}`,
      nextjs: `import Link from 'next/link';
import type { ReactNode } from 'react';

// Presentational - Server Component, no 'use client'.
interface FeatureCardProps {
  title: string;
  copy: string;
  icon: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function FeatureCard({ title, copy, icon, ctaLabel = 'Learn more', ctaHref, className = '' }: FeatureCardProps) {
  return (
    <article
      className={\`flex w-full max-w-xs flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>

      {ctaHref ? (
        <Link
          href={ctaHref}
          className="group mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
          {/* Ten "Learn more" links in a grid are indistinguishable out of context. */}
          <span className="sr-only"> about {title}</span>
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </Link>
      ) : null}
    </article>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface FeatureCardProps {
  title: string;
  copy: string;
  icon: ReactNode;
  ctaLabel?: string;
  /** Omit to render the card without a link. */
  ctaHref?: string;
  className?: string;
}

export function FeatureCard({
  title,
  copy,
  icon,
  ctaLabel = 'Learn more',
  ctaHref,
  className = '',
}: FeatureCardProps): JSX.Element {
  return (
    <article
      className={\`flex w-full max-w-xs flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>

      {ctaHref ? (
        <a
          href={ctaHref}
          className="group mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
          <span className="sr-only"> about {title}</span>
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </a>
      ) : null}
    </article>
  );
}`,
    },
  },
  {
    slug: 'horizontal-card',
    category: 'cards',
    tags: ['horizontal', 'responsive', 'media', 'list', 'stacked'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1290, copies: 344, downloads: 92 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'href', type: 'string', required: true, descriptionKey: 'href' },
      { name: 'copy', type: 'string', required: true, descriptionKey: 'copy' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'imageSrc', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<article class="h-card">
  <img class="h-card__image" src="/your-image.jpg" alt="" width="160" height="160" />

  <div class="h-card__body">
    <p class="h-card__kicker">Workshop &middot; 2 hours</p>

    <h3 class="h-card__title">
      <a class="h-card__link" href="#">Debugging performance with the Profiler</a>
    </h3>

    <p class="h-card__copy">
      Record a real session, read the flame graph, and find the one component re-rendering forty times a second.
    </p>
  </div>
</article>`,
      css: `.h-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 32rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}

.h-card__image {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  background: #f3f4f6;
}

/* Side by side once there is room; stacked below that. */
@media (min-width: 640px) {
  .h-card {
    flex-direction: row;
  }

  .h-card__image {
    width: 10rem;
    height: auto;
    align-self: stretch;
    flex: none;
  }
}

.h-card__body {
  flex: 1;
  padding: 1.25rem;
}

.h-card__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1d4ed8;
}

.h-card__title {
  margin: 0.375rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: #111827;
}

.h-card__link {
  color: inherit;
  text-decoration: none;
}

.h-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.h-card__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 4px;
}

.h-card__copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .h-card {
    border-color: #1f2937;
    background: #111827;
  }

  .h-card__image {
    background: #1f2937;
  }

  .h-card__kicker {
    color: #60a5fa;
  }

  .h-card__title {
    color: #f3f4f6;
  }

  .h-card__copy {
    color: #d1d5db;
  }

  .h-card__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<article class="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:flex-row dark:border-gray-800 dark:bg-gray-900">
  <img
    class="h-40 w-full flex-none bg-gray-100 object-cover sm:h-auto sm:w-40 sm:self-stretch dark:bg-gray-800"
    src="/your-image.jpg"
    alt=""
    width="160"
    height="160"
  />

  <div class="flex-1 p-5">
    <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">Workshop &middot; 2 hours</p>

    <h3 class="mt-1.5 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
      <a
        href="#"
        class="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Debugging performance with the Profiler
      </a>
    </h3>

    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Record a real session, read the flame graph, and find the one component re-rendering forty times a second.
    </p>
  </div>
</article>`,
      react: `export function HorizontalCard({ title, href, copy, kicker, imageSrc, imageAlt = '', className = '' }) {
  return (
    <article
      className={\`relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:flex-row dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img
        className="h-40 w-full flex-none bg-gray-100 object-cover sm:h-auto sm:w-40 sm:self-stretch dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={160}
        height={160}
      />

      <div className="flex-1 p-5">
        {kicker && <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{kicker}</p>}

        <h3 className="mt-1.5 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <a
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </a>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>
      </div>
    </article>
  );
}`,
      nextjs: `import Link from 'next/link';

// Static - Server Component, no 'use client'.
interface HorizontalCardProps {
  title: string;
  href: string;
  copy: string;
  kicker?: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

export function HorizontalCard({
  title,
  href,
  copy,
  kicker,
  imageSrc,
  imageAlt = '',
  className = '',
}: HorizontalCardProps) {
  return (
    <article
      className={\`relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:flex-row dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {/* Stacks under sm:, sits left of the copy above it. */}
      <img
        className="h-40 w-full flex-none bg-gray-100 object-cover sm:h-auto sm:w-40 sm:self-stretch dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={160}
        height={160}
      />

      <div className="flex-1 p-5">
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}

        <h3 className="mt-1.5 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <Link
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>
      </div>
    </article>
  );
}`,
      typescript: `export interface HorizontalCardProps {
  title: string;
  href: string;
  copy: string;
  kicker?: string;
  imageSrc: string;
  /** Empty by default - the title carries the accessible name. */
  imageAlt?: string;
  className?: string;
}

export function HorizontalCard({
  title,
  href,
  copy,
  kicker,
  imageSrc,
  imageAlt = '',
  className = '',
}: HorizontalCardProps): JSX.Element {
  return (
    <article
      className={\`relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:flex-row dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <img
        className="h-40 w-full flex-none bg-gray-100 object-cover sm:h-auto sm:w-40 sm:self-stretch dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={160}
        height={160}
      />

      <div className="flex-1 p-5">
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}

        <h3 className="mt-1.5 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <a
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </a>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>
      </div>
    </article>
  );
}`,
    },
  },
];
