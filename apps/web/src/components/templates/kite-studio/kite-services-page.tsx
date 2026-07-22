'use client';

import type { TemplateContent } from '@/data/templates/types';
import { KITE_SERVICES_PAGE } from '@/data/templates/kite-studio-content';
import { KiteFaq } from './kite-faq';
import { KiteMasthead } from './kite-masthead';
import { KitePackages } from './kite-packages';
import { KiteProcess } from './kite-process';
import { KiteServices } from './kite-services';

/**
 * KITE - the services page.
 *
 * Ordered as the question is actually asked: what do you do, what does it cost,
 * how does it run, and then the objections. The FAQ is shared with the home page
 * because the answers are the same answers, and maintaining two sets would mean
 * one of them going stale.
 */
export function KiteServicesPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <KiteMasthead
        eyebrow={KITE_SERVICES_PAGE.eyebrow}
        title={KITE_SERVICES_PAGE.title}
        outline={KITE_SERVICES_PAGE.titleOutline}
        subtitle={KITE_SERVICES_PAGE.subtitle}
      />
      <KiteServices content={content} />
      <KitePackages />
      <KiteProcess />
      <KiteFaq content={content} />
    </>
  );
}
