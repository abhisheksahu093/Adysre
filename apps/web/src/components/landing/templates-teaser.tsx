import { getTranslations } from 'next-intl/server';
import { ArrowRight, Files, Sparkles } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { LANDING_LINKS } from '@/data/landing';
import { CTA_ARROW, ctaClass } from './cta';
import { LANDING_TEMPLATES, TEMPLATE_COUNT } from '@/data/landing-templates';
import { TemplateThumbnail } from '@/components/templates/template-thumbnail';
import { WorkbenchSection } from './workbench/section';
import { Hud } from './workbench/panel';

/**
 * Templates - real, shipped ones, not a "coming soon" card.
 *
 * Each tile is a live iframe of the template's own preview route, so this
 * section cannot advertise a layout that no longer exists. Only a handful are
 * shown; the count in the heading and the call to action come from the
 * registry, so shipping a template updates this section with no edit here.
 *
 * Server Component. `LANDING_TEMPLATES` is a deliberately reduced projection -
 * no prompts, no download formats - because everything a Server Component hands
 * to a client one is readable in the RSC payload, and previewing is the only
 * part of a template that is open to everyone.
 */
export async function TemplatesTeaser() {
  const t = await getTranslations('landing');
  // Theme names, the New badge and the page count already exist in the
  // `templates` namespace. Reuse them rather than translating them twice.
  const tt = await getTranslations('templates');

  return (
    <WorkbenchSection
      label={t('templates.badge')}
      title={t('templates.title')}
      description={t('templates.subtitle', { count: TEMPLATE_COUNT })}
      actions={
        <>
          <Link
            href={LANDING_LINKS.templates}
            className={ctaClass({ size: 'sm', className: 'gap-1.5' })}
          >
            {t('templates.cta', { count: TEMPLATE_COUNT })}
            <ArrowRight className={cn('h-4 w-4', CTA_ARROW)} aria-hidden />
          </Link>
          <Hud>{t('templates.note')}</Hud>
        </>
      }
    >
      <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {LANDING_TEMPLATES.map((template) => (
          <li key={template.slug} className="bg-panel">
            <Link
              href={LANDING_LINKS.templates}
              className={cn(
                'group flex h-full flex-col transition-colors hover:bg-panel-raised',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              )}
            >
              <div className="relative h-56 w-full overflow-hidden border-b border-line bg-panel-raised">
                <TemplateThumbnail slug={template.slug} name={template.name} scale="lg" />

                {/* Fade the cut-off bottom of the frame into the panel. */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-panel to-transparent"
                />

                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {template.isNew && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-signal px-1.5 py-0.5 font-hud text-[10px] uppercase tracking-[0.08em] text-signal-foreground">
                      <Sparkles className="h-2.5 w-2.5" aria-hidden />
                      {tt('filters.tabs.new')}
                    </span>
                  )}
                  {template.pageCount > 1 && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-line bg-panel/90 px-1.5 py-0.5 font-hud text-[10px] uppercase tracking-[0.08em] text-muted-foreground backdrop-blur">
                      <Files className="h-2.5 w-2.5" aria-hidden />
                      {tt('pagesCount', { count: template.pageCount })}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold tracking-tight">{template.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {tt(`themes.${template.themeKey}`)}
                  </p>
                </div>
                <ArrowRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-signal"
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </WorkbenchSection>
  );
}
