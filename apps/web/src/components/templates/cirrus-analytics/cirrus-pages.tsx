'use client';

import { CIRRUS_MASTHEADS } from '@/data/templates/cirrus-analytics-content';
import {
  CirrusAbout,
  CirrusContact,
  CirrusFaq,
  CirrusHero,
  CirrusMarquee,
  CirrusMasthead,
  CirrusMetrics,
  CirrusPricing,
  CirrusProduct,
  CirrusSecurity,
} from './cirrus-sections';

/**
 * CIRRUS - what each page is made of.
 *
 * Composition only: no page holds markup of its own. The dark security band
 * appears on every page except pricing, because trust is the objection this
 * product actually has to answer and burying it on one page nobody visits is
 * how it goes unanswered.
 */

export function CirrusHomePage() {
  return (
    <>
      <CirrusHero />
      <CirrusMarquee />
      <CirrusMetrics />
      <CirrusAbout />
      <CirrusProduct />
      <CirrusSecurity />
      <CirrusFaq />
      <CirrusContact />
    </>
  );
}

export function CirrusProductPage() {
  return (
    <>
      <CirrusMasthead masthead={CIRRUS_MASTHEADS.product} />
      <CirrusMetrics />
      <CirrusProduct />
      <CirrusAbout />
      <CirrusSecurity />
      <CirrusContact />
    </>
  );
}

export function CirrusSecurityPage() {
  return (
    <>
      <CirrusMasthead masthead={CIRRUS_MASTHEADS.security} />
      <CirrusSecurity />
      <CirrusFaq />
      <CirrusContact />
    </>
  );
}

export function CirrusPricingPage() {
  return (
    <>
      <CirrusMasthead masthead={CIRRUS_MASTHEADS.pricing} />
      <CirrusPricing />
      <CirrusFaq />
      <CirrusContact />
    </>
  );
}

export function CirrusContactPage() {
  return (
    <>
      <CirrusMasthead masthead={CIRRUS_MASTHEADS.contact} />
      <CirrusContact />
      <CirrusSecurity />
    </>
  );
}
