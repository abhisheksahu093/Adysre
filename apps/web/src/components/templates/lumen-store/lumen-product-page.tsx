'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  LUMEN_FEATURED_PRODUCT_ID,
  LUMEN_PRODUCTS,
  LUMEN_SHOP,
  findLumenProduct,
  formatLumenPrice,
  lumenHref,
} from '@/data/templates/lumen-store-content';
import { LumenAccordion } from './lumen-accordion';
import { LumenProductCard } from './lumen-product-card';
import { LumenProductVisual } from './lumen-product-visual';
import { LumenQuantity } from './lumen-quantity';
import { Reveal } from './lumen-reveal';
import { LumenSectionHeading } from './lumen-section-heading';
import type { LumenCart } from './lumen-use-cart';

/**
 * LUMEN - the product detail page.
 *
 * A sticky drawn visual on the left, the buying column on the right, the
 * specification accordion beneath it and a related row at the foot. The finish
 * swatches are a `radiogroup` of `aria-pressed` buttons rather than a select: a
 * finish is a visual choice, and hiding six colours behind a dropdown is the one
 * thing a lighting shop must not do.
 */
export function LumenProductPage({ cart }: { cart: LumenCart }) {
  const copy = LUMEN_SHOP.product;
  const product = findLumenProduct(LUMEN_FEATURED_PRODUCT_ID) ?? LUMEN_PRODUCTS[0];

  const [swatchId, setSwatchId] = useState(product?.swatches[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // The catalogue is authored above, so this is unreachable - but the type says
  // it can be, and a template that crashes on an empty array is not a template.
  if (!product) return null;

  const related = LUMEN_PRODUCTS.filter((item) => item.id !== product.id).slice(0, 3);
  const detailRows = [
    { label: copy.detailLabels.dimensions, value: product.dimensions },
    { label: copy.detailLabels.material, value: product.material },
    { label: copy.detailLabels.delivery, value: product.delivery },
  ];

  const onAdd = () => {
    cart.add(product.id, swatchId, quantity);
    setAdded(true);
  };

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10 sm:pb-28 sm:pt-12">
        <nav aria-label={LUMEN_SHOP.common.breadcrumbNav} className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-[var(--lum-ink-faint)]">
            <li>
              <a href={lumenHref('shop')} className="transition-colors hover:text-[var(--lum-ink)]">
                {copy.breadcrumb}
              </a>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-[var(--lum-ink-soft)]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <LumenProductVisual art={product.art} aspect="aspect-[4/5]" label={product.name} />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {/* The same piece drawn small three times - a stand-in for the
                  thumbnail rail a real gallery would have, with no assets. */}
              {related.map((item) => (
                <LumenProductVisual
                  key={item.id}
                  art={product.art}
                  aspect="aspect-square"
                  label={`${product.name}, ${copy.altViewLabel}`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="lum-label">{product.category}</p>
            <h1 className="mt-3 text-[36px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[44px]">
              {product.name}
            </h1>
            <p className="lum-price mt-4 text-[24px]">{formatLumenPrice(product.price)}</p>
            <p className="mt-6 max-w-md text-[16px] leading-[1.8] text-[var(--lum-ink-soft)]">
              {product.blurb}
            </p>

            <div className="mt-9" role="group" aria-labelledby="lum-finish-label">
              <p id="lum-finish-label" className="lum-label">
                {copy.finishLabel}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {product.swatches.map((swatch) => (
                  <button
                    key={swatch.id}
                    type="button"
                    aria-pressed={swatch.id === swatchId}
                    aria-label={swatch.label}
                    onClick={() => setSwatchId(swatch.id)}
                    className={`lum-swatch lum-swatch--${swatch.id} h-7 w-7`}
                  />
                ))}
                <span className="ml-2 text-[14px] text-[var(--lum-ink-soft)]">
                  {product.swatches.find((swatch) => swatch.id === swatchId)?.label ?? ''}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LumenQuantity
                value={quantity}
                label={copy.quantityLabel}
                itemName={product.name}
                decreaseLabel={copy.decrease}
                increaseLabel={copy.increase}
                onChange={setQuantity}
              />
              <button type="button" onClick={onAdd} className="lum-btn lum-btn--solid flex-1">
                {LUMEN_SHOP.common.addToCart}
              </button>
            </div>

            <p
              aria-live="polite"
              className="mt-3 min-h-5 text-[13px] text-[var(--lum-ink-faint)]"
            >
              {added ? `${LUMEN_SHOP.common.added}: ${product.name}` : ''}
            </p>

            <dl className="mt-10 divide-y divide-[var(--lum-rule)] border-y border-[var(--lum-rule)]">
              {detailRows.map((row) => (
                <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-4">
                  <dt className="lum-label">{row.label}</dt>
                  <dd className="text-[15px] leading-[1.7] text-[var(--lum-ink-soft)]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 text-[13px] font-medium uppercase tracking-[0.16em]">
              {copy.specsTitle}
            </h2>
            <div className="mt-5">
              {/* h3 items under the h2 above - the specification must not
                  skip a heading level just because it sits in a column. */}
              <LumenAccordion idPrefix="lum-spec" items={product.specs} defaultOpen={null} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--lum-rule)] bg-[var(--lum-paper-2)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
          <LumenSectionHeading
            eyebrow={LUMEN_SHOP.shop.eyebrow}
            title={copy.relatedTitle}
            subtitle={copy.relatedSubtitle}
          />
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={0.06 * index}>
                <LumenProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
