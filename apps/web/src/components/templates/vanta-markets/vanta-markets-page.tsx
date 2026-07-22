'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VantaBoard } from './vanta-board';
import { VantaMarquee } from './vanta-marquee';
import { VantaMasthead } from './vanta-masthead';
import { VantaOrderBook } from './vanta-orderbook';

/**
 * VANTA - the markets page: masthead, the filterable instrument board, then the
 * depth ladder as the "one level deeper" answer to the board above it.
 */
export function VantaMarketsPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VantaMasthead page="markets" />
      <VantaBoard />
      <VantaOrderBook />
      <VantaMarquee content={content} />
    </>
  );
}
