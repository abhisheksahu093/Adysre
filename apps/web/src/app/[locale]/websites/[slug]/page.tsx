import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TEMPLATE_RENDERERS, hasTemplateRenderer } from '@/components/templates/registry';
import { TEMPLATES, getTemplate } from '@/data/templates';

/**
 * Standalone, full-page showcase of a site at `/websites/<slug>`.
 *
 * Renders the same self-contained site component the template system uses (one
 * implementation, two front doors: this friendly URL and the template gallery /
 * preview / download). It sits OUTSIDE the `(app)` group, so there is no sidebar
 * or topbar - the site is judged edge to edge. Multipage sites navigate by
 * `?page=`, resolved here and passed as a prop, so links work with no router.
 *
 * Unlike the internal preview route, these are indexed: they are ADYSRE's own
 * showcase pieces, meant to be found.
 */
export function generateStaticParams() {
  return TEMPLATES.filter((template) => hasTemplateRenderer(template.slug)).map((template) => ({
    slug: template.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};
  return {
    title: `${template.name} - a website by ADYSRE`,
    description: `${template.name}: a premium, animated ${template.themeKey} website, designed and built with ADYSRE.`,
  };
}

export default async function WebsiteShowcasePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template || !hasTemplateRenderer(slug)) notFound();

  const Template = TEMPLATE_RENDERERS[slug];
  if (!Template) notFound();

  const { page } = await searchParams;
  const pages = template.pages ?? [];
  const known = pages.some((entry) => entry.id === page);
  const resolved = known ? page : pages[0]?.id;

  return <Template {...(resolved !== undefined && { page: resolved })} />;
}
