'use client';

import { LUMEN_SHOP } from '@/data/templates/lumen-store-content';
import type { TemplateContent } from '@/data/templates/types';

/**
 * LUMEN - the materials strip.
 *
 * A shop's proof is what things are made of, so the marquee carries materials
 * rather than client logos. The duplicate pass is `aria-hidden` so each material
 * is announced once, and the whole strip stands still under reduced motion.
 */
export function LumenMarquee({ content }: { content: TemplateContent }) {
  return (
    <section
      aria-label={LUMEN_SHOP.common.materialsStrip}
      className="border-y border-[var(--lum-rule)] py-5"
    >
      <div className="lum-fade-x relative overflow-hidden">
        <div className="lum-marquee flex w-max items-center gap-14 pr-14">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center gap-14 pr-14" aria-hidden={pass === 1}>
              {content.marquee.map((material) => (
                <span
                  key={`${pass}-${material}`}
                  className="lum-label whitespace-nowrap"
                >
                  {material}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
