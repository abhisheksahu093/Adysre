'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VerdantListingsGrid } from './verdant-listings-grid';
import { VerdantMarquee } from './verdant-marquee';

/**
 * VERDANT - the listings page. The grid carries the page's `<h1>`, and the
 * neighbourhood strip closes it as a reminder of where the agency works.
 */
export function VerdantListingsPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VerdantListingsGrid />
      <VerdantMarquee content={content} />
    </>
  );
}
