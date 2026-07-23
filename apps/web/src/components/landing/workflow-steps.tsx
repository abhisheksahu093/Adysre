import { getTranslations } from 'next-intl/server';
import { cn } from 'adysre';
import { WORKFLOW_STEPS } from '@/data/landing';
import { SectionHeading } from './section-heading';

/**
 * Three-step "how teams use it" strip. Server Component. On wide viewports the
 * cards sit in a row over a faint connector line; on narrow ones they stack.
 */
export async function WorkflowSteps() {
  const t = await getTranslations('landing');

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading title={t('workflow.title')} subtitle={t('workflow.subtitle')} />

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line behind the row, desktop only. */}
          <div
            className="absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
            aria-hidden
          />
          {WORKFLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex flex-col items-center text-center">
                <div
                  className={cn(
                    'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-primary',
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {t(`workflow.steps.${step.id}.title`)}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {t(`workflow.steps.${step.id}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
