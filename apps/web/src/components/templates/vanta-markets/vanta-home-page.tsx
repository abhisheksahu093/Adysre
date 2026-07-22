'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VantaAllocation } from './vanta-allocation';
import { VantaCandles } from './vanta-candles';
import { VantaFaq } from './vanta-faq';
import { VantaHero } from './vanta-hero';
import { VantaMarquee } from './vanta-marquee';
import { VantaServices } from './vanta-services';
import { VantaWhy } from './vanta-why';

/**
 * VANTA - the home page.
 *
 * A composer and nothing else: it decides the order of the page, and each
 * section owns its own layout. Keeping the five pages as five composers is what
 * makes the multipage switch in `vanta-template.tsx` a five-line function.
 *
 * The order alternates the two signature drawings (area chart, then candles,
 * then donut) with plain type, so the page never shows two charts in a row.
 */
export function VantaHomePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VantaHero content={content} />
      <VantaMarquee content={content} />
      <VantaServices content={content} />
      <VantaCandles />
      <VantaWhy content={content} />
      <VantaAllocation />
      <VantaFaq content={content} />
    </>
  );
}
