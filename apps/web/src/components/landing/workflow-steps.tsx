import { getTranslations } from 'next-intl/server';
import { WORKFLOW_STEPS } from '@/data/landing';
import { WorkbenchSection } from './workbench/section';
import { Hud } from './workbench/panel';

/**
 * How teams use it, as a pipeline.
 *
 * The steps keep their numbering because this is one of the few things on the
 * page that genuinely is a sequence: you pick, then you make it yours, then you
 * ship it. The numbers are structure, not decoration.
 *
 * Server Component. On wide viewports the three sit in a ruled row; on narrow
 * ones they stack, and the rules become the dividers between them.
 */
export async function WorkflowSteps() {
  const t = await getTranslations('landing');

  return (
    <WorkbenchSection
      label={t('workbench.panels.pipeline')}
      title={t('workflow.title')}
      description={t('workflow.subtitle')}
    >
      <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
        {WORKFLOW_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <li key={step.id} className="bg-panel p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                <Hud strong>{String(i + 1).padStart(2, '0')}</Hud>
              </div>
              <h3 className="mt-4 text-[17px] font-semibold tracking-tight">
                {t(`workflow.steps.${step.id}.title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t(`workflow.steps.${step.id}.desc`)}
              </p>
            </li>
          );
        })}
      </ol>
    </WorkbenchSection>
  );
}
