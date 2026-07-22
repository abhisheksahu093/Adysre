'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  lumiereHref,
} from '@/data/templates/lumiere-salon-content';
import { LumiereMasthead } from './lumiere-masthead';
import { LumiereProductVisual } from './lumiere-product-visual';
import { LumiereQuantity } from './lumiere-quantity';
import { useLumiereSettings } from './lumiere-settings';
import { Reveal } from './lumiere-reveal';
import type { LumiereCart } from './lumiere-use-cart';

/**
 * LUMIERE - the basket.
 *
 * Lines with steppers and remove buttons beside a summary that sticks on a wide
 * screen. There is no checkout page: this template's commerce ends at a summary,
 * and the note under the button says so rather than leading someone into a form
 * that would have to ask for a card.
 *
 * Removal is announced through a live region, because a row vanishing is silent
 * to anyone who is not watching the list.
 */
export function LumiereCartPage({ cart }: { cart: LumiereCart }) {
  const { data } = useLumiereSettings();
  const { formatPrice } = useLumiereSettings();
  const { cart: copy, common } = data.salon;
  const [removedNotice, setRemovedNotice] = useState('');

  const onRemove = (key: string) => {
    cart.remove(key);
    setRemovedNotice(copy.removed);
  };

  return (
    <>
      <LumiereMasthead copy={copy.masthead} />

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20">
        <p aria-live="polite" className="sr-only">
          {removedNotice}
        </p>

        {cart.entries.length === 0 ? (
          <Reveal className="flex flex-col items-center text-center">
            <p className="text-[17px] leading-[1.8] text-[var(--lumi-ink-soft)]">{copy.empty}</p>
            <a href={lumiereHref('shop')} className="lumi-btn lumi-btn--solid mt-8">
              {common.backToShop}
            </a>
          </Reveal>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <ul className="space-y-5">
              {cart.entries.map((entry, index) => (
                <li key={entry.key}>
                  <Reveal delay={0.04 * Math.min(index, 4)}>
                    <article className="lumi-panel flex flex-wrap items-center gap-6 px-6 py-6 sm:flex-nowrap sm:px-8">
                      <div className="w-24 shrink-0">
                        <LumiereProductVisual
                          vessel={entry.vessel}
                          aspect="aspect-[3/4]"
                          label={entry.name}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-[17px] font-medium tracking-[-0.01em]">{entry.name}</h2>
                        <p className="lumi-label mt-2">
                          {entry.variantLabel} — {entry.size}
                        </p>
                        <p className="lumi-num mt-3 text-[15px] text-[var(--lumi-ink-soft)]">
                          {formatPrice(entry.price)}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-5">
                          <LumiereQuantity
                            value={entry.quantity}
                            onChange={(next) => cart.setQuantity(entry.key, next)}
                          />
                          <button
                            type="button"
                            onClick={() => onRemove(entry.key)}
                            className="inline-flex items-center gap-2 text-[13px] text-[var(--lumi-ink-faint)] transition-colors hover:text-[var(--lumi-accent-deep)]"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                            {/* The product name is in the button's text, so a
                                list of remove buttons is never five identical
                                links to a screen reader. */}
                            <span className="sr-only">
                              {copy.remove} {entry.name}
                            </span>
                            <span aria-hidden>{copy.remove}</span>
                          </button>
                        </div>
                      </div>

                      <p className="lumi-num shrink-0 text-[18px]">
                        <span className="sr-only">{copy.lineTotalLabel}: </span>
                        {formatPrice(entry.lineTotal)}
                      </p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <div className="lumi-panel px-8 py-9 lg:sticky lg:top-28">
                <h2 className="lumi-subtitle">{copy.summaryTitle}</h2>

                <dl className="mt-7 space-y-4 text-[15px]">
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="text-[var(--lumi-ink-soft)]">{copy.subtotal}</dt>
                    <dd className="lumi-num">{formatPrice(cart.subtotal)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <dt className="text-[var(--lumi-ink-soft)]">{copy.shipping}</dt>
                    <dd className="lumi-num">
                      {cart.shipping === 0 ? common.free : formatPrice(cart.shipping)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 pt-4 shadow-[inset_0_1px_0_var(--lumi-rule)]">
                    <dt className="text-[17px]">{copy.total}</dt>
                    <dd className="lumi-num text-[20px] text-[var(--lumi-accent-deep)]">
                      {formatPrice(cart.total)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 text-[13px] leading-[1.7] text-[var(--lumi-ink-faint)]">
                  {copy.shippingNote}
                </p>

                <button type="button" className="lumi-btn lumi-btn--solid mt-8 w-full">
                  {copy.checkout}
                </button>

                <p className="mt-4 text-[13px] leading-[1.7] text-[var(--lumi-ink-faint)]">
                  {copy.checkoutNote}
                </p>

                <a
                  href={lumiereHref('shop')}
                  className="mt-6 inline-flex text-[13px] uppercase tracking-[0.12em] text-[var(--lumi-accent-deep)] transition-colors hover:text-[var(--lumi-ink)]"
                >
                  {copy.continue}
                </a>
              </div>
            </Reveal>
          </div>
        )}
      </section>
    </>
  );
}
