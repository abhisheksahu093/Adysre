import { getTranslations } from 'next-intl/server';
import { ArrowRight, Files, Sparkles } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { LANDING_LINKS } from '@/data/landing';
import { LANDING_TEMPLATES, TEMPLATE_COUNT } from '@/data/landing-templates';
import { TemplateThumbnail } from '@/components/templates/template-thumbnail';
import { SectionHeading } from './section-heading';

/**
 * Templates showcase — real, shipped templates, not a "coming soon" card.
 *
 * Each tile is a live iframe of the template's own preview route, so this
 * section cannot advertise a layout that no longer exists. Only a handful are
 * shown; the count in the heading and the CTA come from the registry, so
 * shipping a template updates this section with no edit here.
 *
 * Server Component. `LANDING_TEMPLATES` is a deliberately reduced projection —
 * no prompts, no download formats — because everything a Server Component hands
 * to a client one is readable in the RSC payload, and previewing is the only
 * part of a template that is open to everyone.
 */
export async function TemplatesTeaser() {
  const t = await getTranslations('landing');
  // Theme names, the New badge and the page count already exist in the
  // `templates` namespace. Reuse them rather than translating them twice.
  const tt = await getTranslations('templates');

  return (
    <section className="relative border-y border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow={t('templates.badge')}
          title={t('templates.title')}
          subtitle={t('templates.subtitle', { count: TEMPLATE_COUNT })}
          className="max-w-3xl"
        />

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_TEMPLATES.map((template) => (
            <li key={template.slug}>
              <Link
                href={LANDING_LINKS.templates}
                className={cn(
                  'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
                  'transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                <div className="relative h-56 w-full overflow-hidden border-b border-border bg-muted/40">
                  <TemplateThumbnail slug={template.slug} name={template.name} scale="lg" />

                  {/* Fade the cut-off bottom of the frame into the card. */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card via-card/60 to-transparent"
                  />

                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {template.isNew && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                        <Sparkles className="h-2.5 w-2.5" aria-hidden />
                        {tt('filters.tabs.new')}
                      </span>
                    )}
                    {template.pageCount > 1 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/90 px-2 py-0.5 text-[11px] text-muted-foreground backdrop-blur">
                        <Files className="h-2.5 w-2.5" aria-hidden />
                        {tt('pagesCount', { count: template.pageCount })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 items-start justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold tracking-tight">{template.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {tt(`themes.${template.themeKey}`)}
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href={LANDING_LINKS.templates}
            className={cn(buttonVariants({ size: 'lg' }), 'gap-1.5')}
          >
            {t('templates.cta', { count: TEMPLATE_COUNT })}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="text-xs text-muted-foreground">{t('templates.note')}</p>
        </div>
      </div>
    </section>
  );
}
