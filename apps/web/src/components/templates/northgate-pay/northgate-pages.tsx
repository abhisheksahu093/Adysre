'use client';

import type { TemplateContent } from '@/data/templates/types';
import {
  NORTHGATE_PAGE_HEADS,
  NORTHGATE_SNIPPETS,
} from '@/data/templates/northgate-pay-content';
import { NorthgateAbout } from './northgate-about';
import { NorthgateCalculator } from './northgate-calculator';
import { NorthgateCompliance } from './northgate-compliance';
import { NorthgateConsole } from './northgate-console';
import { NorthgateContact } from './northgate-contact';
import { NorthgateCta } from './northgate-cta';
import { NorthgateEndpoints } from './northgate-endpoints';
import { NorthgateFaq } from './northgate-faq';
import { NorthgateFlow } from './northgate-flow';
import { NorthgateHero } from './northgate-hero';
import { NorthgateLibraries } from './northgate-libraries';
import { NorthgateMarquee } from './northgate-marquee';
import { NorthgateOffices } from './northgate-offices';
import { NorthgatePageHead } from './northgate-page-head';
import { NorthgatePlatform } from './northgate-platform';
import { NorthgatePricing } from './northgate-pricing';
import { NorthgateProductList } from './northgate-product-list';
import { NorthgateSettlement } from './northgate-settlement';
import { NorthgateTerminal } from './northgate-terminal';
import { NorthgateWhy } from './northgate-why';

/**
 * NORTHGATE - the five page compositions.
 *
 * Kept together in one module because a page here is nothing but an ordering of
 * sections: splitting five short lists across five files would hide the one
 * thing worth seeing, which is how the pages differ from each other.
 *
 * Every page alternates paper and deep bands, and every page except contact
 * closes on the same call to action - so a visitor who stops reading anywhere
 * finds the same two next steps in the same place.
 *
 * Home stands alone: hero, merchants, platform, flow diagram, console, terminal
 * and FAQ, so the template still reads as a complete site if a visitor never
 * leaves it. The other four open on the shared masthead and go deeper.
 */

export function NorthgateHomePage({ content }: { content: TemplateContent }) {
  // Home shows one snippet only. The developers page carries the pair, where a
  // tablist is worth the interaction cost.
  const first = NORTHGATE_SNIPPETS.slice(0, 1);

  return (
    <>
      <NorthgateHero content={content} />
      <NorthgateMarquee content={content} />
      <NorthgatePlatform content={content} />
      <NorthgateFlow />
      <NorthgateConsole snippets={first} />
      <NorthgateTerminal />
      <NorthgateWhy content={content} />
      <NorthgateAbout content={content} />
      <NorthgateFaq content={content} />
      <NorthgateCta />
    </>
  );
}

export function NorthgateProductsPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <NorthgatePageHead head={NORTHGATE_PAGE_HEADS.products} />
      <NorthgateProductList />
      <NorthgateSettlement />
      <NorthgateMarquee content={content} />
      <NorthgateCta />
    </>
  );
}

export function NorthgateDevelopersPage() {
  return (
    <>
      <NorthgatePageHead head={NORTHGATE_PAGE_HEADS.developers} />
      <NorthgateEndpoints />
      <NorthgateConsole snippets={NORTHGATE_SNIPPETS} />
      <NorthgateLibraries />
      <NorthgateCta />
    </>
  );
}

export function NorthgatePricingPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <NorthgatePageHead head={NORTHGATE_PAGE_HEADS.pricing} />
      <NorthgatePricing />
      <NorthgateCalculator />
      <NorthgateFaq content={content} />
      <NorthgateCta />
    </>
  );
}

export function NorthgateContactPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <NorthgatePageHead head={NORTHGATE_PAGE_HEADS.contact} />
      <NorthgateOffices />
      <NorthgateContact content={content} />
      <NorthgateCompliance />
    </>
  );
}
