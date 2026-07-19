import { getTranslations } from 'next-intl/server';
import type { LucideIcon } from 'lucide-react';

interface LegalSection {
  heading: string;
  body: string;
}

/**
 * Shared renderer for the legal pages (terms / privacy / DMCA). Content is data:
 * each page passes its `pages.<name>` namespace, and the sections come from
 * `t.raw('sections')`, so a page is defined entirely by its message catalogue -
 * translators and editors change copy without touching this component.
 */
export async function LegalDocument({
  namespace,
  icon: Icon,
}: {
  namespace: string;
  icon: LucideIcon;
}) {
  const t = await getTranslations(namespace);
  const sections = (t.raw('sections') as LegalSection[] | undefined) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
          {t('updated')}
        </span>
      </header>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <section key={i} className="space-y-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              <span className="mr-2 text-muted-foreground tabular-nums">{i + 1}.</span>
              {section.heading}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
