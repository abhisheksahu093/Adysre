'use client';

import {
  formatLumenPrice,
  lumenHref,
  type LumenProduct,
} from '@/data/templates/lumen-store-content';
import { LumenProductVisual } from './lumen-product-visual';

/**
 * LUMEN - one product in a grid.
 *
 * Shared by the home page's featured strip, the shop index and the related row
 * beneath a product, so a product reads identically wherever it appears.
 *
 * Every card points at `?page=product`: the template has one detail page by
 * design, since its job is to show what a detail page looks like rather than to
 * be a catalogue. Wiring a real store means swapping this href for the product's
 * own route - one line, in one file.
 */
export function LumenProductCard({
  product,
  showBlurb = false,
}: {
  product: LumenProduct;
  showBlurb?: boolean;
}) {
  return (
    <article>
      {/* The lift class sits on the anchor, not the article, so the visual also
          rises when the card is reached by keyboard rather than by pointer. */}
      <a href={lumenHref('product')} className="lum-art-lift block">
        {/* The visual carries the product's name, so the anchor's own text stays
            the name and price rather than repeating it a third time. */}
        <LumenProductVisual art={product.art} aspect="aspect-[4/5]" label={product.name} />
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[var(--lum-rule)] pt-4">
          <h3 className="text-[16px] font-medium tracking-[-0.01em]">{product.name}</h3>
          <p className="lum-price text-[16px]">{formatLumenPrice(product.price)}</p>
        </div>
        <p className="lum-label mt-1.5">{product.category}</p>
        {showBlurb && (
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--lum-ink-soft)]">
            {product.blurb}
          </p>
        )}
      </a>
    </article>
  );
}
