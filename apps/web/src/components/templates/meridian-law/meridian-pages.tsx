'use client';

import type { TemplateContent } from '@/data/templates/types';
import { MERIDIAN_PAGE_HEADS } from '@/data/templates/meridian-law-content';
import { MeridianAbout } from './meridian-about';
import { MeridianContact } from './meridian-contact';
import { MeridianFaq } from './meridian-faq';
import { MeridianHero } from './meridian-hero';
import { MeridianHistory } from './meridian-history';
import { MeridianMarquee } from './meridian-marquee';
import { MeridianOffices } from './meridian-offices';
import { MeridianPageHead } from './meridian-page-head';
import { MeridianPracticeList } from './meridian-practice-list';
import { MeridianServices } from './meridian-services';
import { MeridianTeam } from './meridian-team';
import { MeridianWhy } from './meridian-why';

/**
 * MERIDIAN - the four page compositions.
 *
 * Kept together in one module because a page here is nothing but an ordering of
 * sections: splitting four short lists across four files would hide the one
 * thing worth seeing, which is how the pages differ from each other.
 *
 * Home stands alone - hero, practices preview, commitments and FAQ - so the
 * template still reads as a complete site if a visitor never leaves it. The
 * other three open on the shared masthead and then go deeper than home does.
 */

export function MeridianHomePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <MeridianHero content={content} />
      <MeridianMarquee content={content} />
      <MeridianServices content={content} />
      <MeridianWhy content={content} />
      <MeridianFaq content={content} />
    </>
  );
}

export function MeridianFirmPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <MeridianPageHead head={MERIDIAN_PAGE_HEADS.about} />
      <MeridianAbout content={content} />
      <MeridianHistory />
      <MeridianTeam />
    </>
  );
}

export function MeridianPracticesPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <MeridianPageHead head={MERIDIAN_PAGE_HEADS.practices} />
      <MeridianPracticeList />
      <MeridianMarquee content={content} />
    </>
  );
}

export function MeridianContactPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <MeridianPageHead head={MERIDIAN_PAGE_HEADS.contact} />
      <MeridianOffices />
      <MeridianContact content={content} />
    </>
  );
}
