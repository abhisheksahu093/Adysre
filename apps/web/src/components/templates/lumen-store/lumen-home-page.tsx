'use client';

import { LUMEN_PRODUCTS, LUMEN_SHOP } from '@/data/templates/lumen-store-content';
import type { TemplateContent } from '@/data/templates/types';
import { LumenAbout } from './lumen-about';
import { LumenContact } from './lumen-contact';
import { LumenFaq } from './lumen-faq';
import { LumenFeatured } from './lumen-featured';
import { LumenHero } from './lumen-hero';
import { LumenMarquee } from './lumen-marquee';
import { LumenServices } from './lumen-services';
import { LumenWhy } from './lumen-why';

/**
 * LUMEN - the home page.
 *
 * The one page that carries the shared section set every template in the gallery
 * has (hero, about, services, why, faq, contact), with the featured product grid
 * dropped in after the materials strip. The alternating paper tone comes from the
 * sections themselves, so the order below is the only thing this file decides.
 */
export function LumenHomePage({ content }: { content: TemplateContent }) {
  const featured = LUMEN_PRODUCTS.filter((product) => product.featured);

  return (
    <>
      <LumenHero content={content} products={featured} />
      <LumenMarquee content={content} />
      <LumenFeatured products={featured} shop={LUMEN_SHOP} />
      <LumenAbout content={content} products={featured.slice(2, 4)} />
      <LumenServices content={content} />
      <LumenWhy content={content} />
      <LumenFaq content={content} />
      <LumenContact content={content} />
    </>
  );
}
