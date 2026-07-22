import { notFound } from 'next/navigation';
import { TEMPLATE_RENDERERS, hasTemplateRenderer } from '@/components/templates/registry';
import { TEMPLATES, getTemplate } from '@/data/templates';

/**
 * The full-page document for one template.
 *
 * Sits OUTSIDE the `(app)` group like `/preview/[slug]`: no sidebar, no topbar -
 * a template must be judged on its own, edge to edge. This is what the card's
 * "open in new tab" and the dialog's live preview both point at.
 *
 * Not indexed: the gallery page is the canonical entry, and a template is a
 * demo of someone else's brand.
 */
export function generateStaticParams() {
  return TEMPLATES.filter((template) => hasTemplateRenderer(template.slug)).map((template) => ({
    slug: template.slug,
  }));
}

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function TemplatePreviewPage({
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

  /*
   * Multipage templates navigate by `?page=`, not by route segments. A template
   * is a demo, and query navigation keeps its links working identically in the
   * preview, inside a card iframe, and in a downloaded project - no router
   * required. An unknown page falls back to the first rather than 404ing, so a
   * stale link shows the template instead of an error.
   */
  const { page } = await searchParams;
  const pages = template.pages ?? [];
  const known = pages.some((entry) => entry.id === page);
  const resolved = known ? page : pages[0]?.id;

  return <Template {...(resolved !== undefined && { page: resolved })} />;
}
