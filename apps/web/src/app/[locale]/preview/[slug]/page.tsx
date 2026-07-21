import { notFound } from 'next/navigation';
import { PreviewStage } from '@/components/components/previews/preview-stage';
import { hasPreview } from '@/components/components/previews/registry';
import { COMPONENTS } from '@/data/components';
import { PLAYGROUND_SLOTS } from '@/data/playground';

/**
 * Categories the page builder stacks into a full page. Their previews are page
 * sections: they own their padding and span the full width, so the stage must
 * not inset them - a gutter around a navbar or a footer reads as a bug. Every
 * other category is a component shown on a padded, centred stage.
 */
const SECTION_CATEGORIES = new Set<string>(PLAYGROUND_SLOTS.map((slot) => slot.category));

/**
 * The document an iframe loads to show a live component.
 *
 * Sits OUTSIDE the (app) group on purpose: no sidebar, no topbar - just the
 * component on a bare stage. It still inherits the [locale] root layout, so it
 * gets <html>/<body>, globals.css and the theme provider, which is exactly what
 * an iframe document needs.
 *
 * It exists as a route rather than a <div> because Tailwind's responsive
 * breakpoints key off the VIEWPORT. A 375px-wide div on a desktop screen still
 * matches `md:`; a 375px-wide iframe genuinely does not. This is the only way
 * the device toggle tells the truth.
 */
export function generateStaticParams() {
  return COMPONENTS.filter((c) => hasPreview(c.slug)).map((c) => ({ slug: c.slug }));
}

export const metadata = {
  // A preview is a fragment of another page; it must never be indexed on its own.
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  if (!hasPreview(slug)) notFound();
  const category = COMPONENTS.find((c) => c.slug === slug)?.category;
  return <PreviewStage slug={slug} bleed={category !== undefined && SECTION_CATEGORIES.has(category)} />;
}
