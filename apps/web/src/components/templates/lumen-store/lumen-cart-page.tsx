'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { LUMEN_SHOP, formatLumenPrice, lumenHref } from '@/data/templates/lumen-store-content';
import { LumenProductVisual } from './lumen-product-visual';
import { LumenQuantity } from './lumen-quantity';
import { LumenSectionHeading } from './lumen-section-heading';
import { LumenSummary } from './lumen-summary';
import type { LumenCart } from './lumen-use-cart';

/**
 * LUMEN - the basket.
 *
 * Line items on the left, a summary that sticks beside them on the right. Each
 * line is a real `<li>` inside a labelled list so a screen reader can count the
 * basket, and both controls on a line name their product, since "Remove" four
 * times in a row tells a non-visual reader nothing.
 */
export function LumenCartPage({ cart }: { cart: LumenCart }) {
  const copy = LUMEN_SHOP.cart;
  const [removed, setRemoved] = useState<string | null>(null);

  const onRemove = (key: string, name: string) => {
    cart.remove(key);
    setRemoved(name);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <LumenSectionHeading eyebrow={copy.eyebrow} title={copy.title} as="h1" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
        <div>
          {cart.entries.length === 0 ? (
            <div className="border-y border-[var(--lum-rule)] py-14 text-center">
              <p className="text-[16px] text-[var(--lum-ink-soft)]">{copy.empty}</p>
              <a href={lumenHref('shop')} className="lum-btn lum-btn--outline mt-6">
                {LUMEN_SHOP.common.continueShopping}
              </a>
            </div>
          ) : (
            <ul aria-label={copy.title} className="border-t border-[var(--lum-rule)]">
              {cart.entries.map((entry) => (
                <li
                  key={entry.key}
                  className="grid grid-cols-[80px_1fr] items-start gap-5 border-b border-[var(--lum-rule)] py-6 sm:grid-cols-[104px_1fr]"
                >
                  <a href={lumenHref('product')} className="lum-art-lift block">
                    {/* `art` is joined onto the line from the catalogue by the
                        cart hook - a basket row stores ids, never presentation. */}
                    <LumenProductVisual art={entry.art} aspect="aspect-square" label={entry.name} />
                  </a>

                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                      <div>
                        <h2 className="text-[17px] font-medium tracking-[-0.01em]">
                          <a
                            href={lumenHref('product')}
                            className="transition-colors hover:text-[var(--lum-accent-deep)]"
                          >
                            {entry.name}
                          </a>
                        </h2>
                        <p className="mt-1 text-[14px] text-[var(--lum-ink-faint)]">
                          {entry.category} · {entry.swatchLabel}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="lum-price text-[17px]">{formatLumenPrice(entry.lineTotal)}</p>
                        <p className="mt-1 text-[13px] text-[var(--lum-ink-faint)]">
                          {formatLumenPrice(entry.price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <LumenQuantity
                        value={entry.quantity}
                        label={LUMEN_SHOP.product.quantityLabel}
                        itemName={entry.name}
                        decreaseLabel={LUMEN_SHOP.product.decrease}
                        increaseLabel={LUMEN_SHOP.product.increase}
                        onChange={(next) => cart.setQuantity(entry.key, next)}
                      />
                      <button
                        type="button"
                        aria-label={`${copy.remove}: ${entry.name}`}
                        onClick={() => onRemove(entry.key, entry.name)}
                        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--lum-ink-faint)] transition-colors hover:text-[var(--lum-ink)]"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden />
                        {copy.remove}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p aria-live="polite" className="mt-4 min-h-5 text-[13px] text-[var(--lum-ink-faint)]">
            {removed === null ? '' : `${copy.removed}: ${removed}`}
          </p>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <LumenSummary cart={cart} title={copy.summaryTitle}>
            <a
              href={lumenHref('checkout')}
              className={`lum-btn lum-btn--solid mt-6 w-full ${
                cart.entries.length === 0 ? 'pointer-events-none opacity-50' : ''
              }`}
              {...(cart.entries.length === 0 ? { 'aria-disabled': true } : {})}
            >
              {copy.checkout}
            </a>
            <a
              href={lumenHref('shop')}
              className="mt-4 block text-center text-[13px] text-[var(--lum-ink-faint)] transition-colors hover:text-[var(--lum-ink)]"
            >
              {LUMEN_SHOP.common.continueShopping}
            </a>
          </LumenSummary>
        </div>
      </div>
    </section>
  );
}
