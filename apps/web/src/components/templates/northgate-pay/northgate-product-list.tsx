'use client';

import { ArrowUpRight, Check } from 'lucide-react';
import { NORTHGATE_LABELS, NORTHGATE_PRODUCTS } from '@/data/templates/northgate-pay-content';
import { northgateHref } from './northgate-links';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the four products, at length.
 *
 * Each product is a full band rather than a card, alternating paper tones so
 * the eye can find the seam between them without a heavy rule. The measured
 * figures sit in their own panel beside the capabilities, because the numbers
 * are what an evaluating team is actually scanning for.
 */
export function NorthgateProductList() {
  return (
    <>
      {NORTHGATE_PRODUCTS.map((product, index) => (
        <section
          key={product.id}
          className={`border-b border-[var(--ngp-rule)] ${
            index % 2 === 0 ? 'bg-[var(--ngp-bg)]' : 'bg-[var(--ngp-bg-2)]'
          }`}
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <p className="ngp-mono text-[11px] tracking-[0.22em] text-[var(--ngp-ink-faint)]">
                  {`0${index + 1}`}
                </p>
                <h2 className="ngp-display ngp-display-md mt-5">{product.name}</h2>
                <p className="ngp-grad-text-ink ngp-mono mt-4 text-[14px] tracking-[-0.01em]">
                  {product.tagline}
                </p>
                <span className="ngp-rule-grad mt-8 w-16" aria-hidden />
                <p className="mt-8 max-w-lg text-pretty text-[15.5px] leading-[1.85] text-[var(--ngp-ink-soft)]">
                  {product.summary}
                </p>

                <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--ngp-radius-sm)] border border-[var(--ngp-rule)] sm:grid-cols-2">
                  {product.spec.map((row) => (
                    <div key={row.label} className="bg-[var(--ngp-bg)] px-5 py-4">
                      <dt className="text-[12px] text-[var(--ngp-ink-faint)]">{row.label}</dt>
                      <dd className="ngp-mono mt-1.5 text-[16px] text-[var(--ngp-indigo-deep)]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="ngp-card ngp-card-lg p-8 sm:p-10">
                <p className="ngp-eyebrow">{NORTHGATE_LABELS.productsCapabilities}</p>
                <ul className="mt-7 divide-y divide-[var(--ngp-rule)]">
                  {product.capabilities.map((capability) => (
                    <li key={capability} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ngp-indigo-deep)]"
                        aria-hidden
                      />
                      <span className="text-[14px] leading-[1.75] text-[var(--ngp-ink-soft)]">
                        {capability}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={northgateHref('contact')}
                  className="ngp-mono mt-9 inline-flex items-center gap-2 text-[12.5px] tracking-[0.06em] text-[var(--ngp-indigo-deep)] transition-opacity hover:opacity-70"
                >
                  {NORTHGATE_LABELS.productsCta}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}
