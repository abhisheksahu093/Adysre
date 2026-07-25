import { redirect } from '@/i18n/navigation';

/**
 * Gradients now live as a tab of the Colours & Surfaces page. This redirect keeps
 * old links (and any `?tag=` deep links) working by forwarding to that tab.
 */
export default async function GradientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;
  const tagValue = Array.isArray(tag) ? tag[0] : tag;
  redirect({
    locale,
    href: { pathname: '/colors-surfaces', query: { tab: 'gradients', ...(tagValue ? { tag: tagValue } : {}) } },
  });
}
