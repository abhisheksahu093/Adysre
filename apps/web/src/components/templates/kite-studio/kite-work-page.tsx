'use client';

import type { TemplateContent } from '@/data/templates/types';
import { KITE_WORK_PAGE } from '@/data/templates/kite-studio-content';
import { KiteMarquee } from './kite-marquee';
import { KiteMasthead } from './kite-masthead';
import { KiteWorkGrid } from './kite-work-grid';

/**
 * KITE - the work page. Masthead, the filterable book, then the capability strip
 * as a reminder of what the studio is actually being hired for.
 */
export function KiteWorkPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <KiteMasthead
        eyebrow={KITE_WORK_PAGE.eyebrow}
        title={KITE_WORK_PAGE.title}
        outline={KITE_WORK_PAGE.titleOutline}
        subtitle={KITE_WORK_PAGE.subtitle}
      />
      <KiteWorkGrid />
      <KiteMarquee content={content} />
    </>
  );
}
