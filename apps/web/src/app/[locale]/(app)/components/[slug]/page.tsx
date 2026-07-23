import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Github, ChevronRight } from 'lucide-react';
import { Badge } from 'adysre';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import {
  COMPONENTS,
  FRAMEWORKS,
  availableFrameworks,
  getComponent,
  getComponents,
  relatedComponents,
} from '@/data/components';
import { highlight } from '@/lib/highlight';
import { humanizeKey } from '@/lib/humanize';
import { CodeViewer, type CodeTab } from '@/components/components/code-viewer';
import { ComponentPreview } from '@/components/components/component-preview';
import { PREVIEWS, hasPreview } from '@/components/components/previews/registry';
import { ComponentCard } from '@/components/components/component-card';
import { InstallBlock } from '@/components/components/install-block';
import { PropsTable } from '@/components/components/props-table';
import { CategorySidebar } from '@/components/components/category-sidebar';

/** Pre-render every component in every locale rather than on first request. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COMPONENTS.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const component = await getComponent(locale, slug);
  if (!component) return {};

  const path = locale === 'en' ? `/components/${slug}` : `/${locale}/components/${slug}`;
  const title = component.seoTitle ?? component.title;
  const description = component.seoDescription ?? component.description;

  return {
    title,
    description,
    keywords: component.keywords,
    alternates: {
      canonical: path,
      // Tells search engines these are the same page in other languages.
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, l === 'en' ? `/components/${slug}` : `/${l}/components/${slug}`]),
      ),
    },
    openGraph: { title, description, type: 'article', locale },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3 scroll-mt-20">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, component, all] = await Promise.all([
    getTranslations({ locale, namespace: 'components' }),
    getComponent(locale, slug),
    getComponents(locale),
  ]);

  // An unknown slug is a 404, not a blank page.
  if (!component) notFound();

  const frameworks = availableFrameworks(component);

  // Highlight every tab on the server, in parallel - the browser gets HTML.
  const tabs: CodeTab[] = await Promise.all(
    frameworks.map(async (id) => {
      const meta = FRAMEWORKS.find((f) => f.id === id)!;
      const code = component.code[id]!;
      return { framework: id, label: meta.label, code, ext: meta.ext, html: await highlight(code, meta.lang) };
    }),
  );

  const siblings = all
    .filter((c) => c.category === component.category)
    .sort((a, b) => a.title.localeCompare(b.title));

  const related = relatedComponents(all, component);

  // Height hint from the registry; the iframe reports its true height on load.
  const previewHeight = hasPreview(component.slug)
    ? ((await PREVIEWS[component.slug]!()).minHeight ?? 192)
    : 192;

  /** Structured data - SoftwareSourceCode is the accurate type for a snippet. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: component.title,
    description: component.description,
    codeSampleType: 'full solution',
    programmingLanguage: frameworks.map((f) => FRAMEWORKS.find((x) => x.id === f)?.label),
    license: `https://spdx.org/licenses/${component.license}.html`,
    author: { '@type': 'Organization', name: component.author },
    dateCreated: component.createdAt,
    dateModified: component.updatedAt,
    version: component.version,
    isAccessibleForFree: true,
  };

  return (
    <div className="mx-auto flex max-w-6xl gap-10">
      <CategorySidebar
        siblings={siblings}
        currentSlug={component.slug}
        category={component.category}
      />

      {/* min-w-0 or the code block's overflow-x-auto can't shrink below its
          content and blows the flex row out. */}
      <div className="min-w-0 flex-1 space-y-10">
      {/* Server-rendered so crawlers see it without executing JS. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label={t('breadcrumb')} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/components" className="hover:text-foreground">
          {t('title')}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <Link href="/components" className="hover:text-foreground">
          {t(`categories.${component.category}`)}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="text-foreground">{component.title}</span>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{t(`categories.${component.category}`)}</Badge>
          <Badge variant="default">{t(`difficulty.${component.difficulty}`)}</Badge>
          <Badge variant="success">{component.license}</Badge>
          {component.untranslated && <Badge variant="warning">{t('englishOriginal')}</Badge>}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{component.title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{component.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {component.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>

        {component.github && (
          <a
            href={component.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            {t('viewOnGithub')}
          </a>
        )}
      </header>

      {hasPreview(component.slug) && (
        <Section id="preview" title={t('preview.title')}>
          <ComponentPreview slug={component.slug} minHeight={previewHeight} />
        </Section>
      )}

      <Section id="code" title={t('code')}>
        <CodeViewer tabs={tabs} slug={component.slug} />
      </Section>

      {component.dependencies && component.dependencies.length > 0 && (
        <Section id="installation" title={t('installation')}>
          <InstallBlock dependencies={component.dependencies} />
        </Section>
      )}

      {component.props && component.props.length > 0 && (
        <Section id="props" title={t('props')}>
          <PropsTable props={component.props} />
        </Section>
      )}

      {component.variants && component.variants.length > 0 && (
        <Section id="variants" title={t('variants')}>
          <div className="flex flex-wrap gap-2">
            {component.variants.map((v) => (
              <Badge key={v.id} variant="outline" size="md">
                {t.has(`variantLabels.${v.labelKey}`)
                  ? t(`variantLabels.${v.labelKey}`)
                  : humanizeKey(v.labelKey)}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {component.customization && (
        <Section id="customization" title={t('customization')}>
          <p className="text-sm leading-relaxed text-muted-foreground">{component.customization}</p>
        </Section>
      )}

      <Section id="meta" title={t('details')}>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['author', component.author],
            ['version', component.version],
            ['created', component.createdAt],
            ['updated', component.updatedAt],
          ].map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t(`meta.${key}`)}
              </dt>
              <dd className="mt-1 text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {related.length > 0 && (
        <Section id="related" title={t('related')}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <ComponentCard key={c.slug} component={c} />
            ))}
          </div>
        </Section>
      )}
      </div>
    </div>
  );
}
