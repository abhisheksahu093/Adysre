'use client';

import type { TemplateContent } from '@/data/templates/types';
import { KiteFaq } from './kite-faq';
import { KiteFeaturedWork } from './kite-featured-work';
import { KiteHero } from './kite-hero';
import { KiteMarquee } from './kite-marquee';
import { KiteServices } from './kite-services';
import { KiteWhy } from './kite-why';

/**
 * KITE - the home page.
 *
 * A composer and nothing else: it decides the order of the page, and each
 * section owns its own layout. Keeping five pages as five composers is what
 * makes the multipage switch in `kite-template.tsx` a five-line function.
 */
export function KiteHomePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <KiteHero content={content} />
      <KiteMarquee content={content} />
      <KiteFeaturedWork />
      <KiteServices content={content} />
      <KiteWhy content={content} />
      <KiteFaq content={content} />
    </>
  );
}
