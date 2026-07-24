import { getScanStore } from '@/lib/website-intel/history/store';
import { buildReport, isReportFormat } from '@/lib/website-intel/report/build';
import { authorize } from '@/lib/website-intel/auth/guard';

/**
 * GET /api/website-intelligence/scans/[id]/report?format=json|csv|markdown
 *
 * Export a stored scan as a downloadable file. Validates the format, looks the
 * record up, and streams the built report with a `Content-Disposition` so the
 * browser saves it. Errors use the standard JSON envelope; a success is the raw
 * file, not an envelope, because the caller wants the document.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(status: number, code: string, message: string) {
  return Response.json({ success: false, code, message }, { status });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize('read');
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const format = new URL(request.url).searchParams.get('format') ?? 'json';

  if (!isReportFormat(format)) {
    return fail(400, 'bad_format', 'Supported formats are json, csv and markdown.');
  }

  const record = await getScanStore().get(auth.session.tenantId, id);
  if (!record) {
    return fail(404, 'not_found', 'That scan was not found.');
  }

  const report = buildReport(record, format);
  return new Response(report.body, {
    status: 200,
    headers: {
      'content-type': report.contentType,
      'content-disposition': `attachment; filename="${report.filename}"`,
      'cache-control': 'no-store',
    },
  });
}
