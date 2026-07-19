import type { Metadata } from 'next';
import { BookOpen, Blocks, Shapes, Palette, Blend, Code2, ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.gettingStarted' });
  return { title: t('title'), description: t('description') };
}

/** Resource shortcuts: hrefs/icons in code, labels from i18n. */
const RESOURCES = [
  { key: 'components', icon: Blocks, href: '/components' },
  { key: 'icons', icon: Shapes, href: '/icons' },
  { key: 'palettes', icon: Palette, href: '/palettes' },
  { key: 'gradients', icon: Blend, href: '/gradients' },
] as const;

interface Step {
  title: string;
  body: string;
}

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.gettingStarted' });
  const steps = (t.raw('steps') as Step[] | undefined) ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            aria-hidden
          >
            <BookOpen className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{t('description')}</p>
      </header>

      {/* Steps */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight">{t('stepsTitle')}</h2>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="min-w-0 space-y-1">
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Explore the library */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight">{t('exploreTitle')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RESOURCES.map(({ key, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className="group/res flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover/res:bg-primary/10 group-hover/res:text-primary"
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {t(`resources.${key}.title`)}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {t(`resources.${key}.body`)}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover/res:translate-x-0.5"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Next: API */}
      <Link
        href="/docs/api"
        className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
      >
        <span className="flex items-center gap-3">
          <Code2 className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span className="text-sm font-medium text-foreground">{t('apiCta')}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      </Link>
    </div>
  );
}
