'use client';

import {
  lumiereHref,
  type LumiereProduct,
} from '@/data/templates/lumiere-salon-content';
import { useLumiereSettings } from './lumiere-settings';
import { LumiereProductVisual } from './lumiere-product-visual';

/**
 * LUMIERE - one product in a grid.
 *
 * Shared by the home page's featured strip, the shop grid and the related row
 * beneath a product, so a product reads identically wherever it appears.
 *
 * Every card points at `?page=product`: the template has one detail page by
 * design, since its job is to show what a detail page looks like rather than to
 * be a catalogue. Wiring a real shop means swapping this href for the product's
 * own route - one line, in one file.
 */
export function LumiereProductCard({
  product,
  showBlurb = false,
}: {
  product: LumiereProduct;
  showBlurb?: boolean;
}) {
  const { formatPrice } = useLumiereSettings();
  return (
    <article>
      {/* The lift class sits on the anchor, not the article, so the arch also
          rises when the card is reached by keyboard rather than by pointer. */}
      <a href={lumiereHref('product')} className="lumi-lift block">
        {/* The visual carries the product's name, so the anchor's own text stays
            the name and price rather than repeating it a third time. */}
        <LumiereProductVisual vessel={product.vessel} aspect="aspect-[4/5]" label={product.name} />

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h3 className="text-[17px] font-medium tracking-[-0.01em]">{product.name}</h3>
          <p className="lumi-num text-[17px] text-[var(--lumi-accent-deep)]">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="lumi-label mt-2">{product.size}</p>

        {showBlurb && (
          <p className="mt-3 text-[14px] leading-[1.75] text-[var(--lumi-ink-soft)]">
            {product.blurb}
          </p>
        )}
      </a>
    </article>
  );
}
