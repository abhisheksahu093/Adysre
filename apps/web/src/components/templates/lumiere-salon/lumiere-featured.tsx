'use client';

import {
  lumiereHref,
} from '@/data/templates/lumiere-salon-content';
import { useLumiereSettings } from './lumiere-settings';
import { LumiereProductCard } from './lumiere-product-card';
import { LumiereSectionHeading } from './lumiere-section-heading';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the featured formulas on the home page.
 *
 * Five products are flagged `featured` in the catalogue; four are shown here so
 * the grid stays even at every breakpoint, and the shop link carries the rest.
 * Blurbs are suppressed - someone on the home page is browsing, not comparing.
 */
export function LumiereFeatured() {
  const { data } = useLumiereSettings();
  const { shop } = data.salon;
  const featured = data.products.filter((product) => product.featured).slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
      <LumiereSectionHeading
        eyebrow={shop.masthead.eyebrow}
        title={shop.masthead.title}
        subtitle={shop.masthead.subtitle}
      >
        <a href={lumiereHref('shop')} className="lumi-btn lumi-btn--ghost mt-8">
          {shop.viewAll}
        </a>
      </LumiereSectionHeading>

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product, index) => (
          <Reveal key={product.id} delay={0.05 * (index % 4)}>
            <LumiereProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
