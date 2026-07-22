'use client';

import { ArrowRight } from 'lucide-react';
import {
  lumenHref,
  type LumenProduct,
  type LumenShopCopy,
} from '@/data/templates/lumen-store-content';
import { Reveal } from './lumen-reveal';
import { LumenProductCard } from './lumen-product-card';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - the featured grid on the home page.
 *
 * The editorial move of the whole design: three columns of tall product frames
 * with nothing between them but whitespace, and the only rule on the page drawn
 * under each name. Cards are staggered by 60ms so the row assembles left to
 * right rather than blinking in as a block.
 */
export function LumenFeatured({
  products,
  shop,
}: {
  products: LumenProduct[];
  shop: LumenShopCopy;
}) {
  return (
    <section id="featured" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <LumenSectionHeading
          eyebrow={shop.shop.eyebrow}
          title={shop.shop.title}
          subtitle={shop.shop.subtitle}
        />
        <Reveal delay={0.1}>
          <a
            href={lumenHref('shop')}
            className="inline-flex items-center gap-2 border-b border-[var(--lum-accent)] pb-1 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors hover:text-[var(--lum-accent-deep)]"
          >
            {shop.shop.viewLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={0.06 * index}>
            <LumenProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
