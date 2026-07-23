'use client';

import { useMemo, useState } from 'react';
import {
} from '@/data/templates/lumiere-salon-content';
import { useLumiereSettings } from './lumiere-settings';
import { LumiereMasthead } from './lumiere-masthead';
import { LumiereProductCard } from './lumiere-product-card';
import { Reveal } from './lumiere-reveal';

/** The chip value meaning "no filter". A constant so no component types 'all'. */
const ALL = 'all';

/**
 * LUMIERE - the shop.
 *
 * Real client-side filtering rather than a decorative rail: the chips are
 * `<button>`s carrying `aria-pressed`, the grid is derived from the active
 * category, and the result count lives in an `aria-live="polite"` region so a
 * screen reader is told the list changed - a visual count that only sighted
 * visitors notice is the usual failure here.
 *
 * The counts on each chip come from the catalogue, so a category can never be
 * offered with nothing behind it.
 */
export function LumiereShopPage() {
  const { data } = useLumiereSettings();
  const { shop } = data.salon;
  const [active, setActive] = useState<string>(ALL);

  // `data.products` is a dependency, not a constant: it changes with the
  // language, and omitting it left the grid showing the previous locale.
  const visible = useMemo(
    () =>
      active === ALL
        ? data.products
        : data.products.filter((product) => product.category === active),
    [active, data.products],
  );

  const chips = [
    { id: ALL, name: shop.allLabel, count: data.products.length },
    ...data.productCategories.map((category) => ({
      id: category.id,
      name: category.name,
      count: data.products.filter((product) => product.category === category.id).length,
    })),
  ];

  const description = data.productCategories.find((category) => category.id === active);

  return (
    <>
      <LumiereMasthead copy={shop.masthead} />

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20">
        <Reveal>
          <div
            role="group"
            aria-label={shop.filterLabel}
            className="flex flex-wrap justify-center gap-3"
          >
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active === chip.id}
                onClick={() => setActive(chip.id)}
                className="lumi-chip"
              >
                {chip.name}
                <span className="lumi-num ml-2 opacity-60">{chip.count}</span>
              </button>
            ))}
          </div>

          {/*
            One live region for both the count and the category note. It is
            `polite`, so it waits for a pause rather than interrupting, and it
            renders visibly too - the same sentence for everyone.
          */}
          <p
            aria-live="polite"
            className="mt-8 text-center text-[15px] leading-[1.8] text-[var(--lumi-ink-soft)]"
          >
            {visible.length} {visible.length === 1 ? shop.countOne : shop.countMany}
            {description === undefined ? '' : `, ${description.description}`}
          </p>
        </Reveal>

        {/* The grid needs a heading so the card `h3`s do not skip a level under
            the masthead's `h1`. It is announced, not seen: the chips above are
            the visible label for the same thing. */}
        <h2 className="sr-only">{shop.masthead.eyebrow}</h2>

        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, index) => (
            <Reveal key={product.id} delay={0.05 * (index % 3)}>
              <LumiereProductCard product={product} showBlurb />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
