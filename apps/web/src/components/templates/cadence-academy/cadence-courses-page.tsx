'use client';

import type { TemplateContent } from '@/data/templates/types';
import { CadenceCatalogue } from './cadence-catalogue';
import { CadenceMarquee } from './cadence-marquee';

/**
 * CADENCE - the catalogue page. The grid carries the page's `<h1>`, and the
 * topic strip closes it as a reminder of what the nine courses actually cover.
 */
export function CadenceCoursesPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <CadenceCatalogue />
      <CadenceMarquee content={content} />
    </>
  );
}
