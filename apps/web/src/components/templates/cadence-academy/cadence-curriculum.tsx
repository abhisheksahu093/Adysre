'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  CADENCE_CURRICULUM,
  CADENCE_COURSE_PAGE,
} from '@/data/templates/cadence-academy-content';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the curriculum accordion.
 *
 * A syllabus is a list of promises about time, so the module number, the
 * duration and the lesson count stay visible whether the module is open or
 * shut: a visitor comparing courses should not have to expand six panels to
 * add up the hours.
 *
 * Each row is a real `<button>` with `aria-expanded` and an `aria-controls`
 * panel, and the panel animates with `grid-template-rows: 0fr -> 1fr` so no
 * height has to be measured.
 */
export function CadenceCurriculum() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="curriculum" className="scroll-mt-24 px-3 sm:px-4">
      <div className="cad-panel mx-auto max-w-5xl px-6 py-20 sm:px-12 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="cad-eyebrow">{CADENCE_COURSE_PAGE.curriculumEyebrow}</p>
          <span className="cad-underline mt-4" aria-hidden />
          <h2 className="cad-display-sm mt-7 text-balance">
            {CADENCE_COURSE_PAGE.curriculumTitle}
          </h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
            {CADENCE_COURSE_PAGE.curriculumSubtitle}
          </p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {CADENCE_CURRICULUM.map((module, index) => {
            const open = openIndex === index;
            const panelId = `cadence-module-panel-${module.number}`;
            return (
              <div
                key={module.number}
                className="rounded-[var(--cad-radius)] bg-[var(--cad-cream)] px-6 sm:px-8"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center gap-5 py-6 text-left sm:gap-7"
                  >
                    <span
                      className={`cad-figures grid h-12 w-12 shrink-0 place-items-center rounded-[var(--cad-radius-pill)] text-base font-bold transition-colors duration-300 ${
                        open
                          ? 'bg-[var(--cad-violet)] text-[var(--cad-on-ink)]'
                          : 'bg-[var(--cad-cream-warm)] text-[var(--cad-ink)]'
                      }`}
                      aria-hidden
                    >
                      {module.number}
                    </span>

                    <span className="flex-1">
                      <span className="block text-lg font-bold tracking-[-0.01em]">
                        {module.title}
                      </span>
                      <span className="cad-figures mt-1 block text-sm text-[var(--cad-ink-faint)]">
                        {module.duration} · {module.lessons} {CADENCE_COURSE_PAGE.lessonsSuffix}
                      </span>
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[var(--cad-ink-faint)] transition-transform duration-300 ${
                        open ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  className={`grid transition-all duration-300 ease-out ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-7 sm:pl-[4.25rem]">
                      <p className="text-[16px] leading-[1.75] text-[var(--cad-ink-soft)]">
                        {module.body}
                      </p>

                      <p className="cad-eyebrow mt-6">{CADENCE_COURSE_PAGE.outputsLabel}</p>
                      <ul className="mt-3 flex flex-wrap gap-2.5">
                        {module.outputs.map((output) => (
                          <li
                            key={output}
                            className="rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime-soft)] px-5 py-2 text-sm font-semibold text-[var(--cad-lime-ink)]"
                          >
                            {output}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
