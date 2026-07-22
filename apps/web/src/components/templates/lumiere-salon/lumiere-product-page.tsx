'use client';

import { useState } from 'react';
import {
  LUMIERE_FEATURED_PRODUCT_ID,
  findLumiereProduct,
  lumiereHref,
} from '@/data/templates/lumiere-salon-content';
import { LumiereAccordion } from './lumiere-accordion';
import { LumiereProductCard } from './lumiere-product-card';
import { LumiereProductVisual } from './lumiere-product-visual';
import { LumiereQuantity } from './lumiere-quantity';
import { useLumiereSettings } from './lumiere-settings';
import { Reveal } from './lumiere-reveal';
import type { LumiereCart } from './lumiere-use-cart';

/**
 * LUMIERE - the product detail page.
 *
 * One product, named in the content module rather than indexed out of the array,
 * so the page cannot silently change when the catalogue is reordered.
 *
 * Adding to the basket is real: it calls into the same `useLumiereCart` state the
 * header count and the basket page read, and the confirmation is announced in an
 * `aria-live` region rather than only appearing.
 */
export function LumiereProductPage({ cart }: { cart: LumiereCart }) {
  const { data } = useLumiereSettings();
  const { formatPrice } = useLumiereSettings();
  const { product: copy, common } = data.salon;
  const product = findLumiereProduct(LUMIERE_FEATURED_PRODUCT_ID);

  const [variantId, setVariantId] = useState<string>(product?.variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // The catalogue is static, so this cannot happen in practice - but a page that
  // returns nothing is better than one that throws in a downloaded project where
  // someone has deleted a product.
  if (product === undefined) return null;

  const related = data.products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  ).slice(0, 3);

  const onAdd = () => {
    cart.add(product.id, variantId, quantity);
    setAdded(true);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
      <nav aria-label={common.breadcrumbNav}>
        <a
          href={lumiereHref('shop')}
          className="lumi-label transition-colors hover:text-[var(--lumi-accent-deep)]"
        >
          {copy.breadcrumb}
        </a>
      </nav>

      <div className="mt-8 grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <LumiereProductVisual
            vessel={product.vessel}
            aspect="aspect-[4/5]"
            label={product.name}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="lumi-title">{product.name}</h1>

          <p className="lumi-num mt-4 text-[26px] text-[var(--lumi-accent-deep)]">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 max-w-xl text-[17px] leading-[1.85] text-[var(--lumi-ink-soft)]">
            {product.blurb}
          </p>

          {/*
            Shade discs are buttons in a labelled group, not a `<select>`: the
            colour is the information, and `aria-pressed` plus the visible label
            beside the row keeps that available without sight of the disc.
          */}
          <div className="mt-10">
            <p className="lumi-label" id="lumiere-variant-label">
              {copy.variantLabel}
            </p>
            <div
              role="group"
              aria-labelledby="lumiere-variant-label"
              className="mt-4 flex flex-wrap items-center gap-4"
            >
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={variantId === variant.id}
                  aria-label={variant.label}
                  onClick={() => setVariantId(variant.id)}
                  className={`lumi-shade lumi-shade--${variant.id} h-10 w-10`}
                />
              ))}
              <span className="text-[14px] text-[var(--lumi-ink-soft)]">
                {product.variants.find((variant) => variant.id === variantId)?.label ?? ''}
              </span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <LumiereQuantity value={quantity} onChange={setQuantity} />
            <button type="button" onClick={onAdd} className="lumi-btn lumi-btn--solid">
              {common.addToCart}
            </button>
          </div>

          {/*
            Always rendered, empty until something is added: a live region that
            is inserted at the moment it gains text is frequently missed by
            screen readers, because there was nothing there to watch.
          */}
          <p
            aria-live="polite"
            className="mt-5 min-h-[1.25rem] text-[14px] text-[var(--lumi-accent-deep)]"
          >
            {added ? common.added : ''}
          </p>

          <dl className="mt-10 space-y-3">
            <div className="flex gap-3">
              <dt className="lumi-label w-28 shrink-0 pt-0.5">{copy.sizeLabel}</dt>
              <dd className="text-[15px]">{product.size}</dd>
            </div>
          </dl>

          <h2 className="sr-only">{copy.detailsTitle}</h2>
          <div className="mt-8">
            <LumiereAccordion
              idPrefix="lumiere-product"
              headingLevel="h3"
              items={[
                { title: copy.ingredientsLabel, body: product.ingredients },
                { title: copy.usageLabel, body: product.usage },
              ]}
            />
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="mt-28">
          <Reveal>
            <h2 className="lumi-title">{copy.relatedTitle}</h2>
            <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-[var(--lumi-ink-soft)]">
              {copy.relatedSubtitle}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={0.05 * index}>
                <LumiereProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
