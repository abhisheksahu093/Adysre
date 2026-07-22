'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VerdantContact } from './verdant-contact';
import { VerdantFaq } from './verdant-faq';

/**
 * VERDANT - the contact page. The FAQ repeats here on purpose: half of what a
 * visitor would write into the form (fee, timing, area covered) is answered in
 * it, and answering before the message is sent is better service than after.
 */
export function VerdantContactPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VerdantContact content={content} />
      <VerdantFaq content={content} />
    </>
  );
}
