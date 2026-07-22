'use client';

import type { TemplateContent } from '@/data/templates/types';
import { CadenceAbout } from './cadence-about';
import { CadenceFaq } from './cadence-faq';
import { CadenceFeatured } from './cadence-featured';
import { CadenceHero } from './cadence-hero';
import { CadenceHow } from './cadence-how';
import { CadenceMarquee } from './cadence-marquee';
import { CadenceProof } from './cadence-proof';

/**
 * CADENCE - the home page.
 *
 * A composer and nothing else: it decides the order of the page, and each
 * section owns its own layout. Keeping the five pages as five composers is what
 * makes the multipage switch in `cadence-template.tsx` a five-line function.
 *
 * The order is an argument: what this is, what it costs you in time, why the
 * format works, then the courses you could actually start.
 */
export function CadenceHomePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <CadenceHero content={content} />
      <CadenceMarquee content={content} />
      <CadenceAbout content={content} />
      <CadenceHow content={content} />
      <CadenceProof content={content} />
      <CadenceFeatured />
      <CadenceFaq content={content} />
    </>
  );
}
