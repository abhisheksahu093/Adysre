'use client';

import type { TemplateContent } from '@/data/templates/types';
import { LumiereAbout } from './lumiere-about';
import { LumiereDisciplines } from './lumiere-disciplines';
import { LumiereFaq } from './lumiere-faq';
import { LumiereFeatured } from './lumiere-featured';
import { LumiereHero } from './lumiere-hero';
import { LumiereMarquee } from './lumiere-marquee';
import { LumiereTeam } from './lumiere-team';
import { LumiereWhy } from './lumiere-why';

/**
 * LUMIERE - the home page.
 *
 * The one page carrying the shared section set every template in the gallery has
 * (hero, about, services, why, faq), with the testimonial strip, the featured
 * formulas and the team dropped between them. The alternating blush bands come
 * from the sections themselves, so the order below is the only thing this file
 * decides.
 *
 * The contact section is not here: it is a page of its own, with opening hours
 * and travel notes a home page has no room for.
 */
export function LumiereHomePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <LumiereHero content={content} />
      <LumiereMarquee />
      <LumiereFeatured />
      <LumiereAbout content={content} />
      <LumiereDisciplines content={content} />
      <LumiereWhy content={content} />
      <LumiereTeam />
      <LumiereFaq content={content} />
    </>
  );
}
