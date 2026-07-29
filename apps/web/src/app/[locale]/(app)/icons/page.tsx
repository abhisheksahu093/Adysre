import { redirect } from '@/i18n/navigation';

/**
 * Icons now live as a tab of the Colours & Surfaces page. This redirect keeps
 * old links (and any `?category=` deep links) working by forwarding to that tab.
 *
 * Same treatment the four colour families already got: one canonical URL for the
 * view, and every inbound link in the app, the docs, the footer and the
 * announcement list keeps working without being re-pointed.
 */
export default async function IconsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const categoryValue = Array.isArray(category) ? category[0] : category;
  redirect({
    locale,
    href: {
      pathname: '/colors-surfaces',
      query: { tab: 'icons', ...(categoryValue ? { category: categoryValue } : {}) },
    },
  });
}
