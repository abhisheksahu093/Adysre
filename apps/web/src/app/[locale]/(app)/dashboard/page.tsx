import { redirect } from '@/i18n/navigation';
import { APP_HOME } from '@/config/navigation';

/**
 * Dashboard is hidden for now. The route is kept as a redirect so existing
 * links to `/dashboard` - bookmarks, the OAuth callback, older references -
 * still resolve, landing on the current app home instead of a 404. To restore
 * the real dashboard, replace this with the page and re-add its NAV_ITEMS entry.
 */
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: APP_HOME, locale });
}
