'use client';

import type { TemplateContent } from '@/data/templates/types';
import { LumiereAccordion } from './lumiere-accordion';
import { LumiereSectionHeading } from './lumiere-section-heading';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the questions the desk answers most.
 *
 * The shared accordion, mapped from `TemplateFaq` to the `{ title, body }` shape
 * it takes. That mapping happens here rather than in the accordion because the
 * accordion is also used by the product page, where the items are not questions.
 */
export function LumiereFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
      <LumiereSectionHeading eyebrow={faq.eyebrow} title={faq.title} align="center" />

      <Reveal delay={0.08} className="mt-14">
        <LumiereAccordion
          idPrefix="lumiere-faq"
          items={faq.items.map((item) => ({ title: item.question, body: item.answer }))}
        />
      </Reveal>
    </section>
  );
}
