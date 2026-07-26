import { getQrStore } from '@/lib/tools/qr/store/store';
import { isSlug } from '@/lib/tools/qr/dynamic/slug';
import { captureScan } from '@/lib/tools/qr/dynamic/scan-capture';

/**
 * GET /q/[slug] - the public dynamic-QR endpoint.
 *
 * This is the URL a tracked QR encodes. It resolves the slug, records the scan
 * (device/OS/browser/referrer/region/UTM, all derived offline from headers -
 * no external geo-IP), then 302s to the real target. Deliberately unauthenticated:
 * anyone with a phone can scan. Excluded from the i18n middleware so it is not
 * locale-rewritten (see middleware matcher). Scan recording is best-effort - a
 * storage hiccup must never stop the redirect.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSlug(slug)) return new Response('Not found', { status: 404 });

  const store = getQrStore();
  const code = await store.findBySlug(slug);
  if (!code || !code.targetUrl) return new Response('Not found', { status: 404 });

  try {
    const context = captureScan(new URL(request.url), request.headers);
    await store.recordScan(code.id, code.tenantId, context);
  } catch {
    // Never let analytics break the redirect the scanner is waiting on.
  }

  return Response.redirect(code.targetUrl, 302);
}
