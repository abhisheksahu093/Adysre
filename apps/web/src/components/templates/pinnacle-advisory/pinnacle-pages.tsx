'use client';

import type { TemplateContent } from '@/data/templates/types';
import { PINNACLE_PAGE_HEADS } from '@/data/templates/pinnacle-advisory-content';
import { PinnacleAbout } from './pinnacle-about';
import { PinnacleCases } from './pinnacle-cases';
import { PinnacleContact } from './pinnacle-contact';
import { PinnacleCta } from './pinnacle-cta';
import { PinnacleFaq } from './pinnacle-faq';
import { PinnacleHero } from './pinnacle-hero';
import { PinnacleInsights } from './pinnacle-insights';
import { PinnacleMarquee } from './pinnacle-marquee';
import { PinnacleOffices } from './pinnacle-offices';
import { PinnaclePageHead } from './pinnacle-page-head';
import { PinnaclePracticeList } from './pinnacle-practice-list';
import { PinnacleProcess } from './pinnacle-process';
import { PinnacleResults } from './pinnacle-results';
import { PinnacleServices } from './pinnacle-services';
import { PinnacleTeam } from './pinnacle-team';
import { PinnacleWhy } from './pinnacle-why';

/**
 * PINNACLE - the five page compositions.
 *
 * Kept together in one module because a page here is nothing but an ordering of
 * sections: splitting five short lists across five files would hide the one
 * thing worth seeing, which is how the pages differ from each other.
 *
 * Home stands alone as a complete argument - hero, proof, firm, practices,
 * method, results, reasons, objections - so the template still reads as a whole
 * site if a visitor never leaves it. The other four open on the shared masthead
 * and each go deeper than home does on exactly one thing.
 *
 * Every page except home ends on the same CTA band, so no route dead-ends.
 */

export function PinnacleHomePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <PinnacleHero content={content} />
      <PinnacleMarquee content={content} />
      <PinnacleAbout content={content} />
      <PinnacleServices content={content} />
      <PinnacleProcess />
      {/* The one inverted band, placed two thirds down where the reader has
          earned it and the page needs a change of key. */}
      <PinnacleResults />
      <PinnacleWhy content={content} />
      <PinnacleFaq content={content} />
      <PinnacleCta />
    </>
  );
}

export function PinnacleExpertisePage({ content }: { content: TemplateContent }) {
  return (
    <>
      <PinnaclePageHead head={PINNACLE_PAGE_HEADS.expertise} />
      <PinnaclePracticeList />
      <PinnacleProcess />
      <PinnacleCases />
      <PinnacleMarquee content={content} />
      <PinnacleCta />
    </>
  );
}

export function PinnacleInsightsPage() {
  return (
    <>
      <PinnaclePageHead head={PINNACLE_PAGE_HEADS.insights} />
      <PinnacleInsights />
      {/* Results after the writing: the pieces argue a method, and this is the
          evidence that the method paid. */}
      <PinnacleResults />
      <PinnacleCta />
    </>
  );
}

export function PinnacleTeamPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <PinnaclePageHead head={PINNACLE_PAGE_HEADS.team} />
      <PinnacleTeam />
      <PinnacleAbout content={content} />
      <PinnacleWhy content={content} />
      <PinnacleCta />
    </>
  );
}

export function PinnacleContactPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <PinnaclePageHead head={PINNACLE_PAGE_HEADS.contact} />
      <PinnacleOffices />
      <PinnacleContact content={content} />
    </>
  );
}
