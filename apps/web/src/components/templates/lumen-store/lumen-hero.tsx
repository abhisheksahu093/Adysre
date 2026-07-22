'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { lumenHref, type LumenProduct } from '@/data/templates/lumen-store-content';
import type { TemplateContent } from '@/data/templates/types';
import { Counter } from './lumen-reveal';
import { LumenProductVisual } from './lumen-product-visual';

/**
 * LUMEN - hero.
 *
 * Product-forward rather than headline-forward: the words take the narrower
 * column and the hero piece is drawn at full height beside them, because a shop
 * should show something in the first screen. The two smaller visuals underneath
 * are the same component at a different ratio - one drawing routine, three sizes.
 */
export function LumenHero({
  content,
  products,
}: {
  content: TemplateContent;
  products: LumenProduct[];
}) {
  const reduce = useReducedMotion();
  const { hero } = content;
  const [lead, ...rest] = products;
  const supporting = rest.slice(0, 2);

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10 sm:pb-28 sm:pt-16">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">
        <div>
          <motion.p {...rise(0)} className="lum-eyebrow">
            {hero.badge}
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 text-balance text-[42px] font-medium leading-[1.06] tracking-[-0.03em] sm:text-[58px] lg:text-[64px]"
          >
            {hero.title}{' '}
            <span className="text-[var(--lum-accent-deep)]">{hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-7 max-w-xl text-pretty text-[17px] leading-[1.8] text-[var(--lum-ink-soft)]"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={lumenHref('shop')} className="lum-btn lum-btn--solid">
              {hero.ctaPrimary}
            </a>
            <a href="#about" className="lum-btn lum-btn--outline">
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl {...rise(0.32)} className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-[var(--lum-rule)] pt-8">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="lum-price text-[30px] font-medium tracking-[-0.02em]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-[13px] leading-[1.5] text-[var(--lum-ink-faint)]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div {...rise(0.12)} className="grid gap-4">
          {lead !== undefined && (
            <a href={lumenHref('product')} className="lum-art-lift block">
              <LumenProductVisual art={lead.art} aspect="aspect-[4/5]" label={lead.name} />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <span className="text-[15px]">{lead.name}</span>
                <span className="lum-label">{lead.category}</span>
              </div>
            </a>
          )}

          <div className="grid grid-cols-2 gap-4">
            {supporting.map((product) => (
              <a key={product.id} href={lumenHref('shop')} className="lum-art-lift block">
                <LumenProductVisual art={product.art} aspect="aspect-square" label={product.name} />
                <span className="mt-3 block text-[13px] text-[var(--lum-ink-soft)]">
                  {product.name}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
