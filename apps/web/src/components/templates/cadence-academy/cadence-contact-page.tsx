'use client';

import type { TemplateContent } from '@/data/templates/types';
import { CadenceEnrol } from './cadence-enrol';
import { CadenceFaq } from './cadence-faq';
import { CadenceMarquee } from './cadence-marquee';

/**
 * CADENCE - the enrolment page. Form first, then the questions an advisor would
 * otherwise answer by email, then the topic strip so a visitor who is still
 * undecided has somewhere to go other than away.
 */
export function CadenceContactPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <CadenceEnrol content={content} />
      <CadenceFaq content={content} />
      <CadenceMarquee content={content} />
    </>
  );
}
