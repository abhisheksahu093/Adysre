'use client';

import { ArrowUpRight } from 'lucide-react';
import { NORTHGATE_LABELS, NORTHGATE_PRODUCTS } from '@/data/templates/northgate-pay-content';
import { northgateHref } from './northgate-links';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the card terminal visual.
 *
 * Composed entirely from gradients and radii: a rounded body, an inset screen,
 * a keypad drawn as one repeating radial gradient, and a decorative card
 * tucked behind it. No image, no SVG, no icon font.
 *
 * SAFETY, and the reason the markup looks the way it does: this is artwork for
 * a payments COMPANY, not a payment form. There is no `<input>` anywhere inside
 * it, no `autocomplete`, and the digits on the card face are bullet glyphs that
 * do not form a number. The caption says so in plain words, because a visitor
 * should never have to wonder whether a page is asking for their card.
 */
export function NorthgateTerminal() {
  // The specification block is the terminals product's own measured figures -
  // read from the product rather than restated, so there is one source.
  const terminals = NORTHGATE_PRODUCTS.find((product) => product.id === 'terminals');

  return (
    <section className="ngp-on-deep ngp-wash relative overflow-hidden border-b border-[var(--ngp-deep-rule)] bg-[var(--ngp-deep)] text-[var(--ngp-on-deep)]">
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="ngp-eyebrow ngp-eyebrow-invert">{NORTHGATE_LABELS.terminalEyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{NORTHGATE_LABELS.terminalTitle}</h2>
          <p className="mt-6 max-w-lg text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-on-deep-soft)]">
            {NORTHGATE_LABELS.terminalBody}
          </p>

          {terminals && (
            <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--ngp-radius-sm)] border border-[var(--ngp-deep-rule)] sm:grid-cols-2">
              {terminals.spec.map((row) => (
                <div key={row.label} className="bg-[var(--ngp-deep-2)] px-5 py-4">
                  <dt className="text-[12px] text-[var(--ngp-on-deep-faint)]">{row.label}</dt>
                  <dd className="ngp-mono mt-1.5 text-[15px] text-[var(--ngp-cyan-bright)]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <a
            href={northgateHref('products')}
            className="ngp-mono mt-10 inline-flex items-center gap-2 text-[13px] tracking-[0.06em] text-[var(--ngp-cyan-bright)] transition-opacity hover:opacity-70"
          >
            {NORTHGATE_LABELS.terminalCta}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto w-full max-w-sm">
            {/* The card sits behind and above the reader, rotated a few degrees.
                Purely decorative, so the whole assembly is hidden from AT and
                the caption below carries the meaning instead. */}
            <div aria-hidden className="relative pb-16 pt-6">
              <div className="ngp-cardface ml-auto mr-2 h-40 w-64 -rotate-6 p-5">
                <span className="ngp-chip block h-7 w-9" />
                <p className="ngp-mono mt-8 text-[15px] tracking-[0.22em] text-[var(--ngp-on-deep)]">
                  {NORTHGATE_LABELS.terminalCardDigits}
                </p>
                <p className="ngp-mono mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--ngp-on-deep-soft)]">
                  {NORTHGATE_LABELS.terminalCardName}
                </p>
              </div>

              <div className="ngp-terminal absolute left-0 top-24 w-52 p-4">
                <div className="ngp-terminal-screen flex h-24 flex-col justify-between p-3.5">
                  <span className="ngp-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ngp-on-deep-soft)]">
                    {NORTHGATE_LABELS.terminalDevice}
                  </span>
                  <span className="ngp-mono text-[22px] tracking-[-0.02em] text-[var(--ngp-on-deep)]">
                    {NORTHGATE_LABELS.terminalAmount}
                  </span>
                  {/* Contactless mark: three stacked arcs, each a bordered box
                      with only one rounded corner set showing. */}
                  <span className="flex items-center gap-1">
                    {[0, 1, 2].map((arc) => (
                      <span
                        key={arc}
                        className="block h-2 w-1 rounded-r-full border-r border-[var(--ngp-cyan-bright)]"
                      />
                    ))}
                  </span>
                </div>
                <div className="ngp-terminal-keys mt-4 h-24 w-full" />
              </div>
            </div>

            <p className="ngp-mono mt-6 text-[11px] leading-[1.7] text-[var(--ngp-on-deep-faint)]">
              {NORTHGATE_LABELS.terminalCardLabel}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
