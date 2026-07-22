'use client';

import { LUMEN_PRODUCTS, LUMEN_SHOP } from '@/data/templates/lumen-store-content';
import { Reveal } from './lumen-reveal';
import { LumenProductCard } from './lumen-product-card';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - the shop index.
 *
 * The whole range in one grid, with the blurb shown here (and hidden on the home
 * page's featured strip) because this is where someone is comparing rather than
 * browsing. The category rail above is a static list of what the catalogue
 * actually contains, derived from the data so it can never list an empty filter.
 */
export function LumenShopPage() {
  const { shop } = LUMEN_SHOP;
  const categories = [...new Set(LUMEN_PRODUCTS.map((product) => product.category))];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <LumenSectionHeading
        eyebrow={shop.eyebrow}
        title={shop.title}
        subtitle={shop.subtitle}
        as="h1"
      />

      <Reveal delay={0.08}>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[var(--lum-rule)] py-4">
          <span className="lum-label">
            {LUMEN_PRODUCTS.length} {shop.countLabel}
          </span>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {categories.map((category) => (
              <li key={category} className="text-[14px] text-[var(--lum-ink-soft)]">
                {category}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {LUMEN_PRODUCTS.map((product, index) => (
          <Reveal key={product.id} delay={0.05 * (index % 3)}>
            <LumenProductCard product={product} showBlurb />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
