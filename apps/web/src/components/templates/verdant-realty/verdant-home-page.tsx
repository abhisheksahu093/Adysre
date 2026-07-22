'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VerdantFaq } from './verdant-faq';
import { VerdantFeatured } from './verdant-featured';
import { VerdantHero } from './verdant-hero';
import { VerdantMarquee } from './verdant-marquee';
import { VerdantWhy } from './verdant-why';

/**
 * VERDANT - the home page.
 *
 * A composer and nothing else: it decides the order of the page, and each
 * section owns its own layout. Keeping the four pages as four composers is what
 * makes the multipage switch in `verdant-template.tsx` a five-line function.
 */
export function VerdantHomePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VerdantHero content={content} />
      <VerdantMarquee content={content} />
      <VerdantFeatured />
      <VerdantWhy content={content} />
      <VerdantFaq content={content} />
    </>
  );
}
